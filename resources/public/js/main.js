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
function m(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function da(a){return"array"==m(a)}function ea(a){var b=m(a);return"array"==b||"object"==b&&"number"==typeof a.length}function fa(a){return"string"==typeof a}function ga(a){return"function"==m(a)}var ha="closure_uid_"+(1E9*Math.random()>>>0),ia=0;function ja(a,b,c){return a.call.apply(a.bind,arguments)}
function ka(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function la(a,b,c){la=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ja:ka;return la.apply(null,arguments)}var ma=Date.now||function(){return+new Date};
function na(a,b){function c(){}c.prototype=b.prototype;a.Ce=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Yc=function(a,c,f){for(var h=Array(arguments.length-2),k=2;k<arguments.length;k++)h[k-2]=arguments[k];return b.prototype[c].apply(a,h)}};function oa(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var pa=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function qa(a,b){return a<b?-1:a>b?1:0};function ra(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function sa(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return!0;return!1}function ta(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function ua(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}var va="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function wa(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<va.length;f++)c=va[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}function xa(a){var b=arguments.length;if(1==b&&da(arguments[0]))return xa.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};function ya(a,b){null!=a&&this.append.apply(this,arguments)}g=ya.prototype;g.Nb="";g.set=function(a){this.Nb=""+a};g.append=function(a,b,c){this.Nb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Nb+=arguments[d];return this};g.clear=function(){this.Nb=""};g.toString=function(){return this.Nb};function Aa(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Aa);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}na(Aa,Error);Aa.prototype.name="CustomError";function Ba(a,b){b.unshift(a);Aa.call(this,oa.apply(null,b));b.shift()}na(Ba,Aa);Ba.prototype.name="AssertionError";function Ca(a,b){throw new Ba("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Da=Array.prototype,Ea=Da.indexOf?function(a,b,c){return Da.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(fa(a))return fa(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Fa=Da.forEach?function(a,b,c){Da.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=fa(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};
function Ga(a){var b;a:{b=Ha;for(var c=a.length,d=fa(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:fa(a)?a.charAt(b):a[b]}function Ia(a,b,c){return 2>=arguments.length?Da.slice.call(a,b):Da.slice.call(a,b,c)}function Ja(a,b){a.sort(b||Ka)}function Ma(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||Ka;Ja(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}
function Ka(a,b){return a>b?1:a<b?-1:0};var Na={},Oa;if("undefined"===typeof Pa)var Pa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Qa)var Qa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Ra=null;if("undefined"===typeof Sa)var Sa=null;function Ta(){return new q(null,5,[Ua,!0,Va,!0,Wa,!1,Xa,!1,Ya,null],null)}$a;function r(a){return null!=a&&!1!==a}db;t;function eb(a){return null==a}function fb(a){return a instanceof Array}
function gb(a){return null==a?!0:!1===a?!0:!1}function u(a,b){return a[m(null==b?null:b)]?!0:a._?!0:!1}function ib(a){return null==a?null:a.constructor}function v(a,b){var c=ib(b),c=r(r(c)?c.Jc:c)?c.ac:m(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function jb(a){var b=a.ac;return r(b)?b:""+w(a)}var kb="undefined"!==typeof Symbol&&"function"===m(Symbol)?Symbol.iterator:"@@iterator";
function mb(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}z;nb;var $a=function $a(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $a.g(arguments[0]);case 2:return $a.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};$a.g=function(a){return $a.a(null,a)};
$a.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return nb.h?nb.h(c,d,b):nb.call(null,c,d,b)};$a.I=2;function ob(){}function pb(){}var qb=function qb(b){if(null!=b&&null!=b.sa)return b.sa(b);var c=qb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=qb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("ICloneable.-clone",b);};function rb(){}
var sb=function sb(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=sb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=sb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("ICounted.-count",b);},tb=function tb(b){if(null!=b&&null!=b.ma)return b.ma(b);var c=tb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=tb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IEmptyableCollection.-empty",b);};function ub(){}
var vb=function vb(b,c){if(null!=b&&null!=b.V)return b.V(b,c);var d=vb[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=vb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("ICollection.-conj",b);};function wb(){}
var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return A.a(arguments[0],arguments[1]);case 3:return A.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
A.a=function(a,b){if(null!=a&&null!=a.ba)return a.ba(a,b);var c=A[m(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=A._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw v("IIndexed.-nth",a);};A.h=function(a,b,c){if(null!=a&&null!=a.Ma)return a.Ma(a,b,c);var d=A[m(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=A._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw v("IIndexed.-nth",a);};A.I=3;function xb(){}
var yb=function yb(b){if(null!=b&&null!=b.qa)return b.qa(b);var c=yb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=yb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("ISeq.-first",b);},zb=function zb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=zb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=zb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("ISeq.-rest",b);};function Ab(){}function Bb(){}
var Cb=function Cb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Cb.a(arguments[0],arguments[1]);case 3:return Cb.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
Cb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=Cb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Cb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw v("ILookup.-lookup",a);};Cb.h=function(a,b,c){if(null!=a&&null!=a.M)return a.M(a,b,c);var d=Cb[m(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=Cb._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw v("ILookup.-lookup",a);};Cb.I=3;
var Db=function Db(b,c){if(null!=b&&null!=b.bd)return b.bd(b,c);var d=Db[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IAssociative.-contains-key?",b);},Eb=function Eb(b,c,d){if(null!=b&&null!=b.Ha)return b.Ha(b,c,d);var e=Eb[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Eb._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("IAssociative.-assoc",b);};function Fb(){}
var Gb=function Gb(b,c){if(null!=b&&null!=b.Ua)return b.Ua(b,c);var d=Gb[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Gb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IMap.-dissoc",b);};function Ib(){}
var Jb=function Jb(b){if(null!=b&&null!=b.Gc)return b.Gc(b);var c=Jb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Jb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IMapEntry.-key",b);},Kb=function Kb(b){if(null!=b&&null!=b.Hc)return b.Hc(b);var c=Kb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Kb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IMapEntry.-val",b);};function Lb(){}
var Nb=function Nb(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=Nb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Nb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IStack.-peek",b);},Ob=function Ob(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=Ob[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ob._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IStack.-pop",b);};function Pb(){}
var Qb=function Qb(b,c,d){if(null!=b&&null!=b.$b)return b.$b(b,c,d);var e=Qb[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Qb._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("IVector.-assoc-n",b);},Rb=function Rb(b){if(null!=b&&null!=b.Fc)return b.Fc(b);var c=Rb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Rb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IDeref.-deref",b);};function Sb(){}
var Tb=function Tb(b){if(null!=b&&null!=b.R)return b.R(b);var c=Tb[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Tb._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IMeta.-meta",b);};function Ub(){}var Vb=function Vb(b,c){if(null!=b&&null!=b.S)return b.S(b,c);var d=Vb[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Vb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IWithMeta.-with-meta",b);};function Wb(){}
var Yb=function Yb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Yb.a(arguments[0],arguments[1]);case 3:return Yb.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
Yb.a=function(a,b){if(null!=a&&null!=a.va)return a.va(a,b);var c=Yb[m(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Yb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw v("IReduce.-reduce",a);};Yb.h=function(a,b,c){if(null!=a&&null!=a.wa)return a.wa(a,b,c);var d=Yb[m(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=Yb._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw v("IReduce.-reduce",a);};Yb.I=3;
var Zb=function Zb(b,c,d){if(null!=b&&null!=b.oc)return b.oc(b,c,d);var e=Zb[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Zb._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("IKVReduce.-kv-reduce",b);},$b=function $b(b,c){if(null!=b&&null!=b.F)return b.F(b,c);var d=$b[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=$b._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IEquiv.-equiv",b);},ac=function ac(b){if(null!=b&&null!=b.P)return b.P(b);
var c=ac[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=ac._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IHash.-hash",b);};function bc(){}var cc=function cc(b){if(null!=b&&null!=b.U)return b.U(b);var c=cc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=cc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("ISeqable.-seq",b);};function dc(){}function ec(){}function fc(){}
var gc=function gc(b){if(null!=b&&null!=b.pc)return b.pc(b);var c=gc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=gc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IReversible.-rseq",b);},hc=function hc(b,c){if(null!=b&&null!=b.ie)return b.ie(0,c);var d=hc[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=hc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IWriter.-write",b);},ic=function ic(b,c,d){if(null!=b&&null!=b.O)return b.O(b,c,d);var e=
ic[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=ic._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("IPrintWithWriter.-pr-writer",b);},jc=function jc(b,c,d){if(null!=b&&null!=b.he)return b.he(0,c,d);var e=jc[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=jc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("IWatchable.-notify-watches",b);},kc=function kc(b){if(null!=b&&null!=b.nc)return b.nc(b);var c=kc[m(null==b?null:
b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=kc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IEditableCollection.-as-transient",b);},lc=function lc(b,c){if(null!=b&&null!=b.Zb)return b.Zb(b,c);var d=lc[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=lc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("ITransientCollection.-conj!",b);},mc=function mc(b){if(null!=b&&null!=b.qc)return b.qc(b);var c=mc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,
b);c=mc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("ITransientCollection.-persistent!",b);},oc=function oc(b,c,d){if(null!=b&&null!=b.Ic)return b.Ic(b,c,d);var e=oc[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=oc._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("ITransientAssociative.-assoc!",b);},pc=function pc(b,c,d){if(null!=b&&null!=b.ge)return b.ge(0,c,d);var e=pc[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=pc._;
if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("ITransientVector.-assoc-n!",b);};function qc(){}
var rc=function rc(b,c){if(null!=b&&null!=b.sb)return b.sb(b,c);var d=rc[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=rc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IComparable.-compare",b);},sc=function sc(b){if(null!=b&&null!=b.ee)return b.ee();var c=sc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=sc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IChunk.-drop-first",b);},tc=function tc(b){if(null!=b&&null!=b.Hd)return b.Hd(b);var c=
tc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=tc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IChunkedSeq.-chunked-first",b);},uc=function uc(b){if(null!=b&&null!=b.Id)return b.Id(b);var c=uc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=uc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IChunkedSeq.-chunked-rest",b);},vc=function vc(b){if(null!=b&&null!=b.Gd)return b.Gd(b);var c=vc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,
b);c=vc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IChunkedNext.-chunked-next",b);},xc=function xc(b,c){if(null!=b&&null!=b.We)return b.We(b,c);var d=xc[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=xc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IReset.-reset!",b);},yc=function yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return yc.a(arguments[0],arguments[1]);case 3:return yc.h(arguments[0],
arguments[1],arguments[2]);case 4:return yc.K(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return yc.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};yc.a=function(a,b){if(null!=a&&null!=a.Ye)return a.Ye(a,b);var c=yc[m(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=yc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw v("ISwap.-swap!",a);};
yc.h=function(a,b,c){if(null!=a&&null!=a.Ze)return a.Ze(a,b,c);var d=yc[m(null==a?null:a)];if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);d=yc._;if(null!=d)return d.h?d.h(a,b,c):d.call(null,a,b,c);throw v("ISwap.-swap!",a);};yc.K=function(a,b,c,d){if(null!=a&&null!=a.$e)return a.$e(a,b,c,d);var e=yc[m(null==a?null:a)];if(null!=e)return e.K?e.K(a,b,c,d):e.call(null,a,b,c,d);e=yc._;if(null!=e)return e.K?e.K(a,b,c,d):e.call(null,a,b,c,d);throw v("ISwap.-swap!",a);};
yc.ca=function(a,b,c,d,e){if(null!=a&&null!=a.af)return a.af(a,b,c,d,e);var f=yc[m(null==a?null:a)];if(null!=f)return f.ca?f.ca(a,b,c,d,e):f.call(null,a,b,c,d,e);f=yc._;if(null!=f)return f.ca?f.ca(a,b,c,d,e):f.call(null,a,b,c,d,e);throw v("ISwap.-swap!",a);};yc.I=5;var zc=function zc(b){if(null!=b&&null!=b.Aa)return b.Aa(b);var c=zc[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=zc._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IIterable.-iterator",b);};
function Ac(a){this.pf=a;this.o=1073741824;this.J=0}Ac.prototype.ie=function(a,b){return this.pf.append(b)};function Bc(a){var b=new ya;a.O(null,new Ac(b),Ta());return""+w(b)}var Cc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Dc(a){a=Cc(a|0,-862048943);return Cc(a<<15|a>>>-15,461845907)}
function Ec(a,b){var c=(a|0)^(b|0);return Cc(c<<13|c>>>-13,5)+-430675100|0}function Fc(a,b){var c=(a|0)^b,c=Cc(c^c>>>16,-2048144789),c=Cc(c^c>>>13,-1028477387);return c^c>>>16}function Gc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Ec(c,Dc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Dc(a.charCodeAt(a.length-1)):b;return Fc(b,Cc(2,a.length))}Hc;Ic;Jc;Kc;var Lc={},Mc=0;
function Nc(a){if(null!=a){var b=a.length;if(0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Cc(31,d)+a.charCodeAt(c),c=e;else return d;else return 0}else return 0}function Qc(a){255<Mc&&(Lc={},Mc=0);var b=Lc[a];"number"!==typeof b&&(b=Nc(a),Lc[a]=b,Mc+=1);return a=b}
function Rc(a){null!=a&&(a.o&4194304||a.Jd)?a=a.P(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=Qc(a),0!==a&&(a=Dc(a),a=Ec(0,a),a=Fc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:ac(a);return a}function Sc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function db(a,b){return b instanceof a}
function Tc(a,b){if(a.Ka===b.Ka)return 0;var c=gb(a.Ja);if(r(c?b.Ja:c))return-1;if(r(a.Ja)){if(gb(b.Ja))return 1;c=Ka(a.Ja,b.Ja);return 0===c?Ka(a.name,b.name):c}return Ka(a.name,b.name)}D;function Ic(a,b,c,d,e){this.Ja=a;this.name=b;this.Ka=c;this.jc=d;this.La=e;this.o=2154168321;this.J=4096}g=Ic.prototype;g.toString=function(){return this.Ka};g.equiv=function(a){return this.F(null,a)};g.F=function(a,b){return b instanceof Ic?this.Ka===b.Ka:!1};
g.call=function(){function a(a,b,c){return D.h?D.h(b,this,c):D.call(null,b,this,c)}function b(a,b){return D.a?D.a(b,this):D.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.h=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return D.a?D.a(a,this):D.call(null,a,this)};
g.a=function(a,b){return D.h?D.h(a,this,b):D.call(null,a,this,b)};g.R=function(){return this.La};g.S=function(a,b){return new Ic(this.Ja,this.name,this.Ka,this.jc,b)};g.P=function(){var a=this.jc;return null!=a?a:this.jc=a=Sc(Gc(this.name),Qc(this.Ja))};g.O=function(a,b){return hc(b,this.Ka)};
var Uc=function Uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Uc.g(arguments[0]);case 2:return Uc.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};Uc.g=function(a){if(a instanceof Ic)return a;var b=a.indexOf("/");return-1===b?Uc.a(null,a):Uc.a(a.substring(0,b),a.substring(b+1,a.length))};Uc.a=function(a,b){var c=null!=a?[w(a),w("/"),w(b)].join(""):b;return new Ic(a,b,c,null,null)};
Uc.I=2;F;Vc;G;function H(a){if(null==a)return null;if(null!=a&&(a.o&8388608||a.Xe))return a.U(null);if(fb(a)||"string"===typeof a)return 0===a.length?null:new G(a,0);if(u(bc,a))return cc(a);throw Error([w(a),w(" is not ISeqable")].join(""));}function I(a){if(null==a)return null;if(null!=a&&(a.o&64||a.na))return a.qa(null);a=H(a);return null==a?null:yb(a)}function Wc(a){return null!=a?null!=a&&(a.o&64||a.na)?a.xa(null):(a=H(a))?zb(a):J:J}
function L(a){return null==a?null:null!=a&&(a.o&128||a.dd)?a.Ga(null):H(Wc(a))}var Jc=function Jc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jc.g(arguments[0]);case 2:return Jc.a(arguments[0],arguments[1]);default:return Jc.v(arguments[0],arguments[1],new G(c.slice(2),0))}};Jc.g=function(){return!0};Jc.a=function(a,b){return null==a?null==b:a===b||$b(a,b)};
Jc.v=function(a,b,c){for(;;)if(Jc.a(a,b))if(L(c))a=b,b=I(c),c=L(c);else return Jc.a(b,I(c));else return!1};Jc.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return Jc.v(b,a,c)};Jc.I=2;function Xc(a){this.T=a}Xc.prototype.next=function(){if(null!=this.T){var a=I(this.T);this.T=L(this.T);return{value:a,done:!1}}return{value:null,done:!0}};function Yc(a){return new Xc(H(a))}Zc;function $c(a,b,c){this.value=a;this.vc=b;this.yd=c;this.o=8388672;this.J=0}$c.prototype.U=function(){return this};
$c.prototype.qa=function(){return this.value};$c.prototype.xa=function(){null==this.yd&&(this.yd=Zc.g?Zc.g(this.vc):Zc.call(null,this.vc));return this.yd};function Zc(a){var b=a.next();return r(b.done)?J:new $c(b.value,a,null)}function ad(a,b){var c=Dc(a),c=Ec(0,c);return Fc(c,b)}function bd(a){var b=0,c=1;for(a=H(a);;)if(null!=a)b+=1,c=Cc(31,c)+Rc(I(a))|0,a=L(a);else return ad(c,b)}var cd=ad(1,0);function dd(a){var b=0,c=0;for(a=H(a);;)if(null!=a)b+=1,c=c+Rc(I(a))|0,a=L(a);else return ad(c,b)}
var ed=ad(0,0);gd;Hc;hd;rb["null"]=!0;sb["null"]=function(){return 0};Date.prototype.F=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Yb=!0;Date.prototype.sb=function(a,b){if(b instanceof Date)return Ka(this.valueOf(),b.valueOf());throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};$b.number=function(a,b){return a===b};id;ob["function"]=!0;Sb["function"]=!0;Tb["function"]=function(){return null};ac._=function(a){return a[ha]||(a[ha]=++ia)};M;
function jd(a){this.D=a;this.o=32768;this.J=0}jd.prototype.Fc=function(){return this.D};function kd(a){return a instanceof jd}function M(a){return Rb(a)}function ld(a,b){var c=sb(a);if(0===c)return b.G?b.G():b.call(null);for(var d=A.a(a,0),e=1;;)if(e<c){var f=A.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(kd(d))return Rb(d);e+=1}else return d}function md(a,b,c){var d=sb(a),e=c;for(c=0;;)if(c<d){var f=A.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(kd(e))return Rb(e);c+=1}else return e}
function nd(a,b){var c=a.length;if(0===a.length)return b.G?b.G():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(kd(d))return Rb(d);e+=1}else return d}function od(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(kd(e))return Rb(e);c+=1}else return e}function pd(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(kd(c))return Rb(c);d+=1}else return c}qd;O;rd;sd;
function td(a){return null!=a?a.o&2||a.Le?!0:a.o?!1:u(rb,a):u(rb,a)}function ud(a){return null!=a?a.o&16||a.fe?!0:a.o?!1:u(wb,a):u(wb,a)}function vd(a,b){this.j=a;this.C=b}vd.prototype.za=function(){return this.C<this.j.length};vd.prototype.next=function(){var a=this.j[this.C];this.C+=1;return a};function G(a,b){this.j=a;this.C=b;this.o=166199550;this.J=8192}g=G.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};
g.ba=function(a,b){var c=b+this.C;return c<this.j.length?this.j[c]:null};g.Ma=function(a,b,c){a=b+this.C;return a<this.j.length?this.j[a]:c};g.Aa=function(){return new vd(this.j,this.C)};g.sa=function(){return new G(this.j,this.C)};g.Ga=function(){return this.C+1<this.j.length?new G(this.j,this.C+1):null};g.Y=function(){var a=this.j.length-this.C;return 0>a?0:a};g.pc=function(){var a=sb(this);return 0<a?new rd(this,a-1,null):null};g.P=function(){return bd(this)};
g.F=function(a,b){return hd.a?hd.a(this,b):hd.call(null,this,b)};g.ma=function(){return J};g.va=function(a,b){return pd(this.j,b,this.j[this.C],this.C+1)};g.wa=function(a,b,c){return pd(this.j,b,c,this.C)};g.qa=function(){return this.j[this.C]};g.xa=function(){return this.C+1<this.j.length?new G(this.j,this.C+1):J};g.U=function(){return this.C<this.j.length?this:null};g.V=function(a,b){return O.a?O.a(b,this):O.call(null,b,this)};G.prototype[kb]=function(){return Yc(this)};
var Vc=function Vc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Vc.g(arguments[0]);case 2:return Vc.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};Vc.g=function(a){return Vc.a(a,0)};Vc.a=function(a,b){return b<a.length?new G(a,b):null};Vc.I=2;
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return F.g(arguments[0]);case 2:return F.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};F.g=function(a){return Vc.a(a,0)};F.a=function(a,b){return Vc.a(a,b)};F.I=2;id;wd;function rd(a,b,c){this.Ec=a;this.C=b;this.A=c;this.o=32374990;this.J=8192}g=rd.prototype;g.toString=function(){return Bc(this)};
g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};g.sa=function(){return new rd(this.Ec,this.C,this.A)};g.Ga=function(){return 0<this.C?new rd(this.Ec,this.C-1,null):null};g.Y=function(){return this.C+1};g.P=function(){return bd(this)};g.F=function(a,b){return hd.a?hd.a(this,b):hd.call(null,this,b)};g.ma=function(){var a=J,b=this.A;return id.a?id.a(a,b):id.call(null,a,b)};g.va=function(a,b){return wd.a?wd.a(b,this):wd.call(null,b,this)};
g.wa=function(a,b,c){return wd.h?wd.h(b,c,this):wd.call(null,b,c,this)};g.qa=function(){return A.a(this.Ec,this.C)};g.xa=function(){return 0<this.C?new rd(this.Ec,this.C-1,null):J};g.U=function(){return this};g.S=function(a,b){return new rd(this.Ec,this.C,b)};g.V=function(a,b){return O.a?O.a(b,this):O.call(null,b,this)};rd.prototype[kb]=function(){return Yc(this)};function xd(a){return I(L(a))}function yd(a){for(;;){var b=L(a);if(null!=b)a=b;else return I(a)}}$b._=function(a,b){return a===b};
var zd=function zd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return zd.G();case 1:return zd.g(arguments[0]);case 2:return zd.a(arguments[0],arguments[1]);default:return zd.v(arguments[0],arguments[1],new G(c.slice(2),0))}};zd.G=function(){return Ad};zd.g=function(a){return a};zd.a=function(a,b){return null!=a?vb(a,b):vb(J,b)};zd.v=function(a,b,c){for(;;)if(r(c))a=zd.a(a,b),b=I(c),c=L(c);else return zd.a(a,b)};
zd.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return zd.v(b,a,c)};zd.I=2;function Q(a){if(null!=a)if(null!=a&&(a.o&2||a.Le))a=a.Y(null);else if(fb(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.o&8388608||a.Xe))a:{a=H(a);for(var b=0;;){if(td(a)){a=b+sb(a);break a}a=L(a);b+=1}}else a=sb(a);else a=0;return a}function Bd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return H(a)?I(a):c;if(ud(a))return A.h(a,b,c);if(H(a)){var d=L(a),e=b-1;a=d;b=e}else return c}}
function Cd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.o&16||a.fe))return a.ba(null,b);if(fb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.o&64||a.na)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(H(c)){c=I(c);break a}throw Error("Index out of bounds");}if(ud(c)){c=A.a(c,d);break a}if(H(c))c=L(c),--d;else throw Error("Index out of bounds");
}}return c}if(u(wb,a))return A.a(a,b);throw Error([w("nth not supported on this type "),w(jb(ib(a)))].join(""));}
function R(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.o&16||a.fe))return a.Ma(null,b,null);if(fb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.o&64||a.na))return Bd(a,b);if(u(wb,a))return A.a(a,b);throw Error([w("nth not supported on this type "),w(jb(ib(a)))].join(""));}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.a(arguments[0],arguments[1]);case 3:return D.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};D.a=function(a,b){return null==a?null:null!=a&&(a.o&256||a.Qe)?a.N(null,b):fb(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:u(Bb,a)?Cb.a(a,b):null};
D.h=function(a,b,c){return null!=a?null!=a&&(a.o&256||a.Qe)?a.M(null,b,c):fb(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:u(Bb,a)?Cb.h(a,b,c):c:c};D.I=3;Dd;var Ed=function Ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ed.h(arguments[0],arguments[1],arguments[2]);default:return Ed.v(arguments[0],arguments[1],arguments[2],new G(c.slice(3),0))}};Ed.h=function(a,b,c){return null!=a?Eb(a,b,c):Fd([b],[c])};
Ed.v=function(a,b,c,d){for(;;)if(a=Ed.h(a,b,c),r(d))b=I(d),c=xd(d),d=L(L(d));else return a};Ed.L=function(a){var b=I(a),c=L(a);a=I(c);var d=L(c),c=I(d),d=L(d);return Ed.v(b,a,c,d)};Ed.I=3;var Gd=function Gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gd.g(arguments[0]);case 2:return Gd.a(arguments[0],arguments[1]);default:return Gd.v(arguments[0],arguments[1],new G(c.slice(2),0))}};Gd.g=function(a){return a};
Gd.a=function(a,b){return null==a?null:Gb(a,b)};Gd.v=function(a,b,c){for(;;){if(null==a)return null;a=Gd.a(a,b);if(r(c))b=I(c),c=L(c);else return a}};Gd.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return Gd.v(b,a,c)};Gd.I=2;function Hd(a){var b=ga(a);return b?b:null!=a?a.Ke?!0:a.Md?!1:u(ob,a):u(ob,a)}function Id(a,b){this.s=a;this.A=b;this.o=393217;this.J=0}g=Id.prototype;g.R=function(){return this.A};g.S=function(a,b){return new Id(this.s,b)};g.Ke=!0;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z,za,cb){a=this;return z.cd?z.cd(a.s,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z,za,cb):z.call(null,a.s,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z,za,cb)}function b(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z,za){a=this;return a.s.Db?a.s.Db(b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z,za):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z,za)}function c(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z){a=this;return a.s.Cb?a.s.Cb(b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,
E,P,N,Z):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N,Z)}function d(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N){a=this;return a.s.Bb?a.s.Bb(b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P,N)}function e(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P){a=this;return a.s.Ab?a.s.Ab(b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E,P)}function f(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E){a=this;return a.s.zb?a.s.zb(b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E):a.s.call(null,
b,c,d,e,f,h,k,l,n,p,y,x,B,C,K,E)}function h(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K){a=this;return a.s.yb?a.s.yb(b,c,d,e,f,h,k,l,n,p,y,x,B,C,K):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B,C,K)}function k(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C){a=this;return a.s.xb?a.s.xb(b,c,d,e,f,h,k,l,n,p,y,x,B,C):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B,C)}function l(a,b,c,d,e,f,h,k,l,n,p,y,x,B){a=this;return a.s.wb?a.s.wb(b,c,d,e,f,h,k,l,n,p,y,x,B):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x,B)}function n(a,b,c,d,e,f,h,k,l,n,p,y,x){a=this;
return a.s.vb?a.s.vb(b,c,d,e,f,h,k,l,n,p,y,x):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y,x)}function p(a,b,c,d,e,f,h,k,l,n,p,y){a=this;return a.s.ub?a.s.ub(b,c,d,e,f,h,k,l,n,p,y):a.s.call(null,b,c,d,e,f,h,k,l,n,p,y)}function y(a,b,c,d,e,f,h,k,l,n,p){a=this;return a.s.tb?a.s.tb(b,c,d,e,f,h,k,l,n,p):a.s.call(null,b,c,d,e,f,h,k,l,n,p)}function x(a,b,c,d,e,f,h,k,l,n){a=this;return a.s.Fb?a.s.Fb(b,c,d,e,f,h,k,l,n):a.s.call(null,b,c,d,e,f,h,k,l,n)}function B(a,b,c,d,e,f,h,k,l){a=this;return a.s.Eb?a.s.Eb(b,c,
d,e,f,h,k,l):a.s.call(null,b,c,d,e,f,h,k,l)}function C(a,b,c,d,e,f,h,k){a=this;return a.s.Ta?a.s.Ta(b,c,d,e,f,h,k):a.s.call(null,b,c,d,e,f,h,k)}function E(a,b,c,d,e,f,h){a=this;return a.s.Sa?a.s.Sa(b,c,d,e,f,h):a.s.call(null,b,c,d,e,f,h)}function K(a,b,c,d,e,f){a=this;return a.s.ca?a.s.ca(b,c,d,e,f):a.s.call(null,b,c,d,e,f)}function P(a,b,c,d,e){a=this;return a.s.K?a.s.K(b,c,d,e):a.s.call(null,b,c,d,e)}function Z(a,b,c,d){a=this;return a.s.h?a.s.h(b,c,d):a.s.call(null,b,c,d)}function za(a,b,c){a=
this;return a.s.a?a.s.a(b,c):a.s.call(null,b,c)}function cb(a,b){a=this;return a.s.g?a.s.g(b):a.s.call(null,b)}function Pc(a){a=this;return a.s.G?a.s.G():a.s.call(null)}var N=null,N=function(N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je,Se,Mf,ih,sj,am,tp){switch(arguments.length){case 1:return Pc.call(this,N);case 2:return cb.call(this,N,Za);case 3:return za.call(this,N,Za,ab);case 4:return Z.call(this,N,Za,ab,hb);case 5:return P.call(this,N,Za,ab,hb,lb);case 6:return K.call(this,N,Za,ab,hb,lb,bb);
case 7:return E.call(this,N,Za,ab,hb,lb,bb,La);case 8:return C.call(this,N,Za,ab,hb,lb,bb,La,Hb);case 9:return B.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb);case 10:return x.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb);case 11:return y.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc);case 12:return p.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc);case 13:return n.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc);case 14:return l.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd);case 15:return k.call(this,N,Za,ab,hb,
lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md);case 16:return h.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je);case 17:return f.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je,Se);case 18:return e.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je,Se,Mf);case 19:return d.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je,Se,Mf,ih);case 20:return c.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je,Se,Mf,ih,sj);case 21:return b.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,
Oc,fd,Md,je,Se,Mf,ih,sj,am);case 22:return a.call(this,N,Za,ab,hb,lb,bb,La,Hb,Mb,Xb,nc,wc,Oc,fd,Md,je,Se,Mf,ih,sj,am,tp)}throw Error("Invalid arity: "+arguments.length);};N.g=Pc;N.a=cb;N.h=za;N.K=Z;N.ca=P;N.Sa=K;N.Ta=E;N.Eb=C;N.Fb=B;N.tb=x;N.ub=y;N.vb=p;N.wb=n;N.xb=l;N.yb=k;N.zb=h;N.Ab=f;N.Bb=e;N.Cb=d;N.Db=c;N.Pe=b;N.cd=a;return N}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.G=function(){return this.s.G?this.s.G():this.s.call(null)};
g.g=function(a){return this.s.g?this.s.g(a):this.s.call(null,a)};g.a=function(a,b){return this.s.a?this.s.a(a,b):this.s.call(null,a,b)};g.h=function(a,b,c){return this.s.h?this.s.h(a,b,c):this.s.call(null,a,b,c)};g.K=function(a,b,c,d){return this.s.K?this.s.K(a,b,c,d):this.s.call(null,a,b,c,d)};g.ca=function(a,b,c,d,e){return this.s.ca?this.s.ca(a,b,c,d,e):this.s.call(null,a,b,c,d,e)};g.Sa=function(a,b,c,d,e,f){return this.s.Sa?this.s.Sa(a,b,c,d,e,f):this.s.call(null,a,b,c,d,e,f)};
g.Ta=function(a,b,c,d,e,f,h){return this.s.Ta?this.s.Ta(a,b,c,d,e,f,h):this.s.call(null,a,b,c,d,e,f,h)};g.Eb=function(a,b,c,d,e,f,h,k){return this.s.Eb?this.s.Eb(a,b,c,d,e,f,h,k):this.s.call(null,a,b,c,d,e,f,h,k)};g.Fb=function(a,b,c,d,e,f,h,k,l){return this.s.Fb?this.s.Fb(a,b,c,d,e,f,h,k,l):this.s.call(null,a,b,c,d,e,f,h,k,l)};g.tb=function(a,b,c,d,e,f,h,k,l,n){return this.s.tb?this.s.tb(a,b,c,d,e,f,h,k,l,n):this.s.call(null,a,b,c,d,e,f,h,k,l,n)};
g.ub=function(a,b,c,d,e,f,h,k,l,n,p){return this.s.ub?this.s.ub(a,b,c,d,e,f,h,k,l,n,p):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p)};g.vb=function(a,b,c,d,e,f,h,k,l,n,p,y){return this.s.vb?this.s.vb(a,b,c,d,e,f,h,k,l,n,p,y):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y)};g.wb=function(a,b,c,d,e,f,h,k,l,n,p,y,x){return this.s.wb?this.s.wb(a,b,c,d,e,f,h,k,l,n,p,y,x):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x)};
g.xb=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B){return this.s.xb?this.s.xb(a,b,c,d,e,f,h,k,l,n,p,y,x,B):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B)};g.yb=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C){return this.s.yb?this.s.yb(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C)};g.zb=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E){return this.s.zb?this.s.zb(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E)};
g.Ab=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K){return this.s.Ab?this.s.Ab(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K)};g.Bb=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P){return this.s.Bb?this.s.Bb(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P)};
g.Cb=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z){return this.s.Cb?this.s.Cb(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z)};g.Db=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za){return this.s.Db?this.s.Db(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za):this.s.call(null,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za)};
g.Pe=function(a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb){return z.cd?z.cd(this.s,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb):z.call(null,this.s,a,b,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb)};function id(a,b){return ga(a)?new Id(a,b):null==a?null:Vb(a,b)}function Jd(a){var b=null!=a;return(b?null!=a?a.o&131072||a.Te||(a.o?0:u(Sb,a)):u(Sb,a):b)?Tb(a):null}function Kd(a){return null==a?!1:null!=a?a.o&8||a.uf?!0:a.o?!1:u(ub,a):u(ub,a)}
function Ld(a){return null==a?!1:null!=a?a.o&4096||a.Bf?!0:a.o?!1:u(Lb,a):u(Lb,a)}function Nd(a){return null!=a?a.o&16777216||a.Af?!0:a.o?!1:u(dc,a):u(dc,a)}function Od(a){return null==a?!1:null!=a?a.o&1024||a.Re?!0:a.o?!1:u(Fb,a):u(Fb,a)}function Pd(a){return null!=a?a.o&16384||a.Cf?!0:a.o?!1:u(Pb,a):u(Pb,a)}Qd;Rd;function Sd(a){return null!=a?a.J&512||a.tf?!0:!1:!1}function Td(a){var b=[];ra(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}
function Ud(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Vd={};function Wd(a){return null==a?!1:null!=a?a.o&64||a.na?!0:a.o?!1:u(xb,a):u(xb,a)}function Xd(a){return null==a?!1:!1===a?!1:!0}function Yd(a){var b=Hd(a);return b?b:null!=a?a.o&1||a.xf?!0:a.o?!1:u(pb,a):u(pb,a)}function Zd(a,b){return D.h(a,b,Vd)===Vd?!1:!0}
function Kc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return Ka(a,b);throw Error([w("Cannot compare "),w(a),w(" to "),w(b)].join(""));}if(null!=a?a.J&2048||a.Yb||(a.J?0:u(qc,a)):u(qc,a))return rc(a,b);if("string"!==typeof a&&!fb(a)&&!0!==a&&!1!==a||ib(a)!==ib(b))throw Error([w("Cannot compare "),w(a),w(" to "),w(b)].join(""));return Ka(a,b)}
function $d(a,b){var c=Q(a),d=Q(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=Kc(Cd(a,d),Cd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function ae(a){return Jc.a(a,Kc)?Kc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:r(d)?-1:r(a.a?a.a(c,b):a.call(null,c,b))?1:0}}be;function ce(a,b){if(H(b)){var c=be.g?be.g(b):be.call(null,b),d=ae(a);Ma(c,d);return H(c)}return J}
function de(a,b){var c=Kc;return ce(function(b,e){return ae(c).call(null,a.g?a.g(b):a.call(null,b),a.g?a.g(e):a.call(null,e))},b)}var wd=function wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return wd.a(arguments[0],arguments[1]);case 3:return wd.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
wd.a=function(a,b){var c=H(b);if(c){var d=I(c),c=L(c);return nb.h?nb.h(a,d,c):nb.call(null,a,d,c)}return a.G?a.G():a.call(null)};wd.h=function(a,b,c){for(c=H(c);;)if(c){var d=I(c);b=a.a?a.a(b,d):a.call(null,b,d);if(kd(b))return Rb(b);c=L(c)}else return b};wd.I=3;ee;
var nb=function nb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return nb.a(arguments[0],arguments[1]);case 3:return nb.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};nb.a=function(a,b){return null!=b&&(b.o&524288||b.Ve)?b.va(null,a):fb(b)?nd(b,a):"string"===typeof b?nd(b,a):u(Wb,b)?Yb.a(b,a):wd.a(a,b)};
nb.h=function(a,b,c){return null!=c&&(c.o&524288||c.Ve)?c.wa(null,a,b):fb(c)?od(c,a,b):"string"===typeof c?od(c,a,b):u(Wb,c)?Yb.h(c,a,b):wd.h(a,b,c)};nb.I=3;function fe(a,b){var c=["^ "];return null!=b?Zb(b,a,c):c}function ge(a){return a}
var he=function he(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return he.G();case 1:return he.g(arguments[0]);case 2:return he.a(arguments[0],arguments[1]);default:return he.v(arguments[0],arguments[1],new G(c.slice(2),0))}};he.G=function(){return 0};he.g=function(a){return a};he.a=function(a,b){return a+b};he.v=function(a,b,c){return nb.h(he,a+b,c)};he.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return he.v(b,a,c)};he.I=2;Na.If;
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ie.g(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:return ie.v(arguments[0],arguments[1],new G(c.slice(2),0))}};ie.g=function(){return!0};ie.a=function(a,b){return a<b};ie.v=function(a,b,c){for(;;)if(a<b)if(L(c))a=b,b=I(c),c=L(c);else return b<I(c);else return!1};ie.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return ie.v(b,a,c)};ie.I=2;
var ke=function ke(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ke.g(arguments[0]);case 2:return ke.a(arguments[0],arguments[1]);default:return ke.v(arguments[0],arguments[1],new G(c.slice(2),0))}};ke.g=function(){return!0};ke.a=function(a,b){return a>b};ke.v=function(a,b,c){for(;;)if(a>b)if(L(c))a=b,b=I(c),c=L(c);else return b>I(c);else return!1};ke.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return ke.v(b,a,c)};ke.I=2;
function le(a){return a-1}var me=function me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return me.g(arguments[0]);case 2:return me.a(arguments[0],arguments[1]);default:return me.v(arguments[0],arguments[1],new G(c.slice(2),0))}};me.g=function(a){return a};me.a=function(a,b){return a>b?a:b};me.v=function(a,b,c){return nb.h(me,a>b?a:b,c)};me.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return me.v(b,a,c)};me.I=2;
var ne=function ne(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ne.g(arguments[0]);case 2:return ne.a(arguments[0],arguments[1]);default:return ne.v(arguments[0],arguments[1],new G(c.slice(2),0))}};ne.g=function(a){return a};ne.a=function(a,b){return a<b?a:b};ne.v=function(a,b,c){return nb.h(ne,a<b?a:b,c)};ne.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return ne.v(b,a,c)};ne.I=2;oe;function pe(a){return a|0}
function oe(a,b){return(a%b+b)%b}function qe(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function re(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function se(a){return 0<a}function te(a){var b=2;for(a=H(a);;)if(a&&0<b)--b,a=L(a);else return a}
var w=function w(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return w.G();case 1:return w.g(arguments[0]);default:return w.v(arguments[0],new G(c.slice(1),0))}};w.G=function(){return""};w.g=function(a){return null==a?"":""+a};w.v=function(a,b){for(var c=new ya(""+w(a)),d=b;;)if(r(d))c=c.append(""+w(I(d))),d=L(d);else return c.toString()};w.L=function(a){var b=I(a);a=L(a);return w.v(b,a)};w.I=1;S;ue;
function hd(a,b){var c;if(Nd(b))if(td(a)&&td(b)&&Q(a)!==Q(b))c=!1;else a:{c=H(a);for(var d=H(b);;){if(null==c){c=null==d;break a}if(null!=d&&Jc.a(I(c),I(d)))c=L(c),d=L(d);else{c=!1;break a}}}else c=null;return Xd(c)}function qd(a){if(H(a)){var b=Rc(I(a));for(a=L(a);;){if(null==a)return b;b=Sc(b,Rc(I(a)));a=L(a)}}else return 0}ve;we;function xe(a){var b=0;for(a=H(a);;)if(a){var c=I(a),b=(b+(Rc(ve.g?ve.g(c):ve.call(null,c))^Rc(we.g?we.g(c):we.call(null,c))))%4503599627370496;a=L(a)}else return b}ue;
ye;ze;function sd(a,b,c,d,e){this.A=a;this.first=b;this.Fa=c;this.count=d;this.l=e;this.o=65937646;this.J=8192}g=sd.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};g.sa=function(){return new sd(this.A,this.first,this.Fa,this.count,this.l)};g.Ga=function(){return 1===this.count?null:this.Fa};g.Y=function(){return this.count};g.Ob=function(){return this.first};g.Pb=function(){return zb(this)};
g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return Vb(J,this.A)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return this.first};g.xa=function(){return 1===this.count?J:this.Fa};g.U=function(){return this};g.S=function(a,b){return new sd(b,this.first,this.Fa,this.count,this.l)};g.V=function(a,b){return new sd(this.A,b,this,this.count+1,null)};sd.prototype[kb]=function(){return Yc(this)};
function Ae(a){this.A=a;this.o=65937614;this.J=8192}g=Ae.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};g.sa=function(){return new Ae(this.A)};g.Ga=function(){return null};g.Y=function(){return 0};g.Ob=function(){return null};g.Pb=function(){throw Error("Can't pop empty list");};g.P=function(){return cd};g.F=function(a,b){return(null!=b?b.o&33554432||b.yf||(b.o?0:u(ec,b)):u(ec,b))||Nd(b)?null==H(b):!1};g.ma=function(){return this};
g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return null};g.xa=function(){return J};g.U=function(){return null};g.S=function(a,b){return new Ae(b)};g.V=function(a,b){return new sd(this.A,b,null,1,null)};var J=new Ae(null);Ae.prototype[kb]=function(){return Yc(this)};function Be(a){return(null!=a?a.o&134217728||a.zf||(a.o?0:u(fc,a)):u(fc,a))?gc(a):nb.h(zd,J,a)}
var Hc=function Hc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Hc.v(0<c.length?new G(c.slice(0),0):null)};Hc.v=function(a){var b;if(a instanceof G&&0===a.C)b=a.j;else a:for(b=[];;)if(null!=a)b.push(a.qa(null)),a=a.Ga(null);else break a;a=b.length;for(var c=J;;)if(0<a){var d=a-1,c=c.V(null,b[a-1]);a=d}else return c};Hc.I=0;Hc.L=function(a){return Hc.v(H(a))};function Ce(a,b,c,d){this.A=a;this.first=b;this.Fa=c;this.l=d;this.o=65929452;this.J=8192}g=Ce.prototype;
g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};g.sa=function(){return new Ce(this.A,this.first,this.Fa,this.l)};g.Ga=function(){return null==this.Fa?null:H(this.Fa)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return this.first};
g.xa=function(){return null==this.Fa?J:this.Fa};g.U=function(){return this};g.S=function(a,b){return new Ce(b,this.first,this.Fa,this.l)};g.V=function(a,b){return new Ce(null,b,this,this.l)};Ce.prototype[kb]=function(){return Yc(this)};function O(a,b){var c=null==b;return(c?c:null!=b&&(b.o&64||b.na))?new Ce(null,a,b,null):new Ce(null,a,H(b),null)}
function De(a,b){if(a.Ba===b.Ba)return 0;var c=gb(a.Ja);if(r(c?b.Ja:c))return-1;if(r(a.Ja)){if(gb(b.Ja))return 1;c=Ka(a.Ja,b.Ja);return 0===c?Ka(a.name,b.name):c}return Ka(a.name,b.name)}function t(a,b,c,d){this.Ja=a;this.name=b;this.Ba=c;this.jc=d;this.o=2153775105;this.J=4096}g=t.prototype;g.toString=function(){return[w(":"),w(this.Ba)].join("")};g.equiv=function(a){return this.F(null,a)};g.F=function(a,b){return b instanceof t?this.Ba===b.Ba:!1};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return D.a(c,this);case 3:return D.h(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return D.a(c,this)};a.h=function(a,c,d){return D.h(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return D.a(a,this)};g.a=function(a,b){return D.h(a,this,b)};
g.P=function(){var a=this.jc;return null!=a?a:this.jc=a=Sc(Gc(this.name),Qc(this.Ja))+2654435769|0};g.O=function(a,b){return hc(b,[w(":"),w(this.Ba)].join(""))};function T(a,b){return a===b?!0:a instanceof t&&b instanceof t?a.Ba===b.Ba:!1}
var Ee=function Ee(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ee.g(arguments[0]);case 2:return Ee.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
Ee.g=function(a){if(a instanceof t)return a;if(a instanceof Ic){var b;if(null!=a&&(a.J&4096||a.Ue))b=a.Ja;else throw Error([w("Doesn't support namespace: "),w(a)].join(""));return new t(b,ue.g?ue.g(a):ue.call(null,a),a.Ka,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new t(b[0],b[1],a,null):new t(null,b[0],a,null)):null};Ee.a=function(a,b){return new t(a,b,[w(r(a)?[w(a),w("/")].join(""):null),w(b)].join(""),null)};Ee.I=2;
function Fe(a,b,c,d){this.A=a;this.sc=b;this.T=c;this.l=d;this.o=32374988;this.J=0}g=Fe.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};function Ge(a){null!=a.sc&&(a.T=a.sc.G?a.sc.G():a.sc.call(null),a.sc=null);return a.T}g.R=function(){return this.A};g.Ga=function(){cc(this);return null==this.T?null:L(this.T)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};
g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){cc(this);return null==this.T?null:I(this.T)};g.xa=function(){cc(this);return null!=this.T?Wc(this.T):J};g.U=function(){Ge(this);if(null==this.T)return null;for(var a=this.T;;)if(a instanceof Fe)a=Ge(a);else return this.T=a,H(this.T)};g.S=function(a,b){return new Fe(b,this.sc,this.T,this.l)};g.V=function(a,b){return O(b,this)};Fe.prototype[kb]=function(){return Yc(this)};He;
function Ie(a,b){this.X=a;this.end=b;this.o=2;this.J=0}Ie.prototype.add=function(a){this.X[this.end]=a;return this.end+=1};Ie.prototype.ua=function(){var a=new He(this.X,0,this.end);this.X=null;return a};Ie.prototype.Y=function(){return this.end};function Je(a){return new Ie(Array(a),0)}function He(a,b,c){this.j=a;this.Ca=b;this.end=c;this.o=524306;this.J=0}g=He.prototype;g.Y=function(){return this.end-this.Ca};g.ba=function(a,b){return this.j[this.Ca+b]};
g.Ma=function(a,b,c){return 0<=b&&b<this.end-this.Ca?this.j[this.Ca+b]:c};g.ee=function(){if(this.Ca===this.end)throw Error("-drop-first of empty chunk");return new He(this.j,this.Ca+1,this.end)};g.va=function(a,b){return pd(this.j,b,this.j[this.Ca],this.Ca+1)};g.wa=function(a,b,c){return pd(this.j,b,c,this.Ca)};function Qd(a,b,c,d){this.ua=a;this.pb=b;this.A=c;this.l=d;this.o=31850732;this.J=1536}g=Qd.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};
g.R=function(){return this.A};g.Ga=function(){if(1<sb(this.ua))return new Qd(sc(this.ua),this.pb,this.A,null);var a=cc(this.pb);return null==a?null:a};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.qa=function(){return A.a(this.ua,0)};g.xa=function(){return 1<sb(this.ua)?new Qd(sc(this.ua),this.pb,this.A,null):null==this.pb?J:this.pb};g.U=function(){return this};g.Hd=function(){return this.ua};
g.Id=function(){return null==this.pb?J:this.pb};g.S=function(a,b){return new Qd(this.ua,this.pb,b,this.l)};g.V=function(a,b){return O(b,this)};g.Gd=function(){return null==this.pb?null:this.pb};Qd.prototype[kb]=function(){return Yc(this)};function Ke(a,b){return 0===sb(a)?b:new Qd(a,b,null,null)}function Le(a,b){a.add(b)}function ye(a){return tc(a)}function ze(a){return uc(a)}function be(a){for(var b=[];;)if(H(a))b.push(I(a)),a=L(a);else return b}
function Me(a){if("number"===typeof a)a:{var b=Array(a);if(Wd(null))for(var c=0,d=H(null);;)if(d&&c<a)b[c]=I(d),c+=1,d=L(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=$a.g(a);return a}function Ne(a,b){if(td(a))return Q(a);for(var c=a,d=b,e=0;;)if(0<d&&H(c))c=L(c),--d,e+=1;else return e}
var Oe=function Oe(b){return null==b?null:null==L(b)?H(I(b)):O(I(b),Oe(L(b)))},Pe=function Pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Pe.G();case 1:return Pe.g(arguments[0]);case 2:return Pe.a(arguments[0],arguments[1]);default:return Pe.v(arguments[0],arguments[1],new G(c.slice(2),0))}};Pe.G=function(){return new Fe(null,function(){return null},null,null)};Pe.g=function(a){return new Fe(null,function(){return a},null,null)};
Pe.a=function(a,b){return new Fe(null,function(){var c=H(a);return c?Sd(c)?Ke(tc(c),Pe.a(uc(c),b)):O(I(c),Pe.a(Wc(c),b)):b},null,null)};Pe.v=function(a,b,c){return function e(a,b){return new Fe(null,function(){var c=H(a);return c?Sd(c)?Ke(tc(c),e(uc(c),b)):O(I(c),e(Wc(c),b)):r(b)?e(I(b),L(b)):null},null,null)}(Pe.a(a,b),c)};Pe.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return Pe.v(b,a,c)};Pe.I=2;function Qe(a){return mc(a)}
var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Re.G();case 1:return Re.g(arguments[0]);case 2:return Re.a(arguments[0],arguments[1]);default:return Re.v(arguments[0],arguments[1],new G(c.slice(2),0))}};Re.G=function(){return kc(Ad)};Re.g=function(a){return a};Re.a=function(a,b){return lc(a,b)};Re.v=function(a,b,c){for(;;)if(a=lc(a,b),r(c))b=I(c),c=L(c);else return a};
Re.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return Re.v(b,a,c)};Re.I=2;
function Te(a,b,c){var d=H(c);if(0===b)return a.G?a.G():a.call(null);c=yb(d);var e=zb(d);if(1===b)return a.g?a.g(c):a.g?a.g(c):a.call(null,c);var d=yb(e),f=zb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=yb(f),h=zb(f);if(3===b)return a.h?a.h(c,d,e):a.h?a.h(c,d,e):a.call(null,c,d,e);var f=yb(h),k=zb(h);if(4===b)return a.K?a.K(c,d,e,f):a.K?a.K(c,d,e,f):a.call(null,c,d,e,f);var h=yb(k),l=zb(k);if(5===b)return a.ca?a.ca(c,d,e,f,h):a.ca?a.ca(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=
yb(l),n=zb(l);if(6===b)return a.Sa?a.Sa(c,d,e,f,h,k):a.Sa?a.Sa(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=yb(n),p=zb(n);if(7===b)return a.Ta?a.Ta(c,d,e,f,h,k,l):a.Ta?a.Ta(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var n=yb(p),y=zb(p);if(8===b)return a.Eb?a.Eb(c,d,e,f,h,k,l,n):a.Eb?a.Eb(c,d,e,f,h,k,l,n):a.call(null,c,d,e,f,h,k,l,n);var p=yb(y),x=zb(y);if(9===b)return a.Fb?a.Fb(c,d,e,f,h,k,l,n,p):a.Fb?a.Fb(c,d,e,f,h,k,l,n,p):a.call(null,c,d,e,f,h,k,l,n,p);var y=yb(x),B=zb(x);if(10===b)return a.tb?a.tb(c,
d,e,f,h,k,l,n,p,y):a.tb?a.tb(c,d,e,f,h,k,l,n,p,y):a.call(null,c,d,e,f,h,k,l,n,p,y);var x=yb(B),C=zb(B);if(11===b)return a.ub?a.ub(c,d,e,f,h,k,l,n,p,y,x):a.ub?a.ub(c,d,e,f,h,k,l,n,p,y,x):a.call(null,c,d,e,f,h,k,l,n,p,y,x);var B=yb(C),E=zb(C);if(12===b)return a.vb?a.vb(c,d,e,f,h,k,l,n,p,y,x,B):a.vb?a.vb(c,d,e,f,h,k,l,n,p,y,x,B):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B);var C=yb(E),K=zb(E);if(13===b)return a.wb?a.wb(c,d,e,f,h,k,l,n,p,y,x,B,C):a.wb?a.wb(c,d,e,f,h,k,l,n,p,y,x,B,C):a.call(null,c,d,e,f,h,k,l,
n,p,y,x,B,C);var E=yb(K),P=zb(K);if(14===b)return a.xb?a.xb(c,d,e,f,h,k,l,n,p,y,x,B,C,E):a.xb?a.xb(c,d,e,f,h,k,l,n,p,y,x,B,C,E):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B,C,E);var K=yb(P),Z=zb(P);if(15===b)return a.yb?a.yb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K):a.yb?a.yb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K);var P=yb(Z),za=zb(Z);if(16===b)return a.zb?a.zb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P):a.zb?a.zb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P);var Z=
yb(za),cb=zb(za);if(17===b)return a.Ab?a.Ab(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z):a.Ab?a.Ab(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z);var za=yb(cb),Pc=zb(cb);if(18===b)return a.Bb?a.Bb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za):a.Bb?a.Bb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za);cb=yb(Pc);Pc=zb(Pc);if(19===b)return a.Cb?a.Cb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb):a.Cb?a.Cb(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb):a.call(null,
c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb);var N=yb(Pc);zb(Pc);if(20===b)return a.Db?a.Db(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb,N):a.Db?a.Db(c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb,N):a.call(null,c,d,e,f,h,k,l,n,p,y,x,B,C,E,K,P,Z,za,cb,N);throw Error("Only up to 20 arguments supported on functions");}
var z=function z(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return z.a(arguments[0],arguments[1]);case 3:return z.h(arguments[0],arguments[1],arguments[2]);case 4:return z.K(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return z.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return z.v(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new G(c.slice(5),0))}};
z.a=function(a,b){var c=a.I;if(a.L){var d=Ne(b,c+1);return d<=c?Te(a,d,b):a.L(b)}return a.apply(a,be(b))};z.h=function(a,b,c){b=O(b,c);c=a.I;if(a.L){var d=Ne(b,c+1);return d<=c?Te(a,d,b):a.L(b)}return a.apply(a,be(b))};z.K=function(a,b,c,d){b=O(b,O(c,d));c=a.I;return a.L?(d=Ne(b,c+1),d<=c?Te(a,d,b):a.L(b)):a.apply(a,be(b))};z.ca=function(a,b,c,d,e){b=O(b,O(c,O(d,e)));c=a.I;return a.L?(d=Ne(b,c+1),d<=c?Te(a,d,b):a.L(b)):a.apply(a,be(b))};
z.v=function(a,b,c,d,e,f){b=O(b,O(c,O(d,O(e,Oe(f)))));c=a.I;return a.L?(d=Ne(b,c+1),d<=c?Te(a,d,b):a.L(b)):a.apply(a,be(b))};z.L=function(a){var b=I(a),c=L(a);a=I(c);var d=L(c),c=I(d),e=L(d),d=I(e),f=L(e),e=I(f),f=L(f);return z.v(b,a,c,d,e,f)};z.I=5;function Ue(a){return H(a)?a:null}
var Ve=function Ve(){"undefined"===typeof Oa&&(Oa=function(b,c){this.lf=b;this.jf=c;this.o=393216;this.J=0},Oa.prototype.S=function(b,c){return new Oa(this.lf,c)},Oa.prototype.R=function(){return this.jf},Oa.prototype.za=function(){return!1},Oa.prototype.next=function(){return Error("No such element")},Oa.prototype.remove=function(){return Error("Unsupported operation")},Oa.Qd=function(){return new U(null,2,5,V,[id(We,new q(null,1,[Xe,Hc(Ye,Hc(Ad))],null)),Na.Hf],null)},Oa.Jc=!0,Oa.ac="cljs.core/t_cljs$core19412",
Oa.gd=function(b,c){return hc(c,"cljs.core/t_cljs$core19412")});return new Oa(Ve,W)};Ze;function Ze(a,b,c,d){this.yc=a;this.first=b;this.Fa=c;this.A=d;this.o=31719628;this.J=0}g=Ze.prototype;g.S=function(a,b){return new Ze(this.yc,this.first,this.Fa,b)};g.V=function(a,b){return O(b,cc(this))};g.ma=function(){return J};g.F=function(a,b){return null!=cc(this)?hd(this,b):Nd(b)&&null==H(b)};g.P=function(){return bd(this)};g.U=function(){null!=this.yc&&this.yc.step(this);return null==this.Fa?null:this};
g.qa=function(){null!=this.yc&&cc(this);return null==this.Fa?null:this.first};g.xa=function(){null!=this.yc&&cc(this);return null==this.Fa?J:this.Fa};g.Ga=function(){null!=this.yc&&cc(this);return null==this.Fa?null:cc(this.Fa)};Ze.prototype[kb]=function(){return Yc(this)};function $e(a,b){for(;;){if(null==H(b))return!0;var c;c=I(b);c=a.g?a.g(c):a.call(null,c);if(r(c)){c=a;var d=L(b);a=c;b=d}else return!1}}
function af(a,b){for(;;)if(H(b)){var c;c=I(b);c=a.g?a.g(c):a.call(null,c);if(r(c))return c;c=a;var d=L(b);a=c;b=d}else return null}
function bf(a){return function(){function b(b,c){return gb(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return gb(a.g?a.g(b):a.call(null,b))}function d(){return gb(a.G?a.G():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new G(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return gb(z.K(a,b,d,e))}b.I=2;b.L=function(a){var b=I(a);a=L(a);var d=I(a);a=Wc(a);return c(b,d,a)};b.v=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new G(p,0)}return f.v(a,e,n)}throw Error("Invalid arity: "+arguments.length);};e.I=2;e.L=f.L;e.G=d;e.g=c;e.a=b;e.v=f.v;return e}()}
function cf(){return function(){function a(a){if(0<arguments.length)for(var c=0,d=Array(arguments.length-0);c<d.length;)d[c]=arguments[c+0],++c;return!1}a.I=0;a.L=function(a){H(a);return!1};a.v=function(){return!1};return a}()}
var df=function df(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return df.G();case 1:return df.g(arguments[0]);case 2:return df.a(arguments[0],arguments[1]);case 3:return df.h(arguments[0],arguments[1],arguments[2]);default:return df.v(arguments[0],arguments[1],arguments[2],new G(c.slice(3),0))}};df.G=function(){return ge};df.g=function(a){return a};
df.a=function(a,b){return function(){function c(c,d,e){c=b.h?b.h(c,d,e):b.call(null,c,d,e);return a.g?a.g(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.g?a.g(e):a.call(null,e)}function e(c){c=b.g?b.g(c):b.call(null,c);return a.g?a.g(c):a.call(null,c)}function f(){var c=b.G?b.G():b.call(null);return a.g?a.g(c):a.call(null,c)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new G(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){c=z.ca(b,c,e,f,h);return a.g?a.g(c):a.call(null,c)}c.I=3;c.L=function(a){var b=I(a);a=L(a);var c=I(a);a=L(a);var e=I(a);a=Wc(a);return d(b,c,e,a)};c.v=d;return c}(),h=function(a,b,h,y){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var x=null;if(3<arguments.length){for(var x=0,B=Array(arguments.length-3);x<B.length;)B[x]=arguments[x+
3],++x;x=new G(B,0)}return k.v(a,b,h,x)}throw Error("Invalid arity: "+arguments.length);};h.I=3;h.L=k.L;h.G=f;h.g=e;h.a=d;h.h=c;h.v=k.v;return h}()};
df.h=function(a,b,c){return function(){function d(d,e,f){d=c.h?c.h(d,e,f):c.call(null,d,e,f);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.g?b.g(f):b.call(null,f);return a.g?a.g(f):a.call(null,f)}function f(d){d=c.g?c.g(d):c.call(null,d);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}function h(){var d;d=c.G?c.G():c.call(null);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new G(k,0)}return e.call(this,a,b,c,h)}function e(d,f,h,k){d=z.ca(c,d,f,h,k);d=b.g?b.g(d):b.call(null,d);return a.g?a.g(d):a.call(null,d)}d.I=3;d.L=function(a){var b=I(a);a=L(a);var c=I(a);a=L(a);var d=I(a);a=Wc(a);return e(b,c,d,a)};d.v=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var B=null;if(3<arguments.length){for(var B=0,C=Array(arguments.length-3);B<C.length;)C[B]=arguments[B+3],++B;B=new G(C,0)}return l.v(a,b,c,B)}throw Error("Invalid arity: "+arguments.length);};k.I=3;k.L=l.L;k.G=h;k.g=f;k.a=e;k.h=d;k.v=l.v;return k}()};
df.v=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return c.call(this,d)}function c(b){b=z.a(I(a),b);for(var d=L(a);;)if(d)b=I(d).call(null,b),d=L(d);else return b}b.I=0;b.L=function(a){a=H(a);return c(a)};b.v=c;return b}()}(Be(O(a,O(b,O(c,d)))))};df.L=function(a){var b=I(a),c=L(a);a=I(c);var d=L(c),c=I(d),d=L(d);return df.v(b,a,c,d)};df.I=3;
function ef(a){var b=ff;return function(){function c(c,d,e){return b.K?b.K(a,c,d,e):b.call(null,a,c,d,e)}function d(c,d){return b.h?b.h(a,c,d):b.call(null,a,c,d)}function e(c){return b.a?b.a(a,c):b.call(null,a,c)}function f(){return b.g?b.g(a):b.call(null,a)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new G(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){return z.v(b,a,c,e,f,F([h],
0))}c.I=3;c.L=function(a){var b=I(a);a=L(a);var c=I(a);a=L(a);var e=I(a);a=Wc(a);return d(b,c,e,a)};c.v=d;return c}(),h=function(a,b,h,y){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var x=null;if(3<arguments.length){for(var x=0,B=Array(arguments.length-3);x<B.length;)B[x]=arguments[x+3],++x;x=new G(B,0)}return k.v(a,b,h,x)}throw Error("Invalid arity: "+arguments.length);};h.I=3;h.L=k.L;h.G=
f;h.g=e;h.a=d;h.h=c;h.v=k.v;return h}()}gf;function hf(a,b){return function d(b,f){return new Fe(null,function(){var h=H(f);if(h){if(Sd(h)){for(var k=tc(h),l=Q(k),n=Je(l),p=0;;)if(p<l)Le(n,function(){var d=b+p,f=A.a(k,p);return a.a?a.a(d,f):a.call(null,d,f)}()),p+=1;else break;return Ke(n.ua(),d(b+l,uc(h)))}return O(function(){var d=I(h);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Wc(h)))}return null},null,null)}(0,b)}
function jf(a,b,c,d){this.state=a;this.A=b;this.rf=c;this.Ee=d;this.J=16386;this.o=6455296}g=jf.prototype;g.equiv=function(a){return this.F(null,a)};g.F=function(a,b){return this===b};g.Fc=function(){return this.state};g.R=function(){return this.A};
g.he=function(a,b,c){a=H(this.Ee);for(var d=null,e=0,f=0;;)if(f<e){var h=d.ba(null,f),k=R(h,0),h=R(h,1);h.K?h.K(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=H(a))Sd(a)?(d=tc(a),a=uc(a),k=d,e=Q(d),d=k):(d=I(a),k=R(d,0),h=R(d,1),h.K?h.K(k,this,b,c):h.call(null,k,this,b,c),a=L(a),d=null,e=0),f=0;else return null};g.P=function(){return this[ha]||(this[ha]=++ia)};
var kf=function kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kf.g(arguments[0]);default:return kf.v(arguments[0],new G(c.slice(1),0))}};kf.g=function(a){return new jf(a,null,null,null)};kf.v=function(a,b){var c=null!=b&&(b.o&64||b.na)?z.a(gd,b):b,d=D.a(c,Wa),c=D.a(c,lf);return new jf(a,d,c,null)};kf.L=function(a){var b=I(a);a=L(a);return kf.v(b,a)};kf.I=1;mf;
function nf(a,b){if(a instanceof jf){var c=a.rf;if(null!=c&&!r(c.g?c.g(b):c.call(null,b)))throw Error([w("Assert failed: "),w("Validator rejected reference state"),w("\n"),w(function(){var a=Hc(of,pf);return mf.g?mf.g(a):mf.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.Ee&&jc(a,c,b);return b}return xc(a,b)}
var qf=function qf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return qf.a(arguments[0],arguments[1]);case 3:return qf.h(arguments[0],arguments[1],arguments[2]);case 4:return qf.K(arguments[0],arguments[1],arguments[2],arguments[3]);default:return qf.v(arguments[0],arguments[1],arguments[2],arguments[3],new G(c.slice(4),0))}};qf.a=function(a,b){var c;a instanceof jf?(c=a.state,c=b.g?b.g(c):b.call(null,c),c=nf(a,c)):c=yc.a(a,b);return c};
qf.h=function(a,b,c){if(a instanceof jf){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=nf(a,b)}else a=yc.h(a,b,c);return a};qf.K=function(a,b,c,d){if(a instanceof jf){var e=a.state;b=b.h?b.h(e,c,d):b.call(null,e,c,d);a=nf(a,b)}else a=yc.K(a,b,c,d);return a};qf.v=function(a,b,c,d,e){return a instanceof jf?nf(a,z.ca(b,a.state,c,d,e)):yc.ca(a,b,c,d,e)};qf.L=function(a){var b=I(a),c=L(a);a=I(c);var d=L(c),c=I(d),e=L(d),d=I(e),e=L(e);return qf.v(b,a,c,d,e)};qf.I=4;
function rf(a){this.state=a;this.o=32768;this.J=0}rf.prototype.Fc=function(){return this.state};function gf(a){return new rf(a)}
var S=function S(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return S.g(arguments[0]);case 2:return S.a(arguments[0],arguments[1]);case 3:return S.h(arguments[0],arguments[1],arguments[2]);case 4:return S.K(arguments[0],arguments[1],arguments[2],arguments[3]);default:return S.v(arguments[0],arguments[1],arguments[2],arguments[3],new G(c.slice(4),0))}};
S.g=function(a){return function(b){return function(){function c(c,d){var e=a.g?a.g(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.g?b.g(a):b.call(null,a)}function e(){return b.G?b.G():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new G(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=z.h(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.I=2;c.L=function(a){var b=
I(a);a=L(a);var c=I(a);a=Wc(a);return d(b,c,a)};c.v=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var p=null;if(2<arguments.length){for(var p=0,y=Array(arguments.length-2);p<y.length;)y[p]=arguments[p+2],++p;p=new G(y,0)}return h.v(a,b,p)}throw Error("Invalid arity: "+arguments.length);};f.I=2;f.L=h.L;f.G=e;f.g=d;f.a=c;f.v=h.v;return f}()}};
S.a=function(a,b){return new Fe(null,function(){var c=H(b);if(c){if(Sd(c)){for(var d=tc(c),e=Q(d),f=Je(e),h=0;;)if(h<e)Le(f,function(){var b=A.a(d,h);return a.g?a.g(b):a.call(null,b)}()),h+=1;else break;return Ke(f.ua(),S.a(a,uc(c)))}return O(function(){var b=I(c);return a.g?a.g(b):a.call(null,b)}(),S.a(a,Wc(c)))}return null},null,null)};
S.h=function(a,b,c){return new Fe(null,function(){var d=H(b),e=H(c);if(d&&e){var f=O,h;h=I(d);var k=I(e);h=a.a?a.a(h,k):a.call(null,h,k);d=f(h,S.h(a,Wc(d),Wc(e)))}else d=null;return d},null,null)};S.K=function(a,b,c,d){return new Fe(null,function(){var e=H(b),f=H(c),h=H(d);if(e&&f&&h){var k=O,l;l=I(e);var n=I(f),p=I(h);l=a.h?a.h(l,n,p):a.call(null,l,n,p);e=k(l,S.K(a,Wc(e),Wc(f),Wc(h)))}else e=null;return e},null,null)};
S.v=function(a,b,c,d,e){var f=function k(a){return new Fe(null,function(){var b=S.a(H,a);return $e(ge,b)?O(S.a(I,b),k(S.a(Wc,b))):null},null,null)};return S.a(function(){return function(b){return z.a(a,b)}}(f),f(zd.v(e,d,F([c,b],0))))};S.L=function(a){var b=I(a),c=L(a);a=I(c);var d=L(c),c=I(d),e=L(d),d=I(e),e=L(e);return S.v(b,a,c,d,e)};S.I=4;
function sf(a,b){if("number"!==typeof a)throw Error([w("Assert failed: "),w(function(){var a=Hc(tf,uf);return mf.g?mf.g(a):mf.call(null,a)}())].join(""));return new Fe(null,function(){if(0<a){var c=H(b);return c?O(I(c),sf(a-1,Wc(c))):null}return null},null,null)}
function vf(a,b){if("number"!==typeof a)throw Error([w("Assert failed: "),w(function(){var a=Hc(tf,uf);return mf.g?mf.g(a):mf.call(null,a)}())].join(""));return new Fe(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=H(b);if(0<a&&e){var f=a-1,e=Wc(e);a=f;b=e}else return e}}),null,null)}function wf(a){return new Fe(null,function(){return O(a,wf(a))},null,null)}
var xf=function xf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return xf.a(arguments[0],arguments[1]);default:return xf.v(arguments[0],arguments[1],new G(c.slice(2),0))}};xf.a=function(a,b){return new Fe(null,function(){var c=H(a),d=H(b);return c&&d?O(I(c),O(I(d),xf.a(Wc(c),Wc(d)))):null},null,null)};
xf.v=function(a,b,c){return new Fe(null,function(){var d=S.a(H,zd.v(c,b,F([a],0)));return $e(ge,d)?Pe.a(S.a(I,d),z.a(xf,S.a(Wc,d))):null},null,null)};xf.L=function(a){var b=I(a),c=L(a);a=I(c);c=L(c);return xf.v(b,a,c)};xf.I=2;function yf(a){return vf(1,xf.a(wf("L"),a))}zf;function Af(a,b){return z.a(Pe,z.h(S,a,b))}
function Bf(a,b){return new Fe(null,function(){var c=H(b);if(c){if(Sd(c)){for(var d=tc(c),e=Q(d),f=Je(e),h=0;;)if(h<e){var k;k=A.a(d,h);k=a.g?a.g(k):a.call(null,k);r(k)&&(k=A.a(d,h),f.add(k));h+=1}else break;return Ke(f.ua(),Bf(a,uc(c)))}d=I(c);c=Wc(c);return r(a.g?a.g(d):a.call(null,d))?O(d,Bf(a,c)):Bf(a,c)}return null},null,null)}
function Cf(a){return function c(a){return new Fe(null,function(){return O(a,r(Wd.g?Wd.g(a):Wd.call(null,a))?Af(c,F([H.g?H.g(a):H.call(null,a)],0)):null)},null,null)}(a)}function Df(a,b){return null!=a?null!=a&&(a.J&4||a.vf)?id(Qe(nb.h(lc,kc(a),b)),Jd(a)):nb.h(vb,a,b):nb.h(zd,J,b)}function Ef(a,b){return Qe(nb.h(function(b,d){return Re.a(b,a.g?a.g(d):a.call(null,d))},kc(Ad),b))}
function Ff(a,b,c){return new Fe(null,function(){var d=H(c);if(d){var e=sf(a,d);return a===Q(e)?O(e,Ff(a,b,vf(b,d))):null}return null},null,null)}function Gf(a,b,c){return Ed.h(a,b,function(){var d=D.a(a,b);return c.g?c.g(d):c.call(null,d)}())}function Hf(a,b){this.ka=a;this.j=b}function If(a){return new Hf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}
function Jf(a){return new Hf(a.ka,mb(a.j))}function Kf(a){a=a.w;return 32>a?0:a-1>>>5<<5}function Lf(a,b,c){for(;;){if(0===b)return c;var d=If(a);d.j[0]=c;c=d;b-=5}}var Nf=function Nf(b,c,d,e){var f=Jf(d),h=b.w-1>>>c&31;5===c?f.j[h]=e:(d=d.j[h],b=null!=d?Nf(b,c-5,d,e):Lf(null,c-5,e),f.j[h]=b);return f};function Of(a,b){throw Error([w("No item "),w(a),w(" in vector of length "),w(b)].join(""));}
function Pf(a,b){if(b>=Kf(a))return a.aa;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.j[b>>>d&31],d=e;else return c.j}function Qf(a,b){return 0<=b&&b<a.w?Pf(a,b):Of(b,a.w)}var Rf=function Rf(b,c,d,e,f){var h=Jf(d);if(0===c)h.j[e&31]=f;else{var k=e>>>c&31;b=Rf(b,c-5,d.j[k],e,f);h.j[k]=b}return h},Sf=function Sf(b,c,d){var e=b.w-2>>>c&31;if(5<c){b=Sf(b,c-5,d.j[e]);if(null==b&&0===e)return null;d=Jf(d);d.j[e]=b;return d}if(0===e)return null;d=Jf(d);d.j[e]=null;return d};
function Tf(a,b,c,d,e,f){this.C=a;this.Yc=b;this.j=c;this.Qa=d;this.start=e;this.end=f}Tf.prototype.za=function(){return this.C<this.end};Tf.prototype.next=function(){32===this.C-this.Yc&&(this.j=Pf(this.Qa,this.C),this.Yc+=32);var a=this.j[this.C&31];this.C+=1;return a};Uf;Vf;Wf;M;Xf;X;Yf;function U(a,b,c,d,e,f){this.A=a;this.w=b;this.shift=c;this.root=d;this.aa=e;this.l=f;this.o=167668511;this.J=8196}g=U.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};
g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){return"number"===typeof b?A.h(this,b,c):c};g.oc=function(a,b,c){a=0;for(var d=c;;)if(a<this.w){var e=Pf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=f+a,k=e[f],d=b.h?b.h(d,h,k):b.call(null,d,h,k);if(kd(d)){e=d;break a}f+=1}else{e=d;break a}if(kd(e))return M.g?M.g(e):M.call(null,e);a+=c;d=e}else return d};g.ba=function(a,b){return Qf(this,b)[b&31]};g.Ma=function(a,b,c){return 0<=b&&b<this.w?Pf(this,b)[b&31]:c};
g.$b=function(a,b,c){if(0<=b&&b<this.w)return Kf(this)<=b?(a=mb(this.aa),a[b&31]=c,new U(this.A,this.w,this.shift,this.root,a,null)):new U(this.A,this.w,this.shift,Rf(this,this.shift,this.root,b,c),this.aa,null);if(b===this.w)return vb(this,c);throw Error([w("Index "),w(b),w(" out of bounds  [0,"),w(this.w),w("]")].join(""));};g.Aa=function(){var a=this.w;return new Tf(0,0,0<Q(this)?Pf(this,0):null,this,0,a)};g.R=function(){return this.A};
g.sa=function(){return new U(this.A,this.w,this.shift,this.root,this.aa,this.l)};g.Y=function(){return this.w};g.Gc=function(){return A.a(this,0)};g.Hc=function(){return A.a(this,1)};g.Ob=function(){return 0<this.w?A.a(this,this.w-1):null};
g.Pb=function(){if(0===this.w)throw Error("Can't pop empty vector");if(1===this.w)return Vb(Ad,this.A);if(1<this.w-Kf(this))return new U(this.A,this.w-1,this.shift,this.root,this.aa.slice(0,-1),null);var a=Pf(this,this.w-2),b=Sf(this,this.shift,this.root),b=null==b?V:b,c=this.w-1;return 5<this.shift&&null==b.j[1]?new U(this.A,c,this.shift-5,b.j[0],a,null):new U(this.A,c,this.shift,b,a,null)};g.pc=function(){return 0<this.w?new rd(this,this.w-1,null):null};
g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){if(b instanceof U)if(this.w===Q(b))for(var c=zc(this),d=zc(b);;)if(r(c.za())){var e=c.next(),f=d.next();if(!Jc.a(e,f))return!1}else return!0;else return!1;else return hd(this,b)};g.nc=function(){return new Wf(this.w,this.shift,Uf.g?Uf.g(this.root):Uf.call(null,this.root),Vf.g?Vf.g(this.aa):Vf.call(null,this.aa))};g.ma=function(){return id(Ad,this.A)};g.va=function(a,b){return ld(this,b)};
g.wa=function(a,b,c){a=0;for(var d=c;;)if(a<this.w){var e=Pf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.a?b.a(d,h):b.call(null,d,h);if(kd(d)){e=d;break a}f+=1}else{e=d;break a}if(kd(e))return M.g?M.g(e):M.call(null,e);a+=c;d=e}else return d};g.Ha=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.U=function(){if(0===this.w)return null;if(32>=this.w)return new G(this.aa,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.j[0];else{a=a.j;break a}}return Yf.K?Yf.K(this,a,0,0):Yf.call(null,this,a,0,0)};g.S=function(a,b){return new U(b,this.w,this.shift,this.root,this.aa,this.l)};
g.V=function(a,b){if(32>this.w-Kf(this)){for(var c=this.aa.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.aa[e],e+=1;else break;d[c]=b;return new U(this.A,this.w+1,this.shift,this.root,d,null)}c=(d=this.w>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=If(null),d.j[0]=this.root,e=Lf(null,this.shift,new Hf(null,this.aa)),d.j[1]=e):d=Nf(this,this.shift,this.root,new Hf(null,this.aa));return new U(this.A,this.w+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ma(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.h=function(a,c,d){return this.Ma(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.ba(null,a)};g.a=function(a,b){return this.Ma(null,a,b)};
var V=new Hf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),Ad=new U(null,0,5,V,[],cd);function Zf(a,b){var c=a.length,d=b?a:mb(a);if(32>c)return new U(null,c,5,V,d,null);for(var e=32,f=(new U(null,32,5,V,d.slice(0,32),null)).nc(null);;)if(e<c)var h=e+1,f=Re.a(f,d[e]),e=h;else return mc(f)}U.prototype[kb]=function(){return Yc(this)};
function ee(a){return fb(a)?Zf(a,!0):mc(nb.h(lc,kc(Ad),a))}var $f=function $f(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return $f.v(0<c.length?new G(c.slice(0),0):null)};$f.v=function(a){return a instanceof G&&0===a.C?Zf(a.j,!0):ee(a)};$f.I=0;$f.L=function(a){return $f.v(H(a))};ag;function Rd(a,b,c,d,e,f){this.Ra=a;this.node=b;this.C=c;this.Ca=d;this.A=e;this.l=f;this.o=32375020;this.J=1536}g=Rd.prototype;g.toString=function(){return Bc(this)};
g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};g.Ga=function(){if(this.Ca+1<this.node.length){var a;a=this.Ra;var b=this.node,c=this.C,d=this.Ca+1;a=Yf.K?Yf.K(a,b,c,d):Yf.call(null,a,b,c,d);return null==a?null:a}return vc(this)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(Ad,this.A)};
g.va=function(a,b){var c;c=this.Ra;var d=this.C+this.Ca,e=Q(this.Ra);c=ag.h?ag.h(c,d,e):ag.call(null,c,d,e);return ld(c,b)};g.wa=function(a,b,c){a=this.Ra;var d=this.C+this.Ca,e=Q(this.Ra);a=ag.h?ag.h(a,d,e):ag.call(null,a,d,e);return md(a,b,c)};g.qa=function(){return this.node[this.Ca]};g.xa=function(){if(this.Ca+1<this.node.length){var a;a=this.Ra;var b=this.node,c=this.C,d=this.Ca+1;a=Yf.K?Yf.K(a,b,c,d):Yf.call(null,a,b,c,d);return null==a?J:a}return uc(this)};g.U=function(){return this};
g.Hd=function(){var a=this.node;return new He(a,this.Ca,a.length)};g.Id=function(){var a=this.C+this.node.length;if(a<sb(this.Ra)){var b=this.Ra,c=Pf(this.Ra,a);return Yf.K?Yf.K(b,c,a,0):Yf.call(null,b,c,a,0)}return J};g.S=function(a,b){return Yf.ca?Yf.ca(this.Ra,this.node,this.C,this.Ca,b):Yf.call(null,this.Ra,this.node,this.C,this.Ca,b)};g.V=function(a,b){return O(b,this)};
g.Gd=function(){var a=this.C+this.node.length;if(a<sb(this.Ra)){var b=this.Ra,c=Pf(this.Ra,a);return Yf.K?Yf.K(b,c,a,0):Yf.call(null,b,c,a,0)}return null};Rd.prototype[kb]=function(){return Yc(this)};
var Yf=function Yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Yf.h(arguments[0],arguments[1],arguments[2]);case 4:return Yf.K(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Yf.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};Yf.h=function(a,b,c){return new Rd(a,Qf(a,b),b,c,null,null)};
Yf.K=function(a,b,c,d){return new Rd(a,b,c,d,null,null)};Yf.ca=function(a,b,c,d,e){return new Rd(a,b,c,d,e,null)};Yf.I=5;bg;function cg(a,b,c,d,e){this.A=a;this.Qa=b;this.start=c;this.end=d;this.l=e;this.o=167666463;this.J=8192}g=cg.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){return"number"===typeof b?A.h(this,b,c):c};
g.oc=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=A.a(this.Qa,a);c=b.h?b.h(c,e,f):b.call(null,c,e,f);if(kd(c))return M.g?M.g(c):M.call(null,c);d+=1;a+=1}else return c};g.ba=function(a,b){return 0>b||this.end<=this.start+b?Of(b,this.end-this.start):A.a(this.Qa,this.start+b)};g.Ma=function(a,b,c){return 0>b||this.end<=this.start+b?c:A.h(this.Qa,this.start+b,c)};
g.$b=function(a,b,c){var d=this.start+b;a=this.A;c=Ed.h(this.Qa,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return bg.ca?bg.ca(a,c,b,d,null):bg.call(null,a,c,b,d,null)};g.R=function(){return this.A};g.sa=function(){return new cg(this.A,this.Qa,this.start,this.end,this.l)};g.Y=function(){return this.end-this.start};g.Ob=function(){return A.a(this.Qa,this.end-1)};
g.Pb=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.A,b=this.Qa,c=this.start,d=this.end-1;return bg.ca?bg.ca(a,b,c,d,null):bg.call(null,a,b,c,d,null)};g.pc=function(){return this.start!==this.end?new rd(this,this.end-this.start-1,null):null};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(Ad,this.A)};g.va=function(a,b){return ld(this,b)};g.wa=function(a,b,c){return md(this,b,c)};
g.Ha=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:O(A.a(a.Qa,e),new Fe(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};g.S=function(a,b){return bg.ca?bg.ca(b,this.Qa,this.start,this.end,this.l):bg.call(null,b,this.Qa,this.start,this.end,this.l)};
g.V=function(a,b){var c=this.A,d=Qb(this.Qa,this.end,b),e=this.start,f=this.end+1;return bg.ca?bg.ca(c,d,e,f,null):bg.call(null,c,d,e,f,null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ma(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.h=function(a,c,d){return this.Ma(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};
g.g=function(a){return this.ba(null,a)};g.a=function(a,b){return this.Ma(null,a,b)};cg.prototype[kb]=function(){return Yc(this)};function bg(a,b,c,d,e){for(;;)if(b instanceof cg)c=b.start+c,d=b.start+d,b=b.Qa;else{var f=Q(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new cg(a,b,c,d,e)}}
var ag=function ag(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ag.a(arguments[0],arguments[1]);case 3:return ag.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};ag.a=function(a,b){return ag.h(a,b,Q(a))};ag.h=function(a,b,c){return bg(null,a,b,c,null)};ag.I=3;function dg(a,b){return a===b.ka?b:new Hf(a,mb(b.j))}function Uf(a){return new Hf({},mb(a.j))}
function Vf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Ud(a,0,b,0,a.length);return b}var eg=function eg(b,c,d,e){d=dg(b.root.ka,d);var f=b.w-1>>>c&31;if(5===c)b=e;else{var h=d.j[f];b=null!=h?eg(b,c-5,h,e):Lf(b.root.ka,c-5,e)}d.j[f]=b;return d};function Wf(a,b,c,d){this.w=a;this.shift=b;this.root=c;this.aa=d;this.J=88;this.o=275}g=Wf.prototype;
g.Zb=function(a,b){if(this.root.ka){if(32>this.w-Kf(this))this.aa[this.w&31]=b;else{var c=new Hf(this.root.ka,this.aa),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.aa=d;if(this.w>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=Lf(this.root.ka,this.shift,c);this.root=new Hf(this.root.ka,d);this.shift=e}else this.root=eg(this,this.shift,this.root,c)}this.w+=1;return this}throw Error("conj! after persistent!");};g.qc=function(){if(this.root.ka){this.root.ka=null;var a=this.w-Kf(this),b=Array(a);Ud(this.aa,0,b,0,a);return new U(null,this.w,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.Ic=function(a,b,c){if("number"===typeof b)return pc(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.ge=function(a,b,c){var d=this;if(d.root.ka){if(0<=b&&b<d.w)return Kf(this)<=b?d.aa[b&31]=c:(a=function(){return function f(a,k){var l=dg(d.root.ka,k);if(0===a)l.j[b&31]=c;else{var n=b>>>a&31,p=f(a-5,l.j[n]);l.j[n]=p}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.w)return lc(this,c);throw Error([w("Index "),w(b),w(" out of bounds for TransientVector of length"),w(d.w)].join(""));}throw Error("assoc! after persistent!");};
g.Y=function(){if(this.root.ka)return this.w;throw Error("count after persistent!");};g.ba=function(a,b){if(this.root.ka)return Qf(this,b)[b&31];throw Error("nth after persistent!");};g.Ma=function(a,b,c){return 0<=b&&b<this.w?A.a(this,b):c};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){return"number"===typeof b?A.h(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};function fg(a,b){this.tc=a;this.Vc=b}
fg.prototype.za=function(){var a=null!=this.tc&&H(this.tc);return a?a:(a=null!=this.Vc)?this.Vc.za():a};fg.prototype.next=function(){if(null!=this.tc){var a=I(this.tc);this.tc=L(this.tc);return a}if(null!=this.Vc&&this.Vc.za())return this.Vc.next();throw Error("No such element");};fg.prototype.remove=function(){return Error("Unsupported operation")};function gg(a,b,c,d){this.A=a;this.Na=b;this.cb=c;this.l=d;this.o=31850572;this.J=0}g=gg.prototype;g.toString=function(){return Bc(this)};
g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.qa=function(){return I(this.Na)};g.xa=function(){var a=L(this.Na);return a?new gg(this.A,a,this.cb,null):null==this.cb?tb(this):new gg(this.A,this.cb,null,null)};g.U=function(){return this};g.S=function(a,b){return new gg(b,this.Na,this.cb,this.l)};g.V=function(a,b){return O(b,this)};
gg.prototype[kb]=function(){return Yc(this)};function hg(a,b,c,d,e){this.A=a;this.count=b;this.Na=c;this.cb=d;this.l=e;this.o=31858766;this.J=8192}g=hg.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.Aa=function(){return new fg(this.Na,zc(this.cb))};g.R=function(){return this.A};g.sa=function(){return new hg(this.A,this.count,this.Na,this.cb,this.l)};g.Y=function(){return this.count};g.Ob=function(){return I(this.Na)};
g.Pb=function(){if(r(this.Na)){var a=L(this.Na);return a?new hg(this.A,this.count-1,a,this.cb,null):new hg(this.A,this.count-1,H(this.cb),Ad,null)}return this};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(ig,this.A)};g.qa=function(){return I(this.Na)};g.xa=function(){return Wc(H(this))};g.U=function(){var a=H(this.cb),b=this.Na;return r(r(b)?b:a)?new gg(null,this.Na,H(a),null):null};
g.S=function(a,b){return new hg(b,this.count,this.Na,this.cb,this.l)};g.V=function(a,b){var c;r(this.Na)?(c=this.cb,c=new hg(this.A,this.count+1,this.Na,zd.a(r(c)?c:Ad,b),null)):c=new hg(this.A,this.count+1,zd.a(this.Na,b),Ad,null);return c};var ig=new hg(null,0,null,Ad,cd);hg.prototype[kb]=function(){return Yc(this)};function jg(){this.o=2097152;this.J=0}jg.prototype.equiv=function(a){return this.F(null,a)};jg.prototype.F=function(){return!1};var kg=new jg;
function lg(a,b){return Xd(Od(b)?Q(a)===Q(b)?$e(ge,S.a(function(a){return Jc.a(D.h(b,I(a),kg),xd(a))},a)):null:null)}function mg(a,b,c,d,e){this.C=a;this.of=b;this.ae=c;this.cf=d;this.qe=e}mg.prototype.za=function(){var a=this.C<this.ae;return a?a:this.qe.za()};mg.prototype.next=function(){if(this.C<this.ae){var a=Cd(this.cf,this.C);this.C+=1;return new U(null,2,5,V,[a,Cb.a(this.of,a)],null)}return this.qe.next()};mg.prototype.remove=function(){return Error("Unsupported operation")};
function ng(a){this.T=a}ng.prototype.next=function(){if(null!=this.T){var a=I(this.T),b=R(a,0),a=R(a,1);this.T=L(this.T);return{value:[b,a],done:!1}}return{value:null,done:!0}};function og(a){return new ng(H(a))}function pg(a){this.T=a}pg.prototype.next=function(){if(null!=this.T){var a=I(this.T);this.T=L(this.T);return{value:[a,a],done:!1}}return{value:null,done:!0}};function qg(a){return new pg(H(a))}
function rg(a,b){var c;if(b instanceof t)a:{c=a.length;for(var d=b.Ba,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof t&&d===a[e].Ba){c=e;break a}e+=2}}else if(fa(b)||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof Ic)a:for(c=a.length,d=b.Ka,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof Ic&&d===a[e].Ka){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=a.length,
d=0;;){if(c<=d){c=-1;break a}if(Jc.a(b,a[d])){c=d;break a}d+=2}return c}sg;function tg(a,b,c){this.j=a;this.C=b;this.La=c;this.o=32374990;this.J=0}g=tg.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.La};g.Ga=function(){return this.C<this.j.length-2?new tg(this.j,this.C+2,this.La):null};g.Y=function(){return(this.j.length-this.C)/2};g.P=function(){return bd(this)};g.F=function(a,b){return hd(this,b)};
g.ma=function(){return id(J,this.La)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return new U(null,2,5,V,[this.j[this.C],this.j[this.C+1]],null)};g.xa=function(){return this.C<this.j.length-2?new tg(this.j,this.C+2,this.La):J};g.U=function(){return this};g.S=function(a,b){return new tg(this.j,this.C,b)};g.V=function(a,b){return O(b,this)};tg.prototype[kb]=function(){return Yc(this)};ug;vg;function wg(a,b,c){this.j=a;this.C=b;this.w=c}
wg.prototype.za=function(){return this.C<this.w};wg.prototype.next=function(){var a=new U(null,2,5,V,[this.j[this.C],this.j[this.C+1]],null);this.C+=2;return a};function q(a,b,c,d){this.A=a;this.w=b;this.j=c;this.l=d;this.o=16647951;this.J=8196}g=q.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.keys=function(){return Yc(ug.g?ug.g(this):ug.call(null,this))};g.entries=function(){return og(H(this))};
g.values=function(){return Yc(vg.g?vg.g(this):vg.call(null,this))};g.has=function(a){return Zd(this,a)};g.get=function(a,b){return this.M(null,a,b)};g.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=H(b))Sd(b)?(c=tc(b),b=uc(b),h=c,d=Q(c),c=h):(c=I(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Cb.h(this,b,null)};
g.M=function(a,b,c){a=rg(this.j,b);return-1===a?c:this.j[a+1]};g.oc=function(a,b,c){a=this.j.length;for(var d=0;;)if(d<a){var e=this.j[d],f=this.j[d+1];c=b.h?b.h(c,e,f):b.call(null,c,e,f);if(kd(c))return M.g?M.g(c):M.call(null,c);d+=2}else return c};g.Aa=function(){return new wg(this.j,0,2*this.w)};g.R=function(){return this.A};g.sa=function(){return new q(this.A,this.w,this.j,this.l)};g.Y=function(){return this.w};g.P=function(){var a=this.l;return null!=a?a:this.l=a=dd(this)};
g.F=function(a,b){if(null!=b&&(b.o&1024||b.Re)){var c=this.j.length;if(this.w===b.Y(null))for(var d=0;;)if(d<c){var e=b.M(null,this.j[d],Vd);if(e!==Vd)if(Jc.a(this.j[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return lg(this,b)};g.nc=function(){return new sg({},this.j.length,mb(this.j))};g.ma=function(){return Vb(W,this.A)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};
g.Ua=function(a,b){if(0<=rg(this.j,b)){var c=this.j.length,d=c-2;if(0===d)return tb(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new q(this.A,this.w-1,d,null);Jc.a(b,this.j[e])||(d[f]=this.j[e],d[f+1]=this.j[e+1],f+=2);e+=2}}else return this};
g.Ha=function(a,b,c){a=rg(this.j,b);if(-1===a){if(this.w<xg){a=this.j;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new q(this.A,this.w+1,e,null)}return Vb(Eb(Df(yg,this),b,c),this.A)}if(c===this.j[a+1])return this;b=mb(this.j);b[a+1]=c;return new q(this.A,this.w,b,null)};g.bd=function(a,b){return-1!==rg(this.j,b)};g.U=function(){var a=this.j;return 0<=a.length-2?new tg(a,0,null):null};g.S=function(a,b){return new q(b,this.w,this.j,this.l)};
g.V=function(a,b){if(Pd(b))return Eb(this,A.a(b,0),A.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(Pd(e))c=Eb(c,A.a(e,0),A.a(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var W=new q(null,0,[],ed),xg=8;
function zg(a,b,c){a=b?a:mb(a);if(!c){c=[];for(b=0;;)if(b<a.length){var d=a[b],e=a[b+1];-1===rg(c,d)&&(c.push(d),c.push(e));b+=2}else break;a=c}return new q(null,a.length/2,a,null)}q.prototype[kb]=function(){return Yc(this)};Ag;function sg(a,b,c){this.rc=a;this.gc=b;this.j=c;this.o=258;this.J=56}g=sg.prototype;g.Y=function(){if(r(this.rc))return qe(this.gc);throw Error("count after persistent!");};g.N=function(a,b){return Cb.h(this,b,null)};
g.M=function(a,b,c){if(r(this.rc))return a=rg(this.j,b),-1===a?c:this.j[a+1];throw Error("lookup after persistent!");};g.Zb=function(a,b){if(r(this.rc)){if(null!=b?b.o&2048||b.Se||(b.o?0:u(Ib,b)):u(Ib,b))return oc(this,ve.g?ve.g(b):ve.call(null,b),we.g?we.g(b):we.call(null,b));for(var c=H(b),d=this;;){var e=I(c);if(r(e))c=L(c),d=oc(d,ve.g?ve.g(e):ve.call(null,e),we.g?we.g(e):we.call(null,e));else return d}}else throw Error("conj! after persistent!");};
g.qc=function(){if(r(this.rc))return this.rc=!1,new q(null,qe(this.gc),this.j,null);throw Error("persistent! called twice");};g.Ic=function(a,b,c){if(r(this.rc)){a=rg(this.j,b);if(-1===a){if(this.gc+2<=2*xg)return this.gc+=2,this.j.push(b),this.j.push(c),this;a=Ag.a?Ag.a(this.gc,this.j):Ag.call(null,this.gc,this.j);return oc(a,b,c)}c!==this.j[a+1]&&(this.j[a+1]=c);return this}throw Error("assoc! after persistent!");};Bg;Dd;
function Ag(a,b){for(var c=kc(yg),d=0;;)if(d<a)c=oc(c,b[d],b[d+1]),d+=2;else return c}function Cg(){this.D=!1}Dg;Eg;nf;Fg;kf;M;function Gg(a,b){return a===b?!0:T(a,b)?!0:Jc.a(a,b)}function Hg(a,b,c){a=mb(a);a[b]=c;return a}function Ig(a,b){var c=Array(a.length-2);Ud(a,0,c,0,2*b);Ud(a,2*(b+1),c,2*b,c.length-2*b);return c}function Jg(a,b,c,d){a=a.bc(b);a.j[c]=d;return a}
function Kg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var h=a[e+1];c=b.h?b.h(f,c,h):b.call(null,f,c,h)}else c=a[e+1],c=null!=c?c.fc(b,f):f;if(kd(c))return M.g?M.g(c):M.call(null,c);e+=2;f=c}else return f}Lg;function Mg(a,b,c,d){this.j=a;this.C=b;this.Tc=c;this.lb=d}Mg.prototype.advance=function(){for(var a=this.j.length;;)if(this.C<a){var b=this.j[this.C],c=this.j[this.C+1];null!=b?b=this.Tc=new U(null,2,5,V,[b,c],null):null!=c?(b=zc(c),b=b.za()?this.lb=b:!1):b=!1;this.C+=2;if(b)return!0}else return!1};
Mg.prototype.za=function(){var a=null!=this.Tc;return a?a:(a=null!=this.lb)?a:this.advance()};Mg.prototype.next=function(){if(null!=this.Tc){var a=this.Tc;this.Tc=null;return a}if(null!=this.lb)return a=this.lb.next(),this.lb.za()||(this.lb=null),a;if(this.advance())return this.next();throw Error("No such element");};Mg.prototype.remove=function(){return Error("Unsupported operation")};function Ng(a,b,c){this.ka=a;this.oa=b;this.j=c}g=Ng.prototype;
g.bc=function(a){if(a===this.ka)return this;var b=re(this.oa),c=Array(0>b?4:2*(b+1));Ud(this.j,0,c,0,2*b);return new Ng(a,this.oa,c)};g.Pc=function(){return Dg.g?Dg.g(this.j):Dg.call(null,this.j)};g.fc=function(a,b){return Kg(this.j,a,b)};g.Sb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.oa&e))return d;var f=re(this.oa&e-1),e=this.j[2*f],f=this.j[2*f+1];return null==e?f.Sb(a+5,b,c,d):Gg(c,e)?f:d};
g.kb=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=re(this.oa&h-1);if(0===(this.oa&h)){var l=re(this.oa);if(2*l<this.j.length){a=this.bc(a);b=a.j;f.D=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.oa|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=Og.kb(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.oa>>>d&1)&&(k[d]=null!=this.j[e]?Og.kb(a,b+5,Rc(this.j[e]),this.j[e],this.j[e+1],f):this.j[e+1],e+=2),d+=1;else break;return new Lg(a,l+1,k)}b=Array(2*(l+4));Ud(this.j,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;Ud(this.j,2*k,b,2*(k+1),2*(l-k));f.D=!0;a=this.bc(a);a.j=b;a.oa|=h;return a}l=this.j[2*k];h=this.j[2*k+1];if(null==l)return l=h.kb(a,b+5,c,d,e,f),l===h?this:Jg(this,a,2*k+1,l);if(Gg(d,l))return e===h?this:Jg(this,a,2*k+1,e);f.D=!0;f=b+5;d=Fg.Ta?Fg.Ta(a,f,l,h,c,d,e):Fg.call(null,a,f,l,h,c,d,e);e=
2*k;k=2*k+1;a=this.bc(a);a.j[e]=null;a.j[k]=d;return a};
g.jb=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=re(this.oa&f-1);if(0===(this.oa&f)){var k=re(this.oa);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=Og.jb(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.oa>>>c&1)&&(h[c]=null!=this.j[d]?Og.jb(a+5,Rc(this.j[d]),this.j[d],this.j[d+1],e):this.j[d+1],d+=2),c+=1;else break;return new Lg(null,k+1,h)}a=Array(2*(k+1));Ud(this.j,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;Ud(this.j,2*h,a,2*(h+1),2*(k-h));e.D=!0;return new Ng(null,this.oa|f,a)}var l=this.j[2*h],f=this.j[2*h+1];if(null==l)return k=f.jb(a+5,b,c,d,e),k===f?this:new Ng(null,this.oa,Hg(this.j,2*h+1,k));if(Gg(c,l))return d===f?this:new Ng(null,this.oa,Hg(this.j,2*h+1,d));e.D=!0;e=this.oa;k=this.j;a+=5;a=Fg.Sa?Fg.Sa(a,l,f,b,c,d):Fg.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=mb(k);d[c]=null;d[h]=a;return new Ng(null,e,d)};
g.Qc=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.oa&d))return this;var e=re(this.oa&d-1),f=this.j[2*e],h=this.j[2*e+1];return null==f?(a=h.Qc(a+5,b,c),a===h?this:null!=a?new Ng(null,this.oa,Hg(this.j,2*e+1,a)):this.oa===d?null:new Ng(null,this.oa^d,Ig(this.j,e))):Gg(c,f)?new Ng(null,this.oa^d,Ig(this.j,e)):this};g.Aa=function(){return new Mg(this.j,0,null,null)};var Og=new Ng(null,0,[]);function Pg(a,b,c){this.j=a;this.C=b;this.lb=c}
Pg.prototype.za=function(){for(var a=this.j.length;;){if(null!=this.lb&&this.lb.za())return!0;if(this.C<a){var b=this.j[this.C];this.C+=1;null!=b&&(this.lb=zc(b))}else return!1}};Pg.prototype.next=function(){if(this.za())return this.lb.next();throw Error("No such element");};Pg.prototype.remove=function(){return Error("Unsupported operation")};function Lg(a,b,c){this.ka=a;this.w=b;this.j=c}g=Lg.prototype;g.bc=function(a){return a===this.ka?this:new Lg(a,this.w,mb(this.j))};
g.Pc=function(){return Eg.g?Eg.g(this.j):Eg.call(null,this.j)};g.fc=function(a,b){for(var c=this.j.length,d=0,e=b;;)if(d<c){var f=this.j[d];if(null!=f&&(e=f.fc(a,e),kd(e)))return M.g?M.g(e):M.call(null,e);d+=1}else return e};g.Sb=function(a,b,c,d){var e=this.j[b>>>a&31];return null!=e?e.Sb(a+5,b,c,d):d};g.kb=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.j[h];if(null==k)return a=Jg(this,a,h,Og.kb(a,b+5,c,d,e,f)),a.w+=1,a;b=k.kb(a,b+5,c,d,e,f);return b===k?this:Jg(this,a,h,b)};
g.jb=function(a,b,c,d,e){var f=b>>>a&31,h=this.j[f];if(null==h)return new Lg(null,this.w+1,Hg(this.j,f,Og.jb(a+5,b,c,d,e)));a=h.jb(a+5,b,c,d,e);return a===h?this:new Lg(null,this.w,Hg(this.j,f,a))};
g.Qc=function(a,b,c){var d=b>>>a&31,e=this.j[d];if(null!=e){a=e.Qc(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.w)a:{e=this.j;a=e.length;b=Array(2*(this.w-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new Ng(null,h,b);break a}}else d=new Lg(null,this.w-1,Hg(this.j,d,a));else d=new Lg(null,this.w,Hg(this.j,d,a));return d}return this};g.Aa=function(){return new Pg(this.j,0,null)};
function Qg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Gg(c,a[d]))return d;d+=2}else return-1}function Rg(a,b,c,d){this.ka=a;this.Gb=b;this.w=c;this.j=d}g=Rg.prototype;g.bc=function(a){if(a===this.ka)return this;var b=Array(2*(this.w+1));Ud(this.j,0,b,0,2*this.w);return new Rg(a,this.Gb,this.w,b)};g.Pc=function(){return Dg.g?Dg.g(this.j):Dg.call(null,this.j)};g.fc=function(a,b){return Kg(this.j,a,b)};g.Sb=function(a,b,c,d){a=Qg(this.j,this.w,c);return 0>a?d:Gg(c,this.j[a])?this.j[a+1]:d};
g.kb=function(a,b,c,d,e,f){if(c===this.Gb){b=Qg(this.j,this.w,d);if(-1===b){if(this.j.length>2*this.w)return b=2*this.w,c=2*this.w+1,a=this.bc(a),a.j[b]=d,a.j[c]=e,f.D=!0,a.w+=1,a;c=this.j.length;b=Array(c+2);Ud(this.j,0,b,0,c);b[c]=d;b[c+1]=e;f.D=!0;d=this.w+1;a===this.ka?(this.j=b,this.w=d,a=this):a=new Rg(this.ka,this.Gb,d,b);return a}return this.j[b+1]===e?this:Jg(this,a,b+1,e)}return(new Ng(a,1<<(this.Gb>>>b&31),[null,this,null,null])).kb(a,b,c,d,e,f)};
g.jb=function(a,b,c,d,e){return b===this.Gb?(a=Qg(this.j,this.w,c),-1===a?(a=2*this.w,b=Array(a+2),Ud(this.j,0,b,0,a),b[a]=c,b[a+1]=d,e.D=!0,new Rg(null,this.Gb,this.w+1,b)):Jc.a(this.j[a],d)?this:new Rg(null,this.Gb,this.w,Hg(this.j,a+1,d))):(new Ng(null,1<<(this.Gb>>>a&31),[null,this])).jb(a,b,c,d,e)};g.Qc=function(a,b,c){a=Qg(this.j,this.w,c);return-1===a?this:1===this.w?null:new Rg(null,this.Gb,this.w-1,Ig(this.j,qe(a)))};g.Aa=function(){return new Mg(this.j,0,null,null)};
var Fg=function Fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Fg.Sa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Fg.Ta(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
Fg.Sa=function(a,b,c,d,e,f){var h=Rc(b);if(h===d)return new Rg(null,h,2,[b,c,e,f]);var k=new Cg;return Og.jb(a,h,b,c,k).jb(a,d,e,f,k)};Fg.Ta=function(a,b,c,d,e,f,h){var k=Rc(c);if(k===e)return new Rg(null,k,2,[c,d,f,h]);var l=new Cg;return Og.kb(a,b,k,c,d,l).kb(a,b,e,f,h,l)};Fg.I=7;function Sg(a,b,c,d,e){this.A=a;this.Tb=b;this.C=c;this.T=d;this.l=e;this.o=32374860;this.J=0}g=Sg.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};
g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return null==this.T?new U(null,2,5,V,[this.Tb[this.C],this.Tb[this.C+1]],null):I(this.T)};
g.xa=function(){if(null==this.T){var a=this.Tb,b=this.C+2;return Dg.h?Dg.h(a,b,null):Dg.call(null,a,b,null)}var a=this.Tb,b=this.C,c=L(this.T);return Dg.h?Dg.h(a,b,c):Dg.call(null,a,b,c)};g.U=function(){return this};g.S=function(a,b){return new Sg(b,this.Tb,this.C,this.T,this.l)};g.V=function(a,b){return O(b,this)};Sg.prototype[kb]=function(){return Yc(this)};
var Dg=function Dg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Dg.g(arguments[0]);case 3:return Dg.h(arguments[0],arguments[1],arguments[2]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};Dg.g=function(a){return Dg.h(a,0,null)};
Dg.h=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new Sg(null,a,b,null,null);var d=a[b+1];if(r(d)&&(d=d.Pc(),r(d)))return new Sg(null,a,b+2,d,null);b+=2}else return null;else return new Sg(null,a,b,c,null)};Dg.I=3;function Tg(a,b,c,d,e){this.A=a;this.Tb=b;this.C=c;this.T=d;this.l=e;this.o=32374860;this.J=0}g=Tg.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};
g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return I(this.T)};g.xa=function(){var a=this.Tb,b=this.C,c=L(this.T);return Eg.K?Eg.K(null,a,b,c):Eg.call(null,null,a,b,c)};g.U=function(){return this};g.S=function(a,b){return new Tg(b,this.Tb,this.C,this.T,this.l)};g.V=function(a,b){return O(b,this)};
Tg.prototype[kb]=function(){return Yc(this)};var Eg=function Eg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Eg.g(arguments[0]);case 4:return Eg.K(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};Eg.g=function(a){return Eg.K(null,a,0,null)};
Eg.K=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(r(e)&&(e=e.Pc(),r(e)))return new Tg(a,b,c+1,e,null);c+=1}else return null;else return new Tg(a,b,c,d,null)};Eg.I=4;Bg;function Ug(a,b,c){this.Ea=a;this.Ae=b;this.Vd=c}Ug.prototype.za=function(){return this.Vd&&this.Ae.za()};Ug.prototype.next=function(){if(this.Vd)return this.Ae.next();this.Vd=!0;return this.Ea};Ug.prototype.remove=function(){return Error("Unsupported operation")};
function Dd(a,b,c,d,e,f){this.A=a;this.w=b;this.root=c;this.Da=d;this.Ea=e;this.l=f;this.o=16123663;this.J=8196}g=Dd.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.keys=function(){return Yc(ug.g?ug.g(this):ug.call(null,this))};g.entries=function(){return og(H(this))};g.values=function(){return Yc(vg.g?vg.g(this):vg.call(null,this))};g.has=function(a){return Zd(this,a)};g.get=function(a,b){return this.M(null,a,b)};
g.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=H(b))Sd(b)?(c=tc(b),b=uc(b),h=c,d=Q(c),c=h):(c=I(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){return null==b?this.Da?this.Ea:c:null==this.root?c:this.root.Sb(0,Rc(b),b,c)};
g.oc=function(a,b,c){a=this.Da?b.h?b.h(c,null,this.Ea):b.call(null,c,null,this.Ea):c;return kd(a)?M.g?M.g(a):M.call(null,a):null!=this.root?this.root.fc(b,a):a};g.Aa=function(){var a=this.root?zc(this.root):Ve;return this.Da?new Ug(this.Ea,a,!1):a};g.R=function(){return this.A};g.sa=function(){return new Dd(this.A,this.w,this.root,this.Da,this.Ea,this.l)};g.Y=function(){return this.w};g.P=function(){var a=this.l;return null!=a?a:this.l=a=dd(this)};g.F=function(a,b){return lg(this,b)};
g.nc=function(){return new Bg({},this.root,this.w,this.Da,this.Ea)};g.ma=function(){return Vb(yg,this.A)};g.Ua=function(a,b){if(null==b)return this.Da?new Dd(this.A,this.w-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Qc(0,Rc(b),b);return c===this.root?this:new Dd(this.A,this.w-1,c,this.Da,this.Ea,null)};
g.Ha=function(a,b,c){if(null==b)return this.Da&&c===this.Ea?this:new Dd(this.A,this.Da?this.w:this.w+1,this.root,!0,c,null);a=new Cg;b=(null==this.root?Og:this.root).jb(0,Rc(b),b,c,a);return b===this.root?this:new Dd(this.A,a.D?this.w+1:this.w,b,this.Da,this.Ea,null)};g.bd=function(a,b){return null==b?this.Da:null==this.root?!1:this.root.Sb(0,Rc(b),b,Vd)!==Vd};g.U=function(){if(0<this.w){var a=null!=this.root?this.root.Pc():null;return this.Da?O(new U(null,2,5,V,[null,this.Ea],null),a):a}return null};
g.S=function(a,b){return new Dd(b,this.w,this.root,this.Da,this.Ea,this.l)};g.V=function(a,b){if(Pd(b))return Eb(this,A.a(b,0),A.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(Pd(e))c=Eb(c,A.a(e,0),A.a(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var yg=new Dd(null,0,null,!1,null,ed);
function Fd(a,b){for(var c=a.length,d=0,e=kc(yg);;)if(d<c)var f=d+1,e=e.Ic(null,a[d],b[d]),d=f;else return mc(e)}Dd.prototype[kb]=function(){return Yc(this)};function Bg(a,b,c,d,e){this.ka=a;this.root=b;this.count=c;this.Da=d;this.Ea=e;this.o=258;this.J=56}
function Vg(a,b,c){if(a.ka){if(null==b)a.Ea!==c&&(a.Ea=c),a.Da||(a.count+=1,a.Da=!0);else{var d=new Cg;b=(null==a.root?Og:a.root).kb(a.ka,0,Rc(b),b,c,d);b!==a.root&&(a.root=b);d.D&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=Bg.prototype;g.Y=function(){if(this.ka)return this.count;throw Error("count after persistent!");};g.N=function(a,b){return null==b?this.Da?this.Ea:null:null==this.root?null:this.root.Sb(0,Rc(b),b)};
g.M=function(a,b,c){return null==b?this.Da?this.Ea:c:null==this.root?c:this.root.Sb(0,Rc(b),b,c)};g.Zb=function(a,b){var c;a:if(this.ka)if(null!=b?b.o&2048||b.Se||(b.o?0:u(Ib,b)):u(Ib,b))c=Vg(this,ve.g?ve.g(b):ve.call(null,b),we.g?we.g(b):we.call(null,b));else{c=H(b);for(var d=this;;){var e=I(c);if(r(e))c=L(c),d=Vg(d,ve.g?ve.g(e):ve.call(null,e),we.g?we.g(e):we.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};
g.qc=function(){var a;if(this.ka)this.ka=null,a=new Dd(null,this.count,this.root,this.Da,this.Ea,null);else throw Error("persistent! called twice");return a};g.Ic=function(a,b,c){return Vg(this,b,c)};function Wg(a,b,c){for(var d=b;;)if(null!=a)b=c?a.left:a.right,d=zd.a(d,a),a=b;else return d}function Xg(a,b,c,d,e){this.A=a;this.stack=b;this.Xc=c;this.w=d;this.l=e;this.o=32374862;this.J=0}g=Xg.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.A};
g.Y=function(){return 0>this.w?Q(L(this))+1:this.w};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){var a=this.stack;return null==a?null:Nb(a)};g.xa=function(){var a=I(this.stack),a=Wg(this.Xc?a.right:a.left,L(this.stack),this.Xc);return null!=a?new Xg(null,a,this.Xc,this.w-1,null):J};g.U=function(){return this};
g.S=function(a,b){return new Xg(b,this.stack,this.Xc,this.w,this.l)};g.V=function(a,b){return O(b,this)};Xg.prototype[kb]=function(){return Yc(this)};function Yg(a,b,c){return new Xg(null,Wg(a,null,b),b,c,null)}Y;Zg;
function $g(a,b,c,d){return c instanceof Y?c.left instanceof Y?new Y(c.key,c.D,c.left.rb(),new Zg(a,b,c.right,d,null),null):c.right instanceof Y?new Y(c.right.key,c.right.D,new Zg(c.key,c.D,c.left,c.right.left,null),new Zg(a,b,c.right.right,d,null),null):new Zg(a,b,c,d,null):new Zg(a,b,c,d,null)}
function ah(a,b,c,d){return d instanceof Y?d.right instanceof Y?new Y(d.key,d.D,new Zg(a,b,c,d.left,null),d.right.rb(),null):d.left instanceof Y?new Y(d.left.key,d.left.D,new Zg(a,b,c,d.left.left,null),new Zg(d.key,d.D,d.left.right,d.right,null),null):new Zg(a,b,c,d,null):new Zg(a,b,c,d,null)}
function bh(a,b,c,d){if(c instanceof Y)return new Y(a,b,c.rb(),d,null);if(d instanceof Zg)return ah(a,b,c,d.Uc());if(d instanceof Y&&d.left instanceof Zg)return new Y(d.left.key,d.left.D,new Zg(a,b,c,d.left.left,null),ah(d.key,d.D,d.left.right,d.right.Uc()),null);throw Error("red-black tree invariant violation");}
var ch=function ch(b,c,d){d=null!=b.left?ch(b.left,c,d):d;if(kd(d))return M.g?M.g(d):M.call(null,d);var e=b.key,f=b.D;d=c.h?c.h(d,e,f):c.call(null,d,e,f);if(kd(d))return M.g?M.g(d):M.call(null,d);b=null!=b.right?ch(b.right,c,d):d;return kd(b)?M.g?M.g(b):M.call(null,b):b};function Zg(a,b,c,d,e){this.key=a;this.D=b;this.left=c;this.right=d;this.l=e;this.o=32402207;this.J=0}g=Zg.prototype;g.Yd=function(a){return a.$d(this)};g.Uc=function(){return new Y(this.key,this.D,this.left,this.right,null)};
g.rb=function(){return this};g.Xd=function(a){return a.Zd(this)};g.replace=function(a,b,c,d){return new Zg(a,b,c,d,null)};g.Zd=function(a){return new Zg(a.key,a.D,this,a.right,null)};g.$d=function(a){return new Zg(a.key,a.D,a.left,this,null)};g.fc=function(a,b){return ch(this,a,b)};g.N=function(a,b){return A.h(this,b,null)};g.M=function(a,b,c){return A.h(this,b,c)};g.ba=function(a,b){return 0===b?this.key:1===b?this.D:null};g.Ma=function(a,b,c){return 0===b?this.key:1===b?this.D:c};
g.$b=function(a,b,c){return(new U(null,2,5,V,[this.key,this.D],null)).$b(null,b,c)};g.R=function(){return null};g.Y=function(){return 2};g.Gc=function(){return this.key};g.Hc=function(){return this.D};g.Ob=function(){return this.D};g.Pb=function(){return new U(null,1,5,V,[this.key],null)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return Ad};g.va=function(a,b){return ld(this,b)};g.wa=function(a,b,c){return md(this,b,c)};
g.Ha=function(a,b,c){return Ed.h(new U(null,2,5,V,[this.key,this.D],null),b,c)};g.U=function(){return vb(vb(J,this.D),this.key)};g.S=function(a,b){return id(new U(null,2,5,V,[this.key,this.D],null),b)};g.V=function(a,b){return new U(null,3,5,V,[this.key,this.D,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};Zg.prototype[kb]=function(){return Yc(this)};
function Y(a,b,c,d,e){this.key=a;this.D=b;this.left=c;this.right=d;this.l=e;this.o=32402207;this.J=0}g=Y.prototype;g.Yd=function(a){return new Y(this.key,this.D,this.left,a,null)};g.Uc=function(){throw Error("red-black tree invariant violation");};g.rb=function(){return new Zg(this.key,this.D,this.left,this.right,null)};g.Xd=function(a){return new Y(this.key,this.D,a,this.right,null)};g.replace=function(a,b,c,d){return new Y(a,b,c,d,null)};
g.Zd=function(a){return this.left instanceof Y?new Y(this.key,this.D,this.left.rb(),new Zg(a.key,a.D,this.right,a.right,null),null):this.right instanceof Y?new Y(this.right.key,this.right.D,new Zg(this.key,this.D,this.left,this.right.left,null),new Zg(a.key,a.D,this.right.right,a.right,null),null):new Zg(a.key,a.D,this,a.right,null)};
g.$d=function(a){return this.right instanceof Y?new Y(this.key,this.D,new Zg(a.key,a.D,a.left,this.left,null),this.right.rb(),null):this.left instanceof Y?new Y(this.left.key,this.left.D,new Zg(a.key,a.D,a.left,this.left.left,null),new Zg(this.key,this.D,this.left.right,this.right,null),null):new Zg(a.key,a.D,a.left,this,null)};g.fc=function(a,b){return ch(this,a,b)};g.N=function(a,b){return A.h(this,b,null)};g.M=function(a,b,c){return A.h(this,b,c)};
g.ba=function(a,b){return 0===b?this.key:1===b?this.D:null};g.Ma=function(a,b,c){return 0===b?this.key:1===b?this.D:c};g.$b=function(a,b,c){return(new U(null,2,5,V,[this.key,this.D],null)).$b(null,b,c)};g.R=function(){return null};g.Y=function(){return 2};g.Gc=function(){return this.key};g.Hc=function(){return this.D};g.Ob=function(){return this.D};g.Pb=function(){return new U(null,1,5,V,[this.key],null)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};
g.F=function(a,b){return hd(this,b)};g.ma=function(){return Ad};g.va=function(a,b){return ld(this,b)};g.wa=function(a,b,c){return md(this,b,c)};g.Ha=function(a,b,c){return Ed.h(new U(null,2,5,V,[this.key,this.D],null),b,c)};g.U=function(){return vb(vb(J,this.D),this.key)};g.S=function(a,b){return id(new U(null,2,5,V,[this.key,this.D],null),b)};g.V=function(a,b){return new U(null,3,5,V,[this.key,this.D,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};Y.prototype[kb]=function(){return Yc(this)};
var dh=function dh(b,c,d,e,f){if(null==c)return new Y(d,e,null,null,null);var h;h=c.key;h=b.a?b.a(d,h):b.call(null,d,h);if(0===h)return f[0]=c,null;if(0>h)return b=dh(b,c.left,d,e,f),null!=b?c.Xd(b):null;b=dh(b,c.right,d,e,f);return null!=b?c.Yd(b):null},eh=function eh(b,c){if(null==b)return c;if(null==c)return b;if(b instanceof Y){if(c instanceof Y){var d=eh(b.right,c.left);return d instanceof Y?new Y(d.key,d.D,new Y(b.key,b.D,b.left,d.left,null),new Y(c.key,c.D,d.right,c.right,null),null):new Y(b.key,
b.D,b.left,new Y(c.key,c.D,d,c.right,null),null)}return new Y(b.key,b.D,b.left,eh(b.right,c),null)}if(c instanceof Y)return new Y(c.key,c.D,eh(b,c.left),c.right,null);d=eh(b.right,c.left);return d instanceof Y?new Y(d.key,d.D,new Zg(b.key,b.D,b.left,d.left,null),new Zg(c.key,c.D,d.right,c.right,null),null):bh(b.key,b.D,b.left,new Zg(c.key,c.D,d,c.right,null))},fh=function fh(b,c,d,e){if(null!=c){var f;f=c.key;f=b.a?b.a(d,f):b.call(null,d,f);if(0===f)return e[0]=c,eh(c.left,c.right);if(0>f)return b=
fh(b,c.left,d,e),null!=b||null!=e[0]?c.left instanceof Zg?bh(c.key,c.D,b,c.right):new Y(c.key,c.D,b,c.right,null):null;b=fh(b,c.right,d,e);if(null!=b||null!=e[0])if(c.right instanceof Zg)if(e=c.key,d=c.D,c=c.left,b instanceof Y)c=new Y(e,d,c,b.rb(),null);else if(c instanceof Zg)c=$g(e,d,c.Uc(),b);else if(c instanceof Y&&c.right instanceof Zg)c=new Y(c.right.key,c.right.D,$g(c.key,c.D,c.left.Uc(),c.right.left),new Zg(e,d,c.right.right,b,null),null);else throw Error("red-black tree invariant violation");
else c=new Y(c.key,c.D,c.left,b,null);else c=null;return c}return null},gh=function gh(b,c,d,e){var f=c.key,h=b.a?b.a(d,f):b.call(null,d,f);return 0===h?c.replace(f,e,c.left,c.right):0>h?c.replace(f,c.D,gh(b,c.left,d,e),c.right):c.replace(f,c.D,c.left,gh(b,c.right,d,e))};ve;function hh(a,b,c,d,e){this.Va=a;this.qb=b;this.w=c;this.A=d;this.l=e;this.o=418776847;this.J=8192}g=hh.prototype;
g.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=H(b))Sd(b)?(c=tc(b),b=uc(b),h=c,d=Q(c),c=h):(c=I(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.get=function(a,b){return this.M(null,a,b)};g.entries=function(){return og(H(this))};g.toString=function(){return Bc(this)};g.keys=function(){return Yc(ug.g?ug.g(this):ug.call(null,this))};
g.values=function(){return Yc(vg.g?vg.g(this):vg.call(null,this))};g.equiv=function(a){return this.F(null,a)};function jh(a,b){for(var c=a.qb;;)if(null!=c){var d;d=c.key;d=a.Va.a?a.Va.a(b,d):a.Va.call(null,b,d);if(0===d)return c;c=0>d?c.left:c.right}else return null}g.has=function(a){return Zd(this,a)};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){a=jh(this,b);return null!=a?a.D:c};g.oc=function(a,b,c){return null!=this.qb?ch(this.qb,b,c):c};g.R=function(){return this.A};
g.sa=function(){return new hh(this.Va,this.qb,this.w,this.A,this.l)};g.Y=function(){return this.w};g.pc=function(){return 0<this.w?Yg(this.qb,!1,this.w):null};g.P=function(){var a=this.l;return null!=a?a:this.l=a=dd(this)};g.F=function(a,b){return lg(this,b)};g.ma=function(){return new hh(this.Va,null,0,this.A,0)};g.Ua=function(a,b){var c=[null],d=fh(this.Va,this.qb,b,c);return null==d?null==Cd(c,0)?this:new hh(this.Va,null,0,this.A,null):new hh(this.Va,d.rb(),this.w-1,this.A,null)};
g.Ha=function(a,b,c){a=[null];var d=dh(this.Va,this.qb,b,c,a);return null==d?(a=Cd(a,0),Jc.a(c,a.D)?this:new hh(this.Va,gh(this.Va,this.qb,b,c),this.w,this.A,null)):new hh(this.Va,d.rb(),this.w+1,this.A,null)};g.bd=function(a,b){return null!=jh(this,b)};g.U=function(){return 0<this.w?Yg(this.qb,!0,this.w):null};g.S=function(a,b){return new hh(this.Va,this.qb,this.w,b,this.l)};
g.V=function(a,b){if(Pd(b))return Eb(this,A.a(b,0),A.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(Pd(e))c=Eb(c,A.a(e,0),A.a(e,1)),d=L(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var kh=new hh(Kc,null,0,null,ed);hh.prototype[kb]=function(){return Yc(this)};
var gd=function gd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return gd.v(0<c.length?new G(c.slice(0),0):null)};gd.v=function(a){for(var b=H(a),c=kc(yg);;)if(b){a=L(L(b));var d=I(b),b=xd(b),c=oc(c,d,b),b=a}else return mc(c)};gd.I=0;gd.L=function(a){return gd.v(H(a))};var lh=function lh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return lh.v(0<c.length?new G(c.slice(0),0):null)};
lh.v=function(a){a=a instanceof G&&0===a.C?a.j:$a.g(a);return zg(a,!0,!1)};lh.I=0;lh.L=function(a){return lh.v(H(a))};function mh(a,b){this.W=a;this.La=b;this.o=32374988;this.J=0}g=mh.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.La};g.Ga=function(){var a=(null!=this.W?this.W.o&128||this.W.dd||(this.W.o?0:u(Ab,this.W)):u(Ab,this.W))?this.W.Ga(null):L(this.W);return null==a?null:new mh(a,this.La)};g.P=function(){return bd(this)};
g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.La)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return this.W.qa(null).Gc(null)};g.xa=function(){var a=(null!=this.W?this.W.o&128||this.W.dd||(this.W.o?0:u(Ab,this.W)):u(Ab,this.W))?this.W.Ga(null):L(this.W);return null!=a?new mh(a,this.La):J};g.U=function(){return this};g.S=function(a,b){return new mh(this.W,b)};g.V=function(a,b){return O(b,this)};mh.prototype[kb]=function(){return Yc(this)};
function ug(a){return(a=H(a))?new mh(a,null):null}function ve(a){return Jb(a)}function nh(a,b){this.W=a;this.La=b;this.o=32374988;this.J=0}g=nh.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.R=function(){return this.La};g.Ga=function(){var a=(null!=this.W?this.W.o&128||this.W.dd||(this.W.o?0:u(Ab,this.W)):u(Ab,this.W))?this.W.Ga(null):L(this.W);return null==a?null:new nh(a,this.La)};g.P=function(){return bd(this)};g.F=function(a,b){return hd(this,b)};
g.ma=function(){return id(J,this.La)};g.va=function(a,b){return wd.a(b,this)};g.wa=function(a,b,c){return wd.h(b,c,this)};g.qa=function(){return this.W.qa(null).Hc(null)};g.xa=function(){var a=(null!=this.W?this.W.o&128||this.W.dd||(this.W.o?0:u(Ab,this.W)):u(Ab,this.W))?this.W.Ga(null):L(this.W);return null!=a?new nh(a,this.La):J};g.U=function(){return this};g.S=function(a,b){return new nh(this.W,b)};g.V=function(a,b){return O(b,this)};nh.prototype[kb]=function(){return Yc(this)};
function vg(a){return(a=H(a))?new nh(a,null):null}function we(a){return Kb(a)}var oh=function oh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return oh.v(0<c.length?new G(c.slice(0),0):null)};oh.v=function(a){return r(af(ge,a))?nb.a(function(a,c){return zd.a(r(a)?a:W,c)},a):null};oh.I=0;oh.L=function(a){return oh.v(H(a))};ph;function qh(a){this.vc=a}qh.prototype.za=function(){return this.vc.za()};
qh.prototype.next=function(){if(this.vc.za())return this.vc.next().aa[0];throw Error("No such element");};qh.prototype.remove=function(){return Error("Unsupported operation")};function rh(a,b,c){this.A=a;this.Rb=b;this.l=c;this.o=15077647;this.J=8196}g=rh.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.keys=function(){return Yc(H(this))};g.entries=function(){return qg(H(this))};g.values=function(){return Yc(H(this))};g.has=function(a){return Zd(this,a)};
g.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=H(b))Sd(b)?(c=tc(b),b=uc(b),h=c,d=Q(c),c=h):(c=I(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){return Db(this.Rb,b)?b:c};g.Aa=function(){return new qh(zc(this.Rb))};g.R=function(){return this.A};g.sa=function(){return new rh(this.A,this.Rb,this.l)};
g.Y=function(){return sb(this.Rb)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=dd(this)};g.F=function(a,b){return Ld(b)&&Q(this)===Q(b)&&$e(function(a){return function(b){return Zd(a,b)}}(this),b)};g.nc=function(){return new ph(kc(this.Rb))};g.ma=function(){return id(sh,this.A)};g.U=function(){return ug(this.Rb)};g.S=function(a,b){return new rh(b,this.Rb,this.l)};g.V=function(a,b){return new rh(this.A,Ed.h(this.Rb,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};var sh=new rh(null,W,ed);rh.prototype[kb]=function(){return Yc(this)};
function ph(a){this.Kb=a;this.J=136;this.o=259}g=ph.prototype;g.Zb=function(a,b){this.Kb=oc(this.Kb,b,null);return this};g.qc=function(){return new rh(null,mc(this.Kb),null)};g.Y=function(){return Q(this.Kb)};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){return Cb.h(this.Kb,b,Vd)===Vd?c:b};
g.call=function(){function a(a,b,c){return Cb.h(this.Kb,b,Vd)===Vd?c:b}function b(a,b){return Cb.h(this.Kb,b,Vd)===Vd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.h=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return Cb.h(this.Kb,a,Vd)===Vd?null:a};g.a=function(a,b){return Cb.h(this.Kb,a,Vd)===Vd?b:a};
function th(a,b,c){this.A=a;this.Lb=b;this.l=c;this.o=417730831;this.J=8192}g=th.prototype;g.toString=function(){return Bc(this)};g.equiv=function(a){return this.F(null,a)};g.keys=function(){return Yc(H(this))};g.entries=function(){return qg(H(this))};g.values=function(){return Yc(H(this))};g.has=function(a){return Zd(this,a)};
g.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=H(b))Sd(b)?(c=tc(b),b=uc(b),h=c,d=Q(c),c=h):(c=I(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null};g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){a=jh(this.Lb,b);return null!=a?a.key:c};g.R=function(){return this.A};g.sa=function(){return new th(this.A,this.Lb,this.l)};g.Y=function(){return Q(this.Lb)};
g.pc=function(){return 0<Q(this.Lb)?S.a(ve,gc(this.Lb)):null};g.P=function(){var a=this.l;return null!=a?a:this.l=a=dd(this)};g.F=function(a,b){return Ld(b)&&Q(this)===Q(b)&&$e(function(a){return function(b){return Zd(a,b)}}(this),b)};g.ma=function(){return new th(this.A,tb(this.Lb),0)};g.U=function(){return ug(this.Lb)};g.S=function(a,b){return new th(b,this.Lb,this.l)};g.V=function(a,b){return new th(this.A,Ed.h(this.Lb,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.M(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.h=function(a,c,d){return this.M(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){return this.N(null,a)};g.a=function(a,b){return this.M(null,a,b)};th.prototype[kb]=function(){return Yc(this)};
function ue(a){if(null!=a&&(a.J&4096||a.Ue))return a.name;if("string"===typeof a)return a;throw Error([w("Doesn't support name: "),w(a)].join(""));}function uh(a,b,c){this.C=a;this.end=b;this.step=c}uh.prototype.za=function(){return 0<this.step?this.C<this.end:this.C>this.end};uh.prototype.next=function(){var a=this.C;this.C+=this.step;return a};function vh(a,b,c,d,e){this.A=a;this.start=b;this.end=c;this.step=d;this.l=e;this.o=32375006;this.J=8192}g=vh.prototype;g.toString=function(){return Bc(this)};
g.equiv=function(a){return this.F(null,a)};g.ba=function(a,b){if(b<sb(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};g.Ma=function(a,b,c){return b<sb(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};g.Aa=function(){return new uh(this.start,this.end,this.step)};g.R=function(){return this.A};g.sa=function(){return new vh(this.A,this.start,this.end,this.step,this.l)};
g.Ga=function(){return 0<this.step?this.start+this.step<this.end?new vh(this.A,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new vh(this.A,this.start+this.step,this.end,this.step,null):null};g.Y=function(){return gb(cc(this))?0:Math.ceil((this.end-this.start)/this.step)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=bd(this)};g.F=function(a,b){return hd(this,b)};g.ma=function(){return id(J,this.A)};g.va=function(a,b){return ld(this,b)};
g.wa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(kd(c))return M.g?M.g(c):M.call(null,c);a+=this.step}else return c};g.qa=function(){return null==cc(this)?null:this.start};g.xa=function(){return null!=cc(this)?new vh(this.A,this.start+this.step,this.end,this.step,null):J};g.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
g.S=function(a,b){return new vh(b,this.start,this.end,this.step,this.l)};g.V=function(a,b){return O(b,this)};vh.prototype[kb]=function(){return Yc(this)};function wh(a,b){return new Fe(null,function(){var c=H(b);return c?xh(a,I(c),Wc(c)):vb(J,a.G?a.G():a.call(null))},null,null)}function xh(a,b,c){return O(b,new Fe(null,function(){var d=H(c);if(d){var e=xh,f;f=I(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Wc(d))}else d=null;return d},null,null))}
function yh(a){a:for(var b=a;;)if(H(b))b=L(b);else break a;return a}function zh(a,b){if("string"===typeof b){var c=a.exec(b);return Jc.a(I(c),b)?1===Q(c)?I(c):ee(c):null}throw new TypeError("re-matches must match against a string.");}function Ah(a,b){if("string"===typeof b){var c=a.exec(b);return null==c?null:1===Q(c)?I(c):ee(c)}throw new TypeError("re-find must match against a string.");}
function Bh(a){if(a instanceof RegExp)return a;var b=Ah(/^\(\?([idmsux]*)\)/,a),c=R(b,0),b=R(b,1),c=Q(c);return new RegExp(a.substring(c),r(b)?b:"")}
function Xf(a,b,c,d,e,f,h){var k=Ra;Ra=null==Ra?null:Ra-1;try{if(null!=Ra&&0>Ra)return hc(a,"#");hc(a,c);if(0===Ya.g(f))H(h)&&hc(a,function(){var a=Ch.g(f);return r(a)?a:"..."}());else{if(H(h)){var l=I(h);b.h?b.h(l,a,f):b.call(null,l,a,f)}for(var n=L(h),p=Ya.g(f)-1;;)if(!n||null!=p&&0===p){H(n)&&0===p&&(hc(a,d),hc(a,function(){var a=Ch.g(f);return r(a)?a:"..."}()));break}else{hc(a,d);var y=I(n);c=a;h=f;b.h?b.h(y,c,h):b.call(null,y,c,h);var x=L(n);c=p-1;n=x;p=c}}return hc(a,e)}finally{Ra=k}}
function Dh(a,b){for(var c=H(b),d=null,e=0,f=0;;)if(f<e){var h=d.ba(null,f);hc(a,h);f+=1}else if(c=H(c))d=c,Sd(d)?(c=tc(d),e=uc(d),d=c,h=Q(c),c=e,e=h):(h=I(d),hc(a,h),c=L(d),d=null,e=0),f=0;else return null}var Eh={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Fh(a){return[w('"'),w(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Eh[a]})),w('"')].join("")}Gh;
function Hh(a,b){var c=Xd(D.a(a,Wa));return c?(c=null!=b?b.o&131072||b.Te?!0:!1:!1)?null!=Jd(b):c:c}
function Ih(a,b,c){if(null==a)return hc(b,"nil");if(Hh(c,a)){hc(b,"^");var d=Jd(a);X.h?X.h(d,b,c):X.call(null,d,b,c);hc(b," ")}if(a.Jc)return a.gd(a,b,c);if(null!=a&&(a.o&2147483648||a.da))return a.O(null,b,c);if(!0===a||!1===a||"number"===typeof a)return hc(b,""+w(a));if(null!=a&&a.constructor===Object)return hc(b,"#js "),d=S.a(function(b){return new U(null,2,5,V,[Ee.g(b),a[b]],null)},Td(a)),Gh.K?Gh.K(d,X,b,c):Gh.call(null,d,X,b,c);if(fb(a))return Xf(b,X,"#js ["," ","]",c,a);if(fa(a))return r(Va.g(c))?
hc(b,Fh(a)):hc(b,a);if(ga(a)){var e=a.name;c=r(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Dh(b,F(["#object[",c,' "',""+w(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+w(a);;)if(Q(c)<b)c=[w("0"),w(c)].join("");else return c},Dh(b,F(['#inst "',""+w(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Dh(b,F(['#"',a.source,'"'],0));if(null!=a&&(a.o&2147483648||a.da))return ic(a,b,c);if(r(a.constructor.ac))return Dh(b,F(["#object[",a.constructor.ac.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=r(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Dh(b,F(["#object[",c," ",""+w(a),"]"],0))}function X(a,b,c){var d=Jh.g(c);return r(d)?(c=Ed.h(c,Kh,Ih),d.h?d.h(a,b,c):d.call(null,a,b,c)):Ih(a,b,c)}
var mf=function mf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return mf.v(0<c.length?new G(c.slice(0),0):null)};mf.v=function(a){var b=Ta();if(null==a||gb(H(a)))b="";else{var c=w,d=new ya;a:{var e=new Ac(d);X(I(a),e,b);a=H(L(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.ba(null,k);hc(e," ");X(l,e,b);k+=1}else if(a=H(a))f=a,Sd(f)?(a=tc(f),h=uc(f),f=a,l=Q(a),a=h,h=l):(l=I(f),hc(e," "),X(l,e,b),a=L(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};mf.I=0;
mf.L=function(a){return mf.v(H(a))};function Gh(a,b,c,d){return Xf(c,function(a,c,d){var k=Jb(a);b.h?b.h(k,c,d):b.call(null,k,c,d);hc(c," ");a=Kb(a);return b.h?b.h(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,H(a))}rf.prototype.da=!0;rf.prototype.O=function(a,b,c){hc(b,"#object [cljs.core.Volatile ");X(new q(null,1,[Lh,this.state],null),b,c);return hc(b,"]")};G.prototype.da=!0;G.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Fe.prototype.da=!0;
Fe.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Xg.prototype.da=!0;Xg.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Sg.prototype.da=!0;Sg.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Zg.prototype.da=!0;Zg.prototype.O=function(a,b,c){return Xf(b,X,"["," ","]",c,this)};tg.prototype.da=!0;tg.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};$c.prototype.da=!0;$c.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};
th.prototype.da=!0;th.prototype.O=function(a,b,c){return Xf(b,X,"#{"," ","}",c,this)};Rd.prototype.da=!0;Rd.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Ce.prototype.da=!0;Ce.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};rd.prototype.da=!0;rd.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Dd.prototype.da=!0;Dd.prototype.O=function(a,b,c){return Gh(this,X,b,c)};Tg.prototype.da=!0;Tg.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};
cg.prototype.da=!0;cg.prototype.O=function(a,b,c){return Xf(b,X,"["," ","]",c,this)};hh.prototype.da=!0;hh.prototype.O=function(a,b,c){return Gh(this,X,b,c)};rh.prototype.da=!0;rh.prototype.O=function(a,b,c){return Xf(b,X,"#{"," ","}",c,this)};Qd.prototype.da=!0;Qd.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};jf.prototype.da=!0;jf.prototype.O=function(a,b,c){hc(b,"#object [cljs.core.Atom ");X(new q(null,1,[Lh,this.state],null),b,c);return hc(b,"]")};nh.prototype.da=!0;
nh.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Y.prototype.da=!0;Y.prototype.O=function(a,b,c){return Xf(b,X,"["," ","]",c,this)};U.prototype.da=!0;U.prototype.O=function(a,b,c){return Xf(b,X,"["," ","]",c,this)};gg.prototype.da=!0;gg.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Ae.prototype.da=!0;Ae.prototype.O=function(a,b){return hc(b,"()")};Ze.prototype.da=!0;Ze.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};hg.prototype.da=!0;
hg.prototype.O=function(a,b,c){return Xf(b,X,"#queue ["," ","]",c,H(this))};q.prototype.da=!0;q.prototype.O=function(a,b,c){return Gh(this,X,b,c)};vh.prototype.da=!0;vh.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};mh.prototype.da=!0;mh.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};sd.prototype.da=!0;sd.prototype.O=function(a,b,c){return Xf(b,X,"("," ",")",c,this)};Ic.prototype.Yb=!0;
Ic.prototype.sb=function(a,b){if(b instanceof Ic)return Tc(this,b);throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};t.prototype.Yb=!0;t.prototype.sb=function(a,b){if(b instanceof t)return De(this,b);throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};cg.prototype.Yb=!0;cg.prototype.sb=function(a,b){if(Pd(b))return $d(this,b);throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};U.prototype.Yb=!0;
U.prototype.sb=function(a,b){if(Pd(b))return $d(this,b);throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};function Mh(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return kd(d)?new jd(d):d}}
function zf(a){return function(b){return function(){function c(a,c){return nb.h(b,a,c)}function d(b){return a.g?a.g(b):a.call(null,b)}function e(){return a.G?a.G():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.G=e;f.g=d;f.a=c;return f}()}(Mh(a))}Nh;function Oh(){}
var Ph=function Ph(b){if(null!=b&&null!=b.Oe)return b.Oe(b);var c=Ph[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Ph._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IEncodeJS.-clj-\x3ejs",b);};Qh;function Rh(a){return(null!=a?a.Ne||(a.Md?0:u(Oh,a)):u(Oh,a))?Ph(a):"string"===typeof a||"number"===typeof a||a instanceof t||a instanceof Ic?Qh.g?Qh.g(a):Qh.call(null,a):mf.v(F([a],0))}
var Qh=function Qh(b){if(null==b)return null;if(null!=b?b.Ne||(b.Md?0:u(Oh,b)):u(Oh,b))return Ph(b);if(b instanceof t)return ue(b);if(b instanceof Ic)return""+w(b);if(Od(b)){var c={};b=H(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.ba(null,f),k=R(h,0),h=R(h,1);c[Rh(k)]=Qh(h);f+=1}else if(b=H(b))Sd(b)?(e=tc(b),b=uc(b),d=e,e=Q(e)):(e=I(b),d=R(e,0),e=R(e,1),c[Rh(d)]=Qh(e),b=L(b),d=null,e=0),f=0;else break;return c}if(Kd(b)){c=[];b=H(S.a(Qh,b));d=null;for(f=e=0;;)if(f<e)k=d.ba(null,f),c.push(k),f+=1;else if(b=
H(b))d=b,Sd(d)?(b=tc(d),f=uc(d),d=b,e=Q(b),b=f):(b=I(d),c.push(b),b=L(d),d=null,e=0),f=0;else break;return c}return b};function Sh(){}var Th=function Th(b,c){if(null!=b&&null!=b.Me)return b.Me(b,c);var d=Th[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Th._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IEncodeClojure.-js-\x3eclj",b);};
function Uh(a,b){var c=null!=b&&(b.o&64||b.na)?z.a(gd,b):b,d=D.a(c,Vh);return function(a,c,d,k){return function n(p){return(null!=p?p.wf||(p.Md?0:u(Sh,p)):u(Sh,p))?Th(p,z.a(lh,b)):Wd(p)?yh(S.a(n,p)):Kd(p)?Df(null==p?null:tb(p),S.a(n,p)):fb(p)?ee(S.a(n,p)):ib(p)===Object?Df(W,function(){return function(a,b,c,d){return function K(e){return new Fe(null,function(a,b,c,d){return function(){for(;;){var a=H(e);if(a){if(Sd(a)){var b=tc(a),c=Q(b),f=Je(c);a:for(var h=0;;)if(h<c){var k=A.a(b,h),k=new U(null,
2,5,V,[d.g?d.g(k):d.call(null,k),n(p[k])],null);f.add(k);h+=1}else{b=!0;break a}return b?Ke(f.ua(),K(uc(a))):Ke(f.ua(),null)}f=I(a);return O(new U(null,2,5,V,[d.g?d.g(f):d.call(null,f),n(p[f])],null),K(Wc(a)))}return null}}}(a,b,c,d),null,null)}}(a,c,d,k)(Td(p))}()):p}}(b,c,d,r(d)?Ee:w)(a)}
var Nh=function Nh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Nh.G();case 1:return Nh.g(arguments[0]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};Nh.G=function(){return Nh.g(1)};Nh.g=function(a){return Math.random()*a};Nh.I=1;function Wh(a,b){this.ob=a;this.l=b;this.o=2153775104;this.J=2048}g=Wh.prototype;g.toString=function(){return this.ob};g.equiv=function(a){return this.F(null,a)};
g.F=function(a,b){return b instanceof Wh&&this.ob===b.ob};g.O=function(a,b){return hc(b,[w('#uuid "'),w(this.ob),w('"')].join(""))};g.P=function(){null==this.l&&(this.l=Nc(this.ob));return this.l};g.sb=function(a,b){return Ka(this.ob,b.ob)};var Xh=new t(null,"response","response",-1068424192),Yh=new t(null,"rng","rng",1082666016),Zh=new t(null,"y","y",-1757859776),$h=new t(null,"description","description",-1428560544),ai=new t(null,"text-anchor","text-anchor",585613696),bi=new t(null,"load","load",-1318641184),ci=new t(null,"path","path",-188191168),di=new Ic(null,"itm","itm",-713282527,null),ei=new Ic(null,".-length",".-length",-280799999,null),fi=new t(null,"finally","finally",1589088705),gi=new t(null,"format","format",-1306924766),
hi=new Ic(null,"puts","puts",-1883877054,null),ii=new t(null,"onkeyup","onkeyup",1815272291),ji=new t(null,"fn","fn",-1175266204),ki=new Ic(null,"\x3c","\x3c",993667236,null),li=new t(null,"api","api",-899839580),mi=new t(null,"original-text","original-text",744448452),ni=new t(null,"transform","transform",1381301764),Wa=new t(null,"meta","meta",1499536964),oi=new t(null,"dx","dx",-381796732),pi=new t(null,"ul","ul",-1349521403),qi=new t(null,"keywords?","keywords?",764949733),ri=new Ic(null,"blockable",
"blockable",-28395259,null),Xa=new t(null,"dup","dup",556298533),si=new t(null,"read","read",1140058661),ti=new t(null,"projection-strategy","projection-strategy",-608325691),ui=new t(null,"private","private",-558947994),vi=new t(null,"not-initialized","not-initialized",-1937378906),wi=new t(null,"failure","failure",720415879),xi=new t(null,"scale","scale",-230427353),yi=new t(null,"button","button",1456579943),pf=new Ic(null,"new-value","new-value",-1567397401,null),lf=new t(null,"validator","validator",
-1966190681),zi=new t(null,"method","method",55703592),Ai=new t(null,"raw","raw",1604651272),Bi=new t(null,"default","default",-1987822328),Ci=new t(null,"finally-block","finally-block",832982472),Di=new t(null,"strong","strong",269529E3),Ei=new t(null,"name","name",1843675177),Fi=new t(null,"n","n",562130025),Gi=new t(null,"li","li",723558921),Hi=new t(null,"fill","fill",883462889),Ii=new t(null,"clipPathUnits","clipPathUnits",-1747479222),Ji=new t(null,"response-format","response-format",1664465322),
Ki=new t(null,"status-text","status-text",-1834235478),Li=new t(null,"y1","y1",589123466),Mi=new t(null,"width","width",-384071477),Ni=new t(null,"aborted","aborted",1775972619),Oi=new t(null,"onclick","onclick",1297553739),Pi=new t(null,"dy","dy",1719547243),Qi=new t(null,"clipPath","clipPath",-934619797),Ri=new t(null,"processing-request","processing-request",-264947221),Si=new t(null,"params","params",710516235),Ti=new t(null,"projector","projector",1428597707),Lh=new t(null,"val","val",128701612),
Ui=new t(null,"recur","recur",-437573268),Vi=new t(null,"type","type",1174270348),Wi=new t(null,"request-received","request-received",2110590540),Xi=new t(null,"update","update",1045576396),Yi=new t(null,"catch-block","catch-block",1175212748),of=new Ic(null,"validate","validate",1439230700,null),Zi=new t(null,"params-to-str","params-to-str",-934869108),$i=new Ic(null,"\x3e","\x3e",1085014381,null),Kh=new t(null,"fallback-impl","fallback-impl",-1501286995),aj=new t(null,"handlers","handlers",79528781),
Ua=new t(null,"flush-on-newline","flush-on-newline",-151457939),bj=new t(null,"extremes","extremes",1490048973),cj=new t(null,"parse-error","parse-error",255902478),dj=new t(null,"className","className",-1983287057),ej=new t(null,"no-op","no-op",-93046065),fj=new t(null,"prefix","prefix",-265908465),gj=new t(null,"headers","headers",-835030129),hj=new t(null,"high","high",2027297808),ij=new t(null,"error-handler","error-handler",-484945776),jj=new t(null,"small","small",2133478704),kj=new t(null,
"textarea","textarea",-650375824),lj=new t(null,"clip-path","clip-path",-439959120),mj=new t(null,"write","write",-1857649168),nj=new t(null,"stroke-linecap","stroke-linecap",-1201103248),uf=new Ic(null,"n","n",-2092305744,null),oj=new t(null,"div","div",1057191632),Va=new t(null,"readably","readably",1129599760),pj=new t(null,"summary","summary",380847952),qj=new Ic(null,"box","box",-1123515375,null),Ch=new t(null,"more-marker","more-marker",-14717935),rj=new t(null,"g","g",1738089905),tj=new t(null,
"filename","filename",-1428840783),uj=new Ic(null,"nil?","nil?",1612038930,null),vj=new t(null,"line","line",212345235),wj=new t(null,"weight","weight",-1262796205),xj=new Ic(null,"val","val",1769233139,null),yj=new Ic(null,"not","not",1044554643,null),zj=new t(null,"status","status",-1997798413),Aj=new t(null,"response-ready","response-ready",245208276),Ya=new t(null,"print-length","print-length",1931866356),Bj=new t(null,"writer","writer",-277568236),Cj=new t(null,"raw-data","raw-data",617791828),
Dj=new t(null,"label","label",1718410804),Ej=new t(null,"id","id",-1388402092),Fj=new t(null,"class","class",-2030961996),Gj=new t(null,"catch-exception","catch-exception",-1997306795),Hj=new t(null,"current","current",-1088038603),Ij=new t(null,"reader","reader",169660853),Jj=new t(null,"checked","checked",-50955819),Kj=new t(null,"defs","defs",1398449717),Lj=new t(null,"parse","parse",-1162164619),Mj=new Ic(null,"/","/",-1371932971,null),Nj=new t(null,"prev","prev",-1597069226),Oj=new t(null,"svg",
"svg",856789142),Pj=new Ic(null,"buf-or-n","buf-or-n",-1646815050,null),Qj=new t(null,"continue-block","continue-block",-1852047850),Rj=new t(null,"content-type","content-type",-508222634),Sj=new t(null,"low","low",-1601362409),Tj=new t(null,"d","d",1972142424),Uj=new t(null,"f","f",-1597136552),Vj=new t(null,"average","average",-492356168),Wj=new t(null,"error","error",-978969032),Xj=new t(null,"h2","h2",-372662728),Yj=new t(null,"exception","exception",-335277064),Zj=new t(null,"x1","x1",-1863922247),
ak=new t(null,"uri","uri",-774711847),bk=new t(null,"tag","tag",-1290361223),ck=new t(null,"interceptors","interceptors",-1546782951),dk=new t(null,"domain","domain",1847214937),ek=new t(null,"input","input",556931961),fk=new t(null,"json","json",1279968570),Ye=new Ic(null,"quote","quote",1377916282,null),gk=new t(null,"timeout","timeout",-318625318),hk=new t(null,"h1","h1",-1896887462),Xe=new t(null,"arglists","arglists",1661989754),ik=new t(null,"y2","y2",-718691301),We=new Ic(null,"nil-iter","nil-iter",
1101030523,null),jk=new t(null,"main","main",-2117802661),kk=new t(null,"body","body",-2049205669),lk=new t(null,"connection-established","connection-established",-1403749733),Jh=new t(null,"alt-impl","alt-impl",670969595),mk=new Ic(null,"fn-handler","fn-handler",648785851,null),nk=new t(null,"handler","handler",-195596612),Vh=new t(null,"keywordize-keys","keywordize-keys",1310784252),ok=new t(null,"rect","rect",-108902628),pk=new Ic(null,"takes","takes",298247964,null),qk=new Ic("impl","MAX-QUEUE-SIZE",
"impl/MAX-QUEUE-SIZE",1508600732,null),rk=new Ic(null,"deref","deref",1494944732,null),sk=new t(null,"p","p",151049309),tk=new t(null,"x2","x2",-1362513475),uk=new t(null,"with-credentials","with-credentials",-1163127235),vk=new t(null,"failed","failed",-1397425762),tf=new Ic(null,"number?","number?",-1747282210,null),wk=new t(null,"font-family","font-family",-667419874),xk=new t(null,"average-last-three","average-last-three",-1827264674),yk=new t(null,"height","height",1025178622),zk=new t(null,
"foreignObject","foreignObject",25502111),Ak=new t(null,"text","text",-1790561697),Bk=new Ic(null,"f","f",43394975,null);var Ck,Dk=function Dk(b,c){if(null!=b&&null!=b.Ld)return b.Ld(0,c);var d=Dk[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Dk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("ReadPort.take!",b);},Ek=function Ek(b,c,d){if(null!=b&&null!=b.fd)return b.fd(0,c,d);var e=Ek[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Ek._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("WritePort.put!",b);},Fk=function Fk(b){if(null!=b&&null!=b.ed)return b.ed();
var c=Fk[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Fk._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("Channel.close!",b);},Gk=function Gk(b){if(null!=b&&null!=b.le)return!0;var c=Gk[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Gk._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("Handler.active?",b);},Hk=function Hk(b){if(null!=b&&null!=b.me)return b.ha;var c=Hk[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Hk._;if(null!=c)return c.g?
c.g(b):c.call(null,b);throw v("Handler.commit",b);},Ik=function Ik(b,c){if(null!=b&&null!=b.ke)return b.ke(0,c);var d=Ik[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ik._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("Buffer.add!*",b);},Jk=function Jk(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jk.g(arguments[0]);case 2:return Jk.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),
w(c.length)].join(""));}};Jk.g=function(a){return a};Jk.a=function(a,b){if(null==b)throw Error([w("Assert failed: "),w(mf.v(F([Hc(yj,Hc(uj,di))],0)))].join(""));return Ik(a,b)};Jk.I=2;function Kk(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Lk(a,b,c,d){this.head=a;this.aa=b;this.length=c;this.j=d}Lk.prototype.pop=function(){if(0===this.length)return null;var a=this.j[this.aa];this.j[this.aa]=null;this.aa=(this.aa+1)%this.j.length;--this.length;return a};Lk.prototype.unshift=function(a){this.j[this.head]=a;this.head=(this.head+1)%this.j.length;this.length+=1;return null};function Mk(a,b){a.length+1===a.j.length&&a.resize();a.unshift(b)}
Lk.prototype.resize=function(){var a=Array(2*this.j.length);return this.aa<this.head?(Kk(this.j,this.aa,a,0,this.length),this.aa=0,this.head=this.length,this.j=a):this.aa>this.head?(Kk(this.j,this.aa,a,0,this.j.length-this.aa),Kk(this.j,0,a,this.j.length-this.aa,this.head),this.aa=0,this.head=this.length,this.j=a):this.aa===this.head?(this.head=this.aa=0,this.j=a):null};function Nk(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.g?b.g(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Ok(a){if(!(0<a))throw Error([w("Assert failed: "),w("Can't create a ring buffer of size 0"),w("\n"),w(mf.v(F([Hc($i,uf,0)],0)))].join(""));return new Lk(0,0,0,Array(a))}function Pk(a,b){this.X=a;this.n=b;this.o=2;this.J=0}function Qk(a){return a.X.length===a.n}Pk.prototype.ke=function(a,b){Mk(this.X,b);return this};Pk.prototype.Y=function(){return this.X.length};if("undefined"===typeof Rk)var Rk={};var Sk;a:{var Tk=ba.navigator;if(Tk){var Uk=Tk.userAgent;if(Uk){Sk=Uk;break a}}Sk=""}function Vk(a){return-1!=Sk.indexOf(a)};var Wk;
function Xk(){var a=ba.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!Vk("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=la(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!Vk("Trident")&&!Vk("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.de;c.de=null;a()}};return function(a){d.next={de:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){ba.setTimeout(a,0)}};var Yk=Ok(32),Zk=!1,$k=!1;al;function bl(){Zk=!0;$k=!1;for(var a=0;;){var b=Yk.pop();if(null!=b&&(b.G?b.G():b.call(null),1024>a)){a+=1;continue}break}Zk=!1;return 0<Yk.length?al.G?al.G():al.call(null):null}function al(){var a=$k;if(r(r(a)?Zk:a))return null;$k=!0;!ga(ba.setImmediate)||ba.Window&&ba.Window.prototype&&ba.Window.prototype.setImmediate==ba.setImmediate?(Wk||(Wk=Xk()),Wk(bl)):ba.setImmediate(bl)}function cl(a){Mk(Yk,a);al()};var dl,el=function el(b){"undefined"===typeof dl&&(dl=function(b,d,e){this.He=b;this.D=d;this.hf=e;this.o=425984;this.J=0},dl.prototype.S=function(b,d){return new dl(this.He,this.D,d)},dl.prototype.R=function(){return this.hf},dl.prototype.Fc=function(){return this.D},dl.Qd=function(){return new U(null,3,5,V,[id(qj,new q(null,1,[Xe,Hc(Ye,Hc(new U(null,1,5,V,[xj],null)))],null)),xj,Na.Gf],null)},dl.Jc=!0,dl.ac="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333",dl.gd=function(b,d){return hc(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels18333")});return new dl(el,b,W)};function fl(a,b){this.Pa=a;this.D=b}function gl(a){return Gk(a.Pa)}var hl=function hl(b){if(null!=b&&null!=b.je)return b.je();var c=hl[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=hl._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("MMC.abort",b);};function il(a,b,c,d,e,f,h){this.ic=a;this.jd=b;this.Wb=c;this.hd=d;this.X=e;this.closed=f;this.Za=h}
il.prototype.je=function(){for(;;){var a=this.Wb.pop();if(null!=a){var b=a.Pa;cl(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(b.ha,b,a.D,a,this))}break}Nk(this.Wb,cf());return Fk(this)};
il.prototype.fd=function(a,b,c){var d=this;if(null==b)throw Error([w("Assert failed: "),w("Can't put nil in on a channel"),w("\n"),w(mf.v(F([Hc(yj,Hc(uj,xj))],0)))].join(""));if(a=d.closed)return el(!a);if(r(function(){var a=d.X;return r(a)?gb(Qk(d.X)):a}())){for(c=kd(d.Za.a?d.Za.a(d.X,b):d.Za.call(null,d.X,b));;){if(0<d.ic.length&&0<Q(d.X)){var e=d.ic.pop(),f=e.ha,h=d.X.X.pop();cl(function(a,b){return function(){return a.g?a.g(b):a.call(null,b)}}(f,h,e,c,a,this))}break}c&&hl(this);return el(!0)}e=
function(){for(;;){var a=d.ic.pop();if(r(a)){if(r(!0))return a}else return null}}();if(r(e))return c=Hk(e),cl(function(a){return function(){return a.g?a.g(b):a.call(null,b)}}(c,e,a,this)),el(!0);64<d.hd?(d.hd=0,Nk(d.Wb,gl)):d.hd+=1;if(r(c.Kd(null))){if(!(1024>d.Wb.length))throw Error([w("Assert failed: "),w([w("No more than "),w(1024),w(" pending puts are allowed on a single channel."),w(" Consider using a windowed buffer.")].join("")),w("\n"),w(mf.v(F([Hc(ki,Hc(ei,hi),qk)],0)))].join(""));Mk(d.Wb,
new fl(c,b))}return null};
il.prototype.Ld=function(a,b){var c=this;if(null!=c.X&&0<Q(c.X)){for(var d=b.ha,e=el(c.X.X.pop());;){if(!r(Qk(c.X))){var f=c.Wb.pop();if(null!=f){var h=f.Pa,k=f.D;cl(function(a){return function(){return a.g?a.g(!0):a.call(null,!0)}}(h.ha,h,k,f,d,e,this));kd(c.Za.a?c.Za.a(c.X,k):c.Za.call(null,c.X,k))&&hl(this);continue}}break}return e}d=function(){for(;;){var a=c.Wb.pop();if(r(a)){if(Gk(a.Pa))return a}else return null}}();if(r(d))return e=Hk(d.Pa),cl(function(a){return function(){return a.g?a.g(!0):
a.call(null,!0)}}(e,d,this)),el(d.D);if(r(c.closed))return r(c.X)&&(c.Za.g?c.Za.g(c.X):c.Za.call(null,c.X)),r(r(!0)?b.ha:!0)?(d=function(){var a=c.X;return r(a)?0<Q(c.X):a}(),d=r(d)?c.X.X.pop():null,el(d)):null;64<c.jd?(c.jd=0,Nk(c.ic,Gk)):c.jd+=1;if(r(b.Kd(null))){if(!(1024>c.ic.length))throw Error([w("Assert failed: "),w([w("No more than "),w(1024),w(" pending takes are allowed on a single channel.")].join("")),w("\n"),w(mf.v(F([Hc(ki,Hc(ei,pk),qk)],0)))].join(""));Mk(c.ic,b)}return null};
il.prototype.ed=function(){var a=this;if(!a.closed)for(a.closed=!0,r(function(){var b=a.X;return r(b)?0===a.Wb.length:b}())&&(a.Za.g?a.Za.g(a.X):a.Za.call(null,a.X));;){var b=a.ic.pop();if(null==b)break;else{var c=b.ha,d=r(function(){var b=a.X;return r(b)?0<Q(a.X):b}())?a.X.X.pop():null;cl(function(a,b){return function(){return a.g?a.g(b):a.call(null,b)}}(c,d,b,this))}}return null};function jl(a){console.log(a);return null}
function kl(a,b){var c=(r(null)?null:jl).call(null,b);return null==c?a:Jk.a(a,c)}
function ll(a){return new il(Ok(32),0,Ok(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return kl(c,e)}}function d(c){try{return a.g?a.g(c):a.call(null,c)}catch(d){return kl(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.g=d;e.a=c;return e}()}(r(null)?null.g?null.g(Jk):null.call(null,Jk):Jk)}())};var ml,nl=function nl(b){"undefined"===typeof ml&&(ml=function(b,d,e){this.df=b;this.ha=d;this.gf=e;this.o=393216;this.J=0},ml.prototype.S=function(b,d){return new ml(this.df,this.ha,d)},ml.prototype.R=function(){return this.gf},ml.prototype.le=function(){return!0},ml.prototype.Kd=function(){return!0},ml.prototype.me=function(){return this.ha},ml.Qd=function(){return new U(null,3,5,V,[id(mk,new q(null,2,[ui,!0,Xe,Hc(Ye,Hc(new U(null,1,5,V,[Bk],null)))],null)),Bk,Na.Ff],null)},ml.Jc=!0,ml.ac="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270",
ml.gd=function(b,d){return hc(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers18270")});return new ml(nl,b,W)};function ol(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].ed(),b;}}function pl(a,b,c){c=c.Ld(0,nl(function(c){a[2]=c;a[1]=b;return ol(a)}));return r(c)?(a[2]=M.g?M.g(c):M.call(null,c),a[1]=b,Ui):null}function ql(a,b,c){b=b.fd(0,c,nl(function(b){a[2]=b;a[1]=16;return ol(a)}));return r(b)?(a[2]=M.g?M.g(b):M.call(null,b),a[1]=16,Ui):null}
function rl(a,b){var c=a[6];null!=b&&c.fd(0,b,nl(function(){return function(){return null}}(c)));c.ed();return c}function sl(a,b,c,d,e,f,h,k){this.eb=a;this.fb=b;this.ib=c;this.hb=d;this.mb=e;this.H=f;this.B=h;this.l=k;this.o=2229667594;this.J=8192}g=sl.prototype;g.N=function(a,b){return Cb.h(this,b,null)};
g.M=function(a,b,c){switch(b instanceof t?b.Ba:null){case "catch-block":return this.eb;case "catch-exception":return this.fb;case "finally-block":return this.ib;case "continue-block":return this.hb;case "prev":return this.mb;default:return D.h(this.B,b,c)}};
g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,Pe.a(new U(null,5,5,V,[new U(null,2,5,V,[Yi,this.eb],null),new U(null,2,5,V,[Gj,this.fb],null),new U(null,2,5,V,[Ci,this.ib],null),new U(null,2,5,V,[Qj,this.hb],null),new U(null,2,5,V,[Nj,this.mb],null)],null),this.B))};g.Aa=function(){return new mg(0,this,5,new U(null,5,5,V,[Yi,Gj,Ci,Qj,Nj],null),zc(this.B))};g.R=function(){return this.H};
g.sa=function(){return new sl(this.eb,this.fb,this.ib,this.hb,this.mb,this.H,this.B,this.l)};g.Y=function(){return 5+Q(this.B)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};
g.Ua=function(a,b){return Zd(new rh(null,new q(null,5,[Ci,null,Yi,null,Gj,null,Nj,null,Qj,null],null),null),b)?Gd.a(id(Df(W,this),this.H),b):new sl(this.eb,this.fb,this.ib,this.hb,this.mb,this.H,Ue(Gd.a(this.B,b)),null)};
g.Ha=function(a,b,c){return r(T.a?T.a(Yi,b):T.call(null,Yi,b))?new sl(c,this.fb,this.ib,this.hb,this.mb,this.H,this.B,null):r(T.a?T.a(Gj,b):T.call(null,Gj,b))?new sl(this.eb,c,this.ib,this.hb,this.mb,this.H,this.B,null):r(T.a?T.a(Ci,b):T.call(null,Ci,b))?new sl(this.eb,this.fb,c,this.hb,this.mb,this.H,this.B,null):r(T.a?T.a(Qj,b):T.call(null,Qj,b))?new sl(this.eb,this.fb,this.ib,c,this.mb,this.H,this.B,null):r(T.a?T.a(Nj,b):T.call(null,Nj,b))?new sl(this.eb,this.fb,this.ib,this.hb,c,this.H,this.B,
null):new sl(this.eb,this.fb,this.ib,this.hb,this.mb,this.H,Ed.h(this.B,b,c),null)};g.U=function(){return H(Pe.a(new U(null,5,5,V,[new U(null,2,5,V,[Yi,this.eb],null),new U(null,2,5,V,[Gj,this.fb],null),new U(null,2,5,V,[Ci,this.ib],null),new U(null,2,5,V,[Qj,this.hb],null),new U(null,2,5,V,[Nj,this.mb],null)],null),this.B))};g.S=function(a,b){return new sl(this.eb,this.fb,this.ib,this.hb,this.mb,b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};
function tl(a){for(;;){var b=a[4],c=Yi.g(b),d=Gj.g(b),e=a[5];if(r(function(){var a=e;return r(a)?gb(b):a}()))throw e;if(r(function(){var a=e;return r(a)?(a=c,r(a)?Jc.a(Bi,d)||e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Ed.v(b,Yi,null,F([Gj,null],0));break}if(r(function(){var a=e;return r(a)?gb(c)&&gb(Ci.g(b)):a}()))a[4]=Nj.g(b);else{if(r(function(){var a=e;return r(a)?(a=gb(c))?Ci.g(b):a:a}())){a[1]=Ci.g(b);a[4]=Ed.h(b,Ci,null);break}if(r(function(){var a=gb(e);return a?Ci.g(b):a}())){a[1]=
Ci.g(b);a[4]=Ed.h(b,Ci,null);break}if(gb(e)&&gb(Ci.g(b))){a[1]=Qj.g(b);a[4]=Nj.g(b);break}throw Error("No matching clause");}}};for(var ul=Array(1),vl=0;;)if(vl<ul.length)ul[vl]=null,vl+=1;else break;function wl(a){"undefined"===typeof Ck&&(Ck=function(a,c,d){this.ha=a;this.be=c;this.ff=d;this.o=393216;this.J=0},Ck.prototype.S=function(a,c){return new Ck(this.ha,this.be,c)},Ck.prototype.R=function(){return this.ff},Ck.prototype.le=function(){return!0},Ck.prototype.Kd=function(){return this.be},Ck.prototype.me=function(){return this.ha},Ck.Qd=function(){return new U(null,3,5,V,[Bk,ri,Na.Ef],null)},Ck.Jc=!0,Ck.ac="cljs.core.async/t_cljs$core$async15465",Ck.gd=function(a,c){return hc(c,"cljs.core.async/t_cljs$core$async15465")});
return new Ck(a,!0,W)}function xl(a){a=Jc.a(a,0)?null:a;if(r(null)&&!r(a))throw Error([w("Assert failed: "),w("buffer must be supplied when transducer is"),w("\n"),w(mf.v(F([Pj],0)))].join(""));a="number"===typeof a?new Pk(Ok(a),a):a;return ll(a)}function yl(a,b){var c=Dk(a,wl(b));if(r(c)){var d=M.g?M.g(c):M.call(null,c);r(!0)?b.g?b.g(d):b.call(null,d):cl(function(a){return function(){return b.g?b.g(a):b.call(null,a)}}(d,c))}return null}var zl;zl=wl(function(){return null});
function Al(a,b){var c=Ek(a,b,zl);return r(c)?M.g?M.g(c):M.call(null,c):!0}
function Bl(a){var b=ee(new U(null,1,5,V,[Cl],null)),c=xl(null),d=Q(b),e=Me(d),f=xl(1),h=kf.g?kf.g(null):kf.call(null,null),k=Ef(function(a,b,c,d,e,f){return function(h){return function(a,b,c,d,e,f){return function(a){d[h]=a;return 0===qf.a(f,le)?Al(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,h),new vh(null,0,d,1,null)),l=xl(1);cl(function(b,c,d,e,f,h,k,l){return function(){var P=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Ui)){d=
e;break a}}}catch(f){if(f instanceof Object)c[5]=f,tl(c),d=Ui;else throw f;}if(!T(d,Ui))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.G=c;d.g=b;return d}()}(function(b,c,d,e,f,h,k,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,Ui;if(1===f)return b[2]=
null,b[1]=2,Ui;if(4===f){var n=b[7],f=n<e;b[1]=r(f)?6:7;return Ui}return 15===f?(f=b[2],b[2]=f,b[1]=3,Ui):13===f?(f=Fk(d),b[2]=f,b[1]=15,Ui):6===f?(b[2]=null,b[1]=11,Ui):3===f?(f=b[2],rl(b,f)):12===f?(f=b[8],f=b[2],n=af(eb,f),b[8]=f,b[1]=r(n)?13:14,Ui):2===f?(f=nf.a?nf.a(k,e):nf.call(null,k,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,Ui):11===f?(n=b[7],b[4]=new sl(10,Object,null,9,b[4],null,null,null),f=c.g?c.g(n):c.call(null,n),n=l.g?l.g(n):l.call(null,n),f=yl(f,n),b[2]=f,tl(b),Ui):9===f?(n=b[7],b[10]=b[2],
b[7]=n+1,b[2]=null,b[1]=4,Ui):5===f?(b[11]=b[2],pl(b,12,h)):14===f?(f=b[8],f=z.a(a,f),ql(b,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,Ui):10===f?(n=b[2],f=qf.a(k,le),b[13]=n,b[2]=f,tl(b),Ui):8===f?(f=b[2],b[2]=f,b[1]=5,Ui):null}}(b,c,d,e,f,h,k,l),b,c,d,e,f,h,k,l)}(),Z=function(){var a=P.G?P.G():P.call(null);a[6]=b;return a}();return ol(Z)}}(l,b,c,d,e,f,h,k));return c};var Dl=VDOM.diff,El=VDOM.patch,Fl=VDOM.create;function Gl(a){return Bf(bf(eb),Bf(bf(Wd),Cf(a)))}function Hl(a,b,c){return new VDOM.VHtml(ue(a),Qh(b),Qh(c))}function Il(a,b,c){return new VDOM.VSvg(ue(a),Qh(b),Qh(c))}Jl;
var Kl=function Kl(b){if(null==b)return new VDOM.VText("");if(Wd(b))return Hl(oj,W,S.a(Kl,Gl(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(Jc.a(Oj,I(b)))return Jl.g?Jl.g(b):Jl.call(null,b);var c=R(b,0),d=R(b,1);b=te(b);return Hl(c,d,S.a(Kl,Gl(b)))},Jl=function Jl(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(Jc.a(zk,I(b))){var c=R(b,0),d=R(b,1);b=te(b);return Il(c,d,S.a(Kl,Gl(b)))}c=R(b,0);d=R(b,1);b=
te(b);return Il(c,d,S.a(Jl,Gl(b)))};
function Ll(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return kf.g?kf.g(a):kf.call(null,a)}(),c=function(){var a;a=M.g?M.g(b):M.call(null,b);a=Fl.g?Fl.g(a):Fl.call(null,a);return kf.g?kf.g(a):kf.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.G?a.G():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(M.g?M.g(c):M.call(null,c));return function(a,b,c){return function(d){var l=
Kl(d);d=function(){var b=M.g?M.g(a):M.call(null,a);return Dl.a?Dl.a(b,l):Dl.call(null,b,l)}();nf.a?nf.a(a,l):nf.call(null,a,l);d=function(a,b,c,d){return function(){return qf.h(d,El,b)}}(l,d,a,b,c);return c.g?c.g(d):c.call(null,d)}}(b,c,d)};function Ml(){var a=Nl,b=Ol,c=Pl,d=xl(null);Al(d,b);var e=xl(1);cl(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Ui)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,tl(c),d=Ui;else throw f;}if(!T(d,Ui))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.G=c;d.g=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return pl(d,2,c);if(2===f){var h=b,f=d[2];d[7]=f;d[8]=h;d[2]=null;d[1]=3;return Ui}return 3===f?(f=d[7],h=d[9],h=d[8],f=a.a?a.a(h,f):a.call(null,h,f),h=Al(e,f),d[9]=f,d[10]=h,pl(d,5,c)):4===f?(f=d[2],rl(d,f)):5===f?(h=d[9],f=d[2],d[7]=f,d[8]=h,d[2]=null,d[1]=3,Ui):null}}(d,e),d,e)}(),l=function(){var a=k.G?k.G():k.call(null);a[6]=d;return a}();return ol(l)}}(e,d));return d}
function Ql(){var a=Rl,b=Ll(),c=xl(1);cl(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Ui)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,tl(c),d=Ui;else throw f;}if(!T(d,Ui))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.G=c;d.g=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Ui):2===d?pl(c,4,a):3===d?(d=c[2],rl(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=r(d)?5:6,Ui):5===d?(d=c[7],d=b.g?b.g(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,Ui):6===d?(c[2]=null,c[1]=7,Ui):7===d?(d=c[2],c[2]=d,c[1]=3,Ui):null}}(c),c)}(),f=function(){var a=e.G?e.G():e.call(null);a[6]=c;return a}();return ol(f)}}(c));return c};var Sl=Vk("Opera")||Vk("OPR"),Tl=Vk("Trident")||Vk("MSIE"),Ul=Vk("Edge"),Vl=Vk("Gecko")&&!(-1!=Sk.toLowerCase().indexOf("webkit")&&!Vk("Edge"))&&!(Vk("Trident")||Vk("MSIE"))&&!Vk("Edge"),Wl=-1!=Sk.toLowerCase().indexOf("webkit")&&!Vk("Edge");function Xl(){var a=Sk;if(Vl)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Ul)return/Edge\/([\d\.]+)/.exec(a);if(Tl)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Wl)return/WebKit\/(\S+)/.exec(a)}function Yl(){var a=ba.document;return a?a.documentMode:void 0}
var Zl=function(){if(Sl&&ba.opera){var a=ba.opera.version;return ga(a)?a():a}var a="",b=Xl();b&&(a=b?b[1]:"");return Tl&&(b=Yl(),b>parseFloat(a))?String(b):a}(),$l={};
function bm(a){var b;if(!(b=$l[a])){b=0;for(var c=pa(String(Zl)).split("."),d=pa(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var h=c[f]||"",k=d[f]||"",l=RegExp("(\\d*)(\\D*)","g"),n=RegExp("(\\d*)(\\D*)","g");do{var p=l.exec(h)||["","",""],y=n.exec(k)||["","",""];if(0==p[0].length&&0==y[0].length)break;b=qa(0==p[1].length?0:parseInt(p[1],10),0==y[1].length?0:parseInt(y[1],10))||qa(0==p[2].length,0==y[2].length)||qa(p[2],y[2])}while(0==b)}b=$l[a]=0<=b}return b}
var cm=ba.document,dm=cm&&Tl?Yl()||("CSS1Compat"==cm.compatMode?parseInt(Zl,10):5):void 0;var em;(em=!Tl)||(em=9<=dm);var fm=em,gm=Tl&&!bm("9");!Wl||bm("528");Vl&&bm("1.9b")||Tl&&bm("8")||Sl&&bm("9.5")||Wl&&bm("528");Vl&&!bm("8")||Tl&&bm("9");function hm(){0!=im&&(this[ha]||(this[ha]=++ia));this.Od=this.Od;this.mf=this.mf}var im=0;hm.prototype.Od=!1;function jm(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.hc=!1;this.ze=!0}jm.prototype.stopPropagation=function(){this.hc=!0};jm.prototype.preventDefault=function(){this.defaultPrevented=!0;this.ze=!1};function km(a){km[" "](a);return a}km[" "]=ca;function lm(a,b){jm.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.Lc=this.state=null;a&&this.uc(a,b)}na(lm,jm);
lm.prototype.uc=function(a,b){var c=this.type=a.type;this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(Vl){var e;a:{try{km(d.nodeName);e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=Wl||void 0!==a.offsetX?a.offsetX:a.layerX;this.offsetY=Wl||void 0!==a.offsetY?a.offsetY:a.layerY;this.clientX=void 0!==a.clientX?a.clientX:a.pageX;this.clientY=void 0!==a.clientY?a.clientY:
a.pageY;this.screenX=a.screenX||0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;this.metaKey=a.metaKey;this.state=a.state;this.Lc=a;a.defaultPrevented&&this.preventDefault()};lm.prototype.stopPropagation=function(){lm.Ce.stopPropagation.call(this);this.Lc.stopPropagation?this.Lc.stopPropagation():this.Lc.cancelBubble=!0};
lm.prototype.preventDefault=function(){lm.Ce.preventDefault.call(this);var a=this.Lc;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,gm)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var mm="closure_listenable_"+(1E6*Math.random()|0),nm=0;function om(a,b,c,d,e){this.listener=a;this.qd=null;this.src=b;this.type=c;this.Dc=!!d;this.Pa=e;this.key=++nm;this.xc=this.ad=!1}function pm(a){a.xc=!0;a.listener=null;a.qd=null;a.src=null;a.Pa=null};function qm(a){this.src=a;this.Xa={};this.td=0}qm.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.Xa[f];a||(a=this.Xa[f]=[],this.td++);var h=rm(a,b,d,e);-1<h?(b=a[h],c||(b.ad=!1)):(b=new om(b,this.src,f,!!d,e),b.ad=c,a.push(b));return b};qm.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.Xa))return!1;var e=this.Xa[a];b=rm(e,b,c,d);return-1<b?(pm(e[b]),Da.splice.call(e,b,1),0==e.length&&(delete this.Xa[a],this.td--),!0):!1};
function sm(a,b){var c=b.type;if(c in a.Xa){var d=a.Xa[c],e=Ea(d,b),f;(f=0<=e)&&Da.splice.call(d,e,1);f&&(pm(b),0==a.Xa[c].length&&(delete a.Xa[c],a.td--))}}qm.prototype.Rd=function(a,b,c,d){a=this.Xa[a.toString()];var e=-1;a&&(e=rm(a,b,c,d));return-1<e?a[e]:null};qm.prototype.hasListener=function(a,b){var c=void 0!==a,d=c?a.toString():"",e=void 0!==b;return sa(this.Xa,function(a){for(var h=0;h<a.length;++h)if(!(c&&a[h].type!=d||e&&a[h].Dc!=b))return!0;return!1})};
function rm(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.xc&&f.listener==b&&f.Dc==!!c&&f.Pa==d)return e}return-1};var tm="closure_lm_"+(1E6*Math.random()|0),um={},vm=0;
function wm(a,b,c,d,e){if(da(b))for(var f=0;f<b.length;f++)wm(a,b[f],c,d,e);else if(c=xm(c),a&&a[mm])a.cc.add(String(b),c,!1,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,h=ym(a);h||(a[tm]=h=new qm(a));c=h.add(b,c,!1,d,e);if(!c.qd){d=zm();c.qd=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,f);else if(a.attachEvent)a.attachEvent(Am(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");vm++}}}
function zm(){var a=Bm,b=fm?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function Cm(a,b,c,d,e){if(da(b))for(var f=0;f<b.length;f++)Cm(a,b[f],c,d,e);else c=xm(c),a&&a[mm]?a.cc.remove(String(b),c,d,e):a&&(a=ym(a))&&(b=a.Rd(b,c,!!d,e))&&Dm(b)}
function Dm(a){if("number"!=typeof a&&a&&!a.xc){var b=a.src;if(b&&b[mm])sm(b.cc,a);else{var c=a.type,d=a.qd;b.removeEventListener?b.removeEventListener(c,d,a.Dc):b.detachEvent&&b.detachEvent(Am(c),d);vm--;(c=ym(b))?(sm(c,a),0==c.td&&(c.src=null,b[tm]=null)):pm(a)}}}function Am(a){return a in um?um[a]:um[a]="on"+a}function Em(a,b,c,d){var e=!0;if(a=ym(a))if(b=a.Xa[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.Dc==c&&!f.xc&&(f=Fm(f,d),e=e&&!1!==f)}return e}
function Fm(a,b){var c=a.listener,d=a.Pa||a.src;a.ad&&Dm(a);return c.call(d,b)}
function Bm(a,b){if(a.xc)return!0;if(!fm){var c;if(!(c=b))a:{c=["window","event"];for(var d=ba,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new lm(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(h){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,k=e.length-1;!c.hc&&0<=k;k--){c.currentTarget=e[k];var l=Em(e[k],f,!0,c),d=d&&l}for(k=0;!c.hc&&
k<e.length;k++)c.currentTarget=e[k],l=Em(e[k],f,!1,c),d=d&&l}return d}return Fm(a,new lm(b,this))}function ym(a){a=a[tm];return a instanceof qm?a:null}var Gm="__closure_events_fn_"+(1E9*Math.random()>>>0);function xm(a){if(ga(a))return a;a[Gm]||(a[Gm]=function(b){return a.handleEvent(b)});return a[Gm]};function Hm(){hm.call(this);this.cc=new qm(this);this.Ge=this;this.xe=null}na(Hm,hm);Hm.prototype[mm]=!0;g=Hm.prototype;g.addEventListener=function(a,b,c,d){wm(this,a,b,c,d)};g.removeEventListener=function(a,b,c,d){Cm(this,a,b,c,d)};
g.dispatchEvent=function(a){var b,c=this.xe;if(c)for(b=[];c;c=c.xe)b.push(c);var c=this.Ge,d=a.type||a;if(fa(a))a=new jm(a,c);else if(a instanceof jm)a.target=a.target||c;else{var e=a;a=new jm(d,c);wa(a,e)}var e=!0,f;if(b)for(var h=b.length-1;!a.hc&&0<=h;h--)f=a.currentTarget=b[h],e=Im(f,d,!0,a)&&e;a.hc||(f=a.currentTarget=c,e=Im(f,d,!0,a)&&e,a.hc||(e=Im(f,d,!1,a)&&e));if(b)for(h=0;!a.hc&&h<b.length;h++)f=a.currentTarget=b[h],e=Im(f,d,!1,a)&&e;return e};
function Im(a,b,c,d){b=a.cc.Xa[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var h=b[f];if(h&&!h.xc&&h.Dc==c){var k=h.listener,l=h.Pa||h.src;h.ad&&sm(a.cc,h);e=!1!==k.call(l,d)&&e}}return e&&0!=d.ze}g.Rd=function(a,b,c,d){return this.cc.Rd(String(a),b,c,d)};g.hasListener=function(a,b){return this.cc.hasListener(void 0!==a?String(a):void 0,b)};function Jm(a,b,c){if(ga(a))c&&(a=la(a,c));else if(a&&"function"==typeof a.handleEvent)a=la(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:ba.setTimeout(a,b||0)};function Km(a){a=String(a);if(/^\s*$/.test(a)?0:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,"")))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);}function Lm(){this.rd=void 0}
function Mm(a,b,c){if(null==b)c.push("null");else{if("object"==typeof b){if(da(b)){var d=b;b=d.length;c.push("[");for(var e="",f=0;f<b;f++)c.push(e),e=d[f],Mm(a,a.rd?a.rd.call(d,String(f),e):e,c),e=",";c.push("]");return}if(b instanceof String||b instanceof Number||b instanceof Boolean)b=b.valueOf();else{c.push("{");f="";for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(e=b[d],"function"!=typeof e&&(c.push(f),Nm(d,c),c.push(":"),Mm(a,a.rd?a.rd.call(b,d,e):e,c),f=","));c.push("}");return}}switch(typeof b){case "string":Nm(b,
c);break;case "number":c.push(isFinite(b)&&!isNaN(b)?b:"null");break;case "boolean":c.push(b);break;case "function":c.push("null");break;default:throw Error("Unknown type: "+typeof b);}}}var Om={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"},Pm=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
function Nm(a,b){b.push('"',a.replace(Pm,function(a){var b=Om[a];b||(b="\\u"+(a.charCodeAt(0)|65536).toString(16).substr(1),Om[a]=b);return b}),'"')};xa("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));function Qm(a){if("function"==typeof a.ld)return a.ld();if(fa(a))return a.split("");if(ea(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return ta(a)}
function Rm(a,b){if("function"==typeof a.forEach)a.forEach(b,void 0);else if(ea(a)||fa(a))Fa(a,b,void 0);else{var c;if("function"==typeof a.Ib)c=a.Ib();else if("function"!=typeof a.ld)if(ea(a)||fa(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=ua(a);else c=void 0;for(var d=Qm(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)}};function Sm(a,b){this.Jb={};this.Ia=[];this.Qb=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)}g=Sm.prototype;g.ld=function(){Tm(this);for(var a=[],b=0;b<this.Ia.length;b++)a.push(this.Jb[this.Ia[b]]);return a};g.Ib=function(){Tm(this);return this.Ia.concat()};
g.Oa=function(a,b){if(this===a)return!0;if(this.Qb!=a.Qb)return!1;var c=b||Um;Tm(this);for(var d,e=0;d=this.Ia[e];e++)if(!c(this.get(d),a.get(d)))return!1;return!0};function Um(a,b){return a===b}g.clear=function(){this.Jb={};this.Qb=this.Ia.length=0};g.remove=function(a){return Object.prototype.hasOwnProperty.call(this.Jb,a)?(delete this.Jb[a],this.Qb--,this.Ia.length>2*this.Qb&&Tm(this),!0):!1};
function Tm(a){if(a.Qb!=a.Ia.length){for(var b=0,c=0;b<a.Ia.length;){var d=a.Ia[b];Object.prototype.hasOwnProperty.call(a.Jb,d)&&(a.Ia[c++]=d);b++}a.Ia.length=c}if(a.Qb!=a.Ia.length){for(var e={},c=b=0;b<a.Ia.length;)d=a.Ia[b],Object.prototype.hasOwnProperty.call(e,d)||(a.Ia[c++]=d,e[d]=1),b++;a.Ia.length=c}}g.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.Jb,a)?this.Jb[a]:b};
g.set=function(a,b){Object.prototype.hasOwnProperty.call(this.Jb,a)||(this.Qb++,this.Ia.push(a));this.Jb[a]=b};g.addAll=function(a){var b;a instanceof Sm?(b=a.Ib(),a=a.ld()):(b=ua(a),a=ta(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};g.forEach=function(a,b){for(var c=this.Ib(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};g.clone=function(){return new Sm(this)};function Vm(a,b,c,d,e){this.reset(a,b,c,d,e)}Vm.prototype.pe=null;var Wm=0;Vm.prototype.reset=function(a,b,c,d,e){"number"==typeof e||Wm++;d||ma();this.Sc=a;this.kf=b;delete this.pe};Vm.prototype.Be=function(a){this.Sc=a};function Xm(a){this.ue=a;this.re=this.Fd=this.Sc=this.od=null}function Ym(a,b){this.name=a;this.value=b}Ym.prototype.toString=function(){return this.name};var Zm=new Ym("SEVERE",1E3),$m=new Ym("INFO",800),an=new Ym("CONFIG",700),bn=new Ym("FINE",500);g=Xm.prototype;g.getName=function(){return this.ue};g.getParent=function(){return this.od};g.Be=function(a){this.Sc=a};function cn(a){if(a.Sc)return a.Sc;if(a.od)return cn(a.od);Ca("Root logger has no level set.");return null}
g.log=function(a,b,c){if(a.value>=cn(this).value)for(ga(b)&&(b=b()),a=new Vm(a,String(b),this.ue),c&&(a.pe=c),c="log:"+a.kf,ba.console&&(ba.console.timeStamp?ba.console.timeStamp(c):ba.console.markTimeline&&ba.console.markTimeline(c)),ba.msWriteProfilerMark&&ba.msWriteProfilerMark(c),c=this;c;){b=c;var d=a;if(b.re)for(var e=0,f=void 0;f=b.re[e];e++)f(d);c=c.getParent()}};g.info=function(a,b){this.log($m,a,b)};var dn={},en=null;
function fn(a){en||(en=new Xm(""),dn[""]=en,en.Be(an));var b;if(!(b=dn[a])){b=new Xm(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=fn(a.substr(0,c));c.Fd||(c.Fd={});c.Fd[d]=b;b.od=c;dn[a]=b}return b};function gn(a,b){a&&a.log(bn,b,void 0)};function hn(){}hn.prototype.ce=null;function jn(a){var b;(b=a.ce)||(b={},kn(a)&&(b[0]=!0,b[1]=!0),b=a.ce=b);return b};var ln;function mn(){}na(mn,hn);function nn(a){return(a=kn(a))?new ActiveXObject(a):new XMLHttpRequest}function kn(a){if(!a.se&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.se=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.se}ln=new mn;var on=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function pn(a){if(qn){qn=!1;var b=ba.location;if(b){var c=b.href;if(c&&(c=(c=pn(c)[3]||null)?decodeURI(c):c)&&c!=b.hostname)throw qn=!0,Error();}}return a.match(on)}var qn=Wl;function rn(a){Hm.call(this);this.headers=new Sm;this.xd=a||null;this.lc=!1;this.wd=this.ea=null;this.te=this.nd="";this.wc=0;this.Rc="";this.Oc=this.Sd=this.md=this.Pd=!1;this.zc=0;this.sd=null;this.ye=sn;this.vd=this.Fe=!1}na(rn,Hm);var sn="",tn=rn.prototype,un=fn("goog.net.XhrIo");tn.ab=un;var vn=/^https?$/i,wn=["POST","PUT"];g=rn.prototype;
g.send=function(a,b,c,d){if(this.ea)throw Error("[goog.net.XhrIo] Object is active with another request\x3d"+this.nd+"; newUri\x3d"+a);b=b?b.toUpperCase():"GET";this.nd=a;this.Rc="";this.wc=0;this.te=b;this.Pd=!1;this.lc=!0;this.ea=this.xd?nn(this.xd):nn(ln);this.wd=this.xd?jn(this.xd):jn(ln);this.ea.onreadystatechange=la(this.we,this);try{gn(this.ab,xn(this,"Opening Xhr")),this.Sd=!0,this.ea.open(b,String(a),!0),this.Sd=!1}catch(e){gn(this.ab,xn(this,"Error opening Xhr: "+e.message));yn(this,e);
return}a=c||"";var f=this.headers.clone();d&&Rm(d,function(a,b){f.set(b,a)});d=Ga(f.Ib());c=ba.FormData&&a instanceof ba.FormData;!(0<=Ea(wn,b))||d||c||f.set("Content-Type","application/x-www-form-urlencoded;charset\x3dutf-8");f.forEach(function(a,b){this.ea.setRequestHeader(b,a)},this);this.ye&&(this.ea.responseType=this.ye);"withCredentials"in this.ea&&(this.ea.withCredentials=this.Fe);try{zn(this),0<this.zc&&(this.vd=An(this.ea),gn(this.ab,xn(this,"Will abort after "+this.zc+"ms if incomplete, xhr2 "+
this.vd)),this.vd?(this.ea.timeout=this.zc,this.ea.ontimeout=la(this.De,this)):this.sd=Jm(this.De,this.zc,this)),gn(this.ab,xn(this,"Sending request")),this.md=!0,this.ea.send(a),this.md=!1}catch(h){gn(this.ab,xn(this,"Send error: "+h.message)),yn(this,h)}};function An(a){return Tl&&bm(9)&&"number"==typeof a.timeout&&void 0!==a.ontimeout}function Ha(a){return"content-type"==a.toLowerCase()}
g.De=function(){"undefined"!=typeof aa&&this.ea&&(this.Rc="Timed out after "+this.zc+"ms, aborting",this.wc=8,gn(this.ab,xn(this,this.Rc)),this.dispatchEvent("timeout"),this.abort(8))};function yn(a,b){a.lc=!1;a.ea&&(a.Oc=!0,a.ea.abort(),a.Oc=!1);a.Rc=b;a.wc=5;Bn(a);Cn(a)}function Bn(a){a.Pd||(a.Pd=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))}
g.abort=function(a){this.ea&&this.lc&&(gn(this.ab,xn(this,"Aborting")),this.lc=!1,this.Oc=!0,this.ea.abort(),this.Oc=!1,this.wc=a||7,this.dispatchEvent("complete"),this.dispatchEvent("abort"),Cn(this))};g.we=function(){this.Od||(this.Sd||this.md||this.Oc?Dn(this):this.nf())};g.nf=function(){Dn(this)};
function Dn(a){if(a.lc&&"undefined"!=typeof aa)if(a.wd[1]&&4==En(a)&&2==Fn(a))gn(a.ab,xn(a,"Local request error detected and ignored"));else if(a.md&&4==En(a))Jm(a.we,0,a);else if(a.dispatchEvent("readystatechange"),4==En(a)){gn(a.ab,xn(a,"Request complete"));a.lc=!1;try{var b=Fn(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=pn(String(a.nd))[1]||null;if(!f&&ba.self&&ba.self.location)var h=ba.self.location.protocol,
f=h.substr(0,h.length-1);e=!vn.test(f?f.toLowerCase():"")}d=e}d?(a.dispatchEvent("complete"),a.dispatchEvent("success")):(a.wc=6,a.Rc=Gn(a)+" ["+Fn(a)+"]",Bn(a))}finally{Cn(a)}}}function Cn(a){if(a.ea){zn(a);var b=a.ea,c=a.wd[0]?ca:null;a.ea=null;a.wd=null;a.dispatchEvent("ready");try{b.onreadystatechange=c}catch(d){(a=a.ab)&&a.log(Zm,"Problem encountered resetting onreadystatechange: "+d.message,void 0)}}}
function zn(a){a.ea&&a.vd&&(a.ea.ontimeout=null);"number"==typeof a.sd&&(ba.clearTimeout(a.sd),a.sd=null)}function En(a){return a.ea?a.ea.readyState:0}function Fn(a){try{return 2<En(a)?a.ea.status:-1}catch(b){return-1}}function Gn(a){try{return 2<En(a)?a.ea.statusText:""}catch(b){return gn(a.ab,"Can not get status: "+b.message),""}}g.getResponseHeader=function(a){return this.ea&&4==En(this)?this.ea.getResponseHeader(a):void 0};
g.getAllResponseHeaders=function(){return this.ea&&4==En(this)?this.ea.getAllResponseHeaders():""};function xn(a,b){return b+" ["+a.te+" "+a.nd+" "+Fn(a)+"]"};var Hn=function Hn(b,c,d){if(null!=b&&null!=b.zd)return b.zd(b,c,d);var e=Hn[m(null==b?null:b)];if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);e=Hn._;if(null!=e)return e.h?e.h(b,c,d):e.call(null,b,c,d);throw v("AjaxImpl.-js-ajax-request",b);},In=function In(b){if(null!=b&&null!=b.Cd)return b.Cd(b);var c=In[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=In._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("AjaxResponse.-status",b);},Jn=function Jn(b){if(null!=b&&null!=b.Dd)return b.Dd(b);
var c=Jn[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Jn._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("AjaxResponse.-status-text",b);},Kn=function Kn(b){if(null!=b&&null!=b.Ad)return b.Ad(b);var c=Kn[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Kn._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("AjaxResponse.-body",b);},Ln=function Ln(b,c){if(null!=b&&null!=b.Bd)return b.Bd(b,c);var d=Ln[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,
b,c);d=Ln._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("AjaxResponse.-get-response-header",b);},Mn=function Mn(b){if(null!=b&&null!=b.Ed)return b.Ed(b);var c=Mn[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Mn._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("AjaxResponse.-was-aborted",b);},Nn=function Nn(b,c){if(null!=b&&null!=b.Bc)return b.Bc(b,c);var d=Nn[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Nn._;if(null!=d)return d.a?d.a(b,c):
d.call(null,b,c);throw v("Interceptor.-process-request",b);},On=function On(b,c){if(null!=b&&null!=b.Cc)return b.Cc(b,c);var d=On[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=On._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("Interceptor.-process-response",b);};g=XMLHttpRequest.prototype;
g.zd=function(a,b,c){var d=null!=b&&(b.o&64||b.na)?z.a(gd,b):b,e=D.a(d,ak),f=D.a(d,zi);a=D.a(d,kk);var h=D.a(d,gj),k=D.h(d,gk,0),l=D.h(d,uk,!1),n=D.a(d,Ji);this.withCredentials=l;this.onreadystatechange=function(a){return function(b){return Jc.a(Aj,(new q(null,5,[0,vi,1,lk,2,Wi,3,Ri,4,Aj],null)).call(null,b.target.readyState))?c.g?c.g(a):c.call(null,a):null}}(this,b,d,e,f,a,h,k,l,n);this.open(f,e,!0);this.timeout=k;b=Vi.g(n);r(b)&&(this.responseType=ue(b));b=H(h);h=null;for(e=d=0;;)if(e<d)k=h.ba(null,
e),f=R(k,0),k=R(k,1),this.setRequestHeader(f,k),e+=1;else if(b=H(b))Sd(b)?(d=tc(b),b=uc(b),h=d,d=Q(d)):(d=I(b),h=R(d,0),d=R(d,1),this.setRequestHeader(h,d),b=L(b),h=null,d=0),e=0;else break;this.send(r(a)?a:"");return this};g.Ad=function(){return this.response};g.Cd=function(){return this.status};g.Dd=function(){return this.statusText};g.Bd=function(a,b){return this.getResponseHeader(b)};g.Ed=function(){return Jc.a(0,this.readyState)};var Pn="undefined"!=typeof Object.keys?function(a){return Object.keys(a)}:function(a){return ua(a)},Qn="undefined"!=typeof Array.isArray?function(a){return Array.isArray(a)}:function(a){return"array"===m(a)};function Rn(){return Math.round(15*Math.random()).toString(16)};var Sn=1;function Tn(a,b){if(null==a)return null==b;if(a===b)return!0;if("object"===typeof a){if(Qn(a)){if(Qn(b)&&a.length===b.length){for(var c=0;c<a.length;c++)if(!Tn(a[c],b[c]))return!1;return!0}return!1}if(a.$a)return a.$a(b);if(null!=b&&"object"===typeof b){if(b.$a)return b.$a(a);var c=0,d=Pn(b).length,e;for(e in a)if(a.hasOwnProperty(e)&&(c++,!b.hasOwnProperty(e)||!Tn(a[e],b[e])))return!1;return c===d}}return!1}function Un(a,b){return a^b+2654435769+(a<<6)+(a>>2)}var Vn={},Wn=0;
function Xn(a){var b=0;if(null!=a.forEach)a.forEach(function(a,c){b=(b+(Yn(c)^Yn(a)))%4503599627370496});else for(var c=Pn(a),d=0;d<c.length;d++)var e=c[d],f=a[e],b=(b+(Yn(e)^Yn(f)))%4503599627370496;return b}function Zn(a){var b=0;if(Qn(a))for(var c=0;c<a.length;c++)b=Un(b,Yn(a[c]));else a.forEach&&a.forEach(function(a){b=Un(b,Yn(a))});return b}
function Yn(a){if(null==a)return 0;switch(typeof a){case "number":return a;case "boolean":return!0===a?1:0;case "string":var b=Vn[a];if(null==b){for(var c=b=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=4294967296;Wn++;256<=Wn&&(Vn={},Wn=1);Vn[a]=b}a=b;return a;case "function":return b=a.transit$hashCode$,b||(b=Sn,"undefined"!=typeof Object.defineProperty?Object.defineProperty(a,"transit$hashCode$",{value:b,enumerable:!1}):a.transit$hashCode$=b,Sn++),b;default:return a instanceof Date?a.valueOf():Qn(a)?
Zn(a):a.gb?a.gb():Xn(a)}};function $n(a,b){this.ra=a|0;this.ia=b|0}var ao,bo,co,eo,fo,go,ho={};function io(a){if(-128<=a&&128>a){var b=ho[a];if(b)return b}b=new $n(a|0,0>a?-1:0);-128<=a&&128>a&&(ho[a]=b);return b}function jo(a){isNaN(a)||!isFinite(a)?a=ko():a<=-lo?a=mo():a+1>=lo?(eo||(eo=no(-1,2147483647)),a=eo):a=0>a?oo(jo(-a)):new $n(a%po|0,a/po|0);return a}function no(a,b){return new $n(a,b)}
function qo(a,b){if(0==a.length)throw Error("number format error: empty string");var c=b||10;if(2>c||36<c)throw Error("radix out of range: "+c);if("-"==a.charAt(0))return oo(qo(a.substring(1),c));if(0<=a.indexOf("-"))throw Error('number format error: interior "-" character: '+a);for(var d=jo(Math.pow(c,8)),e=ko(),f=0;f<a.length;f+=8){var h=Math.min(8,a.length-f),k=parseInt(a.substring(f,f+h),c);8>h?(h=jo(Math.pow(c,h)),e=e.multiply(h).add(jo(k))):(e=e.multiply(d),e=e.add(jo(k)))}return e}
var po=4294967296,lo=po*po/2;function ko(){ao||(ao=io(0));return ao}function ro(){bo||(bo=io(1));return bo}function so(){co||(co=io(-1));return co}function mo(){fo||(fo=no(0,-2147483648));return fo}function to(){go||(go=io(16777216));return go}function uo(a){return a.ia*po+(0<=a.ra?a.ra:po+a.ra)}g=$n.prototype;
g.toString=function(a){a=a||10;if(2>a||36<a)throw Error("radix out of range: "+a);if(vo(this))return"0";if(0>this.ia){if(this.Oa(mo())){var b=jo(a),c=wo(this,b),b=xo(c.multiply(b),this);return c.toString(a)+b.ra.toString(a)}return"-"+oo(this).toString(a)}for(var c=jo(Math.pow(a,6)),b=this,d="";;){var e=wo(b,c),f=xo(b,e.multiply(c)).ra.toString(a),b=e;if(vo(b))return f+d;for(;6>f.length;)f="0"+f;d=""+f+d}};function vo(a){return 0==a.ia&&0==a.ra}g.Oa=function(a){return this.ia==a.ia&&this.ra==a.ra};
g.compare=function(a){if(this.Oa(a))return 0;var b=0>this.ia,c=0>a.ia;return b&&!c?-1:!b&&c?1:0>xo(this,a).ia?-1:1};function oo(a){return a.Oa(mo())?mo():no(~a.ra,~a.ia).add(ro())}g.add=function(a){var b=this.ia>>>16,c=this.ia&65535,d=this.ra>>>16,e=a.ia>>>16,f=a.ia&65535,h=a.ra>>>16,k;k=0+((this.ra&65535)+(a.ra&65535));a=0+(k>>>16);a+=d+h;d=0+(a>>>16);d+=c+f;c=0+(d>>>16);c=c+(b+e)&65535;return no((a&65535)<<16|k&65535,c<<16|d&65535)};function xo(a,b){return a.add(oo(b))}
g.multiply=function(a){if(vo(this)||vo(a))return ko();if(this.Oa(mo()))return 1==(a.ra&1)?mo():ko();if(a.Oa(mo()))return 1==(this.ra&1)?mo():ko();if(0>this.ia)return 0>a.ia?oo(this).multiply(oo(a)):oo(oo(this).multiply(a));if(0>a.ia)return oo(this.multiply(oo(a)));var b=to();if(b=0>this.compare(b))b=to(),b=0>a.compare(b);if(b)return jo(uo(this)*uo(a));var b=this.ia>>>16,c=this.ia&65535,d=this.ra>>>16,e=this.ra&65535,f=a.ia>>>16,h=a.ia&65535,k=a.ra>>>16;a=a.ra&65535;var l,n,p,y;y=0+e*a;p=0+(y>>>16);
p+=d*a;n=0+(p>>>16);p=(p&65535)+e*k;n+=p>>>16;p&=65535;n+=c*a;l=0+(n>>>16);n=(n&65535)+d*k;l+=n>>>16;n&=65535;n+=e*h;l+=n>>>16;n&=65535;l=l+(b*a+c*k+d*h+e*f)&65535;return no(p<<16|y&65535,l<<16|n)};
function wo(a,b){if(vo(b))throw Error("division by zero");if(vo(a))return ko();if(a.Oa(mo())){if(b.Oa(ro())||b.Oa(so()))return mo();if(b.Oa(mo()))return ro();var c;c=1;if(0==c)c=a;else{var d=a.ia;c=32>c?no(a.ra>>>c|d<<32-c,d>>c):no(d>>c-32,0<=d?0:-1)}c=wo(c,b).shiftLeft(1);if(c.Oa(ko()))return 0>b.ia?ro():so();d=xo(a,b.multiply(c));return c.add(wo(d,b))}if(b.Oa(mo()))return ko();if(0>a.ia)return 0>b.ia?wo(oo(a),oo(b)):oo(wo(oo(a),b));if(0>b.ia)return oo(wo(a,oo(b)));for(var e=ko(),d=a;0<=d.compare(b);){c=
Math.max(1,Math.floor(uo(d)/uo(b)));for(var f=Math.ceil(Math.log(c)/Math.LN2),f=48>=f?1:Math.pow(2,f-48),h=jo(c),k=h.multiply(b);0>k.ia||0<k.compare(d);)c-=f,h=jo(c),k=h.multiply(b);vo(h)&&(h=ro());e=e.add(h);d=xo(d,k)}return e}g.shiftLeft=function(a){a&=63;if(0==a)return this;var b=this.ra;return 32>a?no(b<<a,this.ia<<a|b>>>32-a):no(0,b<<a-32)};function yo(a,b){b&=63;if(0==b)return a;var c=a.ia;return 32>b?no(a.ra>>>b|c<<32-b,c>>>b):32==b?no(c,0):no(c>>>b-32,0)};var zo="undefined"!=typeof Symbol?Symbol.iterator:"@@iterator";function Ao(a,b){this.tag=a;this.Z=b;this.la=-1}Ao.prototype.toString=function(){return"[TaggedValue: "+this.tag+", "+this.Z+"]"};Ao.prototype.equiv=function(a){return Tn(this,a)};Ao.prototype.equiv=Ao.prototype.equiv;Ao.prototype.$a=function(a){return a instanceof Ao?this.tag===a.tag&&Tn(this.Z,a.Z):!1};Ao.prototype.gb=function(){-1===this.la&&(this.la=Un(Yn(this.tag),Yn(this.Z)));return this.la};function Bo(a,b){return new Ao(a,b)}
var Co=qo("9007199254740991"),Do=qo("-9007199254740991");$n.prototype.equiv=function(a){return Tn(this,a)};$n.prototype.equiv=$n.prototype.equiv;$n.prototype.$a=function(a){return a instanceof $n&&this.Oa(a)};$n.prototype.gb=function(){return this.ra};function Eo(a){this.ta=a;this.la=-1}Eo.prototype.toString=function(){return":"+this.ta};Eo.prototype.namespace=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(0,a):null};
Eo.prototype.name=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(a+1,this.ta.length):this.ta};Eo.prototype.equiv=function(a){return Tn(this,a)};Eo.prototype.equiv=Eo.prototype.equiv;Eo.prototype.$a=function(a){return a instanceof Eo&&this.ta==a.ta};Eo.prototype.gb=function(){-1===this.la&&(this.la=Yn(this.ta));return this.la};function Fo(a){this.ta=a;this.la=-1}Fo.prototype.namespace=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(0,a):null};
Fo.prototype.name=function(){var a=this.ta.indexOf("/");return-1!=a?this.ta.substring(a+1,this.ta.length):this.ta};Fo.prototype.toString=function(){return this.ta};Fo.prototype.equiv=function(a){return Tn(this,a)};Fo.prototype.equiv=Fo.prototype.equiv;Fo.prototype.$a=function(a){return a instanceof Fo&&this.ta==a.ta};Fo.prototype.gb=function(){-1===this.la&&(this.la=Yn(this.ta));return this.la};
function Go(a,b,c){var d="";c=c||b+1;for(var e=8*(7-b),f=io(255).shiftLeft(e);b<c;b++,e-=8,f=yo(f,8)){var h=yo(no(a.ra&f.ra,a.ia&f.ia),e).toString(16);1==h.length&&(h="0"+h);d+=h}return d}function Ho(a,b){this.Wa=a;this.Ya=b;this.la=-1}Ho.prototype.toString=function(){var a,b=this.Wa,c=this.Ya;a=""+(Go(b,0,4)+"-");a+=Go(b,4,6)+"-";a+=Go(b,6,8)+"-";a+=Go(c,0,2)+"-";return a+=Go(c,2,8)};Ho.prototype.equiv=function(a){return Tn(this,a)};Ho.prototype.equiv=Ho.prototype.equiv;
Ho.prototype.$a=function(a){return a instanceof Ho&&this.Wa.Oa(a.Wa)&&this.Ya.Oa(a.Ya)};Ho.prototype.gb=function(){-1===this.la&&(this.la=Yn(this.toString()));return this.la};Date.prototype.$a=function(a){return a instanceof Date?this.valueOf()===a.valueOf():!1};Date.prototype.gb=function(){return this.valueOf()};function Io(a,b){this.entries=a;this.type=b||0;this.fa=0}
Io.prototype.next=function(){if(this.fa<this.entries.length){var a=null,a=0===this.type?this.entries[this.fa]:1===this.type?this.entries[this.fa+1]:[this.entries[this.fa],this.entries[this.fa+1]],a={value:a,done:!1};this.fa+=2;return a}return{value:null,done:!0}};Io.prototype.next=Io.prototype.next;Io.prototype[zo]=function(){return this};function Jo(a,b){this.map=a;this.type=b||0;this.keys=this.map.Ib();this.fa=0;this.Xb=null;this.Mb=0}
Jo.prototype.next=function(){if(this.fa<this.map.size){null!=this.Xb&&this.Mb<this.Xb.length||(this.Xb=this.map.map[this.keys[this.fa]],this.Mb=0);var a=null,a=0===this.type?this.Xb[this.Mb]:1===this.type?this.Xb[this.Mb+1]:[this.Xb[this.Mb],this.Xb[this.Mb+1]],a={value:a,done:!1};this.fa++;this.Mb+=2;return a}return{value:null,done:!0}};Jo.prototype.next=Jo.prototype.next;Jo.prototype[zo]=function(){return this};
function Ko(a,b){if(a instanceof Lo&&(b instanceof Mo||b instanceof Lo)){if(a.size!==b.size)return!1;for(var c in a.map)for(var d=a.map[c],e=0;e<d.length;e+=2)if(!Tn(d[e+1],b.get(d[e])))return!1;return!0}if(a instanceof Mo&&(b instanceof Mo||b instanceof Lo)){if(a.size!==b.size)return!1;c=a.ja;for(e=0;e<c.length;e+=2)if(!Tn(c[e+1],b.get(c[e])))return!1;return!0}if(null!=b&&"object"===typeof b&&(e=Pn(b),c=e.length,a.size===c)){for(d=0;d<c;d++){var f=e[d];if(!a.has(f)||!Tn(b[f],a.get(f)))return!1}return!0}return!1}
function No(a){return null==a?"null":da(a)?"["+a.toString()+"]":fa(a)?'"'+a+'"':a.toString()}function Oo(a){var b=0,c="TransitMap {";a.forEach(function(d,e){c+=No(e)+" \x3d\x3e "+No(d);b<a.size-1&&(c+=", ");b++});return c+"}"}function Po(a){var b=0,c="TransitSet {";a.forEach(function(d){c+=No(d);b<a.size-1&&(c+=", ");b++});return c+"}"}function Mo(a){this.ja=a;this.ga=null;this.la=-1;this.size=a.length/2;this.Wd=0}Mo.prototype.toString=function(){return Oo(this)};Mo.prototype.inspect=function(){return this.toString()};
function Qo(a){if(a.ga)throw Error("Invalid operation, already converted");if(8>a.size)return!1;a.Wd++;return 32<a.Wd?(a.ga=Ro(a.ja,!1,!0),a.ja=[],!0):!1}Mo.prototype.clear=function(){this.la=-1;this.ga?this.ga.clear():this.ja=[];this.size=0};Mo.prototype.clear=Mo.prototype.clear;Mo.prototype.keys=function(){return this.ga?this.ga.keys():new Io(this.ja,0)};Mo.prototype.keys=Mo.prototype.keys;
Mo.prototype.ec=function(){if(this.ga)return this.ga.ec();for(var a=[],b=0,c=0;c<this.ja.length;b++,c+=2)a[b]=this.ja[c];return a};Mo.prototype.keySet=Mo.prototype.ec;Mo.prototype.entries=function(){return this.ga?this.ga.entries():new Io(this.ja,2)};Mo.prototype.entries=Mo.prototype.entries;Mo.prototype.values=function(){return this.ga?this.ga.values():new Io(this.ja,1)};Mo.prototype.values=Mo.prototype.values;
Mo.prototype.forEach=function(a){if(this.ga)this.ga.forEach(a);else for(var b=0;b<this.ja.length;b+=2)a(this.ja[b+1],this.ja[b])};Mo.prototype.forEach=Mo.prototype.forEach;Mo.prototype.get=function(a,b){if(this.ga)return this.ga.get(a);if(Qo(this))return this.get(a);for(var c=0;c<this.ja.length;c+=2)if(Tn(this.ja[c],a))return this.ja[c+1];return b};Mo.prototype.get=Mo.prototype.get;
Mo.prototype.has=function(a){if(this.ga)return this.ga.has(a);if(Qo(this))return this.has(a);for(var b=0;b<this.ja.length;b+=2)if(Tn(this.ja[b],a))return!0;return!1};Mo.prototype.has=Mo.prototype.has;Mo.prototype.set=function(a,b){this.la=-1;if(this.ga)this.ga.set(a,b),this.size=this.ga.size;else{for(var c=0;c<this.ja.length;c+=2)if(Tn(this.ja[c],a)){this.ja[c+1]=b;return}this.ja.push(a);this.ja.push(b);this.size++;32<this.size&&(this.ga=Ro(this.ja,!1,!0),this.ja=null)}};Mo.prototype.set=Mo.prototype.set;
Mo.prototype["delete"]=function(a){this.la=-1;if(this.ga)return a=this.ga["delete"](a),this.size=this.ga.size,a;for(var b=0;b<this.ja.length;b+=2)if(Tn(this.ja[b],a))return a=this.ja[b+1],this.ja.splice(b,2),this.size--,a};Mo.prototype.clone=function(){var a=Ro();this.forEach(function(b,c){a.set(c,b)});return a};Mo.prototype.clone=Mo.prototype.clone;Mo.prototype[zo]=function(){return this.entries()};Mo.prototype.gb=function(){if(this.ga)return this.ga.gb();-1===this.la&&(this.la=Xn(this));return this.la};
Mo.prototype.$a=function(a){return this.ga?Ko(this.ga,a):Ko(this,a)};function Lo(a,b,c){this.map=b||{};this.kc=a||[];this.size=c||0;this.la=-1}Lo.prototype.toString=function(){return Oo(this)};Lo.prototype.inspect=function(){return this.toString()};Lo.prototype.clear=function(){this.la=-1;this.map={};this.kc=[];this.size=0};Lo.prototype.clear=Lo.prototype.clear;Lo.prototype.Ib=function(){return null!=this.kc?this.kc:Pn(this.map)};
Lo.prototype["delete"]=function(a){this.la=-1;this.kc=null;for(var b=Yn(a),c=this.map[b],d=0;d<c.length;d+=2)if(Tn(a,c[d]))return a=c[d+1],c.splice(d,2),0===c.length&&delete this.map[b],this.size--,a};Lo.prototype.entries=function(){return new Jo(this,2)};Lo.prototype.entries=Lo.prototype.entries;Lo.prototype.forEach=function(a){for(var b=this.Ib(),c=0;c<b.length;c++)for(var d=this.map[b[c]],e=0;e<d.length;e+=2)a(d[e+1],d[e],this)};Lo.prototype.forEach=Lo.prototype.forEach;
Lo.prototype.get=function(a,b){var c=Yn(a),c=this.map[c];if(null!=c)for(var d=0;d<c.length;d+=2){if(Tn(a,c[d]))return c[d+1]}else return b};Lo.prototype.get=Lo.prototype.get;Lo.prototype.has=function(a){var b=Yn(a),b=this.map[b];if(null!=b)for(var c=0;c<b.length;c+=2)if(Tn(a,b[c]))return!0;return!1};Lo.prototype.has=Lo.prototype.has;Lo.prototype.keys=function(){return new Jo(this,0)};Lo.prototype.keys=Lo.prototype.keys;
Lo.prototype.ec=function(){for(var a=this.Ib(),b=[],c=0;c<a.length;c++)for(var d=this.map[a[c]],e=0;e<d.length;e+=2)b.push(d[e]);return b};Lo.prototype.keySet=Lo.prototype.ec;Lo.prototype.set=function(a,b){this.la=-1;var c=Yn(a),d=this.map[c];if(null==d)this.kc&&this.kc.push(c),this.map[c]=[a,b],this.size++;else{for(var c=!0,e=0;e<d.length;e+=2)if(Tn(b,d[e])){c=!1;d[e]=b;break}c&&(d.push(a),d.push(b),this.size++)}};Lo.prototype.set=Lo.prototype.set;
Lo.prototype.values=function(){return new Jo(this,1)};Lo.prototype.values=Lo.prototype.values;Lo.prototype.clone=function(){var a=Ro();this.forEach(function(b,c){a.set(c,b)});return a};Lo.prototype.clone=Lo.prototype.clone;Lo.prototype[zo]=function(){return this.entries()};Lo.prototype.gb=function(){-1===this.la&&(this.la=Xn(this));return this.la};Lo.prototype.$a=function(a){return Ko(this,a)};
function Ro(a,b,c){a=a||[];b=!1===b?b:!0;if((!0!==c||!c)&&64>=a.length){if(b){var d=a;a=[];for(b=0;b<d.length;b+=2){var e=!1;for(c=0;c<a.length;c+=2)if(Tn(a[c],d[b])){a[c+1]=d[b+1];e=!0;break}e||(a.push(d[b]),a.push(d[b+1]))}}return new Mo(a)}var d={},e=[],f=0;for(b=0;b<a.length;b+=2){c=Yn(a[b]);var h=d[c];if(null==h)e.push(c),d[c]=[a[b],a[b+1]],f++;else{var k=!0;for(c=0;c<h.length;c+=2)if(Tn(h[c],a[b])){h[c+1]=a[b+1];k=!1;break}k&&(h.push(a[b]),h.push(a[b+1]),f++)}}return new Lo(e,d,f)}
function So(a){this.map=a;this.size=a.size}So.prototype.toString=function(){return Po(this)};So.prototype.inspect=function(){return this.toString()};So.prototype.add=function(a){this.map.set(a,a);this.size=this.map.size};So.prototype.add=So.prototype.add;So.prototype.clear=function(){this.map=new Lo;this.size=0};So.prototype.clear=So.prototype.clear;So.prototype["delete"]=function(a){a=this.map["delete"](a);this.size=this.map.size;return a};So.prototype.entries=function(){return this.map.entries()};
So.prototype.entries=So.prototype.entries;So.prototype.forEach=function(a){var b=this;this.map.forEach(function(c,d){a(d,b)})};So.prototype.forEach=So.prototype.forEach;So.prototype.has=function(a){return this.map.has(a)};So.prototype.has=So.prototype.has;So.prototype.keys=function(){return this.map.keys()};So.prototype.keys=So.prototype.keys;So.prototype.ec=function(){return this.map.ec()};So.prototype.keySet=So.prototype.ec;So.prototype.values=function(){return this.map.values()};
So.prototype.values=So.prototype.values;So.prototype.clone=function(){var a=To();this.forEach(function(b){a.add(b)});return a};So.prototype.clone=So.prototype.clone;So.prototype[zo]=function(){return this.values()};So.prototype.$a=function(a){if(a instanceof So){if(this.size===a.size)return Tn(this.map,a.map)}else return!1};So.prototype.gb=function(){return Yn(this.map)};
function To(a){a=a||[];for(var b={},c=[],d=0,e=0;e<a.length;e++){var f=Yn(a[e]),h=b[f];if(null==h)c.push(f),b[f]=[a[e],a[e]],d++;else{for(var f=!0,k=0;k<h.length;k+=2)if(Tn(h[k],a[e])){f=!1;break}f&&(h.push(a[e]),h.push(a[e]),d++)}}return new So(new Lo(c,b,d))};function Uo(a,b){if(3<a.length){if(b)return!0;var c=a.charAt(1);return"~"===a.charAt(0)?":"===c||"$"===c||"#"===c:!1}return!1}function Vo(a){var b=Math.floor(a/44);a=String.fromCharCode(a%44+48);return 0===b?"^"+a:"^"+String.fromCharCode(b+48)+a}function Wo(){this.Je=this.Mc=this.fa=0;this.cache={}}
Wo.prototype.write=function(a,b){if(Uo(a,b)){4096===this.Je?(this.clear(),this.Mc=0,this.cache={}):1936===this.fa&&this.clear();var c=this.cache[a];return null==c?(this.cache[a]=[Vo(this.fa),this.Mc],this.fa++,a):c[1]!=this.Mc?(c[1]=this.Mc,c[0]=Vo(this.fa),this.fa++,a):c[0]}return a};Wo.prototype.clear=function(){this.fa=0;this.Mc++};function Xo(){this.fa=0;this.cache=[]}Xo.prototype.write=function(a){1936==this.fa&&(this.fa=0);this.cache[this.fa]=a;this.fa++;return a};
Xo.prototype.read=function(a){return this.cache[2===a.length?a.charCodeAt(1)-48:44*(a.charCodeAt(1)-48)+(a.charCodeAt(2)-48)]};Xo.prototype.clear=function(){this.fa=0};function Yo(a){this.Ka=a}
function Zo(a){this.options=a||{};this.ya={};for(var b in this.Kc.ya)this.ya[b]=this.Kc.ya[b];for(b in this.options.handlers){a:{switch(b){case "_":case "s":case "?":case "i":case "d":case "b":case "'":case "array":case "map":a=!0;break a}a=!1}if(a)throw Error('Cannot override handler for ground type "'+b+'"');this.ya[b]=this.options.handlers[b]}this.pd=null!=this.options.preferStrings?this.options.preferStrings:this.Kc.pd;this.Ud=null!=this.options.preferBuffers?this.options.preferBuffers:this.Kc.Ud;
this.Nd=this.options.defaultHandler||this.Kc.Nd;this.bb=this.options.mapBuilder;this.mc=this.options.arrayBuilder}
Zo.prototype.Kc={ya:{_:function(){return null},"?":function(a){return"t"===a},b:function(a,b){var c;if(b&&!1===b.Ud||"undefined"==typeof Buffer)if("undefined"!=typeof Uint8Array){if("undefined"!=typeof atob)c=atob(a);else{c=String(a).replace(/=+$/,"");if(1==c.length%4)throw Error("'atob' failed: The string to be decoded is not correctly encoded.");for(var d=0,e,f,h=0,k="";f=c.charAt(h++);~f&&(e=d%4?64*e+f:f,d++%4)?k+=String.fromCharCode(255&e>>(-2*d&6)):0)f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".indexOf(f);
c=k}d=c.length;e=new Uint8Array(d);for(f=0;f<d;f++)e[f]=c.charCodeAt(f);c=e}else c=Bo("b",a);else c=new Buffer(a,"base64");return c},i:function(a){"number"===typeof a||a instanceof $n||(a=qo(a,10),a=0<a.compare(Co)||0>a.compare(Do)?a:uo(a));return a},n:function(a){return Bo("n",a)},d:function(a){return parseFloat(a)},f:function(a){return Bo("f",a)},c:function(a){return a},":":function(a){return new Eo(a)},$:function(a){return new Fo(a)},r:function(a){return Bo("r",a)},z:function(a){a:switch(a){case "-INF":a=
-Infinity;break a;case "INF":a=Infinity;break a;case "NaN":a=NaN;break a;default:throw Error("Invalid special double value "+a);}return a},"'":function(a){return a},m:function(a){a="number"===typeof a?a:parseInt(a,10);return new Date(a)},t:function(a){return new Date(a)},u:function(a){a=a.replace(/-/g,"");for(var b=null,c=null,d=c=0,e=24,f=0,f=c=0,e=24;8>f;f+=2,e-=8)c|=parseInt(a.substring(f,f+2),16)<<e;d=0;f=8;for(e=24;16>f;f+=2,e-=8)d|=parseInt(a.substring(f,f+2),16)<<e;b=no(d,c);c=0;f=16;for(e=
24;24>f;f+=2,e-=8)c|=parseInt(a.substring(f,f+2),16)<<e;d=0;for(e=f=24;32>f;f+=2,e-=8)d|=parseInt(a.substring(f,f+2),16)<<e;c=no(d,c);return new Ho(b,c)},set:function(a){return To(a)},list:function(a){return Bo("list",a)},link:function(a){return Bo("link",a)},cmap:function(a){return Ro(a,!1)}},Nd:function(a,b){return Bo(a,b)},pd:!0,Ud:!0};
Zo.prototype.decode=function(a,b,c,d){if(null==a)return null;switch(typeof a){case "string":return Uo(a,c)?(a=$o(this,a),b&&b.write(a,c),b=a):b="^"===a.charAt(0)&&" "!==a.charAt(1)?b.read(a,c):$o(this,a),b;case "object":if(Qn(a))if("^ "===a[0])if(this.bb)if(17>a.length&&this.bb.dc){d=[];for(c=1;c<a.length;c+=2)d.push(this.decode(a[c],b,!0,!1)),d.push(this.decode(a[c+1],b,!1,!1));b=this.bb.dc(d,a)}else{d=this.bb.uc(a);for(c=1;c<a.length;c+=2)d=this.bb.add(d,this.decode(a[c],b,!0,!1),this.decode(a[c+
1],b,!1,!1),a);b=this.bb.kd(d,a)}else{d=[];for(c=1;c<a.length;c+=2)d.push(this.decode(a[c],b,!0,!1)),d.push(this.decode(a[c+1],b,!1,!1));b=Ro(d,!1)}else b=ap(this,a,b,c,d);else{c=Pn(a);var e=c[0];if((d=1==c.length?this.decode(e,b,!1,!1):null)&&d instanceof Yo)a=a[e],c=this.ya[d.Ka],b=null!=c?c(this.decode(a,b,!1,!0),this):Bo(d.Ka,this.decode(a,b,!1,!1));else if(this.bb)if(16>c.length&&this.bb.dc){var f=[];for(d=0;d<c.length;d++)e=c[d],f.push(this.decode(e,b,!0,!1)),f.push(this.decode(a[e],b,!1,!1));
b=this.bb.dc(f,a)}else{f=this.bb.uc(a);for(d=0;d<c.length;d++)e=c[d],f=this.bb.add(f,this.decode(e,b,!0,!1),this.decode(a[e],b,!1,!1),a);b=this.bb.kd(f,a)}else{f=[];for(d=0;d<c.length;d++)e=c[d],f.push(this.decode(e,b,!0,!1)),f.push(this.decode(a[e],b,!1,!1));b=Ro(f,!1)}}return b}return a};Zo.prototype.decode=Zo.prototype.decode;
function ap(a,b,c,d,e){if(e){var f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return f}f=c&&c.fa;if(2===b.length&&"string"===typeof b[0]&&(e=a.decode(b[0],c,!1,!1))&&e instanceof Yo)return b=b[1],f=a.ya[e.Ka],null!=f?f=f(a.decode(b,c,d,!0),a):Bo(e.Ka,a.decode(b,c,d,!1));c&&f!=c.fa&&(c.fa=f);if(a.mc){if(32>=b.length&&a.mc.dc){f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return a.mc.dc(f,b)}f=a.mc.uc(b);for(e=0;e<b.length;e++)f=a.mc.add(f,a.decode(b[e],c,d,!1),b);return a.mc.kd(f,
b)}f=[];for(e=0;e<b.length;e++)f.push(a.decode(b[e],c,d,!1));return f}function $o(a,b){if("~"===b.charAt(0)){var c=b.charAt(1);if("~"===c||"^"===c||"`"===c)return b.substring(1);if("#"===c)return new Yo(b.substring(2));var d=a.ya[c];return null==d?a.Nd(c,b.substring(2)):d(b.substring(2),a)}return b};function bp(a){this.bf=new Zo(a)}function cp(a,b){this.qf=a;this.options=b||{};this.cache=this.options.cache?this.options.cache:new Xo}cp.prototype.read=function(a){var b=this.cache;a=this.qf.bf.decode(JSON.parse(a),b);this.cache.clear();return a};cp.prototype.read=cp.prototype.read;var dp=0,ep=(8|3&Math.round(14*Math.random())).toString(16),fp="transit$guid$"+(Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+"-"+Rn()+Rn()+Rn()+Rn()+"-4"+Rn()+Rn()+Rn()+"-"+ep+Rn()+Rn()+Rn()+"-"+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn()+Rn());
function gp(a){if(null==a)return"null";if(a===String)return"string";if(a===Boolean)return"boolean";if(a===Number)return"number";if(a===Array)return"array";if(a===Object)return"map";var b=a[fp];null==b&&("undefined"!=typeof Object.defineProperty?(b=++dp,Object.defineProperty(a,fp,{value:b,enumerable:!1})):a[fp]=b=++dp);return b}function hp(a,b){for(var c=a.toString(),d=c.length;d<b;d++)c="0"+c;return c}function ip(){}ip.prototype.tag=function(){return"_"};ip.prototype.Z=function(){return null};
ip.prototype.pa=function(){return"null"};function jp(){}jp.prototype.tag=function(){return"s"};jp.prototype.Z=function(a){return a};jp.prototype.pa=function(a){return a};function kp(){}kp.prototype.tag=function(){return"i"};kp.prototype.Z=function(a){return a};kp.prototype.pa=function(a){return a.toString()};function lp(){}lp.prototype.tag=function(){return"i"};lp.prototype.Z=function(a){return a.toString()};lp.prototype.pa=function(a){return a.toString()};function mp(){}mp.prototype.tag=function(){return"?"};
mp.prototype.Z=function(a){return a};mp.prototype.pa=function(a){return a.toString()};function np(){}np.prototype.tag=function(){return"array"};np.prototype.Z=function(a){return a};np.prototype.pa=function(){return null};function op(){}op.prototype.tag=function(){return"map"};op.prototype.Z=function(a){return a};op.prototype.pa=function(){return null};function pp(){}pp.prototype.tag=function(){return"t"};
pp.prototype.Z=function(a){return a.getUTCFullYear()+"-"+hp(a.getUTCMonth()+1,2)+"-"+hp(a.getUTCDate(),2)+"T"+hp(a.getUTCHours(),2)+":"+hp(a.getUTCMinutes(),2)+":"+hp(a.getUTCSeconds(),2)+"."+hp(a.getUTCMilliseconds(),3)+"Z"};pp.prototype.pa=function(a,b){return b.Z(a)};function qp(){}qp.prototype.tag=function(){return"m"};qp.prototype.Z=function(a){return a.valueOf()};qp.prototype.pa=function(a){return a.valueOf().toString()};function rp(){}rp.prototype.tag=function(){return"u"};rp.prototype.Z=function(a){return a.toString()};
rp.prototype.pa=function(a){return a.toString()};function up(){}up.prototype.tag=function(){return":"};up.prototype.Z=function(a){return a.ta};up.prototype.pa=function(a,b){return b.Z(a)};function vp(){}vp.prototype.tag=function(){return"$"};vp.prototype.Z=function(a){return a.ta};vp.prototype.pa=function(a,b){return b.Z(a)};function wp(){}wp.prototype.tag=function(a){return a.tag};wp.prototype.Z=function(a){return a.Z};wp.prototype.pa=function(){return null};function xp(){}xp.prototype.tag=function(){return"set"};
xp.prototype.Z=function(a){var b=[];a.forEach(function(a){b.push(a)});return Bo("array",b)};xp.prototype.pa=function(){return null};function yp(){}yp.prototype.tag=function(){return"map"};yp.prototype.Z=function(a){return a};yp.prototype.pa=function(){return null};function zp(){}zp.prototype.tag=function(){return"map"};zp.prototype.Z=function(a){return a};zp.prototype.pa=function(){return null};function Ap(){}Ap.prototype.tag=function(){return"b"};Ap.prototype.Z=function(a){return a.toString("base64")};
Ap.prototype.pa=function(){return null};function Bp(){}Bp.prototype.tag=function(){return"b"};
Bp.prototype.Z=function(a){for(var b=0,c=a.length,d="",e=null;b<c;)e=a.subarray(b,Math.min(b+32768,c)),d+=String.fromCharCode.apply(null,e),b+=32768;var f;if("undefined"!=typeof btoa)f=btoa(d);else{a=String(d);c=0;d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d";for(e="";a.charAt(c|0)||(d="\x3d",c%1);e+=d.charAt(63&f>>8-c%1*8)){b=a.charCodeAt(c+=.75);if(255<b)throw Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");f=f<<8|b}f=
e}return f};Bp.prototype.pa=function(){return null};
function Cp(){this.ya={};this.set(null,new ip);this.set(String,new jp);this.set(Number,new kp);this.set($n,new lp);this.set(Boolean,new mp);this.set(Array,new np);this.set(Object,new op);this.set(Date,new qp);this.set(Ho,new rp);this.set(Eo,new up);this.set(Fo,new vp);this.set(Ao,new wp);this.set(So,new xp);this.set(Mo,new yp);this.set(Lo,new zp);"undefined"!=typeof Buffer&&this.set(Buffer,new Ap);"undefined"!=typeof Uint8Array&&this.set(Uint8Array,new Bp)}
Cp.prototype.get=function(a){var b=null,b="string"===typeof a?this.ya[a]:this.ya[gp(a)];return null!=b?b:this.ya["default"]};Cp.prototype.get=Cp.prototype.get;Cp.prototype.set=function(a,b){var c;if(c="string"===typeof a)a:{switch(a){case "null":case "string":case "boolean":case "number":case "array":case "map":c=!1;break a}c=!0}c?this.ya[a]=b:this.ya[gp(a)]=b};function Dp(a){this.Ub=a||{};this.pd=null!=this.Ub.preferStrings?this.Ub.preferStrings:!0;this.ve=this.Ub.objectBuilder||null;this.ya=new Cp;if(a=this.Ub.handlers){if(Qn(a)||!a.forEach)throw Error('transit writer "handlers" option must be a map');var b=this;a.forEach(function(a,d){if(void 0!==d)b.ya.set(d,a);else throw Error("Cannot create handler for JavaScript undefined");})}this.Nc=this.Ub.handlerForForeign;this.ud=this.Ub.unpack||function(a){return a instanceof Mo&&null===a.ga?a.ja:!1};this.Wc=
this.Ub&&this.Ub.verbose||!1}Dp.prototype.Pa=function(a){var b=this.ya.get(null==a?null:a.constructor);return null!=b?b:(a=a&&a.transitTag)?this.ya.get(a):null};function Ep(a,b,c,d,e){a=a+b+c;return e?e.write(a,d):a}function Fp(a,b,c){var d=[];if(Qn(b))for(var e=0;e<b.length;e++)d.push(Gp(a,b[e],!1,c));else b.forEach(function(b){d.push(Gp(a,b,!1,c))});return d}function Hp(a,b){if("string"!==typeof b){var c=a.Pa(b);return c&&1===c.tag(b).length}return!0}
function Ip(a,b){var c=a.ud(b),d=!0;if(c){for(var e=0;e<c.length&&(d=Hp(a,c[e]),d);e+=2);return d}if(b.keys&&(c=b.keys(),e=null,c.next)){for(e=c.next();!e.done;){d=Hp(a,e.value);if(!d)break;e=c.next()}return d}if(b.forEach)return b.forEach(function(b,c){d=d&&Hp(a,c)}),d;throw Error("Cannot walk keys of object type "+(null==b?null:b.constructor).name);}
function Jp(a){if(a.constructor.transit$isObject)return!0;var b=a.constructor.toString(),b=b.substr(9),b=b.substr(0,b.indexOf("("));isObject="Object"==b;"undefined"!=typeof Object.defineProperty?Object.defineProperty(a.constructor,"transit$isObject",{value:isObject,enumerable:!1}):a.constructor.transit$isObject=isObject;return isObject}
function Kp(a,b,c){var d=null,e=null,f=null,d=null,h=0;if(b.constructor===Object||null!=b.forEach||a.Nc&&Jp(b)){if(a.Wc){if(null!=b.forEach)if(Ip(a,b)){var k={};b.forEach(function(b,d){k[Gp(a,d,!0,!1)]=Gp(a,b,!1,c)})}else{d=a.ud(b);e=[];f=Ep("~#","cmap","",!0,c);if(d)for(;h<d.length;h+=2)e.push(Gp(a,d[h],!1,!1)),e.push(Gp(a,d[h+1],!1,c));else b.forEach(function(b,d){e.push(Gp(a,d,!1,!1));e.push(Gp(a,b,!1,c))});k={};k[f]=e}else for(d=Pn(b),k={};h<d.length;h++)k[Gp(a,d[h],!0,!1)]=Gp(a,b[d[h]],!1,c);
return k}if(null!=b.forEach){if(Ip(a,b)){d=a.ud(b);k=["^ "];if(d)for(;h<d.length;h+=2)k.push(Gp(a,d[h],!0,c)),k.push(Gp(a,d[h+1],!1,c));else b.forEach(function(b,d){k.push(Gp(a,d,!0,c));k.push(Gp(a,b,!1,c))});return k}d=a.ud(b);e=[];f=Ep("~#","cmap","",!0,c);if(d)for(;h<d.length;h+=2)e.push(Gp(a,d[h],!1,c)),e.push(Gp(a,d[h+1],!1,c));else b.forEach(function(b,d){e.push(Gp(a,d,!1,c));e.push(Gp(a,b,!1,c))});return[f,e]}k=["^ "];for(d=Pn(b);h<d.length;h++)k.push(Gp(a,d[h],!0,c)),k.push(Gp(a,b[d[h]],!1,
c));return k}if(null!=a.ve)return a.ve(b,function(b){return Gp(a,b,!0,c)},function(b){return Gp(a,b,!1,c)});h=(null==b?null:b.constructor).name;d=Error("Cannot write "+h);d.data={Td:b,type:h};throw d;}
function Gp(a,b,c,d){var e=a.Pa(b)||(a.Nc?a.Nc(b,a.ya):null),f=e?e.tag(b):null,h=e?e.Z(b):null;if(null!=e&&null!=f)switch(f){case "_":return c?Ep("~","_","",c,d):null;case "s":return 0<h.length?(a=h.charAt(0),a="~"===a||"^"===a||"`"===a?"~"+h:h):a=h,Ep("","",a,c,d);case "?":return c?Ep("~","?",h.toString()[0],c,d):h;case "i":return Infinity===h?Ep("~","z","INF",c,d):-Infinity===h?Ep("~","z","-INF",c,d):isNaN(h)?Ep("~","z","NaN",c,d):c||"string"===typeof h||h instanceof $n?Ep("~","i",h.toString(),
c,d):h;case "d":return c?Ep(h.sf,"d",h,c,d):h;case "b":return Ep("~","b",h,c,d);case "'":return a.Wc?(b={},c=Ep("~#","'","",!0,d),b[c]=Gp(a,h,!1,d),d=b):d=[Ep("~#","'","",!0,d),Gp(a,h,!1,d)],d;case "array":return Fp(a,h,d);case "map":return Kp(a,h,d);default:a:{if(1===f.length){if("string"===typeof h){d=Ep("~",f,h,c,d);break a}if(c||a.pd){(a=a.Wc&&new pp)?(f=a.tag(b),h=a.pa(b,a)):h=e.pa(b,e);if(null!==h){d=Ep("~",f,h,c,d);break a}d=Error('Tag "'+f+'" cannot be encoded as string');d.data={tag:f,Z:h,
Td:b};throw d;}}b=f;c=h;a.Wc?(h={},h[Ep("~#",b,"",!0,d)]=Gp(a,c,!1,d),d=h):d=[Ep("~#",b,"",!0,d),Gp(a,c,!1,d)]}return d}else throw d=(null==b?null:b.constructor).name,a=Error("Cannot write "+d),a.data={Td:b,type:d},a;}function Lp(a,b){var c=a.Pa(b)||(a.Nc?a.Nc(b,a.ya):null);if(null!=c)return 1===c.tag(b).length?Bo("'",b):b;var c=(null==b?null:b.constructor).name,d=Error("Cannot write "+c);d.data={Td:b,type:c};throw d;}
function Mp(a,b){this.Ac=a;this.options=b||{};this.cache=!1===this.options.cache?null:this.options.cache?this.options.cache:new Wo}Mp.prototype.ef=function(){return this.Ac};Mp.prototype.marshaller=Mp.prototype.ef;Mp.prototype.write=function(a,b){var c=null,d=b||{},c=d.asMapKey||!1,e=this.Ac.Wc?!1:this.cache;!1===d.marshalTop?c=Gp(this.Ac,a,c,e):(d=this.Ac,c=JSON.stringify(Gp(d,Lp(d,a),c,e)));null!=this.cache&&this.cache.clear();return c};Mp.prototype.write=Mp.prototype.write;
Mp.prototype.register=function(a,b){this.Ac.ya.set(a,b)};Mp.prototype.register=Mp.prototype.register;function Np(a,b){if("json"===a||"json-verbose"===a||null==a){var c=new bp(b);return new cp(c,b)}throw Error("Cannot create reader of type "+a);}function Op(a,b){if("json"===a||"json-verbose"===a||null==a){"json-verbose"===a&&(null==b&&(b={}),b.verbose=!0);var c=new Dp(b);return new Mp(c,b)}c=Error('Type must be "json"');c.data={type:a};throw c;};Wh.prototype.F=function(a,b){return b instanceof Wh?this.ob===b.ob:b instanceof Ho?this.ob===b.toString():!1};Wh.prototype.Yb=!0;Wh.prototype.sb=function(a,b){if(b instanceof Wh||b instanceof Ho)return Kc(this.toString(),b.toString());throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};Ho.prototype.Yb=!0;Ho.prototype.sb=function(a,b){if(b instanceof Wh||b instanceof Ho)return Kc(this.toString(),b.toString());throw Error([w("Cannot compare "),w(this),w(" to "),w(b)].join(""));};
$n.prototype.F=function(a,b){return this.equiv(b)};Ho.prototype.F=function(a,b){return b instanceof Wh?$b(b,this):this.equiv(b)};Ao.prototype.F=function(a,b){return this.equiv(b)};$n.prototype.Jd=!0;$n.prototype.P=function(){return Yn.g?Yn.g(this):Yn.call(null,this)};Ho.prototype.Jd=!0;Ho.prototype.P=function(){return Rc(this.toString())};Ao.prototype.Jd=!0;Ao.prototype.P=function(){return Yn.g?Yn.g(this):Yn.call(null,this)};Ho.prototype.da=!0;
Ho.prototype.O=function(a,b){return hc(b,[w('#uuid "'),w(this.toString()),w('"')].join(""))};function Pp(a,b){for(var c=H(Td(b)),d=null,e=0,f=0;;)if(f<e){var h=d.ba(null,f);a[h]=b[h];f+=1}else if(c=H(c))d=c,Sd(d)?(c=tc(d),f=uc(d),d=c,e=Q(c),c=f):(c=I(d),a[c]=b[c],c=L(d),d=null,e=0),f=0;else break;return a}function Qp(){}Qp.prototype.uc=function(){return kc(W)};Qp.prototype.add=function(a,b,c){return oc(a,b,c)};Qp.prototype.kd=function(a){return mc(a)};
Qp.prototype.dc=function(a){return zg.h?zg.h(a,!0,!0):zg.call(null,a,!0,!0)};function Rp(){}Rp.prototype.uc=function(){return kc(Ad)};Rp.prototype.add=function(a,b){return Re.a(a,b)};Rp.prototype.kd=function(a){return mc(a)};Rp.prototype.dc=function(a){return Zf.a?Zf.a(a,!0):Zf.call(null,a,!0)};
function Sp(a){var b=ue(fk);a=Pp({handlers:Qh(oh.v(F([new q(null,5,["$",function(){return function(a){return Uc.g(a)}}(b),":",function(){return function(a){return Ee.g(a)}}(b),"set",function(){return function(a){return Df(sh,a)}}(b),"list",function(){return function(a){return Df(J,a.reverse())}}(b),"cmap",function(){return function(a){for(var b=0,e=kc(W);;)if(b<a.length)var f=b+2,e=oc(e,a[b],a[b+1]),b=f;else return mc(e)}}(b)],null),aj.g(a)],0))),mapBuilder:new Qp,arrayBuilder:new Rp,prefersStrings:!1},
Qh(Gd.a(a,aj)));return Np.a?Np.a(b,a):Np.call(null,b,a)}function Tp(){}Tp.prototype.tag=function(){return":"};Tp.prototype.Z=function(a){return a.Ba};Tp.prototype.pa=function(a){return a.Ba};function Up(){}Up.prototype.tag=function(){return"$"};Up.prototype.Z=function(a){return a.Ka};Up.prototype.pa=function(a){return a.Ka};function Vp(){}Vp.prototype.tag=function(){return"list"};
Vp.prototype.Z=function(a){var b=[];a=H(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e);b.push(f);e+=1}else if(a=H(a))c=a,Sd(c)?(a=tc(c),e=uc(c),c=a,d=Q(a),a=e):(a=I(c),b.push(a),a=L(c),c=null,d=0),e=0;else break;return Bo.a?Bo.a("array",b):Bo.call(null,"array",b)};Vp.prototype.pa=function(){return null};function Wp(){}Wp.prototype.tag=function(){return"map"};Wp.prototype.Z=function(a){return a};Wp.prototype.pa=function(){return null};function Xp(){}Xp.prototype.tag=function(){return"set"};
Xp.prototype.Z=function(a){var b=[];a=H(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e);b.push(f);e+=1}else if(a=H(a))c=a,Sd(c)?(a=tc(c),e=uc(c),c=a,d=Q(a),a=e):(a=I(c),b.push(a),a=L(c),c=null,d=0),e=0;else break;return Bo.a?Bo.a("array",b):Bo.call(null,"array",b)};Xp.prototype.pa=function(){return null};function Yp(){}Yp.prototype.tag=function(){return"array"};
Yp.prototype.Z=function(a){var b=[];a=H(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e);b.push(f);e+=1}else if(a=H(a))c=a,Sd(c)?(a=tc(c),e=uc(c),c=a,d=Q(a),a=e):(a=I(c),b.push(a),a=L(c),c=null,d=0),e=0;else break;return b};Yp.prototype.pa=function(){return null};function Zp(){}Zp.prototype.tag=function(){return"u"};Zp.prototype.Z=function(a){return a.ob};Zp.prototype.pa=function(a){return this.Z(a)};
function $p(a,b){var c=new Tp,d=new Up,e=new Vp,f=new Wp,h=new Xp,k=new Yp,l=new Zp,n=oh.v(F([Fd([Dd,Ce,q,Sg,hg,G,t,Ae,Fe,cg,gg,Tg,nh,tg,U,sd,rd,rh,hh,mh,Rd,th,Qd,Ic,Wh,vh,Xg],[f,e,f,e,e,e,c,e,e,k,e,e,e,e,k,e,e,h,f,e,e,h,e,d,l,e,e]),aj.g(b)],0)),p=ue(a),y=Pp({objectBuilder:function(a,b,c,d,e,f,h,k,l){return function(n,p,y){return fe(function(){return function(a,b,c){a.push(p.g?p.g(b):p.call(null,b),y.g?y.g(c):y.call(null,c));return a}}(a,b,c,d,e,f,h,k,l),n)}}(p,c,d,e,f,h,k,l,n),handlers:function(){var a=
qb(n);a.forEach=function(){return function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),h=R(f,0),f=R(f,1);a.a?a.a(f,h):a.call(null,f,h);e+=1}else if(b=H(b))Sd(b)?(c=tc(b),b=uc(b),h=c,d=Q(c),c=h):(c=I(b),h=R(c,0),f=R(c,1),a.a?a.a(f,h):a.call(null,f,h),b=L(b),c=null,d=0),e=0;else return null}}(a,p,c,d,e,f,h,k,l,n);return a}(),unpack:function(){return function(a){return a instanceof q?a.j:!1}}(p,c,d,e,f,h,k,l,n)},Qh(Gd.a(b,aj)));return Op.a?Op.a(p,y):Op.call(null,p,y)};function aq(a,b){for(var c=new ya,d=H(b);;)if(null!=d)c.append(""+w(I(d))),d=L(d),null!=d&&c.append(a);else return c.toString()}function bq(a,b){a:for(var c="/(?:)/"===""+w(b)?zd.a(ee(O("",S.a(w,H(a)))),""):ee((""+w(a)).split(b));;)if(""===(null==c?null:Nb(c)))c=null==c?null:Ob(c);else break a;return c};g=rn.prototype;g.zd=function(a,b,c){a=null!=b&&(b.o&64||b.na)?z.a(gd,b):b;var d=D.a(a,ak),e=D.a(a,zi),f=D.a(a,kk),h=D.a(a,gj),k=D.h(a,gk,0),l=D.h(a,uk,!1);wm(this,"complete",function(){return function(a){a=a.target;return c.g?c.g(a):c.call(null,a)}}(this,"complete",this,this,b,a,d,e,f,h,k,l));this.zc=Math.max(0,k);this.Fe=l;this.send(d,e,f,Qh(h));return this};g.Ad=function(){var a;try{a=this.ea?this.ea.responseText:""}catch(b){gn(this.ab,"Can not get responseText: "+b.message),a=""}return a};
g.Cd=function(){return Fn(this)};g.Dd=function(){return Gn(this)};g.Bd=function(a,b){return this.getResponseHeader(b)};g.Ed=function(){return Jc.a(this.wc,7)};function cq(a,b){return Nn(b,a)}function dq(a){a:{a=[a];var b=a.length;if(b<=xg)for(var c=0,d=kc(W);;)if(c<b)var e=c+1,d=oc(d,a[c],null),c=e;else{a=new rh(null,mc(d),null);break a}else for(c=0,d=kc(sh);;)if(c<b)e=c+1,d=lc(d,a[c]),c=e;else{a=mc(d);break a}}return af(a,new U(null,6,5,V,[200,201,202,204,205,206],null))}
var ff=function ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ff.v(arguments[0],arguments[1],arguments[2],3<c.length?new G(c.slice(3),0):null)};ff.v=function(a,b,c,d){return new U(null,2,5,V,[!1,nb.h(zd,new q(null,3,[zj,a,Ki,b,wi,c],null),S.a(ee,Ff(2,2,d)))],null)};ff.I=3;ff.L=function(a){var b=I(a),c=L(a);a=I(c);var d=L(c),c=I(d),d=L(d);return ff.v(b,a,c,d)};
function eq(a){return aq(", ",S.a(function(a){return[w(a),w("; charset\x3dutf-8")].join("")},"string"===typeof a?new U(null,1,5,V,[a],null):a))}function fq(a,b,c,d,e,f){this.read=a;this.description=b;this.Hb=c;this.H=d;this.B=e;this.l=f;this.o=2229667594;this.J=8192}g=fq.prototype;g.N=function(a,b){return Cb.h(this,b,null)};
g.M=function(a,b,c){switch(b instanceof t?b.Ba:null){case "read":return this.read;case "description":return this.description;case "content-type":return this.Hb;default:return D.h(this.B,b,c)}};g.Bc=function(a,b){var c=null!=a&&(a.o&64||a.na)?z.a(gd,a):a,d=D.a(c,Rj),e=null!=this&&(this.o&64||this.na)?z.a(gd,this):this,f=D.a(e,Rj);return Gf(b,gj,function(a,b,c){return function(a){return oh.v(F([new q(null,1,["Accept",eq(c)],null),r(a)?a:W],0))}}(this,e,f,a,c,d))};
g.Cc=function(a,b){var c=null!=a&&(a.o&64||a.na)?z.a(gd,a):a;D.a(c,si);var c=null!=this&&(this.o&64||this.na)?z.a(gd,this):this,d=D.a(c,si);try{var e=In(b),f=ef(e);switch(e){case 0:return f.a?f.a("Request failed.",vk):f.call(null,"Request failed.",vk);case -1:return r(Mn(b))?f.a?f.a("Request aborted by client.",Ni):f.call(null,"Request aborted by client.",Ni):f.a?f.a("Request timed out.",gk):f.call(null,"Request timed out.",gk);case 204:return new U(null,2,5,V,[!0,null],null);case 205:return new U(null,
2,5,V,[!0,null],null);default:try{var h=d.g?d.g(b):d.call(null,b);if(r(dq(e)))return new U(null,2,5,V,[!0,h],null);var k=Jn(b);return f.K?f.K(k,Wj,Xh,h):f.call(null,k,Wj,Xh,h)}catch(l){if(l instanceof Object){var h=l,f=V,n,p=null!=c&&(c.o&64||c.na)?z.a(gd,c):c,y=D.a(p,$h),x=new q(null,3,[zj,e,wi,Wj,Xh,null],null),B=[w(h.message),w("  Format should have been "),w(y)].join(""),C=Ed.v(x,Ki,B,F([wi,Lj,mi,Kn(b)],0));n=r(dq(e))?C:Ed.v(x,Ki,Jn(b),F([cj,C],0));return new U(null,2,5,f,[!1,n],null)}throw l;
}}}catch(E){if(E instanceof Object)return h=E,ff.v(0,h.message,Yj,F([Yj,h],0));throw E;}};g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#ajax.core.ResponseFormat{",", ","}",c,Pe.a(new U(null,3,5,V,[new U(null,2,5,V,[si,this.read],null),new U(null,2,5,V,[$h,this.description],null),new U(null,2,5,V,[Rj,this.Hb],null)],null),this.B))};g.Aa=function(){return new mg(0,this,3,new U(null,3,5,V,[si,$h,Rj],null),zc(this.B))};g.R=function(){return this.H};
g.sa=function(){return new fq(this.read,this.description,this.Hb,this.H,this.B,this.l)};g.Y=function(){return 3+Q(this.B)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};g.Ua=function(a,b){return Zd(new rh(null,new q(null,3,[$h,null,si,null,Rj,null],null),null),b)?Gd.a(id(Df(W,this),this.H),b):new fq(this.read,this.description,this.Hb,this.H,Ue(Gd.a(this.B,b)),null)};
g.Ha=function(a,b,c){return r(T.a?T.a(si,b):T.call(null,si,b))?new fq(c,this.description,this.Hb,this.H,this.B,null):r(T.a?T.a($h,b):T.call(null,$h,b))?new fq(this.read,c,this.Hb,this.H,this.B,null):r(T.a?T.a(Rj,b):T.call(null,Rj,b))?new fq(this.read,this.description,c,this.H,this.B,null):new fq(this.read,this.description,this.Hb,this.H,Ed.h(this.B,b,c),null)};
g.U=function(){return H(Pe.a(new U(null,3,5,V,[new U(null,2,5,V,[si,this.read],null),new U(null,2,5,V,[$h,this.description],null),new U(null,2,5,V,[Rj,this.Hb],null)],null),this.B))};g.S=function(a,b){return new fq(this.read,this.description,this.Hb,b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};function gq(a){return new fq(si.g(a),$h.g(a),Rj.g(a),null,Gd.v(a,si,F([$h,Rj],0)),null)}hq;
function iq(a){return function(b,c){var d=new U(null,2,5,V,[b,c],null);return hq.a?hq.a(a,d):hq.call(null,a,d)}}var hq=function hq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hq.a(arguments[0],arguments[1]);case 1:return hq.g(arguments[0]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};
hq.a=function(a,b){var c=R(b,0),d=R(b,1),c=c instanceof t?ue(c):c,c=r(a)?[w(a),w("["),w(c),w("]")].join(""):c;return"string"===typeof d?new U(null,1,5,V,[new U(null,2,5,V,[c,d],null)],null):Od(d)?Af(hq.g(c),F([H(d)],0)):Nd(d)?z.a(Pe,hf(iq(c),H(d))):new U(null,1,5,V,[new U(null,2,5,V,[c,d],null)],null)};
hq.g=function(a){return function(b){var c=R(b,0);b=R(b,1);c=c instanceof t?ue(c):c;c=r(a)?[w(a),w("["),w(c),w("]")].join(""):c;return"string"===typeof b?new U(null,1,5,V,[new U(null,2,5,V,[c,b],null)],null):Od(b)?Af(hq.g(c),F([H(b)],0)):Nd(b)?z.a(Pe,hf(iq(c),H(b))):new U(null,1,5,V,[new U(null,2,5,V,[c,b],null)],null)}};hq.I=2;function jq(a){return aq("\x26",S.a(function(a){var c=R(a,0);a=R(a,1);return[w(c),w("\x3d"),w(a)].join("")},Af(hq.g(null),F([H(a)],0))))}
function kq(a,b){return function(c){return r(a)?[w(c),w(r(Ah(/\?/,c))?"\x26":"?"),w(b.g?b.g(a):b.call(null,a))].join(""):c}}function lq(a,b,c,d){this.Vb=a;this.H=b;this.B=c;this.l=d;this.o=2229667594;this.J=8192}g=lq.prototype;g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){switch(b instanceof t?b.Ba:null){case "params-to-str":return this.Vb;default:return D.h(this.B,b,c)}};
g.Bc=function(a,b){var c=null!=b&&(b.o&64||b.na)?z.a(gd,b):b,d=D.a(c,zi);Jc.a(d,"GET")&&(c=Gf(c,ak,kq(Si.g(c),this.Vb)),c=new jd(c));return c};g.Cc=function(a,b){return b};g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#ajax.core.ProcessGet{",", ","}",c,Pe.a(new U(null,1,5,V,[new U(null,2,5,V,[Zi,this.Vb],null)],null),this.B))};g.Aa=function(){return new mg(0,this,1,new U(null,1,5,V,[Zi],null),zc(this.B))};g.R=function(){return this.H};
g.sa=function(){return new lq(this.Vb,this.H,this.B,this.l)};g.Y=function(){return 1+Q(this.B)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};g.Ua=function(a,b){return Zd(new rh(null,new q(null,1,[Zi,null],null),null),b)?Gd.a(id(Df(W,this),this.H),b):new lq(this.Vb,this.H,Ue(Gd.a(this.B,b)),null)};
g.Ha=function(a,b,c){return r(T.a?T.a(Zi,b):T.call(null,Zi,b))?new lq(c,this.H,this.B,null):new lq(this.Vb,this.H,Ed.h(this.B,b,c),null)};g.U=function(){return H(Pe.a(new U(null,1,5,V,[new U(null,2,5,V,[Zi,this.Vb],null)],null),this.B))};g.S=function(a,b){return new lq(this.Vb,b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};function mq(a){throw Error(""+w(a));}function nq(a,b,c){this.H=a;this.B=b;this.l=c;this.o=2229667594;this.J=8192}g=nq.prototype;
g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){switch(b){default:return D.h(this.B,b,c)}};g.Bc=function(a,b){var c=null!=b&&(b.o&64||b.na)?z.a(gd,b):b,d=D.a(c,kk);D.a(c,Si);return null==d?c:new jd(c)};g.Cc=function(a,b){return b};g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#ajax.core.DirectSubmission{",", ","}",c,Pe.a(Ad,this.B))};g.Aa=function(){return new mg(0,this,0,Ad,zc(this.B))};g.R=function(){return this.H};
g.sa=function(){return new nq(this.H,this.B,this.l)};g.Y=function(){return 0+Q(this.B)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};g.Ua=function(a,b){return Zd(sh,b)?Gd.a(id(Df(W,this),this.H),b):new nq(this.H,Ue(Gd.a(this.B,b)),null)};g.Ha=function(a,b,c){return new nq(this.H,Ed.h(this.B,b,c),null)};g.U=function(){return H(Pe.a(Ad,this.B))};
g.S=function(a,b){return new nq(b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};function oq(a,b,c){this.H=a;this.B=b;this.l=c;this.o=2229667594;this.J=8192}g=oq.prototype;g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){switch(b){default:return D.h(this.B,b,c)}};
g.Bc=function(a,b){var c=null!=b&&(b.o&64||b.na)?z.a(gd,b):b;D.a(c,ak);D.a(c,zi);var d=D.a(c,gi),e=D.a(c,Si),f=D.a(c,gj),h;h=Od(d)?d:Yd(d)?new q(null,2,[mj,d,Rj,"text/plain"],null):W;h=null!=h&&(h.o&64||h.na)?z.a(gd,h):h;var k=D.a(h,mj);h=D.a(h,Rj);d=null!=k?k.g?k.g(e):k.call(null,e):mq(new U(null,2,5,V,["unrecognized request format: ",d],null));f=r(f)?f:W;return Ed.v(c,kk,d,F([gj,r(h)?Ed.h(f,"Content-Type",eq(h)):f],0))};g.Cc=function(a,b){return b};
g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#ajax.core.ApplyRequestFormat{",", ","}",c,Pe.a(Ad,this.B))};g.Aa=function(){return new mg(0,this,0,Ad,zc(this.B))};g.R=function(){return this.H};g.sa=function(){return new oq(this.H,this.B,this.l)};g.Y=function(){return 0+Q(this.B)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};
g.Ua=function(a,b){return Zd(sh,b)?Gd.a(id(Df(W,this),this.H),b):new oq(this.H,Ue(Gd.a(this.B,b)),null)};g.Ha=function(a,b,c){return new oq(this.H,Ed.h(this.B,b,c),null)};g.U=function(){return H(Pe.a(Ad,this.B))};g.S=function(a,b){return new oq(b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};function pq(a){a=null!=a&&(a.o&64||a.na)?z.a(gd,a):a;a=D.a(a,Vi);return r(a)?a:fk}
function qq(a,b){return function(a){return function(b){return a.write(b)}}(function(){var c=Bj.g(b);return r(c)?c:$p(a,b)}())}function rq(a){var b=pq(a),c=Jc.a(b,fk)?"json":"msgpack";return new q(null,2,[mj,qq(b,a),Rj,[w("application/transit+"),w(c)].join("")],null)}function sq(a){return function(b){return function(c){c=Kn(c);c=b.read(c);return r(Ai.g(a))?c:Uh(c,F([new q(null,1,[Vh,!1],null)],0))}}(function(){var b=Ij.g(a);return r(b)?b:Sp(a)}())}
var tq=function tq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return tq.G();case 1:return tq.g(arguments[0]);case 2:return tq.a(arguments[0],arguments[1]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};tq.G=function(){return tq.g(W)};tq.g=function(a){return tq.a(pq(a),a)};tq.a=function(a,b){return gq(new q(null,3,[si,sq(b),$h,"Transit",Rj,new U(null,1,5,V,["application/transit+json"],null)],null))};tq.I=2;
function uq(){return new q(null,2,[mj,jq,Rj,"application/x-www-form-urlencoded"],null)}var vq=function vq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return vq.G();case 1:return vq.g(arguments[0]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};vq.G=function(){return gq(new q(null,3,[si,Kn,$h,"raw text",Rj,new U(null,1,5,V,["*/*"],null)],null))};vq.g=function(){return vq.G()};vq.I=1;
function wq(a){var b=new Lm;a=Qh(a);var c=[];Mm(b,a,c);return c.join("")}function xq(a,b,c){return function(d){d=Kn(d);d=r(r(a)?Jc.a(0,d.indexOf(a)):a)?d.substring(a.length):d;d=Km(d);return r(b)?d:Uh(d,F([Vh,c],0))}}var yq=function yq(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return yq.G();case 1:return yq.g(arguments[0]);default:throw Error([w("Invalid arity: "),w(c.length)].join(""));}};yq.G=function(){return yq.g(W)};
yq.g=function(a){var b=null!=a&&(a.o&64||a.na)?z.a(gd,a):a;a=D.a(b,fj);var c=D.a(b,qi),b=D.a(b,Ai);return gq(new q(null,3,[si,xq(a,b,c),$h,[w("JSON"),w(r(a)?[w(" prefix '"),w(a),w("'")].join(""):null),w(r(c)?" keywordize":null)].join(""),Rj,new U(null,1,5,V,["application/json"],null)],null))};yq.I=1;
var zq=new U(null,6,5,V,[new U(null,2,5,V,["application/json",yq],null),new U(null,2,5,V,["application/transit+json",tq],null),new U(null,2,5,V,["application/transit+transit",tq],null),new U(null,2,5,V,["text/plain",vq],null),new U(null,2,5,V,["text/html",vq],null),new U(null,2,5,V,["*/*",vq],null)],null);function Aq(a,b){return null==b||Od(b)?b:Pd(b)?Aq(a,xd(b)):b.g?b.g(a):b.call(null,a)}
function Bq(a,b){var c=Pd(b)?I(b):Rj.g(Aq(a,b));return null==c?new U(null,1,5,V,["*/*"],null):"string"===typeof c?new U(null,1,5,V,[c],null):c}function Cq(a){return function(b){b=Pd(b)?I(b):Rj.g(Aq(a,b));return null==b?new U(null,1,5,V,["*/*"],null):"string"===typeof b?new U(null,1,5,V,[b],null):b}}function Dq(a){return function(b){return Jc.a(b,"*/*")||0<=a.indexOf(b)}}function Eq(a,b){return function(c){c=Bq(b,c);return af(Dq(a),c)}}
function Fq(a){return function(b){var c;c=null!=a&&(a.o&64||a.na)?z.a(gd,a):a;var d=D.a(c,Ji),e=Ln(b,"Content-Type");c=Aq(c,I(Bf(Eq(r(e)?e:"",c),d)));return si.g(c).call(null,b)}}function Gq(a){var b;b=null!=a&&(a.o&64||a.na)?z.a(gd,a):a;var c=D.a(b,Ji);b=Pd(c)?Af(Cq(b),F([c],0)):Bq(b,c);return gq(new q(null,3,[si,Fq(a),gi,[w("(from "),w(b),w(")")].join(""),Rj,b],null))}
function Hq(a){a=null!=a&&(a.o&64||a.na)?z.a(gd,a):a;var b=D.a(a,Ji);return b instanceof fq?b:Pd(b)?Gq(a):Od(b)?gq(b):Yd(b)?gq(new q(null,3,[si,b,$h,"custom",Rj,"*/*"],null)):mq(new U(null,2,5,V,["unrecognized response format: ",b],null))}function Iq(a){return a instanceof t?ue(a).toUpperCase():a}function Jq(a,b){return function(c){c=nb.h(function(a,b){return On(b,a)},c,b);return a.g?a.g(c):a.call(null,c)}}
var Kq=new U(null,3,5,V,[new lq(jq,null,null,null),new nq(null,null,null),new oq(null,null,null)],null),Lq,Mq=Ad;Lq=kf.g?kf.g(Mq):kf.call(null,Mq);function Nq(a){var b=Hq(a);return Gf(Gf(a,zi,Iq),ck,function(a){return function(b){return Pe.v(new U(null,1,5,V,[a],null),r(b)?b:M.g?M.g(Lq):M.call(null,Lq),F([Kq],0))}}(b))}
function Oq(a,b){if(Od(a))return a;if(Hd(a))return new q(null,1,[mj,a],null);if(null==a)return rq(b);switch(a instanceof t?a.Ba:null){case "transit":return rq(b);case "json":return new q(null,2,[mj,wq,Rj,"application/json"],null);case "text":return new q(null,2,[mj,ge,Rj,"text/plain"],null);case "raw":return uq();case "url":return uq();default:return null}}
var Pq=function Pq(b,c){if(Pd(b))return new U(null,2,5,V,[I(b),Pq(xd(b),c)],null);if(Od(b))return b;if(Hd(b))return new q(null,2,[si,b,$h,"custom"],null);if(null==b)return Gq(new q(null,1,[Ji,zq],null));switch(b instanceof t?b.Ba:null){case "transit":return tq.g(c);case "json":return yq.g(c);case "text":return vq.G?vq.G():vq.call(null);case "raw":return vq.G();case "detect":return Gq(new q(null,1,[Ji,zq],null));default:return null}};
function Qq(a,b){return Pd(a)?z.a($f,S.a(function(a){return Pq(a,b)},a)):Pq(a,b)}function Rq(a){var b=null!=a&&(a.o&64||a.na)?z.a(gd,a):a,c=D.a(b,nk),d=D.a(b,ij),e=D.a(b,fi);return function(a,b,c,d,e){return function(a){var b=R(a,0);a=R(a,1);b=r(b)?c:d;r(b)&&(b.g?b.g(a):b.call(null,a));return Hd(e)?e.G?e.G():e.call(null):null}}(a,b,c,d,e)}
function Sq(a,b){var c=I(b),c=c instanceof t?z.a(gd,b):c,c=Ed.v(c,ak,a,F([zi,"GET"],0)),c=null!=c&&(c.o&64||c.na)?z.a(gd,c):c,d=D.a(c,zi),e=D.a(c,gi),f=D.a(c,Ji);D.a(c,Si);d=null==D.a(c,kk)&&!Jc.a(d,"GET");e=r(r(e)?e:d)?Oq(e,c):null;c=Ed.v(c,nk,Rq(c),F([gi,e,Ji,Qq(f,c)],0));c=Nq(c);c=null!=c&&(c.o&64||c.na)?z.a(gd,c):c;f=D.a(c,ck);c=nb.h(cq,c,f);f=Be(f);e=null!=c&&(c.o&64||c.na)?z.a(gd,c):c;e=D.a(e,nk);f=r(e)?Jq(e,f):mq("No ajax handler provided.");e=li.g(c);e=r(e)?e:new rn;Hn(e,c,f)};function Tq(a){return nb.a(he,a)/Q(a)}function Uq(a){var b=new Date;b.setTime(a);return b}function Vq(a){return a.getTime()}function Wq(a){return z.a(Pe,S.h(function(a,c){var d=R(a,0),e=R(c,0),f=R(c,1),d=Math.round((Vq(e)-Vq(d))/864E5);return sf(d,wf(f/d))},a,vf(1,a)))}function Xq(a,b){var c=a*Q(b);return vf(Math.round(c),b)};function Yq(a){return Cd(a,2)}function Zq(a){var b=bq(a,/-/);a=R(b,0);var c=R(b,1),b=R(b,2);return new Date(a|0,(c|0)-1,b|0)}function $q(a){return S.a(function(a){return Gf(Gf(Gf(bq(a,/,/),0,Zq),1,pe),2,pe)},bq(a,/\n/))};var ar=Error();function br(a){return[w("M"),w(aq("",yf(S.a(function(a){return aq(",",a)},a))))].join("")}function cr(a,b){return[w("translate("),w(a),w(","),w(b),w(")")].join("")};var dr=function dr(b){if(null!=b&&null!=b.Ie)return b.domain;var c=dr[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=dr._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("IScale.-domain",b);};function er(a,b,c,d,e,f){this.domain=a;this.nb=b;this.ha=c;this.H=d;this.B=e;this.l=f;this.o=2229667595;this.J=8192}g=er.prototype;g.N=function(a,b){return Cb.h(this,b,null)};
g.M=function(a,b,c){switch(b instanceof t?b.Ba:null){case "domain":return this.domain;case "rng":return this.nb;case "f":return this.ha;default:return D.h(this.B,b,c)}};g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#burn.scale.Linear{",", ","}",c,Pe.a(new U(null,3,5,V,[new U(null,2,5,V,[dk,this.domain],null),new U(null,2,5,V,[Yh,this.nb],null),new U(null,2,5,V,[Uj,this.ha],null)],null),this.B))};
g.Aa=function(){return new mg(0,this,3,new U(null,3,5,V,[dk,Yh,Uj],null),zc(this.B))};g.R=function(){return this.H};g.sa=function(){return new er(this.domain,this.nb,this.ha,this.H,this.B,this.l)};g.Y=function(){return 3+Q(this.B)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};g.Ie=function(){return this.domain};
g.Ua=function(a,b){return Zd(new rh(null,new q(null,3,[Yh,null,Uj,null,dk,null],null),null),b)?Gd.a(id(Df(W,this),this.H),b):new er(this.domain,this.nb,this.ha,this.H,Ue(Gd.a(this.B,b)),null)};
g.Ha=function(a,b,c){return r(T.a?T.a(dk,b):T.call(null,dk,b))?new er(c,this.nb,this.ha,this.H,this.B,null):r(T.a?T.a(Yh,b):T.call(null,Yh,b))?new er(this.domain,c,this.ha,this.H,this.B,null):r(T.a?T.a(Uj,b):T.call(null,Uj,b))?new er(this.domain,this.nb,c,this.H,this.B,null):new er(this.domain,this.nb,this.ha,this.H,Ed.h(this.B,b,c),null)};
g.U=function(){return H(Pe.a(new U(null,3,5,V,[new U(null,2,5,V,[dk,this.domain],null),new U(null,2,5,V,[Yh,this.nb],null),new U(null,2,5,V,[Uj,this.ha],null)],null),this.B))};g.S=function(a,b){return new er(this.domain,this.nb,this.ha,b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};g.call=function(a,b){a=this;var c=S.a(a.ha,a.domain),d=R(c,0),e=R(c,1),f=a.nb,c=R(f,0),e=(R(f,1)-c)/(e-d),d=c-e*d;return e*(a.ha.g?a.ha.g(b):a.ha.call(null,b))+d};
g.apply=function(a,b){return this.call.apply(this,[this].concat(mb(b)))};g.g=function(a){var b=S.a(this.ha,this.domain),c=R(b,0),d=R(b,1),e=this.nb,b=R(e,0),d=(R(e,1)-b)/(d-c),c=b-d*c;return d*(this.ha.g?this.ha.g(a):this.ha.call(null,a))+c};
function fr(a){var b=R(a,0),c=R(a,1);a=(c-b)/20;var d=Math.log(a)/Math.log(10),d=Math.pow(10,Math.floor(d)),c=c+1;a/=d;return r(ie.a?ie.a(5,a):ie.call(null,5,a))?new vh(null,b,c,10*d,null):r(ie.a?ie.a(2,a):ie.call(null,2,a))?new vh(null,b,c,5*d,null):r(ie.a?ie.a(1,a):ie.call(null,1,a))?new vh(null,b,c,2*d,null):new vh(null,b,c,d,null)};var gr=function gr(b,c){if(null!=b&&null!=b.$c)return b.$c(b,c);var d=gr[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=gr._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IProjection.-slowest",b);},hr=function hr(b,c){if(null!=b&&null!=b.Zc)return b.Zc(b,c);var d=hr[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=hr._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("IProjection.-fastest",b);};
function ir(a,b,c,d,e){this.Ya=a;this.Wa=b;this.H=c;this.B=d;this.l=e;this.o=2229667594;this.J=8192}g=ir.prototype;g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){switch(b instanceof t?b.Ba:null){case "low":return this.Ya;case "high":return this.Wa;default:return D.h(this.B,b,c)}};
g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#burn.projectors.Middle{",", ","}",c,Pe.a(new U(null,2,5,V,[new U(null,2,5,V,[Sj,this.Ya],null),new U(null,2,5,V,[hj,this.Wa],null)],null),this.B))};g.Aa=function(){return new mg(0,this,2,new U(null,2,5,V,[Sj,hj],null),zc(this.B))};g.R=function(){return this.H};g.sa=function(){return new ir(this.Ya,this.Wa,this.H,this.B,this.l)};g.Y=function(){return 2+Q(this.B)};
g.$c=function(a,b){return Tq(Xq(this.Wa,ce(ke,Wq(b))))};g.Zc=function(a,b){return Tq(Xq(this.Ya,ce(ie,Wq(b))))};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};g.Ua=function(a,b){return Zd(new rh(null,new q(null,2,[hj,null,Sj,null],null),null),b)?Gd.a(id(Df(W,this),this.H),b):new ir(this.Ya,this.Wa,this.H,Ue(Gd.a(this.B,b)),null)};
g.Ha=function(a,b,c){return r(T.a?T.a(Sj,b):T.call(null,Sj,b))?new ir(c,this.Wa,this.H,this.B,null):r(T.a?T.a(hj,b):T.call(null,hj,b))?new ir(this.Ya,c,this.H,this.B,null):new ir(this.Ya,this.Wa,this.H,Ed.h(this.B,b,c),null)};g.U=function(){return H(Pe.a(new U(null,2,5,V,[new U(null,2,5,V,[Sj,this.Ya],null),new U(null,2,5,V,[hj,this.Wa],null)],null),this.B))};g.S=function(a,b){return new ir(this.Ya,this.Wa,b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};
function jr(a,b,c){this.H=a;this.B=b;this.l=c;this.o=2229667594;this.J=8192}g=jr.prototype;g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){switch(b){default:return D.h(this.B,b,c)}};g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#burn.projectors.Extremes{",", ","}",c,Pe.a(Ad,this.B))};g.Aa=function(){return new mg(0,this,0,Ad,zc(this.B))};g.R=function(){return this.H};g.sa=function(){return new jr(this.H,this.B,this.l)};
g.Y=function(){return 0+Q(this.B)};g.$c=function(a,b){return z.a(ne,Bf(se,Wq(b)))};g.Zc=function(a,b){return z.a(me,Bf(se,Wq(b)))};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};g.Ua=function(a,b){return Zd(sh,b)?Gd.a(id(Df(W,this),this.H),b):new jr(this.H,Ue(Gd.a(this.B,b)),null)};g.Ha=function(a,b,c){return new jr(this.H,Ed.h(this.B,b,c),null)};g.U=function(){return H(Pe.a(Ad,this.B))};
g.S=function(a,b){return new jr(b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};function kr(a,b,c,d,e){this.n=a;this.weight=b;this.H=c;this.B=d;this.l=e;this.o=2229667594;this.J=8192}g=kr.prototype;g.N=function(a,b){return Cb.h(this,b,null)};g.M=function(a,b,c){switch(b instanceof t?b.Ba:null){case "n":return this.n;case "weight":return this.weight;default:return D.h(this.B,b,c)}};
g.O=function(a,b,c){return Xf(b,function(){return function(a){return Xf(b,X,""," ","",c,a)}}(this),"#burn.projectors.WeightedMostRecent{",", ","}",c,Pe.a(new U(null,2,5,V,[new U(null,2,5,V,[Fi,this.n],null),new U(null,2,5,V,[wj,this.weight],null)],null),this.B))};g.Aa=function(){return new mg(0,this,2,new U(null,2,5,V,[Fi,wj],null),zc(this.B))};g.R=function(){return this.H};g.sa=function(){return new kr(this.n,this.weight,this.H,this.B,this.l)};g.Y=function(){return 2+Q(this.B)};
g.$c=function(a,b){var c;a:{c=Ad;for(var d=b;;)if(L(d))c=zd.a(c,I(d)),d=L(d);else{c=H(c);break a}}c=Tq(Wq(c));a:for(var e=this.n+1,d=H(b),e=H(vf(e,b));;)if(e)d=L(d),e=L(e);else break a;d=Tq(Wq(d));return(1-this.weight)*c+this.weight*d};g.Zc=function(a,b){return gr(this,b)};g.P=function(){var a=this.l;return null!=a?a:this.l=a=xe(this)};g.F=function(a,b){var c;c=r(b)?(c=this.constructor===b.constructor)?lg(this,b):c:b;return r(c)?!0:!1};
g.Ua=function(a,b){return Zd(new rh(null,new q(null,2,[Fi,null,wj,null],null),null),b)?Gd.a(id(Df(W,this),this.H),b):new kr(this.n,this.weight,this.H,Ue(Gd.a(this.B,b)),null)};g.Ha=function(a,b,c){return r(T.a?T.a(Fi,b):T.call(null,Fi,b))?new kr(c,this.weight,this.H,this.B,null):r(T.a?T.a(wj,b):T.call(null,wj,b))?new kr(this.n,c,this.H,this.B,null):new kr(this.n,this.weight,this.H,Ed.h(this.B,b,c),null)};
g.U=function(){return H(Pe.a(new U(null,2,5,V,[new U(null,2,5,V,[Fi,this.n],null),new U(null,2,5,V,[wj,this.weight],null)],null),this.B))};g.S=function(a,b){return new kr(this.n,this.weight,b,this.B,this.l)};g.V=function(a,b){return Pd(b)?Eb(this,A.a(b,0),A.a(b,1)):nb.h(vb,this,b)};var lr;
a:for(var mr=F([Vj,new q(null,3,[Ei,"Average of All Sprints",pj,function(a,b){R(b,0);var c=R(b,1);return new U(null,7,5,V,[oj,W,"Based on our average sprint velocity and current scope of ",new U(null,4,5,V,[Di,W,a," points"],null),", we will finish on ",new U(null,3,5,V,[Di,W,c.toLocaleDateString()],null),"."],null)},ji,new ir(0,0,null,null,null)],null),xk,new q(null,3,[Ei,"Average of Last 3 Sprints",pj,function(a,b){R(b,0);var c=R(b,1);return new U(null,7,5,V,[oj,W,"Based on our average sprint velocity over the last 3 sprints and our current scope of ",
new U(null,4,5,V,[Di,W,a," points"],null),", we will finish on ",new U(null,3,5,V,[Di,W,c.toLocaleDateString()],null),"."],null)},ji,new kr(3,1,null,null,null)],null),Hj,new q(null,3,[Ei,"Last Sprint's Velocity",pj,function(a,b){R(b,0);var c=R(b,1);return new U(null,6,5,V,[oj,W,"Based on our most recent sprint's velocity and our current scope of ",new U(null,4,5,V,[Di,W,a," points"],null),", we will finish on ",new U(null,3,5,V,[Di,W,c.toLocaleDateString()],null)],null)},ji,new kr(1,1,null,null,null)],
null),bj,new q(null,3,[Ei,"Most Extreme Sprint Velocities",pj,function(a,b){var c=R(b,0),d=R(b,1);return new U(null,8,5,V,[oj,W,"Based on our fastest and slowest sprint velocities and our current scope of ",new U(null,4,5,V,[Di,W,a," points"],null),", we will finish between ",new U(null,3,5,V,[Di,W,c.toLocaleDateString()],null)," and ",new U(null,3,5,V,[Di,W,d.toLocaleDateString()],null)],null)},ji,new jr(null,null,null)],null)],0),nr=H(mr),or=kh;;)if(nr)var pr=L(L(nr)),qr=Ed.h(or,I(nr),xd(nr)),nr=
pr,or=qr;else{lr=or;break a};function rr(a,b,c){return new U(null,4,5,V,[rj,W,new U(null,4,5,V,[rj,W,new U(null,2,5,V,[vj,new q(null,2,[Fj,"axis",ik,b.g?b.g(0):b.call(null,0)],null)],null),function(){var c=S.a(Vq,dr(a)),e=R(c,0),f=R(c,1),h=(f-e)/6048E5,k=6048E5*Math.ceil(h/13);return function(c,d,e,f,h,k){return function E(K){return new Fe(null,function(){return function(){for(;;){var c=H(K);if(c){if(Sd(c)){var d=tc(c),e=Q(d),f=Je(e);a:for(var h=0;;)if(h<e){var k=A.a(d,h),k=Uq(k),k=new U(null,3,5,V,[Ak,new q(null,3,[ni,cr(a.g?
a.g(k):a.call(null,k),b.g?b.g(0):b.call(null,0)),Pi,25,ai,"middle"],null),k.toLocaleDateString()],null);f.add(k);h+=1}else{d=!0;break a}return d?Ke(f.ua(),E(uc(c))):Ke(f.ua(),null)}f=I(c);f=Uq(f);return O(new U(null,3,5,V,[Ak,new q(null,3,[ni,cr(a.g?a.g(f):a.call(null,f),b.g?b.g(0):b.call(null,0)),Pi,25,ai,"middle"],null),f.toLocaleDateString()],null),E(Wc(c)))}return null}}}(c,d,e,f,h,k),null,null)}}(c,e,f,6048E5,h,k)(new vh(null,e,f,k,null))}()],null),new U(null,4,5,V,[rj,W,new U(null,2,5,V,[vj,
new q(null,3,[Fj,"axis",ni,cr(0,b.g?b.g(0):b.call(null,0)),tk,a.g?a.g(c):a.call(null,c)],null)],null),function(){var a=dr(b),c=R(a,0),f=R(a,1);return function(a,c,d){return function p(e){return new Fe(null,function(){return function(){for(;;){var a=H(e);if(a){if(Sd(a)){var c=tc(a),d=Q(c),f=Je(d);a:for(var h=0;;)if(h<d){var k=A.a(c,h),k=new U(null,3,5,V,[Ak,new q(null,4,[ni,cr(0,b.g?b.g(k):b.call(null,k)),oi,-13,Pi,6,ai,"end"],null),k],null);f.add(k);h+=1}else{c=!0;break a}return c?Ke(f.ua(),p(uc(a))):
Ke(f.ua(),null)}f=I(a);return O(new U(null,3,5,V,[Ak,new q(null,4,[ni,cr(0,b.g?b.g(f):b.call(null,f)),oi,-13,Pi,6,ai,"end"],null),f],null),p(Wc(a)))}return null}}}(a,c,d),null,null)}}(a,c,f)(fr(new U(null,2,5,V,[c,f],null)))}()],null)],null)}
function sr(a,b,c,d){c=Pe.a(function(){return function f(c){return new Fe(null,function(){for(;;){var d=H(c);if(d){if(Sd(d)){var l=tc(d),n=Q(l),p=Je(n);a:for(var y=0;;)if(y<n){var x=A.a(l,y),B=R(x,0);R(x,1);x=R(x,2);B=new U(null,2,5,V,[a.g?a.g(B):a.call(null,B),b.g?b.g(x):b.call(null,x)],null);p.add(B);y+=1}else{l=!0;break a}return l?Ke(p.ua(),f(uc(d))):Ke(p.ua(),null)}l=I(d);p=R(l,0);R(l,1);l=R(l,2);return O(new U(null,2,5,V,[a.g?a.g(p):a.call(null,p),b.g?b.g(l):b.call(null,l)],null),f(Wc(d)))}return null}},
null,null)}(d)}(),new U(null,1,5,V,[new U(null,2,5,V,[a.g?a.g(c):a.call(null,c),function(){var a=Yq(yd(d));return b.g?b.g(a):b.call(null,a)}()],null)],null));return new U(null,2,5,V,[ci,new q(null,3,[Fj,"scope",Tj,br(c),lj,"url(#interior)"],null)],null)}function tr(a){return wh(function(a,c){return Gf(c,1,function(c){var e=D.a(a,1);return he.a?he.a(e,c):he.call(null,e,c)})},a)}
function ur(a,b,c){return new U(null,2,5,V,[ci,new q(null,4,[Fj,"progress",Tj,br(function(){return function e(c){return new Fe(null,function(){for(;;){var h=H(c);if(h){if(Sd(h)){var k=tc(h),l=Q(k),n=Je(l);a:for(var p=0;;)if(p<l){var y=A.a(k,p),x=R(y,0),y=R(y,1),x=new U(null,2,5,V,[a.g?a.g(x):a.call(null,x),b.g?b.g(y):b.call(null,y)],null);n.add(x);p+=1}else{k=!0;break a}return k?Ke(n.ua(),e(uc(h))):Ke(n.ua(),null)}k=I(h);n=R(k,0);k=R(k,1);return O(new U(null,2,5,V,[a.g?a.g(n):a.call(null,n),b.g?b.g(k):
b.call(null,k)],null),e(Wc(h)))}return null}},null,null)}(tr(c))}()),nj,"round",lj,"url(#interior)"],null)],null)}
function vr(a,b,c,d){return new U(null,4,5,V,[rj,W,new U(null,2,5,V,[vj,new q(null,6,[Fj,"projection",Zj,function(){var b=I.g?I.g(d):I.call(null,d);return a.g?a.g(b):a.call(null,b)}(),Li,function(){var a=xd.g?xd.g(d):xd.call(null,d);return b.g?b.g(a):b.call(null,a)}(),tk,a.g?a.g(c):a.call(null,c),ik,function(){var a=Yq(d);return b.g?b.g(a):b.call(null,a)}(),lj,"url(#interior)"],null)],null),new U(null,3,5,V,[Ak,new q(null,3,[ni,cr(a.g?a.g(c):a.call(null,c),function(){var a=Yq(d);return b.g?b.g(a):
b.call(null,a)}()),ai,"middle",Pi,-5],null),c.toLocaleDateString()],null)],null)}function wr(a,b,c){var d=function(){var a=yd(c);return I.g?I.g(a):I.call(null,a)}();if(0<a){var e=gr(b,c);b=hr(b,c);var f=function(a,b,c){return function(a){var b=new Date;b.setTime(Vq(c)+864E5*a);return b}}(e,b,d);return new U(null,2,5,V,[f(a/b),0<e?f(a/e):0<b?f(a/b):d],null)}return new U(null,2,5,V,[d,d],null)}
function xr(a){var b=yr,c=null!=a&&(a.o&64||a.na)?z.a(gd,a):a,d=D.a(c,Ti),e=D.a(c,Cj),f=e.trim(),h=lr.g?lr.g(d):lr.call(null,d);return new U(null,10,5,V,[jk,W,new U(null,3,5,V,[oj,new q(null,1,[dj,"right"],null),new U(null,3,5,V,[yi,new q(null,1,[Oi,function(){return function(){var a=document.getElementById("visualization"),b=Qh(new q(null,1,[xi,4],null));return saveSvgAsPng(a,"burn-chart",b)}}(f,h,a,c,d,e)],null),"Download"],null)],null),new U(null,3,5,V,[hk,W,"Burn Chart"],null),new U(null,3,5,
V,[oj,new q(null,1,[dj,"spaced horizontal"],null),function(){return function(a,c,d,e,f,h){return function C(E){return new Fe(null,function(a,c,d,e,f,h){return function(){for(;;){var k=H(E);if(k){var l=k;if(Sd(l)){var n=tc(l),p=Q(n),y=Je(p);return function(){for(var x=0;;)if(x<p){var C=A.a(n,x),E=R(C,0),La=R(C,1);Le(y,new U(null,4,5,V,[Dj,new q(null,1,[dj,"label--radio"],null),new U(null,2,5,V,[ek,new q(null,3,[Vi,"radio",Jj,Jc.a(E,f),Oi,function(a,c,d){return function(){var a=new U(null,2,5,V,[ti,
d],null);return b.g?b.g(a):b.call(null,a)}}(x,C,E,La,n,p,y,l,k,a,c,d,e,f,h)],null)],null),new U(null,3,5,V,[jj,W,La.g?La.g(Ei):La.call(null,Ei)],null)],null));x+=1}else return!0}()?Ke(y.ua(),C(uc(l))):Ke(y.ua(),null)}var x=I(l),bb=R(x,0),La=R(x,1);return O(new U(null,4,5,V,[Dj,new q(null,1,[dj,"label--radio"],null),new U(null,2,5,V,[ek,new q(null,3,[Vi,"radio",Jj,Jc.a(bb,f),Oi,function(a,c){return function(){var a=new U(null,2,5,V,[ti,c],null);return b.g?b.g(a):b.call(null,a)}}(x,bb,La,l,k,a,c,d,
e,f,h)],null)],null),new U(null,3,5,V,[jj,W,La.g?La.g(Ei):La.call(null,Ei)],null)],null),C(Wc(l)))}return null}}}(a,c,d,e,f,h),null,null)}}(f,h,a,c,d,e)(lr)}()],null),function(){var a=new U(null,2,5,V,[960,500],null),b=R(a,0),c=R(a,1),d=$q(f),a=V,e=new q(null,4,[Mi,b,yk,c,Ej,"visualization",Fj,"bordered"],null);if(H(d)){var c=new U(null,2,5,V,[b,c],null),b=R(c,0),c=R(c,1),x=df.a(Vq,I),B;var d=de(x,d),C=I(d),x=R(C,0),E=R(C,1),C=R(C,2);if(0===E)B=d;else{var E=xd(d),E=R(E,0),K=new Date;K.setTime(Vq(x)-
864E5*Math.round((Vq(E)-Vq(x))/864E5));B=Pe.a(new U(null,1,5,V,[new U(null,3,5,V,[K,0,C],null)],null),d)}var E=yd(tr(B)),P=Yq(E)-(xd.g?xd.g(E):xd.call(null,E)),d=wr(P,h.g?h.g(ji):h.call(null,ji),B),Z=R(d,0),d=R(d,1),x=V,C=I(B),C=I.g?I.g(C):I.call(null,C),x=new er(new U(null,2,5,x,[C,d],null),new U(null,2,5,V,[0,b-100],null),Vq,null,null,null),C=new U(null,2,5,V,[0,z.a(me,S.a(Yq,B))],null),C=new er(C,new U(null,2,5,V,[c-65,0],null),ge,null,null,null),E=vb(J,new U(null,3,5,V,[rj,new q(null,1,[ni,cr(b-
50-300,c-150)],null),new U(null,3,5,V,[zk,new q(null,3,[Mi,300,yk,150,wk,"'PT Sans', Arial, sans-serif"],null),(h.g?h.g(pj):h.call(null,pj)).call(null,Yq(E),new U(null,2,5,V,[Z,d],null))],null)],null)),K=V,za=new q(null,1,[ni,cr(50,25)],null),cb=sr(x,C,d,B),Pc=ur(x,C,B);if(0<P){var N=new U(null,2,5,V,[x,C],null),Z=new U(null,2,5,V,[Z,d],null),P=B;B=R(N,0);var N=R(N,1),sp=R(Z,0),Z=R(Z,1),P=yd(tr(P));B=vb(vb(J,vr(B,N,Z,P)),vr(B,N,sp,P))}else B=null;b=vb(vb(vb(E,new U(null,6,5,K,[rj,za,cb,Pc,B,rr(x,
C,d)],null)),new U(null,2,5,V,[ok,new q(null,3,[Mi,b,yk,c,Hi,"white"],null)],null)),new U(null,3,5,V,[Kj,W,new U(null,3,5,V,[Qi,new q(null,1,[Ej,"interior"],null),new U(null,2,5,V,[ok,new q(null,4,[Zh,-25,Mi,b-50,yk,c-65+25,Ii,"userSpaceOnUse"],null)],null)],null)],null))}else b=new U(null,3,5,V,[Ak,new q(null,3,[ni,cr(b/2,c/2),Pi,5,ai,"middle"],null),"No data"],null);return new U(null,3,5,a,[Oj,e,b],null)}(),new U(null,3,5,V,[Xj,W,"Data"],null),new U(null,4,5,V,[oj,new q(null,1,[dj,"column-left"],
null),new U(null,3,5,V,[sk,W,"Specify your data as comma-separated values. There are three fields:"],null),new U(null,5,5,V,[pi,W,new U(null,3,5,V,[Gi,W,'date, in the format "yyyy-mm-dd"'],null),new U(null,3,5,V,[Gi,W,"points completed between the given date and the date of the previous row"],null),new U(null,3,5,V,[Gi,W,"total points in scope as of the given date"],null)],null)],null),new U(null,3,5,V,[oj,new q(null,1,[dj,"column-right"],null),new U(null,3,5,V,[kj,new q(null,2,[dj,"width-full",ii,
function(){return function(){var a=new U(null,2,5,V,[Xi,this.value],null);return b.g?b.g(a):b.call(null,a)}}(f,h,a,c,d,e)],null),f],null)],null),new U(null,2,5,V,[oj,new q(null,1,[dj,"clearfix"],null)],null)],null)};var zr=null,Ar=null,Br=Vl||Wl||Sl||"function"==typeof ba.atob;function Cr(){if(!zr){zr={};Ar={};for(var a=0;65>a;a++)zr[a]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\x3d".charAt(a),Ar[zr[a]]=a,62<=a&&(Ar["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(a)]=a)}};var Dr=function Dr(b){if(null!=b&&null!=b.ne)return b.ne();var c=Dr[m(null==b?null:b)];if(null!=c)return c.g?c.g(b):c.call(null,b);c=Dr._;if(null!=c)return c.g?c.g(b):c.call(null,b);throw v("PushbackReader.read-char",b);},Er=function Er(b,c){if(null!=b&&null!=b.oe)return b.oe(0,c);var d=Er[m(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Er._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw v("PushbackReader.unread",b);};
function Fr(a,b,c){this.T=a;this.buffer=b;this.fa=c}Fr.prototype.ne=function(){return 0===this.buffer.length?(this.fa+=1,this.T[this.fa]):this.buffer.pop()};Fr.prototype.oe=function(a,b){return this.buffer.push(b)};function Gr(a){var b=!/[^\t\n\r ]/.test(a);return r(b)?b:","===a}Hr;Ir;Jr;function Kr(a){throw Error(z.a(w,a));}
function Lr(a,b){for(var c=new ya(b),d=Dr(a);;){var e;if(!(e=null==d||Gr(d))){e=d;var f="#"!==e;e=f?(f="'"!==e)?(f=":"!==e)?Ir.g?Ir.g(e):Ir.call(null,e):f:f:f}if(e)return Er(a,d),c.toString();c.append(d);d=Dr(a)}}function Mr(a){for(;;){var b=Dr(a);if("\n"===b||"\r"===b||null==b)return a}}var Nr=Bh("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),Or=Bh("^([-+]?[0-9]+)/([0-9]+)$"),Pr=Bh("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),Qr=Bh("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function Rr(a,b){var c=a.exec(b);return null!=c&&c[0]===b?1===c.length?c[0]:c:null}var Sr=Bh("^[0-9A-Fa-f]{2}$"),Tr=Bh("^[0-9A-Fa-f]{4}$");function Ur(a,b,c){return r(zh(a,c))?c:Kr(F(["Unexpected unicode escape \\",b,c],0))}function Vr(a){return String.fromCharCode(parseInt(a,16))}
function Wr(a){var b=Dr(a),c="t"===b?"\t":"r"===b?"\r":"n"===b?"\n":"\\"===b?"\\":'"'===b?'"':"b"===b?"\b":"f"===b?"\f":null;r(c)?b=c:"x"===b?(a=(new ya(Dr(a),Dr(a))).toString(),b=Vr(Ur(Sr,b,a))):"u"===b?(a=(new ya(Dr(a),Dr(a),Dr(a),Dr(a))).toString(),b=Vr(Ur(Tr,b,a))):b=/[^0-9]/.test(b)?Kr(F(["Unexpected unicode escape \\",b],0)):String.fromCharCode(b);return b}
function Xr(a,b){for(var c=kc(Ad);;){var d;a:{d=Gr;for(var e=b,f=Dr(e);;)if(r(d.g?d.g(f):d.call(null,f)))f=Dr(e);else{d=f;break a}}r(d)||Kr(F(["EOF while reading"],0));if(a===d)return mc(c);e=Ir.g?Ir.g(d):Ir.call(null,d);r(e)?d=e.a?e.a(b,d):e.call(null,b,d):(Er(b,d),d=Hr.K?Hr.K(b,!0,null,!0):Hr.call(null,b,!0,null));c=d===b?c:Re.a(c,d)}}function Yr(a,b){return Kr(F(["Reader for ",b," not implemented yet"],0))}Zr;
function $r(a,b){var c=Dr(a),d=Jr.g?Jr.g(c):Jr.call(null,c);if(r(d))return d.a?d.a(a,b):d.call(null,a,b);d=Zr.a?Zr.a(a,c):Zr.call(null,a,c);return r(d)?d:Kr(F(["No dispatch macro for ",c],0))}function as(a,b){return Kr(F(["Unmatched delimiter ",b],0))}function bs(a){return z.a(Hc,Xr(")",a))}function cs(a){return Xr("]",a)}
function ds(a){a=Xr("}",a);var b=Q(a);if("number"!==typeof b||isNaN(b)||Infinity===b||parseFloat(b)!==parseInt(b,10))throw Error([w("Argument must be an integer: "),w(b)].join(""));0!==(b&1)&&Kr(F(["Map literal must contain an even number of forms"],0));return z.a(gd,a)}function es(a){for(var b=new ya,c=Dr(a);;){if(null==c)return Kr(F(["EOF while reading"],0));if("\\"===c)b.append(Wr(a));else{if('"'===c)return b.toString();b.append(c)}c=Dr(a)}}
function fs(a){for(var b=new ya,c=Dr(a);;){if(null==c)return Kr(F(["EOF while reading"],0));if("\\"===c){b.append(c);var d=Dr(a);if(null==d)return Kr(F(["EOF while reading"],0));var e=function(){var a=b;a.append(d);return a}(),f=Dr(a)}else{if('"'===c)return b.toString();e=function(){var a=b;a.append(c);return a}();f=Dr(a)}b=e;c=f}}
function gs(a,b){var c=Lr(a,b),d=-1!=c.indexOf("/");r(r(d)?1!==c.length:d)?c=Uc.a(c.substring(0,c.indexOf("/")),c.substring(c.indexOf("/")+1,c.length)):(d=Uc.g(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?Mj:d);return c}
function hs(a,b){var c=Lr(a,b),d=c.substring(1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?Vr(d.substring(1)):"o"===d.charAt(0)?Yr(0,c):Kr(F(["Unknown character literal: ",c],0))}
function is(a){a=Lr(a,Dr(a));var b=Rr(Qr,a);a=b[0];var c=b[1],b=b[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===b[b.length-1]||-1!==a.indexOf("::",1)?Kr(F(["Invalid token: ",a],0)):null!=c&&0<c.length?Ee.a(c.substring(0,c.indexOf("/")),b):Ee.g(a)}function js(a){return function(b){return vb(vb(J,Hr.K?Hr.K(b,!0,null,!0):Hr.call(null,b,!0,null)),a)}}function ks(){return function(){return Kr(F(["Unreadable form"],0))}}
function ls(a){var b;b=Hr.K?Hr.K(a,!0,null,!0):Hr.call(null,a,!0,null);b=b instanceof Ic?new q(null,1,[bk,b],null):"string"===typeof b?new q(null,1,[bk,b],null):b instanceof t?zg([b,!0],!0,!1):b;Od(b)||Kr(F(["Metadata must be Symbol,Keyword,String or Map"],0));a=Hr.K?Hr.K(a,!0,null,!0):Hr.call(null,a,!0,null);return(null!=a?a.o&262144||a.Df||(a.o?0:u(Ub,a)):u(Ub,a))?id(a,oh.v(F([Jd(a),b],0))):Kr(F(["Metadata can only be applied to IWithMetas"],0))}
function ms(a){a:if(a=Xr("}",a),a=H(a),null==a)a=sh;else if(a instanceof G&&0===a.C){a=a.j;b:for(var b=0,c=kc(sh);;)if(b<a.length)var d=b+1,c=c.Zb(null,a[b]),b=d;else break b;a=c.qc(null)}else for(d=kc(sh);;)if(null!=a)b=L(a),d=d.Zb(null,a.qa(null)),a=b;else{a=mc(d);break a}return a}function ns(a){return Bh(fs(a))}function os(a){Hr.K?Hr.K(a,!0,null,!0):Hr.call(null,a,!0,null);return a}
function Ir(a){return'"'===a?es:":"===a?is:";"===a?Mr:"'"===a?js(Ye):"@"===a?js(rk):"^"===a?ls:"`"===a?Yr:"~"===a?Yr:"("===a?bs:")"===a?as:"["===a?cs:"]"===a?as:"{"===a?ds:"}"===a?as:"\\"===a?hs:"#"===a?$r:null}function Jr(a){return"{"===a?ms:"\x3c"===a?ks():'"'===a?ns:"!"===a?Mr:"_"===a?os:null}
function Hr(a,b,c){for(;;){var d=Dr(a);if(null==d)return r(b)?Kr(F(["EOF while reading"],0)):c;if(!Gr(d))if(";"===d)a=Mr.a?Mr.a(a,d):Mr.call(null,a);else{var e=Ir(d);if(r(e))e=e.a?e.a(a,d):e.call(null,a,d);else{var e=a,f=void 0;!(f=!/[^0-9]/.test(d))&&(f=void 0,f="+"===d||"-"===d)&&(f=Dr(e),Er(e,f),f=!/[^0-9]/.test(f));if(f)a:for(e=a,d=new ya(d),f=Dr(e);;){var h;h=null==f;h||(h=(h=Gr(f))?h:Ir.g?Ir.g(f):Ir.call(null,f));if(r(h)){Er(e,f);d=e=d.toString();f=void 0;r(Rr(Nr,d))?(d=Rr(Nr,d),f=d[2],null!=
(Jc.a(f,"")?null:f)?f=0:(f=r(d[3])?[d[3],10]:r(d[4])?[d[4],16]:r(d[5])?[d[5],8]:r(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=f[0],null==h?f=null:(f=parseInt(h,f[1]),f="-"===d[1]?-f:f))):(f=void 0,r(Rr(Or,d))?(d=Rr(Or,d),f=parseInt(d[1],10)/parseInt(d[2],10)):f=r(Rr(Pr,d))?parseFloat(d):null);d=f;e=r(d)?d:Kr(F(["Invalid number format [",e,"]"],0));break a}d.append(f);f=Dr(e)}else e=gs(a,d)}if(e!==a)return e}}}
var ps=function(a,b){return function(c,d){return D.a(r(d)?b:a,c)}}(new U(null,13,5,V,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new U(null,13,5,V,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),qs=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function rs(a){a=parseInt(a,10);return gb(isNaN(a))?a:null}
function ss(a,b,c,d){a<=b&&b<=c||Kr(F([[w(d),w(" Failed:  "),w(a),w("\x3c\x3d"),w(b),w("\x3c\x3d"),w(c)].join("")],0));return b}
function ts(a){var b=zh(qs,a);R(b,0);var c=R(b,1),d=R(b,2),e=R(b,3),f=R(b,4),h=R(b,5),k=R(b,6),l=R(b,7),n=R(b,8),p=R(b,9),y=R(b,10);if(gb(b))return Kr(F([[w("Unrecognized date/time syntax: "),w(a)].join("")],0));var x=rs(c),B=function(){var a=rs(d);return r(a)?a:1}();a=function(){var a=rs(e);return r(a)?a:1}();var b=function(){var a=rs(f);return r(a)?a:0}(),c=function(){var a=rs(h);return r(a)?a:0}(),C=function(){var a=rs(k);return r(a)?a:0}(),E=function(){var a;a:if(Jc.a(3,Q(l)))a=l;else if(3<Q(l))a=
l.substring(0,3);else for(a=new ya(l);;)if(3>a.Nb.length)a=a.append("0");else{a=a.toString();break a}a=rs(a);return r(a)?a:0}(),n=(Jc.a(n,"-")?-1:1)*(60*function(){var a=rs(p);return r(a)?a:0}()+function(){var a=rs(y);return r(a)?a:0}());return new U(null,8,5,V,[x,ss(1,B,12,"timestamp month field must be in range 1..12"),ss(1,a,function(){var a;a=0===oe(x,4);r(a)&&(a=gb(0===oe(x,100)),a=r(a)?a:0===oe(x,400));return ps.a?ps.a(B,a):ps.call(null,B,a)}(),"timestamp day field must be in range 1..last day in month"),
ss(0,b,23,"timestamp hour field must be in range 0..23"),ss(0,c,59,"timestamp minute field must be in range 0..59"),ss(0,C,Jc.a(c,59)?60:59,"timestamp second field must be in range 0..60"),ss(0,E,999,"timestamp millisecond field must be in range 0..999"),n],null)}
var us,vs=new q(null,4,["inst",function(a){var b;if("string"===typeof a)if(b=ts(a),r(b)){a=R(b,0);var c=R(b,1),d=R(b,2),e=R(b,3),f=R(b,4),h=R(b,5),k=R(b,6);b=R(b,7);b=new Date(Date.UTC(a,c-1,d,e,f,h,k)-6E4*b)}else b=Kr(F([[w("Unrecognized date/time syntax: "),w(a)].join("")],0));else b=Kr(F(["Instance literal expects a string for its timestamp."],0));return b},"uuid",function(a){return"string"===typeof a?new Wh(a,null):Kr(F(["UUID literal expects a string as its representation."],0))},"queue",function(a){return Pd(a)?
Df(ig,a):Kr(F(["Queue literal expects a vector for its elements."],0))},"js",function(a){if(Pd(a)){var b=[];a=H(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e);b.push(f);e+=1}else if(a=H(a))c=a,Sd(c)?(a=tc(c),e=uc(c),c=a,d=Q(a),a=e):(a=I(c),b.push(a),a=L(c),c=null,d=0),e=0;else break;return b}if(Od(a)){b={};a=H(a);c=null;for(e=d=0;;)if(e<d){var h=c.ba(null,e),f=R(h,0),h=R(h,1);b[ue(f)]=h;e+=1}else if(a=H(a))Sd(a)?(d=tc(a),a=uc(a),c=d,d=Q(d)):(d=I(a),c=R(d,0),d=R(d,1),b[ue(c)]=d,a=L(a),c=null,
d=0),e=0;else break;return b}return Kr(F([[w("JS literal expects a vector or map containing "),w("only string or unqualified keyword keys")].join("")],0))}],null);us=kf.g?kf.g(vs):kf.call(null,vs);var ws=kf.g?kf.g(null):kf.call(null,null);
function Zr(a,b){var c=gs(a,b),d=D.a(M.g?M.g(us):M.call(null,us),""+w(c)),e=M.g?M.g(ws):M.call(null,ws);return r(d)?(c=Hr(a,!0,null),d.g?d.g(c):d.call(null,c)):r(e)?(d=Hr(a,!0,null),e.a?e.a(c,d):e.call(null,c,d)):Kr(F(["Could not find tag parser for ",""+w(c)," in ",mf.v(F([ug(M.g?M.g(us):M.call(null,us))],0))],0))};Pa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,$a.g?$a.g(a):$a.call(null,a))}a.I=0;a.L=function(a){a=H(a);return b(a)};a.v=b;return a}();
Qa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new G(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,$a.g?$a.g(a):$a.call(null,a))}a.I=0;a.L=function(a){a=H(a);return b(a)};a.v=b;return a}();
function xs(a){window.location.hash=[w("/"),w(function(){var b=mf.v(F([a],0)),c;if(Br)c=ba.btoa(b);else{c=[];for(var d=0,e=0;e<b.length;e++){for(var f=b.charCodeAt(e);255<f;)c[d++]=f&255,f>>=8;c[d++]=f}if(!ea(c))throw Error("encodeByteArray takes an array as a parameter");Cr();b=zr;d=[];for(e=0;e<c.length;e+=3){var h=c[e],k=(f=e+1<c.length)?c[e+1]:0,l=e+2<c.length,n=l?c[e+2]:0,p=h>>2,h=(h&3)<<4|k>>4,k=(k&15)<<2|n>>6,n=n&63;l||(n=64,f||(k=64));d.push(b[p],b[h],b[k],b[n])}c=d.join("")}return c}())].join("");
return a}yr;
function Nl(a,b){try{if(T(b,ej))return a;throw ar;}catch(c){if(c instanceof Error)if(c===ar)try{if(Pd(b)&&2===Q(b))try{var d=Cd(b,0);if(T(d,Xi)){var e=Cd(b,1);return xs(Ed.h(a,Cj,e))}throw ar;}catch(f){if(f instanceof Error){var h=f;if(h===ar)try{d=Cd(b,0);if(T(d,ti))return e=Cd(b,1),xs(Ed.h(a,Ti,e));throw ar;}catch(k){if(k instanceof Error)if(k===ar)try{d=Cd(b,0);if(T(d,bi)){var l=Cd(b,1);Sq(l,F([new q(null,1,[nk,function(){return function(a){a=new U(null,2,5,V,[Xi,a],null);return yr.g?yr.g(a):yr.call(null,
a)}}(l,d,k,h,c)],null)],0));return Ed.h(a,tj,l)}throw ar;}catch(n){if(n instanceof Error&&n===ar)throw ar;throw n;}else throw k;else throw k;}else throw h;}else throw f;}else throw ar;}catch(p){if(p instanceof Error){h=p;if(h===ar)throw Error([w("No matching clause: "),w(b)].join(""));throw h;}throw p;}else throw c;else throw c;}}var Ol,ys;
try{var zs;var As=window.location.hash,Bs=/^#\//;if("string"===typeof Bs)zs=As.replace(new RegExp(String(Bs).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(Bs instanceof RegExp)zs=As.replace(new RegExp(Bs.source,"g"),"");else throw[w("Invalid match arg: "),w(Bs)].join("");var Cs=zs,Ds;if(Br)Ds=ba.atob(Cs);else{Cr();for(var Es=Ar,Fs=[],Gs=0;Gs<Cs.length;){var Hs=Es[Cs.charAt(Gs++)],Is=Gs<Cs.length?Es[Cs.charAt(Gs)]:0;++Gs;var Js=Gs<Cs.length?Es[Cs.charAt(Gs)]:
64;++Gs;var Ks=Gs<Cs.length?Es[Cs.charAt(Gs)]:64;++Gs;if(null==Hs||null==Is||null==Js||null==Ks)throw Error();Fs.push(Hs<<2|Is>>4);64!=Js&&(Fs.push(Is<<4&240|Js>>2),64!=Ks&&Fs.push(Js<<6&192|Ks))}if(8192>=Fs.length)Ds=String.fromCharCode.apply(null,Fs);else{for(var Ls="",Ms=0;Ms<Fs.length;Ms+=8192)Ls+=String.fromCharCode.apply(null,Ia(Fs,Ms,Ms+8192));Ds=Ls}}var Ns=Ds;if("string"!==typeof Ns)throw Error("Cannot read from non-string object.");ys=Hr(new Fr(Ns,[],-1),!1,null)}catch(Os){if(Os instanceof
Exception)ys=null;else throw Os;}Ol=r(ys)?ys:new q(null,2,[Cj,"",Ti,xk],null);if("undefined"===typeof Pl)var Pl=xl(null);function yr(a){return Al(Pl,a)}if("undefined"===typeof Cl)var Cl=Ml();if("undefined"===typeof Ps){var Rl;Rl=Bl(function(a){return xr(a)});var Ps;Ps=Ql()};