'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadFilesErrUpdater = exports.loadFilesUpdater = exports.updateVisDataUpdater = exports.toggleLayerForMapUpdater = exports.setVisibleLayersForMapUpdater = exports.toggleSplitMapUpdater = exports.mapClickUpdater = exports.layerClickUpdater = exports.layerHoverUpdater = exports.receiveMapConfigUpdater = exports.resetMapConfigVisStateUpdater = exports.showDatasetTableUpdater = exports.updateLayerBlendingUpdater = exports.removeDatasetUpdater = exports.reorderLayerUpdater = exports.removeLayerUpdater = exports.addLayerUpdater = exports.removeFilterUpdater = exports.enlargeFilterUpdater = exports.updateAnimationSpeedUpdater = exports.toggleFilterAnimationUpdater = exports.addFilterUpdater = exports.setFilterPlotUpdater = exports.INITIAL_VIS_STATE = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends13 = require('babel-runtime/helpers/extends');

var _extends14 = _interopRequireDefault(_extends13);

exports.layerConfigChangeUpdater = layerConfigChangeUpdater;
exports.layerTypeChangeUpdater = layerTypeChangeUpdater;
exports.layerVisualChannelChangeUpdater = layerVisualChannelChangeUpdater;
exports.layerVisConfigChangeUpdater = layerVisConfigChangeUpdater;
exports.interactionConfigChangeUpdater = interactionConfigChangeUpdater;
exports.setFilterUpdater = setFilterUpdater;
exports.addDefaultLayers = addDefaultLayers;
exports.addDefaultTooltips = addDefaultTooltips;
exports.updateAllLayerDomainData = updateAllLayerDomainData;

var _window = require('global/window');

var _tasks = require('react-palm/tasks');

var _tasks2 = _interopRequireDefault(_tasks);

var _tasks3 = require('../tasks/tasks');

var _visStateActions = require('../actions/vis-state-actions');

var _actions = require('../actions');

var _interactionUtils = require('../utils/interaction-utils');

var _utils = require('../utils/utils');

var _filterUtils = require('../utils/filter-utils');

var _datasetUtils = require('../utils/dataset-utils');

var _layerUtils = require('../utils/layer-utils/layer-utils');

var _fileHandler = require('../processors/file-handler');

var _visStateMerger = require('./vis-state-merger');

var _layers = require('../layers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// react-palm
// disable capture exception for react-palm call to withTask


// Tasks
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

(0, _tasks.disableStackCapturing)();

// LayerClasses contain ES6 Class, do not instatiate in iso rendering
// const {LayerClasses} = isBrowser || isTesting ?
//   require('layers') : {
//     LayerClasses: {}
//   };

// Utils


// Actions
var INITIAL_VIS_STATE = exports.INITIAL_VIS_STATE = {
  // layers
  layers: [],
  layerData: [],
  layerToBeMerged: [],
  layerOrder: [],

  // filters
  filters: [],
  filterToBeMerged: [],

  // a collection of multiple dataset
  datasets: {},
  editingDataset: undefined,

  interactionConfig: (0, _interactionUtils.getDefaultInteraction)(),
  interactionToBeMerged: undefined,

  layerBlending: 'normal',
  hoverInfo: undefined,
  clicked: undefined,

  fileLoading: false,
  fileLoadingErr: null,

  // this is used when user split maps
  splitMaps: [
    // this will contain a list of objects to
    // describe the state of layer availability and visibility for each map
    // [
    //   {
    //     layers: {
    //       layer_id: {
    //         isAvailable: true|false # this is driven by the left hand panel
    //         isVisible: true|false
    //       }
    //     }
    //   }
    // ]
  ],

  // defaults layer classes
  layerClasses: _layers.LayerClasses
};

function updateStateWithLayerAndData(state, _ref) {
  var layerData = _ref.layerData,
      layer = _ref.layer,
      idx = _ref.idx;

  return (0, _extends14.default)({}, state, {
    layers: state.layers.map(function (lyr, i) {
      return i === idx ? layer : lyr;
    }),
    layerData: layerData ? state.layerData.map(function (d, i) {
      return i === idx ? layerData : d;
    }) : state.layerData
  });
}

/**
 * Called to update layer base config: dataId, label, column, isVisible
 *
 */
function layerConfigChangeUpdater(state, action) {
  var oldLayer = action.oldLayer;

  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var props = Object.keys(action.newConfig);

  var newLayer = oldLayer.updateLayerConfig(action.newConfig);
  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];

    var _calculateLayerData = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, { sameData: true }),
        layerData = _calculateLayerData.layerData,
        layer = _calculateLayerData.layer;

    return updateStateWithLayerAndData(state, { layerData: layerData, layer: layer, idx: idx });
  }

  var newState = (0, _extends14.default)({}, state, {
    splitMaps: 'isVisible' in action.newConfig ? toggleLayerFromSplitMaps(state, newLayer) : state.splitMaps
  });

  return updateStateWithLayerAndData(newState, { layer: newLayer, idx: idx });
}

function layerTypeChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newType = action.newType;

  var oldId = oldLayer.id;
  var idx = state.layers.findIndex(function (l) {
    return l.id === oldId;
  });

  if (!state.layerClasses[newType]) {
    _window.console.error(newType + ' is not a valid layer type');
    return state;
  }

  // get a mint layer, with new id and type
  // because deck.gl uses id to match between new and old layer.
  // If type has changed but id is the same, it will break
  var newLayer = new state.layerClasses[newType]();

  newLayer.assignConfigToLayer(oldLayer.config, oldLayer.visConfigSettings);

  if (newLayer.config.dataId) {
    var dataset = state.datasets[newLayer.config.dataId];
    newLayer.updateLayerDomain(dataset);
  }

  var _calculateLayerData2 = (0, _layerUtils.calculateLayerData)(newLayer, state),
      layerData = _calculateLayerData2.layerData,
      layer = _calculateLayerData2.layer;

  var newState = state;

  // update splitMap layer id
  if (state.splitMaps) {
    newState = (0, _extends14.default)({}, state, {
      splitMaps: state.splitMaps.map(function (settings) {
        var _settings$layers = settings.layers,
            oldLayerMap = _settings$layers[oldId],
            otherLayers = (0, _objectWithoutProperties3.default)(_settings$layers, [oldId]);

        return (0, _extends14.default)({}, settings, {
          layers: (0, _extends14.default)({}, otherLayers, (0, _defineProperty3.default)({}, layer.id, oldLayerMap))
        });
      })
    });
  }

  return updateStateWithLayerAndData(newState, { layerData: layerData, layer: layer, idx: idx });
}

function layerVisualChannelChangeUpdater(state, action) {
  var oldLayer = action.oldLayer,
      newConfig = action.newConfig,
      channel = action.channel;

  var dataset = state.datasets[oldLayer.config.dataId];

  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var newLayer = oldLayer.updateLayerConfig(newConfig);

  newLayer.updateLayerVisualChannel(dataset, channel);

  var oldLayerData = state.layerData[idx];

  var _calculateLayerData3 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, {
    sameData: true
  }),
      layerData = _calculateLayerData3.layerData,
      layer = _calculateLayerData3.layer;

  return updateStateWithLayerAndData(state, { layerData: layerData, layer: layer, idx: idx });
}

function layerVisConfigChangeUpdater(state, action) {
  var oldLayer = action.oldLayer;

  var idx = state.layers.findIndex(function (l) {
    return l.id === oldLayer.id;
  });
  var props = Object.keys(action.newVisConfig);

  var newVisConfig = (0, _extends14.default)({}, oldLayer.config.visConfig, action.newVisConfig);

  var newLayer = oldLayer.updateLayerConfig({ visConfig: newVisConfig });

  if (newLayer.shouldCalculateLayerData(props)) {
    var oldLayerData = state.layerData[idx];

    var _calculateLayerData4 = (0, _layerUtils.calculateLayerData)(newLayer, state, oldLayerData, { sameData: true }),
        layerData = _calculateLayerData4.layerData,
        layer = _calculateLayerData4.layer;

    return updateStateWithLayerAndData(state, { layerData: layerData, layer: layer, idx: idx });
  }

  return updateStateWithLayerAndData(state, { layer: newLayer, idx: idx });
}

/* eslint-enable max-statements */

function interactionConfigChangeUpdater(state, action) {
  var config = action.config;


  var interactionConfig = (0, _extends14.default)({}, state.interactionConfig, (0, _defineProperty3.default)({}, config.id, config));

  if (config.enabled && !state.interactionConfig[config.id].enabled) {
    // only enable one interaction at a time
    Object.keys(interactionConfig).forEach(function (k) {
      if (k !== config.id) {
        interactionConfig[k] = (0, _extends14.default)({}, interactionConfig[k], { enabled: false });
      }
    });
  }

  return (0, _extends14.default)({}, state, {
    interactionConfig: interactionConfig
  });
}

function setFilterUpdater(state, action) {
  var idx = action.idx,
      prop = action.prop,
      value = action.value;

  var newState = state;
  var newFilter = (0, _extends14.default)({}, state.filters[idx], (0, _defineProperty3.default)({}, prop, value));

  var _newFilter = newFilter,
      dataId = _newFilter.dataId;

  if (!dataId) {
    return state;
  }
  var _state$datasets$dataI = state.datasets[dataId],
      fields = _state$datasets$dataI.fields,
      allData = _state$datasets$dataI.allData;


  switch (prop) {
    case 'dataId':
      // if trying to update filter dataId. create an empty new filter
      newFilter = (0, _filterUtils.getDefaultFilter)(dataId);
      break;

    case 'name':
      // find the field
      var fieldIdx = fields.findIndex(function (f) {
        return f.name === value;
      });
      var field = fields[fieldIdx];

      if (!field.filterProp) {
        // get filter domain from field
        // save filterProps: {domain, steps, value} to field, avoid recalculate
        field = (0, _extends14.default)({}, field, {
          filterProp: (0, _filterUtils.getFilterProps)(allData, field)
        });
      }

      newFilter = (0, _extends14.default)({}, newFilter, field.filterProp, {
        name: field.name,
        // can't edit dataId once name is selected
        freeze: true,
        fieldIdx: fieldIdx
      });
      var enlargedFilterIdx = state.filters.findIndex(function (f) {
        return f.enlarged;
      });
      if (enlargedFilterIdx > -1 && enlargedFilterIdx !== idx) {
        // there should be only one enlarged filter
        newFilter.enlarged = false;
      }

      newState = (0, _extends14.default)({}, state, {
        datasets: (0, _extends14.default)({}, state.datasets, (0, _defineProperty3.default)({}, dataId, (0, _extends14.default)({}, state.datasets[dataId], {
          fields: fields.map(function (d, i) {
            return i === fieldIdx ? field : d;
          })
        })))
      });
      break;
    case 'value':
    default:
      break;
  }

  // save new filters to newState
  newState = (0, _extends14.default)({}, newState, {
    filters: state.filters.map(function (f, i) {
      return i === idx ? newFilter : f;
    })
  });

  // filter data
  newState = (0, _extends14.default)({}, newState, {
    datasets: (0, _extends14.default)({}, newState.datasets, (0, _defineProperty3.default)({}, dataId, (0, _extends14.default)({}, newState.datasets[dataId], (0, _filterUtils.filterData)(allData, dataId, newState.filters))))
  });

  newState = updateAllLayerDomainData(newState, dataId, newFilter);

  return newState;
}

var setFilterPlotUpdater = exports.setFilterPlotUpdater = function setFilterPlotUpdater(state, _ref2) {
  var idx = _ref2.idx,
      newProp = _ref2.newProp;

  var newFilter = (0, _extends14.default)({}, state.filters[idx], newProp);
  var prop = Object.keys(newProp)[0];
  if (prop === 'yAxis') {
    var plotType = (0, _filterUtils.getDefaultFilterPlotType)(newFilter);

    if (plotType) {
      newFilter = (0, _extends14.default)({}, newFilter, (0, _filterUtils.getFilterPlot)((0, _extends14.default)({}, newFilter, { plotType: plotType }), state.datasets[newFilter.dataId].allData), {
        plotType: plotType
      });
    }
  }

  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === idx ? newFilter : f;
    })
  });
};

var addFilterUpdater = exports.addFilterUpdater = function addFilterUpdater(state, action) {
  return !action.dataId ? state : (0, _extends14.default)({}, state, {
    filters: [].concat((0, _toConsumableArray3.default)(state.filters), [(0, _filterUtils.getDefaultFilter)(action.dataId)])
  });
};

var toggleFilterAnimationUpdater = exports.toggleFilterAnimationUpdater = function toggleFilterAnimationUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? (0, _extends14.default)({}, f, { isAnimating: !f.isAnimating }) : f;
    })
  });
};

var updateAnimationSpeedUpdater = exports.updateAnimationSpeedUpdater = function updateAnimationSpeedUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      return i === action.idx ? (0, _extends14.default)({}, f, { speed: action.speed }) : f;
    })
  });
};

var enlargeFilterUpdater = exports.enlargeFilterUpdater = function enlargeFilterUpdater(state, action) {
  var isEnlarged = state.filters[action.idx].enlarged;

  return (0, _extends14.default)({}, state, {
    filters: state.filters.map(function (f, i) {
      f.enlarged = !isEnlarged && i === action.idx;
      return f;
    })
  });
};

var removeFilterUpdater = exports.removeFilterUpdater = function removeFilterUpdater(state, action) {
  var idx = action.idx;
  var dataId = state.filters[idx].dataId;


  var newFilters = [].concat((0, _toConsumableArray3.default)(state.filters.slice(0, idx)), (0, _toConsumableArray3.default)(state.filters.slice(idx + 1, state.filters.length)));

  var newState = (0, _extends14.default)({}, state, {
    datasets: (0, _extends14.default)({}, state.datasets, (0, _defineProperty3.default)({}, dataId, (0, _extends14.default)({}, state.datasets[dataId], (0, _filterUtils.filterData)(state.datasets[dataId].allData, dataId, newFilters)))),
    filters: newFilters
  });

  return updateAllLayerDomainData(newState, dataId);
};

var addLayerUpdater = exports.addLayerUpdater = function addLayerUpdater(state, action) {
  var defaultDataset = Object.keys(state.datasets)[0];
  var newLayer = new _layers.Layer((0, _extends14.default)({
    isVisible: true,
    isConfigActive: true,
    dataId: defaultDataset
  }, action.props));

  return (0, _extends14.default)({}, state, {
    layers: [].concat((0, _toConsumableArray3.default)(state.layers), [newLayer]),
    layerData: [].concat((0, _toConsumableArray3.default)(state.layerData), [{}]),
    layerOrder: [].concat((0, _toConsumableArray3.default)(state.layerOrder), [state.layerOrder.length]),
    splitMaps: addNewLayersToSplitMap(state.splitMaps, newLayer)
  });
};

var removeLayerUpdater = exports.removeLayerUpdater = function removeLayerUpdater(state, _ref3) {
  var idx = _ref3.idx;
  var layers = state.layers,
      layerData = state.layerData,
      clicked = state.clicked,
      hoverInfo = state.hoverInfo;

  var layerToRemove = state.layers[idx];
  var newMaps = removeLayerFromSplitMaps(state, layerToRemove);

  return (0, _extends14.default)({}, state, {
    layers: [].concat((0, _toConsumableArray3.default)(layers.slice(0, idx)), (0, _toConsumableArray3.default)(layers.slice(idx + 1, layers.length))),
    layerData: [].concat((0, _toConsumableArray3.default)(layerData.slice(0, idx)), (0, _toConsumableArray3.default)(layerData.slice(idx + 1, layerData.length))),
    layerOrder: state.layerOrder.filter(function (i) {
      return i !== idx;
    }).map(function (pid) {
      return pid > idx ? pid - 1 : pid;
    }),
    clicked: layerToRemove.isLayerHovered(clicked) ? undefined : clicked,
    hoverInfo: layerToRemove.isLayerHovered(hoverInfo) ? undefined : hoverInfo,
    splitMaps: newMaps
  });
};

var reorderLayerUpdater = exports.reorderLayerUpdater = function reorderLayerUpdater(state, _ref4) {
  var order = _ref4.order;
  return (0, _extends14.default)({}, state, {
    layerOrder: order
  });
};

var removeDatasetUpdater = function removeDatasetUpdater(state, action) {
  // extract dataset key
  var datasetKey = action.key;
  var datasets = state.datasets;

  // check if dataset is present

  if (!datasets[datasetKey]) {
    return state;
  }

  /* eslint-disable no-unused-vars */
  var layers = state.layers,
      _state$datasets = state.datasets,
      dataset = _state$datasets[datasetKey],
      newDatasets = (0, _objectWithoutProperties3.default)(_state$datasets, [datasetKey]);
  /* eslint-enable no-unused-vars */

  var indexes = layers.reduce(function (listOfIndexes, layer, index) {
    if (layer.config.dataId === datasetKey) {
      listOfIndexes.push(index);
    }
    return listOfIndexes;
  }, []);

  // remove layers and datasets

  var _indexes$reduce = indexes.reduce(function (_ref5, idx) {
    var currentState = _ref5.newState,
        indexCounter = _ref5.indexCounter;

    var currentIndex = idx - indexCounter;
    currentState = removeLayerUpdater(currentState, { idx: currentIndex });
    indexCounter++;
    return { newState: currentState, indexCounter: indexCounter };
  }, { newState: (0, _extends14.default)({}, state, { datasets: newDatasets }), indexCounter: 0 }),
      newState = _indexes$reduce.newState;

  // remove filters


  var filters = state.filters.filter(function (filter) {
    return filter.dataId !== datasetKey;
  });

  // update interactionConfig
  var interactionConfig = state.interactionConfig;
  var _interactionConfig = interactionConfig,
      tooltip = _interactionConfig.tooltip;

  if (tooltip) {
    var config = tooltip.config;
    /* eslint-disable no-unused-vars */

    var _config$fieldsToShow = config.fieldsToShow,
        fields = _config$fieldsToShow[datasetKey],
        fieldsToShow = (0, _objectWithoutProperties3.default)(_config$fieldsToShow, [datasetKey]);
    /* eslint-enable no-unused-vars */

    interactionConfig = (0, _extends14.default)({}, interactionConfig, {
      tooltip: (0, _extends14.default)({}, tooltip, { config: (0, _extends14.default)({}, config, { fieldsToShow: fieldsToShow }) })
    });
  }

  return (0, _extends14.default)({}, newState, { filters: filters, interactionConfig: interactionConfig });
};

exports.removeDatasetUpdater = removeDatasetUpdater;
var updateLayerBlendingUpdater = exports.updateLayerBlendingUpdater = function updateLayerBlendingUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    layerBlending: action.mode
  });
};

var showDatasetTableUpdater = exports.showDatasetTableUpdater = function showDatasetTableUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    editingDataset: action.dataId
  });
};

var resetMapConfigVisStateUpdater = exports.resetMapConfigVisStateUpdater = function resetMapConfigVisStateUpdater(state, action) {
  return (0, _extends14.default)({}, INITIAL_VIS_STATE, state.initialState, {
    initialState: state.initialState
  });
};

/**
 * Loads custom configuration into state
 * @param state
 * @param action
 * @returns {*}
 */
var receiveMapConfigUpdater = exports.receiveMapConfigUpdater = function receiveMapConfigUpdater(state, action) {
  if (!action.payload.visState) {
    return state;
  }

  var _action$payload$visSt = action.payload.visState,
      filters = _action$payload$visSt.filters,
      layers = _action$payload$visSt.layers,
      interactionConfig = _action$payload$visSt.interactionConfig,
      layerBlending = _action$payload$visSt.layerBlending,
      splitMaps = _action$payload$visSt.splitMaps;

  // always reset config when receive a new config

  var resetState = resetMapConfigVisStateUpdater(state);
  var mergedState = (0, _extends14.default)({}, resetState, {
    splitMaps: splitMaps || [] // maps doesn't require any logic
  });

  mergedState = (0, _visStateMerger.mergeFilters)(mergedState, filters);
  mergedState = (0, _visStateMerger.mergeLayers)(mergedState, layers);
  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionConfig);
  mergedState = (0, _visStateMerger.mergeLayerBlending)(mergedState, layerBlending);

  return mergedState;
};

var layerHoverUpdater = exports.layerHoverUpdater = function layerHoverUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    hoverInfo: action.info
  });
};

var layerClickUpdater = exports.layerClickUpdater = function layerClickUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    clicked: action.info && action.info.picked ? action.info : null
  });
};

var mapClickUpdater = exports.mapClickUpdater = function mapClickUpdater(state, action) {
  return (0, _extends14.default)({}, state, {
    clicked: null
  });
};

var toggleSplitMapUpdater = exports.toggleSplitMapUpdater = function toggleSplitMapUpdater(state, action) {
  return state.splitMaps && state.splitMaps.length === 0 ? (0, _extends14.default)({}, state, {
    // maybe we should use an array to store state for a single map as well
    // if current maps length is equal to 0 it means that we are about to split the view
    splitMaps: computeSplitMapLayers(state.layers)
  }) : closeSpecificMapAtIndex(state, action);
};

/**
 * This is triggered when view is split into multiple maps.
 * It will only update layers that belong to the map layer dropdown
 * the user is interacting wit
 * @param state
 * @param action
 */
var setVisibleLayersForMapUpdater = exports.setVisibleLayersForMapUpdater = function setVisibleLayersForMapUpdater(state, action) {
  var mapIndex = action.mapIndex,
      layerIds = action.layerIds;

  if (!layerIds) {
    return state;
  }

  var _state$splitMaps = state.splitMaps,
      splitMaps = _state$splitMaps === undefined ? [] : _state$splitMaps;


  if (splitMaps.length === 0) {
    // we should never get into this state
    // because this action should only be triggered
    // when map view is split
    // but something may have happened
    return state;
  }

  // need to check if maps is populated otherwise will create
  var _splitMaps$mapIndex = splitMaps[mapIndex],
      map = _splitMaps$mapIndex === undefined ? {} : _splitMaps$mapIndex;


  var layers = map.layers || [];

  // we set visibility to true for all layers included in our input list
  var newLayers = (Object.keys(layers) || []).reduce(function (currentLayers, idx) {
    return (0, _extends14.default)({}, currentLayers, (0, _defineProperty3.default)({}, idx, (0, _extends14.default)({}, layers[idx], {
      isVisible: layerIds.includes(idx)
    })));
  }, {});

  var newMaps = [].concat((0, _toConsumableArray3.default)(splitMaps));

  newMaps[mapIndex] = (0, _extends14.default)({}, splitMaps[mapIndex], {
    layers: newLayers
  });

  return (0, _extends14.default)({}, state, {
    splitMaps: newMaps
  });
};

var toggleLayerForMapUpdater = exports.toggleLayerForMapUpdater = function toggleLayerForMapUpdater(state, action) {
  if (!state.splitMaps[action.mapIndex]) {
    return state;
  }

  var mapSettings = state.splitMaps[action.mapIndex];
  var layers = mapSettings.layers;

  if (!layers || !layers[action.layerId]) {
    return state;
  }

  var layer = layers[action.layerId];

  var newLayer = (0, _extends14.default)({}, layer, {
    isVisible: !layer.isVisible
  });

  var newLayers = (0, _extends14.default)({}, layers, (0, _defineProperty3.default)({}, action.layerId, newLayer));

  // const splitMaps = state.splitMaps;
  var newSplitMaps = [].concat((0, _toConsumableArray3.default)(state.splitMaps));
  newSplitMaps[action.mapIndex] = (0, _extends14.default)({}, mapSettings, {
    layers: newLayers
  });

  return (0, _extends14.default)({}, state, {
    splitMaps: newSplitMaps
  });
};

/* eslint-disable max-statements */
var updateVisDataUpdater = exports.updateVisDataUpdater = function updateVisDataUpdater(state, action) {
  // datasets can be a single data entries or an array of multiple data entries
  var datasets = Array.isArray(action.datasets) ? action.datasets : [action.datasets];

  if (action.config) {
    // apply config if passed from action
    state = receiveMapConfigUpdater(state, {
      payload: { visState: action.config }
    });
  }

  var newDateEntries = datasets.reduce(function (accu, _ref6) {
    var _ref6$info = _ref6.info,
        info = _ref6$info === undefined ? {} : _ref6$info,
        data = _ref6.data;
    return (0, _extends14.default)({}, accu, (0, _datasetUtils.createNewDataEntry)({ info: info, data: data }, state.datasets) || {});
  }, {});

  if (!Object.keys(newDateEntries).length) {
    return state;
  }

  var stateWithNewData = (0, _extends14.default)({}, state, {
    datasets: (0, _extends14.default)({}, state.datasets, newDateEntries)
  });

  // previously saved config before data loaded
  var _stateWithNewData$fil = stateWithNewData.filterToBeMerged,
      filterToBeMerged = _stateWithNewData$fil === undefined ? [] : _stateWithNewData$fil,
      _stateWithNewData$lay = stateWithNewData.layerToBeMerged,
      layerToBeMerged = _stateWithNewData$lay === undefined ? [] : _stateWithNewData$lay,
      _stateWithNewData$int = stateWithNewData.interactionToBeMerged,
      interactionToBeMerged = _stateWithNewData$int === undefined ? {} : _stateWithNewData$int;

  // merge state with saved filters

  var mergedState = (0, _visStateMerger.mergeFilters)(stateWithNewData, filterToBeMerged);
  // merge state with saved layers
  mergedState = (0, _visStateMerger.mergeLayers)(mergedState, layerToBeMerged);

  if (mergedState.layers.length === state.layers.length) {
    // no layer merged, find defaults
    mergedState = addDefaultLayers(mergedState, newDateEntries);
  }

  if (mergedState.splitMaps.length) {
    var newLayers = mergedState.layers.filter(function (l) {
      return l.config.dataId in newDateEntries;
    });
    // if map is splited, add new layers to splitMaps
    mergedState = (0, _extends14.default)({}, mergedState, {
      splitMaps: addNewLayersToSplitMap(mergedState.splitMaps, newLayers)
    });
  }

  // merge state with saved interactions
  mergedState = (0, _visStateMerger.mergeInteractions)(mergedState, interactionToBeMerged);

  // if no tooltips merged add default tooltips
  Object.keys(newDateEntries).forEach(function (dataId) {
    var tooltipFields = mergedState.interactionConfig.tooltip.config.fieldsToShow[dataId];
    if (!Array.isArray(tooltipFields) || !tooltipFields.length) {
      mergedState = addDefaultTooltips(mergedState, newDateEntries[dataId]);
    }
  });

  return updateAllLayerDomainData(mergedState, Object.keys(newDateEntries));
};
/* eslint-enable max-statements */

function generateLayerMetaForSplitViews(layer) {
  return {
    isAvailable: layer.config.isVisible,
    isVisible: layer.config.isVisible
  };
}

/**
 * This emthod will compute the default maps custom list
 * based on the current layers status
 * @param layers
 * @returns {[*,*]}
 */
function computeSplitMapLayers(layers) {
  var mapLayers = layers.reduce(function (newLayers, currentLayer) {
    return (0, _extends14.default)({}, newLayers, (0, _defineProperty3.default)({}, currentLayer.id, generateLayerMetaForSplitViews(currentLayer)));
  }, {});
  return [{
    layers: mapLayers
  }, {
    layers: mapLayers
  }];
}

/**
 * Remove an existing layers from custom map layer objects
 * @param state
 * @param layer
 * @returns {[*,*]} Maps of custom layer objects
 */
function removeLayerFromSplitMaps(state, layer) {
  return state.splitMaps.map(function (settings) {
    var layers = settings.layers;
    /* eslint-disable no-unused-vars */

    var _ = layers[layer.id],
        newLayers = (0, _objectWithoutProperties3.default)(layers, [layer.id]);
    /* eslint-enable no-unused-vars */

    return (0, _extends14.default)({}, settings, {
      layers: newLayers
    });
  });
}

/**
 * Add new layers to both existing maps
 * @param splitMaps
 * @param layers
 * @returns {[*,*]} new splitMaps
 */
function addNewLayersToSplitMap(splitMaps, layers) {
  var newLayers = Array.isArray(layers) ? layers : [layers];

  if (!splitMaps || !splitMaps.length || !newLayers.length) {
    return splitMaps;
  }

  // add new layer to both maps,
  //  don't override, if layer.id is already in splitMaps.settings.layers
  return splitMaps.map(function (settings) {
    return (0, _extends14.default)({}, settings, {
      layers: (0, _extends14.default)({}, settings.layers, newLayers.reduce(function (accu, newLayer) {
        return newLayer.config.isVisible ? (0, _extends14.default)({}, accu, (0, _defineProperty3.default)({}, newLayer.id, settings.layers[newLayer.id] ? settings.layers[newLayer.id] : generateLayerMetaForSplitViews(newLayer))) : accu;
      }, {}))
    });
  });
}

/**
 * Hide an existing layers from custom map layer objects
 * @param state
 * @param layer
 * @returns {[*,*]} Maps of custom layer objects
 */
function toggleLayerFromSplitMaps(state, layer) {
  return state.splitMaps.map(function (settings) {
    var layers = settings.layers;

    var newLayers = (0, _extends14.default)({}, layers, (0, _defineProperty3.default)({}, layer.id, generateLayerMetaForSplitViews(layer)));

    return (0, _extends14.default)({}, settings, {
      layers: newLayers
    });
  });
}

/**
 * When a user clicks on the specific map closing icon
 * the application will close the selected map
 * and will merge the remaining one with the global state
 * TODO: i think in the future this action should be called merge map layers with global settings
 * @param state
 * @param action
 * @returns {*}
 */
function closeSpecificMapAtIndex(state, action) {
  // retrieve layers meta data from the remaining map that we need to keep
  var indexToRetrieve = 1 - action.payload;

  var metaSettings = state.splitMaps[indexToRetrieve];
  if (!metaSettings || !metaSettings.layers) {
    // if we can't find the meta settings we simply clean up splitMaps and
    // keep global state as it is
    // but why does this ever happen?
    return (0, _extends14.default)({}, state, {
      splitMaps: []
    });
  }

  var layers = state.layers;

  // update layer visibility

  var newLayers = layers.map(function (layer) {
    return layer.updateLayerConfig({
      isVisible: metaSettings.layers[layer.id] ? metaSettings.layers[layer.id].isVisible : layer.config.isVisible
    });
  });

  // delete map
  return (0, _extends14.default)({}, state, {
    layers: newLayers,
    splitMaps: []
  });
}

// TODO: redo write handler to not use tasks
var loadFilesUpdater = exports.loadFilesUpdater = function loadFilesUpdater(state, action) {
  var files = action.files;


  var filesToLoad = files.map(function (fileBlob) {
    return {
      fileBlob: fileBlob,
      info: {
        id: (0, _utils.generateHashId)(4),
        label: fileBlob.name,
        size: fileBlob.size
      },
      handler: (0, _fileHandler.getFileHandler)(fileBlob)
    };
  });

  // reader -> parser -> augment -> receiveVisData
  var loadFileTasks = [_tasks2.default.all(filesToLoad.map(_tasks3.LOAD_FILE_TASK)).bimap(function (results) {
    var data = results.reduce(function (f, c) {
      return {
        // using concat here because the current datasets could be an array or a single item
        datasets: f.datasets.concat(c.datasets),
        // we need to deep merge this thing unless we find a better solution
        // this case will only happen if we allow to load multiple keplergl json files
        config: (0, _extends14.default)({}, f.config, c.config || {})
      };
    }, { datasets: [], config: {}, options: { centerMap: true } });
    return (0, _actions.addDataToMap)(data);
  }, function (error) {
    return (0, _visStateActions.loadFilesErr)(error);
  })];

  return (0, _tasks.withTask)((0, _extends14.default)({}, state, {
    fileLoading: true
  }), loadFileTasks);
};

var loadFilesErrUpdater = exports.loadFilesErrUpdater = function loadFilesErrUpdater(state, _ref7) {
  var error = _ref7.error;
  return (0, _extends14.default)({}, state, {
    fileLoading: false,
    fileLoadingErr: error
  });
};

/**
 * helper function to update All layer domain and layer data of state
 *
 * @param {object} state
 * @param {string} datasets
 * @returns {object} state
 */
function addDefaultLayers(state, datasets) {
  var defaultLayers = Object.values(datasets).reduce(function (accu, dataset) {
    return [].concat((0, _toConsumableArray3.default)(accu), (0, _toConsumableArray3.default)((0, _layerUtils.findDefaultLayer)(dataset, state.layerClasses) || []));
  }, []);
  return (0, _extends14.default)({}, state, {
    layers: [].concat((0, _toConsumableArray3.default)(state.layers), (0, _toConsumableArray3.default)(defaultLayers)),
    layerOrder: [].concat((0, _toConsumableArray3.default)(defaultLayers.map(function (_, i) {
      return state.layers.length + i;
    })), (0, _toConsumableArray3.default)(state.layerOrder))
  });
}

/**
 * helper function to find default tooltips
 *
 * @param {object} state
 * @param {object} dataset
 * @returns {object} state
 */
function addDefaultTooltips(state, dataset) {
  var tooltipFields = (0, _interactionUtils.findFieldsToShow)(dataset);

  return (0, _extends14.default)({}, state, {
    interactionConfig: (0, _extends14.default)({}, state.interactionConfig, {
      tooltip: (0, _extends14.default)({}, state.interactionConfig.tooltip, {
        config: {
          // find default fields to show in tooltip
          fieldsToShow: (0, _extends14.default)({}, state.interactionConfig.tooltip.config.fieldsToShow, tooltipFields)
        }
      })
    })
  });
}

/**
 * helper function to update layer domains for an array of datsets
 *
 * @param {object} state
 * @param {array | string} dataId
 * @param {object} newFilter - if is called by setFilter, the filter that has changed
 * @returns {object} state
 */
function updateAllLayerDomainData(state, dataId, newFilter) {
  var dataIds = typeof dataId === 'string' ? [dataId] : dataId;
  var newLayers = [];
  var newLayerDatas = [];

  state.layers.forEach(function (oldLayer, i) {
    if (oldLayer.config.dataId && dataIds.includes(oldLayer.config.dataId)) {
      // No need to recalculate layer domain if filter has fixed domain
      var newLayer = newFilter && newFilter.fixedDomain ? oldLayer : oldLayer.updateLayerDomain(state.datasets[oldLayer.config.dataId], newFilter);

      var _calculateLayerData5 = (0, _layerUtils.calculateLayerData)(newLayer, state, state.layerData[i]),
          layerData = _calculateLayerData5.layerData,
          layer = _calculateLayerData5.layer;

      newLayers.push(layer);
      newLayerDatas.push(layerData);
    } else {
      newLayers.push(oldLayer);
      newLayerDatas.push(state.layerData[i]);
    }
  });

  return (0, _extends14.default)({}, state, {
    layers: newLayers,
    layerData: newLayerDatas
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWR1Y2Vycy92aXMtc3RhdGUtdXBkYXRlcnMuanMiXSwibmFtZXMiOlsibGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyIiwibGF5ZXJUeXBlQ2hhbmdlVXBkYXRlciIsImxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIiLCJsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIiLCJzZXRGaWx0ZXJVcGRhdGVyIiwiYWRkRGVmYXVsdExheWVycyIsImFkZERlZmF1bHRUb29sdGlwcyIsInVwZGF0ZUFsbExheWVyRG9tYWluRGF0YSIsIklOSVRJQUxfVklTX1NUQVRFIiwibGF5ZXJzIiwibGF5ZXJEYXRhIiwibGF5ZXJUb0JlTWVyZ2VkIiwibGF5ZXJPcmRlciIsImZpbHRlcnMiLCJmaWx0ZXJUb0JlTWVyZ2VkIiwiZGF0YXNldHMiLCJlZGl0aW5nRGF0YXNldCIsInVuZGVmaW5lZCIsImludGVyYWN0aW9uQ29uZmlnIiwiaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkIiwibGF5ZXJCbGVuZGluZyIsImhvdmVySW5mbyIsImNsaWNrZWQiLCJmaWxlTG9hZGluZyIsImZpbGVMb2FkaW5nRXJyIiwic3BsaXRNYXBzIiwibGF5ZXJDbGFzc2VzIiwiTGF5ZXJDbGFzc2VzIiwidXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhIiwic3RhdGUiLCJsYXllciIsImlkeCIsIm1hcCIsImx5ciIsImkiLCJkIiwiYWN0aW9uIiwib2xkTGF5ZXIiLCJmaW5kSW5kZXgiLCJsIiwiaWQiLCJwcm9wcyIsIk9iamVjdCIsImtleXMiLCJuZXdDb25maWciLCJuZXdMYXllciIsInVwZGF0ZUxheWVyQ29uZmlnIiwic2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhIiwib2xkTGF5ZXJEYXRhIiwic2FtZURhdGEiLCJuZXdTdGF0ZSIsInRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyIsIm5ld1R5cGUiLCJvbGRJZCIsIkNvbnNvbGUiLCJlcnJvciIsImFzc2lnbkNvbmZpZ1RvTGF5ZXIiLCJjb25maWciLCJ2aXNDb25maWdTZXR0aW5ncyIsImRhdGFJZCIsImRhdGFzZXQiLCJ1cGRhdGVMYXllckRvbWFpbiIsInNldHRpbmdzIiwib2xkTGF5ZXJNYXAiLCJvdGhlckxheWVycyIsImNoYW5uZWwiLCJ1cGRhdGVMYXllclZpc3VhbENoYW5uZWwiLCJuZXdWaXNDb25maWciLCJ2aXNDb25maWciLCJlbmFibGVkIiwiZm9yRWFjaCIsImsiLCJwcm9wIiwidmFsdWUiLCJuZXdGaWx0ZXIiLCJmaWVsZHMiLCJhbGxEYXRhIiwiZmllbGRJZHgiLCJmIiwibmFtZSIsImZpZWxkIiwiZmlsdGVyUHJvcCIsImZyZWV6ZSIsImVubGFyZ2VkRmlsdGVySWR4IiwiZW5sYXJnZWQiLCJzZXRGaWx0ZXJQbG90VXBkYXRlciIsIm5ld1Byb3AiLCJwbG90VHlwZSIsImFkZEZpbHRlclVwZGF0ZXIiLCJ0b2dnbGVGaWx0ZXJBbmltYXRpb25VcGRhdGVyIiwiaXNBbmltYXRpbmciLCJ1cGRhdGVBbmltYXRpb25TcGVlZFVwZGF0ZXIiLCJzcGVlZCIsImVubGFyZ2VGaWx0ZXJVcGRhdGVyIiwiaXNFbmxhcmdlZCIsInJlbW92ZUZpbHRlclVwZGF0ZXIiLCJuZXdGaWx0ZXJzIiwic2xpY2UiLCJsZW5ndGgiLCJhZGRMYXllclVwZGF0ZXIiLCJkZWZhdWx0RGF0YXNldCIsIkxheWVyIiwiaXNWaXNpYmxlIiwiaXNDb25maWdBY3RpdmUiLCJhZGROZXdMYXllcnNUb1NwbGl0TWFwIiwicmVtb3ZlTGF5ZXJVcGRhdGVyIiwibGF5ZXJUb1JlbW92ZSIsIm5ld01hcHMiLCJyZW1vdmVMYXllckZyb21TcGxpdE1hcHMiLCJmaWx0ZXIiLCJwaWQiLCJpc0xheWVySG92ZXJlZCIsInJlb3JkZXJMYXllclVwZGF0ZXIiLCJvcmRlciIsInJlbW92ZURhdGFzZXRVcGRhdGVyIiwiZGF0YXNldEtleSIsImtleSIsIm5ld0RhdGFzZXRzIiwiaW5kZXhlcyIsInJlZHVjZSIsImxpc3RPZkluZGV4ZXMiLCJpbmRleCIsInB1c2giLCJjdXJyZW50U3RhdGUiLCJpbmRleENvdW50ZXIiLCJjdXJyZW50SW5kZXgiLCJ0b29sdGlwIiwiZmllbGRzVG9TaG93IiwidXBkYXRlTGF5ZXJCbGVuZGluZ1VwZGF0ZXIiLCJtb2RlIiwic2hvd0RhdGFzZXRUYWJsZVVwZGF0ZXIiLCJyZXNldE1hcENvbmZpZ1Zpc1N0YXRlVXBkYXRlciIsImluaXRpYWxTdGF0ZSIsInJlY2VpdmVNYXBDb25maWdVcGRhdGVyIiwicGF5bG9hZCIsInZpc1N0YXRlIiwicmVzZXRTdGF0ZSIsIm1lcmdlZFN0YXRlIiwibGF5ZXJIb3ZlclVwZGF0ZXIiLCJpbmZvIiwibGF5ZXJDbGlja1VwZGF0ZXIiLCJwaWNrZWQiLCJtYXBDbGlja1VwZGF0ZXIiLCJ0b2dnbGVTcGxpdE1hcFVwZGF0ZXIiLCJjb21wdXRlU3BsaXRNYXBMYXllcnMiLCJjbG9zZVNwZWNpZmljTWFwQXRJbmRleCIsInNldFZpc2libGVMYXllcnNGb3JNYXBVcGRhdGVyIiwibWFwSW5kZXgiLCJsYXllcklkcyIsIm5ld0xheWVycyIsImN1cnJlbnRMYXllcnMiLCJpbmNsdWRlcyIsInRvZ2dsZUxheWVyRm9yTWFwVXBkYXRlciIsIm1hcFNldHRpbmdzIiwibGF5ZXJJZCIsIm5ld1NwbGl0TWFwcyIsInVwZGF0ZVZpc0RhdGFVcGRhdGVyIiwiQXJyYXkiLCJpc0FycmF5IiwibmV3RGF0ZUVudHJpZXMiLCJhY2N1IiwiZGF0YSIsInN0YXRlV2l0aE5ld0RhdGEiLCJ0b29sdGlwRmllbGRzIiwiZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzIiwiaXNBdmFpbGFibGUiLCJtYXBMYXllcnMiLCJjdXJyZW50TGF5ZXIiLCJfIiwiaW5kZXhUb1JldHJpZXZlIiwibWV0YVNldHRpbmdzIiwibG9hZEZpbGVzVXBkYXRlciIsImZpbGVzIiwiZmlsZXNUb0xvYWQiLCJmaWxlQmxvYiIsImxhYmVsIiwic2l6ZSIsImhhbmRsZXIiLCJsb2FkRmlsZVRhc2tzIiwiVGFzayIsImFsbCIsIkxPQURfRklMRV9UQVNLIiwiYmltYXAiLCJyZXN1bHRzIiwiYyIsImNvbmNhdCIsIm9wdGlvbnMiLCJjZW50ZXJNYXAiLCJsb2FkRmlsZXNFcnJVcGRhdGVyIiwiZGVmYXVsdExheWVycyIsInZhbHVlcyIsImRhdGFJZHMiLCJuZXdMYXllckRhdGFzIiwiZml4ZWREb21haW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBZ0lnQkEsd0IsR0FBQUEsd0I7UUE0QkFDLHNCLEdBQUFBLHNCO1FBOENBQywrQixHQUFBQSwrQjtRQWlCQUMsMkIsR0FBQUEsMkI7UUE0QkFDLDhCLEdBQUFBLDhCO1FBdUJBQyxnQixHQUFBQSxnQjtRQTRzQkFDLGdCLEdBQUFBLGdCO1FBMEJBQyxrQixHQUFBQSxrQjtRQTZCQUMsd0IsR0FBQUEsd0I7O0FBNy9CaEI7O0FBQ0E7Ozs7QUFHQTs7QUFHQTs7QUFDQTs7QUFHQTs7QUFDQTs7QUFFQTs7QUFPQTs7QUFFQTs7QUFLQTs7QUFFQTs7QUFhQTs7OztBQUVBO0FBQ0E7OztBQTNDQTtBQXZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFpREE7O0FBVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUEvQkE7OztBQUpBO0FBMkNPLElBQU1DLGdEQUFvQjtBQUMvQjtBQUNBQyxVQUFRLEVBRnVCO0FBRy9CQyxhQUFXLEVBSG9CO0FBSS9CQyxtQkFBaUIsRUFKYztBQUsvQkMsY0FBWSxFQUxtQjs7QUFPL0I7QUFDQUMsV0FBUyxFQVJzQjtBQVMvQkMsb0JBQWtCLEVBVGE7O0FBVy9CO0FBQ0FDLFlBQVUsRUFacUI7QUFhL0JDLGtCQUFnQkMsU0FiZTs7QUFlL0JDLHFCQUFtQiw4Q0FmWTtBQWdCL0JDLHlCQUF1QkYsU0FoQlE7O0FBa0IvQkcsaUJBQWUsUUFsQmdCO0FBbUIvQkMsYUFBV0osU0FuQm9C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Q3pCN0IsUUFEeUIsRUFFekJoQixLQUZ5QixFQUd6QkEsTUFBTW5CLFNBQU4sQ0FBZ0J3QixDQUFoQixDQUh5QixDQVYyQztBQUFBLFVBVS9EeEIsU0FWK0Qsd0JBVS9EQSxTQVYrRDtBQUFBLFVBVXBEb0IsS0FWb0Qsd0JBVXBEQSxLQVZvRDs7QUFnQnRFdUgsZ0JBQVUzQixJQUFWLENBQWU1RixLQUFmO0FBQ0FrSyxvQkFBY3RFLElBQWQsQ0FBbUJoSCxTQUFuQjtBQUNELEtBbEJELE1Ba0JPO0FBQ0wySSxnQkFBVTNCLElBQVYsQ0FBZXJGLFFBQWY7QUFDQTJKLG9CQUFjdEUsSUFBZCxDQUFtQjdGLE1BQU1uQixTQUFOLENBQWdCd0IsQ0FBaEIsQ0FBbkI7QUFDRDtBQUNGLEdBdkJEOztBQXlCQSxxQ0FDS0wsS0FETDtBQUVFcEIsWUFBUTRJLFNBRlY7QUFHRTNJLGVBQVdzTDtBQUhiO0FBS0QiLCJmaWxlIjoidmlzLXN0YXRlLXVwZGF0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE4IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjb25zb2xlIGFzIENvbnNvbGV9IGZyb20gJ2dsb2JhbC93aW5kb3cnO1xuaW1wb3J0IFRhc2ssIHtkaXNhYmxlU3RhY2tDYXB0dXJpbmcsIHdpdGhUYXNrfSBmcm9tICdyZWFjdC1wYWxtL3Rhc2tzJztcblxuLy8gVGFza3NcbmltcG9ydCB7TE9BRF9GSUxFX1RBU0t9IGZyb20gJ3Rhc2tzL3Rhc2tzJztcblxuLy8gQWN0aW9uc1xuaW1wb3J0IHtsb2FkRmlsZXNFcnJ9IGZyb20gJ2FjdGlvbnMvdmlzLXN0YXRlLWFjdGlvbnMnO1xuaW1wb3J0IHthZGREYXRhVG9NYXB9IGZyb20gJ2FjdGlvbnMnO1xuXG4vLyBVdGlsc1xuaW1wb3J0IHtnZXREZWZhdWx0SW50ZXJhY3Rpb259IGZyb20gJ3V0aWxzL2ludGVyYWN0aW9uLXV0aWxzJztcbmltcG9ydCB7Z2VuZXJhdGVIYXNoSWR9IGZyb20gJ3V0aWxzL3V0aWxzJztcbmltcG9ydCB7ZmluZEZpZWxkc1RvU2hvd30gZnJvbSAndXRpbHMvaW50ZXJhY3Rpb24tdXRpbHMnO1xuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdEZpbHRlcixcbiAgZ2V0RmlsdGVyUHJvcHMsXG4gIGdldEZpbHRlclBsb3QsXG4gIGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZSxcbiAgZmlsdGVyRGF0YVxufSBmcm9tICd1dGlscy9maWx0ZXItdXRpbHMnO1xuaW1wb3J0IHtjcmVhdGVOZXdEYXRhRW50cnl9IGZyb20gJ3V0aWxzL2RhdGFzZXQtdXRpbHMnO1xuXG5pbXBvcnQge1xuICBmaW5kRGVmYXVsdExheWVyLFxuICBjYWxjdWxhdGVMYXllckRhdGFcbn0gZnJvbSAndXRpbHMvbGF5ZXItdXRpbHMvbGF5ZXItdXRpbHMnO1xuXG5pbXBvcnQge2dldEZpbGVIYW5kbGVyfSBmcm9tICdwcm9jZXNzb3JzL2ZpbGUtaGFuZGxlcic7XG5cbmltcG9ydCB7XG4gIG1lcmdlRmlsdGVycyxcbiAgbWVyZ2VMYXllcnMsXG4gIG1lcmdlSW50ZXJhY3Rpb25zLFxuICBtZXJnZUxheWVyQmxlbmRpbmdcbn0gZnJvbSAnLi92aXMtc3RhdGUtbWVyZ2VyJztcblxuLy8gTGF5ZXJDbGFzc2VzIGNvbnRhaW4gRVM2IENsYXNzLCBkbyBub3QgaW5zdGF0aWF0ZSBpbiBpc28gcmVuZGVyaW5nXG4vLyBjb25zdCB7TGF5ZXJDbGFzc2VzfSA9IGlzQnJvd3NlciB8fCBpc1Rlc3RpbmcgP1xuLy8gICByZXF1aXJlKCdsYXllcnMnKSA6IHtcbi8vICAgICBMYXllckNsYXNzZXM6IHt9XG4vLyAgIH07XG5cbmltcG9ydCB7TGF5ZXIsIExheWVyQ2xhc3Nlc30gZnJvbSAnbGF5ZXJzJ1xuXG4vLyByZWFjdC1wYWxtXG4vLyBkaXNhYmxlIGNhcHR1cmUgZXhjZXB0aW9uIGZvciByZWFjdC1wYWxtIGNhbGwgdG8gd2l0aFRhc2tcbmRpc2FibGVTdGFja0NhcHR1cmluZygpO1xuXG5leHBvcnQgY29uc3QgSU5JVElBTF9WSVNfU1RBVEUgPSB7XG4gIC8vIGxheWVyc1xuICBsYXllcnM6IFtdLFxuICBsYXllckRhdGE6IFtdLFxuICBsYXllclRvQmVNZXJnZWQ6IFtdLFxuICBsYXllck9yZGVyOiBbXSxcblxuICAvLyBmaWx0ZXJzXG4gIGZpbHRlcnM6IFtdLFxuICBmaWx0ZXJUb0JlTWVyZ2VkOiBbXSxcblxuICAvLyBhIGNvbGxlY3Rpb24gb2YgbXVsdGlwbGUgZGF0YXNldFxuICBkYXRhc2V0czoge30sXG4gIGVkaXRpbmdEYXRhc2V0OiB1bmRlZmluZWQsXG5cbiAgaW50ZXJhY3Rpb25Db25maWc6IGdldERlZmF1bHRJbnRlcmFjdGlvbigpLFxuICBpbnRlcmFjdGlvblRvQmVNZXJnZWQ6IHVuZGVmaW5lZCxcblxuICBsYXllckJsZW5kaW5nOiAnbm9ybWFsJyxcbiAgaG92ZXJJbmZvOiB1bmRlZmluZWQsXG4gIGNsaWNrZWQ6IHVuZGVmaW5lZCxcblxuICBmaWxlTG9hZGluZzogZmFsc2UsXG4gIGZpbGVMb2FkaW5nRXJyOiBudWxsLFxuXG4gIC8vIHRoaXMgaXMgdXNlZCB3aGVuIHVzZXIgc3BsaXQgbWFwc1xuICBzcGxpdE1hcHM6IFtcbiAgICAvLyB0aGlzIHdpbGwgY29udGFpbiBhIGxpc3Qgb2Ygb2JqZWN0cyB0b1xuICAgIC8vIGRlc2NyaWJlIHRoZSBzdGF0ZSBvZiBsYXllciBhdmFpbGFiaWxpdHkgYW5kIHZpc2liaWxpdHkgZm9yIGVhY2ggbWFwXG4gICAgLy8gW1xuICAgIC8vICAge1xuICAgIC8vICAgICBsYXllcnM6IHtcbiAgICAvLyAgICAgICBsYXllcl9pZDoge1xuICAgIC8vICAgICAgICAgaXNBdmFpbGFibGU6IHRydWV8ZmFsc2UgIyB0aGlzIGlzIGRyaXZlbiBieSB0aGUgbGVmdCBoYW5kIHBhbmVsXG4gICAgLy8gICAgICAgICBpc1Zpc2libGU6IHRydWV8ZmFsc2VcbiAgICAvLyAgICAgICB9XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH1cbiAgICAvLyBdXG4gIF0sXG5cbiAgLy8gZGVmYXVsdHMgbGF5ZXIgY2xhc3Nlc1xuICBsYXllckNsYXNzZXM6IExheWVyQ2xhc3Nlc1xufTtcblxuZnVuY3Rpb24gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSkge1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogc3RhdGUubGF5ZXJzLm1hcCgobHlyLCBpKSA9PiAoaSA9PT0gaWR4ID8gbGF5ZXIgOiBseXIpKSxcbiAgICBsYXllckRhdGE6IGxheWVyRGF0YVxuICAgICAgPyBzdGF0ZS5sYXllckRhdGEubWFwKChkLCBpKSA9PiAoaSA9PT0gaWR4ID8gbGF5ZXJEYXRhIDogZCkpXG4gICAgICA6IHN0YXRlLmxheWVyRGF0YVxuICB9O1xufVxuXG4vKipcbiAqIENhbGxlZCB0byB1cGRhdGUgbGF5ZXIgYmFzZSBjb25maWc6IGRhdGFJZCwgbGFiZWwsIGNvbHVtbiwgaXNWaXNpYmxlXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5ZXJDb25maWdDaGFuZ2VVcGRhdGVyKHN0YXRlLCBhY3Rpb24pIHtcbiAgY29uc3Qge29sZExheWVyfSA9IGFjdGlvbjtcbiAgY29uc3QgaWR4ID0gc3RhdGUubGF5ZXJzLmZpbmRJbmRleChsID0+IGwuaWQgPT09IG9sZExheWVyLmlkKTtcbiAgY29uc3QgcHJvcHMgPSBPYmplY3Qua2V5cyhhY3Rpb24ubmV3Q29uZmlnKTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKGFjdGlvbi5uZXdDb25maWcpO1xuICBpZiAobmV3TGF5ZXIuc2hvdWxkQ2FsY3VsYXRlTGF5ZXJEYXRhKHByb3BzKSkge1xuICAgIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICAgIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShcbiAgICAgIG5ld0xheWVyLFxuICAgICAgc3RhdGUsXG4gICAgICBvbGRMYXllckRhdGEsXG4gICAgICB7c2FtZURhdGE6IHRydWV9XG4gICAgKTtcbiAgICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG4gIH1cblxuICBjb25zdCBuZXdTdGF0ZSA9IHtcbiAgICAuLi5zdGF0ZSxcbiAgICBzcGxpdE1hcHM6XG4gICAgICAnaXNWaXNpYmxlJyBpbiBhY3Rpb24ubmV3Q29uZmlnXG4gICAgICAgID8gdG9nZ2xlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBuZXdMYXllcilcbiAgICAgICAgOiBzdGF0ZS5zcGxpdE1hcHNcbiAgfTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKG5ld1N0YXRlLCB7bGF5ZXI6IG5ld0xheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVHlwZUNoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld1R5cGV9ID0gYWN0aW9uO1xuICBjb25zdCBvbGRJZCA9IG9sZExheWVyLmlkO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkSWQpO1xuXG4gIGlmICghc3RhdGUubGF5ZXJDbGFzc2VzW25ld1R5cGVdKSB7XG4gICAgQ29uc29sZS5lcnJvcihgJHtuZXdUeXBlfSBpcyBub3QgYSB2YWxpZCBsYXllciB0eXBlYCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gZ2V0IGEgbWludCBsYXllciwgd2l0aCBuZXcgaWQgYW5kIHR5cGVcbiAgLy8gYmVjYXVzZSBkZWNrLmdsIHVzZXMgaWQgdG8gbWF0Y2ggYmV0d2VlbiBuZXcgYW5kIG9sZCBsYXllci5cbiAgLy8gSWYgdHlwZSBoYXMgY2hhbmdlZCBidXQgaWQgaXMgdGhlIHNhbWUsIGl0IHdpbGwgYnJlYWtcbiAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgc3RhdGUubGF5ZXJDbGFzc2VzW25ld1R5cGVdKCk7XG5cbiAgbmV3TGF5ZXIuYXNzaWduQ29uZmlnVG9MYXllcihvbGRMYXllci5jb25maWcsIG9sZExheWVyLnZpc0NvbmZpZ1NldHRpbmdzKTtcblxuICBpZiAobmV3TGF5ZXIuY29uZmlnLmRhdGFJZCkge1xuICAgIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tuZXdMYXllci5jb25maWcuZGF0YUlkXTtcbiAgICBuZXdMYXllci51cGRhdGVMYXllckRvbWFpbihkYXRhc2V0KTtcbiAgfVxuXG4gIGNvbnN0IHtsYXllckRhdGEsIGxheWVyfSA9IGNhbGN1bGF0ZUxheWVyRGF0YShuZXdMYXllciwgc3RhdGUpO1xuXG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBzcGxpdE1hcCBsYXllciBpZFxuICBpZiAoc3RhdGUuc3BsaXRNYXBzKSB7XG4gICAgbmV3U3RhdGUgPSB7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIHNwbGl0TWFwczogc3RhdGUuc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiB7XG4gICAgICAgIGNvbnN0IHtbb2xkSWRdOiBvbGRMYXllck1hcCwgLi4ub3RoZXJMYXllcnN9ID0gc2V0dGluZ3MubGF5ZXJzO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgICAgIGxheWVyczoge1xuICAgICAgICAgICAgLi4ub3RoZXJMYXllcnMsXG4gICAgICAgICAgICBbbGF5ZXIuaWRdOiBvbGRMYXllck1hcFxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEobmV3U3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxheWVyVmlzdWFsQ2hhbm5lbENoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXIsIG5ld0NvbmZpZywgY2hhbm5lbH0gPSBhY3Rpb247XG4gIGNvbnN0IGRhdGFzZXQgPSBzdGF0ZS5kYXRhc2V0c1tvbGRMYXllci5jb25maWcuZGF0YUlkXTtcblxuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKG5ld0NvbmZpZyk7XG5cbiAgbmV3TGF5ZXIudXBkYXRlTGF5ZXJWaXN1YWxDaGFubmVsKGRhdGFzZXQsIGNoYW5uZWwpO1xuXG4gIGNvbnN0IG9sZExheWVyRGF0YSA9IHN0YXRlLmxheWVyRGF0YVtpZHhdO1xuICBjb25zdCB7bGF5ZXJEYXRhLCBsYXllcn0gPSBjYWxjdWxhdGVMYXllckRhdGEobmV3TGF5ZXIsIHN0YXRlLCBvbGRMYXllckRhdGEsIHtcbiAgICBzYW1lRGF0YTogdHJ1ZVxuICB9KTtcblxuICByZXR1cm4gdXBkYXRlU3RhdGVXaXRoTGF5ZXJBbmREYXRhKHN0YXRlLCB7bGF5ZXJEYXRhLCBsYXllciwgaWR4fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsYXllclZpc0NvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7b2xkTGF5ZXJ9ID0gYWN0aW9uO1xuICBjb25zdCBpZHggPSBzdGF0ZS5sYXllcnMuZmluZEluZGV4KGwgPT4gbC5pZCA9PT0gb2xkTGF5ZXIuaWQpO1xuICBjb25zdCBwcm9wcyA9IE9iamVjdC5rZXlzKGFjdGlvbi5uZXdWaXNDb25maWcpO1xuXG4gIGNvbnN0IG5ld1Zpc0NvbmZpZyA9IHtcbiAgICAuLi5vbGRMYXllci5jb25maWcudmlzQ29uZmlnLFxuICAgIC4uLmFjdGlvbi5uZXdWaXNDb25maWdcbiAgfTtcblxuICBjb25zdCBuZXdMYXllciA9IG9sZExheWVyLnVwZGF0ZUxheWVyQ29uZmlnKHt2aXNDb25maWc6IG5ld1Zpc0NvbmZpZ30pO1xuXG4gIGlmIChuZXdMYXllci5zaG91bGRDYWxjdWxhdGVMYXllckRhdGEocHJvcHMpKSB7XG4gICAgY29uc3Qgb2xkTGF5ZXJEYXRhID0gc3RhdGUubGF5ZXJEYXRhW2lkeF07XG4gICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKFxuICAgICAgbmV3TGF5ZXIsXG4gICAgICBzdGF0ZSxcbiAgICAgIG9sZExheWVyRGF0YSxcbiAgICAgIHtzYW1lRGF0YTogdHJ1ZX1cbiAgICApO1xuICAgIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllckRhdGEsIGxheWVyLCBpZHh9KTtcbiAgfVxuXG4gIHJldHVybiB1cGRhdGVTdGF0ZVdpdGhMYXllckFuZERhdGEoc3RhdGUsIHtsYXllcjogbmV3TGF5ZXIsIGlkeH0pO1xufVxuXG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcmFjdGlvbkNvbmZpZ0NoYW5nZVVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7Y29uZmlnfSA9IGFjdGlvbjtcblxuICBjb25zdCBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAuLi57W2NvbmZpZy5pZF06IGNvbmZpZ31cbiAgfTtcblxuICBpZiAoY29uZmlnLmVuYWJsZWQgJiYgIXN0YXRlLmludGVyYWN0aW9uQ29uZmlnW2NvbmZpZy5pZF0uZW5hYmxlZCkge1xuICAgIC8vIG9ubHkgZW5hYmxlIG9uZSBpbnRlcmFjdGlvbiBhdCBhIHRpbWVcbiAgICBPYmplY3Qua2V5cyhpbnRlcmFjdGlvbkNvbmZpZykuZm9yRWFjaChrID0+IHtcbiAgICAgIGlmIChrICE9PSBjb25maWcuaWQpIHtcbiAgICAgICAgaW50ZXJhY3Rpb25Db25maWdba10gPSB7Li4uaW50ZXJhY3Rpb25Db25maWdba10sIGVuYWJsZWQ6IGZhbHNlfTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgaW50ZXJhY3Rpb25Db25maWdcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEZpbHRlclVwZGF0ZXIoc3RhdGUsIGFjdGlvbikge1xuICBjb25zdCB7aWR4LCBwcm9wLCB2YWx1ZX0gPSBhY3Rpb247XG4gIGxldCBuZXdTdGF0ZSA9IHN0YXRlO1xuICBsZXQgbmV3RmlsdGVyID0ge1xuICAgIC4uLnN0YXRlLmZpbHRlcnNbaWR4XSxcbiAgICBbcHJvcF06IHZhbHVlXG4gIH07XG5cbiAgY29uc3Qge2RhdGFJZH0gPSBuZXdGaWx0ZXI7XG4gIGlmICghZGF0YUlkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG4gIGNvbnN0IHtmaWVsZHMsIGFsbERhdGF9ID0gc3RhdGUuZGF0YXNldHNbZGF0YUlkXTtcblxuICBzd2l0Y2ggKHByb3ApIHtcbiAgICBjYXNlICdkYXRhSWQnOlxuICAgICAgLy8gaWYgdHJ5aW5nIHRvIHVwZGF0ZSBmaWx0ZXIgZGF0YUlkLiBjcmVhdGUgYW4gZW1wdHkgbmV3IGZpbHRlclxuICAgICAgbmV3RmlsdGVyID0gZ2V0RGVmYXVsdEZpbHRlcihkYXRhSWQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICduYW1lJzpcbiAgICAgIC8vIGZpbmQgdGhlIGZpZWxkXG4gICAgICBjb25zdCBmaWVsZElkeCA9IGZpZWxkcy5maW5kSW5kZXgoZiA9PiBmLm5hbWUgPT09IHZhbHVlKTtcbiAgICAgIGxldCBmaWVsZCA9IGZpZWxkc1tmaWVsZElkeF07XG5cbiAgICAgIGlmICghZmllbGQuZmlsdGVyUHJvcCkge1xuICAgICAgICAvLyBnZXQgZmlsdGVyIGRvbWFpbiBmcm9tIGZpZWxkXG4gICAgICAgIC8vIHNhdmUgZmlsdGVyUHJvcHM6IHtkb21haW4sIHN0ZXBzLCB2YWx1ZX0gdG8gZmllbGQsIGF2b2lkIHJlY2FsY3VsYXRlXG4gICAgICAgIGZpZWxkID0ge1xuICAgICAgICAgIC4uLmZpZWxkLFxuICAgICAgICAgIGZpbHRlclByb3A6IGdldEZpbHRlclByb3BzKGFsbERhdGEsIGZpZWxkKVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgLi4uZmllbGQuZmlsdGVyUHJvcCxcbiAgICAgICAgbmFtZTogZmllbGQubmFtZSxcbiAgICAgICAgLy8gY2FuJ3QgZWRpdCBkYXRhSWQgb25jZSBuYW1lIGlzIHNlbGVjdGVkXG4gICAgICAgIGZyZWV6ZTogdHJ1ZSxcbiAgICAgICAgZmllbGRJZHhcbiAgICAgIH07XG4gICAgICBjb25zdCBlbmxhcmdlZEZpbHRlcklkeCA9IHN0YXRlLmZpbHRlcnMuZmluZEluZGV4KGYgPT4gZi5lbmxhcmdlZCk7XG4gICAgICBpZiAoZW5sYXJnZWRGaWx0ZXJJZHggPiAtMSAmJiBlbmxhcmdlZEZpbHRlcklkeCAhPT0gaWR4KSB7XG4gICAgICAgIC8vIHRoZXJlIHNob3VsZCBiZSBvbmx5IG9uZSBlbmxhcmdlZCBmaWx0ZXJcbiAgICAgICAgbmV3RmlsdGVyLmVubGFyZ2VkID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIG5ld1N0YXRlID0ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgZGF0YXNldHM6IHtcbiAgICAgICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgICAgICBbZGF0YUlkXToge1xuICAgICAgICAgICAgLi4uc3RhdGUuZGF0YXNldHNbZGF0YUlkXSxcbiAgICAgICAgICAgIGZpZWxkczogZmllbGRzLm1hcCgoZCwgaSkgPT4gKGkgPT09IGZpZWxkSWR4ID8gZmllbGQgOiBkKSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICBjYXNlICd2YWx1ZSc6XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgLy8gc2F2ZSBuZXcgZmlsdGVycyB0byBuZXdTdGF0ZVxuICBuZXdTdGF0ZSA9IHtcbiAgICAuLi5uZXdTdGF0ZSxcbiAgICBmaWx0ZXJzOiBzdGF0ZS5maWx0ZXJzLm1hcCgoZiwgaSkgPT4gKGkgPT09IGlkeCA/IG5ld0ZpbHRlciA6IGYpKVxuICB9O1xuXG4gIC8vIGZpbHRlciBkYXRhXG4gIG5ld1N0YXRlID0ge1xuICAgIC4uLm5ld1N0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5uZXdTdGF0ZS5kYXRhc2V0cyxcbiAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgIC4uLm5ld1N0YXRlLmRhdGFzZXRzW2RhdGFJZF0sXG4gICAgICAgIC4uLmZpbHRlckRhdGEoYWxsRGF0YSwgZGF0YUlkLCBuZXdTdGF0ZS5maWx0ZXJzKVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBuZXdTdGF0ZSA9IHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShuZXdTdGF0ZSwgZGF0YUlkLCBuZXdGaWx0ZXIpO1xuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn1cblxuZXhwb3J0IGNvbnN0IHNldEZpbHRlclBsb3RVcGRhdGVyID0gKHN0YXRlLCB7aWR4LCBuZXdQcm9wfSkgPT4ge1xuICBsZXQgbmV3RmlsdGVyID0gey4uLnN0YXRlLmZpbHRlcnNbaWR4XSwgLi4ubmV3UHJvcH07XG4gIGNvbnN0IHByb3AgPSBPYmplY3Qua2V5cyhuZXdQcm9wKVswXTtcbiAgaWYgKHByb3AgPT09ICd5QXhpcycpIHtcbiAgICBjb25zdCBwbG90VHlwZSA9IGdldERlZmF1bHRGaWx0ZXJQbG90VHlwZShuZXdGaWx0ZXIpO1xuXG4gICAgaWYgKHBsb3RUeXBlKSB7XG4gICAgICBuZXdGaWx0ZXIgPSB7XG4gICAgICAgIC4uLm5ld0ZpbHRlcixcbiAgICAgICAgLi4uZ2V0RmlsdGVyUGxvdChcbiAgICAgICAgICB7Li4ubmV3RmlsdGVyLCBwbG90VHlwZX0sXG4gICAgICAgICAgc3RhdGUuZGF0YXNldHNbbmV3RmlsdGVyLmRhdGFJZF0uYWxsRGF0YVxuICAgICAgICApLFxuICAgICAgICBwbG90VHlwZVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiAoaSA9PT0gaWR4ID8gbmV3RmlsdGVyIDogZikpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgYWRkRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICAhYWN0aW9uLmRhdGFJZFxuICAgID8gc3RhdGVcbiAgICA6IHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGZpbHRlcnM6IFsuLi5zdGF0ZS5maWx0ZXJzLCBnZXREZWZhdWx0RmlsdGVyKGFjdGlvbi5kYXRhSWQpXVxuICAgICAgfTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZUZpbHRlckFuaW1hdGlvblVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKFxuICAgIChmLCBpKSA9PiAoaSA9PT0gYWN0aW9uLmlkeCA/IHsuLi5mLCBpc0FuaW1hdGluZzogIWYuaXNBbmltYXRpbmd9IDogZilcbiAgKVxufSk7XG5cbmV4cG9ydCBjb25zdCB1cGRhdGVBbmltYXRpb25TcGVlZFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4gKHtcbiAgLi4uc3RhdGUsXG4gIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKFxuICAgIChmLCBpKSA9PiAoaSA9PT0gYWN0aW9uLmlkeCA/IHsuLi5mLCBzcGVlZDogYWN0aW9uLnNwZWVkfSA6IGYpXG4gIClcbn0pO1xuXG5leHBvcnQgY29uc3QgZW5sYXJnZUZpbHRlclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBpc0VubGFyZ2VkID0gc3RhdGUuZmlsdGVyc1thY3Rpb24uaWR4XS5lbmxhcmdlZDtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGZpbHRlcnM6IHN0YXRlLmZpbHRlcnMubWFwKChmLCBpKSA9PiB7XG4gICAgICBmLmVubGFyZ2VkID0gIWlzRW5sYXJnZWQgJiYgaSA9PT0gYWN0aW9uLmlkeDtcbiAgICAgIHJldHVybiBmO1xuICAgIH0pXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlRmlsdGVyVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIGNvbnN0IHtpZHh9ID0gYWN0aW9uO1xuICBjb25zdCB7ZGF0YUlkfSA9IHN0YXRlLmZpbHRlcnNbaWR4XTtcblxuICBjb25zdCBuZXdGaWx0ZXJzID0gW1xuICAgIC4uLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCwgaWR4KSxcbiAgICAuLi5zdGF0ZS5maWx0ZXJzLnNsaWNlKGlkeCArIDEsIHN0YXRlLmZpbHRlcnMubGVuZ3RoKVxuICBdO1xuXG4gIGNvbnN0IG5ld1N0YXRlID0ge1xuICAgIC4uLnN0YXRlLFxuICAgIGRhdGFzZXRzOiB7XG4gICAgICAuLi5zdGF0ZS5kYXRhc2V0cyxcbiAgICAgIFtkYXRhSWRdOiB7XG4gICAgICAgIC4uLnN0YXRlLmRhdGFzZXRzW2RhdGFJZF0sXG4gICAgICAgIC4uLmZpbHRlckRhdGEoc3RhdGUuZGF0YXNldHNbZGF0YUlkXS5hbGxEYXRhLCBkYXRhSWQsIG5ld0ZpbHRlcnMpXG4gICAgICB9XG4gICAgfSxcbiAgICBmaWx0ZXJzOiBuZXdGaWx0ZXJzXG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShuZXdTdGF0ZSwgZGF0YUlkKTtcbn07XG5cbmV4cG9ydCBjb25zdCBhZGRMYXllclVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCBkZWZhdWx0RGF0YXNldCA9IE9iamVjdC5rZXlzKHN0YXRlLmRhdGFzZXRzKVswXTtcbiAgY29uc3QgbmV3TGF5ZXIgPSBuZXcgTGF5ZXIoe1xuICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICBpc0NvbmZpZ0FjdGl2ZTogdHJ1ZSxcbiAgICBkYXRhSWQ6IGRlZmF1bHREYXRhc2V0LFxuICAgIC4uLmFjdGlvbi5wcm9wc1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgbmV3TGF5ZXJdLFxuICAgIGxheWVyRGF0YTogWy4uLnN0YXRlLmxheWVyRGF0YSwge31dLFxuICAgIGxheWVyT3JkZXI6IFsuLi5zdGF0ZS5sYXllck9yZGVyLCBzdGF0ZS5sYXllck9yZGVyLmxlbmd0aF0sXG4gICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXIpXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgcmVtb3ZlTGF5ZXJVcGRhdGVyID0gKHN0YXRlLCB7aWR4fSkgPT4ge1xuICBjb25zdCB7bGF5ZXJzLCBsYXllckRhdGEsIGNsaWNrZWQsIGhvdmVySW5mb30gPSBzdGF0ZTtcbiAgY29uc3QgbGF5ZXJUb1JlbW92ZSA9IHN0YXRlLmxheWVyc1tpZHhdO1xuICBjb25zdCBuZXdNYXBzID0gcmVtb3ZlTGF5ZXJGcm9tU3BsaXRNYXBzKHN0YXRlLCBsYXllclRvUmVtb3ZlKTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLmxheWVycy5zbGljZSgwLCBpZHgpLCAuLi5sYXllcnMuc2xpY2UoaWR4ICsgMSwgbGF5ZXJzLmxlbmd0aCldLFxuICAgIGxheWVyRGF0YTogW1xuICAgICAgLi4ubGF5ZXJEYXRhLnNsaWNlKDAsIGlkeCksXG4gICAgICAuLi5sYXllckRhdGEuc2xpY2UoaWR4ICsgMSwgbGF5ZXJEYXRhLmxlbmd0aClcbiAgICBdLFxuICAgIGxheWVyT3JkZXI6IHN0YXRlLmxheWVyT3JkZXJcbiAgICAgIC5maWx0ZXIoaSA9PiBpICE9PSBpZHgpXG4gICAgICAubWFwKHBpZCA9PiAocGlkID4gaWR4ID8gcGlkIC0gMSA6IHBpZCkpLFxuICAgIGNsaWNrZWQ6IGxheWVyVG9SZW1vdmUuaXNMYXllckhvdmVyZWQoY2xpY2tlZCkgPyB1bmRlZmluZWQgOiBjbGlja2VkLFxuICAgIGhvdmVySW5mbzogbGF5ZXJUb1JlbW92ZS5pc0xheWVySG92ZXJlZChob3ZlckluZm8pID8gdW5kZWZpbmVkIDogaG92ZXJJbmZvLFxuICAgIHNwbGl0TWFwczogbmV3TWFwc1xuICB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHJlb3JkZXJMYXllclVwZGF0ZXIgPSAoc3RhdGUsIHtvcmRlcn0pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllck9yZGVyOiBvcmRlclxufSk7XG5cbmV4cG9ydCBjb25zdCByZW1vdmVEYXRhc2V0VXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIC8vIGV4dHJhY3QgZGF0YXNldCBrZXlcbiAgY29uc3Qge2tleTogZGF0YXNldEtleX0gPSBhY3Rpb247XG4gIGNvbnN0IHtkYXRhc2V0c30gPSBzdGF0ZTtcblxuICAvLyBjaGVjayBpZiBkYXRhc2V0IGlzIHByZXNlbnRcbiAgaWYgKCFkYXRhc2V0c1tkYXRhc2V0S2V5XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gIGNvbnN0IHtcbiAgICBsYXllcnMsXG4gICAgZGF0YXNldHM6IHtbZGF0YXNldEtleV06IGRhdGFzZXQsIC4uLm5ld0RhdGFzZXRzfVxuICB9ID0gc3RhdGU7XG4gIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cblxuICBjb25zdCBpbmRleGVzID0gbGF5ZXJzLnJlZHVjZSgobGlzdE9mSW5kZXhlcywgbGF5ZXIsIGluZGV4KSA9PiB7XG4gICAgaWYgKGxheWVyLmNvbmZpZy5kYXRhSWQgPT09IGRhdGFzZXRLZXkpIHtcbiAgICAgIGxpc3RPZkluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgfVxuICAgIHJldHVybiBsaXN0T2ZJbmRleGVzO1xuICB9LCBbXSk7XG5cbiAgLy8gcmVtb3ZlIGxheWVycyBhbmQgZGF0YXNldHNcbiAgY29uc3Qge25ld1N0YXRlfSA9IGluZGV4ZXMucmVkdWNlKFxuICAgICh7bmV3U3RhdGU6IGN1cnJlbnRTdGF0ZSwgaW5kZXhDb3VudGVyfSwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBpZHggLSBpbmRleENvdW50ZXI7XG4gICAgICBjdXJyZW50U3RhdGUgPSByZW1vdmVMYXllclVwZGF0ZXIoY3VycmVudFN0YXRlLCB7aWR4OiBjdXJyZW50SW5kZXh9KTtcbiAgICAgIGluZGV4Q291bnRlcisrO1xuICAgICAgcmV0dXJuIHtuZXdTdGF0ZTogY3VycmVudFN0YXRlLCBpbmRleENvdW50ZXJ9O1xuICAgIH0sXG4gICAge25ld1N0YXRlOiB7Li4uc3RhdGUsIGRhdGFzZXRzOiBuZXdEYXRhc2V0c30sIGluZGV4Q291bnRlcjogMH1cbiAgKTtcblxuICAvLyByZW1vdmUgZmlsdGVyc1xuICBjb25zdCBmaWx0ZXJzID0gc3RhdGUuZmlsdGVycy5maWx0ZXIoZmlsdGVyID0+IGZpbHRlci5kYXRhSWQgIT09IGRhdGFzZXRLZXkpO1xuXG4gIC8vIHVwZGF0ZSBpbnRlcmFjdGlvbkNvbmZpZ1xuICBsZXQge2ludGVyYWN0aW9uQ29uZmlnfSA9IHN0YXRlO1xuICBjb25zdCB7dG9vbHRpcH0gPSBpbnRlcmFjdGlvbkNvbmZpZztcbiAgaWYgKHRvb2x0aXApIHtcbiAgICBjb25zdCB7Y29uZmlnfSA9IHRvb2x0aXA7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2RhdGFzZXRLZXldOiBmaWVsZHMsIC4uLmZpZWxkc1RvU2hvd30gPSBjb25maWcuZmllbGRzVG9TaG93O1xuICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBpbnRlcmFjdGlvbkNvbmZpZyA9IHtcbiAgICAgIC4uLmludGVyYWN0aW9uQ29uZmlnLFxuICAgICAgdG9vbHRpcDogey4uLnRvb2x0aXAsIGNvbmZpZzogey4uLmNvbmZpZywgZmllbGRzVG9TaG93fX1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHsuLi5uZXdTdGF0ZSwgZmlsdGVycywgaW50ZXJhY3Rpb25Db25maWd9O1xufTtcblxuZXhwb3J0IGNvbnN0IHVwZGF0ZUxheWVyQmxlbmRpbmdVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBsYXllckJsZW5kaW5nOiBhY3Rpb24ubW9kZVxufSk7XG5cbmV4cG9ydCBjb25zdCBzaG93RGF0YXNldFRhYmxlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgZWRpdGluZ0RhdGFzZXQ6IGFjdGlvbi5kYXRhSWRcbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXNldE1hcENvbmZpZ1Zpc1N0YXRlVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiAoe1xuICAuLi5JTklUSUFMX1ZJU19TVEFURSxcbiAgLi4uc3RhdGUuaW5pdGlhbFN0YXRlLFxuICBpbml0aWFsU3RhdGU6IHN0YXRlLmluaXRpYWxTdGF0ZVxufSk7XG5cbi8qKlxuICogTG9hZHMgY3VzdG9tIGNvbmZpZ3VyYXRpb24gaW50byBzdGF0ZVxuICogQHBhcmFtIHN0YXRlXG4gKiBAcGFyYW0gYWN0aW9uXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZXhwb3J0IGNvbnN0IHJlY2VpdmVNYXBDb25maWdVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKCFhY3Rpb24ucGF5bG9hZC52aXNTdGF0ZSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtcbiAgICBmaWx0ZXJzLFxuICAgIGxheWVycyxcbiAgICBpbnRlcmFjdGlvbkNvbmZpZyxcbiAgICBsYXllckJsZW5kaW5nLFxuICAgIHNwbGl0TWFwc1xuICB9ID0gYWN0aW9uLnBheWxvYWQudmlzU3RhdGU7XG5cbiAgLy8gYWx3YXlzIHJlc2V0IGNvbmZpZyB3aGVuIHJlY2VpdmUgYSBuZXcgY29uZmlnXG4gIGNvbnN0IHJlc2V0U3RhdGUgPSByZXNldE1hcENvbmZpZ1Zpc1N0YXRlVXBkYXRlcihzdGF0ZSk7XG4gIGxldCBtZXJnZWRTdGF0ZSA9IHtcbiAgICAuLi5yZXNldFN0YXRlLFxuICAgIHNwbGl0TWFwczogc3BsaXRNYXBzIHx8IFtdIC8vIG1hcHMgZG9lc24ndCByZXF1aXJlIGFueSBsb2dpY1xuICB9O1xuXG4gIG1lcmdlZFN0YXRlID0gbWVyZ2VGaWx0ZXJzKG1lcmdlZFN0YXRlLCBmaWx0ZXJzKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJzKTtcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUludGVyYWN0aW9ucyhtZXJnZWRTdGF0ZSwgaW50ZXJhY3Rpb25Db25maWcpO1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlTGF5ZXJCbGVuZGluZyhtZXJnZWRTdGF0ZSwgbGF5ZXJCbGVuZGluZyk7XG5cbiAgcmV0dXJuIG1lcmdlZFN0YXRlO1xufTtcblxuZXhwb3J0IGNvbnN0IGxheWVySG92ZXJVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBob3ZlckluZm86IGFjdGlvbi5pbmZvXG59KTtcblxuZXhwb3J0IGNvbnN0IGxheWVyQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjbGlja2VkOiBhY3Rpb24uaW5mbyAmJiBhY3Rpb24uaW5mby5waWNrZWQgPyBhY3Rpb24uaW5mbyA6IG51bGxcbn0pO1xuXG5leHBvcnQgY29uc3QgbWFwQ2xpY2tVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+ICh7XG4gIC4uLnN0YXRlLFxuICBjbGlja2VkOiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZVNwbGl0TWFwVXBkYXRlciA9IChzdGF0ZSwgYWN0aW9uKSA9PlxuICBzdGF0ZS5zcGxpdE1hcHMgJiYgc3RhdGUuc3BsaXRNYXBzLmxlbmd0aCA9PT0gMFxuICAgID8ge1xuICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgLy8gbWF5YmUgd2Ugc2hvdWxkIHVzZSBhbiBhcnJheSB0byBzdG9yZSBzdGF0ZSBmb3IgYSBzaW5nbGUgbWFwIGFzIHdlbGxcbiAgICAgICAgLy8gaWYgY3VycmVudCBtYXBzIGxlbmd0aCBpcyBlcXVhbCB0byAwIGl0IG1lYW5zIHRoYXQgd2UgYXJlIGFib3V0IHRvIHNwbGl0IHRoZSB2aWV3XG4gICAgICAgIHNwbGl0TWFwczogY29tcHV0ZVNwbGl0TWFwTGF5ZXJzKHN0YXRlLmxheWVycylcbiAgICAgIH1cbiAgICA6IGNsb3NlU3BlY2lmaWNNYXBBdEluZGV4KHN0YXRlLCBhY3Rpb24pO1xuXG4vKipcbiAqIFRoaXMgaXMgdHJpZ2dlcmVkIHdoZW4gdmlldyBpcyBzcGxpdCBpbnRvIG11bHRpcGxlIG1hcHMuXG4gKiBJdCB3aWxsIG9ubHkgdXBkYXRlIGxheWVycyB0aGF0IGJlbG9uZyB0byB0aGUgbWFwIGxheWVyIGRyb3Bkb3duXG4gKiB0aGUgdXNlciBpcyBpbnRlcmFjdGluZyB3aXRcbiAqIEBwYXJhbSBzdGF0ZVxuICogQHBhcmFtIGFjdGlvblxuICovXG5leHBvcnQgY29uc3Qgc2V0VmlzaWJsZUxheWVyc0Zvck1hcFVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICBjb25zdCB7bWFwSW5kZXgsIGxheWVySWRzfSA9IGFjdGlvbjtcbiAgaWYgKCFsYXllcklkcykge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHtzcGxpdE1hcHMgPSBbXX0gPSBzdGF0ZTtcblxuICBpZiAoc3BsaXRNYXBzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIHdlIHNob3VsZCBuZXZlciBnZXQgaW50byB0aGlzIHN0YXRlXG4gICAgLy8gYmVjYXVzZSB0aGlzIGFjdGlvbiBzaG91bGQgb25seSBiZSB0cmlnZ2VyZWRcbiAgICAvLyB3aGVuIG1hcCB2aWV3IGlzIHNwbGl0XG4gICAgLy8gYnV0IHNvbWV0aGluZyBtYXkgaGF2ZSBoYXBwZW5lZFxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIG5lZWQgdG8gY2hlY2sgaWYgbWFwcyBpcyBwb3B1bGF0ZWQgb3RoZXJ3aXNlIHdpbGwgY3JlYXRlXG4gIGNvbnN0IHtbbWFwSW5kZXhdOiBtYXAgPSB7fX0gPSBzcGxpdE1hcHM7XG5cbiAgY29uc3QgbGF5ZXJzID0gbWFwLmxheWVycyB8fCBbXTtcblxuICAvLyB3ZSBzZXQgdmlzaWJpbGl0eSB0byB0cnVlIGZvciBhbGwgbGF5ZXJzIGluY2x1ZGVkIGluIG91ciBpbnB1dCBsaXN0XG4gIGNvbnN0IG5ld0xheWVycyA9IChPYmplY3Qua2V5cyhsYXllcnMpIHx8IFtdKS5yZWR1Y2UoKGN1cnJlbnRMYXllcnMsIGlkeCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5jdXJyZW50TGF5ZXJzLFxuICAgICAgW2lkeF06IHtcbiAgICAgICAgLi4ubGF5ZXJzW2lkeF0sXG4gICAgICAgIGlzVmlzaWJsZTogbGF5ZXJJZHMuaW5jbHVkZXMoaWR4KVxuICAgICAgfVxuICAgIH07XG4gIH0sIHt9KTtcblxuICBjb25zdCBuZXdNYXBzID0gWy4uLnNwbGl0TWFwc107XG5cbiAgbmV3TWFwc1ttYXBJbmRleF0gPSB7XG4gICAgLi4uc3BsaXRNYXBzW21hcEluZGV4XSxcbiAgICBsYXllcnM6IG5ld0xheWVyc1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBuZXdNYXBzXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlTGF5ZXJGb3JNYXBVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgaWYgKCFzdGF0ZS5zcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XSkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IG1hcFNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2FjdGlvbi5tYXBJbmRleF07XG4gIGNvbnN0IHtsYXllcnN9ID0gbWFwU2V0dGluZ3M7XG4gIGlmICghbGF5ZXJzIHx8ICFsYXllcnNbYWN0aW9uLmxheWVySWRdKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3QgbGF5ZXIgPSBsYXllcnNbYWN0aW9uLmxheWVySWRdO1xuXG4gIGNvbnN0IG5ld0xheWVyID0ge1xuICAgIC4uLmxheWVyLFxuICAgIGlzVmlzaWJsZTogIWxheWVyLmlzVmlzaWJsZVxuICB9O1xuXG4gIGNvbnN0IG5ld0xheWVycyA9IHtcbiAgICAuLi5sYXllcnMsXG4gICAgW2FjdGlvbi5sYXllcklkXTogbmV3TGF5ZXJcbiAgfTtcblxuICAvLyBjb25zdCBzcGxpdE1hcHMgPSBzdGF0ZS5zcGxpdE1hcHM7XG4gIGNvbnN0IG5ld1NwbGl0TWFwcyA9IFsuLi5zdGF0ZS5zcGxpdE1hcHNdO1xuICBuZXdTcGxpdE1hcHNbYWN0aW9uLm1hcEluZGV4XSA9IHtcbiAgICAuLi5tYXBTZXR0aW5ncyxcbiAgICBsYXllcnM6IG5ld0xheWVyc1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgLi4uc3RhdGUsXG4gICAgc3BsaXRNYXBzOiBuZXdTcGxpdE1hcHNcbiAgfTtcbn07XG5cbi8qIGVzbGludC1kaXNhYmxlIG1heC1zdGF0ZW1lbnRzICovXG5leHBvcnQgY29uc3QgdXBkYXRlVmlzRGF0YVVwZGF0ZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAvLyBkYXRhc2V0cyBjYW4gYmUgYSBzaW5nbGUgZGF0YSBlbnRyaWVzIG9yIGFuIGFycmF5IG9mIG11bHRpcGxlIGRhdGEgZW50cmllc1xuICBjb25zdCBkYXRhc2V0cyA9IEFycmF5LmlzQXJyYXkoYWN0aW9uLmRhdGFzZXRzKVxuICAgID8gYWN0aW9uLmRhdGFzZXRzXG4gICAgOiBbYWN0aW9uLmRhdGFzZXRzXTtcblxuICBpZiAoYWN0aW9uLmNvbmZpZykge1xuICAgIC8vIGFwcGx5IGNvbmZpZyBpZiBwYXNzZWQgZnJvbSBhY3Rpb25cbiAgICBzdGF0ZSA9IHJlY2VpdmVNYXBDb25maWdVcGRhdGVyKHN0YXRlLCB7XG4gICAgICBwYXlsb2FkOiB7dmlzU3RhdGU6IGFjdGlvbi5jb25maWd9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBuZXdEYXRlRW50cmllcyA9IGRhdGFzZXRzLnJlZHVjZShcbiAgICAoYWNjdSwge2luZm8gPSB7fSwgZGF0YX0pID0+ICh7XG4gICAgICAuLi5hY2N1LFxuICAgICAgLi4uKGNyZWF0ZU5ld0RhdGFFbnRyeSh7aW5mbywgZGF0YX0sIHN0YXRlLmRhdGFzZXRzKSB8fCB7fSlcbiAgICB9KSxcbiAgICB7fVxuICApO1xuXG4gIGlmICghT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpLmxlbmd0aCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IHN0YXRlV2l0aE5ld0RhdGEgPSB7XG4gICAgLi4uc3RhdGUsXG4gICAgZGF0YXNldHM6IHtcbiAgICAgIC4uLnN0YXRlLmRhdGFzZXRzLFxuICAgICAgLi4ubmV3RGF0ZUVudHJpZXNcbiAgICB9XG4gIH07XG5cbiAgLy8gcHJldmlvdXNseSBzYXZlZCBjb25maWcgYmVmb3JlIGRhdGEgbG9hZGVkXG4gIGNvbnN0IHtcbiAgICBmaWx0ZXJUb0JlTWVyZ2VkID0gW10sXG4gICAgbGF5ZXJUb0JlTWVyZ2VkID0gW10sXG4gICAgaW50ZXJhY3Rpb25Ub0JlTWVyZ2VkID0ge31cbiAgfSA9IHN0YXRlV2l0aE5ld0RhdGE7XG5cbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBmaWx0ZXJzXG4gIGxldCBtZXJnZWRTdGF0ZSA9IG1lcmdlRmlsdGVycyhzdGF0ZVdpdGhOZXdEYXRhLCBmaWx0ZXJUb0JlTWVyZ2VkKTtcbiAgLy8gbWVyZ2Ugc3RhdGUgd2l0aCBzYXZlZCBsYXllcnNcbiAgbWVyZ2VkU3RhdGUgPSBtZXJnZUxheWVycyhtZXJnZWRTdGF0ZSwgbGF5ZXJUb0JlTWVyZ2VkKTtcblxuICBpZiAobWVyZ2VkU3RhdGUubGF5ZXJzLmxlbmd0aCA9PT0gc3RhdGUubGF5ZXJzLmxlbmd0aCkge1xuICAgIC8vIG5vIGxheWVyIG1lcmdlZCwgZmluZCBkZWZhdWx0c1xuICAgIG1lcmdlZFN0YXRlID0gYWRkRGVmYXVsdExheWVycyhtZXJnZWRTdGF0ZSwgbmV3RGF0ZUVudHJpZXMpO1xuICB9XG5cbiAgaWYgKG1lcmdlZFN0YXRlLnNwbGl0TWFwcy5sZW5ndGgpIHtcbiAgICBjb25zdCBuZXdMYXllcnMgPSBtZXJnZWRTdGF0ZS5sYXllcnMuZmlsdGVyKFxuICAgICAgbCA9PiBsLmNvbmZpZy5kYXRhSWQgaW4gbmV3RGF0ZUVudHJpZXNcbiAgICApO1xuICAgIC8vIGlmIG1hcCBpcyBzcGxpdGVkLCBhZGQgbmV3IGxheWVycyB0byBzcGxpdE1hcHNcbiAgICBtZXJnZWRTdGF0ZSA9IHtcbiAgICAgIC4uLm1lcmdlZFN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKG1lcmdlZFN0YXRlLnNwbGl0TWFwcywgbmV3TGF5ZXJzKVxuICAgIH07XG4gIH1cblxuICAvLyBtZXJnZSBzdGF0ZSB3aXRoIHNhdmVkIGludGVyYWN0aW9uc1xuICBtZXJnZWRTdGF0ZSA9IG1lcmdlSW50ZXJhY3Rpb25zKG1lcmdlZFN0YXRlLCBpbnRlcmFjdGlvblRvQmVNZXJnZWQpO1xuXG4gIC8vIGlmIG5vIHRvb2x0aXBzIG1lcmdlZCBhZGQgZGVmYXVsdCB0b29sdGlwc1xuICBPYmplY3Qua2V5cyhuZXdEYXRlRW50cmllcykuZm9yRWFjaChkYXRhSWQgPT4ge1xuICAgIGNvbnN0IHRvb2x0aXBGaWVsZHMgPVxuICAgICAgbWVyZ2VkU3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcC5jb25maWcuZmllbGRzVG9TaG93W2RhdGFJZF07XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRvb2x0aXBGaWVsZHMpIHx8ICF0b29sdGlwRmllbGRzLmxlbmd0aCkge1xuICAgICAgbWVyZ2VkU3RhdGUgPSBhZGREZWZhdWx0VG9vbHRpcHMobWVyZ2VkU3RhdGUsIG5ld0RhdGVFbnRyaWVzW2RhdGFJZF0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHVwZGF0ZUFsbExheWVyRG9tYWluRGF0YShtZXJnZWRTdGF0ZSwgT2JqZWN0LmtleXMobmV3RGF0ZUVudHJpZXMpKTtcbn07XG4vKiBlc2xpbnQtZW5hYmxlIG1heC1zdGF0ZW1lbnRzICovXG5cbmZ1bmN0aW9uIGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhsYXllcikge1xuICByZXR1cm4ge1xuICAgIGlzQXZhaWxhYmxlOiBsYXllci5jb25maWcuaXNWaXNpYmxlLFxuICAgIGlzVmlzaWJsZTogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICB9O1xufVxuXG4vKipcbiAqIFRoaXMgZW10aG9kIHdpbGwgY29tcHV0ZSB0aGUgZGVmYXVsdCBtYXBzIGN1c3RvbSBsaXN0XG4gKiBiYXNlZCBvbiB0aGUgY3VycmVudCBsYXllcnMgc3RhdHVzXG4gKiBAcGFyYW0gbGF5ZXJzXG4gKiBAcmV0dXJucyB7WyosKl19XG4gKi9cbmZ1bmN0aW9uIGNvbXB1dGVTcGxpdE1hcExheWVycyhsYXllcnMpIHtcbiAgY29uc3QgbWFwTGF5ZXJzID0gbGF5ZXJzLnJlZHVjZShcbiAgICAobmV3TGF5ZXJzLCBjdXJyZW50TGF5ZXIpID0+ICh7XG4gICAgICAuLi5uZXdMYXllcnMsXG4gICAgICBbY3VycmVudExheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGN1cnJlbnRMYXllcilcbiAgICB9KSxcbiAgICB7fVxuICApO1xuICByZXR1cm4gW1xuICAgIHtcbiAgICAgIGxheWVyczogbWFwTGF5ZXJzXG4gICAgfSxcbiAgICB7XG4gICAgICBsYXllcnM6IG1hcExheWVyc1xuICAgIH1cbiAgXTtcbn1cblxuLyoqXG4gKiBSZW1vdmUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHJlbW92ZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cbiAgICBjb25zdCB7W2xheWVyLmlkXTogXywgLi4ubmV3TGF5ZXJzfSA9IGxheWVycztcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNldHRpbmdzLFxuICAgICAgbGF5ZXJzOiBuZXdMYXllcnNcbiAgICB9O1xuICB9KTtcbn1cblxuLyoqXG4gKiBBZGQgbmV3IGxheWVycyB0byBib3RoIGV4aXN0aW5nIG1hcHNcbiAqIEBwYXJhbSBzcGxpdE1hcHNcbiAqIEBwYXJhbSBsYXllcnNcbiAqIEByZXR1cm5zIHtbKiwqXX0gbmV3IHNwbGl0TWFwc1xuICovXG5mdW5jdGlvbiBhZGROZXdMYXllcnNUb1NwbGl0TWFwKHNwbGl0TWFwcywgbGF5ZXJzKSB7XG4gIGNvbnN0IG5ld0xheWVycyA9IEFycmF5LmlzQXJyYXkobGF5ZXJzKSA/IGxheWVycyA6IFtsYXllcnNdO1xuXG4gIGlmICghc3BsaXRNYXBzIHx8ICFzcGxpdE1hcHMubGVuZ3RoIHx8ICFuZXdMYXllcnMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHNwbGl0TWFwcztcbiAgfVxuXG4gIC8vIGFkZCBuZXcgbGF5ZXIgdG8gYm90aCBtYXBzLFxuICAvLyAgZG9uJ3Qgb3ZlcnJpZGUsIGlmIGxheWVyLmlkIGlzIGFscmVhZHkgaW4gc3BsaXRNYXBzLnNldHRpbmdzLmxheWVyc1xuICByZXR1cm4gc3BsaXRNYXBzLm1hcChzZXR0aW5ncyA9PiAoe1xuICAgIC4uLnNldHRpbmdzLFxuICAgIGxheWVyczoge1xuICAgICAgLi4uc2V0dGluZ3MubGF5ZXJzLFxuICAgICAgLi4ubmV3TGF5ZXJzLnJlZHVjZShcbiAgICAgICAgKGFjY3UsIG5ld0xheWVyKSA9PlxuICAgICAgICAgIG5ld0xheWVyLmNvbmZpZy5pc1Zpc2libGVcbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgIC4uLmFjY3UsXG4gICAgICAgICAgICAgICAgW25ld0xheWVyLmlkXTogc2V0dGluZ3MubGF5ZXJzW25ld0xheWVyLmlkXVxuICAgICAgICAgICAgICAgICAgPyBzZXR0aW5ncy5sYXllcnNbbmV3TGF5ZXIuaWRdXG4gICAgICAgICAgICAgICAgICA6IGdlbmVyYXRlTGF5ZXJNZXRhRm9yU3BsaXRWaWV3cyhuZXdMYXllcilcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgOiBhY2N1LFxuICAgICAgICB7fVxuICAgICAgKVxuICAgIH1cbiAgfSkpO1xufVxuXG4vKipcbiAqIEhpZGUgYW4gZXhpc3RpbmcgbGF5ZXJzIGZyb20gY3VzdG9tIG1hcCBsYXllciBvYmplY3RzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBsYXllclxuICogQHJldHVybnMge1sqLCpdfSBNYXBzIG9mIGN1c3RvbSBsYXllciBvYmplY3RzXG4gKi9cbmZ1bmN0aW9uIHRvZ2dsZUxheWVyRnJvbVNwbGl0TWFwcyhzdGF0ZSwgbGF5ZXIpIHtcbiAgcmV0dXJuIHN0YXRlLnNwbGl0TWFwcy5tYXAoc2V0dGluZ3MgPT4ge1xuICAgIGNvbnN0IHtsYXllcnN9ID0gc2V0dGluZ3M7XG4gICAgY29uc3QgbmV3TGF5ZXJzID0ge1xuICAgICAgLi4ubGF5ZXJzLFxuICAgICAgW2xheWVyLmlkXTogZ2VuZXJhdGVMYXllck1ldGFGb3JTcGxpdFZpZXdzKGxheWVyKVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uc2V0dGluZ3MsXG4gICAgICBsYXllcnM6IG5ld0xheWVyc1xuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIFdoZW4gYSB1c2VyIGNsaWNrcyBvbiB0aGUgc3BlY2lmaWMgbWFwIGNsb3NpbmcgaWNvblxuICogdGhlIGFwcGxpY2F0aW9uIHdpbGwgY2xvc2UgdGhlIHNlbGVjdGVkIG1hcFxuICogYW5kIHdpbGwgbWVyZ2UgdGhlIHJlbWFpbmluZyBvbmUgd2l0aCB0aGUgZ2xvYmFsIHN0YXRlXG4gKiBUT0RPOiBpIHRoaW5rIGluIHRoZSBmdXR1cmUgdGhpcyBhY3Rpb24gc2hvdWxkIGJlIGNhbGxlZCBtZXJnZSBtYXAgbGF5ZXJzIHdpdGggZ2xvYmFsIHNldHRpbmdzXG4gKiBAcGFyYW0gc3RhdGVcbiAqIEBwYXJhbSBhY3Rpb25cbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiBjbG9zZVNwZWNpZmljTWFwQXRJbmRleChzdGF0ZSwgYWN0aW9uKSB7XG4gIC8vIHJldHJpZXZlIGxheWVycyBtZXRhIGRhdGEgZnJvbSB0aGUgcmVtYWluaW5nIG1hcCB0aGF0IHdlIG5lZWQgdG8ga2VlcFxuICBjb25zdCBpbmRleFRvUmV0cmlldmUgPSAxIC0gYWN0aW9uLnBheWxvYWQ7XG5cbiAgY29uc3QgbWV0YVNldHRpbmdzID0gc3RhdGUuc3BsaXRNYXBzW2luZGV4VG9SZXRyaWV2ZV07XG4gIGlmICghbWV0YVNldHRpbmdzIHx8ICFtZXRhU2V0dGluZ3MubGF5ZXJzKSB7XG4gICAgLy8gaWYgd2UgY2FuJ3QgZmluZCB0aGUgbWV0YSBzZXR0aW5ncyB3ZSBzaW1wbHkgY2xlYW4gdXAgc3BsaXRNYXBzIGFuZFxuICAgIC8vIGtlZXAgZ2xvYmFsIHN0YXRlIGFzIGl0IGlzXG4gICAgLy8gYnV0IHdoeSBkb2VzIHRoaXMgZXZlciBoYXBwZW4/XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgc3BsaXRNYXBzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb25zdCB7bGF5ZXJzfSA9IHN0YXRlO1xuXG4gIC8vIHVwZGF0ZSBsYXllciB2aXNpYmlsaXR5XG4gIGNvbnN0IG5ld0xheWVycyA9IGxheWVycy5tYXAobGF5ZXIgPT5cbiAgICBsYXllci51cGRhdGVMYXllckNvbmZpZyh7XG4gICAgICBpc1Zpc2libGU6IG1ldGFTZXR0aW5ncy5sYXllcnNbbGF5ZXIuaWRdXG4gICAgICAgID8gbWV0YVNldHRpbmdzLmxheWVyc1tsYXllci5pZF0uaXNWaXNpYmxlXG4gICAgICAgIDogbGF5ZXIuY29uZmlnLmlzVmlzaWJsZVxuICAgIH0pXG4gICk7XG5cbiAgLy8gZGVsZXRlIG1hcFxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogbmV3TGF5ZXJzLFxuICAgIHNwbGl0TWFwczogW11cbiAgfTtcbn1cblxuLy8gVE9ETzogcmVkbyB3cml0ZSBoYW5kbGVyIHRvIG5vdCB1c2UgdGFza3NcbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNVcGRhdGVyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAgY29uc3Qge2ZpbGVzfSA9IGFjdGlvbjtcblxuICBjb25zdCBmaWxlc1RvTG9hZCA9IGZpbGVzLm1hcChmaWxlQmxvYiA9PiAoe1xuICAgIGZpbGVCbG9iLFxuICAgIGluZm86IHtcbiAgICAgIGlkOiBnZW5lcmF0ZUhhc2hJZCg0KSxcbiAgICAgIGxhYmVsOiBmaWxlQmxvYi5uYW1lLFxuICAgICAgc2l6ZTogZmlsZUJsb2Iuc2l6ZVxuICAgIH0sXG4gICAgaGFuZGxlcjogZ2V0RmlsZUhhbmRsZXIoZmlsZUJsb2IpXG4gIH0pKTtcblxuICAvLyByZWFkZXIgLT4gcGFyc2VyIC0+IGF1Z21lbnQgLT4gcmVjZWl2ZVZpc0RhdGFcbiAgY29uc3QgbG9hZEZpbGVUYXNrcyA9IFtcbiAgICBUYXNrLmFsbChmaWxlc1RvTG9hZC5tYXAoTE9BRF9GSUxFX1RBU0spKS5iaW1hcChcbiAgICAgIHJlc3VsdHMgPT4ge1xuICAgICAgICBjb25zdCBkYXRhID0gcmVzdWx0cy5yZWR1Y2UoKGYsIGMpID0+ICh7XG4gICAgICAgICAgLy8gdXNpbmcgY29uY2F0IGhlcmUgYmVjYXVzZSB0aGUgY3VycmVudCBkYXRhc2V0cyBjb3VsZCBiZSBhbiBhcnJheSBvciBhIHNpbmdsZSBpdGVtXG4gICAgICAgICAgZGF0YXNldHM6IGYuZGF0YXNldHMuY29uY2F0KGMuZGF0YXNldHMpLFxuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gZGVlcCBtZXJnZSB0aGlzIHRoaW5nIHVubGVzcyB3ZSBmaW5kIGEgYmV0dGVyIHNvbHV0aW9uXG4gICAgICAgICAgLy8gdGhpcyBjYXNlIHdpbGwgb25seSBoYXBwZW4gaWYgd2UgYWxsb3cgdG8gbG9hZCBtdWx0aXBsZSBrZXBsZXJnbCBqc29uIGZpbGVzXG4gICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAuLi5mLmNvbmZpZyxcbiAgICAgICAgICAgIC4uLihjLmNvbmZpZyB8fCB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pLCB7ZGF0YXNldHM6IFtdLCBjb25maWc6IHt9LCBvcHRpb25zOiB7Y2VudGVyTWFwOiB0cnVlfX0pO1xuICAgICAgICByZXR1cm4gYWRkRGF0YVRvTWFwKGRhdGEpO1xuICAgICAgfSxcbiAgICAgIGVycm9yID0+IGxvYWRGaWxlc0VycihlcnJvcilcbiAgICApXG4gIF07XG5cbiAgcmV0dXJuIHdpdGhUYXNrKFxuICAgIHtcbiAgICAgIC4uLnN0YXRlLFxuICAgICAgZmlsZUxvYWRpbmc6IHRydWVcbiAgICB9LFxuICAgIGxvYWRGaWxlVGFza3NcbiAgKTtcbn07XG5cbmV4cG9ydCBjb25zdCBsb2FkRmlsZXNFcnJVcGRhdGVyID0gKHN0YXRlLCB7ZXJyb3J9KSA9PiAoe1xuICAuLi5zdGF0ZSxcbiAgZmlsZUxvYWRpbmc6IGZhbHNlLFxuICBmaWxlTG9hZGluZ0VycjogZXJyb3Jcbn0pO1xuXG4vKipcbiAqIGhlbHBlciBmdW5jdGlvbiB0byB1cGRhdGUgQWxsIGxheWVyIGRvbWFpbiBhbmQgbGF5ZXIgZGF0YSBvZiBzdGF0ZVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGRhdGFzZXRzXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBzdGF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkRGVmYXVsdExheWVycyhzdGF0ZSwgZGF0YXNldHMpIHtcbiAgY29uc3QgZGVmYXVsdExheWVycyA9IE9iamVjdC52YWx1ZXMoZGF0YXNldHMpLnJlZHVjZShcbiAgICAoYWNjdSwgZGF0YXNldCkgPT4gW1xuICAgICAgLi4uYWNjdSxcbiAgICAgIC4uLihmaW5kRGVmYXVsdExheWVyKGRhdGFzZXQsIHN0YXRlLmxheWVyQ2xhc3NlcykgfHwgW10pXG4gICAgXSxcbiAgICBbXVxuICApO1xuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGxheWVyczogWy4uLnN0YXRlLmxheWVycywgLi4uZGVmYXVsdExheWVyc10sXG4gICAgbGF5ZXJPcmRlcjogW1xuICAgICAgLy8gcHV0IG5ldyBsYXllcnMgb24gdG9wIG9mIG9sZCBvbmVzXG4gICAgICAuLi5kZWZhdWx0TGF5ZXJzLm1hcCgoXywgaSkgPT4gc3RhdGUubGF5ZXJzLmxlbmd0aCArIGkpLFxuICAgICAgLi4uc3RhdGUubGF5ZXJPcmRlclxuICAgIF1cbiAgfTtcbn1cblxuLyoqXG4gKiBoZWxwZXIgZnVuY3Rpb24gdG8gZmluZCBkZWZhdWx0IHRvb2x0aXBzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YXNldFxuICogQHJldHVybnMge29iamVjdH0gc3RhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZERlZmF1bHRUb29sdGlwcyhzdGF0ZSwgZGF0YXNldCkge1xuICBjb25zdCB0b29sdGlwRmllbGRzID0gZmluZEZpZWxkc1RvU2hvdyhkYXRhc2V0KTtcblxuICByZXR1cm4ge1xuICAgIC4uLnN0YXRlLFxuICAgIGludGVyYWN0aW9uQ29uZmlnOiB7XG4gICAgICAuLi5zdGF0ZS5pbnRlcmFjdGlvbkNvbmZpZyxcbiAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgLi4uc3RhdGUuaW50ZXJhY3Rpb25Db25maWcudG9vbHRpcCxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgLy8gZmluZCBkZWZhdWx0IGZpZWxkcyB0byBzaG93IGluIHRvb2x0aXBcbiAgICAgICAgICBmaWVsZHNUb1Nob3c6IHtcbiAgICAgICAgICAgIC4uLnN0YXRlLmludGVyYWN0aW9uQ29uZmlnLnRvb2x0aXAuY29uZmlnLmZpZWxkc1RvU2hvdyxcbiAgICAgICAgICAgIC4uLnRvb2x0aXBGaWVsZHNcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogaGVscGVyIGZ1bmN0aW9uIHRvIHVwZGF0ZSBsYXllciBkb21haW5zIGZvciBhbiBhcnJheSBvZiBkYXRzZXRzXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IHN0YXRlXG4gKiBAcGFyYW0ge2FycmF5IHwgc3RyaW5nfSBkYXRhSWRcbiAqIEBwYXJhbSB7b2JqZWN0fSBuZXdGaWx0ZXIgLSBpZiBpcyBjYWxsZWQgYnkgc2V0RmlsdGVyLCB0aGUgZmlsdGVyIHRoYXQgaGFzIGNoYW5nZWRcbiAqIEByZXR1cm5zIHtvYmplY3R9IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBbGxMYXllckRvbWFpbkRhdGEoc3RhdGUsIGRhdGFJZCwgbmV3RmlsdGVyKSB7XG4gIGNvbnN0IGRhdGFJZHMgPSB0eXBlb2YgZGF0YUlkID09PSAnc3RyaW5nJyA/IFtkYXRhSWRdIDogZGF0YUlkO1xuICBjb25zdCBuZXdMYXllcnMgPSBbXTtcbiAgY29uc3QgbmV3TGF5ZXJEYXRhcyA9IFtdO1xuXG4gIHN0YXRlLmxheWVycy5mb3JFYWNoKChvbGRMYXllciwgaSkgPT4ge1xuICAgIGlmIChvbGRMYXllci5jb25maWcuZGF0YUlkICYmIGRhdGFJZHMuaW5jbHVkZXMob2xkTGF5ZXIuY29uZmlnLmRhdGFJZCkpIHtcbiAgICAgIC8vIE5vIG5lZWQgdG8gcmVjYWxjdWxhdGUgbGF5ZXIgZG9tYWluIGlmIGZpbHRlciBoYXMgZml4ZWQgZG9tYWluXG4gICAgICBjb25zdCBuZXdMYXllciA9XG4gICAgICAgIG5ld0ZpbHRlciAmJiBuZXdGaWx0ZXIuZml4ZWREb21haW5cbiAgICAgICAgICA/IG9sZExheWVyXG4gICAgICAgICAgOiBvbGRMYXllci51cGRhdGVMYXllckRvbWFpbihcbiAgICAgICAgICAgICAgc3RhdGUuZGF0YXNldHNbb2xkTGF5ZXIuY29uZmlnLmRhdGFJZF0sXG4gICAgICAgICAgICAgIG5ld0ZpbHRlclxuICAgICAgICAgICAgKTtcblxuICAgICAgY29uc3Qge2xheWVyRGF0YSwgbGF5ZXJ9ID0gY2FsY3VsYXRlTGF5ZXJEYXRhKFxuICAgICAgICBuZXdMYXllcixcbiAgICAgICAgc3RhdGUsXG4gICAgICAgIHN0YXRlLmxheWVyRGF0YVtpXVxuICAgICAgKTtcblxuICAgICAgbmV3TGF5ZXJzLnB1c2gobGF5ZXIpO1xuICAgICAgbmV3TGF5ZXJEYXRhcy5wdXNoKGxheWVyRGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0xheWVycy5wdXNoKG9sZExheWVyKTtcbiAgICAgIG5ld0xheWVyRGF0YXMucHVzaChzdGF0ZS5sYXllckRhdGFbaV0pO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5zdGF0ZSxcbiAgICBsYXllcnM6IG5ld0xheWVycyxcbiAgICBsYXllckRhdGE6IG5ld0xheWVyRGF0YXNcbiAgfTtcbn1cbiJdfQ==