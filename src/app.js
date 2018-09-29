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

import React, {Component} from 'react';
import styled from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import InputField from './components/InputField';
import ZoomButton from './components/ZoomButton';

import {loadSampleConfigurations} from './actions';
import {replaceLoadDataModal, replaceHeader} from './factories/load-data-modal';
import {injectComponents } from 'kepler.gl/components';
import { ToastContainer } from 'react-toastify';

const KeplerGl = injectComponents([
  replaceLoadDataModal()
],
[
  replaceHeader()
]);

const MAPBOX_TOKEN = process.env.MapboxAccessToken || 'pk.eyJ1IjoidmFpYmhhdi1ndXJuYW5pIiwiYSI6ImNqbWcwMHg1aDBhZXkza3BmdHh4dDNjN3oifQ.Hx3pd97ctvbEAlqOXpCydQ' // eslint-disable-line

// Sample data
/* eslint-disable no-unused-vars */
import sampleTripData from './data/sample-trip-data';
import sampleGeojson from './data/sample-geojson.json';
import sampleH3Data from './data/sample-hex-id-csv';
import sampleIconCsv, {config as savedMapConfig} from './data/sample-icon-csv';
import {updateVisData, addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
/* eslint-enable no-unused-vars */

const bannerHeight = 50;

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentWillMount() {
    const {params: {id: sampleMapId} = {}} = this.props;
    this.props.dispatch(loadSampleConfigurations(sampleMapId));
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  _loadSampleData() {
    this.props.dispatch(
      updateVisData(
        // datasets
        {
          info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
          },
          data: sampleTripData
        },
        // option
        {
          centerMap: true,
          readOnly: false
        },
        // config
        {
          filters: [
            {
              id: 'me',
              dataId: 'test_trip_data',
              name: 'tpep_pickup_datetime',
              type: 'timeRange',
              enlarged: true
            }
          ]
        }
      )
    );

    // load icon data and config and process csv file
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'Icon Data',
              id: 'test_icon_data'
            },
            data: Processors.processCsvData(sampleIconCsv)
          }
        ],
        options: {
          centerMap: false
        },
        config: savedMapConfig
      })
    );

    // load geojson
    this.props.dispatch(
      updateVisData({
        info: {label: 'SF Zip Geo'},
        data: Processors.processGeojson(sampleGeojson)
      })
    );

    // load h3 hexagon
    this.props.dispatch(
      addDataToMap({
        datasets: [
          {
            info: {
              label: 'H3 Hexagons V2',
              id: 'h3-hex-id'
            },
            data: Processors.processCsvData(sampleH3Data)
          }
        ]
      })
    );
  }

  render() {
    const { width, height} = this.state;
    return (
      <GlobalStyleDiv>
        <div style={{
          transition: 'margin 1s, height 1s',
            position: 'absolute',
            height: `${bannerHeight}px`
        }}>
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <a className="navbar-brand" href="#">Kepler</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <form className="form-inline">
              <InputField add={this.props.dispatch} state={this.props.demo.keplerGl}/>
            </form>
          </nav>
        </div>
        <ToastContainer/>
        <div
          style={{
            transition: 'margin 1s, height 1s',
            position: 'absolute',
            width: '100%',
            marginTop: `${bannerHeight}px`,
            zIndex: -1
          }}
        >
          <KeplerGl
            mapboxApiAccessToken={MAPBOX_TOKEN}
            id="map"
            getState={state => state.demo.keplerGl}
            width={width}
            height={height - bannerHeight}
          />
        </div>
        <ZoomButton add={this.props.dispatch} state={this.props.demo.keplerGl}/>
      </GlobalStyleDiv>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
