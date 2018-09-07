'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.pointVisConfigs = exports.pointOptionalColumns = exports.pointRequiredColumns = exports.pointPosResolver = exports.pointPosAccessor = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _scatterplotBrushingLayer = require('../../deckgl-layers/scatterplot-brushing-layer/scatterplot-brushing-layer');

var _scatterplotBrushingLayer2 = _interopRequireDefault(_scatterplotBrushingLayer);

var _colorUtils = require('../../utils/color-utils');

var _pointLayerIcon = require('./point-layer-icon');

var _pointLayerIcon2 = _interopRequireDefault(_pointLayerIcon);

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Copyright (c) 2018 Uber Technologies, Inc.
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

var pointPosAccessor = exports.pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng,
      altitude = _ref.altitude;
  return function (d) {
    return [d.data[lng.fieldIdx], d.data[lat.fieldIdx], altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0];
  };
};

var pointPosResolver = exports.pointPosResolver = function pointPosResolver(_ref2) {
  var lat = _ref2.lat,
      lng = _ref2.lng,
      altitude = _ref2.altitude;
  return lat.fieldIdx + '-' + lng.fieldIdx + '-' + (altitude ? altitude.fieldIdx : 'z');
};
var pointRequiredColumns = exports.pointRequiredColumns = ['lat', 'lng'];
var pointOptionalColumns = exports.pointOptionalColumns = ['altitude'];

var pointVisConfigs = exports.pointVisConfigs = {
  radius: 'radius',
  fixedRadius: 'fixedRadius',
  opacity: 'opacity',
  outline: 'outline',
  thickness: 'thickness',
  colorRange: 'colorRange',
  radiusRange: 'radiusRange',
  'hi-precision': 'hi-precision'
};

var PointLayer = function (_Layer) {
  (0, _inherits3.default)(PointLayer, _Layer);

  function PointLayer(props) {
    (0, _classCallCheck3.default)(this, PointLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PointLayer.__proto__ || Object.getPrototypeOf(PointLayer)).call(this, props));

    _this.registerVisConfig(pointVisConfigs);
    _this.getPosition = (0, _lodash2.default)(pointPosAccessor, pointPosResolver);
    return _this;
  }

  (0, _createClass3.default)(PointLayer, [{
    key: 'formatLayerData',
    value: function formatLayerData(_, allData, filteredIndex, oldLayerData) {
      var _this2 = this;

      var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var _config = this.config,
          colorScale = _config.colorScale,
          colorDomain = _config.colorDomain,
          colorField = _config.colorField,
          color = _config.color,
          columns = _config.columns,
          sizeField = _config.sizeField,
          sizeScale = _config.sizeScale,
          sizeDomain = _config.sizeDomain,
          _config$visConfig = _config.visConfig,
          radiusRange = _config$visConfig.radiusRange,
          fixedRadius = _config$visConfig.fixedRadius,
          colorRange = _config$visConfig.colorRange;

      // point color

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));

      // point radius
      var rScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, radiusRange, fixedRadius);

      var getPosition = this.getPosition(columns);

      if (!oldLayerData || oldLayerData.getPosition !== getPosition) {
        this.updateLayerMeta(allData, getPosition);
      }

      var data = void 0;
      if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getPosition === getPosition) {
        data = oldLayerData.data;
      } else {
        data = filteredIndex.reduce(function (accu, index) {
          var pos = getPosition({ data: allData[index] });

          // if doesn't have point lat or lng, do not add the point
          // deck.gl can't handle position = null
          if (!pos.every(Number.isFinite)) {
            return accu;
          }

          accu.push({
            data: allData[index]
          });

          return accu;
        }, []);
      }

      var getRadius = rScale ? function (d) {
        return _this2.getEncodedChannelValue(rScale, d.data, sizeField);
      } : 1;

      var getColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : color;

      return {
        data: data,
        getPosition: getPosition,
        getColor: getColor,
        getRadius: getRadius
      };
    }
  }, {
    key: 'updateLayerMeta',
    value: function updateLayerMeta(allData, getPosition) {
      var bounds = this.getPointsBounds(allData, function (d) {
        return getPosition({ data: d });
      });
      this.updateMeta({ bounds: bounds });
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(_ref3) {
      var data = _ref3.data,
          idx = _ref3.idx,
          layerInteraction = _ref3.layerInteraction,
          objectHovered = _ref3.objectHovered,
          mapState = _ref3.mapState,
          interactionConfig = _ref3.interactionConfig;

      var enableBrushing = interactionConfig.brush.enabled;

      var layerProps = (0, _extends3.default)({
        outline: this.config.visConfig.outline,
        radiusMinPixels: 1,
        fp64: this.config.visConfig['hi-precision'],
        strokeWidth: this.config.visConfig.thickness,
        radiusScale: this.getRadiusScaleByZoom(mapState)
      }, this.config.visConfig.fixedRadius ? {} : { radiusMaxPixels: 500 });

      var interaction = {
        autoHighlight: !enableBrushing,
        enableBrushing: enableBrushing,
        brushRadius: interactionConfig.brush.config.size * 1000,
        highlightColor: this.config.highlightColor
      };

      return [new _scatterplotBrushingLayer2.default((0, _extends3.default)({}, layerProps, layerInteraction, data, interaction, {
        idx: idx,
        id: this.id,
        opacity: this.config.visConfig.opacity,
        pickable: true,
        // parameters
        parameters: {
          depthTest: mapState.dragRotate
        },

        updateTriggers: {
          getRadius: {
            sizeField: this.config.sizeField,
            radiusRange: this.config.visConfig.radiusRange,
            fixedRadius: this.config.visConfig.fixedRadius,
            sizeScale: this.config.sizeScale
          },
          getColor: {
            color: this.config.color,
            colorField: this.config.colorField,
            colorRange: this.config.visConfig.colorRange,
            colorScale: this.config.colorScale
          }
        }
      }))];
    }
  }, {
    key: 'type',
    get: function get() {
      return 'point';
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return false;
    }
  }, {
    key: 'layerIcon',
    get: function get() {
      return _pointLayerIcon2.default;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return pointRequiredColumns;
    }
  }, {
    key: 'optionalColumns',
    get: function get() {
      return pointOptionalColumns;
    }
  }, {
    key: 'columnPairs',
    get: function get() {
      return this.defaultPointColumnPairs;
    }
  }, {
    key: 'noneLayerDataAffectingProps',
    get: function get() {
      return [].concat((0, _toConsumableArray3.default)((0, _get3.default)(PointLayer.prototype.__proto__ || Object.getPrototypeOf(PointLayer.prototype), 'noneLayerDataAffectingProps', this)), ['radius']);
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, (0, _get3.default)(PointLayer.prototype.__proto__ || Object.getPrototypeOf(PointLayer.prototype), 'visualChannels', this), {
        size: (0, _extends3.default)({}, (0, _get3.default)(PointLayer.prototype.__proto__ || Object.getPrototypeOf(PointLayer.prototype), 'visualChannels', this).size, {
          range: 'radiusRange',
          property: 'radius',
          channelScaleType: 'radius'
        })
      });
    }
  }], [{
    key: 'findDefaultLayerProps',
    value: function findDefaultLayerProps(_ref4) {
      var _ref4$fieldPairs = _ref4.fieldPairs,
          fieldPairs = _ref4$fieldPairs === undefined ? [] : _ref4$fieldPairs;

      var props = [];

      // Make layer for each pair
      fieldPairs.forEach(function (pair) {
        // find fields for tableFieldIndex
        var latField = pair.pair.lat;
        var lngField = pair.pair.lng;
        var layerName = pair.defaultName;

        var prop = {
          label: layerName.length ? layerName : 'Point'
        };

        // default layer color for begintrip and dropoff point
        if (latField.value in _defaultSettings.DEFAULT_LAYER_COLOR) {
          prop.color = (0, _colorUtils.hexToRgb)(_defaultSettings.DEFAULT_LAYER_COLOR[latField.value]);
        }

        // set the first layer to be visible
        if (props.length === 0) {
          prop.isVisible = true;
        }

        // const newLayer = new KeplerGlLayers.PointLayer(prop);
        prop.columns = {
          lat: latField,
          lng: lngField,
          altitude: { value: null, fieldIdx: -1, optional: true }
        };

        props.push(prop);
      });

      return props;
    }
  }]);
  return PointLayer;
}(_baseLayer2.default);

exports.default = PointLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJwb2ludFJlcXVpcmVkQ29sdW1ucyIsInBvaW50T3B0aW9uYWxDb2x1bW5zIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsImNvbG9yUmFuZ2UiLCJyYWRpdXNSYW5nZSIsIlBvaW50TGF5ZXIiLCJwcm9wcyIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0UG9zaXRpb24iLCJfIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJjb25maWciLCJjb2xvclNjYWxlIiwiY29sb3JEb21haW4iLCJjb2xvckZpZWxkIiwiY29sb3IiLCJjb2x1bW5zIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInZpc0NvbmZpZyIsImNTY2FsZSIsImdldFZpc0NoYW5uZWxTY2FsZSIsImNvbG9ycyIsIm1hcCIsImhleFRvUmdiIiwiclNjYWxlIiwidXBkYXRlTGF5ZXJNZXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsImdldFJhZGl1cyIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRDb2xvciIsImJvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsInVwZGF0ZU1ldGEiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJlbmFibGVCcnVzaGluZyIsImJydXNoIiwiZW5hYmxlZCIsImxheWVyUHJvcHMiLCJyYWRpdXNNaW5QaXhlbHMiLCJmcDY0Iiwic3Ryb2tlV2lkdGgiLCJyYWRpdXNTY2FsZSIsImdldFJhZGl1c1NjYWxlQnlab29tIiwicmFkaXVzTWF4UGl4ZWxzIiwiaW50ZXJhY3Rpb24iLCJhdXRvSGlnaGxpZ2h0IiwiYnJ1c2hSYWRpdXMiLCJzaXplIiwiaGlnaGxpZ2h0Q29sb3IiLCJTY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIiLCJpZCIsInBpY2thYmxlIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImRyYWdSb3RhdGUiLCJ1cGRhdGVUcmlnZ2VycyIsIlBvaW50TGF5ZXJJY29uIiwiZGVmYXVsdFBvaW50Q29sdW1uUGFpcnMiLCJyYW5nZSIsInByb3BlcnR5IiwiY2hhbm5lbFNjYWxlVHlwZSIsImZpZWxkUGFpcnMiLCJmb3JFYWNoIiwibGF0RmllbGQiLCJwYWlyIiwibG5nRmllbGQiLCJsYXllck5hbWUiLCJkZWZhdWx0TmFtZSIsInByb3AiLCJsYWJlbCIsImxlbmd0aCIsInZhbHVlIiwiREVGQVVMVF9MQVlFUl9DT0xPUiIsImlzVmlzaWJsZSIsIm9wdGlvbmFsIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOzs7O0FBQ0E7Ozs7QUF6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBU08sSUFBTUEsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxNQUFZQyxRQUFaLFFBQVlBLFFBQVo7QUFBQSxTQUEwQjtBQUFBLFdBQUssQ0FDN0RDLEVBQUVDLElBQUYsQ0FBT0gsSUFBSUksUUFBWCxDQUQ2RCxFQUU3REYsRUFBRUMsSUFBRixDQUFPSixJQUFJ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U0FBYjs7QUFJQTtBQUNBLFlBQUlILFNBQVNRLEtBQVQsSUFBa0JDLG9DQUF0QixFQUEyQztBQUN6Q0osZUFBS25FLEtBQUwsR0FBYSwwQkFBU3VFLHFDQUFvQlQsU0FBU1EsS0FBN0IsQ0FBVCxDQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxZQUFJbEYsTUFBTWlGLE1BQU4sS0FBaUIsQ0FBckIsRUFBd0I7QUFDdEJGLGVBQUtLLFNBQUwsR0FBaUIsSUFBakI7QUFDRDs7QUFFRDtBQUNBTCxhQUFLbEUsT0FBTCxHQUFlO0FBQ2IvQixlQUFLNEYsUUFEUTtBQUViM0YsZUFBSzZGLFFBRlE7QUFHYjVGLG9CQUFVLEVBQUNrRyxPQUFPLElBQVIsRUFBYy9GLFVBQVUsQ0FBQyxDQUF6QixFQUE0QmtHLFVBQVUsSUFBdEM7QUFIRyxTQUFmOztBQU1BckYsY0FBTWlDLElBQU4sQ0FBVzhDLElBQVg7QUFDRCxPQTVCRDs7QUE4QkEsYUFBTy9FLEtBQVA7QUFDRDs7O0VBbEZxQ3NGLG1COztrQkFBbkJ2RixVIiwiZmlsZSI6InBvaW50LWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE4IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuaW1wb3J0IFNjYXR0ZXJwbG90QnJ1c2hpbmdMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyL3NjYXR0ZXJwbG90LWJydXNoaW5nLWxheWVyJztcbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCBQb2ludExheWVySWNvbiBmcm9tICcuL3BvaW50LWxheWVyLWljb24nO1xuaW1wb3J0IHtERUZBVUxUX0xBWUVSX0NPTE9SfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmV4cG9ydCBjb25zdCBwb2ludFBvc0FjY2Vzc29yID0gKHtsYXQsIGxuZywgYWx0aXR1ZGV9KSA9PiBkID0+IFtcbiAgZC5kYXRhW2xuZy5maWVsZElkeF0sXG4gIGQuZGF0YVtsYXQuZmllbGRJZHhdLFxuICBhbHRpdHVkZSAmJiBhbHRpdHVkZS5maWVsZElkeCA+IC0xID8gZC5kYXRhW2FsdGl0dWRlLmZpZWxkSWR4XSA6IDBcbl07XG5cbmV4cG9ydCBjb25zdCBwb2ludFBvc1Jlc29sdmVyID0gKHtsYXQsIGxuZywgYWx0aXR1ZGV9KSA9PlxuICBgJHtsYXQuZmllbGRJZHh9LSR7bG5nLmZpZWxkSWR4fS0ke2FsdGl0dWRlID8gYWx0aXR1ZGUuZmllbGRJZHggOiAneid9YDtcbmV4cG9ydCBjb25zdCBwb2ludFJlcXVpcmVkQ29sdW1ucyA9IFsnbGF0JywgJ2xuZyddO1xuZXhwb3J0IGNvbnN0IHBvaW50T3B0aW9uYWxDb2x1bW5zID0gWydhbHRpdHVkZSddO1xuXG5leHBvcnQgY29uc3QgcG9pbnRWaXNDb25maWdzID0ge1xuICByYWRpdXM6ICdyYWRpdXMnLFxuICBmaXhlZFJhZGl1czogJ2ZpeGVkUmFkaXVzJyxcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBvdXRsaW5lOiAnb3V0bGluZScsXG4gIHRoaWNrbmVzczogJ3RoaWNrbmVzcycsXG4gIGNvbG9yUmFuZ2U6ICdjb2xvclJhbmdlJyxcbiAgcmFkaXVzUmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gICdoaS1wcmVjaXNpb24nOiAnaGktcHJlY2lzaW9uJ1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9pbnRMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKHBvaW50VmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRQb3NpdGlvbiA9IG1lbW9pemUocG9pbnRQb3NBY2Nlc3NvciwgcG9pbnRQb3NSZXNvbHZlcik7XG4gIH1cblxuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gJ3BvaW50JztcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gUG9pbnRMYXllckljb247XG4gIH1cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBwb2ludFJlcXVpcmVkQ29sdW1ucztcbiAgfVxuXG4gIGdldCBvcHRpb25hbENvbHVtbnMoKSB7XG4gICAgcmV0dXJuIHBvaW50T3B0aW9uYWxDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGNvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB0aGlzLmRlZmF1bHRQb2ludENvbHVtblBhaXJzO1xuICB9XG5cbiAgZ2V0IG5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcygpIHtcbiAgICByZXR1cm4gWy4uLnN1cGVyLm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcywgJ3JhZGl1cyddO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcmFuZ2U6ICdyYWRpdXNSYW5nZScsXG4gICAgICAgIHByb3BlcnR5OiAncmFkaXVzJyxcbiAgICAgICAgY2hhbm5lbFNjYWxlVHlwZTogJ3JhZGl1cydcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyh7ZmllbGRQYWlycyA9IFtdfSkge1xuICAgIGNvbnN0IHByb3BzID0gW107XG5cbiAgICAvLyBNYWtlIGxheWVyIGZvciBlYWNoIHBhaXJcbiAgICBmaWVsZFBhaXJzLmZvckVhY2gocGFpciA9PiB7XG4gICAgICAvLyBmaW5kIGZpZWxkcyBmb3IgdGFibGVGaWVsZEluZGV4XG4gICAgICBjb25zdCBsYXRGaWVsZCA9IHBhaXIucGFpci5sYXQ7XG4gICAgICBjb25zdCBsbmdGaWVsZCA9IHBhaXIucGFpci5sbmc7XG4gICAgICBjb25zdCBsYXllck5hbWUgPSBwYWlyLmRlZmF1bHROYW1lO1xuXG4gICAgICBjb25zdCBwcm9wID0ge1xuICAgICAgICBsYWJlbDogbGF5ZXJOYW1lLmxlbmd0aCA/IGxheWVyTmFtZSA6ICdQb2ludCdcbiAgICAgIH07XG5cbiAgICAgIC8vIGRlZmF1bHQgbGF5ZXIgY29sb3IgZm9yIGJlZ2ludHJpcCBhbmQgZHJvcG9mZiBwb2ludFxuICAgICAgaWYgKGxhdEZpZWxkLnZhbHVlIGluIERFRkFVTFRfTEFZRVJfQ09MT1IpIHtcbiAgICAgICAgcHJvcC5jb2xvciA9IGhleFRvUmdiKERFRkFVTFRfTEFZRVJfQ09MT1JbbGF0RmllbGQudmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2V0IHRoZSBmaXJzdCBsYXllciB0byBiZSB2aXNpYmxlXG4gICAgICBpZiAocHJvcHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHByb3AuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gY29uc3QgbmV3TGF5ZXIgPSBuZXcgS2VwbGVyR2xMYXllcnMuUG9pbnRMYXllcihwcm9wKTtcbiAgICAgIHByb3AuY29sdW1ucyA9IHtcbiAgICAgICAgbGF0OiBsYXRGaWVsZCxcbiAgICAgICAgbG5nOiBsbmdGaWVsZCxcbiAgICAgICAgYWx0aXR1ZGU6IHt2YWx1ZTogbnVsbCwgZmllbGRJZHg6IC0xLCBvcHRpb25hbDogdHJ1ZX1cbiAgICAgIH07XG5cbiAgICAgIHByb3BzLnB1c2gocHJvcCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoXywgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCwgb2xkTGF5ZXJEYXRhLCBvcHQgPSB7fSkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbG9yU2NhbGUsXG4gICAgICBjb2xvckRvbWFpbixcbiAgICAgIGNvbG9yRmllbGQsXG4gICAgICBjb2xvcixcbiAgICAgIGNvbHVtbnMsXG4gICAgICBzaXplRmllbGQsXG4gICAgICBzaXplU2NhbGUsXG4gICAgICBzaXplRG9tYWluLFxuICAgICAgdmlzQ29uZmlnOiB7cmFkaXVzUmFuZ2UsIGZpeGVkUmFkaXVzLCBjb2xvclJhbmdlfVxuICAgIH0gPSB0aGlzLmNvbmZpZztcblxuICAgIC8vIHBvaW50IGNvbG9yXG4gICAgY29uc3QgY1NjYWxlID1cbiAgICAgIGNvbG9yRmllbGQgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgICBjb2xvclNjYWxlLFxuICAgICAgICBjb2xvckRvbWFpbixcbiAgICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICAgKTtcblxuICAgIC8vIHBvaW50IHJhZGl1c1xuICAgIGNvbnN0IHJTY2FsZSA9XG4gICAgICBzaXplRmllbGQgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKHNpemVTY2FsZSwgc2l6ZURvbWFpbiwgcmFkaXVzUmFuZ2UsIGZpeGVkUmFkaXVzKTtcblxuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbihjb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiAhPT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAoXG4gICAgICBvbGRMYXllckRhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5kYXRhICYmXG4gICAgICBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb25cbiAgICApIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgICAvLyBpZiBkb2Vzbid0IGhhdmUgcG9pbnQgbGF0IG9yIGxuZywgZG8gbm90IGFkZCB0aGUgcG9pbnRcbiAgICAgICAgLy8gZGVjay5nbCBjYW4ndCBoYW5kbGUgcG9zaXRpb24gPSBudWxsXG4gICAgICAgIGlmICghcG9zLmV2ZXJ5KE51bWJlci5pc0Zpbml0ZSkpIHtcbiAgICAgICAgICByZXR1cm4gYWNjdTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0UmFkaXVzID0gclNjYWxlID8gZCA9PlxuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHJTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQpIDogMTtcblxuICAgIGNvbnN0IGdldENvbG9yID0gY1NjYWxlID8gZCA9PlxuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGEsXG4gICAgICBnZXRQb3NpdGlvbixcbiAgICAgIGdldENvbG9yLFxuICAgICAgZ2V0UmFkaXVzXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KSk7XG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBsYXllckludGVyYWN0aW9uLFxuICAgIG9iamVjdEhvdmVyZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfSkge1xuICAgIGNvbnN0IGVuYWJsZUJydXNoaW5nID0gaW50ZXJhY3Rpb25Db25maWcuYnJ1c2guZW5hYmxlZDtcblxuICAgIGNvbnN0IGxheWVyUHJvcHMgPSB7XG4gICAgICBvdXRsaW5lOiB0aGlzLmNvbmZpZy52aXNDb25maWcub3V0bGluZSxcbiAgICAgIHJhZGl1c01pblBpeGVsczogMSxcbiAgICAgIGZwNjQ6IHRoaXMuY29uZmlnLnZpc0NvbmZpZ1snaGktcHJlY2lzaW9uJ10sXG4gICAgICBzdHJva2VXaWR0aDogdGhpcy5jb25maWcudmlzQ29uZmlnLnRoaWNrbmVzcyxcbiAgICAgIHJhZGl1c1NjYWxlOiB0aGlzLmdldFJhZGl1c1NjYWxlQnlab29tKG1hcFN0YXRlKSxcbiAgICAgIC4uLih0aGlzLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXMgPyB7fSA6IHtyYWRpdXNNYXhQaXhlbHM6IDUwMH0pXG4gICAgfTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uID0ge1xuICAgICAgYXV0b0hpZ2hsaWdodDogIWVuYWJsZUJydXNoaW5nLFxuICAgICAgZW5hYmxlQnJ1c2hpbmcsXG4gICAgICBicnVzaFJhZGl1czogaW50ZXJhY3Rpb25Db25maWcuYnJ1c2guY29uZmlnLnNpemUgKiAxMDAwLFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yXG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgU2NhdHRlcnBsb3RCcnVzaGluZ0xheWVyKHtcbiAgICAgICAgLi4ubGF5ZXJQcm9wcyxcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgLi4uaW50ZXJhY3Rpb24sXG4gICAgICAgIGlkeCxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIG9wYWNpdHk6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5vcGFjaXR5LFxuICAgICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgICAgLy8gcGFyYW1ldGVyc1xuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgZGVwdGhUZXN0OiBtYXBTdGF0ZS5kcmFnUm90YXRlXG4gICAgICAgIH0sXG5cbiAgICAgICAgdXBkYXRlVHJpZ2dlcnM6IHtcbiAgICAgICAgICBnZXRSYWRpdXM6IHtcbiAgICAgICAgICAgIHNpemVGaWVsZDogdGhpcy5jb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICAgICAgcmFkaXVzUmFuZ2U6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy5yYWRpdXNSYW5nZSxcbiAgICAgICAgICAgIGZpeGVkUmFkaXVzOiB0aGlzLmNvbmZpZy52aXNDb25maWcuZml4ZWRSYWRpdXMsXG4gICAgICAgICAgICBzaXplU2NhbGU6IHRoaXMuY29uZmlnLnNpemVTY2FsZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0Q29sb3I6IHtcbiAgICAgICAgICAgIGNvbG9yOiB0aGlzLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICAgIGNvbG9yRmllbGQ6IHRoaXMuY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgICAgICBjb2xvclJhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgICAgIGNvbG9yU2NhbGU6IHRoaXMuY29uZmlnLmNvbG9yU2NhbGVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuIl19