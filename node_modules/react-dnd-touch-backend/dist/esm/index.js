import { TouchBackendImpl } from './TouchBackendImpl';
export * from './TouchBackendImpl';
export var TouchBackend = function createBackend(manager) {
  var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new TouchBackendImpl(manager, context, options);
};