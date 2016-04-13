(ns burn.ui
  (:require-macros [burn.macros :refer [spy]])
  (:require [clojure.string :as string]
            [burn.geo :as geo]
            [burn.parse :as p]
            [burn.scale :as s]
            [burn.svg :as svg]
            [burn.projectors :as project]))

(defn axes [x y late]
  [:g {}
   [:g {}
    [:line {:class "axis" :y2 (y 0)}]
    (let [[low high] (map geo/time-index (s/domain x))
          sprint (geo/days->ms 7)
          ts (/ (- high low) sprint)
          sprint (* sprint (geo/ceil (/ ts 13)))]
      (for [t (range low high sprint)
            :let [date (geo/ms->date t)]]
        [:text {:transform (svg/translate (x date) (y 0))
                :dy 25
                :text-anchor "middle"}
         (geo/fmt-date date)]))]
   [:g {}
    [:line {:class "axis"
            :transform (svg/translate 0 (y 0))
            :x2 (x late)}]
    (let [[low high] (s/domain y)]
      (for [s (s/ticks [low high] 20)]
        [:text {:transform (svg/translate 0 (y s))
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
            :d (svg/path pts)
            :clip-path "url(#interior)"}]))

(defn stacked [n f data]
  (reductions
    (fn [a b]
      (update b n #(f (get a n) %)))
    data))

(defn progress-line [x y data]
  (let [pts (for [[d p] (stacked 1 + data)]
              [(x d) (y p)])]
    [:path {:class "progress"
            :d (svg/path pts)
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
   [:text {:transform (svg/translate (x done) (y (p/scope end)))
           :text-anchor "middle"
           :dy -5}
    (geo/fmt-date done)]])

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

(defn projections [[x y] [soonest latest] data]
  (let [current (last (stacked 1 + data))]
    (list
      (projection x y soonest current)
      (projection x y latest current))))

(defn burn-chart [[width height] projector data]
  (let [data (geo/zeroed (sort-by (comp geo/time-index p/date) data))
        current (last (stacked 1 + data))
        gap (- (p/scope current) (p/points current))
        [soonest latest] (whiskers gap (projector :fn) data)
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
      [:g {:transform (svg/translate 50 25)}
       (scope-line x y latest data)
       (progress-line x y data)
       (when (pos? gap)
         (projections [x y] [soonest latest] data))
       (axes x y latest)]
      [:g {:transform (svg/translate (- width 50 300) (- height 150))}
       [:foreignObject {:width 300 :height 150
                        :font-family "'PT Sans', Arial, sans-serif"}
        ((projector :summary) (p/scope current) [soonest latest])]])))

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
         [:small {} (v :name)]])]
     (let [[width height] [960 500]
           data (p/parse-csv raw-data)]
       [:svg {:width width
              :height height
              :id "visualization"
              :class "bordered"}
        (if (seq data)
          (burn-chart [width height] proj data)
          [:text {:transform (svg/translate (/ width 2) (/ height 2))
                  :dy 5
                  :text-anchor "middle"}
           "No data"])])
     [:h2 {} "Data"]
     [:div {:className "column-left"}
      [:p {} "Specify your data as comma-separated values. There are three fields:"]
      [:ul {}
       [:li {} "date, in the format \"yyyy-mm-dd\""]
       [:li {} "points completed between the given date and the date of the previous row"]
       [:li {} "total points in scope as of the given date"]]]
     [:div {:className "column-right"}
      [:textarea {:className "width-full"
                  :onkeyup #(this-as this (emit [:update (.-value this)]))}
       raw-data]]
     [:div {:className "clearfix"}]]))
