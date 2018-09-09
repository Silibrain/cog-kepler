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

import { connect } from 'react-redux';
import { addSceneFromIndex } from '../../actions/scenes/index';
import '../../styles.css';


import {isChrome} from 'utils/utils';


const MESSAGE = ' Enter URL ';
const CHROME_MSG =
  '*URL should consist of map data in tiff format.';
const DISCLAIMER = '*Kepler.gl is a client-side application with no server backend. Data lives only on your machine/browser. ' +
  'No information or map data is sent to any server.';

const WarningMsg = styled.span`
  margin-top: 10px;
  color: ${props => props.theme.errorColor};
`;

const MsgWrapper = styled.div`
  color: ${props => props.theme.modalTitleColor};
  font-size: 20px;
  height: 36px;
`;

const StyledMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDisclaimer = StyledMessage.extend`
  position: absolute;
  bottom: 0;
  padding: 10px 30px;
`;

const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

const mapStateToProps = ({ scenes, main }) => ({ scenes, isLoading: main.isLoading });

const mapDispatchToProps = (dispatch) => {
  return {
    addSceneFromIndex: (...args) => dispatch(addSceneFromIndex(...args)),
  };
};

class ConnectedAddSceneForm extends Component {
    constructor() {
      super();
  
      this.state = {
        url: '',
      };
  
      this.handleUrlChange = this.handleUrlChange.bind(this);
      this.handleAddClick = this.handleAddClick.bind(this);
    }
  
    handleUrlChange(event) {
      this.setState({ url: event.target.value });
    }
  
    handleAddClick() {
      this.props.addSceneFromIndex(this.state.url);
    }
  
    checkUrl(url) {
      return urlPattern.test(url) && !this.props.scenes.find(scene => scene.id === url);
    }
  
    isLoading() {
      return this.props.isLoading;
    }

  render() {
    const { url } = this.state;

    return (
        <React.Fragment>
      <StyledFileUpload
        className="file-uploader"
      >
          <input
            className="form-control span6"
            placeholder="Custom URL"
            value={url}
            onChange={this.handleUrlChange}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              value={url}
              onClick={this.handleAddClick}
              disabled={!this.checkUrl(url) || this.isLoading()}
            >
              Load URL or sample
            </button>
            <button
              className="btn btn-primary dropdown-toggle dropdown-toggle-split"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="sr-only">Toggle Dropdown</span>
            </button>
            </div>
      
            <MsgWrapper>{MESSAGE}</MsgWrapper>
          
            <StyledDisclaimer>{DISCLAIMER}</StyledDisclaimer>
        <WarningMsg>{isChrome() ? CHROME_MSG : ''}</WarningMsg>
      </StyledFileUpload>
      </React.Fragment>
    );
  }
}
const AddSceneForm = connect(mapStateToProps, mapDispatchToProps)(ConnectedAddSceneForm);

export default AddSceneForm;

