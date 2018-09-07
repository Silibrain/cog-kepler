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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3NpZGUtcGFuZWwvbGF5ZXItcGFuZWwvbGF5ZXItY29uZmlndXJhdG9yLmpzIl0sIm5hbWVzIjpbIlN0eWxlZExheWVyQ29uZmlndXJhdG9yIiwic3R5bGVkIiwiZGl2IiwiYXR0cnMiLCJjbGFzc05hbWUiLCJTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvciIsIkxheWVyQ29uZmlndXJhdG9yIiwicHJvcHMiLCJfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyIsImxheWVyIiwidmlzQ29uZmlndXJhdG9yUHJvcHMiLCJsYXllckNoYW5uZWxDb25maWdQcm9wcyIsImxheWVyQ29uZmlndXJhdG9yUHJvcHMiLCJjb25maWciLCJjb2xvckZpZWxkIiwidmlzdWFsQ2hhbm5lbHMiLCJjb2xvciIsIkxBWUVSX1ZJU19DT05GSUdTIiwib3BhY2l0eSIsInNpemVGaWVsZCIsInJhZGl1cyIsIkJvb2xlYW4iLCJyYWRpdXNSYW5nZSIsInZpc0NvbmZpZyIsImZpeGVkUmFkaXVzIiwic2l6ZSIsInR5cGUiLCJMQVlFUl9UWVBFUyIsInBvaW50Iiwib3V0bGluZSIsInRoaWNrbmVzcyIsInZpc0NvbmZpZ1NldHRpbmdzIiwiY29sb3JBZ2dyZWdhdGlvbiIsImNvbmRpdGlvbiIsImNsdXN0ZXJSYWRpdXMiLCJ3ZWlnaHQiLCJfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyIsImVuYWJsZTNkIiwiZWxldmF0aW9uQnlEZXNjcmlwdGlvbiIsImNvbG9yQnlEZXNjcmlwdGlvbiIsInBlcmNlbnRpbGUiLCJ3b3JsZFVuaXRTaXplIiwiY292ZXJhZ2UiLCJlbGV2YXRpb25TY2FsZSIsInNpemVBZ2dyZWdhdGlvbiIsImVsZXZhdGlvblBlcmNlbnRpbGUiLCJlbGV2YXRpb25SYW5nZSIsImFyZ3MiLCJfcmVuZGVyTGluZUxheWVyQ29uZmlnIiwib25DaGFuZ2UiLCJzdHJva2VXaWR0aFJhbmdlIiwibWV0YSIsImZlYXR1cmVUeXBlcyIsInBvbHlnb24iLCJmaWxsZWQiLCJsaW5lIiwic3Ryb2tlZCIsImhlaWdodCIsIndpcmVmcmFtZSIsInJhZGl1c0ZpZWxkIiwiZGF0YXNldHMiLCJ1cGRhdGVMYXllckNvbmZpZyIsImxheWVyVHlwZU9wdGlvbnMiLCJ1cGRhdGVMYXllclR5cGUiLCJkYXRhSWQiLCJmaWVsZHMiLCJmaWVsZFBhaXJzIiwiY29tbW9uQ29uZmlnUHJvcCIsInVwZGF0ZUxheWVyVmlzQ29uZmlnIiwidXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsQ29uZmlnIiwicmVuZGVyVGVtcGxhdGUiLCJsYXllckluZm9Nb2RhbCIsIm9wZW5Nb2RhbCIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJpZCIsInR5ZXAiLCJjb2x1bW5zIiwidmFsdWUiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYXJyYXlPZiIsImFueSIsImZ1bmMiLCJTdHlsZWRIb3dUb0J1dHRvbiIsIkhvd1RvQnV0dG9uIiwib25DbGljayIsIkxheWVyQ29sb3JTZWxlY3RvciIsImxhYmVsIiwic2VsZWN0ZWRDb2xvciIsInNldENvbG9yIiwicmdiVmFsdWUiLCJBcmNMYXllckNvbG9yU2VsZWN0b3IiLCJvbkNoYW5nZUNvbmZpZyIsIm9uQ2hhbmdlVmlzQ29uZmlnIiwidGFyZ2V0Q29sb3IiLCJDb2xvclJhbmdlQ29uZmlnIiwiY29sb3JSYW5nZSIsImlzUmFuZ2UiLCJDaGFubmVsQnlWYWx1ZVNlbGVjdG9yIiwiY2hhbm5lbCIsImRlc2NyaXB0aW9uIiwiY2hhbm5lbFNjYWxlVHlwZSIsImRvbWFpbiIsImZpZWxkIiwia2V5IiwicHJvcGVydHkiLCJyYW5nZSIsInNjYWxlIiwiZGVmYXVsdE1lYXN1cmUiLCJzdXBwb3J0ZWRGaWVsZFR5cGVzIiwiY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMiLCJDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFMiLCJzdXBwb3J0ZWRGaWVsZHMiLCJmaWx0ZXIiLCJpbmNsdWRlcyIsInNjYWxlT3B0aW9ucyIsImdldFNjYWxlT3B0aW9ucyIsInNob3dTY2FsZSIsImlzQWdncmVnYXRlZCIsImRlZmF1bHREZXNjcmlwdGlvbiIsInZhbCIsIkFnZ3JDb2xvclNjYWxlU2VsZWN0b3IiLCJBcnJheSIsImlzQXJyYXkiLCJjb2xvclNjYWxlIiwiQWdncmVnYXRpb25UeXBlU2VsZWN0b3IiLCJhZ2dyZWdhdGlvbiIsInNlbGVjdGVkRmllbGQiLCJhZ2dyZWdhdGlvbk9wdGlvbnMiLCJnZXRBZ2dyZWdhdGlvbk9wdGlvbnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MktBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBS0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFFQTs7QUFFQTs7OztBQUtBLElBQU1BLDBCQUEwQkMsMkJBQU9DLEdBQVAsQ0FBV0MsS0FBWCxDQUFpQjtBQUMvQ0MsYUFBVztBQURvQyxDQUFqQixDQUExQixpQkFBTjs7QUFPQSxJQUFNQyxnQ0FBZ0NKLDJCQUFPQyxHQUFQLENBQVdDLEtBQVgsQ0FBaUI7QUFDckRDLGFBQVc7QUFEMEMsQ0FBakIsQ0FBaEMsa0JBQU47O0lBTXFCRSxpQjs7Ozs7Ozs7Ozs0Q0FZS0MsSyxFQUFPO0FBQzdCLGFBQU8sS0FBS0MsNkJBQUwsQ0FBbUNELEtBQW5DLENBQVA7QUFDRDs7OzJDQUVzQkEsSyxFQUFPO0FBQzVCLGFBQU8sS0FBS0MsNkJBQUwsQ0FBbUNELEtBQW5DLENBQVA7QUFDRDs7O3dEQU9FO0FBQUEsVUFKREUsS0FJQyxRQUpEQSxLQUlD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dUNBQUQ7QUFBQTtBQUNFO0FBQUMsbUNBQUQ7QUFBQTtBQUFBLHFCQUEwQnVCLGNBQWNHLElBQXhDO0FBQUEsS0FERjtBQUVFLGtDQUFDLHNCQUFEO0FBQ0UscUJBQWVoSCxVQUFVNEcsV0FBVixDQURqQjtBQUVFLGVBQVNFLGtCQUZYO0FBR0UsbUJBQWEsS0FIZjtBQUlFLGtCQUFZLEtBSmQ7QUFLRSxnQkFBVTtBQUFBLGVBQ1JwRixXQUNFO0FBQ0UxQixnREFDS2QsTUFBTUksTUFBTixDQUFhVSxTQURsQixvQ0FFRzRHLFdBRkgsRUFFaUJwRCxLQUZqQjtBQURGLFNBREYsRUFPRXlCLFFBQVFLLEdBUFYsQ0FEUTtBQUFBO0FBTFo7QUFGRixHQURGO0FBc0JELENBOUJNO0FBK0JQIiwiZmlsZSI6ImxheWVyLWNvbmZpZ3VyYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxOCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBSZWFjdCwge0NvbXBvbmVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBzdHlsZWQgZnJvbSAnc3R5bGVkLWNvbXBvbmVudHMnO1xuXG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFBhbmVsTGFiZWwsXG4gIFNpZGVQYW5lbFNlY3Rpb25cbn0gZnJvbSAnY29tcG9uZW50cy9jb21tb24vc3R5bGVkLWNvbXBvbmVudHMnO1xuaW1wb3J0IEl0ZW1TZWxlY3RvciBmcm9tICdjb21wb25lbnRzL2NvbW1vbi9pdGVtLXNlbGVjdG9yL2l0ZW0tc2VsZWN0b3InO1xuXG5pbXBvcnQgVmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yIGZyb20gJy4vdmlzLWNvbmZpZy1ieS1maWVsZC1zZWxlY3Rvcic7XG5pbXBvcnQgTGF5ZXJDb2x1bW5Db25maWcgZnJvbSAnLi9sYXllci1jb2x1bW4tY29uZmlnJztcbmltcG9ydCBMYXllclR5cGVTZWxlY3RvciBmcm9tICcuL2xheWVyLXR5cGUtc2VsZWN0b3InO1xuaW1wb3J0IERpbWVuc2lvblNjYWxlU2VsZWN0b3IgZnJvbSAnLi9kaW1lbnNpb24tc2NhbGUtc2VsZWN0b3InO1xuaW1wb3J0IENvbG9yU2VsZWN0b3IgZnJvbSAnLi9jb2xvci1zZWxlY3Rvcic7XG5pbXBvcnQgU291cmNlRGF0YVNlbGVjdG9yIGZyb20gJy4uL3NvdXJjZS1kYXRhLXNlbGVjdG9yJztcbmltcG9ydCBWaXNDb25maWdTd2l0Y2ggZnJvbSAnLi92aXMtY29uZmlnLXN3aXRjaCc7XG5pbXBvcnQgVmlzQ29uZmlnU2xpZGVyIGZyb20gJy4vdmlzLWNvbmZpZy1zbGlkZXInO1xuaW1wb3J0IExheWVyQ29uZmlnR3JvdXAgZnJvbSAnLi9sYXllci1jb25maWctZ3JvdXAnO1xuXG5pbXBvcnQge0xBWUVSX1ZJU19DT05GSUdTfSBmcm9tICdsYXllcnMvbGF5ZXItZmFjdG9yeSc7XG5cbmltcG9ydCB7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyfSBmcm9tICd1dGlscy91dGlscyc7XG5cbmltcG9ydCB7XG4gIExBWUVSX1RZUEVTLFxuICBDSEFOTkVMX1NDQUxFX1NVUFBPUlRFRF9GSUVMRFNcbn0gZnJvbSAnY29uc3RhbnRzL2RlZmF1bHQtc2V0dGluZ3MnO1xuXG5jb25zdCBTdHlsZWRMYXllckNvbmZpZ3VyYXRvciA9IHN0eWxlZC5kaXYuYXR0cnMoe1xuICBjbGFzc05hbWU6ICdsYXllci1wYW5lbF9fY29uZmlnJ1xufSlgXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWFyZ2luLXRvcDogMTJweDtcbmA7XG5cbmNvbnN0IFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yID0gc3R5bGVkLmRpdi5hdHRycyh7XG4gIGNsYXNzTmFtZTogJ2xheWVyLXBhbmVsX19jb25maWdfX3Zpc3VhbEMtY29uZmlnJ1xufSlgXG4gIG1hcmdpbi10b3A6IDEycHg7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMYXllckNvbmZpZ3VyYXRvciBleHRlbmRzIENvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgbGF5ZXI6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBkYXRhc2V0czogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGxheWVyVHlwZU9wdGlvbnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5hbnkpLmlzUmVxdWlyZWQsXG4gICAgb3Blbk1vZGFsOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUxheWVyQ29uZmlnOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUxheWVyVHlwZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVMYXllclZpc0NvbmZpZzogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWc6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcbiAgfTtcblxuICBfcmVuZGVyUG9pbnRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJTY2F0dGVycGxvdExheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJJY29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyU2NhdHRlcnBsb3RMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBSYWRpdXMgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsncmFkaXVzJ30+XG4gICAgICAgICAgeyFsYXllci5jb25maWcuc2l6ZUZpZWxkID8gKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPXtmYWxzZX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnNpemVGaWVsZCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17XG4gICAgICAgICAgICAgICAgIWxheWVyLmNvbmZpZy5zaXplRmllbGQgfHwgbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5maXhlZFJhZGl1c1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLnNpemV9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7bGF5ZXIuY29uZmlnLnNpemVGaWVsZCA/IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmZpeGVkUmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7Lyogb3V0bGluZSAqL31cbiAgICAgICAge2xheWVyLnR5cGUgPT09IExBWUVSX1RZUEVTLnBvaW50ID8gKFxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3V0bGluZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgbGFiZWw9e2ZhbHNlfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy52aXNDb25maWcub3V0bGluZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICApIDogbnVsbH1cbiAgICAgICAgey8qIGhpZ2ggcHJlY2lzaW9uICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHU1snaGktcHJlY2lzaW9uJ119XG4gICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAvPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckNsdXN0ZXJMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIHtsYXllci52aXNDb25maWdTZXR0aW5ncy5jb2xvckFnZ3JlZ2F0aW9uLmNvbmRpdGlvbihsYXllci5jb25maWcpID9cbiAgICAgICAgICAgIDxBZ2dyZWdhdGlvblR5cGVTZWxlY3RvclxuICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY29sb3JBZ2dyZWdhdGlvbn1cbiAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5jb2xvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA6IG51bGx9XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiBDbHVzdGVyIFJhZGl1cyAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydyYWRpdXMnfT5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuY2x1c3RlclJhZGl1c31cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVySGVhdG1hcExheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7LyogUmFkaXVzICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3JhZGl1cyd9PlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5yYWRpdXN9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICBsYWJlbD17ZmFsc2V9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7LyogV2VpZ2h0ICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J3dlaWdodCd9PlxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy53ZWlnaHR9XG4gICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgPC9TdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICApO1xuICB9XG5cbiAgX3JlbmRlckdyaWRMYXllckNvbmZpZyhwcm9wcykge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJBZ2dyZWdhdGlvbkxheWVyQ29uZmlnKHByb3BzKTtcbiAgfVxuXG4gIF9yZW5kZXJIZXhhZ29uTGF5ZXJDb25maWcocHJvcHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyhwcm9wcyk7XG4gIH1cblxuICBfcmVuZGVyQWdncmVnYXRpb25MYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgY29uc3Qge2NvbmZpZ30gPSBsYXllcjtcbiAgICBjb25zdCB7XG4gICAgICB2aXNDb25maWc6IHtlbmFibGUzZH1cbiAgICB9ID0gY29uZmlnO1xuICAgIGNvbnN0IGVsZXZhdGlvbkJ5RGVzY3JpcHRpb24gPVxuICAgICAgJ1doZW4gb2ZmLCBoZWlnaHQgaXMgYmFzZWQgb24gY291bnQgb2YgcG9pbnRzJztcbiAgICBjb25zdCBjb2xvckJ5RGVzY3JpcHRpb24gPSAnV2hlbiBvZmYsIGNvbG9yIGlzIGJhc2VkIG9uIGNvdW50IG9mIHBvaW50cyc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICAgICB7LyogQ29sb3IgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnY29sb3InfT5cbiAgICAgICAgICA8Q29sb3JSYW5nZUNvbmZpZyB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgPEFnZ3JDb2xvclNjYWxlU2VsZWN0b3Igey4uLmxheWVyQ29uZmlndXJhdG9yUHJvcHN9IC8+XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNvbG9yQWdncmVnYXRpb24uY29uZGl0aW9uKGxheWVyLmNvbmZpZykgPyAoXG4gICAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmNvbG9yQWdncmVnYXRpb259XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgZGVzY3JlaXB0aW9uPXtjb2xvckJ5RGVzY3JpcHRpb259XG4gICAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICB7bGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucGVyY2VudGlsZSAmJiBsYXllci52aXNDb25maWdTZXR0aW5ncy5wZXJjZW50aWxlLmNvbmRpdGlvbihsYXllci5jb25maWcpID8gKFxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MucGVyY2VudGlsZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mub3BhY2l0eX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIENlbGwgc2l6ZSAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydyYWRpdXMnfT5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Mud29ybGRVbml0U2l6ZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5jb3ZlcmFnZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIEVsZXZhdGlvbiAqL31cbiAgICAgICAge2xheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkID9cbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVuYWJsZTNkfVxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLmxheWVyLnZpc0NvbmZpZ1NldHRpbmdzLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbj17ZWxldmF0aW9uQnlEZXNjcmlwdGlvbn1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFlbmFibGUzZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7bGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Muc2l6ZUFnZ3JlZ2F0aW9uLmNvbmRpdGlvbihsYXllci5jb25maWcpID8gKFxuICAgICAgICAgICAgICA8QWdncmVnYXRpb25UeXBlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3Muc2l6ZUFnZ3JlZ2F0aW9ufVxuICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKSA6IG51bGx9XG4gICAgICAgICAgICB7bGF5ZXIudmlzQ29uZmlnU2V0dGluZ3MuZWxldmF0aW9uUGVyY2VudGlsZS5jb25kaXRpb24oXG4gICAgICAgICAgICAgIGxheWVyLmNvbmZpZ1xuICAgICAgICAgICAgKSA/IChcbiAgICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICAgIHsuLi5sYXllci52aXNDb25maWdTZXR0aW5ncy5lbGV2YXRpb25QZXJjZW50aWxlfVxuICAgICAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICkgOiBudWxsfVxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD4gOiBudWxsfVxuXG4gICAgICAgIHsvKiBIaWdoIFByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4ubGF5ZXIudmlzQ29uZmlnU2V0dGluZ3NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIC8vIFRPRE86IFNoYW4gbW92ZSB0aGVzZSBpbnRvIGxheWVyIGNsYXNzXG4gIF9yZW5kZXJIZXhhZ29uSWRMYXllckNvbmZpZyh7XG4gICAgbGF5ZXIsXG4gICAgdmlzQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNoYW5uZWxDb25maWdQcm9wc1xuICB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxTdHlsZWRMYXllclZpc3VhbENvbmZpZ3VyYXRvcj5cbiAgICAgICAgey8qIENvbG9yICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2NvbG9yJ30+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5jb2xvckZpZWxkID8gKFxuICAgICAgICAgICAgPENvbG9yUmFuZ2VDb25maWcgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8TGF5ZXJDb2xvclNlbGVjdG9yIHsuLi5sYXllckNvbmZpZ3VyYXRvclByb3BzfSAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7LyogaGVpZ2h0ICovfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbmFibGUzZH1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgID5cbiAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5lbGV2YXRpb25SYW5nZX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG4gICAgICAgIHsvKiBoaWdoIHByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIF9yZW5kZXJBcmNMYXllckNvbmZpZyhhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlckxpbmVMYXllckNvbmZpZyhhcmdzKTtcbiAgfVxuXG4gIF9yZW5kZXJMaW5lTGF5ZXJDb25maWcoe1xuICAgIGxheWVyLFxuICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ29uZmlndXJhdG9yUHJvcHMsXG4gICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHNcbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPEFyY0xheWVyQ29sb3JTZWxlY3RvclxuICAgICAgICAgICAgICBsYXllcj17bGF5ZXJ9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlQ29uZmlnPXtsYXllckNvbmZpZ3VyYXRvclByb3BzLm9uQ2hhbmdlfVxuICAgICAgICAgICAgICBvbkNoYW5nZVZpc0NvbmZpZz17dmlzQ29uZmlndXJhdG9yUHJvcHMub25DaGFuZ2V9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICl9XG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLm9wYWNpdHl9XG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuXG4gICAgICAgIHsvKiB0aGlja25lc3MgKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwIGxhYmVsPXsnc3Ryb2tlJ30+XG4gICAgICAgICAge2xheWVyLmNvbmZpZy5zaXplRmllbGQgPyAoXG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5zdHJva2VXaWR0aFJhbmdlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXshbGF5ZXIuY29uZmlnLnNpemVGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLnRoaWNrbmVzc31cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxDaGFubmVsQnlWYWx1ZVNlbGVjdG9yXG4gICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5zaXplfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cblxuICAgICAgICB7LyogaGlnaCBwcmVjaXNpb24gKi99XG4gICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTWydoaS1wcmVjaXNpb24nXX1cbiAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgIC8+XG4gICAgICA8L1N0eWxlZExheWVyVmlzdWFsQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cblxuICBfcmVuZGVyR2VvanNvbkxheWVyQ29uZmlnKHtcbiAgICBsYXllcixcbiAgICB2aXNDb25maWd1cmF0b3JQcm9wcyxcbiAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzLFxuICAgIGxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzXG4gIH0pIHtcbiAgICBjb25zdCB7XG4gICAgICBtZXRhOiB7ZmVhdHVyZVR5cGVzID0ge319LFxuICAgICAgY29uZmlnOiB7dmlzQ29uZmlnfVxuICAgIH0gPSBsYXllcjtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgICAgIHsvKiBDb2xvciBCeSAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXAgbGFiZWw9eydjb2xvcid9PlxuICAgICAgICAgIHtmZWF0dXJlVHlwZXMucG9seWdvbiA/IChcbiAgICAgICAgICAgIDxWaXNDb25maWdTd2l0Y2hcbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MuZmlsbGVkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApIDogbnVsbH1cblxuICAgICAgICAgIHtsYXllci5jb25maWcuY29sb3JGaWVsZCA/IChcbiAgICAgICAgICAgIDxDb2xvclJhbmdlQ29uZmlnIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPExheWVyQ29sb3JTZWxlY3RvciB7Li4ubGF5ZXJDb25maWd1cmF0b3JQcm9wc30gLz5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgIGNoYW5uZWw9e2xheWVyLnZpc3VhbENoYW5uZWxzLmNvbG9yfVxuICAgICAgICAgICAgey4uLmxheWVyQ2hhbm5lbENvbmZpZ1Byb3BzfVxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1Mub3BhY2l0eX1cbiAgICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgICAvPlxuICAgICAgICA8L0xheWVyQ29uZmlnR3JvdXA+XG5cbiAgICAgICAgey8qIFN0cm9rZSBXaWR0aCAqL31cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5saW5lIHx8IGZlYXR1cmVUeXBlcy5wb2x5Z29uID8gKFxuICAgICAgICAgIDxMYXllckNvbmZpZ0dyb3VwXG4gICAgICAgICAgICBsYWJlbD1cInN0cm9rZVwiXG4gICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICB7Li4uKGZlYXR1cmVUeXBlcy5wb2x5Z29uID8gTEFZRVJfVklTX0NPTkZJR1Muc3Ryb2tlZCA6IHt9KX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7dmlzQ29uZmlnLnN0cm9rZWQgP1xuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy50aGlja25lc3N9XG4gICAgICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuc2l6ZX1cbiAgICAgICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5zdHJva2VXaWR0aFJhbmdlfVxuICAgICAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFsYXllci5jb25maWcuc2l6ZUZpZWxkfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvZGl2PiA6IG51bGx9XG4gICAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICApIDogbnVsbH1cblxuICAgICAgICB7LyogRWxldmF0aW9uICovfVxuICAgICAgICB7ZmVhdHVyZVR5cGVzLnBvbHlnb24gJiYgdmlzQ29uZmlnLmZpbGxlZCA/IChcbiAgICAgICAgICA8TGF5ZXJDb25maWdHcm91cFxuICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVuYWJsZTNkfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxWaXNDb25maWdTbGlkZXJcbiAgICAgICAgICAgICAgey4uLkxBWUVSX1ZJU19DT05GSUdTLmVsZXZhdGlvblNjYWxlfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENoYW5uZWxCeVZhbHVlU2VsZWN0b3JcbiAgICAgICAgICAgICAgY2hhbm5lbD17bGF5ZXIudmlzdWFsQ2hhbm5lbHMuaGVpZ2h0fVxuICAgICAgICAgICAgICB7Li4ubGF5ZXJDaGFubmVsQ29uZmlnUHJvcHN9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1N3aXRjaFxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy53aXJlZnJhbWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvTGF5ZXJDb25maWdHcm91cD5cbiAgICAgICAgKSA6IG51bGx9XG5cbiAgICAgICAgey8qIFJhZGl1cyAqL31cbiAgICAgICAge2ZlYXR1cmVUeXBlcy5wb2ludCA/IChcbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPFZpc0NvbmZpZ1NsaWRlclxuICAgICAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1MucmFkaXVzfVxuICAgICAgICAgICAgICB7Li4udmlzQ29uZmlndXJhdG9yUHJvcHN9XG4gICAgICAgICAgICAgIGxhYmVsPVwiUG9pbnQgUmFkaXVzXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e0Jvb2xlYW4obGF5ZXIuY29uZmlnLnJhZGl1c0ZpZWxkKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2hhbm5lbEJ5VmFsdWVTZWxlY3RvclxuICAgICAgICAgICAgICBjaGFubmVsPXtsYXllci52aXN1YWxDaGFubmVscy5yYWRpdXN9XG4gICAgICAgICAgICAgIHsuLi5sYXllckNoYW5uZWxDb25maWdQcm9wc31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8VmlzQ29uZmlnU2xpZGVyXG4gICAgICAgICAgICAgIHsuLi5MQVlFUl9WSVNfQ09ORklHUy5yYWRpdXNSYW5nZX1cbiAgICAgICAgICAgICAgey4uLnZpc0NvbmZpZ3VyYXRvclByb3BzfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17IWxheWVyLmNvbmZpZy5yYWRpdXNGaWVsZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuXG4gICAgICAgIHsvKiBoaWdoIHByZWNpc2lvbiAqL31cbiAgICAgICAgPExheWVyQ29uZmlnR3JvdXBcbiAgICAgICAgICB7Li4uTEFZRVJfVklTX0NPTkZJR1NbJ2hpLXByZWNpc2lvbiddfVxuICAgICAgICAgIHsuLi52aXNDb25maWd1cmF0b3JQcm9wc31cbiAgICAgICAgLz5cbiAgICAgIDwvU3R5bGVkTGF5ZXJWaXN1YWxDb25maWd1cmF0b3I+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7XG4gICAgICBsYXllcixcbiAgICAgIGRhdGFzZXRzLFxuICAgICAgdXBkYXRlTGF5ZXJDb25maWcsXG4gICAgICBsYXllclR5cGVPcHRpb25zLFxuICAgICAgdXBkYXRlTGF5ZXJUeXBlXG4gICAgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2ZpZWxkcyA9IFtdLCBmaWVsZFBhaXJzfSA9IGxheWVyLmNvbmZpZy5kYXRhSWRcbiAgICAgID8gZGF0YXNldHNbbGF5ZXIuY29uZmlnLmRhdGFJZF1cbiAgICAgIDoge307XG4gICAgY29uc3Qge2NvbmZpZ30gPSBsYXllcjtcblxuICAgIGNvbnN0IGNvbW1vbkNvbmZpZ1Byb3AgPSB7XG4gICAgICBsYXllcixcbiAgICAgIGZpZWxkc1xuICAgIH07XG5cbiAgICBjb25zdCB2aXNDb25maWd1cmF0b3JQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdGhpcy5wcm9wcy51cGRhdGVMYXllclZpc0NvbmZpZ1xuICAgIH07XG5cbiAgICBjb25zdCBsYXllckNvbmZpZ3VyYXRvclByb3BzID0ge1xuICAgICAgLi4uY29tbW9uQ29uZmlnUHJvcCxcbiAgICAgIG9uQ2hhbmdlOiB1cGRhdGVMYXllckNvbmZpZ1xuICAgIH07XG5cbiAgICBjb25zdCBsYXllckNoYW5uZWxDb25maWdQcm9wcyA9IHtcbiAgICAgIC4uLmNvbW1vbkNvbmZpZ1Byb3AsXG4gICAgICBvbkNoYW5nZTogdGhpcy5wcm9wcy51cGRhdGVMYXllclZpc3VhbENoYW5uZWxDb25maWdcbiAgICB9O1xuXG4gICAgY29uc3QgcmVuZGVyVGVtcGxhdGUgPVxuICAgICAgbGF5ZXIudHlwZSAmJiBgX3JlbmRlciR7Y2FwaXRhbGl6ZUZpcnN0TGV0dGVyKGxheWVyLnR5cGUpfUxheWVyQ29uZmlnYDtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVkTGF5ZXJDb25maWd1cmF0b3I+XG4gICAgICAgIHtsYXllci5sYXllckluZm9Nb2RhbCA/IDxIb3dUb0J1dHRvbiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLm9wZW5Nb2RhbChsYXllci5sYXllckluZm9Nb2RhbCl9Lz4gOiBudWxsfVxuICAgICAgICA8TGF5ZXJDb25maWdHcm91cCBsYWJlbD17J2Jhc2ljJ30+XG4gICAgICAgICAge09iamVjdC5rZXlzKGRhdGFzZXRzKS5sZW5ndGggPiAxICYmIChcbiAgICAgICAgICAgIDxTb3VyY2VEYXRhU2VsZWN0b3JcbiAgICAgICAgICAgICAgZGF0YXNldHM9e2RhdGFzZXRzfVxuICAgICAgICAgICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtsYXllci50eWVwICYmIGNvbmZpZy5jb2x1bW5zfVxuICAgICAgICAgICAgICBkYXRhSWQ9e2NvbmZpZy5kYXRhSWR9XG4gICAgICAgICAgICAgIG9uU2VsZWN0PXt2YWx1ZSA9PiB1cGRhdGVMYXllckNvbmZpZyh7ZGF0YUlkOiB2YWx1ZX0pfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxMYXllclR5cGVTZWxlY3RvclxuICAgICAgICAgICAgbGF5ZXI9e2xheWVyfVxuICAgICAgICAgICAgbGF5ZXJUeXBlT3B0aW9ucz17bGF5ZXJUeXBlT3B0aW9uc31cbiAgICAgICAgICAgIG9uU2VsZWN0PXt1cGRhdGVMYXllclR5cGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8TGF5ZXJDb2x1bW5Db25maWdcbiAgICAgICAgICAgIGxheWVyPXtsYXllcn1cbiAgICAgICAgICAgIGZpZWxkcz17ZmllbGRzfVxuICAgICAgICAgICAgZmllbGRQYWlycz17ZmllbGRQYWlyc31cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyQ29uZmlnPXt1cGRhdGVMYXllckNvbmZpZ31cbiAgICAgICAgICAgIHVwZGF0ZUxheWVyVHlwZT17dGhpcy5wcm9wcy51cGRhdGVMYXllclR5cGV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9MYXllckNvbmZpZ0dyb3VwPlxuICAgICAgICB7dGhpc1tyZW5kZXJUZW1wbGF0ZV0gJiZcbiAgICAgICAgICB0aGlzW3JlbmRlclRlbXBsYXRlXSh7XG4gICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgIHZpc0NvbmZpZ3VyYXRvclByb3BzLFxuICAgICAgICAgICAgbGF5ZXJDaGFubmVsQ29uZmlnUHJvcHMsXG4gICAgICAgICAgICBsYXllckNvbmZpZ3VyYXRvclByb3BzXG4gICAgICAgICAgfSl9XG4gICAgICA8L1N0eWxlZExheWVyQ29uZmlndXJhdG9yPlxuICAgICk7XG4gIH1cbn1cblxuLypcbiAqIENvbXBvbmVudGl6ZSBjb25maWcgY29tcG9uZW50IGludG8gcHVyZSBmdW5jdGlvbmFsIGNvbXBvbmVudHNcbiAqL1xuXG5jb25zdCBTdHlsZWRIb3dUb0J1dHRvbiA9IHN0eWxlZC5kaXZgXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDA7XG4gIHRvcDogMDtcbmA7XG5cbmV4cG9ydCBjb25zdCBIb3dUb0J1dHRvbiA9ICh7b25DbGlja30pID0+IChcbiAgPFN0eWxlZEhvd1RvQnV0dG9uPlxuICAgIDxCdXR0b24gc2Vjb25kYXJ5IHNtYWxsIG9uQ2xpY2s9e29uQ2xpY2t9PkhvdyB0bzwvQnV0dG9uPlxuICA8L1N0eWxlZEhvd1RvQnV0dG9uPlxuKTtcblxuZXhwb3J0IGNvbnN0IExheWVyQ29sb3JTZWxlY3RvciA9ICh7bGF5ZXIsIG9uQ2hhbmdlLCBsYWJlbH0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24gZGlzYWJsZWQ9e2xheWVyLmNvbmZpZy5jb2xvckZpZWxkfT5cbiAgICA8Q29sb3JTZWxlY3RvclxuICAgICAgY29sb3JTZXRzPXtbXG4gICAgICAgIHtcbiAgICAgICAgICBzZWxlY3RlZENvbG9yOiBsYXllci5jb25maWcuY29sb3IsXG4gICAgICAgICAgc2V0Q29sb3I6IHJnYlZhbHVlID0+IG9uQ2hhbmdlKHtjb2xvcjogcmdiVmFsdWV9KVxuICAgICAgICB9XG4gICAgICBdfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBBcmNMYXllckNvbG9yU2VsZWN0b3IgPSAoe1xuICBsYXllcixcbiAgb25DaGFuZ2VDb25maWcsXG4gIG9uQ2hhbmdlVmlzQ29uZmlnXG59KSA9PiAoXG4gIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgIDxDb2xvclNlbGVjdG9yXG4gICAgICBjb2xvclNldHM9e1tcbiAgICAgICAge1xuICAgICAgICAgIHNlbGVjdGVkQ29sb3I6IGxheWVyLmNvbmZpZy5jb2xvcixcbiAgICAgICAgICBzZXRDb2xvcjogcmdiVmFsdWUgPT4gb25DaGFuZ2VDb25maWcoe2NvbG9yOiByZ2JWYWx1ZX0pLFxuICAgICAgICAgIGxhYmVsOiAnU291cmNlJ1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjpcbiAgICAgICAgICAgIGxheWVyLmNvbmZpZy52aXNDb25maWcudGFyZ2V0Q29sb3IgfHwgbGF5ZXIuY29uZmlnLmNvbG9yLFxuICAgICAgICAgIHNldENvbG9yOiByZ2JWYWx1ZSA9PiBvbkNoYW5nZVZpc0NvbmZpZyh7dGFyZ2V0Q29sb3I6IHJnYlZhbHVlfSksXG4gICAgICAgICAgbGFiZWw6ICdUYXJnZXQnXG4gICAgICAgIH1cbiAgICAgIF19XG4gICAgLz5cbiAgPC9TaWRlUGFuZWxTZWN0aW9uPlxuKTtcblxuZXhwb3J0IGNvbnN0IENvbG9yUmFuZ2VDb25maWcgPSAoe2xheWVyLCBvbkNoYW5nZX0pID0+IChcbiAgPFNpZGVQYW5lbFNlY3Rpb24+XG4gICAgPENvbG9yU2VsZWN0b3JcbiAgICAgIGNvbG9yU2V0cz17W1xuICAgICAgICB7XG4gICAgICAgICAgc2VsZWN0ZWRDb2xvcjogbGF5ZXIuY29uZmlnLnZpc0NvbmZpZy5jb2xvclJhbmdlLFxuICAgICAgICAgIGlzUmFuZ2U6IHRydWUsXG4gICAgICAgICAgc2V0Q29sb3I6IGNvbG9yUmFuZ2UgPT4gb25DaGFuZ2Uoe2NvbG9yUmFuZ2V9KVxuICAgICAgICB9XG4gICAgICBdfVxuICAgIC8+XG4gIDwvU2lkZVBhbmVsU2VjdGlvbj5cbik7XG5cbmV4cG9ydCBjb25zdCBDaGFubmVsQnlWYWx1ZVNlbGVjdG9yID0gKHtcbiAgbGF5ZXIsXG4gIGNoYW5uZWwsXG4gIG9uQ2hhbmdlLFxuICBmaWVsZHMsXG4gIGRlc2NyaXB0aW9uXG59KSA9PiB7XG4gIGNvbnN0IHtcbiAgICBjaGFubmVsU2NhbGVUeXBlLFxuICAgIGRvbWFpbixcbiAgICBmaWVsZCxcbiAgICBrZXksXG4gICAgcHJvcGVydHksXG4gICAgcmFuZ2UsXG4gICAgc2NhbGUsXG4gICAgZGVmYXVsdE1lYXN1cmUsXG4gICAgc3VwcG9ydGVkRmllbGRUeXBlc1xuICB9ID0gY2hhbm5lbDtcbiAgY29uc3QgY2hhbm5lbFN1cHBvcnRlZEZpZWxkVHlwZXMgPSBzdXBwb3J0ZWRGaWVsZFR5cGVzIHx8IENIQU5ORUxfU0NBTEVfU1VQUE9SVEVEX0ZJRUxEU1tjaGFubmVsU2NhbGVUeXBlXTtcbiAgY29uc3Qgc3VwcG9ydGVkRmllbGRzID0gZmllbGRzLmZpbHRlcigoe3R5cGV9KSA9PlxuICAgIGNoYW5uZWxTdXBwb3J0ZWRGaWVsZFR5cGVzLmluY2x1ZGVzKHR5cGUpXG4gICk7XG4gIGNvbnN0IHNjYWxlT3B0aW9ucyA9IGxheWVyLmdldFNjYWxlT3B0aW9ucyhjaGFubmVsLmtleSk7XG4gIGNvbnN0IHNob3dTY2FsZSA9ICFsYXllci5pc0FnZ3JlZ2F0ZWQgJiYgbGF5ZXIuY29uZmlnW3NjYWxlXSAmJiBzY2FsZU9wdGlvbnMubGVuZ3RoID4gMTtcbiAgY29uc3QgZGVmYXVsdERlc2NyaXB0aW9uID0gYENhbGN1bGF0ZSAke3Byb3BlcnR5fSBiYXNlZCBvbiBzZWxlY3RlZCBmaWVsZGA7XG5cbiAgcmV0dXJuIChcbiAgICA8VmlzQ29uZmlnQnlGaWVsZFNlbGVjdG9yXG4gICAgICBjaGFubmVsPXtjaGFubmVsLmtleX1cbiAgICAgIGRlc2NyaXB0aW9uPXtkZXNjcmlwdGlvbiB8fCBkZWZhdWx0RGVzY3JpcHRpb259XG4gICAgICBkb21haW49e2xheWVyLmNvbmZpZ1tkb21haW5dfVxuICAgICAgZmllbGRzPXtzdXBwb3J0ZWRGaWVsZHN9XG4gICAgICBpZD17bGF5ZXIuaWR9XG4gICAgICBrZXk9e2Ake2tleX0tY2hhbm5lbC1zZWxlY3RvcmB9XG4gICAgICBwcm9wZXJ0eT17cHJvcGVydHl9XG4gICAgICBwbGFjZWhvbGRlcj17ZGVmYXVsdE1lYXN1cmUgfHwgJ1NlbGVjdCBhIGZpZWxkJ31cbiAgICAgIHJhbmdlPXtsYXllci5jb25maWcudmlzQ29uZmlnW3JhbmdlXX1cbiAgICAgIHNjYWxlT3B0aW9ucz17c2NhbGVPcHRpb25zfVxuICAgICAgc2NhbGVUeXBlPXtzY2FsZSA/IGxheWVyLmNvbmZpZ1tzY2FsZV0gOiBudWxsfVxuICAgICAgc2VsZWN0ZWRGaWVsZD17bGF5ZXIuY29uZmlnW2ZpZWxkXX1cbiAgICAgIHNob3dTY2FsZT17c2hvd1NjYWxlfVxuICAgICAgdXBkYXRlRmllbGQ9e3ZhbCA9PiBvbkNoYW5nZSh7W2ZpZWxkXTogdmFsfSwga2V5KX1cbiAgICAgIHVwZGF0ZVNjYWxlPXt2YWwgPT4gb25DaGFuZ2Uoe1tzY2FsZV06IHZhbH0sIGtleSl9XG4gICAgLz5cbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBBZ2dyQ29sb3JTY2FsZVNlbGVjdG9yID0gKHtsYXllciwgb25DaGFuZ2V9KSA9PiB7XG4gIGNvbnN0IHNjYWxlT3B0aW9ucyA9IGxheWVyLmdldFNjYWxlT3B0aW9ucygnY29sb3InKTtcbiAgcmV0dXJuIChcbiAgICBBcnJheS5pc0FycmF5KHNjYWxlT3B0aW9ucykgJiYgc2NhbGVPcHRpb25zLmxlbmd0aCA+IDEgP1xuICAgICAgPERpbWVuc2lvblNjYWxlU2VsZWN0b3JcbiAgICAgICAgbGFiZWw9XCJDb2xvciBTY2FsZVwiXG4gICAgICAgIG9wdGlvbnM9e3NjYWxlT3B0aW9uc31cbiAgICAgICAgc2NhbGVUeXBlPXtsYXllci5jb25maWcuY29sb3JTY2FsZX1cbiAgICAgICAgb25TZWxlY3Q9e3ZhbCA9PiBvbkNoYW5nZSh7Y29sb3JTY2FsZTogdmFsfSwgJ2NvbG9yJyl9XG4gICAgICAvPiA6IG51bGxcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBBZ2dyZWdhdGlvblR5cGVTZWxlY3RvciA9ICh7bGF5ZXIsIGNoYW5uZWwsIG9uQ2hhbmdlfSkgPT4ge1xuICBjb25zdCB7ZmllbGQsIGFnZ3JlZ2F0aW9uLCBrZXl9ID0gY2hhbm5lbDtcbiAgY29uc3Qgc2VsZWN0ZWRGaWVsZCA9IGxheWVyLmNvbmZpZ1tmaWVsZF07XG4gIGNvbnN0IHt2aXNDb25maWd9ID0gbGF5ZXIuY29uZmlnO1xuXG4gIC8vIGFnZ3JlZ2F0aW9uIHNob3VsZCBvbmx5IGJlIHNlbGVjdGFibGUgd2hlbiBmaWVsZCBpcyBzZWxlY3RlZFxuICBjb25zdCBhZ2dyZWdhdGlvbk9wdGlvbnMgPSBsYXllci5nZXRBZ2dyZWdhdGlvbk9wdGlvbnMoa2V5KTtcblxuICByZXR1cm4gKFxuICAgIDxTaWRlUGFuZWxTZWN0aW9uPlxuICAgICAgPFBhbmVsTGFiZWw+e2BBZ2dyZWdhdGUgJHtzZWxlY3RlZEZpZWxkLm5hbWV9IGJ5YH08L1BhbmVsTGFiZWw+XG4gICAgICA8SXRlbVNlbGVjdG9yXG4gICAgICAgIHNlbGVjdGVkSXRlbXM9e3Zpc0NvbmZpZ1thZ2dyZWdhdGlvbl19XG4gICAgICAgIG9wdGlvbnM9e2FnZ3JlZ2F0aW9uT3B0aW9uc31cbiAgICAgICAgbXVsdGlTZWxlY3Q9e2ZhbHNlfVxuICAgICAgICBzZWFyY2hhYmxlPXtmYWxzZX1cbiAgICAgICAgb25DaGFuZ2U9e3ZhbHVlID0+XG4gICAgICAgICAgb25DaGFuZ2UoXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZpc0NvbmZpZzoge1xuICAgICAgICAgICAgICAgIC4uLmxheWVyLmNvbmZpZy52aXNDb25maWcsXG4gICAgICAgICAgICAgICAgW2FnZ3JlZ2F0aW9uXTogdmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNoYW5uZWwua2V5XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICAvPlxuICAgIDwvU2lkZVBhbmVsU2VjdGlvbj5cbiAgKTtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1wYXJhbXMgKi9cbiJdfQ==