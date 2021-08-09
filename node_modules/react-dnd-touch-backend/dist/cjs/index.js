"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  TouchBackend: true
};
exports.TouchBackend = void 0;

var _TouchBackendImpl = require("./TouchBackendImpl");

Object.keys(_TouchBackendImpl).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _TouchBackendImpl[key];
    }
  });
});

var TouchBackend = function createBackend(manager) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new _TouchBackendImpl.TouchBackendImpl(manager, context, options);
};

exports.TouchBackend = TouchBackend;