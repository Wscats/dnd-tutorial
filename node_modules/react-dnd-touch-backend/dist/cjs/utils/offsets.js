"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodeClientOffset = getNodeClientOffset;
exports.getEventClientTouchOffset = getEventClientTouchOffset;
exports.getEventClientOffset = getEventClientOffset;

var _predicates = require("./predicates");

var ELEMENT_NODE = 1;

function getNodeClientOffset(node) {
  var el = node.nodeType === ELEMENT_NODE ? node : node.parentElement;

  if (!el) {
    return undefined;
  }

  var _el$getBoundingClient = el.getBoundingClientRect(),
      top = _el$getBoundingClient.top,
      left = _el$getBoundingClient.left;

  return {
    x: left,
    y: top
  };
}

function getEventClientTouchOffset(e, lastTargetTouchFallback) {
  if (e.targetTouches.length === 1) {
    return getEventClientOffset(e.targetTouches[0]);
  } else if (lastTargetTouchFallback && e.touches.length === 1) {
    if (e.touches[0].target === lastTargetTouchFallback.target) {
      return getEventClientOffset(e.touches[0]);
    }
  }
}

function getEventClientOffset(e, lastTargetTouchFallback) {
  if ((0, _predicates.isTouchEvent)(e)) {
    return getEventClientTouchOffset(e, lastTargetTouchFallback);
  } else {
    return {
      x: e.clientX,
      y: e.clientY
    };
  }
}