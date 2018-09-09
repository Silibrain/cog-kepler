'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggregationTypeSelector = exports.AggrColorScaleSelector = exports.ChannelByValueSelector = exports.ColorRangeConfig = exports.ArcLayerColorSelector = exports.LayerColorSelector = exports.HowToButton = exports.default = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _class, _temp;

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n  position: relative;\n  margin-top: 12px;\n'], ['\n  position: relative;\n  margin-top: 12px;\n']),
    _templateObject2 = (0, _taggedTemplateLiteral3.default)(['\n  margin-top: 12px;\n'], ['\n  margin-top: 12px;\n']),
    _templateObject3 = (0, _taggedTemplateLiteral3.default)(['\n  position: absolute;\n  right: 0;\n  top: 0;\n'], ['\n  position: absolute;\n  right: 0;\n  top: 0;\n']); // Copyright (c) 2018 Uber Technologies, Inc.
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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

var _styledComponents3 = require('../../common/styled-components');

var _itemSelector = require('../../common/item-selector/item-selector');

var _itemSelector2 = _interopRequireDefault(_itemSelector);

var _visConfigByFieldSelector = require('./vis-config-by-field-selector');

var _visConfigByFieldSelector2 = _interopRequireDefault(_visConfigByFieldSelector);

var _layerColumnConfig = require('./layer-column-config');

var _layerColumnConfig2 = _interopRequireDefault(_layerColumnConfig);

var _layerTypeSelector = require('./layer-type-selector');

var _layerTypeSelector2 = _interopRequireDefault(_layerTypeSelector);

var _dimensionScaleSelector = require('./dimension-scale-selector');

var _dimensionScaleSelector2 = _interopRequireDefault(_dimensionScaleSelector);

var _colorSelector = require('./color-selector');

var _colorSelector2 = _interopRequireDefault(_colorSelector);

var _sourceDataSelector = require('../source-data-selector');

var _sourceDataSelector2 = _interopRequireDefault(_sourceDataSelector);

var _visConfigSwitch = require('./vis-config-switch');

var _visConfigSwitch2 = _interopRequireDefault(_visConfigSwitch);

var _visConfigSlider = require('./vis-config-slider');

var _visConfigSlider2 = _interopRequireDefault(_visConfigSlider);

var _layerConfigGroup = require('./layer-config-group');

var _layerConfigGroup2 = _interopRequireDefault(_layerConfigGroup);

var _textLabelPanel = require('./text-label-panel');

var _textLabelPanel2 = _interopRequireDefault(_textLabelPanel);

var _layerFactory = require('../../../layers/layer-factory');

var _utils = require('../../../utils/utils');

var _defaultSettings = require('../../../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StyledLayerConfigurator = _styledComponents2.default.div.attrs({
  className: 'layer-panel__config'
})(_templateObject);

var StyledLayerVisualConfigurator = _styledComponents2.default.div.attrs({
  className: 'layer-panel__config__visualC-config'
})(_templateObject2);

var LayerConfigurator = (_temp = _class = function (_Component) {
  (0, _inherits3.default)(LayerConfigurator, _Component);

  function LayerConfigurator() {
    (0, _classCallCheck3.default)(this, LayerConfigurator);
    return (0, _possibleConstructorReturn3.default)(this, (LayerConfigurator.__proto__ || Object.getPrototypeOf(LayerConfigurator)).apply(this, arguments));
  }

  (0, _createClass3.default)(LayerConfigurator, [{
    key: '_renderPointLayerConfig',
    value: function _renderPointLayerConfig(props) {
      return this._renderScatterplotLayerConfig(props);
    }
  }, {
    key: '_renderIconLayerConfig',
    value: function _renderIconLayerConfig(props) {
      return this._renderScatterplotLayerConfig(props);
    }
  }, {
    key: '_renderScatterplotLayerConfig',
    value: function _renderScatterplotLayerConfig(_ref) {
      var layer = _ref.layer,
          visConfiguratorProps = _ref.visConfiguratorProps,
          layerChannelConfigProps = _ref.layerChannelConfigProps,
          layerConfiguratorProps = _ref.layerConfiguratorProps;

      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.color
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'radius' },
          !layer.config.sizeField ? _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
            label: false,
            disabled: Boolean(layer.config.sizeField)
          })) : _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
            disabled: !layer.config.sizeField || layer.config.visConfig.fixedRadius
          })),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.size
          }, layerChannelConfigProps)),
          layer.config.sizeField ? _react2.default.createElement(_visConfigSwitch2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.fixedRadius, visConfiguratorProps, {
            disabled: !layer.config.sizeField
          })) : null
        ),
        layer.type === _defaultSettings.LAYER_TYPES.point ? _react2.default.createElement(
          _layerConfigGroup2.default,
          (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.outline, visConfiguratorProps),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps, {
            label: false,
            disabled: !layer.config.visConfig.outline
          }))
        ) : null,
        _react2.default.createElement(_textLabelPanel2.default, {
          visConfiguratorProps: visConfiguratorProps,
          layerConfiguratorProps: layerConfiguratorProps,
          textLabel: layer.config.textLabel
        }),
        _react2.default.createElement(_layerConfigGroup2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
      );
    }
  }, {
    key: '_renderClusterLayerConfig',
    value: function _renderClusterLayerConfig(_ref2) {
      var layer = _ref2.layer,
          visConfiguratorProps = _ref2.visConfiguratorProps,
          layerConfiguratorProps = _ref2.layerConfiguratorProps,
          layerChannelConfigProps = _ref2.layerChannelConfigProps;

      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
          _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.color
          }, layerChannelConfigProps)),
          layer.visConfigSettings.colorAggregation.condition(layer.config) ? _react2.default.createElement(AggregationTypeSelector, (0, _extends4.default)({}, layer.visConfigSettings.colorAggregation, layerChannelConfigProps, {
            channel: layer.visualChannels.color
          })) : null,
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.opacity, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'radius' },
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.clusterRadius, visConfiguratorProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.radiusRange, visConfiguratorProps))
        )
      );
    }
  }, {
    key: '_renderHeatmapLayerConfig',
    value: function _renderHeatmapLayerConfig(_ref3) {
      var layer = _ref3.layer,
          visConfiguratorProps = _ref3.visConfiguratorProps,
          layerConfiguratorProps = _ref3.layerConfiguratorProps,
          layerChannelConfigProps = _ref3.layerChannelConfigProps;

      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.opacity, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'radius' },
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.radius, visConfiguratorProps, {
            label: false
          }))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'weight' },
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.weight
          }, layerChannelConfigProps))
        )
      );
    }
  }, {
    key: '_renderGridLayerConfig',
    value: function _renderGridLayerConfig(props) {
      return this._renderAggregationLayerConfig(props);
    }
  }, {
    key: '_renderHexagonLayerConfig',
    value: function _renderHexagonLayerConfig(props) {
      return this._renderAggregationLayerConfig(props);
    }
  }, {
    key: '_renderAggregationLayerConfig',
    value: function _renderAggregationLayerConfig(_ref4) {
      var layer = _ref4.layer,
          visConfiguratorProps = _ref4.visConfiguratorProps,
          layerConfiguratorProps = _ref4.layerConfiguratorProps,
          layerChannelConfigProps = _ref4.layerChannelConfigProps;
      var config = layer.config;
      var enable3d = config.visConfig.enable3d;

      var elevationByDescription = 'When off, height is based on count of points';
      var colorByDescription = 'When off, color is based on count of points';

      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          _react2.default.createElement(ColorRangeConfig, visConfiguratorProps),
          _react2.default.createElement(AggrColorScaleSelector, layerConfiguratorProps),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.color
          }, layerChannelConfigProps)),
          layer.visConfigSettings.colorAggregation.condition(layer.config) ? _react2.default.createElement(AggregationTypeSelector, (0, _extends4.default)({}, layer.visConfigSettings.colorAggregation, layerChannelConfigProps, {
            descreiption: colorByDescription,
            channel: layer.visualChannels.color
          })) : null,
          layer.visConfigSettings.percentile && layer.visConfigSettings.percentile.condition(layer.config) ? _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.percentile, visConfiguratorProps)) : null,
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.opacity, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'radius' },
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.worldUnitSize, visConfiguratorProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.coverage, visConfiguratorProps))
        ),
        layer.visConfigSettings.enable3d ? _react2.default.createElement(
          _layerConfigGroup2.default,
          (0, _extends4.default)({}, layer.visConfigSettings.enable3d, visConfiguratorProps),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.elevationScale, visConfiguratorProps)),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({}, layerChannelConfigProps, {
            channel: layer.visualChannels.size,
            description: elevationByDescription,
            disabled: !enable3d
          })),
          layer.visConfigSettings.sizeAggregation.condition(layer.config) ? _react2.default.createElement(AggregationTypeSelector, (0, _extends4.default)({}, layer.visConfigSettings.sizeAggregation, layerChannelConfigProps, {
            channel: layer.visualChannels.size
          })) : null,
          layer.visConfigSettings.elevationPercentile.condition(layer.config) ? _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.elevationPercentile, visConfiguratorProps)) : null
        ) : null,
        _react2.default.createElement(_layerConfigGroup2.default, (0, _extends4.default)({}, layer.visConfigSettings['hi-precision'], visConfiguratorProps))
      );
    }

    // TODO: Shan move these into layer class

  }, {
    key: '_renderHexagonIdLayerConfig',
    value: function _renderHexagonIdLayerConfig(_ref5) {
      var layer = _ref5.layer,
          visConfiguratorProps = _ref5.visConfiguratorProps,
          layerConfiguratorProps = _ref5.layerConfiguratorProps,
          layerChannelConfigProps = _ref5.layerChannelConfigProps;

      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.color
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'radius' },
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, layer.visConfigSettings.coverage, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.enable3d, visConfiguratorProps),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.size
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationRange, visConfiguratorProps))
        ),
        _react2.default.createElement(_layerConfigGroup2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
      );
    }
  }, {
    key: '_renderArcLayerConfig',
    value: function _renderArcLayerConfig(args) {
      return this._renderLineLayerConfig(args);
    }
  }, {
    key: '_renderLineLayerConfig',
    value: function _renderLineLayerConfig(_ref6) {
      var layer = _ref6.layer,
          visConfiguratorProps = _ref6.visConfiguratorProps,
          layerConfiguratorProps = _ref6.layerConfiguratorProps,
          layerChannelConfigProps = _ref6.layerChannelConfigProps;

      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(ArcLayerColorSelector, {
            layer: layer,
            onChangeConfig: layerConfiguratorProps.onChange,
            onChangeVisConfig: visConfiguratorProps.onChange
          }),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.color
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
        ),
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'stroke' },
          layer.config.sizeField ? _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.strokeWidthRange, visConfiguratorProps, {
            disabled: !layer.config.sizeField
          })) : _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps)),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.size
          }, layerChannelConfigProps))
        ),
        _react2.default.createElement(_layerConfigGroup2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
      );
    }
  }, {
    key: '_renderGeojsonLayerConfig',
    value: function _renderGeojsonLayerConfig(_ref7) {
      var layer = _ref7.layer,
          visConfiguratorProps = _ref7.visConfiguratorProps,
          layerConfiguratorProps = _ref7.layerConfiguratorProps,
          layerChannelConfigProps = _ref7.layerChannelConfigProps;
      var _layer$meta$featureTy = layer.meta.featureTypes,
          featureTypes = _layer$meta$featureTy === undefined ? {} : _layer$meta$featureTy,
          visConfig = layer.config.visConfig;


      return _react2.default.createElement(
        StyledLayerVisualConfigurator,
        null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'color' },
          featureTypes.polygon ? _react2.default.createElement(_visConfigSwitch2.default, (0, _extends4.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.filled)) : null,
          layer.config.colorField ? _react2.default.createElement(ColorRangeConfig, visConfiguratorProps) : _react2.default.createElement(LayerColorSelector, layerConfiguratorProps),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.color
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.opacity, visConfiguratorProps))
        ),
        featureTypes.line || featureTypes.polygon ? _react2.default.createElement(
          _layerConfigGroup2.default,
          (0, _extends4.default)({
            label: 'stroke'
          }, visConfiguratorProps, featureTypes.polygon ? _layerFactory.LAYER_VIS_CONFIGS.stroked : {}),
          visConfig.stroked ? _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.thickness, visConfiguratorProps)),
            _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
              channel: layer.visualChannels.size
            }, layerChannelConfigProps)),
            _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.strokeWidthRange, visConfiguratorProps, {
              disabled: !layer.config.sizeField
            }))
          ) : null
        ) : null,
        featureTypes.polygon && visConfig.filled ? _react2.default.createElement(
          _layerConfigGroup2.default,
          (0, _extends4.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.enable3d),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.elevationScale, visConfiguratorProps)),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.height
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSwitch2.default, (0, _extends4.default)({}, visConfiguratorProps, _layerFactory.LAYER_VIS_CONFIGS.wireframe))
        ) : null,
        featureTypes.point ? _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radius, visConfiguratorProps, {
            label: 'Point Radius',
            disabled: Boolean(layer.config.radiusField)
          })),
          _react2.default.createElement(ChannelByValueSelector, (0, _extends4.default)({
            channel: layer.visualChannels.radius
          }, layerChannelConfigProps)),
          _react2.default.createElement(_visConfigSlider2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS.radiusRange, visConfiguratorProps, {
            disabled: !layer.config.radiusField
          }))
        ) : null,
        _react2.default.createElement(_layerConfigGroup2.default, (0, _extends4.default)({}, _layerFactory.LAYER_VIS_CONFIGS['hi-precision'], visConfiguratorProps))
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          layer = _props.layer,
          datasets = _props.datasets,
          updateLayerConfig = _props.updateLayerConfig,
          layerTypeOptions = _props.layerTypeOptions,
          updateLayerType = _props.updateLayerType;

      var _ref8 = layer.config.dataId ? datasets[layer.config.dataId] : {},
          _ref8$fields = _ref8.fields,
          fields = _ref8$fields === undefined ? [] : _ref8$fields,
          fieldPairs = _ref8.fieldPairs;

      var config = layer.config;


      var commonConfigProp = {
        layer: layer,
        fields: fields
      };

      var visConfiguratorProps = (0, _extends4.default)({}, commonConfigProp, {
        onChange: this.props.updateLayerVisConfig
      });

      var layerConfiguratorProps = (0, _extends4.default)({}, commonConfigProp, {
        onChange: updateLayerConfig
      });

      var layerChannelConfigProps = (0, _extends4.default)({}, commonConfigProp, {
        onChange: this.props.updateLayerVisualChannelConfig
      });

      var renderTemplate = layer.type && '_render' + (0, _utils.capitalizeFirstLetter)(layer.type) + 'LayerConfig';

      return _react2.default.createElement(
        StyledLayerConfigurator,
        null,
        layer.layerInfoModal ? _react2.default.createElement(HowToButton, { onClick: function onClick() {
            return _this2.props.openModal(layer.layerInfoModal);
          } }) : null,
        _react2.default.createElement(
          _layerConfigGroup2.default,
          { label: 'basic' },
          Object.keys(datasets).length > 1 && _react2.default.createElement(_sourceDataSelector2.default, {
            datasets: datasets,
            id: layer.id,
            disabled: layer.tyep && config.columns,
            dataId: config.dataId,
            onSelect: function onSelect(value) {
              return updateLayerConfig({ dataId: value });
            }
          }),
          _react2.default.createElement(_layerTypeSelector2.default, {
            layer: layer,
            layerTypeOptions: layerTypeOptions,
            onSelect: updateLayerType
          }),
          _react2.default.createElement(_layerColumnConfig2.default, {
            layer: layer,
            fields: fields,
            fieldPairs: fieldPairs,
            updateLayerConfig: updateLayerConfig,
            updateLayerType: this.props.updateLayerType
          })
        ),
        this[renderTemplate] && this[renderTemplate]({
          layer: layer,
          visConfiguratorProps: visConfiguratorProps,
          layerChannelConfigProps: layerChannelConfigProps,
          layerConfiguratorProps: layerConfiguratorProps
        })
      );
    }
  }]);
  return LayerConfigurator;
}(_react.Component), _class.propTypes = {
  layer: _propTypes2.default.object.isRequired,
  datasets: _propTypes2.default.object.isRequired,
  layerTypeOptions: _propTypes2.default.arrayOf(_propTypes2.default.any).isRequired,
  openModal: _propTypes2.default.func.isRequired,
  updateLayerConfig: _propTypes2.default.func.isRequired,
  updateLayerType: _propTypes2.default.func.isRequired,
  updateLayerVisConfig: _propTypes2.default.func.isRequired,
  updateLayerVisualChannelConfig: _propTypes2.default.func.isRequired
}, _temp);

/*
 * Componentize config component into pure functional components
 */

exports.default = LayerConfigurator;
var StyledHowToButton = _styledComponents2.default.div(_templateObject3);

var HowToButton = exports.HowToButton = function HowToButton(_ref9) {
  var onClick = _ref9.onClick;
  return _react2.default.createElement(
    StyledHowToButton,
    null,
    _react2.default.createElement(
      _styledComponents3.Button,
      { secondary: true, small: true, onClick: onClick },
      'How to'
    )
  );
};

var LayerColorSelector = exports.LayerColorSelector = function LayerColorSelector(_ref10) {
  var layer = _ref10.layer,
      onChange = _ref10.onChange,
      label = _ref10.label;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    { disabled: layer.config.colorField },
    _react2.default.createElement(_colorSelector2.default, {
      colorSets: [{
        selectedColor: layer.config.color,
        setColor: function setColor(rgbValue) {
          return onChange({ color: rgbValue });
        }
      }]
    })
  );
};

var ArcLayerColorSelector = exports.ArcLayerColorSelector = function ArcLayerColorSelector(_ref11) {
  var layer = _ref11.layer,
      onChangeConfig = _ref11.onChangeConfig,
      onChangeVisConfig = _ref11.onChangeVisConfig;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(_colorSelector2.default, {
      colorSets: [{
        selectedColor: layer.config.color,
        setColor: function setColor(rgbValue) {
          return onChangeConfig({ color: rgbValue });
        },
        label: 'Source'
      }, {
        selectedColor: layer.config.visConfig.targetColor || layer.config.color,
        setColor: function setColor(rgbValue) {
          return onChangeVisConfig({ targetColor: rgbValue });
        },
        label: 'Target'
      }]
    })
  );
};

var ColorRangeConfig = exports.ColorRangeConfig = function ColorRangeConfig(_ref12) {
  var layer = _ref12.layer,
      onChange = _ref12.onChange;
  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(_colorSelector2.default, {
      colorSets: [{
        selectedColor: layer.config.visConfig.colorRange,
        isRange: true,
        setColor: function setColor(colorRange) {
          return onChange({ colorRange: colorRange });
        }
      }]
    })
  );
};

var ChannelByValueSelector = exports.ChannelByValueSelector = function ChannelByValueSelector(_ref13) {
  var layer = _ref13.layer,
      channel = _ref13.channel,
      onChange = _ref13.onChange,
      fields = _ref13.fields,
      description = _ref13.description;
  var channelScaleType = channel.channelScaleType,
      domain = channel.domain,
      field = channel.field,
      key = channel.key,
      property = channel.property,
      range = channel.range,
      scale = channel.scale,
      defaultMeasure = channel.defaultMeasure,
      supportedFieldTypes = channel.supportedFieldTypes;

  var channelSupportedFieldTypes = supportedFieldTypes || _defaultSettings.CHANNEL_SCALE_SUPPORTED_FIELDS[channelScaleType];
  var supportedFields = fields.filter(function (_ref14) {
    var type = _ref14.type;
    return channelSupportedFieldTypes.includes(type);
  });
  var scaleOptions = layer.getScaleOptions(channel.key);
  var showScale = !layer.isAggregated && layer.config[scale] && scaleOptions.length > 1;
  var defaultDescription = 'Calculate ' + property + ' based on selected field';

  return _react2.default.createElement(_visConfigByFieldSelector2.default, {
    channel: channel.key,
    description: description || defaultDescription,
    domain: layer.config[domain],
    fields: supportedFields,
    id: layer.id,
    key: key + '-channel-selector',
    property: property,
    placeholder: defaultMeasure || 'Select a field',
    range: layer.config.visConfig[range],
    scaleOptions: scaleOptions,
    scaleType: scale ? layer.config[scale] : null,
    selectedField: layer.config[field],
    showScale: showScale,
    updateField: function updateField(val) {
      return onChange((0, _defineProperty3.default)({}, field, val), key);
    },
    updateScale: function updateScale(val) {
      return onChange((0, _defineProperty3.default)({}, scale, val), key);
    }
  });
};

var AggrColorScaleSelector = exports.AggrColorScaleSelector = function AggrColorScaleSelector(_ref15) {
  var layer = _ref15.layer,
      onChange = _ref15.onChange;

  var scaleOptions = layer.getScaleOptions('color');
  return Array.isArray(scaleOptions) && scaleOptions.length > 1 ? _react2.default.createElement(_dimensionScaleSelector2.default, {
    label: 'Color Scale',
    options: scaleOptions,
    scaleType: layer.config.colorScale,
    onSelect: function onSelect(val) {
      return onChange({ colorScale: val }, 'color');
    }
  }) : null;
};

var AggregationTypeSelector = exports.AggregationTypeSelector = function AggregationTypeSelector(_ref16) {
  var layer = _ref16.layer,
      channel = _ref16.channel,
      _onChange3 = _ref16.onChange;
  var field = channel.field,
      aggregation = channel.aggregation,
      key = channel.key;

  var selectedField = layer.config[field];
  var visConfig = layer.config.visConfig;

  // aggregation should only be selectable when field is selected

  var aggregationOptions = layer.getAggregationOptions(key);

  return _react2.default.createElement(
    _styledComponents3.SidePanelSection,
    null,
    _react2.default.createElement(
      _styledComponents3.PanelLabel,
      null,
      'Aggregate ' + selectedField.name + ' by'
    ),
    _react2.default.createElement(_itemSelector2.default, {
      selectedItems: visConfig[aggregation],
      options: aggregationOptions,
      multiSelect: false,
      searchable: false,
      onChange: function onChange(value) {
        return _onChange3({
          visConfig: (0, _extends4.default)({}, layer.config.visConfig, (0, _defineProperty3.default)({}, aggregation, value))
        }, channel.key);
      }
    })
  );
};
/* eslint-enable max-params */
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyQ29uZmlndXJhdG9yIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvciIsIkxheWVyQ29uZmlndXJhdG9yIiwicHJvcHMiLCJfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyIsImxheWVyIiwidmlzQ29uZmlndXJhdG9yUHJvcHMiLCJsYXllckNoYW5uZWxDb25maWdQcm9wcyIsImxheWVyQ29uZmlndXJhdG9yUHJvcHMiLCJjb25maWciLCJjb2xvckZpZWxkIiwidmlzdWFsQ2hhbm5lbHMiLCJjb2xvciIsIkxBWUVSX1ZJU19DT05GSUdTIiwib3BhY2l0eSIsInNpemVGaWVsZCIsInJhZGl1cyIsIkJvb2xlYW4iLCJyYWRpdXNSYW5nZSIsInZpc0NvbmZpZyIsImZpeGVkUmFkaXVzIiwic2l6ZSIsInR5cGUiLCJMQVlFUl9UWVBFUyIsInBvaW50Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsInRleHRMYWJlbCIsInZpc0NvbmZpZ1NldHRpbmdzIiwiY29sb3JBZ2dyZWdhdGlvbiIsImNvbmRpdGlvbiIsImNsdXN0ZXJSYWRpdXMiLCJ3ZWlnaHQiLCJfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyIsImVuYWJsZTNkIiwiZWxldmF0aW9uQnlEZXNjcmlwdGlvbiIsImNvbG9yQnlEZXNjcmlwdGlvbiIsInBlcmNlbnRpbGUiLCJ3b3JsZFVuaXRTaXplIiwiY292ZXJhZ2UiLCJlbGV2YXRpb25TY2FsZSIsInNpemVBZ2dyZWdhdGlvbiIsImVsZXZhdGlvblBlcmNlbnRpbGUiLCJlbGV2YXRpb25SYW5nZSIsImFyZ3MiLCJfcmVuZGVyTGluZUxheWVyQ29uZmlnIiwib25DaGFuZ2UiLCJzdHJva2VXaWR0aFJhbmdlIiwibWV0YSIsImZlYXR1cmVUeXBlcyIsInBvbHlnb24iLCJmaWxsZWQiLCJsaW5lIiwic3Ryb2tlZCIsImhlaWdodCIsIndpcmVmcmFtZSIsInJhZGl1c0ZpZWxkIiwiZGF0YXNldHMiLCJ1cGRhdGVMYXllckNvbmZpZyIsImxheWVyVHlwZU9wdGlvbnMiLCJ1cGRhdGVMYXllclR5cGUiLCJkYXRhSWQiLCJmaWVsZHMiLCJmaWVsZFBhaXJzIiwiY29tbW9uQ29uZmlnUHJvcCIsInVwZGF0ZUxheWVyVmlzQ29uZmlnIiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnIiwicmVuZGVyVGVtcGxhdGUiLCJsYXllckluZm9Nb2RhbCIsIm9wZW5Nb2RhbCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJpZCIsInR5ZXAiLCJjb2x1bW5zIiwidmFsdWUiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImFueSIsImZ1bmMiLCJTdHlsZWRIb3dUb0J1dHRvbiIsIkhvd1RvQnV0dG9uIiwib25DbGljayIsIkxheWVyQ29sb3JTZWxlY3RvciIsImxhYmVsIiwic2VsZWN0ZWRDb2xvciIsInNldENvbG9yIiwicmdiVmFsdWUiLCJBcmNMYXllckNvbG9yU2VsZWN0b3IiLCJvbkNoYW5nZUNvbmZpZyIsIm9uQ2hhbmdlVmlzQ29uZmlnIiwidGFyZ2V0Q29sb3IiLCJDb2xvclJhbmdlQ29uZmlnIiwiY29sb3JSYW5nZSIsImlzUmFuZ2UiLCJDaGFubmVsQnlWYWx1ZVNlbGVjdG9yIiwiY2hhbm5lbCIsImRlc2NyaXB0aW9uIiwiY2hhbm5lbFNjYWxlVHlwZSIsImRvbWFpbiIsImZpZWxkIiwia2V5IiwicHJvcGVydHkiLCJyYW5nZSIsInNjYWxlIiwiZGVmYXVsdE1lYXN1cmUiLCJzdXBwb3J0ZWRGaWVsZFR5cGVzIiwiY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMiLCJDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFMiLCJzdXBwb3J0ZWRGaWVsZHMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsInNjYWxlT3B0aW9ucyIsImdldFNjYWxlT3B0aW9ucyIsInNob3dTY2FsZSIsImlzQWdncmVnYXRlZCIsImRlZmF1bHREZXNjcmlwdGlvbiIsInZhbCIsIkFnZ3JDb2xvclNjYWxlU2VsZWN0b3IiLCJBcnJheSIsImlzQXJyYXkiLCJjb2xvclNjYWxlIiwiQWdncmVnYXRpb25UeXBlU2VsZWN0b3IiLCJhZ2dyZWdhdGlvbiIsInNlbGVjdGVkRmllbGQiLCJhZ2dyZWdhdGlvbk9wdGlvbnMiLCJnZXRBZ2dyZWdhdGlvbk9wdGlvbnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MktBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBS0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQUVBOztBQUVBOzs7O0FBS0EsSUFBTUEsMEJBQTBCQywyQkFBT0MsR0FBUCxDQUFXQyxLQUFYLENBQWlCO0FBQy9DQyxhQUFXO0FBRG9DLENBQWpCLENBQTFCLGlCQUFOOztBQU9BLElBQU1DLGdDQUFnQ0osMkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUNyREMsYUFBVztBQUQwQyxDQUFqQixDQUFoQyxrQkFBTjs7SUFNcUJFLGlCOzs7Ozs7Ozs7OzRDQVlLQyxLLEVBQU87QUFDN0IsYUFBTyxLQUFLQyw2QkFBTCxDQUFtQ0QsS0FBbkMsQ0FBUDtBQUNEOzs7MkNBRXNCQSxLLEVBQU87QUFDNUIsYUFBTyxLQUFLQyw2QkFBTCxDQUFtQ0QsS0FBbkMsQ0FBUDtBQUNEOzs7d0RBT0U7QUFBQSxV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LFdBRHVEO0FBQUEsTUFDMUN0QixHQUQwQyxHQUNuQ0wsT0FEbUMsQ0FDMUNLLEdBRDBDOztBQUVyRSxNQUFNdUIsZ0JBQWdCNUgsTUFBTUksTUFBTixDQUFhZ0csS0FBYixDQUF0QjtBQUZxRSxNQUc5RHRGLFNBSDhELEdBR2pEZCxNQUFNSSxNQUgyQyxDQUc5RFUsU0FIOEQ7O0FBS3JFOztBQUNBLE1BQU0rRyxxQkFBcUI3SCxNQUFNOEgscUJBQU4sQ0FBNEJ6QixHQUE1QixDQUEzQjs7QUFFQSxTQUNFO0FBQUMsdUNBQUQ7QUFBQTtBQUNFO0FBQUMsbUNBQUQ7QUFBQTtBQUFBLHFCQUEwQnVCLGNBQWNHLElBQXhDO0FBQUEsS0FERjtBQUVFLGtDQUFDLHNCQUFEO0FBQ0UscUJBQWVqSCxVQUFVNkcsV0FBVixDQURqQjtBQUVFLGVBQVNFLGtCQUZYO0FBR0UsbUJBQWEsS0FIZjtBQUlFLGtCQUFZLEtBSmQ7QUFLRSxnQkFBVTtBQUFBLGVBQ1JwRixXQUNFO0FBQ0UzQixnREFDS2QsTUFBTUksTUFBTixDQUFhVSxTQURsQixvQ0FFRzZHLFdBRkgsRUFFaUJwRCxLQUZqQjtBQURGLFNBREYsRUFPRXlCLFFBQVFLLEdBUFYsQ0FEUTtBQUFBO0FBTFo7QUFGRixHQURGO0FBc0JELENBOUJNO0FBK0JQIiwiZmlsZSI6ImxheWVyLWNvbmZpZ3VyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxOCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbFNlY3Rpb25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuXG5pbXBvcnQgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGZyb20gJy4vdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQgTGF5ZXJDb2x1bW5Db25maWcgZnJvbSAnLi9sYXllci1jb2x1bW4tY29uZmlnJztcbmltcG9ydCBMYXllclR5cGVTZWxlY3RvciBmcm9tICcuL2xheWVyLXR5cGUtc2VsZWN0b3InO1xuaW1wb3J0IERpbWVuc2lvblNjYWxlU2VsZWN0b3IgZnJvbSAnLi9kaW1lbnNpb24tc2NhbGUtc2VsZWN0b3InO1xuaW1wb3J0IENvbG9yU2VsZWN0b3IgZnJvbSAnLi9jb2xvci1zZWxlY3Rvcic7XG5pbXBvcnQgU291cmNlRGF0YVNlbGVjdG9yIGZyb20gJy4uL3NvdXJjZS1kYXRhLXNlbGVjdG9yJztcbmltcG9ydCBWaXNDb25maWdTd2l0Y2ggZnJvbSAnLi92aXMtY29uZmlnLXN3aXRjaCc7XG5pbXBvcnQgVmlzQ29uZmlnU2xpZGVyIGZyb20gJy4vdmlzLWNvbmZpZy1zbGlkZXInO1xuaW1wb3J0IExheWVyQ29uZmlnR3JvdXAgZnJvbSAnLi9sYXllci1jb25maWctZ3JvdXAnO1xuaW1wb3J0IFRleHRMYWJlbFBhbmVsIGZyb20gJy4vdGV4dC1sYWJlbC1wYW5lbCc7XG5cbmltcG9ydCB7TEFZRVJfVklTX0NPTkZJR1N9IGZyb20gJ2xheWVycy9sYXllci1mYWN0b3J5JztcblxuaW1wb3J0IHtjYXBpdGFsaXplRmlyc3RMZXR0ZXJ9IGZyb20gJ3V0aWxzL3V0aWxzJztcblxuaW1wb3J0IHtcbiAgTEFZRVJfVFlQRVMsXG4gIENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1xufSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbmNvbnN0IFN0eWxlZExheWVyQ29uZmlndXJhdG9yID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2xheWVyLXBhbmVsX19jb25maWcnXG59KWBcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBtYXJnaW4tdG9wOiAxMnB4O1xuYDtcblxuY29uc3QgU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3IgPSBzdHlsZWQuZGl2LmF0dHJzKHtcbiAgY2xhc3NOYW1lOiAnbGF5ZXItcGFuZWxfX2NvbmZpZ19fdmlzdWFsQy1jb25maWcnXG59KWBcbiAgbWFyZ2luLXRvcDogMTJweDtcbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExheWVyQ29uZmlndXJhdG9yIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBsYXllcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGRhdGFzZXRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgbGF5ZXJUeXBlT3B0aW9uczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLmFueSkuaXNSZXF1aXJlZCxcbiAgICBvcGVuTW9kYWw6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlTGF5ZXJDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlTGF5ZXJUeXBlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUxheWVyVmlzQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUxheWVyVmlzdWFsQ2hhbm5lbENvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZFxuICB9O1xuXG4gIF9yZW5kZXJQb2ludExheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlclNjYXR0ZXJwbG90TGF5ZXJDb25maWcocHJvcHMpO1xuICB9XG5cbiAgX3JlbmRlckljb25MYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzXG4gIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIFJhZGl1cyAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydyYWRpdXMnfT5cbiAgICAgICAgICB7IWxheWVyLmNvbmZpZy5zaXplRmllbGQgPyAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXN9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17Qm9vbGVhbihsYXllci5jb25maWcuc2l6ZUZpZWxkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnJhZGl1c1JhbmdlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtcbiAgICAgICAgICAgICAgICAhbGF5ZXIuY29uZmlnLnNpemVGaWVsZCB8fCBsYXllci5jb25maWcudmlzQ29uZmlnLmZpeGVkUmFkaXVzXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1N3aXRjaFxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZml4ZWRSYWRpdXN9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcuc2l6ZUZpZWxkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBvdXRsaW5lICovfVxuICAgICAgICB7bGF5ZXIudHlwZSA9PT0gTEFZRVJfVFlQRVMucG9pbnQgPyAoXG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vdXRsaW5lfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5vdXRsaW5lfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiB0ZXh0IGxhYmVsICovfVxuICAgICAgICA8VGV4dExhYmVsUGFuZWxcbiAgICAgICAgICB2aXNDb25maWd1cmF0b3JQcm9wcz17dmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcz17bGF5ZXJDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICB0ZXh0TGFiZWw9e2xheWVyLmNvbmZpZy50ZXh0TGFiZWx9XG4gICAgICAgIC8+XG4gICAgICAgIHsvKiBoaWdoIHByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJDbHVzdGVyTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICA8QWdnckNvbG9yU2NhbGVTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7bGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY29sb3JBZ2dyZWdhdGlvbi5jb25kaXRpb24obGF5ZXIuY29uZmlnKSA/XG4gICAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNvbG9yQWdncmVnYXRpb259XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuY29sb3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgOiBudWxsfVxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogQ2x1c3RlciBSYWRpdXMgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsncmFkaXVzJ30+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNsdXN0ZXJSYWRpdXN9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucmFkaXVzUmFuZ2V9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckhlYXRtYXBMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgey8qIFJhZGl1cyAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydyYWRpdXMnfT5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucmFkaXVzfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgey8qIFdlaWdodCAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eyd3ZWlnaHQnfT5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMud2VpZ2h0fVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJHcmlkTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVySGV4YWdvbkxheWVyQ29uZmlnKHByb3BzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckFnZ3JlZ2F0aW9uTGF5ZXJDb25maWcocHJvcHMpO1xuICB9XG5cbiAgX3JlbmRlckFnZ3JlZ2F0aW9uTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG4gICAgY29uc3Qge1xuICAgICAgdmlzQ29uZmlnOiB7ZW5hYmxlM2R9XG4gICAgfSA9IGNvbmZpZztcbiAgICBjb25zdCBlbGV2YXRpb25CeURlc2NyaXB0aW9uID1cbiAgICAgICdXaGVuIG9mZiwgaGVpZ2h0IGlzIGJhc2VkIG9uIGNvdW50IG9mIHBvaW50cyc7XG4gICAgY29uc3QgY29sb3JCeURlc2NyaXB0aW9uID0gJ1doZW4gb2ZmLCBjb2xvciBpcyBiYXNlZCBvbiBjb3VudCBvZiBwb2ludHMnO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtsYXllci52aXNDb25maWdTZXR0aW5ncy5jb2xvckFnZ3JlZ2F0aW9uLmNvbmRpdGlvbihsYXllci5jb25maWcpID8gKFxuICAgICAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5jb2xvckFnZ3JlZ2F0aW9ufVxuICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgIGRlc2NyZWlwdGlvbj17Y29sb3JCeURlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnBlcmNlbnRpbGUgJiYgbGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucGVyY2VudGlsZS5jb25kaXRpb24obGF5ZXIuY29uZmlnKSA/IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnBlcmNlbnRpbGV9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBDZWxsIHNpemUgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsncmFkaXVzJ30+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLndvcmxkVW5pdFNpemV9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY292ZXJhZ2V9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBFbGV2YXRpb24gKi99XG4gICAgICAgIHtsYXllci52aXNDb25maWdTZXR0aW5ncy5lbmFibGUzZCA/XG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5lbmFibGUzZH1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5lbGV2YXRpb25TY2FsZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgICAgZGVzY3JpcHRpb249e2VsZXZhdGlvbkJ5RGVzY3JpcHRpb259XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshZW5hYmxlM2R9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnNpemVBZ2dyZWdhdGlvbi5jb25kaXRpb24obGF5ZXIuY29uZmlnKSA/IChcbiAgICAgICAgICAgICAgPEFnZ3JlZ2F0aW9uVHlwZVNlbGVjdG9yXG4gICAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLnNpemVBZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVsZXZhdGlvblBlcmNlbnRpbGUuY29uZGl0aW9uKFxuICAgICAgICAgICAgICBsYXllci5jb25maWdcbiAgICAgICAgICAgICkgPyAoXG4gICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZWxldmF0aW9uUGVyY2VudGlsZX1cbiAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+IDogbnVsbH1cblxuICAgICAgICB7LyogSGlnaCBQcmVjaXNpb24gKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICAvLyBUT0RPOiBTaGFuIG1vdmUgdGhlc2UgaW50byBsYXllciBjbGFzc1xuICBfcmVuZGVySGV4YWdvbklkTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogQ2VsbCBzaXplICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3JhZGl1cyd9PlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5jb3ZlcmFnZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIGhlaWdodCAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZW5hYmxlM2R9XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICA+XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZWxldmF0aW9uUmFuZ2V9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7LyogaGlnaCBwcmVjaXNpb24gKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyQXJjTGF5ZXJDb25maWcoYXJncykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJMaW5lTGF5ZXJDb25maWcoYXJncyk7XG4gIH1cblxuICBfcmVuZGVyTGluZUxheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxBcmNMYXllckNvbG9yU2VsZWN0b3JcbiAgICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgICBvbkNoYW5nZUNvbmZpZz17bGF5ZXJDb25maWd1cmF0b3JQcm9wcy5vbkNoYW5nZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2VWaXNDb25maWc9e3Zpc0NvbmZpZ3VyYXRvclByb3BzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5vcGFjaXR5fVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogdGhpY2tuZXNzICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3N0cm9rZSd9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlV2lkdGhSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5zaXplRmllbGR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHU1snaGktcHJlY2lzaW9uJ119XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdlb2pzb25MYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgY29uc3Qge1xuICAgICAgbWV0YToge2ZlYXR1cmVUeXBlcyA9IHt9fSxcbiAgICAgIGNvbmZpZzoge3Zpc0NvbmZpZ31cbiAgICB9ID0gbGF5ZXI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgQnkgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvbHlnb24gPyAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU3dpdGNoXG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmZpbGxlZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLmNvbG9yRmllbGQgPyAoXG4gICAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxMYXllckNvbG9yU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBTdHJva2UgV2lkdGggKi99XG4gICAgICAgIHtmZWF0dXJlVHlwZXMubGluZSB8fCBmZWF0dXJlVHlwZXMucG9seWdvbiA/IChcbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgbGFiZWw9XCJzdHJva2VcIlxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgey4uLihmZWF0dXJlVHlwZXMucG9seWdvbiA/IExBWUVSX1ZJU19DT05GSUdTLnN0cm9rZWQgOiB7fSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3Zpc0NvbmZpZy5zdHJva2VkID9cbiAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MudGhpY2tuZXNzfVxuICAgICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlV2lkdGhSYW5nZX1cbiAgICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj4gOiBudWxsfVxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgey8qIEVsZXZhdGlvbiAqL31cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5wb2x5Z29uICYmIHZpc0NvbmZpZy5maWxsZWQgPyAoXG4gICAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbmFibGUzZH1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25TY2FsZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmhlaWdodH1cbiAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mud2lyZWZyYW1lfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiBSYWRpdXMgKi99XG4gICAgICAgIHtmZWF0dXJlVHlwZXMucG9pbnQgPyAoXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnJhZGl1c31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBsYWJlbD1cIlBvaW50IFJhZGl1c1wiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtCb29sZWFuKGxheWVyLmNvbmZpZy5yYWRpdXNGaWVsZCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzUmFuZ2V9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcucmFkaXVzRmllbGR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7LyogaGlnaCBwcmVjaXNpb24gKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgbGF5ZXIsXG4gICAgICBkYXRhc2V0cyxcbiAgICAgIHVwZGF0ZUxheWVyQ29uZmlnLFxuICAgICAgbGF5ZXJUeXBlT3B0aW9ucyxcbiAgICAgIHVwZGF0ZUxheWVyVHlwZVxuICAgIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHtmaWVsZHMgPSBbXSwgZmllbGRQYWlyc30gPSBsYXllci5jb25maWcuZGF0YUlkXG4gICAgICA/IGRhdGFzZXRzW2xheWVyLmNvbmZpZy5kYXRhSWRdXG4gICAgICA6IHt9O1xuICAgIGNvbnN0IHtjb25maWd9ID0gbGF5ZXI7XG5cbiAgICBjb25zdCBjb21tb25Db25maWdQcm9wID0ge1xuICAgICAgbGF5ZXIsXG4gICAgICBmaWVsZHNcbiAgICB9O1xuXG4gICAgY29uc3QgdmlzQ29uZmlndXJhdG9yUHJvcHMgPSB7XG4gICAgICAuLi5jb21tb25Db25maWdQcm9wLFxuICAgICAgb25DaGFuZ2U6IHRoaXMucHJvcHMudXBkYXRlTGF5ZXJWaXNDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdXBkYXRlTGF5ZXJDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMgPSB7XG4gICAgICAuLi5jb21tb25Db25maWdQcm9wLFxuICAgICAgb25DaGFuZ2U6IHRoaXMucHJvcHMudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnXG4gICAgfTtcblxuICAgIGNvbnN0IHJlbmRlclRlbXBsYXRlID1cbiAgICAgIGxheWVyLnR5cGUgJiYgYF9yZW5kZXIke2NhcGl0YWxpemVGaXJzdExldHRlcihsYXllci50eXBlKX1MYXllckNvbmZpZ2A7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyQ29uZmlndXJhdG9yPlxuICAgICAgICB7bGF5ZXIubGF5ZXJJbmZvTW9kYWwgPyA8SG93VG9CdXR0b24gb25DbGljaz17KCkgPT4gdGhpcy5wcm9wcy5vcGVuTW9kYWwobGF5ZXIubGF5ZXJJbmZvTW9kYWwpfS8+IDogbnVsbH1cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydiYXNpYyd9PlxuICAgICAgICAgIHtPYmplY3Qua2V5cyhkYXRhc2V0cykubGVuZ3RoID4gMSAmJiAoXG4gICAgICAgICAgICA8U291cmNlRGF0YVNlbGVjdG9yXG4gICAgICAgICAgICAgIGRhdGFzZXRzPXtkYXRhc2V0c31cbiAgICAgICAgICAgICAgaWQ9e2xheWVyLmlkfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17bGF5ZXIudHllcCAmJiBjb25maWcuY29sdW1uc31cbiAgICAgICAgICAgICAgZGF0YUlkPXtjb25maWcuZGF0YUlkfVxuICAgICAgICAgICAgICBvblNlbGVjdD17dmFsdWUgPT4gdXBkYXRlTGF5ZXJDb25maWcoe2RhdGFJZDogdmFsdWV9KX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8TGF5ZXJUeXBlU2VsZWN0b3JcbiAgICAgICAgICAgIGxheWVyPXtsYXllcn1cbiAgICAgICAgICAgIGxheWVyVHlwZU9wdGlvbnM9e2xheWVyVHlwZU9wdGlvbnN9XG4gICAgICAgICAgICBvblNlbGVjdD17dXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPExheWVyQ29sdW1uQ29uZmlnXG4gICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICBmaWVsZHM9e2ZpZWxkc31cbiAgICAgICAgICAgIGZpZWxkUGFpcnM9e2ZpZWxkUGFpcnN9XG4gICAgICAgICAgICB1cGRhdGVMYXllckNvbmZpZz17dXBkYXRlTGF5ZXJDb25maWd9XG4gICAgICAgICAgICB1cGRhdGVMYXllclR5cGU9e3RoaXMucHJvcHMudXBkYXRlTGF5ZXJUeXBlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAge3RoaXNbcmVuZGVyVGVtcGxhdGVdICYmXG4gICAgICAgICAgdGhpc1tyZW5kZXJUZW1wbGF0ZV0oe1xuICAgICAgICAgICAgbGF5ZXIsXG4gICAgICAgICAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICAgICAgICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzLFxuICAgICAgICAgICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wc1xuICAgICAgICAgIH0pfVxuICAgICAgPC9TdHlsZWRMYXllckNvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG59XG5cbi8qXG4gKiBDb21wb25lbnRpemUgY29uZmlnIGNvbXBvbmVudCBpbnRvIHB1cmUgZnVuY3Rpb25hbCBjb21wb25lbnRzXG4gKi9cblxuY29uc3QgU3R5bGVkSG93VG9CdXR0b24gPSBzdHlsZWQuZGl2YFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAwO1xuICB0b3A6IDA7XG5gO1xuXG5leHBvcnQgY29uc3QgSG93VG9CdXR0b24gPSAoe29uQ2xpY2t9KSA9PiAoXG4gIDxTdHlsZWRIb3dUb0J1dHRvbj5cbiAgICA8QnV0dG9uIHNlY29uZGFyeSBzbWFsbCBvbkNsaWNrPXtvbkNsaWNrfT5Ib3cgdG88L0J1dHRvbj5cbiAgPC9TdHlsZWRIb3dUb0J1dHRvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBMYXllckNvbG9yU2VsZWN0b3IgPSAoe2xheWVyLCBvbkNoYW5nZSwgbGFiZWx9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uIGRpc2FibGVkPXtsYXllci5jb25maWcuY29sb3JGaWVsZH0+XG4gICAgPENvbG9yU2VsZWN0b3JcbiAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogbGF5ZXIuY29uZmlnLmNvbG9yLFxuICAgICAgICAgIHNldENvbG9yOiByZ2JWYWx1ZSA9PiBvbkNoYW5nZSh7Y29sb3I6IHJnYlZhbHVlfSlcbiAgICAgICAgfVxuICAgICAgXX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5leHBvcnQgY29uc3QgQXJjTGF5ZXJDb2xvclNlbGVjdG9yID0gKHtcbiAgbGF5ZXIsXG4gIG9uQ2hhbmdlQ29uZmlnLFxuICBvbkNoYW5nZVZpc0NvbmZpZ1xufSkgPT4gKFxuICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgY29sb3JTZXRzPXtbXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBsYXllci5jb25maWcuY29sb3IsXG4gICAgICAgICAgc2V0Q29sb3I6IHJnYlZhbHVlID0+IG9uQ2hhbmdlQ29uZmlnKHtjb2xvcjogcmdiVmFsdWV9KSxcbiAgICAgICAgICBsYWJlbDogJ1NvdXJjZSdcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6XG4gICAgICAgICAgICBsYXllci5jb25maWcudmlzQ29uZmlnLnRhcmdldENvbG9yIHx8IGxheWVyLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2VWaXNDb25maWcoe3RhcmdldENvbG9yOiByZ2JWYWx1ZX0pLFxuICAgICAgICAgIGxhYmVsOiAnVGFyZ2V0J1xuICAgICAgICB9XG4gICAgICBdfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBDb2xvclJhbmdlQ29uZmlnID0gKHtsYXllciwgb25DaGFuZ2V9KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICBjb2xvclNldHM9e1tcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IGxheWVyLmNvbmZpZy52aXNDb25maWcuY29sb3JSYW5nZSxcbiAgICAgICAgICBpc1JhbmdlOiB0cnVlLFxuICAgICAgICAgIHNldENvbG9yOiBjb2xvclJhbmdlID0+IG9uQ2hhbmdlKHtjb2xvclJhbmdlfSlcbiAgICAgICAgfVxuICAgICAgXX1cbiAgICAvPlxuICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4pO1xuXG5leHBvcnQgY29uc3QgQ2hhbm5lbEJ5VmFsdWVTZWxlY3RvciA9ICh7XG4gIGxheWVyLFxuICBjaGFubmVsLFxuICBvbkNoYW5nZSxcbiAgZmllbGRzLFxuICBkZXNjcmlwdGlvblxufSkgPT4ge1xuICBjb25zdCB7XG4gICAgY2hhbm5lbFNjYWxlVHlwZSxcbiAgICBkb21haW4sXG4gICAgZmllbGQsXG4gICAga2V5LFxuICAgIHByb3BlcnR5LFxuICAgIHJhbmdlLFxuICAgIHNjYWxlLFxuICAgIGRlZmF1bHRNZWFzdXJlLFxuICAgIHN1cHBvcnRlZEZpZWxkVHlwZXNcbiAgfSA9IGNoYW5uZWw7XG4gIGNvbnN0IGNoYW5uZWxTdXBwb3J0ZWRGaWVsZFR5cGVzID0gc3VwcG9ydGVkRmllbGRUeXBlcyB8fCBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNbY2hhbm5lbFNjYWxlVHlwZV07XG4gIGNvbnN0IHN1cHBvcnRlZEZpZWxkcyA9IGZpZWxkcy5maWx0ZXIoKHt0eXBlfSkgPT5cbiAgICBjaGFubmVsU3VwcG9ydGVkRmllbGRUeXBlcy5pbmNsdWRlcyh0eXBlKVxuICApO1xuICBjb25zdCBzY2FsZU9wdGlvbnMgPSBsYXllci5nZXRTY2FsZU9wdGlvbnMoY2hhbm5lbC5rZXkpO1xuICBjb25zdCBzaG93U2NhbGUgPSAhbGF5ZXIuaXNBZ2dyZWdhdGVkICYmIGxheWVyLmNvbmZpZ1tzY2FsZV0gJiYgc2NhbGVPcHRpb25zLmxlbmd0aCA+IDE7XG4gIGNvbnN0IGRlZmF1bHREZXNjcmlwdGlvbiA9IGBDYWxjdWxhdGUgJHtwcm9wZXJ0eX0gYmFzZWQgb24gc2VsZWN0ZWQgZmllbGRgO1xuXG4gIHJldHVybiAoXG4gICAgPFZpc0NvbmZpZ0J5RmllbGRTZWxlY3RvclxuICAgICAgY2hhbm5lbD17Y2hhbm5lbC5rZXl9XG4gICAgICBkZXNjcmlwdGlvbj17ZGVzY3JpcHRpb24gfHwgZGVmYXVsdERlc2NyaXB0aW9ufVxuICAgICAgZG9tYWluPXtsYXllci5jb25maWdbZG9tYWluXX1cbiAgICAgIGZpZWxkcz17c3VwcG9ydGVkRmllbGRzfVxuICAgICAgaWQ9e2xheWVyLmlkfVxuICAgICAga2V5PXtgJHtrZXl9LWNoYW5uZWwtc2VsZWN0b3JgfVxuICAgICAgcHJvcGVydHk9e3Byb3BlcnR5fVxuICAgICAgcGxhY2Vob2xkZXI9e2RlZmF1bHRNZWFzdXJlIHx8ICdTZWxlY3QgYSBmaWVsZCd9XG4gICAgICByYW5nZT17bGF5ZXIuY29uZmlnLnZpc0NvbmZpZ1tyYW5nZV19XG4gICAgICBzY2FsZU9wdGlvbnM9e3NjYWxlT3B0aW9uc31cbiAgICAgIHNjYWxlVHlwZT17c2NhbGUgPyBsYXllci5jb25maWdbc2NhbGVdIDogbnVsbH1cbiAgICAgIHNlbGVjdGVkRmllbGQ9e2xheWVyLmNvbmZpZ1tmaWVsZF19XG4gICAgICBzaG93U2NhbGU9e3Nob3dTY2FsZX1cbiAgICAgIHVwZGF0ZUZpZWxkPXt2YWwgPT4gb25DaGFuZ2Uoe1tmaWVsZF06IHZhbH0sIGtleSl9XG4gICAgICB1cGRhdGVTY2FsZT17dmFsID0+IG9uQ2hhbmdlKHtbc2NhbGVdOiB2YWx9LCBrZXkpfVxuICAgIC8+XG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgQWdnckNvbG9yU2NhbGVTZWxlY3RvciA9ICh7bGF5ZXIsIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCBzY2FsZU9wdGlvbnMgPSBsYXllci5nZXRTY2FsZU9wdGlvbnMoJ2NvbG9yJyk7XG4gIHJldHVybiAoXG4gICAgQXJyYXkuaXNBcnJheShzY2FsZU9wdGlvbnMpICYmIHNjYWxlT3B0aW9ucy5sZW5ndGggPiAxID9cbiAgICAgIDxEaW1lbnNpb25TY2FsZVNlbGVjdG9yXG4gICAgICAgIGxhYmVsPVwiQ29sb3IgU2NhbGVcIlxuICAgICAgICBvcHRpb25zPXtzY2FsZU9wdGlvbnN9XG4gICAgICAgIHNjYWxlVHlwZT17bGF5ZXIuY29uZmlnLmNvbG9yU2NhbGV9XG4gICAgICAgIG9uU2VsZWN0PXt2YWwgPT4gb25DaGFuZ2Uoe2NvbG9yU2NhbGU6IHZhbH0sICdjb2xvcicpfVxuICAgICAgLz4gOiBudWxsXG4gICk7XG59O1xuXG5leHBvcnQgY29uc3QgQWdncmVnYXRpb25UeXBlU2VsZWN0b3IgPSAoe2xheWVyLCBjaGFubmVsLCBvbkNoYW5nZX0pID0+IHtcbiAgY29uc3Qge2ZpZWxkLCBhZ2dyZWdhdGlvbiwga2V5fSA9IGNoYW5uZWw7XG4gIGNvbnN0IHNlbGVjdGVkRmllbGQgPSBsYXllci5jb25maWdbZmllbGRdO1xuICBjb25zdCB7dmlzQ29uZmlnfSA9IGxheWVyLmNvbmZpZztcblxuICAvLyBhZ2dyZWdhdGlvbiBzaG91bGQgb25seSBiZSBzZWxlY3RhYmxlIHdoZW4gZmllbGQgaXMgc2VsZWN0ZWRcbiAgY29uc3QgYWdncmVnYXRpb25PcHRpb25zID0gbGF5ZXIuZ2V0QWdncmVnYXRpb25PcHRpb25zKGtleSk7XG5cbiAgcmV0dXJuIChcbiAgICA8U2lkZVBhbmVsU2VjdGlvbj5cbiAgICAgIDxQYW5lbExhYmVsPntgQWdncmVnYXRlICR7c2VsZWN0ZWRGaWVsZC5uYW1lfSBieWB9PC9QYW5lbExhYmVsPlxuICAgICAgPEl0ZW1TZWxlY3RvclxuICAgICAgICBzZWxlY3RlZEl0ZW1zPXt2aXNDb25maWdbYWdncmVnYXRpb25dfVxuICAgICAgICBvcHRpb25zPXthZ2dyZWdhdGlvbk9wdGlvbnN9XG4gICAgICAgIG11bHRpU2VsZWN0PXtmYWxzZX1cbiAgICAgICAgc2VhcmNoYWJsZT17ZmFsc2V9XG4gICAgICAgIG9uQ2hhbmdlPXt2YWx1ZSA9PlxuICAgICAgICAgIG9uQ2hhbmdlKFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2aXNDb25maWc6IHtcbiAgICAgICAgICAgICAgICAuLi5sYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgICAgICAgICAgICAgIFthZ2dyZWdhdGlvbl06IHZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjaGFubmVsLmtleVxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgLz5cbiAgICA8L1NpZGVQYW5lbFNlY3Rpb24+XG4gICk7XG59O1xuLyogZXNsaW50LWVuYWJsZSBtYXgtcGFyYW1zICovXG4iXX0=