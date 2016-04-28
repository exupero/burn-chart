if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var g,aa=aa||{},ba=this;function ca(){}
function p(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){return"array"==p(a)}function fa(a){var b=p(a);return"array"==b||"object"==b&&"number"==typeof a.length}function ha(a){return"string"==typeof a}function ka(a){return"function"==p(a)}var la="closure_uid_"+(1E9*Math.random()>>>0),ma=0;function na(a,b,c){return a.call.apply(a.bind,arguments)}
function pa(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function qa(a,b,c){qa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?na:pa;return qa.apply(null,arguments)}var ra=Date.now||function(){return+new Date};
function sa(a,b){function c(){}c.prototype=b.prototype;a.Fe=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Zc=function(a,c,f){for(var h=Array(arguments.length-2),k=2;k<arguments.length;k++)h[k-2]=arguments[k];return b.prototype[c].apply(a,h)}};function ta(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var va=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function wa(a,b){return a<b?-1:a>b?1:0};function xa(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function ya(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return!0;return!1}function Aa(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function Ba(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}var Ca="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Ea(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Ca.length;f++)c=Ca[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}function Fa(a){var b=arguments.length;if(1==b&&da(arguments[0]))return Fa.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};function Ga(a,b){null!=a&&this.append.apply(this,arguments)}g=Ga.prototype;g.Ob="";g.set=function(a){this.Ob=""+a};g.append=function(a,b,c){this.Ob+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Ob+=arguments[d];return this};g.clear=function(){this.Ob=""};g.toString=function(){return this.Ob};function Ia(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Ia);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}sa(Ia,Error);Ia.prototype.name="CustomError";function Ja(a,b){b.unshift(a);Ia.call(this,ta.apply(null,b));b.shift()}sa(Ja,Ia);Ja.prototype.name="AssertionError";function Ka(a,b){throw new Ja("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var La=Array.prototype,Ma=La.indexOf?function(a,b,c){return La.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(ha(a))return ha(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Na=La.forEach?function(a,b,c){La.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=ha(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};
function Pa(a){var b;a:{b=Qa;for(var c=a.length,d=ha(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:ha(a)?a.charAt(b):a[b]}function Ra(a,b,c){return 2>=arguments.length?La.slice.call(a,b):La.slice.call(a,b,c)}function Sa(a,b){a.sort(b||Ta)}function Ua(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||Ta;Sa(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}
function Ta(a,b){return a>b?1:a<b?-1:0};var Wa={},Xa;if("undefined"===typeof Ya)var Ya=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Za)var Za=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var $a=null;if("undefined"===typeof ab)var ab=null;function cb(){return new q(null,5,[db,!0,eb,!0,gb,!1,hb,!1,jb,null],null)}kb;function t(a){return null!=a&&!1!==a}lb;u;function mb(a){return null==a}function nb(a){return a instanceof Array}
function ob(a){return null==a?!0:!1===a?!0:!1}function w(a,b){return a[p(null==b?null:b)]?!0:a._?!0:!1}function qb(a){return null==a?null:a.constructor}function x(a,b){var c=qb(b),c=t(t(c)?c.Kc:c)?c.bc:p(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function rb(a){var b=a.bc;return t(b)?b:""+z(a)}var sb="undefined"!==typeof Symbol&&"function"===p(Symbol)?Symbol.iterator:"@@iterator";
function tb(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}A;ub;var kb=function kb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kb.g(arguments[0]);case 2:return kb.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};kb.g=function(a){return kb.a(null,a)};
kb.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return ub.h?ub.h(c,d,b):ub.call(null,c,d,b)};kb.I=2;function vb(){}function wb(){}var yb=function yb(b){if(null!=b&&null!=b.sa)return b.sa(b);var c=yb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=yb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("ICloneable.-clone",b);};function zb(){}
var Ab=function Ab(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=Ab[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ab._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("ICounted.-count",b);},Bb=function Bb(b){if(null!=b&&null!=b.ma)return b.ma(b);var c=Bb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Bb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IEmptyableCollection.-empty",b);};function Cb(){}
var Db=function Db(b,c){if(null!=b&&null!=b.V)return b.V(b,c);var d=Db[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("ICollection.-conj",b);};function Eb(){}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.a(arguments[0],arguments[1]);case 3:return B.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
B.a=function(a,b){if(null!=a&&null!=a.ca)return a.ca(a,b);var c=B[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=B._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw x("IIndexed.-nth",a);};B.h=function(a,b,c){if(null!=a&&null!=a.Ma)return a.Ma(a,b,c);var d=B[p(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=B._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw x("IIndexed.-nth",a);};B.I=3;function Fb(){}
var Hb=function Hb(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=Hb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Hb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("ISeq.-first",b);},Ib=function Ib(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=Ib[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ib._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("ISeq.-rest",b);};function Jb(){}function Kb(){}
var Lb=function Lb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Lb.a(arguments[0],arguments[1]);case 3:return Lb.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Lb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=Lb[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Lb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw x("ILookup.-lookup",a);};Lb.h=function(a,b,c){if(null!=a&&null!=a.M)return a.M(a,b,c);var d=Lb[p(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=Lb._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw x("ILookup.-lookup",a);};Lb.I=3;
var Mb=function Mb(b,c){if(null!=b&&null!=b.cd)return b.cd(b,c);var d=Mb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Mb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IAssociative.-contains-key?",b);},Nb=function Nb(b,c,d){if(null!=b&&null!=b.Ia)return b.Ia(b,c,d);var e=Nb[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Nb._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("IAssociative.-assoc",b);};function Ob(){}
var Qb=function Qb(b,c){if(null!=b&&null!=b.Ua)return b.Ua(b,c);var d=Qb[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Qb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IMap.-dissoc",b);};function Rb(){}
var Sb=function Sb(b){if(null!=b&&null!=b.Hc)return b.Hc(b);var c=Sb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Sb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IMapEntry.-key",b);},Tb=function Tb(b){if(null!=b&&null!=b.Ic)return b.Ic(b);var c=Tb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Tb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IMapEntry.-val",b);};function Ub(){}
var Vb=function Vb(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=Vb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Vb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IStack.-peek",b);},Xb=function Xb(b){if(null!=b&&null!=b.Qb)return b.Qb(b);var c=Xb[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Xb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IStack.-pop",b);};function Yb(){}
var Zb=function Zb(b,c,d){if(null!=b&&null!=b.ac)return b.ac(b,c,d);var e=Zb[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Zb._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("IVector.-assoc-n",b);},$b=function $b(b){if(null!=b&&null!=b.oc)return b.oc(b);var c=$b[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=$b._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IDeref.-deref",b);};function ac(){}
var bc=function bc(b){if(null!=b&&null!=b.R)return b.R(b);var c=bc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=bc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IMeta.-meta",b);};function cc(){}var dc=function dc(b,c){if(null!=b&&null!=b.S)return b.S(b,c);var d=dc[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=dc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IWithMeta.-with-meta",b);};function ec(){}
var gc=function gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gc.a(arguments[0],arguments[1]);case 3:return gc.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
gc.a=function(a,b){if(null!=a&&null!=a.va)return a.va(a,b);var c=gc[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw x("IReduce.-reduce",a);};gc.h=function(a,b,c){if(null!=a&&null!=a.wa)return a.wa(a,b,c);var d=gc[p(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=gc._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw x("IReduce.-reduce",a);};gc.I=3;
var hc=function hc(b,c,d){if(null!=b&&null!=b.qc)return b.qc(b,c,d);var e=hc[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=hc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("IKVReduce.-kv-reduce",b);},ic=function ic(b,c){if(null!=b&&null!=b.G)return b.G(b,c);var d=ic[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ic._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IEquiv.-equiv",b);},jc=function jc(b){if(null!=b&&null!=b.P)return b.P(b);
var c=jc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=jc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IHash.-hash",b);};function kc(){}var lc=function lc(b){if(null!=b&&null!=b.U)return b.U(b);var c=lc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=lc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("ISeqable.-seq",b);};function mc(){}function nc(){}function oc(){}
var pc=function pc(b){if(null!=b&&null!=b.rc)return b.rc(b);var c=pc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=pc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IReversible.-rseq",b);},qc=function qc(b,c){if(null!=b&&null!=b.le)return b.le(0,c);var d=qc[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=qc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IWriter.-write",b);},rc=function rc(b,c,d){if(null!=b&&null!=b.O)return b.O(b,c,d);var e=
rc[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=rc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("IPrintWithWriter.-pr-writer",b);},sc=function sc(b,c,d){if(null!=b&&null!=b.ke)return b.ke(0,c,d);var e=sc[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=sc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("IWatchable.-notify-watches",b);},tc=function tc(b){if(null!=b&&null!=b.pc)return b.pc(b);var c=tc[p(null==b?null:
b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=tc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IEditableCollection.-as-transient",b);},uc=function uc(b,c){if(null!=b&&null!=b.$b)return b.$b(b,c);var d=uc[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=uc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("ITransientCollection.-conj!",b);},vc=function vc(b){if(null!=b&&null!=b.sc)return b.sc(b);var c=vc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,
b);c=vc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("ITransientCollection.-persistent!",b);},wc=function wc(b,c,d){if(null!=b&&null!=b.Jc)return b.Jc(b,c,d);var e=wc[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=wc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("ITransientAssociative.-assoc!",b);},xc=function xc(b,c,d){if(null!=b&&null!=b.je)return b.je(0,c,d);var e=xc[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=xc._;
if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("ITransientVector.-assoc-n!",b);};function yc(){}
var zc=function zc(b,c){if(null!=b&&null!=b.Fb)return b.Fb(b,c);var d=zc[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=zc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IComparable.-compare",b);},Ac=function Ac(b){if(null!=b&&null!=b.he)return b.he();var c=Ac[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ac._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IChunk.-drop-first",b);},Bc=function Bc(b){if(null!=b&&null!=b.Id)return b.Id(b);var c=
Bc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Bc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IChunkedSeq.-chunked-first",b);},Cc=function Cc(b){if(null!=b&&null!=b.Jd)return b.Jd(b);var c=Cc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Cc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IChunkedSeq.-chunked-rest",b);},Dc=function Dc(b){if(null!=b&&null!=b.Hd)return b.Hd(b);var c=Dc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,
b);c=Dc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IChunkedNext.-chunked-next",b);},Ec=function Ec(b,c){if(null!=b&&null!=b.Xe)return b.Xe(b,c);var d=Ec[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ec._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IReset.-reset!",b);},Gc=function Gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gc.a(arguments[0],arguments[1]);case 3:return Gc.h(arguments[0],
arguments[1],arguments[2]);case 4:return Gc.J(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Gc.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Gc.a=function(a,b){if(null!=a&&null!=a.Ze)return a.Ze(a,b);var c=Gc[p(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Gc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw x("ISwap.-swap!",a);};
Gc.h=function(a,b,c){if(null!=a&&null!=a.$e)return a.$e(a,b,c);var d=Gc[p(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=Gc._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw x("ISwap.-swap!",a);};Gc.J=function(a,b,c,d){if(null!=a&&null!=a.af)return a.af(a,b,c,d);var e=Gc[p(null==a?null:a)];if(null!=e)return e.J?e.J(a,b,c,d):e.call(null,a,b,c,d);e=Gc._;if(null!=e)return e.J?e.J(a,b,c,d):e.call(null,a,b,c,d);throw x("ISwap.-swap!",a);};
Gc.aa=function(a,b,c,d,e){if(null!=a&&null!=a.bf)return a.bf(a,b,c,d,e);var f=Gc[p(null==a?null:a)];if(null!=f)return f.aa?f.aa(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Gc._;if(null!=f)return f.aa?f.aa(a,b,c,d,e):f.call(null,a,b,c,d,e);throw x("ISwap.-swap!",a);};Gc.I=5;var Hc=function Hc(b){if(null!=b&&null!=b.Aa)return b.Aa(b);var c=Hc[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Hc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IIterable.-iterator",b);};
function Ic(a){this.qf=a;this.v=1073741824;this.K=0}Ic.prototype.le=function(a,b){return this.qf.append(b)};function Jc(a){var b=new Ga;a.O(null,new Ic(b),cb());return""+z(b)}var Kc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Lc(a){a=Kc(a|0,-862048943);return Kc(a<<15|a>>>-15,461845907)}
function Mc(a,b){var c=(a|0)^(b|0);return Kc(c<<13|c>>>-13,5)+-430675100|0}function Nc(a,b){var c=(a|0)^b,c=Kc(c^c>>>16,-2048144789),c=Kc(c^c>>>13,-1028477387);return c^c>>>16}function Oc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Mc(c,Lc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Lc(a.charCodeAt(a.length-1)):b;return Nc(b,Kc(2,a.length))}Pc;Qc;Rc;Sc;var Tc={},Uc=0;
function Vc(a){if(null!=a){var b=a.length;if(0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Kc(31,d)+a.charCodeAt(c),c=e;else return d;else return 0}else return 0}function Wc(a){255<Uc&&(Tc={},Uc=0);var b=Tc[a];"number"!==typeof b&&(b=Vc(a),Tc[a]=b,Uc+=1);return a=b}
function Xc(a){null!=a&&(a.v&4194304||a.Ld)?a=a.P(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=Wc(a),0!==a&&(a=Lc(a),a=Mc(0,a),a=Nc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:jc(a);return a}function Yc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function lb(a,b){return b instanceof a}
function Zc(a,b){if(a.La===b.La)return 0;var c=ob(a.Ka);if(t(c?b.Ka:c))return-1;if(t(a.Ka)){if(ob(b.Ka))return 1;c=Ta(a.Ka,b.Ka);return 0===c?Ta(a.name,b.name):c}return Ta(a.name,b.name)}G;function Qc(a,b,c,d,e){this.Ka=a;this.name=b;this.La=c;this.kc=d;this.Ga=e;this.v=2154168321;this.K=4096}g=Qc.prototype;g.toString=function(){return this.La};g.equiv=function(a){return this.G(null,a)};g.G=function(a,b){return b instanceof Qc?this.La===b.La:!1};
g.call=function(){function a(a,b,c){return G.h?G.h(b,this,c):G.call(null,b,this,c)}function b(a,b){return G.a?G.a(b,this):G.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.h=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return G.a?G.a(a,this):G.call(null,a,this)};
g.a=function(a,b){return G.h?G.h(a,this,b):G.call(null,a,this,b)};g.R=function(){return this.Ga};g.S=function(a,b){return new Qc(this.Ka,this.name,this.La,this.kc,b)};g.P=function(){var a=this.kc;return null!=a?a:this.kc=a=Yc(Oc(this.name),Wc(this.Ka))};g.O=function(a,b){return qc(b,this.La)};
var $c=function $c(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $c.g(arguments[0]);case 2:return $c.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};$c.g=function(a){if(a instanceof Qc)return a;var b=a.indexOf("/");return-1===b?$c.a(null,a):$c.a(a.substring(0,b),a.substring(b+1,a.length))};$c.a=function(a,b){var c=null!=a?[z(a),z("/"),z(b)].join(""):b;return new Qc(a,b,c,null,null)};
$c.I=2;function ad(a,b,c){this.j=a;this.sd=b;this.Ga=c;this.v=2523137;this.K=0}g=ad.prototype;g.oc=function(){return this.j.o?this.j.o():this.j.call(null)};g.R=function(){return this.Ga};g.S=function(a,b){return new ad(this.j,this.sd,b)};g.G=function(a,b){if(b instanceof ad){var c=this.sd,d=b.sd;return Rc.a?Rc.a(c,d):Rc.call(null,c,d)}return!1};g.ge=!0;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia,Oa){a=this;a=a.j.o?a.j.o():a.j.call(null);return A.Gb?A.Gb(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia,Oa):A.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia,Oa)}function b(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia)}function c(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,
f,h,k,l,m,n,r,v,y,C,F,E,D,I,T)}function d(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I)}function e(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D)}function f(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E)}function h(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F){a=this;return(a.j.o?
a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F)}function k(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C)}function l(a,b,c,d,e,f,h,k,l,m,n,r,v,y){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v,y)}function m(a,b,c,d,e,f,h,k,l,m,n,r,v){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n,r,v)}function n(a,b,c,d,e,f,h,k,l,m,n,r){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,
b,c,d,e,f,h,k,l,m,n,r)}function r(a,b,c,d,e,f,h,k,l,m,n){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m,n)}function v(a,b,c,d,e,f,h,k,l,m){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l,m)}function y(a,b,c,d,e,f,h,k,l){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k,l)}function C(a,b,c,d,e,f,h,k){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f,h,k)}function E(a,b,c,d,e,f,h){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,
b,c,d,e,f,h)}function F(a,b,c,d,e,f){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e,f)}function I(a,b,c,d,e){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d,e)}function T(a,b,c,d){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c,d)}function ia(a,b,c){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b,c)}function Oa(a,b){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null,b)}function Wb(a){a=this;return(a.j.o?a.j.o():a.j.call(null)).call(null)}var D=null,
D=function(fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne,Nf,xj){switch(arguments.length){case 1:return Wb.call(this,fb);case 2:return Oa.call(this,fb,ea);case 3:return ia.call(this,fb,ea,ga);case 4:return T.call(this,fb,ea,ga,ja);case 5:return I.call(this,fb,ea,ga,ja,oa);case 6:return F.call(this,fb,ea,ga,ja,oa,ua);case 7:return E.call(this,fb,ea,ga,ja,oa,ua,D);case 8:return C.call(this,fb,ea,ga,ja,oa,ua,D,Da);case 9:return y.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha);case 10:return v.call(this,
fb,ea,ga,ja,oa,ua,D,Da,Ha,za);case 11:return r.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va);case 12:return n.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb);case 13:return m.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib);case 14:return l.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb);case 15:return k.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb);case 16:return h.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb);case 17:return f.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,
xb,Pb,fc);case 18:return e.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc);case 19:return d.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd);case 20:return c.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne);case 21:return b.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne,Nf);case 22:return a.call(this,fb,ea,ga,ja,oa,ua,D,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne,Nf,xj)}throw Error("Invalid arity: "+arguments.length);};D.g=Wb;
D.a=Oa;D.h=ia;D.J=T;D.aa=I;D.Oa=F;D.Pa=E;D.rb=C;D.sb=y;D.gb=v;D.hb=r;D.ib=n;D.jb=m;D.kb=l;D.lb=k;D.mb=h;D.nb=f;D.ob=e;D.pb=d;D.qb=c;D.Kd=b;D.Gb=a;return D}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.o=function(){return(this.j.o?this.j.o():this.j.call(null)).call(null)};g.g=function(a){return(this.j.o?this.j.o():this.j.call(null)).call(null,a)};g.a=function(a,b){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b)};
g.h=function(a,b,c){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c)};g.J=function(a,b,c,d){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d)};g.aa=function(a,b,c,d,e){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e)};g.Oa=function(a,b,c,d,e,f){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f)};g.Pa=function(a,b,c,d,e,f,h){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h)};
g.rb=function(a,b,c,d,e,f,h,k){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k)};g.sb=function(a,b,c,d,e,f,h,k,l){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l)};g.gb=function(a,b,c,d,e,f,h,k,l,m){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m)};g.hb=function(a,b,c,d,e,f,h,k,l,m,n){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.ib=function(a,b,c,d,e,f,h,k,l,m,n,r){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r)};g.jb=function(a,b,c,d,e,f,h,k,l,m,n,r,v){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v)};g.kb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y)};
g.lb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C)};g.mb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E)};g.nb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F)};
g.ob=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I)};g.pb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T)};g.qb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia){return(this.j.o?this.j.o():this.j.call(null)).call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia)};
g.Kd=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa){var Wb=this.j.o?this.j.o():this.j.call(null);return A.Gb?A.Gb(Wb,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa):A.call(null,Wb,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa)};H;bd;J;function K(a){if(null==a)return null;if(null!=a&&(a.v&8388608||a.Ye))return a.U(null);if(nb(a)||"string"===typeof a)return 0===a.length?null:new J(a,0);if(w(kc,a))return lc(a);throw Error([z(a),z(" is not ISeqable")].join(""));}
function L(a){if(null==a)return null;if(null!=a&&(a.v&64||a.na))return a.qa(null);a=K(a);return null==a?null:Hb(a)}function cd(a){return null!=a?null!=a&&(a.v&64||a.na)?a.xa(null):(a=K(a))?Ib(a):M:M}function N(a){return null==a?null:null!=a&&(a.v&128||a.dd)?a.Ha(null):K(cd(a))}
var Rc=function Rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rc.g(arguments[0]);case 2:return Rc.a(arguments[0],arguments[1]);default:return Rc.A(arguments[0],arguments[1],new J(c.slice(2),0))}};Rc.g=function(){return!0};Rc.a=function(a,b){return null==a?null==b:a===b||ic(a,b)};Rc.A=function(a,b,c){for(;;)if(Rc.a(a,b))if(N(c))a=b,b=L(c),c=N(c);else return Rc.a(b,L(c));else return!1};
Rc.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return Rc.A(b,a,c)};Rc.I=2;function dd(a){this.T=a}dd.prototype.next=function(){if(null!=this.T){var a=L(this.T);this.T=N(this.T);return{value:a,done:!1}}return{value:null,done:!0}};function ed(a){return new dd(K(a))}fd;function gd(a,b,c){this.value=a;this.xc=b;this.zd=c;this.v=8388672;this.K=0}gd.prototype.U=function(){return this};gd.prototype.qa=function(){return this.value};
gd.prototype.xa=function(){null==this.zd&&(this.zd=fd.g?fd.g(this.xc):fd.call(null,this.xc));return this.zd};function fd(a){var b=a.next();return t(b.done)?M:new gd(b.value,a,null)}function hd(a,b){var c=Lc(a),c=Mc(0,c);return Nc(c,b)}function id(a){var b=0,c=1;for(a=K(a);;)if(null!=a)b+=1,c=Kc(31,c)+Xc(L(a))|0,a=N(a);else return hd(c,b)}var jd=hd(1,0);function ld(a){var b=0,c=0;for(a=K(a);;)if(null!=a)b+=1,c=c+Xc(L(a))|0,a=N(a);else return hd(c,b)}var md=hd(0,0);nd;Pc;od;zb["null"]=!0;
Ab["null"]=function(){return 0};Date.prototype.G=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Zb=!0;Date.prototype.Fb=function(a,b){if(b instanceof Date)return Ta(this.valueOf(),b.valueOf());throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};ic.number=function(a,b){return a===b};pd;vb["function"]=!0;ac["function"]=!0;bc["function"]=function(){return null};jc._=function(a){return a[la]||(a[la]=++ma)};O;
function qd(a){this.j=a;this.v=32768;this.K=0}qd.prototype.oc=function(){return this.j};function rd(a){return a instanceof qd}function O(a){return $b(a)}function sd(a,b){var c=Ab(a);if(0===c)return b.o?b.o():b.call(null);for(var d=B.a(a,0),e=1;;)if(e<c){var f=B.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(rd(d))return $b(d);e+=1}else return d}function td(a,b,c){var d=Ab(a),e=c;for(c=0;;)if(c<d){var f=B.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(rd(e))return $b(e);c+=1}else return e}
function ud(a,b){var c=a.length;if(0===a.length)return b.o?b.o():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(rd(d))return $b(d);e+=1}else return d}function vd(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(rd(e))return $b(e);c+=1}else return e}function wd(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(rd(c))return $b(c);d+=1}else return c}xd;P;yd;zd;
function Ad(a){return null!=a?a.v&2||a.Ne?!0:a.v?!1:w(zb,a):w(zb,a)}function Bd(a){return null!=a?a.v&16||a.ie?!0:a.v?!1:w(Eb,a):w(Eb,a)}function Cd(a,b){this.l=a;this.F=b}Cd.prototype.za=function(){return this.F<this.l.length};Cd.prototype.next=function(){var a=this.l[this.F];this.F+=1;return a};function J(a,b){this.l=a;this.F=b;this.v=166199550;this.K=8192}g=J.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};
g.ca=function(a,b){var c=b+this.F;return c<this.l.length?this.l[c]:null};g.Ma=function(a,b,c){a=b+this.F;return a<this.l.length?this.l[a]:c};g.Aa=function(){return new Cd(this.l,this.F)};g.sa=function(){return new J(this.l,this.F)};g.Ha=function(){return this.F+1<this.l.length?new J(this.l,this.F+1):null};g.Y=function(){var a=this.l.length-this.F;return 0>a?0:a};g.rc=function(){var a=Ab(this);return 0<a?new yd(this,a-1,null):null};g.P=function(){return id(this)};
g.G=function(a,b){return od.a?od.a(this,b):od.call(null,this,b)};g.ma=function(){return M};g.va=function(a,b){return wd(this.l,b,this.l[this.F],this.F+1)};g.wa=function(a,b,c){return wd(this.l,b,c,this.F)};g.qa=function(){return this.l[this.F]};g.xa=function(){return this.F+1<this.l.length?new J(this.l,this.F+1):M};g.U=function(){return this.F<this.l.length?this:null};g.V=function(a,b){return P.a?P.a(b,this):P.call(null,b,this)};J.prototype[sb]=function(){return ed(this)};
var bd=function bd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bd.g(arguments[0]);case 2:return bd.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};bd.g=function(a){return bd.a(a,0)};bd.a=function(a,b){return b<a.length?new J(a,b):null};bd.I=2;
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return H.g(arguments[0]);case 2:return H.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};H.g=function(a){return bd.a(a,0)};H.a=function(a,b){return bd.a(a,b)};H.I=2;pd;Dd;function yd(a,b,c){this.Gc=a;this.F=b;this.C=c;this.v=32374990;this.K=8192}g=yd.prototype;g.toString=function(){return Jc(this)};
g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};g.sa=function(){return new yd(this.Gc,this.F,this.C)};g.Ha=function(){return 0<this.F?new yd(this.Gc,this.F-1,null):null};g.Y=function(){return this.F+1};g.P=function(){return id(this)};g.G=function(a,b){return od.a?od.a(this,b):od.call(null,this,b)};g.ma=function(){var a=M,b=this.C;return pd.a?pd.a(a,b):pd.call(null,a,b)};g.va=function(a,b){return Dd.a?Dd.a(b,this):Dd.call(null,b,this)};
g.wa=function(a,b,c){return Dd.h?Dd.h(b,c,this):Dd.call(null,b,c,this)};g.qa=function(){return B.a(this.Gc,this.F)};g.xa=function(){return 0<this.F?new yd(this.Gc,this.F-1,null):M};g.U=function(){return this};g.S=function(a,b){return new yd(this.Gc,this.F,b)};g.V=function(a,b){return P.a?P.a(b,this):P.call(null,b,this)};yd.prototype[sb]=function(){return ed(this)};function Ed(a){return L(N(a))}function Fd(a){for(;;){var b=N(a);if(null!=b)a=b;else return L(a)}}ic._=function(a,b){return a===b};
var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Gd.o();case 1:return Gd.g(arguments[0]);case 2:return Gd.a(arguments[0],arguments[1]);default:return Gd.A(arguments[0],arguments[1],new J(c.slice(2),0))}};Gd.o=function(){return Hd};Gd.g=function(a){return a};Gd.a=function(a,b){return null!=a?Db(a,b):Db(M,b)};Gd.A=function(a,b,c){for(;;)if(t(c))a=Gd.a(a,b),b=L(c),c=N(c);else return Gd.a(a,b)};
Gd.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return Gd.A(b,a,c)};Gd.I=2;function Q(a){if(null!=a)if(null!=a&&(a.v&2||a.Ne))a=a.Y(null);else if(nb(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.v&8388608||a.Ye))a:{a=K(a);for(var b=0;;){if(Ad(a)){a=b+Ab(a);break a}a=N(a);b+=1}}else a=Ab(a);else a=0;return a}function Id(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return K(a)?L(a):c;if(Bd(a))return B.h(a,b,c);if(K(a)){var d=N(a),e=b-1;a=d;b=e}else return c}}
function Jd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.v&16||a.ie))return a.ca(null,b);if(nb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.v&64||a.na)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(K(c)){c=L(c);break a}throw Error("Index out of bounds");}if(Bd(c)){c=B.a(c,d);break a}if(K(c))c=N(c),--d;else throw Error("Index out of bounds");
}}return c}if(w(Eb,a))return B.a(a,b);throw Error([z("nth not supported on this type "),z(rb(qb(a)))].join(""));}
function R(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.v&16||a.ie))return a.Ma(null,b,null);if(nb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.v&64||a.na))return Id(a,b);if(w(Eb,a))return B.a(a,b);throw Error([z("nth not supported on this type "),z(rb(qb(a)))].join(""));}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};G.a=function(a,b){return null==a?null:null!=a&&(a.v&256||a.Re)?a.N(null,b):nb(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:w(Kb,a)?Lb.a(a,b):null};
G.h=function(a,b,c){return null!=a?null!=a&&(a.v&256||a.Re)?a.M(null,b,c):nb(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:w(Kb,a)?Lb.h(a,b,c):c:c};G.I=3;Kd;var Ld=function Ld(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ld.h(arguments[0],arguments[1],arguments[2]);default:return Ld.A(arguments[0],arguments[1],arguments[2],new J(c.slice(3),0))}};Ld.h=function(a,b,c){return null!=a?Nb(a,b,c):Md([b],[c])};
Ld.A=function(a,b,c,d){for(;;)if(a=Ld.h(a,b,c),t(d))b=L(d),c=Ed(d),d=N(N(d));else return a};Ld.L=function(a){var b=L(a),c=N(a);a=L(c);var d=N(c),c=L(d),d=N(d);return Ld.A(b,a,c,d)};Ld.I=3;var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Nd.g(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.A(arguments[0],arguments[1],new J(c.slice(2),0))}};Nd.g=function(a){return a};
Nd.a=function(a,b){return null==a?null:Qb(a,b)};Nd.A=function(a,b,c){for(;;){if(null==a)return null;a=Nd.a(a,b);if(t(c))b=L(c),c=N(c);else return a}};Nd.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return Nd.A(b,a,c)};Nd.I=2;function Od(a){var b=ka(a);return b?b:null!=a?a.ge?!0:a.Od?!1:w(vb,a):w(vb,a)}function Pd(a,b){this.w=a;this.C=b;this.v=393217;this.K=0}g=Pd.prototype;g.R=function(){return this.C};g.S=function(a,b){return new Pd(this.w,b)};g.ge=!0;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia,Oa){a=this;return A.Gb?A.Gb(a.w,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia,Oa):A.call(null,a.w,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia,Oa)}function b(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia){a=this;return a.w.qb?a.w.qb(b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T,ia)}function c(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T){a=this;return a.w.pb?a.w.pb(b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,
E,D,I,T):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I,T)}function d(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I){a=this;return a.w.ob?a.w.ob(b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D,I)}function e(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D){a=this;return a.w.nb?a.w.nb(b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E,D)}function f(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E){a=this;return a.w.mb?a.w.mb(b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E):a.w.call(null,
b,c,d,e,f,h,k,l,m,n,r,v,y,C,F,E)}function h(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F){a=this;return a.w.lb?a.w.lb(b,c,d,e,f,h,k,l,m,n,r,v,y,C,F):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C,F)}function k(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C){a=this;return a.w.kb?a.w.kb(b,c,d,e,f,h,k,l,m,n,r,v,y,C):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y,C)}function l(a,b,c,d,e,f,h,k,l,m,n,r,v,y){a=this;return a.w.jb?a.w.jb(b,c,d,e,f,h,k,l,m,n,r,v,y):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v,y)}function m(a,b,c,d,e,f,h,k,l,m,n,r,v){a=this;
return a.w.ib?a.w.ib(b,c,d,e,f,h,k,l,m,n,r,v):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r,v)}function n(a,b,c,d,e,f,h,k,l,m,n,r){a=this;return a.w.hb?a.w.hb(b,c,d,e,f,h,k,l,m,n,r):a.w.call(null,b,c,d,e,f,h,k,l,m,n,r)}function r(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.w.gb?a.w.gb(b,c,d,e,f,h,k,l,m,n):a.w.call(null,b,c,d,e,f,h,k,l,m,n)}function v(a,b,c,d,e,f,h,k,l,m){a=this;return a.w.sb?a.w.sb(b,c,d,e,f,h,k,l,m):a.w.call(null,b,c,d,e,f,h,k,l,m)}function y(a,b,c,d,e,f,h,k,l){a=this;return a.w.rb?a.w.rb(b,c,
d,e,f,h,k,l):a.w.call(null,b,c,d,e,f,h,k,l)}function C(a,b,c,d,e,f,h,k){a=this;return a.w.Pa?a.w.Pa(b,c,d,e,f,h,k):a.w.call(null,b,c,d,e,f,h,k)}function E(a,b,c,d,e,f,h){a=this;return a.w.Oa?a.w.Oa(b,c,d,e,f,h):a.w.call(null,b,c,d,e,f,h)}function F(a,b,c,d,e,f){a=this;return a.w.aa?a.w.aa(b,c,d,e,f):a.w.call(null,b,c,d,e,f)}function I(a,b,c,d,e){a=this;return a.w.J?a.w.J(b,c,d,e):a.w.call(null,b,c,d,e)}function T(a,b,c,d){a=this;return a.w.h?a.w.h(b,c,d):a.w.call(null,b,c,d)}function ia(a,b,c){a=
this;return a.w.a?a.w.a(b,c):a.w.call(null,b,c)}function Oa(a,b){a=this;return a.w.g?a.w.g(b):a.w.call(null,b)}function Wb(a){a=this;return a.w.o?a.w.o():a.w.call(null)}var D=null,D=function(D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne,Nf,xj){switch(arguments.length){case 1:return Wb.call(this,D);case 2:return Oa.call(this,D,ea);case 3:return ia.call(this,D,ea,ga);case 4:return T.call(this,D,ea,ga,ja);case 5:return I.call(this,D,ea,ga,ja,oa);case 6:return F.call(this,D,ea,ga,ja,oa,ua);
case 7:return E.call(this,D,ea,ga,ja,oa,ua,Gb);case 8:return C.call(this,D,ea,ga,ja,oa,ua,Gb,Da);case 9:return y.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha);case 10:return v.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za);case 11:return r.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va);case 12:return n.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb);case 13:return m.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib);case 14:return l.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb);case 15:return k.call(this,D,ea,ga,ja,
oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb);case 16:return h.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb);case 17:return f.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc);case 18:return e.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc);case 19:return d.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd);case 20:return c.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne);case 21:return b.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,
ib,pb,xb,Pb,fc,Fc,kd,ne,Nf);case 22:return a.call(this,D,ea,ga,ja,oa,ua,Gb,Da,Ha,za,Va,bb,ib,pb,xb,Pb,fc,Fc,kd,ne,Nf,xj)}throw Error("Invalid arity: "+arguments.length);};D.g=Wb;D.a=Oa;D.h=ia;D.J=T;D.aa=I;D.Oa=F;D.Pa=E;D.rb=C;D.sb=y;D.gb=v;D.hb=r;D.ib=n;D.jb=m;D.kb=l;D.lb=k;D.mb=h;D.nb=f;D.ob=e;D.pb=d;D.qb=c;D.Kd=b;D.Gb=a;return D}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.o=function(){return this.w.o?this.w.o():this.w.call(null)};
g.g=function(a){return this.w.g?this.w.g(a):this.w.call(null,a)};g.a=function(a,b){return this.w.a?this.w.a(a,b):this.w.call(null,a,b)};g.h=function(a,b,c){return this.w.h?this.w.h(a,b,c):this.w.call(null,a,b,c)};g.J=function(a,b,c,d){return this.w.J?this.w.J(a,b,c,d):this.w.call(null,a,b,c,d)};g.aa=function(a,b,c,d,e){return this.w.aa?this.w.aa(a,b,c,d,e):this.w.call(null,a,b,c,d,e)};g.Oa=function(a,b,c,d,e,f){return this.w.Oa?this.w.Oa(a,b,c,d,e,f):this.w.call(null,a,b,c,d,e,f)};
g.Pa=function(a,b,c,d,e,f,h){return this.w.Pa?this.w.Pa(a,b,c,d,e,f,h):this.w.call(null,a,b,c,d,e,f,h)};g.rb=function(a,b,c,d,e,f,h,k){return this.w.rb?this.w.rb(a,b,c,d,e,f,h,k):this.w.call(null,a,b,c,d,e,f,h,k)};g.sb=function(a,b,c,d,e,f,h,k,l){return this.w.sb?this.w.sb(a,b,c,d,e,f,h,k,l):this.w.call(null,a,b,c,d,e,f,h,k,l)};g.gb=function(a,b,c,d,e,f,h,k,l,m){return this.w.gb?this.w.gb(a,b,c,d,e,f,h,k,l,m):this.w.call(null,a,b,c,d,e,f,h,k,l,m)};
g.hb=function(a,b,c,d,e,f,h,k,l,m,n){return this.w.hb?this.w.hb(a,b,c,d,e,f,h,k,l,m,n):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.ib=function(a,b,c,d,e,f,h,k,l,m,n,r){return this.w.ib?this.w.ib(a,b,c,d,e,f,h,k,l,m,n,r):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r)};g.jb=function(a,b,c,d,e,f,h,k,l,m,n,r,v){return this.w.jb?this.w.jb(a,b,c,d,e,f,h,k,l,m,n,r,v):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v)};
g.kb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y){return this.w.kb?this.w.kb(a,b,c,d,e,f,h,k,l,m,n,r,v,y):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y)};g.lb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C){return this.w.lb?this.w.lb(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C)};g.mb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E){return this.w.mb?this.w.mb(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E)};
g.nb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F){return this.w.nb?this.w.nb(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F)};g.ob=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I){return this.w.ob?this.w.ob(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I)};
g.pb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T){return this.w.pb?this.w.pb(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T)};g.qb=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia){return this.w.qb?this.w.qb(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia):this.w.call(null,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia)};
g.Kd=function(a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa){return A.Gb?A.Gb(this.w,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa):A.call(null,this.w,a,b,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa)};function pd(a,b){return ka(a)?new Pd(a,b):null==a?null:dc(a,b)}function Qd(a){var b=null!=a;return(b?null!=a?a.v&131072||a.Ue||(a.v?0:w(ac,a)):w(ac,a):b)?bc(a):null}function Rd(a){return null==a?!1:null!=a?a.v&8||a.vf?!0:a.v?!1:w(Cb,a):w(Cb,a)}
function Sd(a){return null==a?!1:null!=a?a.v&4096||a.Cf?!0:a.v?!1:w(Ub,a):w(Ub,a)}function Td(a){return null!=a?a.v&16777216||a.Bf?!0:a.v?!1:w(mc,a):w(mc,a)}function Ud(a){return null==a?!1:null!=a?a.v&1024||a.Se?!0:a.v?!1:w(Ob,a):w(Ob,a)}function Vd(a){return null!=a?a.v&16384||a.Df?!0:a.v?!1:w(Yb,a):w(Yb,a)}Wd;Xd;function Yd(a){return null!=a?a.K&512||a.uf?!0:!1:!1}function Zd(a){var b=[];xa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}
function $d(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var ae={};function be(a){return null==a?!1:null!=a?a.v&64||a.na?!0:a.v?!1:w(Fb,a):w(Fb,a)}function ce(a){return null==a?!1:!1===a?!1:!0}function de(a){var b=Od(a);return b?b:null!=a?a.v&1||a.yf?!0:a.v?!1:w(wb,a):w(wb,a)}function ee(a,b){return G.h(a,b,ae)===ae?!1:!0}
function Sc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return Ta(a,b);throw Error([z("Cannot compare "),z(a),z(" to "),z(b)].join(""));}if(null!=a?a.K&2048||a.Zb||(a.K?0:w(yc,a)):w(yc,a))return zc(a,b);if("string"!==typeof a&&!nb(a)&&!0!==a&&!1!==a||qb(a)!==qb(b))throw Error([z("Cannot compare "),z(a),z(" to "),z(b)].join(""));return Ta(a,b)}
function fe(a,b){var c=Q(a),d=Q(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=Sc(Jd(a,d),Jd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function ge(a){return Rc.a(a,Sc)?Sc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:t(d)?-1:t(a.a?a.a(c,b):a.call(null,c,b))?1:0}}he;function ie(a,b){if(K(b)){var c=he.g?he.g(b):he.call(null,b),d=ge(a);Ua(c,d);return K(c)}return M}
function je(a,b){var c=Sc;return ie(function(b,e){return ge(c).call(null,a.g?a.g(b):a.call(null,b),a.g?a.g(e):a.call(null,e))},b)}var Dd=function Dd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Dd.a(arguments[0],arguments[1]);case 3:return Dd.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Dd.a=function(a,b){var c=K(b);if(c){var d=L(c),c=N(c);return ub.h?ub.h(a,d,c):ub.call(null,a,d,c)}return a.o?a.o():a.call(null)};Dd.h=function(a,b,c){for(c=K(c);;)if(c){var d=L(c);b=a.a?a.a(b,d):a.call(null,b,d);if(rd(b))return $b(b);c=N(c)}else return b};Dd.I=3;ke;
var ub=function ub(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ub.a(arguments[0],arguments[1]);case 3:return ub.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};ub.a=function(a,b){return null!=b&&(b.v&524288||b.We)?b.va(null,a):nb(b)?ud(b,a):"string"===typeof b?ud(b,a):w(ec,b)?gc.a(b,a):Dd.a(a,b)};
ub.h=function(a,b,c){return null!=c&&(c.v&524288||c.We)?c.wa(null,a,b):nb(c)?vd(c,a,b):"string"===typeof c?vd(c,a,b):w(ec,c)?gc.h(c,a,b):Dd.h(a,b,c)};ub.I=3;function le(a,b){var c=["^ "];return null!=b?hc(b,a,c):c}function me(a){return a}
var oe=function oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return oe.o();case 1:return oe.g(arguments[0]);case 2:return oe.a(arguments[0],arguments[1]);default:return oe.A(arguments[0],arguments[1],new J(c.slice(2),0))}};oe.o=function(){return 0};oe.g=function(a){return a};oe.a=function(a,b){return a+b};oe.A=function(a,b,c){return ub.h(oe,a+b,c)};oe.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return oe.A(b,a,c)};oe.I=2;Wa.Kf;
var pe=function pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pe.g(arguments[0]);case 2:return pe.a(arguments[0],arguments[1]);default:return pe.A(arguments[0],arguments[1],new J(c.slice(2),0))}};pe.g=function(){return!0};pe.a=function(a,b){return a<b};pe.A=function(a,b,c){for(;;)if(a<b)if(N(c))a=b,b=L(c),c=N(c);else return b<L(c);else return!1};pe.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return pe.A(b,a,c)};pe.I=2;
var qe=function qe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return qe.g(arguments[0]);case 2:return qe.a(arguments[0],arguments[1]);default:return qe.A(arguments[0],arguments[1],new J(c.slice(2),0))}};qe.g=function(){return!0};qe.a=function(a,b){return a>b};qe.A=function(a,b,c){for(;;)if(a>b)if(N(c))a=b,b=L(c),c=N(c);else return b>L(c);else return!1};qe.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return qe.A(b,a,c)};qe.I=2;
function re(a){return a-1}var se=function se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return se.g(arguments[0]);case 2:return se.a(arguments[0],arguments[1]);default:return se.A(arguments[0],arguments[1],new J(c.slice(2),0))}};se.g=function(a){return a};se.a=function(a,b){return a>b?a:b};se.A=function(a,b,c){return ub.h(se,a>b?a:b,c)};se.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return se.A(b,a,c)};se.I=2;
var te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return te.g(arguments[0]);case 2:return te.a(arguments[0],arguments[1]);default:return te.A(arguments[0],arguments[1],new J(c.slice(2),0))}};te.g=function(a){return a};te.a=function(a,b){return a<b?a:b};te.A=function(a,b,c){return ub.h(te,a<b?a:b,c)};te.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return te.A(b,a,c)};te.I=2;ue;function ve(a){return a|0}
function ue(a,b){return(a%b+b)%b}function we(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function xe(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function ye(a){return 0<a}function ze(a){var b=2;for(a=K(a);;)if(a&&0<b)--b,a=N(a);else return a}
var z=function z(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return z.o();case 1:return z.g(arguments[0]);default:return z.A(arguments[0],new J(c.slice(1),0))}};z.o=function(){return""};z.g=function(a){return null==a?"":""+a};z.A=function(a,b){for(var c=new Ga(""+z(a)),d=b;;)if(t(d))c=c.append(""+z(L(d))),d=N(d);else return c.toString()};z.L=function(a){var b=L(a);a=N(a);return z.A(b,a)};z.I=1;S;Ae;
function od(a,b){var c;if(Td(b))if(Ad(a)&&Ad(b)&&Q(a)!==Q(b))c=!1;else a:{c=K(a);for(var d=K(b);;){if(null==c){c=null==d;break a}if(null!=d&&Rc.a(L(c),L(d)))c=N(c),d=N(d);else{c=!1;break a}}}else c=null;return ce(c)}function xd(a){if(K(a)){var b=Xc(L(a));for(a=N(a);;){if(null==a)return b;b=Yc(b,Xc(L(a)));a=N(a)}}else return 0}Be;Ce;function De(a){var b=0;for(a=K(a);;)if(a){var c=L(a),b=(b+(Xc(Be.g?Be.g(c):Be.call(null,c))^Xc(Ce.g?Ce.g(c):Ce.call(null,c))))%4503599627370496;a=N(a)}else return b}Ae;
Ee;Fe;function zd(a,b,c,d,e){this.C=a;this.first=b;this.Fa=c;this.count=d;this.s=e;this.v=65937646;this.K=8192}g=zd.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};g.sa=function(){return new zd(this.C,this.first,this.Fa,this.count,this.s)};g.Ha=function(){return 1===this.count?null:this.Fa};g.Y=function(){return this.count};g.Pb=function(){return this.first};g.Qb=function(){return Ib(this)};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return dc(M,this.C)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return this.first};g.xa=function(){return 1===this.count?M:this.Fa};g.U=function(){return this};g.S=function(a,b){return new zd(b,this.first,this.Fa,this.count,this.s)};g.V=function(a,b){return new zd(this.C,b,this,this.count+1,null)};zd.prototype[sb]=function(){return ed(this)};
function Ge(a){this.C=a;this.v=65937614;this.K=8192}g=Ge.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};g.sa=function(){return new Ge(this.C)};g.Ha=function(){return null};g.Y=function(){return 0};g.Pb=function(){return null};g.Qb=function(){throw Error("Can't pop empty list");};g.P=function(){return jd};g.G=function(a,b){return(null!=b?b.v&33554432||b.zf||(b.v?0:w(nc,b)):w(nc,b))||Td(b)?null==K(b):!1};g.ma=function(){return this};
g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return null};g.xa=function(){return M};g.U=function(){return null};g.S=function(a,b){return new Ge(b)};g.V=function(a,b){return new zd(this.C,b,null,1,null)};var M=new Ge(null);Ge.prototype[sb]=function(){return ed(this)};function He(a){return(null!=a?a.v&134217728||a.Af||(a.v?0:w(oc,a)):w(oc,a))?pc(a):ub.h(Gd,M,a)}
var Pc=function Pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Pc.A(0<c.length?new J(c.slice(0),0):null)};Pc.A=function(a){var b;if(a instanceof J&&0===a.F)b=a.l;else a:for(b=[];;)if(null!=a)b.push(a.qa(null)),a=a.Ha(null);else break a;a=b.length;for(var c=M;;)if(0<a){var d=a-1,c=c.V(null,b[a-1]);a=d}else return c};Pc.I=0;Pc.L=function(a){return Pc.A(K(a))};function Ie(a,b,c,d){this.C=a;this.first=b;this.Fa=c;this.s=d;this.v=65929452;this.K=8192}g=Ie.prototype;
g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};g.sa=function(){return new Ie(this.C,this.first,this.Fa,this.s)};g.Ha=function(){return null==this.Fa?null:K(this.Fa)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return this.first};
g.xa=function(){return null==this.Fa?M:this.Fa};g.U=function(){return this};g.S=function(a,b){return new Ie(b,this.first,this.Fa,this.s)};g.V=function(a,b){return new Ie(null,b,this,this.s)};Ie.prototype[sb]=function(){return ed(this)};function P(a,b){var c=null==b;return(c?c:null!=b&&(b.v&64||b.na))?new Ie(null,a,b,null):new Ie(null,a,K(b),null)}
function Je(a,b){if(a.Ba===b.Ba)return 0;var c=ob(a.Ka);if(t(c?b.Ka:c))return-1;if(t(a.Ka)){if(ob(b.Ka))return 1;c=Ta(a.Ka,b.Ka);return 0===c?Ta(a.name,b.name):c}return Ta(a.name,b.name)}function u(a,b,c,d){this.Ka=a;this.name=b;this.Ba=c;this.kc=d;this.v=2153775105;this.K=4096}g=u.prototype;g.toString=function(){return[z(":"),z(this.Ba)].join("")};g.equiv=function(a){return this.G(null,a)};g.G=function(a,b){return b instanceof u?this.Ba===b.Ba:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return G.a(c,this);case 3:return G.h(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return G.a(c,this)};a.h=function(a,c,d){return G.h(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return G.a(a,this)};g.a=function(a,b){return G.h(a,this,b)};
g.P=function(){var a=this.kc;return null!=a?a:this.kc=a=Yc(Oc(this.name),Wc(this.Ka))+2654435769|0};g.O=function(a,b){return qc(b,[z(":"),z(this.Ba)].join(""))};function U(a,b){return a===b?!0:a instanceof u&&b instanceof u?a.Ba===b.Ba:!1}
var Ke=function Ke(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ke.g(arguments[0]);case 2:return Ke.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Ke.g=function(a){if(a instanceof u)return a;if(a instanceof Qc){var b;if(null!=a&&(a.K&4096||a.Ve))b=a.Ka;else throw Error([z("Doesn't support namespace: "),z(a)].join(""));return new u(b,Ae.g?Ae.g(a):Ae.call(null,a),a.La,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new u(b[0],b[1],a,null):new u(null,b[0],a,null)):null};Ke.a=function(a,b){return new u(a,b,[z(t(a)?[z(a),z("/")].join(""):null),z(b)].join(""),null)};Ke.I=2;
function Le(a,b,c,d){this.C=a;this.uc=b;this.T=c;this.s=d;this.v=32374988;this.K=0}g=Le.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};function Me(a){null!=a.uc&&(a.T=a.uc.o?a.uc.o():a.uc.call(null),a.uc=null);return a.T}g.R=function(){return this.C};g.Ha=function(){lc(this);return null==this.T?null:N(this.T)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};
g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){lc(this);return null==this.T?null:L(this.T)};g.xa=function(){lc(this);return null!=this.T?cd(this.T):M};g.U=function(){Me(this);if(null==this.T)return null;for(var a=this.T;;)if(a instanceof Le)a=Me(a);else return this.T=a,K(this.T)};g.S=function(a,b){return new Le(b,this.uc,this.T,this.s)};g.V=function(a,b){return P(b,this)};Le.prototype[sb]=function(){return ed(this)};Ne;
function Oe(a,b){this.X=a;this.end=b;this.v=2;this.K=0}Oe.prototype.add=function(a){this.X[this.end]=a;return this.end+=1};Oe.prototype.ua=function(){var a=new Ne(this.X,0,this.end);this.X=null;return a};Oe.prototype.Y=function(){return this.end};function Pe(a){return new Oe(Array(a),0)}function Ne(a,b,c){this.l=a;this.Ca=b;this.end=c;this.v=524306;this.K=0}g=Ne.prototype;g.Y=function(){return this.end-this.Ca};g.ca=function(a,b){return this.l[this.Ca+b]};
g.Ma=function(a,b,c){return 0<=b&&b<this.end-this.Ca?this.l[this.Ca+b]:c};g.he=function(){if(this.Ca===this.end)throw Error("-drop-first of empty chunk");return new Ne(this.l,this.Ca+1,this.end)};g.va=function(a,b){return wd(this.l,b,this.l[this.Ca],this.Ca+1)};g.wa=function(a,b,c){return wd(this.l,b,c,this.Ca)};function Wd(a,b,c,d){this.ua=a;this.Cb=b;this.C=c;this.s=d;this.v=31850732;this.K=1536}g=Wd.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};
g.R=function(){return this.C};g.Ha=function(){if(1<Ab(this.ua))return new Wd(Ac(this.ua),this.Cb,this.C,null);var a=lc(this.Cb);return null==a?null:a};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.qa=function(){return B.a(this.ua,0)};g.xa=function(){return 1<Ab(this.ua)?new Wd(Ac(this.ua),this.Cb,this.C,null):null==this.Cb?M:this.Cb};g.U=function(){return this};g.Id=function(){return this.ua};
g.Jd=function(){return null==this.Cb?M:this.Cb};g.S=function(a,b){return new Wd(this.ua,this.Cb,b,this.s)};g.V=function(a,b){return P(b,this)};g.Hd=function(){return null==this.Cb?null:this.Cb};Wd.prototype[sb]=function(){return ed(this)};function Qe(a,b){return 0===Ab(a)?b:new Wd(a,b,null,null)}function Re(a,b){a.add(b)}function Ee(a){return Bc(a)}function Fe(a){return Cc(a)}function he(a){for(var b=[];;)if(K(a))b.push(L(a)),a=N(a);else return b}
function Se(a){if("number"===typeof a)a:{var b=Array(a);if(be(null))for(var c=0,d=K(null);;)if(d&&c<a)b[c]=L(d),c+=1,d=N(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=kb.g(a);return a}function Te(a,b){if(Ad(a))return Q(a);for(var c=a,d=b,e=0;;)if(0<d&&K(c))c=N(c),--d,e+=1;else return e}
var Ue=function Ue(b){return null==b?null:null==N(b)?K(L(b)):P(L(b),Ue(N(b)))},Ve=function Ve(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ve.o();case 1:return Ve.g(arguments[0]);case 2:return Ve.a(arguments[0],arguments[1]);default:return Ve.A(arguments[0],arguments[1],new J(c.slice(2),0))}};Ve.o=function(){return new Le(null,function(){return null},null,null)};Ve.g=function(a){return new Le(null,function(){return a},null,null)};
Ve.a=function(a,b){return new Le(null,function(){var c=K(a);return c?Yd(c)?Qe(Bc(c),Ve.a(Cc(c),b)):P(L(c),Ve.a(cd(c),b)):b},null,null)};Ve.A=function(a,b,c){return function e(a,b){return new Le(null,function(){var c=K(a);return c?Yd(c)?Qe(Bc(c),e(Cc(c),b)):P(L(c),e(cd(c),b)):t(b)?e(L(b),N(b)):null},null,null)}(Ve.a(a,b),c)};Ve.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return Ve.A(b,a,c)};Ve.I=2;function We(a){return vc(a)}
var Xe=function Xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Xe.o();case 1:return Xe.g(arguments[0]);case 2:return Xe.a(arguments[0],arguments[1]);default:return Xe.A(arguments[0],arguments[1],new J(c.slice(2),0))}};Xe.o=function(){return tc(Hd)};Xe.g=function(a){return a};Xe.a=function(a,b){return uc(a,b)};Xe.A=function(a,b,c){for(;;)if(a=uc(a,b),t(c))b=L(c),c=N(c);else return a};
Xe.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return Xe.A(b,a,c)};Xe.I=2;
function Ye(a,b,c){var d=K(c);if(0===b)return a.o?a.o():a.call(null);c=Hb(d);var e=Ib(d);if(1===b)return a.g?a.g(c):a.g?a.g(c):a.call(null,c);var d=Hb(e),f=Ib(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=Hb(f),h=Ib(f);if(3===b)return a.h?a.h(c,d,e):a.h?a.h(c,d,e):a.call(null,c,d,e);var f=Hb(h),k=Ib(h);if(4===b)return a.J?a.J(c,d,e,f):a.J?a.J(c,d,e,f):a.call(null,c,d,e,f);var h=Hb(k),l=Ib(k);if(5===b)return a.aa?a.aa(c,d,e,f,h):a.aa?a.aa(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=
Hb(l),m=Ib(l);if(6===b)return a.Oa?a.Oa(c,d,e,f,h,k):a.Oa?a.Oa(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Hb(m),n=Ib(m);if(7===b)return a.Pa?a.Pa(c,d,e,f,h,k,l):a.Pa?a.Pa(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Hb(n),r=Ib(n);if(8===b)return a.rb?a.rb(c,d,e,f,h,k,l,m):a.rb?a.rb(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Hb(r),v=Ib(r);if(9===b)return a.sb?a.sb(c,d,e,f,h,k,l,m,n):a.sb?a.sb(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var r=Hb(v),y=Ib(v);if(10===b)return a.gb?a.gb(c,
d,e,f,h,k,l,m,n,r):a.gb?a.gb(c,d,e,f,h,k,l,m,n,r):a.call(null,c,d,e,f,h,k,l,m,n,r);var v=Hb(y),C=Ib(y);if(11===b)return a.hb?a.hb(c,d,e,f,h,k,l,m,n,r,v):a.hb?a.hb(c,d,e,f,h,k,l,m,n,r,v):a.call(null,c,d,e,f,h,k,l,m,n,r,v);var y=Hb(C),E=Ib(C);if(12===b)return a.ib?a.ib(c,d,e,f,h,k,l,m,n,r,v,y):a.ib?a.ib(c,d,e,f,h,k,l,m,n,r,v,y):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y);var C=Hb(E),F=Ib(E);if(13===b)return a.jb?a.jb(c,d,e,f,h,k,l,m,n,r,v,y,C):a.jb?a.jb(c,d,e,f,h,k,l,m,n,r,v,y,C):a.call(null,c,d,e,f,h,k,l,
m,n,r,v,y,C);var E=Hb(F),I=Ib(F);if(14===b)return a.kb?a.kb(c,d,e,f,h,k,l,m,n,r,v,y,C,E):a.kb?a.kb(c,d,e,f,h,k,l,m,n,r,v,y,C,E):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y,C,E);var F=Hb(I),T=Ib(I);if(15===b)return a.lb?a.lb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F):a.lb?a.lb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F);var I=Hb(T),ia=Ib(T);if(16===b)return a.mb?a.mb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I):a.mb?a.mb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I);var T=
Hb(ia),Oa=Ib(ia);if(17===b)return a.nb?a.nb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T):a.nb?a.nb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T);var ia=Hb(Oa),Wb=Ib(Oa);if(18===b)return a.ob?a.ob(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia):a.ob?a.ob(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia);Oa=Hb(Wb);Wb=Ib(Wb);if(19===b)return a.pb?a.pb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa):a.pb?a.pb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa):a.call(null,
c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa);var D=Hb(Wb);Ib(Wb);if(20===b)return a.qb?a.qb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa,D):a.qb?a.qb(c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa,D):a.call(null,c,d,e,f,h,k,l,m,n,r,v,y,C,E,F,I,T,ia,Oa,D);throw Error("Only up to 20 arguments supported on functions");}
var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return A.a(arguments[0],arguments[1]);case 3:return A.h(arguments[0],arguments[1],arguments[2]);case 4:return A.J(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return A.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return A.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new J(c.slice(5),0))}};
A.a=function(a,b){var c=a.I;if(a.L){var d=Te(b,c+1);return d<=c?Ye(a,d,b):a.L(b)}return a.apply(a,he(b))};A.h=function(a,b,c){b=P(b,c);c=a.I;if(a.L){var d=Te(b,c+1);return d<=c?Ye(a,d,b):a.L(b)}return a.apply(a,he(b))};A.J=function(a,b,c,d){b=P(b,P(c,d));c=a.I;return a.L?(d=Te(b,c+1),d<=c?Ye(a,d,b):a.L(b)):a.apply(a,he(b))};A.aa=function(a,b,c,d,e){b=P(b,P(c,P(d,e)));c=a.I;return a.L?(d=Te(b,c+1),d<=c?Ye(a,d,b):a.L(b)):a.apply(a,he(b))};
A.A=function(a,b,c,d,e,f){b=P(b,P(c,P(d,P(e,Ue(f)))));c=a.I;return a.L?(d=Te(b,c+1),d<=c?Ye(a,d,b):a.L(b)):a.apply(a,he(b))};A.L=function(a){var b=L(a),c=N(a);a=L(c);var d=N(c),c=L(d),e=N(d),d=L(e),f=N(e),e=L(f),f=N(f);return A.A(b,a,c,d,e,f)};A.I=5;function Ze(a){return K(a)?a:null}
var $e=function $e(){"undefined"===typeof Xa&&(Xa=function(b,c){this.mf=b;this.kf=c;this.v=393216;this.K=0},Xa.prototype.S=function(b,c){return new Xa(this.mf,c)},Xa.prototype.R=function(){return this.kf},Xa.prototype.za=function(){return!1},Xa.prototype.next=function(){return Error("No such element")},Xa.prototype.remove=function(){return Error("Unsupported operation")},Xa.Sd=function(){return new V(null,2,5,W,[pd(af,new q(null,1,[bf,Pc(cf,Pc(Hd))],null)),Wa.Jf],null)},Xa.Kc=!0,Xa.bc="cljs.core/t_cljs$core19412",
Xa.gd=function(b,c){return qc(c,"cljs.core/t_cljs$core19412")});return new Xa($e,X)};df;function df(a,b,c,d){this.Ac=a;this.first=b;this.Fa=c;this.C=d;this.v=31719628;this.K=0}g=df.prototype;g.S=function(a,b){return new df(this.Ac,this.first,this.Fa,b)};g.V=function(a,b){return P(b,lc(this))};g.ma=function(){return M};g.G=function(a,b){return null!=lc(this)?od(this,b):Td(b)&&null==K(b)};g.P=function(){return id(this)};g.U=function(){null!=this.Ac&&this.Ac.step(this);return null==this.Fa?null:this};
g.qa=function(){null!=this.Ac&&lc(this);return null==this.Fa?null:this.first};g.xa=function(){null!=this.Ac&&lc(this);return null==this.Fa?M:this.Fa};g.Ha=function(){null!=this.Ac&&lc(this);return null==this.Fa?null:lc(this.Fa)};df.prototype[sb]=function(){return ed(this)};function ef(a,b){for(;;){if(null==K(b))return!0;var c;c=L(b);c=a.g?a.g(c):a.call(null,c);if(t(c)){c=a;var d=N(b);a=c;b=d}else return!1}}
function ff(a,b){for(;;)if(K(b)){var c;c=L(b);c=a.g?a.g(c):a.call(null,c);if(t(c))return c;c=a;var d=N(b);a=c;b=d}else return null}
function gf(a){return function(){function b(b,c){return ob(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return ob(a.g?a.g(b):a.call(null,b))}function d(){return ob(a.o?a.o():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new J(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return ob(A.J(a,b,d,e))}b.I=2;b.L=function(a){var b=L(a);a=N(a);var d=L(a);a=cd(a);return c(b,d,a)};b.A=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new J(n,0)}return f.A(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.I=2;e.L=f.L;e.o=d;e.g=c;e.a=b;e.A=f.A;return e}()}
function hf(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.I=0;a.L=function(a){K(a);return!1};a.A=function(){return!1};return a}()}
var jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return jf.o();case 1:return jf.g(arguments[0]);case 2:return jf.a(arguments[0],arguments[1]);case 3:return jf.h(arguments[0],arguments[1],arguments[2]);default:return jf.A(arguments[0],arguments[1],arguments[2],new J(c.slice(3),0))}};jf.o=function(){return me};jf.g=function(a){return a};
jf.a=function(a,b){return function(){function c(c,d,e){c=b.h?b.h(c,d,e):b.call(null,c,d,e);return a.g?a.g(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.g?a.g(e):a.call(null,e)}function e(c){c=b.g?b.g(c):b.call(null,c);return a.g?a.g(c):a.call(null,c)}function f(){var c=b.o?b.o():b.call(null);return a.g?a.g(c):a.call(null,c)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new J(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){c=A.aa(b,c,e,f,h);return a.g?a.g(c):a.call(null,c)}c.I=3;c.L=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var e=L(a);a=cd(a);return d(b,c,e,a)};c.A=d;return c}(),h=function(a,b,h,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var v=null;if(3<arguments.length){for(var v=0,y=Array(arguments.length-3);v<y.length;)y[v]=arguments[v+
3],++v;v=new J(y,0)}return k.A(a,b,h,v)}throw Error("Invalid arity: "+arguments.length);};h.I=3;h.L=k.L;h.o=f;h.g=e;h.a=d;h.h=c;h.A=k.A;return h}()};
jf.h=function(a,b,c){return function(){function d(d,e,f){d=c.h?c.h(d,e,f):c.call(null,d,e,f);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.g?b.g(f):b.call(null,f);return a.g?a.g(f):a.call(null,f)}function f(d){d=c.g?c.g(d):c.call(null,d);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}function h(){var d;d=c.o?c.o():c.call(null);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new J(k,0)}return e.call(this,a,b,c,h)}function e(d,f,h,k){d=A.aa(c,d,f,h,k);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}d.I=3;d.L=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var d=L(a);a=cd(a);return e(b,c,d,a)};d.A=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var y=null;if(3<arguments.length){for(var y=0,C=Array(arguments.length-3);y<C.length;)C[y]=arguments[y+3],++y;y=new J(C,0)}return l.A(a,b,c,y)}throw Error("Invalid arity: "+arguments.length);};k.I=3;k.L=l.L;k.o=h;k.g=f;k.a=e;k.h=d;k.A=l.A;return k}()};
jf.A=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return c.call(this,d)}function c(b){b=A.a(L(a),b);for(var d=N(a);;)if(d)b=L(d).call(null,b),d=N(d);else return b}b.I=0;b.L=function(a){a=K(a);return c(a)};b.A=c;return b}()}(He(P(a,P(b,P(c,d)))))};jf.L=function(a){var b=L(a),c=N(a);a=L(c);var d=N(c),c=L(d),d=N(d);return jf.A(b,a,c,d)};jf.I=3;
function kf(a){var b=lf;return function(){function c(c,d,e){return b.J?b.J(a,c,d,e):b.call(null,a,c,d,e)}function d(c,d){return b.h?b.h(a,c,d):b.call(null,a,c,d)}function e(c){return b.a?b.a(a,c):b.call(null,a,c)}function f(){return b.g?b.g(a):b.call(null,a)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new J(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){return A.A(b,a,c,e,f,H([h],
0))}c.I=3;c.L=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var e=L(a);a=cd(a);return d(b,c,e,a)};c.A=d;return c}(),h=function(a,b,h,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var v=null;if(3<arguments.length){for(var v=0,y=Array(arguments.length-3);v<y.length;)y[v]=arguments[v+3],++v;v=new J(y,0)}return k.A(a,b,h,v)}throw Error("Invalid arity: "+arguments.length);};h.I=3;h.L=k.L;h.o=
f;h.g=e;h.a=d;h.h=c;h.A=k.A;return h}()}mf;function nf(a,b){return function d(b,f){return new Le(null,function(){var h=K(f);if(h){if(Yd(h)){for(var k=Bc(h),l=Q(k),m=Pe(l),n=0;;)if(n<l)Re(m,function(){var d=b+n,f=B.a(k,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return Qe(m.ua(),d(b+l,Cc(h)))}return P(function(){var d=L(h);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,cd(h)))}return null},null,null)}(0,b)}
function of(a,b,c,d){this.state=a;this.C=b;this.sf=c;this.He=d;this.K=16386;this.v=6455296}g=of.prototype;g.equiv=function(a){return this.G(null,a)};g.G=function(a,b){return this===b};g.oc=function(){return this.state};g.R=function(){return this.C};
g.ke=function(a,b,c){a=K(this.He);for(var d=null,e=0,f=0;;)if(f<e){var h=d.ca(null,f),k=R(h,0),h=R(h,1);h.J?h.J(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=K(a))Yd(a)?(d=Bc(a),a=Cc(a),k=d,e=Q(d),d=k):(d=L(a),k=R(d,0),h=R(d,1),h.J?h.J(k,this,b,c):h.call(null,k,this,b,c),a=N(a),d=null,e=0),f=0;else return null};g.P=function(){return this[la]||(this[la]=++ma)};
var pf=function pf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pf.g(arguments[0]);default:return pf.A(arguments[0],new J(c.slice(1),0))}};pf.g=function(a){return new of(a,null,null,null)};pf.A=function(a,b){var c=null!=b&&(b.v&64||b.na)?A.a(nd,b):b,d=G.a(c,gb),c=G.a(c,qf);return new of(a,d,c,null)};pf.L=function(a){var b=L(a);a=N(a);return pf.A(b,a)};pf.I=1;rf;
function sf(a,b){if(a instanceof of){var c=a.sf;if(null!=c&&!t(c.g?c.g(b):c.call(null,b)))throw Error([z("Assert failed: "),z("Validator rejected reference state"),z("\n"),z(function(){var a=Pc(tf,uf);return rf.g?rf.g(a):rf.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.He&&sc(a,c,b);return b}return Ec(a,b)}
var vf=function vf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return vf.a(arguments[0],arguments[1]);case 3:return vf.h(arguments[0],arguments[1],arguments[2]);case 4:return vf.J(arguments[0],arguments[1],arguments[2],arguments[3]);default:return vf.A(arguments[0],arguments[1],arguments[2],arguments[3],new J(c.slice(4),0))}};vf.a=function(a,b){var c;a instanceof of?(c=a.state,c=b.g?b.g(c):b.call(null,c),c=sf(a,c)):c=Gc.a(a,b);return c};
vf.h=function(a,b,c){if(a instanceof of){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=sf(a,b)}else a=Gc.h(a,b,c);return a};vf.J=function(a,b,c,d){if(a instanceof of){var e=a.state;b=b.h?b.h(e,c,d):b.call(null,e,c,d);a=sf(a,b)}else a=Gc.J(a,b,c,d);return a};vf.A=function(a,b,c,d,e){return a instanceof of?sf(a,A.aa(b,a.state,c,d,e)):Gc.aa(a,b,c,d,e)};vf.L=function(a){var b=L(a),c=N(a);a=L(c);var d=N(c),c=L(d),e=N(d),d=L(e),e=N(e);return vf.A(b,a,c,d,e)};vf.I=4;
function wf(a){this.state=a;this.v=32768;this.K=0}wf.prototype.oc=function(){return this.state};function mf(a){return new wf(a)}
var S=function S(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return S.g(arguments[0]);case 2:return S.a(arguments[0],arguments[1]);case 3:return S.h(arguments[0],arguments[1],arguments[2]);case 4:return S.J(arguments[0],arguments[1],arguments[2],arguments[3]);default:return S.A(arguments[0],arguments[1],arguments[2],arguments[3],new J(c.slice(4),0))}};
S.g=function(a){return function(b){return function(){function c(c,d){var e=a.g?a.g(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.g?b.g(a):b.call(null,a)}function e(){return b.o?b.o():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new J(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=A.h(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.I=2;c.L=function(a){var b=
L(a);a=N(a);var c=L(a);a=cd(a);return d(b,c,a)};c.A=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,r=Array(arguments.length-2);n<r.length;)r[n]=arguments[n+2],++n;n=new J(r,0)}return h.A(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.I=2;f.L=h.L;f.o=e;f.g=d;f.a=c;f.A=h.A;return f}()}};
S.a=function(a,b){return new Le(null,function(){var c=K(b);if(c){if(Yd(c)){for(var d=Bc(c),e=Q(d),f=Pe(e),h=0;;)if(h<e)Re(f,function(){var b=B.a(d,h);return a.g?a.g(b):a.call(null,b)}()),h+=1;else break;return Qe(f.ua(),S.a(a,Cc(c)))}return P(function(){var b=L(c);return a.g?a.g(b):a.call(null,b)}(),S.a(a,cd(c)))}return null},null,null)};
S.h=function(a,b,c){return new Le(null,function(){var d=K(b),e=K(c);if(d&&e){var f=P,h;h=L(d);var k=L(e);h=a.a?a.a(h,k):a.call(null,h,k);d=f(h,S.h(a,cd(d),cd(e)))}else d=null;return d},null,null)};S.J=function(a,b,c,d){return new Le(null,function(){var e=K(b),f=K(c),h=K(d);if(e&&f&&h){var k=P,l;l=L(e);var m=L(f),n=L(h);l=a.h?a.h(l,m,n):a.call(null,l,m,n);e=k(l,S.J(a,cd(e),cd(f),cd(h)))}else e=null;return e},null,null)};
S.A=function(a,b,c,d,e){var f=function k(a){return new Le(null,function(){var b=S.a(K,a);return ef(me,b)?P(S.a(L,b),k(S.a(cd,b))):null},null,null)};return S.a(function(){return function(b){return A.a(a,b)}}(f),f(Gd.A(e,d,H([c,b],0))))};S.L=function(a){var b=L(a),c=N(a);a=L(c);var d=N(c),c=L(d),e=N(d),d=L(e),e=N(e);return S.A(b,a,c,d,e)};S.I=4;
function xf(a,b){if("number"!==typeof a)throw Error([z("Assert failed: "),z(function(){var a=Pc(yf,zf);return rf.g?rf.g(a):rf.call(null,a)}())].join(""));return new Le(null,function(){if(0<a){var c=K(b);return c?P(L(c),xf(a-1,cd(c))):null}return null},null,null)}
function Af(a,b){if("number"!==typeof a)throw Error([z("Assert failed: "),z(function(){var a=Pc(yf,zf);return rf.g?rf.g(a):rf.call(null,a)}())].join(""));return new Le(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=K(b);if(0<a&&e){var f=a-1,e=cd(e);a=f;b=e}else return e}}),null,null)}function Bf(a){return new Le(null,function(){return P(a,Bf(a))},null,null)}
var Cf=function Cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Cf.a(arguments[0],arguments[1]);default:return Cf.A(arguments[0],arguments[1],new J(c.slice(2),0))}};Cf.a=function(a,b){return new Le(null,function(){var c=K(a),d=K(b);return c&&d?P(L(c),P(L(d),Cf.a(cd(c),cd(d)))):null},null,null)};
Cf.A=function(a,b,c){return new Le(null,function(){var d=S.a(K,Gd.A(c,b,H([a],0)));return ef(me,d)?Ve.a(S.a(L,d),A.a(Cf,S.a(cd,d))):null},null,null)};Cf.L=function(a){var b=L(a),c=N(a);a=L(c);c=N(c);return Cf.A(b,a,c)};Cf.I=2;function Df(a){return Af(1,Cf.a(Bf("L"),a))}Ef;function Ff(a,b){return A.a(Ve,A.h(S,a,b))}
function Gf(a,b){return new Le(null,function(){var c=K(b);if(c){if(Yd(c)){for(var d=Bc(c),e=Q(d),f=Pe(e),h=0;;)if(h<e){var k;k=B.a(d,h);k=a.g?a.g(k):a.call(null,k);t(k)&&(k=B.a(d,h),f.add(k));h+=1}else break;return Qe(f.ua(),Gf(a,Cc(c)))}d=L(c);c=cd(c);return t(a.g?a.g(d):a.call(null,d))?P(d,Gf(a,c)):Gf(a,c)}return null},null,null)}
function Hf(a){return function c(a){return new Le(null,function(){return P(a,t(be.g?be.g(a):be.call(null,a))?Ff(c,H([K.g?K.g(a):K.call(null,a)],0)):null)},null,null)}(a)}function If(a,b){return null!=a?null!=a&&(a.K&4||a.wf)?pd(We(ub.h(uc,tc(a),b)),Qd(a)):ub.h(Db,a,b):ub.h(Gd,M,b)}function Jf(a,b){return We(ub.h(function(b,d){return Xe.a(b,a.g?a.g(d):a.call(null,d))},tc(Hd),b))}
function Kf(a,b,c){return new Le(null,function(){var d=K(c);if(d){var e=xf(a,d);return a===Q(e)?P(e,Kf(a,b,Af(b,d))):null}return null},null,null)}function Lf(a,b,c){return Ld.h(a,b,function(){var d=G.a(a,b);return c.g?c.g(d):c.call(null,d)}())}function Mf(a,b){this.ka=a;this.l=b}function Of(a){return new Mf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}
function Pf(a){return new Mf(a.ka,tb(a.l))}function Qf(a){a=a.B;return 32>a?0:a-1>>>5<<5}function Rf(a,b,c){for(;;){if(0===b)return c;var d=Of(a);d.l[0]=c;c=d;b-=5}}var Sf=function Sf(b,c,d,e){var f=Pf(d),h=b.B-1>>>c&31;5===c?f.l[h]=e:(d=d.l[h],b=null!=d?Sf(b,c-5,d,e):Rf(null,c-5,e),f.l[h]=b);return f};function Tf(a,b){throw Error([z("No item "),z(a),z(" in vector of length "),z(b)].join(""));}
function Uf(a,b){if(b>=Qf(a))return a.ba;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.l[b>>>d&31],d=e;else return c.l}function Vf(a,b){return 0<=b&&b<a.B?Uf(a,b):Tf(b,a.B)}var Wf=function Wf(b,c,d,e,f){var h=Pf(d);if(0===c)h.l[e&31]=f;else{var k=e>>>c&31;b=Wf(b,c-5,d.l[k],e,f);h.l[k]=b}return h},Xf=function Xf(b,c,d){var e=b.B-2>>>c&31;if(5<c){b=Xf(b,c-5,d.l[e]);if(null==b&&0===e)return null;d=Pf(d);d.l[e]=b;return d}if(0===e)return null;d=Pf(d);d.l[e]=null;return d};
function Yf(a,b,c,d,e,f){this.F=a;this.Zc=b;this.l=c;this.Sa=d;this.start=e;this.end=f}Yf.prototype.za=function(){return this.F<this.end};Yf.prototype.next=function(){32===this.F-this.Zc&&(this.l=Uf(this.Sa,this.F),this.Zc+=32);var a=this.l[this.F&31];this.F+=1;return a};Zf;$f;ag;O;bg;Y;cg;function V(a,b,c,d,e,f){this.C=a;this.B=b;this.shift=c;this.root=d;this.ba=e;this.s=f;this.v=167668511;this.K=8196}g=V.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};
g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){return"number"===typeof b?B.h(this,b,c):c};g.qc=function(a,b,c){a=0;for(var d=c;;)if(a<this.B){var e=Uf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=f+a,k=e[f],d=b.h?b.h(d,h,k):b.call(null,d,h,k);if(rd(d)){e=d;break a}f+=1}else{e=d;break a}if(rd(e))return O.g?O.g(e):O.call(null,e);a+=c;d=e}else return d};g.ca=function(a,b){return Vf(this,b)[b&31]};g.Ma=function(a,b,c){return 0<=b&&b<this.B?Uf(this,b)[b&31]:c};
g.ac=function(a,b,c){if(0<=b&&b<this.B)return Qf(this)<=b?(a=tb(this.ba),a[b&31]=c,new V(this.C,this.B,this.shift,this.root,a,null)):new V(this.C,this.B,this.shift,Wf(this,this.shift,this.root,b,c),this.ba,null);if(b===this.B)return Db(this,c);throw Error([z("Index "),z(b),z(" out of bounds  [0,"),z(this.B),z("]")].join(""));};g.Aa=function(){var a=this.B;return new Yf(0,0,0<Q(this)?Uf(this,0):null,this,0,a)};g.R=function(){return this.C};
g.sa=function(){return new V(this.C,this.B,this.shift,this.root,this.ba,this.s)};g.Y=function(){return this.B};g.Hc=function(){return B.a(this,0)};g.Ic=function(){return B.a(this,1)};g.Pb=function(){return 0<this.B?B.a(this,this.B-1):null};
g.Qb=function(){if(0===this.B)throw Error("Can't pop empty vector");if(1===this.B)return dc(Hd,this.C);if(1<this.B-Qf(this))return new V(this.C,this.B-1,this.shift,this.root,this.ba.slice(0,-1),null);var a=Uf(this,this.B-2),b=Xf(this,this.shift,this.root),b=null==b?W:b,c=this.B-1;return 5<this.shift&&null==b.l[1]?new V(this.C,c,this.shift-5,b.l[0],a,null):new V(this.C,c,this.shift,b,a,null)};g.rc=function(){return 0<this.B?new yd(this,this.B-1,null):null};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){if(b instanceof V)if(this.B===Q(b))for(var c=Hc(this),d=Hc(b);;)if(t(c.za())){var e=c.next(),f=d.next();if(!Rc.a(e,f))return!1}else return!0;else return!1;else return od(this,b)};g.pc=function(){return new ag(this.B,this.shift,Zf.g?Zf.g(this.root):Zf.call(null,this.root),$f.g?$f.g(this.ba):$f.call(null,this.ba))};g.ma=function(){return pd(Hd,this.C)};g.va=function(a,b){return sd(this,b)};
g.wa=function(a,b,c){a=0;for(var d=c;;)if(a<this.B){var e=Uf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.a?b.a(d,h):b.call(null,d,h);if(rd(d)){e=d;break a}f+=1}else{e=d;break a}if(rd(e))return O.g?O.g(e):O.call(null,e);a+=c;d=e}else return d};g.Ia=function(a,b,c){if("number"===typeof b)return Zb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.U=function(){if(0===this.B)return null;if(32>=this.B)return new J(this.ba,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.l[0];else{a=a.l;break a}}return cg.J?cg.J(this,a,0,0):cg.call(null,this,a,0,0)};g.S=function(a,b){return new V(b,this.B,this.shift,this.root,this.ba,this.s)};
g.V=function(a,b){if(32>this.B-Qf(this)){for(var c=this.ba.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.ba[e],e+=1;else break;d[c]=b;return new V(this.C,this.B+1,this.shift,this.root,d,null)}c=(d=this.B>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Of(null),d.l[0]=this.root,e=Rf(null,this.shift,new Mf(null,this.ba)),d.l[1]=e):d=Sf(this,this.shift,this.root,new Mf(null,this.ba));return new V(this.C,this.B+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ma(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.h=function(a,c,d){return this.Ma(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.ca(null,a)};g.a=function(a,b){return this.Ma(null,a,b)};
var W=new Mf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Hd=new V(null,0,5,W,[],jd);function dg(a,b){var c=a.length,d=b?a:tb(a);if(32>c)return new V(null,c,5,W,d,null);for(var e=32,f=(new V(null,32,5,W,d.slice(0,32),null)).pc(null);;)if(e<c)var h=e+1,f=Xe.a(f,d[e]),e=h;else return vc(f)}V.prototype[sb]=function(){return ed(this)};
function ke(a){return nb(a)?dg(a,!0):vc(ub.h(uc,tc(Hd),a))}var eg=function eg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return eg.A(0<c.length?new J(c.slice(0),0):null)};eg.A=function(a){return a instanceof J&&0===a.F?dg(a.l,!0):ke(a)};eg.I=0;eg.L=function(a){return eg.A(K(a))};fg;function Xd(a,b,c,d,e,f){this.Ta=a;this.node=b;this.F=c;this.Ca=d;this.C=e;this.s=f;this.v=32375020;this.K=1536}g=Xd.prototype;g.toString=function(){return Jc(this)};
g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};g.Ha=function(){if(this.Ca+1<this.node.length){var a;a=this.Ta;var b=this.node,c=this.F,d=this.Ca+1;a=cg.J?cg.J(a,b,c,d):cg.call(null,a,b,c,d);return null==a?null:a}return Dc(this)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(Hd,this.C)};
g.va=function(a,b){var c;c=this.Ta;var d=this.F+this.Ca,e=Q(this.Ta);c=fg.h?fg.h(c,d,e):fg.call(null,c,d,e);return sd(c,b)};g.wa=function(a,b,c){a=this.Ta;var d=this.F+this.Ca,e=Q(this.Ta);a=fg.h?fg.h(a,d,e):fg.call(null,a,d,e);return td(a,b,c)};g.qa=function(){return this.node[this.Ca]};g.xa=function(){if(this.Ca+1<this.node.length){var a;a=this.Ta;var b=this.node,c=this.F,d=this.Ca+1;a=cg.J?cg.J(a,b,c,d):cg.call(null,a,b,c,d);return null==a?M:a}return Cc(this)};g.U=function(){return this};
g.Id=function(){var a=this.node;return new Ne(a,this.Ca,a.length)};g.Jd=function(){var a=this.F+this.node.length;if(a<Ab(this.Ta)){var b=this.Ta,c=Uf(this.Ta,a);return cg.J?cg.J(b,c,a,0):cg.call(null,b,c,a,0)}return M};g.S=function(a,b){return cg.aa?cg.aa(this.Ta,this.node,this.F,this.Ca,b):cg.call(null,this.Ta,this.node,this.F,this.Ca,b)};g.V=function(a,b){return P(b,this)};
g.Hd=function(){var a=this.F+this.node.length;if(a<Ab(this.Ta)){var b=this.Ta,c=Uf(this.Ta,a);return cg.J?cg.J(b,c,a,0):cg.call(null,b,c,a,0)}return null};Xd.prototype[sb]=function(){return ed(this)};
var cg=function cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return cg.h(arguments[0],arguments[1],arguments[2]);case 4:return cg.J(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return cg.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};cg.h=function(a,b,c){return new Xd(a,Vf(a,b),b,c,null,null)};
cg.J=function(a,b,c,d){return new Xd(a,b,c,d,null,null)};cg.aa=function(a,b,c,d,e){return new Xd(a,b,c,d,e,null)};cg.I=5;gg;function hg(a,b,c,d,e){this.C=a;this.Sa=b;this.start=c;this.end=d;this.s=e;this.v=167666463;this.K=8192}g=hg.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){return"number"===typeof b?B.h(this,b,c):c};
g.qc=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=B.a(this.Sa,a);c=b.h?b.h(c,e,f):b.call(null,c,e,f);if(rd(c))return O.g?O.g(c):O.call(null,c);d+=1;a+=1}else return c};g.ca=function(a,b){return 0>b||this.end<=this.start+b?Tf(b,this.end-this.start):B.a(this.Sa,this.start+b)};g.Ma=function(a,b,c){return 0>b||this.end<=this.start+b?c:B.h(this.Sa,this.start+b,c)};
g.ac=function(a,b,c){var d=this.start+b;a=this.C;c=Ld.h(this.Sa,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return gg.aa?gg.aa(a,c,b,d,null):gg.call(null,a,c,b,d,null)};g.R=function(){return this.C};g.sa=function(){return new hg(this.C,this.Sa,this.start,this.end,this.s)};g.Y=function(){return this.end-this.start};g.Pb=function(){return B.a(this.Sa,this.end-1)};
g.Qb=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.C,b=this.Sa,c=this.start,d=this.end-1;return gg.aa?gg.aa(a,b,c,d,null):gg.call(null,a,b,c,d,null)};g.rc=function(){return this.start!==this.end?new yd(this,this.end-this.start-1,null):null};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(Hd,this.C)};g.va=function(a,b){return sd(this,b)};g.wa=function(a,b,c){return td(this,b,c)};
g.Ia=function(a,b,c){if("number"===typeof b)return Zb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:P(B.a(a.Sa,e),new Le(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};g.S=function(a,b){return gg.aa?gg.aa(b,this.Sa,this.start,this.end,this.s):gg.call(null,b,this.Sa,this.start,this.end,this.s)};
g.V=function(a,b){var c=this.C,d=Zb(this.Sa,this.end,b),e=this.start,f=this.end+1;return gg.aa?gg.aa(c,d,e,f,null):gg.call(null,c,d,e,f,null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ma(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.h=function(a,c,d){return this.Ma(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};
g.g=function(a){return this.ca(null,a)};g.a=function(a,b){return this.Ma(null,a,b)};hg.prototype[sb]=function(){return ed(this)};function gg(a,b,c,d,e){for(;;)if(b instanceof hg)c=b.start+c,d=b.start+d,b=b.Sa;else{var f=Q(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new hg(a,b,c,d,e)}}
var fg=function fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fg.a(arguments[0],arguments[1]);case 3:return fg.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};fg.a=function(a,b){return fg.h(a,b,Q(a))};fg.h=function(a,b,c){return gg(null,a,b,c,null)};fg.I=3;function ig(a,b){return a===b.ka?b:new Mf(a,tb(b.l))}function Zf(a){return new Mf({},tb(a.l))}
function $f(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];$d(a,0,b,0,a.length);return b}var jg=function jg(b,c,d,e){d=ig(b.root.ka,d);var f=b.B-1>>>c&31;if(5===c)b=e;else{var h=d.l[f];b=null!=h?jg(b,c-5,h,e):Rf(b.root.ka,c-5,e)}d.l[f]=b;return d};function ag(a,b,c,d){this.B=a;this.shift=b;this.root=c;this.ba=d;this.K=88;this.v=275}g=ag.prototype;
g.$b=function(a,b){if(this.root.ka){if(32>this.B-Qf(this))this.ba[this.B&31]=b;else{var c=new Mf(this.root.ka,this.ba),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.ba=d;if(this.B>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Rf(this.root.ka,this.shift,c);this.root=new Mf(this.root.ka,d);this.shift=e}else this.root=jg(this,this.shift,this.root,c)}this.B+=1;return this}throw Error("conj! after persistent!");};g.sc=function(){if(this.root.ka){this.root.ka=null;var a=this.B-Qf(this),b=Array(a);$d(this.ba,0,b,0,a);return new V(null,this.B,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.Jc=function(a,b,c){if("number"===typeof b)return xc(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.je=function(a,b,c){var d=this;if(d.root.ka){if(0<=b&&b<d.B)return Qf(this)<=b?d.ba[b&31]=c:(a=function(){return function f(a,k){var l=ig(d.root.ka,k);if(0===a)l.l[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.l[m]);l.l[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.B)return uc(this,c);throw Error([z("Index "),z(b),z(" out of bounds for TransientVector of length"),z(d.B)].join(""));}throw Error("assoc! after persistent!");};
g.Y=function(){if(this.root.ka)return this.B;throw Error("count after persistent!");};g.ca=function(a,b){if(this.root.ka)return Vf(this,b)[b&31];throw Error("nth after persistent!");};g.Ma=function(a,b,c){return 0<=b&&b<this.B?B.a(this,b):c};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){return"number"===typeof b?B.h(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};function kg(a,b){this.vc=a;this.Wc=b}
kg.prototype.za=function(){var a=null!=this.vc&&K(this.vc);return a?a:(a=null!=this.Wc)?this.Wc.za():a};kg.prototype.next=function(){if(null!=this.vc){var a=L(this.vc);this.vc=N(this.vc);return a}if(null!=this.Wc&&this.Wc.za())return this.Wc.next();throw Error("No such element");};kg.prototype.remove=function(){return Error("Unsupported operation")};function lg(a,b,c,d){this.C=a;this.Na=b;this.cb=c;this.s=d;this.v=31850572;this.K=0}g=lg.prototype;g.toString=function(){return Jc(this)};
g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.qa=function(){return L(this.Na)};g.xa=function(){var a=N(this.Na);return a?new lg(this.C,a,this.cb,null):null==this.cb?Bb(this):new lg(this.C,this.cb,null,null)};g.U=function(){return this};g.S=function(a,b){return new lg(b,this.Na,this.cb,this.s)};g.V=function(a,b){return P(b,this)};
lg.prototype[sb]=function(){return ed(this)};function mg(a,b,c,d,e){this.C=a;this.count=b;this.Na=c;this.cb=d;this.s=e;this.v=31858766;this.K=8192}g=mg.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.Aa=function(){return new kg(this.Na,Hc(this.cb))};g.R=function(){return this.C};g.sa=function(){return new mg(this.C,this.count,this.Na,this.cb,this.s)};g.Y=function(){return this.count};g.Pb=function(){return L(this.Na)};
g.Qb=function(){if(t(this.Na)){var a=N(this.Na);return a?new mg(this.C,this.count-1,a,this.cb,null):new mg(this.C,this.count-1,K(this.cb),Hd,null)}return this};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(ng,this.C)};g.qa=function(){return L(this.Na)};g.xa=function(){return cd(K(this))};g.U=function(){var a=K(this.cb),b=this.Na;return t(t(b)?b:a)?new lg(null,this.Na,K(a),null):null};
g.S=function(a,b){return new mg(b,this.count,this.Na,this.cb,this.s)};g.V=function(a,b){var c;t(this.Na)?(c=this.cb,c=new mg(this.C,this.count+1,this.Na,Gd.a(t(c)?c:Hd,b),null)):c=new mg(this.C,this.count+1,Gd.a(this.Na,b),Hd,null);return c};var ng=new mg(null,0,null,Hd,jd);mg.prototype[sb]=function(){return ed(this)};function og(){this.v=2097152;this.K=0}og.prototype.equiv=function(a){return this.G(null,a)};og.prototype.G=function(){return!1};var pg=new og;
function qg(a,b){return ce(Ud(b)?Q(a)===Q(b)?ef(me,S.a(function(a){return Rc.a(G.h(b,L(a),pg),Ed(a))},a)):null:null)}function rg(a,b,c,d,e){this.F=a;this.pf=b;this.ce=c;this.df=d;this.te=e}rg.prototype.za=function(){var a=this.F<this.ce;return a?a:this.te.za()};rg.prototype.next=function(){if(this.F<this.ce){var a=Jd(this.df,this.F);this.F+=1;return new V(null,2,5,W,[a,Lb.a(this.pf,a)],null)}return this.te.next()};rg.prototype.remove=function(){return Error("Unsupported operation")};
function sg(a){this.T=a}sg.prototype.next=function(){if(null!=this.T){var a=L(this.T),b=R(a,0),a=R(a,1);this.T=N(this.T);return{value:[b,a],done:!1}}return{value:null,done:!0}};function tg(a){return new sg(K(a))}function ug(a){this.T=a}ug.prototype.next=function(){if(null!=this.T){var a=L(this.T);this.T=N(this.T);return{value:[a,a],done:!1}}return{value:null,done:!0}};function vg(a){return new ug(K(a))}
function wg(a,b){var c;if(b instanceof u)a:{c=a.length;for(var d=b.Ba,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof u&&d===a[e].Ba){c=e;break a}e+=2}}else if(ha(b)||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof Qc)a:for(c=a.length,d=b.La,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof Qc&&d===a[e].La){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=a.length,
d=0;;){if(c<=d){c=-1;break a}if(Rc.a(b,a[d])){c=d;break a}d+=2}return c}xg;function yg(a,b,c){this.l=a;this.F=b;this.Ga=c;this.v=32374990;this.K=0}g=yg.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.Ga};g.Ha=function(){return this.F<this.l.length-2?new yg(this.l,this.F+2,this.Ga):null};g.Y=function(){return(this.l.length-this.F)/2};g.P=function(){return id(this)};g.G=function(a,b){return od(this,b)};
g.ma=function(){return pd(M,this.Ga)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return new V(null,2,5,W,[this.l[this.F],this.l[this.F+1]],null)};g.xa=function(){return this.F<this.l.length-2?new yg(this.l,this.F+2,this.Ga):M};g.U=function(){return this};g.S=function(a,b){return new yg(this.l,this.F,b)};g.V=function(a,b){return P(b,this)};yg.prototype[sb]=function(){return ed(this)};zg;Ag;function Bg(a,b,c){this.l=a;this.F=b;this.B=c}
Bg.prototype.za=function(){return this.F<this.B};Bg.prototype.next=function(){var a=new V(null,2,5,W,[this.l[this.F],this.l[this.F+1]],null);this.F+=2;return a};function q(a,b,c,d){this.C=a;this.B=b;this.l=c;this.s=d;this.v=16647951;this.K=8196}g=q.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.keys=function(){return ed(zg.g?zg.g(this):zg.call(null,this))};g.entries=function(){return tg(K(this))};
g.values=function(){return ed(Ag.g?Ag.g(this):Ag.call(null,this))};g.has=function(a){return ee(this,a)};g.get=function(a,b){return this.M(null,a,b)};g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=K(b))Yd(b)?(c=Bc(b),b=Cc(b),h=c,d=Q(c),c=h):(c=L(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=N(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Lb.h(this,b,null)};
g.M=function(a,b,c){a=wg(this.l,b);return-1===a?c:this.l[a+1]};g.qc=function(a,b,c){a=this.l.length;for(var d=0;;)if(d<a){var e=this.l[d],f=this.l[d+1];c=b.h?b.h(c,e,f):b.call(null,c,e,f);if(rd(c))return O.g?O.g(c):O.call(null,c);d+=2}else return c};g.Aa=function(){return new Bg(this.l,0,2*this.B)};g.R=function(){return this.C};g.sa=function(){return new q(this.C,this.B,this.l,this.s)};g.Y=function(){return this.B};g.P=function(){var a=this.s;return null!=a?a:this.s=a=ld(this)};
g.G=function(a,b){if(null!=b&&(b.v&1024||b.Se)){var c=this.l.length;if(this.B===b.Y(null))for(var d=0;;)if(d<c){var e=b.M(null,this.l[d],ae);if(e!==ae)if(Rc.a(this.l[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return qg(this,b)};g.pc=function(){return new xg({},this.l.length,tb(this.l))};g.ma=function(){return dc(X,this.C)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};
g.Ua=function(a,b){if(0<=wg(this.l,b)){var c=this.l.length,d=c-2;if(0===d)return Bb(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new q(this.C,this.B-1,d,null);Rc.a(b,this.l[e])||(d[f]=this.l[e],d[f+1]=this.l[e+1],f+=2);e+=2}}else return this};
g.Ia=function(a,b,c){a=wg(this.l,b);if(-1===a){if(this.B<Cg){a=this.l;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new q(this.C,this.B+1,e,null)}return dc(Nb(If(Dg,this),b,c),this.C)}if(c===this.l[a+1])return this;b=tb(this.l);b[a+1]=c;return new q(this.C,this.B,b,null)};g.cd=function(a,b){return-1!==wg(this.l,b)};g.U=function(){var a=this.l;return 0<=a.length-2?new yg(a,0,null):null};g.S=function(a,b){return new q(b,this.B,this.l,this.s)};
g.V=function(a,b){if(Vd(b))return Nb(this,B.a(b,0),B.a(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(Vd(e))c=Nb(c,B.a(e,0),B.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var X=new q(null,0,[],md),Cg=8;
function Eg(a,b,c){a=b?a:tb(a);if(!c){c=[];for(b=0;;)if(b<a.length){var d=a[b],e=a[b+1];-1===wg(c,d)&&(c.push(d),c.push(e));b+=2}else break;a=c}return new q(null,a.length/2,a,null)}q.prototype[sb]=function(){return ed(this)};Fg;function xg(a,b,c){this.tc=a;this.hc=b;this.l=c;this.v=258;this.K=56}g=xg.prototype;g.Y=function(){if(t(this.tc))return we(this.hc);throw Error("count after persistent!");};g.N=function(a,b){return Lb.h(this,b,null)};
g.M=function(a,b,c){if(t(this.tc))return a=wg(this.l,b),-1===a?c:this.l[a+1];throw Error("lookup after persistent!");};g.$b=function(a,b){if(t(this.tc)){if(null!=b?b.v&2048||b.Te||(b.v?0:w(Rb,b)):w(Rb,b))return wc(this,Be.g?Be.g(b):Be.call(null,b),Ce.g?Ce.g(b):Ce.call(null,b));for(var c=K(b),d=this;;){var e=L(c);if(t(e))c=N(c),d=wc(d,Be.g?Be.g(e):Be.call(null,e),Ce.g?Ce.g(e):Ce.call(null,e));else return d}}else throw Error("conj! after persistent!");};
g.sc=function(){if(t(this.tc))return this.tc=!1,new q(null,we(this.hc),this.l,null);throw Error("persistent! called twice");};g.Jc=function(a,b,c){if(t(this.tc)){a=wg(this.l,b);if(-1===a){if(this.hc+2<=2*Cg)return this.hc+=2,this.l.push(b),this.l.push(c),this;a=Fg.a?Fg.a(this.hc,this.l):Fg.call(null,this.hc,this.l);return wc(a,b,c)}c!==this.l[a+1]&&(this.l[a+1]=c);return this}throw Error("assoc! after persistent!");};Gg;Kd;
function Fg(a,b){for(var c=tc(Dg),d=0;;)if(d<a)c=wc(c,b[d],b[d+1]),d+=2;else return c}function Hg(){this.j=!1}Ig;Jg;sf;Kg;pf;O;function Lg(a,b){return a===b?!0:U(a,b)?!0:Rc.a(a,b)}function Mg(a,b,c){a=tb(a);a[b]=c;return a}function Ng(a,b){var c=Array(a.length-2);$d(a,0,c,0,2*b);$d(a,2*(b+1),c,2*b,c.length-2*b);return c}function Og(a,b,c,d){a=a.cc(b);a.l[c]=d;return a}
function Pg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var h=a[e+1];c=b.h?b.h(f,c,h):b.call(null,f,c,h)}else c=a[e+1],c=null!=c?c.gc(b,f):f;if(rd(c))return O.g?O.g(c):O.call(null,c);e+=2;f=c}else return f}Qg;function Rg(a,b,c,d){this.l=a;this.F=b;this.Uc=c;this.yb=d}Rg.prototype.advance=function(){for(var a=this.l.length;;)if(this.F<a){var b=this.l[this.F],c=this.l[this.F+1];null!=b?b=this.Uc=new V(null,2,5,W,[b,c],null):null!=c?(b=Hc(c),b=b.za()?this.yb=b:!1):b=!1;this.F+=2;if(b)return!0}else return!1};
Rg.prototype.za=function(){var a=null!=this.Uc;return a?a:(a=null!=this.yb)?a:this.advance()};Rg.prototype.next=function(){if(null!=this.Uc){var a=this.Uc;this.Uc=null;return a}if(null!=this.yb)return a=this.yb.next(),this.yb.za()||(this.yb=null),a;if(this.advance())return this.next();throw Error("No such element");};Rg.prototype.remove=function(){return Error("Unsupported operation")};function Sg(a,b,c){this.ka=a;this.oa=b;this.l=c}g=Sg.prototype;
g.cc=function(a){if(a===this.ka)return this;var b=xe(this.oa),c=Array(0>b?4:2*(b+1));$d(this.l,0,c,0,2*b);return new Sg(a,this.oa,c)};g.Qc=function(){return Ig.g?Ig.g(this.l):Ig.call(null,this.l)};g.gc=function(a,b){return Pg(this.l,a,b)};g.Tb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.oa&e))return d;var f=xe(this.oa&e-1),e=this.l[2*f],f=this.l[2*f+1];return null==e?f.Tb(a+5,b,c,d):Lg(c,e)?f:d};
g.xb=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=xe(this.oa&h-1);if(0===(this.oa&h)){var l=xe(this.oa);if(2*l<this.l.length){a=this.cc(a);b=a.l;f.j=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.oa|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Tg.xb(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.oa>>>d&1)&&(k[d]=null!=this.l[e]?Tg.xb(a,b+5,Xc(this.l[e]),this.l[e],this.l[e+1],f):this.l[e+1],e+=2),d+=1;else break;return new Qg(a,l+1,k)}b=Array(2*(l+4));$d(this.l,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;$d(this.l,2*k,b,2*(k+1),2*(l-k));f.j=!0;a=this.cc(a);a.l=b;a.oa|=h;return a}l=this.l[2*k];h=this.l[2*k+1];if(null==l)return l=h.xb(a,b+5,c,d,e,f),l===h?this:Og(this,a,2*k+1,l);if(Lg(d,l))return e===h?this:Og(this,a,2*k+1,e);f.j=!0;f=b+5;d=Kg.Pa?Kg.Pa(a,f,l,h,c,d,e):Kg.call(null,a,f,l,h,c,d,e);e=
2*k;k=2*k+1;a=this.cc(a);a.l[e]=null;a.l[k]=d;return a};
g.wb=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=xe(this.oa&f-1);if(0===(this.oa&f)){var k=xe(this.oa);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Tg.wb(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.oa>>>c&1)&&(h[c]=null!=this.l[d]?Tg.wb(a+5,Xc(this.l[d]),this.l[d],this.l[d+1],e):this.l[d+1],d+=2),c+=1;else break;return new Qg(null,k+1,h)}a=Array(2*(k+1));$d(this.l,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;$d(this.l,2*h,a,2*(h+1),2*(k-h));e.j=!0;return new Sg(null,this.oa|f,a)}var l=this.l[2*h],f=this.l[2*h+1];if(null==l)return k=f.wb(a+5,b,c,d,e),k===f?this:new Sg(null,this.oa,Mg(this.l,2*h+1,k));if(Lg(c,l))return d===f?this:new Sg(null,this.oa,Mg(this.l,2*h+1,d));e.j=!0;e=this.oa;k=this.l;a+=5;a=Kg.Oa?Kg.Oa(a,l,f,b,c,d):Kg.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=tb(k);d[c]=null;d[h]=a;return new Sg(null,e,d)};
g.Rc=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.oa&d))return this;var e=xe(this.oa&d-1),f=this.l[2*e],h=this.l[2*e+1];return null==f?(a=h.Rc(a+5,b,c),a===h?this:null!=a?new Sg(null,this.oa,Mg(this.l,2*e+1,a)):this.oa===d?null:new Sg(null,this.oa^d,Ng(this.l,e))):Lg(c,f)?new Sg(null,this.oa^d,Ng(this.l,e)):this};g.Aa=function(){return new Rg(this.l,0,null,null)};var Tg=new Sg(null,0,[]);function Ug(a,b,c){this.l=a;this.F=b;this.yb=c}
Ug.prototype.za=function(){for(var a=this.l.length;;){if(null!=this.yb&&this.yb.za())return!0;if(this.F<a){var b=this.l[this.F];this.F+=1;null!=b&&(this.yb=Hc(b))}else return!1}};Ug.prototype.next=function(){if(this.za())return this.yb.next();throw Error("No such element");};Ug.prototype.remove=function(){return Error("Unsupported operation")};function Qg(a,b,c){this.ka=a;this.B=b;this.l=c}g=Qg.prototype;g.cc=function(a){return a===this.ka?this:new Qg(a,this.B,tb(this.l))};
g.Qc=function(){return Jg.g?Jg.g(this.l):Jg.call(null,this.l)};g.gc=function(a,b){for(var c=this.l.length,d=0,e=b;;)if(d<c){var f=this.l[d];if(null!=f&&(e=f.gc(a,e),rd(e)))return O.g?O.g(e):O.call(null,e);d+=1}else return e};g.Tb=function(a,b,c,d){var e=this.l[b>>>a&31];return null!=e?e.Tb(a+5,b,c,d):d};g.xb=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.l[h];if(null==k)return a=Og(this,a,h,Tg.xb(a,b+5,c,d,e,f)),a.B+=1,a;b=k.xb(a,b+5,c,d,e,f);return b===k?this:Og(this,a,h,b)};
g.wb=function(a,b,c,d,e){var f=b>>>a&31,h=this.l[f];if(null==h)return new Qg(null,this.B+1,Mg(this.l,f,Tg.wb(a+5,b,c,d,e)));a=h.wb(a+5,b,c,d,e);return a===h?this:new Qg(null,this.B,Mg(this.l,f,a))};
g.Rc=function(a,b,c){var d=b>>>a&31,e=this.l[d];if(null!=e){a=e.Rc(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.B)a:{e=this.l;a=e.length;b=Array(2*(this.B-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new Sg(null,h,b);break a}}else d=new Qg(null,this.B-1,Mg(this.l,d,a));else d=new Qg(null,this.B,Mg(this.l,d,a));return d}return this};g.Aa=function(){return new Ug(this.l,0,null)};
function Vg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Lg(c,a[d]))return d;d+=2}else return-1}function Wg(a,b,c,d){this.ka=a;this.Hb=b;this.B=c;this.l=d}g=Wg.prototype;g.cc=function(a){if(a===this.ka)return this;var b=Array(2*(this.B+1));$d(this.l,0,b,0,2*this.B);return new Wg(a,this.Hb,this.B,b)};g.Qc=function(){return Ig.g?Ig.g(this.l):Ig.call(null,this.l)};g.gc=function(a,b){return Pg(this.l,a,b)};g.Tb=function(a,b,c,d){a=Vg(this.l,this.B,c);return 0>a?d:Lg(c,this.l[a])?this.l[a+1]:d};
g.xb=function(a,b,c,d,e,f){if(c===this.Hb){b=Vg(this.l,this.B,d);if(-1===b){if(this.l.length>2*this.B)return b=2*this.B,c=2*this.B+1,a=this.cc(a),a.l[b]=d,a.l[c]=e,f.j=!0,a.B+=1,a;c=this.l.length;b=Array(c+2);$d(this.l,0,b,0,c);b[c]=d;b[c+1]=e;f.j=!0;d=this.B+1;a===this.ka?(this.l=b,this.B=d,a=this):a=new Wg(this.ka,this.Hb,d,b);return a}return this.l[b+1]===e?this:Og(this,a,b+1,e)}return(new Sg(a,1<<(this.Hb>>>b&31),[null,this,null,null])).xb(a,b,c,d,e,f)};
g.wb=function(a,b,c,d,e){return b===this.Hb?(a=Vg(this.l,this.B,c),-1===a?(a=2*this.B,b=Array(a+2),$d(this.l,0,b,0,a),b[a]=c,b[a+1]=d,e.j=!0,new Wg(null,this.Hb,this.B+1,b)):Rc.a(this.l[a],d)?this:new Wg(null,this.Hb,this.B,Mg(this.l,a+1,d))):(new Sg(null,1<<(this.Hb>>>a&31),[null,this])).wb(a,b,c,d,e)};g.Rc=function(a,b,c){a=Vg(this.l,this.B,c);return-1===a?this:1===this.B?null:new Wg(null,this.Hb,this.B-1,Ng(this.l,we(a)))};g.Aa=function(){return new Rg(this.l,0,null,null)};
var Kg=function Kg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Kg.Oa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Kg.Pa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Kg.Oa=function(a,b,c,d,e,f){var h=Xc(b);if(h===d)return new Wg(null,h,2,[b,c,e,f]);var k=new Hg;return Tg.wb(a,h,b,c,k).wb(a,d,e,f,k)};Kg.Pa=function(a,b,c,d,e,f,h){var k=Xc(c);if(k===e)return new Wg(null,k,2,[c,d,f,h]);var l=new Hg;return Tg.xb(a,b,k,c,d,l).xb(a,b,e,f,h,l)};Kg.I=7;function Xg(a,b,c,d,e){this.C=a;this.Ub=b;this.F=c;this.T=d;this.s=e;this.v=32374860;this.K=0}g=Xg.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return null==this.T?new V(null,2,5,W,[this.Ub[this.F],this.Ub[this.F+1]],null):L(this.T)};
g.xa=function(){if(null==this.T){var a=this.Ub,b=this.F+2;return Ig.h?Ig.h(a,b,null):Ig.call(null,a,b,null)}var a=this.Ub,b=this.F,c=N(this.T);return Ig.h?Ig.h(a,b,c):Ig.call(null,a,b,c)};g.U=function(){return this};g.S=function(a,b){return new Xg(b,this.Ub,this.F,this.T,this.s)};g.V=function(a,b){return P(b,this)};Xg.prototype[sb]=function(){return ed(this)};
var Ig=function Ig(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ig.g(arguments[0]);case 3:return Ig.h(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Ig.g=function(a){return Ig.h(a,0,null)};
Ig.h=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Xg(null,a,b,null,null);var d=a[b+1];if(t(d)&&(d=d.Qc(),t(d)))return new Xg(null,a,b+2,d,null);b+=2}else return null;else return new Xg(null,a,b,c,null)};Ig.I=3;function Yg(a,b,c,d,e){this.C=a;this.Ub=b;this.F=c;this.T=d;this.s=e;this.v=32374860;this.K=0}g=Yg.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};
g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return L(this.T)};g.xa=function(){var a=this.Ub,b=this.F,c=N(this.T);return Jg.J?Jg.J(null,a,b,c):Jg.call(null,null,a,b,c)};g.U=function(){return this};g.S=function(a,b){return new Yg(b,this.Ub,this.F,this.T,this.s)};g.V=function(a,b){return P(b,this)};
Yg.prototype[sb]=function(){return ed(this)};var Jg=function Jg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jg.g(arguments[0]);case 4:return Jg.J(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Jg.g=function(a){return Jg.J(null,a,0,null)};
Jg.J=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(t(e)&&(e=e.Qc(),t(e)))return new Yg(a,b,c+1,e,null);c+=1}else return null;else return new Yg(a,b,c,d,null)};Jg.I=4;Gg;function Zg(a,b,c){this.Ea=a;this.De=b;this.Xd=c}Zg.prototype.za=function(){return this.Xd&&this.De.za()};Zg.prototype.next=function(){if(this.Xd)return this.De.next();this.Xd=!0;return this.Ea};Zg.prototype.remove=function(){return Error("Unsupported operation")};
function Kd(a,b,c,d,e,f){this.C=a;this.B=b;this.root=c;this.Da=d;this.Ea=e;this.s=f;this.v=16123663;this.K=8196}g=Kd.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.keys=function(){return ed(zg.g?zg.g(this):zg.call(null,this))};g.entries=function(){return tg(K(this))};g.values=function(){return ed(Ag.g?Ag.g(this):Ag.call(null,this))};g.has=function(a){return ee(this,a)};g.get=function(a,b){return this.M(null,a,b)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=K(b))Yd(b)?(c=Bc(b),b=Cc(b),h=c,d=Q(c),c=h):(c=L(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=N(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){return null==b?this.Da?this.Ea:c:null==this.root?c:this.root.Tb(0,Xc(b),b,c)};
g.qc=function(a,b,c){a=this.Da?b.h?b.h(c,null,this.Ea):b.call(null,c,null,this.Ea):c;return rd(a)?O.g?O.g(a):O.call(null,a):null!=this.root?this.root.gc(b,a):a};g.Aa=function(){var a=this.root?Hc(this.root):$e;return this.Da?new Zg(this.Ea,a,!1):a};g.R=function(){return this.C};g.sa=function(){return new Kd(this.C,this.B,this.root,this.Da,this.Ea,this.s)};g.Y=function(){return this.B};g.P=function(){var a=this.s;return null!=a?a:this.s=a=ld(this)};g.G=function(a,b){return qg(this,b)};
g.pc=function(){return new Gg({},this.root,this.B,this.Da,this.Ea)};g.ma=function(){return dc(Dg,this.C)};g.Ua=function(a,b){if(null==b)return this.Da?new Kd(this.C,this.B-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Rc(0,Xc(b),b);return c===this.root?this:new Kd(this.C,this.B-1,c,this.Da,this.Ea,null)};
g.Ia=function(a,b,c){if(null==b)return this.Da&&c===this.Ea?this:new Kd(this.C,this.Da?this.B:this.B+1,this.root,!0,c,null);a=new Hg;b=(null==this.root?Tg:this.root).wb(0,Xc(b),b,c,a);return b===this.root?this:new Kd(this.C,a.j?this.B+1:this.B,b,this.Da,this.Ea,null)};g.cd=function(a,b){return null==b?this.Da:null==this.root?!1:this.root.Tb(0,Xc(b),b,ae)!==ae};g.U=function(){if(0<this.B){var a=null!=this.root?this.root.Qc():null;return this.Da?P(new V(null,2,5,W,[null,this.Ea],null),a):a}return null};
g.S=function(a,b){return new Kd(b,this.B,this.root,this.Da,this.Ea,this.s)};g.V=function(a,b){if(Vd(b))return Nb(this,B.a(b,0),B.a(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(Vd(e))c=Nb(c,B.a(e,0),B.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var Dg=new Kd(null,0,null,!1,null,md);
function Md(a,b){for(var c=a.length,d=0,e=tc(Dg);;)if(d<c)var f=d+1,e=e.Jc(null,a[d],b[d]),d=f;else return vc(e)}Kd.prototype[sb]=function(){return ed(this)};function Gg(a,b,c,d,e){this.ka=a;this.root=b;this.count=c;this.Da=d;this.Ea=e;this.v=258;this.K=56}
function $g(a,b,c){if(a.ka){if(null==b)a.Ea!==c&&(a.Ea=c),a.Da||(a.count+=1,a.Da=!0);else{var d=new Hg;b=(null==a.root?Tg:a.root).xb(a.ka,0,Xc(b),b,c,d);b!==a.root&&(a.root=b);d.j&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=Gg.prototype;g.Y=function(){if(this.ka)return this.count;throw Error("count after persistent!");};g.N=function(a,b){return null==b?this.Da?this.Ea:null:null==this.root?null:this.root.Tb(0,Xc(b),b)};
g.M=function(a,b,c){return null==b?this.Da?this.Ea:c:null==this.root?c:this.root.Tb(0,Xc(b),b,c)};g.$b=function(a,b){var c;a:if(this.ka)if(null!=b?b.v&2048||b.Te||(b.v?0:w(Rb,b)):w(Rb,b))c=$g(this,Be.g?Be.g(b):Be.call(null,b),Ce.g?Ce.g(b):Ce.call(null,b));else{c=K(b);for(var d=this;;){var e=L(c);if(t(e))c=N(c),d=$g(d,Be.g?Be.g(e):Be.call(null,e),Ce.g?Ce.g(e):Ce.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};
g.sc=function(){var a;if(this.ka)this.ka=null,a=new Kd(null,this.count,this.root,this.Da,this.Ea,null);else throw Error("persistent! called twice");return a};g.Jc=function(a,b,c){return $g(this,b,c)};function ah(a,b,c){for(var d=b;;)if(null!=a)b=c?a.left:a.right,d=Gd.a(d,a),a=b;else return d}function bh(a,b,c,d,e){this.C=a;this.stack=b;this.Yc=c;this.B=d;this.s=e;this.v=32374862;this.K=0}g=bh.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.C};
g.Y=function(){return 0>this.B?Q(N(this))+1:this.B};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){var a=this.stack;return null==a?null:Vb(a)};g.xa=function(){var a=L(this.stack),a=ah(this.Yc?a.right:a.left,N(this.stack),this.Yc);return null!=a?new bh(null,a,this.Yc,this.B-1,null):M};g.U=function(){return this};
g.S=function(a,b){return new bh(b,this.stack,this.Yc,this.B,this.s)};g.V=function(a,b){return P(b,this)};bh.prototype[sb]=function(){return ed(this)};function ch(a,b,c){return new bh(null,ah(a,null,b),b,c,null)}Z;dh;
function eh(a,b,c,d){return c instanceof Z?c.left instanceof Z?new Z(c.key,c.j,c.left.Eb(),new dh(a,b,c.right,d,null),null):c.right instanceof Z?new Z(c.right.key,c.right.j,new dh(c.key,c.j,c.left,c.right.left,null),new dh(a,b,c.right.right,d,null),null):new dh(a,b,c,d,null):new dh(a,b,c,d,null)}
function fh(a,b,c,d){return d instanceof Z?d.right instanceof Z?new Z(d.key,d.j,new dh(a,b,c,d.left,null),d.right.Eb(),null):d.left instanceof Z?new Z(d.left.key,d.left.j,new dh(a,b,c,d.left.left,null),new dh(d.key,d.j,d.left.right,d.right,null),null):new dh(a,b,c,d,null):new dh(a,b,c,d,null)}
function gh(a,b,c,d){if(c instanceof Z)return new Z(a,b,c.Eb(),d,null);if(d instanceof dh)return fh(a,b,c,d.Vc());if(d instanceof Z&&d.left instanceof dh)return new Z(d.left.key,d.left.j,new dh(a,b,c,d.left.left,null),fh(d.key,d.j,d.left.right,d.right.Vc()),null);throw Error("red-black tree invariant violation");}
var hh=function hh(b,c,d){d=null!=b.left?hh(b.left,c,d):d;if(rd(d))return O.g?O.g(d):O.call(null,d);var e=b.key,f=b.j;d=c.h?c.h(d,e,f):c.call(null,d,e,f);if(rd(d))return O.g?O.g(d):O.call(null,d);b=null!=b.right?hh(b.right,c,d):d;return rd(b)?O.g?O.g(b):O.call(null,b):b};function dh(a,b,c,d,e){this.key=a;this.j=b;this.left=c;this.right=d;this.s=e;this.v=32402207;this.K=0}g=dh.prototype;g.$d=function(a){return a.be(this)};g.Vc=function(){return new Z(this.key,this.j,this.left,this.right,null)};
g.Eb=function(){return this};g.Zd=function(a){return a.ae(this)};g.replace=function(a,b,c,d){return new dh(a,b,c,d,null)};g.ae=function(a){return new dh(a.key,a.j,this,a.right,null)};g.be=function(a){return new dh(a.key,a.j,a.left,this,null)};g.gc=function(a,b){return hh(this,a,b)};g.N=function(a,b){return B.h(this,b,null)};g.M=function(a,b,c){return B.h(this,b,c)};g.ca=function(a,b){return 0===b?this.key:1===b?this.j:null};g.Ma=function(a,b,c){return 0===b?this.key:1===b?this.j:c};
g.ac=function(a,b,c){return(new V(null,2,5,W,[this.key,this.j],null)).ac(null,b,c)};g.R=function(){return null};g.Y=function(){return 2};g.Hc=function(){return this.key};g.Ic=function(){return this.j};g.Pb=function(){return this.j};g.Qb=function(){return new V(null,1,5,W,[this.key],null)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return Hd};g.va=function(a,b){return sd(this,b)};g.wa=function(a,b,c){return td(this,b,c)};
g.Ia=function(a,b,c){return Ld.h(new V(null,2,5,W,[this.key,this.j],null),b,c)};g.U=function(){return Db(Db(M,this.j),this.key)};g.S=function(a,b){return pd(new V(null,2,5,W,[this.key,this.j],null),b)};g.V=function(a,b){return new V(null,3,5,W,[this.key,this.j,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};dh.prototype[sb]=function(){return ed(this)};
function Z(a,b,c,d,e){this.key=a;this.j=b;this.left=c;this.right=d;this.s=e;this.v=32402207;this.K=0}g=Z.prototype;g.$d=function(a){return new Z(this.key,this.j,this.left,a,null)};g.Vc=function(){throw Error("red-black tree invariant violation");};g.Eb=function(){return new dh(this.key,this.j,this.left,this.right,null)};g.Zd=function(a){return new Z(this.key,this.j,a,this.right,null)};g.replace=function(a,b,c,d){return new Z(a,b,c,d,null)};
g.ae=function(a){return this.left instanceof Z?new Z(this.key,this.j,this.left.Eb(),new dh(a.key,a.j,this.right,a.right,null),null):this.right instanceof Z?new Z(this.right.key,this.right.j,new dh(this.key,this.j,this.left,this.right.left,null),new dh(a.key,a.j,this.right.right,a.right,null),null):new dh(a.key,a.j,this,a.right,null)};
g.be=function(a){return this.right instanceof Z?new Z(this.key,this.j,new dh(a.key,a.j,a.left,this.left,null),this.right.Eb(),null):this.left instanceof Z?new Z(this.left.key,this.left.j,new dh(a.key,a.j,a.left,this.left.left,null),new dh(this.key,this.j,this.left.right,this.right,null),null):new dh(a.key,a.j,a.left,this,null)};g.gc=function(a,b){return hh(this,a,b)};g.N=function(a,b){return B.h(this,b,null)};g.M=function(a,b,c){return B.h(this,b,c)};
g.ca=function(a,b){return 0===b?this.key:1===b?this.j:null};g.Ma=function(a,b,c){return 0===b?this.key:1===b?this.j:c};g.ac=function(a,b,c){return(new V(null,2,5,W,[this.key,this.j],null)).ac(null,b,c)};g.R=function(){return null};g.Y=function(){return 2};g.Hc=function(){return this.key};g.Ic=function(){return this.j};g.Pb=function(){return this.j};g.Qb=function(){return new V(null,1,5,W,[this.key],null)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};
g.G=function(a,b){return od(this,b)};g.ma=function(){return Hd};g.va=function(a,b){return sd(this,b)};g.wa=function(a,b,c){return td(this,b,c)};g.Ia=function(a,b,c){return Ld.h(new V(null,2,5,W,[this.key,this.j],null),b,c)};g.U=function(){return Db(Db(M,this.j),this.key)};g.S=function(a,b){return pd(new V(null,2,5,W,[this.key,this.j],null),b)};g.V=function(a,b){return new V(null,3,5,W,[this.key,this.j,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};Z.prototype[sb]=function(){return ed(this)};
var ih=function ih(b,c,d,e,f){if(null==c)return new Z(d,e,null,null,null);var h;h=c.key;h=b.a?b.a(d,h):b.call(null,d,h);if(0===h)return f[0]=c,null;if(0>h)return b=ih(b,c.left,d,e,f),null!=b?c.Zd(b):null;b=ih(b,c.right,d,e,f);return null!=b?c.$d(b):null},jh=function jh(b,c){if(null==b)return c;if(null==c)return b;if(b instanceof Z){if(c instanceof Z){var d=jh(b.right,c.left);return d instanceof Z?new Z(d.key,d.j,new Z(b.key,b.j,b.left,d.left,null),new Z(c.key,c.j,d.right,c.right,null),null):new Z(b.key,
b.j,b.left,new Z(c.key,c.j,d,c.right,null),null)}return new Z(b.key,b.j,b.left,jh(b.right,c),null)}if(c instanceof Z)return new Z(c.key,c.j,jh(b,c.left),c.right,null);d=jh(b.right,c.left);return d instanceof Z?new Z(d.key,d.j,new dh(b.key,b.j,b.left,d.left,null),new dh(c.key,c.j,d.right,c.right,null),null):gh(b.key,b.j,b.left,new dh(c.key,c.j,d,c.right,null))},kh=function kh(b,c,d,e){if(null!=c){var f;f=c.key;f=b.a?b.a(d,f):b.call(null,d,f);if(0===f)return e[0]=c,jh(c.left,c.right);if(0>f)return b=
kh(b,c.left,d,e),null!=b||null!=e[0]?c.left instanceof dh?gh(c.key,c.j,b,c.right):new Z(c.key,c.j,b,c.right,null):null;b=kh(b,c.right,d,e);if(null!=b||null!=e[0])if(c.right instanceof dh)if(e=c.key,d=c.j,c=c.left,b instanceof Z)c=new Z(e,d,c,b.Eb(),null);else if(c instanceof dh)c=eh(e,d,c.Vc(),b);else if(c instanceof Z&&c.right instanceof dh)c=new Z(c.right.key,c.right.j,eh(c.key,c.j,c.left.Vc(),c.right.left),new dh(e,d,c.right.right,b,null),null);else throw Error("red-black tree invariant violation");
else c=new Z(c.key,c.j,c.left,b,null);else c=null;return c}return null},lh=function lh(b,c,d,e){var f=c.key,h=b.a?b.a(d,f):b.call(null,d,f);return 0===h?c.replace(f,e,c.left,c.right):0>h?c.replace(f,c.j,lh(b,c.left,d,e),c.right):c.replace(f,c.j,c.left,lh(b,c.right,d,e))};Be;function mh(a,b,c,d,e){this.Va=a;this.Db=b;this.B=c;this.C=d;this.s=e;this.v=418776847;this.K=8192}g=mh.prototype;
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=K(b))Yd(b)?(c=Bc(b),b=Cc(b),h=c,d=Q(c),c=h):(c=L(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=N(b),c=null,d=0),e=0;else return null};g.get=function(a,b){return this.M(null,a,b)};g.entries=function(){return tg(K(this))};g.toString=function(){return Jc(this)};g.keys=function(){return ed(zg.g?zg.g(this):zg.call(null,this))};
g.values=function(){return ed(Ag.g?Ag.g(this):Ag.call(null,this))};g.equiv=function(a){return this.G(null,a)};function nh(a,b){for(var c=a.Db;;)if(null!=c){var d;d=c.key;d=a.Va.a?a.Va.a(b,d):a.Va.call(null,b,d);if(0===d)return c;c=0>d?c.left:c.right}else return null}g.has=function(a){return ee(this,a)};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){a=nh(this,b);return null!=a?a.j:c};g.qc=function(a,b,c){return null!=this.Db?hh(this.Db,b,c):c};g.R=function(){return this.C};
g.sa=function(){return new mh(this.Va,this.Db,this.B,this.C,this.s)};g.Y=function(){return this.B};g.rc=function(){return 0<this.B?ch(this.Db,!1,this.B):null};g.P=function(){var a=this.s;return null!=a?a:this.s=a=ld(this)};g.G=function(a,b){return qg(this,b)};g.ma=function(){return new mh(this.Va,null,0,this.C,0)};g.Ua=function(a,b){var c=[null],d=kh(this.Va,this.Db,b,c);return null==d?null==Jd(c,0)?this:new mh(this.Va,null,0,this.C,null):new mh(this.Va,d.Eb(),this.B-1,this.C,null)};
g.Ia=function(a,b,c){a=[null];var d=ih(this.Va,this.Db,b,c,a);return null==d?(a=Jd(a,0),Rc.a(c,a.j)?this:new mh(this.Va,lh(this.Va,this.Db,b,c),this.B,this.C,null)):new mh(this.Va,d.Eb(),this.B+1,this.C,null)};g.cd=function(a,b){return null!=nh(this,b)};g.U=function(){return 0<this.B?ch(this.Db,!0,this.B):null};g.S=function(a,b){return new mh(this.Va,this.Db,this.B,b,this.s)};
g.V=function(a,b){if(Vd(b))return Nb(this,B.a(b,0),B.a(b,1));for(var c=this,d=K(b);;){if(null==d)return c;var e=L(d);if(Vd(e))c=Nb(c,B.a(e,0),B.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var oh=new mh(Sc,null,0,null,md);mh.prototype[sb]=function(){return ed(this)};
var nd=function nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return nd.A(0<c.length?new J(c.slice(0),0):null)};nd.A=function(a){for(var b=K(a),c=tc(Dg);;)if(b){a=N(N(b));var d=L(b),b=Ed(b),c=wc(c,d,b),b=a}else return vc(c)};nd.I=0;nd.L=function(a){return nd.A(K(a))};var ph=function ph(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ph.A(0<c.length?new J(c.slice(0),0):null)};
ph.A=function(a){a=a instanceof J&&0===a.F?a.l:kb.g(a);return Eg(a,!0,!1)};ph.I=0;ph.L=function(a){return ph.A(K(a))};function qh(a,b){this.W=a;this.Ga=b;this.v=32374988;this.K=0}g=qh.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.Ga};g.Ha=function(){var a=(null!=this.W?this.W.v&128||this.W.dd||(this.W.v?0:w(Jb,this.W)):w(Jb,this.W))?this.W.Ha(null):N(this.W);return null==a?null:new qh(a,this.Ga)};g.P=function(){return id(this)};
g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.Ga)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return this.W.qa(null).Hc(null)};g.xa=function(){var a=(null!=this.W?this.W.v&128||this.W.dd||(this.W.v?0:w(Jb,this.W)):w(Jb,this.W))?this.W.Ha(null):N(this.W);return null!=a?new qh(a,this.Ga):M};g.U=function(){return this};g.S=function(a,b){return new qh(this.W,b)};g.V=function(a,b){return P(b,this)};qh.prototype[sb]=function(){return ed(this)};
function zg(a){return(a=K(a))?new qh(a,null):null}function Be(a){return Sb(a)}function rh(a,b){this.W=a;this.Ga=b;this.v=32374988;this.K=0}g=rh.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.R=function(){return this.Ga};g.Ha=function(){var a=(null!=this.W?this.W.v&128||this.W.dd||(this.W.v?0:w(Jb,this.W)):w(Jb,this.W))?this.W.Ha(null):N(this.W);return null==a?null:new rh(a,this.Ga)};g.P=function(){return id(this)};g.G=function(a,b){return od(this,b)};
g.ma=function(){return pd(M,this.Ga)};g.va=function(a,b){return Dd.a(b,this)};g.wa=function(a,b,c){return Dd.h(b,c,this)};g.qa=function(){return this.W.qa(null).Ic(null)};g.xa=function(){var a=(null!=this.W?this.W.v&128||this.W.dd||(this.W.v?0:w(Jb,this.W)):w(Jb,this.W))?this.W.Ha(null):N(this.W);return null!=a?new rh(a,this.Ga):M};g.U=function(){return this};g.S=function(a,b){return new rh(this.W,b)};g.V=function(a,b){return P(b,this)};rh.prototype[sb]=function(){return ed(this)};
function Ag(a){return(a=K(a))?new rh(a,null):null}function Ce(a){return Tb(a)}var sh=function sh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return sh.A(0<c.length?new J(c.slice(0),0):null)};sh.A=function(a){return t(ff(me,a))?ub.a(function(a,c){return Gd.a(t(a)?a:X,c)},a):null};sh.I=0;sh.L=function(a){return sh.A(K(a))};th;function uh(a){this.xc=a}uh.prototype.za=function(){return this.xc.za()};
uh.prototype.next=function(){if(this.xc.za())return this.xc.next().ba[0];throw Error("No such element");};uh.prototype.remove=function(){return Error("Unsupported operation")};function vh(a,b,c){this.C=a;this.Sb=b;this.s=c;this.v=15077647;this.K=8196}g=vh.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.keys=function(){return ed(K(this))};g.entries=function(){return vg(K(this))};g.values=function(){return ed(K(this))};g.has=function(a){return ee(this,a)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=K(b))Yd(b)?(c=Bc(b),b=Cc(b),h=c,d=Q(c),c=h):(c=L(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=N(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){return Mb(this.Sb,b)?b:c};g.Aa=function(){return new uh(Hc(this.Sb))};g.R=function(){return this.C};g.sa=function(){return new vh(this.C,this.Sb,this.s)};
g.Y=function(){return Ab(this.Sb)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=ld(this)};g.G=function(a,b){return Sd(b)&&Q(this)===Q(b)&&ef(function(a){return function(b){return ee(a,b)}}(this),b)};g.pc=function(){return new th(tc(this.Sb))};g.ma=function(){return pd(wh,this.C)};g.U=function(){return zg(this.Sb)};g.S=function(a,b){return new vh(b,this.Sb,this.s)};g.V=function(a,b){return new vh(this.C,Ld.h(this.Sb,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var wh=new vh(null,X,md);vh.prototype[sb]=function(){return ed(this)};
function th(a){this.Lb=a;this.K=136;this.v=259}g=th.prototype;g.$b=function(a,b){this.Lb=wc(this.Lb,b,null);return this};g.sc=function(){return new vh(null,vc(this.Lb),null)};g.Y=function(){return Q(this.Lb)};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){return Lb.h(this.Lb,b,ae)===ae?c:b};
g.call=function(){function a(a,b,c){return Lb.h(this.Lb,b,ae)===ae?c:b}function b(a,b){return Lb.h(this.Lb,b,ae)===ae?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.h=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return Lb.h(this.Lb,a,ae)===ae?null:a};g.a=function(a,b){return Lb.h(this.Lb,a,ae)===ae?b:a};
function xh(a,b,c){this.C=a;this.Mb=b;this.s=c;this.v=417730831;this.K=8192}g=xh.prototype;g.toString=function(){return Jc(this)};g.equiv=function(a){return this.G(null,a)};g.keys=function(){return ed(K(this))};g.entries=function(){return vg(K(this))};g.values=function(){return ed(K(this))};g.has=function(a){return ee(this,a)};
g.forEach=function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=K(b))Yd(b)?(c=Bc(b),b=Cc(b),h=c,d=Q(c),c=h):(c=L(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=N(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){a=nh(this.Mb,b);return null!=a?a.key:c};g.R=function(){return this.C};g.sa=function(){return new xh(this.C,this.Mb,this.s)};g.Y=function(){return Q(this.Mb)};
g.rc=function(){return 0<Q(this.Mb)?S.a(Be,pc(this.Mb)):null};g.P=function(){var a=this.s;return null!=a?a:this.s=a=ld(this)};g.G=function(a,b){return Sd(b)&&Q(this)===Q(b)&&ef(function(a){return function(b){return ee(a,b)}}(this),b)};g.ma=function(){return new xh(this.C,Bb(this.Mb),0)};g.U=function(){return zg(this.Mb)};g.S=function(a,b){return new xh(b,this.Mb,this.s)};g.V=function(a,b){return new xh(this.C,Ld.h(this.Mb,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};xh.prototype[sb]=function(){return ed(this)};
function Ae(a){if(null!=a&&(a.K&4096||a.Ve))return a.name;if("string"===typeof a)return a;throw Error([z("Doesn't support name: "),z(a)].join(""));}function yh(a,b,c){this.F=a;this.end=b;this.step=c}yh.prototype.za=function(){return 0<this.step?this.F<this.end:this.F>this.end};yh.prototype.next=function(){var a=this.F;this.F+=this.step;return a};function zh(a,b,c,d,e){this.C=a;this.start=b;this.end=c;this.step=d;this.s=e;this.v=32375006;this.K=8192}g=zh.prototype;g.toString=function(){return Jc(this)};
g.equiv=function(a){return this.G(null,a)};g.ca=function(a,b){if(b<Ab(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.Ma=function(a,b,c){return b<Ab(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.Aa=function(){return new yh(this.start,this.end,this.step)};g.R=function(){return this.C};g.sa=function(){return new zh(this.C,this.start,this.end,this.step,this.s)};
g.Ha=function(){return 0<this.step?this.start+this.step<this.end?new zh(this.C,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new zh(this.C,this.start+this.step,this.end,this.step,null):null};g.Y=function(){return ob(lc(this))?0:Math.ceil((this.end-this.start)/this.step)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=id(this)};g.G=function(a,b){return od(this,b)};g.ma=function(){return pd(M,this.C)};g.va=function(a,b){return sd(this,b)};
g.wa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(rd(c))return O.g?O.g(c):O.call(null,c);a+=this.step}else return c};g.qa=function(){return null==lc(this)?null:this.start};g.xa=function(){return null!=lc(this)?new zh(this.C,this.start+this.step,this.end,this.step,null):M};g.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.S=function(a,b){return new zh(b,this.start,this.end,this.step,this.s)};g.V=function(a,b){return P(b,this)};zh.prototype[sb]=function(){return ed(this)};function Ah(a,b){return new Le(null,function(){var c=K(b);return c?Bh(a,L(c),cd(c)):Db(M,a.o?a.o():a.call(null))},null,null)}function Bh(a,b,c){return P(b,new Le(null,function(){var d=K(c);if(d){var e=Bh,f;f=L(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,cd(d))}else d=null;return d},null,null))}
function Ch(a){a:for(var b=a;;)if(K(b))b=N(b);else break a;return a}function Dh(a,b){if("string"===typeof b){var c=a.exec(b);return Rc.a(L(c),b)?1===Q(c)?L(c):ke(c):null}throw new TypeError("re-matches must match against a string.");}function Eh(a,b){if("string"===typeof b){var c=a.exec(b);return null==c?null:1===Q(c)?L(c):ke(c)}throw new TypeError("re-find must match against a string.");}
function Fh(a){if(a instanceof RegExp)return a;var b=Eh(/^\(\?([idmsux]*)\)/,a),c=R(b,0),b=R(b,1),c=Q(c);return new RegExp(a.substring(c),t(b)?b:"")}
function bg(a,b,c,d,e,f,h){var k=$a;$a=null==$a?null:$a-1;try{if(null!=$a&&0>$a)return qc(a,"#");qc(a,c);if(0===jb.g(f))K(h)&&qc(a,function(){var a=Gh.g(f);return t(a)?a:"..."}());else{if(K(h)){var l=L(h);b.h?b.h(l,a,f):b.call(null,l,a,f)}for(var m=N(h),n=jb.g(f)-1;;)if(!m||null!=n&&0===n){K(m)&&0===n&&(qc(a,d),qc(a,function(){var a=Gh.g(f);return t(a)?a:"..."}()));break}else{qc(a,d);var r=L(m);c=a;h=f;b.h?b.h(r,c,h):b.call(null,r,c,h);var v=N(m);c=n-1;m=v;n=c}}return qc(a,e)}finally{$a=k}}
function Hh(a,b){for(var c=K(b),d=null,e=0,f=0;;)if(f<e){var h=d.ca(null,f);qc(a,h);f+=1}else if(c=K(c))d=c,Yd(d)?(c=Bc(d),e=Cc(d),d=c,h=Q(c),c=e,e=h):(h=L(d),qc(a,h),c=N(d),d=null,e=0),f=0;else return null}var Ih={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Jh(a){return[z('"'),z(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Ih[a]})),z('"')].join("")}Kh;
function Lh(a,b){var c=ce(G.a(a,gb));return c?(c=null!=b?b.v&131072||b.Ue?!0:!1:!1)?null!=Qd(b):c:c}
function Mh(a,b,c){if(null==a)return qc(b,"nil");if(Lh(c,a)){qc(b,"^");var d=Qd(a);Y.h?Y.h(d,b,c):Y.call(null,d,b,c);qc(b," ")}if(a.Kc)return a.gd(a,b,c);if(null!=a&&(a.v&2147483648||a.da))return a.O(null,b,c);if(!0===a||!1===a||"number"===typeof a)return qc(b,""+z(a));if(null!=a&&a.constructor===Object)return qc(b,"#js "),d=S.a(function(b){return new V(null,2,5,W,[Ke.g(b),a[b]],null)},Zd(a)),Kh.J?Kh.J(d,Y,b,c):Kh.call(null,d,Y,b,c);if(nb(a))return bg(b,Y,"#js ["," ","]",c,a);if(ha(a))return t(eb.g(c))?
qc(b,Jh(a)):qc(b,a);if(ka(a)){var e=a.name;c=t(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Hh(b,H(["#object[",c,' "',""+z(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+z(a);;)if(Q(c)<b)c=[z("0"),z(c)].join("");else return c},Hh(b,H(['#inst "',""+z(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Hh(b,H(['#"',a.source,'"'],0));if(null!=a&&(a.v&2147483648||a.da))return rc(a,b,c);if(t(a.constructor.bc))return Hh(b,H(["#object[",a.constructor.bc.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=t(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Hh(b,H(["#object[",c," ",""+z(a),"]"],0))}function Y(a,b,c){var d=Nh.g(c);return t(d)?(c=Ld.h(c,Oh,Mh),d.h?d.h(a,b,c):d.call(null,a,b,c)):Mh(a,b,c)}
var rf=function rf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return rf.A(0<c.length?new J(c.slice(0),0):null)};rf.A=function(a){var b=cb();if(null==a||ob(K(a)))b="";else{var c=z,d=new Ga;a:{var e=new Ic(d);Y(L(a),e,b);a=K(N(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.ca(null,k);qc(e," ");Y(l,e,b);k+=1}else if(a=K(a))f=a,Yd(f)?(a=Bc(f),h=Cc(f),f=a,l=Q(a),a=h,h=l):(l=L(f),qc(e," "),Y(l,e,b),a=N(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};rf.I=0;
rf.L=function(a){return rf.A(K(a))};function Kh(a,b,c,d){return bg(c,function(a,c,d){var k=Sb(a);b.h?b.h(k,c,d):b.call(null,k,c,d);qc(c," ");a=Tb(a);return b.h?b.h(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,K(a))}wf.prototype.da=!0;wf.prototype.O=function(a,b,c){qc(b,"#object [cljs.core.Volatile ");Y(new q(null,1,[Ph,this.state],null),b,c);return qc(b,"]")};ad.prototype.da=!0;ad.prototype.O=function(a,b,c){qc(b,"#'");return Y(this.sd,b,c)};J.prototype.da=!0;
J.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Le.prototype.da=!0;Le.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};bh.prototype.da=!0;bh.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Xg.prototype.da=!0;Xg.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};dh.prototype.da=!0;dh.prototype.O=function(a,b,c){return bg(b,Y,"["," ","]",c,this)};yg.prototype.da=!0;yg.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};
gd.prototype.da=!0;gd.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};xh.prototype.da=!0;xh.prototype.O=function(a,b,c){return bg(b,Y,"#{"," ","}",c,this)};Xd.prototype.da=!0;Xd.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Ie.prototype.da=!0;Ie.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};yd.prototype.da=!0;yd.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Kd.prototype.da=!0;Kd.prototype.O=function(a,b,c){return Kh(this,Y,b,c)};
Yg.prototype.da=!0;Yg.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};hg.prototype.da=!0;hg.prototype.O=function(a,b,c){return bg(b,Y,"["," ","]",c,this)};mh.prototype.da=!0;mh.prototype.O=function(a,b,c){return Kh(this,Y,b,c)};vh.prototype.da=!0;vh.prototype.O=function(a,b,c){return bg(b,Y,"#{"," ","}",c,this)};Wd.prototype.da=!0;Wd.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};of.prototype.da=!0;
of.prototype.O=function(a,b,c){qc(b,"#object [cljs.core.Atom ");Y(new q(null,1,[Ph,this.state],null),b,c);return qc(b,"]")};rh.prototype.da=!0;rh.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Z.prototype.da=!0;Z.prototype.O=function(a,b,c){return bg(b,Y,"["," ","]",c,this)};V.prototype.da=!0;V.prototype.O=function(a,b,c){return bg(b,Y,"["," ","]",c,this)};lg.prototype.da=!0;lg.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Ge.prototype.da=!0;
Ge.prototype.O=function(a,b){return qc(b,"()")};df.prototype.da=!0;df.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};mg.prototype.da=!0;mg.prototype.O=function(a,b,c){return bg(b,Y,"#queue ["," ","]",c,K(this))};q.prototype.da=!0;q.prototype.O=function(a,b,c){return Kh(this,Y,b,c)};zh.prototype.da=!0;zh.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};qh.prototype.da=!0;qh.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};zd.prototype.da=!0;
zd.prototype.O=function(a,b,c){return bg(b,Y,"("," ",")",c,this)};Qc.prototype.Zb=!0;Qc.prototype.Fb=function(a,b){if(b instanceof Qc)return Zc(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};u.prototype.Zb=!0;u.prototype.Fb=function(a,b){if(b instanceof u)return Je(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};hg.prototype.Zb=!0;
hg.prototype.Fb=function(a,b){if(Vd(b))return fe(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};V.prototype.Zb=!0;V.prototype.Fb=function(a,b){if(Vd(b))return fe(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};function Qh(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return rd(d)?new qd(d):d}}
function Ef(a){return function(b){return function(){function c(a,c){return ub.h(b,a,c)}function d(b){return a.g?a.g(b):a.call(null,b)}function e(){return a.o?a.o():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.o=e;f.g=d;f.a=c;return f}()}(Qh(a))}Rh;function Sh(){}
var Th=function Th(b){if(null!=b&&null!=b.Qe)return b.Qe(b);var c=Th[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Th._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IEncodeJS.-clj-\x3ejs",b);};Uh;function Vh(a){return(null!=a?a.Pe||(a.Od?0:w(Sh,a)):w(Sh,a))?Th(a):"string"===typeof a||"number"===typeof a||a instanceof u||a instanceof Qc?Uh.g?Uh.g(a):Uh.call(null,a):rf.A(H([a],0))}
var Uh=function Uh(b){if(null==b)return null;if(null!=b?b.Pe||(b.Od?0:w(Sh,b)):w(Sh,b))return Th(b);if(b instanceof u)return Ae(b);if(b instanceof Qc)return""+z(b);if(Ud(b)){var c={};b=K(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.ca(null,f),k=R(h,0),h=R(h,1);c[Vh(k)]=Uh(h);f+=1}else if(b=K(b))Yd(b)?(e=Bc(b),b=Cc(b),d=e,e=Q(e)):(e=L(b),d=R(e,0),e=R(e,1),c[Vh(d)]=Uh(e),b=N(b),d=null,e=0),f=0;else break;return c}if(Rd(b)){c=[];b=K(S.a(Uh,b));d=null;for(f=e=0;;)if(f<e)k=d.ca(null,f),c.push(k),f+=1;else if(b=
K(b))d=b,Yd(d)?(b=Bc(d),f=Cc(d),d=b,e=Q(b),b=f):(b=L(d),c.push(b),b=N(d),d=null,e=0),f=0;else break;return c}return b};function Wh(){}var Xh=function Xh(b,c){if(null!=b&&null!=b.Oe)return b.Oe(b,c);var d=Xh[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Xh._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IEncodeClojure.-js-\x3eclj",b);};
function Yh(a,b){var c=null!=b&&(b.v&64||b.na)?A.a(nd,b):b,d=G.a(c,Zh);return function(a,c,d,k){return function m(n){return(null!=n?n.xf||(n.Od?0:w(Wh,n)):w(Wh,n))?Xh(n,A.a(ph,b)):be(n)?Ch(S.a(m,n)):Rd(n)?If(null==n?null:Bb(n),S.a(m,n)):nb(n)?ke(S.a(m,n)):qb(n)===Object?If(X,function(){return function(a,b,c,d){return function F(e){return new Le(null,function(a,b,c,d){return function(){for(;;){var a=K(e);if(a){if(Yd(a)){var b=Bc(a),c=Q(b),f=Pe(c);a:for(var h=0;;)if(h<c){var k=B.a(b,h),k=new V(null,
2,5,W,[d.g?d.g(k):d.call(null,k),m(n[k])],null);f.add(k);h+=1}else{b=!0;break a}return b?Qe(f.ua(),F(Cc(a))):Qe(f.ua(),null)}f=L(a);return P(new V(null,2,5,W,[d.g?d.g(f):d.call(null,f),m(n[f])],null),F(cd(a)))}return null}}}(a,b,c,d),null,null)}}(a,c,d,k)(Zd(n))}()):n}}(b,c,d,t(d)?Ke:z)(a)}
var Rh=function Rh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rh.o();case 1:return Rh.g(arguments[0]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Rh.o=function(){return Rh.g(1)};Rh.g=function(a){return Math.random()*a};Rh.I=1;function $h(a,b){this.Bb=a;this.s=b;this.v=2153775104;this.K=2048}g=$h.prototype;g.toString=function(){return this.Bb};g.equiv=function(a){return this.G(null,a)};
g.G=function(a,b){return b instanceof $h&&this.Bb===b.Bb};g.O=function(a,b){return qc(b,[z('#uuid "'),z(this.Bb),z('"')].join(""))};g.P=function(){null==this.s&&(this.s=Vc(this.Bb));return this.s};g.Fb=function(a,b){return Ta(this.Bb,b.Bb)};var ai=new u(null,"response","response",-1068424192),bi=new u(null,"rng","rng",1082666016),ci=new u(null,"y","y",-1757859776),di=new u(null,"description","description",-1428560544),ei=new u(null,"text-anchor","text-anchor",585613696),fi=new u(null,"load","load",-1318641184),gi=new u(null,"path","path",-188191168),hi=new Qc(null,"itm","itm",-713282527,null),ii=new u(null,"stroke-dasharray","stroke-dasharray",-942933855),ji=new Qc(null,".-length",".-length",-280799999,null),ki=new Qc("burn.core","step",
"burn.core/step",931759393,null),li=new u(null,"finally","finally",1589088705),mi=new u(null,"format","format",-1306924766),ni=new Qc(null,"puts","puts",-1883877054,null),oi=new u(null,"rx","rx",1627208482),pi=new Qc(null,"step","step",-1365547645,null),qi=new u(null,"stroke","stroke",1741823555),ri=new u(null,"fn","fn",-1175266204),si=new Qc(null,"\x3c","\x3c",993667236,null),ti=new u(null,"api","api",-899839580),ui=new u(null,"original-text","original-text",744448452),vi=new u(null,"transform",
"transform",1381301764),gb=new u(null,"meta","meta",1499536964),wi=new u(null,"dx","dx",-381796732),xi=new u(null,"ul","ul",-1349521403),yi=new u(null,"color","color",1011675173),zi=new u(null,"keywords?","keywords?",764949733),Ai=new Qc(null,"blockable","blockable",-28395259,null),hb=new u(null,"dup","dup",556298533),Bi=new u(null,"read","read",1140058661),Ci=new u(null,"projection-strategy","projection-strategy",-608325691),Di=new u(null,"private","private",-558947994),Ei=new Qc(null,"model","model",
1971684742,null),Fi=new u(null,"not-initialized","not-initialized",-1937378906),Gi=new u(null,"font-size","font-size",-1847940346),Hi=new u(null,"failure","failure",720415879),Ii=new u(null,"scale","scale",-230427353),Ji=new u(null,"button","button",1456579943),uf=new Qc(null,"new-value","new-value",-1567397401,null),qf=new u(null,"validator","validator",-1966190681),Ki=new u(null,"method","method",55703592),Li=new u(null,"raw","raw",1604651272),Mi=new u(null,"default","default",-1987822328),Ni=new u(null,
"finally-block","finally-block",832982472),Oi=new u(null,"ns","ns",441598760),Pi=new u(null,"strong","strong",269529E3),Qi=new u(null,"name","name",1843675177),Ri=new u(null,"n","n",562130025),Si=new u(null,"li","li",723558921),Ti=new u(null,"fill","fill",883462889),Ui=new u(null,"clipPathUnits","clipPathUnits",-1747479222),Vi=new u(null,"ondrop","ondrop",-1343708790),Wi=new u(null,"response-format","response-format",1664465322),Xi=new u(null,"status-text","status-text",-1834235478),Yi=new u(null,
"file","file",-1269645878),Zi=new u(null,"y1","y1",589123466),$i=new u(null,"end-column","end-column",1425389514),aj=new u(null,"width","width",-384071477),bj=new u(null,"aborted","aborted",1775972619),cj=new u(null,"onclick","onclick",1297553739),dj=new u(null,"dy","dy",1719547243),ej=new u(null,"clipPath","clipPath",-934619797),fj=new u(null,"processing-request","processing-request",-264947221),gj=new u(null,"params","params",710516235),hj=new u(null,"projector","projector",1428597707),Ph=new u(null,
"val","val",128701612),ij=new u(null,"recur","recur",-437573268),jj=new u(null,"type","type",1174270348),kj=new u(null,"request-received","request-received",2110590540),lj=new u(null,"update","update",1045576396),mj=new u(null,"catch-block","catch-block",1175212748),tf=new Qc(null,"validate","validate",1439230700,null),nj=new u(null,"params-to-str","params-to-str",-934869108),oj=new Qc(null,"\x3e","\x3e",1085014381,null),Oh=new u(null,"fallback-impl","fallback-impl",-1501286995),pj=new u(null,"handlers",
"handlers",79528781),db=new u(null,"flush-on-newline","flush-on-newline",-151457939),qj=new u(null,"extremes","extremes",1490048973),rj=new u(null,"parse-error","parse-error",255902478),sj=new u(null,"ondragover","ondragover",1004915919),tj=new u(null,"className","className",-1983287057),uj=new u(null,"no-op","no-op",-93046065),vj=new u(null,"prefix","prefix",-265908465),wj=new u(null,"column","column",2078222095),yj=new u(null,"headers","headers",-835030129),zj=new u(null,"dropping","dropping",125809647),
Aj=new u(null,"high","high",2027297808),Bj=new u(null,"error-handler","error-handler",-484945776),Cj=new u(null,"small","small",2133478704),Dj=new u(null,"style","style",-496642736),Ej=new u(null,"clip-path","clip-path",-439959120),Fj=new u(null,"write","write",-1857649168),Gj=new u(null,"stroke-linecap","stroke-linecap",-1201103248),zf=new Qc(null,"n","n",-2092305744,null),Hj=new u(null,"div","div",1057191632),eb=new u(null,"readably","readably",1129599760),Ij=new u(null,"summary","summary",380847952),
Jj=new Qc(null,"box","box",-1123515375,null),Gh=new u(null,"more-marker","more-marker",-14717935),Kj=new u(null,"g","g",1738089905),Lj=new u(null,"filename","filename",-1428840783),Mj=new Qc(null,"nil?","nil?",1612038930,null),Nj=new u(null,"line","line",212345235),Oj=new u(null,"stroke-width","stroke-width",716836435),Pj=new u(null,"weight","weight",-1262796205),Qj=new Qc(null,"val","val",1769233139,null),Rj=new Qc(null,"not","not",1044554643,null),Sj=new u(null,"status","status",-1997798413),Tj=
new u(null,"response-ready","response-ready",245208276),jb=new u(null,"print-length","print-length",1931866356),Uj=new u(null,"writer","writer",-277568236),Vj=new u(null,"raw-data","raw-data",617791828),Wj=new u(null,"label","label",1718410804),Xj=new u(null,"id","id",-1388402092),Yj=new u(null,"class","class",-2030961996),Zj=new u(null,"catch-exception","catch-exception",-1997306795),ak=new u(null,"current","current",-1088038603),bk=new u(null,"reader","reader",169660853),ck=new u(null,"checked",
"checked",-50955819),dk=new u(null,"defs","defs",1398449717),ek=new u(null,"parse","parse",-1162164619),fk=new Qc(null,"/","/",-1371932971,null),gk=new u(null,"prev","prev",-1597069226),hk=new u(null,"svg","svg",856789142),ik=new Qc(null,"buf-or-n","buf-or-n",-1646815050,null),jk=new u(null,"continue-block","continue-block",-1852047850),kk=new u(null,"content-type","content-type",-508222634),lk=new u(null,"end-line","end-line",1837326455),mk=new u(null,"low","low",-1601362409),nk=new u(null,"ondragleave",
"ondragleave",-1278260585),ok=new u(null,"d","d",1972142424),pk=new u(null,"f","f",-1597136552),qk=new u(null,"average","average",-492356168),rk=new u(null,"error","error",-978969032),sk=new u(null,"dropping?","dropping?",-1065207176),tk=new u(null,"exception","exception",-335277064),uk=new u(null,"x","x",2099068185),vk=new u(null,"x1","x1",-1863922247),wk=new u(null,"uri","uri",-774711847),xk=new u(null,"tag","tag",-1290361223),yk=new u(null,"interceptors","interceptors",-1546782951),zk=new u(null,
"domain","domain",1847214937),Ak=new u(null,"input","input",556931961),Bk=new u(null,"json","json",1279968570),cf=new Qc(null,"quote","quote",1377916282,null),Ck=new u(null,"timeout","timeout",-318625318),Dk=new u(null,"h1","h1",-1896887462),bf=new u(null,"arglists","arglists",1661989754),Ek=new u(null,"y2","y2",-718691301),af=new Qc(null,"nil-iter","nil-iter",1101030523,null),Fk=new u(null,"main","main",-2117802661),Gk=new u(null,"body","body",-2049205669),Hk=new u(null,"connection-established",
"connection-established",-1403749733),Ik=new Qc(null,"burn.core","burn.core",-1110211877,null),Nh=new u(null,"alt-impl","alt-impl",670969595),Jk=new Qc(null,"fn-handler","fn-handler",648785851,null),Kk=new u(null,"doc","doc",1913296891),Lk=new u(null,"handler","handler",-195596612),Zh=new u(null,"keywordize-keys","keywordize-keys",1310784252),Mk=new u(null,"rect","rect",-108902628),Nk=new Qc(null,"takes","takes",298247964,null),Ok=new Qc("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null),
Pk=new Qc(null,"deref","deref",1494944732,null),Qk=new u(null,"x2","x2",-1362513475),Rk=new u(null,"with-credentials","with-credentials",-1163127235),Sk=new u(null,"ry","ry",-334598563),Tk=new u(null,"test","test",577538877),Uk=new u(null,"failed","failed",-1397425762),yf=new Qc(null,"number?","number?",-1747282210,null),Vk=new u(null,"font-family","font-family",-667419874),Wk=new u(null,"average-last-three","average-last-three",-1827264674),Xk=new u(null,"height","height",1025178622),Yk=new u(null,
"clear","clear",1877104959),Zk=new u(null,"foreignObject","foreignObject",25502111),$k=new u(null,"text","text",-1790561697),al=new Qc(null,"f","f",43394975,null),bl=new Qc(null,"action","action",829293503,null);var cl,dl=function dl(b,c){if(null!=b&&null!=b.Nd)return b.Nd(0,c);var d=dl[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=dl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("ReadPort.take!",b);},el=function el(b,c,d){if(null!=b&&null!=b.fd)return b.fd(0,c,d);var e=el[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=el._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("WritePort.put!",b);},fl=function fl(b){if(null!=b&&null!=b.ed)return b.ed();
var c=fl[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=fl._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("Channel.close!",b);},gl=function gl(b){if(null!=b&&null!=b.oe)return!0;var c=gl[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=gl._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("Handler.active?",b);},hl=function hl(b){if(null!=b&&null!=b.pe)return b.ha;var c=hl[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=hl._;if(null!=c)return c.g?
c.g(b):c.call(null,b);throw x("Handler.commit",b);},il=function il(b,c){if(null!=b&&null!=b.ne)return b.ne(0,c);var d=il[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=il._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("Buffer.add!*",b);},jl=function jl(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return jl.g(arguments[0]);case 2:return jl.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),
z(c.length)].join(""));}};jl.g=function(a){return a};jl.a=function(a,b){if(null==b)throw Error([z("Assert failed: "),z(rf.A(H([Pc(Rj,Pc(Mj,hi))],0)))].join(""));return il(a,b)};jl.I=2;function kl(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function ll(a,b,c,d){this.head=a;this.ba=b;this.length=c;this.l=d}ll.prototype.pop=function(){if(0===this.length)return null;var a=this.l[this.ba];this.l[this.ba]=null;this.ba=(this.ba+1)%this.l.length;--this.length;return a};ll.prototype.unshift=function(a){this.l[this.head]=a;this.head=(this.head+1)%this.l.length;this.length+=1;return null};function ml(a,b){a.length+1===a.l.length&&a.resize();a.unshift(b)}
ll.prototype.resize=function(){var a=Array(2*this.l.length);return this.ba<this.head?(kl(this.l,this.ba,a,0,this.length),this.ba=0,this.head=this.length,this.l=a):this.ba>this.head?(kl(this.l,this.ba,a,0,this.l.length-this.ba),kl(this.l,0,a,this.l.length-this.ba,this.head),this.ba=0,this.head=this.length,this.l=a):this.ba===this.head?(this.head=this.ba=0,this.l=a):null};function nl(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.g?b.g(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function ol(a){if(!(0<a))throw Error([z("Assert failed: "),z("Can't create a ring buffer of size 0"),z("\n"),z(rf.A(H([Pc(oj,zf,0)],0)))].join(""));return new ll(0,0,0,Array(a))}function pl(a,b){this.X=a;this.n=b;this.v=2;this.K=0}function ql(a){return a.X.length===a.n}pl.prototype.ne=function(a,b){ml(this.X,b);return this};pl.prototype.Y=function(){return this.X.length};if("undefined"===typeof rl)var rl={};var sl;a:{var tl=ba.navigator;if(tl){var ul=tl.userAgent;if(ul){sl=ul;break a}}sl=""}function vl(a){return-1!=sl.indexOf(a)};var wl;
function xl(){var a=ba.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!vl("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=qa(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!vl("Trident")&&!vl("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.fe;c.fe=null;a()}};return function(a){d.next={fe:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){ba.setTimeout(a,0)}};var yl=ol(32),zl=!1,Al=!1;Bl;function Cl(){zl=!0;Al=!1;for(var a=0;;){var b=yl.pop();if(null!=b&&(b.o?b.o():b.call(null),1024>a)){a+=1;continue}break}zl=!1;return 0<yl.length?Bl.o?Bl.o():Bl.call(null):null}function Bl(){var a=Al;if(t(t(a)?zl:a))return null;Al=!0;!ka(ba.setImmediate)||ba.Window&&ba.Window.prototype&&ba.Window.prototype.setImmediate==ba.setImmediate?(wl||(wl=xl()),wl(Cl)):ba.setImmediate(Cl)}function Dl(a){ml(yl,a);Bl()};var El,Fl=function Fl(b){"undefined"===typeof El&&(El=function(b,d,e){this.Ke=b;this.j=d;this.jf=e;this.v=425984;this.K=0},El.prototype.S=function(b,d){return new El(this.Ke,this.j,d)},El.prototype.R=function(){return this.jf},El.prototype.oc=function(){return this.j},El.Sd=function(){return new V(null,3,5,W,[pd(Jj,new q(null,1,[bf,Pc(cf,Pc(new V(null,1,5,W,[Qj],null)))],null)),Qj,Wa.If],null)},El.Kc=!0,El.bc="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333",El.gd=function(b,d){return qc(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333")});return new El(Fl,b,X)};function Gl(a,b){this.Ra=a;this.j=b}function Hl(a){return gl(a.Ra)}var Il=function Il(b){if(null!=b&&null!=b.me)return b.me();var c=Il[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Il._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("MMC.abort",b);};function Jl(a,b,c,d,e,f,h){this.jc=a;this.jd=b;this.Xb=c;this.hd=d;this.X=e;this.closed=f;this.Za=h}
Jl.prototype.me=function(){for(;;){var a=this.Xb.pop();if(null!=a){var b=a.Ra;Dl(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(b.ha,b,a.j,a,this))}break}nl(this.Xb,hf());return fl(this)};
Jl.prototype.fd=function(a,b,c){var d=this;if(null==b)throw Error([z("Assert failed: "),z("Can't put nil in on a channel"),z("\n"),z(rf.A(H([Pc(Rj,Pc(Mj,Qj))],0)))].join(""));if(a=d.closed)return Fl(!a);if(t(function(){var a=d.X;return t(a)?ob(ql(d.X)):a}())){for(c=rd(d.Za.a?d.Za.a(d.X,b):d.Za.call(null,d.X,b));;){if(0<d.jc.length&&0<Q(d.X)){var e=d.jc.pop(),f=e.ha,h=d.X.X.pop();Dl(function(a,b){return function(){return a.g?a.g(b):a.call(null,b)}}(f,h,e,c,a,this))}break}c&&Il(this);return Fl(!0)}e=
function(){for(;;){var a=d.jc.pop();if(t(a)){if(t(!0))return a}else return null}}();if(t(e))return c=hl(e),Dl(function(a){return function(){return a.g?a.g(b):a.call(null,b)}}(c,e,a,this)),Fl(!0);64<d.hd?(d.hd=0,nl(d.Xb,Hl)):d.hd+=1;if(t(c.Md(null))){if(!(1024>d.Xb.length))throw Error([z("Assert failed: "),z([z("No more than "),z(1024),z(" pending puts are allowed on a single channel."),z(" Consider using a windowed buffer.")].join("")),z("\n"),z(rf.A(H([Pc(si,Pc(ji,ni),Ok)],0)))].join(""));ml(d.Xb,
new Gl(c,b))}return null};
Jl.prototype.Nd=function(a,b){var c=this;if(null!=c.X&&0<Q(c.X)){for(var d=b.ha,e=Fl(c.X.X.pop());;){if(!t(ql(c.X))){var f=c.Xb.pop();if(null!=f){var h=f.Ra,k=f.j;Dl(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(h.ha,h,k,f,d,e,this));rd(c.Za.a?c.Za.a(c.X,k):c.Za.call(null,c.X,k))&&Il(this);continue}}break}return e}d=function(){for(;;){var a=c.Xb.pop();if(t(a)){if(gl(a.Ra))return a}else return null}}();if(t(d))return e=hl(d.Ra),Dl(function(a){return function(){return a.g?a.g(!0):
a.call(null,!0)}}(e,d,this)),Fl(d.j);if(t(c.closed))return t(c.X)&&(c.Za.g?c.Za.g(c.X):c.Za.call(null,c.X)),t(t(!0)?b.ha:!0)?(d=function(){var a=c.X;return t(a)?0<Q(c.X):a}(),d=t(d)?c.X.X.pop():null,Fl(d)):null;64<c.jd?(c.jd=0,nl(c.jc,gl)):c.jd+=1;if(t(b.Md(null))){if(!(1024>c.jc.length))throw Error([z("Assert failed: "),z([z("No more than "),z(1024),z(" pending takes are allowed on a single channel.")].join("")),z("\n"),z(rf.A(H([Pc(si,Pc(ji,Nk),Ok)],0)))].join(""));ml(c.jc,b)}return null};
Jl.prototype.ed=function(){var a=this;if(!a.closed)for(a.closed=!0,t(function(){var b=a.X;return t(b)?0===a.Xb.length:b}())&&(a.Za.g?a.Za.g(a.X):a.Za.call(null,a.X));;){var b=a.jc.pop();if(null==b)break;else{var c=b.ha,d=t(function(){var b=a.X;return t(b)?0<Q(a.X):b}())?a.X.X.pop():null;Dl(function(a,b){return function(){return a.g?a.g(b):a.call(null,b)}}(c,d,b,this))}}return null};function Kl(a){console.log(a);return null}
function Ll(a,b){var c=(t(null)?null:Kl).call(null,b);return null==c?a:jl.a(a,c)}
function Ml(a){return new Jl(ol(32),0,ol(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return Ll(c,e)}}function d(c){try{return a.g?a.g(c):a.call(null,c)}catch(d){return Ll(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.g=d;e.a=c;return e}()}(t(null)?null.g?null.g(jl):null.call(null,jl):jl)}())};var Nl,Ol=function Ol(b){"undefined"===typeof Nl&&(Nl=function(b,d,e){this.ef=b;this.ha=d;this.hf=e;this.v=393216;this.K=0},Nl.prototype.S=function(b,d){return new Nl(this.ef,this.ha,d)},Nl.prototype.R=function(){return this.hf},Nl.prototype.oe=function(){return!0},Nl.prototype.Md=function(){return!0},Nl.prototype.pe=function(){return this.ha},Nl.Sd=function(){return new V(null,3,5,W,[pd(Jk,new q(null,2,[Di,!0,bf,Pc(cf,Pc(new V(null,1,5,W,[al],null)))],null)),al,Wa.Hf],null)},Nl.Kc=!0,Nl.bc="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270",
Nl.gd=function(b,d){return qc(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270")});return new Nl(Ol,b,X)};function Pl(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].ed(),b;}}function Ql(a,b,c){c=c.Nd(0,Ol(function(c){a[2]=c;a[1]=b;return Pl(a)}));return t(c)?(a[2]=O.g?O.g(c):O.call(null,c),a[1]=b,ij):null}function Rl(a,b,c){b=b.fd(0,c,Ol(function(b){a[2]=b;a[1]=16;return Pl(a)}));return t(b)?(a[2]=O.g?O.g(b):O.call(null,b),a[1]=16,ij):null}
function Sl(a,b){var c=a[6];null!=b&&c.fd(0,b,Ol(function(){return function(){return null}}(c)));c.ed();return c}function Tl(a,b,c,d,e,f,h,k){this.eb=a;this.fb=b;this.vb=c;this.ub=d;this.zb=e;this.H=f;this.D=h;this.s=k;this.v=2229667594;this.K=8192}g=Tl.prototype;g.N=function(a,b){return Lb.h(this,b,null)};
g.M=function(a,b,c){switch(b instanceof u?b.Ba:null){case "catch-block":return this.eb;case "catch-exception":return this.fb;case "finally-block":return this.vb;case "continue-block":return this.ub;case "prev":return this.zb;default:return G.h(this.D,b,c)}};
g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,Ve.a(new V(null,5,5,W,[new V(null,2,5,W,[mj,this.eb],null),new V(null,2,5,W,[Zj,this.fb],null),new V(null,2,5,W,[Ni,this.vb],null),new V(null,2,5,W,[jk,this.ub],null),new V(null,2,5,W,[gk,this.zb],null)],null),this.D))};g.Aa=function(){return new rg(0,this,5,new V(null,5,5,W,[mj,Zj,Ni,jk,gk],null),Hc(this.D))};g.R=function(){return this.H};
g.sa=function(){return new Tl(this.eb,this.fb,this.vb,this.ub,this.zb,this.H,this.D,this.s)};g.Y=function(){return 5+Q(this.D)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};
g.Ua=function(a,b){return ee(new vh(null,new q(null,5,[Ni,null,mj,null,Zj,null,gk,null,jk,null],null),null),b)?Nd.a(pd(If(X,this),this.H),b):new Tl(this.eb,this.fb,this.vb,this.ub,this.zb,this.H,Ze(Nd.a(this.D,b)),null)};
g.Ia=function(a,b,c){return t(U.a?U.a(mj,b):U.call(null,mj,b))?new Tl(c,this.fb,this.vb,this.ub,this.zb,this.H,this.D,null):t(U.a?U.a(Zj,b):U.call(null,Zj,b))?new Tl(this.eb,c,this.vb,this.ub,this.zb,this.H,this.D,null):t(U.a?U.a(Ni,b):U.call(null,Ni,b))?new Tl(this.eb,this.fb,c,this.ub,this.zb,this.H,this.D,null):t(U.a?U.a(jk,b):U.call(null,jk,b))?new Tl(this.eb,this.fb,this.vb,c,this.zb,this.H,this.D,null):t(U.a?U.a(gk,b):U.call(null,gk,b))?new Tl(this.eb,this.fb,this.vb,this.ub,c,this.H,this.D,
null):new Tl(this.eb,this.fb,this.vb,this.ub,this.zb,this.H,Ld.h(this.D,b,c),null)};g.U=function(){return K(Ve.a(new V(null,5,5,W,[new V(null,2,5,W,[mj,this.eb],null),new V(null,2,5,W,[Zj,this.fb],null),new V(null,2,5,W,[Ni,this.vb],null),new V(null,2,5,W,[jk,this.ub],null),new V(null,2,5,W,[gk,this.zb],null)],null),this.D))};g.S=function(a,b){return new Tl(this.eb,this.fb,this.vb,this.ub,this.zb,b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};
function Ul(a){for(;;){var b=a[4],c=mj.g(b),d=Zj.g(b),e=a[5];if(t(function(){var a=e;return t(a)?ob(b):a}()))throw e;if(t(function(){var a=e;return t(a)?(a=c,t(a)?Rc.a(Mi,d)||e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Ld.A(b,mj,null,H([Zj,null],0));break}if(t(function(){var a=e;return t(a)?ob(c)&&ob(Ni.g(b)):a}()))a[4]=gk.g(b);else{if(t(function(){var a=e;return t(a)?(a=ob(c))?Ni.g(b):a:a}())){a[1]=Ni.g(b);a[4]=Ld.h(b,Ni,null);break}if(t(function(){var a=ob(e);return a?Ni.g(b):a}())){a[1]=
Ni.g(b);a[4]=Ld.h(b,Ni,null);break}if(ob(e)&&ob(Ni.g(b))){a[1]=jk.g(b);a[4]=gk.g(b);break}throw Error("No matching clause");}}};for(var Vl=Array(1),Wl=0;;)if(Wl<Vl.length)Vl[Wl]=null,Wl+=1;else break;function Xl(a){"undefined"===typeof cl&&(cl=function(a,c,d){this.ha=a;this.de=c;this.gf=d;this.v=393216;this.K=0},cl.prototype.S=function(a,c){return new cl(this.ha,this.de,c)},cl.prototype.R=function(){return this.gf},cl.prototype.oe=function(){return!0},cl.prototype.Md=function(){return this.de},cl.prototype.pe=function(){return this.ha},cl.Sd=function(){return new V(null,3,5,W,[al,Ai,Wa.Gf],null)},cl.Kc=!0,cl.bc="cljs.core.async/t_cljs$core$async15465",cl.gd=function(a,c){return qc(c,"cljs.core.async/t_cljs$core$async15465")});
return new cl(a,!0,X)}function Yl(a){a=Rc.a(a,0)?null:a;if(t(null)&&!t(a))throw Error([z("Assert failed: "),z("buffer must be supplied when transducer is"),z("\n"),z(rf.A(H([ik],0)))].join(""));a="number"===typeof a?new pl(ol(a),a):a;return Ml(a)}function Zl(a,b){var c=dl(a,Xl(b));if(t(c)){var d=O.g?O.g(c):O.call(null,c);t(!0)?b.g?b.g(d):b.call(null,d):Dl(function(a){return function(){return b.g?b.g(a):b.call(null,a)}}(d,c))}return null}var $l;$l=Xl(function(){return null});
function am(a,b){var c=el(a,b,$l);return t(c)?O.g?O.g(c):O.call(null,c):!0}
function bm(a){var b=ke(new V(null,1,5,W,[cm],null)),c=Yl(null),d=Q(b),e=Se(d),f=Yl(1),h=pf.g?pf.g(null):pf.call(null,null),k=Jf(function(a,b,c,d,e,f){return function(h){return function(a,b,c,d,e,f){return function(a){d[h]=a;return 0===vf.a(f,re)?am(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,h),new zh(null,0,d,1,null)),l=Yl(1);Dl(function(b,c,d,e,f,h,k,l){return function(){var I=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,ij)){d=
e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ul(c),d=ij;else throw f;}if(!U(d,ij))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.o=c;d.g=b;return d}()}(function(b,c,d,e,f,h,k,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,ij;if(1===f)return b[2]=
null,b[1]=2,ij;if(4===f){var m=b[7],f=m<e;b[1]=t(f)?6:7;return ij}return 15===f?(f=b[2],b[2]=f,b[1]=3,ij):13===f?(f=fl(d),b[2]=f,b[1]=15,ij):6===f?(b[2]=null,b[1]=11,ij):3===f?(f=b[2],Sl(b,f)):12===f?(f=b[8],f=b[2],m=ff(mb,f),b[8]=f,b[1]=t(m)?13:14,ij):2===f?(f=sf.a?sf.a(k,e):sf.call(null,k,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,ij):11===f?(m=b[7],b[4]=new Tl(10,Object,null,9,b[4],null,null,null),f=c.g?c.g(m):c.call(null,m),m=l.g?l.g(m):l.call(null,m),f=Zl(f,m),b[2]=f,Ul(b),ij):9===f?(m=b[7],b[10]=b[2],
b[7]=m+1,b[2]=null,b[1]=4,ij):5===f?(b[11]=b[2],Ql(b,12,h)):14===f?(f=b[8],f=A.a(a,f),Rl(b,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,ij):10===f?(m=b[2],f=vf.a(k,re),b[13]=m,b[2]=f,Ul(b),ij):8===f?(f=b[2],b[2]=f,b[1]=5,ij):null}}(b,c,d,e,f,h,k,l),b,c,d,e,f,h,k,l)}(),T=function(){var a=I.o?I.o():I.call(null);a[6]=b;return a}();return Pl(T)}}(l,b,c,d,e,f,h,k));return c};var dm=VDOM.diff,em=VDOM.patch,fm=VDOM.create;function gm(a){return Gf(gf(mb),Gf(gf(be),Hf(a)))}function hm(a,b,c){return new VDOM.VHtml(Ae(a),Uh(b),Uh(c))}function im(a,b,c){return new VDOM.VSvg(Ae(a),Uh(b),Uh(c))}jm;
var km=function km(b){if(null==b)return new VDOM.VText("");if(be(b))return hm(Hj,X,S.a(km,gm(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(Rc.a(hk,L(b)))return jm.g?jm.g(b):jm.call(null,b);var c=R(b,0),d=R(b,1);b=ze(b);return hm(c,d,S.a(km,gm(b)))},jm=function jm(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(Rc.a(Zk,L(b))){var c=R(b,0),d=R(b,1);b=ze(b);return im(c,d,S.a(km,gm(b)))}c=R(b,0);d=R(b,1);b=
ze(b);return im(c,d,S.a(jm,gm(b)))};
function lm(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return pf.g?pf.g(a):pf.call(null,a)}(),c=function(){var a;a=O.g?O.g(b):O.call(null,b);a=fm.g?fm.g(a):fm.call(null,a);return pf.g?pf.g(a):pf.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.o?a.o():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(O.g?O.g(c):O.call(null,c));return function(a,b,c){return function(d){var l=
km(d);d=function(){var b=O.g?O.g(a):O.call(null,a);return dm.a?dm.a(b,l):dm.call(null,b,l)}();sf.a?sf.a(a,l):sf.call(null,a,l);d=function(a,b,c,d){return function(){return vf.h(d,em,b)}}(l,d,a,b,c);return c.g?c.g(d):c.call(null,d)}}(b,c,d)};function mm(a){var b=t(nm)?nm:om,c=pm,d=Yl(null);am(d,b);var e=Yl(1);Dl(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,ij)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ul(c),d=ij;else throw f;}if(!U(d,ij))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.o=c;d.g=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Ql(d,2,c);if(2===f){var h=b,f=d[2];d[7]=f;d[8]=h;d[2]=null;d[1]=3;return ij}return 3===f?(f=d[7],h=d[9],h=d[8],f=a.a?a.a(h,f):a.call(null,h,f),h=am(e,f),d[9]=f,d[10]=h,Ql(d,5,c)):4===f?(f=d[2],Sl(d,f)):5===f?(h=d[9],f=d[2],d[7]=f,d[8]=h,d[2]=null,d[1]=3,ij):null}}(d,e),d,e)}(),l=function(){var a=k.o?k.o():k.call(null);a[6]=d;return a}();return Pl(l)}}(e,d));return d}
function qm(){var a=rm,b=lm(),c=Yl(1);Dl(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,ij)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ul(c),d=ij;else throw f;}if(!U(d,ij))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.o=c;d.g=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,ij):2===d?Ql(c,4,a):3===d?(d=c[2],Sl(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=t(d)?5:6,ij):5===d?(d=c[7],d=b.g?b.g(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,ij):6===d?(c[2]=null,c[1]=7,ij):7===d?(d=c[2],c[2]=d,c[1]=3,ij):null}}(c),c)}(),f=function(){var a=e.o?e.o():e.call(null);a[6]=c;return a}();return Pl(f)}}(c));return c};var sm=vl("Opera")||vl("OPR"),tm=vl("Trident")||vl("MSIE"),um=vl("Edge"),vm=vl("Gecko")&&!(-1!=sl.toLowerCase().indexOf("webkit")&&!vl("Edge"))&&!(vl("Trident")||vl("MSIE"))&&!vl("Edge"),wm=-1!=sl.toLowerCase().indexOf("webkit")&&!vl("Edge");function xm(){var a=sl;if(vm)return/rv\:([^\);]+)(\)|;)/.exec(a);if(um)return/Edge\/([\d\.]+)/.exec(a);if(tm)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(wm)return/WebKit\/(\S+)/.exec(a)}function ym(){var a=ba.document;return a?a.documentMode:void 0}
var zm=function(){if(sm&&ba.opera){var a=ba.opera.version;return ka(a)?a():a}var a="",b=xm();b&&(a=b?b[1]:"");return tm&&(b=ym(),b>parseFloat(a))?String(b):a}(),Am={};
function Bm(a){var b;if(!(b=Am[a])){b=0;for(var c=va(String(zm)).split("."),d=va(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var h=c[f]||"",k=d[f]||"",l=RegExp("(\\d*)(\\D*)","g"),m=RegExp("(\\d*)(\\D*)","g");do{var n=l.exec(h)||["","",""],r=m.exec(k)||["","",""];if(0==n[0].length&&0==r[0].length)break;b=wa(0==n[1].length?0:parseInt(n[1],10),0==r[1].length?0:parseInt(r[1],10))||wa(0==n[2].length,0==r[2].length)||wa(n[2],r[2])}while(0==b)}b=Am[a]=0<=b}return b}
var Cm=ba.document,Dm=Cm&&tm?ym()||("CSS1Compat"==Cm.compatMode?parseInt(zm,10):5):void 0;var Em;(Em=!tm)||(Em=9<=Dm);var Fm=Em,Gm=tm&&!Bm("9");!wm||Bm("528");vm&&Bm("1.9b")||tm&&Bm("8")||sm&&Bm("9.5")||wm&&Bm("528");vm&&!Bm("8")||tm&&Bm("9");function Hm(){0!=Im&&(this[la]||(this[la]=++ma));this.Qd=this.Qd;this.nf=this.nf}var Im=0;Hm.prototype.Qd=!1;function Jm(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.ic=!1;this.Ce=!0}Jm.prototype.stopPropagation=function(){this.ic=!0};Jm.prototype.preventDefault=function(){this.defaultPrevented=!0;this.Ce=!1};function Km(a){Km[" "](a);return a}Km[" "]=ca;function Lm(a,b){Jm.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.Mc=this.state=null;a&&this.wc(a,b)}sa(Lm,Jm);
Lm.prototype.wc=function(a,b){var c=this.type=a.type;this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(vm){var e;a:{try{Km(d.nodeName);e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=wm||void 0!==a.offsetX?a.offsetX:a.layerX;this.offsetY=wm||void 0!==a.offsetY?a.offsetY:a.layerY;this.clientX=void 0!==a.clientX?a.clientX:a.pageX;this.clientY=void 0!==a.clientY?a.clientY:
a.pageY;this.screenX=a.screenX||0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.Mc=a;a.defaultPrevented&&this.preventDefault()};Lm.prototype.stopPropagation=function(){Lm.Fe.stopPropagation.call(this);this.Mc.stopPropagation?this.Mc.stopPropagation():this.Mc.cancelBubble=!0};
Lm.prototype.preventDefault=function(){Lm.Fe.preventDefault.call(this);var a=this.Mc;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,Gm)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var Mm="closure_listenable_"+(1E6*Math.random()|0),Nm=0;function Om(a,b,c,d,e){this.listener=a;this.qd=null;this.src=b;this.type=c;this.Fc=!!d;this.Ra=e;this.key=++Nm;this.zc=this.bd=!1}function Pm(a){a.zc=!0;a.listener=null;a.qd=null;a.src=null;a.Ra=null};function Qm(a){this.src=a;this.Xa={};this.ud=0}Qm.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.Xa[f];a||(a=this.Xa[f]=[],this.ud++);var h=Rm(a,b,d,e);-1<h?(b=a[h],c||(b.bd=!1)):(b=new Om(b,this.src,f,!!d,e),b.bd=c,a.push(b));return b};Qm.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.Xa))return!1;var e=this.Xa[a];b=Rm(e,b,c,d);return-1<b?(Pm(e[b]),La.splice.call(e,b,1),0==e.length&&(delete this.Xa[a],this.ud--),!0):!1};
function Sm(a,b){var c=b.type;if(c in a.Xa){var d=a.Xa[c],e=Ma(d,b),f;(f=0<=e)&&La.splice.call(d,e,1);f&&(Pm(b),0==a.Xa[c].length&&(delete a.Xa[c],a.ud--))}}Qm.prototype.Td=function(a,b,c,d){a=this.Xa[a.toString()];var e=-1;a&&(e=Rm(a,b,c,d));return-1<e?a[e]:null};Qm.prototype.hasListener=function(a,b){var c=void 0!==a,d=c?a.toString():"",e=void 0!==b;return ya(this.Xa,function(a){for(var h=0;h<a.length;++h)if(!(c&&a[h].type!=d||e&&a[h].Fc!=b))return!0;return!1})};
function Rm(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.zc&&f.listener==b&&f.Fc==!!c&&f.Ra==d)return e}return-1};var Tm="closure_lm_"+(1E6*Math.random()|0),Um={},Vm=0;
function Wm(a,b,c,d,e){if(da(b))for(var f=0;f<b.length;f++)Wm(a,b[f],c,d,e);else if(c=Xm(c),a&&a[Mm])a.dc.add(String(b),c,!1,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,h=Ym(a);h||(a[Tm]=h=new Qm(a));c=h.add(b,c,!1,d,e);if(!c.qd){d=Zm();c.qd=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,f);else if(a.attachEvent)a.attachEvent($m(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");Vm++}}}
function Zm(){var a=an,b=Fm?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function bn(a,b,c,d,e){if(da(b))for(var f=0;f<b.length;f++)bn(a,b[f],c,d,e);else c=Xm(c),a&&a[Mm]?a.dc.remove(String(b),c,d,e):a&&(a=Ym(a))&&(b=a.Td(b,c,!!d,e))&&cn(b)}
function cn(a){if("number"!=typeof a&&a&&!a.zc){var b=a.src;if(b&&b[Mm])Sm(b.dc,a);else{var c=a.type,d=a.qd;b.removeEventListener?b.removeEventListener(c,d,a.Fc):b.detachEvent&&b.detachEvent($m(c),d);Vm--;(c=Ym(b))?(Sm(c,a),0==c.ud&&(c.src=null,b[Tm]=null)):Pm(a)}}}function $m(a){return a in Um?Um[a]:Um[a]="on"+a}function dn(a,b,c,d){var e=!0;if(a=Ym(a))if(b=a.Xa[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.Fc==c&&!f.zc&&(f=en(f,d),e=e&&!1!==f)}return e}
function en(a,b){var c=a.listener,d=a.Ra||a.src;a.bd&&cn(a);return c.call(d,b)}
function an(a,b){if(a.zc)return!0;if(!Fm){var c;if(!(c=b))a:{c=["window","event"];for(var d=ba,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new Lm(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(h){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,k=e.length-1;!c.ic&&0<=k;k--){c.currentTarget=e[k];var l=dn(e[k],f,!0,c),d=d&&l}for(k=0;!c.ic&&
k<e.length;k++)c.currentTarget=e[k],l=dn(e[k],f,!1,c),d=d&&l}return d}return en(a,new Lm(b,this))}function Ym(a){a=a[Tm];return a instanceof Qm?a:null}var fn="__closure_events_fn_"+(1E9*Math.random()>>>0);function Xm(a){if(ka(a))return a;a[fn]||(a[fn]=function(b){return a.handleEvent(b)});return a[fn]};function gn(){Hm.call(this);this.dc=new Qm(this);this.Je=this;this.Ae=null}sa(gn,Hm);gn.prototype[Mm]=!0;g=gn.prototype;g.addEventListener=function(a,b,c,d){Wm(this,a,b,c,d)};g.removeEventListener=function(a,b,c,d){bn(this,a,b,c,d)};
g.dispatchEvent=function(a){var b,c=this.Ae;if(c)for(b=[];c;c=c.Ae)b.push(c);var c=this.Je,d=a.type||a;if(ha(a))a=new Jm(a,c);else if(a instanceof Jm)a.target=a.target||c;else{var e=a;a=new Jm(d,c);Ea(a,e)}var e=!0,f;if(b)for(var h=b.length-1;!a.ic&&0<=h;h--)f=a.currentTarget=b[h],e=hn(f,d,!0,a)&&e;a.ic||(f=a.currentTarget=c,e=hn(f,d,!0,a)&&e,a.ic||(e=hn(f,d,!1,a)&&e));if(b)for(h=0;!a.ic&&h<b.length;h++)f=a.currentTarget=b[h],e=hn(f,d,!1,a)&&e;return e};
function hn(a,b,c,d){b=a.dc.Xa[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var h=b[f];if(h&&!h.zc&&h.Fc==c){var k=h.listener,l=h.Ra||h.src;h.bd&&Sm(a.dc,h);e=!1!==k.call(l,d)&&e}}return e&&0!=d.Ce}g.Td=function(a,b,c,d){return this.dc.Td(String(a),b,c,d)};g.hasListener=function(a,b){return this.dc.hasListener(void 0!==a?String(a):void 0,b)};function jn(a,b,c){if(ka(a))c&&(a=qa(a,c));else if(a&&"function"==typeof a.handleEvent)a=qa(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:ba.setTimeout(a,b||0)};function kn(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function ln(){this.rd=void 0}
function mn(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(da(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],mn(a,a.rd?a.rd.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),nn(d,c),c.push(":"),mn(a,a.rd?a.rd.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":nn(b,
c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}var on={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},pn=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function nn(a,b){b.push('"',a.replace(pn,function(a){var b=on[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),on[a]=b);return b}),'"')};Fa("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));function qn(a){if("function"==typeof a.ld)return a.ld();if(ha(a))return a.split("");if(fa(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Aa(a)}
function rn(a,b){if("function"==typeof a.forEach)a.forEach(b,void 0);else if(fa(a)||ha(a))Na(a,b,void 0);else{var c;if("function"==typeof a.Jb)c=a.Jb();else if("function"!=typeof a.ld)if(fa(a)||ha(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=Ba(a);else c=void 0;for(var d=qn(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)}};function sn(a,b){this.Kb={};this.Ja=[];this.Rb=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)}g=sn.prototype;g.ld=function(){tn(this);for(var a=[],b=0;b<this.Ja.length;b++)a.push(this.Kb[this.Ja[b]]);return a};g.Jb=function(){tn(this);return this.Ja.concat()};
g.Qa=function(a,b){if(this===a)return!0;if(this.Rb!=a.Rb)return!1;var c=b||un;tn(this);for(var d,e=0;d=this.Ja[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};function un(a,b){return a===b}g.clear=function(){this.Kb={};this.Rb=this.Ja.length=0};g.remove=function(a){return Object.prototype.hasOwnProperty.call(this.Kb,a)?(delete this.Kb[a],this.Rb--,this.Ja.length>2*this.Rb&&tn(this),!0):!1};
function tn(a){if(a.Rb!=a.Ja.length){for(var b=0,c=0;b<a.Ja.length;){var d=a.Ja[b];Object.prototype.hasOwnProperty.call(a.Kb,d)&&(a.Ja[c++]=d);b++}a.Ja.length=c}if(a.Rb!=a.Ja.length){for(var e={},c=b=0;b<a.Ja.length;)d=a.Ja[b],Object.prototype.hasOwnProperty.call(e,d)||(a.Ja[c++]=d,e[d]=1),b++;a.Ja.length=c}}g.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.Kb,a)?this.Kb[a]:b};
g.set=function(a,b){Object.prototype.hasOwnProperty.call(this.Kb,a)||(this.Rb++,this.Ja.push(a));this.Kb[a]=b};g.addAll=function(a){var b;a instanceof sn?(b=a.Jb(),a=a.ld()):(b=Ba(a),a=Aa(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};g.forEach=function(a,b){for(var c=this.Jb(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};g.clone=function(){return new sn(this)};function vn(a,b,c,d,e){this.reset(a,b,c,d,e)}vn.prototype.se=null;var wn=0;vn.prototype.reset=function(a,b,c,d,e){"number"==typeof e||wn++;d||ra();this.Tc=a;this.lf=b;delete this.se};vn.prototype.Ee=function(a){this.Tc=a};function xn(a){this.xe=a;this.ue=this.Gd=this.Tc=this.od=null}function yn(a,b){this.name=a;this.value=b}yn.prototype.toString=function(){return this.name};var zn=new yn("SEVERE",1E3),An=new yn("INFO",800),Bn=new yn("CONFIG",700),Cn=new yn("FINE",500);g=xn.prototype;g.getName=function(){return this.xe};g.getParent=function(){return this.od};g.Ee=function(a){this.Tc=a};function Dn(a){if(a.Tc)return a.Tc;if(a.od)return Dn(a.od);Ka("Root logger has no level set.");return null}
g.log=function(a,b,c){if(a.value>=Dn(this).value)for(ka(b)&&(b=b()),a=new vn(a,String(b),this.xe),c&&(a.se=c),c="log:"+a.lf,ba.console&&(ba.console.timeStamp?ba.console.timeStamp(c):ba.console.markTimeline&&ba.console.markTimeline(c)),ba.msWriteProfilerMark&&ba.msWriteProfilerMark(c),c=this;c;){b=c;var d=a;if(b.ue)for(var e=0,f=void 0;f=b.ue[e];e++)f(d);c=c.getParent()}};g.info=function(a,b){this.log(An,a,b)};var En={},Fn=null;
function Gn(a){Fn||(Fn=new xn(""),En[""]=Fn,Fn.Ee(Bn));var b;if(!(b=En[a])){b=new xn(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=Gn(a.substr(0,c));c.Gd||(c.Gd={});c.Gd[d]=b;b.od=c;En[a]=b}return b};function Hn(a,b){a&&a.log(Cn,b,void 0)};function In(){}In.prototype.ee=null;function Jn(a){var b;(b=a.ee)||(b={},Kn(a)&&(b[0]=!0,b[1]=!0),b=a.ee=b);return b};var Ln;function Mn(){}sa(Mn,In);function Nn(a){return(a=Kn(a))?new ActiveXObject(a):new XMLHttpRequest}function Kn(a){if(!a.ve&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.ve=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.ve}Ln=new Mn;var On=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function Pn(a){if(Qn){Qn=!1;var b=ba.location;if(b){var c=b.href;if(c&&(c=(c=Pn(c)[3]||null)?decodeURI(c):c)&&c!=b.hostname)throw Qn=!0,Error();}}return a.match(On)}var Qn=wm;function Rn(a){gn.call(this);this.headers=new sn;this.yd=a||null;this.mc=!1;this.xd=this.ea=null;this.we=this.nd="";this.yc=0;this.Sc="";this.Pc=this.Ud=this.md=this.Rd=!1;this.Bc=0;this.td=null;this.Be=Sn;this.wd=this.Ie=!1}sa(Rn,gn);var Sn="",Tn=Rn.prototype,Un=Gn("goog.net.XhrIo");Tn.ab=Un;var Vn=/^https?$/i,Wn=["POST","PUT"];g=Rn.prototype;
g.send=function(a,b,c,d){if(this.ea)throw Error("[goog.net.XhrIo] Object is active with another request\x3d"+this.nd+"; newUri\x3d"+a);b=b?b.toUpperCase():"GET";this.nd=a;this.Sc="";this.yc=0;this.we=b;this.Rd=!1;this.mc=!0;this.ea=this.yd?Nn(this.yd):Nn(Ln);this.xd=this.yd?Jn(this.yd):Jn(Ln);this.ea.onreadystatechange=qa(this.ze,this);try{Hn(this.ab,Xn(this,"Opening Xhr")),this.Ud=!0,this.ea.open(b,String(a),!0),this.Ud=!1}catch(e){Hn(this.ab,Xn(this,"Error opening Xhr: "+e.message));Yn(this,e);
return}a=c||"";var f=this.headers.clone();d&&rn(d,function(a,b){f.set(b,a)});d=Pa(f.Jb());c=ba.FormData&&a instanceof ba.FormData;!(0<=Ma(Wn,b))||d||c||f.set("Content-Type","application/x-www-form-urlencoded;charset\x3dutf-8");f.forEach(function(a,b){this.ea.setRequestHeader(b,a)},this);this.Be&&(this.ea.responseType=this.Be);"withCredentials"in this.ea&&(this.ea.withCredentials=this.Ie);try{Zn(this),0<this.Bc&&(this.wd=$n(this.ea),Hn(this.ab,Xn(this,"Will abort after "+this.Bc+"ms if incomplete, xhr2 "+
this.wd)),this.wd?(this.ea.timeout=this.Bc,this.ea.ontimeout=qa(this.Ge,this)):this.td=jn(this.Ge,this.Bc,this)),Hn(this.ab,Xn(this,"Sending request")),this.md=!0,this.ea.send(a),this.md=!1}catch(h){Hn(this.ab,Xn(this,"Send error: "+h.message)),Yn(this,h)}};function $n(a){return tm&&Bm(9)&&"number"==typeof a.timeout&&void 0!==a.ontimeout}function Qa(a){return"content-type"==a.toLowerCase()}
g.Ge=function(){"undefined"!=typeof aa&&this.ea&&(this.Sc="Timed out after "+this.Bc+"ms, aborting",this.yc=8,Hn(this.ab,Xn(this,this.Sc)),this.dispatchEvent("timeout"),this.abort(8))};function Yn(a,b){a.mc=!1;a.ea&&(a.Pc=!0,a.ea.abort(),a.Pc=!1);a.Sc=b;a.yc=5;ao(a);bo(a)}function ao(a){a.Rd||(a.Rd=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))}
g.abort=function(a){this.ea&&this.mc&&(Hn(this.ab,Xn(this,"Aborting")),this.mc=!1,this.Pc=!0,this.ea.abort(),this.Pc=!1,this.yc=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),bo(this))};g.ze=function(){this.Qd||(this.Ud||this.md||this.Pc?co(this):this.of())};g.of=function(){co(this)};
function co(a){if(a.mc&&"undefined"!=typeof aa)if(a.xd[1]&&4==eo(a)&&2==fo(a))Hn(a.ab,Xn(a,"Local request error detected and ignored"));else if(a.md&&4==eo(a))jn(a.ze,0,a);else if(a.dispatchEvent("readystatechange"),4==eo(a)){Hn(a.ab,Xn(a,"Request complete"));a.mc=!1;try{var b=fo(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=Pn(String(a.nd))[1]||null;if(!f&&ba.self&&ba.self.location)var h=ba.self.location.protocol,
f=h.substr(0,h.length-1);e=!Vn.test(f?f.toLowerCase():"")}d=e}d?(a.dispatchEvent("complete"),a.dispatchEvent("success")):(a.yc=6,a.Sc=go(a)+" ["+fo(a)+"]",ao(a))}finally{bo(a)}}}function bo(a){if(a.ea){Zn(a);var b=a.ea,c=a.xd[0]?ca:null;a.ea=null;a.xd=null;a.dispatchEvent("ready");try{b.onreadystatechange=c}catch(d){(a=a.ab)&&a.log(zn,"Problem encountered resetting onreadystatechange: "+d.message,void 0)}}}
function Zn(a){a.ea&&a.wd&&(a.ea.ontimeout=null);"number"==typeof a.td&&(ba.clearTimeout(a.td),a.td=null)}function eo(a){return a.ea?a.ea.readyState:0}function fo(a){try{return 2<eo(a)?a.ea.status:-1}catch(b){return-1}}function go(a){try{return 2<eo(a)?a.ea.statusText:""}catch(b){return Hn(a.ab,"Can not get status: "+b.message),""}}g.getResponseHeader=function(a){return this.ea&&4==eo(this)?this.ea.getResponseHeader(a):void 0};
g.getAllResponseHeaders=function(){return this.ea&&4==eo(this)?this.ea.getAllResponseHeaders():""};function Xn(a,b){return b+" ["+a.we+" "+a.nd+" "+fo(a)+"]"};var ho=function ho(b,c,d){if(null!=b&&null!=b.Ad)return b.Ad(b,c,d);var e=ho[p(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=ho._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw x("AjaxImpl.-js-ajax-request",b);},io=function io(b){if(null!=b&&null!=b.Dd)return b.Dd(b);var c=io[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=io._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("AjaxResponse.-status",b);},jo=function jo(b){if(null!=b&&null!=b.Ed)return b.Ed(b);
var c=jo[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=jo._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("AjaxResponse.-status-text",b);},ko=function ko(b){if(null!=b&&null!=b.Bd)return b.Bd(b);var c=ko[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=ko._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("AjaxResponse.-body",b);},lo=function lo(b,c){if(null!=b&&null!=b.Cd)return b.Cd(b,c);var d=lo[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,
b,c);d=lo._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("AjaxResponse.-get-response-header",b);},mo=function mo(b){if(null!=b&&null!=b.Fd)return b.Fd(b);var c=mo[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=mo._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("AjaxResponse.-was-aborted",b);},no=function no(b,c){if(null!=b&&null!=b.Dc)return b.Dc(b,c);var d=no[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=no._;if(null!=d)return d.a?d.a(b,c):
d.call(null,b,c);throw x("Interceptor.-process-request",b);},oo=function oo(b,c){if(null!=b&&null!=b.Ec)return b.Ec(b,c);var d=oo[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=oo._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("Interceptor.-process-response",b);};g=XMLHttpRequest.prototype;
g.Ad=function(a,b,c){var d=null!=b&&(b.v&64||b.na)?A.a(nd,b):b,e=G.a(d,wk),f=G.a(d,Ki);a=G.a(d,Gk);var h=G.a(d,yj),k=G.h(d,Ck,0),l=G.h(d,Rk,!1),m=G.a(d,Wi);this.withCredentials=l;this.onreadystatechange=function(a){return function(b){return Rc.a(Tj,(new q(null,5,[0,Fi,1,Hk,2,kj,3,fj,4,Tj],null)).call(null,b.target.readyState))?c.g?c.g(a):c.call(null,a):null}}(this,b,d,e,f,a,h,k,l,m);this.open(f,e,!0);this.timeout=k;b=jj.g(m);t(b)&&(this.responseType=Ae(b));b=K(h);h=null;for(e=d=0;;)if(e<d)k=h.ca(null,
e),f=R(k,0),k=R(k,1),this.setRequestHeader(f,k),e+=1;else if(b=K(b))Yd(b)?(d=Bc(b),b=Cc(b),h=d,d=Q(d)):(d=L(b),h=R(d,0),d=R(d,1),this.setRequestHeader(h,d),b=N(b),h=null,d=0),e=0;else break;this.send(t(a)?a:"");return this};g.Bd=function(){return this.response};g.Dd=function(){return this.status};g.Ed=function(){return this.statusText};g.Cd=function(a,b){return this.getResponseHeader(b)};g.Fd=function(){return Rc.a(0,this.readyState)};var po="undefined"!=typeof Object.keys?function(a){return Object.keys(a)}:function(a){return Ba(a)},qo="undefined"!=typeof Array.isArray?function(a){return Array.isArray(a)}:function(a){return"array"===p(a)};function ro(){return Math.round(15*Math.random()).toString(16)};var so=1;function to(a,b){if(null==a)return null==b;if(a===b)return!0;if("object"===typeof a){if(qo(a)){if(qo(b)&&a.length===b.length){for(var c=0;c<a.length;c++)if(!to(a[c],b[c]))return!1;return!0}return!1}if(a.$a)return a.$a(b);if(null!=b&&"object"===typeof b){if(b.$a)return b.$a(a);var c=0,d=po(b).length,e;for(e in a)if(a.hasOwnProperty(e)&&(c++,!b.hasOwnProperty(e)||!to(a[e],b[e])))return!1;return c===d}}return!1}function uo(a,b){return a^b+2654435769+(a<<6)+(a>>2)}var vo={},wo=0;
function xo(a){var b=0;if(null!=a.forEach)a.forEach(function(a,c){b=(b+(yo(c)^yo(a)))%4503599627370496});else for(var c=po(a),d=0;d<c.length;d++)var e=c[d],f=a[e],b=(b+(yo(e)^yo(f)))%4503599627370496;return b}function zo(a){var b=0;if(qo(a))for(var c=0;c<a.length;c++)b=uo(b,yo(a[c]));else a.forEach&&a.forEach(function(a){b=uo(b,yo(a))});return b}
function yo(a){if(null==a)return 0;switch(typeof a){case "number":return a;case "boolean":return!0===a?1:0;case "string":var b=vo[a];if(null==b){for(var c=b=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=4294967296;wo++;256<=wo&&(vo={},wo=1);vo[a]=b}a=b;return a;case "function":return b=a.transit$hashCode$,b||(b=so,"undefined"!=typeof Object.defineProperty?Object.defineProperty(a,"transit$hashCode$",{value:b,enumerable:!1}):a.transit$hashCode$=b,so++),b;default:return a instanceof Date?a.valueOf():qo(a)?
zo(a):a.tb?a.tb():xo(a)}};function Ao(a,b){this.ra=a|0;this.ia=b|0}var Bo,Co,Do,Eo,Fo,Go,Ho={};function Io(a){if(-128<=a&&128>a){var b=Ho[a];if(b)return b}b=new Ao(a|0,0>a?-1:0);-128<=a&&128>a&&(Ho[a]=b);return b}function Jo(a){isNaN(a)||!isFinite(a)?a=Ko():a<=-Lo?a=Mo():a+1>=Lo?(Eo||(Eo=No(-1,2147483647)),a=Eo):a=0>a?Oo(Jo(-a)):new Ao(a%Po|0,a/Po|0);return a}function No(a,b){return new Ao(a,b)}
function Qo(a,b){if(0==a.length)throw Error("number format error: empty string");var c=b||10;if(2>c||36<c)throw Error("radix out of range: "+c);if("-"==a.charAt(0))return Oo(Qo(a.substring(1),c));if(0<=a.indexOf("-"))throw Error('number format error: interior "-" character: '+a);for(var d=Jo(Math.pow(c,8)),e=Ko(),f=0;f<a.length;f+=8){var h=Math.min(8,a.length-f),k=parseInt(a.substring(f,f+h),c);8>h?(h=Jo(Math.pow(c,h)),e=e.multiply(h).add(Jo(k))):(e=e.multiply(d),e=e.add(Jo(k)))}return e}
var Po=4294967296,Lo=Po*Po/2;function Ko(){Bo||(Bo=Io(0));return Bo}function Ro(){Co||(Co=Io(1));return Co}function So(){Do||(Do=Io(-1));return Do}function Mo(){Fo||(Fo=No(0,-2147483648));return Fo}function To(){Go||(Go=Io(16777216));return Go}function Uo(a){return a.ia*Po+(0<=a.ra?a.ra:Po+a.ra)}g=Ao.prototype;
g.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(Vo(this))return"0";if(0>this.ia){if(this.Qa(Mo())){var b=Jo(a),c=Wo(this,b),b=Xo(c.multiply(b),this);return c.toString(a)+b.ra.toString(a)}return"-"+Oo(this).toString(a)}for(var c=Jo(Math.pow(a,6)),b=this,d="";;){var e=Wo(b,c),f=Xo(b,e.multiply(c)).ra.toString(a),b=e;if(Vo(b))return f+d;for(;6>f.length;)f="0"+f;d=""+f+d}};function Vo(a){return 0==a.ia&&0==a.ra}g.Qa=function(a){return this.ia==a.ia&&this.ra==a.ra};
g.compare=function(a){if(this.Qa(a))return 0;var b=0>this.ia,c=0>a.ia;return b&&!c?-1:!b&&c?1:0>Xo(this,a).ia?-1:1};function Oo(a){return a.Qa(Mo())?Mo():No(~a.ra,~a.ia).add(Ro())}g.add=function(a){var b=this.ia>>>16,c=this.ia&65535,d=this.ra>>>16,e=a.ia>>>16,f=a.ia&65535,h=a.ra>>>16,k;k=0+((this.ra&65535)+(a.ra&65535));a=0+(k>>>16);a+=d+h;d=0+(a>>>16);d+=c+f;c=0+(d>>>16);c=c+(b+e)&65535;return No((a&65535)<<16|k&65535,c<<16|d&65535)};function Xo(a,b){return a.add(Oo(b))}
g.multiply=function(a){if(Vo(this)||Vo(a))return Ko();if(this.Qa(Mo()))return 1==(a.ra&1)?Mo():Ko();if(a.Qa(Mo()))return 1==(this.ra&1)?Mo():Ko();if(0>this.ia)return 0>a.ia?Oo(this).multiply(Oo(a)):Oo(Oo(this).multiply(a));if(0>a.ia)return Oo(this.multiply(Oo(a)));var b=To();if(b=0>this.compare(b))b=To(),b=0>a.compare(b);if(b)return Jo(Uo(this)*Uo(a));var b=this.ia>>>16,c=this.ia&65535,d=this.ra>>>16,e=this.ra&65535,f=a.ia>>>16,h=a.ia&65535,k=a.ra>>>16;a=a.ra&65535;var l,m,n,r;r=0+e*a;n=0+(r>>>16);
n+=d*a;m=0+(n>>>16);n=(n&65535)+e*k;m+=n>>>16;n&=65535;m+=c*a;l=0+(m>>>16);m=(m&65535)+d*k;l+=m>>>16;m&=65535;m+=e*h;l+=m>>>16;m&=65535;l=l+(b*a+c*k+d*h+e*f)&65535;return No(n<<16|r&65535,l<<16|m)};
function Wo(a,b){if(Vo(b))throw Error("division by zero");if(Vo(a))return Ko();if(a.Qa(Mo())){if(b.Qa(Ro())||b.Qa(So()))return Mo();if(b.Qa(Mo()))return Ro();var c;c=1;if(0==c)c=a;else{var d=a.ia;c=32>c?No(a.ra>>>c|d<<32-c,d>>c):No(d>>c-32,0<=d?0:-1)}c=Wo(c,b).shiftLeft(1);if(c.Qa(Ko()))return 0>b.ia?Ro():So();d=Xo(a,b.multiply(c));return c.add(Wo(d,b))}if(b.Qa(Mo()))return Ko();if(0>a.ia)return 0>b.ia?Wo(Oo(a),Oo(b)):Oo(Wo(Oo(a),b));if(0>b.ia)return Oo(Wo(a,Oo(b)));for(var e=Ko(),d=a;0<=d.compare(b);){c=
Math.max(1,Math.floor(Uo(d)/Uo(b)));for(var f=Math.ceil(Math.log(c)/Math.LN2),f=48>=f?1:Math.pow(2,f-48),h=Jo(c),k=h.multiply(b);0>k.ia||0<k.compare(d);)c-=f,h=Jo(c),k=h.multiply(b);Vo(h)&&(h=Ro());e=e.add(h);d=Xo(d,k)}return e}g.shiftLeft=function(a){a&=63;if(0==a)return this;var b=this.ra;return 32>a?No(b<<a,this.ia<<a|b>>>32-a):No(0,b<<a-32)};function Yo(a,b){b&=63;if(0==b)return a;var c=a.ia;return 32>b?No(a.ra>>>b|c<<32-b,c>>>b):32==b?No(c,0):No(c>>>b-32,0)};var Zo="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";function $o(a,b){this.tag=a;this.Z=b;this.la=-1}$o.prototype.toString=function(){return"[TaggedValue: "+this.tag+", "+this.Z+"]"};$o.prototype.equiv=function(a){return to(this,a)};$o.prototype.equiv=$o.prototype.equiv;$o.prototype.$a=function(a){return a instanceof $o?this.tag===a.tag&&to(this.Z,a.Z):!1};$o.prototype.tb=function(){-1===this.la&&(this.la=uo(yo(this.tag),yo(this.Z)));return this.la};function ap(a,b){return new $o(a,b)}
var bp=Qo("9007199254740991"),cp=Qo("-9007199254740991");Ao.prototype.equiv=function(a){return to(this,a)};Ao.prototype.equiv=Ao.prototype.equiv;Ao.prototype.$a=function(a){return a instanceof Ao&&this.Qa(a)};Ao.prototype.tb=function(){return this.ra};function dp(a){this.ta=a;this.la=-1}dp.prototype.toString=function(){return":"+this.ta};dp.prototype.namespace=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(0,a):null};
dp.prototype.name=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(a+1,this.ta.length):this.ta};dp.prototype.equiv=function(a){return to(this,a)};dp.prototype.equiv=dp.prototype.equiv;dp.prototype.$a=function(a){return a instanceof dp&&this.ta==a.ta};dp.prototype.tb=function(){-1===this.la&&(this.la=yo(this.ta));return this.la};function ep(a){this.ta=a;this.la=-1}ep.prototype.namespace=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(0,a):null};
ep.prototype.name=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(a+1,this.ta.length):this.ta};ep.prototype.toString=function(){return this.ta};ep.prototype.equiv=function(a){return to(this,a)};ep.prototype.equiv=ep.prototype.equiv;ep.prototype.$a=function(a){return a instanceof ep&&this.ta==a.ta};ep.prototype.tb=function(){-1===this.la&&(this.la=yo(this.ta));return this.la};
function fp(a,b,c){var d="";c=c||b+1;for(var e=8*(7-b),f=Io(255).shiftLeft(e);b<c;b++,e-=8,f=Yo(f,8)){var h=Yo(No(a.ra&f.ra,a.ia&f.ia),e).toString(16);1==h.length&&(h="0"+h);d+=h}return d}function gp(a,b){this.Wa=a;this.Ya=b;this.la=-1}gp.prototype.toString=function(){var a,b=this.Wa,c=this.Ya;a=""+(fp(b,0,4)+"-");a+=fp(b,4,6)+"-";a+=fp(b,6,8)+"-";a+=fp(c,0,2)+"-";return a+=fp(c,2,8)};gp.prototype.equiv=function(a){return to(this,a)};gp.prototype.equiv=gp.prototype.equiv;
gp.prototype.$a=function(a){return a instanceof gp&&this.Wa.Qa(a.Wa)&&this.Ya.Qa(a.Ya)};gp.prototype.tb=function(){-1===this.la&&(this.la=yo(this.toString()));return this.la};Date.prototype.$a=function(a){return a instanceof Date?this.valueOf()===a.valueOf():!1};Date.prototype.tb=function(){return this.valueOf()};function hp(a,b){this.entries=a;this.type=b||0;this.fa=0}
hp.prototype.next=function(){if(this.fa<this.entries.length){var a=null,a=0===this.type?this.entries[this.fa]:1===this.type?this.entries[this.fa+1]:[this.entries[this.fa],this.entries[this.fa+1]],a={value:a,done:!1};this.fa+=2;return a}return{value:null,done:!0}};hp.prototype.next=hp.prototype.next;hp.prototype[Zo]=function(){return this};function ip(a,b){this.map=a;this.type=b||0;this.keys=this.map.Jb();this.fa=0;this.Yb=null;this.Nb=0}
ip.prototype.next=function(){if(this.fa<this.map.size){null!=this.Yb&&this.Nb<this.Yb.length||(this.Yb=this.map.map[this.keys[this.fa]],this.Nb=0);var a=null,a=0===this.type?this.Yb[this.Nb]:1===this.type?this.Yb[this.Nb+1]:[this.Yb[this.Nb],this.Yb[this.Nb+1]],a={value:a,done:!1};this.fa++;this.Nb+=2;return a}return{value:null,done:!0}};ip.prototype.next=ip.prototype.next;ip.prototype[Zo]=function(){return this};
function jp(a,b){if(a instanceof kp&&(b instanceof lp||b instanceof kp)){if(a.size!==b.size)return!1;for(var c in a.map)for(var d=a.map[c],e=0;e<d.length;e+=2)if(!to(d[e+1],b.get(d[e])))return!1;return!0}if(a instanceof lp&&(b instanceof lp||b instanceof kp)){if(a.size!==b.size)return!1;c=a.ja;for(e=0;e<c.length;e+=2)if(!to(c[e+1],b.get(c[e])))return!1;return!0}if(null!=b&&"object"===typeof b&&(e=po(b),c=e.length,a.size===c)){for(d=0;d<c;d++){var f=e[d];if(!a.has(f)||!to(b[f],a.get(f)))return!1}return!0}return!1}
function mp(a){return null==a?"null":da(a)?"["+a.toString()+"]":ha(a)?'"'+a+'"':a.toString()}function np(a){var b=0,c="TransitMap {";a.forEach(function(d,e){c+=mp(e)+" \x3d\x3e "+mp(d);b<a.size-1&&(c+=", ");b++});return c+"}"}function op(a){var b=0,c="TransitSet {";a.forEach(function(d){c+=mp(d);b<a.size-1&&(c+=", ");b++});return c+"}"}function lp(a){this.ja=a;this.ga=null;this.la=-1;this.size=a.length/2;this.Yd=0}lp.prototype.toString=function(){return np(this)};lp.prototype.inspect=function(){return this.toString()};
function pp(a){if(a.ga)throw Error("Invalid operation, already converted");if(8>a.size)return!1;a.Yd++;return 32<a.Yd?(a.ga=qp(a.ja,!1,!0),a.ja=[],!0):!1}lp.prototype.clear=function(){this.la=-1;this.ga?this.ga.clear():this.ja=[];this.size=0};lp.prototype.clear=lp.prototype.clear;lp.prototype.keys=function(){return this.ga?this.ga.keys():new hp(this.ja,0)};lp.prototype.keys=lp.prototype.keys;
lp.prototype.fc=function(){if(this.ga)return this.ga.fc();for(var a=[],b=0,c=0;c<this.ja.length;b++,c+=2)a[b]=this.ja[c];return a};lp.prototype.keySet=lp.prototype.fc;lp.prototype.entries=function(){return this.ga?this.ga.entries():new hp(this.ja,2)};lp.prototype.entries=lp.prototype.entries;lp.prototype.values=function(){return this.ga?this.ga.values():new hp(this.ja,1)};lp.prototype.values=lp.prototype.values;
lp.prototype.forEach=function(a){if(this.ga)this.ga.forEach(a);else for(var b=0;b<this.ja.length;b+=2)a(this.ja[b+1],this.ja[b])};lp.prototype.forEach=lp.prototype.forEach;lp.prototype.get=function(a,b){if(this.ga)return this.ga.get(a);if(pp(this))return this.get(a);for(var c=0;c<this.ja.length;c+=2)if(to(this.ja[c],a))return this.ja[c+1];return b};lp.prototype.get=lp.prototype.get;
lp.prototype.has=function(a){if(this.ga)return this.ga.has(a);if(pp(this))return this.has(a);for(var b=0;b<this.ja.length;b+=2)if(to(this.ja[b],a))return!0;return!1};lp.prototype.has=lp.prototype.has;lp.prototype.set=function(a,b){this.la=-1;if(this.ga)this.ga.set(a,b),this.size=this.ga.size;else{for(var c=0;c<this.ja.length;c+=2)if(to(this.ja[c],a)){this.ja[c+1]=b;return}this.ja.push(a);this.ja.push(b);this.size++;32<this.size&&(this.ga=qp(this.ja,!1,!0),this.ja=null)}};lp.prototype.set=lp.prototype.set;
lp.prototype["delete"]=function(a){this.la=-1;if(this.ga)return a=this.ga["delete"](a),this.size=this.ga.size,a;for(var b=0;b<this.ja.length;b+=2)if(to(this.ja[b],a))return a=this.ja[b+1],this.ja.splice(b,2),this.size--,a};lp.prototype.clone=function(){var a=qp();this.forEach(function(b,c){a.set(c,b)});return a};lp.prototype.clone=lp.prototype.clone;lp.prototype[Zo]=function(){return this.entries()};lp.prototype.tb=function(){if(this.ga)return this.ga.tb();-1===this.la&&(this.la=xo(this));return this.la};
lp.prototype.$a=function(a){return this.ga?jp(this.ga,a):jp(this,a)};function kp(a,b,c){this.map=b||{};this.lc=a||[];this.size=c||0;this.la=-1}kp.prototype.toString=function(){return np(this)};kp.prototype.inspect=function(){return this.toString()};kp.prototype.clear=function(){this.la=-1;this.map={};this.lc=[];this.size=0};kp.prototype.clear=kp.prototype.clear;kp.prototype.Jb=function(){return null!=this.lc?this.lc:po(this.map)};
kp.prototype["delete"]=function(a){this.la=-1;this.lc=null;for(var b=yo(a),c=this.map[b],d=0;d<c.length;d+=2)if(to(a,c[d]))return a=c[d+1],c.splice(d,2),0===c.length&&delete this.map[b],this.size--,a};kp.prototype.entries=function(){return new ip(this,2)};kp.prototype.entries=kp.prototype.entries;kp.prototype.forEach=function(a){for(var b=this.Jb(),c=0;c<b.length;c++)for(var d=this.map[b[c]],e=0;e<d.length;e+=2)a(d[e+1],d[e],this)};kp.prototype.forEach=kp.prototype.forEach;
kp.prototype.get=function(a,b){var c=yo(a),c=this.map[c];if(null!=c)for(var d=0;d<c.length;d+=2){if(to(a,c[d]))return c[d+1]}else return b};kp.prototype.get=kp.prototype.get;kp.prototype.has=function(a){var b=yo(a),b=this.map[b];if(null!=b)for(var c=0;c<b.length;c+=2)if(to(a,b[c]))return!0;return!1};kp.prototype.has=kp.prototype.has;kp.prototype.keys=function(){return new ip(this,0)};kp.prototype.keys=kp.prototype.keys;
kp.prototype.fc=function(){for(var a=this.Jb(),b=[],c=0;c<a.length;c++)for(var d=this.map[a[c]],e=0;e<d.length;e+=2)b.push(d[e]);return b};kp.prototype.keySet=kp.prototype.fc;kp.prototype.set=function(a,b){this.la=-1;var c=yo(a),d=this.map[c];if(null==d)this.lc&&this.lc.push(c),this.map[c]=[a,b],this.size++;else{for(var c=!0,e=0;e<d.length;e+=2)if(to(b,d[e])){c=!1;d[e]=b;break}c&&(d.push(a),d.push(b),this.size++)}};kp.prototype.set=kp.prototype.set;
kp.prototype.values=function(){return new ip(this,1)};kp.prototype.values=kp.prototype.values;kp.prototype.clone=function(){var a=qp();this.forEach(function(b,c){a.set(c,b)});return a};kp.prototype.clone=kp.prototype.clone;kp.prototype[Zo]=function(){return this.entries()};kp.prototype.tb=function(){-1===this.la&&(this.la=xo(this));return this.la};kp.prototype.$a=function(a){return jp(this,a)};
function qp(a,b,c){a=a||[];b=!1===b?b:!0;if((!0!==c||!c)&&64>=a.length){if(b){var d=a;a=[];for(b=0;b<d.length;b+=2){var e=!1;for(c=0;c<a.length;c+=2)if(to(a[c],d[b])){a[c+1]=d[b+1];e=!0;break}e||(a.push(d[b]),a.push(d[b+1]))}}return new lp(a)}var d={},e=[],f=0;for(b=0;b<a.length;b+=2){c=yo(a[b]);var h=d[c];if(null==h)e.push(c),d[c]=[a[b],a[b+1]],f++;else{var k=!0;for(c=0;c<h.length;c+=2)if(to(h[c],a[b])){h[c+1]=a[b+1];k=!1;break}k&&(h.push(a[b]),h.push(a[b+1]),f++)}}return new kp(e,d,f)}
function rp(a){this.map=a;this.size=a.size}rp.prototype.toString=function(){return op(this)};rp.prototype.inspect=function(){return this.toString()};rp.prototype.add=function(a){this.map.set(a,a);this.size=this.map.size};rp.prototype.add=rp.prototype.add;rp.prototype.clear=function(){this.map=new kp;this.size=0};rp.prototype.clear=rp.prototype.clear;rp.prototype["delete"]=function(a){a=this.map["delete"](a);this.size=this.map.size;return a};rp.prototype.entries=function(){return this.map.entries()};
rp.prototype.entries=rp.prototype.entries;rp.prototype.forEach=function(a){var b=this;this.map.forEach(function(c,d){a(d,b)})};rp.prototype.forEach=rp.prototype.forEach;rp.prototype.has=function(a){return this.map.has(a)};rp.prototype.has=rp.prototype.has;rp.prototype.keys=function(){return this.map.keys()};rp.prototype.keys=rp.prototype.keys;rp.prototype.fc=function(){return this.map.fc()};rp.prototype.keySet=rp.prototype.fc;rp.prototype.values=function(){return this.map.values()};
rp.prototype.values=rp.prototype.values;rp.prototype.clone=function(){var a=sp();this.forEach(function(b){a.add(b)});return a};rp.prototype.clone=rp.prototype.clone;rp.prototype[Zo]=function(){return this.values()};rp.prototype.$a=function(a){if(a instanceof rp){if(this.size===a.size)return to(this.map,a.map)}else return!1};rp.prototype.tb=function(){return yo(this.map)};
function sp(a){a=a||[];for(var b={},c=[],d=0,e=0;e<a.length;e++){var f=yo(a[e]),h=b[f];if(null==h)c.push(f),b[f]=[a[e],a[e]],d++;else{for(var f=!0,k=0;k<h.length;k+=2)if(to(h[k],a[e])){f=!1;break}f&&(h.push(a[e]),h.push(a[e]),d++)}}return new rp(new kp(c,b,d))};function tp(a,b){if(3<a.length){if(b)return!0;var c=a.charAt(1);return"~"===a.charAt(0)?":"===c||"$"===c||"#"===c:!1}return!1}function up(a){var b=Math.floor(a/44);a=String.fromCharCode(a%44+48);return 0===b?"^"+a:"^"+String.fromCharCode(b+48)+a}function vp(){this.Me=this.Nc=this.fa=0;this.cache={}}
vp.prototype.write=function(a,b){if(tp(a,b)){4096===this.Me?(this.clear(),this.Nc=0,this.cache={}):1936===this.fa&&this.clear();var c=this.cache[a];return null==c?(this.cache[a]=[up(this.fa),this.Nc],this.fa++,a):c[1]!=this.Nc?(c[1]=this.Nc,c[0]=up(this.fa),this.fa++,a):c[0]}return a};vp.prototype.clear=function(){this.fa=0;this.Nc++};function wp(){this.fa=0;this.cache=[]}wp.prototype.write=function(a){1936==this.fa&&(this.fa=0);this.cache[this.fa]=a;this.fa++;return a};
wp.prototype.read=function(a){return this.cache[2===a.length?a.charCodeAt(1)-48:44*(a.charCodeAt(1)-48)+(a.charCodeAt(2)-48)]};wp.prototype.clear=function(){this.fa=0};function xp(a){this.La=a}
function yp(a){this.options=a||{};this.ya={};for(var b in this.Lc.ya)this.ya[b]=this.Lc.ya[b];for(b in this.options.handlers){a:{switch(b){case "_":case "s":case "?":case "i":case "d":case "b":case "'":case "array":case "map":a=!0;break a}a=!1}if(a)throw Error('Cannot override handler for ground type "'+b+'"');this.ya[b]=this.options.handlers[b]}this.pd=null!=this.options.preferStrings?this.options.preferStrings:this.Lc.pd;this.Wd=null!=this.options.preferBuffers?this.options.preferBuffers:this.Lc.Wd;
this.Pd=this.options.defaultHandler||this.Lc.Pd;this.bb=this.options.mapBuilder;this.nc=this.options.arrayBuilder}
yp.prototype.Lc={ya:{_:function(){return null},"?":function(a){return"t"===a},b:function(a,b){var c;if(b&&!1===b.Wd||"undefined"==typeof Buffer)if("undefined"!=typeof Uint8Array){if("undefined"!=typeof atob)c=atob(a);else{c=String(a).replace(/=+$/,"");if(1==c.length%4)throw Error("'atob' failed: The string to be decoded is not correctly encoded.");for(var d=0,e,f,h=0,k="";f=c.charAt(h++);~f&&(e=d%4?64*e+f:f,d++%4)?k+=String.fromCharCode(255&e>>(-2*d&6)):0)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(f);
c=k}d=c.length;e=new Uint8Array(d);for(f=0;f<d;f++)e[f]=c.charCodeAt(f);c=e}else c=ap("b",a);else c=new Buffer(a,"base64");return c},i:function(a){"number"===typeof a||a instanceof Ao||(a=Qo(a,10),a=0<a.compare(bp)||0>a.compare(cp)?a:Uo(a));return a},n:function(a){return ap("n",a)},d:function(a){return parseFloat(a)},f:function(a){return ap("f",a)},c:function(a){return a},":":function(a){return new dp(a)},$:function(a){return new ep(a)},r:function(a){return ap("r",a)},z:function(a){a:switch(a){case "-INF":a=
-Infinity;break a;case "INF":a=Infinity;break a;case "NaN":a=NaN;break a;default:throw Error("Invalid special double value "+a);}return a},"'":function(a){return a},m:function(a){a="number"===typeof a?a:parseInt(a,10);return new Date(a)},t:function(a){return new Date(a)},u:function(a){a=a.replace(/-/g,"");for(var b=null,c=null,d=c=0,e=24,f=0,f=c=0,e=24;8>f;f+=2,e-=8)c|=parseInt(a.substring(f,f+2),16)<<e;d=0;f=8;for(e=24;16>f;f+=2,e-=8)d|=parseInt(a.substring(f,f+2),16)<<e;b=No(d,c);c=0;f=16;for(e=
24;24>f;f+=2,e-=8)c|=parseInt(a.substring(f,f+2),16)<<e;d=0;for(e=f=24;32>f;f+=2,e-=8)d|=parseInt(a.substring(f,f+2),16)<<e;c=No(d,c);return new gp(b,c)},set:function(a){return sp(a)},list:function(a){return ap("list",a)},link:function(a){return ap("link",a)},cmap:function(a){return qp(a,!1)}},Pd:function(a,b){return ap(a,b)},pd:!0,Wd:!0};
yp.prototype.decode=function(a,b,c,d){if(null==a)return null;switch(typeof a){case "string":return tp(a,c)?(a=zp(this,a),b&&b.write(a,c),b=a):b="^"===a.charAt(0)&&" "!==a.charAt(1)?b.read(a,c):zp(this,a),b;case "object":if(qo(a))if("^ "===a[0])if(this.bb)if(17>a.length&&this.bb.ec){d=[];for(c=1;c<a.length;c+=2)d.push(this.decode(a[c],b,!0,!1)),d.push(this.decode(a[c+1],b,!1,!1));b=this.bb.ec(d,a)}else{d=this.bb.wc(a);for(c=1;c<a.length;c+=2)d=this.bb.add(d,this.decode(a[c],b,!0,!1),this.decode(a[c+
1],b,!1,!1),a);b=this.bb.kd(d,a)}else{d=[];for(c=1;c<a.length;c+=2)d.push(this.decode(a[c],b,!0,!1)),d.push(this.decode(a[c+1],b,!1,!1));b=qp(d,!1)}else b=Ap(this,a,b,c,d);else{c=po(a);var e=c[0];if((d=1==c.length?this.decode(e,b,!1,!1):null)&&d instanceof xp)a=a[e],c=this.ya[d.La],b=null!=c?c(this.decode(a,b,!1,!0),this):ap(d.La,this.decode(a,b,!1,!1));else if(this.bb)if(16>c.length&&this.bb.ec){var f=[];for(d=0;d<c.length;d++)e=c[d],f.push(this.decode(e,b,!0,!1)),f.push(this.decode(a[e],b,!1,!1));
b=this.bb.ec(f,a)}else{f=this.bb.wc(a);for(d=0;d<c.length;d++)e=c[d],f=this.bb.add(f,this.decode(e,b,!0,!1),this.decode(a[e],b,!1,!1),a);b=this.bb.kd(f,a)}else{f=[];for(d=0;d<c.length;d++)e=c[d],f.push(this.decode(e,b,!0,!1)),f.push(this.decode(a[e],b,!1,!1));b=qp(f,!1)}}return b}return a};yp.prototype.decode=yp.prototype.decode;
function Ap(a,b,c,d,e){if(e){var f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return f}f=c&&c.fa;if(2===b.length&&"string"===typeof b[0]&&(e=a.decode(b[0],c,!1,!1))&&e instanceof xp)return b=b[1],f=a.ya[e.La],null!=f?f=f(a.decode(b,c,d,!0),a):ap(e.La,a.decode(b,c,d,!1));c&&f!=c.fa&&(c.fa=f);if(a.nc){if(32>=b.length&&a.nc.ec){f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return a.nc.ec(f,b)}f=a.nc.wc(b);for(e=0;e<b.length;e++)f=a.nc.add(f,a.decode(b[e],c,d,!1),b);return a.nc.kd(f,
b)}f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return f}function zp(a,b){if("~"===b.charAt(0)){var c=b.charAt(1);if("~"===c||"^"===c||"`"===c)return b.substring(1);if("#"===c)return new xp(b.substring(2));var d=a.ya[c];return null==d?a.Pd(c,b.substring(2)):d(b.substring(2),a)}return b};function Bp(a){this.cf=new yp(a)}function Cp(a,b){this.rf=a;this.options=b||{};this.cache=this.options.cache?this.options.cache:new wp}Cp.prototype.read=function(a){var b=this.cache;a=this.rf.cf.decode(JSON.parse(a),b);this.cache.clear();return a};Cp.prototype.read=Cp.prototype.read;var Dp=0,Ep=(8|3&Math.round(14*Math.random())).toString(16),Fp="transit$guid$"+(ro()+ro()+ro()+ro()+ro()+ro()+ro()+ro()+"-"+ro()+ro()+ro()+ro()+"-4"+ro()+ro()+ro()+"-"+Ep+ro()+ro()+ro()+"-"+ro()+ro()+ro()+ro()+ro()+ro()+ro()+ro()+ro()+ro()+ro()+ro());
function Gp(a){if(null==a)return"null";if(a===String)return"string";if(a===Boolean)return"boolean";if(a===Number)return"number";if(a===Array)return"array";if(a===Object)return"map";var b=a[Fp];null==b&&("undefined"!=typeof Object.defineProperty?(b=++Dp,Object.defineProperty(a,Fp,{value:b,enumerable:!1})):a[Fp]=b=++Dp);return b}function Hp(a,b){for(var c=a.toString(),d=c.length;d<b;d++)c="0"+c;return c}function Ip(){}Ip.prototype.tag=function(){return"_"};Ip.prototype.Z=function(){return null};
Ip.prototype.pa=function(){return"null"};function Jp(){}Jp.prototype.tag=function(){return"s"};Jp.prototype.Z=function(a){return a};Jp.prototype.pa=function(a){return a};function Kp(){}Kp.prototype.tag=function(){return"i"};Kp.prototype.Z=function(a){return a};Kp.prototype.pa=function(a){return a.toString()};function Lp(){}Lp.prototype.tag=function(){return"i"};Lp.prototype.Z=function(a){return a.toString()};Lp.prototype.pa=function(a){return a.toString()};function Mp(){}Mp.prototype.tag=function(){return"?"};
Mp.prototype.Z=function(a){return a};Mp.prototype.pa=function(a){return a.toString()};function Np(){}Np.prototype.tag=function(){return"array"};Np.prototype.Z=function(a){return a};Np.prototype.pa=function(){return null};function Op(){}Op.prototype.tag=function(){return"map"};Op.prototype.Z=function(a){return a};Op.prototype.pa=function(){return null};function Pp(){}Pp.prototype.tag=function(){return"t"};
Pp.prototype.Z=function(a){return a.getUTCFullYear()+"-"+Hp(a.getUTCMonth()+1,2)+"-"+Hp(a.getUTCDate(),2)+"T"+Hp(a.getUTCHours(),2)+":"+Hp(a.getUTCMinutes(),2)+":"+Hp(a.getUTCSeconds(),2)+"."+Hp(a.getUTCMilliseconds(),3)+"Z"};Pp.prototype.pa=function(a,b){return b.Z(a)};function Qp(){}Qp.prototype.tag=function(){return"m"};Qp.prototype.Z=function(a){return a.valueOf()};Qp.prototype.pa=function(a){return a.valueOf().toString()};function Rp(){}Rp.prototype.tag=function(){return"u"};Rp.prototype.Z=function(a){return a.toString()};
Rp.prototype.pa=function(a){return a.toString()};function Sp(){}Sp.prototype.tag=function(){return":"};Sp.prototype.Z=function(a){return a.ta};Sp.prototype.pa=function(a,b){return b.Z(a)};function Tp(){}Tp.prototype.tag=function(){return"$"};Tp.prototype.Z=function(a){return a.ta};Tp.prototype.pa=function(a,b){return b.Z(a)};function Up(){}Up.prototype.tag=function(a){return a.tag};Up.prototype.Z=function(a){return a.Z};Up.prototype.pa=function(){return null};function Vp(){}Vp.prototype.tag=function(){return"set"};
Vp.prototype.Z=function(a){var b=[];a.forEach(function(a){b.push(a)});return ap("array",b)};Vp.prototype.pa=function(){return null};function Wp(){}Wp.prototype.tag=function(){return"map"};Wp.prototype.Z=function(a){return a};Wp.prototype.pa=function(){return null};function Xp(){}Xp.prototype.tag=function(){return"map"};Xp.prototype.Z=function(a){return a};Xp.prototype.pa=function(){return null};function Yp(){}Yp.prototype.tag=function(){return"b"};Yp.prototype.Z=function(a){return a.toString("base64")};
Yp.prototype.pa=function(){return null};function Zp(){}Zp.prototype.tag=function(){return"b"};
Zp.prototype.Z=function(a){for(var b=0,c=a.length,d="",e=null;b<c;)e=a.subarray(b,Math.min(b+32768,c)),d+=String.fromCharCode.apply(null,e),b+=32768;var f;if("undefined"!=typeof btoa)f=btoa(d);else{a=String(d);c=0;d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d";for(e="";a.charAt(c|0)||(d="\x3d",c%1);e+=d.charAt(63&f>>8-c%1*8)){b=a.charCodeAt(c+=.75);if(255<b)throw Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");f=f<<8|b}f=
e}return f};Zp.prototype.pa=function(){return null};
function $p(){this.ya={};this.set(null,new Ip);this.set(String,new Jp);this.set(Number,new Kp);this.set(Ao,new Lp);this.set(Boolean,new Mp);this.set(Array,new Np);this.set(Object,new Op);this.set(Date,new Qp);this.set(gp,new Rp);this.set(dp,new Sp);this.set(ep,new Tp);this.set($o,new Up);this.set(rp,new Vp);this.set(lp,new Wp);this.set(kp,new Xp);"undefined"!=typeof Buffer&&this.set(Buffer,new Yp);"undefined"!=typeof Uint8Array&&this.set(Uint8Array,new Zp)}
$p.prototype.get=function(a){var b=null,b="string"===typeof a?this.ya[a]:this.ya[Gp(a)];return null!=b?b:this.ya["default"]};$p.prototype.get=$p.prototype.get;$p.prototype.set=function(a,b){var c;if(c="string"===typeof a)a:{switch(a){case "null":case "string":case "boolean":case "number":case "array":case "map":c=!1;break a}c=!0}c?this.ya[a]=b:this.ya[Gp(a)]=b};function aq(a){this.Vb=a||{};this.pd=null!=this.Vb.preferStrings?this.Vb.preferStrings:!0;this.ye=this.Vb.objectBuilder||null;this.ya=new $p;if(a=this.Vb.handlers){if(qo(a)||!a.forEach)throw Error('transit writer "handlers" option must be a map');var b=this;a.forEach(function(a,d){if(void 0!==d)b.ya.set(d,a);else throw Error("Cannot create handler for JavaScript undefined");})}this.Oc=this.Vb.handlerForForeign;this.vd=this.Vb.unpack||function(a){return a instanceof lp&&null===a.ga?a.ja:!1};this.Xc=
this.Vb&&this.Vb.verbose||!1}aq.prototype.Ra=function(a){var b=this.ya.get(null==a?null:a.constructor);return null!=b?b:(a=a&&a.transitTag)?this.ya.get(a):null};function bq(a,b,c,d,e){a=a+b+c;return e?e.write(a,d):a}function cq(a,b,c){var d=[];if(qo(b))for(var e=0;e<b.length;e++)d.push(dq(a,b[e],!1,c));else b.forEach(function(b){d.push(dq(a,b,!1,c))});return d}function eq(a,b){if("string"!==typeof b){var c=a.Ra(b);return c&&1===c.tag(b).length}return!0}
function fq(a,b){var c=a.vd(b),d=!0;if(c){for(var e=0;e<c.length&&(d=eq(a,c[e]),d);e+=2);return d}if(b.keys&&(c=b.keys(),e=null,c.next)){for(e=c.next();!e.done;){d=eq(a,e.value);if(!d)break;e=c.next()}return d}if(b.forEach)return b.forEach(function(b,c){d=d&&eq(a,c)}),d;throw Error("Cannot walk keys of object type "+(null==b?null:b.constructor).name);}
function gq(a){if(a.constructor.transit$isObject)return!0;var b=a.constructor.toString(),b=b.substr(9),b=b.substr(0,b.indexOf("("));isObject="Object"==b;"undefined"!=typeof Object.defineProperty?Object.defineProperty(a.constructor,"transit$isObject",{value:isObject,enumerable:!1}):a.constructor.transit$isObject=isObject;return isObject}
function hq(a,b,c){var d=null,e=null,f=null,d=null,h=0;if(b.constructor===Object||null!=b.forEach||a.Oc&&gq(b)){if(a.Xc){if(null!=b.forEach)if(fq(a,b)){var k={};b.forEach(function(b,d){k[dq(a,d,!0,!1)]=dq(a,b,!1,c)})}else{d=a.vd(b);e=[];f=bq("~#","cmap","",!0,c);if(d)for(;h<d.length;h+=2)e.push(dq(a,d[h],!1,!1)),e.push(dq(a,d[h+1],!1,c));else b.forEach(function(b,d){e.push(dq(a,d,!1,!1));e.push(dq(a,b,!1,c))});k={};k[f]=e}else for(d=po(b),k={};h<d.length;h++)k[dq(a,d[h],!0,!1)]=dq(a,b[d[h]],!1,c);
return k}if(null!=b.forEach){if(fq(a,b)){d=a.vd(b);k=["^ "];if(d)for(;h<d.length;h+=2)k.push(dq(a,d[h],!0,c)),k.push(dq(a,d[h+1],!1,c));else b.forEach(function(b,d){k.push(dq(a,d,!0,c));k.push(dq(a,b,!1,c))});return k}d=a.vd(b);e=[];f=bq("~#","cmap","",!0,c);if(d)for(;h<d.length;h+=2)e.push(dq(a,d[h],!1,c)),e.push(dq(a,d[h+1],!1,c));else b.forEach(function(b,d){e.push(dq(a,d,!1,c));e.push(dq(a,b,!1,c))});return[f,e]}k=["^ "];for(d=po(b);h<d.length;h++)k.push(dq(a,d[h],!0,c)),k.push(dq(a,b[d[h]],!1,
c));return k}if(null!=a.ye)return a.ye(b,function(b){return dq(a,b,!0,c)},function(b){return dq(a,b,!1,c)});h=(null==b?null:b.constructor).name;d=Error("Cannot write "+h);d.data={Vd:b,type:h};throw d;}
function dq(a,b,c,d){var e=a.Ra(b)||(a.Oc?a.Oc(b,a.ya):null),f=e?e.tag(b):null,h=e?e.Z(b):null;if(null!=e&&null!=f)switch(f){case "_":return c?bq("~","_","",c,d):null;case "s":return 0<h.length?(a=h.charAt(0),a="~"===a||"^"===a||"`"===a?"~"+h:h):a=h,bq("","",a,c,d);case "?":return c?bq("~","?",h.toString()[0],c,d):h;case "i":return Infinity===h?bq("~","z","INF",c,d):-Infinity===h?bq("~","z","-INF",c,d):isNaN(h)?bq("~","z","NaN",c,d):c||"string"===typeof h||h instanceof Ao?bq("~","i",h.toString(),
c,d):h;case "d":return c?bq(h.tf,"d",h,c,d):h;case "b":return bq("~","b",h,c,d);case "'":return a.Xc?(b={},c=bq("~#","'","",!0,d),b[c]=dq(a,h,!1,d),d=b):d=[bq("~#","'","",!0,d),dq(a,h,!1,d)],d;case "array":return cq(a,h,d);case "map":return hq(a,h,d);default:a:{if(1===f.length){if("string"===typeof h){d=bq("~",f,h,c,d);break a}if(c||a.pd){(a=a.Xc&&new Pp)?(f=a.tag(b),h=a.pa(b,a)):h=e.pa(b,e);if(null!==h){d=bq("~",f,h,c,d);break a}d=Error('Tag "'+f+'" cannot be encoded as string');d.data={tag:f,Z:h,
Vd:b};throw d;}}b=f;c=h;a.Xc?(h={},h[bq("~#",b,"",!0,d)]=dq(a,c,!1,d),d=h):d=[bq("~#",b,"",!0,d),dq(a,c,!1,d)]}return d}else throw d=(null==b?null:b.constructor).name,a=Error("Cannot write "+d),a.data={Vd:b,type:d},a;}function iq(a,b){var c=a.Ra(b)||(a.Oc?a.Oc(b,a.ya):null);if(null!=c)return 1===c.tag(b).length?ap("'",b):b;var c=(null==b?null:b.constructor).name,d=Error("Cannot write "+c);d.data={Vd:b,type:c};throw d;}
function jq(a,b){this.Cc=a;this.options=b||{};this.cache=!1===this.options.cache?null:this.options.cache?this.options.cache:new vp}jq.prototype.ff=function(){return this.Cc};jq.prototype.marshaller=jq.prototype.ff;jq.prototype.write=function(a,b){var c=null,d=b||{},c=d.asMapKey||!1,e=this.Cc.Xc?!1:this.cache;!1===d.marshalTop?c=dq(this.Cc,a,c,e):(d=this.Cc,c=JSON.stringify(dq(d,iq(d,a),c,e)));null!=this.cache&&this.cache.clear();return c};jq.prototype.write=jq.prototype.write;
jq.prototype.register=function(a,b){this.Cc.ya.set(a,b)};jq.prototype.register=jq.prototype.register;function kq(a,b){if("json"===a||"json-verbose"===a||null==a){var c=new Bp(b);return new Cp(c,b)}throw Error("Cannot create reader of type "+a);}function lq(a,b){if("json"===a||"json-verbose"===a||null==a){"json-verbose"===a&&(null==b&&(b={}),b.verbose=!0);var c=new aq(b);return new jq(c,b)}c=Error('Type must be "json"');c.data={type:a};throw c;};$h.prototype.G=function(a,b){return b instanceof $h?this.Bb===b.Bb:b instanceof gp?this.Bb===b.toString():!1};$h.prototype.Zb=!0;$h.prototype.Fb=function(a,b){if(b instanceof $h||b instanceof gp)return Sc(this.toString(),b.toString());throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};gp.prototype.Zb=!0;gp.prototype.Fb=function(a,b){if(b instanceof $h||b instanceof gp)return Sc(this.toString(),b.toString());throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};
Ao.prototype.G=function(a,b){return this.equiv(b)};gp.prototype.G=function(a,b){return b instanceof $h?ic(b,this):this.equiv(b)};$o.prototype.G=function(a,b){return this.equiv(b)};Ao.prototype.Ld=!0;Ao.prototype.P=function(){return yo.g?yo.g(this):yo.call(null,this)};gp.prototype.Ld=!0;gp.prototype.P=function(){return Xc(this.toString())};$o.prototype.Ld=!0;$o.prototype.P=function(){return yo.g?yo.g(this):yo.call(null,this)};gp.prototype.da=!0;
gp.prototype.O=function(a,b){return qc(b,[z('#uuid "'),z(this.toString()),z('"')].join(""))};function mq(a,b){for(var c=K(Zd(b)),d=null,e=0,f=0;;)if(f<e){var h=d.ca(null,f);a[h]=b[h];f+=1}else if(c=K(c))d=c,Yd(d)?(c=Bc(d),f=Cc(d),d=c,e=Q(c),c=f):(c=L(d),a[c]=b[c],c=N(d),d=null,e=0),f=0;else break;return a}function nq(){}nq.prototype.wc=function(){return tc(X)};nq.prototype.add=function(a,b,c){return wc(a,b,c)};nq.prototype.kd=function(a){return vc(a)};
nq.prototype.ec=function(a){return Eg.h?Eg.h(a,!0,!0):Eg.call(null,a,!0,!0)};function oq(){}oq.prototype.wc=function(){return tc(Hd)};oq.prototype.add=function(a,b){return Xe.a(a,b)};oq.prototype.kd=function(a){return vc(a)};oq.prototype.ec=function(a){return dg.a?dg.a(a,!0):dg.call(null,a,!0)};
function pq(a){var b=Ae(Bk);a=mq({handlers:Uh(sh.A(H([new q(null,5,["$",function(){return function(a){return $c.g(a)}}(b),":",function(){return function(a){return Ke.g(a)}}(b),"set",function(){return function(a){return If(wh,a)}}(b),"list",function(){return function(a){return If(M,a.reverse())}}(b),"cmap",function(){return function(a){for(var b=0,e=tc(X);;)if(b<a.length)var f=b+2,e=wc(e,a[b],a[b+1]),b=f;else return vc(e)}}(b)],null),pj.g(a)],0))),mapBuilder:new nq,arrayBuilder:new oq,prefersStrings:!1},
Uh(Nd.a(a,pj)));return kq.a?kq.a(b,a):kq.call(null,b,a)}function qq(){}qq.prototype.tag=function(){return":"};qq.prototype.Z=function(a){return a.Ba};qq.prototype.pa=function(a){return a.Ba};function rq(){}rq.prototype.tag=function(){return"$"};rq.prototype.Z=function(a){return a.La};rq.prototype.pa=function(a){return a.La};function sq(){}sq.prototype.tag=function(){return"list"};
sq.prototype.Z=function(a){var b=[];a=K(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e);b.push(f);e+=1}else if(a=K(a))c=a,Yd(c)?(a=Bc(c),e=Cc(c),c=a,d=Q(a),a=e):(a=L(c),b.push(a),a=N(c),c=null,d=0),e=0;else break;return ap.a?ap.a("array",b):ap.call(null,"array",b)};sq.prototype.pa=function(){return null};function tq(){}tq.prototype.tag=function(){return"map"};tq.prototype.Z=function(a){return a};tq.prototype.pa=function(){return null};function uq(){}uq.prototype.tag=function(){return"set"};
uq.prototype.Z=function(a){var b=[];a=K(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e);b.push(f);e+=1}else if(a=K(a))c=a,Yd(c)?(a=Bc(c),e=Cc(c),c=a,d=Q(a),a=e):(a=L(c),b.push(a),a=N(c),c=null,d=0),e=0;else break;return ap.a?ap.a("array",b):ap.call(null,"array",b)};uq.prototype.pa=function(){return null};function vq(){}vq.prototype.tag=function(){return"array"};
vq.prototype.Z=function(a){var b=[];a=K(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e);b.push(f);e+=1}else if(a=K(a))c=a,Yd(c)?(a=Bc(c),e=Cc(c),c=a,d=Q(a),a=e):(a=L(c),b.push(a),a=N(c),c=null,d=0),e=0;else break;return b};vq.prototype.pa=function(){return null};function wq(){}wq.prototype.tag=function(){return"u"};wq.prototype.Z=function(a){return a.Bb};wq.prototype.pa=function(a){return this.Z(a)};
function xq(a,b){var c=new qq,d=new rq,e=new sq,f=new tq,h=new uq,k=new vq,l=new wq,m=sh.A(H([Md([Kd,Ie,q,Xg,mg,J,u,Ge,Le,hg,lg,Yg,rh,yg,V,zd,yd,vh,mh,qh,Xd,xh,Wd,Qc,$h,zh,bh],[f,e,f,e,e,e,c,e,e,k,e,e,e,e,k,e,e,h,f,e,e,h,e,d,l,e,e]),pj.g(b)],0)),n=Ae(a),r=mq({objectBuilder:function(a,b,c,d,e,f,h,k,l){return function(m,n,r){return le(function(){return function(a,b,c){a.push(n.g?n.g(b):n.call(null,b),r.g?r.g(c):r.call(null,c));return a}}(a,b,c,d,e,f,h,k,l),m)}}(n,c,d,e,f,h,k,l,m),handlers:function(){var a=
yb(m);a.forEach=function(){return function(a){for(var b=K(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=K(b))Yd(b)?(c=Bc(b),b=Cc(b),h=c,d=Q(c),c=h):(c=L(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=N(b),c=null,d=0),e=0;else return null}}(a,n,c,d,e,f,h,k,l,m);return a}(),unpack:function(){return function(a){return a instanceof q?a.l:!1}}(n,c,d,e,f,h,k,l,m)},Uh(Nd.a(b,pj)));return lq.a?lq.a(n,r):lq.call(null,n,r)};function yq(a,b){for(var c=new Ga,d=K(b);;)if(null!=d)c.append(""+z(L(d))),d=N(d),null!=d&&c.append(a);else return c.toString()}function zq(a,b){a:for(var c="/(?:)/"===""+z(b)?Gd.a(ke(P("",S.a(z,K(a)))),""):ke((""+z(a)).split(b));;)if(""===(null==c?null:Vb(c)))c=null==c?null:Xb(c);else break a;return c};g=Rn.prototype;g.Ad=function(a,b,c){a=null!=b&&(b.v&64||b.na)?A.a(nd,b):b;var d=G.a(a,wk),e=G.a(a,Ki),f=G.a(a,Gk),h=G.a(a,yj),k=G.h(a,Ck,0),l=G.h(a,Rk,!1);Wm(this,"complete",function(){return function(a){a=a.target;return c.g?c.g(a):c.call(null,a)}}(this,"complete",this,this,b,a,d,e,f,h,k,l));this.Bc=Math.max(0,k);this.Ie=l;this.send(d,e,f,Uh(h));return this};g.Bd=function(){var a;try{a=this.ea?this.ea.responseText:""}catch(b){Hn(this.ab,"Can not get responseText: "+b.message),a=""}return a};
g.Dd=function(){return fo(this)};g.Ed=function(){return go(this)};g.Cd=function(a,b){return this.getResponseHeader(b)};g.Fd=function(){return Rc.a(this.yc,7)};function Aq(a,b){return no(b,a)}function Bq(a){a:{a=[a];var b=a.length;if(b<=Cg)for(var c=0,d=tc(X);;)if(c<b)var e=c+1,d=wc(d,a[c],null),c=e;else{a=new vh(null,vc(d),null);break a}else for(c=0,d=tc(wh);;)if(c<b)e=c+1,d=uc(d,a[c]),c=e;else{a=vc(d);break a}}return ff(a,new V(null,6,5,W,[200,201,202,204,205,206],null))}
var lf=function lf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return lf.A(arguments[0],arguments[1],arguments[2],3<c.length?new J(c.slice(3),0):null)};lf.A=function(a,b,c,d){return new V(null,2,5,W,[!1,ub.h(Gd,new q(null,3,[Sj,a,Xi,b,Hi,c],null),S.a(ke,Kf(2,2,d)))],null)};lf.I=3;lf.L=function(a){var b=L(a),c=N(a);a=L(c);var d=N(c),c=L(d),d=N(d);return lf.A(b,a,c,d)};
function Cq(a){return yq(", ",S.a(function(a){return[z(a),z("; charset\x3dutf-8")].join("")},"string"===typeof a?new V(null,1,5,W,[a],null):a))}function Dq(a,b,c,d,e,f){this.read=a;this.description=b;this.Ib=c;this.H=d;this.D=e;this.s=f;this.v=2229667594;this.K=8192}g=Dq.prototype;g.N=function(a,b){return Lb.h(this,b,null)};
g.M=function(a,b,c){switch(b instanceof u?b.Ba:null){case "read":return this.read;case "description":return this.description;case "content-type":return this.Ib;default:return G.h(this.D,b,c)}};g.Dc=function(a,b){var c=null!=a&&(a.v&64||a.na)?A.a(nd,a):a,d=G.a(c,kk),e=null!=this&&(this.v&64||this.na)?A.a(nd,this):this,f=G.a(e,kk);return Lf(b,yj,function(a,b,c){return function(a){return sh.A(H([new q(null,1,["Accept",Cq(c)],null),t(a)?a:X],0))}}(this,e,f,a,c,d))};
g.Ec=function(a,b){var c=null!=a&&(a.v&64||a.na)?A.a(nd,a):a;G.a(c,Bi);var c=null!=this&&(this.v&64||this.na)?A.a(nd,this):this,d=G.a(c,Bi);try{var e=io(b),f=kf(e);switch(e){case 0:return f.a?f.a("Request failed.",Uk):f.call(null,"Request failed.",Uk);case -1:return t(mo(b))?f.a?f.a("Request aborted by client.",bj):f.call(null,"Request aborted by client.",bj):f.a?f.a("Request timed out.",Ck):f.call(null,"Request timed out.",Ck);case 204:return new V(null,2,5,W,[!0,null],null);case 205:return new V(null,
2,5,W,[!0,null],null);default:try{var h=d.g?d.g(b):d.call(null,b);if(t(Bq(e)))return new V(null,2,5,W,[!0,h],null);var k=jo(b);return f.J?f.J(k,rk,ai,h):f.call(null,k,rk,ai,h)}catch(l){if(l instanceof Object){var h=l,f=W,m,n=null!=c&&(c.v&64||c.na)?A.a(nd,c):c,r=G.a(n,di),v=new q(null,3,[Sj,e,Hi,rk,ai,null],null),y=[z(h.message),z("  Format should have been "),z(r)].join(""),C=Ld.A(v,Xi,y,H([Hi,ek,ui,ko(b)],0));m=t(Bq(e))?C:Ld.A(v,Xi,jo(b),H([rj,C],0));return new V(null,2,5,f,[!1,m],null)}throw l;
}}}catch(E){if(E instanceof Object)return h=E,lf.A(0,h.message,tk,H([tk,h],0));throw E;}};g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#ajax.core.ResponseFormat{",", ","}",c,Ve.a(new V(null,3,5,W,[new V(null,2,5,W,[Bi,this.read],null),new V(null,2,5,W,[di,this.description],null),new V(null,2,5,W,[kk,this.Ib],null)],null),this.D))};g.Aa=function(){return new rg(0,this,3,new V(null,3,5,W,[Bi,di,kk],null),Hc(this.D))};g.R=function(){return this.H};
g.sa=function(){return new Dq(this.read,this.description,this.Ib,this.H,this.D,this.s)};g.Y=function(){return 3+Q(this.D)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};g.Ua=function(a,b){return ee(new vh(null,new q(null,3,[di,null,Bi,null,kk,null],null),null),b)?Nd.a(pd(If(X,this),this.H),b):new Dq(this.read,this.description,this.Ib,this.H,Ze(Nd.a(this.D,b)),null)};
g.Ia=function(a,b,c){return t(U.a?U.a(Bi,b):U.call(null,Bi,b))?new Dq(c,this.description,this.Ib,this.H,this.D,null):t(U.a?U.a(di,b):U.call(null,di,b))?new Dq(this.read,c,this.Ib,this.H,this.D,null):t(U.a?U.a(kk,b):U.call(null,kk,b))?new Dq(this.read,this.description,c,this.H,this.D,null):new Dq(this.read,this.description,this.Ib,this.H,Ld.h(this.D,b,c),null)};
g.U=function(){return K(Ve.a(new V(null,3,5,W,[new V(null,2,5,W,[Bi,this.read],null),new V(null,2,5,W,[di,this.description],null),new V(null,2,5,W,[kk,this.Ib],null)],null),this.D))};g.S=function(a,b){return new Dq(this.read,this.description,this.Ib,b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};function Eq(a){return new Dq(Bi.g(a),di.g(a),kk.g(a),null,Nd.A(a,Bi,H([di,kk],0)),null)}Fq;
function Gq(a){return function(b,c){var d=new V(null,2,5,W,[b,c],null);return Fq.a?Fq.a(a,d):Fq.call(null,a,d)}}var Fq=function Fq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Fq.a(arguments[0],arguments[1]);case 1:return Fq.g(arguments[0]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Fq.a=function(a,b){var c=R(b,0),d=R(b,1),c=c instanceof u?Ae(c):c,c=t(a)?[z(a),z("["),z(c),z("]")].join(""):c;return"string"===typeof d?new V(null,1,5,W,[new V(null,2,5,W,[c,d],null)],null):Ud(d)?Ff(Fq.g(c),H([K(d)],0)):Td(d)?A.a(Ve,nf(Gq(c),K(d))):new V(null,1,5,W,[new V(null,2,5,W,[c,d],null)],null)};
Fq.g=function(a){return function(b){var c=R(b,0);b=R(b,1);c=c instanceof u?Ae(c):c;c=t(a)?[z(a),z("["),z(c),z("]")].join(""):c;return"string"===typeof b?new V(null,1,5,W,[new V(null,2,5,W,[c,b],null)],null):Ud(b)?Ff(Fq.g(c),H([K(b)],0)):Td(b)?A.a(Ve,nf(Gq(c),K(b))):new V(null,1,5,W,[new V(null,2,5,W,[c,b],null)],null)}};Fq.I=2;function Hq(a){return yq("\x26",S.a(function(a){var c=R(a,0);a=R(a,1);return[z(c),z("\x3d"),z(a)].join("")},Ff(Fq.g(null),H([K(a)],0))))}
function Iq(a,b){return function(c){return t(a)?[z(c),z(t(Eh(/\?/,c))?"\x26":"?"),z(b.g?b.g(a):b.call(null,a))].join(""):c}}function Jq(a,b,c,d){this.Wb=a;this.H=b;this.D=c;this.s=d;this.v=2229667594;this.K=8192}g=Jq.prototype;g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){switch(b instanceof u?b.Ba:null){case "params-to-str":return this.Wb;default:return G.h(this.D,b,c)}};
g.Dc=function(a,b){var c=null!=b&&(b.v&64||b.na)?A.a(nd,b):b,d=G.a(c,Ki);Rc.a(d,"GET")&&(c=Lf(c,wk,Iq(gj.g(c),this.Wb)),c=new qd(c));return c};g.Ec=function(a,b){return b};g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#ajax.core.ProcessGet{",", ","}",c,Ve.a(new V(null,1,5,W,[new V(null,2,5,W,[nj,this.Wb],null)],null),this.D))};g.Aa=function(){return new rg(0,this,1,new V(null,1,5,W,[nj],null),Hc(this.D))};g.R=function(){return this.H};
g.sa=function(){return new Jq(this.Wb,this.H,this.D,this.s)};g.Y=function(){return 1+Q(this.D)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};g.Ua=function(a,b){return ee(new vh(null,new q(null,1,[nj,null],null),null),b)?Nd.a(pd(If(X,this),this.H),b):new Jq(this.Wb,this.H,Ze(Nd.a(this.D,b)),null)};
g.Ia=function(a,b,c){return t(U.a?U.a(nj,b):U.call(null,nj,b))?new Jq(c,this.H,this.D,null):new Jq(this.Wb,this.H,Ld.h(this.D,b,c),null)};g.U=function(){return K(Ve.a(new V(null,1,5,W,[new V(null,2,5,W,[nj,this.Wb],null)],null),this.D))};g.S=function(a,b){return new Jq(this.Wb,b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};function Kq(a){throw Error(""+z(a));}function Lq(a,b,c){this.H=a;this.D=b;this.s=c;this.v=2229667594;this.K=8192}g=Lq.prototype;
g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){switch(b){default:return G.h(this.D,b,c)}};g.Dc=function(a,b){var c=null!=b&&(b.v&64||b.na)?A.a(nd,b):b,d=G.a(c,Gk);G.a(c,gj);return null==d?c:new qd(c)};g.Ec=function(a,b){return b};g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#ajax.core.DirectSubmission{",", ","}",c,Ve.a(Hd,this.D))};g.Aa=function(){return new rg(0,this,0,Hd,Hc(this.D))};g.R=function(){return this.H};
g.sa=function(){return new Lq(this.H,this.D,this.s)};g.Y=function(){return 0+Q(this.D)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};g.Ua=function(a,b){return ee(wh,b)?Nd.a(pd(If(X,this),this.H),b):new Lq(this.H,Ze(Nd.a(this.D,b)),null)};g.Ia=function(a,b,c){return new Lq(this.H,Ld.h(this.D,b,c),null)};g.U=function(){return K(Ve.a(Hd,this.D))};
g.S=function(a,b){return new Lq(b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};function Mq(a,b,c){this.H=a;this.D=b;this.s=c;this.v=2229667594;this.K=8192}g=Mq.prototype;g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){switch(b){default:return G.h(this.D,b,c)}};
g.Dc=function(a,b){var c=null!=b&&(b.v&64||b.na)?A.a(nd,b):b;G.a(c,wk);G.a(c,Ki);var d=G.a(c,mi),e=G.a(c,gj),f=G.a(c,yj),h;h=Ud(d)?d:de(d)?new q(null,2,[Fj,d,kk,"text/plain"],null):X;h=null!=h&&(h.v&64||h.na)?A.a(nd,h):h;var k=G.a(h,Fj);h=G.a(h,kk);d=null!=k?k.g?k.g(e):k.call(null,e):Kq(new V(null,2,5,W,["unrecognized request format: ",d],null));f=t(f)?f:X;return Ld.A(c,Gk,d,H([yj,t(h)?Ld.h(f,"Content-Type",Cq(h)):f],0))};g.Ec=function(a,b){return b};
g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#ajax.core.ApplyRequestFormat{",", ","}",c,Ve.a(Hd,this.D))};g.Aa=function(){return new rg(0,this,0,Hd,Hc(this.D))};g.R=function(){return this.H};g.sa=function(){return new Mq(this.H,this.D,this.s)};g.Y=function(){return 0+Q(this.D)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};
g.Ua=function(a,b){return ee(wh,b)?Nd.a(pd(If(X,this),this.H),b):new Mq(this.H,Ze(Nd.a(this.D,b)),null)};g.Ia=function(a,b,c){return new Mq(this.H,Ld.h(this.D,b,c),null)};g.U=function(){return K(Ve.a(Hd,this.D))};g.S=function(a,b){return new Mq(b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};function Nq(a){a=null!=a&&(a.v&64||a.na)?A.a(nd,a):a;a=G.a(a,jj);return t(a)?a:Bk}
function Oq(a,b){return function(a){return function(b){return a.write(b)}}(function(){var c=Uj.g(b);return t(c)?c:xq(a,b)}())}function Pq(a){var b=Nq(a),c=Rc.a(b,Bk)?"json":"msgpack";return new q(null,2,[Fj,Oq(b,a),kk,[z("application/transit+"),z(c)].join("")],null)}function Qq(a){return function(b){return function(c){c=ko(c);c=b.read(c);return t(Li.g(a))?c:Yh(c,H([new q(null,1,[Zh,!1],null)],0))}}(function(){var b=bk.g(a);return t(b)?b:pq(a)}())}
var Rq=function Rq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rq.o();case 1:return Rq.g(arguments[0]);case 2:return Rq.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Rq.o=function(){return Rq.g(X)};Rq.g=function(a){return Rq.a(Nq(a),a)};Rq.a=function(a,b){return Eq(new q(null,3,[Bi,Qq(b),di,"Transit",kk,new V(null,1,5,W,["application/transit+json"],null)],null))};Rq.I=2;
function Sq(){return new q(null,2,[Fj,Hq,kk,"application/x-www-form-urlencoded"],null)}var Tq=function Tq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Tq.o();case 1:return Tq.g(arguments[0]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Tq.o=function(){return Eq(new q(null,3,[Bi,ko,di,"raw text",kk,new V(null,1,5,W,["*/*"],null)],null))};Tq.g=function(){return Tq.o()};Tq.I=1;
function Uq(a){var b=new ln;a=Uh(a);var c=[];mn(b,a,c);return c.join("")}function Vq(a,b,c){return function(d){d=ko(d);d=t(t(a)?Rc.a(0,d.indexOf(a)):a)?d.substring(a.length):d;d=kn(d);return t(b)?d:Yh(d,H([Zh,c],0))}}var Wq=function Wq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Wq.o();case 1:return Wq.g(arguments[0]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Wq.o=function(){return Wq.g(X)};
Wq.g=function(a){var b=null!=a&&(a.v&64||a.na)?A.a(nd,a):a;a=G.a(b,vj);var c=G.a(b,zi),b=G.a(b,Li);return Eq(new q(null,3,[Bi,Vq(a,b,c),di,[z("JSON"),z(t(a)?[z(" prefix '"),z(a),z("'")].join(""):null),z(t(c)?" keywordize":null)].join(""),kk,new V(null,1,5,W,["application/json"],null)],null))};Wq.I=1;
var Xq=new V(null,6,5,W,[new V(null,2,5,W,["application/json",Wq],null),new V(null,2,5,W,["application/transit+json",Rq],null),new V(null,2,5,W,["application/transit+transit",Rq],null),new V(null,2,5,W,["text/plain",Tq],null),new V(null,2,5,W,["text/html",Tq],null),new V(null,2,5,W,["*/*",Tq],null)],null);function Yq(a,b){return null==b||Ud(b)?b:Vd(b)?Yq(a,Ed(b)):b.g?b.g(a):b.call(null,a)}
function Zq(a,b){var c=Vd(b)?L(b):kk.g(Yq(a,b));return null==c?new V(null,1,5,W,["*/*"],null):"string"===typeof c?new V(null,1,5,W,[c],null):c}function $q(a){return function(b){b=Vd(b)?L(b):kk.g(Yq(a,b));return null==b?new V(null,1,5,W,["*/*"],null):"string"===typeof b?new V(null,1,5,W,[b],null):b}}function ar(a){return function(b){return Rc.a(b,"*/*")||0<=a.indexOf(b)}}function br(a,b){return function(c){c=Zq(b,c);return ff(ar(a),c)}}
function cr(a){return function(b){var c;c=null!=a&&(a.v&64||a.na)?A.a(nd,a):a;var d=G.a(c,Wi),e=lo(b,"Content-Type");c=Yq(c,L(Gf(br(t(e)?e:"",c),d)));return Bi.g(c).call(null,b)}}function dr(a){var b;b=null!=a&&(a.v&64||a.na)?A.a(nd,a):a;var c=G.a(b,Wi);b=Vd(c)?Ff($q(b),H([c],0)):Zq(b,c);return Eq(new q(null,3,[Bi,cr(a),mi,[z("(from "),z(b),z(")")].join(""),kk,b],null))}
function er(a){a=null!=a&&(a.v&64||a.na)?A.a(nd,a):a;var b=G.a(a,Wi);return b instanceof Dq?b:Vd(b)?dr(a):Ud(b)?Eq(b):de(b)?Eq(new q(null,3,[Bi,b,di,"custom",kk,"*/*"],null)):Kq(new V(null,2,5,W,["unrecognized response format: ",b],null))}function fr(a){return a instanceof u?Ae(a).toUpperCase():a}function gr(a,b){return function(c){c=ub.h(function(a,b){return oo(b,a)},c,b);return a.g?a.g(c):a.call(null,c)}}
var hr=new V(null,3,5,W,[new Jq(Hq,null,null,null),new Lq(null,null,null),new Mq(null,null,null)],null),ir,jr=Hd;ir=pf.g?pf.g(jr):pf.call(null,jr);function kr(a){var b=er(a);return Lf(Lf(a,Ki,fr),yk,function(a){return function(b){return Ve.A(new V(null,1,5,W,[a],null),t(b)?b:O.g?O.g(ir):O.call(null,ir),H([hr],0))}}(b))}
function lr(a,b){if(Ud(a))return a;if(Od(a))return new q(null,1,[Fj,a],null);if(null==a)return Pq(b);switch(a instanceof u?a.Ba:null){case "transit":return Pq(b);case "json":return new q(null,2,[Fj,Uq,kk,"application/json"],null);case "text":return new q(null,2,[Fj,me,kk,"text/plain"],null);case "raw":return Sq();case "url":return Sq();default:return null}}
var mr=function mr(b,c){if(Vd(b))return new V(null,2,5,W,[L(b),mr(Ed(b),c)],null);if(Ud(b))return b;if(Od(b))return new q(null,2,[Bi,b,di,"custom"],null);if(null==b)return dr(new q(null,1,[Wi,Xq],null));switch(b instanceof u?b.Ba:null){case "transit":return Rq.g(c);case "json":return Wq.g(c);case "text":return Tq.o?Tq.o():Tq.call(null);case "raw":return Tq.o();case "detect":return dr(new q(null,1,[Wi,Xq],null));default:return null}};
function nr(a,b){return Vd(a)?A.a(eg,S.a(function(a){return mr(a,b)},a)):mr(a,b)}function or(a){var b=null!=a&&(a.v&64||a.na)?A.a(nd,a):a,c=G.a(b,Lk),d=G.a(b,Bj),e=G.a(b,li);return function(a,b,c,d,e){return function(a){var b=R(a,0);a=R(a,1);b=t(b)?c:d;t(b)&&(b.g?b.g(a):b.call(null,a));return Od(e)?e.o?e.o():e.call(null):null}}(a,b,c,d,e)}
function pr(a,b){var c=L(b),c=c instanceof u?A.a(nd,b):c,c=Ld.A(c,wk,a,H([Ki,"GET"],0)),c=null!=c&&(c.v&64||c.na)?A.a(nd,c):c,d=G.a(c,Ki),e=G.a(c,mi),f=G.a(c,Wi);G.a(c,gj);d=null==G.a(c,Gk)&&!Rc.a(d,"GET");e=t(t(e)?e:d)?lr(e,c):null;c=Ld.A(c,Lk,or(c),H([mi,e,Wi,nr(f,c)],0));c=kr(c);c=null!=c&&(c.v&64||c.na)?A.a(nd,c):c;f=G.a(c,yk);c=ub.h(Aq,c,f);f=He(f);e=null!=c&&(c.v&64||c.na)?A.a(nd,c):c;e=G.a(e,Lk);f=t(e)?gr(e,f):Kq("No ajax handler provided.");e=ti.g(c);e=t(e)?e:new Rn;ho(e,c,f)};function qr(a){return ub.a(oe,a)/Q(a)}function rr(a){var b=new Date;b.setTime(a);return b}function sr(a){return a.getTime()}function tr(a){return A.a(Ve,S.h(function(a,c){var d=R(a,0),e=R(c,0),f=R(c,1),d=Math.round((sr(e)-sr(d))/864E5);return xf(d,Bf(f/d))},a,Af(1,a)))}function ur(a,b){var c=a*Q(b);return Af(Math.round(c),b)};function vr(a){return[z("M"),z(yq("",Df(S.a(function(a){return yq(",",a)},a))))].join("")}function wr(a,b){return[z("translate("),z(a),z(","),z(b),z(")")].join("")};function xr(a){return Jd(a,2)}function yr(a){var b=zq(a,/-/);a=R(b,0);var c=R(b,1),b=R(b,2);return new Date(a|0,(c|0)-1,b|0)}function zr(a){return S.a(function(a){return Lf(Lf(Lf(zq(a,/,/),0,yr),1,ve),2,ve)},zq(a,/\n/))};var Ar=function Ar(b){if(null!=b&&null!=b.Le)return b.domain;var c=Ar[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ar._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("IScale.-domain",b);};function Br(a,b,c,d,e,f){this.domain=a;this.Ab=b;this.ha=c;this.H=d;this.D=e;this.s=f;this.v=2229667595;this.K=8192}g=Br.prototype;g.N=function(a,b){return Lb.h(this,b,null)};
g.M=function(a,b,c){switch(b instanceof u?b.Ba:null){case "domain":return this.domain;case "rng":return this.Ab;case "f":return this.ha;default:return G.h(this.D,b,c)}};g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#burn.scale.Linear{",", ","}",c,Ve.a(new V(null,3,5,W,[new V(null,2,5,W,[zk,this.domain],null),new V(null,2,5,W,[bi,this.Ab],null),new V(null,2,5,W,[pk,this.ha],null)],null),this.D))};
g.Aa=function(){return new rg(0,this,3,new V(null,3,5,W,[zk,bi,pk],null),Hc(this.D))};g.R=function(){return this.H};g.sa=function(){return new Br(this.domain,this.Ab,this.ha,this.H,this.D,this.s)};g.Y=function(){return 3+Q(this.D)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};g.Le=function(){return this.domain};
g.Ua=function(a,b){return ee(new vh(null,new q(null,3,[bi,null,pk,null,zk,null],null),null),b)?Nd.a(pd(If(X,this),this.H),b):new Br(this.domain,this.Ab,this.ha,this.H,Ze(Nd.a(this.D,b)),null)};
g.Ia=function(a,b,c){return t(U.a?U.a(zk,b):U.call(null,zk,b))?new Br(c,this.Ab,this.ha,this.H,this.D,null):t(U.a?U.a(bi,b):U.call(null,bi,b))?new Br(this.domain,c,this.ha,this.H,this.D,null):t(U.a?U.a(pk,b):U.call(null,pk,b))?new Br(this.domain,this.Ab,c,this.H,this.D,null):new Br(this.domain,this.Ab,this.ha,this.H,Ld.h(this.D,b,c),null)};
g.U=function(){return K(Ve.a(new V(null,3,5,W,[new V(null,2,5,W,[zk,this.domain],null),new V(null,2,5,W,[bi,this.Ab],null),new V(null,2,5,W,[pk,this.ha],null)],null),this.D))};g.S=function(a,b){return new Br(this.domain,this.Ab,this.ha,b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};g.call=function(a,b){a=this;var c=S.a(a.ha,a.domain),d=R(c,0),e=R(c,1),f=a.Ab,c=R(f,0),e=(R(f,1)-c)/(e-d),d=c-e*d;return e*(a.ha.g?a.ha.g(b):a.ha.call(null,b))+d};
g.apply=function(a,b){return this.call.apply(this,[this].concat(tb(b)))};g.g=function(a){var b=S.a(this.ha,this.domain),c=R(b,0),d=R(b,1),e=this.Ab,b=R(e,0),d=(R(e,1)-b)/(d-c),c=b-d*c;return d*(this.ha.g?this.ha.g(a):this.ha.call(null,a))+c};
function Cr(a){var b=R(a,0),c=R(a,1);a=(c-b)/20;var d=Math.log(a)/Math.log(10),d=Math.pow(10,Math.floor(d)),c=c+1;a/=d;return t(pe.a?pe.a(5,a):pe.call(null,5,a))?new zh(null,b,c,10*d,null):t(pe.a?pe.a(2,a):pe.call(null,2,a))?new zh(null,b,c,5*d,null):t(pe.a?pe.a(1,a):pe.call(null,1,a))?new zh(null,b,c,2*d,null):new zh(null,b,c,d,null)};var Dr=function Dr(b,c){if(null!=b&&null!=b.ad)return b.ad(b,c);var d=Dr[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Dr._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IProjection.-slowest",b);},Er=function Er(b,c){if(null!=b&&null!=b.$c)return b.$c(b,c);var d=Er[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Er._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("IProjection.-fastest",b);};
function Fr(a,b,c,d,e){this.Ya=a;this.Wa=b;this.H=c;this.D=d;this.s=e;this.v=2229667594;this.K=8192}g=Fr.prototype;g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){switch(b instanceof u?b.Ba:null){case "low":return this.Ya;case "high":return this.Wa;default:return G.h(this.D,b,c)}};
g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#burn.projectors.Middle{",", ","}",c,Ve.a(new V(null,2,5,W,[new V(null,2,5,W,[mk,this.Ya],null),new V(null,2,5,W,[Aj,this.Wa],null)],null),this.D))};g.Aa=function(){return new rg(0,this,2,new V(null,2,5,W,[mk,Aj],null),Hc(this.D))};g.R=function(){return this.H};g.sa=function(){return new Fr(this.Ya,this.Wa,this.H,this.D,this.s)};g.Y=function(){return 2+Q(this.D)};
g.ad=function(a,b){return qr(ur(this.Wa,ie(qe,tr(b))))};g.$c=function(a,b){return qr(ur(this.Ya,ie(pe,tr(b))))};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};g.Ua=function(a,b){return ee(new vh(null,new q(null,2,[Aj,null,mk,null],null),null),b)?Nd.a(pd(If(X,this),this.H),b):new Fr(this.Ya,this.Wa,this.H,Ze(Nd.a(this.D,b)),null)};
g.Ia=function(a,b,c){return t(U.a?U.a(mk,b):U.call(null,mk,b))?new Fr(c,this.Wa,this.H,this.D,null):t(U.a?U.a(Aj,b):U.call(null,Aj,b))?new Fr(this.Ya,c,this.H,this.D,null):new Fr(this.Ya,this.Wa,this.H,Ld.h(this.D,b,c),null)};g.U=function(){return K(Ve.a(new V(null,2,5,W,[new V(null,2,5,W,[mk,this.Ya],null),new V(null,2,5,W,[Aj,this.Wa],null)],null),this.D))};g.S=function(a,b){return new Fr(this.Ya,this.Wa,b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};
function Gr(a,b,c){this.H=a;this.D=b;this.s=c;this.v=2229667594;this.K=8192}g=Gr.prototype;g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){switch(b){default:return G.h(this.D,b,c)}};g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#burn.projectors.Extremes{",", ","}",c,Ve.a(Hd,this.D))};g.Aa=function(){return new rg(0,this,0,Hd,Hc(this.D))};g.R=function(){return this.H};g.sa=function(){return new Gr(this.H,this.D,this.s)};
g.Y=function(){return 0+Q(this.D)};g.ad=function(a,b){return A.a(te,Gf(ye,tr(b)))};g.$c=function(a,b){return A.a(se,Gf(ye,tr(b)))};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};g.Ua=function(a,b){return ee(wh,b)?Nd.a(pd(If(X,this),this.H),b):new Gr(this.H,Ze(Nd.a(this.D,b)),null)};g.Ia=function(a,b,c){return new Gr(this.H,Ld.h(this.D,b,c),null)};g.U=function(){return K(Ve.a(Hd,this.D))};
g.S=function(a,b){return new Gr(b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};function Hr(a,b,c,d,e){this.n=a;this.weight=b;this.H=c;this.D=d;this.s=e;this.v=2229667594;this.K=8192}g=Hr.prototype;g.N=function(a,b){return Lb.h(this,b,null)};g.M=function(a,b,c){switch(b instanceof u?b.Ba:null){case "n":return this.n;case "weight":return this.weight;default:return G.h(this.D,b,c)}};
g.O=function(a,b,c){return bg(b,function(){return function(a){return bg(b,Y,""," ","",c,a)}}(this),"#burn.projectors.WeightedMostRecent{",", ","}",c,Ve.a(new V(null,2,5,W,[new V(null,2,5,W,[Ri,this.n],null),new V(null,2,5,W,[Pj,this.weight],null)],null),this.D))};g.Aa=function(){return new rg(0,this,2,new V(null,2,5,W,[Ri,Pj],null),Hc(this.D))};g.R=function(){return this.H};g.sa=function(){return new Hr(this.n,this.weight,this.H,this.D,this.s)};g.Y=function(){return 2+Q(this.D)};
g.ad=function(a,b){var c;a:{c=Hd;for(var d=b;;)if(N(d))c=Gd.a(c,L(d)),d=N(d);else{c=K(c);break a}}c=qr(tr(c));a:for(var e=this.n+1,d=K(b),e=K(Af(e,b));;)if(e)d=N(d),e=N(e);else break a;d=qr(tr(d));return(1-this.weight)*c+this.weight*d};g.$c=function(a,b){return Dr(this,b)};g.P=function(){var a=this.s;return null!=a?a:this.s=a=De(this)};g.G=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qg(this,b):c:b;return t(c)?!0:!1};
g.Ua=function(a,b){return ee(new vh(null,new q(null,2,[Ri,null,Pj,null],null),null),b)?Nd.a(pd(If(X,this),this.H),b):new Hr(this.n,this.weight,this.H,Ze(Nd.a(this.D,b)),null)};g.Ia=function(a,b,c){return t(U.a?U.a(Ri,b):U.call(null,Ri,b))?new Hr(c,this.weight,this.H,this.D,null):t(U.a?U.a(Pj,b):U.call(null,Pj,b))?new Hr(this.n,c,this.H,this.D,null):new Hr(this.n,this.weight,this.H,Ld.h(this.D,b,c),null)};
g.U=function(){return K(Ve.a(new V(null,2,5,W,[new V(null,2,5,W,[Ri,this.n],null),new V(null,2,5,W,[Pj,this.weight],null)],null),this.D))};g.S=function(a,b){return new Hr(this.n,this.weight,b,this.D,this.s)};g.V=function(a,b){return Vd(b)?Nb(this,B.a(b,0),B.a(b,1)):ub.h(Db,this,b)};var Ir;
a:for(var Jr=H([qk,new q(null,3,[Qi,"Average of All Sprints",Ij,function(a,b){R(b,0);var c=R(b,1);return new V(null,7,5,W,[Hj,X,"Based on our average sprint velocity and current scope of ",new V(null,4,5,W,[Pi,X,a," points"],null),", we will finish on ",new V(null,3,5,W,[Pi,X,c.toLocaleDateString()],null),"."],null)},ri,new Fr(0,0,null,null,null)],null),Wk,new q(null,3,[Qi,"Average of Last 3 Sprints",Ij,function(a,b){R(b,0);var c=R(b,1);return new V(null,7,5,W,[Hj,X,"Based on our average sprint velocity over the last 3 sprints and our current scope of ",
new V(null,4,5,W,[Pi,X,a," points"],null),", we will finish on ",new V(null,3,5,W,[Pi,X,c.toLocaleDateString()],null),"."],null)},ri,new Hr(3,1,null,null,null)],null),ak,new q(null,3,[Qi,"Last Sprint's Velocity",Ij,function(a,b){R(b,0);var c=R(b,1);return new V(null,6,5,W,[Hj,X,"Based on our most recent sprint's velocity and our current scope of ",new V(null,4,5,W,[Pi,X,a," points"],null),", we will finish on ",new V(null,3,5,W,[Pi,X,c.toLocaleDateString()],null)],null)},ri,new Hr(1,1,null,null,null)],
null),qj,new q(null,3,[Qi,"Most Extreme Sprint Velocities",Ij,function(a,b){var c=R(b,0),d=R(b,1);return new V(null,8,5,W,[Hj,X,"Based on our fastest and slowest sprint velocities and our current scope of ",new V(null,4,5,W,[Pi,X,a," points"],null),", we will finish between ",new V(null,3,5,W,[Pi,X,c.toLocaleDateString()],null)," and ",new V(null,3,5,W,[Pi,X,d.toLocaleDateString()],null)],null)},ri,new Gr(null,null,null)],null)],0),Kr=K(Jr),Lr=oh;;)if(Kr)var Mr=N(N(Kr)),Nr=Ld.h(Lr,L(Kr),Ed(Kr)),Kr=
Mr,Lr=Nr;else{Ir=Lr;break a};function Or(a,b,c){return new V(null,4,5,W,[Kj,X,new V(null,4,5,W,[Kj,X,new V(null,2,5,W,[Nj,new q(null,2,[Yj,"axis",Ek,b.g?b.g(0):b.call(null,0)],null)],null),function(){var c=S.a(sr,Ar(a)),e=R(c,0),f=R(c,1),h=(f-e)/6048E5,k=6048E5*Math.ceil(h/13);return function(c,d,e,f,h,k){return function E(F){return new Le(null,function(){return function(){for(;;){var c=K(F);if(c){if(Yd(c)){var d=Bc(c),e=Q(d),f=Pe(e);a:for(var h=0;;)if(h<e){var k=B.a(d,h),k=rr(k),k=new V(null,3,5,W,[$k,new q(null,3,[vi,wr(a.g?
a.g(k):a.call(null,k),b.g?b.g(0):b.call(null,0)),dj,25,ei,"middle"],null),k.toLocaleDateString()],null);f.add(k);h+=1}else{d=!0;break a}return d?Qe(f.ua(),E(Cc(c))):Qe(f.ua(),null)}f=L(c);f=rr(f);return P(new V(null,3,5,W,[$k,new q(null,3,[vi,wr(a.g?a.g(f):a.call(null,f),b.g?b.g(0):b.call(null,0)),dj,25,ei,"middle"],null),f.toLocaleDateString()],null),E(cd(c)))}return null}}}(c,d,e,f,h,k),null,null)}}(c,e,f,6048E5,h,k)(new zh(null,e,f,k,null))}()],null),new V(null,4,5,W,[Kj,X,new V(null,2,5,W,[Nj,
new q(null,3,[Yj,"axis",vi,wr(0,b.g?b.g(0):b.call(null,0)),Qk,a.g?a.g(c):a.call(null,c)],null)],null),function(){var a=Ar(b),c=R(a,0),f=R(a,1);return function(a,c,d){return function n(e){return new Le(null,function(){return function(){for(;;){var a=K(e);if(a){if(Yd(a)){var c=Bc(a),d=Q(c),f=Pe(d);a:for(var h=0;;)if(h<d){var k=B.a(c,h),k=new V(null,3,5,W,[$k,new q(null,4,[vi,wr(0,b.g?b.g(k):b.call(null,k)),wi,-13,dj,6,ei,"end"],null),k],null);f.add(k);h+=1}else{c=!0;break a}return c?Qe(f.ua(),n(Cc(a))):
Qe(f.ua(),null)}f=L(a);return P(new V(null,3,5,W,[$k,new q(null,4,[vi,wr(0,b.g?b.g(f):b.call(null,f)),wi,-13,dj,6,ei,"end"],null),f],null),n(cd(a)))}return null}}}(a,c,d),null,null)}}(a,c,f)(Cr(new V(null,2,5,W,[c,f],null)))}()],null)],null)}
function Pr(a,b,c,d){c=Ve.a(function(){return function f(c){return new Le(null,function(){for(;;){var d=K(c);if(d){if(Yd(d)){var l=Bc(d),m=Q(l),n=Pe(m);a:for(var r=0;;)if(r<m){var v=B.a(l,r),y=R(v,0);R(v,1);v=R(v,2);y=new V(null,2,5,W,[a.g?a.g(y):a.call(null,y),b.g?b.g(v):b.call(null,v)],null);n.add(y);r+=1}else{l=!0;break a}return l?Qe(n.ua(),f(Cc(d))):Qe(n.ua(),null)}l=L(d);n=R(l,0);R(l,1);l=R(l,2);return P(new V(null,2,5,W,[a.g?a.g(n):a.call(null,n),b.g?b.g(l):b.call(null,l)],null),f(cd(d)))}return null}},
null,null)}(d)}(),new V(null,1,5,W,[new V(null,2,5,W,[a.g?a.g(c):a.call(null,c),function(){var a=xr(Fd(d));return b.g?b.g(a):b.call(null,a)}()],null)],null));return new V(null,2,5,W,[gi,new q(null,3,[Yj,"scope",ok,vr(c),Ej,"url(#interior)"],null)],null)}function Qr(a){return Ah(function(a,c){return Lf(c,1,function(c){var e=G.a(a,1);return oe.a?oe.a(e,c):oe.call(null,e,c)})},a)}
function Rr(a,b,c){return new V(null,2,5,W,[gi,new q(null,4,[Yj,"progress",ok,vr(function(){return function e(c){return new Le(null,function(){for(;;){var h=K(c);if(h){if(Yd(h)){var k=Bc(h),l=Q(k),m=Pe(l);a:for(var n=0;;)if(n<l){var r=B.a(k,n),v=R(r,0),r=R(r,1),v=new V(null,2,5,W,[a.g?a.g(v):a.call(null,v),b.g?b.g(r):b.call(null,r)],null);m.add(v);n+=1}else{k=!0;break a}return k?Qe(m.ua(),e(Cc(h))):Qe(m.ua(),null)}k=L(h);m=R(k,0);k=R(k,1);return P(new V(null,2,5,W,[a.g?a.g(m):a.call(null,m),b.g?b.g(k):
b.call(null,k)],null),e(cd(h)))}return null}},null,null)}(Qr(c))}()),Gj,"round",Ej,"url(#interior)"],null)],null)}
function Sr(a,b,c,d){return new V(null,4,5,W,[Kj,X,new V(null,2,5,W,[Nj,new q(null,6,[Yj,"projection",vk,function(){var b=L.g?L.g(d):L.call(null,d);return a.g?a.g(b):a.call(null,b)}(),Zi,function(){var a=Ed.g?Ed.g(d):Ed.call(null,d);return b.g?b.g(a):b.call(null,a)}(),Qk,a.g?a.g(c):a.call(null,c),Ek,function(){var a=xr(d);return b.g?b.g(a):b.call(null,a)}(),Ej,"url(#interior)"],null)],null),new V(null,3,5,W,[$k,new q(null,3,[vi,wr(a.g?a.g(c):a.call(null,c),function(){var a=xr(d);return b.g?b.g(a):
b.call(null,a)}()),ei,"middle",dj,-5],null),c.toLocaleDateString()],null)],null)}function Tr(a,b,c){var d=function(){var a=Fd(c);return L.g?L.g(a):L.call(null,a)}();if(0<a){var e=Dr(b,c);b=Er(b,c);var f=function(a,b,c){return function(a){var b=new Date;b.setTime(sr(c)+864E5*a);return b}}(e,b,d);return new V(null,2,5,W,[f(a/b),0<e?f(a/e):0<b?f(a/b):d],null)}return new V(null,2,5,W,[d,d],null)}
function Ur(a,b,c){var d=R(a,0);a=R(a,1);var e=jf.a(sr,L),f;c=je(e,c);var h=L(c),e=R(h,0);f=R(h,1);h=R(h,2);if(0===f)f=c;else{f=Ed(c);f=R(f,0);var k=new Date;k.setTime(sr(e)-864E5*Math.round((sr(f)-sr(e))/864E5));f=Ve.a(new V(null,1,5,W,[new V(null,3,5,W,[k,0,h],null)],null),c)}var k=Fd(Qr(f)),l=xr(k)-(Ed.g?Ed.g(k):Ed.call(null,k));c=Tr(l,b.g?b.g(ri):b.call(null,ri),f);var m=R(c,0);c=R(c,1);e=W;h=L(f);h=L.g?L.g(h):L.call(null,h);e=new Br(new V(null,2,5,e,[h,c],null),new V(null,2,5,W,[0,d-100],null),
sr,null,null,null);h=new V(null,2,5,W,[0,A.a(se,S.a(xr,f))],null);h=new Br(h,new V(null,2,5,W,[a-65,0],null),me,null,null,null);b=Db(M,new V(null,3,5,W,[Kj,new q(null,1,[vi,wr(d-50-300,a-150)],null),new V(null,3,5,W,[Zk,new q(null,3,[aj,300,Xk,150,Vk,"'PT Sans', Arial, sans-serif"],null),(b.g?b.g(Ij):b.call(null,Ij)).call(null,xr(k),new V(null,2,5,W,[m,c],null))],null)],null));var k=W,n=new q(null,1,[vi,wr(50,25)],null),r=Pr(e,h,c,f),v=Rr(e,h,f);if(0<l){var y=new V(null,2,5,W,[e,h],null),m=new V(null,
2,5,W,[m,c],null),l=f;f=R(y,0);var y=R(y,1),C=R(m,0),m=R(m,1),l=Fd(Qr(l));f=Db(Db(M,Sr(f,y,m,l)),Sr(f,y,C,l))}else f=null;return Db(Db(Db(b,new V(null,6,5,k,[Kj,n,r,v,f,Or(e,h,c)],null)),new V(null,2,5,W,[Mk,new q(null,3,[aj,d,Xk,a,Ti,"white"],null)],null)),new V(null,3,5,W,[dk,X,new V(null,3,5,W,[ej,new q(null,1,[Xj,"interior"],null),new V(null,2,5,W,[Mk,new q(null,4,[ci,-25,aj,d-50,Xk,a-65+25,Ui,"userSpaceOnUse"],null)],null)],null)],null))}
function Vr(a){var b=R(a,0);a=R(a,1);return new V(null,2,5,W,[Mk,Md([ci,ii,oi,qi,Ti,aj,Oj,uk,Sk,Xk],[10,"10 10",20,"gray","none",b-20,3,10,20,a-20])],null)}function Wr(a){return function(b){b.stopPropagation();b.preventDefault();b.dataTransfer.dropEffect="copy";return a.o?a.o():a.call(null)}}function Xr(a){return function(b){b.stopPropagation();b.preventDefault();return a.o?a.o():a.call(null)}}
function Yr(a){return function(b){b.stopPropagation();b.preventDefault();b=b.dataTransfer.files[0];var c=new FileReader;c.onload=function(){return function(b){b=b.target.result;return a.g?a.g(b):a.call(null,b)}}(b,c);return c.readAsText(b)}}
function Zr(a){var b=$r,c=null!=a&&(a.v&64||a.na)?A.a(nd,a):a,d=G.a(c,hj),e=G.a(c,Vj),f=G.a(c,sk),h=e.trim(),k=Ir.g?Ir.g(d):Ir.call(null,d);return new V(null,5,5,W,[Fk,X,new V(null,3,5,W,[Dk,X,"Burn Chart"],null),new V(null,4,5,W,[Hj,new q(null,1,[tj,"align-middles spread spaced"],null),new V(null,3,5,W,[Hj,new q(null,1,[tj,"horizontal"],null),function(){return function(a,c,d,e,f,h,k){return function F(I){return new Le(null,function(a,c,d,e,f,h,k){return function(){for(;;){var l=K(I);if(l){var m=
l;if(Yd(m)){var n=Bc(m),r=Q(n),v=Pe(r);return function(){for(var y=0;;)if(y<r){var F=B.a(n,y),C=R(F,0),I=R(F,1);Re(v,new V(null,4,5,W,[Wj,new q(null,1,[tj,"label--radio"],null),new V(null,2,5,W,[Ak,new q(null,3,[jj,"radio",ck,Rc.a(C,f),cj,function(a,c,d){return function(){var a=new V(null,2,5,W,[Ci,d],null);return b.g?b.g(a):b.call(null,a)}}(y,F,C,I,n,r,v,m,l,a,c,d,e,f,h,k)],null)],null),new V(null,3,5,W,[Cj,X,I.g?I.g(Qi):I.call(null,Qi)],null)],null));y+=1}else return!0}()?Qe(v.ua(),F(Cc(m))):Qe(v.ua(),
null)}var y=L(m),C=R(y,0),za=R(y,1);return P(new V(null,4,5,W,[Wj,new q(null,1,[tj,"label--radio"],null),new V(null,2,5,W,[Ak,new q(null,3,[jj,"radio",ck,Rc.a(C,f),cj,function(a,c){return function(){var a=new V(null,2,5,W,[Ci,c],null);return b.g?b.g(a):b.call(null,a)}}(y,C,za,m,l,a,c,d,e,f,h,k)],null)],null),new V(null,3,5,W,[Cj,X,za.g?za.g(Qi):za.call(null,Qi)],null)],null),F(cd(m)))}return null}}}(a,c,d,e,f,h,k),null,null)}}(h,k,a,c,d,e,f)(Ir)}()],null),new V(null,4,5,W,[Hj,new q(null,1,[tj,""],
null),new V(null,3,5,W,[Ji,new q(null,1,[cj,function(){return function(){return b.g?b.g(Yk):b.call(null,Yk)}}(h,k,a,c,d,e,f)],null),"Clear"],null),new V(null,3,5,W,[Ji,new q(null,1,[cj,function(){return function(){var a=document.getElementById("visualization"),b=Uh(new q(null,1,[Ii,4],null));return saveSvgAsPng(a,"burn-chart",b)}}(h,k,a,c,d,e,f)],null),"Download"],null)],null)],null),function(){var l=new V(null,2,5,W,[960,500],null),m=R(l,0),n=R(l,1),r=zr(h);return new V(null,4,5,W,[hk,new q(null,
7,[aj,m,Xk,n,Xj,"visualization",Yj,"bordered",sj,Wr(function(a,c,d,e,f,h,k,l,m,n,r){return function(){if(t(r))return null;var a=new V(null,2,5,W,[zj,!0],null);return b.g?b.g(a):b.call(null,a)}}(l,m,n,r,h,k,a,c,d,e,f)),nk,Xr(function(a,c,d,e,f,h,k,l,m,n,r){return function(){if(t(r)){var a=new V(null,2,5,W,[zj,!1],null);return b.g?b.g(a):b.call(null,a)}return null}}(l,m,n,r,h,k,a,c,d,e,f)),Vi,Yr(function(){return function(a){a=new V(null,2,5,W,[lj,a],null);return b.g?b.g(a):b.call(null,a)}}(l,m,n,r,
h,k,a,c,d,e,f))],null),t(f)?Vr(new V(null,2,5,W,[m,n],null)):null,K(r)?Ur(new V(null,2,5,W,[m,n],null),k,r):new V(null,3,5,W,[Zk,new q(null,5,[uk,m/2-312.5,ci,n/2-87.5,aj,625,Xk,175,Gi,24],null),new V(null,4,5,W,[Hj,new q(null,1,[Dj,new q(null,1,[yi,"dimgray"],null)],null),"Drag and drop a CSV file with 3 fields per row:",new V(null,5,5,W,[xi,X,new V(null,3,5,W,[Si,X,"Date a sprint was completed, in the format YYYY-MM-DD"],null),new V(null,3,5,W,[Si,X,"Number of points completed in the sprint"],null),
new V(null,3,5,W,[Si,X,"Total number of points in the project"],null)],null)],null)],null)],null)}()],null)};var as=null,bs=null,cs=vm||wm||sm||"function"==typeof ba.atob;function ds(){if(!as){as={};bs={};for(var a=0;65>a;a++)as[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a),bs[as[a]]=a,62<=a&&(bs["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)]=a)}};var es=function es(b){if(null!=b&&null!=b.qe)return b.qe();var c=es[p(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=es._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw x("PushbackReader.read-char",b);},fs=function fs(b,c){if(null!=b&&null!=b.re)return b.re(0,c);var d=fs[p(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fs._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw x("PushbackReader.unread",b);};
function gs(a,b,c){this.T=a;this.buffer=b;this.fa=c}gs.prototype.qe=function(){return 0===this.buffer.length?(this.fa+=1,this.T[this.fa]):this.buffer.pop()};gs.prototype.re=function(a,b){return this.buffer.push(b)};function hs(a){var b=!/[^\t\n\r ]/.test(a);return t(b)?b:","===a}is;js;ks;function ls(a){throw Error(A.a(z,a));}
function ms(a,b){for(var c=new Ga(b),d=es(a);;){var e;if(!(e=null==d||hs(d))){e=d;var f="#"!==e;e=f?(f="'"!==e)?(f=":"!==e)?js.g?js.g(e):js.call(null,e):f:f:f}if(e)return fs(a,d),c.toString();c.append(d);d=es(a)}}function ns(a){for(;;){var b=es(a);if("\n"===b||"\r"===b||null==b)return a}}var os=Fh("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),ps=Fh("^([-+]?[0-9]+)/([0-9]+)$"),qs=Fh("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),rs=Fh("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function ss(a,b){var c=a.exec(b);return null!=c&&c[0]===b?1===c.length?c[0]:c:null}var ts=Fh("^[0-9A-Fa-f]{2}$"),us=Fh("^[0-9A-Fa-f]{4}$");function vs(a,b,c){return t(Dh(a,c))?c:ls(H(["Unexpected unicode escape \\",b,c],0))}function ws(a){return String.fromCharCode(parseInt(a,16))}
function xs(a){var b=es(a),c="t"===b?"\t":"r"===b?"\r":"n"===b?"\n":"\\"===b?"\\":'"'===b?'"':"b"===b?"\b":"f"===b?"\f":null;t(c)?b=c:"x"===b?(a=(new Ga(es(a),es(a))).toString(),b=ws(vs(ts,b,a))):"u"===b?(a=(new Ga(es(a),es(a),es(a),es(a))).toString(),b=ws(vs(us,b,a))):b=/[^0-9]/.test(b)?ls(H(["Unexpected unicode escape \\",b],0)):String.fromCharCode(b);return b}
function ys(a,b){for(var c=tc(Hd);;){var d;a:{d=hs;for(var e=b,f=es(e);;)if(t(d.g?d.g(f):d.call(null,f)))f=es(e);else{d=f;break a}}t(d)||ls(H(["EOF while reading"],0));if(a===d)return vc(c);e=js.g?js.g(d):js.call(null,d);t(e)?d=e.a?e.a(b,d):e.call(null,b,d):(fs(b,d),d=is.J?is.J(b,!0,null,!0):is.call(null,b,!0,null));c=d===b?c:Xe.a(c,d)}}function zs(a,b){return ls(H(["Reader for ",b," not implemented yet"],0))}As;
function Bs(a,b){var c=es(a),d=ks.g?ks.g(c):ks.call(null,c);if(t(d))return d.a?d.a(a,b):d.call(null,a,b);d=As.a?As.a(a,c):As.call(null,a,c);return t(d)?d:ls(H(["No dispatch macro for ",c],0))}function Cs(a,b){return ls(H(["Unmatched delimiter ",b],0))}function Ds(a){return A.a(Pc,ys(")",a))}function Es(a){return ys("]",a)}
function Fs(a){a=ys("}",a);var b=Q(a);if("number"!==typeof b||isNaN(b)||Infinity===b||parseFloat(b)!==parseInt(b,10))throw Error([z("Argument must be an integer: "),z(b)].join(""));0!==(b&1)&&ls(H(["Map literal must contain an even number of forms"],0));return A.a(nd,a)}function Gs(a){for(var b=new Ga,c=es(a);;){if(null==c)return ls(H(["EOF while reading"],0));if("\\"===c)b.append(xs(a));else{if('"'===c)return b.toString();b.append(c)}c=es(a)}}
function Hs(a){for(var b=new Ga,c=es(a);;){if(null==c)return ls(H(["EOF while reading"],0));if("\\"===c){b.append(c);var d=es(a);if(null==d)return ls(H(["EOF while reading"],0));var e=function(){var a=b;a.append(d);return a}(),f=es(a)}else{if('"'===c)return b.toString();e=function(){var a=b;a.append(c);return a}();f=es(a)}b=e;c=f}}
function Is(a,b){var c=ms(a,b),d=-1!=c.indexOf("/");t(t(d)?1!==c.length:d)?c=$c.a(c.substring(0,c.indexOf("/")),c.substring(c.indexOf("/")+1,c.length)):(d=$c.g(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?fk:d);return c}
function Js(a,b){var c=ms(a,b),d=c.substring(1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?ws(d.substring(1)):"o"===d.charAt(0)?zs(0,c):ls(H(["Unknown character literal: ",c],0))}
function Ks(a){a=ms(a,es(a));var b=ss(rs,a);a=b[0];var c=b[1],b=b[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===b[b.length-1]||-1!==a.indexOf("::",1)?ls(H(["Invalid token: ",a],0)):null!=c&&0<c.length?Ke.a(c.substring(0,c.indexOf("/")),b):Ke.g(a)}function Ls(a){return function(b){return Db(Db(M,is.J?is.J(b,!0,null,!0):is.call(null,b,!0,null)),a)}}function Ms(){return function(){return ls(H(["Unreadable form"],0))}}
function Ns(a){var b;b=is.J?is.J(a,!0,null,!0):is.call(null,a,!0,null);b=b instanceof Qc?new q(null,1,[xk,b],null):"string"===typeof b?new q(null,1,[xk,b],null):b instanceof u?Eg([b,!0],!0,!1):b;Ud(b)||ls(H(["Metadata must be Symbol,Keyword,String or Map"],0));a=is.J?is.J(a,!0,null,!0):is.call(null,a,!0,null);return(null!=a?a.v&262144||a.Ef||(a.v?0:w(cc,a)):w(cc,a))?pd(a,sh.A(H([Qd(a),b],0))):ls(H(["Metadata can only be applied to IWithMetas"],0))}
function Os(a){a:if(a=ys("}",a),a=K(a),null==a)a=wh;else if(a instanceof J&&0===a.F){a=a.l;b:for(var b=0,c=tc(wh);;)if(b<a.length)var d=b+1,c=c.$b(null,a[b]),b=d;else break b;a=c.sc(null)}else for(d=tc(wh);;)if(null!=a)b=N(a),d=d.$b(null,a.qa(null)),a=b;else{a=vc(d);break a}return a}function Ps(a){return Fh(Hs(a))}function Qs(a){is.J?is.J(a,!0,null,!0):is.call(null,a,!0,null);return a}
function js(a){return'"'===a?Gs:":"===a?Ks:";"===a?ns:"'"===a?Ls(cf):"@"===a?Ls(Pk):"^"===a?Ns:"`"===a?zs:"~"===a?zs:"("===a?Ds:")"===a?Cs:"["===a?Es:"]"===a?Cs:"{"===a?Fs:"}"===a?Cs:"\\"===a?Js:"#"===a?Bs:null}function ks(a){return"{"===a?Os:"\x3c"===a?Ms():'"'===a?Ps:"!"===a?ns:"_"===a?Qs:null}
function is(a,b,c){for(;;){var d=es(a);if(null==d)return t(b)?ls(H(["EOF while reading"],0)):c;if(!hs(d))if(";"===d)a=ns.a?ns.a(a,d):ns.call(null,a);else{var e=js(d);if(t(e))e=e.a?e.a(a,d):e.call(null,a,d);else{var e=a,f=void 0;!(f=!/[^0-9]/.test(d))&&(f=void 0,f="+"===d||"-"===d)&&(f=es(e),fs(e,f),f=!/[^0-9]/.test(f));if(f)a:for(e=a,d=new Ga(d),f=es(e);;){var h;h=null==f;h||(h=(h=hs(f))?h:js.g?js.g(f):js.call(null,f));if(t(h)){fs(e,f);d=e=d.toString();f=void 0;t(ss(os,d))?(d=ss(os,d),f=d[2],null!=
(Rc.a(f,"")?null:f)?f=0:(f=t(d[3])?[d[3],10]:t(d[4])?[d[4],16]:t(d[5])?[d[5],8]:t(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=f[0],null==h?f=null:(f=parseInt(h,f[1]),f="-"===d[1]?-f:f))):(f=void 0,t(ss(ps,d))?(d=ss(ps,d),f=parseInt(d[1],10)/parseInt(d[2],10)):f=t(ss(qs,d))?parseFloat(d):null);d=f;e=t(d)?d:ls(H(["Invalid number format [",e,"]"],0));break a}d.append(f);f=es(e)}else e=Is(a,d)}if(e!==a)return e}}}
var Rs=function(a,b){return function(c,d){return G.a(t(d)?b:a,c)}}(new V(null,13,5,W,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new V(null,13,5,W,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),Ss=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function Ts(a){a=parseInt(a,10);return ob(isNaN(a))?a:null}
function Us(a,b,c,d){a<=b&&b<=c||ls(H([[z(d),z(" Failed:  "),z(a),z("\x3c\x3d"),z(b),z("\x3c\x3d"),z(c)].join("")],0));return b}
function Vs(a){var b=Dh(Ss,a);R(b,0);var c=R(b,1),d=R(b,2),e=R(b,3),f=R(b,4),h=R(b,5),k=R(b,6),l=R(b,7),m=R(b,8),n=R(b,9),r=R(b,10);if(ob(b))return ls(H([[z("Unrecognized date/time syntax: "),z(a)].join("")],0));var v=Ts(c),y=function(){var a=Ts(d);return t(a)?a:1}();a=function(){var a=Ts(e);return t(a)?a:1}();var b=function(){var a=Ts(f);return t(a)?a:0}(),c=function(){var a=Ts(h);return t(a)?a:0}(),C=function(){var a=Ts(k);return t(a)?a:0}(),E=function(){var a;a:if(Rc.a(3,Q(l)))a=l;else if(3<Q(l))a=
l.substring(0,3);else for(a=new Ga(l);;)if(3>a.Ob.length)a=a.append("0");else{a=a.toString();break a}a=Ts(a);return t(a)?a:0}(),m=(Rc.a(m,"-")?-1:1)*(60*function(){var a=Ts(n);return t(a)?a:0}()+function(){var a=Ts(r);return t(a)?a:0}());return new V(null,8,5,W,[v,Us(1,y,12,"timestamp month field must be in range 1..12"),Us(1,a,function(){var a;a=0===ue(v,4);t(a)&&(a=ob(0===ue(v,100)),a=t(a)?a:0===ue(v,400));return Rs.a?Rs.a(y,a):Rs.call(null,y,a)}(),"timestamp day field must be in range 1..last day in month"),
Us(0,b,23,"timestamp hour field must be in range 0..23"),Us(0,c,59,"timestamp minute field must be in range 0..59"),Us(0,C,Rc.a(c,59)?60:59,"timestamp second field must be in range 0..60"),Us(0,E,999,"timestamp millisecond field must be in range 0..999"),m],null)}
var Ws,Xs=new q(null,4,["inst",function(a){var b;if("string"===typeof a)if(b=Vs(a),t(b)){a=R(b,0);var c=R(b,1),d=R(b,2),e=R(b,3),f=R(b,4),h=R(b,5),k=R(b,6);b=R(b,7);b=new Date(Date.UTC(a,c-1,d,e,f,h,k)-6E4*b)}else b=ls(H([[z("Unrecognized date/time syntax: "),z(a)].join("")],0));else b=ls(H(["Instance literal expects a string for its timestamp."],0));return b},"uuid",function(a){return"string"===typeof a?new $h(a,null):ls(H(["UUID literal expects a string as its representation."],0))},"queue",function(a){return Vd(a)?
If(ng,a):ls(H(["Queue literal expects a vector for its elements."],0))},"js",function(a){if(Vd(a)){var b=[];a=K(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e);b.push(f);e+=1}else if(a=K(a))c=a,Yd(c)?(a=Bc(c),e=Cc(c),c=a,d=Q(a),a=e):(a=L(c),b.push(a),a=N(c),c=null,d=0),e=0;else break;return b}if(Ud(a)){b={};a=K(a);c=null;for(e=d=0;;)if(e<d){var h=c.ca(null,e),f=R(h,0),h=R(h,1);b[Ae(f)]=h;e+=1}else if(a=K(a))Yd(a)?(d=Bc(a),a=Cc(a),c=d,d=Q(d)):(d=L(a),c=R(d,0),d=R(d,1),b[Ae(c)]=d,a=N(a),c=null,
d=0),e=0;else break;return b}return ls(H([[z("JS literal expects a vector or map containing "),z("only string or unqualified keyword keys")].join("")],0))}],null);Ws=pf.g?pf.g(Xs):pf.call(null,Xs);var Ys=pf.g?pf.g(null):pf.call(null,null);
function As(a,b){var c=Is(a,b),d=G.a(O.g?O.g(Ws):O.call(null,Ws),""+z(c)),e=O.g?O.g(Ys):O.call(null,Ys);return t(d)?(c=is(a,!0,null),d.g?d.g(c):d.call(null,c)):t(e)?(d=is(a,!0,null),e.a?e.a(c,d):e.call(null,c,d)):ls(H(["Could not find tag parser for ",""+z(c)," in ",rf.A(H([zg(O.g?O.g(Ws):O.call(null,Ws))],0))],0))};var Zs=Error();Ya=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,kb.g?kb.g(a):kb.call(null,a))}a.I=0;a.L=function(a){a=K(a);return b(a)};a.A=b;return a}();
Za=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new J(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,kb.g?kb.g(a):kb.call(null,a))}a.I=0;a.L=function(a){a=K(a);return b(a)};a.A=b;return a}();
function $s(a){window.location.hash=[z("/"),z(function(){var b=rf.A(H([a],0)),c;if(cs)c=ba.btoa(b);else{c=[];for(var d=0,e=0;e<b.length;e++){for(var f=b.charCodeAt(e);255<f;)c[d++]=f&255,f>>=8;c[d++]=f}if(!fa(c))throw Error("encodeByteArray takes an array as a parameter");ds();b=as;d=[];for(e=0;e<c.length;e+=3){var h=c[e],k=(f=e+1<c.length)?c[e+1]:0,l=e+2<c.length,m=l?c[e+2]:0,n=h>>2,h=(h&3)<<4|k>>4,k=(k&15)<<2|m>>6,m=m&63;l||(m=64,f||(k=64));d.push(b[n],b[h],b[k],b[m])}c=d.join("")}return c}())].join("");
return a}var om=new q(null,3,[Vj,"",hj,Wk,sk,!1],null),nm;
try{var at,bt;var ct=window.location.hash,dt=/^#\//;if("string"===typeof dt)bt=ct.replace(new RegExp(String(dt).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(dt instanceof RegExp)bt=ct.replace(new RegExp(dt.source,"g"),"");else throw[z("Invalid match arg: "),z(dt)].join("");var et=bt,ft;if(cs)ft=ba.atob(et);else{ds();for(var gt=bs,ht=[],it=0;it<et.length;){var jt=gt[et.charAt(it++)],kt=it<et.length?gt[et.charAt(it)]:0;++it;var lt=it<et.length?gt[et.charAt(it)]:
64;++it;var mt=it<et.length?gt[et.charAt(it)]:64;++it;if(null==jt||null==kt||null==lt||null==mt)throw Error();ht.push(jt<<2|kt>>4);64!=lt&&(ht.push(kt<<4&240|lt>>2),64!=mt&&ht.push(lt<<6&192|mt))}if(8192>=ht.length)ft=String.fromCharCode.apply(null,ht);else{for(var nt="",ot=0;ot<ht.length;ot+=8192)nt+=String.fromCharCode.apply(null,Ra(ht,ot,ot+8192));ft=nt}}at=ft;if("string"!==typeof at)throw Error("Cannot read from non-string object.");nm=is(new gs(at,[],-1),!1,null)}catch(pt){if(pt instanceof Exception)nm=
null;else throw pt;}$r;
function qt(a,b){try{if(U(b,uj))return a;throw Zs;}catch(c){if(c instanceof Error)if(c===Zs)try{if(U(b,Yk))return $s(om);throw Zs;}catch(d){if(d instanceof Error)if(d===Zs)try{if(Vd(b)&&2===Q(b))try{var e=Jd(b,0);if(U(e,zj)){var f=Jd(b,1);return Ld.h(a,sk,f)}throw Zs;}catch(h){if(h instanceof Error)if(f=h,f===Zs)try{e=Jd(b,0);if(U(e,lj)){var k=Jd(b,1);return $s(Ld.h(a,Vj,k))}throw Zs;}catch(l){if(l instanceof Error)if(l===Zs)try{e=Jd(b,0);if(U(e,Ci))return k=Jd(b,1),$s(Ld.h(a,hj,k));throw Zs;}catch(m){if(m instanceof
Error)if(m===Zs)try{e=Jd(b,0);if(U(e,fi)){var n=Jd(b,1);pr(n,H([new q(null,1,[Lk,function(){return function(a){a=new V(null,2,5,W,[lj,a],null);return $r.g?$r.g(a):$r.call(null,a)}}(n,e,m,l,f,d,c)],null)],0));return Ld.h(a,Lj,n)}throw Zs;}catch(r){if(r instanceof Error&&r===Zs)throw Zs;throw r;}else throw m;else throw m;}else throw l;else throw l;}else throw f;else throw h;}else throw Zs;}catch(v){if(v instanceof Error){f=v;if(f===Zs)throw Error([z("No matching clause: "),z(b)].join(""));throw f;}throw v;
}else throw d;else throw d;}else throw c;else throw c;}}if("undefined"===typeof pm)var pm=Yl(null);function $r(a){return am(pm,a)}if("undefined"===typeof cm)var cm=mm(new ad(function(){return qt},ki,Md([Oi,Qi,Yi,$i,wj,Nj,lk,bf,Kk,Tk],[Ik,pi,"/Users/exupero/code/burn/src/burn/core.cljs",11,1,36,36,Pc(new V(null,2,5,W,[Ei,bl],null)),null,t(qt)?qt.Ff:null])));if("undefined"===typeof rt){var rm;rm=bm(function(a){return Zr(a)});var rt;rt=qm()};