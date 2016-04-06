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

var f,aa=this;
function m(b){var a=typeof b;if("object"==a)if(b){if(b instanceof Array)return"array";if(b instanceof Object)return a;var c=Object.prototype.toString.call(b);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof b.length&&"undefined"!=typeof b.splice&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof b.call&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
a&&"undefined"==typeof b.call)return"object";return a}function ba(b){return"function"==m(b)}var da="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(b,a,c){return b.call.apply(b.bind,arguments)}function ga(b,a,c){if(!b)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return b.apply(a,c)}}return function(){return b.apply(a,arguments)}}
function ha(b,a,c){ha=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return ha.apply(null,arguments)};function ia(b,a){for(var c in b)a.call(void 0,b[c],c,b)};function ka(b,a){null!=b&&this.append.apply(this,arguments)}f=ka.prototype;f.ab="";f.set=function(b){this.ab=""+b};f.append=function(b,a,c){this.ab+=b;if(null!=a)for(var d=1;d<arguments.length;d++)this.ab+=arguments[d];return this};f.clear=function(){this.ab=""};f.toString=function(){return this.ab};var la=Array.prototype;function ma(b,a,c){return 2>=arguments.length?la.slice.call(b,a):la.slice.call(b,a,c)}function na(b,a){b.sort(a||oa)}function pa(b,a){for(var c=0;c<b.length;c++)b[c]={index:c,value:b[c]};var d=a||oa;na(b,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<b.length;c++)b[c]=b[c].value}function oa(b,a){return b>a?1:b<a?-1:0};var qa={},ra;if("undefined"===typeof sa)var sa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ta)var ta=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ua=null;if("undefined"===typeof va)var va=null;function wa(){return new p(null,5,[xa,!0,ya,!0,za,!1,Aa,!1,Ba,null],null)}Ca;function q(b){return null!=b&&!1!==b}Fa;t;function Ga(b){return null==b}function Ha(b){return b instanceof Array}
function Ia(b){return null==b?!0:!1===b?!0:!1}function u(b,a){return b[m(null==a?null:a)]?!0:b._?!0:!1}function w(b,a){var c=null==a?null:a.constructor,c=q(q(c)?c.Kb:c)?c.nb:m(a);return Error(["No protocol method ",b," defined for type ",c,": ",a].join(""))}function Ja(b){var a=b.nb;return q(a)?a:""+x(b)}var Ka="undefined"!==typeof Symbol&&"function"===m(Symbol)?Symbol.iterator:"@@iterator";function La(b){for(var a=b.length,c=Array(a),d=0;;)if(d<a)c[d]=b[d],d+=1;else break;return c}A;Ma;
var Ca=function Ca(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ca.a(arguments[0]);case 2:return Ca.b(arguments[0],arguments[1]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};Ca.a=function(b){return Ca.b(null,b)};Ca.b=function(b,a){function c(a,b){a.push(b);return a}var d=[];return Ma.c?Ma.c(c,d,a):Ma.call(null,c,d,a)};Ca.C=2;function Qa(){}
var Ra=function Ra(a){if(null!=a&&null!=a.U)return a.U(a);var c=Ra[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Ra._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("ICounted.-count",a);},Sa=function Sa(a){if(null!=a&&null!=a.Y)return a.Y(a);var c=Sa[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Sa._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IEmptyableCollection.-empty",a);};function Ua(){}
var Wa=function Wa(a,c){if(null!=a&&null!=a.R)return a.R(a,c);var d=Wa[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Wa._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("ICollection.-conj",a);};function Xa(){}
var B=function B(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.b(arguments[0],arguments[1]);case 3:return B.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};
B.b=function(b,a){if(null!=b&&null!=b.Z)return b.Z(b,a);var c=B[m(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=B._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw w("IIndexed.-nth",b);};B.c=function(b,a,c){if(null!=b&&null!=b.na)return b.na(b,a,c);var d=B[m(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=B._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw w("IIndexed.-nth",b);};B.C=3;function Ya(){}
var Za=function Za(a){if(null!=a&&null!=a.aa)return a.aa(a);var c=Za[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Za._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("ISeq.-first",a);},$a=function $a(a){if(null!=a&&null!=a.da)return a.da(a);var c=$a[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=$a._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("ISeq.-rest",a);};function ab(){}function bb(){}
var cb=function cb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cb.b(arguments[0],arguments[1]);case 3:return cb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};
cb.b=function(b,a){if(null!=b&&null!=b.H)return b.H(b,a);var c=cb[m(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=cb._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw w("ILookup.-lookup",b);};cb.c=function(b,a,c){if(null!=b&&null!=b.F)return b.F(b,a,c);var d=cb[m(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=cb._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw w("ILookup.-lookup",b);};cb.C=3;
var db=function db(a,c){if(null!=a&&null!=a.Tb)return a.Tb(a,c);var d=db[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=db._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IAssociative.-contains-key?",a);},eb=function eb(a,c,d){if(null!=a&&null!=a.qa)return a.qa(a,c,d);var e=eb[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=eb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("IAssociative.-assoc",a);};function fb(){}
var gb=function gb(a,c){if(null!=a&&null!=a.Ea)return a.Ea(a,c);var d=gb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=gb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IMap.-dissoc",a);};function ib(){}
var jb=function jb(a){if(null!=a&&null!=a.Gb)return a.Gb(a);var c=jb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=jb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IMapEntry.-key",a);},kb=function kb(a){if(null!=a&&null!=a.Hb)return a.Hb(a);var c=kb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=kb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IMapEntry.-val",a);};function lb(){}
var nb=function nb(a){if(null!=a&&null!=a.bb)return a.bb(a);var c=nb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=nb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IStack.-peek",a);},ob=function ob(a){if(null!=a&&null!=a.cb)return a.cb(a);var c=ob[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=ob._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IStack.-pop",a);};function pb(){}
var qb=function qb(a,c,d){if(null!=a&&null!=a.mb)return a.mb(a,c,d);var e=qb[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=qb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("IVector.-assoc-n",a);},rb=function rb(a){if(null!=a&&null!=a.Fb)return a.Fb(a);var c=rb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=rb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IDeref.-deref",a);};function sb(){}
var tb=function tb(a){if(null!=a&&null!=a.L)return a.L(a);var c=tb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=tb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IMeta.-meta",a);};function ub(){}var vb=function vb(a,c){if(null!=a&&null!=a.M)return a.M(a,c);var d=vb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=vb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IWithMeta.-with-meta",a);};function xb(){}
var yb=function yb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return yb.b(arguments[0],arguments[1]);case 3:return yb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};
yb.b=function(b,a){if(null!=b&&null!=b.ba)return b.ba(b,a);var c=yb[m(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=yb._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw w("IReduce.-reduce",b);};yb.c=function(b,a,c){if(null!=b&&null!=b.ca)return b.ca(b,a,c);var d=yb[m(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=yb._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw w("IReduce.-reduce",b);};yb.C=3;
var zb=function zb(a,c){if(null!=a&&null!=a.u)return a.u(a,c);var d=zb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=zb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IEquiv.-equiv",a);},Ab=function Ab(a){if(null!=a&&null!=a.K)return a.K(a);var c=Ab[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Ab._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IHash.-hash",a);};function Bb(){}
var Cb=function Cb(a){if(null!=a&&null!=a.P)return a.P(a);var c=Cb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Cb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("ISeqable.-seq",a);};function Db(){}function Eb(){}function Fb(){}
var Gb=function Gb(a){if(null!=a&&null!=a.Ib)return a.Ib(a);var c=Gb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Gb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IReversible.-rseq",a);},Ib=function Ib(a,c){if(null!=a&&null!=a.vc)return a.vc(0,c);var d=Ib[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Ib._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IWriter.-write",a);},Jb=function Jb(a,c,d){if(null!=a&&null!=a.I)return a.I(a,c,d);var e=
Jb[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Jb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("IPrintWithWriter.-pr-writer",a);},Kb=function Kb(a,c,d){if(null!=a&&null!=a.uc)return a.uc(0,c,d);var e=Kb[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Kb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("IWatchable.-notify-watches",a);},Lb=function Lb(a){if(null!=a&&null!=a.vb)return a.vb(a);var c=Lb[m(null==a?null:
a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Lb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IEditableCollection.-as-transient",a);},Mb=function Mb(a,c){if(null!=a&&null!=a.lb)return a.lb(a,c);var d=Mb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Mb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("ITransientCollection.-conj!",a);},Nb=function Nb(a){if(null!=a&&null!=a.wb)return a.wb(a);var c=Nb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,
a);c=Nb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("ITransientCollection.-persistent!",a);},Ob=function Ob(a,c,d){if(null!=a&&null!=a.Jb)return a.Jb(a,c,d);var e=Ob[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Ob._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("ITransientAssociative.-assoc!",a);},Pb=function Pb(a,c,d){if(null!=a&&null!=a.tc)return a.tc(0,c,d);var e=Pb[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Pb._;
if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("ITransientVector.-assoc-n!",a);};function Rb(){}
var Sb=function Sb(a,c){if(null!=a&&null!=a.jb)return a.jb(a,c);var d=Sb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Sb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IComparable.-compare",a);},Tb=function Tb(a){if(null!=a&&null!=a.rc)return a.rc();var c=Tb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Tb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IChunk.-drop-first",a);},Ub=function Ub(a){if(null!=a&&null!=a.dc)return a.dc(a);var c=
Ub[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Ub._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IChunkedSeq.-chunked-first",a);},Vb=function Vb(a){if(null!=a&&null!=a.ec)return a.ec(a);var c=Vb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Vb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IChunkedSeq.-chunked-rest",a);},Wb=function Wb(a){if(null!=a&&null!=a.cc)return a.cc(a);var c=Wb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,
a);c=Wb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IChunkedNext.-chunked-next",a);},Xb=function Xb(a,c){if(null!=a&&null!=a.Rc)return a.Rc(a,c);var d=Xb[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Xb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IReset.-reset!",a);},Yb=function Yb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Yb.b(arguments[0],arguments[1]);case 3:return Yb.c(arguments[0],
arguments[1],arguments[2]);case 4:return Yb.B(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Yb.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};Yb.b=function(b,a){if(null!=b&&null!=b.Tc)return b.Tc(b,a);var c=Yb[m(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=Yb._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw w("ISwap.-swap!",b);};
Yb.c=function(b,a,c){if(null!=b&&null!=b.Uc)return b.Uc(b,a,c);var d=Yb[m(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=Yb._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw w("ISwap.-swap!",b);};Yb.B=function(b,a,c,d){if(null!=b&&null!=b.Vc)return b.Vc(b,a,c,d);var e=Yb[m(null==b?null:b)];if(null!=e)return e.B?e.B(b,a,c,d):e.call(null,b,a,c,d);e=Yb._;if(null!=e)return e.B?e.B(b,a,c,d):e.call(null,b,a,c,d);throw w("ISwap.-swap!",b);};
Yb.T=function(b,a,c,d,e){if(null!=b&&null!=b.Wc)return b.Wc(b,a,c,d,e);var g=Yb[m(null==b?null:b)];if(null!=g)return g.T?g.T(b,a,c,d,e):g.call(null,b,a,c,d,e);g=Yb._;if(null!=g)return g.T?g.T(b,a,c,d,e):g.call(null,b,a,c,d,e);throw w("ISwap.-swap!",b);};Yb.C=5;var Zb=function Zb(a){if(null!=a&&null!=a.ia)return a.ia(a);var c=Zb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Zb._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IIterable.-iterator",a);};
function $b(b){this.fd=b;this.i=1073741824;this.A=0}$b.prototype.vc=function(b,a){return this.fd.append(a)};function ac(b){var a=new ka;b.I(null,new $b(a),wa());return""+x(a)}var bc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(b,a){return Math.imul(b,a)}:function(b,a){var c=b&65535,d=a&65535;return c*d+((b>>>16&65535)*d+c*(a>>>16&65535)<<16>>>0)|0};function cc(b){b=bc(b|0,-862048943);return bc(b<<15|b>>>-15,461845907)}
function dc(b,a){var c=(b|0)^(a|0);return bc(c<<13|c>>>-13,5)+-430675100|0}function fc(b,a){var c=(b|0)^a,c=bc(c^c>>>16,-2048144789),c=bc(c^c>>>13,-1028477387);return c^c>>>16}function gc(b){var a;a:{a=1;for(var c=0;;)if(a<b.length){var d=a+2,c=dc(c,cc(b.charCodeAt(a-1)|b.charCodeAt(a)<<16));a=d}else{a=c;break a}}a=1===(b.length&1)?a^cc(b.charCodeAt(b.length-1)):a;return fc(a,bc(2,b.length))}hc;F;ic;jc;var kc={},lc=0;
function mc(b){if(null!=b){var a=b.length;if(0<a)for(var c=0,d=0;;)if(c<a)var e=c+1,d=bc(31,d)+b.charCodeAt(c),c=e;else return d;else return 0}else return 0}function nc(b){255<lc&&(kc={},lc=0);var a=kc[b];"number"!==typeof a&&(a=mc(b),kc[b]=a,lc+=1);return b=a}
function oc(b){null!=b&&(b.i&4194304||b.ld)?b=b.K(null):"number"===typeof b?b=Math.floor(b)%2147483647:!0===b?b=1:!1===b?b=0:"string"===typeof b?(b=nc(b),0!==b&&(b=cc(b),b=dc(0,b),b=fc(b,4))):b=b instanceof Date?b.valueOf():null==b?0:Ab(b);return b}function pc(b,a){return b^a+2654435769+(b<<6)+(b>>2)}function Fa(b,a){return a instanceof b}
function qc(b,a){if(b.Ka===a.Ka)return 0;var c=Ia(b.ka);if(q(c?a.ka:c))return-1;if(q(b.ka)){if(Ia(a.ka))return 1;c=oa(b.ka,a.ka);return 0===c?oa(b.name,a.name):c}return oa(b.name,a.name)}H;function F(b,a,c,d,e){this.ka=b;this.name=a;this.Ka=c;this.ub=d;this.ma=e;this.i=2154168321;this.A=4096}f=F.prototype;f.toString=function(){return this.Ka};f.equiv=function(b){return this.u(null,b)};f.u=function(b,a){return a instanceof F?this.Ka===a.Ka:!1};
f.call=function(){function b(a,b,c){return H.c?H.c(b,this,c):H.call(null,b,this,c)}function a(a,b){return H.b?H.b(b,this):H.call(null,b,this)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return a.call(this,0,e);case 3:return b.call(this,0,e,g)}throw Error("Invalid arity: "+arguments.length);};c.b=a;c.c=b;return c}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return H.b?H.b(b,this):H.call(null,b,this)};
f.b=function(b,a){return H.c?H.c(b,this,a):H.call(null,b,this,a)};f.L=function(){return this.ma};f.M=function(b,a){return new F(this.ka,this.name,this.Ka,this.ub,a)};f.K=function(){var b=this.ub;return null!=b?b:this.ub=b=pc(gc(this.name),nc(this.ka))};f.I=function(b,a){return Ib(a,this.Ka)};
var rc=function rc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rc.a(arguments[0]);case 2:return rc.b(arguments[0],arguments[1]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};rc.a=function(b){if(b instanceof F)return b;var a=b.indexOf("/");return-1===a?rc.b(null,b):rc.b(b.substring(0,a),b.substring(a+1,b.length))};rc.b=function(b,a){var c=null!=b?[x(b),x("/"),x(a)].join(""):a;return new F(b,a,c,null,null)};
rc.C=2;J;tc;K;function L(b){if(null==b)return null;if(null!=b&&(b.i&8388608||b.Sc))return b.P(null);if(Ha(b)||"string"===typeof b)return 0===b.length?null:new K(b,0);if(u(Bb,b))return Cb(b);throw Error([x(b),x(" is not ISeqable")].join(""));}function M(b){if(null==b)return null;if(null!=b&&(b.i&64||b.kb))return b.aa(null);b=L(b);return null==b?null:Za(b)}function uc(b){return null!=b?null!=b&&(b.i&64||b.kb)?b.da(null):(b=L(b))?$a(b):N:N}
function O(b){return null==b?null:null!=b&&(b.i&128||b.Vb)?b.ha(null):L(uc(b))}var ic=function ic(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ic.a(arguments[0]);case 2:return ic.b(arguments[0],arguments[1]);default:return ic.l(arguments[0],arguments[1],new K(c.slice(2),0))}};ic.a=function(){return!0};ic.b=function(b,a){return null==b?null==a:b===a||zb(b,a)};
ic.l=function(b,a,c){for(;;)if(ic.b(b,a))if(O(c))b=a,a=M(c),c=O(c);else return ic.b(a,M(c));else return!1};ic.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return ic.l(a,b,c)};ic.C=2;function vc(b){this.J=b}vc.prototype.next=function(){if(null!=this.J){var b=M(this.J);this.J=O(this.J);return{value:b,done:!1}}return{value:null,done:!0}};function wc(b){return new vc(L(b))}xc;function yc(b,a,c){this.value=b;this.Ab=a;this.ac=c;this.i=8388672;this.A=0}yc.prototype.P=function(){return this};
yc.prototype.aa=function(){return this.value};yc.prototype.da=function(){null==this.ac&&(this.ac=xc.a?xc.a(this.Ab):xc.call(null,this.Ab));return this.ac};function xc(b){var a=b.next();return q(a.done)?N:new yc(a.value,b,null)}function zc(b,a){var c=cc(b),c=dc(0,c);return fc(c,a)}function Ac(b){var a=0,c=1;for(b=L(b);;)if(null!=b)a+=1,c=bc(31,c)+oc(M(b))|0,b=O(b);else return zc(c,a)}var Bc=zc(1,0);function Cc(b){var a=0,c=0;for(b=L(b);;)if(null!=b)a+=1,c=c+oc(M(b))|0,b=O(b);else return zc(c,a)}
var Dc=zc(0,0);Ec;hc;Fc;Qa["null"]=!0;Ra["null"]=function(){return 0};Date.prototype.u=function(b,a){return a instanceof Date&&this.valueOf()===a.valueOf()};Date.prototype.Eb=!0;Date.prototype.jb=function(b,a){if(a instanceof Date)return oa(this.valueOf(),a.valueOf());throw Error([x("Cannot compare "),x(this),x(" to "),x(a)].join(""));};zb.number=function(b,a){return b===a};Gc;sb["function"]=!0;tb["function"]=function(){return null};Ab._=function(b){return b[da]||(b[da]=++ea)};P;
function Hc(b){this.s=b;this.i=32768;this.A=0}Hc.prototype.Fb=function(){return this.s};function Ic(b){return b instanceof Hc}function P(b){return rb(b)}function Lc(b,a){var c=Ra(b);if(0===c)return a.w?a.w():a.call(null);for(var d=B.b(b,0),e=1;;)if(e<c){var g=B.b(b,e),d=a.b?a.b(d,g):a.call(null,d,g);if(Ic(d))return rb(d);e+=1}else return d}function Mc(b,a,c){var d=Ra(b),e=c;for(c=0;;)if(c<d){var g=B.b(b,c),e=a.b?a.b(e,g):a.call(null,e,g);if(Ic(e))return rb(e);c+=1}else return e}
function Nc(b,a){var c=b.length;if(0===b.length)return a.w?a.w():a.call(null);for(var d=b[0],e=1;;)if(e<c){var g=b[e],d=a.b?a.b(d,g):a.call(null,d,g);if(Ic(d))return rb(d);e+=1}else return d}function Oc(b,a,c){var d=b.length,e=c;for(c=0;;)if(c<d){var g=b[c],e=a.b?a.b(e,g):a.call(null,e,g);if(Ic(e))return rb(e);c+=1}else return e}function Pc(b,a,c,d){for(var e=b.length;;)if(d<e){var g=b[d];c=a.b?a.b(c,g):a.call(null,c,g);if(Ic(c))return rb(c);d+=1}else return c}Qc;Q;Rc;Sc;
function Tc(b){return null!=b?b.i&2||b.Hc?!0:b.i?!1:u(Qa,b):u(Qa,b)}function Uc(b){return null!=b?b.i&16||b.sc?!0:b.i?!1:u(Xa,b):u(Xa,b)}function Vc(b,a){this.f=b;this.o=a}Vc.prototype.ea=function(){return this.o<this.f.length};Vc.prototype.next=function(){var b=this.f[this.o];this.o+=1;return b};function K(b,a){this.f=b;this.o=a;this.i=166199550;this.A=8192}f=K.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};
f.Z=function(b,a){var c=a+this.o;return c<this.f.length?this.f[c]:null};f.na=function(b,a,c){b=a+this.o;return b<this.f.length?this.f[b]:c};f.ia=function(){return new Vc(this.f,this.o)};f.ha=function(){return this.o+1<this.f.length?new K(this.f,this.o+1):null};f.U=function(){var b=this.f.length-this.o;return 0>b?0:b};f.Ib=function(){var b=Ra(this);return 0<b?new Rc(this,b-1,null):null};f.K=function(){return Ac(this)};f.u=function(b,a){return Fc.b?Fc.b(this,a):Fc.call(null,this,a)};f.Y=function(){return N};
f.ba=function(b,a){return Pc(this.f,a,this.f[this.o],this.o+1)};f.ca=function(b,a,c){return Pc(this.f,a,c,this.o)};f.aa=function(){return this.f[this.o]};f.da=function(){return this.o+1<this.f.length?new K(this.f,this.o+1):N};f.P=function(){return this.o<this.f.length?this:null};f.R=function(b,a){return Q.b?Q.b(a,this):Q.call(null,a,this)};K.prototype[Ka]=function(){return wc(this)};
var tc=function tc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return tc.a(arguments[0]);case 2:return tc.b(arguments[0],arguments[1]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};tc.a=function(b){return tc.b(b,0)};tc.b=function(b,a){return a<b.length?new K(b,a):null};tc.C=2;
var J=function J(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return J.a(arguments[0]);case 2:return J.b(arguments[0],arguments[1]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};J.a=function(b){return tc.b(b,0)};J.b=function(b,a){return tc.b(b,a)};J.C=2;Gc;Wc;function Rc(b,a,c){this.Sb=b;this.o=a;this.m=c;this.i=32374990;this.A=8192}f=Rc.prototype;f.toString=function(){return ac(this)};
f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};f.ha=function(){return 0<this.o?new Rc(this.Sb,this.o-1,null):null};f.U=function(){return this.o+1};f.K=function(){return Ac(this)};f.u=function(b,a){return Fc.b?Fc.b(this,a):Fc.call(null,this,a)};f.Y=function(){var b=N,a=this.m;return Gc.b?Gc.b(b,a):Gc.call(null,b,a)};f.ba=function(b,a){return Wc.b?Wc.b(a,this):Wc.call(null,a,this)};f.ca=function(b,a,c){return Wc.c?Wc.c(a,c,this):Wc.call(null,a,c,this)};
f.aa=function(){return B.b(this.Sb,this.o)};f.da=function(){return 0<this.o?new Rc(this.Sb,this.o-1,null):N};f.P=function(){return this};f.M=function(b,a){return new Rc(this.Sb,this.o,a)};f.R=function(b,a){return Q.b?Q.b(a,this):Q.call(null,a,this)};Rc.prototype[Ka]=function(){return wc(this)};function Xc(b){return M(O(b))}function Yc(b){for(;;){var a=O(b);if(null!=a)b=a;else return M(b)}}zb._=function(b,a){return b===a};
var Zc=function Zc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Zc.w();case 1:return Zc.a(arguments[0]);case 2:return Zc.b(arguments[0],arguments[1]);default:return Zc.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Zc.w=function(){return $c};Zc.a=function(b){return b};Zc.b=function(b,a){return null!=b?Wa(b,a):Wa(N,a)};Zc.l=function(b,a,c){for(;;)if(q(c))b=Zc.b(b,a),a=M(c),c=O(c);else return Zc.b(b,a)};
Zc.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Zc.l(a,b,c)};Zc.C=2;function R(b){if(null!=b)if(null!=b&&(b.i&2||b.Hc))b=b.U(null);else if(Ha(b))b=b.length;else if("string"===typeof b)b=b.length;else if(null!=b&&(b.i&8388608||b.Sc))a:{b=L(b);for(var a=0;;){if(Tc(b)){b=a+Ra(b);break a}b=O(b);a+=1}}else b=Ra(b);else b=0;return b}function ad(b,a){for(var c=null;;){if(null==b)return c;if(0===a)return L(b)?M(b):c;if(Uc(b))return B.c(b,a,c);if(L(b)){var d=O(b),e=a-1;b=d;a=e}else return c}}
function bd(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number");if(null==b)return b;if(null!=b&&(b.i&16||b.sc))return b.Z(null,a);if(Ha(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.i&64||b.kb)){var c;a:{c=b;for(var d=a;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(L(c)){c=M(c);break a}throw Error("Index out of bounds");}if(Uc(c)){c=B.b(c,d);break a}if(L(c))c=O(c),--d;else throw Error("Index out of bounds");
}}return c}if(u(Xa,b))return B.b(b,a);throw Error([x("nth not supported on this type "),x(Ja(null==b?null:b.constructor))].join(""));}
function S(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number.");if(null==b)return null;if(null!=b&&(b.i&16||b.sc))return b.na(null,a,null);if(Ha(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.i&64||b.kb))return ad(b,a);if(u(Xa,b))return B.b(b,a);throw Error([x("nth not supported on this type "),x(Ja(null==b?null:b.constructor))].join(""));}
var H=function H(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.b(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};H.b=function(b,a){return null==b?null:null!=b&&(b.i&256||b.Lc)?b.H(null,a):Ha(b)?a<b.length?b[a|0]:null:"string"===typeof b?a<b.length?b[a|0]:null:u(bb,b)?cb.b(b,a):null};
H.c=function(b,a,c){return null!=b?null!=b&&(b.i&256||b.Lc)?b.F(null,a,c):Ha(b)?a<b.length?b[a]:c:"string"===typeof b?a<b.length?b[a]:c:u(bb,b)?cb.c(b,a,c):c:c};H.C=3;cd;var dd=function dd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return dd.c(arguments[0],arguments[1],arguments[2]);default:return dd.l(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};
dd.c=function(b,a,c){if(null!=b)b=eb(b,a,c);else a:{b=[a];c=[c];a=b.length;var d=0,e;for(e=Lb(ed);;)if(d<a){var g=d+1;e=e.Jb(null,b[d],c[d]);d=g}else{b=Nb(e);break a}}return b};dd.l=function(b,a,c,d){for(;;)if(b=dd.c(b,a,c),q(d))a=M(d),c=Xc(d),d=O(O(d));else return b};dd.D=function(b){var a=M(b),c=O(b);b=M(c);var d=O(c),c=M(d),d=O(d);return dd.l(a,b,c,d)};dd.C=3;
var fd=function fd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return fd.a(arguments[0]);case 2:return fd.b(arguments[0],arguments[1]);default:return fd.l(arguments[0],arguments[1],new K(c.slice(2),0))}};fd.a=function(b){return b};fd.b=function(b,a){return null==b?null:gb(b,a)};fd.l=function(b,a,c){for(;;){if(null==b)return null;b=fd.b(b,a);if(q(c))a=M(c),c=O(c);else return b}};
fd.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return fd.l(a,b,c)};fd.C=2;function hd(b,a){this.g=b;this.m=a;this.i=393217;this.A=0}f=hd.prototype;f.L=function(){return this.m};f.M=function(b,a){return new hd(this.g,a)};
f.call=function(){function b(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea,ca,Da){a=this;return A.Ub?A.Ub(a.g,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea,ca,Da):A.call(null,a.g,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea,ca,Da)}function a(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea,ca){a=this;return a.g.Wa?a.g.Wa(b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea,ca):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea,ca)}function c(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea){a=this;return a.g.Va?a.g.Va(b,c,d,e,g,h,k,l,n,r,y,v,
z,E,C,D,G,I,Ea):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I,Ea)}function d(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I){a=this;return a.g.Ua?a.g.Ua(b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G,I)}function e(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G){a=this;return a.g.Ta?a.g.Ta(b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D,G)}function g(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D){a=this;return a.g.Sa?a.g.Sa(b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D):
a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C,D)}function h(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C){a=this;return a.g.Ra?a.g.Ra(b,c,d,e,g,h,k,l,n,r,y,v,z,E,C):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E,C)}function k(a,b,c,d,e,g,h,k,l,n,r,y,v,z,E){a=this;return a.g.Qa?a.g.Qa(b,c,d,e,g,h,k,l,n,r,y,v,z,E):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z,E)}function l(a,b,c,d,e,g,h,k,l,n,r,y,v,z){a=this;return a.g.Pa?a.g.Pa(b,c,d,e,g,h,k,l,n,r,y,v,z):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v,z)}function n(a,b,c,d,e,g,h,k,l,
n,r,y,v){a=this;return a.g.Oa?a.g.Oa(b,c,d,e,g,h,k,l,n,r,y,v):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y,v)}function r(a,b,c,d,e,g,h,k,l,n,r,y){a=this;return a.g.Na?a.g.Na(b,c,d,e,g,h,k,l,n,r,y):a.g.call(null,b,c,d,e,g,h,k,l,n,r,y)}function y(a,b,c,d,e,g,h,k,l,n,r){a=this;return a.g.Ma?a.g.Ma(b,c,d,e,g,h,k,l,n,r):a.g.call(null,b,c,d,e,g,h,k,l,n,r)}function v(a,b,c,d,e,g,h,k,l,n){a=this;return a.g.Ya?a.g.Ya(b,c,d,e,g,h,k,l,n):a.g.call(null,b,c,d,e,g,h,k,l,n)}function z(a,b,c,d,e,g,h,k,l){a=this;return a.g.Xa?
a.g.Xa(b,c,d,e,g,h,k,l):a.g.call(null,b,c,d,e,g,h,k,l)}function C(a,b,c,d,e,g,h,k){a=this;return a.g.ua?a.g.ua(b,c,d,e,g,h,k):a.g.call(null,b,c,d,e,g,h,k)}function D(a,b,c,d,e,g,h){a=this;return a.g.ta?a.g.ta(b,c,d,e,g,h):a.g.call(null,b,c,d,e,g,h)}function E(a,b,c,d,e,g){a=this;return a.g.T?a.g.T(b,c,d,e,g):a.g.call(null,b,c,d,e,g)}function G(a,b,c,d,e){a=this;return a.g.B?a.g.B(b,c,d,e):a.g.call(null,b,c,d,e)}function ca(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function Da(a,
b,c){a=this;return a.g.b?a.g.b(b,c):a.g.call(null,b,c)}function Ea(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function Kc(a){a=this;return a.g.w?a.g.w():a.g.call(null)}var I=null,I=function(I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd,Ad,ne,of,xg,fi,dk){switch(arguments.length){case 1:return Kc.call(this,I);case 2:return Ea.call(this,I,Na);case 3:return Da.call(this,I,Na,Oa);case 4:return ca.call(this,I,Na,Oa,Ta);case 5:return G.call(this,I,Na,Oa,Ta,Va);case 6:return E.call(this,I,Na,Oa,
Ta,Va,Pa);case 7:return D.call(this,I,Na,Oa,Ta,Va,Pa,ja);case 8:return C.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb);case 9:return z.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb);case 10:return v.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb);case 11:return y.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb);case 12:return r.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb);case 13:return n.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec);case 14:return l.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc);case 15:return k.call(this,
I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc);case 16:return h.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd);case 17:return g.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd,Ad);case 18:return e.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd,Ad,ne);case 19:return d.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd,Ad,ne,of);case 20:return c.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd,Ad,ne,of,xg);case 21:return a.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,
wb,Hb,Qb,ec,sc,Jc,gd,Ad,ne,of,xg,fi);case 22:return b.call(this,I,Na,Oa,Ta,Va,Pa,ja,hb,mb,wb,Hb,Qb,ec,sc,Jc,gd,Ad,ne,of,xg,fi,dk)}throw Error("Invalid arity: "+arguments.length);};I.a=Kc;I.b=Ea;I.c=Da;I.B=ca;I.T=G;I.ta=E;I.ua=D;I.Xa=C;I.Ya=z;I.Ma=v;I.Na=y;I.Oa=r;I.Pa=n;I.Qa=l;I.Ra=k;I.Sa=h;I.Ta=g;I.Ua=e;I.Va=d;I.Wa=c;I.Kc=a;I.Ub=b;return I}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.w=function(){return this.g.w?this.g.w():this.g.call(null)};
f.a=function(b){return this.g.a?this.g.a(b):this.g.call(null,b)};f.b=function(b,a){return this.g.b?this.g.b(b,a):this.g.call(null,b,a)};f.c=function(b,a,c){return this.g.c?this.g.c(b,a,c):this.g.call(null,b,a,c)};f.B=function(b,a,c,d){return this.g.B?this.g.B(b,a,c,d):this.g.call(null,b,a,c,d)};f.T=function(b,a,c,d,e){return this.g.T?this.g.T(b,a,c,d,e):this.g.call(null,b,a,c,d,e)};f.ta=function(b,a,c,d,e,g){return this.g.ta?this.g.ta(b,a,c,d,e,g):this.g.call(null,b,a,c,d,e,g)};
f.ua=function(b,a,c,d,e,g,h){return this.g.ua?this.g.ua(b,a,c,d,e,g,h):this.g.call(null,b,a,c,d,e,g,h)};f.Xa=function(b,a,c,d,e,g,h,k){return this.g.Xa?this.g.Xa(b,a,c,d,e,g,h,k):this.g.call(null,b,a,c,d,e,g,h,k)};f.Ya=function(b,a,c,d,e,g,h,k,l){return this.g.Ya?this.g.Ya(b,a,c,d,e,g,h,k,l):this.g.call(null,b,a,c,d,e,g,h,k,l)};f.Ma=function(b,a,c,d,e,g,h,k,l,n){return this.g.Ma?this.g.Ma(b,a,c,d,e,g,h,k,l,n):this.g.call(null,b,a,c,d,e,g,h,k,l,n)};
f.Na=function(b,a,c,d,e,g,h,k,l,n,r){return this.g.Na?this.g.Na(b,a,c,d,e,g,h,k,l,n,r):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r)};f.Oa=function(b,a,c,d,e,g,h,k,l,n,r,y){return this.g.Oa?this.g.Oa(b,a,c,d,e,g,h,k,l,n,r,y):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y)};f.Pa=function(b,a,c,d,e,g,h,k,l,n,r,y,v){return this.g.Pa?this.g.Pa(b,a,c,d,e,g,h,k,l,n,r,y,v):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v)};
f.Qa=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z){return this.g.Qa?this.g.Qa(b,a,c,d,e,g,h,k,l,n,r,y,v,z):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z)};f.Ra=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C){return this.g.Ra?this.g.Ra(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C)};f.Sa=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D){return this.g.Sa?this.g.Sa(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D)};
f.Ta=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E){return this.g.Ta?this.g.Ta(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E)};f.Ua=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G){return this.g.Ua?this.g.Ua(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G)};
f.Va=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca){return this.g.Va?this.g.Va(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca)};f.Wa=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da){return this.g.Wa?this.g.Wa(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da):this.g.call(null,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da)};
f.Kc=function(b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea){return A.Ub?A.Ub(this.g,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea):A.call(null,this.g,b,a,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea)};function Gc(b,a){return ba(b)?new hd(b,a):null==b?null:vb(b,a)}function id(b){var a=null!=b;return(a?null!=b?b.i&131072||b.Oc||(b.i?0:u(sb,b)):u(sb,b):a)?tb(b):null}function jd(b){return null==b?!1:null!=b?b.i&4096||b.pd?!0:b.i?!1:u(lb,b):u(lb,b)}
function kd(b){return null!=b?b.i&16777216||b.od?!0:b.i?!1:u(Db,b):u(Db,b)}function ld(b){return null==b?!1:null!=b?b.i&1024||b.Mc?!0:b.i?!1:u(fb,b):u(fb,b)}function md(b){return null!=b?b.i&16384||b.qd?!0:b.i?!1:u(pb,b):u(pb,b)}nd;od;function pd(b){return null!=b?b.A&512||b.hd?!0:!1:!1}function qd(b){var a=[];ia(b,function(a,b){return function(a,c){return b.push(c)}}(b,a));return a}function rd(b,a,c,d,e){for(;0!==e;)c[d]=b[a],d+=1,--e,a+=1}var sd={};
function td(b){return null==b?!1:null!=b?b.i&64||b.kb?!0:b.i?!1:u(Ya,b):u(Ya,b)}function ud(b){return null==b?!1:!1===b?!1:!0}function vd(b,a){return H.c(b,a,sd)===sd?!1:!0}
function jc(b,a){if(b===a)return 0;if(null==b)return-1;if(null==a)return 1;if("number"===typeof b){if("number"===typeof a)return oa(b,a);throw Error([x("Cannot compare "),x(b),x(" to "),x(a)].join(""));}if(null!=b?b.A&2048||b.Eb||(b.A?0:u(Rb,b)):u(Rb,b))return Sb(b,a);if("string"!==typeof b&&!Ha(b)&&!0!==b&&!1!==b||(null==b?null:b.constructor)!==(null==a?null:a.constructor))throw Error([x("Cannot compare "),x(b),x(" to "),x(a)].join(""));return oa(b,a)}
function wd(b,a){var c=R(b),d=R(a);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=jc(bd(b,d),bd(a,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function xd(b){return ic.b(b,jc)?jc:function(a,c){var d=b.b?b.b(a,c):b.call(null,a,c);return"number"===typeof d?d:q(d)?-1:q(b.b?b.b(c,a):b.call(null,c,a))?1:0}}yd;function zd(b,a){if(L(a)){var c=yd.a?yd.a(a):yd.call(null,a),d=xd(b);pa(c,d);return L(c)}return N}
function Bd(b,a){var c=jc;return zd(function(a,e){return xd(c).call(null,b.a?b.a(a):b.call(null,a),b.a?b.a(e):b.call(null,e))},a)}var Wc=function Wc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Wc.b(arguments[0],arguments[1]);case 3:return Wc.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};
Wc.b=function(b,a){var c=L(a);if(c){var d=M(c),c=O(c);return Ma.c?Ma.c(b,d,c):Ma.call(null,b,d,c)}return b.w?b.w():b.call(null)};Wc.c=function(b,a,c){for(c=L(c);;)if(c){var d=M(c);a=b.b?b.b(a,d):b.call(null,a,d);if(Ic(a))return rb(a);c=O(c)}else return a};Wc.C=3;Cd;
var Ma=function Ma(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ma.b(arguments[0],arguments[1]);case 3:return Ma.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};Ma.b=function(b,a){return null!=a&&(a.i&524288||a.Qc)?a.ba(null,b):Ha(a)?Nc(a,b):"string"===typeof a?Nc(a,b):u(xb,a)?yb.b(a,b):Wc.b(b,a)};
Ma.c=function(b,a,c){return null!=c&&(c.i&524288||c.Qc)?c.ca(null,b,a):Ha(c)?Oc(c,b,a):"string"===typeof c?Oc(c,b,a):u(xb,c)?yb.c(c,b,a):Wc.c(b,a,c)};Ma.C=3;function Dd(b){return b}var Ed=function Ed(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ed.w();case 1:return Ed.a(arguments[0]);case 2:return Ed.b(arguments[0],arguments[1]);default:return Ed.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Ed.w=function(){return 0};
Ed.a=function(b){return b};Ed.b=function(b,a){return b+a};Ed.l=function(b,a,c){return Ma.c(Ed,b+a,c)};Ed.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Ed.l(a,b,c)};Ed.C=2;qa.wd;var Fd=function Fd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Fd.a(arguments[0]);case 2:return Fd.b(arguments[0],arguments[1]);default:return Fd.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Fd.a=function(){return!0};
Fd.b=function(b,a){return b<a};Fd.l=function(b,a,c){for(;;)if(b<a)if(O(c))b=a,a=M(c),c=O(c);else return a<M(c);else return!1};Fd.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Fd.l(a,b,c)};Fd.C=2;var Gd=function Gd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.a(arguments[0]);case 2:return Gd.b(arguments[0],arguments[1]);default:return Gd.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Gd.a=function(){return!0};
Gd.b=function(b,a){return b>a};Gd.l=function(b,a,c){for(;;)if(b>a)if(O(c))b=a,a=M(c),c=O(c);else return a>M(c);else return!1};Gd.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Gd.l(a,b,c)};Gd.C=2;function Hd(b){return b-1}var Id=function Id(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Id.a(arguments[0]);case 2:return Id.b(arguments[0],arguments[1]);default:return Id.l(arguments[0],arguments[1],new K(c.slice(2),0))}};
Id.a=function(b){return b};Id.b=function(b,a){return b>a?b:a};Id.l=function(b,a,c){return Ma.c(Id,b>a?b:a,c)};Id.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Id.l(a,b,c)};Id.C=2;var Jd=function Jd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jd.a(arguments[0]);case 2:return Jd.b(arguments[0],arguments[1]);default:return Jd.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Jd.a=function(b){return b};
Jd.b=function(b,a){return b<a?b:a};Jd.l=function(b,a,c){return Ma.c(Jd,b<a?b:a,c)};Jd.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Jd.l(a,b,c)};Jd.C=2;Kd;function Ld(b){return b|0}function Kd(b,a){return(b%a+a)%a}function Md(b){b=(b-b%2)/2;return 0<=b?Math.floor(b):Math.ceil(b)}function Nd(b){b-=b>>1&1431655765;b=(b&858993459)+(b>>2&858993459);return 16843009*(b+(b>>4)&252645135)>>24}function Od(b){var a=2;for(b=L(b);;)if(b&&0<a)--a,b=O(b);else return b}
var x=function x(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return x.w();case 1:return x.a(arguments[0]);default:return x.l(arguments[0],new K(c.slice(1),0))}};x.w=function(){return""};x.a=function(b){return null==b?"":""+b};x.l=function(b,a){for(var c=new ka(""+x(b)),d=a;;)if(q(d))c=c.append(""+x(M(d))),d=O(d);else return c.toString()};x.D=function(b){var a=M(b);b=O(b);return x.l(a,b)};x.C=1;T;Pd;
function Fc(b,a){var c;if(kd(a))if(Tc(b)&&Tc(a)&&R(b)!==R(a))c=!1;else a:{c=L(b);for(var d=L(a);;){if(null==c){c=null==d;break a}if(null!=d&&ic.b(M(c),M(d)))c=O(c),d=O(d);else{c=!1;break a}}}else c=null;return ud(c)}function Qc(b){if(L(b)){var a=oc(M(b));for(b=O(b);;){if(null==b)return a;a=pc(a,oc(M(b)));b=O(b)}}else return 0}Qd;Rd;function Sd(b){var a=0;for(b=L(b);;)if(b){var c=M(b),a=(a+(oc(Qd.a?Qd.a(c):Qd.call(null,c))^oc(Rd.a?Rd.a(c):Rd.call(null,c))))%4503599627370496;b=O(b)}else return a}Pd;
Td;Ud;function Sc(b,a,c,d,e){this.m=b;this.first=a;this.la=c;this.count=d;this.j=e;this.i=65937646;this.A=8192}f=Sc.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};f.ha=function(){return 1===this.count?null:this.la};f.U=function(){return this.count};f.bb=function(){return this.first};f.cb=function(){return $a(this)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};
f.Y=function(){return vb(N,this.m)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return this.first};f.da=function(){return 1===this.count?N:this.la};f.P=function(){return this};f.M=function(b,a){return new Sc(a,this.first,this.la,this.count,this.j)};f.R=function(b,a){return new Sc(this.m,a,this,this.count+1,null)};Sc.prototype[Ka]=function(){return wc(this)};function Vd(b){this.m=b;this.i=65937614;this.A=8192}f=Vd.prototype;f.toString=function(){return ac(this)};
f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};f.ha=function(){return null};f.U=function(){return 0};f.bb=function(){return null};f.cb=function(){throw Error("Can't pop empty list");};f.K=function(){return Bc};f.u=function(b,a){return(null!=a?a.i&33554432||a.md||(a.i?0:u(Eb,a)):u(Eb,a))||kd(a)?null==L(a):!1};f.Y=function(){return this};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return null};f.da=function(){return N};
f.P=function(){return null};f.M=function(b,a){return new Vd(a)};f.R=function(b,a){return new Sc(this.m,a,null,1,null)};var N=new Vd(null);Vd.prototype[Ka]=function(){return wc(this)};function Wd(b){return(null!=b?b.i&134217728||b.nd||(b.i?0:u(Fb,b)):u(Fb,b))?Gb(b):Ma.c(Zc,N,b)}var hc=function hc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return hc.l(0<c.length?new K(c.slice(0),0):null)};
hc.l=function(b){var a;if(b instanceof K&&0===b.o)a=b.f;else a:for(a=[];;)if(null!=b)a.push(b.aa(null)),b=b.ha(null);else break a;b=a.length;for(var c=N;;)if(0<b){var d=b-1,c=c.R(null,a[b-1]);b=d}else return c};hc.C=0;hc.D=function(b){return hc.l(L(b))};function Xd(b,a,c,d){this.m=b;this.first=a;this.la=c;this.j=d;this.i=65929452;this.A=8192}f=Xd.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};
f.ha=function(){return null==this.la?null:L(this.la)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return this.first};f.da=function(){return null==this.la?N:this.la};f.P=function(){return this};f.M=function(b,a){return new Xd(a,this.first,this.la,this.j)};f.R=function(b,a){return new Xd(null,a,this,this.j)};
Xd.prototype[Ka]=function(){return wc(this)};function Q(b,a){var c=null==a;return(c?c:null!=a&&(a.i&64||a.kb))?new Xd(null,b,a,null):new Xd(null,b,L(a),null)}function Yd(b,a){if(b.ra===a.ra)return 0;var c=Ia(b.ka);if(q(c?a.ka:c))return-1;if(q(b.ka)){if(Ia(a.ka))return 1;c=oa(b.ka,a.ka);return 0===c?oa(b.name,a.name):c}return oa(b.name,a.name)}function t(b,a,c,d){this.ka=b;this.name=a;this.ra=c;this.ub=d;this.i=2153775105;this.A=4096}f=t.prototype;f.toString=function(){return[x(":"),x(this.ra)].join("")};
f.equiv=function(b){return this.u(null,b)};f.u=function(b,a){return a instanceof t?this.ra===a.ra:!1};f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return H.b(b,this);case 3:return H.c(b,this,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return H.b(b,this)};b.c=function(a,b,d){return H.c(b,this,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return H.b(b,this)};
f.b=function(b,a){return H.c(b,this,a)};f.K=function(){var b=this.ub;return null!=b?b:this.ub=b=pc(gc(this.name),nc(this.ka))+2654435769|0};f.I=function(b,a){return Ib(a,[x(":"),x(this.ra)].join(""))};function U(b,a){return b===a?!0:b instanceof t&&a instanceof t?b.ra===a.ra:!1}
var Zd=function Zd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Zd.a(arguments[0]);case 2:return Zd.b(arguments[0],arguments[1]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};
Zd.a=function(b){if(b instanceof t)return b;if(b instanceof F){var a;if(null!=b&&(b.A&4096||b.Pc))a=b.ka;else throw Error([x("Doesn't support namespace: "),x(b)].join(""));return new t(a,Pd.a?Pd.a(b):Pd.call(null,b),b.Ka,null)}return"string"===typeof b?(a=b.split("/"),2===a.length?new t(a[0],a[1],b,null):new t(null,a[0],b,null)):null};Zd.b=function(b,a){return new t(b,a,[x(q(b)?[x(b),x("/")].join(""):null),x(a)].join(""),null)};Zd.C=2;
function $d(b,a,c,d){this.m=b;this.yb=a;this.J=c;this.j=d;this.i=32374988;this.A=0}f=$d.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};function ae(b){null!=b.yb&&(b.J=b.yb.w?b.yb.w():b.yb.call(null),b.yb=null);return b.J}f.L=function(){return this.m};f.ha=function(){Cb(this);return null==this.J?null:O(this.J)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};
f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){Cb(this);return null==this.J?null:M(this.J)};f.da=function(){Cb(this);return null!=this.J?uc(this.J):N};f.P=function(){ae(this);if(null==this.J)return null;for(var b=this.J;;)if(b instanceof $d)b=ae(b);else return this.J=b,L(this.J)};f.M=function(b,a){return new $d(a,this.yb,this.J,this.j)};f.R=function(b,a){return Q(a,this)};$d.prototype[Ka]=function(){return wc(this)};be;
function ce(b,a){this.O=b;this.end=a;this.i=2;this.A=0}ce.prototype.add=function(b){this.O[this.end]=b;return this.end+=1};ce.prototype.fa=function(){var b=new be(this.O,0,this.end);this.O=null;return b};ce.prototype.U=function(){return this.end};function de(b){return new ce(Array(b),0)}function be(b,a,c){this.f=b;this.ga=a;this.end=c;this.i=524306;this.A=0}f=be.prototype;f.U=function(){return this.end-this.ga};f.Z=function(b,a){return this.f[this.ga+a]};
f.na=function(b,a,c){return 0<=a&&a<this.end-this.ga?this.f[this.ga+a]:c};f.rc=function(){if(this.ga===this.end)throw Error("-drop-first of empty chunk");return new be(this.f,this.ga+1,this.end)};f.ba=function(b,a){return Pc(this.f,a,this.f[this.ga],this.ga+1)};f.ca=function(b,a,c){return Pc(this.f,a,c,this.ga)};function nd(b,a,c,d){this.fa=b;this.Ha=a;this.m=c;this.j=d;this.i=31850732;this.A=1536}f=nd.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};
f.L=function(){return this.m};f.ha=function(){if(1<Ra(this.fa))return new nd(Tb(this.fa),this.Ha,this.m,null);var b=Cb(this.Ha);return null==b?null:b};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.aa=function(){return B.b(this.fa,0)};f.da=function(){return 1<Ra(this.fa)?new nd(Tb(this.fa),this.Ha,this.m,null):null==this.Ha?N:this.Ha};f.P=function(){return this};f.dc=function(){return this.fa};
f.ec=function(){return null==this.Ha?N:this.Ha};f.M=function(b,a){return new nd(this.fa,this.Ha,a,this.j)};f.R=function(b,a){return Q(a,this)};f.cc=function(){return null==this.Ha?null:this.Ha};nd.prototype[Ka]=function(){return wc(this)};function ee(b,a){return 0===Ra(b)?a:new nd(b,a,null,null)}function fe(b,a){b.add(a)}function Td(b){return Ub(b)}function Ud(b){return Vb(b)}function yd(b){for(var a=[];;)if(L(b))a.push(M(b)),b=O(b);else return a}
function ge(b){if("number"===typeof b)a:{var a=Array(b);if(td(null))for(var c=0,d=L(null);;)if(d&&c<b)a[c]=M(d),c+=1,d=O(d);else{b=a;break a}else{for(c=0;;)if(c<b)a[c]=null,c+=1;else break;b=a}}else b=Ca.a(b);return b}function he(b,a){if(Tc(b))return R(b);for(var c=b,d=a,e=0;;)if(0<d&&L(c))c=O(c),--d,e+=1;else return e}
var ie=function ie(a){return null==a?null:null==O(a)?L(M(a)):Q(M(a),ie(O(a)))},je=function je(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return je.w();case 1:return je.a(arguments[0]);case 2:return je.b(arguments[0],arguments[1]);default:return je.l(arguments[0],arguments[1],new K(c.slice(2),0))}};je.w=function(){return new $d(null,function(){return null},null,null)};je.a=function(b){return new $d(null,function(){return b},null,null)};
je.b=function(b,a){return new $d(null,function(){var c=L(b);return c?pd(c)?ee(Ub(c),je.b(Vb(c),a)):Q(M(c),je.b(uc(c),a)):a},null,null)};je.l=function(b,a,c){return function e(a,b){return new $d(null,function(){var c=L(a);return c?pd(c)?ee(Ub(c),e(Vb(c),b)):Q(M(c),e(uc(c),b)):q(b)?e(M(b),O(b)):null},null,null)}(je.b(b,a),c)};je.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return je.l(a,b,c)};je.C=2;function ke(b){return Nb(b)}
var le=function le(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return le.w();case 1:return le.a(arguments[0]);case 2:return le.b(arguments[0],arguments[1]);default:return le.l(arguments[0],arguments[1],new K(c.slice(2),0))}};le.w=function(){return Lb($c)};le.a=function(b){return b};le.b=function(b,a){return Mb(b,a)};le.l=function(b,a,c){for(;;)if(b=Mb(b,a),q(c))a=M(c),c=O(c);else return b};
le.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return le.l(a,b,c)};le.C=2;
function me(b,a,c){var d=L(c);if(0===a)return b.w?b.w():b.call(null);c=Za(d);var e=$a(d);if(1===a)return b.a?b.a(c):b.a?b.a(c):b.call(null,c);var d=Za(e),g=$a(e);if(2===a)return b.b?b.b(c,d):b.b?b.b(c,d):b.call(null,c,d);var e=Za(g),h=$a(g);if(3===a)return b.c?b.c(c,d,e):b.c?b.c(c,d,e):b.call(null,c,d,e);var g=Za(h),k=$a(h);if(4===a)return b.B?b.B(c,d,e,g):b.B?b.B(c,d,e,g):b.call(null,c,d,e,g);var h=Za(k),l=$a(k);if(5===a)return b.T?b.T(c,d,e,g,h):b.T?b.T(c,d,e,g,h):b.call(null,c,d,e,g,h);var k=Za(l),
n=$a(l);if(6===a)return b.ta?b.ta(c,d,e,g,h,k):b.ta?b.ta(c,d,e,g,h,k):b.call(null,c,d,e,g,h,k);var l=Za(n),r=$a(n);if(7===a)return b.ua?b.ua(c,d,e,g,h,k,l):b.ua?b.ua(c,d,e,g,h,k,l):b.call(null,c,d,e,g,h,k,l);var n=Za(r),y=$a(r);if(8===a)return b.Xa?b.Xa(c,d,e,g,h,k,l,n):b.Xa?b.Xa(c,d,e,g,h,k,l,n):b.call(null,c,d,e,g,h,k,l,n);var r=Za(y),v=$a(y);if(9===a)return b.Ya?b.Ya(c,d,e,g,h,k,l,n,r):b.Ya?b.Ya(c,d,e,g,h,k,l,n,r):b.call(null,c,d,e,g,h,k,l,n,r);var y=Za(v),z=$a(v);if(10===a)return b.Ma?b.Ma(c,
d,e,g,h,k,l,n,r,y):b.Ma?b.Ma(c,d,e,g,h,k,l,n,r,y):b.call(null,c,d,e,g,h,k,l,n,r,y);var v=Za(z),C=$a(z);if(11===a)return b.Na?b.Na(c,d,e,g,h,k,l,n,r,y,v):b.Na?b.Na(c,d,e,g,h,k,l,n,r,y,v):b.call(null,c,d,e,g,h,k,l,n,r,y,v);var z=Za(C),D=$a(C);if(12===a)return b.Oa?b.Oa(c,d,e,g,h,k,l,n,r,y,v,z):b.Oa?b.Oa(c,d,e,g,h,k,l,n,r,y,v,z):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z);var C=Za(D),E=$a(D);if(13===a)return b.Pa?b.Pa(c,d,e,g,h,k,l,n,r,y,v,z,C):b.Pa?b.Pa(c,d,e,g,h,k,l,n,r,y,v,z,C):b.call(null,c,d,e,g,h,k,l,
n,r,y,v,z,C);var D=Za(E),G=$a(E);if(14===a)return b.Qa?b.Qa(c,d,e,g,h,k,l,n,r,y,v,z,C,D):b.Qa?b.Qa(c,d,e,g,h,k,l,n,r,y,v,z,C,D):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D);var E=Za(G),ca=$a(G);if(15===a)return b.Ra?b.Ra(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E):b.Ra?b.Ra(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E);var G=Za(ca),Da=$a(ca);if(16===a)return b.Sa?b.Sa(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G):b.Sa?b.Sa(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G);
var ca=Za(Da),Ea=$a(Da);if(17===a)return b.Ta?b.Ta(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca):b.Ta?b.Ta(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca);var Da=Za(Ea),Kc=$a(Ea);if(18===a)return b.Ua?b.Ua(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da):b.Ua?b.Ua(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da);Ea=Za(Kc);Kc=$a(Kc);if(19===a)return b.Va?b.Va(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea):b.Va?b.Va(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,
ca,Da,Ea):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea);var I=Za(Kc);$a(Kc);if(20===a)return b.Wa?b.Wa(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea,I):b.Wa?b.Wa(c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea,I):b.call(null,c,d,e,g,h,k,l,n,r,y,v,z,C,D,E,G,ca,Da,Ea,I);throw Error("Only up to 20 arguments supported on functions");}
var A=function A(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return A.b(arguments[0],arguments[1]);case 3:return A.c(arguments[0],arguments[1],arguments[2]);case 4:return A.B(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return A.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return A.l(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new K(c.slice(5),0))}};
A.b=function(b,a){var c=b.C;if(b.D){var d=he(a,c+1);return d<=c?me(b,d,a):b.D(a)}return b.apply(b,yd(a))};A.c=function(b,a,c){a=Q(a,c);c=b.C;if(b.D){var d=he(a,c+1);return d<=c?me(b,d,a):b.D(a)}return b.apply(b,yd(a))};A.B=function(b,a,c,d){a=Q(a,Q(c,d));c=b.C;return b.D?(d=he(a,c+1),d<=c?me(b,d,a):b.D(a)):b.apply(b,yd(a))};A.T=function(b,a,c,d,e){a=Q(a,Q(c,Q(d,e)));c=b.C;return b.D?(d=he(a,c+1),d<=c?me(b,d,a):b.D(a)):b.apply(b,yd(a))};
A.l=function(b,a,c,d,e,g){a=Q(a,Q(c,Q(d,Q(e,ie(g)))));c=b.C;return b.D?(d=he(a,c+1),d<=c?me(b,d,a):b.D(a)):b.apply(b,yd(a))};A.D=function(b){var a=M(b),c=O(b);b=M(c);var d=O(c),c=M(d),e=O(d),d=M(e),g=O(e),e=M(g),g=O(g);return A.l(a,b,c,d,e,g)};A.C=5;function oe(b){return L(b)?b:null}
var pe=function pe(){"undefined"===typeof ra&&(ra=function(a,c){this.dd=a;this.cd=c;this.i=393216;this.A=0},ra.prototype.M=function(a,c){return new ra(this.dd,c)},ra.prototype.L=function(){return this.cd},ra.prototype.ea=function(){return!1},ra.prototype.next=function(){return Error("No such element")},ra.prototype.remove=function(){return Error("Unsupported operation")},ra.hc=function(){return new V(null,2,5,W,[Gc(qe,new p(null,1,[re,hc(se,hc($c))],null)),qa.vd],null)},ra.Kb=!0,ra.nb="cljs.core/t_cljs$core19412",
ra.Yb=function(a,c){return Ib(c,"cljs.core/t_cljs$core19412")});return new ra(pe,te)};ue;function ue(b,a,c,d){this.Bb=b;this.first=a;this.la=c;this.m=d;this.i=31719628;this.A=0}f=ue.prototype;f.M=function(b,a){return new ue(this.Bb,this.first,this.la,a)};f.R=function(b,a){return Q(a,Cb(this))};f.Y=function(){return N};f.u=function(b,a){return null!=Cb(this)?Fc(this,a):kd(a)&&null==L(a)};f.K=function(){return Ac(this)};f.P=function(){null!=this.Bb&&this.Bb.step(this);return null==this.la?null:this};
f.aa=function(){null!=this.Bb&&Cb(this);return null==this.la?null:this.first};f.da=function(){null!=this.Bb&&Cb(this);return null==this.la?N:this.la};f.ha=function(){null!=this.Bb&&Cb(this);return null==this.la?null:Cb(this.la)};ue.prototype[Ka]=function(){return wc(this)};function ve(b,a){for(;;){if(null==L(a))return!0;var c;c=M(a);c=b.a?b.a(c):b.call(null,c);if(q(c)){c=b;var d=O(a);b=c;a=d}else return!1}}
function we(b,a){for(;;)if(L(a)){var c;c=M(a);c=b.a?b.a(c):b.call(null,c);if(q(c))return c;c=b;var d=O(a);b=c;a=d}else return null}
function xe(b){return function(){function a(a,c){return Ia(b.b?b.b(a,c):b.call(null,a,c))}function c(a){return Ia(b.a?b.a(a):b.call(null,a))}function d(){return Ia(b.w?b.w():b.call(null))}var e=null,g=function(){function a(b,d,e){var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new K(h,0)}return c.call(this,b,d,g)}function c(a,d,e){return Ia(A.B(b,a,d,e))}a.C=2;a.D=function(a){var b=M(a);a=O(a);var d=M(a);a=uc(a);return c(b,d,a)};a.l=
c;return a}(),e=function(b,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,b);case 2:return a.call(this,b,e);default:var n=null;if(2<arguments.length){for(var n=0,r=Array(arguments.length-2);n<r.length;)r[n]=arguments[n+2],++n;n=new K(r,0)}return g.l(b,e,n)}throw Error("Invalid arity: "+arguments.length);};e.C=2;e.D=g.D;e.w=d;e.a=c;e.b=a;e.l=g.l;return e}()}
function ye(){return function(){function b(a){if(0<arguments.length)for(var b=0,d=Array(arguments.length-0);b<d.length;)d[b]=arguments[b+0],++b;return!1}b.C=0;b.D=function(a){L(a);return!1};b.l=function(){return!1};return b}()}
var ze=function ze(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ze.w();case 1:return ze.a(arguments[0]);case 2:return ze.b(arguments[0],arguments[1]);case 3:return ze.c(arguments[0],arguments[1],arguments[2]);default:return ze.l(arguments[0],arguments[1],arguments[2],new K(c.slice(3),0))}};ze.w=function(){return Dd};ze.a=function(b){return b};
ze.b=function(b,a){return function(){function c(c,d,e){c=a.c?a.c(c,d,e):a.call(null,c,d,e);return b.a?b.a(c):b.call(null,c)}function d(c,d){var e=a.b?a.b(c,d):a.call(null,c,d);return b.a?b.a(e):b.call(null,e)}function e(c){c=a.a?a.a(c):a.call(null,c);return b.a?b.a(c):b.call(null,c)}function g(){var c=a.w?a.w():a.call(null);return b.a?b.a(c):b.call(null,c)}var h=null,k=function(){function c(a,b,e,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new K(k,0)}return d.call(this,a,b,e,h)}function d(c,e,g,h){c=A.T(a,c,e,g,h);return b.a?b.a(c):b.call(null,c)}c.C=3;c.D=function(a){var b=M(a);a=O(a);var c=M(a);a=O(a);var e=M(a);a=uc(a);return d(b,c,e,a)};c.l=d;return c}(),h=function(a,b,h,y){switch(arguments.length){case 0:return g.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var v=null;if(3<arguments.length){for(var v=0,z=Array(arguments.length-3);v<z.length;)z[v]=arguments[v+
3],++v;v=new K(z,0)}return k.l(a,b,h,v)}throw Error("Invalid arity: "+arguments.length);};h.C=3;h.D=k.D;h.w=g;h.a=e;h.b=d;h.c=c;h.l=k.l;return h}()};
ze.c=function(b,a,c){return function(){function d(d,e,g){d=c.c?c.c(d,e,g):c.call(null,d,e,g);d=a.a?a.a(d):a.call(null,d);return b.a?b.a(d):b.call(null,d)}function e(d,e){var g;g=c.b?c.b(d,e):c.call(null,d,e);g=a.a?a.a(g):a.call(null,g);return b.a?b.a(g):b.call(null,g)}function g(d){d=c.a?c.a(d):c.call(null,d);d=a.a?a.a(d):a.call(null,d);return b.a?b.a(d):b.call(null,d)}function h(){var d;d=c.w?c.w():c.call(null);d=a.a?a.a(d):a.call(null,d);return b.a?b.a(d):b.call(null,d)}var k=null,l=function(){function d(a,
b,c,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new K(k,0)}return e.call(this,a,b,c,h)}function e(d,g,h,k){d=A.T(c,d,g,h,k);d=a.a?a.a(d):a.call(null,d);return b.a?b.a(d):b.call(null,d)}d.C=3;d.D=function(a){var b=M(a);a=O(a);var c=M(a);a=O(a);var d=M(a);a=uc(a);return e(b,c,d,a)};d.l=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return g.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var z=null;if(3<arguments.length){for(var z=0,C=Array(arguments.length-3);z<C.length;)C[z]=arguments[z+3],++z;z=new K(C,0)}return l.l(a,b,c,z)}throw Error("Invalid arity: "+arguments.length);};k.C=3;k.D=l.D;k.w=h;k.a=g;k.b=e;k.c=d;k.l=l.l;return k}()};
ze.l=function(b,a,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return c.call(this,d)}function c(b){b=A.b(M(a),b);for(var d=O(a);;)if(d)b=M(d).call(null,b),d=O(d);else return b}b.C=0;b.D=function(a){a=L(a);return c(a)};b.l=c;return b}()}(Wd(Q(b,Q(a,Q(c,d)))))};ze.D=function(b){var a=M(b),c=O(b);b=M(c);var d=O(c),c=M(d),d=O(d);return ze.l(a,b,c,d)};ze.C=3;Ae;
function Be(b,a,c,d){this.state=b;this.m=a;this.gd=c;this.Ec=d;this.A=16386;this.i=6455296}f=Be.prototype;f.equiv=function(b){return this.u(null,b)};f.u=function(b,a){return this===a};f.Fb=function(){return this.state};f.L=function(){return this.m};
f.uc=function(b,a,c){b=L(this.Ec);for(var d=null,e=0,g=0;;)if(g<e){var h=d.Z(null,g),k=S(h,0),h=S(h,1);h.B?h.B(k,this,a,c):h.call(null,k,this,a,c);g+=1}else if(b=L(b))pd(b)?(d=Ub(b),b=Vb(b),k=d,e=R(d),d=k):(d=M(b),k=S(d,0),h=S(d,1),h.B?h.B(k,this,a,c):h.call(null,k,this,a,c),b=O(b),d=null,e=0),g=0;else return null};f.K=function(){return this[da]||(this[da]=++ea)};
var Ce=function Ce(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ce.a(arguments[0]);default:return Ce.l(arguments[0],new K(c.slice(1),0))}};Ce.a=function(b){return new Be(b,null,null,null)};Ce.l=function(b,a){var c=null!=a&&(a.i&64||a.kb)?A.b(Ec,a):a,d=H.b(c,za),c=H.b(c,De);return new Be(b,d,c,null)};Ce.D=function(b){var a=M(b);b=O(b);return Ce.l(a,b)};Ce.C=1;Ee;
function Fe(b,a){if(b instanceof Be){var c=b.gd;if(null!=c&&!q(c.a?c.a(a):c.call(null,a)))throw Error([x("Assert failed: "),x("Validator rejected reference state"),x("\n"),x(function(){var a=hc(Ge,He);return Ee.a?Ee.a(a):Ee.call(null,a)}())].join(""));c=b.state;b.state=a;null!=b.Ec&&Kb(b,c,a);return a}return Xb(b,a)}
var Ie=function Ie(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ie.b(arguments[0],arguments[1]);case 3:return Ie.c(arguments[0],arguments[1],arguments[2]);case 4:return Ie.B(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Ie.l(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0))}};Ie.b=function(b,a){var c;b instanceof Be?(c=b.state,c=a.a?a.a(c):a.call(null,c),c=Fe(b,c)):c=Yb.b(b,a);return c};
Ie.c=function(b,a,c){if(b instanceof Be){var d=b.state;a=a.b?a.b(d,c):a.call(null,d,c);b=Fe(b,a)}else b=Yb.c(b,a,c);return b};Ie.B=function(b,a,c,d){if(b instanceof Be){var e=b.state;a=a.c?a.c(e,c,d):a.call(null,e,c,d);b=Fe(b,a)}else b=Yb.B(b,a,c,d);return b};Ie.l=function(b,a,c,d,e){return b instanceof Be?Fe(b,A.T(a,b.state,c,d,e)):Yb.T(b,a,c,d,e)};Ie.D=function(b){var a=M(b),c=O(b);b=M(c);var d=O(c),c=M(d),e=O(d),d=M(e),e=O(e);return Ie.l(a,b,c,d,e)};Ie.C=4;
function Je(b){this.state=b;this.i=32768;this.A=0}Je.prototype.Fb=function(){return this.state};function Ae(b){return new Je(b)}
var T=function T(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.a(arguments[0]);case 2:return T.b(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.B(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.l(arguments[0],arguments[1],arguments[2],arguments[3],new K(c.slice(4),0))}};
T.a=function(b){return function(a){return function(){function c(c,d){var e=b.a?b.a(d):b.call(null,d);return a.b?a.b(c,e):a.call(null,c,e)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.w?a.w():a.call(null)}var g=null,h=function(){function c(a,b,e){var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new K(h,0)}return d.call(this,a,b,g)}function d(c,e,g){e=A.c(b,e,g);return a.b?a.b(c,e):a.call(null,c,e)}c.C=2;c.D=function(a){var b=
M(a);a=O(a);var c=M(a);a=uc(a);return d(b,c,a)};c.l=d;return c}(),g=function(a,b,g){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var r=null;if(2<arguments.length){for(var r=0,y=Array(arguments.length-2);r<y.length;)y[r]=arguments[r+2],++r;r=new K(y,0)}return h.l(a,b,r)}throw Error("Invalid arity: "+arguments.length);};g.C=2;g.D=h.D;g.w=e;g.a=d;g.b=c;g.l=h.l;return g}()}};
T.b=function(b,a){return new $d(null,function(){var c=L(a);if(c){if(pd(c)){for(var d=Ub(c),e=R(d),g=de(e),h=0;;)if(h<e)fe(g,function(){var a=B.b(d,h);return b.a?b.a(a):b.call(null,a)}()),h+=1;else break;return ee(g.fa(),T.b(b,Vb(c)))}return Q(function(){var a=M(c);return b.a?b.a(a):b.call(null,a)}(),T.b(b,uc(c)))}return null},null,null)};
T.c=function(b,a,c){return new $d(null,function(){var d=L(a),e=L(c);if(d&&e){var g=Q,h;h=M(d);var k=M(e);h=b.b?b.b(h,k):b.call(null,h,k);d=g(h,T.c(b,uc(d),uc(e)))}else d=null;return d},null,null)};T.B=function(b,a,c,d){return new $d(null,function(){var e=L(a),g=L(c),h=L(d);if(e&&g&&h){var k=Q,l;l=M(e);var n=M(g),r=M(h);l=b.c?b.c(l,n,r):b.call(null,l,n,r);e=k(l,T.B(b,uc(e),uc(g),uc(h)))}else e=null;return e},null,null)};
T.l=function(b,a,c,d,e){var g=function k(a){return new $d(null,function(){var b=T.b(L,a);return ve(Dd,b)?Q(T.b(M,b),k(T.b(uc,b))):null},null,null)};return T.b(function(){return function(a){return A.b(b,a)}}(g),g(Zc.l(e,d,J([c,a],0))))};T.D=function(b){var a=M(b),c=O(b);b=M(c);var d=O(c),c=M(d),e=O(d),d=M(e),e=O(e);return T.l(a,b,c,d,e)};T.C=4;
function Ke(b,a){if("number"!==typeof b)throw Error([x("Assert failed: "),x(function(){var a=hc(Le,Me);return Ee.a?Ee.a(a):Ee.call(null,a)}())].join(""));return new $d(null,function(){if(0<b){var c=L(a);return c?Q(M(c),Ke(b-1,uc(c))):null}return null},null,null)}
function Ne(b,a){if("number"!==typeof b)throw Error([x("Assert failed: "),x(function(){var a=hc(Le,Me);return Ee.a?Ee.a(a):Ee.call(null,a)}())].join(""));return new $d(null,function(c){return function(){return c(b,a)}}(function(a,b){for(;;){var e=L(b);if(0<a&&e){var g=a-1,e=uc(e);a=g;b=e}else return e}}),null,null)}function Oe(b){return new $d(null,function(){return Q(b,Oe(b))},null,null)}
var Pe=function Pe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Pe.b(arguments[0],arguments[1]);default:return Pe.l(arguments[0],arguments[1],new K(c.slice(2),0))}};Pe.b=function(b,a){return new $d(null,function(){var c=L(b),d=L(a);return c&&d?Q(M(c),Q(M(d),Pe.b(uc(c),uc(d)))):null},null,null)};
Pe.l=function(b,a,c){return new $d(null,function(){var d=T.b(L,Zc.l(c,a,J([b],0)));return ve(Dd,d)?je.b(T.b(M,d),A.b(Pe,T.b(uc,d))):null},null,null)};Pe.D=function(b){var a=M(b),c=O(b);b=M(c);c=O(c);return Pe.l(a,b,c)};Pe.C=2;function Qe(b){return Ne(1,Pe.b(Oe("L"),b))}Re;
function Se(b,a){return new $d(null,function(){var c=L(a);if(c){if(pd(c)){for(var d=Ub(c),e=R(d),g=de(e),h=0;;)if(h<e){var k;k=B.b(d,h);k=b.a?b.a(k):b.call(null,k);q(k)&&(k=B.b(d,h),g.add(k));h+=1}else break;return ee(g.fa(),Se(b,Vb(c)))}d=M(c);c=uc(c);return q(b.a?b.a(d):b.call(null,d))?Q(d,Se(b,c)):Se(b,c)}return null},null,null)}
function Te(b){return function c(b){return new $d(null,function(){var e=Q,g;q(td.a?td.a(b):td.call(null,b))?(g=J([L.a?L.a(b):L.call(null,b)],0),g=A.b(je,A.c(T,c,g))):g=null;return e(b,g)},null,null)}(b)}function Ue(b,a){return null!=b?null!=b&&(b.A&4||b.kd)?Gc(ke(Ma.c(Mb,Lb(b),a)),id(b)):Ma.c(Wa,b,a):Ma.c(Zc,N,a)}function Ve(b,a){return ke(Ma.c(function(a,d){return le.b(a,b.a?b.a(d):b.call(null,d))},Lb($c),a))}
function We(b,a,c){return dd.c(b,a,function(){var d=H.b(b,a);return c.a?c.a(d):c.call(null,d)}())}function Xe(b,a){this.W=b;this.f=a}function Ye(b){return new Xe(b,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function Ze(b){return new Xe(b.W,La(b.f))}function $e(b){b=b.h;return 32>b?0:b-1>>>5<<5}function af(b,a,c){for(;;){if(0===a)return c;var d=Ye(b);d.f[0]=c;c=d;a-=5}}
var bf=function bf(a,c,d,e){var g=Ze(d),h=a.h-1>>>c&31;5===c?g.f[h]=e:(d=d.f[h],a=null!=d?bf(a,c-5,d,e):af(null,c-5,e),g.f[h]=a);return g};function cf(b,a){throw Error([x("No item "),x(b),x(" in vector of length "),x(a)].join(""));}function df(b,a){if(a>=$e(b))return b.S;for(var c=b.root,d=b.shift;;)if(0<d)var e=d-5,c=c.f[a>>>d&31],d=e;else return c.f}function ef(b,a){return 0<=a&&a<b.h?df(b,a):cf(a,b.h)}
var ff=function ff(a,c,d,e,g){var h=Ze(d);if(0===c)h.f[e&31]=g;else{var k=e>>>c&31;a=ff(a,c-5,d.f[k],e,g);h.f[k]=a}return h},gf=function gf(a,c,d){var e=a.h-2>>>c&31;if(5<c){a=gf(a,c-5,d.f[e]);if(null==a&&0===e)return null;d=Ze(d);d.f[e]=a;return d}if(0===e)return null;d=Ze(d);d.f[e]=null;return d};function hf(b,a,c,d,e,g){this.o=b;this.bc=a;this.f=c;this.xa=d;this.start=e;this.end=g}hf.prototype.ea=function(){return this.o<this.end};
hf.prototype.next=function(){32===this.o-this.bc&&(this.f=df(this.xa,this.o),this.bc+=32);var b=this.f[this.o&31];this.o+=1;return b};jf;kf;lf;P;X;Y;mf;function V(b,a,c,d,e,g){this.m=b;this.h=a;this.shift=c;this.root=d;this.S=e;this.j=g;this.i=167668511;this.A=8196}f=V.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){return"number"===typeof a?B.c(this,a,c):c};
f.Z=function(b,a){return ef(this,a)[a&31]};f.na=function(b,a,c){return 0<=a&&a<this.h?df(this,a)[a&31]:c};f.mb=function(b,a,c){if(0<=a&&a<this.h)return $e(this)<=a?(b=La(this.S),b[a&31]=c,new V(this.m,this.h,this.shift,this.root,b,null)):new V(this.m,this.h,this.shift,ff(this,this.shift,this.root,a,c),this.S,null);if(a===this.h)return Wa(this,c);throw Error([x("Index "),x(a),x(" out of bounds  [0,"),x(this.h),x("]")].join(""));};
f.ia=function(){var b=this.h;return new hf(0,0,0<R(this)?df(this,0):null,this,0,b)};f.L=function(){return this.m};f.U=function(){return this.h};f.Gb=function(){return B.b(this,0)};f.Hb=function(){return B.b(this,1)};f.bb=function(){return 0<this.h?B.b(this,this.h-1):null};
f.cb=function(){if(0===this.h)throw Error("Can't pop empty vector");if(1===this.h)return vb($c,this.m);if(1<this.h-$e(this))return new V(this.m,this.h-1,this.shift,this.root,this.S.slice(0,-1),null);var b=df(this,this.h-2),a=gf(this,this.shift,this.root),a=null==a?W:a,c=this.h-1;return 5<this.shift&&null==a.f[1]?new V(this.m,c,this.shift-5,a.f[0],b,null):new V(this.m,c,this.shift,a,b,null)};f.Ib=function(){return 0<this.h?new Rc(this,this.h-1,null):null};
f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){if(a instanceof V)if(this.h===R(a))for(var c=Zb(this),d=Zb(a);;)if(q(c.ea())){var e=c.next(),g=d.next();if(!ic.b(e,g))return!1}else return!0;else return!1;else return Fc(this,a)};f.vb=function(){return new lf(this.h,this.shift,jf.a?jf.a(this.root):jf.call(null,this.root),kf.a?kf.a(this.S):kf.call(null,this.S))};f.Y=function(){return Gc($c,this.m)};f.ba=function(b,a){return Lc(this,a)};
f.ca=function(b,a,c){b=0;for(var d=c;;)if(b<this.h){var e=df(this,b);c=e.length;a:for(var g=0;;)if(g<c){var h=e[g],d=a.b?a.b(d,h):a.call(null,d,h);if(Ic(d)){e=d;break a}g+=1}else{e=d;break a}if(Ic(e))return P.a?P.a(e):P.call(null,e);b+=c;d=e}else return d};f.qa=function(b,a,c){if("number"===typeof a)return qb(this,a,c);throw Error("Vector's key for assoc must be a number.");};
f.P=function(){if(0===this.h)return null;if(32>=this.h)return new K(this.S,0);var b;a:{b=this.root;for(var a=this.shift;;)if(0<a)a-=5,b=b.f[0];else{b=b.f;break a}}return mf.B?mf.B(this,b,0,0):mf.call(null,this,b,0,0)};f.M=function(b,a){return new V(a,this.h,this.shift,this.root,this.S,this.j)};
f.R=function(b,a){if(32>this.h-$e(this)){for(var c=this.S.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.S[e],e+=1;else break;d[c]=a;return new V(this.m,this.h+1,this.shift,this.root,d,null)}c=(d=this.h>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=Ye(null),d.f[0]=this.root,e=af(null,this.shift,new Xe(null,this.S)),d.f[1]=e):d=bf(this,this.shift,this.root,new Xe(null,this.S));return new V(this.m,this.h+1,c,d,[a],null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.Z(null,b);case 3:return this.na(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.Z(null,b)};b.c=function(a,b,d){return this.na(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.Z(null,b)};f.b=function(b,a){return this.na(null,b,a)};
var W=new Xe(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),$c=new V(null,0,5,W,[],Bc);V.prototype[Ka]=function(){return wc(this)};function Cd(b){if(Ha(b))a:{var a=b.length;if(32>a)b=new V(null,a,5,W,b,null);else for(var c=32,d=(new V(null,32,5,W,b.slice(0,32),null)).vb(null);;)if(c<a)var e=c+1,d=le.b(d,b[c]),c=e;else{b=Nb(d);break a}}else b=Nb(Ma.c(Mb,Lb($c),b));return b}nf;
function od(b,a,c,d,e,g){this.sa=b;this.node=a;this.o=c;this.ga=d;this.m=e;this.j=g;this.i=32375020;this.A=1536}f=od.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};f.ha=function(){if(this.ga+1<this.node.length){var b;b=this.sa;var a=this.node,c=this.o,d=this.ga+1;b=mf.B?mf.B(b,a,c,d):mf.call(null,b,a,c,d);return null==b?null:b}return Wb(this)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};
f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc($c,this.m)};f.ba=function(b,a){var c;c=this.sa;var d=this.o+this.ga,e=R(this.sa);c=nf.c?nf.c(c,d,e):nf.call(null,c,d,e);return Lc(c,a)};f.ca=function(b,a,c){b=this.sa;var d=this.o+this.ga,e=R(this.sa);b=nf.c?nf.c(b,d,e):nf.call(null,b,d,e);return Mc(b,a,c)};f.aa=function(){return this.node[this.ga]};
f.da=function(){if(this.ga+1<this.node.length){var b;b=this.sa;var a=this.node,c=this.o,d=this.ga+1;b=mf.B?mf.B(b,a,c,d):mf.call(null,b,a,c,d);return null==b?N:b}return Vb(this)};f.P=function(){return this};f.dc=function(){var b=this.node;return new be(b,this.ga,b.length)};f.ec=function(){var b=this.o+this.node.length;if(b<Ra(this.sa)){var a=this.sa,c=df(this.sa,b);return mf.B?mf.B(a,c,b,0):mf.call(null,a,c,b,0)}return N};
f.M=function(b,a){return mf.T?mf.T(this.sa,this.node,this.o,this.ga,a):mf.call(null,this.sa,this.node,this.o,this.ga,a)};f.R=function(b,a){return Q(a,this)};f.cc=function(){var b=this.o+this.node.length;if(b<Ra(this.sa)){var a=this.sa,c=df(this.sa,b);return mf.B?mf.B(a,c,b,0):mf.call(null,a,c,b,0)}return null};od.prototype[Ka]=function(){return wc(this)};
var mf=function mf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return mf.c(arguments[0],arguments[1],arguments[2]);case 4:return mf.B(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return mf.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};mf.c=function(b,a,c){return new od(b,ef(b,a),a,c,null,null)};
mf.B=function(b,a,c,d){return new od(b,a,c,d,null,null)};mf.T=function(b,a,c,d,e){return new od(b,a,c,d,e,null)};mf.C=5;pf;function qf(b,a,c,d,e){this.m=b;this.xa=a;this.start=c;this.end=d;this.j=e;this.i=167666463;this.A=8192}f=qf.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){return"number"===typeof a?B.c(this,a,c):c};
f.Z=function(b,a){return 0>a||this.end<=this.start+a?cf(a,this.end-this.start):B.b(this.xa,this.start+a)};f.na=function(b,a,c){return 0>a||this.end<=this.start+a?c:B.c(this.xa,this.start+a,c)};f.mb=function(b,a,c){var d=this.start+a;b=this.m;c=dd.c(this.xa,d,c);a=this.start;var e=this.end,d=d+1,d=e>d?e:d;return pf.T?pf.T(b,c,a,d,null):pf.call(null,b,c,a,d,null)};f.L=function(){return this.m};f.U=function(){return this.end-this.start};f.bb=function(){return B.b(this.xa,this.end-1)};
f.cb=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var b=this.m,a=this.xa,c=this.start,d=this.end-1;return pf.T?pf.T(b,a,c,d,null):pf.call(null,b,a,c,d,null)};f.Ib=function(){return this.start!==this.end?new Rc(this,this.end-this.start-1,null):null};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc($c,this.m)};f.ba=function(b,a){return Lc(this,a)};f.ca=function(b,a,c){return Mc(this,a,c)};
f.qa=function(b,a,c){if("number"===typeof a)return qb(this,a,c);throw Error("Subvec's key for assoc must be a number.");};f.P=function(){var b=this;return function(a){return function d(e){return e===b.end?null:Q(B.b(b.xa,e),new $d(null,function(){return function(){return d(e+1)}}(a),null,null))}}(this)(b.start)};f.M=function(b,a){return pf.T?pf.T(a,this.xa,this.start,this.end,this.j):pf.call(null,a,this.xa,this.start,this.end,this.j)};
f.R=function(b,a){var c=this.m,d=qb(this.xa,this.end,a),e=this.start,g=this.end+1;return pf.T?pf.T(c,d,e,g,null):pf.call(null,c,d,e,g,null)};f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.Z(null,b);case 3:return this.na(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.Z(null,b)};b.c=function(a,b,d){return this.na(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};
f.a=function(b){return this.Z(null,b)};f.b=function(b,a){return this.na(null,b,a)};qf.prototype[Ka]=function(){return wc(this)};function pf(b,a,c,d,e){for(;;)if(a instanceof qf)c=a.start+c,d=a.start+d,a=a.xa;else{var g=R(a);if(0>c||0>d||c>g||d>g)throw Error("Index out of bounds");return new qf(b,a,c,d,e)}}
var nf=function nf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return nf.b(arguments[0],arguments[1]);case 3:return nf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};nf.b=function(b,a){return nf.c(b,a,R(b))};nf.c=function(b,a,c){return pf(null,b,a,c,null)};nf.C=3;function rf(b,a){return b===a.W?a:new Xe(b,La(a.f))}function jf(b){return new Xe({},La(b.f))}
function kf(b){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];rd(b,0,a,0,b.length);return a}var sf=function sf(a,c,d,e){d=rf(a.root.W,d);var g=a.h-1>>>c&31;if(5===c)a=e;else{var h=d.f[g];a=null!=h?sf(a,c-5,h,e):af(a.root.W,c-5,e)}d.f[g]=a;return d};function lf(b,a,c,d){this.h=b;this.shift=a;this.root=c;this.S=d;this.A=88;this.i=275}f=lf.prototype;
f.lb=function(b,a){if(this.root.W){if(32>this.h-$e(this))this.S[this.h&31]=a;else{var c=new Xe(this.root.W,this.S),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=a;this.S=d;if(this.h>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=af(this.root.W,this.shift,c);this.root=new Xe(this.root.W,d);this.shift=e}else this.root=sf(this,this.shift,this.root,c)}this.h+=1;return this}throw Error("conj! after persistent!");};f.wb=function(){if(this.root.W){this.root.W=null;var b=this.h-$e(this),a=Array(b);rd(this.S,0,a,0,b);return new V(null,this.h,this.shift,this.root,a,null)}throw Error("persistent! called twice");};
f.Jb=function(b,a,c){if("number"===typeof a)return Pb(this,a,c);throw Error("TransientVector's key for assoc! must be a number.");};
f.tc=function(b,a,c){var d=this;if(d.root.W){if(0<=a&&a<d.h)return $e(this)<=a?d.S[a&31]=c:(b=function(){return function g(b,k){var l=rf(d.root.W,k);if(0===b)l.f[a&31]=c;else{var n=a>>>b&31,r=g(b-5,l.f[n]);l.f[n]=r}return l}}(this).call(null,d.shift,d.root),d.root=b),this;if(a===d.h)return Mb(this,c);throw Error([x("Index "),x(a),x(" out of bounds for TransientVector of length"),x(d.h)].join(""));}throw Error("assoc! after persistent!");};
f.U=function(){if(this.root.W)return this.h;throw Error("count after persistent!");};f.Z=function(b,a){if(this.root.W)return ef(this,a)[a&31];throw Error("nth after persistent!");};f.na=function(b,a,c){return 0<=a&&a<this.h?B.b(this,a):c};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){return"number"===typeof a?B.c(this,a,c):c};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};function tf(b,a){this.zb=b;this.Qb=a}
tf.prototype.ea=function(){var b=null!=this.zb&&L(this.zb);return b?b:(b=null!=this.Qb)?this.Qb.ea():b};tf.prototype.next=function(){if(null!=this.zb){var b=M(this.zb);this.zb=O(this.zb);return b}if(null!=this.Qb&&this.Qb.ea())return this.Qb.next();throw Error("No such element");};tf.prototype.remove=function(){return Error("Unsupported operation")};function uf(b,a,c,d){this.m=b;this.pa=a;this.Ba=c;this.j=d;this.i=31850572;this.A=0}f=uf.prototype;f.toString=function(){return ac(this)};
f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.aa=function(){return M(this.pa)};f.da=function(){var b=O(this.pa);return b?new uf(this.m,b,this.Ba,null):null==this.Ba?Sa(this):new uf(this.m,this.Ba,null,null)};f.P=function(){return this};f.M=function(b,a){return new uf(a,this.pa,this.Ba,this.j)};f.R=function(b,a){return Q(a,this)};
uf.prototype[Ka]=function(){return wc(this)};function vf(b,a,c,d,e){this.m=b;this.count=a;this.pa=c;this.Ba=d;this.j=e;this.i=31858766;this.A=8192}f=vf.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.ia=function(){return new tf(this.pa,Zb(this.Ba))};f.L=function(){return this.m};f.U=function(){return this.count};f.bb=function(){return M(this.pa)};
f.cb=function(){if(q(this.pa)){var b=O(this.pa);return b?new vf(this.m,this.count-1,b,this.Ba,null):new vf(this.m,this.count-1,L(this.Ba),$c,null)}return this};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(wf,this.m)};f.aa=function(){return M(this.pa)};f.da=function(){return uc(L(this))};f.P=function(){var b=L(this.Ba),a=this.pa;return q(q(a)?a:b)?new uf(null,this.pa,L(b),null):null};
f.M=function(b,a){return new vf(a,this.count,this.pa,this.Ba,this.j)};f.R=function(b,a){var c;q(this.pa)?(c=this.Ba,c=new vf(this.m,this.count+1,this.pa,Zc.b(q(c)?c:$c,a),null)):c=new vf(this.m,this.count+1,Zc.b(this.pa,a),$c,null);return c};var wf=new vf(null,0,null,$c,Bc);vf.prototype[Ka]=function(){return wc(this)};function xf(){this.i=2097152;this.A=0}xf.prototype.equiv=function(b){return this.u(null,b)};xf.prototype.u=function(){return!1};var yf=new xf;
function zf(b,a){return ud(ld(a)?R(b)===R(a)?ve(Dd,T.b(function(b){return ic.b(H.c(a,M(b),yf),Xc(b))},b)):null:null)}function Af(b,a,c,d,e){this.o=b;this.ed=a;this.oc=c;this.Yc=d;this.Cc=e}Af.prototype.ea=function(){var b=this.o<this.oc;return b?b:this.Cc.ea()};Af.prototype.next=function(){if(this.o<this.oc){var b=bd(this.Yc,this.o);this.o+=1;return new V(null,2,5,W,[b,cb.b(this.ed,b)],null)}return this.Cc.next()};Af.prototype.remove=function(){return Error("Unsupported operation")};
function Bf(b){this.J=b}Bf.prototype.next=function(){if(null!=this.J){var b=M(this.J),a=S(b,0),b=S(b,1);this.J=O(this.J);return{value:[a,b],done:!1}}return{value:null,done:!0}};function Cf(b){return new Bf(L(b))}function Df(b){this.J=b}Df.prototype.next=function(){if(null!=this.J){var b=M(this.J);this.J=O(this.J);return{value:[b,b],done:!1}}return{value:null,done:!0}};
function Ef(b,a){var c;if(a instanceof t)a:{c=b.length;for(var d=a.ra,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof t&&d===b[e].ra){c=e;break a}e+=2}}else if("string"==typeof a||"number"===typeof a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(a===b[d]){c=d;break a}d+=2}else if(a instanceof F)a:for(c=b.length,d=a.Ka,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof F&&d===b[e].Ka){c=e;break a}e+=2}else if(null==a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(null==b[d]){c=d;break a}d+=2}else a:for(c=
b.length,d=0;;){if(c<=d){c=-1;break a}if(ic.b(a,b[d])){c=d;break a}d+=2}return c}Ff;function Gf(b,a,c){this.f=b;this.o=a;this.ma=c;this.i=32374990;this.A=0}f=Gf.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.ma};f.ha=function(){return this.o<this.f.length-2?new Gf(this.f,this.o+2,this.ma):null};f.U=function(){return(this.f.length-this.o)/2};f.K=function(){return Ac(this)};f.u=function(b,a){return Fc(this,a)};
f.Y=function(){return Gc(N,this.ma)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return new V(null,2,5,W,[this.f[this.o],this.f[this.o+1]],null)};f.da=function(){return this.o<this.f.length-2?new Gf(this.f,this.o+2,this.ma):N};f.P=function(){return this};f.M=function(b,a){return new Gf(this.f,this.o,a)};f.R=function(b,a){return Q(a,this)};Gf.prototype[Ka]=function(){return wc(this)};Hf;If;function Jf(b,a,c){this.f=b;this.o=a;this.h=c}
Jf.prototype.ea=function(){return this.o<this.h};Jf.prototype.next=function(){var b=new V(null,2,5,W,[this.f[this.o],this.f[this.o+1]],null);this.o+=2;return b};function p(b,a,c,d){this.m=b;this.h=a;this.f=c;this.j=d;this.i=16647951;this.A=8196}f=p.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.keys=function(){return wc(Hf.a?Hf.a(this):Hf.call(null,this))};f.entries=function(){return Cf(L(this))};
f.values=function(){return wc(If.a?If.a(this):If.call(null,this))};f.has=function(b){return vd(this,b)};f.get=function(b,a){return this.F(null,b,a)};f.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var g=c.Z(null,e),h=S(g,0),g=S(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=L(a))pd(a)?(c=Ub(a),a=Vb(a),h=c,d=R(c),c=h):(c=M(a),h=S(c,0),g=S(c,1),b.b?b.b(g,h):b.call(null,g,h),a=O(a),c=null,d=0),e=0;else return null};f.H=function(b,a){return cb.c(this,a,null)};
f.F=function(b,a,c){b=Ef(this.f,a);return-1===b?c:this.f[b+1]};f.ia=function(){return new Jf(this.f,0,2*this.h)};f.L=function(){return this.m};f.U=function(){return this.h};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Cc(this)};f.u=function(b,a){if(null!=a&&(a.i&1024||a.Mc)){var c=this.f.length;if(this.h===a.U(null))for(var d=0;;)if(d<c){var e=a.F(null,this.f[d],sd);if(e!==sd)if(ic.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return zf(this,a)};
f.vb=function(){return new Ff({},this.f.length,La(this.f))};f.Y=function(){return vb(te,this.m)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.Ea=function(b,a){if(0<=Ef(this.f,a)){var c=this.f.length,d=c-2;if(0===d)return Sa(this);for(var d=Array(d),e=0,g=0;;){if(e>=c)return new p(this.m,this.h-1,d,null);ic.b(a,this.f[e])||(d[g]=this.f[e],d[g+1]=this.f[e+1],g+=2);e+=2}}else return this};
f.qa=function(b,a,c){b=Ef(this.f,a);if(-1===b){if(this.h<Kf){b=this.f;for(var d=b.length,e=Array(d+2),g=0;;)if(g<d)e[g]=b[g],g+=1;else break;e[d]=a;e[d+1]=c;return new p(this.m,this.h+1,e,null)}return vb(eb(Ue(ed,this),a,c),this.m)}if(c===this.f[b+1])return this;a=La(this.f);a[b+1]=c;return new p(this.m,this.h,a,null)};f.Tb=function(b,a){return-1!==Ef(this.f,a)};f.P=function(){var b=this.f;return 0<=b.length-2?new Gf(b,0,null):null};f.M=function(b,a){return new p(a,this.h,this.f,this.j)};
f.R=function(b,a){if(md(a))return eb(this,B.b(a,0),B.b(a,1));for(var c=this,d=L(a);;){if(null==d)return c;var e=M(d);if(md(e))c=eb(c,B.b(e,0),B.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};var te=new p(null,0,[],Dc),Kf=8;p.prototype[Ka]=function(){return wc(this)};
Lf;function Ff(b,a,c){this.xb=b;this.qb=a;this.f=c;this.i=258;this.A=56}f=Ff.prototype;f.U=function(){if(q(this.xb))return Md(this.qb);throw Error("count after persistent!");};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){if(q(this.xb))return b=Ef(this.f,a),-1===b?c:this.f[b+1];throw Error("lookup after persistent!");};
f.lb=function(b,a){if(q(this.xb)){if(null!=a?a.i&2048||a.Nc||(a.i?0:u(ib,a)):u(ib,a))return Ob(this,Qd.a?Qd.a(a):Qd.call(null,a),Rd.a?Rd.a(a):Rd.call(null,a));for(var c=L(a),d=this;;){var e=M(c);if(q(e))c=O(c),d=Ob(d,Qd.a?Qd.a(e):Qd.call(null,e),Rd.a?Rd.a(e):Rd.call(null,e));else return d}}else throw Error("conj! after persistent!");};f.wb=function(){if(q(this.xb))return this.xb=!1,new p(null,Md(this.qb),this.f,null);throw Error("persistent! called twice");};
f.Jb=function(b,a,c){if(q(this.xb)){b=Ef(this.f,a);if(-1===b){if(this.qb+2<=2*Kf)return this.qb+=2,this.f.push(a),this.f.push(c),this;b=Lf.b?Lf.b(this.qb,this.f):Lf.call(null,this.qb,this.f);return Ob(b,a,c)}c!==this.f[b+1]&&(this.f[b+1]=c);return this}throw Error("assoc! after persistent!");};Mf;cd;function Lf(b,a){for(var c=Lb(ed),d=0;;)if(d<b)c=Ob(c,a[d],a[d+1]),d+=2;else return c}function Nf(){this.s=!1}Of;Pf;Fe;Qf;Ce;P;function Rf(b,a){return b===a?!0:U(b,a)?!0:ic.b(b,a)}
function Sf(b,a,c){b=La(b);b[a]=c;return b}function Tf(b,a){var c=Array(b.length-2);rd(b,0,c,0,2*a);rd(b,2*(a+1),c,2*a,c.length-2*a);return c}function Uf(b,a,c,d){b=b.ob(a);b.f[c]=d;return b}Vf;function Wf(b,a,c,d){this.f=b;this.o=a;this.Ob=c;this.Aa=d}Wf.prototype.advance=function(){for(var b=this.f.length;;)if(this.o<b){var a=this.f[this.o],c=this.f[this.o+1];null!=a?a=this.Ob=new V(null,2,5,W,[a,c],null):null!=c?(a=Zb(c),a=a.ea()?this.Aa=a:!1):a=!1;this.o+=2;if(a)return!0}else return!1};
Wf.prototype.ea=function(){var b=null!=this.Ob;return b?b:(b=null!=this.Aa)?b:this.advance()};Wf.prototype.next=function(){if(null!=this.Ob){var b=this.Ob;this.Ob=null;return b}if(null!=this.Aa)return b=this.Aa.next(),this.Aa.ea()||(this.Aa=null),b;if(this.advance())return this.next();throw Error("No such element");};Wf.prototype.remove=function(){return Error("Unsupported operation")};function Xf(b,a,c){this.W=b;this.$=a;this.f=c}f=Xf.prototype;
f.ob=function(b){if(b===this.W)return this;var a=Nd(this.$),c=Array(0>a?4:2*(a+1));rd(this.f,0,c,0,2*a);return new Xf(b,this.$,c)};f.Mb=function(){return Of.a?Of.a(this.f):Of.call(null,this.f)};f.fb=function(b,a,c,d){var e=1<<(a>>>b&31);if(0===(this.$&e))return d;var g=Nd(this.$&e-1),e=this.f[2*g],g=this.f[2*g+1];return null==e?g.fb(b+5,a,c,d):Rf(c,e)?g:d};
f.za=function(b,a,c,d,e,g){var h=1<<(c>>>a&31),k=Nd(this.$&h-1);if(0===(this.$&h)){var l=Nd(this.$);if(2*l<this.f.length){b=this.ob(b);a=b.f;g.s=!0;a:for(c=2*(l-k),g=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;a[l]=a[g];--l;--c;--g}a[2*k]=d;a[2*k+1]=e;b.$|=h;return b}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>a&31]=Yf.za(b,a+5,c,d,e,g);for(e=d=0;;)if(32>d)0!==
(this.$>>>d&1)&&(k[d]=null!=this.f[e]?Yf.za(b,a+5,oc(this.f[e]),this.f[e],this.f[e+1],g):this.f[e+1],e+=2),d+=1;else break;return new Vf(b,l+1,k)}a=Array(2*(l+4));rd(this.f,0,a,0,2*k);a[2*k]=d;a[2*k+1]=e;rd(this.f,2*k,a,2*(k+1),2*(l-k));g.s=!0;b=this.ob(b);b.f=a;b.$|=h;return b}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.za(b,a+5,c,d,e,g),l===h?this:Uf(this,b,2*k+1,l);if(Rf(d,l))return e===h?this:Uf(this,b,2*k+1,e);g.s=!0;g=a+5;d=Qf.ua?Qf.ua(b,g,l,h,c,d,e):Qf.call(null,b,g,l,h,c,d,e);e=2*
k;k=2*k+1;b=this.ob(b);b.f[e]=null;b.f[k]=d;return b};
f.ya=function(b,a,c,d,e){var g=1<<(a>>>b&31),h=Nd(this.$&g-1);if(0===(this.$&g)){var k=Nd(this.$);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[a>>>b&31]=Yf.ya(b+5,a,c,d,e);for(d=c=0;;)if(32>c)0!==(this.$>>>c&1)&&(h[c]=null!=this.f[d]?Yf.ya(b+5,oc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Vf(null,k+1,h)}b=Array(2*(k+1));rd(this.f,
0,b,0,2*h);b[2*h]=c;b[2*h+1]=d;rd(this.f,2*h,b,2*(h+1),2*(k-h));e.s=!0;return new Xf(null,this.$|g,b)}var l=this.f[2*h],g=this.f[2*h+1];if(null==l)return k=g.ya(b+5,a,c,d,e),k===g?this:new Xf(null,this.$,Sf(this.f,2*h+1,k));if(Rf(c,l))return d===g?this:new Xf(null,this.$,Sf(this.f,2*h+1,d));e.s=!0;e=this.$;k=this.f;b+=5;b=Qf.ta?Qf.ta(b,l,g,a,c,d):Qf.call(null,b,l,g,a,c,d);c=2*h;h=2*h+1;d=La(k);d[c]=null;d[h]=b;return new Xf(null,e,d)};
f.Nb=function(b,a,c){var d=1<<(a>>>b&31);if(0===(this.$&d))return this;var e=Nd(this.$&d-1),g=this.f[2*e],h=this.f[2*e+1];return null==g?(b=h.Nb(b+5,a,c),b===h?this:null!=b?new Xf(null,this.$,Sf(this.f,2*e+1,b)):this.$===d?null:new Xf(null,this.$^d,Tf(this.f,e))):Rf(c,g)?new Xf(null,this.$^d,Tf(this.f,e)):this};f.ia=function(){return new Wf(this.f,0,null,null)};var Yf=new Xf(null,0,[]);function Zf(b,a,c){this.f=b;this.o=a;this.Aa=c}
Zf.prototype.ea=function(){for(var b=this.f.length;;){if(null!=this.Aa&&this.Aa.ea())return!0;if(this.o<b){var a=this.f[this.o];this.o+=1;null!=a&&(this.Aa=Zb(a))}else return!1}};Zf.prototype.next=function(){if(this.ea())return this.Aa.next();throw Error("No such element");};Zf.prototype.remove=function(){return Error("Unsupported operation")};function Vf(b,a,c){this.W=b;this.h=a;this.f=c}f=Vf.prototype;f.ob=function(b){return b===this.W?this:new Vf(b,this.h,La(this.f))};
f.Mb=function(){return Pf.a?Pf.a(this.f):Pf.call(null,this.f)};f.fb=function(b,a,c,d){var e=this.f[a>>>b&31];return null!=e?e.fb(b+5,a,c,d):d};f.za=function(b,a,c,d,e,g){var h=c>>>a&31,k=this.f[h];if(null==k)return b=Uf(this,b,h,Yf.za(b,a+5,c,d,e,g)),b.h+=1,b;a=k.za(b,a+5,c,d,e,g);return a===k?this:Uf(this,b,h,a)};
f.ya=function(b,a,c,d,e){var g=a>>>b&31,h=this.f[g];if(null==h)return new Vf(null,this.h+1,Sf(this.f,g,Yf.ya(b+5,a,c,d,e)));b=h.ya(b+5,a,c,d,e);return b===h?this:new Vf(null,this.h,Sf(this.f,g,b))};
f.Nb=function(b,a,c){var d=a>>>b&31,e=this.f[d];if(null!=e){b=e.Nb(b+5,a,c);if(b===e)d=this;else if(null==b)if(8>=this.h)a:{e=this.f;b=e.length;a=Array(2*(this.h-1));c=0;for(var g=1,h=0;;)if(c<b)c!==d&&null!=e[c]&&(a[g]=e[c],g+=2,h|=1<<c),c+=1;else{d=new Xf(null,h,a);break a}}else d=new Vf(null,this.h-1,Sf(this.f,d,b));else d=new Vf(null,this.h,Sf(this.f,d,b));return d}return this};f.ia=function(){return new Zf(this.f,0,null)};
function $f(b,a,c){a*=2;for(var d=0;;)if(d<a){if(Rf(c,b[d]))return d;d+=2}else return-1}function ag(b,a,c,d){this.W=b;this.Za=a;this.h=c;this.f=d}f=ag.prototype;f.ob=function(b){if(b===this.W)return this;var a=Array(2*(this.h+1));rd(this.f,0,a,0,2*this.h);return new ag(b,this.Za,this.h,a)};f.Mb=function(){return Of.a?Of.a(this.f):Of.call(null,this.f)};f.fb=function(b,a,c,d){b=$f(this.f,this.h,c);return 0>b?d:Rf(c,this.f[b])?this.f[b+1]:d};
f.za=function(b,a,c,d,e,g){if(c===this.Za){a=$f(this.f,this.h,d);if(-1===a){if(this.f.length>2*this.h)return a=2*this.h,c=2*this.h+1,b=this.ob(b),b.f[a]=d,b.f[c]=e,g.s=!0,b.h+=1,b;c=this.f.length;a=Array(c+2);rd(this.f,0,a,0,c);a[c]=d;a[c+1]=e;g.s=!0;d=this.h+1;b===this.W?(this.f=a,this.h=d,b=this):b=new ag(this.W,this.Za,d,a);return b}return this.f[a+1]===e?this:Uf(this,b,a+1,e)}return(new Xf(b,1<<(this.Za>>>a&31),[null,this,null,null])).za(b,a,c,d,e,g)};
f.ya=function(b,a,c,d,e){return a===this.Za?(b=$f(this.f,this.h,c),-1===b?(b=2*this.h,a=Array(b+2),rd(this.f,0,a,0,b),a[b]=c,a[b+1]=d,e.s=!0,new ag(null,this.Za,this.h+1,a)):ic.b(this.f[b],d)?this:new ag(null,this.Za,this.h,Sf(this.f,b+1,d))):(new Xf(null,1<<(this.Za>>>b&31),[null,this])).ya(b,a,c,d,e)};f.Nb=function(b,a,c){b=$f(this.f,this.h,c);return-1===b?this:1===this.h?null:new ag(null,this.Za,this.h-1,Tf(this.f,Md(b)))};f.ia=function(){return new Wf(this.f,0,null,null)};
var Qf=function Qf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Qf.ta(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Qf.ua(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};
Qf.ta=function(b,a,c,d,e,g){var h=oc(a);if(h===d)return new ag(null,h,2,[a,c,e,g]);var k=new Nf;return Yf.ya(b,h,a,c,k).ya(b,d,e,g,k)};Qf.ua=function(b,a,c,d,e,g,h){var k=oc(c);if(k===e)return new ag(null,k,2,[c,d,g,h]);var l=new Nf;return Yf.za(b,a,k,c,d,l).za(b,a,e,g,h,l)};Qf.C=7;function bg(b,a,c,d,e){this.m=b;this.hb=a;this.o=c;this.J=d;this.j=e;this.i=32374860;this.A=0}f=bg.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};
f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return null==this.J?new V(null,2,5,W,[this.hb[this.o],this.hb[this.o+1]],null):M(this.J)};
f.da=function(){if(null==this.J){var b=this.hb,a=this.o+2;return Of.c?Of.c(b,a,null):Of.call(null,b,a,null)}var b=this.hb,a=this.o,c=O(this.J);return Of.c?Of.c(b,a,c):Of.call(null,b,a,c)};f.P=function(){return this};f.M=function(b,a){return new bg(a,this.hb,this.o,this.J,this.j)};f.R=function(b,a){return Q(a,this)};bg.prototype[Ka]=function(){return wc(this)};
var Of=function Of(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Of.a(arguments[0]);case 3:return Of.c(arguments[0],arguments[1],arguments[2]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};Of.a=function(b){return Of.c(b,0,null)};
Of.c=function(b,a,c){if(null==c)for(c=b.length;;)if(a<c){if(null!=b[a])return new bg(null,b,a,null,null);var d=b[a+1];if(q(d)&&(d=d.Mb(),q(d)))return new bg(null,b,a+2,d,null);a+=2}else return null;else return new bg(null,b,a,c,null)};Of.C=3;function cg(b,a,c,d,e){this.m=b;this.hb=a;this.o=c;this.J=d;this.j=e;this.i=32374860;this.A=0}f=cg.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};
f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return M(this.J)};f.da=function(){var b=this.hb,a=this.o,c=O(this.J);return Pf.B?Pf.B(null,b,a,c):Pf.call(null,null,b,a,c)};f.P=function(){return this};f.M=function(b,a){return new cg(a,this.hb,this.o,this.J,this.j)};f.R=function(b,a){return Q(a,this)};
cg.prototype[Ka]=function(){return wc(this)};var Pf=function Pf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Pf.a(arguments[0]);case 4:return Pf.B(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};Pf.a=function(b){return Pf.B(null,b,0,null)};
Pf.B=function(b,a,c,d){if(null==d)for(d=a.length;;)if(c<d){var e=a[c];if(q(e)&&(e=e.Mb(),q(e)))return new cg(b,a,c+1,e,null);c+=1}else return null;else return new cg(b,a,c,d,null)};Pf.C=4;Mf;function dg(b,a,c){this.oa=b;this.Dc=a;this.jc=c}dg.prototype.ea=function(){return this.jc&&this.Dc.ea()};dg.prototype.next=function(){if(this.jc)return this.Dc.next();this.jc=!0;return this.oa};dg.prototype.remove=function(){return Error("Unsupported operation")};
function cd(b,a,c,d,e,g){this.m=b;this.h=a;this.root=c;this.ja=d;this.oa=e;this.j=g;this.i=16123663;this.A=8196}f=cd.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.keys=function(){return wc(Hf.a?Hf.a(this):Hf.call(null,this))};f.entries=function(){return Cf(L(this))};f.values=function(){return wc(If.a?If.a(this):If.call(null,this))};f.has=function(b){return vd(this,b)};f.get=function(b,a){return this.F(null,b,a)};
f.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var g=c.Z(null,e),h=S(g,0),g=S(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=L(a))pd(a)?(c=Ub(a),a=Vb(a),h=c,d=R(c),c=h):(c=M(a),h=S(c,0),g=S(c,1),b.b?b.b(g,h):b.call(null,g,h),a=O(a),c=null,d=0),e=0;else return null};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){return null==a?this.ja?this.oa:c:null==this.root?c:this.root.fb(0,oc(a),a,c)};
f.ia=function(){var b=this.root?Zb(this.root):pe;return this.ja?new dg(this.oa,b,!1):b};f.L=function(){return this.m};f.U=function(){return this.h};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Cc(this)};f.u=function(b,a){return zf(this,a)};f.vb=function(){return new Mf({},this.root,this.h,this.ja,this.oa)};f.Y=function(){return vb(ed,this.m)};
f.Ea=function(b,a){if(null==a)return this.ja?new cd(this.m,this.h-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Nb(0,oc(a),a);return c===this.root?this:new cd(this.m,this.h-1,c,this.ja,this.oa,null)};f.qa=function(b,a,c){if(null==a)return this.ja&&c===this.oa?this:new cd(this.m,this.ja?this.h:this.h+1,this.root,!0,c,null);b=new Nf;a=(null==this.root?Yf:this.root).ya(0,oc(a),a,c,b);return a===this.root?this:new cd(this.m,b.s?this.h+1:this.h,a,this.ja,this.oa,null)};
f.Tb=function(b,a){return null==a?this.ja:null==this.root?!1:this.root.fb(0,oc(a),a,sd)!==sd};f.P=function(){if(0<this.h){var b=null!=this.root?this.root.Mb():null;return this.ja?Q(new V(null,2,5,W,[null,this.oa],null),b):b}return null};f.M=function(b,a){return new cd(a,this.h,this.root,this.ja,this.oa,this.j)};
f.R=function(b,a){if(md(a))return eb(this,B.b(a,0),B.b(a,1));for(var c=this,d=L(a);;){if(null==d)return c;var e=M(d);if(md(e))c=eb(c,B.b(e,0),B.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};var ed=new cd(null,0,null,!1,null,Dc);cd.prototype[Ka]=function(){return wc(this)};
function Mf(b,a,c,d,e){this.W=b;this.root=a;this.count=c;this.ja=d;this.oa=e;this.i=258;this.A=56}function eg(b,a,c){if(b.W){if(null==a)b.oa!==c&&(b.oa=c),b.ja||(b.count+=1,b.ja=!0);else{var d=new Nf;a=(null==b.root?Yf:b.root).za(b.W,0,oc(a),a,c,d);a!==b.root&&(b.root=a);d.s&&(b.count+=1)}return b}throw Error("assoc! after persistent!");}f=Mf.prototype;f.U=function(){if(this.W)return this.count;throw Error("count after persistent!");};
f.H=function(b,a){return null==a?this.ja?this.oa:null:null==this.root?null:this.root.fb(0,oc(a),a)};f.F=function(b,a,c){return null==a?this.ja?this.oa:c:null==this.root?c:this.root.fb(0,oc(a),a,c)};
f.lb=function(b,a){var c;a:if(this.W)if(null!=a?a.i&2048||a.Nc||(a.i?0:u(ib,a)):u(ib,a))c=eg(this,Qd.a?Qd.a(a):Qd.call(null,a),Rd.a?Rd.a(a):Rd.call(null,a));else{c=L(a);for(var d=this;;){var e=M(c);if(q(e))c=O(c),d=eg(d,Qd.a?Qd.a(e):Qd.call(null,e),Rd.a?Rd.a(e):Rd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};f.wb=function(){var b;if(this.W)this.W=null,b=new cd(null,this.count,this.root,this.ja,this.oa,null);else throw Error("persistent! called twice");return b};
f.Jb=function(b,a,c){return eg(this,a,c)};function fg(b,a,c){for(var d=a;;)if(null!=b)a=c?b.left:b.right,d=Zc.b(d,b),b=a;else return d}function gg(b,a,c,d,e){this.m=b;this.stack=a;this.Rb=c;this.h=d;this.j=e;this.i=32374862;this.A=0}f=gg.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.m};f.U=function(){return 0>this.h?R(O(this))+1:this.h};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};
f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){var b=this.stack;return null==b?null:nb(b)};f.da=function(){var b=M(this.stack),b=fg(this.Rb?b.right:b.left,O(this.stack),this.Rb);return null!=b?new gg(null,b,this.Rb,this.h-1,null):N};f.P=function(){return this};f.M=function(b,a){return new gg(a,this.stack,this.Rb,this.h,this.j)};f.R=function(b,a){return Q(a,this)};
gg.prototype[Ka]=function(){return wc(this)};function hg(b,a,c){return new gg(null,fg(b,null,a),a,c,null)}Z;ig;function jg(b,a,c,d){return c instanceof Z?c.left instanceof Z?new Z(c.key,c.s,c.left.La(),new ig(b,a,c.right,d,null),null):c.right instanceof Z?new Z(c.right.key,c.right.s,new ig(c.key,c.s,c.left,c.right.left,null),new ig(b,a,c.right.right,d,null),null):new ig(b,a,c,d,null):new ig(b,a,c,d,null)}
function kg(b,a,c,d){return d instanceof Z?d.right instanceof Z?new Z(d.key,d.s,new ig(b,a,c,d.left,null),d.right.La(),null):d.left instanceof Z?new Z(d.left.key,d.left.s,new ig(b,a,c,d.left.left,null),new ig(d.key,d.s,d.left.right,d.right,null),null):new ig(b,a,c,d,null):new ig(b,a,c,d,null)}
function lg(b,a,c,d){if(c instanceof Z)return new Z(b,a,c.La(),d,null);if(d instanceof ig)return kg(b,a,c,d.Pb());if(d instanceof Z&&d.left instanceof ig)return new Z(d.left.key,d.left.s,new ig(b,a,c,d.left.left,null),kg(d.key,d.s,d.left.right,d.right.Pb()),null);throw Error("red-black tree invariant violation");}function ig(b,a,c,d,e){this.key=b;this.s=a;this.left=c;this.right=d;this.j=e;this.i=32402207;this.A=0}f=ig.prototype;f.lc=function(b){return b.nc(this)};
f.Pb=function(){return new Z(this.key,this.s,this.left,this.right,null)};f.La=function(){return this};f.kc=function(b){return b.mc(this)};f.replace=function(b,a,c,d){return new ig(b,a,c,d,null)};f.mc=function(b){return new ig(b.key,b.s,this,b.right,null)};f.nc=function(b){return new ig(b.key,b.s,b.left,this,null)};f.H=function(b,a){return B.c(this,a,null)};f.F=function(b,a,c){return B.c(this,a,c)};f.Z=function(b,a){return 0===a?this.key:1===a?this.s:null};
f.na=function(b,a,c){return 0===a?this.key:1===a?this.s:c};f.mb=function(b,a,c){return(new V(null,2,5,W,[this.key,this.s],null)).mb(null,a,c)};f.L=function(){return null};f.U=function(){return 2};f.Gb=function(){return this.key};f.Hb=function(){return this.s};f.bb=function(){return this.s};f.cb=function(){return new V(null,1,5,W,[this.key],null)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return $c};
f.ba=function(b,a){return Lc(this,a)};f.ca=function(b,a,c){return Mc(this,a,c)};f.qa=function(b,a,c){return dd.c(new V(null,2,5,W,[this.key,this.s],null),a,c)};f.P=function(){return Wa(Wa(N,this.s),this.key)};f.M=function(b,a){return Gc(new V(null,2,5,W,[this.key,this.s],null),a)};f.R=function(b,a){return new V(null,3,5,W,[this.key,this.s,a],null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};ig.prototype[Ka]=function(){return wc(this)};
function Z(b,a,c,d,e){this.key=b;this.s=a;this.left=c;this.right=d;this.j=e;this.i=32402207;this.A=0}f=Z.prototype;f.lc=function(b){return new Z(this.key,this.s,this.left,b,null)};f.Pb=function(){throw Error("red-black tree invariant violation");};f.La=function(){return new ig(this.key,this.s,this.left,this.right,null)};f.kc=function(b){return new Z(this.key,this.s,b,this.right,null)};f.replace=function(b,a,c,d){return new Z(b,a,c,d,null)};
f.mc=function(b){return this.left instanceof Z?new Z(this.key,this.s,this.left.La(),new ig(b.key,b.s,this.right,b.right,null),null):this.right instanceof Z?new Z(this.right.key,this.right.s,new ig(this.key,this.s,this.left,this.right.left,null),new ig(b.key,b.s,this.right.right,b.right,null),null):new ig(b.key,b.s,this,b.right,null)};
f.nc=function(b){return this.right instanceof Z?new Z(this.key,this.s,new ig(b.key,b.s,b.left,this.left,null),this.right.La(),null):this.left instanceof Z?new Z(this.left.key,this.left.s,new ig(b.key,b.s,b.left,this.left.left,null),new ig(this.key,this.s,this.left.right,this.right,null),null):new ig(b.key,b.s,b.left,this,null)};f.H=function(b,a){return B.c(this,a,null)};f.F=function(b,a,c){return B.c(this,a,c)};f.Z=function(b,a){return 0===a?this.key:1===a?this.s:null};
f.na=function(b,a,c){return 0===a?this.key:1===a?this.s:c};f.mb=function(b,a,c){return(new V(null,2,5,W,[this.key,this.s],null)).mb(null,a,c)};f.L=function(){return null};f.U=function(){return 2};f.Gb=function(){return this.key};f.Hb=function(){return this.s};f.bb=function(){return this.s};f.cb=function(){return new V(null,1,5,W,[this.key],null)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return $c};
f.ba=function(b,a){return Lc(this,a)};f.ca=function(b,a,c){return Mc(this,a,c)};f.qa=function(b,a,c){return dd.c(new V(null,2,5,W,[this.key,this.s],null),a,c)};f.P=function(){return Wa(Wa(N,this.s),this.key)};f.M=function(b,a){return Gc(new V(null,2,5,W,[this.key,this.s],null),a)};f.R=function(b,a){return new V(null,3,5,W,[this.key,this.s,a],null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};Z.prototype[Ka]=function(){return wc(this)};
var mg=function mg(a,c,d,e,g){if(null==c)return new Z(d,e,null,null,null);var h;h=c.key;h=a.b?a.b(d,h):a.call(null,d,h);if(0===h)return g[0]=c,null;if(0>h)return a=mg(a,c.left,d,e,g),null!=a?c.kc(a):null;a=mg(a,c.right,d,e,g);return null!=a?c.lc(a):null},ng=function ng(a,c){if(null==a)return c;if(null==c)return a;if(a instanceof Z){if(c instanceof Z){var d=ng(a.right,c.left);return d instanceof Z?new Z(d.key,d.s,new Z(a.key,a.s,a.left,d.left,null),new Z(c.key,c.s,d.right,c.right,null),null):new Z(a.key,
a.s,a.left,new Z(c.key,c.s,d,c.right,null),null)}return new Z(a.key,a.s,a.left,ng(a.right,c),null)}if(c instanceof Z)return new Z(c.key,c.s,ng(a,c.left),c.right,null);d=ng(a.right,c.left);return d instanceof Z?new Z(d.key,d.s,new ig(a.key,a.s,a.left,d.left,null),new ig(c.key,c.s,d.right,c.right,null),null):lg(a.key,a.s,a.left,new ig(c.key,c.s,d,c.right,null))},og=function og(a,c,d,e){if(null!=c){var g;g=c.key;g=a.b?a.b(d,g):a.call(null,d,g);if(0===g)return e[0]=c,ng(c.left,c.right);if(0>g)return a=
og(a,c.left,d,e),null!=a||null!=e[0]?c.left instanceof ig?lg(c.key,c.s,a,c.right):new Z(c.key,c.s,a,c.right,null):null;a=og(a,c.right,d,e);if(null!=a||null!=e[0])if(c.right instanceof ig)if(e=c.key,d=c.s,c=c.left,a instanceof Z)c=new Z(e,d,c,a.La(),null);else if(c instanceof ig)c=jg(e,d,c.Pb(),a);else if(c instanceof Z&&c.right instanceof ig)c=new Z(c.right.key,c.right.s,jg(c.key,c.s,c.left.Pb(),c.right.left),new ig(e,d,c.right.right,a,null),null);else throw Error("red-black tree invariant violation");
else c=new Z(c.key,c.s,c.left,a,null);else c=null;return c}return null},pg=function pg(a,c,d,e){var g=c.key,h=a.b?a.b(d,g):a.call(null,d,g);return 0===h?c.replace(g,e,c.left,c.right):0>h?c.replace(g,c.s,pg(a,c.left,d,e),c.right):c.replace(g,c.s,c.left,pg(a,c.right,d,e))};Qd;function qg(b,a,c,d,e){this.wa=b;this.sb=a;this.h=c;this.m=d;this.j=e;this.i=418776847;this.A=8192}f=qg.prototype;
f.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var g=c.Z(null,e),h=S(g,0),g=S(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=L(a))pd(a)?(c=Ub(a),a=Vb(a),h=c,d=R(c),c=h):(c=M(a),h=S(c,0),g=S(c,1),b.b?b.b(g,h):b.call(null,g,h),a=O(a),c=null,d=0),e=0;else return null};f.get=function(b,a){return this.F(null,b,a)};f.entries=function(){return Cf(L(this))};f.toString=function(){return ac(this)};f.keys=function(){return wc(Hf.a?Hf.a(this):Hf.call(null,this))};
f.values=function(){return wc(If.a?If.a(this):If.call(null,this))};f.equiv=function(b){return this.u(null,b)};function rg(b,a){for(var c=b.sb;;)if(null!=c){var d;d=c.key;d=b.wa.b?b.wa.b(a,d):b.wa.call(null,a,d);if(0===d)return c;c=0>d?c.left:c.right}else return null}f.has=function(b){return vd(this,b)};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){b=rg(this,a);return null!=b?b.s:c};f.L=function(){return this.m};f.U=function(){return this.h};
f.Ib=function(){return 0<this.h?hg(this.sb,!1,this.h):null};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Cc(this)};f.u=function(b,a){return zf(this,a)};f.Y=function(){return new qg(this.wa,null,0,this.m,0)};f.Ea=function(b,a){var c=[null],d=og(this.wa,this.sb,a,c);return null==d?null==bd(c,0)?this:new qg(this.wa,null,0,this.m,null):new qg(this.wa,d.La(),this.h-1,this.m,null)};
f.qa=function(b,a,c){b=[null];var d=mg(this.wa,this.sb,a,c,b);return null==d?(b=bd(b,0),ic.b(c,b.s)?this:new qg(this.wa,pg(this.wa,this.sb,a,c),this.h,this.m,null)):new qg(this.wa,d.La(),this.h+1,this.m,null)};f.Tb=function(b,a){return null!=rg(this,a)};f.P=function(){return 0<this.h?hg(this.sb,!0,this.h):null};f.M=function(b,a){return new qg(this.wa,this.sb,this.h,a,this.j)};
f.R=function(b,a){if(md(a))return eb(this,B.b(a,0),B.b(a,1));for(var c=this,d=L(a);;){if(null==d)return c;var e=M(d);if(md(e))c=eb(c,B.b(e,0),B.b(e,1)),d=O(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};var sg=new qg(jc,null,0,null,Dc);qg.prototype[Ka]=function(){return wc(this)};
var Ec=function Ec(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ec.l(0<c.length?new K(c.slice(0),0):null)};Ec.l=function(b){for(var a=L(b),c=Lb(ed);;)if(a){b=O(O(a));var d=M(a),a=Xc(a),c=Ob(c,d,a),a=b}else return Nb(c)};Ec.C=0;Ec.D=function(b){return Ec.l(L(b))};function tg(b,a){this.N=b;this.ma=a;this.i=32374988;this.A=0}f=tg.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.ma};
f.ha=function(){var b=(null!=this.N?this.N.i&128||this.N.Vb||(this.N.i?0:u(ab,this.N)):u(ab,this.N))?this.N.ha(null):O(this.N);return null==b?null:new tg(b,this.ma)};f.K=function(){return Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.ma)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return this.N.aa(null).Gb(null)};
f.da=function(){var b=(null!=this.N?this.N.i&128||this.N.Vb||(this.N.i?0:u(ab,this.N)):u(ab,this.N))?this.N.ha(null):O(this.N);return null!=b?new tg(b,this.ma):N};f.P=function(){return this};f.M=function(b,a){return new tg(this.N,a)};f.R=function(b,a){return Q(a,this)};tg.prototype[Ka]=function(){return wc(this)};function Hf(b){return(b=L(b))?new tg(b,null):null}function Qd(b){return jb(b)}function ug(b,a){this.N=b;this.ma=a;this.i=32374988;this.A=0}f=ug.prototype;f.toString=function(){return ac(this)};
f.equiv=function(b){return this.u(null,b)};f.L=function(){return this.ma};f.ha=function(){var b=(null!=this.N?this.N.i&128||this.N.Vb||(this.N.i?0:u(ab,this.N)):u(ab,this.N))?this.N.ha(null):O(this.N);return null==b?null:new ug(b,this.ma)};f.K=function(){return Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.ma)};f.ba=function(b,a){return Wc.b(a,this)};f.ca=function(b,a,c){return Wc.c(a,c,this)};f.aa=function(){return this.N.aa(null).Hb(null)};
f.da=function(){var b=(null!=this.N?this.N.i&128||this.N.Vb||(this.N.i?0:u(ab,this.N)):u(ab,this.N))?this.N.ha(null):O(this.N);return null!=b?new ug(b,this.ma):N};f.P=function(){return this};f.M=function(b,a){return new ug(this.N,a)};f.R=function(b,a){return Q(a,this)};ug.prototype[Ka]=function(){return wc(this)};function If(b){return(b=L(b))?new ug(b,null):null}function Rd(b){return kb(b)}
var vg=function vg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return vg.l(0<c.length?new K(c.slice(0),0):null)};vg.l=function(b){return q(we(Dd,b))?Ma.b(function(a,b){return Zc.b(q(a)?a:te,b)},b):null};vg.C=0;vg.D=function(b){return vg.l(L(b))};wg;function yg(b){this.Ab=b}yg.prototype.ea=function(){return this.Ab.ea()};yg.prototype.next=function(){if(this.Ab.ea())return this.Ab.next().S[0];throw Error("No such element");};yg.prototype.remove=function(){return Error("Unsupported operation")};
function zg(b,a,c){this.m=b;this.pb=a;this.j=c;this.i=15077647;this.A=8196}f=zg.prototype;f.toString=function(){return ac(this)};f.equiv=function(b){return this.u(null,b)};f.keys=function(){return wc(L(this))};f.entries=function(){var b=L(this);return new Df(L(b))};f.values=function(){return wc(L(this))};f.has=function(b){return vd(this,b)};
f.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var g=c.Z(null,e),h=S(g,0),g=S(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=L(a))pd(a)?(c=Ub(a),a=Vb(a),h=c,d=R(c),c=h):(c=M(a),h=S(c,0),g=S(c,1),b.b?b.b(g,h):b.call(null,g,h),a=O(a),c=null,d=0),e=0;else return null};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){return db(this.pb,a)?a:c};f.ia=function(){return new yg(Zb(this.pb))};f.L=function(){return this.m};f.U=function(){return Ra(this.pb)};
f.K=function(){var b=this.j;return null!=b?b:this.j=b=Cc(this)};f.u=function(b,a){return jd(a)&&R(this)===R(a)&&ve(function(a){return function(b){return vd(a,b)}}(this),a)};f.vb=function(){return new wg(Lb(this.pb))};f.Y=function(){return Gc(Ag,this.m)};f.P=function(){return Hf(this.pb)};f.M=function(b,a){return new zg(a,this.pb,this.j)};f.R=function(b,a){return new zg(this.m,dd.c(this.pb,a,null),null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.H(null,b);case 3:return this.F(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.H(null,b)};b.c=function(a,b,d){return this.F(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return this.H(null,b)};f.b=function(b,a){return this.F(null,b,a)};var Ag=new zg(null,te,Dc);zg.prototype[Ka]=function(){return wc(this)};
function wg(b){this.$a=b;this.A=136;this.i=259}f=wg.prototype;f.lb=function(b,a){this.$a=Ob(this.$a,a,null);return this};f.wb=function(){return new zg(null,Nb(this.$a),null)};f.U=function(){return R(this.$a)};f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){return cb.c(this.$a,a,sd)===sd?c:a};
f.call=function(){function b(a,b,c){return cb.c(this.$a,b,sd)===sd?c:b}function a(a,b){return cb.c(this.$a,b,sd)===sd?null:b}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return a.call(this,c,e);case 3:return b.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.b=a;c.c=b;return c}();f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){return cb.c(this.$a,b,sd)===sd?null:b};f.b=function(b,a){return cb.c(this.$a,b,sd)===sd?a:b};
function Pd(b){if(null!=b&&(b.A&4096||b.Pc))return b.name;if("string"===typeof b)return b;throw Error([x("Doesn't support name: "),x(b)].join(""));}function Bg(b,a,c){this.o=b;this.end=a;this.step=c}Bg.prototype.ea=function(){return 0<this.step?this.o<this.end:this.o>this.end};Bg.prototype.next=function(){var b=this.o;this.o+=this.step;return b};function Cg(b,a,c,d,e){this.m=b;this.start=a;this.end=c;this.step=d;this.j=e;this.i=32375006;this.A=8192}f=Cg.prototype;f.toString=function(){return ac(this)};
f.equiv=function(b){return this.u(null,b)};f.Z=function(b,a){if(a<Ra(this))return this.start+a*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};f.na=function(b,a,c){return a<Ra(this)?this.start+a*this.step:this.start>this.end&&0===this.step?this.start:c};f.ia=function(){return new Bg(this.start,this.end,this.step)};f.L=function(){return this.m};
f.ha=function(){return 0<this.step?this.start+this.step<this.end?new Cg(this.m,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Cg(this.m,this.start+this.step,this.end,this.step,null):null};f.U=function(){return Ia(Cb(this))?0:Math.ceil((this.end-this.start)/this.step)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Ac(this)};f.u=function(b,a){return Fc(this,a)};f.Y=function(){return Gc(N,this.m)};f.ba=function(b,a){return Lc(this,a)};
f.ca=function(b,a,c){for(b=this.start;;)if(0<this.step?b<this.end:b>this.end){c=a.b?a.b(c,b):a.call(null,c,b);if(Ic(c))return P.a?P.a(c):P.call(null,c);b+=this.step}else return c};f.aa=function(){return null==Cb(this)?null:this.start};f.da=function(){return null!=Cb(this)?new Cg(this.m,this.start+this.step,this.end,this.step,null):N};f.P=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
f.M=function(b,a){return new Cg(a,this.start,this.end,this.step,this.j)};f.R=function(b,a){return Q(a,this)};Cg.prototype[Ka]=function(){return wc(this)};function Dg(b,a){return new $d(null,function(){var c=L(a);return c?Eg(b,M(c),uc(c)):Wa(N,b.w?b.w():b.call(null))},null,null)}function Eg(b,a,c){return Q(a,new $d(null,function(){var d=L(c);if(d){var e=Eg,g;g=M(d);g=b.b?b.b(a,g):b.call(null,a,g);d=e(b,g,uc(d))}else d=null;return d},null,null))}
function Fg(b,a){if("string"===typeof a){var c=b.exec(a);return ic.b(M(c),a)?1===R(c)?M(c):Cd(c):null}throw new TypeError("re-matches must match against a string.");}function Gg(b){if(b instanceof RegExp)return b;var a;var c=/^\(\?([idmsux]*)\)/;if("string"===typeof b)c=c.exec(b),a=null==c?null:1===R(c)?M(c):Cd(c);else throw new TypeError("re-find must match against a string.");c=S(a,0);a=S(a,1);c=R(c);return new RegExp(b.substring(c),q(a)?a:"")}
function X(b,a,c,d,e,g,h){var k=ua;ua=null==ua?null:ua-1;try{if(null!=ua&&0>ua)return Ib(b,"#");Ib(b,c);if(0===Ba.a(g))L(h)&&Ib(b,function(){var a=Hg.a(g);return q(a)?a:"..."}());else{if(L(h)){var l=M(h);a.c?a.c(l,b,g):a.call(null,l,b,g)}for(var n=O(h),r=Ba.a(g)-1;;)if(!n||null!=r&&0===r){L(n)&&0===r&&(Ib(b,d),Ib(b,function(){var a=Hg.a(g);return q(a)?a:"..."}()));break}else{Ib(b,d);var y=M(n);c=b;h=g;a.c?a.c(y,c,h):a.call(null,y,c,h);var v=O(n);c=r-1;n=v;r=c}}return Ib(b,e)}finally{ua=k}}
function Ig(b,a){for(var c=L(a),d=null,e=0,g=0;;)if(g<e){var h=d.Z(null,g);Ib(b,h);g+=1}else if(c=L(c))d=c,pd(d)?(c=Ub(d),e=Vb(d),d=c,h=R(c),c=e,e=h):(h=M(d),Ib(b,h),c=O(d),d=null,e=0),g=0;else return null}var Jg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Kg(b){return[x('"'),x(b.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Jg[a]})),x('"')].join("")}Lg;
function Mg(b,a){var c=ud(H.b(b,za));return c?(c=null!=a?a.i&131072||a.Oc?!0:!1:!1)?null!=id(a):c:c}
function Ng(b,a,c){if(null==b)return Ib(a,"nil");if(Mg(c,b)){Ib(a,"^");var d=id(b);Y.c?Y.c(d,a,c):Y.call(null,d,a,c);Ib(a," ")}if(b.Kb)return b.Yb(b,a,c);if(null!=b&&(b.i&2147483648||b.V))return b.I(null,a,c);if(!0===b||!1===b||"number"===typeof b)return Ib(a,""+x(b));if(null!=b&&b.constructor===Object)return Ib(a,"#js "),d=T.b(function(a){return new V(null,2,5,W,[Zd.a(a),b[a]],null)},qd(b)),Lg.B?Lg.B(d,Y,a,c):Lg.call(null,d,Y,a,c);if(Ha(b))return X(a,Y,"#js ["," ","]",c,b);if("string"==typeof b)return q(ya.a(c))?
Ib(a,Kg(b)):Ib(a,b);if(ba(b)){var e=b.name;c=q(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Ig(a,J(["#object[",c,' "',""+x(b),'"]'],0))}if(b instanceof Date)return c=function(a,b){for(var c=""+x(a);;)if(R(c)<b)c=[x("0"),x(c)].join("");else return c},Ig(a,J(['#inst "',""+x(b.getUTCFullYear()),"-",c(b.getUTCMonth()+1,2),"-",c(b.getUTCDate(),2),"T",c(b.getUTCHours(),2),":",c(b.getUTCMinutes(),2),":",c(b.getUTCSeconds(),2),".",c(b.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(b instanceof RegExp)return Ig(a,J(['#"',b.source,'"'],0));if(null!=b&&(b.i&2147483648||b.V))return Jb(b,a,c);if(q(b.constructor.nb))return Ig(a,J(["#object[",b.constructor.nb.replace(RegExp("/","g"),"."),"]"],0));e=b.constructor.name;c=q(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Ig(a,J(["#object[",c," ",""+x(b),"]"],0))}function Y(b,a,c){var d=Og.a(c);return q(d)?(c=dd.c(c,Pg,Ng),d.c?d.c(b,a,c):d.call(null,b,a,c)):Ng(b,a,c)}
var Ee=function Ee(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ee.l(0<c.length?new K(c.slice(0),0):null)};Ee.l=function(b){var a=wa();if(null==b||Ia(L(b)))a="";else{var c=x,d=new ka;a:{var e=new $b(d);Y(M(b),e,a);b=L(O(b));for(var g=null,h=0,k=0;;)if(k<h){var l=g.Z(null,k);Ib(e," ");Y(l,e,a);k+=1}else if(b=L(b))g=b,pd(g)?(b=Ub(g),h=Vb(g),g=b,l=R(b),b=h,h=l):(l=M(g),Ib(e," "),Y(l,e,a),b=O(g),g=null,h=0),k=0;else break a}a=""+c(d)}return a};Ee.C=0;
Ee.D=function(b){return Ee.l(L(b))};function Lg(b,a,c,d){return X(c,function(b,c,d){var k=jb(b);a.c?a.c(k,c,d):a.call(null,k,c,d);Ib(c," ");b=kb(b);return a.c?a.c(b,c,d):a.call(null,b,c,d)},"{",", ","}",d,L(b))}Je.prototype.V=!0;Je.prototype.I=function(b,a,c){Ib(a,"#object [cljs.core.Volatile ");Y(new p(null,1,[Qg,this.state],null),a,c);return Ib(a,"]")};K.prototype.V=!0;K.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};$d.prototype.V=!0;
$d.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};gg.prototype.V=!0;gg.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};bg.prototype.V=!0;bg.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};ig.prototype.V=!0;ig.prototype.I=function(b,a,c){return X(a,Y,"["," ","]",c,this)};Gf.prototype.V=!0;Gf.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};yc.prototype.V=!0;yc.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};od.prototype.V=!0;
od.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};Xd.prototype.V=!0;Xd.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};Rc.prototype.V=!0;Rc.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};cd.prototype.V=!0;cd.prototype.I=function(b,a,c){return Lg(this,Y,a,c)};cg.prototype.V=!0;cg.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};qf.prototype.V=!0;qf.prototype.I=function(b,a,c){return X(a,Y,"["," ","]",c,this)};qg.prototype.V=!0;
qg.prototype.I=function(b,a,c){return Lg(this,Y,a,c)};zg.prototype.V=!0;zg.prototype.I=function(b,a,c){return X(a,Y,"#{"," ","}",c,this)};nd.prototype.V=!0;nd.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};Be.prototype.V=!0;Be.prototype.I=function(b,a,c){Ib(a,"#object [cljs.core.Atom ");Y(new p(null,1,[Qg,this.state],null),a,c);return Ib(a,"]")};ug.prototype.V=!0;ug.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};Z.prototype.V=!0;
Z.prototype.I=function(b,a,c){return X(a,Y,"["," ","]",c,this)};V.prototype.V=!0;V.prototype.I=function(b,a,c){return X(a,Y,"["," ","]",c,this)};uf.prototype.V=!0;uf.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};Vd.prototype.V=!0;Vd.prototype.I=function(b,a){return Ib(a,"()")};ue.prototype.V=!0;ue.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};vf.prototype.V=!0;vf.prototype.I=function(b,a,c){return X(a,Y,"#queue ["," ","]",c,L(this))};p.prototype.V=!0;
p.prototype.I=function(b,a,c){return Lg(this,Y,a,c)};Cg.prototype.V=!0;Cg.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};tg.prototype.V=!0;tg.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};Sc.prototype.V=!0;Sc.prototype.I=function(b,a,c){return X(a,Y,"("," ",")",c,this)};F.prototype.Eb=!0;F.prototype.jb=function(b,a){if(a instanceof F)return qc(this,a);throw Error([x("Cannot compare "),x(this),x(" to "),x(a)].join(""));};t.prototype.Eb=!0;
t.prototype.jb=function(b,a){if(a instanceof t)return Yd(this,a);throw Error([x("Cannot compare "),x(this),x(" to "),x(a)].join(""));};qf.prototype.Eb=!0;qf.prototype.jb=function(b,a){if(md(a))return wd(this,a);throw Error([x("Cannot compare "),x(this),x(" to "),x(a)].join(""));};V.prototype.Eb=!0;V.prototype.jb=function(b,a){if(md(a))return wd(this,a);throw Error([x("Cannot compare "),x(this),x(" to "),x(a)].join(""));};
function Rg(b){return function(a,c){var d=b.b?b.b(a,c):b.call(null,a,c);return Ic(d)?new Hc(d):d}}
function Re(b){return function(a){return function(){function c(b,c){return Ma.c(a,b,c)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.w?b.w():b.call(null)}var g=null,g=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};g.w=e;g.a=d;g.b=c;return g}()}(Rg(b))}Sg;function Tg(){}
var Ug=function Ug(a){if(null!=a&&null!=a.Jc)return a.Jc(a);var c=Ug[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Ug._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IEncodeJS.-clj-\x3ejs",a);};Vg;function Wg(b){return(null!=b?b.Ic||(b.Xc?0:u(Tg,b)):u(Tg,b))?Ug(b):"string"===typeof b||"number"===typeof b||b instanceof t||b instanceof F?Vg.a?Vg.a(b):Vg.call(null,b):Ee.l(J([b],0))}
var Vg=function Vg(a){if(null==a)return null;if(null!=a?a.Ic||(a.Xc?0:u(Tg,a)):u(Tg,a))return Ug(a);if(a instanceof t)return Pd(a);if(a instanceof F)return""+x(a);if(ld(a)){var c={};a=L(a);for(var d=null,e=0,g=0;;)if(g<e){var h=d.Z(null,g),k=S(h,0),h=S(h,1);c[Wg(k)]=Vg(h);g+=1}else if(a=L(a))pd(a)?(e=Ub(a),a=Vb(a),d=e,e=R(e)):(e=M(a),d=S(e,0),e=S(e,1),c[Wg(d)]=Vg(e),a=O(a),d=null,e=0),g=0;else break;return c}if(null==a?0:null!=a?a.i&8||a.jd||(a.i?0:u(Ua,a)):u(Ua,a)){c=[];a=L(T.b(Vg,a));d=null;for(g=
e=0;;)if(g<e)k=d.Z(null,g),c.push(k),g+=1;else if(a=L(a))d=a,pd(d)?(a=Ub(d),g=Vb(d),d=a,e=R(a),a=g):(a=M(d),c.push(a),a=O(d),d=null,e=0),g=0;else break;return c}return a},Sg=function Sg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sg.w();case 1:return Sg.a(arguments[0]);default:throw Error([x("Invalid arity: "),x(c.length)].join(""));}};Sg.w=function(){return Sg.a(1)};Sg.a=function(b){return Math.random()*b};Sg.C=1;
function Xg(b,a){this.tb=b;this.j=a;this.i=2153775104;this.A=2048}f=Xg.prototype;f.toString=function(){return this.tb};f.equiv=function(b){return this.u(null,b)};f.u=function(b,a){return a instanceof Xg&&this.tb===a.tb};f.I=function(b,a){return Ib(a,[x('#uuid "'),x(this.tb),x('"')].join(""))};f.K=function(){null==this.j&&(this.j=mc(this.tb));return this.j};f.jb=function(b,a){return oa(this.tb,a.tb)};var Yg=new t(null,"rng","rng",1082666016),Zg=new t(null,"y","y",-1757859776),$g=new t(null,"text-anchor","text-anchor",585613696),ah=new t(null,"path","path",-188191168),bh=new F(null,"itm","itm",-713282527,null),ch=new F(null,".-length",".-length",-280799999,null),dh=new F(null,"puts","puts",-1883877054,null),eh=new t(null,"onkeyup","onkeyup",1815272291),fh=new t(null,"fn","fn",-1175266204),gh=new F(null,"\x3c","\x3c",993667236,null),hh=new t(null,"transform","transform",1381301764),za=new t(null,
"meta","meta",1499536964),ih=new t(null,"dx","dx",-381796732),jh=new t(null,"desc","desc",2093485764),kh=new t(null,"ul","ul",-1349521403),lh=new F(null,"blockable","blockable",-28395259,null),Aa=new t(null,"dup","dup",556298533),mh=new t(null,"projection-strategy","projection-strategy",-608325691),nh=new t(null,"private","private",-558947994),oh=new t(null,"scale","scale",-230427353),ph=new t(null,"button","button",1456579943),He=new F(null,"new-value","new-value",-1567397401,null),De=new t(null,
"validator","validator",-1966190681),qh=new t(null,"default","default",-1987822328),rh=new t(null,"finally-block","finally-block",832982472),sh=new t(null,"strong","strong",269529E3),th=new t(null,"name","name",1843675177),uh=new t(null,"n","n",562130025),vh=new t(null,"li","li",723558921),wh=new t(null,"fill","fill",883462889),xh=new t(null,"clipPathUnits","clipPathUnits",-1747479222),yh=new t(null,"y1","y1",589123466),zh=new t(null,"width","width",-384071477),Ah=new t(null,"onclick","onclick",1297553739),
Bh=new t(null,"dy","dy",1719547243),Ch=new t(null,"clipPath","clipPath",-934619797),Dh=new t(null,"projector","projector",1428597707),Qg=new t(null,"val","val",128701612),Eh=new t(null,"recur","recur",-437573268),Fh=new t(null,"type","type",1174270348),Gh=new t(null,"update","update",1045576396),Hh=new t(null,"catch-block","catch-block",1175212748),Ge=new F(null,"validate","validate",1439230700,null),Ih=new F(null,"\x3e","\x3e",1085014381,null),Pg=new t(null,"fallback-impl","fallback-impl",-1501286995),
xa=new t(null,"flush-on-newline","flush-on-newline",-151457939),Jh=new t(null,"extremes","extremes",1490048973),Kh=new t(null,"className","className",-1983287057),Lh=new t(null,"no-op","no-op",-93046065),Mh=new t(null,"high","high",2027297808),Nh=new t(null,"small","small",2133478704),Oh=new t(null,"textarea","textarea",-650375824),Ph=new t(null,"clip-path","clip-path",-439959120),Qh=new t(null,"stroke-linecap","stroke-linecap",-1201103248),Me=new F(null,"n","n",-2092305744,null),Rh=new t(null,"div",
"div",1057191632),ya=new t(null,"readably","readably",1129599760),Sh=new F(null,"box","box",-1123515375,null),Hg=new t(null,"more-marker","more-marker",-14717935),Th=new t(null,"g","g",1738089905),Uh=new F(null,"nil?","nil?",1612038930,null),Vh=new t(null,"line","line",212345235),Wh=new t(null,"weight","weight",-1262796205),Xh=new F(null,"val","val",1769233139,null),Yh=new F(null,"not","not",1044554643,null),Ba=new t(null,"print-length","print-length",1931866356),Zh=new t(null,"raw-data","raw-data",
617791828),$h=new t(null,"label","label",1718410804),ai=new t(null,"id","id",-1388402092),bi=new t(null,"class","class",-2030961996),ci=new t(null,"catch-exception","catch-exception",-1997306795),di=new t(null,"current","current",-1088038603),ei=new t(null,"checked","checked",-50955819),gi=new t(null,"defs","defs",1398449717),hi=new F(null,"/","/",-1371932971,null),ii=new t(null,"prev","prev",-1597069226),ji=new t(null,"svg","svg",856789142),ki=new F(null,"buf-or-n","buf-or-n",-1646815050,null),li=
new t(null,"continue-block","continue-block",-1852047850),mi=new t(null,"low","low",-1601362409),ni=new t(null,"d","d",1972142424),oi=new t(null,"f","f",-1597136552),pi=new t(null,"average","average",-492356168),qi=new t(null,"h2","h2",-372662728),ri=new t(null,"x1","x1",-1863922247),si=new t(null,"tag","tag",-1290361223),ti=new t(null,"domain","domain",1847214937),ui=new t(null,"input","input",556931961),vi=new t(null,"top-10-bottom-50","top-10-bottom-50",1899980793),se=new F(null,"quote","quote",
1377916282,null),wi=new t(null,"h1","h1",-1896887462),re=new t(null,"arglists","arglists",1661989754),xi=new t(null,"y2","y2",-718691301),yi=new t(null,"weighted-most-recent","weighted-most-recent",1358805083),qe=new F(null,"nil-iter","nil-iter",1101030523,null),zi=new t(null,"main","main",-2117802661),Og=new t(null,"alt-impl","alt-impl",670969595),Ai=new F(null,"fn-handler","fn-handler",648785851,null),Bi=new t(null,"rect","rect",-108902628),Ci=new F(null,"takes","takes",298247964,null),Di=new F("impl",
"MAX-QUEUE-SIZE","impl/MAX-QUEUE-SIZE",1508600732,null),Ei=new F(null,"deref","deref",1494944732,null),Fi=new t(null,"p","p",151049309),Gi=new t(null,"x2","x2",-1362513475),Le=new F(null,"number?","number?",-1747282210,null),Hi=new t(null,"height","height",1025178622),Ii=new t(null,"foreignObject","foreignObject",25502111),Ji=new t(null,"text","text",-1790561697),Ki=new t(null,"top-80-bottom-80","top-80-bottom-80",-746151201),Li=new F(null,"f","f",43394975,null);var Mi,Ni=function Ni(a,c){if(null!=a&&null!=a.gc)return a.gc(0,c);var d=Ni[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Ni._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("ReadPort.take!",a);},Oi=function Oi(a,c,d){if(null!=a&&null!=a.Xb)return a.Xb(0,c,d);var e=Oi[m(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Oi._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw w("WritePort.put!",a);},Pi=function Pi(a){if(null!=a&&null!=a.Wb)return a.Wb();
var c=Pi[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Pi._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("Channel.close!",a);},Qi=function Qi(a){if(null!=a&&null!=a.yc)return!0;var c=Qi[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Qi._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("Handler.active?",a);},Ri=function Ri(a){if(null!=a&&null!=a.zc)return a.X;var c=Ri[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Ri._;if(null!=c)return c.a?
c.a(a):c.call(null,a);throw w("Handler.commit",a);},Si=function Si(a,c){if(null!=a&&null!=a.xc)return a.xc(0,c);var d=Si[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Si._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("Buffer.add!*",a);},Ti=function Ti(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ti.a(arguments[0]);case 2:return Ti.b(arguments[0],arguments[1]);default:throw Error([x("Invalid arity: "),
x(c.length)].join(""));}};Ti.a=function(b){return b};Ti.b=function(b,a){if(null==a)throw Error([x("Assert failed: "),x(Ee.l(J([hc(Yh,hc(Uh,bh))],0)))].join(""));return Si(b,a)};Ti.C=2;function Ui(b,a,c,d,e){for(var g=0;;)if(g<e)c[d+g]=b[a+g],g+=1;else break}function Vi(b,a,c,d){this.head=b;this.S=a;this.length=c;this.f=d}Vi.prototype.pop=function(){if(0===this.length)return null;var b=this.f[this.S];this.f[this.S]=null;this.S=(this.S+1)%this.f.length;--this.length;return b};Vi.prototype.unshift=function(b){this.f[this.head]=b;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Wi(b,a){b.length+1===b.f.length&&b.resize();b.unshift(a)}
Vi.prototype.resize=function(){var b=Array(2*this.f.length);return this.S<this.head?(Ui(this.f,this.S,b,0,this.length),this.S=0,this.head=this.length,this.f=b):this.S>this.head?(Ui(this.f,this.S,b,0,this.f.length-this.S),Ui(this.f,0,b,this.f.length-this.S,this.head),this.S=0,this.head=this.length,this.f=b):this.S===this.head?(this.head=this.S=0,this.f=b):null};function Xi(b,a){for(var c=b.length,d=0;;)if(d<c){var e=b.pop();(a.a?a.a(e):a.call(null,e))&&b.unshift(e);d+=1}else break}
function Yi(b){if(!(0<b))throw Error([x("Assert failed: "),x("Can't create a ring buffer of size 0"),x("\n"),x(Ee.l(J([hc(Ih,Me,0)],0)))].join(""));return new Vi(0,0,0,Array(b))}function Zi(b,a){this.O=b;this.n=a;this.i=2;this.A=0}function $i(b){return b.O.length===b.n}Zi.prototype.xc=function(b,a){Wi(this.O,a);return this};Zi.prototype.U=function(){return this.O.length};if("undefined"===typeof aj)var aj={};var bj;a:{var cj=aa.navigator;if(cj){var dj=cj.userAgent;if(dj){bj=dj;break a}}bj=""}function ej(b){return-1!=bj.indexOf(b)};var fj;
function gj(){var b=aa.MessageChannel;"undefined"===typeof b&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!ej("Presto")&&(b=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ha(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof b&&!ej("Trident")&&!ej("MSIE")){var a=new b,c={},d=c;a.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.qc;c.qc=null;a()}};return function(b){d.next={qc:b};d=d.next;a.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var hj=Yi(32),ij=!1,jj=!1;kj;function lj(){ij=!0;jj=!1;for(var b=0;;){var a=hj.pop();if(null!=a&&(a.w?a.w():a.call(null),1024>b)){b+=1;continue}break}ij=!1;return 0<hj.length?kj.w?kj.w():kj.call(null):null}function kj(){var b=jj;if(q(q(b)?ij:b))return null;jj=!0;!ba(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(fj||(fj=gj()),fj(lj)):aa.setImmediate(lj)}function mj(b){Wi(hj,b);kj()};var nj,oj=function oj(a){"undefined"===typeof nj&&(nj=function(a,d,e){this.Fc=a;this.s=d;this.bd=e;this.i=425984;this.A=0},nj.prototype.M=function(a,d){return new nj(this.Fc,this.s,d)},nj.prototype.L=function(){return this.bd},nj.prototype.Fb=function(){return this.s},nj.hc=function(){return new V(null,3,5,W,[Gc(Sh,new p(null,1,[re,hc(se,hc(new V(null,1,5,W,[Xh],null)))],null)),Xh,qa.ud],null)},nj.Kb=!0,nj.nb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333",nj.Yb=function(a,d){return Ib(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333")});return new nj(oj,a,te)};function pj(b,a){this.Lb=b;this.s=a}function qj(b){return Qi(b.Lb)}var rj=function rj(a){if(null!=a&&null!=a.wc)return a.wc();var c=rj[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=rj._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("MMC.abort",a);};function sj(b,a,c,d,e,g,h){this.rb=b;this.$b=a;this.ib=c;this.Zb=d;this.O=e;this.closed=g;this.va=h}
sj.prototype.wc=function(){for(;;){var b=this.ib.pop();if(null!=b){var a=b.Lb;mj(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(a.X,a,b.s,b,this))}break}Xi(this.ib,ye());return Pi(this)};
sj.prototype.Xb=function(b,a,c){var d=this;if(null==a)throw Error([x("Assert failed: "),x("Can't put nil in on a channel"),x("\n"),x(Ee.l(J([hc(Yh,hc(Uh,Xh))],0)))].join(""));if(b=d.closed)return oj(!b);if(q(function(){var a=d.O;return q(a)?Ia($i(d.O)):a}())){for(c=Ic(d.va.b?d.va.b(d.O,a):d.va.call(null,d.O,a));;){if(0<d.rb.length&&0<R(d.O)){var e=d.rb.pop(),g=e.X,h=d.O.O.pop();mj(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(g,h,e,c,b,this))}break}c&&rj(this);return oj(!0)}e=
function(){for(;;){var a=d.rb.pop();if(q(a)){if(q(!0))return a}else return null}}();if(q(e))return c=Ri(e),mj(function(b){return function(){return b.a?b.a(a):b.call(null,a)}}(c,e,b,this)),oj(!0);64<d.Zb?(d.Zb=0,Xi(d.ib,qj)):d.Zb+=1;if(q(c.fc(null))){if(!(1024>d.ib.length))throw Error([x("Assert failed: "),x([x("No more than "),x(1024),x(" pending puts are allowed on a single channel."),x(" Consider using a windowed buffer.")].join("")),x("\n"),x(Ee.l(J([hc(gh,hc(ch,dh),Di)],0)))].join(""));Wi(d.ib,
new pj(c,a))}return null};
sj.prototype.gc=function(b,a){var c=this;if(null!=c.O&&0<R(c.O)){for(var d=a.X,e=oj(c.O.O.pop());;){if(!q($i(c.O))){var g=c.ib.pop();if(null!=g){var h=g.Lb,k=g.s;mj(function(a){return function(){return a.a?a.a(!0):a.call(null,!0)}}(h.X,h,k,g,d,e,this));Ic(c.va.b?c.va.b(c.O,k):c.va.call(null,c.O,k))&&rj(this);continue}}break}return e}d=function(){for(;;){var a=c.ib.pop();if(q(a)){if(Qi(a.Lb))return a}else return null}}();if(q(d))return e=Ri(d.Lb),mj(function(a){return function(){return a.a?a.a(!0):
a.call(null,!0)}}(e,d,this)),oj(d.s);if(q(c.closed))return q(c.O)&&(c.va.a?c.va.a(c.O):c.va.call(null,c.O)),q(q(!0)?a.X:!0)?(d=function(){var a=c.O;return q(a)?0<R(c.O):a}(),d=q(d)?c.O.O.pop():null,oj(d)):null;64<c.$b?(c.$b=0,Xi(c.rb,Qi)):c.$b+=1;if(q(a.fc(null))){if(!(1024>c.rb.length))throw Error([x("Assert failed: "),x([x("No more than "),x(1024),x(" pending takes are allowed on a single channel.")].join("")),x("\n"),x(Ee.l(J([hc(gh,hc(ch,Ci),Di)],0)))].join(""));Wi(c.rb,a)}return null};
sj.prototype.Wb=function(){var b=this;if(!b.closed)for(b.closed=!0,q(function(){var a=b.O;return q(a)?0===b.ib.length:a}())&&(b.va.a?b.va.a(b.O):b.va.call(null,b.O));;){var a=b.rb.pop();if(null==a)break;else{var c=a.X,d=q(function(){var a=b.O;return q(a)?0<R(b.O):a}())?b.O.O.pop():null;mj(function(a,b){return function(){return a.a?a.a(b):a.call(null,b)}}(c,d,a,this))}}return null};function tj(b){console.log(b);return null}
function uj(b,a){var c=(q(null)?null:tj).call(null,a);return null==c?b:Ti.b(b,c)}
function vj(b){return new sj(Yi(32),0,Yi(32),0,b,!1,function(){return function(a){return function(){function b(c,d){try{return a.b?a.b(c,d):a.call(null,c,d)}catch(e){return uj(c,e)}}function d(b){try{return a.a?a.a(b):a.call(null,b)}catch(c){return uj(b,c)}}var e=null,e=function(a,e){switch(arguments.length){case 1:return d.call(this,a);case 2:return b.call(this,a,e)}throw Error("Invalid arity: "+arguments.length);};e.a=d;e.b=b;return e}()}(q(null)?null.a?null.a(Ti):null.call(null,Ti):Ti)}())};var wj,xj=function xj(a){"undefined"===typeof wj&&(wj=function(a,d,e){this.Zc=a;this.X=d;this.ad=e;this.i=393216;this.A=0},wj.prototype.M=function(a,d){return new wj(this.Zc,this.X,d)},wj.prototype.L=function(){return this.ad},wj.prototype.yc=function(){return!0},wj.prototype.fc=function(){return!0},wj.prototype.zc=function(){return this.X},wj.hc=function(){return new V(null,3,5,W,[Gc(Ai,new p(null,2,[nh,!0,re,hc(se,hc(new V(null,1,5,W,[Li],null)))],null)),Li,qa.td],null)},wj.Kb=!0,wj.nb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270",
wj.Yb=function(a,d){return Ib(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270")});return new wj(xj,a,te)};function yj(b){try{return b[0].call(null,b)}catch(a){throw a instanceof Object&&b[6].Wb(),a;}}function zj(b,a,c){c=c.gc(0,xj(function(c){b[2]=c;b[1]=a;return yj(b)}));return q(c)?(b[2]=P.a?P.a(c):P.call(null,c),b[1]=a,Eh):null}function Aj(b,a,c){a=a.Xb(0,c,xj(function(a){b[2]=a;b[1]=16;return yj(b)}));return q(a)?(b[2]=P.a?P.a(a):P.call(null,a),b[1]=16,Eh):null}
function Bj(b,a){var c=b[6];null!=a&&c.Xb(0,a,xj(function(){return function(){return null}}(c)));c.Wb();return c}function Cj(b,a,c,d,e,g,h,k){this.Ca=b;this.Da=a;this.Ga=c;this.Fa=d;this.Ia=e;this.G=g;this.v=h;this.j=k;this.i=2229667594;this.A=8192}f=Cj.prototype;f.H=function(b,a){return cb.c(this,a,null)};
f.F=function(b,a,c){switch(a instanceof t?a.ra:null){case "catch-block":return this.Ca;case "catch-exception":return this.Da;case "finally-block":return this.Ga;case "continue-block":return this.Fa;case "prev":return this.Ia;default:return H.c(this.v,a,c)}};
f.I=function(b,a,c){return X(a,function(){return function(b){return X(a,Y,""," ","",c,b)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,je.b(new V(null,5,5,W,[new V(null,2,5,W,[Hh,this.Ca],null),new V(null,2,5,W,[ci,this.Da],null),new V(null,2,5,W,[rh,this.Ga],null),new V(null,2,5,W,[li,this.Fa],null),new V(null,2,5,W,[ii,this.Ia],null)],null),this.v))};f.ia=function(){return new Af(0,this,5,new V(null,5,5,W,[Hh,ci,rh,li,ii],null),Zb(this.v))};f.L=function(){return this.G};
f.U=function(){return 5+R(this.v)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Sd(this)};f.u=function(b,a){var c;c=q(a)?(c=this.constructor===a.constructor)?zf(this,a):c:a;return q(c)?!0:!1};f.Ea=function(b,a){return vd(new zg(null,new p(null,5,[rh,null,Hh,null,ci,null,ii,null,li,null],null),null),a)?fd.b(Gc(Ue(te,this),this.G),a):new Cj(this.Ca,this.Da,this.Ga,this.Fa,this.Ia,this.G,oe(fd.b(this.v,a)),null)};
f.qa=function(b,a,c){return q(U.b?U.b(Hh,a):U.call(null,Hh,a))?new Cj(c,this.Da,this.Ga,this.Fa,this.Ia,this.G,this.v,null):q(U.b?U.b(ci,a):U.call(null,ci,a))?new Cj(this.Ca,c,this.Ga,this.Fa,this.Ia,this.G,this.v,null):q(U.b?U.b(rh,a):U.call(null,rh,a))?new Cj(this.Ca,this.Da,c,this.Fa,this.Ia,this.G,this.v,null):q(U.b?U.b(li,a):U.call(null,li,a))?new Cj(this.Ca,this.Da,this.Ga,c,this.Ia,this.G,this.v,null):q(U.b?U.b(ii,a):U.call(null,ii,a))?new Cj(this.Ca,this.Da,this.Ga,this.Fa,c,this.G,this.v,
null):new Cj(this.Ca,this.Da,this.Ga,this.Fa,this.Ia,this.G,dd.c(this.v,a,c),null)};f.P=function(){return L(je.b(new V(null,5,5,W,[new V(null,2,5,W,[Hh,this.Ca],null),new V(null,2,5,W,[ci,this.Da],null),new V(null,2,5,W,[rh,this.Ga],null),new V(null,2,5,W,[li,this.Fa],null),new V(null,2,5,W,[ii,this.Ia],null)],null),this.v))};f.M=function(b,a){return new Cj(this.Ca,this.Da,this.Ga,this.Fa,this.Ia,a,this.v,this.j)};f.R=function(b,a){return md(a)?eb(this,B.b(a,0),B.b(a,1)):Ma.c(Wa,this,a)};
function Dj(b){for(;;){var a=b[4],c=Hh.a(a),d=ci.a(a),e=b[5];if(q(function(){var b=e;return q(b)?Ia(a):b}()))throw e;if(q(function(){var a=e;return q(a)?(a=c,q(a)?ic.b(qh,d)||e instanceof d:a):a}())){b[1]=c;b[2]=e;b[5]=null;b[4]=dd.l(a,Hh,null,J([ci,null],0));break}if(q(function(){var b=e;return q(b)?Ia(c)&&Ia(rh.a(a)):b}()))b[4]=ii.a(a);else{if(q(function(){var b=e;return q(b)?(b=Ia(c))?rh.a(a):b:b}())){b[1]=rh.a(a);b[4]=dd.c(a,rh,null);break}if(q(function(){var b=Ia(e);return b?rh.a(a):b}())){b[1]=
rh.a(a);b[4]=dd.c(a,rh,null);break}if(Ia(e)&&Ia(rh.a(a))){b[1]=li.a(a);b[4]=ii.a(a);break}throw Error("No matching clause");}}};for(var Ej=Array(1),Fj=0;;)if(Fj<Ej.length)Ej[Fj]=null,Fj+=1;else break;function Gj(b){"undefined"===typeof Mi&&(Mi=function(a,b,d){this.X=a;this.pc=b;this.$c=d;this.i=393216;this.A=0},Mi.prototype.M=function(a,b){return new Mi(this.X,this.pc,b)},Mi.prototype.L=function(){return this.$c},Mi.prototype.yc=function(){return!0},Mi.prototype.fc=function(){return this.pc},Mi.prototype.zc=function(){return this.X},Mi.hc=function(){return new V(null,3,5,W,[Li,lh,qa.sd],null)},Mi.Kb=!0,Mi.nb="cljs.core.async/t_cljs$core$async15465",Mi.Yb=function(a,b){return Ib(b,"cljs.core.async/t_cljs$core$async15465")});
return new Mi(b,!0,te)}function Hj(b){b=ic.b(b,0)?null:b;if(q(null)&&!q(b))throw Error([x("Assert failed: "),x("buffer must be supplied when transducer is"),x("\n"),x(Ee.l(J([ki],0)))].join(""));b="number"===typeof b?new Zi(Yi(b),b):b;return vj(b)}function Ij(b,a){var c=Ni(b,Gj(a));if(q(c)){var d=P.a?P.a(c):P.call(null,c);q(!0)?a.a?a.a(d):a.call(null,d):mj(function(b){return function(){return a.a?a.a(b):a.call(null,b)}}(d,c))}return null}var Jj;Jj=Gj(function(){return null});
function Kj(b,a){var c=Oi(b,a,Jj);return q(c)?P.a?P.a(c):P.call(null,c):!0}
function Lj(b){var a=Cd(new V(null,1,5,W,[Mj],null)),c=Hj(null),d=R(a),e=ge(d),g=Hj(1),h=Ce.a?Ce.a(null):Ce.call(null,null),k=Ve(function(a,b,c,d,e,g){return function(h){return function(a,b,c,d,e,g){return function(a){d[h]=a;return 0===Ie.b(g,Hd)?Kj(e,d.slice(0)):null}}(a,b,c,d,e,g)}}(a,c,d,e,g,h),new Cg(null,0,d,1,null)),l=Hj(1);mj(function(a,c,d,e,g,h,k,l){return function(){var G=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Eh)){d=
e;break a}}}catch(g){if(g instanceof Object)c[5]=g,Dj(c),d=Eh;else throw g;}if(!U(d,Eh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.w=c;d.a=b;return d}()}(function(a,c,d,e,g,h,k,l){return function(a){var g=a[1];if(7===g)return a[2]=null,a[1]=8,Eh;if(1===g)return a[2]=
null,a[1]=2,Eh;if(4===g){var n=a[7],g=n<e;a[1]=q(g)?6:7;return Eh}return 15===g?(g=a[2],a[2]=g,a[1]=3,Eh):13===g?(g=Pi(d),a[2]=g,a[1]=15,Eh):6===g?(a[2]=null,a[1]=11,Eh):3===g?(g=a[2],Bj(a,g)):12===g?(g=a[8],g=a[2],n=we(Ga,g),a[8]=g,a[1]=q(n)?13:14,Eh):2===g?(g=Fe.b?Fe.b(k,e):Fe.call(null,k,e),a[9]=g,a[7]=0,a[2]=null,a[1]=4,Eh):11===g?(n=a[7],a[4]=new Cj(10,Object,null,9,a[4],null,null,null),g=c.a?c.a(n):c.call(null,n),n=l.a?l.a(n):l.call(null,n),g=Ij(g,n),a[2]=g,Dj(a),Eh):9===g?(n=a[7],a[10]=a[2],
a[7]=n+1,a[2]=null,a[1]=4,Eh):5===g?(a[11]=a[2],zj(a,12,h)):14===g?(g=a[8],g=A.b(b,g),Aj(a,d,g)):16===g?(a[12]=a[2],a[2]=null,a[1]=2,Eh):10===g?(n=a[2],g=Ie.b(k,Hd),a[13]=n,a[2]=g,Dj(a),Eh):8===g?(g=a[2],a[2]=g,a[1]=5,Eh):null}}(a,c,d,e,g,h,k,l),a,c,d,e,g,h,k,l)}(),ca=function(){var b=G.w?G.w():G.call(null);b[6]=a;return b}();return yj(ca)}}(l,a,c,d,e,g,h,k));return c};var Nj=VDOM.diff,Oj=VDOM.patch,Pj=VDOM.create;function Qj(b){return Se(xe(Ga),Se(xe(td),Te(b)))}function Rj(b,a,c){return new VDOM.VHtml(Pd(b),Vg(a),Vg(c))}function Sj(b,a,c){return new VDOM.VSvg(Pd(b),Vg(a),Vg(c))}Tj;
var Uj=function Uj(a){if(null==a)return new VDOM.VText("");if(td(a))return Rj(Rh,te,T.b(Uj,Qj(a)));if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(ic.b(ji,M(a)))return Tj.a?Tj.a(a):Tj.call(null,a);var c=S(a,0),d=S(a,1);a=Od(a);return Rj(c,d,T.b(Uj,Qj(a)))},Tj=function Tj(a){if(null==a)return new VDOM.VText("");if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(ic.b(Ii,M(a))){var c=S(a,0),d=S(a,1);a=Od(a);return Sj(c,d,T.b(Uj,Qj(a)))}c=S(a,0);d=S(a,1);a=
Od(a);return Sj(c,d,T.b(Tj,Qj(a)))};
function Vj(){var b=document.getElementById("app"),a=function(){var a=new VDOM.VText("");return Ce.a?Ce.a(a):Ce.call(null,a)}(),c=function(){var b;b=P.a?P.a(a):P.call(null,a);b=Pj.a?Pj.a(b):Pj.call(null,b);return Ce.a?Ce.a(b):Ce.call(null,b)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.w?a.w():a.call(null)}}(a,c):function(){return function(a){return window.requestAnimationFrame(a)}}(a,c);b.appendChild(P.a?P.a(c):P.call(null,c));return function(a,b,c){return function(d){var l=
Uj(d);d=function(){var b=P.a?P.a(a):P.call(null,a);return Nj.b?Nj.b(b,l):Nj.call(null,b,l)}();Fe.b?Fe.b(a,l):Fe.call(null,a,l);d=function(a,b,c,d){return function(){return Ie.c(d,Oj,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(a,c,d)};function Wj(){var b=Xj,a=Yj,c=Zj,d=Hj(null);Kj(d,a);var e=Hj(1);mj(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Eh)){d=e;break a}}}catch(g){if(g instanceof Object)c[5]=g,Dj(c),d=Eh;else throw g;}if(!U(d,Eh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.w=c;d.a=b;return d}()}(function(d,e){return function(d){var g=d[1];if(1===g)return zj(d,2,c);if(2===g){var h=a,g=d[2];d[7]=g;d[8]=h;d[2]=null;d[1]=3;return Eh}return 3===g?(g=d[7],h=d[9],h=d[8],g=b.b?b.b(h,g):b.call(null,h,g),h=Kj(e,g),d[9]=g,d[10]=h,zj(d,5,c)):4===g?(g=d[2],Bj(d,g)):5===g?(h=d[9],g=d[2],d[7]=g,d[8]=h,d[2]=null,d[1]=3,Eh):null}}(d,e),d,e)}(),l=function(){var a=k.w?k.w():k.call(null);a[6]=d;return a}();return yj(l)}}(e,d));return d}
function ak(){var b=bk,a=Vj(),c=Hj(1);mj(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Eh)){d=e;break a}}}catch(g){if(g instanceof Object)c[5]=g,Dj(c),d=Eh;else throw g;}if(!U(d,Eh))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.w=c;d.a=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Eh):2===d?zj(c,4,b):3===d?(d=c[2],Bj(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=q(d)?5:6,Eh):5===d?(d=c[7],d=a.a?a.a(d):a.call(null,d),c[8]=d,c[2]=null,c[1]=2,Eh):6===d?(c[2]=null,c[1]=7,Eh):7===d?(d=c[2],c[2]=d,c[1]=3,Eh):null}}(c),c)}(),g=function(){var a=e.w?e.w():e.call(null);a[6]=c;return a}();return yj(g)}}(c));return c};function ck(b){return Ma.b(Ed,b)/R(b)}function ek(b){var a=new Date;a.setTime(b);return a}function fk(b){return b.getTime()}function gk(b){return A.b(je,T.c(function(a,b){var d=S(a,0),e=S(b,0),g=S(b,1),d=Math.round((fk(e)-fk(d))/864E5);return Ke(d,Oe(g/d))},b,Ne(1,b)))}function hk(b,a){var c=b*R(a);return Ne(Math.round(c),a)};function ik(b,a){for(var c=new ka,d=L(a);;)if(null!=d)c.append(""+x(M(d))),d=O(d),null!=d&&c.append(b);else return c.toString()}function jk(b,a){a:for(var c="/(?:)/"===""+x(a)?Zc.b(Cd(Q("",T.b(x,L(b)))),""):Cd((""+x(b)).split(a));;)if(""===(null==c?null:nb(c)))c=null==c?null:ob(c);else break a;return c};function kk(b){return bd(b,2)}function lk(b){var a=jk(b,/\//);b=S(a,0);var c=S(a,1),a=S(a,2);return new Date(2E3+(a|0),(b|0)-1,c|0)}function mk(b){return T.b(function(a){return We(We(We(jk(a,/,/),0,lk),1,Ld),2,Ld)},jk(b,/\n/))};var nk=Error();var ok=function ok(a){if(null!=a&&null!=a.Gc)return a.domain;var c=ok[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=ok._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("IScale.-domain",a);};function pk(b,a,c,d,e,g){this.domain=b;this.Ja=a;this.X=c;this.G=d;this.v=e;this.j=g;this.i=2229667595;this.A=8192}f=pk.prototype;f.H=function(b,a){return cb.c(this,a,null)};
f.F=function(b,a,c){switch(a instanceof t?a.ra:null){case "domain":return this.domain;case "rng":return this.Ja;case "f":return this.X;default:return H.c(this.v,a,c)}};f.I=function(b,a,c){return X(a,function(){return function(b){return X(a,Y,""," ","",c,b)}}(this),"#burn.scale.Linear{",", ","}",c,je.b(new V(null,3,5,W,[new V(null,2,5,W,[ti,this.domain],null),new V(null,2,5,W,[Yg,this.Ja],null),new V(null,2,5,W,[oi,this.X],null)],null),this.v))};
f.ia=function(){return new Af(0,this,3,new V(null,3,5,W,[ti,Yg,oi],null),Zb(this.v))};f.L=function(){return this.G};f.U=function(){return 3+R(this.v)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Sd(this)};f.u=function(b,a){var c;c=q(a)?(c=this.constructor===a.constructor)?zf(this,a):c:a;return q(c)?!0:!1};f.Gc=function(){return this.domain};
f.Ea=function(b,a){return vd(new zg(null,new p(null,3,[Yg,null,oi,null,ti,null],null),null),a)?fd.b(Gc(Ue(te,this),this.G),a):new pk(this.domain,this.Ja,this.X,this.G,oe(fd.b(this.v,a)),null)};
f.qa=function(b,a,c){return q(U.b?U.b(ti,a):U.call(null,ti,a))?new pk(c,this.Ja,this.X,this.G,this.v,null):q(U.b?U.b(Yg,a):U.call(null,Yg,a))?new pk(this.domain,c,this.X,this.G,this.v,null):q(U.b?U.b(oi,a):U.call(null,oi,a))?new pk(this.domain,this.Ja,c,this.G,this.v,null):new pk(this.domain,this.Ja,this.X,this.G,dd.c(this.v,a,c),null)};
f.P=function(){return L(je.b(new V(null,3,5,W,[new V(null,2,5,W,[ti,this.domain],null),new V(null,2,5,W,[Yg,this.Ja],null),new V(null,2,5,W,[oi,this.X],null)],null),this.v))};f.M=function(b,a){return new pk(this.domain,this.Ja,this.X,a,this.v,this.j)};f.R=function(b,a){return md(a)?eb(this,B.b(a,0),B.b(a,1)):Ma.c(Wa,this,a)};f.call=function(b,a){b=this;var c=T.b(b.X,b.domain),d=S(c,0),e=S(c,1),g=b.Ja,c=S(g,0),e=(S(g,1)-c)/(e-d),d=c-e*d;return e*(b.X.a?b.X.a(a):b.X.call(null,a))+d};
f.apply=function(b,a){return this.call.apply(this,[this].concat(La(a)))};f.a=function(b){var a=T.b(this.X,this.domain),c=S(a,0),d=S(a,1),e=this.Ja,a=S(e,0),d=(S(e,1)-a)/(d-c),c=a-d*c;return d*(this.X.a?this.X.a(b):this.X.call(null,b))+c};
function qk(b){var a=S(b,0),c=S(b,1);b=(c-a)/20;var d=Math.log(b)/Math.log(10),d=Math.pow(10,Math.floor(d)),c=c+1;b/=d;return q(Fd.b?Fd.b(5,b):Fd.call(null,5,b))?new Cg(null,a,c,10*d,null):q(Fd.b?Fd.b(2,b):Fd.call(null,2,b))?new Cg(null,a,c,5*d,null):q(Fd.b?Fd.b(1,b):Fd.call(null,1,b))?new Cg(null,a,c,2*d,null):new Cg(null,a,c,d,null)};var rk=function rk(a,c){if(null!=a&&null!=a.Db)return a.Db(a,c);var d=rk[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=rk._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IProjection.-slowest",a);},sk=function sk(a,c){if(null!=a&&null!=a.Cb)return a.Cb(a,c);var d=sk[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=sk._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("IProjection.-fastest",a);};
function tk(b,a,c,d,e){this.gb=b;this.eb=a;this.G=c;this.v=d;this.j=e;this.i=2229667594;this.A=8192}f=tk.prototype;f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){switch(a instanceof t?a.ra:null){case "low":return this.gb;case "high":return this.eb;default:return H.c(this.v,a,c)}};
f.I=function(b,a,c){return X(a,function(){return function(b){return X(a,Y,""," ","",c,b)}}(this),"#burn.projectors.Middle{",", ","}",c,je.b(new V(null,2,5,W,[new V(null,2,5,W,[mi,this.gb],null),new V(null,2,5,W,[Mh,this.eb],null)],null),this.v))};f.ia=function(){return new Af(0,this,2,new V(null,2,5,W,[mi,Mh],null),Zb(this.v))};f.L=function(){return this.G};f.U=function(){return 2+R(this.v)};f.Db=function(b,a){return ck(hk(this.eb,zd(Gd,gk(a))))};f.Cb=function(b,a){return ck(hk(this.gb,zd(Fd,gk(a))))};
f.K=function(){var b=this.j;return null!=b?b:this.j=b=Sd(this)};f.u=function(b,a){var c;c=q(a)?(c=this.constructor===a.constructor)?zf(this,a):c:a;return q(c)?!0:!1};f.Ea=function(b,a){return vd(new zg(null,new p(null,2,[Mh,null,mi,null],null),null),a)?fd.b(Gc(Ue(te,this),this.G),a):new tk(this.gb,this.eb,this.G,oe(fd.b(this.v,a)),null)};
f.qa=function(b,a,c){return q(U.b?U.b(mi,a):U.call(null,mi,a))?new tk(c,this.eb,this.G,this.v,null):q(U.b?U.b(Mh,a):U.call(null,Mh,a))?new tk(this.gb,c,this.G,this.v,null):new tk(this.gb,this.eb,this.G,dd.c(this.v,a,c),null)};f.P=function(){return L(je.b(new V(null,2,5,W,[new V(null,2,5,W,[mi,this.gb],null),new V(null,2,5,W,[Mh,this.eb],null)],null),this.v))};f.M=function(b,a){return new tk(this.gb,this.eb,a,this.v,this.j)};f.R=function(b,a){return md(a)?eb(this,B.b(a,0),B.b(a,1)):Ma.c(Wa,this,a)};
function uk(b,a,c){this.G=b;this.v=a;this.j=c;this.i=2229667594;this.A=8192}f=uk.prototype;f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){switch(a){default:return H.c(this.v,a,c)}};f.I=function(b,a,c){return X(a,function(){return function(b){return X(a,Y,""," ","",c,b)}}(this),"#burn.projectors.Current{",", ","}",c,je.b($c,this.v))};f.ia=function(){return new Af(0,this,0,$c,Zb(this.v))};f.L=function(){return this.G};f.U=function(){return 0+R(this.v)};
f.Db=function(b,a){var c=Ne(R(a)-2,a),d=S(c,0),d=S(d,0),c=S(c,1),e=S(c,0);return S(c,1)/Math.round((fk(e)-fk(d))/864E5)};f.Cb=function(b,a){return rk(this,a)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Sd(this)};f.u=function(b,a){var c;c=q(a)?(c=this.constructor===a.constructor)?zf(this,a):c:a;return q(c)?!0:!1};f.Ea=function(b,a){return vd(Ag,a)?fd.b(Gc(Ue(te,this),this.G),a):new uk(this.G,oe(fd.b(this.v,a)),null)};f.qa=function(b,a,c){return new uk(this.G,dd.c(this.v,a,c),null)};
f.P=function(){return L(je.b($c,this.v))};f.M=function(b,a){return new uk(a,this.v,this.j)};f.R=function(b,a){return md(a)?eb(this,B.b(a,0),B.b(a,1)):Ma.c(Wa,this,a)};function vk(b,a,c){this.G=b;this.v=a;this.j=c;this.i=2229667594;this.A=8192}f=vk.prototype;f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){switch(a){default:return H.c(this.v,a,c)}};
f.I=function(b,a,c){return X(a,function(){return function(b){return X(a,Y,""," ","",c,b)}}(this),"#burn.projectors.Extremes{",", ","}",c,je.b($c,this.v))};f.ia=function(){return new Af(0,this,0,$c,Zb(this.v))};f.L=function(){return this.G};f.U=function(){return 0+R(this.v)};f.Db=function(b,a){return A.b(Jd,gk(a))};f.Cb=function(b,a){return A.b(Id,gk(a))};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Sd(this)};
f.u=function(b,a){var c;c=q(a)?(c=this.constructor===a.constructor)?zf(this,a):c:a;return q(c)?!0:!1};f.Ea=function(b,a){return vd(Ag,a)?fd.b(Gc(Ue(te,this),this.G),a):new vk(this.G,oe(fd.b(this.v,a)),null)};f.qa=function(b,a,c){return new vk(this.G,dd.c(this.v,a,c),null)};f.P=function(){return L(je.b($c,this.v))};f.M=function(b,a){return new vk(a,this.v,this.j)};f.R=function(b,a){return md(a)?eb(this,B.b(a,0),B.b(a,1)):Ma.c(Wa,this,a)};
function wk(b,a,c,d,e){this.n=b;this.weight=a;this.G=c;this.v=d;this.j=e;this.i=2229667594;this.A=8192}f=wk.prototype;f.H=function(b,a){return cb.c(this,a,null)};f.F=function(b,a,c){switch(a instanceof t?a.ra:null){case "n":return this.n;case "weight":return this.weight;default:return H.c(this.v,a,c)}};
f.I=function(b,a,c){return X(a,function(){return function(b){return X(a,Y,""," ","",c,b)}}(this),"#burn.projectors.WeightedMostRecent{",", ","}",c,je.b(new V(null,2,5,W,[new V(null,2,5,W,[uh,this.n],null),new V(null,2,5,W,[Wh,this.weight],null)],null),this.v))};f.ia=function(){return new Af(0,this,2,new V(null,2,5,W,[uh,Wh],null),Zb(this.v))};f.L=function(){return this.G};f.U=function(){return 2+R(this.v)};
f.Db=function(b,a){var c;a:{c=$c;for(var d=a;;)if(O(d))c=Zc.b(c,M(d)),d=O(d);else{c=L(c);break a}}c=ck(gk(c));a:for(var e=this.n+1,d=L(a),e=L(Ne(e,a));;)if(e)d=O(d),e=O(e);else break a;d=ck(gk(d));return(1-this.weight)*c+this.weight*d};f.Cb=function(b,a){return rk(this,a)};f.K=function(){var b=this.j;return null!=b?b:this.j=b=Sd(this)};f.u=function(b,a){var c;c=q(a)?(c=this.constructor===a.constructor)?zf(this,a):c:a;return q(c)?!0:!1};
f.Ea=function(b,a){return vd(new zg(null,new p(null,2,[uh,null,Wh,null],null),null),a)?fd.b(Gc(Ue(te,this),this.G),a):new wk(this.n,this.weight,this.G,oe(fd.b(this.v,a)),null)};f.qa=function(b,a,c){return q(U.b?U.b(uh,a):U.call(null,uh,a))?new wk(c,this.weight,this.G,this.v,null):q(U.b?U.b(Wh,a):U.call(null,Wh,a))?new wk(this.n,c,this.G,this.v,null):new wk(this.n,this.weight,this.G,dd.c(this.v,a,c),null)};
f.P=function(){return L(je.b(new V(null,2,5,W,[new V(null,2,5,W,[uh,this.n],null),new V(null,2,5,W,[Wh,this.weight],null)],null),this.v))};f.M=function(b,a){return new wk(this.n,this.weight,a,this.v,this.j)};f.R=function(b,a){return md(a)?eb(this,B.b(a,0),B.b(a,1)):Ma.c(Wa,this,a)};var xk;
a:for(var yk=J([pi,new p(null,3,[th,"Average",jh,"Project the average velocity of all sprints.",fh,new tk(0,0,null,null,null)],null),di,new p(null,3,[th,"Current",jh,"Project the most recent sprint's velocity.",fh,new uk(null,null,null)],null),Jh,new p(null,3,[th,"Extremes",jh,"Project the fastest and slowest sprints' velocities.",fh,new vk(null,null,null)],null),vi,new p(null,3,[th,"Top 10%, Bottom 50%",jh,"Project the averages of the fastest 10% and the slowest 50% of sprint velocities.",fh,new tk(.9,
.5,null,null,null)],null),Ki,new p(null,3,[th,"Top 80%, Bottom 80%",jh,"Project the averages of the fastest 80% and the slowest 80% of sprint velocities.",fh,new tk(.2,.2,null,null,null)],null),yi,new p(null,3,[th,"Weighted Most Recent",jh,"Project an average sprint velocity, weighting toward the most recent sprint's velocity.",fh,new wk(1,.5,null,null,null)],null)],0),zk=L(yk),Ak=sg;;)if(zk)var Bk=O(O(zk)),Ck=dd.c(Ak,M(zk),Xc(zk)),zk=Bk,Ak=Ck;else{xk=Ak;break a};function Dk(b){return[x("M"),x(ik("",Qe(T.b(function(a){return ik(",",a)},b))))].join("")}function Ek(b,a){return[x("translate("),x(b),x(","),x(a),x(")")].join("")}function Fk(b){return[x(b.getMonth()+1),x("/"),x(b.getDate()),x("/"),x(b.getFullYear()-2E3)].join("")}
function Gk(b,a,c){return new V(null,4,5,W,[Th,te,new V(null,4,5,W,[Th,te,new V(null,2,5,W,[Vh,new p(null,2,[bi,"axis",xi,a.a?a.a(0):a.call(null,0)],null)],null),function(){var c=T.b(fk,ok(b)),e=S(c,0),g=S(c,1),h=(g-e)/6048E5,k=6048E5*Math.ceil(h/14);return function(c,d,e,g,h,k){return function D(E){return new $d(null,function(){return function(){for(;;){var c=L(E);if(c){if(pd(c)){var d=Ub(c),e=R(d),g=de(e);a:for(var h=0;;)if(h<e){var k=B.b(d,h),k=ek(k),k=new V(null,3,5,W,[Ji,new p(null,3,[hh,Ek(b.a?
b.a(k):b.call(null,k),a.a?a.a(0):a.call(null,0)),Bh,25,$g,"middle"],null),Fk(k)],null);g.add(k);h+=1}else{d=!0;break a}return d?ee(g.fa(),D(Vb(c))):ee(g.fa(),null)}g=M(c);g=ek(g);return Q(new V(null,3,5,W,[Ji,new p(null,3,[hh,Ek(b.a?b.a(g):b.call(null,g),a.a?a.a(0):a.call(null,0)),Bh,25,$g,"middle"],null),Fk(g)],null),D(uc(c)))}return null}}}(c,d,e,g,h,k),null,null)}}(c,e,g,6048E5,h,k)(new Cg(null,e,g,k,null))}()],null),new V(null,4,5,W,[Th,te,new V(null,2,5,W,[Vh,new p(null,3,[bi,"axis",hh,Ek(0,
a.a?a.a(0):a.call(null,0)),Gi,b.a?b.a(c):b.call(null,c)],null)],null),function(){var b=ok(a),c=S(b,0),g=S(b,1);return function(b,c,d){return function r(e){return new $d(null,function(){return function(){for(;;){var b=L(e);if(b){if(pd(b)){var c=Ub(b),d=R(c),g=de(d);a:for(var h=0;;)if(h<d){var k=B.b(c,h),k=new V(null,3,5,W,[Ji,new p(null,4,[hh,Ek(0,a.a?a.a(k):a.call(null,k)),ih,-13,Bh,6,$g,"end"],null),k],null);g.add(k);h+=1}else{c=!0;break a}return c?ee(g.fa(),r(Vb(b))):ee(g.fa(),null)}g=M(b);return Q(new V(null,
3,5,W,[Ji,new p(null,4,[hh,Ek(0,a.a?a.a(g):a.call(null,g)),ih,-13,Bh,6,$g,"end"],null),g],null),r(uc(b)))}return null}}}(b,c,d),null,null)}}(b,c,g)(qk(new V(null,2,5,W,[c,g],null)))}()],null)],null)}
function Hk(b,a,c,d){c=je.b(function(){return function g(c){return new $d(null,function(){for(;;){var d=L(c);if(d){if(pd(d)){var l=Ub(d),n=R(l),r=de(n);a:for(var y=0;;)if(y<n){var v=B.b(l,y),z=S(v,0);S(v,1);v=S(v,2);z=new V(null,2,5,W,[b.a?b.a(z):b.call(null,z),a.a?a.a(v):a.call(null,v)],null);r.add(z);y+=1}else{l=!0;break a}return l?ee(r.fa(),g(Vb(d))):ee(r.fa(),null)}l=M(d);r=S(l,0);S(l,1);l=S(l,2);return Q(new V(null,2,5,W,[b.a?b.a(r):b.call(null,r),a.a?a.a(l):a.call(null,l)],null),g(uc(d)))}return null}},
null,null)}(d)}(),new V(null,1,5,W,[new V(null,2,5,W,[b.a?b.a(c):b.call(null,c),function(){var b=kk(Yc(d));return a.a?a.a(b):a.call(null,b)}()],null)],null));return new V(null,2,5,W,[ah,new p(null,3,[bi,"scope",ni,Dk(c),Ph,"url(#interior)"],null)],null)}
function Ik(b,a,c){return new V(null,2,5,W,[ah,new p(null,4,[bi,"progress",ni,Dk(function(){return function e(c){return new $d(null,function(){for(;;){var h=L(c);if(h){if(pd(h)){var k=Ub(h),l=R(k),n=de(l);a:for(var r=0;;)if(r<l){var y=B.b(k,r),v=S(y,0),y=S(y,1),v=new V(null,2,5,W,[b.a?b.a(v):b.call(null,v),a.a?a.a(y):a.call(null,y)],null);n.add(v);r+=1}else{k=!0;break a}return k?ee(n.fa(),e(Vb(h))):ee(n.fa(),null)}k=M(h);n=S(k,0);k=S(k,1);return Q(new V(null,2,5,W,[b.a?b.a(n):b.call(null,n),a.a?a.a(k):
a.call(null,k)],null),e(uc(h)))}return null}},null,null)}(c)}()),Qh,"round",Ph,"url(#interior)"],null)],null)}
function Jk(b,a,c,d){return new V(null,4,5,W,[Th,te,new V(null,2,5,W,[Vh,new p(null,6,[bi,"projection",ri,function(){var a=M.a?M.a(d):M.call(null,d);return b.a?b.a(a):b.call(null,a)}(),yh,function(){var b=Xc.a?Xc.a(d):Xc.call(null,d);return a.a?a.a(b):a.call(null,b)}(),Gi,b.a?b.a(c):b.call(null,c),xi,function(){var b=kk(d);return a.a?a.a(b):a.call(null,b)}(),Ph,"url(#interior)"],null)],null),new V(null,3,5,W,[Ji,new p(null,3,[hh,Ek(b.a?b.a(c):b.call(null,c),function(){var b=kk(d);return a.a?a.a(b):
a.call(null,b)}()),$g,"middle",Bh,-5],null),Fk(c)],null)],null)}function Kk(b){return Dg(function(a,b){return We(b,1,function(b){var c=H.b(a,1);return Ed.b?Ed.b(c,b):Ed.call(null,c,b)})},b)}
function Lk(b,a,c){var d=function(){var a=Yc(c);return M.a?M.a(a):M.call(null,a)}();if(0<b){var e=rk(a,c);a=sk(a,c);var g=function(a,b,c){return function(a){var b=new Date;b.setTime(fk(c)+864E5*a);return b}}(e,a,d);return new V(null,2,5,W,[g(b/a),0<e?g(b/e):0<a?g(b/a):d],null)}return new V(null,2,5,W,[d,d],null)}
function Mk(b){var a=Nk,c=null!=b&&(b.i&64||b.kb)?A.b(Ec,b):b,d=H.b(c,Dh),e=H.b(c,Zh),g=e.trim(),h=xk.a?xk.a(d):xk.call(null,d);return new V(null,10,5,W,[zi,te,new V(null,3,5,W,[Rh,new p(null,1,[Kh,"right"],null),new V(null,3,5,W,[ph,new p(null,1,[Ah,function(){return function(){var a=document.getElementById("visualization"),b=Vg(new p(null,1,[oh,4],null));return saveSvgAsPng(a,"burn-chart",b)}}(g,h,b,c,d,e)],null),"Download"],null)],null),new V(null,3,5,W,[wi,te,"Burn Chart"],null),new V(null,3,
5,W,[Rh,new p(null,1,[Kh,"spaced horizontal"],null),function(){return function(b,c,d,e,g,h){return function C(D){return new $d(null,function(b,c,d,e,g,h){return function(){for(;;){var k=L(D);if(k){var l=k;if(pd(l)){var n=Ub(l),r=R(n),y=de(r);return function(){for(var v=0;;)if(v<r){var C=B.b(n,v),D=S(C,0),ja=S(C,1);fe(y,new V(null,5,5,W,[$h,new p(null,1,[Kh,"label--radio"],null),new V(null,2,5,W,[ui,new p(null,3,[Fh,"radio",ei,ic.b(D,g),Ah,function(b,c,d){return function(){var b=new V(null,2,5,W,[mh,
d],null);return a.a?a.a(b):a.call(null,b)}}(v,C,D,ja,n,r,y,l,k,b,c,d,e,g,h)],null)],null),new V(null,3,5,W,[sh,te,new V(null,3,5,W,[Nh,te,ja.a?ja.a(th):ja.call(null,th)],null)],null),new V(null,3,5,W,[Rh,new p(null,1,[Kh,"muted"],null),new V(null,3,5,W,[Nh,te,ja.a?ja.a(jh):ja.call(null,jh)],null)],null)],null));v+=1}else return!0}()?ee(y.fa(),C(Vb(l))):ee(y.fa(),null)}var v=M(l),Pa=S(v,0),ja=S(v,1);return Q(new V(null,5,5,W,[$h,new p(null,1,[Kh,"label--radio"],null),new V(null,2,5,W,[ui,new p(null,
3,[Fh,"radio",ei,ic.b(Pa,g),Ah,function(b,c){return function(){var b=new V(null,2,5,W,[mh,c],null);return a.a?a.a(b):a.call(null,b)}}(v,Pa,ja,l,k,b,c,d,e,g,h)],null)],null),new V(null,3,5,W,[sh,te,new V(null,3,5,W,[Nh,te,ja.a?ja.a(th):ja.call(null,th)],null)],null),new V(null,3,5,W,[Rh,new p(null,1,[Kh,"muted"],null),new V(null,3,5,W,[Nh,te,ja.a?ja.a(jh):ja.call(null,jh)],null)],null)],null),C(uc(l)))}return null}}}(b,c,d,e,g,h),null,null)}}(g,h,b,c,d,e)(xk)}()],null),function(){var a=new V(null,
2,5,W,[960,500],null),b=S(a,0),c=S(a,1),d=mk(g),a=W,e=new p(null,4,[zh,b,Hi,c,ai,"visualization",bi,"bordered"],null);if(L(d)){var c=new V(null,2,5,W,[b,c],null),v=h.a?h.a(fh):h.call(null,fh),b=S(c,0),c=S(c,1),z=ze.b(fk,M),d=Bd(z,d),C=M(d),z=S(C,0);S(C,1);var C=S(C,2),D=Xc(d),D=S(D,0),E=new Date;E.setTime(fk(z)-864E5*Math.round((fk(D)-fk(z))/864E5));var d=je.b(new V(null,1,5,W,[new V(null,3,5,W,[E,0,C],null)],null),d),z=Kk(d),C=Yc(z),C=kk(C)-(Xc.a?Xc.a(C):Xc.call(null,C)),D=Lk(C,v,d),v=S(D,0),D=S(D,
1),E=W,G;G=M(d);G=M.a?M.a(G):M.call(null,G);E=new pk(new V(null,2,5,E,[G,D],null),new V(null,2,5,W,[0,b-100],null),fk,null,null,null);G=new V(null,2,5,W,[0,A.b(Id,T.b(kk,d))],null);G=new pk(G,new V(null,2,5,W,[c-65,0],null),Dd,null,null,null);b=Wa(Wa(Wa(N,new V(null,6,5,W,[Th,new p(null,1,[hh,Ek(50,25)],null),Hk(E,G,D,d),Ik(E,G,z),0<C?Wa(Wa(N,Jk(E,G,D,Yc(z))),Jk(E,G,v,Yc(z))):null,Gk(E,G,D)],null)),new V(null,2,5,W,[Bi,new p(null,3,[zh,b,Hi,c,wh,"white"],null)],null)),new V(null,3,5,W,[gi,te,new V(null,
3,5,W,[Ch,new p(null,1,[ai,"interior"],null),new V(null,2,5,W,[Bi,new p(null,4,[Zg,-25,zh,b-50,Hi,c-65+25,xh,"userSpaceOnUse"],null)],null)],null)],null))}else b=new V(null,3,5,W,[Ji,new p(null,3,[hh,Ek(b/2,c/2),Bh,5,$g,"middle"],null),"No data"],null);return new V(null,3,5,a,[ji,e,b],null)}(),new V(null,3,5,W,[qi,te,"Data"],null),new V(null,4,5,W,[Rh,new p(null,1,[Kh,"column-left"],null),new V(null,3,5,W,[Fi,te,"Specify your data as comma-separated values. There are three fields:"],null),new V(null,
5,5,W,[kh,te,new V(null,3,5,W,[vh,te,'date (in the format "mm/dd/yy")'],null),new V(null,3,5,W,[vh,te,"points completed between the given date and the date of the previous row"],null),new V(null,3,5,W,[vh,te,"total points in scope as of the given date"],null)],null)],null),new V(null,3,5,W,[Rh,new p(null,1,[Kh,"column-right"],null),new V(null,3,5,W,[Oh,new p(null,2,[Kh,"width-full",eh,function(){return function(){var b=new V(null,2,5,W,[Gh,this.value],null);return a.a?a.a(b):a.call(null,b)}}(g,h,
b,c,d,e)],null),g],null)],null),new V(null,2,5,W,[Rh,new p(null,1,[Kh,"clearfix"],null)],null)],null)};var Ok=ej("Opera")||ej("OPR"),Pk=ej("Trident")||ej("MSIE"),Qk=ej("Edge"),Rk=ej("Gecko")&&!(-1!=bj.toLowerCase().indexOf("webkit")&&!ej("Edge"))&&!(ej("Trident")||ej("MSIE"))&&!ej("Edge"),Sk=-1!=bj.toLowerCase().indexOf("webkit")&&!ej("Edge");function Tk(){var b=bj;if(Rk)return/rv\:([^\);]+)(\)|;)/.exec(b);if(Qk)return/Edge\/([\d\.]+)/.exec(b);if(Pk)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(b);if(Sk)return/WebKit\/(\S+)/.exec(b)}
(function(){if(Ok&&aa.opera){var b=aa.opera.version;return ba(b)?b():b}var b="",a=Tk();a&&(b=a?a[1]:"");return Pk&&(a=(a=aa.document)?a.documentMode:void 0,a>parseFloat(b))?String(a):b})();var Uk=null,Vk=null,Wk=Rk||Sk||Ok||"function"==typeof aa.atob;function Xk(){if(!Uk){Uk={};Vk={};for(var b=0;65>b;b++)Uk[b]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(b),Vk[Uk[b]]=b,62<=b&&(Vk["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(b)]=b)}};var Yk=function Yk(a){if(null!=a&&null!=a.Ac)return a.Ac();var c=Yk[m(null==a?null:a)];if(null!=c)return c.a?c.a(a):c.call(null,a);c=Yk._;if(null!=c)return c.a?c.a(a):c.call(null,a);throw w("PushbackReader.read-char",a);},Zk=function Zk(a,c){if(null!=a&&null!=a.Bc)return a.Bc(0,c);var d=Zk[m(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Zk._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw w("PushbackReader.unread",a);};
function $k(b,a,c){this.J=b;this.buffer=a;this.ic=c}$k.prototype.Ac=function(){return 0===this.buffer.length?(this.ic+=1,this.J[this.ic]):this.buffer.pop()};$k.prototype.Bc=function(b,a){return this.buffer.push(a)};function al(b){var a=!/[^\t\n\r ]/.test(b);return q(a)?a:","===b}bl;cl;dl;function el(b){throw Error(A.b(x,b));}
function fl(b,a){for(var c=new ka(a),d=Yk(b);;){var e;if(!(e=null==d||al(d))){e=d;var g="#"!==e;e=g?(g="'"!==e)?(g=":"!==e)?cl.a?cl.a(e):cl.call(null,e):g:g:g}if(e)return Zk(b,d),c.toString();c.append(d);d=Yk(b)}}function gl(b){for(;;){var a=Yk(b);if("\n"===a||"\r"===a||null==a)return b}}var hl=Gg("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),il=Gg("^([-+]?[0-9]+)/([0-9]+)$"),jl=Gg("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),kl=Gg("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function ll(b,a){var c=b.exec(a);return null!=c&&c[0]===a?1===c.length?c[0]:c:null}var ml=Gg("^[0-9A-Fa-f]{2}$"),nl=Gg("^[0-9A-Fa-f]{4}$");function ol(b,a,c){return q(Fg(b,c))?c:el(J(["Unexpected unicode escape \\",a,c],0))}function pl(b){return String.fromCharCode(parseInt(b,16))}
function ql(b){var a=Yk(b),c="t"===a?"\t":"r"===a?"\r":"n"===a?"\n":"\\"===a?"\\":'"'===a?'"':"b"===a?"\b":"f"===a?"\f":null;q(c)?a=c:"x"===a?(b=(new ka(Yk(b),Yk(b))).toString(),a=pl(ol(ml,a,b))):"u"===a?(b=(new ka(Yk(b),Yk(b),Yk(b),Yk(b))).toString(),a=pl(ol(nl,a,b))):a=/[^0-9]/.test(a)?el(J(["Unexpected unicode escape \\",a],0)):String.fromCharCode(a);return a}
function rl(b,a){for(var c=Lb($c);;){var d;a:{d=al;for(var e=a,g=Yk(e);;)if(q(d.a?d.a(g):d.call(null,g)))g=Yk(e);else{d=g;break a}}q(d)||el(J(["EOF while reading"],0));if(b===d)return Nb(c);e=cl.a?cl.a(d):cl.call(null,d);q(e)?d=e.b?e.b(a,d):e.call(null,a,d):(Zk(a,d),d=bl.B?bl.B(a,!0,null,!0):bl.call(null,a,!0,null));c=d===a?c:le.b(c,d)}}function sl(b,a){return el(J(["Reader for ",a," not implemented yet"],0))}tl;
function ul(b,a){var c=Yk(b),d=dl.a?dl.a(c):dl.call(null,c);if(q(d))return d.b?d.b(b,a):d.call(null,b,a);d=tl.b?tl.b(b,c):tl.call(null,b,c);return q(d)?d:el(J(["No dispatch macro for ",c],0))}function vl(b,a){return el(J(["Unmatched delimiter ",a],0))}function wl(b){return A.b(hc,rl(")",b))}function xl(b){return rl("]",b)}
function yl(b){b=rl("}",b);var a=R(b);if("number"!==typeof a||isNaN(a)||Infinity===a||parseFloat(a)!==parseInt(a,10))throw Error([x("Argument must be an integer: "),x(a)].join(""));0!==(a&1)&&el(J(["Map literal must contain an even number of forms"],0));return A.b(Ec,b)}function zl(b){for(var a=new ka,c=Yk(b);;){if(null==c)return el(J(["EOF while reading"],0));if("\\"===c)a.append(ql(b));else{if('"'===c)return a.toString();a.append(c)}c=Yk(b)}}
function Al(b){for(var a=new ka,c=Yk(b);;){if(null==c)return el(J(["EOF while reading"],0));if("\\"===c){a.append(c);var d=Yk(b);if(null==d)return el(J(["EOF while reading"],0));var e=function(){var b=a;b.append(d);return b}(),g=Yk(b)}else{if('"'===c)return a.toString();e=function(){var b=a;b.append(c);return b}();g=Yk(b)}a=e;c=g}}
function Bl(b,a){var c=fl(b,a),d=-1!=c.indexOf("/");q(q(d)?1!==c.length:d)?c=rc.b(c.substring(0,c.indexOf("/")),c.substring(c.indexOf("/")+1,c.length)):(d=rc.a(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?hi:d);return c}
function Cl(b,a){var c=fl(b,a),d=c.substring(1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?pl(d.substring(1)):"o"===d.charAt(0)?sl(0,c):el(J(["Unknown character literal: ",c],0))}
function Dl(b){b=fl(b,Yk(b));var a=ll(kl,b);b=a[0];var c=a[1],a=a[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===a[a.length-1]||-1!==b.indexOf("::",1)?el(J(["Invalid token: ",b],0)):null!=c&&0<c.length?Zd.b(c.substring(0,c.indexOf("/")),a):Zd.a(b)}function El(b){return function(a){return Wa(Wa(N,bl.B?bl.B(a,!0,null,!0):bl.call(null,a,!0,null)),b)}}function Fl(){return function(){return el(J(["Unreadable form"],0))}}
function Gl(b){var a;a=bl.B?bl.B(b,!0,null,!0):bl.call(null,b,!0,null);if(a instanceof F)a=new p(null,1,[si,a],null);else if("string"===typeof a)a=new p(null,1,[si,a],null);else if(a instanceof t){a=[a,!0];for(var c=[],d=0;;)if(d<a.length){var e=a[d],g=a[d+1];-1===Ef(c,e)&&(c.push(e),c.push(g));d+=2}else break;a=new p(null,c.length/2,c,null)}ld(a)||el(J(["Metadata must be Symbol,Keyword,String or Map"],0));b=bl.B?bl.B(b,!0,null,!0):bl.call(null,b,!0,null);return(null!=b?b.i&262144||b.rd||(b.i?0:u(ub,
b)):u(ub,b))?Gc(b,vg.l(J([id(b),a],0))):el(J(["Metadata can only be applied to IWithMetas"],0))}function Hl(b){a:if(b=rl("}",b),b=L(b),null==b)b=Ag;else if(b instanceof K&&0===b.o){b=b.f;b:for(var a=0,c=Lb(Ag);;)if(a<b.length)var d=a+1,c=c.lb(null,b[a]),a=d;else break b;b=c.wb(null)}else for(d=Lb(Ag);;)if(null!=b)a=O(b),d=d.lb(null,b.aa(null)),b=a;else{b=Nb(d);break a}return b}function Il(b){return Gg(Al(b))}function Jl(b){bl.B?bl.B(b,!0,null,!0):bl.call(null,b,!0,null);return b}
function cl(b){return'"'===b?zl:":"===b?Dl:";"===b?gl:"'"===b?El(se):"@"===b?El(Ei):"^"===b?Gl:"`"===b?sl:"~"===b?sl:"("===b?wl:")"===b?vl:"["===b?xl:"]"===b?vl:"{"===b?yl:"}"===b?vl:"\\"===b?Cl:"#"===b?ul:null}function dl(b){return"{"===b?Hl:"\x3c"===b?Fl():'"'===b?Il:"!"===b?gl:"_"===b?Jl:null}
function bl(b,a,c){for(;;){var d=Yk(b);if(null==d)return q(a)?el(J(["EOF while reading"],0)):c;if(!al(d))if(";"===d)b=gl.b?gl.b(b,d):gl.call(null,b);else{var e=cl(d);if(q(e))e=e.b?e.b(b,d):e.call(null,b,d);else{var e=b,g=void 0;!(g=!/[^0-9]/.test(d))&&(g=void 0,g="+"===d||"-"===d)&&(g=Yk(e),Zk(e,g),g=!/[^0-9]/.test(g));if(g)a:for(e=b,d=new ka(d),g=Yk(e);;){var h;h=null==g;h||(h=(h=al(g))?h:cl.a?cl.a(g):cl.call(null,g));if(q(h)){Zk(e,g);d=e=d.toString();g=void 0;q(ll(hl,d))?(d=ll(hl,d),g=d[2],null!=
(ic.b(g,"")?null:g)?g=0:(g=q(d[3])?[d[3],10]:q(d[4])?[d[4],16]:q(d[5])?[d[5],8]:q(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=g[0],null==h?g=null:(g=parseInt(h,g[1]),g="-"===d[1]?-g:g))):(g=void 0,q(ll(il,d))?(d=ll(il,d),g=parseInt(d[1],10)/parseInt(d[2],10)):g=q(ll(jl,d))?parseFloat(d):null);d=g;e=q(d)?d:el(J(["Invalid number format [",e,"]"],0));break a}d.append(g);g=Yk(e)}else e=Bl(b,d)}if(e!==b)return e}}}
var Kl=function(b,a){return function(c,d){return H.b(q(d)?a:b,c)}}(new V(null,13,5,W,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new V(null,13,5,W,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),Ll=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function Ml(b){b=parseInt(b,10);return Ia(isNaN(b))?b:null}
function Nl(b,a,c,d){b<=a&&a<=c||el(J([[x(d),x(" Failed:  "),x(b),x("\x3c\x3d"),x(a),x("\x3c\x3d"),x(c)].join("")],0));return a}
function Ol(b){var a=Fg(Ll,b);S(a,0);var c=S(a,1),d=S(a,2),e=S(a,3),g=S(a,4),h=S(a,5),k=S(a,6),l=S(a,7),n=S(a,8),r=S(a,9),y=S(a,10);if(Ia(a))return el(J([[x("Unrecognized date/time syntax: "),x(b)].join("")],0));var v=Ml(c),z=function(){var a=Ml(d);return q(a)?a:1}();b=function(){var a=Ml(e);return q(a)?a:1}();var a=function(){var a=Ml(g);return q(a)?a:0}(),c=function(){var a=Ml(h);return q(a)?a:0}(),C=function(){var a=Ml(k);return q(a)?a:0}(),D=function(){var a;a:if(ic.b(3,R(l)))a=l;else if(3<R(l))a=
l.substring(0,3);else for(a=new ka(l);;)if(3>a.ab.length)a=a.append("0");else{a=a.toString();break a}a=Ml(a);return q(a)?a:0}(),n=(ic.b(n,"-")?-1:1)*(60*function(){var a=Ml(r);return q(a)?a:0}()+function(){var a=Ml(y);return q(a)?a:0}());return new V(null,8,5,W,[v,Nl(1,z,12,"timestamp month field must be in range 1..12"),Nl(1,b,function(){var a;a=0===Kd(v,4);q(a)&&(a=Ia(0===Kd(v,100)),a=q(a)?a:0===Kd(v,400));return Kl.b?Kl.b(z,a):Kl.call(null,z,a)}(),"timestamp day field must be in range 1..last day in month"),
Nl(0,a,23,"timestamp hour field must be in range 0..23"),Nl(0,c,59,"timestamp minute field must be in range 0..59"),Nl(0,C,ic.b(c,59)?60:59,"timestamp second field must be in range 0..60"),Nl(0,D,999,"timestamp millisecond field must be in range 0..999"),n],null)}
var Pl,Ql=new p(null,4,["inst",function(b){var a;if("string"===typeof b)if(a=Ol(b),q(a)){b=S(a,0);var c=S(a,1),d=S(a,2),e=S(a,3),g=S(a,4),h=S(a,5),k=S(a,6);a=S(a,7);a=new Date(Date.UTC(b,c-1,d,e,g,h,k)-6E4*a)}else a=el(J([[x("Unrecognized date/time syntax: "),x(b)].join("")],0));else a=el(J(["Instance literal expects a string for its timestamp."],0));return a},"uuid",function(b){return"string"===typeof b?new Xg(b,null):el(J(["UUID literal expects a string as its representation."],0))},"queue",function(b){return md(b)?
Ue(wf,b):el(J(["Queue literal expects a vector for its elements."],0))},"js",function(b){if(md(b)){var a=[];b=L(b);for(var c=null,d=0,e=0;;)if(e<d){var g=c.Z(null,e);a.push(g);e+=1}else if(b=L(b))c=b,pd(c)?(b=Ub(c),e=Vb(c),c=b,d=R(b),b=e):(b=M(c),a.push(b),b=O(c),c=null,d=0),e=0;else break;return a}if(ld(b)){a={};b=L(b);c=null;for(e=d=0;;)if(e<d){var h=c.Z(null,e),g=S(h,0),h=S(h,1);a[Pd(g)]=h;e+=1}else if(b=L(b))pd(b)?(d=Ub(b),b=Vb(b),c=d,d=R(d)):(d=M(b),c=S(d,0),d=S(d,1),a[Pd(c)]=d,b=O(b),c=null,
d=0),e=0;else break;return a}return el(J([[x("JS literal expects a vector or map containing "),x("only string or unqualified keyword keys")].join("")],0))}],null);Pl=Ce.a?Ce.a(Ql):Ce.call(null,Ql);var Rl=Ce.a?Ce.a(null):Ce.call(null,null);
function tl(b,a){var c=Bl(b,a),d=H.b(P.a?P.a(Pl):P.call(null,Pl),""+x(c)),e=P.a?P.a(Rl):P.call(null,Rl);return q(d)?(c=bl(b,!0,null),d.a?d.a(c):d.call(null,c)):q(e)?(d=bl(b,!0,null),e.b?e.b(c,d):e.call(null,c,d)):el(J(["Could not find tag parser for ",""+x(c)," in ",Ee.l(J([Hf(P.a?P.a(Pl):P.call(null,Pl))],0))],0))};sa=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return a.call(this,d)}function a(a){return console.log.apply(console,Ca.a?Ca.a(a):Ca.call(null,a))}b.C=0;b.D=function(b){b=L(b);return a(b)};b.l=a;return b}();
ta=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new K(e,0)}return a.call(this,d)}function a(a){return console.error.apply(console,Ca.a?Ca.a(a):Ca.call(null,a))}b.C=0;b.D=function(b){b=L(b);return a(b)};b.l=a;return b}();
function Sl(b){window.location.hash=[x("/"),x(function(){var a=Ee.l(J([b],0)),c;if(Wk)c=aa.btoa(a);else{c=[];for(var d=0,e=0;e<a.length;e++){for(var g=a.charCodeAt(e);255<g;)c[d++]=g&255,g>>=8;c[d++]=g}a=m(c);if("array"!=a&&("object"!=a||"number"!=typeof c.length))throw Error("encodeByteArray takes an array as a parameter");Xk();a=Uk;d=[];for(e=0;e<c.length;e+=3){var h=c[e],k=(g=e+1<c.length)?c[e+1]:0,l=e+2<c.length,n=l?c[e+2]:0,r=h>>2,h=(h&3)<<4|k>>4,k=(k&15)<<2|n>>6,n=n&63;l||(n=64,g||(k=64));d.push(a[r],
a[h],a[k],a[n])}c=d.join("")}return c}())].join("");return b}
function Xj(b,a){try{if(U(a,Lh))return b;throw nk;}catch(c){if(c instanceof Error)if(c===nk)try{if(md(a)&&2===R(a))try{var d=bd(a,0);if(U(d,Gh)){var e=bd(a,1);return Sl(dd.c(b,Zh,e))}throw nk;}catch(g){if(g instanceof Error){var h=g;if(h===nk)try{d=bd(a,0);if(U(d,mh))return e=bd(a,1),Sl(dd.c(b,Dh,e));throw nk;}catch(k){if(k instanceof Error&&k===nk)throw nk;throw k;}else throw h;}else throw g;}else throw nk;}catch(l){if(l instanceof Error){h=l;if(h===nk)throw Error([x("No matching clause: "),x(a)].join(""));
throw h;}throw l;}else throw c;else throw c;}}var Yj,Tl;
try{var Ul;var Vl=window.location.hash,Wl=/^#\//;if("string"===typeof Wl)Ul=Vl.replace(new RegExp(String(Wl).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(Wl instanceof RegExp)Ul=Vl.replace(new RegExp(Wl.source,"g"),"");else throw[x("Invalid match arg: "),x(Wl)].join("");var Xl=Ul,Yl;if(Wk)Yl=aa.atob(Xl);else{Xk();for(var Zl=Vk,$l=[],am=0;am<Xl.length;){var bm=Zl[Xl.charAt(am++)],cm=am<Xl.length?Zl[Xl.charAt(am)]:0;++am;var dm=am<Xl.length?Zl[Xl.charAt(am)]:
64;++am;var em=am<Xl.length?Zl[Xl.charAt(am)]:64;++am;if(null==bm||null==cm||null==dm||null==em)throw Error();$l.push(bm<<2|cm>>4);64!=dm&&($l.push(cm<<4&240|dm>>2),64!=em&&$l.push(dm<<6&192|em))}if(8192>=$l.length)Yl=String.fromCharCode.apply(null,$l);else{for(var fm="",gm=0;gm<$l.length;gm+=8192)fm+=String.fromCharCode.apply(null,ma($l,gm,gm+8192));Yl=fm}}var hm=Yl;if("string"!==typeof hm)throw Error("Cannot read from non-string object.");Tl=bl(new $k(hm,[],-1),!1,null)}catch(im){if(im instanceof
Exception)Tl=null;else throw im;}Yj=q(Tl)?Tl:new p(null,2,[Zh,"",Dh,Jh],null);if("undefined"===typeof Zj)var Zj=Hj(null);function Nk(b){return Kj(Zj,b)}if("undefined"===typeof Mj)var Mj=Wj();if("undefined"===typeof jm){var bk;bk=Lj(function(b){return Mk(b)});var jm;jm=ak()};