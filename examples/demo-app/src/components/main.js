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

import types from './types';

const { START_LOADING, STOP_LOADING, TILE_START_LOADING, TILE_STOP_LOADING, SET_POSITION, SET_ERROR } = types;

const initialState = {
  isLoading: true,
  tilesLoading: 0,
  longitude: 0,
  latitude: 0,
  zoom: 5,
  errorMessage: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case STOP_LOADING:
      return { ...state, isLoading: false };
    case TILE_START_LOADING:
      return { ...state, tilesLoading: state.tilesLoading + 1 };
    case TILE_STOP_LOADING:
      return { ...state, tilesLoading: state.tilesLoading - 1 };
    case SET_POSITION:
      return {
        ...state,
        longitude: action.longitude,
        latitude: action.latitude,
        zoom: action.zoom || state.zoom,
      };

    case SET_ERROR:
      return {
        ...state,
        errorMessage: action.message,
      };
    default:
      return state;
  }
}
