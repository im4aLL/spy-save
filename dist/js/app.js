(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowserStorage = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
      if (_typeof(value) !== string) {
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
      return JSON.stringify(this.getItem(key));
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
    key: "isArray",
    value: function isArray(value) {
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
    this.cronJobTimer = 3000;
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
        _this3.sendToServer(function (keys) {// this.reQueueFailedKeys(keys);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvQnJvd3NlclN0b3JhZ2UuanMiLCJzcmMvanMvU2xlZXAuanMiLCJzcmMvanMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0lDQWEsYzs7O0FBQ1QsNEJBQWM7QUFBQTs7QUFDVixTQUFLLFdBQUwsR0FBbUIsZ0JBQW5CO0FBQ0g7Ozs7NEJBTU8sRyxFQUFLLEssRUFBTztBQUNoQixVQUFJLFFBQU8sS0FBUCxNQUFpQixNQUFyQixFQUE2QjtBQUN6QixRQUFBLEtBQUssR0FBRyxLQUFLLGVBQUwsQ0FBcUIsS0FBckIsQ0FBUjtBQUNIOztBQUVELFdBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsR0FBckIsRUFBMEIsS0FBMUI7QUFDSDs7OzRCQUVPLEcsRUFBSztBQUNULGFBQU8sS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixHQUFyQixDQUFQO0FBQ0g7Ozs0QkFFTyxHLEVBQUs7QUFDVCxhQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsS0FBSyxPQUFMLENBQWEsR0FBYixDQUFmLENBQVA7QUFDSDs7OytCQUVVLEcsRUFBSztBQUNaLFdBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IsR0FBeEI7QUFDSDs7OzRCQUVPO0FBQ0osV0FBSyxPQUFMLENBQWEsS0FBYjtBQUNIOzs7NEJBRU8sSyxFQUFPO0FBQ1gsYUFBTyxJQUFJLENBQUMsU0FBTCxDQUFlLEtBQWYsQ0FBUDtBQUNIOzs7d0JBOUJhO0FBQ1YsYUFBTyxNQUFNLENBQUMsS0FBSyxXQUFOLENBQWI7QUFDSDs7Ozs7Ozs7Ozs7Ozs7OztBQ1BFLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUI7QUFDeEIsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFBLE9BQU8sRUFBSTtBQUMxQixJQUFBLFVBQVUsQ0FBQyxPQUFELEVBQVUsSUFBVixDQUFWO0FBQ0gsR0FGTSxDQUFQO0FBR0g7Ozs7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QUFkLEVBQW9CLElBQXBCO0FBQ0g7QUFDSixPQUpEO0FBS0g7Ozs0QkFFTyxJLEVBQU07QUFDVixVQUFJLEtBQUssR0FBRyxFQUFaOztBQUNBLFVBQU0sU0FBUyxzQkFBTyxJQUFQLENBQWY7O0FBRUEsTUFBQSxTQUFTLENBQUMsT0FBVixDQUFrQixVQUFBLE9BQU8sRUFBSTtBQUN6QixRQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsT0FBTyxDQUFDLEdBQW5CO0FBQ0gsT0FGRDtBQUlBLGFBQU8sS0FBUDtBQUNIOzs7Ozs7QUFHTCxJQUFNLFdBQVcsR0FBRyxJQUFJLFdBQUosRUFBcEI7QUFFQSxVQUFVLENBQUMsWUFBTTtBQUNiLEVBQUEsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsV0FBaEI7QUFDSCxDQUZTLEVBRVAsSUFGTyxDQUFWO0FBSUEsVUFBVSxDQUFDLFlBQU07QUFDYixFQUFBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLE1BQWhCO0FBQ0gsQ0FGUyxFQUVQLElBRk8sQ0FBVjtBQUlBLFVBQVUsQ0FBQyxZQUFNO0FBQ2IsRUFBQSxXQUFXLENBQUMsR0FBWixDQUFnQixPQUFoQjtBQUNILENBRlMsRUFFUCxJQUZPLENBQVYsQyxDQUlBO0FBQ0E7QUFDQTtBQUNBO0FBRUEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJleHBvcnQgY2xhc3MgQnJvd3NlclN0b3JhZ2Uge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlTW9kZSA9ICdzZXNzaW9uU3RvcmFnZSc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHN0b3JhZ2UoKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvd1t0aGlzLnN0b3JhZ2VNb2RlXTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRJdGVtKGtleSwgdmFsdWUpIHtcclxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmNvbnZlcnRUb1N0cmluZyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRJdGVtKGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEpzb24oa2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0SXRlbShrZXkpKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVJdGVtKGtleSkge1xyXG4gICAgICAgIHRoaXMuc3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zdG9yYWdlLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNBcnJheSh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgZnVuY3Rpb24gc2xlZXAodGltZSkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgIHNldFRpbWVvdXQocmVzb2x2ZSwgdGltZSk7XHJcbiAgICB9KTtcclxufSIsImltcG9ydCB7XHJcbiAgICBCcm93c2VyU3RvcmFnZVxyXG59IGZyb20gXCIuL0Jyb3dzZXJTdG9yYWdlXCI7XHJcblxyXG5pbXBvcnQgeyBzbGVlcCB9IGZyb20gXCIuL1NsZWVwXCI7XHJcblxyXG5jbGFzcyBDbGFzc2ljU2F2ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSBbXTtcclxuICAgICAgICB0aGlzLnRlbXBEYXRhID0gW107XHJcbiAgICAgICAgdGhpcy5jcm9uSm9iVGltZXIgPSAzMDAwO1xyXG5cclxuICAgICAgICB0aGlzLmNyb25Kb2IoKTtcclxuICAgIH1cclxuXHJcbiAgICBnZW5lcmF0ZVJvdyh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGtleTogYCR7KyBuZXcgRGF0ZX1gICsgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDkpLFxyXG4gICAgICAgICAgICB2YWx1ZVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gWy4uLnRoaXMuZGF0YSwgdGhpcy5nZW5lcmF0ZVJvdyh2YWx1ZSldO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVLZXlzKGtleXMpIHtcclxuICAgICAgICB0aGlzLmRhdGEuZm9yRWFjaCgoZCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGtleXMuaW5jbHVkZXMoZC5rZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlbXBEYXRhID0gWy4uLnRoaXMudGVtcERhdGEsIHRoaXMuZGF0YVtpbmRleF1dO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbaW5kZXhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YSA9IFsuLi50aGlzLmRhdGEuZmlsdGVyKGQgPT4gZCldO1xyXG4gICAgfVxyXG5cclxuICAgIHJlUXVldWVGYWlsZWRLZXlzKGtleXMpIHtcclxuICAgICAgICBpZiAodGhpcy50ZW1wRGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy50ZW1wRGF0YS5mb3JFYWNoKChkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoa2V5cy5pbmNsdWRlcyhkLmtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IFsuLi50aGlzLmRhdGEsIHRoaXMudGVtcERhdGFbaW5kZXhdXTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy50ZW1wRGF0YVtpbmRleF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50ZW1wRGF0YSA9IFsuLi50aGlzLnRlbXBEYXRhLmZpbHRlcihkID0+IGQpXTtcclxuICAgIH1cclxuXHJcbiAgICBjcm9uSm9iKCkge1xyXG4gICAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kVG9TZXJ2ZXIoa2V5cyA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLnJlUXVldWVGYWlsZWRLZXlzKGtleXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCB0aGlzLmNyb25Kb2JUaW1lcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZFRvU2VydmVyKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ05vdGhpbmcgdG8gc2VuZCcpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qga2V5cyA9IHRoaXMuZ2V0S2V5cyh0aGlzLmRhdGEpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdTZW5kaW5nIHRvIHNlcnZlcicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGtleXMpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlS2V5cyhrZXlzKTtcclxuXHJcbiAgICAgICAgc2xlZXAoNDAwMCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGhpcywga2V5cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRLZXlzKGRhdGEpIHtcclxuICAgICAgICBsZXQgYXJyYXkgPSBbXTtcclxuICAgICAgICBjb25zdCBkYXRhQXJyYXkgPSBbLi4uZGF0YV07XHJcblxyXG4gICAgICAgIGRhdGFBcnJheS5mb3JFYWNoKGVsZW1lbnQgPT4ge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGVsZW1lbnQua2V5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBjbGFzc2ljU2F2ZSA9IG5ldyBDbGFzc2ljU2F2ZSgpO1xyXG5cclxuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBjbGFzc2ljU2F2ZS5hZGQoJ1NvbWV0aGluZycpO1xyXG59LCAzMDAwKTtcclxuXHJcbnNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgY2xhc3NpY1NhdmUuYWRkKCdFbHNlJyk7XHJcbn0sIDYwMDApO1xyXG5cclxuc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICBjbGFzc2ljU2F2ZS5hZGQoJ0ZpbmFsJyk7XHJcbn0sIDkwMDApO1xyXG5cclxuLy8gc2V0VGltZW91dCgoKSA9PiB7XHJcbi8vICAgICBjbGFzc2ljU2F2ZS5hZGQoJzEnKTtcclxuLy8gICAgIGNsYXNzaWNTYXZlLmFkZCgnMicpO1xyXG4vLyB9LCAzNTAwKTtcclxuXHJcbi8vIGNvbnNvbGUubG9nKGNsYXNzaWNTYXZlLmdldERhdGEoKSk7Il19
