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

(defrecord Current []
  IProjection
  (-slowest [_ data]
    (let [[[d1] [d2 p]] (drop (- (count data) 2) data)]
      (/ p (geo/days-between d1 d2))))
  (-fastest [this data]
    (-slowest this data)))

(defrecord Extremes []
  IProjection
  (-slowest [_ data]
    (->> data geo/points-per-day (apply min)))
  (-fastest [_ data]
    (->> data geo/points-per-day (apply max))))

(defrecord WeightedMostRecent [n weight]
  IProjection
  (-slowest [_ data]
    (let [past (geo/average (geo/points-per-day (butlast data)))
          prev (geo/average (geo/points-per-day (take-last (inc n) data)))]
      (+ (* (- 1 weight) past)
         (* weight prev))))
  (-fastest [this data]
    (-slowest this data)))

(def projectors
  (sorted-map
    :average
    {:name "Average"
     :desc "Project the average velocity of all sprints."
     :fn (Middle. 0 0)}

    :current
    {:name "Current"
     :desc "Project the most recent sprint's velocity."
     :fn (Current.)}

    :extremes
    {:name "Extremes"
     :desc "Project the fastest and slowest sprints' velocities."
     :fn (Extremes.)}

    :top-10-bottom-50
    {:name "Top 10%, Bottom 50%"
     :desc "Project the averages of the fastest 10% and the slowest 50% of sprint velocities."
     :fn (Middle. 0.9 0.5)}

    :top-80-bottom-80
    {:name "Top 80%, Bottom 80%"
     :desc "Project the averages of the fastest 80% and the slowest 80% of sprint velocities."
     :fn (Middle. 0.2 0.2)}

    :weighted-most-recent
    {:name "Weighted Most Recent"
     :desc "Project an average sprint velocity, weighting toward the most recent sprint's velocity."
     :fn (WeightedMostRecent. 1 0.5)}
    ))
