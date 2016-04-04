(ns burn.scale)

(defprotocol IScale
  (-domain [this])
  (-range [this]))

(defn domain [s]
  (-domain s))

(defrecord Linear [domain rng]
  IFn
  (-invoke [this x]
    (let [[x1 x2] domain
          [y1 y2] rng
          m (/ (- y2 y1) (- x2 x1))
          b (- y1 (* m x1))]
      (+ (* m x) b)))

  IScale
  (-domain [this] domain)
  (-range [this] rng))

(defn linear [domain rng]
  (Linear. domain rng))
