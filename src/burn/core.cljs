(ns burn.core
  (:require-macros [burn.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put!]]
            [cljs.core.match :refer-macros [match]]
            [clojure.string :as string]
            [vdom.elm :refer [foldp render!]]
            [burn.scale :as s]))

(enable-console-print!)

(defn parse-date [raw]
  (let [[m d y] (string/split raw #"/")]
    (js/Date.
      (+ 2000 (int y))
      (dec (int m))
      (int d))))

(defn parse-csv [raw]
  (map
    #(-> %
       (string/split #",")
       (update 0 parse-date)
       (update 1 int)
       (update 2 int))
    (string/split raw #"\n")))

(defn translate [x y]
  (str "translate(" x "," y ")"))

(def extent (juxt #(apply min %) #(apply max %)))

(defn extent-key [f xs]
  [(apply min-key f xs)
   (apply max-key f xs)])

(def time-index #(.getTime %))

(defn path [pts]
  (->> pts
    (map #(string/join "," %))
    (interpose "L")
    (string/join "")
    (str "M")))

(defn after [d ms]
  (let [d' (js/Date.)]
    (.setTime d' (+ (time-index d) ms))
    d'))

(def pow #(.pow js/Math %1 %2))
(def ceil #(.ceil js/Math %))
(def floor #(.floor js/Math %))
(def log #(.log js/Math %))

(defn round
  ([x] (.round js/Math x))
  ([x s] (* s (round (/ x s)))))

(def average #(/ (reduce + %) (count %)))

(def date first)
(def points second)
(def scope #(nth % 2))

(defn ms->date [t]
  (let [d (js/Date.)]
    (.setTime d t)
    d))

(defn days->ms [d]
  (* 1000 60 60 24 d))

(defn fmt-date [d]
  (str (inc (.getMonth d))
       "/"
       (.getDate d)
       "/"
       (- (.getFullYear d) 2000)))

(defn ticks [[low high] pref]
  (let [interval (/ (- high low) pref)
        magnitude (pow 10 (floor (/ (log interval) (log 10))))
        residual (/ interval magnitude)
        high (inc high)]
    (condp < residual
      5 (range low high (* 10 magnitude))
      2 (range low high (* 5 magnitude))
      1 (range low high (* 2 magnitude))
      (range low high magnitude))))

(defn axes [x y late]
  [:g {}
   [:g {}
    [:line {:class "axis" :y2 (y 0)}]
    (let [[low high] (s/domain x)
          sprint (days->ms 7)
          ts (/ (- high low) sprint)
          sprint (* sprint (ceil (/ ts 14)))]
      (for [t (range low high sprint)]
        [:text {:transform (translate (x t) (y 0))
                :dy 25
                :text-anchor "middle"}
         (fmt-date (ms->date t))]))]
   [:g {}
    [:line {:class "axis"
            :transform (translate 0 (y 0))
            :x2 (x (time-index late))}]
    (let [[low high] (s/domain y)]
      (for [s (ticks [low high] 20)]
        [:text {:transform (translate 0 (y s))
                :dx -13
                :dy 6
                :text-anchor "end"}
         s]))]])

(defn scope-line [x y late data]
  (let [pts (concat
              (for [[d _ s] data]
                [(x (time-index d)) (y s)])
              [[(x (time-index late)) (y (scope (last data)))]])]
    [:path {:class "scope"
            :d (path pts)}]))

(defn progress-line [x y data]
  (let [pts (for [[d p] data]
              [(x (time-index d)) (y p)])]
    [:path {:class "progress"
            :d (path pts)}]))

(defn projection-line [x y done data]
  (let [end (last data)]
    [:line {:class "projection"
            :x1 (x (time-index (date end)))
            :y1 (y (points end))
            :x2 (x (time-index done))
            :y2 (y (scope end))}]))

(defn days-between [a b]
  (round
    (/ (- (time-index b) (time-index a))
       (days->ms 1))))

(defn points-per-day [data]
  (apply concat
    (map
      (fn [[d] [d' p]]
        (let [days (days-between d d')]
          (repeat days (/ p days))))
      data
      (drop 1 data))))

(defn low-high [[low high] xs]
  (let [xs (sort xs)
        c (count xs)]
    [(average (drop-last (round (* low c)) xs))
     (average (drop (round (* high c)) xs))]))

(defn cone [current gap data]
  (->> data
    points-per-day
    (low-high [0.2 0.2])
    (map #(after current (days->ms (/ gap %))))
    (sort-by time-index)))

(defn burn-chart [data]
  (let [data (sort-by (comp time-index date) data)
        accumulated (reductions (fn [[_ pp _] [d p s]]
                                  [d (+ pp p) s])
                                data)
        current (last data)
        [width height] [960 500]
        [early late] (extent-key time-index (map date data))
        [soonest latest] (cone
                           (date current)
                           (apply - ((juxt scope points) current))
                           data)
        [low high] [0 (apply max (map scope data))]
        x (s/linear [(time-index early) (time-index latest)] [0 (- width 100)])
        y (s/linear [low high] [(- height 40) 0])]
    [:svg {:width width
           :height height
           :id "visualization"
           :class "bordered"}
     [:rect {:width width :height height :fill "white"}]
     [:g {:transform (translate 50 5)}
      (axes x y latest)
      [:text {:transform (translate (x (time-index soonest)) (y (scope current)))
              :text-anchor "middle"
              :dy -5}
       (fmt-date soonest)]
      [:text {:transform (translate (x (time-index latest)) (y (scope current)))
              :text-anchor "middle"
              :dy -5}
       (fmt-date latest)]
      (scope-line x y latest data)
      (progress-line x y accumulated)
      (projection-line x y soonest accumulated)
      (projection-line x y latest accumulated)]]))

(defn save-png [nm]
  (let [el (.getElementById js/document "visualization")]
    (js/saveSvgAsPng el nm (clj->js {:scale 4}))))

(defn ui [emit {:keys [raw-data]}]
  (let [raw-data (.trim raw-data)]
    [:main {}
     [:div {:className "right"}
      [:button {:onclick #(save-png "burn-chart")} "Download"]]
     [:h1 {} "Burn Chart"]
     (burn-chart (parse-csv raw-data))
     [:h2 {} "Data"]
     [:div {:className "column-left"}
      [:p {} "Specify your data as comma-separated values. There are three fields:"]
      [:ul {}
       [:li {} "date (in the format \"mm/dd/yy\")"]
       [:li {} "points completed between the given date and the date of the previous row"]
       [:li {} "total points in scope as of the given date"]]]
     [:div {:className "column-right"}
      [:textarea {:className "width-full"
                  :onkeyup #(this-as this (emit [:update (.-value this)]))}
       raw-data]]
     [:div {:className "clearfix"}]]))

(defn step [model action]
  (match action
    :no-op model
    [:update s] (assoc model :raw-data s)))

(def initial-model
  {:raw-data "
04/15/16,5,230
04/20/16,90,265
04/30/16,44,265
05/16/16,21,230"})

(defonce actions (chan))
(def emit #(put! actions %))

(defonce models (foldp step initial-model actions))

(defonce setup
  (render! (async/map #(ui emit %) [models]) (.getElementById js/document "app")))

(defn figwheel-reload []
  (put! actions :no-op))
