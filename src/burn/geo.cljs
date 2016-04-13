(ns burn.geo)

(def abs #(.abs js/Math %1 %2))
(def pow #(.pow js/Math %1 %2))
(def ceil #(.ceil js/Math %))
(def floor #(.floor js/Math %))
(def log #(.log js/Math %))
(def sqr #(* % %))
(def sqrt #(.sqrt js/Math %))

(defn round
  ([x] (.round js/Math x))
  ([x s] (* s (round (/ x s)))))

(def average #(/ (reduce + %) (count %)))

(defn standard-deviation [xs]
  (let [m (average xs)]
    (->> xs
      (map #(sqr (- m %)))
      (reduce + 0)
      sqrt)))

(defn ms->date [t]
  (let [d (js/Date.)]
    (.setTime d t)
    d))

(defn days->ms [d]
  (* 1000 60 60 24 d))

(def time-index #(.getTime %))

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
      data (drop 1 data))))

(def extent (juxt #(apply min %) #(apply max %)))

(defn extent-key [f xs]
  [(apply min-key f xs)
   (apply max-key f xs)])

(defn before [d ms]
  (let [d' (js/Date.)]
    (.setTime d' (- (time-index d) ms))
    d'))

(defn after [d ms]
  (let [d' (js/Date.)]
    (.setTime d' (+ (time-index d) ms))
    d'))

(defn drop-percent [p xs]
  (drop (round (* p (count xs))) xs))

(defn zeroed [data]
  (let [[d1 p s] (first data)]
    (if (zero? p)
      data
      (let [[d2] (second data)
            d0 (before d1 (days->ms (days-between d1 d2)))]
        (concat [[d0 0 s]] data)))))

(defn fmt-date [d]
  (.toLocaleDateString d))
