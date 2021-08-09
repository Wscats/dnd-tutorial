"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supportsPassive = void 0;

var supportsPassive = function () {
  // simular to jQuery's test
  var supported = false;

  try {
    addEventListener('test', function () {// do nothing
    }, Object.defineProperty({}, 'passive', {
      get: function get() {
        supported = true;
        return true;
      }
    }));
  } catch (e) {// do nothing
  }

  return supported;
}();

exports.supportsPassive = supportsPassive;