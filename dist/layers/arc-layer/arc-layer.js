'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.arctVisConfigs = exports.arcRequiredColumns = exports.arcPosResolver = exports.arcPosAccessor = undefined;

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

var _lodash = require('lodash.memoize');

var _lodash2 = _interopRequireDefault(_lodash);

var _baseLayer = require('../base-layer');

var _baseLayer2 = _interopRequireDefault(_baseLayer);

var _arcBrushingLayer = require('../../deckgl-layers/arc-brushing-layer/arc-brushing-layer');

var _arcBrushingLayer2 = _interopRequireDefault(_arcBrushingLayer);

var _colorUtils = require('../../utils/color-utils');

var _arcLayerIcon = require('./arc-layer-icon');

var _arcLayerIcon2 = _interopRequireDefault(_arcLayerIcon);

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

var arcPosAccessor = exports.arcPosAccessor = function arcPosAccessor(_ref) {
  var lat0 = _ref.lat0,
      lng0 = _ref.lng0,
      lat1 = _ref.lat1,
      lng1 = _ref.lng1;
  return function (d) {
    return [d.data[lng0.fieldIdx], d.data[lat0.fieldIdx], 0, d.data[lng1.fieldIdx], d.data[lat1.fieldIdx], 0];
  };
};

var arcPosResolver = exports.arcPosResolver = function arcPosResolver(_ref2) {
  var lat0 = _ref2.lat0,
      lng0 = _ref2.lng0,
      lat1 = _ref2.lat1,
      lng1 = _ref2.lng1;
  return lat0.fieldIdx + '-' + lng0.fieldIdx + '-' + lat1.fieldIdx + '-' + lat1.fieldIdx + '}';
};

var arcRequiredColumns = exports.arcRequiredColumns = ['lat0', 'lng0', 'lat1', 'lng1'];

var arctVisConfigs = exports.arctVisConfigs = {
  opacity: 'opacity',
  thickness: 'thickness',
  colorRange: 'colorRange',
  sizeRange: 'strokeWidthRange',
  targetColor: 'targetColor',
  'hi-precision': 'hi-precision'
};

var ArcLayer = function (_Layer) {
  (0, _inherits3.default)(ArcLayer, _Layer);

  function ArcLayer(props) {
    (0, _classCallCheck3.default)(this, ArcLayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ArcLayer.__proto__ || Object.getPrototypeOf(ArcLayer)).call(this, props));

    _this.registerVisConfig(arctVisConfigs);
    _this.getPosition = (0, _lodash2.default)(arcPosAccessor, arcPosResolver);
    return _this;
  }

  (0, _createClass3.default)(ArcLayer, [{
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
          colorRange = _config$visConfig.colorRange,
          targetColor = _config$visConfig.targetColor;

      // arc color

      var cScale = colorField && this.getVisChannelScale(colorScale, colorDomain, colorRange.colors.map(_colorUtils.hexToRgb));

      // arc thickness
      var sScale = sizeField && this.getVisChannelScale(sizeScale, sizeDomain, sizeRange);

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

          // if doesn't have point lat or lng, do not add the arc
          // deck.gl can't handle position == null
          if (!pos.every(Number.isFinite)) {
            return accu;
          }

          accu.push({
            index: index,
            sourcePosition: [pos[0], pos[1], pos[2]],
            targetPosition: [pos[3], pos[4], pos[5]],
            data: allData[index]
          });

          return accu;
        }, []);
      }

      var getStrokeWidth = sScale ? function (d) {
        return _this2.getEncodedChannelValue(sScale, d.data, sizeField, 0);
      } : 1;

      var getColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : color;

      var getTargetColor = cScale ? function (d) {
        return _this2.getEncodedChannelValue(cScale, d.data, colorField);
      } : targetColor || color;

      return {
        data: data,
        getColor: getColor,
        getSourceColor: getColor,
        getTargetColor: getTargetColor,
        getStrokeWidth: getStrokeWidth
      };
    }
  }, {
    key: 'updateLayerMeta',
    value: function updateLayerMeta(allData, getPosition) {
      // get bounds from arcs
      var sBounds = this.getPointsBounds(allData, function (d) {
        var pos = getPosition({ data: d });
        return [pos[0], pos[1]];
      });

      var tBounds = this.getPointsBounds(allData, function (d) {
        var pos = getPosition({ data: d });
        return [pos[3], pos[4]];
      });

      var bounds = [Math.min(sBounds[0], tBounds[0]), Math.min(sBounds[1], tBounds[1]), Math.max(sBounds[2], tBounds[2]), Math.max(sBounds[3], tBounds[3])];

      this.updateMeta({ bounds: bounds });
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer(_ref3) {
      var data = _ref3.data,
          idx = _ref3.idx,
          objectHovered = _ref3.objectHovered,
          layerInteraction = _ref3.layerInteraction,
          mapState = _ref3.mapState,
          interactionConfig = _ref3.interactionConfig;
      var brush = interactionConfig.brush;


      var colorUpdateTriggers = {
        color: this.config.color,
        colorField: this.config.colorField,
        colorRange: this.config.visConfig.colorRange,
        colorScale: this.config.colorScale,
        targetColor: this.config.visConfig.targetColor
      };

      var interaction = {
        // auto highlighting
        pickable: true,
        autoHighlight: !brush.enabled,
        highlightColor: this.config.highlightColor,

        // brushing
        brushRadius: brush.config.size * 1000,
        brushSource: true,
        brushTarget: true,
        enableBrushing: brush.enabled
      };

      return [new _arcBrushingLayer2.default((0, _extends3.default)({}, data, interaction, layerInteraction, {
        id: this.id,
        idx: idx,
        fp64: this.config.visConfig['hi-precision'],
        opacity: this.config.visConfig.opacity,
        pickedColor: this.config.highlightColor,
        strokeScale: this.config.visConfig.thickness,

        // parameters
        parameters: { depthTest: mapState.dragRotate },

        updateTriggers: {
          getStrokeWidth: {
            sizeField: this.config.sizeField,
            sizeRange: this.config.visConfig.sizeRange
          },
          getSourceColor: colorUpdateTriggers,
          getTargetColor: colorUpdateTriggers
        }
      }))];
    }
  }, {
    key: 'type',
    get: function get() {
      return 'arc';
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return false;
    }
  }, {
    key: 'layerIcon',
    get: function get() {
      return _arcLayerIcon2.default;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return arcRequiredColumns;
    }
  }, {
    key: 'columnPairs',
    get: function get() {
      return this.defaultLinkColumnPairs;
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return (0, _extends3.default)({}, (0, _get3.default)(ArcLayer.prototype.__proto__ || Object.getPrototypeOf(ArcLayer.prototype), 'visualChannels', this), {
        size: (0, _extends3.default)({}, (0, _get3.default)(ArcLayer.prototype.__proto__ || Object.getPrototypeOf(ArcLayer.prototype), 'visualChannels', this).size, {
          property: 'stroke'
        })
      });
    }
  }], [{
    key: 'findDefaultLayerProps',
    value: function findDefaultLayerProps(_ref4) {
      var _ref4$fieldPairs = _ref4.fieldPairs,
          fieldPairs = _ref4$fieldPairs === undefined ? [] : _ref4$fieldPairs;

      if (fieldPairs.length < 2) {
        return [];
      }
      var props = {
        color: (0, _colorUtils.hexToRgb)(_defaultSettings.DEFAULT_LAYER_COLOR.tripArc)
      };

      // connect the first two point layer with arc
      props.columns = {
        lat0: fieldPairs[0].pair.lat,
        lng0: fieldPairs[0].pair.lng,
        lat1: fieldPairs[1].pair.lat,
        lng1: fieldPairs[1].pair.lng
      };
      props.label = fieldPairs[0].defaultName + ' -> ' + fieldPairs[1].defaultName + ' arc';

      return props;
    }
  }]);
  return ArcLayer;
}(_baseLayer2.default);

exports.default = ArcLayer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvYXJjLWxheWVyL2FyYy1sYXllci5qcyJdLCJuYW1lcyI6WyJhcmNQb3NBY2Nlc3NvciIsImxhdDAiLCJsbmcwIiwibGF0MSIsImxuZzEiLCJkIiwiZGF0YSIsImZpZWxkSWR4IiwiYXJjUG9zUmVzb2x2ZXIiLCJhcmNSZXF1aXJlZENvbHVtbnMiLCJhcmN0VmlzQ29uZmlncyIsIm9wYWNpdHkiLCJ0aGlja25lc3MiLCJjb2xvclJhbmdlIiwic2l6ZVJhbmdlIiwidGFyZ2V0Q29sb3IiLCJBcmNMYXllciIsInByb3BzIiwicmVnaXN0ZXJWaXNDb25maWciLCJnZXRQb3NpdGlvbiIsIl8iLCJhbGxEYXRhIiwiZmlsdGVyZWRJbmRleCIsIm9sZExheWVyRGF0YSIsIm9wdCIsImNvbmZpZyIsImNvbG9yU2NhbGUiLCJjb2xvckRvbWFpbiIsImNvbG9yRmllbGQiLCJjb2xvciIsImNvbHVtbnMiLCJzaXplRmllbGQiLCJzaXplU2NhbGUiLCJzaXplRG9tYWluIiwidmlzQ29uZmlnIiwiY1NjYWxlIiwiZ2V0VmlzQ2hhbm5lbFNjYWxlIiwiY29sb3JzIiwibWFwIiwiaGV4VG9SZ2IiLCJzU2NhbGUiLCJ1cGRhdGVMYXllck1ldGEiLCJzYW1lRGF0YSIsInJlZHVjZSIsImFjY3UiLCJpbmRleCIsInBvcyIsImV2ZXJ5IiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJwdXNoIiwic291cmNlUG9zaXRpb24iLCJ0YXJnZXRQb3NpdGlvbiIsImdldFN0cm9rZVdpZHRoIiwiZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZSIsImdldENvbG9yIiwiZ2V0VGFyZ2V0Q29sb3IiLCJnZXRTb3VyY2VDb2xvciIsInNCb3VuZHMiLCJnZXRQb2ludHNCb3VuZHMiLCJ0Qm91bmRzIiwiYm91bmRzIiwiTWF0aCIsIm1pbiIsIm1heCIsInVwZGF0ZU1ldGEiLCJpZHgiLCJvYmplY3RIb3ZlcmVkIiwibGF5ZXJJbnRlcmFjdGlvbiIsIm1hcFN0YXRlIiwiaW50ZXJhY3Rpb25Db25maWciLCJicnVzaCIsImNvbG9yVXBkYXRlVHJpZ2dlcnMiLCJpbnRlcmFjdGlvbiIsInBpY2thYmxlIiwiYXV0b0hpZ2hsaWdodCIsImVuYWJsZWQiLCJoaWdobGlnaHRDb2xvciIsImJydXNoUmFkaXVzIiwic2l6ZSIsImJydXNoU291cmNlIiwiYnJ1c2hUYXJnZXQiLCJlbmFibGVCcnVzaGluZyIsIkFyY0JydXNoaW5nTGF5ZXIiLCJpZCIsImZwNjQiLCJwaWNrZWRDb2xvciIsInN0cm9rZVNjYWxlIiwicGFyYW1ldGVycyIsImRlcHRoVGVzdCIsImRyYWdSb3RhdGUiLCJ1cGRhdGVUcmlnZ2VycyIsIkFyY0xheWVySWNvbiIsImRlZmF1bHRMaW5rQ29sdW1uUGFpcnMiLCJwcm9wZXJ0eSIsImZpZWxkUGFpcnMiLCJsZW5ndGgiLCJERUZBVUxUX0xBWUVSX0NPTE9SIiwidHJpcEFyYyIsInBhaXIiLCJsYXQiLCJsbmciLCJsYWJlbCIsImRlZmF1bHROYW1lIiwiTGF5ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQTFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFVTyxJQUFNQSwwQ0FBaUIsU0FBakJBLGNBQWlCO0FBQUEsTUFBRUMsSUFBRixRQUFFQSxJQUFGO0FBQUEsTUFBUUMsSUFBUixRQUFRQSxJQUFSO0FBQUEsTUFBY0MsSUFBZCxRQUFjQSxJQUFkO0FBQUEsTUFBb0JDLElBQXBCLFFBQW9CQSxJQUFwQjtBQUFBLFNBQThCO0FBQUEsV0FBSyxDQUMvREMsRUFBRUMsSUFBRixDQUFPSixLQUFLSyxRQUFaLENBRCtELEVBRS9ERixFQUFFQyxJQUFGLENBQU9MLEtBQUtNLFFBQVosQ0FGK0QsRUFHL0QsQ0FIK0QsRUFJL0RGLEVB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aG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IG1lbW9pemUgZnJvbSAnbG9kYXNoLm1lbW9pemUnO1xuXG5pbXBvcnQgTGF5ZXIgZnJvbSAnLi4vYmFzZS1sYXllcic7XG5pbXBvcnQgQXJjQnJ1c2hpbmdMYXllciBmcm9tICdkZWNrZ2wtbGF5ZXJzL2FyYy1icnVzaGluZy1sYXllci9hcmMtYnJ1c2hpbmctbGF5ZXInO1xuaW1wb3J0IHtoZXhUb1JnYn0gZnJvbSAndXRpbHMvY29sb3ItdXRpbHMnO1xuaW1wb3J0IEFyY0xheWVySWNvbiBmcm9tICcuL2FyYy1sYXllci1pY29uJztcbmltcG9ydCB7REVGQVVMVF9MQVlFUl9DT0xPUn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5leHBvcnQgY29uc3QgYXJjUG9zQWNjZXNzb3IgPSAoe2xhdDAsIGxuZzAsIGxhdDEsIGxuZzF9KSA9PiBkID0+IFtcbiAgZC5kYXRhW2xuZzAuZmllbGRJZHhdLFxuICBkLmRhdGFbbGF0MC5maWVsZElkeF0sXG4gIDAsXG4gIGQuZGF0YVtsbmcxLmZpZWxkSWR4XSxcbiAgZC5kYXRhW2xhdDEuZmllbGRJZHhdLFxuICAwXG5dO1xuXG5leHBvcnQgY29uc3QgYXJjUG9zUmVzb2x2ZXIgPSAoe2xhdDAsIGxuZzAsIGxhdDEsIGxuZzF9KSA9PlxuICBgJHtsYXQwLmZpZWxkSWR4fS0ke2xuZzAuZmllbGRJZHh9LSR7bGF0MS5maWVsZElkeH0tJHtsYXQxLmZpZWxkSWR4fX1gO1xuXG5leHBvcnQgY29uc3QgYXJjUmVxdWlyZWRDb2x1bW5zID0gWydsYXQwJywgJ2xuZzAnLCAnbGF0MScsICdsbmcxJ107XG5cbmV4cG9ydCBjb25zdCBhcmN0VmlzQ29uZmlncyA9IHtcbiAgb3BhY2l0eTogJ29wYWNpdHknLFxuICB0aGlja25lc3M6ICd0aGlja25lc3MnLFxuICBjb2xvclJhbmdlOiAnY29sb3JSYW5nZScsXG4gIHNpemVSYW5nZTogJ3N0cm9rZVdpZHRoUmFuZ2UnLFxuICB0YXJnZXRDb2xvcjogJ3RhcmdldENvbG9yJyxcbiAgJ2hpLXByZWNpc2lvbic6ICdoaS1wcmVjaXNpb24nXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcmNMYXllciBleHRlbmRzIExheWVyIHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5yZWdpc3RlclZpc0NvbmZpZyhhcmN0VmlzQ29uZmlncyk7XG4gICAgdGhpcy5nZXRQb3NpdGlvbiA9IG1lbW9pemUoYXJjUG9zQWNjZXNzb3IsIGFyY1Bvc1Jlc29sdmVyKTtcbiAgfVxuXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAnYXJjJztcbiAgfVxuXG4gIGdldCBpc0FnZ3JlZ2F0ZWQoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZ2V0IGxheWVySWNvbigpIHtcbiAgICByZXR1cm4gQXJjTGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IHJlcXVpcmVkTGF5ZXJDb2x1bW5zKCkge1xuICAgIHJldHVybiBhcmNSZXF1aXJlZENvbHVtbnM7XG4gIH1cblxuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVmYXVsdExpbmtDb2x1bW5QYWlycztcbiAgfVxuXG4gIGdldCB2aXN1YWxDaGFubmVscygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc3VwZXIudmlzdWFsQ2hhbm5lbHMsXG4gICAgICBzaXplOiB7XG4gICAgICAgIC4uLnN1cGVyLnZpc3VhbENoYW5uZWxzLnNpemUsXG4gICAgICAgIHByb3BlcnR5OiAnc3Ryb2tlJ1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzdGF0aWMgZmluZERlZmF1bHRMYXllclByb3BzKHtmaWVsZFBhaXJzID0gW119KSB7XG4gICAgaWYgKGZpZWxkUGFpcnMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIGNvbG9yOiBoZXhUb1JnYihERUZBVUxUX0xBWUVSX0NPTE9SLnRyaXBBcmMpXG4gICAgfTtcblxuICAgIC8vIGNvbm5lY3QgdGhlIGZpcnN0IHR3byBwb2ludCBsYXllciB3aXRoIGFyY1xuICAgIHByb3BzLmNvbHVtbnMgPSB7XG4gICAgICBsYXQwOiBmaWVsZFBhaXJzWzBdLnBhaXIubGF0LFxuICAgICAgbG5nMDogZmllbGRQYWlyc1swXS5wYWlyLmxuZyxcbiAgICAgIGxhdDE6IGZpZWxkUGFpcnNbMV0ucGFpci5sYXQsXG4gICAgICBsbmcxOiBmaWVsZFBhaXJzWzFdLnBhaXIubG5nXG4gICAgfTtcbiAgICBwcm9wcy5sYWJlbCA9IGAke2ZpZWxkUGFpcnNbMF0uZGVmYXVsdE5hbWV9IC0+ICR7XG4gICAgICBmaWVsZFBhaXJzWzFdLmRlZmF1bHROYW1lXG4gICAgfSBhcmNgO1xuXG4gICAgcmV0dXJuIHByb3BzO1xuICB9XG5cbiAgZm9ybWF0TGF5ZXJEYXRhKF8sIGFsbERhdGEsIGZpbHRlcmVkSW5kZXgsIG9sZExheWVyRGF0YSwgb3B0ID0ge30pIHtcbiAgICBjb25zdCB7XG4gICAgICBjb2xvclNjYWxlLFxuICAgICAgY29sb3JEb21haW4sXG4gICAgICBjb2xvckZpZWxkLFxuICAgICAgY29sb3IsXG4gICAgICBjb2x1bW5zLFxuICAgICAgc2l6ZUZpZWxkLFxuICAgICAgc2l6ZVNjYWxlLFxuICAgICAgc2l6ZURvbWFpbixcbiAgICAgIHZpc0NvbmZpZzoge3NpemVSYW5nZSwgY29sb3JSYW5nZSwgdGFyZ2V0Q29sb3J9XG4gICAgfSA9IHRoaXMuY29uZmlnO1xuXG4gICAgLy8gYXJjIGNvbG9yXG4gICAgY29uc3QgY1NjYWxlID1cbiAgICAgIGNvbG9yRmllbGQgJiZcbiAgICAgIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKFxuICAgICAgICBjb2xvclNjYWxlLFxuICAgICAgICBjb2xvckRvbWFpbixcbiAgICAgICAgY29sb3JSYW5nZS5jb2xvcnMubWFwKGhleFRvUmdiKVxuICAgICAgKTtcblxuICAgIC8vIGFyYyB0aGlja25lc3NcbiAgICBjb25zdCBzU2NhbGUgPVxuICAgICAgc2l6ZUZpZWxkICYmIHRoaXMuZ2V0VmlzQ2hhbm5lbFNjYWxlKHNpemVTY2FsZSwgc2l6ZURvbWFpbiwgc2l6ZVJhbmdlKTtcblxuICAgIGNvbnN0IGdldFBvc2l0aW9uID0gdGhpcy5nZXRQb3NpdGlvbihjb2x1bW5zKTtcblxuICAgIGlmICghb2xkTGF5ZXJEYXRhIHx8IG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiAhPT0gZ2V0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMudXBkYXRlTGF5ZXJNZXRhKGFsbERhdGEsIGdldFBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBsZXQgZGF0YTtcbiAgICBpZiAoXG4gICAgICBvbGRMYXllckRhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5kYXRhICYmXG4gICAgICBvcHQuc2FtZURhdGEgJiZcbiAgICAgIG9sZExheWVyRGF0YS5nZXRQb3NpdGlvbiA9PT0gZ2V0UG9zaXRpb25cbiAgICApIHtcbiAgICAgIGRhdGEgPSBvbGRMYXllckRhdGEuZGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGF0YSA9IGZpbHRlcmVkSW5kZXgucmVkdWNlKChhY2N1LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBwb3MgPSBnZXRQb3NpdGlvbih7ZGF0YTogYWxsRGF0YVtpbmRleF19KTtcblxuICAgICAgICAvLyBpZiBkb2Vzbid0IGhhdmUgcG9pbnQgbGF0IG9yIGxuZywgZG8gbm90IGFkZCB0aGUgYXJjXG4gICAgICAgIC8vIGRlY2suZ2wgY2FuJ3QgaGFuZGxlIHBvc2l0aW9uID09IG51bGxcbiAgICAgICAgaWYgKCFwb3MuZXZlcnkoTnVtYmVyLmlzRmluaXRlKSkge1xuICAgICAgICAgIHJldHVybiBhY2N1O1xuICAgICAgICB9XG5cbiAgICAgICAgYWNjdS5wdXNoKHtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICBzb3VyY2VQb3NpdGlvbjogW3Bvc1swXSwgcG9zWzFdLCBwb3NbMl1dLFxuICAgICAgICAgIHRhcmdldFBvc2l0aW9uOiBbcG9zWzNdLCBwb3NbNF0sIHBvc1s1XV0sXG4gICAgICAgICAgZGF0YTogYWxsRGF0YVtpbmRleF1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGFjY3U7XG4gICAgICB9LCBbXSk7XG4gICAgfVxuXG4gICAgY29uc3QgZ2V0U3Ryb2tlV2lkdGggPSBzU2NhbGUgPyBkID0+XG4gICAgICAgdGhpcy5nZXRFbmNvZGVkQ2hhbm5lbFZhbHVlKHNTY2FsZSwgZC5kYXRhLCBzaXplRmllbGQsIDApIDogMTtcblxuICAgIGNvbnN0IGdldENvbG9yID0gY1NjYWxlID8gZCA9PlxuICAgICAgIHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGQuZGF0YSwgY29sb3JGaWVsZCkgOiBjb2xvcjtcblxuICAgIGNvbnN0IGdldFRhcmdldENvbG9yID0gY1NjYWxlID8gZCA9PlxuICAgICAgIHRoaXMuZ2V0RW5jb2RlZENoYW5uZWxWYWx1ZShjU2NhbGUsIGQuZGF0YSwgY29sb3JGaWVsZClcbiAgICAgICAgOiB0YXJnZXRDb2xvciB8fCBjb2xvcjtcblxuICAgIHJldHVybiB7XG4gICAgICBkYXRhLFxuICAgICAgZ2V0Q29sb3IsXG4gICAgICBnZXRTb3VyY2VDb2xvcjogZ2V0Q29sb3IsXG4gICAgICBnZXRUYXJnZXRDb2xvcixcbiAgICAgIGdldFN0cm9rZVdpZHRoXG4gICAgfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyTWV0YShhbGxEYXRhLCBnZXRQb3NpdGlvbikge1xuICAgIC8vIGdldCBib3VuZHMgZnJvbSBhcmNzXG4gICAgY29uc3Qgc0JvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzBdLCBwb3NbMV1dO1xuICAgIH0pO1xuXG4gICAgY29uc3QgdEJvdW5kcyA9IHRoaXMuZ2V0UG9pbnRzQm91bmRzKGFsbERhdGEsIGQgPT4ge1xuICAgICAgY29uc3QgcG9zID0gZ2V0UG9zaXRpb24oe2RhdGE6IGR9KTtcbiAgICAgIHJldHVybiBbcG9zWzNdLCBwb3NbNF1dO1xuICAgIH0pO1xuXG4gICAgY29uc3QgYm91bmRzID0gW1xuICAgICAgTWF0aC5taW4oc0JvdW5kc1swXSwgdEJvdW5kc1swXSksXG4gICAgICBNYXRoLm1pbihzQm91bmRzWzFdLCB0Qm91bmRzWzFdKSxcbiAgICAgIE1hdGgubWF4KHNCb3VuZHNbMl0sIHRCb3VuZHNbMl0pLFxuICAgICAgTWF0aC5tYXgoc0JvdW5kc1szXSwgdEJvdW5kc1szXSlcbiAgICBdO1xuXG4gICAgdGhpcy51cGRhdGVNZXRhKHtib3VuZHN9KTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKHtcbiAgICBkYXRhLFxuICAgIGlkeCxcbiAgICBvYmplY3RIb3ZlcmVkLFxuICAgIGxheWVySW50ZXJhY3Rpb24sXG4gICAgbWFwU3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfSkge1xuICAgIGNvbnN0IHticnVzaH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcblxuICAgIGNvbnN0IGNvbG9yVXBkYXRlVHJpZ2dlcnMgPSB7XG4gICAgICBjb2xvcjogdGhpcy5jb25maWcuY29sb3IsXG4gICAgICBjb2xvckZpZWxkOiB0aGlzLmNvbmZpZy5jb2xvckZpZWxkLFxuICAgICAgY29sb3JSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLmNvbG9yUmFuZ2UsXG4gICAgICBjb2xvclNjYWxlOiB0aGlzLmNvbmZpZy5jb2xvclNjYWxlLFxuICAgICAgdGFyZ2V0Q29sb3I6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50YXJnZXRDb2xvclxuICAgIH07XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IHtcbiAgICAgIC8vIGF1dG8gaGlnaGxpZ2h0aW5nXG4gICAgICBwaWNrYWJsZTogdHJ1ZSxcbiAgICAgIGF1dG9IaWdobGlnaHQ6ICFicnVzaC5lbmFibGVkLFxuICAgICAgaGlnaGxpZ2h0Q29sb3I6IHRoaXMuY29uZmlnLmhpZ2hsaWdodENvbG9yLFxuXG4gICAgICAvLyBicnVzaGluZ1xuICAgICAgYnJ1c2hSYWRpdXM6IGJydXNoLmNvbmZpZy5zaXplICogMTAwMCxcbiAgICAgIGJydXNoU291cmNlOiB0cnVlLFxuICAgICAgYnJ1c2hUYXJnZXQ6IHRydWUsXG4gICAgICBlbmFibGVCcnVzaGluZzogYnJ1c2guZW5hYmxlZFxuICAgIH07XG5cbiAgICByZXR1cm4gW1xuICAgICAgbmV3IEFyY0JydXNoaW5nTGF5ZXIoe1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICAuLi5pbnRlcmFjdGlvbixcbiAgICAgICAgLi4ubGF5ZXJJbnRlcmFjdGlvbixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGlkeCxcbiAgICAgICAgZnA2NDogdGhpcy5jb25maWcudmlzQ29uZmlnWydoaS1wcmVjaXNpb24nXSxcbiAgICAgICAgb3BhY2l0eTogdGhpcy5jb25maWcudmlzQ29uZmlnLm9wYWNpdHksXG4gICAgICAgIHBpY2tlZENvbG9yOiB0aGlzLmNvbmZpZy5oaWdobGlnaHRDb2xvcixcbiAgICAgICAgc3Ryb2tlU2NhbGU6IHRoaXMuY29uZmlnLnZpc0NvbmZpZy50aGlja25lc3MsXG5cbiAgICAgICAgLy8gcGFyYW1ldGVyc1xuICAgICAgICBwYXJhbWV0ZXJzOiB7ZGVwdGhUZXN0OiBtYXBTdGF0ZS5kcmFnUm90YXRlfSxcblxuICAgICAgICB1cGRhdGVUcmlnZ2Vyczoge1xuICAgICAgICAgIGdldFN0cm9rZVdpZHRoOiB7XG4gICAgICAgICAgICBzaXplRmllbGQ6IHRoaXMuY29uZmlnLnNpemVGaWVsZCxcbiAgICAgICAgICAgIHNpemVSYW5nZTogdGhpcy5jb25maWcudmlzQ29uZmlnLnNpemVSYW5nZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2V0U291cmNlQ29sb3I6IGNvbG9yVXBkYXRlVHJpZ2dlcnMsXG4gICAgICAgICAgZ2V0VGFyZ2V0Q29sb3I6IGNvbG9yVXBkYXRlVHJpZ2dlcnNcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICBdO1xuICB9XG59XG4iXX0=