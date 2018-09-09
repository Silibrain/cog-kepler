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

var _deck = require('deck.gl');

var _scatterplotBrushingLayer = require('../../deckgl-layers/scatterplot-brushing-layer/scatterplot-brushing-layer');

var _scatterplotBrushingLayer2 = _interopRequireDefault(_scatterplotBrushingLayer);

var _colorUtils = require('../../utils/color-utils');

var _pointLayerIcon = require('./point-layer-icon');

var _pointLayerIcon2 = _interopRequireDefault(_pointLayerIcon);

var _defaultSettings = require('../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pointPosAccessor = exports.pointPosAccessor = function pointPosAccessor(_ref) {
  var lat = _ref.lat,
      lng = _ref.lng,
      altitude = _ref.altitude;
  return function (d) {
    return [d.data[lng.fieldIdx], d.data[lat.fieldIdx], altitude && altitude.fieldIdx > -1 ? d.data[altitude.fieldIdx] : 0];
  };
}; // Copyright (c) 2018 Uber Technologies, Inc.
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
      var _this3 = this;

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
      }))].concat((0, _toConsumableArray3.default)(this.config.textLabel.field ? [new _deck.TextLayer({
        id: this.id + '-label',
        data: data.data,
        getPosition: data.getPosition,
        getPixelOffset: this.config.textLabel.offset,
        getSize: this.config.textLabel.size,
        getTextAnchor: this.config.textLabel.anchor,
        getText: function getText(d) {
          return String(d.data[_this3.config.textLabel.field.tableFieldIndex - 1]);
        },
        getColor: function getColor(d) {
          return _this3.config.textLabel.color;
        },
        updateTriggers: {
          getPosition: data.getPosition,
          getPixelOffset: this.config.textLabel.offset,
          getText: this.config.textLabel.field,
          getTextAnchor: this.config.textLabel.anchor,
          getSize: this.config.textLabel.size,
          getColor: this.config.textLabel.color
        }
      })] : []));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvcG9pbnQtbGF5ZXIvcG9pbnQtbGF5ZXIuanMiXSwibmFtZXMiOlsicG9pbnRQb3NBY2Nlc3NvciIsImxhdCIsImxuZyIsImFsdGl0dWRlIiwiZCIsImRhdGEiLCJmaWVsZElkeCIsInBvaW50UG9zUmVzb2x2ZXIiLCJwb2ludFJlcXVpcmVkQ29sdW1ucyIsInBvaW50T3B0aW9uYWxDb2x1bW5zIiwicG9pbnRWaXNDb25maWdzIiwicmFkaXVzIiwiZml4ZWRSYWRpdXMiLCJvcGFjaXR5Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsImNvbG9yUmFuZ2UiLCJyYWRpdXNSYW5nZSIsIlBvaW50TGF5ZXIiLCJwcm9wcyIsInJlZ2lzdGVyVmlzQ29uZmlnIiwiZ2V0UG9zaXRpb24iLCJfIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJvbGRMYXllckRhdGEiLCJvcHQiLCJjb25maWciLCJjb2xvclNjYWxlIiwiY29sb3JEb21haW4iLCJjb2xvckZpZWxkIiwiY29sb3IiLCJjb2x1bW5zIiwic2l6ZUZpZWxkIiwic2l6ZVNjYWxlIiwic2l6ZURvbWFpbiIsInZpc0NvbmZpZyIsImNTY2FsZSIsImdldFZpc0NoYW5uZWxTY2FsZSIsImNvbG9ycyIsIm1hcCIsImhleFRvUmdiIiwiclNjYWxlIiwidXBkYXRlTGF5ZXJNZXRhIiwic2FtZURhdGEiLCJyZWR1Y2UiLCJhY2N1IiwiaW5kZXgiLCJwb3MiLCJldmVyeSIsIk51bWJlciIsImlzRmluaXRlIiwicHVzaCIsImdldFJhZGl1cyIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRDb2xvciIsImJvdW5kcyIsImdldFBvaW50c0JvdW5kcyIsInVwZGF0ZU1ldGEiLCJpZHgiLCJsYXllckludGVyYWN0aW9uIiwib2JqZWN0SG92ZXJlZCIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJlbmFibGVCcnVzaGluZyIsImJydXNoIiwiZW5hYmxlZCIsImxheWVyUHJvcHMiLCJyYWRpdXNNaW5QaXhlbHMiLCJmcDY0Iiwic3Ryb2tlV2lkdGgiLCJyYWRpdXNTY2FsZSIsImdldFJhZGl1c1NjYWxlQnlab29tIiwicmFkaXVzTWF4UGl4ZWxzIiwiaW50ZXJhY3Rpb24iLCJhdXRvSGlnaGxpZ2h0IiwiYnJ1c2hSYWRpdXMiLCJzaXplIiwiaGlnaGxpZ2h0Q29sb3IiLCJTY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIiLCJpZCIsInBpY2thYmxlIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImRyYWdSb3RhdGUiLCJ1cGRhdGVUcmlnZ2VycyIsInRleHRMYWJlbCIsImZpZWxkIiwiVGV4dExheWVyIiwiZ2V0UGl4ZWxPZmZzZXQiLCJvZmZzZXQiLCJnZXRTaXplIiwiZ2V0VGV4dEFuY2hvciIsImFuY2hvciIsImdldFRleHQiLCJTdHJpbmciLCJ0YWJsZUZpZWxkSW5kZXgiLCJQb2ludExheWVySWNvbiIsImRlZmF1bHRQb2ludENvbHVtblBhaXJzIiwicmFuZ2UiLCJwcm9wZXJ0eSIsImNoYW5uZWxTY2FsZVR5cGUiLCJmaWVsZFBhaXJzIiwiZm9yRWFjaCIsImxhdEZpZWxkIiwicGFpciIsImxuZ0ZpZWxkIiwibGF5ZXJOYW1lIiwiZGVmYXVsdE5hbWUiLCJwcm9wIiwibGFiZWwiLCJsZW5ndGgiLCJ2YWx1ZSIsIkRFRkFVTFRfTEFZRVJfQ09MT1IiLCJpc1Zpc2libGUiLCJvcHRpb25hbCIsIkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBRU8sSUFBTUEsOENBQW1CLFNBQW5CQSxnQkFBbUI7QUFBQSxNQUFFQyxHQUFGLFFBQUVBLEdBQUY7QUFBQSxNQUFPQyxHQUFQLFFBQU9BLEdBQVA7QUFBQSxNQUFZQyxRQUFaLFFBQVlBLFFBQVo7QUFBQSxTQUEwQjtBQUFBLFdBQUssQ0FDN0RDLEVBQUVDLElBQUYsQ0FBT0gsSUFBSUks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LE9BQU87QUFDWEMsaUJBQU9ILFVBQVVJLE1BQVYsR0FBbUJKLFNBQW5CLEdBQStCO0FBRDNCLFNBQWI7O0FBSUE7QUFDQSxZQUFJSCxTQUFTUSxLQUFULElBQWtCQyxvQ0FBdEIsRUFBMkM7QUFDekNKLGVBQUs5RSxLQUFMLEdBQWEsMEJBQVNrRixxQ0FBb0JULFNBQVNRLEtBQTdCLENBQVQsQ0FBYjtBQUNEOztBQUVEO0FBQ0EsWUFBSTdGLE1BQU00RixNQUFOLEtBQWlCLENBQXJCLEVBQXdCO0FBQ3RCRixlQUFLSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0Q7O0FBRUQ7QUFDQUwsYUFBSzdFLE9BQUwsR0FBZTtBQUNiL0IsZUFBS3VHLFFBRFE7QUFFYnRHLGVBQUt3RyxRQUZRO0FBR2J2RyxvQkFBVSxFQUFDNkcsT0FBTyxJQUFSLEVBQWMxRyxVQUFVLENBQUMsQ0FBekIsRUFBNEI2RyxVQUFVLElBQXRDO0FBSEcsU0FBZjs7QUFNQWhHLGNBQU1pQyxJQUFOLENBQVd5RCxJQUFYO0FBQ0QsT0E1QkQ7O0FBOEJBLGFBQU8xRixLQUFQO0FBQ0Q7OztFQWxGcUNpRyxtQjs7a0JBQW5CbEcsVSIsImZpbGUiOiJwb2ludC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxOCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBMYXllciBmcm9tICcuLi9iYXNlLWxheWVyJztcbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcbmltcG9ydCB7VGV4dExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCBTY2F0dGVycGxvdEJydXNoaW5nTGF5ZXIgZnJvbSAnZGVja2dsLWxheWVycy9zY2F0dGVycGxvdC1icnVzaGluZy1sYXllci9zY2F0dGVycGxvdC1icnVzaGluZy1sYXllcic7XG5pbXBvcnQge2hleFRvUmdifSBmcm9tICd1dGlscy9jb2xvci11dGlscyc7XG5pbXBvcnQgUG9pbnRMYXllckljb24gZnJvbSAnLi9wb2ludC1sYXllci1pY29uJztcbmltcG9ydCB7REVGQVVMVF9MQVlFUl9DT0xPUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NBY2Nlc3NvciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT4gZCA9PiBbXG4gIGQuZGF0YVtsbmcuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0LmZpZWxkSWR4XSxcbiAgYWx0aXR1ZGUgJiYgYWx0aXR1ZGUuZmllbGRJZHggPiAtMSA/IGQuZGF0YVthbHRpdHVkZS5maWVsZElkeF0gOiAwXG5dO1xuXG5leHBvcnQgY29uc3QgcG9pbnRQb3NSZXNvbHZlciA9ICh7bGF0LCBsbmcsIGFsdGl0dWRlfSkgPT5cbiAgYCR7bGF0LmZpZWxkSWR4fS0ke2xuZy5maWVsZElkeH0tJHthbHRpdHVkZSA/IGFsdGl0dWRlLmZpZWxkSWR4IDogJ3onfWA7XG5leHBvcnQgY29uc3QgcG9pbnRSZXF1aXJlZENvbHVtbnMgPSBbJ2xhdCcsICdsbmcnXTtcbmV4cG9ydCBjb25zdCBwb2ludE9wdGlvbmFsQ29sdW1ucyA9IFsnYWx0aXR1ZGUnXTtcblxuZXhwb3J0IGNvbnN0IHBvaW50VmlzQ29uZmlncyA9IHtcbiAgcmFkaXVzOiAncmFkaXVzJyxcbiAgZml4ZWRSYWRpdXM6ICdmaXhlZFJhZGl1cycsXG4gIG9wYWNpdHk6ICdvcGFjaXR5JyxcbiAgb3V0bGluZTogJ291dGxpbmUnLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHJhZGl1c1JhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbidcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvaW50TGF5ZXIgZXh0ZW5kcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhwb2ludFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0UG9zaXRpb24gPSBtZW1vaXplKHBvaW50UG9zQWNjZXNzb3IsIHBvaW50UG9zUmVzb2x2ZXIpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdwb2ludCc7XG4gIH1cblxuICBnZXQgaXNBZ2dyZWdhdGVkKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGdldCBsYXllckljb24oKSB7XG4gICAgcmV0dXJuIFBvaW50TGF5ZXJJY29uO1xuICB9XG4gIGdldCByZXF1aXJlZExheWVyQ29sdW1ucygpIHtcbiAgICByZXR1cm4gcG9pbnRSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgb3B0aW9uYWxDb2x1bW5zKCkge1xuICAgIHJldHVybiBwb2ludE9wdGlvbmFsQ29sdW1ucztcbiAgfVxuXG4gIGdldCBjb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4gdGhpcy5kZWZhdWx0UG9pbnRDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCBub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMoKSB7XG4gICAgcmV0dXJuIFsuLi5zdXBlci5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMsICdyYWRpdXMnXTtcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMsXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHJhbmdlOiAncmFkaXVzUmFuZ2UnLFxuICAgICAgICBwcm9wZXJ0eTogJ3JhZGl1cycsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6ICdyYWRpdXMnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kRGVmYXVsdExheWVyUHJvcHMoe2ZpZWxkUGFpcnMgPSBbXX0pIHtcbiAgICBjb25zdCBwcm9wcyA9IFtdO1xuXG4gICAgLy8gTWFrZSBsYXllciBmb3IgZWFjaCBwYWlyXG4gICAgZmllbGRQYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xuICAgICAgLy8gZmluZCBmaWVsZHMgZm9yIHRhYmxlRmllbGRJbmRleFxuICAgICAgY29uc3QgbGF0RmllbGQgPSBwYWlyLnBhaXIubGF0O1xuICAgICAgY29uc3QgbG5nRmllbGQgPSBwYWlyLnBhaXIubG5nO1xuICAgICAgY29uc3QgbGF5ZXJOYW1lID0gcGFpci5kZWZhdWx0TmFtZTtcblxuICAgICAgY29uc3QgcHJvcCA9IHtcbiAgICAgICAgbGFiZWw6IGxheWVyTmFtZS5sZW5ndGggPyBsYXllck5hbWUgOiAnUG9pbnQnXG4gICAgICB9O1xuXG4gICAgICAvLyBkZWZhdWx0IGxheWVyIGNvbG9yIGZvciBiZWdpbnRyaXAgYW5kIGRyb3BvZmYgcG9pbnRcbiAgICAgIGlmIChsYXRGaWVsZC52YWx1ZSBpbiBERUZBVUxUX0xBWUVSX0NPTE9SKSB7XG4gICAgICAgIHByb3AuY29sb3IgPSBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SW2xhdEZpZWxkLnZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB0aGUgZmlyc3QgbGF5ZXIgdG8gYmUgdmlzaWJsZVxuICAgICAgaWYgKHByb3BzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBwcm9wLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnN0IG5ld0xheWVyID0gbmV3IEtlcGxlckdsTGF5ZXJzLlBvaW50TGF5ZXIocHJvcCk7XG4gICAgICBwcm9wLmNvbHVtbnMgPSB7XG4gICAgICAgIGxhdDogbGF0RmllbGQsXG4gICAgICAgIGxuZzogbG5nRmllbGQsXG4gICAgICAgIGFsdGl0dWRlOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgICB9O1xuXG4gICAgICBwcm9wcy5wdXNoKHByb3ApO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKF8sIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY29sb3JEb21haW4sXG4gICAgICBjb2xvckZpZWxkLFxuICAgICAgY29sb3IsXG4gICAgICBjb2x1bW5zLFxuICAgICAgc2l6ZUZpZWxkLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHZpc0NvbmZpZzoge3JhZGl1c1JhbmdlLCBmaXhlZFJhZGl1cywgY29sb3JSYW5nZX1cbiAgICB9ID0gdGhpcy5jb25maWc7XG5cbiAgICAvLyBwb2ludCBjb2xvclxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgY29sb3JTY2FsZSxcbiAgICAgICAgY29sb3JEb21haW4sXG4gICAgICAgIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChoZXhUb1JnYilcbiAgICAgICk7XG5cbiAgICAvLyBwb2ludCByYWRpdXNcbiAgICBjb25zdCByU2NhbGUgPVxuICAgICAgc2l6ZUZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShzaXplU2NhbGUsIHNpemVEb21haW4sIHJhZGl1c1JhbmdlLCBmaXhlZFJhZGl1cyk7XG5cbiAgICBjb25zdCBnZXRQb3NpdGlvbiA9IHRoaXMuZ2V0UG9zaXRpb24oY29sdW1ucyk7XG5cbiAgICBpZiAoIW9sZExheWVyRGF0YSB8fCBvbGRMYXllckRhdGEuZ2V0UG9zaXRpb24gIT09IGdldFBvc2l0aW9uKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbik7XG4gICAgfVxuXG4gICAgbGV0IGRhdGE7XG4gICAgaWYgKFxuICAgICAgb2xkTGF5ZXJEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZGF0YSAmJlxuICAgICAgb3B0LnNhbWVEYXRhICYmXG4gICAgICBvbGRMYXllckRhdGEuZ2V0UG9zaXRpb24gPT09IGdldFBvc2l0aW9uXG4gICAgKSB7XG4gICAgICBkYXRhID0gb2xkTGF5ZXJEYXRhLmRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRhdGEgPSBmaWx0ZXJlZEluZGV4LnJlZHVjZSgoYWNjdSwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGFsbERhdGFbaW5kZXhdfSk7XG5cbiAgICAgICAgLy8gaWYgZG9lc24ndCBoYXZlIHBvaW50IGxhdCBvciBsbmcsIGRvIG5vdCBhZGQgdGhlIHBvaW50XG4gICAgICAgIC8vIGRlY2suZ2wgY2FuJ3QgaGFuZGxlIHBvc2l0aW9uID0gbnVsbFxuICAgICAgICBpZiAoIXBvcy5ldmVyeShOdW1iZXIuaXNGaW5pdGUpKSB7XG4gICAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICAgIH1cblxuICAgICAgICBhY2N1LnB1c2goe1xuICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgfSwgW10pO1xuICAgIH1cblxuICAgIGNvbnN0IGdldFJhZGl1cyA9IHJTY2FsZSA/IGQgPT5cbiAgICAgIHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShyU2NhbGUsIGQuZGF0YSwgc2l6ZUZpZWxkKSA6IDE7XG5cbiAgICBjb25zdCBnZXRDb2xvciA9IGNTY2FsZSA/IGQgPT5cbiAgICAgIHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGQuZGF0YSwgY29sb3JGaWVsZCkgOiBjb2xvcjtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0UG9zaXRpb24sXG4gICAgICBnZXRDb2xvcixcbiAgICAgIGdldFJhZGl1c1xuICAgIH07XG4gIH1cblxuICB1cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhhbGxEYXRhLCBkID0+IGdldFBvc2l0aW9uKHtkYXRhOiBkfSkpO1xuICAgIHRoaXMudXBkYXRlTWV0YSh7Ym91bmRzfSk7XG4gIH1cblxuICByZW5kZXJMYXllcih7XG4gICAgZGF0YSxcbiAgICBpZHgsXG4gICAgbGF5ZXJJbnRlcmFjdGlvbixcbiAgICBvYmplY3RIb3ZlcmVkLFxuICAgIG1hcFN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnXG4gIH0pIHtcbiAgICBjb25zdCBlbmFibGVCcnVzaGluZyA9IGludGVyYWN0aW9uQ29uZmlnLmJydXNoLmVuYWJsZWQ7XG5cbiAgICBjb25zdCBsYXllclByb3BzID0ge1xuICAgICAgb3V0bGluZTogdGhpcy5jb25maWcudmlzQ29uZmlnLm91dGxpbmUsXG4gICAgICByYWRpdXNNaW5QaXhlbHM6IDEsXG4gICAgICBmcDY0OiB0aGlzLmNvbmZpZy52aXNDb25maWdbJ2hpLXByZWNpc2lvbiddLFxuICAgICAgc3Ryb2tlV2lkdGg6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MsXG4gICAgICByYWRpdXNTY2FsZTogdGhpcy5nZXRSYWRpdXNTY2FsZUJ5Wm9vbShtYXBTdGF0ZSksXG4gICAgICAuLi4odGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzID8ge30gOiB7cmFkaXVzTWF4UGl4ZWxzOiA1MDB9KVxuICAgIH07XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IHtcbiAgICAgIGF1dG9IaWdobGlnaHQ6ICFlbmFibGVCcnVzaGluZyxcbiAgICAgIGVuYWJsZUJydXNoaW5nLFxuICAgICAgYnJ1c2hSYWRpdXM6IGludGVyYWN0aW9uQ29uZmlnLmJydXNoLmNvbmZpZy5zaXplICogMTAwMCxcbiAgICAgIGhpZ2hsaWdodENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvclxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IFNjYXR0ZXJwbG90QnJ1c2hpbmdMYXllcih7XG4gICAgICAgIC4uLmxheWVyUHJvcHMsXG4gICAgICAgIC4uLmxheWVySW50ZXJhY3Rpb24sXG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIC4uLmludGVyYWN0aW9uLFxuICAgICAgICBpZHgsXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBvcGFjaXR5OiB0aGlzLmNvbmZpZy52aXNDb25maWcub3BhY2l0eSxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG4gICAgICAgIC8vIHBhcmFtZXRlcnNcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIGRlcHRoVGVzdDogbWFwU3RhdGUuZHJhZ1JvdGF0ZVxuICAgICAgICB9LFxuXG4gICAgICAgIHVwZGF0ZVRyaWdnZXJzOiB7XG4gICAgICAgICAgZ2V0UmFkaXVzOiB7XG4gICAgICAgICAgICBzaXplRmllbGQ6IHRoaXMuY29uZmlnLnNpemVGaWVsZCxcbiAgICAgICAgICAgIHJhZGl1c1JhbmdlOiB0aGlzLmNvbmZpZy52aXNDb25maWcucmFkaXVzUmFuZ2UsXG4gICAgICAgICAgICBmaXhlZFJhZGl1czogdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzLFxuICAgICAgICAgICAgc2l6ZVNjYWxlOiB0aGlzLmNvbmZpZy5zaXplU2NhbGVcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldENvbG9yOiB7XG4gICAgICAgICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICAgICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICAgICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIC8vIHRleHQgbGFiZWwgbGF5ZXJcbiAgICAgIC4uLih0aGlzLmNvbmZpZy50ZXh0TGFiZWwuZmllbGRcbiAgICAgICAgPyBbXG4gICAgICAgICAgICBuZXcgVGV4dExheWVyKHtcbiAgICAgICAgICAgICAgaWQ6IGAke3RoaXMuaWR9LWxhYmVsYCxcbiAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLFxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbjogZGF0YS5nZXRQb3NpdGlvbixcbiAgICAgICAgICAgICAgZ2V0UGl4ZWxPZmZzZXQ6IHRoaXMuY29uZmlnLnRleHRMYWJlbC5vZmZzZXQsXG4gICAgICAgICAgICAgIGdldFNpemU6IHRoaXMuY29uZmlnLnRleHRMYWJlbC5zaXplLFxuICAgICAgICAgICAgICBnZXRUZXh0QW5jaG9yOiB0aGlzLmNvbmZpZy50ZXh0TGFiZWwuYW5jaG9yLFxuICAgICAgICAgICAgICBnZXRUZXh0OiBkID0+IFN0cmluZyhkLmRhdGFbdGhpcy5jb25maWcudGV4dExhYmVsLmZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFdKSxcbiAgICAgICAgICAgICAgZ2V0Q29sb3I6IGQgPT4gdGhpcy5jb25maWcudGV4dExhYmVsLmNvbG9yLFxuICAgICAgICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uOiBkYXRhLmdldFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgIGdldFBpeGVsT2Zmc2V0OiB0aGlzLmNvbmZpZy50ZXh0TGFiZWwub2Zmc2V0LFxuICAgICAgICAgICAgICAgIGdldFRleHQ6IHRoaXMuY29uZmlnLnRleHRMYWJlbC5maWVsZCxcbiAgICAgICAgICAgICAgICBnZXRUZXh0QW5jaG9yOiB0aGlzLmNvbmZpZy50ZXh0TGFiZWwuYW5jaG9yLFxuICAgICAgICAgICAgICAgIGdldFNpemU6IHRoaXMuY29uZmlnLnRleHRMYWJlbC5zaXplLFxuICAgICAgICAgICAgICAgIGdldENvbG9yOiB0aGlzLmNvbmZpZy50ZXh0TGFiZWwuY29sb3JcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19