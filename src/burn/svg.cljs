(ns burn.svg
  (:require [clojure.string :as string]))

(defn path [pts]
  (->> pts
    (map #(string/join "," %))
    (interpose "L")
    (string/join "")
    (str "M")))

(defn closed-path [pts]
  (str (path pts) "Z"))

(defn translate [x y]
  (str "translate(" x "," y ")"))
