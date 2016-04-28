(ns burn.core
  (:require-macros [burn.macros :refer [spy]])
  (:require [cljs.core.async :as async :refer [chan put!]]
            [cljs.core.match :refer-macros [match]]
            [cljs.reader :as reader]
            [clojure.string :as string]
            [goog.crypt.base64 :as b64]
            [ajax.core :refer [GET]]
            [vdom.elm :refer [foldp render!]]
            burn.ui
            burn.analysis))

(enable-console-print!)

(defn persist! [m]
  (set! (-> js/window .-location .-hash)
        (str "/" (b64/encodeString (pr-str m))))
  m)

(def empty-model
  {:raw-data ""
   :projector :average-last-three
   :dropping? false})

(def parsed-hash
  (try
    (-> js/window .-location .-hash
      (string/replace #"^#/" "")
      b64/decodeString
      reader/read-string)
    (catch js/Exception e
      nil)))

(declare emit)

(defn step [model action]
  (match action
    :no-op model
    :clear (persist! empty-model)
    [:dropping v] (assoc model :dropping? v)
    [:update s] (persist! (assoc model :raw-data s))
    [:projection-strategy s] (persist! (assoc model :projector s))
    [:load fname] (do
                    (GET fname {:handler #(emit [:update %])})
                    (assoc model :filename fname))))

(defonce actions (chan))
(def emit #(put! actions %))

(defonce models (foldp #'step (or parsed-hash empty-model) actions))

(defonce setup
  (render! (async/map #(burn.ui/ui emit %) [models]) (.getElementById js/document "app")))

(defn figwheel-reload []
  (put! actions :no-op))
