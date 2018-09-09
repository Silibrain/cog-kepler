'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapStateReducerFactory = exports.INITIAL_MAP_STATE = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _actionHandler; // Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var _reduxActions = require('redux-actions');

var _actionTypes = require('../constants/action-types');

var _actionTypes2 = _interopRequireDefault(_actionTypes);

var _mapStateUpdaters = require('./map-state-updaters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INITIAL_MAP_STATE = exports.INITIAL_MAP_STATE = {
  pitch: 0,
  bearing: 0,
  latitude: 37.75043,
  longitude: -122.34679,
  zoom: 9,
  dragRotate: false,
  width: 800,
  height: 800,
  isSplit: false
};

var actionHandler = (_actionHandler = {}, (0, _defineProperty3.default)(_actionHandler, _actionTypes2.default.UPDATE_MAP, _mapStateUpdaters.updateMapUpdater), (0, _defineProperty3.default)(_actionHandler, _actionTypes2.default.FIT_BOUNDS, _mapStateUpdaters.fitBoundsUpdater), (0, _defineProperty3.default)(_actionHandler, _actionTypes2.default.TOGGLE_PERSPECTIVE, _mapStateUpdaters.togglePerspectiveUpdater), (0, _defineProperty3.default)(_actionHandler, _actionTypes2.default.RECEIVE_MAP_CONFIG, _mapStateUpdaters.receiveMapConfigUpdater), (0, _defineProperty3.default)(_actionHandler, _actionTypes2.default.TOGGLE_SPLIT_MAP, _mapStateUpdaters.toggleSplitMapUpdater), _actionHandler);

/* Reducer */
var mapStateReducerFactory = exports.mapStateReducerFactory = function mapStateReducerFactory() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _reduxActions.handleActions)(actionHandler, (0, _extends3.default)({}, INITIAL_MAP_STATE, initialState, { initialState: initialState }));
};

exports.default = mapStateReducerFactory();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy9tYXAtc3RhdGUuanMiXSwibmFtZXMiOlsiSU5JVElBTF9NQVBfU1RBVEUiLCJwaXRjaCIsImJlYXJpbmciLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsInpvb20iLCJkcmFnUm90YXRlIiwid2lkdGgiLCJoZWlnaHQiLCJpc1NwbGl0IiwiYWN0aW9uSGFuZGxlciIsIkFjdGlvblR5cGVzIiwiVVBEQVRFX01BUCIsInVwZGF0ZU1hcFVwZGF0ZXIiLCJGSVRfQk9VTkRTIiwiZml0Qm91bmRzVXBkYXRlciIsIlRPR0dMRV9QRVJTUEVDVElWRSIsInRvZ2dsZVBlcnNwZWN0aXZlVXBkYXRlciIsIlJFQ0VJVkVfTUFQX0NPTkZJRyIsInJlY2VpdmVNYXBDb25maWdVcGRhdGVyIiwiVE9HR0xFX1NQTElUX01BUCIsInRvZ2dsZVNwbGl0TWFwVXBkYXRlciIsIm1hcFN0YXRlUmVkdWNlckZhY3RvcnkiLCJpbml0aWFsU3RhdGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztvQkFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQTs7OztBQWNBOzs7O0FBWk8sSUFBTUEsZ0RBQW9CO0FBQy9CQyxTQUFPLENBRHdCO0FBRS9CQyxXQUFTLENBRnNCO0FBRy9CQyxZQUFVLFFBSHFCO0FBSS9CQyxhQUFXLENBQUMsU0FKbUI7QUFLL0JDLFFBQU0sQ0FMeUI7QUFNL0JDLGNBQVksS0FObUI7QUFPL0JDLFNBQU8sR0FQd0I7QUFRL0JDLFVBQVEsR0FSdUI7QUFTL0JDLFdBQVM7QUFUc0IsQ0FBMUI7O0FBb0JQLElBQU1DLG9GQUNIQyxzQkFBWUMsVUFEVCxFQUNzQkMsa0NBRHRCLGlEQUVIRixzQkFBWUcsVUFGVCxFQUVzQkMsa0NBRnRCLGlEQUdISixzQkFBWUssa0JBSFQsRUFHOEJDLDBDQUg5QixpREFJSE4sc0JBQVlPLGtCQUpULEVBSThCQyx5Q0FKOUIsaURBS0hSLHNCQUFZUyxnQkFMVCxFQUs0QkMsdUNBTDVCLGtCQUFOOztBQVFBO0FBQ08sSUFBTUMsMERBQXlCLFNBQXpCQSxzQkFBeUI7QUFBQSxNQUFDQyxZQUFELHVFQUFnQixFQUFoQjtBQUFBLFNBQXVCLGlDQUMzRGIsYUFEMkQsNkJBRXZEVixpQkFGdUQsRUFFakN1QixZQUZpQyxJQUVuQkEsMEJBRm1CLElBQXZCO0FBQUEsQ0FBL0I7O2tCQUtRRCx3QiIsImZpbGUiOiJtYXAtc3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTggVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG5pbXBvcnQge2hhbmRsZUFjdGlvbnN9IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IEFjdGlvblR5cGVzIGZyb20gJ2NvbnN0YW50cy9hY3Rpb24tdHlwZXMnO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9NQVBfU1RBVEUgPSB7XG4gIHBpdGNoOiAwLFxuICBiZWFyaW5nOiAwLFxuICBsYXRpdHVkZTogMzcuNzUwNDMsXG4gIGxvbmdpdHVkZTogLTEyMi4zNDY3OSxcbiAgem9vbTogOSxcbiAgZHJhZ1JvdGF0ZTogZmFsc2UsXG4gIHdpZHRoOiA4MDAsXG4gIGhlaWdodDogODAwLFxuICBpc1NwbGl0OiBmYWxzZVxufTtcblxuaW1wb3J0IHtcbiAgZml0Qm91bmRzVXBkYXRlcixcbiAgcmVjZWl2ZU1hcENvbmZpZ1VwZGF0ZXIsXG4gIHRvZ2dsZVBlcnNwZWN0aXZlVXBkYXRlcixcbiAgdG9nZ2xlU3BsaXRNYXBVcGRhdGVyLFxuICB1cGRhdGVNYXBVcGRhdGVyXG59IGZyb20gJy4vbWFwLXN0YXRlLXVwZGF0ZXJzJztcblxuY29uc3QgYWN0aW9uSGFuZGxlciA9IHtcbiAgW0FjdGlvblR5cGVzLlVQREFURV9NQVBdOiB1cGRhdGVNYXBVcGRhdGVyLFxuICBbQWN0aW9uVHlwZXMuRklUX0JPVU5EU106IGZpdEJvdW5kc1VwZGF0ZXIsXG4gIFtBY3Rpb25UeXBlcy5UT0dHTEVfUEVSU1BFQ1RJVkVdOiB0b2dnbGVQZXJzcGVjdGl2ZVVwZGF0ZXIsXG4gIFtBY3Rpb25UeXBlcy5SRUNFSVZFX01BUF9DT05GSUddOiByZWNlaXZlTWFwQ29uZmlnVXBkYXRlcixcbiAgW0FjdGlvblR5cGVzLlRPR0dMRV9TUExJVF9NQVBdOiB0b2dnbGVTcGxpdE1hcFVwZGF0ZXJcbn07XG5cbi8qIFJlZHVjZXIgKi9cbmV4cG9ydCBjb25zdCBtYXBTdGF0ZVJlZHVjZXJGYWN0b3J5ID0gKGluaXRpYWxTdGF0ZSA9IHt9KSA9PiBoYW5kbGVBY3Rpb25zKFxuICBhY3Rpb25IYW5kbGVyLFxuICB7Li4uSU5JVElBTF9NQVBfU1RBVEUsIC4uLmluaXRpYWxTdGF0ZSwgaW5pdGlhbFN0YXRlfVxuKTtcblxuZXhwb3J0IGRlZmF1bHQgbWFwU3RhdGVSZWR1Y2VyRmFjdG9yeSgpO1xuIl19