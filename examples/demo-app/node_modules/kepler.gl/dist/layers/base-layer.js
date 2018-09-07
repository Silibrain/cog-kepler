'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.OVERLAY_TYPE = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _colorUtils = require('../utils/color-utils');

var _window = require('global/window');

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _defaultLayerIcon = require('./default-layer-icon');

var _defaultLayerIcon2 = _interopRequireDefault(_defaultLayerIcon);

var _defaultSettings = require('../constants/default-settings');

var _customColorRanges = require('../constants/custom-color-ranges');

var _layerFactory = require('./layer-factory');

var _utils = require('../utils/utils');

var _dataUtils = require('../utils/data-utils');

var _dataScaleUtils = require('../utils/data-scale-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/_regenerator2.default.mark(generateColor); // Copyright (c) 2018 Uber Technologies, Inc.
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

/**
 * Approx. number of points to sample in a large data set
 * @type {number}
 */
var MAX_SAMPLE_SIZE = 5000;

var OVERLAY_TYPE = exports.OVERLAY_TYPE = (0, _keymirror2.default)({
  deckgl: null,
  mapboxgl: null
});

var layerColors = Object.values(_customColorRanges.DataVizColors).map(_colorUtils.hexToRgb);
function generateColor() {
  var index;
  return _regenerator2.default.wrap(function generateColor$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0;

        case 1:
          if (!(index < layerColors.length + 1)) {
            _context.next = 7;
            break;
          }

          if (index === layerColors.length) {
            index = 0;
          }
          _context.next = 5;
          return layerColors[index++];

        case 5:
          _context.next = 1;
          break;

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}

var colorMaker = generateColor();
var defaultGetFieldValue = function defaultGetFieldValue(field, d) {
  return d[field.tableFieldIndex - 1];
};

var Layer = function () {
  function Layer() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, Layer);

    this.id = props.id || (0, _utils.generateHashId)(6);

    // meta
    this.meta = {};

    // visConfigSettings
    this.visConfigSettings = {};

    this.config = this.getDefaultLayerConfig((0, _extends7.default)({
      columns: this.getLayerColumns()
    }, props));
  }

  (0, _createClass3.default)(Layer, [{
    key: 'getDefaultLayerConfig',
    value: function getDefaultLayerConfig() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return {
        dataId: props.dataId || null,
        label: props.label || 'new layer',
        color: props.color || colorMaker.next().value,
        columns: props.columns || null,
        isVisible: props.isVisible || false,
        isConfigActive: props.isConfigActive || false,
        highlightColor: props.highlightColor || [252, 242, 26, 255],

        // TODO: refactor this into separate visual Channel config
        // color by field, domain is set by filters, field, scale type
        colorField: null,
        colorDomain: [0, 1],
        colorScale: 'quantile',

        // color by size, domain is set by filters, field, scale type
        sizeDomain: [0, 1],
        sizeScale: 'linear',
        sizeField: null,

        visConfig: {}
      };
    }

    /**
     * Get the description of a visualChannel config
     * @param key
     * @returns {{label: string, measure: (string|string)}}
     */

  }, {
    key: 'getVisualChannelDescription',
    value: function getVisualChannelDescription(key) {
      // e.g. label: Color, measure: Vehicle Type
      return {
        label: this.visConfigSettings[this.visualChannels[key].range].label,
        measure: this.config[this.visualChannels[key].field] ? this.config[this.visualChannels[key].field].name : this.visualChannels[key].defaultMeasure
      };
    }

    /**
     * Assign a field to layer column, return column config
     * @param key - Column Key
     * @param field - Selected field
     * @returns {{}} - Column config
     */

  }, {
    key: 'assignColumn',
    value: function assignColumn(key, field) {
      // field value could be null for optional columns
      var update = field ? {
        value: field.name,
        fieldIdx: field.tableFieldIndex - 1
      } : { value: null, fieldIdx: -1 };

      return (0, _extends7.default)({}, this.config.columns, (0, _defineProperty3.default)({}, key, (0, _extends7.default)({}, this.config.columns[key], update)));
    }

    /**
     * Assign a field pair to column config, return column config
     * @param key - Column Key
     * @param pair - field Pair
     * @returns {{}} - Column config
     */

  }, {
    key: 'assignColumnPairs',
    value: function assignColumnPairs(key, pair) {
      var _extends3;

      if (!this.columnPairs || !this.columnPairs[key]) {
        // should not end in this state
        return this.config.columns;
      }

      var _columnPairs$key = this.columnPairs[key],
          partnerKey = _columnPairs$key.pair,
          fieldPairKey = _columnPairs$key.fieldPairKey;
      var partnerFieldPairKey = this.columnPairs[partnerKey].fieldPairKey;


      return (0, _extends7.default)({}, this.config.columns, (_extends3 = {}, (0, _defineProperty3.default)(_extends3, key, pair[fieldPairKey]), (0, _defineProperty3.default)(_extends3, partnerKey, pair[partnerFieldPairKey]), _extends3));
    }

    /**
      * Calculate a radius zoom multiplier to render points, so they are visible in all zoom level
      * @param mapState
      * @param mapState.zoom - actual zoom
      * @param mapState.zoomOffset - zoomOffset when render in the plot container for export image
      * @returns {number}
      */

  }, {
    key: 'getZoomFactor',
    value: function getZoomFactor(_ref) {
      var zoom = _ref.zoom,
          _ref$zoomOffset = _ref.zoomOffset,
          zoomOffset = _ref$zoomOffset === undefined ? 0 : _ref$zoomOffset;

      return Math.pow(2, Math.max(14 - zoom + zoomOffset, 0));
    }

    /**
      * Calculate a elevation zoom multiplier to render points, so they are visible in all zoom level
      * @param mapState
      * @param mapState.zoom - actual zoom
      * @param mapState.zoomOffset - zoomOffset when render in the plot container for export image
      * @returns {number}
      */

  }, {
    key: 'getElevationZoomFactor',
    value: function getElevationZoomFactor(_ref2) {
      var zoom = _ref2.zoom,
          _ref2$zoomOffset = _ref2.zoomOffset,
          zoomOffset = _ref2$zoomOffset === undefined ? 0 : _ref2$zoomOffset;

      return Math.pow(2, Math.max(8 - zoom + zoomOffset, 0));
    }
  }, {
    key: 'formatLayerData',
    value: function formatLayerData(data, allData, filteredIndex) {
      return {};
    }
  }, {
    key: 'renderLayer',
    value: function renderLayer() {
      return [];
    }
  }, {
    key: 'getHoverData',
    value: function getHoverData(object) {
      if (!object) {
        return null;
      }
      // by default, each entry of layerData should have a data property points
      // to the original item in the allData array
      // each layer can implement its own getHoverData method
      return object.data;
    }

    /**
     * When change layer type, try to copy over layer configs as much as possible
     * @param configToCopy - config to copy over
     * @param visConfigSettings - visConfig settings of config to copy
     */

  }, {
    key: 'assignConfigToLayer',
    value: function assignConfigToLayer(configToCopy, visConfigSettings) {
      var _this = this;

      // don't deep merge visualChannel field
      var notToDeepMerge = Object.values(this.visualChannels).map(function (v) {
        return v.field;
      });

      // don't deep merge color range, reversed: is not a key by default
      notToDeepMerge.push('colorRange');

      // don't copy over domain
      var notToCopy = Object.values(this.visualChannels).map(function (v) {
        return v.domain;
      });

      // if range is for the same property group copy it, otherwise, not to copy
      Object.values(this.visualChannels).forEach(function (v) {
        if (configToCopy.visConfig[v.range] && visConfigSettings[v.range].group !== _this.visConfigSettings[v.range].group) {
          notToCopy.push(v.range);
        }
      });

      // don't copy over visualChannel range
      var currentConfig = this.config;
      var copied = this.copyLayerConfig(currentConfig, configToCopy, { notToDeepMerge: notToDeepMerge, notToCopy: notToCopy });

      this.updateLayerConfig(copied);
      // validate visualChannel field type and scale types
      Object.keys(this.visualChannels).forEach(function (channel) {
        _this.validateVisualChannel(channel);
      });
    }

    /*
     * Recursively copy config over to an empty layer
     * when received saved config, or copy config over from a different layer type
     * make sure to only copy over value to existing keys
     * @param {object} currentConfig - existing config to be override
     * @param {object} configToCopy - new Config to copy over
     * @param {string[]} notToDeepMerge - array of properties to not to be deep copied
     * @param {string[]} notToCopy - array of properties not to copy
     * @returns {object} - copied config
     */

  }, {
    key: 'copyLayerConfig',
    value: function copyLayerConfig(currentConfig, configToCopy) {
      var _this2 = this;

      var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref3$notToDeepMerge = _ref3.notToDeepMerge,
          notToDeepMerge = _ref3$notToDeepMerge === undefined ? [] : _ref3$notToDeepMerge,
          _ref3$notToCopy = _ref3.notToCopy,
          notToCopy = _ref3$notToCopy === undefined ? [] : _ref3$notToCopy;

      var copied = {};
      Object.keys(currentConfig).forEach(function (key) {
        if ((0, _utils.isPlainObject)(currentConfig[key]) && (0, _utils.isPlainObject)(configToCopy[key]) && !notToDeepMerge.includes(key) && !notToCopy.includes(key)) {
          // recursively assign object value
          copied[key] = _this2.copyLayerConfig(currentConfig[key], configToCopy[key], { notToDeepMerge: notToDeepMerge, notToCopy: notToCopy });
        } else if ((0, _utils.notNullorUndefined)(configToCopy[key]) && !notToCopy.includes(key)) {
          // copy
          copied[key] = configToCopy[key];
        } else {
          // keep existing
          copied[key] = currentConfig[key];
        }
      });

      return copied;
    }
  }, {
    key: 'registerVisConfig',
    value: function registerVisConfig(layerVisConfigs) {
      var _this3 = this;

      Object.keys(layerVisConfigs).forEach(function (item) {
        if (typeof item === 'string' && _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]]) {
          // if assigned one of default LAYER_CONFIGS
          _this3.config.visConfig[item] = _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]].defaultValue;
          _this3.visConfigSettings[item] = _layerFactory.LAYER_VIS_CONFIGS[layerVisConfigs[item]];
        } else if (['type', 'defaultValue'].every(function (p) {
          return layerVisConfigs[item][p];
        })) {
          // if provided customized visConfig, and has type && defaultValue
          // TODO: further check if customized visConfig is valid
          _this3.config.visConfig[item] = layerVisConfigs[item].defaultValue;
          _this3.visConfigSettings[item] = layerVisConfigs[item];
        }
      });
    }
  }, {
    key: 'getLayerColumns',
    value: function getLayerColumns() {
      var required = this.requiredLayerColumns.reduce(function (accu, key) {
        return (0, _extends7.default)({}, accu, (0, _defineProperty3.default)({}, key, { value: null, fieldIdx: -1 }));
      }, {});
      var optional = this.optionalColumns.reduce(function (accu, key) {
        return (0, _extends7.default)({}, accu, (0, _defineProperty3.default)({}, key, { value: null, fieldIdx: -1, optional: true }));
      }, {});

      return (0, _extends7.default)({}, required, optional);
    }
  }, {
    key: 'updateLayerConfig',
    value: function updateLayerConfig(newConfig) {
      this.config = (0, _extends7.default)({}, this.config, newConfig);
      return this;
    }
  }, {
    key: 'updateLayerVisConfig',
    value: function updateLayerVisConfig(newVisConfig) {
      this.config.visConfig = (0, _extends7.default)({}, this.config.visConfig, newVisConfig);
      return this;
    }
    /**
     * Check whether layer has all columns
     *
     * @param {object} layer
     * @returns {boolean} yes or no
     */

  }, {
    key: 'hasAllColumns',
    value: function hasAllColumns() {
      var columns = this.config.columns;

      return columns && Object.values(columns).every(function (v) {
        return Boolean(v.optional || v.value && v.fieldIdx > -1);
      });
    }

    /**
     * Check whether layer has data
     *
     * @param {object} layer
     * @param {Array | Object} layerData
     * @returns {boolean} yes or no
     */

  }, {
    key: 'hasLayerData',
    value: function hasLayerData(layerData) {
      if (!layerData) {
        return false;
      }

      return Boolean(layerData.data && layerData.data.length);
    }
  }, {
    key: 'isValidToSave',
    value: function isValidToSave() {
      return this.type && this.hasAllColumns();
    }
  }, {
    key: 'shouldRenderLayer',
    value: function shouldRenderLayer(data) {
      return this.type && this.hasAllColumns() && this.config.isVisible && this.hasLayerData(data);
    }
  }, {
    key: 'getVisChannelScale',
    value: function getVisChannelScale(scale, domain, range, fixed) {
      return _defaultSettings.SCALE_FUNC[fixed ? 'linear' : scale]().domain(domain).range(fixed ? domain : range);
    }
  }, {
    key: 'getPointsBounds',
    value: function getPointsBounds(allData, getPosition) {
      // no need to loop through the entire dataset
      // get a sample of data to calculate bounds
      var sampleData = allData.length > MAX_SAMPLE_SIZE ? (0, _dataUtils.getSampleData)(allData, MAX_SAMPLE_SIZE) : allData;
      var points = sampleData.map(getPosition);

      var latBounds = (0, _dataUtils.getLatLngBounds)(points, 1, [-90, 90]);
      var lngBounds = (0, _dataUtils.getLatLngBounds)(points, 0, [-180, 180]);

      if (!latBounds || !lngBounds) {
        return null;
      }

      return [lngBounds[0], latBounds[0], lngBounds[1], latBounds[1]];
    }
  }, {
    key: 'getLightSettingsFromBounds',
    value: function getLightSettingsFromBounds(bounds) {
      return Array.isArray(bounds) && bounds.length >= 4 ? (0, _extends7.default)({}, _defaultSettings.DEFAULT_LIGHT_SETTINGS, {
        lightsPosition: [].concat((0, _toConsumableArray3.default)(bounds.slice(0, 2)), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[2]], (0, _toConsumableArray3.default)(bounds.slice(2, 4)), [_defaultSettings.DEFAULT_LIGHT_SETTINGS.lightsPosition[5]])
      }) : _defaultSettings.DEFAULT_LIGHT_SETTINGS;
    }
  }, {
    key: 'getEncodedChannelValue',
    value: function getEncodedChannelValue(scale, data, field) {
      var defaultValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : _defaultSettings.NO_VALUE_COLOR;
      var getValue = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : defaultGetFieldValue;
      var type = field.type;

      var value = getValue(field, data);
      var attributeValue = void 0;
      if (type === _defaultSettings.ALL_FIELD_TYPES.timestamp) {
        // shouldn't need to convert here
        // scale Function should take care of it
        attributeValue = scale(new Date(value));
      } else {
        attributeValue = scale(value);
      }

      if (!attributeValue) {
        attributeValue = defaultValue;
      }

      return attributeValue;
    }
  }, {
    key: 'updateMeta',
    value: function updateMeta(meta) {
      this.meta = (0, _extends7.default)({}, this.meta, meta);
    }

    /**
     * helper function to update one layer domain when state.data changed
     * if state.data change is due ot update filter, newFiler will be passed
     * called by updateAllLayerDomainData
     * @param {Object} dataset
     * @param {Object} newFilter
     * @returns {object} layer
     */

  }, {
    key: 'updateLayerDomain',
    value: function updateLayerDomain(dataset, newFilter) {
      var _this4 = this;

      Object.values(this.visualChannels).forEach(function (channel) {
        var scale = channel.scale;

        var scaleType = _this4.config[scale];
        // ordinal domain is based on allData, if only filter changed
        // no need to update ordinal domain
        if (!newFilter || scaleType !== _defaultSettings.SCALE_TYPES.ordinal) {
          var domain = channel.domain;

          var updatedDomain = _this4.calculateLayerDomain(dataset, channel);

          _this4.updateLayerConfig((0, _defineProperty3.default)({}, domain, updatedDomain));
        }
      });

      return this;
    }

    /**
     * Validate visual channel field and scales based on supported field & scale type
     * @param channel
     */

  }, {
    key: 'validateVisualChannel',
    value: function validateVisualChannel(channel) {
      this.validateFieldType(channel);
      this.validateScale(channel);
    }

    /**
     * Validate field type based on channelScaleType
     */

  }, {
    key: 'validateFieldType',
    value: function validateFieldType(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          channelScaleType = visualChannel.channelScaleType,
          supportedFieldTypes = visualChannel.supportedFieldTypes;


      if (this.config[field]) {
        // if field is selected, check if field type is supported
        var channelSupportedFieldTypes = supportedFieldTypes || _defaultSettings.CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];

        if (!channelSupportedFieldTypes.includes(this.config[field].type)) {
          // field type is not supported, set it back to null
          // set scale back to default
          this.updateLayerConfig((0, _defineProperty3.default)({}, field, null));
        }
      }
    }

    /**
     * Validate scale type based on aggregation
     */

  }, {
    key: 'validateScale',
    value: function validateScale(channel) {
      var visualChannel = this.visualChannels[channel];
      var scale = visualChannel.scale;

      if (!scale) {
        // visualChannel doesn't have scale
        return;
      }
      var scaleOptions = this.getScaleOptions(channel);
      // check if current selected scale is
      // supported, if not, change to default
      if (!scaleOptions.includes(this.config[scale])) {
        this.updateLayerConfig((0, _defineProperty3.default)({}, scale, scaleOptions[0]));
      }
    }

    /**
     * Get scale options based on current field
     * @param {string} channel
     * @returns {string[]}
     */

  }, {
    key: 'getScaleOptions',
    value: function getScaleOptions(channel) {
      var visualChannel = this.visualChannels[channel];
      var field = visualChannel.field,
          scale = visualChannel.scale,
          channelScaleType = visualChannel.channelScaleType;


      return this.config[field] ? _defaultSettings.FIELD_OPTS[this.config[field].type].scale[channelScaleType] : [this.getDefaultLayerConfig()[scale]];
    }
  }, {
    key: 'updateLayerVisualChannel',
    value: function updateLayerVisualChannel(dataset, channel) {
      var visualChannel = this.visualChannels[channel];

      this.validateVisualChannel(channel);
      // calculate layer channel domain
      var updatedDomain = this.calculateLayerDomain(dataset, visualChannel);

      this.updateLayerConfig((0, _defineProperty3.default)({}, visualChannel.domain, updatedDomain));
    }
  }, {
    key: 'calculateLayerDomain',
    value: function calculateLayerDomain(dataset, visualChannel) {
      var allData = dataset.allData,
          filteredIndexForDomain = dataset.filteredIndexForDomain;

      var defaultDomain = [0, 1];
      var scale = visualChannel.scale;

      var scaleType = this.config[scale];

      var field = this.config[visualChannel.field];
      if (!field) {
        // if colorField or sizeField were set back to null
        return defaultDomain;
      }

      if (!_defaultSettings.SCALE_TYPES[scaleType]) {
        _window.console.error('scale type ' + scaleType + ' not supported');
        return defaultDomain;
      }

      // TODO: refactor to add valueAccessor to field
      var fieldIdx = field.tableFieldIndex - 1;
      var isTime = field.type === _defaultSettings.ALL_FIELD_TYPES.timestamp;
      var valueAccessor = _dataUtils.maybeToDate.bind(null, isTime, fieldIdx, field.format);
      var indexValueAccessor = function indexValueAccessor(i) {
        return valueAccessor(allData[i]);
      };

      var sortFunction = (0, _dataUtils.getSortingFunction)(field.type);

      switch (scaleType) {
        case _defaultSettings.SCALE_TYPES.ordinal:
        case _defaultSettings.SCALE_TYPES.point:
          // do not recalculate ordinal domain based on filtered data
          // don't need to update ordinal domain every time
          return (0, _dataScaleUtils.getOrdinalDomain)(allData, valueAccessor);

        case _defaultSettings.SCALE_TYPES.quantile:
          return (0, _dataScaleUtils.getQuantileDomain)(filteredIndexForDomain, indexValueAccessor, sortFunction);

        case _defaultSettings.SCALE_TYPES.quantize:
        case _defaultSettings.SCALE_TYPES.linear:
        case _defaultSettings.SCALE_TYPES.sqrt:
        default:
          return (0, _dataScaleUtils.getLinearDomain)(filteredIndexForDomain, indexValueAccessor);
      }
    }
  }, {
    key: 'isLayerHovered',
    value: function isLayerHovered(objectInfo) {
      return objectInfo && objectInfo.layer && objectInfo.picked && objectInfo.layer.props.id === this.id;
    }
  }, {
    key: 'getRadiusScaleByZoom',
    value: function getRadiusScaleByZoom(mapState, fixedRadius) {
      var radiusChannel = Object.values(this.visualChannels).find(function (vc) {
        return vc.property === 'radius';
      });

      if (!radiusChannel) {
        return 1;
      }

      var field = radiusChannel.field;
      var fixed = fixedRadius === undefined ? this.config.visConfig.fixedRadius : fixedRadius;
      var radius = this.config.visConfig.radius;


      return fixed ? 1 : (this.config[field] ? 1 : radius) * this.getZoomFactor(mapState);
    }
  }, {
    key: 'shouldCalculateLayerData',
    value: function shouldCalculateLayerData(props) {
      var _this5 = this;

      return props.some(function (p) {
        return !_this5.noneLayerDataAffectingProps.includes(p);
      });
    }
  }, {
    key: 'layerIcon',
    get: function get() {
      return _defaultLayerIcon2.default;
    }
  }, {
    key: 'overlayType',
    get: function get() {
      return OVERLAY_TYPE.deckgl;
    }
  }, {
    key: 'type',
    get: function get() {
      return null;
    }
  }, {
    key: 'name',
    get: function get() {
      return this.type;
    }
  }, {
    key: 'isAggregated',
    get: function get() {
      return false;
    }
  }, {
    key: 'requiredLayerColumns',
    get: function get() {
      return [];
    }
  }, {
    key: 'optionalColumns',
    get: function get() {
      return [];
    }
  }, {
    key: 'noneLayerDataAffectingProps',
    get: function get() {
      return ['label', 'opacity', 'thickness', 'isVisible'];
    }
  }, {
    key: 'visualChannels',
    get: function get() {
      return {
        color: {
          property: 'color',
          field: 'colorField',
          scale: 'colorScale',
          domain: 'colorDomain',
          range: 'colorRange',
          key: 'color',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.color
        },
        size: {
          property: 'size',
          field: 'sizeField',
          scale: 'sizeScale',
          domain: 'sizeDomain',
          range: 'sizeRange',
          key: 'size',
          channelScaleType: _defaultSettings.CHANNEL_SCALES.size
        }
      };
    }

    /*
     * Column pairs maps layer column to a specific field pairs,
     * By default, it is set to null
     */

  }, {
    key: 'columnPairs',
    get: function get() {
      return null;
    }

    /*
     * Default point column pairs, can be used for point based layers: point, icon etc.
     */

  }, {
    key: 'defaultPointColumnPairs',
    get: function get() {
      return {
        lat: { pair: 'lng', fieldPairKey: 'lat' },
        lng: { pair: 'lat', fieldPairKey: 'lng' }
      };
    }

    /*
     * Default link column pairs, can be used for link based layers: arc, line etc
     */

  }, {
    key: 'defaultLinkColumnPairs',
    get: function get() {
      return {
        lat0: { pair: 'lng0', fieldPairKey: 'lat' },
        lng0: { pair: 'lat0', fieldPairKey: 'lng' },
        lat1: { pair: 'lng1', fieldPairKey: 'lat' },
        lng1: { pair: 'lat1', fieldPairKey: 'lng' }
      };
    }

    /**
     * Return a React component for to render layer instructions in a modal
     * @returns {object} - an object
     * @example
     *  return {
     *    id: 'iconInfo',
     *    template: IconInfoModal,
     *    modalProps: {
     *      title: 'How to draw icons'
     *   };
     * }
     */

  }, {
    key: 'layerInfoModal',
    get: function get() {
      return null;
    }
    /*
     * Given a dataset, automatically create layers based on it
     * and return the props
     * By default, no layers will be found
     */

  }], [{
    key: 'findDefaultLayerProps',
    value: function findDefaultLayerProps(fieldPairs, dataId) {
      return null;
    }

    /**
     * Given a array of preset required column names
     * found field that has the same name to set as layer column
     *
     * @param {object[]} defaultFields
     * @param {object[]} allFields
     * @returns {object[] | null} all possible required layer column pairs
     */

  }, {
    key: 'findDefaultColumnField',
    value: function findDefaultColumnField(defaultFields, allFields) {
      // find all matched fields for each required col
      var requiredColumns = Object.keys(defaultFields).reduce(function (prev, key) {
        var requiredFields = allFields.filter(function (f) {
          return f.name === defaultFields[key] || defaultFields[key].includes(f.name);
        });

        prev[key] = requiredFields.length ? requiredFields.map(function (f) {
          return {
            value: f.name,
            fieldIdx: f.tableFieldIndex - 1
          };
        }) : null;
        return prev;
      }, {});

      if (!Object.values(requiredColumns).every(Boolean)) {
        // if any field missing, return null
        return null;
      }

      return this.getAllPossibleColumnParis(requiredColumns);
    }
  }, {
    key: 'getAllPossibleColumnParis',
    value: function getAllPossibleColumnParis(requiredColumns) {
      // for multiple matched field for one required column, return multiple
      // combinations, e. g. if column a has 2 matched, column b has 3 matched
      // 6 possible column pairs will be returned
      var allKeys = Object.keys(requiredColumns);
      var pointers = allKeys.map(function (k, i) {
        return i === allKeys.length - 1 ? -1 : 0;
      });
      var countPerKey = allKeys.map(function (k) {
        return requiredColumns[k].length;
      });
      var pairs = [];

      /* eslint-disable no-loop-func */
      while (incrementPointers(pointers, countPerKey, pointers.length - 1)) {
        var newPair = pointers.reduce(function (prev, cuur, i) {
          prev[allKeys[i]] = requiredColumns[allKeys[i]][cuur];
          return prev;
        }, {});

        pairs.push(newPair);
      }
      /* eslint-enable no-loop-func */

      // recursively increment pointers
      function incrementPointers(pts, counts, index) {
        if (index === 0 && pts[0] === counts[0] - 1) {
          // nothing to increment
          return false;
        }

        if (pts[index] + 1 < counts[index]) {
          pts[index] = pts[index] + 1;
          return true;
        }

        pts[index] = 0;
        return incrementPointers(pts, counts, index - 1);
      }

      return pairs;
    }
  }, {
    key: 'hexToRgb',
    value: function hexToRgb(c) {
      return (0, _colorUtils.hexToRgb)(c);
    }
  }]);
  return Layer;
}();

exports.default = Layer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sYXllcnMvYmFzZS1sYXllci5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZUNvbG9yIiwiTUFYX1NBTVBMRV9TSVpFIiwiT1ZFUkxBWV9UWVBFIiwiZGVja2dsIiwibWFwYm94Z2wiLCJsYXllckNvbG9ycyIsIk9iamVjdCIsInZhbHVlcyIsIkRhdGFWaXpDb2xvcnMiLCJtYXAiLCJoZXhUb1JnYiIsImluZGV4IiwibGVuZ3RoIiwiY29sb3JNYWtlciIsImRlZmF1bHRHZXRGaWVsZFZhbHVlIiwiZmllbGQiLCJkIiwidGFibGVGaWVsZEluZGV4IiwiTGF5ZXIiLCJwcm9wcyIsImlkIiwibWV0YSIsInZpc0NvbmZpZ1NldHRpbmdzIiwiY29uZmlnIiwiZ2V0RGVmYXVsdExheWVyQ29uZmlnIiwiY29sdW1ucyIsImdldExheWVyQ29sdW1ucyIsImRhdGFJZCIsImxhYmVsIiwiY29sb3IiLCJuZXh0IiwidmFsdWUiLCJpc1Zpc2libGUiLCJpc0NvbmZpZ0FjdGl2ZSIsImhpZ2hsaWdodENvbG9yIiwiY29sb3JGaWVsZCIsImNvbG9yRG9tYWluIiwiY29sb3JTY2FsZSIsInNpemVEb21haW4iLCJzaXplU2NhbGUiLCJzaXplRmllbGQiLCJ2aXNDb25maWciLCJrZXkiLCJ2aXN1YWxDaGFubmVscyIsInJhbmdlIiwibWVhc3VyZSIsIm5hbWUiLCJkZWZhdWx0TWVhc3VyZSIsInVwZGF0ZSIsImZpZWxkSWR4IiwicGFpciIsImNvbHVtblBhaXJzIiwicGFydG5lcktleSIsImZpZWxkUGFpcktleSIsInBhcnRuZXJGaWVsZFBhaXJLZXkiLCJ6b29tIiwiem9vbU9mZnNldCIsIk1hdGgiLCJwb3ciLCJtYXgiLCJkYXRhIiwiYWxsRGF0YSIsImZpbHRlcmVkSW5kZXgiLCJvYmplY3QiLCJjb25maWdUb0NvcHkiLCJub3RUb0RlZXBNZXJnZSIsInYiLCJwdXNoIiwibm90VG9Db3B5IiwiZG9tYWluIiwiZm9yRWFjaCIsImdyb3VwIiwiY3VycmVudENvbmZpZyIsImNvcGllZCIsImNvcHlMYXllckNvbmZpZyIsInVwZGF0ZUxheWVyQ29uZmlnIiwia2V5cyIsInZhbGlkYXRlVmlzdWFsQ2hhbm5lbCIsImNoYW5uZWwiLCJpbmNsdWRlcyIsImxheWVyVmlzQ29uZmlncyIsIml0ZW0iLCJMQVlFUl9WSVNfQ09ORklHUyIsImRlZmF1bHRWYWx1ZSIsImV2ZXJ5IiwicCIsInJlcXVpcmVkIiwicmVxdWlyZWRMYXllckNvbHVtbnMiLCJyZWR1Y2UiLCJhY2N1Iiwib3B0aW9uYWwiLCJvcHRpb25hbENvbHVtbnMiLCJuZXdDb25maWciLCJuZXdWaXNDb25maWciLCJCb29sZWFuIiwibGF5ZXJEYXRhIiwidHlwZSIsImhhc0FsbENvbHVtbnMiLCJoYXNMYXllckRhdGEiLCJzY2FsZSIsImZpeGVkIiwiU0NBTEVfRlVOQyIsImdldFBvc2l0aW9uIiwic2FtcGxlRGF0YSIsInBvaW50cyIsImxhdEJvdW5kcyIsImxuZ0JvdW5kcyIsImJvdW5kcyIsIkFycmF5IiwiaXNBcnJheSIsIkRFRkFVTFRfTElHSFRfU0VUVElOR1MiLCJsaWdodHNQb3NpdGlvbiIsInNsaWNlIiwiTk9fVkFMVUVfQ09MT1IiLCJnZXRWYWx1ZSIsImF0dHJpYnV0ZVZhbHVlIiwiQUxMX0ZJRUxEX1RZUEVTIiwidGltZXN0YW1wIiwiRGF0ZSIsImRhdGFzZXQiLCJuZXdGaWx0ZXIiLCJzY2FsZVR5cGUiLCJTQ0FMRV9UWVBFUyIsIm9yZGluYWwiLCJ1cGRhdGVkRG9tYWluIiwiY2FsY3VsYXRlTGF5ZXJEb21haW4iLCJ2YWxpZGF0ZUZpZWxkVHlwZSIsInZhbGlkYXRlU2NhbGUiLCJ2aXN1YWxDaGFubmVsIiwiY2hhbm5lbFNjYWxlVHlwZSIsInN1cHBvcnRlZEZpZWxkVHlwZXMiLCJjaGFubmVsU3VwcG9ydGVkRmllbGRUeXBlcyIsIkNIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEUyIsInNjYWxlT3B0aW9ucyIsImdldFNjYWxlT3B0aW9ucyIsIkZJRUxEX09QVFMiLCJmaWx0ZXJlZEluZGV4Rm9yRG9tYWluIiwiZGVmYXVsdERvbWFpbiIsIkNvbnNvbGUiLCJlcnJvciIsImlzVGltZSIsInZhbHVlQWNjZXNzb3IiLCJtYXliZVRvRGF0ZSIsImJpbmQiLCJmb3JtYXQiLCJpbmRleFZhbHVlQWNjZXNzb3IiLCJpIiwic29ydEZ1bmN0aW9uIiwicG9pbnQiLCJxdWFudGlsZSIsInF1YW50aXplIiwibGluZWFyIiwic3FydCIsIm9iamVjdEluZm8iLCJsYXllciIsInBpY2tlZCIsIm1hcFN0YXRlIiwiZml4ZWRSYWRpdXMiLCJyYWRpdXNDaGFubmVsIiwiZmluZCIsInZjIiwicHJvcGVydHkiLCJ1bmRlZmluZWQiLCJyYWRpdXMiLCJnZXRab29tRmFjdG9yIiwic29tZSIsIm5vbmVMYXllckRhdGFBZmZlY3RpbmdQcm9wcyIsIkRlZmF1bHRMYXllckljb24iLCJDSEFOTkVMX1NDQUxFUyIsInNpemUiLCJsYXQiLCJsbmciLCJsYXQwIiwibG5nMCIsImxhdDEiLCJsbmcxIiwiZmllbGRQYWlycyIsImRlZmF1bHRGaWVsZHMiLCJhbGxGaWVsZHMiLCJyZXF1aXJlZENvbHVtbnMiLCJwcmV2IiwicmVxdWlyZWRGaWVsZHMiLCJmaWx0ZXIiLCJmIiwiZ2V0QWxsUG9zc2libGVDb2x1bW5QYXJpcyIsImFsbEtleXMiLCJwb2ludGVycyIsImsiLCJjb3VudFBlcktleSIsInBhaXJzIiwiaW5jcmVtZW50UG9pbnRlcnMiLCJuZXdQYWlyIiwiY3V1ciIsInB0cyIsImNvdW50cyIsImMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkE7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQVVBOztBQUNBOztBQUVBOztBQUVBOztBQU9BOzs7O3NEQWtCVUEsYSxHQWpFVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFtQ0E7Ozs7QUFJQSxJQUFN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VzRILE9BQVg7QUFDRDtBQUNEOztBQUVBO0FBQ0EsZUFBU0QsaUJBQVQsQ0FBMkJHLEdBQTNCLEVBQWdDQyxNQUFoQyxFQUF3Q3ZMLEtBQXhDLEVBQStDO0FBQzdDLFlBQUlBLFVBQVUsQ0FBVixJQUFlc0wsSUFBSSxDQUFKLE1BQVdDLE9BQU8sQ0FBUCxJQUFZLENBQTFDLEVBQTZDO0FBQzNDO0FBQ0EsaUJBQU8sS0FBUDtBQUNEOztBQUVELFlBQUlELElBQUl0TCxLQUFKLElBQWEsQ0FBYixHQUFpQnVMLE9BQU92TCxLQUFQLENBQXJCLEVBQW9DO0FBQ2xDc0wsY0FBSXRMLEtBQUosSUFBYXNMLElBQUl0TCxLQUFKLElBQWEsQ0FBMUI7QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBRURzTCxZQUFJdEwsS0FBSixJQUFhLENBQWI7QUFDQSxlQUFPbUwsa0JBQWtCRyxHQUFsQixFQUF1QkMsTUFBdkIsRUFBK0J2TCxRQUFRLENBQXZDLENBQVA7QUFDRDs7QUFFRCxhQUFPa0wsS0FBUDtBQUNEOzs7NkJBRWVNLEMsRUFBRztBQUNqQixhQUFPLDBCQUFTQSxDQUFULENBQVA7QUFDRDs7Ozs7a0JBdE1rQmpMLEsiLCJmaWxlIjoiYmFzZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxOCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7aGV4VG9SZ2J9IGZyb20gJ3V0aWxzL2NvbG9yLXV0aWxzJztcbmltcG9ydCB7Y29uc29sZSBhcyBDb25zb2xlfSBmcm9tICdnbG9iYWwvd2luZG93JztcbmltcG9ydCBrZXltaXJyb3IgZnJvbSAna2V5bWlycm9yJztcbmltcG9ydCBEZWZhdWx0TGF5ZXJJY29uIGZyb20gJy4vZGVmYXVsdC1sYXllci1pY29uJztcblxuaW1wb3J0IHtcbiAgQUxMX0ZJRUxEX1RZUEVTLFxuICBERUZBVUxUX0xJR0hUX1NFVFRJTkdTLFxuICBOT19WQUxVRV9DT0xPUixcbiAgU0NBTEVfVFlQRVMsXG4gIENIQU5ORUxfU0NBTEVTLFxuICBGSUVMRF9PUFRTLFxuICBTQ0FMRV9GVU5DLFxuICBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuaW1wb3J0IHtEYXRhVml6Q29sb3JzfSBmcm9tICdjb25zdGFudHMvY3VzdG9tLWNvbG9yLXJhbmdlcyc7XG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICcuL2xheWVyLWZhY3RvcnknO1xuXG5pbXBvcnQge2dlbmVyYXRlSGFzaElkLCBub3ROdWxsb3JVbmRlZmluZWQsIGlzUGxhaW5PYmplY3R9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgZ2V0U2FtcGxlRGF0YSxcbiAgZ2V0TGF0TG5nQm91bmRzLFxuICBtYXliZVRvRGF0ZSxcbiAgZ2V0U29ydGluZ0Z1bmN0aW9uXG59IGZyb20gJ3V0aWxzL2RhdGEtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBnZXRRdWFudGlsZURvbWFpbixcbiAgZ2V0T3JkaW5hbERvbWFpbixcbiAgZ2V0TGluZWFyRG9tYWluXG59IGZyb20gJ3V0aWxzL2RhdGEtc2NhbGUtdXRpbHMnO1xuXG4vKipcbiAqIEFwcHJveC4gbnVtYmVyIG9mIHBvaW50cyB0byBzYW1wbGUgaW4gYSBsYXJnZSBkYXRhIHNldFxuICogQHR5cGUge251bWJlcn1cbiAqL1xuY29uc3QgTUFYX1NBTVBMRV9TSVpFID0gNTAwMDtcblxuZXhwb3J0IGNvbnN0IE9WRVJMQVlfVFlQRSA9IGtleW1pcnJvcih7XG4gIGRlY2tnbDogbnVsbCxcbiAgbWFwYm94Z2w6IG51bGxcbn0pO1xuXG5jb25zdCBsYXllckNvbG9ycyA9IE9iamVjdC52YWx1ZXMoRGF0YVZpekNvbG9ycykubWFwKGhleFRvUmdiKTtcbmZ1bmN0aW9uKiBnZW5lcmF0ZUNvbG9yKCkge1xuICBsZXQgaW5kZXggPSAwO1xuICB3aGlsZSAoaW5kZXggPCBsYXllckNvbG9ycy5sZW5ndGggKyAxKSB7XG4gICAgaWYgKGluZGV4ID09PSBsYXllckNvbG9ycy5sZW5ndGgpIHtcbiAgICAgIGluZGV4ID0gMDtcbiAgICB9XG4gICAgeWllbGQgbGF5ZXJDb2xvcnNbaW5kZXgrK107XG4gIH1cbn1cblxuY29uc3QgY29sb3JNYWtlciA9IGdlbmVyYXRlQ29sb3IoKTtcbmNvbnN0IGRlZmF1bHRHZXRGaWVsZFZhbHVlID0gKGZpZWxkLCBkKSA9PiBkW2ZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllciB7XG4gIGNvbnN0cnVjdG9yKHByb3BzID0ge30pIHtcbiAgICB0aGlzLmlkID0gcHJvcHMuaWQgfHwgZ2VuZXJhdGVIYXNoSWQoNik7XG5cbiAgICAvLyBtZXRhXG4gICAgdGhpcy5tZXRhID0ge307XG5cbiAgICAvLyB2aXNDb25maWdTZXR0aW5nc1xuICAgIHRoaXMudmlzQ29uZmlnU2V0dGluZ3MgPSB7fTtcblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5nZXREZWZhdWx0TGF5ZXJDb25maWcoe1xuICAgICAgY29sdW1uczogdGhpcy5nZXRMYXllckNvbHVtbnMoKSxcbiAgICAgIC4uLnByb3BzXG4gICAgfSk7XG4gIH1cblxuICBnZXQgbGF5ZXJJY29uKCkge1xuICAgIHJldHVybiBEZWZhdWx0TGF5ZXJJY29uO1xuICB9XG5cbiAgZ2V0IG92ZXJsYXlUeXBlKCkge1xuICAgIHJldHVybiBPVkVSTEFZX1RZUEUuZGVja2dsO1xuICB9XG5cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xuICB9XG5cbiAgZ2V0IGlzQWdncmVnYXRlZCgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXQgcmVxdWlyZWRMYXllckNvbHVtbnMoKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgZ2V0IG9wdGlvbmFsQ29sdW1ucygpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBnZXQgbm9uZUxheWVyRGF0YUFmZmVjdGluZ1Byb3BzKCkge1xuICAgIHJldHVybiBbJ2xhYmVsJywgJ29wYWNpdHknLCAndGhpY2tuZXNzJywgJ2lzVmlzaWJsZSddO1xuICB9XG5cbiAgZ2V0IHZpc3VhbENoYW5uZWxzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb2xvcjoge1xuICAgICAgICBwcm9wZXJ0eTogJ2NvbG9yJyxcbiAgICAgICAgZmllbGQ6ICdjb2xvckZpZWxkJyxcbiAgICAgICAgc2NhbGU6ICdjb2xvclNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnY29sb3JEb21haW4nLFxuICAgICAgICByYW5nZTogJ2NvbG9yUmFuZ2UnLFxuICAgICAgICBrZXk6ICdjb2xvcicsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLmNvbG9yXG4gICAgICB9LFxuICAgICAgc2l6ZToge1xuICAgICAgICBwcm9wZXJ0eTogJ3NpemUnLFxuICAgICAgICBmaWVsZDogJ3NpemVGaWVsZCcsXG4gICAgICAgIHNjYWxlOiAnc2l6ZVNjYWxlJyxcbiAgICAgICAgZG9tYWluOiAnc2l6ZURvbWFpbicsXG4gICAgICAgIHJhbmdlOiAnc2l6ZVJhbmdlJyxcbiAgICAgICAga2V5OiAnc2l6ZScsXG4gICAgICAgIGNoYW5uZWxTY2FsZVR5cGU6IENIQU5ORUxfU0NBTEVTLnNpemVcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLypcbiAgICogQ29sdW1uIHBhaXJzIG1hcHMgbGF5ZXIgY29sdW1uIHRvIGEgc3BlY2lmaWMgZmllbGQgcGFpcnMsXG4gICAqIEJ5IGRlZmF1bHQsIGl0IGlzIHNldCB0byBudWxsXG4gICAqL1xuICBnZXQgY29sdW1uUGFpcnMoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKlxuICAgKiBEZWZhdWx0IHBvaW50IGNvbHVtbiBwYWlycywgY2FuIGJlIHVzZWQgZm9yIHBvaW50IGJhc2VkIGxheWVyczogcG9pbnQsIGljb24gZXRjLlxuICAgKi9cbiAgZ2V0IGRlZmF1bHRQb2ludENvbHVtblBhaXJzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsYXQ6IHtwYWlyOiAnbG5nJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmc6IHtwYWlyOiAnbGF0JywgZmllbGRQYWlyS2V5OiAnbG5nJ31cbiAgICB9O1xuICB9XG5cbiAgLypcbiAgICogRGVmYXVsdCBsaW5rIGNvbHVtbiBwYWlycywgY2FuIGJlIHVzZWQgZm9yIGxpbmsgYmFzZWQgbGF5ZXJzOiBhcmMsIGxpbmUgZXRjXG4gICAqL1xuICBnZXQgZGVmYXVsdExpbmtDb2x1bW5QYWlycygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGF0MDoge3BhaXI6ICdsbmcwJywgZmllbGRQYWlyS2V5OiAnbGF0J30sXG4gICAgICBsbmcwOiB7cGFpcjogJ2xhdDAnLCBmaWVsZFBhaXJLZXk6ICdsbmcnfSxcbiAgICAgIGxhdDE6IHtwYWlyOiAnbG5nMScsIGZpZWxkUGFpcktleTogJ2xhdCd9LFxuICAgICAgbG5nMToge3BhaXI6ICdsYXQxJywgZmllbGRQYWlyS2V5OiAnbG5nJ31cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIFJlYWN0IGNvbXBvbmVudCBmb3IgdG8gcmVuZGVyIGxheWVyIGluc3RydWN0aW9ucyBpbiBhIG1vZGFsXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gYW4gb2JqZWN0XG4gICAqIEBleGFtcGxlXG4gICAqICByZXR1cm4ge1xuICAgKiAgICBpZDogJ2ljb25JbmZvJyxcbiAgICogICAgdGVtcGxhdGU6IEljb25JbmZvTW9kYWwsXG4gICAqICAgIG1vZGFsUHJvcHM6IHtcbiAgICogICAgICB0aXRsZTogJ0hvdyB0byBkcmF3IGljb25zJ1xuICAgKiAgIH07XG4gICAqIH1cbiAgICovXG4gIGdldCBsYXllckluZm9Nb2RhbCgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICAvKlxuICAgKiBHaXZlbiBhIGRhdGFzZXQsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIGxheWVycyBiYXNlZCBvbiBpdFxuICAgKiBhbmQgcmV0dXJuIHRoZSBwcm9wc1xuICAgKiBCeSBkZWZhdWx0LCBubyBsYXllcnMgd2lsbCBiZSBmb3VuZFxuICAgKi9cbiAgc3RhdGljIGZpbmREZWZhdWx0TGF5ZXJQcm9wcyhmaWVsZFBhaXJzLCBkYXRhSWQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIGFycmF5IG9mIHByZXNldCByZXF1aXJlZCBjb2x1bW4gbmFtZXNcbiAgICogZm91bmQgZmllbGQgdGhhdCBoYXMgdGhlIHNhbWUgbmFtZSB0byBzZXQgYXMgbGF5ZXIgY29sdW1uXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0W119IGRlZmF1bHRGaWVsZHNcbiAgICogQHBhcmFtIHtvYmplY3RbXX0gYWxsRmllbGRzXG4gICAqIEByZXR1cm5zIHtvYmplY3RbXSB8IG51bGx9IGFsbCBwb3NzaWJsZSByZXF1aXJlZCBsYXllciBjb2x1bW4gcGFpcnNcbiAgICovXG4gIHN0YXRpYyBmaW5kRGVmYXVsdENvbHVtbkZpZWxkKGRlZmF1bHRGaWVsZHMsIGFsbEZpZWxkcykge1xuICAgIC8vIGZpbmQgYWxsIG1hdGNoZWQgZmllbGRzIGZvciBlYWNoIHJlcXVpcmVkIGNvbFxuICAgIGNvbnN0IHJlcXVpcmVkQ29sdW1ucyA9IE9iamVjdC5rZXlzKGRlZmF1bHRGaWVsZHMpLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG4gICAgICBjb25zdCByZXF1aXJlZEZpZWxkcyA9IGFsbEZpZWxkcy5maWx0ZXIoXG4gICAgICAgIGYgPT4gZi5uYW1lID09PSBkZWZhdWx0RmllbGRzW2tleV0gfHwgZGVmYXVsdEZpZWxkc1trZXldLmluY2x1ZGVzKGYubmFtZSlcbiAgICAgICk7XG5cbiAgICAgIHByZXZba2V5XSA9IHJlcXVpcmVkRmllbGRzLmxlbmd0aFxuICAgICAgICA/IHJlcXVpcmVkRmllbGRzLm1hcChmID0+ICh7XG4gICAgICAgICAgdmFsdWU6IGYubmFtZSxcbiAgICAgICAgICBmaWVsZElkeDogZi50YWJsZUZpZWxkSW5kZXggLSAxXG4gICAgICAgIH0pKVxuICAgICAgICA6IG51bGw7XG4gICAgICByZXR1cm4gcHJldjtcbiAgICB9LCB7fSk7XG5cbiAgICBpZiAoIU9iamVjdC52YWx1ZXMocmVxdWlyZWRDb2x1bW5zKS5ldmVyeShCb29sZWFuKSkge1xuICAgICAgLy8gaWYgYW55IGZpZWxkIG1pc3NpbmcsIHJldHVybiBudWxsXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5nZXRBbGxQb3NzaWJsZUNvbHVtblBhcmlzKHJlcXVpcmVkQ29sdW1ucyk7XG4gIH1cblxuICBzdGF0aWMgZ2V0QWxsUG9zc2libGVDb2x1bW5QYXJpcyhyZXF1aXJlZENvbHVtbnMpIHtcbiAgICAvLyBmb3IgbXVsdGlwbGUgbWF0Y2hlZCBmaWVsZCBmb3Igb25lIHJlcXVpcmVkIGNvbHVtbiwgcmV0dXJuIG11bHRpcGxlXG4gICAgLy8gY29tYmluYXRpb25zLCBlLiBnLiBpZiBjb2x1bW4gYSBoYXMgMiBtYXRjaGVkLCBjb2x1bW4gYiBoYXMgMyBtYXRjaGVkXG4gICAgLy8gNiBwb3NzaWJsZSBjb2x1bW4gcGFpcnMgd2lsbCBiZSByZXR1cm5lZFxuICAgIGNvbnN0IGFsbEtleXMgPSBPYmplY3Qua2V5cyhyZXF1aXJlZENvbHVtbnMpO1xuICAgIGNvbnN0IHBvaW50ZXJzID0gYWxsS2V5cy5tYXAoKGssIGkpID0+IChpID09PSBhbGxLZXlzLmxlbmd0aCAtIDEgPyAtMSA6IDApKTtcbiAgICBjb25zdCBjb3VudFBlcktleSA9IGFsbEtleXMubWFwKGsgPT4gcmVxdWlyZWRDb2x1bW5zW2tdLmxlbmd0aCk7XG4gICAgY29uc3QgcGFpcnMgPSBbXTtcblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xuICAgIHdoaWxlIChpbmNyZW1lbnRQb2ludGVycyhwb2ludGVycywgY291bnRQZXJLZXksIHBvaW50ZXJzLmxlbmd0aCAtIDEpKSB7XG4gICAgICBjb25zdCBuZXdQYWlyID0gcG9pbnRlcnMucmVkdWNlKChwcmV2LCBjdXVyLCBpKSA9PiB7XG4gICAgICAgIHByZXZbYWxsS2V5c1tpXV0gPSByZXF1aXJlZENvbHVtbnNbYWxsS2V5c1tpXV1bY3V1cl07XG4gICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgfSwge30pO1xuXG4gICAgICBwYWlycy5wdXNoKG5ld1BhaXIpO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWxvb3AtZnVuYyAqL1xuXG4gICAgLy8gcmVjdXJzaXZlbHkgaW5jcmVtZW50IHBvaW50ZXJzXG4gICAgZnVuY3Rpb24gaW5jcmVtZW50UG9pbnRlcnMocHRzLCBjb3VudHMsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IDAgJiYgcHRzWzBdID09PSBjb3VudHNbMF0gLSAxKSB7XG4gICAgICAgIC8vIG5vdGhpbmcgdG8gaW5jcmVtZW50XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHB0c1tpbmRleF0gKyAxIDwgY291bnRzW2luZGV4XSkge1xuICAgICAgICBwdHNbaW5kZXhdID0gcHRzW2luZGV4XSArIDE7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBwdHNbaW5kZXhdID0gMDtcbiAgICAgIHJldHVybiBpbmNyZW1lbnRQb2ludGVycyhwdHMsIGNvdW50cywgaW5kZXggLSAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFpcnM7XG4gIH1cblxuICBzdGF0aWMgaGV4VG9SZ2IoYykge1xuICAgIHJldHVybiBoZXhUb1JnYihjKTtcbiAgfVxuXG4gIGdldERlZmF1bHRMYXllckNvbmZpZyhwcm9wcyA9IHt9KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRhdGFJZDogcHJvcHMuZGF0YUlkIHx8IG51bGwsXG4gICAgICBsYWJlbDogcHJvcHMubGFiZWwgfHwgJ25ldyBsYXllcicsXG4gICAgICBjb2xvcjogcHJvcHMuY29sb3IgfHwgY29sb3JNYWtlci5uZXh0KCkudmFsdWUsXG4gICAgICBjb2x1bW5zOiBwcm9wcy5jb2x1bW5zIHx8IG51bGwsXG4gICAgICBpc1Zpc2libGU6IHByb3BzLmlzVmlzaWJsZSB8fCBmYWxzZSxcbiAgICAgIGlzQ29uZmlnQWN0aXZlOiBwcm9wcy5pc0NvbmZpZ0FjdGl2ZSB8fCBmYWxzZSxcbiAgICAgIGhpZ2hsaWdodENvbG9yOiBwcm9wcy5oaWdobGlnaHRDb2xvciB8fCBbMjUyLCAyNDIsIDI2LCAyNTVdLFxuXG4gICAgICAvLyBUT0RPOiByZWZhY3RvciB0aGlzIGludG8gc2VwYXJhdGUgdmlzdWFsIENoYW5uZWwgY29uZmlnXG4gICAgICAvLyBjb2xvciBieSBmaWVsZCwgZG9tYWluIGlzIHNldCBieSBmaWx0ZXJzLCBmaWVsZCwgc2NhbGUgdHlwZVxuICAgICAgY29sb3JGaWVsZDogbnVsbCxcbiAgICAgIGNvbG9yRG9tYWluOiBbMCwgMV0sXG4gICAgICBjb2xvclNjYWxlOiAncXVhbnRpbGUnLFxuXG4gICAgICAvLyBjb2xvciBieSBzaXplLCBkb21haW4gaXMgc2V0IGJ5IGZpbHRlcnMsIGZpZWxkLCBzY2FsZSB0eXBlXG4gICAgICBzaXplRG9tYWluOiBbMCwgMV0sXG4gICAgICBzaXplU2NhbGU6ICdsaW5lYXInLFxuICAgICAgc2l6ZUZpZWxkOiBudWxsLFxuXG4gICAgICB2aXNDb25maWc6IHt9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlc2NyaXB0aW9uIG9mIGEgdmlzdWFsQ2hhbm5lbCBjb25maWdcbiAgICogQHBhcmFtIGtleVxuICAgKiBAcmV0dXJucyB7e2xhYmVsOiBzdHJpbmcsIG1lYXN1cmU6IChzdHJpbmd8c3RyaW5nKX19XG4gICAqL1xuICBnZXRWaXN1YWxDaGFubmVsRGVzY3JpcHRpb24oa2V5KSB7XG4gICAgLy8gZS5nLiBsYWJlbDogQ29sb3IsIG1lYXN1cmU6IFZlaGljbGUgVHlwZVxuICAgIHJldHVybiB7XG4gICAgICBsYWJlbDogdGhpcy52aXNDb25maWdTZXR0aW5nc1t0aGlzLnZpc3VhbENoYW5uZWxzW2tleV0ucmFuZ2VdLmxhYmVsLFxuICAgICAgbWVhc3VyZTogdGhpcy5jb25maWdbdGhpcy52aXN1YWxDaGFubmVsc1trZXldLmZpZWxkXVxuICAgICAgICA/IHRoaXMuY29uZmlnW3RoaXMudmlzdWFsQ2hhbm5lbHNba2V5XS5maWVsZF0ubmFtZVxuICAgICAgICA6IHRoaXMudmlzdWFsQ2hhbm5lbHNba2V5XS5kZWZhdWx0TWVhc3VyZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCB0byBsYXllciBjb2x1bW4sIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBmaWVsZCAtIFNlbGVjdGVkIGZpZWxkXG4gICAqIEByZXR1cm5zIHt7fX0gLSBDb2x1bW4gY29uZmlnXG4gICAqL1xuICBhc3NpZ25Db2x1bW4oa2V5LCBmaWVsZCkge1xuICAgIC8vIGZpZWxkIHZhbHVlIGNvdWxkIGJlIG51bGwgZm9yIG9wdGlvbmFsIGNvbHVtbnNcbiAgICBjb25zdCB1cGRhdGUgPSBmaWVsZFxuICAgICAgPyB7XG4gICAgICAgICAgdmFsdWU6IGZpZWxkLm5hbWUsXG4gICAgICAgICAgZmllbGRJZHg6IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDFcbiAgICAgICAgfVxuICAgICAgOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMX07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4udGhpcy5jb25maWcuY29sdW1ucyxcbiAgICAgIFtrZXldOiB7XG4gICAgICAgIC4uLnRoaXMuY29uZmlnLmNvbHVtbnNba2V5XSxcbiAgICAgICAgLi4udXBkYXRlXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NpZ24gYSBmaWVsZCBwYWlyIHRvIGNvbHVtbiBjb25maWcsIHJldHVybiBjb2x1bW4gY29uZmlnXG4gICAqIEBwYXJhbSBrZXkgLSBDb2x1bW4gS2V5XG4gICAqIEBwYXJhbSBwYWlyIC0gZmllbGQgUGFpclxuICAgKiBAcmV0dXJucyB7e319IC0gQ29sdW1uIGNvbmZpZ1xuICAgKi9cbiAgYXNzaWduQ29sdW1uUGFpcnMoa2V5LCBwYWlyKSB7XG4gICAgaWYgKCF0aGlzLmNvbHVtblBhaXJzIHx8ICF0aGlzLmNvbHVtblBhaXJzW2tleV0pIHtcbiAgICAgIC8vIHNob3VsZCBub3QgZW5kIGluIHRoaXMgc3RhdGVcbiAgICAgIHJldHVybiB0aGlzLmNvbmZpZy5jb2x1bW5zO1xuICAgIH1cblxuICAgIGNvbnN0IHtwYWlyOiBwYXJ0bmVyS2V5LCBmaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlyc1trZXldO1xuICAgIGNvbnN0IHtmaWVsZFBhaXJLZXk6IHBhcnRuZXJGaWVsZFBhaXJLZXl9ID0gdGhpcy5jb2x1bW5QYWlyc1twYXJ0bmVyS2V5XTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLmNvbmZpZy5jb2x1bW5zLFxuICAgICAgW2tleV06IHBhaXJbZmllbGRQYWlyS2V5XSxcbiAgICAgIFtwYXJ0bmVyS2V5XTogcGFpcltwYXJ0bmVyRmllbGRQYWlyS2V5XVxuICAgIH07XG4gIH1cblxuXHQvKipcbiAgICogQ2FsY3VsYXRlIGEgcmFkaXVzIHpvb20gbXVsdGlwbGllciB0byByZW5kZXIgcG9pbnRzLCBzbyB0aGV5IGFyZSB2aXNpYmxlIGluIGFsbCB6b29tIGxldmVsXG4gICAqIEBwYXJhbSBtYXBTdGF0ZVxuICAgKiBAcGFyYW0gbWFwU3RhdGUuem9vbSAtIGFjdHVhbCB6b29tXG4gICAqIEBwYXJhbSBtYXBTdGF0ZS56b29tT2Zmc2V0IC0gem9vbU9mZnNldCB3aGVuIHJlbmRlciBpbiB0aGUgcGxvdCBjb250YWluZXIgZm9yIGV4cG9ydCBpbWFnZVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0Wm9vbUZhY3Rvcih7em9vbSwgem9vbU9mZnNldCA9IDB9KSB7XG4gICAgcmV0dXJuIE1hdGgucG93KDIsIE1hdGgubWF4KDE0IC0gem9vbSArIHpvb21PZmZzZXQsIDApKTtcbiAgfVxuXG5cdC8qKlxuICAgKiBDYWxjdWxhdGUgYSBlbGV2YXRpb24gem9vbSBtdWx0aXBsaWVyIHRvIHJlbmRlciBwb2ludHMsIHNvIHRoZXkgYXJlIHZpc2libGUgaW4gYWxsIHpvb20gbGV2ZWxcbiAgICogQHBhcmFtIG1hcFN0YXRlXG4gICAqIEBwYXJhbSBtYXBTdGF0ZS56b29tIC0gYWN0dWFsIHpvb21cbiAgICogQHBhcmFtIG1hcFN0YXRlLnpvb21PZmZzZXQgLSB6b29tT2Zmc2V0IHdoZW4gcmVuZGVyIGluIHRoZSBwbG90IGNvbnRhaW5lciBmb3IgZXhwb3J0IGltYWdlXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBnZXRFbGV2YXRpb25ab29tRmFjdG9yKHt6b29tLCB6b29tT2Zmc2V0ID0gMH0pIHtcbiAgICByZXR1cm4gTWF0aC5wb3coMiwgTWF0aC5tYXgoOCAtIHpvb20gKyB6b29tT2Zmc2V0LCAwKSk7XG4gIH1cblxuICBmb3JtYXRMYXllckRhdGEoZGF0YSwgYWxsRGF0YSwgZmlsdGVyZWRJbmRleCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJlbmRlckxheWVyKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGdldEhvdmVyRGF0YShvYmplY3QpIHtcbiAgICBpZiAoIW9iamVjdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8vIGJ5IGRlZmF1bHQsIGVhY2ggZW50cnkgb2YgbGF5ZXJEYXRhIHNob3VsZCBoYXZlIGEgZGF0YSBwcm9wZXJ0eSBwb2ludHNcbiAgICAvLyB0byB0aGUgb3JpZ2luYWwgaXRlbSBpbiB0aGUgYWxsRGF0YSBhcnJheVxuICAgIC8vIGVhY2ggbGF5ZXIgY2FuIGltcGxlbWVudCBpdHMgb3duIGdldEhvdmVyRGF0YSBtZXRob2RcbiAgICByZXR1cm4gb2JqZWN0LmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBjaGFuZ2UgbGF5ZXIgdHlwZSwgdHJ5IHRvIGNvcHkgb3ZlciBsYXllciBjb25maWdzIGFzIG11Y2ggYXMgcG9zc2libGVcbiAgICogQHBhcmFtIGNvbmZpZ1RvQ29weSAtIGNvbmZpZyB0byBjb3B5IG92ZXJcbiAgICogQHBhcmFtIHZpc0NvbmZpZ1NldHRpbmdzIC0gdmlzQ29uZmlnIHNldHRpbmdzIG9mIGNvbmZpZyB0byBjb3B5XG4gICAqL1xuICBhc3NpZ25Db25maWdUb0xheWVyKGNvbmZpZ1RvQ29weSwgdmlzQ29uZmlnU2V0dGluZ3MpIHtcbiAgICAvLyBkb24ndCBkZWVwIG1lcmdlIHZpc3VhbENoYW5uZWwgZmllbGRcbiAgICBjb25zdCBub3RUb0RlZXBNZXJnZSA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykubWFwKHYgPT4gdi5maWVsZCk7XG5cbiAgICAvLyBkb24ndCBkZWVwIG1lcmdlIGNvbG9yIHJhbmdlLCByZXZlcnNlZDogaXMgbm90IGEga2V5IGJ5IGRlZmF1bHRcbiAgICBub3RUb0RlZXBNZXJnZS5wdXNoKCdjb2xvclJhbmdlJyk7XG5cbiAgICAvLyBkb24ndCBjb3B5IG92ZXIgZG9tYWluXG4gICAgY29uc3Qgbm90VG9Db3B5ID0gT2JqZWN0LnZhbHVlcyh0aGlzLnZpc3VhbENoYW5uZWxzKS5tYXAodiA9PiB2LmRvbWFpbik7XG5cbiAgICAvLyBpZiByYW5nZSBpcyBmb3IgdGhlIHNhbWUgcHJvcGVydHkgZ3JvdXAgY29weSBpdCwgb3RoZXJ3aXNlLCBub3QgdG8gY29weVxuICAgIE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZm9yRWFjaCh2ID0+IHtcbiAgICAgIGlmIChjb25maWdUb0NvcHkudmlzQ29uZmlnW3YucmFuZ2VdICYmIHZpc0NvbmZpZ1NldHRpbmdzW3YucmFuZ2VdLmdyb3VwICE9PSB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW3YucmFuZ2VdLmdyb3VwKSB7XG4gICAgICAgIG5vdFRvQ29weS5wdXNoKHYucmFuZ2UpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gZG9uJ3QgY29weSBvdmVyIHZpc3VhbENoYW5uZWwgcmFuZ2VcbiAgICBjb25zdCBjdXJyZW50Q29uZmlnID0gdGhpcy5jb25maWc7XG4gICAgY29uc3QgY29waWVkID0gdGhpcy5jb3B5TGF5ZXJDb25maWcoY3VycmVudENvbmZpZywgY29uZmlnVG9Db3B5LCB7bm90VG9EZWVwTWVyZ2UsIG5vdFRvQ29weX0pO1xuXG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyhjb3BpZWQpO1xuICAgIC8vIHZhbGlkYXRlIHZpc3VhbENoYW5uZWwgZmllbGQgdHlwZSBhbmQgc2NhbGUgdHlwZXNcbiAgICBPYmplY3Qua2V5cyh0aGlzLnZpc3VhbENoYW5uZWxzKS5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgdGhpcy52YWxpZGF0ZVZpc3VhbENoYW5uZWwoY2hhbm5lbCk7XG4gICAgfSk7XG4gIH1cblxuICAvKlxuICAgKiBSZWN1cnNpdmVseSBjb3B5IGNvbmZpZyBvdmVyIHRvIGFuIGVtcHR5IGxheWVyXG4gICAqIHdoZW4gcmVjZWl2ZWQgc2F2ZWQgY29uZmlnLCBvciBjb3B5IGNvbmZpZyBvdmVyIGZyb20gYSBkaWZmZXJlbnQgbGF5ZXIgdHlwZVxuICAgKiBtYWtlIHN1cmUgdG8gb25seSBjb3B5IG92ZXIgdmFsdWUgdG8gZXhpc3Rpbmcga2V5c1xuICAgKiBAcGFyYW0ge29iamVjdH0gY3VycmVudENvbmZpZyAtIGV4aXN0aW5nIGNvbmZpZyB0byBiZSBvdmVycmlkZVxuICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnVG9Db3B5IC0gbmV3IENvbmZpZyB0byBjb3B5IG92ZXJcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gbm90VG9EZWVwTWVyZ2UgLSBhcnJheSBvZiBwcm9wZXJ0aWVzIHRvIG5vdCB0byBiZSBkZWVwIGNvcGllZFxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBub3RUb0NvcHkgLSBhcnJheSBvZiBwcm9wZXJ0aWVzIG5vdCB0byBjb3B5XG4gICAqIEByZXR1cm5zIHtvYmplY3R9IC0gY29waWVkIGNvbmZpZ1xuICAgKi9cbiAgY29weUxheWVyQ29uZmlnKGN1cnJlbnRDb25maWcsIGNvbmZpZ1RvQ29weSwge25vdFRvRGVlcE1lcmdlID0gW10sIG5vdFRvQ29weSA9IFtdfSA9IHt9KSB7XG4gICAgY29uc3QgY29waWVkID0ge307XG4gICAgT2JqZWN0LmtleXMoY3VycmVudENvbmZpZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKFxuICAgICAgICBpc1BsYWluT2JqZWN0KGN1cnJlbnRDb25maWdba2V5XSkgJiZcbiAgICAgICAgaXNQbGFpbk9iamVjdChjb25maWdUb0NvcHlba2V5XSkgJiZcbiAgICAgICAgIW5vdFRvRGVlcE1lcmdlLmluY2x1ZGVzKGtleSkgJiZcbiAgICAgICAgIW5vdFRvQ29weS5pbmNsdWRlcyhrZXkpXG4gICAgICApIHtcbiAgICAgICAgLy8gcmVjdXJzaXZlbHkgYXNzaWduIG9iamVjdCB2YWx1ZVxuICAgICAgICBjb3BpZWRba2V5XSA9IHRoaXMuY29weUxheWVyQ29uZmlnKGN1cnJlbnRDb25maWdba2V5XSwgY29uZmlnVG9Db3B5W2tleV0sIHtub3RUb0RlZXBNZXJnZSwgbm90VG9Db3B5fSk7XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBub3ROdWxsb3JVbmRlZmluZWQoY29uZmlnVG9Db3B5W2tleV0pICYmXG4gICAgICAgICFub3RUb0NvcHkuaW5jbHVkZXMoa2V5KVxuICAgICAgKSB7XG4gICAgICAgIC8vIGNvcHlcbiAgICAgICAgY29waWVkW2tleV0gPSBjb25maWdUb0NvcHlba2V5XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGtlZXAgZXhpc3RpbmdcbiAgICAgICAgY29waWVkW2tleV0gPSBjdXJyZW50Q29uZmlnW2tleV07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gY29waWVkO1xuICB9XG5cbiAgcmVnaXN0ZXJWaXNDb25maWcobGF5ZXJWaXNDb25maWdzKSB7XG4gICAgT2JqZWN0LmtleXMobGF5ZXJWaXNDb25maWdzKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgTEFZRVJfVklTX0NPTkZJR1NbbGF5ZXJWaXNDb25maWdzW2l0ZW1dXVxuICAgICAgKSB7XG4gICAgICAgIC8vIGlmIGFzc2lnbmVkIG9uZSBvZiBkZWZhdWx0IExBWUVSX0NPTkZJR1NcbiAgICAgICAgdGhpcy5jb25maWcudmlzQ29uZmlnW2l0ZW1dID1cbiAgICAgICAgICBMQVlFUl9WSVNfQ09ORklHU1tsYXllclZpc0NvbmZpZ3NbaXRlbV1dLmRlZmF1bHRWYWx1ZTtcbiAgICAgICAgdGhpcy52aXNDb25maWdTZXR0aW5nc1tpdGVtXSA9IExBWUVSX1ZJU19DT05GSUdTW2xheWVyVmlzQ29uZmlnc1tpdGVtXV07XG4gICAgICB9IGVsc2UgaWYgKFxuICAgICAgICBbJ3R5cGUnLCAnZGVmYXVsdFZhbHVlJ10uZXZlcnkocCA9PiBsYXllclZpc0NvbmZpZ3NbaXRlbV1bcF0pXG4gICAgICApIHtcbiAgICAgICAgLy8gaWYgcHJvdmlkZWQgY3VzdG9taXplZCB2aXNDb25maWcsIGFuZCBoYXMgdHlwZSAmJiBkZWZhdWx0VmFsdWVcbiAgICAgICAgLy8gVE9ETzogZnVydGhlciBjaGVjayBpZiBjdXN0b21pemVkIHZpc0NvbmZpZyBpcyB2YWxpZFxuICAgICAgICB0aGlzLmNvbmZpZy52aXNDb25maWdbaXRlbV0gPSBsYXllclZpc0NvbmZpZ3NbaXRlbV0uZGVmYXVsdFZhbHVlO1xuICAgICAgICB0aGlzLnZpc0NvbmZpZ1NldHRpbmdzW2l0ZW1dID0gbGF5ZXJWaXNDb25maWdzW2l0ZW1dO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TGF5ZXJDb2x1bW5zKCkge1xuICAgIGNvbnN0IHJlcXVpcmVkID0gdGhpcy5yZXF1aXJlZExheWVyQ29sdW1ucy5yZWR1Y2UoXG4gICAgICAoYWNjdSwga2V5KSA9PiAoe1xuICAgICAgICAuLi5hY2N1LFxuICAgICAgICBba2V5XToge3ZhbHVlOiBudWxsLCBmaWVsZElkeDogLTF9XG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcbiAgICBjb25zdCBvcHRpb25hbCA9IHRoaXMub3B0aW9uYWxDb2x1bW5zLnJlZHVjZShcbiAgICAgIChhY2N1LCBrZXkpID0+ICh7XG4gICAgICAgIC4uLmFjY3UsXG4gICAgICAgIFtrZXldOiB7dmFsdWU6IG51bGwsIGZpZWxkSWR4OiAtMSwgb3B0aW9uYWw6IHRydWV9XG4gICAgICB9KSxcbiAgICAgIHt9XG4gICAgKTtcblxuICAgIHJldHVybiB7Li4ucmVxdWlyZWQsIC4uLm9wdGlvbmFsfTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZykge1xuICAgIHRoaXMuY29uZmlnID0gey4uLnRoaXMuY29uZmlnLCAuLi5uZXdDb25maWd9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXBkYXRlTGF5ZXJWaXNDb25maWcobmV3VmlzQ29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcudmlzQ29uZmlnID0gey4uLnRoaXMuY29uZmlnLnZpc0NvbmZpZywgLi4ubmV3VmlzQ29uZmlnfTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBsYXllciBoYXMgYWxsIGNvbHVtbnNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGxheWVyXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB5ZXMgb3Igbm9cbiAgICovXG4gIGhhc0FsbENvbHVtbnMoKSB7XG4gICAgY29uc3Qge2NvbHVtbnN9ID0gdGhpcy5jb25maWc7XG4gICAgcmV0dXJuIChcbiAgICAgIGNvbHVtbnMgJiZcbiAgICAgIE9iamVjdC52YWx1ZXMoY29sdW1ucykuZXZlcnkodiA9PiB7XG4gICAgICAgIHJldHVybiBCb29sZWFuKHYub3B0aW9uYWwgfHwgKHYudmFsdWUgJiYgdi5maWVsZElkeCA+IC0xKSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBsYXllciBoYXMgZGF0YVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbGF5ZXJcbiAgICogQHBhcmFtIHtBcnJheSB8IE9iamVjdH0gbGF5ZXJEYXRhXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB5ZXMgb3Igbm9cbiAgICovXG4gIGhhc0xheWVyRGF0YShsYXllckRhdGEpIHtcbiAgICBpZiAoIWxheWVyRGF0YSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBCb29sZWFuKGxheWVyRGF0YS5kYXRhICYmIGxheWVyRGF0YS5kYXRhLmxlbmd0aCk7XG4gIH1cblxuICBpc1ZhbGlkVG9TYXZlKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgJiYgdGhpcy5oYXNBbGxDb2x1bW5zKCk7XG4gIH1cblxuICBzaG91bGRSZW5kZXJMYXllcihkYXRhKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMudHlwZSAmJlxuICAgICAgdGhpcy5oYXNBbGxDb2x1bW5zKCkgJiZcbiAgICAgIHRoaXMuY29uZmlnLmlzVmlzaWJsZSAmJlxuICAgICAgdGhpcy5oYXNMYXllckRhdGEoZGF0YSlcbiAgICApO1xuICB9XG5cbiAgZ2V0VmlzQ2hhbm5lbFNjYWxlKHNjYWxlLCBkb21haW4sIHJhbmdlLCBmaXhlZCkge1xuICAgIHJldHVybiBTQ0FMRV9GVU5DW2ZpeGVkID8gJ2xpbmVhcicgOiBzY2FsZV0oKVxuICAgICAgLmRvbWFpbihkb21haW4pXG4gICAgICAucmFuZ2UoZml4ZWQgPyBkb21haW4gOiByYW5nZSk7XG4gIH1cblxuICBnZXRQb2ludHNCb3VuZHMoYWxsRGF0YSwgZ2V0UG9zaXRpb24pIHtcbiAgICAvLyBubyBuZWVkIHRvIGxvb3AgdGhyb3VnaCB0aGUgZW50aXJlIGRhdGFzZXRcbiAgICAvLyBnZXQgYSBzYW1wbGUgb2YgZGF0YSB0byBjYWxjdWxhdGUgYm91bmRzXG4gICAgY29uc3Qgc2FtcGxlRGF0YSA9XG4gICAgICBhbGxEYXRhLmxlbmd0aCA+IE1BWF9TQU1QTEVfU0laRVxuICAgICAgICA/IGdldFNhbXBsZURhdGEoYWxsRGF0YSwgTUFYX1NBTVBMRV9TSVpFKVxuICAgICAgICA6IGFsbERhdGE7XG4gICAgY29uc3QgcG9pbnRzID0gc2FtcGxlRGF0YS5tYXAoZ2V0UG9zaXRpb24pO1xuXG4gICAgY29uc3QgbGF0Qm91bmRzID0gZ2V0TGF0TG5nQm91bmRzKHBvaW50cywgMSwgWy05MCwgOTBdKTtcbiAgICBjb25zdCBsbmdCb3VuZHMgPSBnZXRMYXRMbmdCb3VuZHMocG9pbnRzLCAwLCBbLTE4MCwgMTgwXSk7XG5cbiAgICBpZiAoIWxhdEJvdW5kcyB8fCAhbG5nQm91bmRzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gW2xuZ0JvdW5kc1swXSwgbGF0Qm91bmRzWzBdLCBsbmdCb3VuZHNbMV0sIGxhdEJvdW5kc1sxXV07XG4gIH1cblxuICBnZXRMaWdodFNldHRpbmdzRnJvbUJvdW5kcyhib3VuZHMpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShib3VuZHMpICYmIGJvdW5kcy5sZW5ndGggPj0gNFxuICAgICAgPyB7XG4gICAgICAgICAgLi4uREVGQVVMVF9MSUdIVF9TRVRUSU5HUyxcbiAgICAgICAgICBsaWdodHNQb3NpdGlvbjogW1xuICAgICAgICAgICAgLi4uYm91bmRzLnNsaWNlKDAsIDIpLFxuICAgICAgICAgICAgREVGQVVMVF9MSUdIVF9TRVRUSU5HUy5saWdodHNQb3NpdGlvblsyXSxcbiAgICAgICAgICAgIC4uLmJvdW5kcy5zbGljZSgyLCA0KSxcbiAgICAgICAgICAgIERFRkFVTFRfTElHSFRfU0VUVElOR1MubGlnaHRzUG9zaXRpb25bNV1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIDogREVGQVVMVF9MSUdIVF9TRVRUSU5HUztcbiAgfVxuXG4gIGdldEVuY29kZWRDaGFubmVsVmFsdWUoXG4gICAgc2NhbGUsXG4gICAgZGF0YSxcbiAgICBmaWVsZCxcbiAgICBkZWZhdWx0VmFsdWUgPSBOT19WQUxVRV9DT0xPUixcbiAgICBnZXRWYWx1ZSA9IGRlZmF1bHRHZXRGaWVsZFZhbHVlXG4gICkge1xuICAgIGNvbnN0IHt0eXBlfSA9IGZpZWxkO1xuICAgIGNvbnN0IHZhbHVlID0gZ2V0VmFsdWUoZmllbGQsIGRhdGEpO1xuICAgIGxldCBhdHRyaWJ1dGVWYWx1ZTtcbiAgICBpZiAodHlwZSA9PT0gQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcCkge1xuICAgICAgLy8gc2hvdWxkbid0IG5lZWQgdG8gY29udmVydCBoZXJlXG4gICAgICAvLyBzY2FsZSBGdW5jdGlvbiBzaG91bGQgdGFrZSBjYXJlIG9mIGl0XG4gICAgICBhdHRyaWJ1dGVWYWx1ZSA9IHNjYWxlKG5ldyBEYXRlKHZhbHVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gc2NhbGUodmFsdWUpO1xuICAgIH1cblxuICAgIGlmICghYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgIGF0dHJpYnV0ZVZhbHVlID0gZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBhdHRyaWJ1dGVWYWx1ZTtcbiAgfVxuXG4gIHVwZGF0ZU1ldGEobWV0YSkge1xuICAgIHRoaXMubWV0YSA9IHsuLi50aGlzLm1ldGEsIC4uLm1ldGF9O1xuICB9XG5cbiAgLyoqXG4gICAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgb25lIGxheWVyIGRvbWFpbiB3aGVuIHN0YXRlLmRhdGEgY2hhbmdlZFxuICAgKiBpZiBzdGF0ZS5kYXRhIGNoYW5nZSBpcyBkdWUgb3QgdXBkYXRlIGZpbHRlciwgbmV3RmlsZXIgd2lsbCBiZSBwYXNzZWRcbiAgICogY2FsbGVkIGJ5IHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YVxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YXNldFxuICAgKiBAcGFyYW0ge09iamVjdH0gbmV3RmlsdGVyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGxheWVyXG4gICAqL1xuICB1cGRhdGVMYXllckRvbWFpbihkYXRhc2V0LCBuZXdGaWx0ZXIpIHtcbiAgICBPYmplY3QudmFsdWVzKHRoaXMudmlzdWFsQ2hhbm5lbHMpLmZvckVhY2goY2hhbm5lbCA9PiB7XG4gICAgICBjb25zdCB7c2NhbGV9ID0gY2hhbm5lbDtcbiAgICAgIGNvbnN0IHNjYWxlVHlwZSA9IHRoaXMuY29uZmlnW3NjYWxlXTtcbiAgICAgIC8vIG9yZGluYWwgZG9tYWluIGlzIGJhc2VkIG9uIGFsbERhdGEsIGlmIG9ubHkgZmlsdGVyIGNoYW5nZWRcbiAgICAgIC8vIG5vIG5lZWQgdG8gdXBkYXRlIG9yZGluYWwgZG9tYWluXG4gICAgICBpZiAoIW5ld0ZpbHRlciB8fCBzY2FsZVR5cGUgIT09IFNDQUxFX1RZUEVTLm9yZGluYWwpIHtcbiAgICAgICAgY29uc3Qge2RvbWFpbn0gPSBjaGFubmVsO1xuICAgICAgICBjb25zdCB1cGRhdGVkRG9tYWluID0gdGhpcy5jYWxjdWxhdGVMYXllckRvbWFpbihkYXRhc2V0LCBjaGFubmVsKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZG9tYWluXTogdXBkYXRlZERvbWFpbn0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgdmlzdWFsIGNoYW5uZWwgZmllbGQgYW5kIHNjYWxlcyBiYXNlZCBvbiBzdXBwb3J0ZWQgZmllbGQgJiBzY2FsZSB0eXBlXG4gICAqIEBwYXJhbSBjaGFubmVsXG4gICAqL1xuICB2YWxpZGF0ZVZpc3VhbENoYW5uZWwoY2hhbm5lbCkge1xuICAgIHRoaXMudmFsaWRhdGVGaWVsZFR5cGUoY2hhbm5lbCk7XG4gICAgdGhpcy52YWxpZGF0ZVNjYWxlKGNoYW5uZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGZpZWxkIHR5cGUgYmFzZWQgb24gY2hhbm5lbFNjYWxlVHlwZVxuICAgKi9cbiAgdmFsaWRhdGVGaWVsZFR5cGUoY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHtmaWVsZCwgY2hhbm5lbFNjYWxlVHlwZSwgc3VwcG9ydGVkRmllbGRUeXBlc30gPSB2aXN1YWxDaGFubmVsO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnW2ZpZWxkXSkge1xuICAgICAgLy8gaWYgZmllbGQgaXMgc2VsZWN0ZWQsIGNoZWNrIGlmIGZpZWxkIHR5cGUgaXMgc3VwcG9ydGVkXG4gICAgICBjb25zdCBjaGFubmVsU3VwcG9ydGVkRmllbGRUeXBlcyA9IHN1cHBvcnRlZEZpZWxkVHlwZXMgfHwgQ0hBTk5FTF9TQ0FMRV9TVVBQT1JURURfRklFTERTW2NoYW5uZWxTY2FsZVR5cGVdO1xuXG4gICAgICBpZiAoIWNoYW5uZWxTdXBwb3J0ZWRGaWVsZFR5cGVzLmluY2x1ZGVzKHRoaXMuY29uZmlnW2ZpZWxkXS50eXBlKSkge1xuICAgICAgICAvLyBmaWVsZCB0eXBlIGlzIG5vdCBzdXBwb3J0ZWQsIHNldCBpdCBiYWNrIHRvIG51bGxcbiAgICAgICAgLy8gc2V0IHNjYWxlIGJhY2sgdG8gZGVmYXVsdFxuICAgICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbZmllbGRdOiBudWxsfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHNjYWxlIHR5cGUgYmFzZWQgb24gYWdncmVnYXRpb25cbiAgICovXG4gIHZhbGlkYXRlU2NhbGUoY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHtzY2FsZX0gPSB2aXN1YWxDaGFubmVsO1xuICAgIGlmICghc2NhbGUpIHtcbiAgICAgIC8vIHZpc3VhbENoYW5uZWwgZG9lc24ndCBoYXZlIHNjYWxlXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHNjYWxlT3B0aW9ucyA9IHRoaXMuZ2V0U2NhbGVPcHRpb25zKGNoYW5uZWwpO1xuICAgIC8vIGNoZWNrIGlmIGN1cnJlbnQgc2VsZWN0ZWQgc2NhbGUgaXNcbiAgICAvLyBzdXBwb3J0ZWQsIGlmIG5vdCwgY2hhbmdlIHRvIGRlZmF1bHRcbiAgICBpZiAoIXNjYWxlT3B0aW9ucy5pbmNsdWRlcyh0aGlzLmNvbmZpZ1tzY2FsZV0pKSB7XG4gICAgICB0aGlzLnVwZGF0ZUxheWVyQ29uZmlnKHtbc2NhbGVdOiBzY2FsZU9wdGlvbnNbMF19KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHNjYWxlIG9wdGlvbnMgYmFzZWQgb24gY3VycmVudCBmaWVsZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hhbm5lbFxuICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAqL1xuICBnZXRTY2FsZU9wdGlvbnMoY2hhbm5lbCkge1xuICAgIGNvbnN0IHZpc3VhbENoYW5uZWwgPSB0aGlzLnZpc3VhbENoYW5uZWxzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHtmaWVsZCwgc2NhbGUsIGNoYW5uZWxTY2FsZVR5cGV9ID0gdmlzdWFsQ2hhbm5lbDtcblxuICAgIHJldHVybiB0aGlzLmNvbmZpZ1tmaWVsZF0gP1xuICAgICAgRklFTERfT1BUU1t0aGlzLmNvbmZpZ1tmaWVsZF0udHlwZV0uc2NhbGVbY2hhbm5lbFNjYWxlVHlwZV0gOlxuICAgICAgW3RoaXMuZ2V0RGVmYXVsdExheWVyQ29uZmlnKClbc2NhbGVdXTtcbiAgfVxuXG4gIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbChkYXRhc2V0LCBjaGFubmVsKSB7XG4gICAgY29uc3QgdmlzdWFsQ2hhbm5lbCA9IHRoaXMudmlzdWFsQ2hhbm5lbHNbY2hhbm5lbF07XG5cbiAgICB0aGlzLnZhbGlkYXRlVmlzdWFsQ2hhbm5lbChjaGFubmVsKTtcbiAgICAgIC8vIGNhbGN1bGF0ZSBsYXllciBjaGFubmVsIGRvbWFpblxuICAgIGNvbnN0IHVwZGF0ZWREb21haW4gPSB0aGlzLmNhbGN1bGF0ZUxheWVyRG9tYWluKGRhdGFzZXQsIHZpc3VhbENoYW5uZWwpO1xuXG4gICAgdGhpcy51cGRhdGVMYXllckNvbmZpZyh7W3Zpc3VhbENoYW5uZWwuZG9tYWluXTogdXBkYXRlZERvbWFpbn0pO1xuICB9XG5cbiAgY2FsY3VsYXRlTGF5ZXJEb21haW4oZGF0YXNldCwgdmlzdWFsQ2hhbm5lbCkge1xuICAgIGNvbnN0IHthbGxEYXRhLCBmaWx0ZXJlZEluZGV4Rm9yRG9tYWlufSA9IGRhdGFzZXQ7XG4gICAgY29uc3QgZGVmYXVsdERvbWFpbiA9IFswLCAxXTtcbiAgICBjb25zdCB7c2NhbGV9ID0gdmlzdWFsQ2hhbm5lbDtcbiAgICBjb25zdCBzY2FsZVR5cGUgPSB0aGlzLmNvbmZpZ1tzY2FsZV07XG5cbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuY29uZmlnW3Zpc3VhbENoYW5uZWwuZmllbGRdO1xuICAgIGlmICghZmllbGQpIHtcbiAgICAgIC8vIGlmIGNvbG9yRmllbGQgb3Igc2l6ZUZpZWxkIHdlcmUgc2V0IGJhY2sgdG8gbnVsbFxuICAgICAgcmV0dXJuIGRlZmF1bHREb21haW47XG4gICAgfVxuXG4gICAgaWYgKCFTQ0FMRV9UWVBFU1tzY2FsZVR5cGVdKSB7XG4gICAgICBDb25zb2xlLmVycm9yKGBzY2FsZSB0eXBlICR7c2NhbGVUeXBlfSBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICByZXR1cm4gZGVmYXVsdERvbWFpbjtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiByZWZhY3RvciB0byBhZGQgdmFsdWVBY2Nlc3NvciB0byBmaWVsZFxuICAgIGNvbnN0IGZpZWxkSWR4ID0gZmllbGQudGFibGVGaWVsZEluZGV4IC0gMTtcbiAgICBjb25zdCBpc1RpbWUgPSBmaWVsZC50eXBlID09PSBBTExfRklFTERfVFlQRVMudGltZXN0YW1wO1xuICAgIGNvbnN0IHZhbHVlQWNjZXNzb3IgPSBtYXliZVRvRGF0ZS5iaW5kKFxuICAgICAgbnVsbCxcbiAgICAgIGlzVGltZSxcbiAgICAgIGZpZWxkSWR4LFxuICAgICAgZmllbGQuZm9ybWF0XG4gICAgKTtcbiAgICBjb25zdCBpbmRleFZhbHVlQWNjZXNzb3IgPSBpID0+IHZhbHVlQWNjZXNzb3IoYWxsRGF0YVtpXSk7XG5cbiAgICBjb25zdCBzb3J0RnVuY3Rpb24gPSBnZXRTb3J0aW5nRnVuY3Rpb24oZmllbGQudHlwZSk7XG5cbiAgICBzd2l0Y2ggKHNjYWxlVHlwZSkge1xuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5vcmRpbmFsOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5wb2ludDpcbiAgICAgICAgLy8gZG8gbm90IHJlY2FsY3VsYXRlIG9yZGluYWwgZG9tYWluIGJhc2VkIG9uIGZpbHRlcmVkIGRhdGFcbiAgICAgICAgLy8gZG9uJ3QgbmVlZCB0byB1cGRhdGUgb3JkaW5hbCBkb21haW4gZXZlcnkgdGltZVxuICAgICAgICByZXR1cm4gZ2V0T3JkaW5hbERvbWFpbihhbGxEYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5xdWFudGlsZTpcbiAgICAgICAgcmV0dXJuIGdldFF1YW50aWxlRG9tYWluKGZpbHRlcmVkSW5kZXhGb3JEb21haW4sIGluZGV4VmFsdWVBY2Nlc3Nvciwgc29ydEZ1bmN0aW9uKTtcblxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5xdWFudGl6ZTpcbiAgICAgIGNhc2UgU0NBTEVfVFlQRVMubGluZWFyOlxuICAgICAgY2FzZSBTQ0FMRV9UWVBFUy5zcXJ0OlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGdldExpbmVhckRvbWFpbihmaWx0ZXJlZEluZGV4Rm9yRG9tYWluLCBpbmRleFZhbHVlQWNjZXNzb3IpO1xuICAgIH1cbiAgfVxuXG4gIGlzTGF5ZXJIb3ZlcmVkKG9iamVjdEluZm8pIHtcbiAgICByZXR1cm4gKFxuICAgICAgb2JqZWN0SW5mbyAmJlxuICAgICAgb2JqZWN0SW5mby5sYXllciAmJlxuICAgICAgb2JqZWN0SW5mby5waWNrZWQgJiZcbiAgICAgIG9iamVjdEluZm8ubGF5ZXIucHJvcHMuaWQgPT09IHRoaXMuaWRcbiAgICApO1xuICB9XG5cbiAgZ2V0UmFkaXVzU2NhbGVCeVpvb20obWFwU3RhdGUsIGZpeGVkUmFkaXVzKSB7XG4gICAgY29uc3QgcmFkaXVzQ2hhbm5lbCA9IE9iamVjdC52YWx1ZXModGhpcy52aXN1YWxDaGFubmVscykuZmluZChcbiAgICAgIHZjID0+IHZjLnByb3BlcnR5ID09PSAncmFkaXVzJ1xuICAgICk7XG5cbiAgICBpZiAoIXJhZGl1c0NoYW5uZWwpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cblxuICAgIGNvbnN0IGZpZWxkID0gcmFkaXVzQ2hhbm5lbC5maWVsZDtcbiAgICBjb25zdCBmaXhlZCA9XG4gICAgICBmaXhlZFJhZGl1cyA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gdGhpcy5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzXG4gICAgICAgIDogZml4ZWRSYWRpdXM7XG4gICAgY29uc3Qge3JhZGl1c30gPSB0aGlzLmNvbmZpZy52aXNDb25maWc7XG5cbiAgICByZXR1cm4gZml4ZWRcbiAgICAgID8gMVxuICAgICAgOiAodGhpcy5jb25maWdbZmllbGRdID8gMSA6IHJhZGl1cykgKiB0aGlzLmdldFpvb21GYWN0b3IobWFwU3RhdGUpO1xuICB9XG5cbiAgc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSB7XG4gICAgcmV0dXJuIHByb3BzLnNvbWUocCA9PiAhdGhpcy5ub25lTGF5ZXJEYXRhQWZmZWN0aW5nUHJvcHMuaW5jbHVkZXMocCkpO1xuICB9XG59XG4iXX0=