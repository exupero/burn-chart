(ns burn.ui
  (:require-macros [burn.macros :refer [spy]])
  (:require [clojure.string :as string]
            [burn.geo :as geo]
            [burn.parse :as p]
            [burn.scale :as s]
            [burn.projectors :as project]))

(defn path [pts]
  (->> pts
    (map #(string/join "," %))
    (interpose "L")
    (string/join "")
    (str "M")))

(defn translate [x y]
  (str "translate(" x "," y ")"))

(defn fmt-date [d]
  (str (inc (.getMonth d))
       "/"
       (.getDate d)
       "/"
       (- (.getFullYear d) 2000)))

(defn axes [x y late]
  [:g {}
   [:g {}
    [:line {:class "axis" :y2 (y 0)}]
    (let [[low high] (map geo/time-index (s/domain x))
          sprint (geo/days->ms 7)
          ts (/ (- high low) sprint)
          sprint (* sprint (geo/ceil (/ ts 14)))]
      (for [t (range low high sprint)
            :let [date (geo/ms->date t)]]
        [:text {:transform (translate (x date) (y 0))
                :dy 25
                :text-anchor "middle"}
         (fmt-date date)]))]
   [:g {}
    [:line {:class "axis"
            :transform (translate 0 (y 0))
            :x2 (x late)}]
    (let [[low high] (s/domain y)]
      (for [s (s/ticks [low high] 20)]
        [:text {:transform (translate 0 (y s))
                :dx -13
                :dy 6
                :text-anchor "end"}
         s]))]])

(defn scope-line [x y late data]
  (let [pts (concat
              (for [[d _ s] data]
                [(x d) (y s)])
              [[(x late) (y (p/scope (last data)))]])]
    [:path {:class "scope"
            :d (path pts)
            :clip-path "url(#interior)"}]))

(defn progress-line [x y data]
  (let [pts (for [[d p] data]
              [(x d) (y p)])]
    [:path {:class "progress"
            :d (path pts)
            :stroke-linecap "round"
            :clip-path "url(#interior)"}]))

(defn projection [x y done end]
  [:g {}
   [:line {:class "projection"
           :x1 (x (p/date end))
           :y1 (y (p/points end))
           :x2 (x done)
           :y2 (y (p/scope end))
           :clip-path "url(#interior)"}]
   [:text {:transform (translate (x done) (y (p/scope end)))
           :text-anchor "middle"
           :dy -5}
    (fmt-date done)]])

(defn zeroed [data]
  (let [[d1 p s] (first data)
        [d2] (second data)
        d0 (geo/before d1 (geo/days->ms (geo/days-between d1 d2)))]
    (concat [[d0 0 s]] data)))

(defn stacked [n f data]
  (reductions
    (fn [a b]
      (update b n #(f (get a n) %)))
    data))

(defn current-scope [data]
  (->> data
    (map p/scope)
    (filter pos?)
    last))

(defn whiskers [gap projector data]
  (let [most-recent (p/date (last data))]
    (if (pos? gap)
      (let [slow (project/slowest projector data)
            fast (project/fastest projector data)
            days-after #(geo/after most-recent (geo/days->ms %))]
        [(days-after (/ gap fast))
         (cond
           (pos? slow) (days-after (/ gap slow))
           (pos? fast) (days-after (/ gap fast))
           :else most-recent)])
      [most-recent most-recent])))

(defn burn-chart [[width height] projector data]
  (let [data (zeroed (sort-by (comp geo/time-index p/date) data))
        accumulated (stacked 1 + data)
        current (last accumulated)
        gap (- (p/scope current) (p/points current))
        [soonest latest] (whiskers gap projector data)
        x (s/linear [(p/date (first data)) latest] [0 (- width 100)] geo/time-index)
        y (s/linear [0 (apply max (map p/scope data))] [(- height 65) 0])]
    (list
      [:defs {}
       [:clipPath {:id "interior"}
        [:rect {:y -25
                :width (- width 50)
                :height (+ (- height 65) 25)
                :clipPathUnits "userSpaceOnUse"}]]]
      [:rect {:width width :height height :fill "white"}]
      [:g {:transform (translate 50 25)}
       (scope-line x y latest data)
       (progress-line x y accumulated)
       (when (pos? gap)
         (list
           (projection x y soonest (last accumulated))
           (projection x y latest (last accumulated))))
       (axes x y latest)])))

(defn save-png [nm]
  (let [el (.getElementById js/document "visualization")]
    (js/saveSvgAsPng el nm (clj->js {:scale 4}))))

(defn ui [emit {:keys [projector raw-data]}]
  (let [raw-data (.trim raw-data)
        proj (project/projectors projector)]
    [:main {}
     [:div {:className "right"}
      [:button {:onclick #(save-png "burn-chart")} "Download"]]
     [:h1 {} "Burn Chart"]
     [:div {:className "spaced horizontal"}
      (for [[k v] project/projectors]
        [:label {:className "label--radio"}
         [:input {:type "radio"
                  :checked (= k projector)
                  :onclick #(emit [:projection-strategy k])}]
         [:strong {} [:small {} (v :name)]]
         [:div {:className "muted"}
          [:small {} (v :desc)]]])]
     (let [[width height] [960 500]
           data (p/parse-csv raw-data)]
       [:svg {:width width
              :height height
              :id "visualization"
              :class "bordered"}
        (if (seq data)
          (burn-chart [width height] (proj :fn) data)
          [:text {:transform (translate (/ width 2) (/ height 2))
                  :dy 5
                  :text-anchor "middle"}
           "No data"])])
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
