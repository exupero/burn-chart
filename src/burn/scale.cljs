(ns burn.scale
  (:require-macros [burn.macros :refer [spy]])
  (:require [burn.geo :as geo]))

(defprotocol IScale
  (-domain [this])
  (-range [this]))

(defn domain [s]
  (-domain s))

(defrecord Linear [domain rng f]
  IFn
  (-invoke [this x]
    (let [[x1 x2] (map f domain)
          [y1 y2] rng
          m (/ (- y2 y1) (- x2 x1))
          b (- y1 (* m x1))]
      (+ (* m (f x)) b)))

  IScale
  (-domain [this] domain)
  (-range [this] rng))

(defn linear
  ([domain rng] (Linear. domain rng identity))
  ([domain rng f] (Linear. domain rng f)))

(defn ticks [[low high] pref]
  (let [interval (/ (- high low) pref)
        magnitude (geo/pow 10 (geo/floor (/ (geo/log interval) (geo/log 10))))
        residual (/ interval magnitude)
        high (inc high)]
    (condp < residual
      5 (range low high (* 10 magnitude))
      2 (range low high (* 5 magnitude))
      1 (range low high (* 2 magnitude))
      (range low high magnitude))))
