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

var g,aa=this;
function n(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
b&&"undefined"==typeof a.call)return"object";return b}var ba="closure_uid_"+(1E9*Math.random()>>>0),ca=0;function da(a,b,c){return a.call.apply(a.bind,arguments)}function ea(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function fa(a,b,c){fa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?da:ea;return fa.apply(null,arguments)};function ha(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ia(a,b){null!=a&&this.append.apply(this,arguments)}g=ia.prototype;g.Za="";g.set=function(a){this.Za=""+a};g.append=function(a,b,c){this.Za+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Za+=arguments[d];return this};g.clear=function(){this.Za=""};g.toString=function(){return this.Za};function ja(a,b){a.sort(b||ka)}function la(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||ka;ja(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function ka(a,b){return a>b?1:a<b?-1:0};var ma;if("undefined"===typeof na)var na=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof oa)var oa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var pa=null;if("undefined"===typeof qa)var qa=null;function ra(){return new q(null,5,[sa,!0,ta,!0,ua,!1,va,!1,wa,null],null)}ya;function t(a){return null!=a&&!1!==a}Aa;v;function Ba(a){return null==a}function Ca(a){return a instanceof Array}
function Da(a){return null==a?!0:!1===a?!0:!1}function w(a,b){return a[n(null==b?null:b)]?!0:a._?!0:!1}function x(a,b){var c=null==b?null:b.constructor,c=t(t(c)?c.yb:c)?c.eb:n(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ea(a){var b=a.eb;return t(b)?b:""+y(a)}var Ga="undefined"!==typeof Symbol&&"function"===n(Symbol)?Symbol.iterator:"@@iterator";function Ha(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}B;Ia;
var ya=function ya(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ya.a(arguments[0]);case 2:return ya.b(arguments[0],arguments[1]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};ya.a=function(a){return ya.b(null,a)};ya.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ia.c?Ia.c(c,d,b):Ia.call(null,c,d,b)};ya.u=2;function La(){}
var Ma=function Ma(b){if(null!=b&&null!=b.V)return b.V(b);var c=Ma[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ma._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("ICounted.-count",b);},Na=function Na(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=Na[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Na._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IEmptyableCollection.-empty",b);};function Oa(){}
var Pa=function Pa(b,c){if(null!=b&&null!=b.T)return b.T(b,c);var d=Pa[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Pa._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("ICollection.-conj",b);};function Ra(){}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.b(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};
C.b=function(a,b){if(null!=a&&null!=a.X)return a.X(a,b);var c=C[n(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=C._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw x("IIndexed.-nth",a);};C.c=function(a,b,c){if(null!=a&&null!=a.la)return a.la(a,b,c);var d=C[n(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=C._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw x("IIndexed.-nth",a);};C.u=3;function Ta(){}
var Ua=function Ua(b){if(null!=b&&null!=b.aa)return b.aa(b);var c=Ua[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ua._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("ISeq.-first",b);},Va=function Va(b){if(null!=b&&null!=b.ea)return b.ea(b);var c=Va[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Va._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("ISeq.-rest",b);};function Wa(){}function Xa(){}
var Za=function Za(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Za.b(arguments[0],arguments[1]);case 3:return Za.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};
Za.b=function(a,b){if(null!=a&&null!=a.K)return a.K(a,b);var c=Za[n(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Za._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw x("ILookup.-lookup",a);};Za.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=Za[n(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Za._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw x("ILookup.-lookup",a);};Za.u=3;
var $a=function $a(b,c){if(null!=b&&null!=b.Ob)return b.Ob(b,c);var d=$a[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=$a._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IAssociative.-contains-key?",b);},ab=function ab(b,c,d){if(null!=b&&null!=b.Fa)return b.Fa(b,c,d);var e=ab[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ab._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("IAssociative.-assoc",b);};function cb(){}
var db=function db(b,c){if(null!=b&&null!=b.sb)return b.sb(b,c);var d=db[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=db._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IMap.-dissoc",b);};function eb(){}
var fb=function fb(b){if(null!=b&&null!=b.tb)return b.tb(b);var c=fb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=fb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IMapEntry.-key",b);},gb=function gb(b){if(null!=b&&null!=b.ub)return b.ub(b);var c=gb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IMapEntry.-val",b);};function hb(){}
var ib=function ib(b){if(null!=b&&null!=b.ab)return b.ab(b);var c=ib[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ib._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IStack.-peek",b);},jb=function jb(b){if(null!=b&&null!=b.bb)return b.bb(b);var c=jb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=jb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IStack.-pop",b);};function kb(){}
var mb=function mb(b,c,d){if(null!=b&&null!=b.cb)return b.cb(b,c,d);var e=mb[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=mb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("IVector.-assoc-n",b);},nb=function nb(b){if(null!=b&&null!=b.rb)return b.rb(b);var c=nb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IDeref.-deref",b);};function ob(){}
var pb=function pb(b){if(null!=b&&null!=b.M)return b.M(b);var c=pb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IMeta.-meta",b);},qb=function qb(b,c){if(null!=b&&null!=b.N)return b.N(b,c);var d=qb[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=qb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IWithMeta.-with-meta",b);};function rb(){}
var sb=function sb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return sb.b(arguments[0],arguments[1]);case 3:return sb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};
sb.b=function(a,b){if(null!=a&&null!=a.Z)return a.Z(a,b);var c=sb[n(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=sb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw x("IReduce.-reduce",a);};sb.c=function(a,b,c){if(null!=a&&null!=a.$)return a.$(a,b,c);var d=sb[n(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=sb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw x("IReduce.-reduce",a);};sb.u=3;
var tb=function tb(b,c){if(null!=b&&null!=b.v)return b.v(b,c);var d=tb[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=tb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IEquiv.-equiv",b);},ub=function ub(b){if(null!=b&&null!=b.O)return b.O(b);var c=ub[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IHash.-hash",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.R)return b.R(b);var c=xb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=xb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("ISeqable.-seq",b);};function yb(){}function zb(){}function Ab(){}
var Bb=function Bb(b){if(null!=b&&null!=b.Gb)return b.Gb(b);var c=Bb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Bb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IReversible.-rseq",b);},F=function F(b,c){if(null!=b&&null!=b.cc)return b.cc(0,c);var d=F[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=F._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IWriter.-write",b);},Cb=function Cb(b,c,d){if(null!=b&&null!=b.L)return b.L(b,c,d);var e=
Cb[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("IPrintWithWriter.-pr-writer",b);},Db=function Db(b,c,d){if(null!=b&&null!=b.bc)return b.bc(0,c,d);var e=Db[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("IWatchable.-notify-watches",b);},Eb=function Eb(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Eb[n(null==b?null:
b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Eb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IEditableCollection.-as-transient",b);},Fb=function Fb(b,c){if(null!=b&&null!=b.wb)return b.wb(b,c);var d=Fb[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Fb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("ITransientCollection.-conj!",b);},Gb=function Gb(b){if(null!=b&&null!=b.xb)return b.xb(b);var c=Gb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Gb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("ITransientCollection.-persistent!",b);},Ib=function Ib(b,c,d){if(null!=b&&null!=b.vb)return b.vb(b,c,d);var e=Ib[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ib._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("ITransientAssociative.-assoc!",b);},Jb=function Jb(b,c,d){if(null!=b&&null!=b.ac)return b.ac(0,c,d);var e=Jb[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Jb._;
if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("ITransientVector.-assoc-n!",b);};function Kb(){}
var Lb=function Lb(b,c){if(null!=b&&null!=b.kb)return b.kb(b,c);var d=Lb[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Lb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IComparable.-compare",b);},Mb=function Mb(b){if(null!=b&&null!=b.Zb)return b.Zb();var c=Mb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Mb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IChunk.-drop-first",b);},Ob=function Ob(b){if(null!=b&&null!=b.Qb)return b.Qb(b);var c=
Ob[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IChunkedSeq.-chunked-first",b);},Pb=function Pb(b){if(null!=b&&null!=b.Rb)return b.Rb(b);var c=Pb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Pb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IChunkedSeq.-chunked-rest",b);},Qb=function Qb(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=Qb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=Qb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IChunkedNext.-chunked-next",b);},Rb=function Rb(b,c){if(null!=b&&null!=b.wc)return b.wc(b,c);var d=Rb[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Rb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("IReset.-reset!",b);},Sb=function Sb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Sb.b(arguments[0],arguments[1]);case 3:return Sb.c(arguments[0],
arguments[1],arguments[2]);case 4:return Sb.B(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Sb.I(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};Sb.b=function(a,b){if(null!=a&&null!=a.yc)return a.yc(a,b);var c=Sb[n(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Sb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw x("ISwap.-swap!",a);};
Sb.c=function(a,b,c){if(null!=a&&null!=a.zc)return a.zc(a,b,c);var d=Sb[n(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Sb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw x("ISwap.-swap!",a);};Sb.B=function(a,b,c,d){if(null!=a&&null!=a.Ac)return a.Ac(a,b,c,d);var e=Sb[n(null==a?null:a)];if(null!=e)return e.B?e.B(a,b,c,d):e.call(null,a,b,c,d);e=Sb._;if(null!=e)return e.B?e.B(a,b,c,d):e.call(null,a,b,c,d);throw x("ISwap.-swap!",a);};
Sb.I=function(a,b,c,d,e){if(null!=a&&null!=a.Bc)return a.Bc(a,b,c,d,e);var f=Sb[n(null==a?null:a)];if(null!=f)return f.I?f.I(a,b,c,d,e):f.call(null,a,b,c,d,e);f=Sb._;if(null!=f)return f.I?f.I(a,b,c,d,e):f.call(null,a,b,c,d,e);throw x("ISwap.-swap!",a);};Sb.u=5;var Tb=function Tb(b){if(null!=b&&null!=b.ra)return b.ra(b);var c=Tb[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IIterable.-iterator",b);};
function Ub(a){this.Lc=a;this.i=1073741824;this.A=0}Ub.prototype.cc=function(a,b){return this.Lc.append(b)};function Vb(a){var b=new ia;a.L(null,new Ub(b),ra());return""+y(b)}var Wb="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Xb(a){a=Wb(a|0,-862048943);return Wb(a<<15|a>>>-15,461845907)}
function Yb(a,b){var c=(a|0)^(b|0);return Wb(c<<13|c>>>-13,5)+-430675100|0}function $b(a,b){var c=(a|0)^b,c=Wb(c^c>>>16,-2048144789),c=Wb(c^c>>>13,-1028477387);return c^c>>>16}function ac(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Yb(c,Xb(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Xb(a.charCodeAt(a.length-1)):b;return $b(b,Wb(2,a.length))}bc;H;cc;dc;var ec={},fc=0;
function gc(a){255<fc&&(ec={},fc=0);var b=ec[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Wb(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;ec[a]=b;fc+=1}return a=b}function hc(a){null!=a&&(a.i&4194304||a.Qc)?a=a.O(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=gc(a),0!==a&&(a=Xb(a),a=Yb(0,a),a=$b(a,4))):a=a instanceof Date?a.valueOf():null==a?0:ub(a);return a}
function kc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Aa(a,b){return b instanceof a}function lc(a,b){if(a.Ea===b.Ea)return 0;var c=Da(a.ha);if(t(c?b.ha:c))return-1;if(t(a.ha)){if(Da(b.ha))return 1;c=ka(a.ha,b.ha);return 0===c?ka(a.name,b.name):c}return ka(a.name,b.name)}I;function H(a,b,c,d,e){this.ha=a;this.name=b;this.Ea=c;this.jb=d;this.ka=e;this.i=2154168321;this.A=4096}g=H.prototype;g.toString=function(){return this.Ea};g.equiv=function(a){return this.v(null,a)};
g.v=function(a,b){return b instanceof H?this.Ea===b.Ea:!1};g.call=function(){function a(a,b,c){return I.c?I.c(b,this,c):I.call(null,b,this,c)}function b(a,b){return I.b?I.b(b,this):I.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};
g.a=function(a){return I.b?I.b(a,this):I.call(null,a,this)};g.b=function(a,b){return I.c?I.c(a,this,b):I.call(null,a,this,b)};g.M=function(){return this.ka};g.N=function(a,b){return new H(this.ha,this.name,this.Ea,this.jb,b)};g.O=function(){var a=this.jb;return null!=a?a:this.jb=a=kc(ac(this.name),gc(this.ha))};g.L=function(a,b){return F(b,this.Ea)};mc;nc;K;
function L(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.xc))return a.R(null);if(Ca(a)||"string"===typeof a)return 0===a.length?null:new K(a,0);if(w(wb,a))return xb(a);throw Error([y(a),y(" is not ISeqable")].join(""));}function M(a){if(null==a)return null;if(null!=a&&(a.i&64||a.$a))return a.aa(null);a=L(a);return null==a?null:Ua(a)}function oc(a){return null!=a?null!=a&&(a.i&64||a.$a)?a.ea(null):(a=L(a))?Va(a):N:N}
function O(a){return null==a?null:null!=a&&(a.i&128||a.Fb)?a.da(null):L(oc(a))}var cc=function cc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return cc.a(arguments[0]);case 2:return cc.b(arguments[0],arguments[1]);default:return cc.h(arguments[0],arguments[1],new K(c.slice(2),0))}};cc.a=function(){return!0};cc.b=function(a,b){return null==a?null==b:a===b||tb(a,b)};
cc.h=function(a,b,c){for(;;)if(cc.b(a,b))if(O(c))a=b,b=M(c),c=O(c);else return cc.b(b,M(c));else return!1};cc.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return cc.h(b,a,c)};cc.u=2;function pc(a){this.D=a}pc.prototype.next=function(){if(null!=this.D){var a=M(this.D);this.D=O(this.D);return{value:a,done:!1}}return{value:null,done:!0}};function qc(a){return new pc(L(a))}rc;function sc(a,b,c){this.value=a;this.ob=b;this.Mb=c;this.i=8388672;this.A=0}sc.prototype.R=function(){return this};
sc.prototype.aa=function(){return this.value};sc.prototype.ea=function(){null==this.Mb&&(this.Mb=rc.a?rc.a(this.ob):rc.call(null,this.ob));return this.Mb};function rc(a){var b=a.next();return t(b.done)?N:new sc(b.value,a,null)}function tc(a,b){var c=Xb(a),c=Yb(0,c);return $b(c,b)}function uc(a){var b=0,c=1;for(a=L(a);;)if(null!=a)b+=1,c=Wb(31,c)+hc(M(a))|0,a=O(a);else return tc(c,b)}var vc=tc(1,0);function wc(a){var b=0,c=0;for(a=L(a);;)if(null!=a)b+=1,c=c+hc(M(a))|0,a=O(a);else return tc(c,b)}
var xc=tc(0,0);yc;bc;zc;La["null"]=!0;Ma["null"]=function(){return 0};Date.prototype.v=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.qb=!0;Date.prototype.kb=function(a,b){if(b instanceof Date)return ka(this.valueOf(),b.valueOf());throw Error([y("Cannot compare "),y(this),y(" to "),y(b)].join(""));};tb.number=function(a,b){return a===b};Ac;ob["function"]=!0;pb["function"]=function(){return null};ub._=function(a){return a[ba]||(a[ba]=++ca)};P;
function Bc(a){this.C=a;this.i=32768;this.A=0}Bc.prototype.rb=function(){return this.C};function Cc(a){return a instanceof Bc}function P(a){return nb(a)}function Dc(a,b){var c=Ma(a);if(0===c)return b.s?b.s():b.call(null);for(var d=C.b(a,0),e=1;;)if(e<c){var f=C.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(Cc(d))return nb(d);e+=1}else return d}function Fc(a,b,c){var d=Ma(a),e=c;for(c=0;;)if(c<d){var f=C.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(Cc(e))return nb(e);c+=1}else return e}
function Gc(a,b){var c=a.length;if(0===a.length)return b.s?b.s():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(Cc(d))return nb(d);e+=1}else return d}function Hc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(Cc(e))return nb(e);c+=1}else return e}function Ic(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(Cc(c))return nb(c);d+=1}else return c}Jc;Q;Kc;Lc;
function Mc(a){return null!=a?a.i&2||a.mc?!0:a.i?!1:w(La,a):w(La,a)}function Nc(a){return null!=a?a.i&16||a.$b?!0:a.i?!1:w(Ra,a):w(Ra,a)}function Oc(a,b){this.f=a;this.l=b}Oc.prototype.fa=function(){return this.l<this.f.length};Oc.prototype.next=function(){var a=this.f[this.l];this.l+=1;return a};function K(a,b){this.f=a;this.l=b;this.i=166199550;this.A=8192}g=K.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};
g.X=function(a,b){var c=b+this.l;return c<this.f.length?this.f[c]:null};g.la=function(a,b,c){a=b+this.l;return a<this.f.length?this.f[a]:c};g.ra=function(){return new Oc(this.f,this.l)};g.da=function(){return this.l+1<this.f.length?new K(this.f,this.l+1):null};g.V=function(){var a=this.f.length-this.l;return 0>a?0:a};g.Gb=function(){var a=Ma(this);return 0<a?new Kc(this,a-1,null):null};g.O=function(){return uc(this)};g.v=function(a,b){return zc.b?zc.b(this,b):zc.call(null,this,b)};g.Y=function(){return N};
g.Z=function(a,b){return Ic(this.f,b,this.f[this.l],this.l+1)};g.$=function(a,b,c){return Ic(this.f,b,c,this.l)};g.aa=function(){return this.f[this.l]};g.ea=function(){return this.l+1<this.f.length?new K(this.f,this.l+1):N};g.R=function(){return this.l<this.f.length?this:null};g.T=function(a,b){return Q.b?Q.b(b,this):Q.call(null,b,this)};K.prototype[Ga]=function(){return qc(this)};
var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.a(arguments[0]);case 2:return nc.b(arguments[0],arguments[1]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};nc.a=function(a){return nc.b(a,0)};nc.b=function(a,b){return b<a.length?new K(a,b):null};nc.u=2;
var mc=function mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.a(arguments[0]);case 2:return mc.b(arguments[0],arguments[1]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};mc.a=function(a){return nc.b(a,0)};mc.b=function(a,b){return nc.b(a,b)};mc.u=2;Ac;R;function Kc(a,b,c){this.Db=a;this.l=b;this.m=c;this.i=32374990;this.A=8192}g=Kc.prototype;g.toString=function(){return Vb(this)};
g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};g.da=function(){return 0<this.l?new Kc(this.Db,this.l-1,null):null};g.V=function(){return this.l+1};g.O=function(){return uc(this)};g.v=function(a,b){return zc.b?zc.b(this,b):zc.call(null,this,b)};g.Y=function(){var a=N,b=this.m;return Ac.b?Ac.b(a,b):Ac.call(null,a,b)};g.Z=function(a,b){return R.b?R.b(b,this):R.call(null,b,this)};g.$=function(a,b,c){return R.c?R.c(b,c,this):R.call(null,b,c,this)};
g.aa=function(){return C.b(this.Db,this.l)};g.ea=function(){return 0<this.l?new Kc(this.Db,this.l-1,null):N};g.R=function(){return this};g.N=function(a,b){return new Kc(this.Db,this.l,b)};g.T=function(a,b){return Q.b?Q.b(b,this):Q.call(null,b,this)};Kc.prototype[Ga]=function(){return qc(this)};function Pc(a){return M(O(a))}function Qc(a){for(;;){var b=O(a);if(null!=b)a=b;else return M(a)}}tb._=function(a,b){return a===b};
var Rc=function Rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rc.s();case 1:return Rc.a(arguments[0]);case 2:return Rc.b(arguments[0],arguments[1]);default:return Rc.h(arguments[0],arguments[1],new K(c.slice(2),0))}};Rc.s=function(){return Sc};Rc.a=function(a){return a};Rc.b=function(a,b){return null!=a?Pa(a,b):Pa(N,b)};Rc.h=function(a,b,c){for(;;)if(t(c))a=Rc.b(a,b),b=M(c),c=O(c);else return Rc.b(a,b)};
Rc.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return Rc.h(b,a,c)};Rc.u=2;function T(a){if(null!=a)if(null!=a&&(a.i&2||a.mc))a=a.V(null);else if(Ca(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.xc))a:{a=L(a);for(var b=0;;){if(Mc(a)){a=b+Ma(a);break a}a=O(a);b+=1}}else a=Ma(a);else a=0;return a}function Tc(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return L(a)?M(a):c;if(Nc(a))return C.c(a,b,c);if(L(a)){var d=O(a),e=b-1;a=d;b=e}else return c}}
function Vc(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.$b))return a.X(null,b);if(Ca(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.$a)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(L(c)){c=M(c);break a}throw Error("Index out of bounds");}if(Nc(c)){c=C.b(c,d);break a}if(L(c))c=O(c),--d;else throw Error("Index out of bounds");
}}return c}if(w(Ra,a))return C.b(a,b);throw Error([y("nth not supported on this type "),y(Ea(null==a?null:a.constructor))].join(""));}
function U(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.$b))return a.la(null,b,null);if(Ca(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.$a))return Tc(a,b);if(w(Ra,a))return C.b(a,b);throw Error([y("nth not supported on this type "),y(Ea(null==a?null:a.constructor))].join(""));}
var I=function I(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return I.b(arguments[0],arguments[1]);case 3:return I.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};I.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.qc)?a.K(null,b):Ca(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:w(Xa,a)?Za.b(a,b):null};
I.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.qc)?a.H(null,b,c):Ca(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:w(Xa,a)?Za.c(a,b,c):c:c};I.u=3;Wc;var Xc=function Xc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Xc.c(arguments[0],arguments[1],arguments[2]);default:return Xc.h(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};
Xc.c=function(a,b,c){if(null!=a)a=ab(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Eb(Yc);;)if(d<b){var f=d+1;e=e.vb(null,a[d],c[d]);d=f}else{a=Gb(e);break a}}return a};Xc.h=function(a,b,c,d){for(;;)if(a=Xc.c(a,b,c),t(d))b=M(d),c=Pc(d),d=O(O(d));else return a};Xc.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),d=O(d);return Xc.h(b,a,c,d)};Xc.u=3;
var Zc=function Zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Zc.a(arguments[0]);case 2:return Zc.b(arguments[0],arguments[1]);default:return Zc.h(arguments[0],arguments[1],new K(c.slice(2),0))}};Zc.a=function(a){return a};Zc.b=function(a,b){return null==a?null:db(a,b)};Zc.h=function(a,b,c){for(;;){if(null==a)return null;a=Zc.b(a,b);if(t(c))b=M(c),c=O(c);else return a}};
Zc.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return Zc.h(b,a,c)};Zc.u=2;function $c(a,b){this.g=a;this.m=b;this.i=393217;this.A=0}g=$c.prototype;g.M=function(){return this.m};g.N=function(a,b){return new $c(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S,ga,Ka){a=this;return B.Eb?B.Eb(a.g,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S,ga,Ka):B.call(null,a.g,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S,ga,Ka)}function b(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S,ga){a=this;return a.g.Qa?a.g.Qa(b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S,ga):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S,ga)}function c(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S){a=this;return a.g.Pa?a.g.Pa(b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,
G,J,E,S):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E,S)}function d(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E){a=this;return a.g.Oa?a.g.Oa(b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,E)}function e(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J){a=this;return a.g.Na?a.g.Na(b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J)}function f(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G){a=this;return a.g.Ma?a.g.Ma(b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G):a.g.call(null,
b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G)}function h(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D){a=this;return a.g.La?a.g.La(b,c,d,e,f,h,k,l,p,m,r,u,z,A,D):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D)}function k(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A){a=this;return a.g.Ka?a.g.Ka(b,c,d,e,f,h,k,l,p,m,r,u,z,A):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z,A)}function l(a,b,c,d,e,f,h,k,l,p,m,r,u,z){a=this;return a.g.Ja?a.g.Ja(b,c,d,e,f,h,k,l,p,m,r,u,z):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u,z)}function p(a,b,c,d,e,f,h,k,l,p,m,r,u){a=this;
return a.g.Ia?a.g.Ia(b,c,d,e,f,h,k,l,p,m,r,u):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r,u)}function m(a,b,c,d,e,f,h,k,l,p,m,r){a=this;return a.g.Ha?a.g.Ha(b,c,d,e,f,h,k,l,p,m,r):a.g.call(null,b,c,d,e,f,h,k,l,p,m,r)}function r(a,b,c,d,e,f,h,k,l,p,m){a=this;return a.g.Ga?a.g.Ga(b,c,d,e,f,h,k,l,p,m):a.g.call(null,b,c,d,e,f,h,k,l,p,m)}function u(a,b,c,d,e,f,h,k,l,p){a=this;return a.g.Sa?a.g.Sa(b,c,d,e,f,h,k,l,p):a.g.call(null,b,c,d,e,f,h,k,l,p)}function z(a,b,c,d,e,f,h,k,l){a=this;return a.g.Ra?a.g.Ra(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function A(a,b,c,d,e,f,h,k){a=this;return a.g.pa?a.g.pa(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function D(a,b,c,d,e,f,h){a=this;return a.g.oa?a.g.oa(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function G(a,b,c,d,e,f){a=this;return a.g.I?a.g.I(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function J(a,b,c,d,e){a=this;return a.g.B?a.g.B(b,c,d,e):a.g.call(null,b,c,d,e)}function S(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function ga(a,b,c){a=this;
return a.g.b?a.g.b(b,c):a.g.call(null,b,c)}function Ka(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function jc(a){a=this;return a.g.s?a.g.s():a.g.call(null)}var E=null,E=function(E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc,vd,me,jf,zg,Th){switch(arguments.length){case 1:return jc.call(this,E);case 2:return Ka.call(this,E,xa);case 3:return ga.call(this,E,xa,za);case 4:return S.call(this,E,xa,za,Fa);case 5:return J.call(this,E,xa,za,Fa,Ja);case 6:return G.call(this,E,xa,za,Fa,Ja,Qa);case 7:return D.call(this,
E,xa,za,Fa,Ja,Qa,Sa);case 8:return A.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya);case 9:return z.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb);case 10:return u.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb);case 11:return r.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb);case 12:return m.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb);case 13:return p.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb);case 14:return l.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb);case 15:return k.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,
Nb,Zb,ic);case 16:return h.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec);case 17:return f.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc);case 18:return e.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc,vd);case 19:return d.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc,vd,me);case 20:return c.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc,vd,me,jf);case 21:return b.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc,vd,me,jf,
zg);case 22:return a.call(this,E,xa,za,Fa,Ja,Qa,Sa,Ya,bb,lb,vb,Hb,Nb,Zb,ic,Ec,Uc,vd,me,jf,zg,Th)}throw Error("Invalid arity: "+arguments.length);};E.a=jc;E.b=Ka;E.c=ga;E.B=S;E.I=J;E.oa=G;E.pa=D;E.Ra=A;E.Sa=z;E.Ga=u;E.Ha=r;E.Ia=m;E.Ja=p;E.Ka=l;E.La=k;E.Ma=h;E.Na=f;E.Oa=e;E.Pa=d;E.Qa=c;E.pc=b;E.Eb=a;return E}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.s=function(){return this.g.s?this.g.s():this.g.call(null)};
g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.B=function(a,b,c,d){return this.g.B?this.g.B(a,b,c,d):this.g.call(null,a,b,c,d)};g.I=function(a,b,c,d,e){return this.g.I?this.g.I(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.oa=function(a,b,c,d,e,f){return this.g.oa?this.g.oa(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.pa=function(a,b,c,d,e,f,h){return this.g.pa?this.g.pa(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.Ra=function(a,b,c,d,e,f,h,k){return this.g.Ra?this.g.Ra(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.Sa=function(a,b,c,d,e,f,h,k,l){return this.g.Sa?this.g.Sa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.Ga=function(a,b,c,d,e,f,h,k,l,p){return this.g.Ga?this.g.Ga(a,b,c,d,e,f,h,k,l,p):this.g.call(null,a,b,c,d,e,f,h,k,l,p)};
g.Ha=function(a,b,c,d,e,f,h,k,l,p,m){return this.g.Ha?this.g.Ha(a,b,c,d,e,f,h,k,l,p,m):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m)};g.Ia=function(a,b,c,d,e,f,h,k,l,p,m,r){return this.g.Ia?this.g.Ia(a,b,c,d,e,f,h,k,l,p,m,r):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r)};g.Ja=function(a,b,c,d,e,f,h,k,l,p,m,r,u){return this.g.Ja?this.g.Ja(a,b,c,d,e,f,h,k,l,p,m,r,u):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u)};
g.Ka=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z){return this.g.Ka?this.g.Ka(a,b,c,d,e,f,h,k,l,p,m,r,u,z):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z)};g.La=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A){return this.g.La?this.g.La(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A)};g.Ma=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D){return this.g.Ma?this.g.Ma(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D)};
g.Na=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G){return this.g.Na?this.g.Na(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G)};g.Oa=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J){return this.g.Oa?this.g.Oa(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J)};
g.Pa=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S){return this.g.Pa?this.g.Pa(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S)};g.Qa=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga){return this.g.Qa?this.g.Qa(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga):this.g.call(null,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga)};
g.pc=function(a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka){return B.Eb?B.Eb(this.g,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka):B.call(null,this.g,a,b,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka)};function Ac(a,b){return"function"==n(a)?new $c(a,b):null==a?null:qb(a,b)}function ad(a){var b=null!=a;return(b?null!=a?a.i&131072||a.tc||(a.i?0:w(ob,a)):w(ob,a):b)?pb(a):null}function bd(a){return null==a?!1:null!=a?a.i&4096||a.Uc?!0:a.i?!1:w(hb,a):w(hb,a)}
function cd(a){return null!=a?a.i&16777216||a.Tc?!0:a.i?!1:w(yb,a):w(yb,a)}function dd(a){return null==a?!1:null!=a?a.i&1024||a.rc?!0:a.i?!1:w(cb,a):w(cb,a)}function ed(a){return null!=a?a.i&16384||a.Vc?!0:a.i?!1:w(kb,a):w(kb,a)}fd;gd;function hd(a){return null!=a?a.A&512||a.Nc?!0:!1:!1}function id(a){var b=[];ha(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function jd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var kd={};
function ld(a){return null==a?!1:null!=a?a.i&64||a.$a?!0:a.i?!1:w(Ta,a):w(Ta,a)}function md(a){return null==a?!1:!1===a?!1:!0}function nd(a,b){return I.c(a,b,kd)===kd?!1:!0}
function dc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return ka(a,b);throw Error([y("Cannot compare "),y(a),y(" to "),y(b)].join(""));}if(null!=a?a.A&2048||a.qb||(a.A?0:w(Kb,a)):w(Kb,a))return Lb(a,b);if("string"!==typeof a&&!Ca(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([y("Cannot compare "),y(a),y(" to "),y(b)].join(""));return ka(a,b)}
function od(a,b){var c=T(a),d=T(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=dc(Vc(a,d),Vc(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function pd(a){return cc.b(a,dc)?dc:function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return"number"===typeof d?d:t(d)?-1:t(a.b?a.b(c,b):a.call(null,c,b))?1:0}}qd;function rd(a,b){if(L(b)){var c=qd.a?qd.a(b):qd.call(null,b),d=pd(a);la(c,d);return L(c)}return N}function sd(a,b){return td(a,b)}
function td(a,b){var c=dc;return rd(function(b,e){return pd(c).call(null,a.a?a.a(b):a.call(null,b),a.a?a.a(e):a.call(null,e))},b)}var R=function R(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return R.b(arguments[0],arguments[1]);case 3:return R.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};
R.b=function(a,b){var c=L(b);if(c){var d=M(c),c=O(c);return Ia.c?Ia.c(a,d,c):Ia.call(null,a,d,c)}return a.s?a.s():a.call(null)};R.c=function(a,b,c){for(c=L(c);;)if(c){var d=M(c);b=a.b?a.b(b,d):a.call(null,b,d);if(Cc(b))return nb(b);c=O(c)}else return b};R.u=3;ud;
var Ia=function Ia(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ia.b(arguments[0],arguments[1]);case 3:return Ia.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};Ia.b=function(a,b){return null!=b&&(b.i&524288||b.vc)?b.Z(null,a):Ca(b)?Gc(b,a):"string"===typeof b?Gc(b,a):w(rb,b)?sb.b(b,a):R.b(a,b)};
Ia.c=function(a,b,c){return null!=c&&(c.i&524288||c.vc)?c.$(null,a,b):Ca(c)?Hc(c,a,b):"string"===typeof c?Hc(c,a,b):w(rb,c)?sb.c(c,a,b):R.c(a,b,c)};Ia.u=3;function wd(a){return a}var xd=function xd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return xd.s();case 1:return xd.a(arguments[0]);case 2:return xd.b(arguments[0],arguments[1]);default:return xd.h(arguments[0],arguments[1],new K(c.slice(2),0))}};xd.s=function(){return 0};xd.a=function(a){return a};
xd.b=function(a,b){return a+b};xd.h=function(a,b,c){return Ia.c(xd,a+b,c)};xd.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return xd.h(b,a,c)};xd.u=2;var yd=function yd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return yd.a(arguments[0]);case 2:return yd.b(arguments[0],arguments[1]);default:return yd.h(arguments[0],arguments[1],new K(c.slice(2),0))}};yd.a=function(a){return-a};yd.b=function(a,b){return a-b};
yd.h=function(a,b,c){return Ia.c(yd,a-b,c)};yd.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return yd.h(b,a,c)};yd.u=2;({}).Wc;var zd=function zd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return zd.a(arguments[0]);case 2:return zd.b(arguments[0],arguments[1]);default:return zd.h(arguments[0],arguments[1],new K(c.slice(2),0))}};zd.a=function(){return!0};zd.b=function(a,b){return a<b};
zd.h=function(a,b,c){for(;;)if(a<b)if(O(c))a=b,b=M(c),c=O(c);else return b<M(c);else return!1};zd.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return zd.h(b,a,c)};zd.u=2;function Ad(a){return a-1}var Bd=function Bd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Bd.a(arguments[0]);case 2:return Bd.b(arguments[0],arguments[1]);default:return Bd.h(arguments[0],arguments[1],new K(c.slice(2),0))}};Bd.a=function(a){return a};
Bd.b=function(a,b){return a>b?a:b};Bd.h=function(a,b,c){return Ia.c(Bd,a>b?a:b,c)};Bd.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return Bd.h(b,a,c)};Bd.u=2;Cd;function Dd(a){return a|0}function Cd(a,b){return(a%b+b)%b}function Ed(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Fd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Gd(a){var b=2;for(a=L(a);;)if(a&&0<b)--b,a=O(a);else return a}
var y=function y(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return y.s();case 1:return y.a(arguments[0]);default:return y.h(arguments[0],new K(c.slice(1),0))}};y.s=function(){return""};y.a=function(a){return null==a?"":""+a};y.h=function(a,b){for(var c=new ia(""+y(a)),d=b;;)if(t(d))c=c.append(""+y(M(d))),d=O(d);else return c.toString()};y.w=function(a){var b=M(a);a=O(a);return y.h(b,a)};y.u=1;V;Hd;
function zc(a,b){var c;if(cd(b))if(Mc(a)&&Mc(b)&&T(a)!==T(b))c=!1;else a:{c=L(a);for(var d=L(b);;){if(null==c){c=null==d;break a}if(null!=d&&cc.b(M(c),M(d)))c=O(c),d=O(d);else{c=!1;break a}}}else c=null;return md(c)}function Jc(a){if(L(a)){var b=hc(M(a));for(a=O(a);;){if(null==a)return b;b=kc(b,hc(M(a)));a=O(a)}}else return 0}Id;Jd;function Kd(a){var b=0;for(a=L(a);;)if(a){var c=M(a),b=(b+(hc(Id.a?Id.a(c):Id.call(null,c))^hc(Jd.a?Jd.a(c):Jd.call(null,c))))%4503599627370496;a=O(a)}else return b}Hd;
Ld;Md;function Lc(a,b,c,d,e){this.m=a;this.first=b;this.ia=c;this.count=d;this.o=e;this.i=65937646;this.A=8192}g=Lc.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};g.da=function(){return 1===this.count?null:this.ia};g.V=function(){return this.count};g.ab=function(){return this.first};g.bb=function(){return Va(this)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};
g.Y=function(){return qb(N,this.m)};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return this.first};g.ea=function(){return 1===this.count?N:this.ia};g.R=function(){return this};g.N=function(a,b){return new Lc(b,this.first,this.ia,this.count,this.o)};g.T=function(a,b){return new Lc(this.m,b,this,this.count+1,null)};Lc.prototype[Ga]=function(){return qc(this)};function Nd(a){this.m=a;this.i=65937614;this.A=8192}g=Nd.prototype;g.toString=function(){return Vb(this)};
g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};g.da=function(){return null};g.V=function(){return 0};g.ab=function(){return null};g.bb=function(){throw Error("Can't pop empty list");};g.O=function(){return vc};g.v=function(a,b){return(null!=b?b.i&33554432||b.Rc||(b.i?0:w(zb,b)):w(zb,b))||cd(b)?null==L(b):!1};g.Y=function(){return this};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return null};g.ea=function(){return N};
g.R=function(){return null};g.N=function(a,b){return new Nd(b)};g.T=function(a,b){return new Lc(this.m,b,null,1,null)};var N=new Nd(null);Nd.prototype[Ga]=function(){return qc(this)};function Od(a){return(null!=a?a.i&134217728||a.Sc||(a.i?0:w(Ab,a)):w(Ab,a))?Bb(a):Ia.c(Rc,N,a)}var bc=function bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return bc.h(0<c.length?new K(c.slice(0),0):null)};
bc.h=function(a){var b;if(a instanceof K&&0===a.l)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.aa(null)),a=a.da(null);else break a;a=b.length;for(var c=N;;)if(0<a){var d=a-1,c=c.T(null,b[a-1]);a=d}else return c};bc.u=0;bc.w=function(a){return bc.h(L(a))};function Pd(a,b,c,d){this.m=a;this.first=b;this.ia=c;this.o=d;this.i=65929452;this.A=8192}g=Pd.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};
g.da=function(){return null==this.ia?null:L(this.ia)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.m)};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return this.first};g.ea=function(){return null==this.ia?N:this.ia};g.R=function(){return this};g.N=function(a,b){return new Pd(b,this.first,this.ia,this.o)};g.T=function(a,b){return new Pd(null,b,this,this.o)};
Pd.prototype[Ga]=function(){return qc(this)};function Q(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.$a))?new Pd(null,a,b,null):new Pd(null,a,L(b),null)}function Qd(a,b){if(a.ta===b.ta)return 0;var c=Da(a.ha);if(t(c?b.ha:c))return-1;if(t(a.ha)){if(Da(b.ha))return 1;c=ka(a.ha,b.ha);return 0===c?ka(a.name,b.name):c}return ka(a.name,b.name)}function v(a,b,c,d){this.ha=a;this.name=b;this.ta=c;this.jb=d;this.i=2153775105;this.A=4096}g=v.prototype;g.toString=function(){return[y(":"),y(this.ta)].join("")};
g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return b instanceof v?this.ta===b.ta:!1};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return I.b(c,this);case 3:return I.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return I.b(c,this)};a.c=function(a,c,d){return I.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return I.b(a,this)};
g.b=function(a,b){return I.c(a,this,b)};g.O=function(){var a=this.jb;return null!=a?a:this.jb=a=kc(ac(this.name),gc(this.ha))+2654435769|0};g.L=function(a,b){return F(b,[y(":"),y(this.ta)].join(""))};function Rd(a,b){return a===b?!0:a instanceof v&&b instanceof v?a.ta===b.ta:!1}
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sd.a(arguments[0]);case 2:return Sd.b(arguments[0],arguments[1]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};
Sd.a=function(a){if(a instanceof v)return a;if(a instanceof H){var b;if(null!=a&&(a.A&4096||a.uc))b=a.ha;else throw Error([y("Doesn't support namespace: "),y(a)].join(""));return new v(b,Hd.a?Hd.a(a):Hd.call(null,a),a.Ea,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new v(b[0],b[1],a,null):new v(null,b[0],a,null)):null};Sd.b=function(a,b){return new v(a,b,[y(t(a)?[y(a),y("/")].join(""):null),y(b)].join(""),null)};Sd.u=2;
function Td(a,b,c,d){this.m=a;this.nb=b;this.D=c;this.o=d;this.i=32374988;this.A=0}g=Td.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};function Ud(a){null!=a.nb&&(a.D=a.nb.s?a.nb.s():a.nb.call(null),a.nb=null);return a.D}g.M=function(){return this.m};g.da=function(){xb(this);return null==this.D?null:O(this.D)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.m)};
g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){xb(this);return null==this.D?null:M(this.D)};g.ea=function(){xb(this);return null!=this.D?oc(this.D):N};g.R=function(){Ud(this);if(null==this.D)return null;for(var a=this.D;;)if(a instanceof Td)a=Ud(a);else return this.D=a,L(this.D)};g.N=function(a,b){return new Td(b,this.nb,this.D,this.o)};g.T=function(a,b){return Q(b,this)};Td.prototype[Ga]=function(){return qc(this)};Vd;
function Wd(a,b){this.G=a;this.end=b;this.i=2;this.A=0}Wd.prototype.add=function(a){this.G[this.end]=a;return this.end+=1};Wd.prototype.ca=function(){var a=new Vd(this.G,0,this.end);this.G=null;return a};Wd.prototype.V=function(){return this.end};function Xd(a){return new Wd(Array(a),0)}function Vd(a,b,c){this.f=a;this.ba=b;this.end=c;this.i=524306;this.A=0}g=Vd.prototype;g.V=function(){return this.end-this.ba};g.X=function(a,b){return this.f[this.ba+b]};
g.la=function(a,b,c){return 0<=b&&b<this.end-this.ba?this.f[this.ba+b]:c};g.Zb=function(){if(this.ba===this.end)throw Error("-drop-first of empty chunk");return new Vd(this.f,this.ba+1,this.end)};g.Z=function(a,b){return Ic(this.f,b,this.f[this.ba],this.ba+1)};g.$=function(a,b,c){return Ic(this.f,b,c,this.ba)};function fd(a,b,c,d){this.ca=a;this.Ca=b;this.m=c;this.o=d;this.i=31850732;this.A=1536}g=fd.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};
g.da=function(){if(1<Ma(this.ca))return new fd(Mb(this.ca),this.Ca,this.m,null);var a=xb(this.Ca);return null==a?null:a};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.m)};g.aa=function(){return C.b(this.ca,0)};g.ea=function(){return 1<Ma(this.ca)?new fd(Mb(this.ca),this.Ca,this.m,null):null==this.Ca?N:this.Ca};g.R=function(){return this};g.Qb=function(){return this.ca};g.Rb=function(){return null==this.Ca?N:this.Ca};
g.N=function(a,b){return new fd(this.ca,this.Ca,b,this.o)};g.T=function(a,b){return Q(b,this)};g.Pb=function(){return null==this.Ca?null:this.Ca};fd.prototype[Ga]=function(){return qc(this)};function Yd(a,b){return 0===Ma(a)?b:new fd(a,b,null,null)}function Zd(a,b){a.add(b)}function Ld(a){return Ob(a)}function Md(a){return Pb(a)}function qd(a){for(var b=[];;)if(L(a))b.push(M(a)),a=O(a);else return b}
function $d(a){if("number"===typeof a)a:{var b=Array(a);if(ld(null))for(var c=0,d=L(null);;)if(d&&c<a)b[c]=M(d),c+=1,d=O(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=ya.a(a);return a}function ae(a,b){if(Mc(a))return T(a);for(var c=a,d=b,e=0;;)if(0<d&&L(c))c=O(c),--d,e+=1;else return e}
var be=function be(b){return null==b?null:null==O(b)?L(M(b)):Q(M(b),be(O(b)))},ce=function ce(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ce.s();case 1:return ce.a(arguments[0]);case 2:return ce.b(arguments[0],arguments[1]);default:return ce.h(arguments[0],arguments[1],new K(c.slice(2),0))}};ce.s=function(){return new Td(null,function(){return null},null,null)};ce.a=function(a){return new Td(null,function(){return a},null,null)};
ce.b=function(a,b){return new Td(null,function(){var c=L(a);return c?hd(c)?Yd(Ob(c),ce.b(Pb(c),b)):Q(M(c),ce.b(oc(c),b)):b},null,null)};ce.h=function(a,b,c){return function e(a,b){return new Td(null,function(){var c=L(a);return c?hd(c)?Yd(Ob(c),e(Pb(c),b)):Q(M(c),e(oc(c),b)):t(b)?e(M(b),O(b)):null},null,null)}(ce.b(a,b),c)};ce.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return ce.h(b,a,c)};ce.u=2;function de(a){return Gb(a)}
var ee=function ee(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ee.s();case 1:return ee.a(arguments[0]);case 2:return ee.b(arguments[0],arguments[1]);default:return ee.h(arguments[0],arguments[1],new K(c.slice(2),0))}};ee.s=function(){return Eb(Sc)};ee.a=function(a){return a};ee.b=function(a,b){return Fb(a,b)};ee.h=function(a,b,c){for(;;)if(a=Fb(a,b),t(c))b=M(c),c=O(c);else return a};
ee.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return ee.h(b,a,c)};ee.u=2;
function fe(a,b,c){var d=L(c);if(0===b)return a.s?a.s():a.call(null);c=Ua(d);var e=Va(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Ua(e),f=Va(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Ua(f),h=Va(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Ua(h),k=Va(h);if(4===b)return a.B?a.B(c,d,e,f):a.B?a.B(c,d,e,f):a.call(null,c,d,e,f);var h=Ua(k),l=Va(k);if(5===b)return a.I?a.I(c,d,e,f,h):a.I?a.I(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Ua(l),
p=Va(l);if(6===b)return a.oa?a.oa(c,d,e,f,h,k):a.oa?a.oa(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Ua(p),m=Va(p);if(7===b)return a.pa?a.pa(c,d,e,f,h,k,l):a.pa?a.pa(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var p=Ua(m),r=Va(m);if(8===b)return a.Ra?a.Ra(c,d,e,f,h,k,l,p):a.Ra?a.Ra(c,d,e,f,h,k,l,p):a.call(null,c,d,e,f,h,k,l,p);var m=Ua(r),u=Va(r);if(9===b)return a.Sa?a.Sa(c,d,e,f,h,k,l,p,m):a.Sa?a.Sa(c,d,e,f,h,k,l,p,m):a.call(null,c,d,e,f,h,k,l,p,m);var r=Ua(u),z=Va(u);if(10===b)return a.Ga?a.Ga(c,
d,e,f,h,k,l,p,m,r):a.Ga?a.Ga(c,d,e,f,h,k,l,p,m,r):a.call(null,c,d,e,f,h,k,l,p,m,r);var u=Ua(z),A=Va(z);if(11===b)return a.Ha?a.Ha(c,d,e,f,h,k,l,p,m,r,u):a.Ha?a.Ha(c,d,e,f,h,k,l,p,m,r,u):a.call(null,c,d,e,f,h,k,l,p,m,r,u);var z=Ua(A),D=Va(A);if(12===b)return a.Ia?a.Ia(c,d,e,f,h,k,l,p,m,r,u,z):a.Ia?a.Ia(c,d,e,f,h,k,l,p,m,r,u,z):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z);var A=Ua(D),G=Va(D);if(13===b)return a.Ja?a.Ja(c,d,e,f,h,k,l,p,m,r,u,z,A):a.Ja?a.Ja(c,d,e,f,h,k,l,p,m,r,u,z,A):a.call(null,c,d,e,f,h,k,l,
p,m,r,u,z,A);var D=Ua(G),J=Va(G);if(14===b)return a.Ka?a.Ka(c,d,e,f,h,k,l,p,m,r,u,z,A,D):a.Ka?a.Ka(c,d,e,f,h,k,l,p,m,r,u,z,A,D):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z,A,D);var G=Ua(J),S=Va(J);if(15===b)return a.La?a.La(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G):a.La?a.La(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G);var J=Ua(S),ga=Va(S);if(16===b)return a.Ma?a.Ma(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J):a.Ma?a.Ma(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J);var S=
Ua(ga),Ka=Va(ga);if(17===b)return a.Na?a.Na(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S):a.Na?a.Na(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S);var ga=Ua(Ka),jc=Va(Ka);if(18===b)return a.Oa?a.Oa(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga):a.Oa?a.Oa(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga);Ka=Ua(jc);jc=Va(jc);if(19===b)return a.Pa?a.Pa(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka):a.Pa?a.Pa(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka):a.call(null,
c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka);var E=Ua(jc);Va(jc);if(20===b)return a.Qa?a.Qa(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka,E):a.Qa?a.Qa(c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka,E):a.call(null,c,d,e,f,h,k,l,p,m,r,u,z,A,D,G,J,S,ga,Ka,E);throw Error("Only up to 20 arguments supported on functions");}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.b(arguments[0],arguments[1]);case 3:return B.c(arguments[0],arguments[1],arguments[2]);case 4:return B.B(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return B.I(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return B.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new K(c.slice(5),0))}};
B.b=function(a,b){var c=a.u;if(a.w){var d=ae(b,c+1);return d<=c?fe(a,d,b):a.w(b)}return a.apply(a,qd(b))};B.c=function(a,b,c){b=Q(b,c);c=a.u;if(a.w){var d=ae(b,c+1);return d<=c?fe(a,d,b):a.w(b)}return a.apply(a,qd(b))};B.B=function(a,b,c,d){b=Q(b,Q(c,d));c=a.u;return a.w?(d=ae(b,c+1),d<=c?fe(a,d,b):a.w(b)):a.apply(a,qd(b))};B.I=function(a,b,c,d,e){b=Q(b,Q(c,Q(d,e)));c=a.u;return a.w?(d=ae(b,c+1),d<=c?fe(a,d,b):a.w(b)):a.apply(a,qd(b))};
B.h=function(a,b,c,d,e,f){b=Q(b,Q(c,Q(d,Q(e,be(f)))));c=a.u;return a.w?(d=ae(b,c+1),d<=c?fe(a,d,b):a.w(b)):a.apply(a,qd(b))};B.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),e=O(d),d=M(e),f=O(e),e=M(f),f=O(f);return B.h(b,a,c,d,e,f)};B.u=5;function ge(a){return L(a)?a:null}
var he=function he(){"undefined"===typeof ma&&(ma=function(b,c){this.Jc=b;this.Ic=c;this.i=393216;this.A=0},ma.prototype.N=function(b,c){return new ma(this.Jc,c)},ma.prototype.M=function(){return this.Ic},ma.prototype.fa=function(){return!1},ma.prototype.next=function(){return Error("No such element")},ma.prototype.remove=function(){return Error("Unsupported operation")},ma.Ub=function(){return new W(null,2,5,X,[Ac(ie,new q(null,1,[je,bc(ke,bc(Sc))],null)),le],null)},ma.yb=!0,ma.eb="cljs.core/t_cljs$core19412",
ma.Jb=function(b,c){return F(c,"cljs.core/t_cljs$core19412")});return new ma(he,ne)};oe;function oe(a,b,c,d){this.pb=a;this.first=b;this.ia=c;this.m=d;this.i=31719628;this.A=0}g=oe.prototype;g.N=function(a,b){return new oe(this.pb,this.first,this.ia,b)};g.T=function(a,b){return Q(b,xb(this))};g.Y=function(){return N};g.v=function(a,b){return null!=xb(this)?zc(this,b):cd(b)&&null==L(b)};g.O=function(){return uc(this)};g.R=function(){null!=this.pb&&this.pb.step(this);return null==this.ia?null:this};
g.aa=function(){null!=this.pb&&xb(this);return null==this.ia?null:this.first};g.ea=function(){null!=this.pb&&xb(this);return null==this.ia?N:this.ia};g.da=function(){null!=this.pb&&xb(this);return null==this.ia?null:xb(this.ia)};oe.prototype[Ga]=function(){return qc(this)};function pe(a,b){for(;;){if(null==L(b))return!0;var c;c=M(b);c=a.a?a.a(c):a.call(null,c);if(t(c)){c=a;var d=O(b);a=c;b=d}else return!1}}
function qe(a){return function(){function b(b,c){return Da(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return Da(a.a?a.a(b):a.call(null,b))}function d(){return Da(a.s?a.s():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new K(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return Da(B.B(a,b,d,e))}b.u=2;b.w=function(a){var b=M(a);a=O(a);var d=M(a);a=oc(a);return c(b,d,a)};b.h=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var p=null;if(2<arguments.length){for(var p=0,m=Array(arguments.length-2);p<m.length;)m[p]=arguments[p+2],++p;p=new K(m,0)}return f.h(a,e,p)}throw Error("Invalid arity: "+arguments.length);};e.u=2;e.w=f.w;e.s=d;e.a=c;e.b=b;e.h=f.h;return e}()}
function re(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.u=0;a.w=function(a){L(a);return!1};a.h=function(){return!1};return a}()}
var se=function se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return se.s();case 1:return se.a(arguments[0]);case 2:return se.b(arguments[0],arguments[1]);case 3:return se.c(arguments[0],arguments[1],arguments[2]);default:return se.h(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};se.s=function(){return wd};se.a=function(a){return a};
se.b=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.a?a.a(c):a.call(null,c)}function d(c,d){var e=b.b?b.b(c,d):b.call(null,c,d);return a.a?a.a(e):a.call(null,e)}function e(c){c=b.a?b.a(c):b.call(null,c);return a.a?a.a(c):a.call(null,c)}function f(){var c=b.s?b.s():b.call(null);return a.a?a.a(c):a.call(null,c)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new K(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){c=B.I(b,c,e,f,h);return a.a?a.a(c):a.call(null,c)}c.u=3;c.w=function(a){var b=M(a);a=O(a);var c=M(a);a=O(a);var e=M(a);a=oc(a);return d(b,c,e,a)};c.h=d;return c}(),h=function(a,b,h,r){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var u=null;if(3<arguments.length){for(var u=0,z=Array(arguments.length-3);u<z.length;)z[u]=arguments[u+
3],++u;u=new K(z,0)}return k.h(a,b,h,u)}throw Error("Invalid arity: "+arguments.length);};h.u=3;h.w=k.w;h.s=f;h.a=e;h.b=d;h.c=c;h.h=k.h;return h}()};
se.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function e(d,e){var f;f=c.b?c.b(d,e):c.call(null,d,e);f=b.a?b.a(f):b.call(null,f);return a.a?a.a(f):a.call(null,f)}function f(d){d=c.a?c.a(d):c.call(null,d);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function h(){var d;d=c.s?c.s():c.call(null);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new K(k,0)}return e.call(this,a,b,c,h)}function e(d,f,h,k){d=B.I(c,d,f,h,k);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}d.u=3;d.w=function(a){var b=M(a);a=O(a);var c=M(a);a=O(a);var d=M(a);a=oc(a);return e(b,c,d,a)};d.h=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var z=null;if(3<arguments.length){for(var z=0,A=Array(arguments.length-3);z<A.length;)A[z]=arguments[z+3],++z;z=new K(A,0)}return l.h(a,b,c,z)}throw Error("Invalid arity: "+arguments.length);};k.u=3;k.w=l.w;k.s=h;k.a=f;k.b=e;k.c=d;k.h=l.h;return k}()};
se.h=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return c.call(this,d)}function c(b){b=B.b(M(a),b);for(var d=O(a);;)if(d)b=M(d).call(null,b),d=O(d);else return b}b.u=0;b.w=function(a){a=L(a);return c(a)};b.h=c;return b}()}(Od(Q(a,Q(b,Q(c,d)))))};se.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),d=O(d);return se.h(b,a,c,d)};se.u=3;te;
function ue(a,b,c,d){this.state=a;this.m=b;this.Mc=c;this.jc=d;this.A=16386;this.i=6455296}g=ue.prototype;g.equiv=function(a){return this.v(null,a)};g.v=function(a,b){return this===b};g.rb=function(){return this.state};g.M=function(){return this.m};
g.bc=function(a,b,c){a=L(this.jc);for(var d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f),k=U(h,0),h=U(h,1);h.B?h.B(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=L(a))hd(a)?(d=Ob(a),a=Pb(a),k=d,e=T(d),d=k):(d=M(a),k=U(d,0),h=U(d,1),h.B?h.B(k,this,b,c):h.call(null,k,this,b,c),a=O(a),d=null,e=0),f=0;else return null};g.O=function(){return this[ba]||(this[ba]=++ca)};
var ve=function ve(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ve.a(arguments[0]);default:return ve.h(arguments[0],new K(c.slice(1),0))}};ve.a=function(a){return new ue(a,null,null,null)};ve.h=function(a,b){var c=null!=b&&(b.i&64||b.$a)?B.b(yc,b):b,d=I.b(c,ua),c=I.b(c,we);return new ue(a,d,c,null)};ve.w=function(a){var b=M(a);a=O(a);return ve.h(b,a)};ve.u=1;xe;
function ye(a,b){if(a instanceof ue){var c=a.Mc;if(null!=c&&!t(c.a?c.a(b):c.call(null,b)))throw Error([y("Assert failed: "),y("Validator rejected reference state"),y("\n"),y(function(){var a=bc(ze,Ae);return xe.a?xe.a(a):xe.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.jc&&Db(a,c,b);return b}return Rb(a,b)}
var Be=function Be(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Be.b(arguments[0],arguments[1]);case 3:return Be.c(arguments[0],arguments[1],arguments[2]);case 4:return Be.B(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Be.h(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0))}};Be.b=function(a,b){var c;a instanceof ue?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=ye(a,c)):c=Sb.b(a,b);return c};
Be.c=function(a,b,c){if(a instanceof ue){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=ye(a,b)}else a=Sb.c(a,b,c);return a};Be.B=function(a,b,c,d){if(a instanceof ue){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=ye(a,b)}else a=Sb.B(a,b,c,d);return a};Be.h=function(a,b,c,d,e){return a instanceof ue?ye(a,B.I(b,a.state,c,d,e)):Sb.I(a,b,c,d,e)};Be.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),e=O(d),d=M(e),e=O(e);return Be.h(b,a,c,d,e)};Be.u=4;
function Ce(a){this.state=a;this.i=32768;this.A=0}Ce.prototype.rb=function(){return this.state};function te(a){return new Ce(a)}
var V=function V(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return V.a(arguments[0]);case 2:return V.b(arguments[0],arguments[1]);case 3:return V.c(arguments[0],arguments[1],arguments[2]);case 4:return V.B(arguments[0],arguments[1],arguments[2],arguments[3]);default:return V.h(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0))}};
V.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.s?b.s():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new K(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=B.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.u=2;c.w=function(a){var b=
M(a);a=O(a);var c=M(a);a=oc(a);return d(b,c,a)};c.h=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var m=null;if(2<arguments.length){for(var m=0,r=Array(arguments.length-2);m<r.length;)r[m]=arguments[m+2],++m;m=new K(r,0)}return h.h(a,b,m)}throw Error("Invalid arity: "+arguments.length);};f.u=2;f.w=h.w;f.s=e;f.a=d;f.b=c;f.h=h.h;return f}()}};
V.b=function(a,b){return new Td(null,function(){var c=L(b);if(c){if(hd(c)){for(var d=Ob(c),e=T(d),f=Xd(e),h=0;;)if(h<e)Zd(f,function(){var b=C.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return Yd(f.ca(),V.b(a,Pb(c)))}return Q(function(){var b=M(c);return a.a?a.a(b):a.call(null,b)}(),V.b(a,oc(c)))}return null},null,null)};
V.c=function(a,b,c){return new Td(null,function(){var d=L(b),e=L(c);if(d&&e){var f=Q,h;h=M(d);var k=M(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,V.c(a,oc(d),oc(e)))}else d=null;return d},null,null)};V.B=function(a,b,c,d){return new Td(null,function(){var e=L(b),f=L(c),h=L(d);if(e&&f&&h){var k=Q,l;l=M(e);var p=M(f),m=M(h);l=a.c?a.c(l,p,m):a.call(null,l,p,m);e=k(l,V.B(a,oc(e),oc(f),oc(h)))}else e=null;return e},null,null)};
V.h=function(a,b,c,d,e){var f=function k(a){return new Td(null,function(){var b=V.b(L,a);return pe(wd,b)?Q(V.b(M,b),k(V.b(oc,b))):null},null,null)};return V.b(function(){return function(b){return B.b(a,b)}}(f),f(Rc.h(e,d,mc([c,b],0))))};V.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),e=O(d),d=M(e),e=O(e);return V.h(b,a,c,d,e)};V.u=4;
function De(a,b){if("number"!==typeof a)throw Error([y("Assert failed: "),y(function(){var a=bc(Ee,Fe);return xe.a?xe.a(a):xe.call(null,a)}())].join(""));return new Td(null,function(){if(0<a){var c=L(b);return c?Q(M(c),De(a-1,oc(c))):null}return null},null,null)}
function Ge(a,b){if("number"!==typeof a)throw Error([y("Assert failed: "),y(function(){var a=bc(Ee,Fe);return xe.a?xe.a(a):xe.call(null,a)}())].join(""));return new Td(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=L(b);if(0<a&&e){var f=a-1,e=oc(e);a=f;b=e}else return e}}),null,null)}function He(a,b){return V.c(function(a){return a},b,Ge(a,b))}function Ie(a){return new Td(null,function(){return Q(a,Ie(a))},null,null)}
var Je=function Je(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Je.b(arguments[0],arguments[1]);default:return Je.h(arguments[0],arguments[1],new K(c.slice(2),0))}};Je.b=function(a,b){return new Td(null,function(){var c=L(a),d=L(b);return c&&d?Q(M(c),Q(M(d),Je.b(oc(c),oc(d)))):null},null,null)};
Je.h=function(a,b,c){return new Td(null,function(){var d=V.b(L,Rc.h(c,b,mc([a],0)));return pe(wd,d)?ce.b(V.b(M,d),B.b(Je,V.b(oc,d))):null},null,null)};Je.w=function(a){var b=M(a),c=O(a);a=M(c);c=O(c);return Je.h(b,a,c)};Je.u=2;function Ke(a){return Ge(1,Je.b(Ie("L"),a))}Le;
function Me(a,b){return new Td(null,function(){var c=L(b);if(c){if(hd(c)){for(var d=Ob(c),e=T(d),f=Xd(e),h=0;;)if(h<e){var k;k=C.b(d,h);k=a.a?a.a(k):a.call(null,k);t(k)&&(k=C.b(d,h),f.add(k));h+=1}else break;return Yd(f.ca(),Me(a,Pb(c)))}d=M(c);c=oc(c);return t(a.a?a.a(d):a.call(null,d))?Q(d,Me(a,c)):Me(a,c)}return null},null,null)}
function Ne(a){return function c(a){return new Td(null,function(){var e=Q,f;t(ld.a?ld.a(a):ld.call(null,a))?(f=mc([L.a?L.a(a):L.call(null,a)],0),f=B.b(ce,B.c(V,c,f))):f=null;return e(a,f)},null,null)}(a)}function Oe(a,b){return null!=a?null!=a&&(a.A&4||a.Pc)?Ac(de(Ia.c(Fb,Eb(a),b)),ad(a)):Ia.c(Pa,a,b):Ia.c(Rc,N,b)}function Pe(a,b){return de(Ia.c(function(b,d){return ee.b(b,a.a?a.a(d):a.call(null,d))},Eb(Sc),b))}
function Qe(a,b,c){return Xc.c(a,b,function(){var d=I.b(a,b);return c.a?c.a(d):c.call(null,d)}())}function Re(a,b){this.P=a;this.f=b}function Se(a){return new Re(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Te(a){return new Re(a.P,Ha(a.f))}function Ue(a){a=a.j;return 32>a?0:a-1>>>5<<5}function Ve(a,b,c){for(;;){if(0===b)return c;var d=Se(a);d.f[0]=c;c=d;b-=5}}
var We=function We(b,c,d,e){var f=Te(d),h=b.j-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?We(b,c-5,d,e):Ve(null,c-5,e),f.f[h]=b);return f};function Xe(a,b){throw Error([y("No item "),y(a),y(" in vector of length "),y(b)].join(""));}function Ye(a,b){if(b>=Ue(a))return a.J;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function Ze(a,b){return 0<=b&&b<a.j?Ye(a,b):Xe(b,a.j)}
var $e=function $e(b,c,d,e,f){var h=Te(d);if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=$e(b,c-5,d.f[k],e,f);h.f[k]=b}return h},af=function af(b,c,d){var e=b.j-2>>>c&31;if(5<c){b=af(b,c-5,d.f[e]);if(null==b&&0===e)return null;d=Te(d);d.f[e]=b;return d}if(0===e)return null;d=Te(d);d.f[e]=null;return d};function bf(a,b,c,d,e,f){this.l=a;this.Nb=b;this.f=c;this.ua=d;this.start=e;this.end=f}bf.prototype.fa=function(){return this.l<this.end};
bf.prototype.next=function(){32===this.l-this.Nb&&(this.f=Ye(this.ua,this.l),this.Nb+=32);var a=this.f[this.l&31];this.l+=1;return a};cf;df;ef;P;ff;Y;gf;function W(a,b,c,d,e,f){this.m=a;this.j=b;this.shift=c;this.root=d;this.J=e;this.o=f;this.i=167668511;this.A=8196}g=W.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};
g.X=function(a,b){return Ze(this,b)[b&31]};g.la=function(a,b,c){return 0<=b&&b<this.j?Ye(this,b)[b&31]:c};g.cb=function(a,b,c){if(0<=b&&b<this.j)return Ue(this)<=b?(a=Ha(this.J),a[b&31]=c,new W(this.m,this.j,this.shift,this.root,a,null)):new W(this.m,this.j,this.shift,$e(this,this.shift,this.root,b,c),this.J,null);if(b===this.j)return Pa(this,c);throw Error([y("Index "),y(b),y(" out of bounds  [0,"),y(this.j),y("]")].join(""));};
g.ra=function(){var a=this.j;return new bf(0,0,0<T(this)?Ye(this,0):null,this,0,a)};g.M=function(){return this.m};g.V=function(){return this.j};g.tb=function(){return C.b(this,0)};g.ub=function(){return C.b(this,1)};g.ab=function(){return 0<this.j?C.b(this,this.j-1):null};
g.bb=function(){if(0===this.j)throw Error("Can't pop empty vector");if(1===this.j)return qb(Sc,this.m);if(1<this.j-Ue(this))return new W(this.m,this.j-1,this.shift,this.root,this.J.slice(0,-1),null);var a=Ye(this,this.j-2),b=af(this,this.shift,this.root),b=null==b?X:b,c=this.j-1;return 5<this.shift&&null==b.f[1]?new W(this.m,c,this.shift-5,b.f[0],a,null):new W(this.m,c,this.shift,b,a,null)};g.Gb=function(){return 0<this.j?new Kc(this,this.j-1,null):null};
g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){if(b instanceof W)if(this.j===T(b))for(var c=Tb(this),d=Tb(b);;)if(t(c.fa())){var e=c.next(),f=d.next();if(!cc.b(e,f))return!1}else return!0;else return!1;else return zc(this,b)};g.lb=function(){return new ef(this.j,this.shift,cf.a?cf.a(this.root):cf.call(null,this.root),df.a?df.a(this.J):df.call(null,this.J))};g.Y=function(){return Ac(Sc,this.m)};g.Z=function(a,b){return Dc(this,b)};
g.$=function(a,b,c){a=0;for(var d=c;;)if(a<this.j){var e=Ye(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(Cc(d)){e=d;break a}f+=1}else{e=d;break a}if(Cc(e))return P.a?P.a(e):P.call(null,e);a+=c;d=e}else return d};g.Fa=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.R=function(){if(0===this.j)return null;if(32>=this.j)return new K(this.J,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return gf.B?gf.B(this,a,0,0):gf.call(null,this,a,0,0)};g.N=function(a,b){return new W(b,this.j,this.shift,this.root,this.J,this.o)};
g.T=function(a,b){if(32>this.j-Ue(this)){for(var c=this.J.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.J[e],e+=1;else break;d[c]=b;return new W(this.m,this.j+1,this.shift,this.root,d,null)}c=(d=this.j>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Se(null),d.f[0]=this.root,e=Ve(null,this.shift,new Re(null,this.J)),d.f[1]=e):d=We(this,this.shift,this.root,new Re(null,this.J));return new W(this.m,this.j+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.X(null,c);case 3:return this.la(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.X(null,c)};a.c=function(a,c,d){return this.la(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return this.X(null,a)};g.b=function(a,b){return this.la(null,a,b)};
var X=new Re(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Sc=new W(null,0,5,X,[],vc);W.prototype[Ga]=function(){return qc(this)};function ud(a){if(Ca(a))a:{var b=a.length;if(32>b)a=new W(null,b,5,X,a,null);else for(var c=32,d=(new W(null,32,5,X,a.slice(0,32),null)).lb(null);;)if(c<b)var e=c+1,d=ee.b(d,a[c]),c=e;else{a=Gb(d);break a}}else a=Gb(Ia.c(Fb,Eb(Sc),a));return a}hf;
function gd(a,b,c,d,e,f){this.na=a;this.node=b;this.l=c;this.ba=d;this.m=e;this.o=f;this.i=32375020;this.A=1536}g=gd.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};g.da=function(){if(this.ba+1<this.node.length){var a;a=this.na;var b=this.node,c=this.l,d=this.ba+1;a=gf.B?gf.B(a,b,c,d):gf.call(null,a,b,c,d);return null==a?null:a}return Qb(this)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};
g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(Sc,this.m)};g.Z=function(a,b){var c;c=this.na;var d=this.l+this.ba,e=T(this.na);c=hf.c?hf.c(c,d,e):hf.call(null,c,d,e);return Dc(c,b)};g.$=function(a,b,c){a=this.na;var d=this.l+this.ba,e=T(this.na);a=hf.c?hf.c(a,d,e):hf.call(null,a,d,e);return Fc(a,b,c)};g.aa=function(){return this.node[this.ba]};
g.ea=function(){if(this.ba+1<this.node.length){var a;a=this.na;var b=this.node,c=this.l,d=this.ba+1;a=gf.B?gf.B(a,b,c,d):gf.call(null,a,b,c,d);return null==a?N:a}return Pb(this)};g.R=function(){return this};g.Qb=function(){var a=this.node;return new Vd(a,this.ba,a.length)};g.Rb=function(){var a=this.l+this.node.length;if(a<Ma(this.na)){var b=this.na,c=Ye(this.na,a);return gf.B?gf.B(b,c,a,0):gf.call(null,b,c,a,0)}return N};
g.N=function(a,b){return gf.I?gf.I(this.na,this.node,this.l,this.ba,b):gf.call(null,this.na,this.node,this.l,this.ba,b)};g.T=function(a,b){return Q(b,this)};g.Pb=function(){var a=this.l+this.node.length;if(a<Ma(this.na)){var b=this.na,c=Ye(this.na,a);return gf.B?gf.B(b,c,a,0):gf.call(null,b,c,a,0)}return null};gd.prototype[Ga]=function(){return qc(this)};
var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return gf.c(arguments[0],arguments[1],arguments[2]);case 4:return gf.B(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return gf.I(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};gf.c=function(a,b,c){return new gd(a,Ze(a,b),b,c,null,null)};
gf.B=function(a,b,c,d){return new gd(a,b,c,d,null,null)};gf.I=function(a,b,c,d,e){return new gd(a,b,c,d,e,null)};gf.u=5;kf;function lf(a,b,c,d,e){this.m=a;this.ua=b;this.start=c;this.end=d;this.o=e;this.i=167666463;this.A=8192}g=lf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};
g.X=function(a,b){return 0>b||this.end<=this.start+b?Xe(b,this.end-this.start):C.b(this.ua,this.start+b)};g.la=function(a,b,c){return 0>b||this.end<=this.start+b?c:C.c(this.ua,this.start+b,c)};g.cb=function(a,b,c){var d=this.start+b;a=this.m;c=Xc.c(this.ua,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return kf.I?kf.I(a,c,b,d,null):kf.call(null,a,c,b,d,null)};g.M=function(){return this.m};g.V=function(){return this.end-this.start};g.ab=function(){return C.b(this.ua,this.end-1)};
g.bb=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.m,b=this.ua,c=this.start,d=this.end-1;return kf.I?kf.I(a,b,c,d,null):kf.call(null,a,b,c,d,null)};g.Gb=function(){return this.start!==this.end?new Kc(this,this.end-this.start-1,null):null};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(Sc,this.m)};g.Z=function(a,b){return Dc(this,b)};g.$=function(a,b,c){return Fc(this,b,c)};
g.Fa=function(a,b,c){if("number"===typeof b)return mb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.R=function(){var a=this;return function(b){return function d(e){return e===a.end?null:Q(C.b(a.ua,e),new Td(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};g.N=function(a,b){return kf.I?kf.I(b,this.ua,this.start,this.end,this.o):kf.call(null,b,this.ua,this.start,this.end,this.o)};
g.T=function(a,b){var c=this.m,d=mb(this.ua,this.end,b),e=this.start,f=this.end+1;return kf.I?kf.I(c,d,e,f,null):kf.call(null,c,d,e,f,null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.X(null,c);case 3:return this.la(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.X(null,c)};a.c=function(a,c,d){return this.la(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};
g.a=function(a){return this.X(null,a)};g.b=function(a,b){return this.la(null,a,b)};lf.prototype[Ga]=function(){return qc(this)};function kf(a,b,c,d,e){for(;;)if(b instanceof lf)c=b.start+c,d=b.start+d,b=b.ua;else{var f=T(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new lf(a,b,c,d,e)}}
var hf=function hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hf.b(arguments[0],arguments[1]);case 3:return hf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};hf.b=function(a,b){return hf.c(a,b,T(a))};hf.c=function(a,b,c){return kf(null,a,b,c,null)};hf.u=3;function mf(a,b){return a===b.P?b:new Re(a,Ha(b.f))}function cf(a){return new Re({},Ha(a.f))}
function df(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];jd(a,0,b,0,a.length);return b}var nf=function nf(b,c,d,e){d=mf(b.root.P,d);var f=b.j-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?nf(b,c-5,h,e):Ve(b.root.P,c-5,e)}d.f[f]=b;return d};function ef(a,b,c,d){this.j=a;this.shift=b;this.root=c;this.J=d;this.A=88;this.i=275}g=ef.prototype;
g.wb=function(a,b){if(this.root.P){if(32>this.j-Ue(this))this.J[this.j&31]=b;else{var c=new Re(this.root.P,this.J),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.J=d;if(this.j>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Ve(this.root.P,this.shift,c);this.root=new Re(this.root.P,d);this.shift=e}else this.root=nf(this,this.shift,this.root,c)}this.j+=1;return this}throw Error("conj! after persistent!");};g.xb=function(){if(this.root.P){this.root.P=null;var a=this.j-Ue(this),b=Array(a);jd(this.J,0,b,0,a);return new W(null,this.j,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.vb=function(a,b,c){if("number"===typeof b)return Jb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.ac=function(a,b,c){var d=this;if(d.root.P){if(0<=b&&b<d.j)return Ue(this)<=b?d.J[b&31]=c:(a=function(){return function f(a,k){var l=mf(d.root.P,k);if(0===a)l.f[b&31]=c;else{var p=b>>>a&31,m=f(a-5,l.f[p]);l.f[p]=m}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.j)return Fb(this,c);throw Error([y("Index "),y(b),y(" out of bounds for TransientVector of length"),y(d.j)].join(""));}throw Error("assoc! after persistent!");};
g.V=function(){if(this.root.P)return this.j;throw Error("count after persistent!");};g.X=function(a,b){if(this.root.P)return Ze(this,b)[b&31];throw Error("nth after persistent!");};g.la=function(a,b,c){return 0<=b&&b<this.j?C.b(this,b):c};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?C.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};function of(){this.i=2097152;this.A=0}
of.prototype.equiv=function(a){return this.v(null,a)};of.prototype.v=function(){return!1};var pf=new of;function qf(a,b){return md(dd(b)?T(a)===T(b)?pe(wd,V.b(function(a){return cc.b(I.c(b,M(a),pf),Pc(a))},a)):null:null)}function rf(a,b,c,d,e){this.l=a;this.Kc=b;this.Wb=c;this.Dc=d;this.hc=e}rf.prototype.fa=function(){var a=this.l<this.Wb;return a?a:this.hc.fa()};rf.prototype.next=function(){if(this.l<this.Wb){var a=Vc(this.Dc,this.l);this.l+=1;return new W(null,2,5,X,[a,Za.b(this.Kc,a)],null)}return this.hc.next()};
rf.prototype.remove=function(){return Error("Unsupported operation")};function sf(a){this.D=a}sf.prototype.next=function(){if(null!=this.D){var a=M(this.D),b=U(a,0),a=U(a,1);this.D=O(this.D);return{value:[b,a],done:!1}}return{value:null,done:!0}};function tf(a){return new sf(L(a))}function uf(a){this.D=a}uf.prototype.next=function(){if(null!=this.D){var a=M(this.D);this.D=O(this.D);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function vf(a,b){var c;if(b instanceof v)a:{c=a.length;for(var d=b.ta,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof v&&d===a[e].ta){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof H)a:for(c=a.length,d=b.Ea,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof H&&d===a[e].Ea){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(cc.b(b,a[d])){c=d;break a}d+=2}return c}wf;function xf(a,b,c){this.f=a;this.l=b;this.ka=c;this.i=32374990;this.A=0}g=xf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.ka};g.da=function(){return this.l<this.f.length-2?new xf(this.f,this.l+2,this.ka):null};g.V=function(){return(this.f.length-this.l)/2};g.O=function(){return uc(this)};g.v=function(a,b){return zc(this,b)};
g.Y=function(){return Ac(N,this.ka)};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return new W(null,2,5,X,[this.f[this.l],this.f[this.l+1]],null)};g.ea=function(){return this.l<this.f.length-2?new xf(this.f,this.l+2,this.ka):N};g.R=function(){return this};g.N=function(a,b){return new xf(this.f,this.l,b)};g.T=function(a,b){return Q(b,this)};xf.prototype[Ga]=function(){return qc(this)};yf;zf;function Af(a,b,c){this.f=a;this.l=b;this.j=c}
Af.prototype.fa=function(){return this.l<this.j};Af.prototype.next=function(){var a=new W(null,2,5,X,[this.f[this.l],this.f[this.l+1]],null);this.l+=2;return a};function q(a,b,c,d){this.m=a;this.j=b;this.f=c;this.o=d;this.i=16647951;this.A=8196}g=q.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return qc(yf.a?yf.a(this):yf.call(null,this))};g.entries=function(){return tf(L(this))};
g.values=function(){return qc(zf.a?zf.a(this):zf.call(null,this))};g.has=function(a){return nd(this,a)};g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=U(f,0),f=U(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=L(b))hd(b)?(c=Ob(b),b=Pb(b),h=c,d=T(c),c=h):(c=M(b),h=U(c,0),f=U(c,1),a.b?a.b(f,h):a.call(null,f,h),b=O(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return Za.c(this,b,null)};
g.H=function(a,b,c){a=vf(this.f,b);return-1===a?c:this.f[a+1]};g.ra=function(){return new Af(this.f,0,2*this.j)};g.M=function(){return this.m};g.V=function(){return this.j};g.O=function(){var a=this.o;return null!=a?a:this.o=a=wc(this)};g.v=function(a,b){if(null!=b&&(b.i&1024||b.rc)){var c=this.f.length;if(this.j===b.V(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],kd);if(e!==kd)if(cc.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return qf(this,b)};
g.lb=function(){return new wf({},this.f.length,Ha(this.f))};g.Y=function(){return qb(ne,this.m)};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.sb=function(a,b){if(0<=vf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Na(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new q(this.m,this.j-1,d,null);cc.b(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
g.Fa=function(a,b,c){a=vf(this.f,b);if(-1===a){if(this.j<Bf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new q(this.m,this.j+1,e,null)}return qb(ab(Oe(Yc,this),b,c),this.m)}if(c===this.f[a+1])return this;b=Ha(this.f);b[a+1]=c;return new q(this.m,this.j,b,null)};g.Ob=function(a,b){return-1!==vf(this.f,b)};g.R=function(){var a=this.f;return 0<=a.length-2?new xf(a,0,null):null};g.N=function(a,b){return new q(b,this.j,this.f,this.o)};
g.T=function(a,b){if(ed(b))return ab(this,C.b(b,0),C.b(b,1));for(var c=this,d=L(b);;){if(null==d)return c;var e=M(d);if(ed(e))c=ab(c,C.b(e,0),C.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var ne=new q(null,0,[],xc),Bf=8;q.prototype[Ga]=function(){return qc(this)};
Cf;function wf(a,b,c){this.mb=a;this.hb=b;this.f=c;this.i=258;this.A=56}g=wf.prototype;g.V=function(){if(t(this.mb))return Ed(this.hb);throw Error("count after persistent!");};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){if(t(this.mb))return a=vf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.wb=function(a,b){if(t(this.mb)){if(null!=b?b.i&2048||b.sc||(b.i?0:w(eb,b)):w(eb,b))return Ib(this,Id.a?Id.a(b):Id.call(null,b),Jd.a?Jd.a(b):Jd.call(null,b));for(var c=L(b),d=this;;){var e=M(c);if(t(e))c=O(c),d=Ib(d,Id.a?Id.a(e):Id.call(null,e),Jd.a?Jd.a(e):Jd.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.xb=function(){if(t(this.mb))return this.mb=!1,new q(null,Ed(this.hb),this.f,null);throw Error("persistent! called twice");};
g.vb=function(a,b,c){if(t(this.mb)){a=vf(this.f,b);if(-1===a){if(this.hb+2<=2*Bf)return this.hb+=2,this.f.push(b),this.f.push(c),this;a=Cf.b?Cf.b(this.hb,this.f):Cf.call(null,this.hb,this.f);return Ib(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Df;Wc;function Cf(a,b){for(var c=Eb(Yc),d=0;;)if(d<a)c=Ib(c,b[d],b[d+1]),d+=2;else return c}function Ef(){this.C=!1}Ff;Gf;ye;Hf;ve;P;function If(a,b){return a===b?!0:Rd(a,b)?!0:cc.b(a,b)}
function Jf(a,b,c){a=Ha(a);a[b]=c;return a}function Kf(a,b){var c=Array(a.length-2);jd(a,0,c,0,2*b);jd(a,2*(b+1),c,2*b,c.length-2*b);return c}function Lf(a,b,c,d){a=a.fb(b);a.f[c]=d;return a}Mf;function Nf(a,b,c,d){this.f=a;this.l=b;this.Cb=c;this.xa=d}Nf.prototype.advance=function(){for(var a=this.f.length;;)if(this.l<a){var b=this.f[this.l],c=this.f[this.l+1];null!=b?b=this.Cb=new W(null,2,5,X,[b,c],null):null!=c?(b=Tb(c),b=b.fa()?this.xa=b:!1):b=!1;this.l+=2;if(b)return!0}else return!1};
Nf.prototype.fa=function(){var a=null!=this.Cb;return a?a:(a=null!=this.xa)?a:this.advance()};Nf.prototype.next=function(){if(null!=this.Cb){var a=this.Cb;this.Cb=null;return a}if(null!=this.xa)return a=this.xa.next(),this.xa.fa()||(this.xa=null),a;if(this.advance())return this.next();throw Error("No such element");};Nf.prototype.remove=function(){return Error("Unsupported operation")};function Of(a,b,c){this.P=a;this.S=b;this.f=c}g=Of.prototype;
g.fb=function(a){if(a===this.P)return this;var b=Fd(this.S),c=Array(0>b?4:2*(b+1));jd(this.f,0,c,0,2*b);return new Of(a,this.S,c)};g.Ab=function(){return Ff.a?Ff.a(this.f):Ff.call(null,this.f)};g.Wa=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.S&e))return d;var f=Fd(this.S&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Wa(a+5,b,c,d):If(c,e)?f:d};
g.wa=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=Fd(this.S&h-1);if(0===(this.S&h)){var l=Fd(this.S);if(2*l<this.f.length){a=this.fb(a);b=a.f;f.C=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.S|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Pf.wa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.S>>>d&1)&&(k[d]=null!=this.f[e]?Pf.wa(a,b+5,hc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new Mf(a,l+1,k)}b=Array(2*(l+4));jd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;jd(this.f,2*k,b,2*(k+1),2*(l-k));f.C=!0;a=this.fb(a);a.f=b;a.S|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.wa(a,b+5,c,d,e,f),l===h?this:Lf(this,a,2*k+1,l);if(If(d,l))return e===h?this:Lf(this,a,2*k+1,e);f.C=!0;f=b+5;d=Hf.pa?Hf.pa(a,f,l,h,c,d,e):Hf.call(null,a,f,l,h,c,d,e);e=2*
k;k=2*k+1;a=this.fb(a);a.f[e]=null;a.f[k]=d;return a};
g.va=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=Fd(this.S&f-1);if(0===(this.S&f)){var k=Fd(this.S);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Pf.va(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.S>>>c&1)&&(h[c]=null!=this.f[d]?Pf.va(a+5,hc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Mf(null,k+1,h)}a=Array(2*(k+1));jd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;jd(this.f,2*h,a,2*(h+1),2*(k-h));e.C=!0;return new Of(null,this.S|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.va(a+5,b,c,d,e),k===f?this:new Of(null,this.S,Jf(this.f,2*h+1,k));if(If(c,l))return d===f?this:new Of(null,this.S,Jf(this.f,2*h+1,d));e.C=!0;e=this.S;k=this.f;a+=5;a=Hf.oa?Hf.oa(a,l,f,b,c,d):Hf.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=Ha(k);d[c]=null;d[h]=a;return new Of(null,e,d)};
g.Bb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.S&d))return this;var e=Fd(this.S&d-1),f=this.f[2*e],h=this.f[2*e+1];return null==f?(a=h.Bb(a+5,b,c),a===h?this:null!=a?new Of(null,this.S,Jf(this.f,2*e+1,a)):this.S===d?null:new Of(null,this.S^d,Kf(this.f,e))):If(c,f)?new Of(null,this.S^d,Kf(this.f,e)):this};g.ra=function(){return new Nf(this.f,0,null,null)};var Pf=new Of(null,0,[]);function Qf(a,b,c){this.f=a;this.l=b;this.xa=c}
Qf.prototype.fa=function(){for(var a=this.f.length;;){if(null!=this.xa&&this.xa.fa())return!0;if(this.l<a){var b=this.f[this.l];this.l+=1;null!=b&&(this.xa=Tb(b))}else return!1}};Qf.prototype.next=function(){if(this.fa())return this.xa.next();throw Error("No such element");};Qf.prototype.remove=function(){return Error("Unsupported operation")};function Mf(a,b,c){this.P=a;this.j=b;this.f=c}g=Mf.prototype;g.fb=function(a){return a===this.P?this:new Mf(a,this.j,Ha(this.f))};
g.Ab=function(){return Gf.a?Gf.a(this.f):Gf.call(null,this.f)};g.Wa=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Wa(a+5,b,c,d):d};g.wa=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=Lf(this,a,h,Pf.wa(a,b+5,c,d,e,f)),a.j+=1,a;b=k.wa(a,b+5,c,d,e,f);return b===k?this:Lf(this,a,h,b)};
g.va=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new Mf(null,this.j+1,Jf(this.f,f,Pf.va(a+5,b,c,d,e)));a=h.va(a+5,b,c,d,e);return a===h?this:new Mf(null,this.j,Jf(this.f,f,a))};
g.Bb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Bb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.j)a:{e=this.f;a=e.length;b=Array(2*(this.j-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new Of(null,h,b);break a}}else d=new Mf(null,this.j-1,Jf(this.f,d,a));else d=new Mf(null,this.j,Jf(this.f,d,a));return d}return this};g.ra=function(){return new Qf(this.f,0,null)};
function Rf(a,b,c){b*=2;for(var d=0;;)if(d<b){if(If(c,a[d]))return d;d+=2}else return-1}function Sf(a,b,c,d){this.P=a;this.Ta=b;this.j=c;this.f=d}g=Sf.prototype;g.fb=function(a){if(a===this.P)return this;var b=Array(2*(this.j+1));jd(this.f,0,b,0,2*this.j);return new Sf(a,this.Ta,this.j,b)};g.Ab=function(){return Ff.a?Ff.a(this.f):Ff.call(null,this.f)};g.Wa=function(a,b,c,d){a=Rf(this.f,this.j,c);return 0>a?d:If(c,this.f[a])?this.f[a+1]:d};
g.wa=function(a,b,c,d,e,f){if(c===this.Ta){b=Rf(this.f,this.j,d);if(-1===b){if(this.f.length>2*this.j)return b=2*this.j,c=2*this.j+1,a=this.fb(a),a.f[b]=d,a.f[c]=e,f.C=!0,a.j+=1,a;c=this.f.length;b=Array(c+2);jd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.C=!0;d=this.j+1;a===this.P?(this.f=b,this.j=d,a=this):a=new Sf(this.P,this.Ta,d,b);return a}return this.f[b+1]===e?this:Lf(this,a,b+1,e)}return(new Of(a,1<<(this.Ta>>>b&31),[null,this,null,null])).wa(a,b,c,d,e,f)};
g.va=function(a,b,c,d,e){return b===this.Ta?(a=Rf(this.f,this.j,c),-1===a?(a=2*this.j,b=Array(a+2),jd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.C=!0,new Sf(null,this.Ta,this.j+1,b)):cc.b(this.f[a],d)?this:new Sf(null,this.Ta,this.j,Jf(this.f,a+1,d))):(new Of(null,1<<(this.Ta>>>a&31),[null,this])).va(a,b,c,d,e)};g.Bb=function(a,b,c){a=Rf(this.f,this.j,c);return-1===a?this:1===this.j?null:new Sf(null,this.Ta,this.j-1,Kf(this.f,Ed(a)))};g.ra=function(){return new Nf(this.f,0,null,null)};
var Hf=function Hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Hf.oa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Hf.pa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};
Hf.oa=function(a,b,c,d,e,f){var h=hc(b);if(h===d)return new Sf(null,h,2,[b,c,e,f]);var k=new Ef;return Pf.va(a,h,b,c,k).va(a,d,e,f,k)};Hf.pa=function(a,b,c,d,e,f,h){var k=hc(c);if(k===e)return new Sf(null,k,2,[c,d,f,h]);var l=new Ef;return Pf.wa(a,b,k,c,d,l).wa(a,b,e,f,h,l)};Hf.u=7;function Tf(a,b,c,d,e){this.m=a;this.Xa=b;this.l=c;this.D=d;this.o=e;this.i=32374860;this.A=0}g=Tf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};
g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.m)};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return null==this.D?new W(null,2,5,X,[this.Xa[this.l],this.Xa[this.l+1]],null):M(this.D)};
g.ea=function(){if(null==this.D){var a=this.Xa,b=this.l+2;return Ff.c?Ff.c(a,b,null):Ff.call(null,a,b,null)}var a=this.Xa,b=this.l,c=O(this.D);return Ff.c?Ff.c(a,b,c):Ff.call(null,a,b,c)};g.R=function(){return this};g.N=function(a,b){return new Tf(b,this.Xa,this.l,this.D,this.o)};g.T=function(a,b){return Q(b,this)};Tf.prototype[Ga]=function(){return qc(this)};
var Ff=function Ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ff.a(arguments[0]);case 3:return Ff.c(arguments[0],arguments[1],arguments[2]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};Ff.a=function(a){return Ff.c(a,0,null)};
Ff.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Tf(null,a,b,null,null);var d=a[b+1];if(t(d)&&(d=d.Ab(),t(d)))return new Tf(null,a,b+2,d,null);b+=2}else return null;else return new Tf(null,a,b,c,null)};Ff.u=3;function Uf(a,b,c,d,e){this.m=a;this.Xa=b;this.l=c;this.D=d;this.o=e;this.i=32374860;this.A=0}g=Uf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.m};
g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.m)};g.Z=function(a,b){return R.b(b,this)};g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return M(this.D)};g.ea=function(){var a=this.Xa,b=this.l,c=O(this.D);return Gf.B?Gf.B(null,a,b,c):Gf.call(null,null,a,b,c)};g.R=function(){return this};g.N=function(a,b){return new Uf(b,this.Xa,this.l,this.D,this.o)};g.T=function(a,b){return Q(b,this)};
Uf.prototype[Ga]=function(){return qc(this)};var Gf=function Gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gf.a(arguments[0]);case 4:return Gf.B(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};Gf.a=function(a){return Gf.B(null,a,0,null)};
Gf.B=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(t(e)&&(e=e.Ab(),t(e)))return new Uf(a,b,c+1,e,null);c+=1}else return null;else return new Uf(a,b,c,d,null)};Gf.u=4;Df;function Vf(a,b,c){this.ma=a;this.ic=b;this.Vb=c}Vf.prototype.fa=function(){return this.Vb&&this.ic.fa()};Vf.prototype.next=function(){if(this.Vb)return this.ic.next();this.Vb=!0;return this.ma};Vf.prototype.remove=function(){return Error("Unsupported operation")};
function Wc(a,b,c,d,e,f){this.m=a;this.j=b;this.root=c;this.ga=d;this.ma=e;this.o=f;this.i=16123663;this.A=8196}g=Wc.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return qc(yf.a?yf.a(this):yf.call(null,this))};g.entries=function(){return tf(L(this))};g.values=function(){return qc(zf.a?zf.a(this):zf.call(null,this))};g.has=function(a){return nd(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=U(f,0),f=U(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=L(b))hd(b)?(c=Ob(b),b=Pb(b),h=c,d=T(c),c=h):(c=M(b),h=U(c,0),f=U(c,1),a.b?a.b(f,h):a.call(null,f,h),b=O(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){return null==b?this.ga?this.ma:c:null==this.root?c:this.root.Wa(0,hc(b),b,c)};
g.ra=function(){var a=this.root?Tb(this.root):he;return this.ga?new Vf(this.ma,a,!1):a};g.M=function(){return this.m};g.V=function(){return this.j};g.O=function(){var a=this.o;return null!=a?a:this.o=a=wc(this)};g.v=function(a,b){return qf(this,b)};g.lb=function(){return new Df({},this.root,this.j,this.ga,this.ma)};g.Y=function(){return qb(Yc,this.m)};
g.sb=function(a,b){if(null==b)return this.ga?new Wc(this.m,this.j-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Bb(0,hc(b),b);return c===this.root?this:new Wc(this.m,this.j-1,c,this.ga,this.ma,null)};g.Fa=function(a,b,c){if(null==b)return this.ga&&c===this.ma?this:new Wc(this.m,this.ga?this.j:this.j+1,this.root,!0,c,null);a=new Ef;b=(null==this.root?Pf:this.root).va(0,hc(b),b,c,a);return b===this.root?this:new Wc(this.m,a.C?this.j+1:this.j,b,this.ga,this.ma,null)};
g.Ob=function(a,b){return null==b?this.ga:null==this.root?!1:this.root.Wa(0,hc(b),b,kd)!==kd};g.R=function(){if(0<this.j){var a=null!=this.root?this.root.Ab():null;return this.ga?Q(new W(null,2,5,X,[null,this.ma],null),a):a}return null};g.N=function(a,b){return new Wc(b,this.j,this.root,this.ga,this.ma,this.o)};
g.T=function(a,b){if(ed(b))return ab(this,C.b(b,0),C.b(b,1));for(var c=this,d=L(b);;){if(null==d)return c;var e=M(d);if(ed(e))c=ab(c,C.b(e,0),C.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Yc=new Wc(null,0,null,!1,null,xc);Wc.prototype[Ga]=function(){return qc(this)};
function Df(a,b,c,d,e){this.P=a;this.root=b;this.count=c;this.ga=d;this.ma=e;this.i=258;this.A=56}function Wf(a,b,c){if(a.P){if(null==b)a.ma!==c&&(a.ma=c),a.ga||(a.count+=1,a.ga=!0);else{var d=new Ef;b=(null==a.root?Pf:a.root).wa(a.P,0,hc(b),b,c,d);b!==a.root&&(a.root=b);d.C&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=Df.prototype;g.V=function(){if(this.P)return this.count;throw Error("count after persistent!");};
g.K=function(a,b){return null==b?this.ga?this.ma:null:null==this.root?null:this.root.Wa(0,hc(b),b)};g.H=function(a,b,c){return null==b?this.ga?this.ma:c:null==this.root?c:this.root.Wa(0,hc(b),b,c)};
g.wb=function(a,b){var c;a:if(this.P)if(null!=b?b.i&2048||b.sc||(b.i?0:w(eb,b)):w(eb,b))c=Wf(this,Id.a?Id.a(b):Id.call(null,b),Jd.a?Jd.a(b):Jd.call(null,b));else{c=L(b);for(var d=this;;){var e=M(c);if(t(e))c=O(c),d=Wf(d,Id.a?Id.a(e):Id.call(null,e),Jd.a?Jd.a(e):Jd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.xb=function(){var a;if(this.P)this.P=null,a=new Wc(null,this.count,this.root,this.ga,this.ma,null);else throw Error("persistent! called twice");return a};
g.vb=function(a,b,c){return Wf(this,b,c)};Xf;Yf;function Yf(a,b,c,d,e){this.key=a;this.C=b;this.left=c;this.right=d;this.o=e;this.i=32402207;this.A=0}g=Yf.prototype;g.replace=function(a,b,c,d){return new Yf(a,b,c,d,null)};g.K=function(a,b){return C.c(this,b,null)};g.H=function(a,b,c){return C.c(this,b,c)};g.X=function(a,b){return 0===b?this.key:1===b?this.C:null};g.la=function(a,b,c){return 0===b?this.key:1===b?this.C:c};
g.cb=function(a,b,c){return(new W(null,2,5,X,[this.key,this.C],null)).cb(null,b,c)};g.M=function(){return null};g.V=function(){return 2};g.tb=function(){return this.key};g.ub=function(){return this.C};g.ab=function(){return this.C};g.bb=function(){return new W(null,1,5,X,[this.key],null)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Sc};g.Z=function(a,b){return Dc(this,b)};g.$=function(a,b,c){return Fc(this,b,c)};
g.Fa=function(a,b,c){return Xc.c(new W(null,2,5,X,[this.key,this.C],null),b,c)};g.R=function(){return Pa(Pa(N,this.C),this.key)};g.N=function(a,b){return Ac(new W(null,2,5,X,[this.key,this.C],null),b)};g.T=function(a,b){return new W(null,3,5,X,[this.key,this.C,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Yf.prototype[Ga]=function(){return qc(this)};
function Xf(a,b,c,d,e){this.key=a;this.C=b;this.left=c;this.right=d;this.o=e;this.i=32402207;this.A=0}g=Xf.prototype;g.replace=function(a,b,c,d){return new Xf(a,b,c,d,null)};g.K=function(a,b){return C.c(this,b,null)};g.H=function(a,b,c){return C.c(this,b,c)};g.X=function(a,b){return 0===b?this.key:1===b?this.C:null};g.la=function(a,b,c){return 0===b?this.key:1===b?this.C:c};g.cb=function(a,b,c){return(new W(null,2,5,X,[this.key,this.C],null)).cb(null,b,c)};g.M=function(){return null};g.V=function(){return 2};
g.tb=function(){return this.key};g.ub=function(){return this.C};g.ab=function(){return this.C};g.bb=function(){return new W(null,1,5,X,[this.key],null)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Sc};g.Z=function(a,b){return Dc(this,b)};g.$=function(a,b,c){return Fc(this,b,c)};g.Fa=function(a,b,c){return Xc.c(new W(null,2,5,X,[this.key,this.C],null),b,c)};g.R=function(){return Pa(Pa(N,this.C),this.key)};
g.N=function(a,b){return Ac(new W(null,2,5,X,[this.key,this.C],null),b)};g.T=function(a,b){return new W(null,3,5,X,[this.key,this.C,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};
g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};Xf.prototype[Ga]=function(){return qc(this)};Id;var yc=function yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return yc.h(0<c.length?new K(c.slice(0),0):null)};yc.h=function(a){for(var b=L(a),c=Eb(Yc);;)if(b){a=O(O(b));var d=M(b),b=Pc(b),c=Ib(c,d,b),b=a}else return Gb(c)};yc.u=0;yc.w=function(a){return yc.h(L(a))};
function Zf(a,b){this.F=a;this.ka=b;this.i=32374988;this.A=0}g=Zf.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.ka};g.da=function(){var a=(null!=this.F?this.F.i&128||this.F.Fb||(this.F.i?0:w(Wa,this.F)):w(Wa,this.F))?this.F.da(null):O(this.F);return null==a?null:new Zf(a,this.ka)};g.O=function(){return uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.ka)};g.Z=function(a,b){return R.b(b,this)};
g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return this.F.aa(null).tb(null)};g.ea=function(){var a=(null!=this.F?this.F.i&128||this.F.Fb||(this.F.i?0:w(Wa,this.F)):w(Wa,this.F))?this.F.da(null):O(this.F);return null!=a?new Zf(a,this.ka):N};g.R=function(){return this};g.N=function(a,b){return new Zf(this.F,b)};g.T=function(a,b){return Q(b,this)};Zf.prototype[Ga]=function(){return qc(this)};function yf(a){return(a=L(a))?new Zf(a,null):null}function Id(a){return fb(a)}
function $f(a,b){this.F=a;this.ka=b;this.i=32374988;this.A=0}g=$f.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.M=function(){return this.ka};g.da=function(){var a=(null!=this.F?this.F.i&128||this.F.Fb||(this.F.i?0:w(Wa,this.F)):w(Wa,this.F))?this.F.da(null):O(this.F);return null==a?null:new $f(a,this.ka)};g.O=function(){return uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.ka)};g.Z=function(a,b){return R.b(b,this)};
g.$=function(a,b,c){return R.c(b,c,this)};g.aa=function(){return this.F.aa(null).ub(null)};g.ea=function(){var a=(null!=this.F?this.F.i&128||this.F.Fb||(this.F.i?0:w(Wa,this.F)):w(Wa,this.F))?this.F.da(null):O(this.F);return null!=a?new $f(a,this.ka):N};g.R=function(){return this};g.N=function(a,b){return new $f(this.F,b)};g.T=function(a,b){return Q(b,this)};$f.prototype[Ga]=function(){return qc(this)};function zf(a){return(a=L(a))?new $f(a,null):null}function Jd(a){return gb(a)}ag;
function bg(a){this.ob=a}bg.prototype.fa=function(){return this.ob.fa()};bg.prototype.next=function(){if(this.ob.fa())return this.ob.next().J[0];throw Error("No such element");};bg.prototype.remove=function(){return Error("Unsupported operation")};function cg(a,b,c){this.m=a;this.gb=b;this.o=c;this.i=15077647;this.A=8196}g=cg.prototype;g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.keys=function(){return qc(L(this))};g.entries=function(){var a=L(this);return new uf(L(a))};
g.values=function(){return qc(L(this))};g.has=function(a){return nd(this,a)};g.forEach=function(a){for(var b=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=U(f,0),f=U(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=L(b))hd(b)?(c=Ob(b),b=Pb(b),h=c,d=T(c),c=h):(c=M(b),h=U(c,0),f=U(c,1),a.b?a.b(f,h):a.call(null,f,h),b=O(b),c=null,d=0),e=0;else return null};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){return $a(this.gb,b)?b:c};g.ra=function(){return new bg(Tb(this.gb))};
g.M=function(){return this.m};g.V=function(){return Ma(this.gb)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=wc(this)};g.v=function(a,b){return bd(b)&&T(this)===T(b)&&pe(function(a){return function(b){return nd(a,b)}}(this),b)};g.lb=function(){return new ag(Eb(this.gb))};g.Y=function(){return Ac(dg,this.m)};g.R=function(){return yf(this.gb)};g.N=function(a,b){return new cg(b,this.gb,this.o)};g.T=function(a,b){return new cg(this.m,Xc.c(this.gb,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.K(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.K(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return this.K(null,a)};g.b=function(a,b){return this.H(null,a,b)};var dg=new cg(null,ne,xc);cg.prototype[Ga]=function(){return qc(this)};
function ag(a){this.Va=a;this.A=136;this.i=259}g=ag.prototype;g.wb=function(a,b){this.Va=Ib(this.Va,b,null);return this};g.xb=function(){return new cg(null,Gb(this.Va),null)};g.V=function(){return T(this.Va)};g.K=function(a,b){return Za.c(this,b,null)};g.H=function(a,b,c){return Za.c(this.Va,b,kd)===kd?c:b};
g.call=function(){function a(a,b,c){return Za.c(this.Va,b,kd)===kd?c:b}function b(a,b){return Za.c(this.Va,b,kd)===kd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){return Za.c(this.Va,a,kd)===kd?null:a};g.b=function(a,b){return Za.c(this.Va,a,kd)===kd?b:a};
function Hd(a){if(null!=a&&(a.A&4096||a.uc))return a.name;if("string"===typeof a)return a;throw Error([y("Doesn't support name: "),y(a)].join(""));}var eg=function eg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return eg.b(arguments[0],arguments[1]);case 3:return eg.c(arguments[0],arguments[1],arguments[2]);default:return eg.h(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};eg.b=function(a,b){return b};
eg.c=function(a,b,c){return(a.a?a.a(b):a.call(null,b))>(a.a?a.a(c):a.call(null,c))?b:c};eg.h=function(a,b,c,d){return Ia.c(function(b,c){return eg.c(a,b,c)},eg.c(a,b,c),d)};eg.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),d=O(d);return eg.h(b,a,c,d)};eg.u=3;
var fg=function fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fg.b(arguments[0],arguments[1]);case 3:return fg.c(arguments[0],arguments[1],arguments[2]);default:return fg.h(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};fg.b=function(a,b){return b};fg.c=function(a,b,c){return(a.a?a.a(b):a.call(null,b))<(a.a?a.a(c):a.call(null,c))?b:c};
fg.h=function(a,b,c,d){return Ia.c(function(b,c){return fg.c(a,b,c)},fg.c(a,b,c),d)};fg.w=function(a){var b=M(a),c=O(a);a=M(c);var d=O(c),c=M(d),d=O(d);return fg.h(b,a,c,d)};fg.u=3;function gg(a,b,c){this.l=a;this.end=b;this.step=c}gg.prototype.fa=function(){return 0<this.step?this.l<this.end:this.l>this.end};gg.prototype.next=function(){var a=this.l;this.l+=this.step;return a};function hg(a,b,c,d,e){this.m=a;this.start=b;this.end=c;this.step=d;this.o=e;this.i=32375006;this.A=8192}g=hg.prototype;
g.toString=function(){return Vb(this)};g.equiv=function(a){return this.v(null,a)};g.X=function(a,b){if(b<Ma(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.la=function(a,b,c){return b<Ma(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.ra=function(){return new gg(this.start,this.end,this.step)};g.M=function(){return this.m};
g.da=function(){return 0<this.step?this.start+this.step<this.end?new hg(this.m,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new hg(this.m,this.start+this.step,this.end,this.step,null):null};g.V=function(){return Da(xb(this))?0:Math.ceil((this.end-this.start)/this.step)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=uc(this)};g.v=function(a,b){return zc(this,b)};g.Y=function(){return Ac(N,this.m)};g.Z=function(a,b){return Dc(this,b)};
g.$=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.b?b.b(c,a):b.call(null,c,a);if(Cc(c))return P.a?P.a(c):P.call(null,c);a+=this.step}else return c};g.aa=function(){return null==xb(this)?null:this.start};g.ea=function(){return null!=xb(this)?new hg(this.m,this.start+this.step,this.end,this.step,null):N};g.R=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.N=function(a,b){return new hg(b,this.start,this.end,this.step,this.o)};g.T=function(a,b){return Q(b,this)};hg.prototype[Ga]=function(){return qc(this)};function ig(a,b){return new Td(null,function(){var c=L(b);return c?jg(a,M(c),oc(c)):Pa(N,a.s?a.s():a.call(null))},null,null)}function jg(a,b,c){return Q(b,new Td(null,function(){var d=L(c);if(d){var e=jg,f;f=M(d);f=a.b?a.b(b,f):a.call(null,b,f);d=e(a,f,oc(d))}else d=null;return d},null,null))}
function kg(){var a=lg;return function(){function b(b,c,d){return new W(null,2,5,X,[a.c?a.c(b,c,d):a.call(null,b,c,d),Pc.c?Pc.c(b,c,d):Pc.call(null,b)],null)}function c(b,c){return new W(null,2,5,X,[a.b?a.b(b,c):a.call(null,b,c),Pc.b?Pc.b(b,c):Pc.call(null,b)],null)}function d(b){return new W(null,2,5,X,[a.a?a.a(b):a.call(null,b),Pc.a?Pc.a(b):Pc.call(null,b)],null)}function e(){return new W(null,2,5,X,[a.s?a.s():a.call(null),Pc.s?Pc.s():Pc.call(null)],null)}var f=null,h=function(){function b(a,d,
e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new K(k,0)}return c.call(this,a,d,e,h)}function c(b,d,e,f){return new W(null,2,5,X,[B.I(a,b,d,e,f),B.I(Pc,b,d,e,f)],null)}b.u=3;b.w=function(a){var b=M(a);a=O(a);var d=M(a);a=O(a);var e=M(a);a=oc(a);return c(b,d,e,a)};b.h=c;return b}(),f=function(a,f,p,m){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,f);case 3:return b.call(this,
a,f,p);default:var r=null;if(3<arguments.length){for(var r=0,u=Array(arguments.length-3);r<u.length;)u[r]=arguments[r+3],++r;r=new K(u,0)}return h.h(a,f,p,r)}throw Error("Invalid arity: "+arguments.length);};f.u=3;f.w=h.w;f.s=e;f.a=d;f.b=c;f.c=b;f.h=h.h;return f}()}
function ff(a,b,c,d,e,f,h){var k=pa;pa=null==pa?null:pa-1;try{if(null!=pa&&0>pa)return F(a,"#");F(a,c);if(0===wa.a(f))L(h)&&F(a,function(){var a=mg.a(f);return t(a)?a:"..."}());else{if(L(h)){var l=M(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var p=O(h),m=wa.a(f)-1;;)if(!p||null!=m&&0===m){L(p)&&0===m&&(F(a,d),F(a,function(){var a=mg.a(f);return t(a)?a:"..."}()));break}else{F(a,d);var r=M(p);c=a;h=f;b.c?b.c(r,c,h):b.call(null,r,c,h);var u=O(p);c=m-1;p=u;m=c}}return F(a,e)}finally{pa=k}}
function ng(a,b){for(var c=L(b),d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f);F(a,h);f+=1}else if(c=L(c))d=c,hd(d)?(c=Ob(d),e=Pb(d),d=c,h=T(c),c=e,e=h):(h=M(d),F(a,h),c=O(d),d=null,e=0),f=0;else return null}var og={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function pg(a){return[y('"'),y(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return og[a]})),y('"')].join("")}qg;
function rg(a,b){var c=md(I.b(a,ua));return c?(c=null!=b?b.i&131072||b.tc?!0:!1:!1)?null!=ad(b):c:c}
function sg(a,b,c){if(null==a)return F(b,"nil");if(rg(c,a)){F(b,"^");var d=ad(a);Y.c?Y.c(d,b,c):Y.call(null,d,b,c);F(b," ")}if(a.yb)return a.Jb(a,b,c);if(null!=a&&(a.i&2147483648||a.U))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return F(b,""+y(a));if(null!=a&&a.constructor===Object)return F(b,"#js "),d=V.b(function(b){return new W(null,2,5,X,[Sd.a(b),a[b]],null)},id(a)),qg.B?qg.B(d,Y,b,c):qg.call(null,d,Y,b,c);if(Ca(a))return ff(b,Y,"#js ["," ","]",c,a);if("string"==typeof a)return t(ta.a(c))?
F(b,pg(a)):F(b,a);if("function"==n(a)){var e=a.name;c=t(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return ng(b,mc(["#object[",c,' "',""+y(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+y(a);;)if(T(c)<b)c=[y("0"),y(c)].join("");else return c},ng(b,mc(['#inst "',""+y(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),
"-",'00:00"'],0));if(a instanceof RegExp)return ng(b,mc(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.U))return Cb(a,b,c);if(t(a.constructor.eb))return ng(b,mc(["#object[",a.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=t(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return ng(b,mc(["#object[",c," ",""+y(a),"]"],0))}function Y(a,b,c){var d=tg.a(c);return t(d)?(c=Xc.c(c,ug,sg),d.c?d.c(a,b,c):d.call(null,a,b,c)):sg(a,b,c)}
var xe=function xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return xe.h(0<c.length?new K(c.slice(0),0):null)};xe.h=function(a){var b=ra();if(null==a||Da(L(a)))b="";else{var c=y,d=new ia;a:{var e=new Ub(d);Y(M(a),e,b);a=L(O(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.X(null,k);F(e," ");Y(l,e,b);k+=1}else if(a=L(a))f=a,hd(f)?(a=Ob(f),h=Pb(f),f=a,l=T(a),a=h,h=l):(l=M(f),F(e," "),Y(l,e,b),a=O(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};xe.u=0;
xe.w=function(a){return xe.h(L(a))};function qg(a,b,c,d){return ff(c,function(a,c,d){var k=fb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);F(c," ");a=gb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,L(a))}Ce.prototype.U=!0;Ce.prototype.L=function(a,b,c){F(b,"#object [cljs.core.Volatile ");Y(new q(null,1,[vg,this.state],null),b,c);return F(b,"]")};K.prototype.U=!0;K.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Td.prototype.U=!0;
Td.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Tf.prototype.U=!0;Tf.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Yf.prototype.U=!0;Yf.prototype.L=function(a,b,c){return ff(b,Y,"["," ","]",c,this)};xf.prototype.U=!0;xf.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};sc.prototype.U=!0;sc.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};gd.prototype.U=!0;gd.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};
Pd.prototype.U=!0;Pd.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Kc.prototype.U=!0;Kc.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Wc.prototype.U=!0;Wc.prototype.L=function(a,b,c){return qg(this,Y,b,c)};Uf.prototype.U=!0;Uf.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};lf.prototype.U=!0;lf.prototype.L=function(a,b,c){return ff(b,Y,"["," ","]",c,this)};cg.prototype.U=!0;cg.prototype.L=function(a,b,c){return ff(b,Y,"#{"," ","}",c,this)};
fd.prototype.U=!0;fd.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};ue.prototype.U=!0;ue.prototype.L=function(a,b,c){F(b,"#object [cljs.core.Atom ");Y(new q(null,1,[vg,this.state],null),b,c);return F(b,"]")};$f.prototype.U=!0;$f.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Xf.prototype.U=!0;Xf.prototype.L=function(a,b,c){return ff(b,Y,"["," ","]",c,this)};W.prototype.U=!0;W.prototype.L=function(a,b,c){return ff(b,Y,"["," ","]",c,this)};Nd.prototype.U=!0;
Nd.prototype.L=function(a,b){return F(b,"()")};oe.prototype.U=!0;oe.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};q.prototype.U=!0;q.prototype.L=function(a,b,c){return qg(this,Y,b,c)};hg.prototype.U=!0;hg.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Zf.prototype.U=!0;Zf.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};Lc.prototype.U=!0;Lc.prototype.L=function(a,b,c){return ff(b,Y,"("," ",")",c,this)};H.prototype.qb=!0;
H.prototype.kb=function(a,b){if(b instanceof H)return lc(this,b);throw Error([y("Cannot compare "),y(this),y(" to "),y(b)].join(""));};v.prototype.qb=!0;v.prototype.kb=function(a,b){if(b instanceof v)return Qd(this,b);throw Error([y("Cannot compare "),y(this),y(" to "),y(b)].join(""));};lf.prototype.qb=!0;lf.prototype.kb=function(a,b){if(ed(b))return od(this,b);throw Error([y("Cannot compare "),y(this),y(" to "),y(b)].join(""));};W.prototype.qb=!0;
W.prototype.kb=function(a,b){if(ed(b))return od(this,b);throw Error([y("Cannot compare "),y(this),y(" to "),y(b)].join(""));};function wg(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return Cc(d)?new Bc(d):d}}
function Le(a){return function(b){return function(){function c(a,c){return Ia.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.s?a.s():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.s=e;f.a=d;f.b=c;return f}()}(wg(a))}xg;function yg(){}
var Ag=function Ag(b){if(null!=b&&null!=b.oc)return b.oc(b);var c=Ag[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ag._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IEncodeJS.-clj-\x3ejs",b);};Bg;function Cg(a){return(null!=a?a.nc||(a.Cc?0:w(yg,a)):w(yg,a))?Ag(a):"string"===typeof a||"number"===typeof a||a instanceof v||a instanceof H?Bg.a?Bg.a(a):Bg.call(null,a):xe.h(mc([a],0))}
var Bg=function Bg(b){if(null==b)return null;if(null!=b?b.nc||(b.Cc?0:w(yg,b)):w(yg,b))return Ag(b);if(b instanceof v)return Hd(b);if(b instanceof H)return""+y(b);if(dd(b)){var c={};b=L(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f),k=U(h,0),h=U(h,1);c[Cg(k)]=Bg(h);f+=1}else if(b=L(b))hd(b)?(e=Ob(b),b=Pb(b),d=e,e=T(e)):(e=M(b),d=U(e,0),e=U(e,1),c[Cg(d)]=Bg(e),b=O(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.Oc||(b.i?0:w(Oa,b)):w(Oa,b)){c=[];b=L(V.b(Bg,b));d=null;for(f=
e=0;;)if(f<e)k=d.X(null,f),c.push(k),f+=1;else if(b=L(b))d=b,hd(d)?(b=Ob(d),f=Pb(d),d=b,e=T(b),b=f):(b=M(d),c.push(b),b=O(d),d=null,e=0),f=0;else break;return c}return b},xg=function xg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return xg.s();case 1:return xg.a(arguments[0]);default:throw Error([y("Invalid arity: "),y(c.length)].join(""));}};xg.s=function(){return xg.a(1)};xg.a=function(a){return Math.random()*a};xg.u=1;var Dg=new v(null,"rng","rng",1082666016),Eg=new v(null,"text-anchor","text-anchor",585613696),Fg=new v(null,"path","path",-188191168),Gg=new H(null,"itm","itm",-713282527,null),Hg=new H(null,".-length",".-length",-280799999,null),Ig=new H(null,"puts","puts",-1883877054,null),Jg=new v(null,"onkeyup","onkeyup",1815272291),Kg=new H(null,"\x3c","\x3c",993667236,null),Lg=new v(null,"transform","transform",1381301764),ua=new v(null,"meta","meta",1499536964),Mg=new v(null,"dx","dx",-381796732),Ng=new v(null,
"ul","ul",-1349521403),Og=new H(null,"blockable","blockable",-28395259,null),va=new v(null,"dup","dup",556298533),Pg=new v(null,"private","private",-558947994),Qg=new v(null,"scale","scale",-230427353),Rg=new v(null,"button","button",1456579943),Ae=new H(null,"new-value","new-value",-1567397401,null),le=new H(null,"meta19413","meta19413",83357223,null),we=new v(null,"validator","validator",-1966190681),Sg=new v(null,"default","default",-1987822328),Tg=new H(null,"meta15466","meta15466",-1740597976,
null),Ug=new v(null,"finally-block","finally-block",832982472),Vg=new v(null,"li","li",723558921),Wg=new v(null,"fill","fill",883462889),Xg=new v(null,"y1","y1",589123466),Yg=new v(null,"width","width",-384071477),Zg=new v(null,"onclick","onclick",1297553739),$g=new v(null,"dy","dy",1719547243),vg=new v(null,"val","val",128701612),Z=new v(null,"recur","recur",-437573268),ah=new v(null,"update","update",1045576396),bh=new v(null,"catch-block","catch-block",1175212748),ze=new H(null,"validate","validate",
1439230700,null),ch=new H(null,"\x3e","\x3e",1085014381,null),ug=new v(null,"fallback-impl","fallback-impl",-1501286995),sa=new v(null,"flush-on-newline","flush-on-newline",-151457939),dh=new v(null,"className","className",-1983287057),eh=new v(null,"no-op","no-op",-93046065),fh=new v(null,"textarea","textarea",-650375824),Fe=new H(null,"n","n",-2092305744,null),gh=new v(null,"div","div",1057191632),ta=new v(null,"readably","readably",1129599760),hh=new H(null,"box","box",-1123515375,null),mg=new v(null,
"more-marker","more-marker",-14717935),ih=new v(null,"g","g",1738089905),jh=new H(null,"nil?","nil?",1612038930,null),kh=new v(null,"line","line",212345235),lh=new H(null,"val","val",1769233139,null),mh=new H(null,"not","not",1044554643,null),wa=new v(null,"print-length","print-length",1931866356),nh=new v(null,"raw-data","raw-data",617791828),oh=new v(null,"id","id",-1388402092),ph=new v(null,"class","class",-2030961996),qh=new v(null,"catch-exception","catch-exception",-1997306795),rh=new v(null,
"prev","prev",-1597069226),sh=new v(null,"svg","svg",856789142),th=new H(null,"buf-or-n","buf-or-n",-1646815050,null),uh=new v(null,"continue-block","continue-block",-1852047850),vh=new H(null,"meta18334","meta18334",-513147657,null),wh=new v(null,"d","d",1972142424),xh=new v(null,"h2","h2",-372662728),yh=new v(null,"x1","x1",-1863922247),zh=new v(null,"domain","domain",1847214937),Ah=new H(null,"meta18271","meta18271",-270789639,null),ke=new H(null,"quote","quote",1377916282,null),Bh=new v(null,
"h1","h1",-1896887462),je=new v(null,"arglists","arglists",1661989754),Ch=new v(null,"y2","y2",-718691301),ie=new H(null,"nil-iter","nil-iter",1101030523,null),Dh=new v(null,"main","main",-2117802661),tg=new v(null,"alt-impl","alt-impl",670969595),Eh=new H(null,"fn-handler","fn-handler",648785851,null),Fh=new v(null,"rect","rect",-108902628),Gh=new H(null,"takes","takes",298247964,null),Hh=new H("impl","MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null),Ih=new v(null,"p","p",151049309),Jh=new v(null,
"x2","x2",-1362513475),Ee=new H(null,"number?","number?",-1747282210,null),Kh=new v(null,"height","height",1025178622),Lh=new v(null,"foreignObject","foreignObject",25502111),Mh=new v(null,"text","text",-1790561697),Nh=new H(null,"f","f",43394975,null);var Oh,Ph=function Ph(b,c){if(null!=b&&null!=b.Tb)return b.Tb(0,c);var d=Ph[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ph._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("ReadPort.take!",b);},Qh=function Qh(b,c,d){if(null!=b&&null!=b.Ib)return b.Ib(0,c,d);var e=Qh[n(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Qh._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw x("WritePort.put!",b);},Rh=function Rh(b){if(null!=b&&null!=b.Hb)return b.Hb();
var c=Rh[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Rh._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("Channel.close!",b);},Sh=function Sh(b){if(null!=b&&null!=b.fc)return!0;var c=Sh[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Sh._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("Handler.active?",b);},Uh=function Uh(b){if(null!=b&&null!=b.gc)return b.sa;var c=Uh[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Uh._;if(null!=c)return c.a?
c.a(b):c.call(null,b);throw x("Handler.commit",b);},Vh=function Vh(b,c){if(null!=b&&null!=b.ec)return b.ec(0,c);var d=Vh[n(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Vh._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw x("Buffer.add!*",b);},Wh=function Wh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Wh.a(arguments[0]);case 2:return Wh.b(arguments[0],arguments[1]);default:throw Error([y("Invalid arity: "),
y(c.length)].join(""));}};Wh.a=function(a){return a};Wh.b=function(a,b){if(null==b)throw Error([y("Assert failed: "),y(xe.h(mc([bc(mh,bc(jh,Gg))],0)))].join(""));return Vh(a,b)};Wh.u=2;var Xh;a:{var Yh=aa.navigator;if(Yh){var Zh=Yh.userAgent;if(Zh){Xh=Zh;break a}}Xh=""};var $h,ai=function ai(b){"undefined"===typeof $h&&($h=function(b,d,e){this.Ec=b;this.sa=d;this.Gc=e;this.i=393216;this.A=0},$h.prototype.N=function(b,d){return new $h(this.Ec,this.sa,d)},$h.prototype.M=function(){return this.Gc},$h.prototype.fc=function(){return!0},$h.prototype.Sb=function(){return!0},$h.prototype.gc=function(){return this.sa},$h.Ub=function(){return new W(null,3,5,X,[Ac(Eh,new q(null,2,[Pg,!0,je,bc(ke,bc(new W(null,1,5,X,[Nh],null)))],null)),Nh,Ah],null)},$h.yb=!0,$h.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270",
$h.Jb=function(b,d){return F(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270")});return new $h(ai,b,ne)};function bi(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].Hb(),b;}}function ci(a,b,c){c=c.Tb(0,ai(function(c){a[2]=c;a[1]=b;return bi(a)}));return t(c)?(a[2]=P.a?P.a(c):P.call(null,c),a[1]=b,Z):null}function di(a,b,c){b=b.Ib(0,c,ai(function(b){a[2]=b;a[1]=16;return bi(a)}));return t(b)?(a[2]=P.a?P.a(b):P.call(null,b),a[1]=16,Z):null}
function ei(a,b){var c=a[6];null!=b&&c.Ib(0,b,ai(function(){return function(){return null}}(c)));c.Hb();return c}function fi(a,b,c,d,e,f,h,k){this.ya=a;this.za=b;this.Ba=c;this.Aa=d;this.Da=e;this.ja=f;this.W=h;this.o=k;this.i=2229667594;this.A=8192}g=fi.prototype;g.K=function(a,b){return Za.c(this,b,null)};
g.H=function(a,b,c){switch(b instanceof v?b.ta:null){case "catch-block":return this.ya;case "catch-exception":return this.za;case "finally-block":return this.Ba;case "continue-block":return this.Aa;case "prev":return this.Da;default:return I.c(this.W,b,c)}};
g.L=function(a,b,c){return ff(b,function(){return function(a){return ff(b,Y,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,ce.b(new W(null,5,5,X,[new W(null,2,5,X,[bh,this.ya],null),new W(null,2,5,X,[qh,this.za],null),new W(null,2,5,X,[Ug,this.Ba],null),new W(null,2,5,X,[uh,this.Aa],null),new W(null,2,5,X,[rh,this.Da],null)],null),this.W))};g.ra=function(){return new rf(0,this,5,new W(null,5,5,X,[bh,qh,Ug,uh,rh],null),Tb(this.W))};g.M=function(){return this.ja};
g.V=function(){return 5+T(this.W)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=Kd(this)};g.v=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qf(this,b):c:b;return t(c)?!0:!1};g.sb=function(a,b){return nd(new cg(null,new q(null,5,[Ug,null,bh,null,qh,null,rh,null,uh,null],null),null),b)?Zc.b(Ac(Oe(ne,this),this.ja),b):new fi(this.ya,this.za,this.Ba,this.Aa,this.Da,this.ja,ge(Zc.b(this.W,b)),null)};
g.Fa=function(a,b,c){return t(Rd.b?Rd.b(bh,b):Rd.call(null,bh,b))?new fi(c,this.za,this.Ba,this.Aa,this.Da,this.ja,this.W,null):t(Rd.b?Rd.b(qh,b):Rd.call(null,qh,b))?new fi(this.ya,c,this.Ba,this.Aa,this.Da,this.ja,this.W,null):t(Rd.b?Rd.b(Ug,b):Rd.call(null,Ug,b))?new fi(this.ya,this.za,c,this.Aa,this.Da,this.ja,this.W,null):t(Rd.b?Rd.b(uh,b):Rd.call(null,uh,b))?new fi(this.ya,this.za,this.Ba,c,this.Da,this.ja,this.W,null):t(Rd.b?Rd.b(rh,b):Rd.call(null,rh,b))?new fi(this.ya,this.za,this.Ba,this.Aa,
c,this.ja,this.W,null):new fi(this.ya,this.za,this.Ba,this.Aa,this.Da,this.ja,Xc.c(this.W,b,c),null)};g.R=function(){return L(ce.b(new W(null,5,5,X,[new W(null,2,5,X,[bh,this.ya],null),new W(null,2,5,X,[qh,this.za],null),new W(null,2,5,X,[Ug,this.Ba],null),new W(null,2,5,X,[uh,this.Aa],null),new W(null,2,5,X,[rh,this.Da],null)],null),this.W))};g.N=function(a,b){return new fi(this.ya,this.za,this.Ba,this.Aa,this.Da,b,this.W,this.o)};
g.T=function(a,b){return ed(b)?ab(this,C.b(b,0),C.b(b,1)):Ia.c(Pa,this,b)};
function gi(a){for(;;){var b=a[4],c=bh.a(b),d=qh.a(b),e=a[5];if(t(function(){var a=e;return t(a)?Da(b):a}()))throw e;if(t(function(){var a=e;return t(a)?(a=c,t(a)?cc.b(Sg,d)||e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Xc.h(b,bh,null,mc([qh,null],0));break}if(t(function(){var a=e;return t(a)?Da(c)&&Da(Ug.a(b)):a}()))a[4]=rh.a(b);else{if(t(function(){var a=e;return t(a)?(a=Da(c))?Ug.a(b):a:a}())){a[1]=Ug.a(b);a[4]=Xc.c(b,Ug,null);break}if(t(function(){var a=Da(e);return a?Ug.a(b):a}())){a[1]=
Ug.a(b);a[4]=Xc.c(b,Ug,null);break}if(Da(e)&&Da(Ug.a(b))){a[1]=uh.a(b);a[4]=rh.a(b);break}throw Error("No matching clause");}}};function hi(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function ii(a,b,c,d){this.head=a;this.J=b;this.length=c;this.f=d}ii.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.J];this.f[this.J]=null;this.J=(this.J+1)%this.f.length;--this.length;return a};ii.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function ji(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
ii.prototype.resize=function(){var a=Array(2*this.f.length);return this.J<this.head?(hi(this.f,this.J,a,0,this.length),this.J=0,this.head=this.length,this.f=a):this.J>this.head?(hi(this.f,this.J,a,0,this.f.length-this.J),hi(this.f,0,a,this.f.length-this.J,this.head),this.J=0,this.head=this.length,this.f=a):this.J===this.head?(this.head=this.J=0,this.f=a):null};function ki(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.a?b.a(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function li(a){if(!(0<a))throw Error([y("Assert failed: "),y("Can't create a ring buffer of size 0"),y("\n"),y(xe.h(mc([bc(ch,Fe,0)],0)))].join(""));return new ii(0,0,0,Array(a))}function mi(a,b){this.G=a;this.n=b;this.i=2;this.A=0}function ni(a){return a.G.length===a.n}mi.prototype.ec=function(a,b){ji(this.G,b);return this};mi.prototype.V=function(){return this.G.length};if("undefined"===typeof oi)var oi={};var pi;
function qi(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Xh.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=fa(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==Xh.indexOf("Trident")&&-1==Xh.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Yb;c.Yb=null;a()}};return function(a){d.next={Yb:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var ri=li(32),si=!1,ti=!1;ui;function vi(){si=!0;ti=!1;for(var a=0;;){var b=ri.pop();if(null!=b&&(b.s?b.s():b.call(null),1024>a)){a+=1;continue}break}si=!1;return 0<ri.length?ui.s?ui.s():ui.call(null):null}function ui(){var a=ti;if(t(t(a)?si:a))return null;ti=!0;"function"!=n(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(pi||(pi=qi()),pi(vi)):aa.setImmediate(vi)}function wi(a){ji(ri,a);ui()};var xi,yi=function yi(b){"undefined"===typeof xi&&(xi=function(b,d,e){this.kc=b;this.C=d;this.Hc=e;this.i=425984;this.A=0},xi.prototype.N=function(b,d){return new xi(this.kc,this.C,d)},xi.prototype.M=function(){return this.Hc},xi.prototype.rb=function(){return this.C},xi.Ub=function(){return new W(null,3,5,X,[Ac(hh,new q(null,1,[je,bc(ke,bc(new W(null,1,5,X,[lh],null)))],null)),lh,vh],null)},xi.yb=!0,xi.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333",xi.Jb=function(b,d){return F(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333")});return new xi(yi,b,ne)};function zi(a,b){this.zb=a;this.C=b}function Ai(a){return Sh(a.zb)}var Bi=function Bi(b){if(null!=b&&null!=b.dc)return b.dc();var c=Bi[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Bi._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("MMC.abort",b);};function Ci(a,b,c,d,e,f,h){this.ib=a;this.Lb=b;this.Ya=c;this.Kb=d;this.G=e;this.closed=f;this.qa=h}
Ci.prototype.dc=function(){for(;;){var a=this.Ya.pop();if(null!=a){var b=a.zb;wi(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(b.sa,b,a.C,a,this))}break}ki(this.Ya,re());return Rh(this)};
Ci.prototype.Ib=function(a,b,c){var d=this;if(null==b)throw Error([y("Assert failed: "),y("Can't put nil in on a channel"),y("\n"),y(xe.h(mc([bc(mh,bc(jh,lh))],0)))].join(""));if(a=d.closed)return yi(!a);if(t(function(){var a=d.G;return t(a)?Da(ni(d.G)):a}())){for(c=Cc(d.qa.b?d.qa.b(d.G,b):d.qa.call(null,d.G,b));;){if(0<d.ib.length&&0<T(d.G)){var e=d.ib.pop(),f=e.sa,h=d.G.G.pop();wi(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(f,h,e,c,a,this))}break}c&&Bi(this);return yi(!0)}e=
function(){for(;;){var a=d.ib.pop();if(t(a)){if(t(!0))return a}else return null}}();if(t(e))return c=Uh(e),wi(function(a){return function(){return a.a?a.a(b):a.call(null,b)}}(c,e,a,this)),yi(!0);64<d.Kb?(d.Kb=0,ki(d.Ya,Ai)):d.Kb+=1;if(t(c.Sb(null))){if(!(1024>d.Ya.length))throw Error([y("Assert failed: "),y([y("No more than "),y(1024),y(" pending puts are allowed on a single channel."),y(" Consider using a windowed buffer.")].join("")),y("\n"),y(xe.h(mc([bc(Kg,bc(Hg,Ig),Hh)],0)))].join(""));ji(d.Ya,
new zi(c,b))}return null};
Ci.prototype.Tb=function(a,b){var c=this;if(null!=c.G&&0<T(c.G)){for(var d=b.sa,e=yi(c.G.G.pop());;){if(!t(ni(c.G))){var f=c.Ya.pop();if(null!=f){var h=f.zb,k=f.C;wi(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(h.sa,h,k,f,d,e,this));Cc(c.qa.b?c.qa.b(c.G,k):c.qa.call(null,c.G,k))&&Bi(this);continue}}break}return e}d=function(){for(;;){var a=c.Ya.pop();if(t(a)){if(Sh(a.zb))return a}else return null}}();if(t(d))return e=Uh(d.zb),wi(function(a){return function(){return a.a?a.a(!0):
a.call(null,!0)}}(e,d,this)),yi(d.C);if(t(c.closed))return t(c.G)&&(c.qa.a?c.qa.a(c.G):c.qa.call(null,c.G)),t(t(!0)?b.sa:!0)?(d=function(){var a=c.G;return t(a)?0<T(c.G):a}(),d=t(d)?c.G.G.pop():null,yi(d)):null;64<c.Lb?(c.Lb=0,ki(c.ib,Sh)):c.Lb+=1;if(t(b.Sb(null))){if(!(1024>c.ib.length))throw Error([y("Assert failed: "),y([y("No more than "),y(1024),y(" pending takes are allowed on a single channel.")].join("")),y("\n"),y(xe.h(mc([bc(Kg,bc(Hg,Gh),Hh)],0)))].join(""));ji(c.ib,b)}return null};
Ci.prototype.Hb=function(){var a=this;if(!a.closed)for(a.closed=!0,t(function(){var b=a.G;return t(b)?0===a.Ya.length:b}())&&(a.qa.a?a.qa.a(a.G):a.qa.call(null,a.G));;){var b=a.ib.pop();if(null==b)break;else{var c=b.sa,d=t(function(){var b=a.G;return t(b)?0<T(a.G):b}())?a.G.G.pop():null;wi(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(c,d,b,this))}}return null};function Di(a){console.log(a);return null}
function Ei(a,b){var c=(t(null)?null:Di).call(null,b);return null==c?a:Wh.b(a,c)}
function Fi(a){return new Ci(li(32),0,li(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.b?a.b(c,d):a.call(null,c,d)}catch(e){return Ei(c,e)}}function d(c){try{return a.a?a.a(c):a.call(null,c)}catch(d){return Ei(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.a=d;e.b=c;return e}()}(t(null)?null.a?null.a(Wh):null.call(null,Wh):Wh)}())};for(var Gi=Array(1),Hi=0;;)if(Hi<Gi.length)Gi[Hi]=null,Hi+=1;else break;function Ii(a){"undefined"===typeof Oh&&(Oh=function(a,c,d){this.sa=a;this.Xb=c;this.Fc=d;this.i=393216;this.A=0},Oh.prototype.N=function(a,c){return new Oh(this.sa,this.Xb,c)},Oh.prototype.M=function(){return this.Fc},Oh.prototype.fc=function(){return!0},Oh.prototype.Sb=function(){return this.Xb},Oh.prototype.gc=function(){return this.sa},Oh.Ub=function(){return new W(null,3,5,X,[Nh,Og,Tg],null)},Oh.yb=!0,Oh.eb="cljs.core.async/t_cljs$core$async15465",Oh.Jb=function(a,c){return F(c,"cljs.core.async/t_cljs$core$async15465")});
return new Oh(a,!0,ne)}function Ji(a){a=cc.b(a,0)?null:a;if(t(null)&&!t(a))throw Error([y("Assert failed: "),y("buffer must be supplied when transducer is"),y("\n"),y(xe.h(mc([th],0)))].join(""));a="number"===typeof a?new mi(li(a),a):a;return Fi(a)}function Ki(a,b){var c=Ph(a,Ii(b));if(t(c)){var d=P.a?P.a(c):P.call(null,c);t(!0)?b.a?b.a(d):b.call(null,d):wi(function(a){return function(){return b.a?b.a(a):b.call(null,a)}}(d,c))}return null}var Li;Li=Ii(function(){return null});
function Mi(a,b){var c=Qh(a,b,Li);return t(c)?P.a?P.a(c):P.call(null,c):!0}
function Ni(a){var b=ud(new W(null,1,5,X,[Oi],null)),c=Ji(null),d=T(b),e=$d(d),f=Ji(1),h=ve.a?ve.a(null):ve.call(null,null),k=Pe(function(a,b,c,d,e,f){return function(h){return function(a,b,c,d,e,f){return function(a){d[h]=a;return 0===Be.b(f,Ad)?Mi(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,h),new hg(null,0,d,1,null)),l=Ji(1);wi(function(b,c,d,e,f,h,k,l){return function(){var J=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Rd(e,Z)){d=
e;break a}}}catch(f){if(f instanceof Object)c[5]=f,gi(c),d=Z;else throw f;}if(!Rd(d,Z))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.s=c;d.a=b;return d}()}(function(b,c,d,e,f,h,k,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,Z;if(1===f)return b[2]=
null,b[1]=2,Z;if(4===f){var m=b[7],f=m<e;b[1]=t(f)?6:7;return Z}if(15===f)return f=b[2],b[2]=f,b[1]=3,Z;if(13===f)return f=Rh(d),b[2]=f,b[1]=15,Z;if(6===f)return b[2]=null,b[1]=11,Z;if(3===f)return f=b[2],ei(b,f);if(12===f){f=b[8];f=b[2];a:for(var m=f,u=Ba;;)if(L(m)){var p;p=M(m);p=u.a?u.a(p):u.call(null,p);if(t(p)){m=p;break a}m=O(m)}else{m=null;break a}b[8]=f;b[1]=t(m)?13:14;return Z}return 2===f?(f=ye.b?ye.b(k,e):ye.call(null,k,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,Z):11===f?(m=b[7],b[4]=new fi(10,
Object,null,9,b[4],null,null,null),f=c.a?c.a(m):c.call(null,m),m=l.a?l.a(m):l.call(null,m),f=Ki(f,m),b[2]=f,gi(b),Z):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,Z):5===f?(b[11]=b[2],ci(b,12,h)):14===f?(f=b[8],f=B.b(a,f),di(b,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,Z):10===f?(m=b[2],f=Be.b(k,Ad),b[13]=m,b[2]=f,gi(b),Z):8===f?(f=b[2],b[2]=f,b[1]=5,Z):null}}(b,c,d,e,f,h,k,l),b,c,d,e,f,h,k,l)}(),S=function(){var a=J.s?J.s():J.call(null);a[6]=b;return a}();return bi(S)}}(l,b,c,d,e,f,h,k));return c}
;var Pi=VDOM.diff,Qi=VDOM.patch,Ri=VDOM.create;function Si(a){return Me(qe(Ba),Me(qe(ld),Ne(a)))}function Ti(a,b,c){return new VDOM.VHtml(Hd(a),Bg(b),Bg(c))}function Ui(a,b,c){return new VDOM.VSvg(Hd(a),Bg(b),Bg(c))}Vi;
var Wi=function Wi(b){if(null==b)return new VDOM.VText("");if(ld(b))return Ti(gh,ne,V.b(Wi,Si(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.b(sh,M(b)))return Vi.a?Vi.a(b):Vi.call(null,b);var c=U(b,0),d=U(b,1);b=Gd(b);return Ti(c,d,V.b(Wi,Si(b)))},Vi=function Vi(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(cc.b(Lh,M(b))){var c=U(b,0),d=U(b,1);b=Gd(b);return Ui(c,d,V.b(Wi,Si(b)))}c=U(b,0);d=U(b,1);b=
Gd(b);return Ui(c,d,V.b(Vi,Si(b)))};
function Xi(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return ve.a?ve.a(a):ve.call(null,a)}(),c=function(){var a;a=P.a?P.a(b):P.call(null,b);a=Ri.a?Ri.a(a):Ri.call(null,a);return ve.a?ve.a(a):ve.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.s?a.s():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(P.a?P.a(c):P.call(null,c));return function(a,b,c){return function(d){var l=
Wi(d);d=function(){var b=P.a?P.a(a):P.call(null,a);return Pi.b?Pi.b(b,l):Pi.call(null,b,l)}();ye.b?ye.b(a,l):ye.call(null,a,l);d=function(a,b,c,d){return function(){return Be.c(d,Qi,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};var Yi=Error();function Zi(a,b){for(var c=new ia,d=L(b);;)if(null!=d)c.append(""+y(M(d))),d=O(d),null!=d&&c.append(a);else return c.toString()}function $i(a,b){a:for(var c="/(?:)/"===""+y(b)?Rc.b(ud(Q("",V.b(y,L(a)))),""):ud((""+y(a)).split(b));;)if(""===(null==c?null:ib(c)))c=null==c?null:jb(c);else break a;return c};function aj(){var a=bj,b=cj,c=dj,d=Ji(null);Mi(d,b);var e=Ji(1);wi(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Rd(e,Z)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,gi(c),d=Z;else throw f;}if(!Rd(d,Z))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.s=c;d.a=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return ci(d,2,c);if(2===f){var h=b,f=d[2];d[7]=f;d[8]=h;d[2]=null;d[1]=3;return Z}return 3===f?(f=d[7],h=d[9],h=d[8],f=a.b?a.b(h,f):a.call(null,h,f),h=Mi(e,f),d[9]=f,d[10]=h,ci(d,5,c)):4===f?(f=d[2],ei(d,f)):5===f?(h=d[9],f=d[2],d[7]=f,d[8]=h,d[2]=null,d[1]=3,Z):null}}(d,e),d,e)}(),l=function(){var a=k.s?k.s():k.call(null);a[6]=d;return a}();return bi(l)}}(e,d));return d}
function ej(){var a=fj,b=Xi(),c=Ji(1);wi(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Rd(e,Z)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,gi(c),d=Z;else throw f;}if(!Rd(d,Z))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.s=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Z):2===d?ci(c,4,a):3===d?(d=c[2],ei(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=t(d)?5:6,Z):5===d?(d=c[7],d=b.a?b.a(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,Z):6===d?(c[2]=null,c[1]=7,Z):7===d?(d=c[2],c[2]=d,c[1]=3,Z):null}}(c),c)}(),f=function(){var a=e.s?e.s():e.call(null);a[6]=c;return a}();return bi(f)}}(c));return c};var gj=function gj(b){if(null!=b&&null!=b.lc)return b.domain;var c=gj[n(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=gj._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw x("IScale.-domain",b);};function hj(a,b,c,d,e){this.domain=a;this.Ua=b;this.ja=c;this.W=d;this.o=e;this.i=2229667595;this.A=8192}g=hj.prototype;g.K=function(a,b){return Za.c(this,b,null)};
g.H=function(a,b,c){switch(b instanceof v?b.ta:null){case "domain":return this.domain;case "rng":return this.Ua;default:return I.c(this.W,b,c)}};g.L=function(a,b,c){return ff(b,function(){return function(a){return ff(b,Y,""," ","",c,a)}}(this),"#burn.scale.Linear{",", ","}",c,ce.b(new W(null,2,5,X,[new W(null,2,5,X,[zh,this.domain],null),new W(null,2,5,X,[Dg,this.Ua],null)],null),this.W))};g.ra=function(){return new rf(0,this,2,new W(null,2,5,X,[zh,Dg],null),Tb(this.W))};g.M=function(){return this.ja};
g.V=function(){return 2+T(this.W)};g.O=function(){var a=this.o;return null!=a?a:this.o=a=Kd(this)};g.v=function(a,b){var c;c=t(b)?(c=this.constructor===b.constructor)?qf(this,b):c:b;return t(c)?!0:!1};g.lc=function(){return this.domain};g.sb=function(a,b){return nd(new cg(null,new q(null,2,[Dg,null,zh,null],null),null),b)?Zc.b(Ac(Oe(ne,this),this.ja),b):new hj(this.domain,this.Ua,this.ja,ge(Zc.b(this.W,b)),null)};
g.Fa=function(a,b,c){return t(Rd.b?Rd.b(zh,b):Rd.call(null,zh,b))?new hj(c,this.Ua,this.ja,this.W,null):t(Rd.b?Rd.b(Dg,b):Rd.call(null,Dg,b))?new hj(this.domain,c,this.ja,this.W,null):new hj(this.domain,this.Ua,this.ja,Xc.c(this.W,b,c),null)};g.R=function(){return L(ce.b(new W(null,2,5,X,[new W(null,2,5,X,[zh,this.domain],null),new W(null,2,5,X,[Dg,this.Ua],null)],null),this.W))};g.N=function(a,b){return new hj(this.domain,this.Ua,b,this.W,this.o)};
g.T=function(a,b){return ed(b)?ab(this,C.b(b,0),C.b(b,1)):Ia.c(Pa,this,b)};g.call=function(a,b){a=this;var c=a.domain,d=U(c,0),e=U(c,1),f=a.Ua,c=U(f,0),e=(U(f,1)-c)/(e-d);return e*b+(c-e*d)};g.apply=function(a,b){return this.call.apply(this,[this].concat(Ha(b)))};g.a=function(a){var b=this.domain,c=U(b,0),d=U(b,1),e=this.Ua,b=U(e,0),d=(U(e,1)-b)/(d-c);return d*a+(b-d*c)};function ij(a,b){return new hj(a,b,null,null,null)};na=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,ya.a?ya.a(a):ya.call(null,a))}a.u=0;a.w=function(a){a=L(a);return b(a)};a.h=b;return a}();
oa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,ya.a?ya.a(a):ya.call(null,a))}a.u=0;a.w=function(a){a=L(a);return b(a)};a.h=b;return a}();function jj(a){var b=$i(a,/\//);a=U(b,0);var c=U(b,1),b=U(b,2);return new Date(2E3+(b|0),(a|0)-1,c|0)}
function kj(a){return V.b(function(a){return Qe(Qe(Qe($i(a,/,/),0,jj),1,Dd),2,Dd)},$i(a,/\n/))}function lj(a,b){return[y("translate("),y(a),y(","),y(b),y(")")].join("")}function mj(a,b){return new W(null,2,5,X,[B.c(fg,a,b),B.c(eg,a,b)],null)}function nj(a){return a.getTime()}function oj(a){return[y("M"),y(Zi("",Ke(V.b(function(a){return Zi(",",a)},a))))].join("")}function pj(a){return Ia.b(xd,a)/T(a)}function lg(a){return Vc(a,2)}function qj(a){var b=new Date;b.setTime(a);return b}
function rj(a){return[y(a.getMonth()+1),y("/"),y(a.getDate()),y("/"),y(a.getFullYear()-2E3)].join("")}function sj(a){var b=U(a,0),c=U(a,1);a=(c-b)/20;var d=Math.log(a)/Math.log(10),d=Math.pow(10,Math.floor(d)),c=c+1;a/=d;return t(zd.b?zd.b(5,a):zd.call(null,5,a))?new hg(null,b,c,10*d,null):t(zd.b?zd.b(2,a):zd.call(null,2,a))?new hg(null,b,c,5*d,null):t(zd.b?zd.b(1,a):zd.call(null,1,a))?new hg(null,b,c,2*d,null):new hg(null,b,c,d,null)}
function tj(a,b,c){return new W(null,4,5,X,[ih,ne,new W(null,4,5,X,[ih,ne,new W(null,2,5,X,[kh,new q(null,2,[ph,"axis",Ch,b.a?b.a(0):b.call(null,0)],null)],null),function(){var c=gj(a),e=U(c,0),f=U(c,1),h=(f-e)/6048E5,k=6048E5*Math.ceil(h/14);return function(c,d,e,f,h,k){return function D(G){return new Td(null,function(){return function(){for(;;){var c=L(G);if(c){if(hd(c)){var d=Ob(c),e=T(d),f=Xd(e);a:for(var h=0;;)if(h<e){var k=C.b(d,h),k=new W(null,3,5,X,[Mh,new q(null,3,[Lg,lj(a.a?a.a(k):a.call(null,
k),b.a?b.a(0):b.call(null,0)),$g,25,Eg,"middle"],null),rj(qj(k))],null);f.add(k);h+=1}else{d=!0;break a}return d?Yd(f.ca(),D(Pb(c))):Yd(f.ca(),null)}f=M(c);return Q(new W(null,3,5,X,[Mh,new q(null,3,[Lg,lj(a.a?a.a(f):a.call(null,f),b.a?b.a(0):b.call(null,0)),$g,25,Eg,"middle"],null),rj(qj(f))],null),D(oc(c)))}return null}}}(c,d,e,f,h,k),null,null)}}(c,e,f,6048E5,h,k)(new hg(null,e,f,k,null))}()],null),new W(null,4,5,X,[ih,ne,new W(null,2,5,X,[kh,new q(null,3,[ph,"axis",Lg,lj(0,b.a?b.a(0):b.call(null,
0)),Jh,function(){var b=nj(c);return a.a?a.a(b):a.call(null,b)}()],null)],null),function(){var a=gj(b),c=U(a,0),f=U(a,1);return function(a,c,d){return function m(e){return new Td(null,function(){return function(){for(;;){var a=L(e);if(a){if(hd(a)){var c=Ob(a),d=T(c),f=Xd(d);a:for(var h=0;;)if(h<d){var k=C.b(c,h),k=new W(null,3,5,X,[Mh,new q(null,4,[Lg,lj(0,b.a?b.a(k):b.call(null,k)),Mg,-13,$g,6,Eg,"end"],null),k],null);f.add(k);h+=1}else{c=!0;break a}return c?Yd(f.ca(),m(Pb(a))):Yd(f.ca(),null)}f=
M(a);return Q(new W(null,3,5,X,[Mh,new q(null,4,[Lg,lj(0,b.a?b.a(f):b.call(null,f)),Mg,-13,$g,6,Eg,"end"],null),f],null),m(oc(a)))}return null}}}(a,c,d),null,null)}}(a,c,f)(sj(new W(null,2,5,X,[c,f],null)))}()],null)],null)}
function uj(a,b,c,d){var e=ce.b(function(){return function h(c){return new Td(null,function(){for(;;){var d=L(c);if(d){if(hd(d)){var e=Ob(d),m=T(e),r=Xd(m);return function(){for(var c=0;;)if(c<m){var d=C.b(e,c),h=U(d,0);U(d,1);var k=U(d,2),d=r,l=X,h=nj(h),h=a.a?a.a(h):a.call(null,h),k=new W(null,2,5,l,[h,b.a?b.a(k):b.call(null,k)],null);d.add(k);c+=1}else return!0}()?Yd(r.ca(),h(Pb(d))):Yd(r.ca(),null)}var u=M(d),z=U(u,0);U(u,1);u=U(u,2);return Q(new W(null,2,5,X,[function(){var b=nj(z);return a.a?
a.a(b):a.call(null,b)}(),b.a?b.a(u):b.call(null,u)],null),h(oc(d)))}return null}},null,null)}(d)}(),new W(null,1,5,X,[new W(null,2,5,X,[function(){var b=nj(c);return a.a?a.a(b):a.call(null,b)}(),function(){var a=lg(Qc(d));return b.a?b.a(a):b.call(null,a)}()],null)],null));return new W(null,2,5,X,[Fg,new q(null,2,[ph,"scope",wh,oj(e)],null)],null)}
function vj(a,b,c){return new W(null,2,5,X,[Fg,new q(null,2,[ph,"progress",wh,oj(function(){return function e(c){return new Td(null,function(){for(;;){var h=L(c);if(h){if(hd(h)){var k=Ob(h),l=T(k),p=Xd(l);return function(){for(var c=0;;)if(c<l){var e=C.b(k,c),f=U(e,0),h=U(e,1),e=p,m=X,f=nj(f),f=a.a?a.a(f):a.call(null,f),h=new W(null,2,5,m,[f,b.a?b.a(h):b.call(null,h)],null);e.add(h);c+=1}else return!0}()?Yd(p.ca(),e(Pb(h))):Yd(p.ca(),null)}var m=M(h),r=U(m,0),m=U(m,1);return Q(new W(null,2,5,X,[function(){var b=
nj(r);return a.a?a.a(b):a.call(null,b)}(),b.a?b.a(m):b.call(null,m)],null),e(oc(h)))}return null}},null,null)}(c)}())],null)],null)}
function wj(a,b,c,d){var e=Qc(d);return new W(null,2,5,X,[kh,new q(null,5,[ph,"projection",yh,function(){var b=nj(M.a?M.a(e):M.call(null,e));return a.a?a.a(b):a.call(null,b)}(),Xg,function(){var a=Pc.a?Pc.a(e):Pc.call(null,e);return b.a?b.a(a):b.call(null,a)}(),Jh,function(){var b=nj(c);return a.a?a.a(b):a.call(null,b)}(),Ch,function(){var a=lg(e);return b.a?b.a(a):b.call(null,a)}()],null)],null)}
function xj(a){return B.b(ce,V.c(function(a,c){var d=U(a,0),e=U(c,0),f=U(c,1),d=Math.round((nj(e)-nj(d))/864E5);return De(d,Ie(f/d))},a,Ge(1,a)))}function yj(a,b){var c=U(a,0),d=U(a,1),e=rd(dc,b),f=T(e);return new W(null,2,5,X,[pj(He(Math.round(c*f),e)),pj(Ge(Math.round(d*f),e))],null)}function zj(a,b,c){return sd(nj,V.b(function(c){var e=new Date;e.setTime(nj(a)+b/c*864E5);return e},yj(new W(null,2,5,X,[.2,.2],null),xj(c))))}
function Aj(a){a=sd(se.b(nj,M),a);var b=ig(function(){return function(a,b){U(a,0);var c=U(a,1);U(a,2);var d=U(b,0),e=U(b,1),f=U(b,2);return new W(null,3,5,X,[d,c+e,f],null)}}(a),a),c=Qc(a),d=new W(null,2,5,X,[960,500],null),e=U(d,0),d=U(d,1),f=mj(nj,V.b(M,a)),h=U(f,0);U(f,1);var f=zj(M.a?M.a(c):M.call(null,c),B.b(yd,kg().call(null,c)),a),k=U(f,0),l=U(f,1),p=new W(null,2,5,X,[0,B.b(Bd,V.b(lg,a))],null),f=U(p,0),p=U(p,1),m=ij(new W(null,2,5,X,[nj(h),nj(l)],null),new W(null,2,5,X,[0,e-100],null)),r=
ij(new W(null,2,5,X,[f,p],null),new W(null,2,5,X,[d-40,0],null));return new W(null,4,5,X,[sh,new q(null,4,[Yg,e,Kh,d,oh,"visualization",ph,"bordered"],null),new W(null,2,5,X,[Fh,new q(null,3,[Yg,e,Kh,d,Wg,"white"],null)],null),new W(null,9,5,X,[ih,new q(null,1,[Lg,lj(50,5)],null),tj(m,r,l),new W(null,3,5,X,[Mh,new q(null,3,[Lg,lj(function(){var a=nj(k);return m.a?m.a(a):m.call(null,a)}(),function(){var a=lg(c);return r.a?r.a(a):r.call(null,a)}()),Eg,"middle",$g,-5],null),rj(k)],null),new W(null,3,
5,X,[Mh,new q(null,3,[Lg,lj(function(){var a=nj(l);return m.a?m.a(a):m.call(null,a)}(),function(){var a=lg(c);return r.a?r.a(a):r.call(null,a)}()),Eg,"middle",$g,-5],null),rj(l)],null),uj(m,r,l,a),vj(m,r,b),wj(m,r,k,b),wj(m,r,l,b)],null)],null)}
function Bj(a){var b=Cj,c=null!=a&&(a.i&64||a.$a)?B.b(yc,a):a,d=I.b(c,nh),e=d.trim();return new W(null,9,5,X,[Dh,ne,new W(null,3,5,X,[gh,new q(null,1,[dh,"right"],null),new W(null,3,5,X,[Rg,new q(null,1,[Zg,function(){return function(){var a=document.getElementById("visualization"),b=Bg(new q(null,1,[Qg,4],null));return saveSvgAsPng(a,"burn-chart",b)}}(e,a,c,d)],null),"Download"],null)],null),new W(null,3,5,X,[Bh,ne,"Burn Chart"],null),Aj(kj(e)),new W(null,3,5,X,[xh,ne,"Data"],null),new W(null,4,
5,X,[gh,new q(null,1,[dh,"column-left"],null),new W(null,3,5,X,[Ih,ne,"Specify your data as comma-separated values. There are three fields:"],null),new W(null,5,5,X,[Ng,ne,new W(null,3,5,X,[Vg,ne,'date (in the format "mm/dd/yy")'],null),new W(null,3,5,X,[Vg,ne,"points completed between the given date and the date of the previous row"],null),new W(null,3,5,X,[Vg,ne,"total points in scope as of the given date"],null)],null)],null),new W(null,3,5,X,[gh,new q(null,1,[dh,"column-right"],null),new W(null,
3,5,X,[fh,new q(null,2,[dh,"width-full",Jg,function(){return function(){var a=new W(null,2,5,X,[ah,this.value],null);return b.a?b.a(a):b.call(null,a)}}(e,a,c,d)],null),e],null)],null),new W(null,2,5,X,[gh,new q(null,1,[dh,"clearfix"],null)],null)],null)}
function bj(a,b){try{if(Rd(b,eh))return a;throw Yi;}catch(c){if(c instanceof Error)if(c===Yi)try{if(ed(b)&&2===T(b))try{var d=Vc(b,0);if(Rd(d,ah)){var e=Vc(b,1);return Xc.c(a,nh,e)}throw Yi;}catch(f){if(f instanceof Error){d=f;if(d===Yi)throw Yi;throw d;}throw f;}else throw Yi;}catch(h){if(h instanceof Error){d=h;if(d===Yi)throw Error([y("No matching clause: "),y(b)].join(""));throw d;}throw h;}else throw c;else throw c;}}
var cj=new q(null,1,[nh,"\n04/15/16,5,230\n04/20/16,90,265\n04/30/16,44,265\n05/16/16,21,230"],null);if("undefined"===typeof dj)var dj=Ji(null);function Cj(a){return Mi(dj,a)}if("undefined"===typeof Oi)var Oi=aj();if("undefined"===typeof Dj){var fj;fj=Ni(function(a){return Bj(a)});var Dj;Dj=ej()};