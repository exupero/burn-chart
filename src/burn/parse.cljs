(ns burn.parse
  (:require [clojure.string :as string]))

(def date first)
(def points second)
(def scope #(nth % 2))

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
