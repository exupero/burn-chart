(ns burn.projectors
  (:require-macros [burn.macros :refer [spy]])
  (:require [burn.geo :as geo]))

(defprotocol IProjection
  "A protocol for calculating fast and slow speeds given historical
   sprint data. Methods return a number of points per day."
  (-slowest [this data])
  (-fastest [this data]))

(defn slowest [p data]
  (-slowest p data))

(defn fastest [p data]
  (-fastest p data))

(defrecord Middle [low high]
  IProjection
  (-slowest [_ data]
    (->> data geo/points-per-day (sort >) (geo/drop-percent high) geo/average))
  (-fastest [_ data]
    (->> data geo/points-per-day (sort <) (geo/drop-percent low) geo/average)))

(defrecord Extremes []
  IProjection
  (-slowest [_ data]
    (->> data geo/points-per-day (filter pos?) (apply min)))
  (-fastest [_ data]
    (->> data geo/points-per-day (filter pos?) (apply max))))

(defrecord WeightedMostRecent [n weight]
  IProjection
  (-slowest [_ data]
    (let [past (geo/average (geo/points-per-day (butlast data)))
          prev (geo/average (geo/points-per-day (take-last (inc n) data)))]
      (+ (* (- 1 weight) past)
         (* weight prev))))
  (-fastest [this data]
    (-slowest this data)))

(defrecord HarmonicMean []
  IProjection
  (-slowest [_ data]
    (/ (geo/average (map #(/ %) (filter pos? (geo/points-per-day data))))))
  (-fastest [this data]
    (-slowest this data)))

(def projectors
  (sorted-map
    :average
    {:name "Average of All Sprints"
     :summary (fn [s [soon late]]
                [:div {}
                 "Based on our average sprint velocity and current scope of "
                 [:strong {} s " points"]
                 ", we will finish on "
                 [:strong {} (geo/fmt-date late)]
                 "."])
     :fn (Middle. 0 0)}

    :average-last-three
    {:name "Average of Last 3 Sprints"
     :summary (fn [s [soon late]]
                [:div {}
                 "Based on our average sprint velocity over the last 3 sprints and our current scope of "
                 [:strong {} s " points"]
                 ", we will finish on "
                 [:strong {} (geo/fmt-date late)]
                "."])
     :fn (WeightedMostRecent. 3 1)}

    :current
    {:name "Last Sprint's Velocity"
     :summary (fn [s [soon late]]
                [:div {}
                 "Based on our most recent sprint's velocity and our current scope of "
                 [:strong {} s " points"]
                 ", we will finish on "
                 [:strong {} (geo/fmt-date late)]])
     :fn (WeightedMostRecent. 1 1)}

    :extremes
    {:name "Most Extreme Sprint Velocities"
     :summary (fn [s [soon late]]
                [:div {}
                 "Based on our fastest and slowest sprint velocities and our current scope of "
                 [:strong {} s " points"]
                 ", we will finish between "
                 [:strong {} (geo/fmt-date soon)]
                 " and "
                 [:strong {} (geo/fmt-date late)]])
     :fn (Extremes.)}))
