(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserStorage = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BrowserStorage =
/*#__PURE__*/
function () {
  function BrowserStorage() {
    _classCallCheck(this, BrowserStorage);

    this.storageMode = 'sessionStorage';
  }

  _createClass(BrowserStorage, [{
    key: "setItem",
    value: function setItem(key, value) {
      if (typeof value !== 'string') {
        value = this.convertToString(value);
      }

      this.storage.setItem(key, value);
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      return this.storage.getItem(key);
    }
  }, {
    key: "getJson",
    value: function getJson(key) {
      return JSON.json(this.getItem(key));
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      this.storage.removeItem(key);
    }
  }, {
    key: "clear",
    value: function clear() {
      this.storage.clear();
    }
  }, {
    key: "convertToString",
    value: function convertToString(value) {
      return JSON.stringify(value);
    }
  }, {
    key: "storage",
    get: function get() {
      return window[this.storageMode];
    }
  }]);

  return BrowserStorage;
}();

exports.BrowserStorage = BrowserStorage;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;

function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

},{}],3:[function(require,module,exports){
"use strict";

var _BrowserStorage = require("./BrowserStorage");

var _Sleep = require("./Sleep");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ClassicSave =
/*#__PURE__*/
function () {
  function ClassicSave() {
    _classCallCheck(this, ClassicSave);

    this.data = [];
    this.tempData = [];
    this.cronJobTimer = 10000;
    this.browserStorage = new _BrowserStorage.BrowserStorage();
    this.cronJob();
  }

  _createClass(ClassicSave, [{
    key: "generateRow",
    value: function generateRow(value) {
      return {
        key: "".concat(+new Date()) + Math.random().toString(36).substr(2, 9),
        value: value
      };
    }
  }, {
    key: "add",
    value: function add(value) {
      this.data = [].concat(_toConsumableArray(this.data), [this.generateRow(value)]);
      this.saveToStorage();
    }
  }, {
    key: "saveToStorage",
    value: function saveToStorage() {
      this.browserStorage.setItem('temp', this.data);
    }
  }, {
    key: "getData",
    value: function getData() {
      return this.data;
    }
  }, {
    key: "removeKeys",
    value: function removeKeys(keys) {
      var _this = this;

      this.data.forEach(function (d, index) {
        if (keys.includes(d.key)) {
          _this.tempData = [].concat(_toConsumableArray(_this.tempData), [_this.data[index]]);
          delete _this.data[index];
        }
      });
      this.data = _toConsumableArray(this.data.filter(function (d) {
        return d;
      }));
      this.saveToStorage();
    }
  }, {
    key: "reQueueFailedKeys",
    value: function reQueueFailedKeys(keys) {
      var _this2 = this;

      if (this.tempData.length === 0) {
        return false;
      }

      this.tempData.forEach(function (d, index) {
        if (keys.includes(d.key)) {
          _this2.data = [].concat(_toConsumableArray(_this2.data), [_this2.tempData[index]]);

          _this2.saveToStorage();

          delete _this2.tempData[index];
        }
      });
      this.tempData = _toConsumableArray(this.tempData.filter(function (d) {
        return d;
      }));
    }
  }, {
    key: "cronJob",
    value: function cronJob() {
      var _this3 = this;

      setInterval(function () {
        _this3.sendToServer(function (keys) {
          _this3.reQueueFailedKeys(keys);
        });
      }, this.cronJobTimer);
    }
  }, {
    key: "sendToServer",
    value: function sendToServer(callback) {
      var _this4 = this;

      if (this.data.length === 0) {
        console.log('Nothing to send');
        return false;
      }

      var keys = this.getKeys(this.data);
      console.log('Sending to server');
      console.log(keys);
      this.removeKeys(keys);
      (0, _Sleep.sleep)(4000).then(function () {
        if (typeof callback === 'function') {
          callback.call(_this4, keys);
        }
      });
    }
  }, {
    key: "getKeys",
    value: function getKeys(data) {
      var array = [];

      var dataArray = _toConsumableArray(data);

      dataArray.forEach(function (element) {
        array.push(element.key);
      });
      return array;
    }
  }]);

  return ClassicSave;
}();

var classicSave = new ClassicSave();
setTimeout(function () {
  classicSave.add('Something');
}, 3000);
setTimeout(function () {
  classicSave.add('Else');
}, 6000);
setTimeout(function () {
  classicSave.add('Final');
}, 9000); // setTimeout(() => {
//     classicSave.add('1');
//     classicSave.add('2');
// }, 3500);
// console.log(classicSave.getData());

},{"./BrowserStorage":1,"./Sleep":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvQnJvd3NlclN0b3JhZ2UuanMiLCJzcmMvanMvU2xlZXAuanMiLCJzcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztJQ0FhLGM7OztBQUNULDRCQUFjO0FBQUE7O0FBQ1YsU0FBSyxXQUFMLEdBQW1CLGdCQUFuQjtBQUNIOzs7OzRCQU1PLEcsRUFBSyxLLEVBQU87QUFDaEIsVUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDM0IsUUFBQSxLQUFLLEdBQUcsS0FBSyxlQUFMLENBQXFCLEtBQXJCLENBQVI7QUFDSDs7QUFFRCxXQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEdBQXJCLEVBQTBCLEtBQTFCO0FBQ0g7Ozs0QkFFTyxHLEVBQUs7QUFDVCxhQUFPLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsQ0FBUDtBQUNIOzs7NEJBRU8sRyxFQUFLO0FBQ1QsYUFBTyxJQUFJLENBQUMsSUFBTCxDQUFVLEtBQUssT0FBTCxDQUFhLEdBQWIsQ0FBVixDQUFQO0FBQ0g7OzsrQkFFVSxHLEVBQUs7QUFDWixXQUFLLE9BQUwsQ0FBYSxVQUFiLENBQXdCLEdBQXhCO0FBQ0g7Ozs0QkFFTztBQUNKLFdBQUssT0FBTCxDQUFhLEtBQWI7QUFDSDs7O29DQUVlLEssRUFBTztBQUNuQixhQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBZixDQUFQO0FBQ0g7Ozt3QkE5QmE7QUFDVixhQUFPLE1BQU0sQ0FBQyxLQUFLLFdBQU4sQ0FBYjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7O0FDUEUsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQjtBQUN4QixTQUFPLElBQUksT0FBSixDQUFZLFVBQUEsT0FBTyxFQUFJO0FBQzFCLElBQUEsVUFBVSxDQUFDLE9BQUQsRUFBVSxJQUFWLENBQVY7QUFDSCxHQUZNLENBQVA7QUFHSDs7Ozs7QUNKRDs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7OztJQUVNLFc7OztBQUNGLHlCQUFjO0FBQUE7O0FBQ1YsU0FBSyxJQUFMLEdBQVksRUFBWjtBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssWUFBTCxHQUFvQixLQUFwQjtBQUVBLFNBQUssY0FBTCxHQUFzQixJQUFJLDhCQUFKLEVBQXRCO0FBRUEsU0FBSyxPQUFMO0FBQ0g7Ozs7Z0NBRVcsSyxFQUFPO0FBQ2YsYUFBTztBQUNILFFBQUEsR0FBRyxFQUFFLFVBQUcsQ0FBRSxJQUFJLElBQUosRUFBTCxJQUFrQixJQUFJLENBQUMsTUFBTCxHQUFjLFFBQWQsQ0FBdUIsRUFBdkIsRUFBMkIsTUFBM0IsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckMsQ0FEcEI7QUFFSCxRQUFBLEtBQUssRUFBTDtBQUZHLE9BQVA7QUFJSDs7O3dCQUVHLEssRUFBTztBQUNQLFdBQUssSUFBTCxnQ0FBZ0IsS0FBSyxJQUFyQixJQUEyQixLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBM0I7QUFFQSxXQUFLLGFBQUw7QUFDSDs7O29DQUVlO0FBQ1osV0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQTRCLE1BQTVCLEVBQW9DLEtBQUssSUFBekM7QUFDSDs7OzhCQUVTO0FBQ04sYUFBTyxLQUFLLElBQVo7QUFDSDs7OytCQUVVLEksRUFBTTtBQUFBOztBQUNiLFdBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsVUFBQyxDQUFELEVBQUksS0FBSixFQUFjO0FBQzVCLFlBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUFDLENBQUMsR0FBaEIsQ0FBSixFQUEwQjtBQUN0QixVQUFBLEtBQUksQ0FBQyxRQUFMLGdDQUFvQixLQUFJLENBQUMsUUFBekIsSUFBbUMsS0FBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLENBQW5DO0FBRUEsaUJBQU8sS0FBSSxDQUFDLElBQUwsQ0FBVSxLQUFWLENBQVA7QUFDSDtBQUNKLE9BTkQ7QUFRQSxXQUFLLElBQUwsc0JBQWdCLEtBQUssSUFBTCxDQUFVLE1BQVYsQ0FBaUIsVUFBQSxDQUFDO0FBQUEsZUFBSSxDQUFKO0FBQUEsT0FBbEIsQ0FBaEI7QUFFQSxXQUFLLGFBQUw7QUFDSDs7O3NDQUVpQixJLEVBQU07QUFBQTs7QUFDcEIsVUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFkLEtBQXlCLENBQTdCLEVBQWdDO0FBQzVCLGVBQU8sS0FBUDtBQUNIOztBQUVELFdBQUssUUFBTCxDQUFjLE9BQWQsQ0FBc0IsVUFBQyxDQUFELEVBQUksS0FBSixFQUFjO0FBQ2hDLFlBQUksSUFBSSxDQUFDLFFBQUwsQ0FBYyxDQUFDLENBQUMsR0FBaEIsQ0FBSixFQUEwQjtBQUN0QixVQUFBLE1BQUksQ0FBQyxJQUFMLGdDQUFnQixNQUFJLENBQUMsSUFBckIsSUFBMkIsTUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFkLENBQTNCOztBQUVBLFVBQUEsTUFBSSxDQUFDLGFBQUw7O0FBRUEsaUJBQU8sTUFBSSxDQUFDLFFBQUwsQ0FBYyxLQUFkLENBQVA7QUFDSDtBQUNKLE9BUkQ7QUFVQSxXQUFLLFFBQUwsc0JBQW9CLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsVUFBQSxDQUFDO0FBQUEsZUFBSSxDQUFKO0FBQUEsT0FBdEIsQ0FBcEI7QUFDSDs7OzhCQUVTO0FBQUE7O0FBQ04sTUFBQSxXQUFXLENBQUMsWUFBTTtBQUNkLFFBQUEsTUFBSSxDQUFDLFlBQUwsQ0FBa0IsVUFBQSxJQUFJLEVBQUk7QUFDdEIsVUFBQSxNQUFJLENBQUMsaUJBQUwsQ0FBdUIsSUFBdkI7QUFDSCxTQUZEO0FBR0gsT0FKVSxFQUlSLEtBQUssWUFKRyxDQUFYO0FBS0g7OztpQ0FFWSxRLEVBQVU7QUFBQTs7QUFDbkIsVUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFWLEtBQXFCLENBQXpCLEVBQTRCO0FBQ3hCLFFBQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxpQkFBWjtBQUVBLGVBQU8sS0FBUDtBQUNIOztBQUVELFVBQU0sSUFBSSxHQUFHLEtBQUssT0FBTCxDQUFhLEtBQUssSUFBbEIsQ0FBYjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxtQkFBWjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxJQUFaO0FBQ0EsV0FBSyxVQUFMLENBQWdCLElBQWhCO0FBRUEsd0JBQU0sSUFBTixFQUFZLElBQVosQ0FBaUIsWUFBTTtBQUNuQixZQUFJLE9BQU8sUUFBUCxLQUFvQixVQUF4QixFQUFvQztBQUNoQyxVQUFBLFFBQVEsQ0FBQyxJQUFULENBQWMsTUFBZCxFQUFvQixJQUFwQjtBQUNIO0FBQ0osT0FKRDtBQUtIOzs7NEJBRU8sSSxFQUFNO0FBQ1YsVUFBSSxLQUFLLEdBQUcsRUFBWjs7QUFDQSxVQUFNLFNBQVMsc0JBQU8sSUFBUCxDQUFmOztBQUVBLE1BQUEsU0FBUyxDQUFDLE9BQVYsQ0FBa0IsVUFBQSxPQUFPLEVBQUk7QUFDekIsUUFBQSxLQUFLLENBQUMsSUFBTixDQUFXLE9BQU8sQ0FBQyxHQUFuQjtBQUNILE9BRkQ7QUFJQSxhQUFPLEtBQVA7QUFDSDs7Ozs7O0FBR0wsSUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFKLEVBQXBCO0FBRUEsVUFBVSxDQUFDLFlBQU07QUFDYixFQUFBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLFdBQWhCO0FBQ0gsQ0FGUyxFQUVQLElBRk8sQ0FBVjtBQUlBLFVBQVUsQ0FBQyxZQUFNO0FBQ2IsRUFBQSxXQUFXLENBQUMsR0FBWixDQUFnQixNQUFoQjtBQUNILENBRlMsRUFFUCxJQUZPLENBQVY7QUFJQSxVQUFVLENBQUMsWUFBTTtBQUNiLEVBQUEsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsT0FBaEI7QUFDSCxDQUZTLEVBRVAsSUFGTyxDQUFWLEMsQ0FJQTtBQUNBO0FBQ0E7QUFDQTtBQUVBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiZXhwb3J0IGNsYXNzIEJyb3dzZXJTdG9yYWdlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZU1vZGUgPSAnc2Vzc2lvblN0b3JhZ2UnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzdG9yYWdlKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3dbdGhpcy5zdG9yYWdlTW9kZV07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0SXRlbShrZXksIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbnZlcnRUb1N0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJdGVtKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEpzb24oa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uanNvbih0aGlzLmdldEl0ZW0oa2V5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlSXRlbShrZXkpIHtcclxuICAgICAgICB0aGlzLnN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZS5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnZlcnRUb1N0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gc2xlZXAodGltZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSk7XHJcbiAgICB9KTtcclxufSIsImltcG9ydCB7XHJcbiAgICBCcm93c2VyU3RvcmFnZVxyXG59IGZyb20gXCIuL0Jyb3dzZXJTdG9yYWdlXCI7XHJcblxyXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gXCIuL1NsZWVwXCI7XHJcblxyXG5jbGFzcyBDbGFzc2ljU2F2ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBEYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5jcm9uSm9iVGltZXIgPSAxMDAwMDtcclxuXHJcbiAgICAgICAgdGhpcy5icm93c2VyU3RvcmFnZSA9IG5ldyBCcm93c2VyU3RvcmFnZSgpO1xyXG5cclxuICAgICAgICB0aGlzLmNyb25Kb2IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVJvdyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGtleTogYCR7KyBuZXcgRGF0ZX1gICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpLFxyXG4gICAgICAgICAgICB2YWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gWy4uLnRoaXMuZGF0YSwgdGhpcy5nZW5lcmF0ZVJvdyh2YWx1ZSldO1xyXG5cclxuICAgICAgICB0aGlzLnNhdmVUb1N0b3JhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlVG9TdG9yYWdlKCkge1xyXG4gICAgICAgIHRoaXMuYnJvd3NlclN0b3JhZ2Uuc2V0SXRlbSgndGVtcCcsIHRoaXMuZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUtleXMoa2V5cykge1xyXG4gICAgICAgIHRoaXMuZGF0YS5mb3JFYWNoKChkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcyhkLmtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVtcERhdGEgPSBbLi4udGhpcy50ZW1wRGF0YSwgdGhpcy5kYXRhW2luZGV4XV07XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhID0gWy4uLnRoaXMuZGF0YS5maWx0ZXIoZCA9PiBkKV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zYXZlVG9TdG9yYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVRdWV1ZUZhaWxlZEtleXMoa2V5cykge1xyXG4gICAgICAgIGlmICh0aGlzLnRlbXBEYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRlbXBEYXRhLmZvckVhY2goKGQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChrZXlzLmluY2x1ZGVzKGQua2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gWy4uLnRoaXMuZGF0YSwgdGhpcy50ZW1wRGF0YVtpbmRleF1dO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2F2ZVRvU3RvcmFnZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnRlbXBEYXRhW2luZGV4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnRlbXBEYXRhID0gWy4uLnRoaXMudGVtcERhdGEuZmlsdGVyKGQgPT4gZCldO1xyXG4gICAgfVxyXG5cclxuICAgIGNyb25Kb2IoKSB7XHJcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlbmRUb1NlcnZlcihrZXlzID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVRdWV1ZUZhaWxlZEtleXMoa2V5cyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIHRoaXMuY3JvbkpvYlRpbWVyKTtcclxuICAgIH1cclxuXHJcbiAgICBzZW5kVG9TZXJ2ZXIoY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTm90aGluZyB0byBzZW5kJyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBrZXlzID0gdGhpcy5nZXRLZXlzKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1NlbmRpbmcgdG8gc2VydmVyJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coa2V5cyk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVLZXlzKGtleXMpO1xyXG5cclxuICAgICAgICBzbGVlcCg0MDAwKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBrZXlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEtleXMoZGF0YSkge1xyXG4gICAgICAgIGxldCBhcnJheSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGRhdGFBcnJheSA9IFsuLi5kYXRhXTtcclxuXHJcbiAgICAgICAgZGF0YUFycmF5LmZvckVhY2goZWxlbWVudCA9PiB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goZWxlbWVudC5rZXkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IGNsYXNzaWNTYXZlID0gbmV3IENsYXNzaWNTYXZlKCk7XHJcblxyXG5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGNsYXNzaWNTYXZlLmFkZCgnU29tZXRoaW5nJyk7XHJcbn0sIDMwMDApO1xyXG5cclxuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBjbGFzc2ljU2F2ZS5hZGQoJ0Vsc2UnKTtcclxufSwgNjAwMCk7XHJcblxyXG5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGNsYXNzaWNTYXZlLmFkZCgnRmluYWwnKTtcclxufSwgOTAwMCk7XHJcblxyXG4vLyBzZXRUaW1lb3V0KCgpID0+IHtcclxuLy8gICAgIGNsYXNzaWNTYXZlLmFkZCgnMScpO1xyXG4vLyAgICAgY2xhc3NpY1NhdmUuYWRkKCcyJyk7XHJcbi8vIH0sIDM1MDApO1xyXG5cclxuLy8gY29uc29sZS5sb2coY2xhc3NpY1NhdmUuZ2V0RGF0YSgpKTsiXX0=
