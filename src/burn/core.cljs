(ns burn.core
  (:require-macros [burn.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put!]]
            [cljs.core.match :refer-macros [match]]
            [cljs.reader :as reader]
            [clojure.string :as string]
            [goog.crypt.base64 :as b64]
            [vdom.elm :refer [foldp render!]]
            [burn.ui :as ui]))

(enable-console-print!)

(defn persist! [m]
  (set! (-> js/window .-location .-hash)
        (str "/" (b64/encodeString (pr-str m))))
  m)

(defn step [model action]
  (match action
    :no-op model
    [:update s] (persist! (assoc model :raw-data s))
    [:projection-strategy s] (persist! (assoc model :projector s)) ))

(def initial-model
  (or
    (try
      (-> js/window .-location .-hash
        (string/replace #"^#/" "")
        b64/decodeString
        reader/read-string)
      (catch js/Exception e
        nil))
    {:raw-data ""
     :projector :extremes}))

(defonce actions (chan))
(def emit #(put! actions %))

(defonce models (foldp step initial-model actions))

(defonce setup
  (render! (async/map #(ui/ui emit %) [models]) (.getElementById js/document "app")))

(defn figwheel-reload []
  (put! actions :no-op))
