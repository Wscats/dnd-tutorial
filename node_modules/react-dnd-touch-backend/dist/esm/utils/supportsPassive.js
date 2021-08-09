export var supportsPassive = function () {
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