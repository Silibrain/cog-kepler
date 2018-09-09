'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.HexagonIdVisConfigs = exports.hexIdResolver = exports.hexIdAccessor = exports.hexIdRequiredColumns = exports.HEXAGON_ID_FIELDS = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _deck = require('deck.gl');

var _h3HexagonCellLayer = require('./h3-hexagon-cell-layer');

var _h3HexagonCellLayer2 = _interopRequireDefault(_h3HexagonCellLayer);

var _h3Utils = require('./h3-utils');

var _h3HexagonLayerIcon = require('./h3-hexagon-layer-icon');

var _h3HexagonLayerIcon2 = _interopRequireDefault(_h3HexagonLayerIcon);

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

var HEXAGON_ID_FIELDS = exports.HEXAGON_ID_FIELDS = {
  hex_id: ['hex_id', 'hexagon_id', 'h3_id']
};

var hexIdRequiredColumns = exports.hexIdRequiredColumns = ['hex_id'];
var hexIdAccessor = exports.hexIdAccessor = function hexIdAccessor(_ref) {
  var hex_id = _ref.hex_id;
  return function (d) {
    return d[hex_id.fieldIdx];
  };
};
var hexIdResolver = exports.hexIdResolver = function hexIdResolver(_ref2) {
  var hex_id = _ref2.hex_id;
  return hex_id.fieldIdx;
};

var HexagonIdVisConfigs = exports.HexagonIdVisConfigs = {
  opacity: 'opacity',
  colorRange: 'colorRange',
  coverage: 'coverage',
  sizeRange: 'elevationRange',
  elevationScale: 'elevationScale',
  'hi-precision': 'hi-precision'
};

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  return [r, g, b];
}

var HexagonIdLayer = function (_Layer) {
  (0, _inherits3.default)(HexagonIdLayer, _Layer);

  function HexagonIdLayer(props) {
    (0, _classCallCheck3.default)(this, HexagonIdLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HexagonIdLayer.__proto__ || Object.getPrototypeOf(HexagonIdLayer)).call(this, props));

    _this.registerVisConfig(HexagonIdVisConfigs);
    _this.getHexId = (0, _lodash2.default)(hexIdAccessor, hexIdResolver);
    return _this;
  }

  (0, _createClass3.default)(HexagonIdLayer, [{
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
          sizeRange = _config$visConfig.sizeRange,
          colorRange = _config$visConfig.colorRange;

      // color

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(function (c) {
        return hexToRgb(c);
      }));

      // height
      var sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

      var getHexId = this.getHexId(columns);

      if (!oldLayerData || oldLayerData.getHexId !== getHexId) {
        this.updateLayerMeta(allData, getHexId);
      }

      var data = void 0;
      if (oldLayerData && oldLayerData.data && opt.sameData && oldLayerData.getHexId === getHexId) {
        data = oldLayerData.data;
      } else {
        data = filteredIndex.reduce(function (accu, index, i) {
          var id = getHexId(allData[index]);
          var centroid = _this2.dataToFeature.centroids[index];

          if (centroid) {
            accu.push({
              // keep a reference to the original data index
              index: i,
              data: allData[index],
              id: id,
              centroid: centroid
            });
          }

          return accu;
        }, []);
      }

      var getElevation = sScale ? function (d) {
        return _this2.getEncodedChannelValue(sScale, d.data, sizeField, 0);
      } : 0;

      var getColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : color;

      // const layerData = {
      return {
        data: data,
        getElevation: getElevation,
        getColor: getColor,
        getHexId: getHexId,
        hexagonVertices: this.dataToFeature.hexagonVertices,
        hexagonCenter: this.dataToFeature.hexagonCenter
      };
    }
  }, {
    key: 'updateLayerMeta',
    value: function updateLayerMeta(allData, getHexId) {
      var hexagonVertices = void 0;
      var hexagonCenter = void 0;
      var centroids = {};

      allData.forEach(function (d, index) {
        var id = getHexId(d);
        if (typeof id !== 'string' || !id.length) {
          return;
        }
        // find hexagonVertices
        // only need 1 instance of hexagonVertices
        if (!hexagonVertices) {
          hexagonVertices = id && (0, _h3Utils.getVertices)({ id: id });
          hexagonCenter = id && (0, _h3Utils.getCentroid)({ id: id });
        }

        // save a reference of centroids to dataToFeature
        // so we don't have to re calculate it again
        centroids[index] = (0, _h3Utils.getCentroid)({ id: id });
      });

      var bounds = this.getPointsBounds(Object.values(centroids), function (d) {
        return d;
      });
      var lightSettings = this.getLightSettingsFromBounds(bounds);

      this.dataToFeature = { hexagonVertices: hexagonVertices, hexagonCenter: hexagonCenter, centroids: centroids };
      this.updateMeta({ bounds: bounds, lightSettings: lightSettings });
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

      var zoomFactor = this.getZoomFactor(mapState);
      var eleZoomFactor = this.getElevationZoomFactor(mapState);
      var config = this.config,
          meta = this.meta;
      var visConfig = config.visConfig;


      var updateTriggers = {
        getColor: {
          color: config.color,
          colorField: config.colorField,
          colorRange: config.visConfig.colorRange,
          colorScale: config.colorScale
        },
        getElevation: {
          sizeField: config.sizeField,
          sizeRange: config.visConfig.sizeRange
        }
      };

      return [new _h3HexagonCellLayer2.default((0, _extends3.default)({}, layerInteraction, data, {
        id: this.id,
        idx: idx,
        pickable: true,

        // coverage
        coverage: visConfig.coverage,

        // parameters
        parameters: { depthTest: Boolean(config.sizeField || mapState.dragRotate) },

        // highlight
        autoHighlight: Boolean(config.sizeField),

        // elevation
        extruded: Boolean(config.sizeField),
        elevationScale: visConfig.elevationScale * eleZoomFactor,

        // color
        opacity: visConfig.opacity,

        // render
        lightSettings: meta.lightSettings,
        updateTriggers: updateTriggers
      }))].concat((0, _toConsumableArray3.default)(this.isLayerHovered(objectHovered) && !config.sizeField ? [new _deck.GeoJsonLayer({
        id: this.id + '-hovered',
        data: [(0, _h3Utils.idToPolygonGeo)(objectHovered, {
          lineColor: config.highlightColor
        })],
        lineWidthScale: 8 * zoomFactor
      })] : []));
    }
  }, {
    key: 'type',
    get: function get() {
      return 'hexagonId';
    }
  }, {
    key: 'name',
    get: function get() {
      return 'H3';
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return hexIdRequiredColumns;
    }
  }, {
    key: 'layerIcon',
    get: function get() {
      // use hexagon layer icon for now
      return _h3HexagonLayerIcon2.default;
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, (0, _get3.default)(HexagonIdLayer.prototype.__proto__ || Object.getPrototypeOf(HexagonIdLayer.prototype), 'visualChannels', this), {
        size: (0, _extends3.default)({}, (0, _get3.default)(HexagonIdLayer.prototype.__proto__ || Object.getPrototypeOf(HexagonIdLayer.prototype), 'visualChannels', this).size, {
          property: 'height'
        })
      });
    }
  }], [{
    key: 'findDefaultLayerProps',
    value: function findDefaultLayerProps(_ref4) {
      var fields = _ref4.fields;

      var foundColumns = this.findDefaultColumnField(HEXAGON_ID_FIELDS, fields);
      if (!foundColumns || !foundColumns.length) {
        return null;
      }

      return foundColumns.map(function (columns) {
        return {
          isVisible: true,
          label: 'H3 Hexagon',
          columns: columns
        };
      });
    }
  }]);
  return HexagonIdLayer;
}(_baseLayer2.default);

exports.default = HexagonIdLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy1oZXhhZ29uLWxheWVyLmpzIl0sIm5hbWVzIjpbIkhFWEFHT05fSURfRklFTERTIiwiaGV4X2lkIiwiaGV4SWRSZXF1aXJlZENvbHVtbnMiLCJoZXhJZEFjY2Vzc29yIiwiZCIsImZpZWxkSWR4IiwiaGV4SWRSZXNvbHZlciIsIkhleGFnb25JZFZpc0NvbmZpZ3MiLCJvcGFjaXR5IiwiY29sb3JSYW5nZSIsImNvdmVyYWdlIiwic2l6ZVJhbmdlIiwiZWxldmF0aW9uU2NhbGUiLCJoZXhUb1JnYiIsImhleCIsInJlc3VsdCIsImV4ZWMiLCJyIiwicGFyc2VJbnQiLCJnIiwiYiIsIkhleGFnb25JZExheWVyIiwicHJvcHMiLCJyZWdpc3RlclZpc0NvbmZpZyIsImdldEhleElkIiwiXyIsImFsbERhdGEiLCJmaWx0ZXJlZEluZGV4Iiwib2xkTGF5ZXJEYXRhIiwib3B0IiwiY29uZmlnIiwiY29sb3JTY2FsZSIsImNvbG9yRG9tYWluIiwiY29sb3JGaWVsZCIsImNvbG9yIiwiY29sdW1ucyIsInNpemVGaWVsZCIsInNpemVTY2FsZSIsInNpemVEb21haW4iLCJ2aXNDb25maWciLCJjU2NhbGUiLCJnZXRWaXNDaGFubmVsU2NhbGUiLCJjb2xvcnMiLCJtYXAiLCJjIiwic1NjYWxlIiwidXBkYXRlTGF5ZXJNZXRhIiwiZGF0YSIsInNhbWVEYXRhIiwicmVkdWNlIiwiYWNjdSIsImluZGV4IiwiaSIsImlkIiwiY2VudHJvaWQiLCJkYXRhVG9GZWF0dXJlIiwiY2VudHJvaWRzIiwicHVzaCIsImdldEVsZXZhdGlvbiIsImdldEVuY29kZWRDaGFubmVsVmFsdWUiLCJnZXRDb2xvciIsImhleGFnb25WZXJ0aWNlcyIsImhleGFnb25DZW50ZXIiLCJmb3JFYWNoIiwibGVuZ3RoIiwiYm91bmRzIiwiZ2V0UG9pbnRzQm91bmRzIiwiT2JqZWN0IiwidmFsdWVzIiwibGlnaHRTZXR0aW5ncyIsImdldExpZ2h0U2V0dGluZ3NGcm9tQm91bmRzIiwidXBkYXRlTWV0YSIsImlkeCIsImxheWVySW50ZXJhY3Rpb24iLCJvYmplY3RIb3ZlcmVkIiwibWFwU3RhdGUiLCJpbnRlcmFjdGlvbkNvbmZpZyIsInpvb21GYWN0b3IiLCJnZXRab29tRmFjdG9yIiwiZWxlWm9vbUZhY3RvciIsImdldEVsZXZhdGlvblpvb21GYWN0b3IiLCJtZXRhIiwidXBkYXRlVHJpZ2dlcnMiLCJIM0hleGFnb25DZWxsTGF5ZXIiLCJwaWNrYWJsZSIsInBhcmFtZXRlcnMiLCJkZXB0aFRlc3QiLCJCb29sZWFuIiwiZHJhZ1JvdGF0ZSIsImF1dG9IaWdobGlnaHQiLCJleHRydWRlZCIsImlzTGF5ZXJIb3ZlcmVkIiwiR2VvSnNvbkxheWVyIiwibGluZUNvbG9yIiwiaGlnaGxpZ2h0Q29sb3IiLCJsaW5lV2lkdGhTY2FsZSIsIkgzSGV4YWdvbkxheWVySWNvbiIsInNpemUiLCJwcm9wZXJ0eSIsImZpZWxkcyIsImZvdW5kQ29sdW1ucyIsImZpbmREZWZhdWx0Q29sdW1uRmllbGQiLCJpc1Zpc2libGUiLCJsYWJlbCIsIkxheWVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQTs7OztBQUVBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQVVPLElBQU1BLGdEQUFvQjtBQUMvQkMsVUFBUSxDQUFDLFFBQUQsRUFBVyxZQUFYLEVBQXlCLE9BQXpCO0FBRHVCLENBQTFCOztBQUlBLElBQU1DLHNEQUF1QixDQUFDLFFBQUQsQ0FBN0I7QUFDQSxJQUFNQyx3Q0FBZ0IsU0FBaEJBLGFBQWdCO0FBQUEsTUFBRUYsTUFBRixRQUFFQSxNQUFGO0FBQUEsU0FBYztBQUFBLFdBQUtHLEVBQUVILE9BQU9JLFFBQVQs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QSxFQXhDTjtBQTBDRDs7O3dCQXJOVTtBQUNULGFBQU8sV0FBUDtBQUNEOzs7d0JBRVU7QUFDVCxhQUFPLElBQVA7QUFDRDs7O3dCQUUwQjtBQUN6QixhQUFPM0Usb0JBQVA7QUFDRDs7O3dCQUVlO0FBQ2Q7QUFDQSxhQUFPOEYsNEJBQVA7QUFDRDs7O3dCQUVvQjtBQUNuQjtBQUVFQyx5Q0FDSyxrSUFBcUJBLElBRDFCO0FBRUVDLG9CQUFVO0FBRlo7QUFGRjtBQU9EOzs7aURBRXNDO0FBQUEsVUFBVEMsTUFBUyxTQUFUQSxNQUFTOztBQUNyQyxVQUFNQyxlQUFlLEtBQUtDLHNCQUFMLENBQTRCckcsaUJBQTVCLEVBQStDbUcsTUFBL0MsQ0FBckI7QUFDQSxVQUFJLENBQUNDLFlBQUQsSUFBaUIsQ0FBQ0EsYUFBYXBDLE1BQW5DLEVBQTJDO0FBQ3pDLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU9vQyxhQUFhekQsR0FBYixDQUFpQjtBQUFBLGVBQVk7QUFDbEMyRCxxQkFBVyxJQUR1QjtBQUVsQ0MsaUJBQU8sWUFGMkI7QUFHbENwRTtBQUhrQyxTQUFaO0FBQUEsT0FBakIsQ0FBUDtBQUtEOzs7RUE3Q3lDcUUsbUI7O2tCQUF2Qm5GLGMiLCJmaWxlIjoiaDMtaGV4YWdvbi1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxOCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBtZW1vaXplIGZyb20gJ2xvZGFzaC5tZW1vaXplJztcblxuaW1wb3J0IExheWVyIGZyb20gJy4uL2Jhc2UtbGF5ZXInO1xuaW1wb3J0IHtHZW9Kc29uTGF5ZXJ9IGZyb20gJ2RlY2suZ2wnO1xuaW1wb3J0IEgzSGV4YWdvbkNlbGxMYXllciBmcm9tICcuL2gzLWhleGFnb24tY2VsbC1sYXllcic7XG5pbXBvcnQge2dldFZlcnRpY2VzLCBnZXRDZW50cm9pZCwgaWRUb1BvbHlnb25HZW99IGZyb20gJy4vaDMtdXRpbHMnO1xuaW1wb3J0IEgzSGV4YWdvbkxheWVySWNvbiBmcm9tICcuL2gzLWhleGFnb24tbGF5ZXItaWNvbic7XG5cbmV4cG9ydCBjb25zdCBIRVhBR09OX0lEX0ZJRUxEUyA9IHtcbiAgaGV4X2lkOiBbJ2hleF9pZCcsICdoZXhhZ29uX2lkJywgJ2gzX2lkJ11cbn07XG5cbmV4cG9ydCBjb25zdCBoZXhJZFJlcXVpcmVkQ29sdW1ucyA9IFsnaGV4X2lkJ107XG5leHBvcnQgY29uc3QgaGV4SWRBY2Nlc3NvciA9ICh7aGV4X2lkfSkgPT4gZCA9PiBkW2hleF9pZC5maWVsZElkeF07XG5leHBvcnQgY29uc3QgaGV4SWRSZXNvbHZlciA9ICh7aGV4X2lkfSkgPT4gaGV4X2lkLmZpZWxkSWR4O1xuXG5leHBvcnQgY29uc3QgSGV4YWdvbklkVmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIGNvdmVyYWdlOiAnY292ZXJhZ2UnLFxuICBzaXplUmFuZ2U6ICdlbGV2YXRpb25SYW5nZScsXG4gIGVsZXZhdGlvblNjYWxlOiAnZWxldmF0aW9uU2NhbGUnLFxuICAnaGktcHJlY2lzaW9uJzogJ2hpLXByZWNpc2lvbidcbn07XG5cbmZ1bmN0aW9uIGhleFRvUmdiKGhleCkge1xuICBjb25zdCByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcblxuICBjb25zdCByID0gcGFyc2VJbnQocmVzdWx0WzFdLCAxNik7XG4gIGNvbnN0IGcgPSBwYXJzZUludChyZXN1bHRbMl0sIDE2KTtcbiAgY29uc3QgYiA9IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpO1xuXG4gIHJldHVybiBbciwgZywgYl07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhleGFnb25JZExheWVyIGV4dGVuZHMgTGF5ZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnJlZ2lzdGVyVmlzQ29uZmlnKEhleGFnb25JZFZpc0NvbmZpZ3MpO1xuICAgIHRoaXMuZ2V0SGV4SWQgPSBtZW1vaXplKGhleElkQWNjZXNzb3IsIGhleElkUmVzb2x2ZXIpO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICdoZXhhZ29uSWQnO1xuICB9XG5cbiAgZ2V0IG5hbWUoKSB7XG4gICAgcmV0dXJuICdIMyc7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIGhleElkUmVxdWlyZWRDb2x1bW5zO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICAvLyB1c2UgaGV4YWdvbiBsYXllciBpY29uIGZvciBub3dcbiAgICByZXR1cm4gSDNIZXhhZ29uTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci52aXN1YWxDaGFubmVscyxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZSxcbiAgICAgICAgcHJvcGVydHk6ICdoZWlnaHQnXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kRGVmYXVsdExheWVyUHJvcHMoe2ZpZWxkc30pIHtcbiAgICBjb25zdCBmb3VuZENvbHVtbnMgPSB0aGlzLmZpbmREZWZhdWx0Q29sdW1uRmllbGQoSEVYQUdPTl9JRF9GSUVMRFMsIGZpZWxkcyk7XG4gICAgaWYgKCFmb3VuZENvbHVtbnMgfHwgIWZvdW5kQ29sdW1ucy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBmb3VuZENvbHVtbnMubWFwKGNvbHVtbnMgPT4gKHtcbiAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgIGxhYmVsOiAnSDMgSGV4YWdvbicsXG4gICAgICBjb2x1bW5zXG4gICAgfSkpO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKF8sIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY29sb3JEb21haW4sXG4gICAgICBjb2xvckZpZWxkLFxuICAgICAgY29sb3IsXG4gICAgICBjb2x1bW5zLFxuICAgICAgc2l6ZUZpZWxkLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHZpc0NvbmZpZzoge3NpemVSYW5nZSwgY29sb3JSYW5nZX1cbiAgICB9ID0gdGhpcy5jb25maWc7XG5cbiAgICAvLyBjb2xvclxuICAgIGNvbnN0IGNTY2FsZSA9XG4gICAgICBjb2xvckZpZWxkICYmXG4gICAgICB0aGlzLmdldFZpc0NoYW5uZWxTY2FsZShcbiAgICAgICAgY29sb3JTY2FsZSxcbiAgICAgICAgY29sb3JEb21haW4sXG4gICAgICAgIGNvbG9yUmFuZ2UuY29sb3JzLm1hcChjID0+IGhleFRvUmdiKGMpKVxuICAgICAgKTtcblxuICAgIC8vIGhlaWdodFxuICAgIGNvbnN0IHNTY2FsZSA9XG4gICAgICBzaXplRmllbGQgJiYgdGhpcy5nZXRWaXNDaGFubmVsU2NhbGUoc2l6ZVNjYWxlLCBzaXplRG9tYWluLCBzaXplUmFuZ2UpO1xuXG4gICAgY29uc3QgZ2V0SGV4SWQgPSB0aGlzLmdldEhleElkKGNvbHVtbnMpO1xuXG4gICAgaWYgKCFvbGRMYXllckRhdGEgfHwgb2xkTGF5ZXJEYXRhLmdldEhleElkICE9PSBnZXRIZXhJZCkge1xuICAgICAgdGhpcy51cGRhdGVMYXllck1ldGEoYWxsRGF0YSwgZ2V0SGV4SWQpO1xuICAgIH1cblxuICAgIGxldCBkYXRhO1xuICAgIGlmIChcbiAgICAgIG9sZExheWVyRGF0YSAmJlxuICAgICAgb2xkTGF5ZXJEYXRhLmRhdGEgJiZcbiAgICAgIG9wdC5zYW1lRGF0YSAmJlxuICAgICAgb2xkTGF5ZXJEYXRhLmdldEhleElkID09PSBnZXRIZXhJZFxuICAgICkge1xuICAgICAgZGF0YSA9IG9sZExheWVyRGF0YS5kYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXRhID0gZmlsdGVyZWRJbmRleC5yZWR1Y2UoKGFjY3UsIGluZGV4LCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGlkID0gZ2V0SGV4SWQoYWxsRGF0YVtpbmRleF0pO1xuICAgICAgICBjb25zdCBjZW50cm9pZCA9IHRoaXMuZGF0YVRvRmVhdHVyZS5jZW50cm9pZHNbaW5kZXhdO1xuXG4gICAgICAgIGlmIChjZW50cm9pZCkge1xuICAgICAgICAgIGFjY3UucHVzaCh7XG4gICAgICAgICAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBkYXRhIGluZGV4XG4gICAgICAgICAgICBpbmRleDogaSxcbiAgICAgICAgICAgIGRhdGE6IGFsbERhdGFbaW5kZXhdLFxuICAgICAgICAgICAgaWQsXG4gICAgICAgICAgICBjZW50cm9pZFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0RWxldmF0aW9uID0gc1NjYWxlID8gZCA9PlxuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQsIDApIDogMDtcblxuICAgIGNvbnN0IGdldENvbG9yID0gY1NjYWxlID8gZCA9PlxuICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKGNTY2FsZSwgZC5kYXRhLCBjb2xvckZpZWxkKSA6IGNvbG9yO1xuXG4gICAgLy8gY29uc3QgbGF5ZXJEYXRhID0ge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0RWxldmF0aW9uLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRIZXhJZCxcbiAgICAgIGhleGFnb25WZXJ0aWNlczogdGhpcy5kYXRhVG9GZWF0dXJlLmhleGFnb25WZXJ0aWNlcyxcbiAgICAgIGhleGFnb25DZW50ZXI6IHRoaXMuZGF0YVRvRmVhdHVyZS5oZXhhZ29uQ2VudGVyXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRIZXhJZCkge1xuICAgIGxldCBoZXhhZ29uVmVydGljZXM7XG4gICAgbGV0IGhleGFnb25DZW50ZXI7XG4gICAgY29uc3QgY2VudHJvaWRzID0ge307XG5cbiAgICBhbGxEYXRhLmZvckVhY2goKGQsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IGdldEhleElkKGQpO1xuICAgICAgaWYgKHR5cGVvZiBpZCAhPT0gJ3N0cmluZycgfHwgIWlkLmxlbmd0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBmaW5kIGhleGFnb25WZXJ0aWNlc1xuICAgICAgLy8gb25seSBuZWVkIDEgaW5zdGFuY2Ugb2YgaGV4YWdvblZlcnRpY2VzXG4gICAgICBpZiAoIWhleGFnb25WZXJ0aWNlcykge1xuICAgICAgICBoZXhhZ29uVmVydGljZXMgPSBpZCAmJiBnZXRWZXJ0aWNlcyh7aWR9KTtcbiAgICAgICAgaGV4YWdvbkNlbnRlciA9IGlkICYmIGdldENlbnRyb2lkKHtpZH0pXG4gICAgICB9XG5cbiAgICAgIC8vIHNhdmUgYSByZWZlcmVuY2Ugb2YgY2VudHJvaWRzIHRvIGRhdGFUb0ZlYXR1cmVcbiAgICAgIC8vIHNvIHdlIGRvbid0IGhhdmUgdG8gcmUgY2FsY3VsYXRlIGl0IGFnYWluXG4gICAgICBjZW50cm9pZHNbaW5kZXhdID0gZ2V0Q2VudHJvaWQoe2lkfSk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFBvaW50c0JvdW5kcyhPYmplY3QudmFsdWVzKGNlbnRyb2lkcyksIGQgPT4gZCk7XG4gICAgY29uc3QgbGlnaHRTZXR0aW5ncyA9IHRoaXMuZ2V0TGlnaHRTZXR0aW5nc0Zyb21Cb3VuZHMoYm91bmRzKTtcblxuICAgIHRoaXMuZGF0YVRvRmVhdHVyZSA9IHtoZXhhZ29uVmVydGljZXMsIGhleGFnb25DZW50ZXIsIGNlbnRyb2lkc307XG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHMsIGxpZ2h0U2V0dGluZ3N9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBsYXllckludGVyYWN0aW9uLFxuICAgIG9iamVjdEhvdmVyZWQsXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfSkge1xuICAgIGNvbnN0IHpvb21GYWN0b3IgPSB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IGVsZVpvb21GYWN0b3IgPSB0aGlzLmdldEVsZXZhdGlvblpvb21GYWN0b3IobWFwU3RhdGUpO1xuICAgIGNvbnN0IHtjb25maWcsIG1ldGF9ID0gdGhpcztcbiAgICBjb25zdCB7dmlzQ29uZmlnfSA9IGNvbmZpZztcblxuICAgIGNvbnN0IHVwZGF0ZVRyaWdnZXJzID0ge1xuICAgICAgZ2V0Q29sb3I6IHtcbiAgICAgICAgY29sb3I6IGNvbmZpZy5jb2xvcixcbiAgICAgICAgY29sb3JGaWVsZDogY29uZmlnLmNvbG9yRmllbGQsXG4gICAgICAgIGNvbG9yUmFuZ2U6IGNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgY29sb3JTY2FsZTogY29uZmlnLmNvbG9yU2NhbGVcbiAgICAgIH0sXG4gICAgICBnZXRFbGV2YXRpb246IHtcbiAgICAgICAgc2l6ZUZpZWxkOiBjb25maWcuc2l6ZUZpZWxkLFxuICAgICAgICBzaXplUmFuZ2U6IGNvbmZpZy52aXNDb25maWcuc2l6ZVJhbmdlXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBbXG4gICAgICBuZXcgSDNIZXhhZ29uQ2VsbExheWVyKHtcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgcGlja2FibGU6IHRydWUsXG5cbiAgICAgICAgLy8gY292ZXJhZ2VcbiAgICAgICAgY292ZXJhZ2U6IHZpc0NvbmZpZy5jb3ZlcmFnZSxcblxuICAgICAgICAvLyBwYXJhbWV0ZXJzXG4gICAgICAgIHBhcmFtZXRlcnM6IHtkZXB0aFRlc3Q6IEJvb2xlYW4oY29uZmlnLnNpemVGaWVsZCB8fCBtYXBTdGF0ZS5kcmFnUm90YXRlKX0sXG5cbiAgICAgICAgLy8gaGlnaGxpZ2h0XG4gICAgICAgIGF1dG9IaWdobGlnaHQ6IEJvb2xlYW4oY29uZmlnLnNpemVGaWVsZCksXG5cbiAgICAgICAgLy8gZWxldmF0aW9uXG4gICAgICAgIGV4dHJ1ZGVkOiBCb29sZWFuKGNvbmZpZy5zaXplRmllbGQpLFxuICAgICAgICBlbGV2YXRpb25TY2FsZTogdmlzQ29uZmlnLmVsZXZhdGlvblNjYWxlICogZWxlWm9vbUZhY3RvcixcblxuICAgICAgICAvLyBjb2xvclxuICAgICAgICBvcGFjaXR5OiB2aXNDb25maWcub3BhY2l0eSxcblxuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgbGlnaHRTZXR0aW5nczogbWV0YS5saWdodFNldHRpbmdzLFxuICAgICAgICB1cGRhdGVUcmlnZ2Vyc1xuICAgICAgfSksXG4gICAgICAuLi4odGhpcy5pc0xheWVySG92ZXJlZChvYmplY3RIb3ZlcmVkKSAmJiAhY29uZmlnLnNpemVGaWVsZFxuICAgICAgICA/IFtcbiAgICAgICAgICAgIG5ldyBHZW9Kc29uTGF5ZXIoe1xuICAgICAgICAgICAgICBpZDogYCR7dGhpcy5pZH0taG92ZXJlZGAsXG4gICAgICAgICAgICAgIGRhdGE6IFtcbiAgICAgICAgICAgICAgICBpZFRvUG9seWdvbkdlbyhvYmplY3RIb3ZlcmVkLCB7XG4gICAgICAgICAgICAgICAgICBsaW5lQ29sb3I6IGNvbmZpZy5oaWdobGlnaHRDb2xvclxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIGxpbmVXaWR0aFNjYWxlOiA4ICogem9vbUZhY3RvclxuICAgICAgICAgICAgfSlcbiAgICAgICAgICBdXG4gICAgICAgIDogW10pXG4gICAgXTtcbiAgfVxufVxuIl19