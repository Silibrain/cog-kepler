import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BrowseButton from './browse-button';
import LoadingSpinner from 'components/common/loading-spinner';
import {isChrome} from 'utils/utils';



const MESSAGE = ' Enter URL ';
const CHROME_MSG =
  '*URL should consist of map data in tiff format.';
const DISCLAIMER = '*Kepler.gl is a client-side application with no server backend. Data lives only on your machine/browser. ' +
  'No information or map data is sent to any server.';
const CONFIG_UPLOAD_MESSAGE = 'Upload data files or upload a saved map via previously exported single Json of both config and data';

const WarningMsg = styled.span`
  margin-top: 10px;
  color: ${props => props.theme.errorColor};
`;

const PositiveMsg = styled.span`
  color: ${props => props.theme.primaryBtnActBgd};
`;

const StyledFileDrop = styled.div`
  background-color: white;
  border-radius: 4px;
  border-style: dashed;
  border-width: 1px;
  border-color: ${props => props.theme.subtextColorLT};
  height: 414px;
  padding-top: 60px;
  text-align: center;
  width: 100%;

  .browse-or {
    color: ${props => props.theme.linkBtnColor};
    padding-right: 4px;
  }
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

export default class Browse extends Component {
  state = {
    files: []
  };

  _isValidFileType = filename => {
    const {validFileExt} = this.props;
    const fileExt = validFileExt.find(ext => filename.endsWith(ext));

    return Boolean(fileExt);
  };

  _handleFileDrop = (files, e) => {
    if (e) {
      e.stopPropagation();
    }

    const nextState = {files: [], errorFiles: [], dragOver: false};
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file && this._isValidFileType(file.name)) {
        nextState.files.push(file);
      } else {
        nextState.errorFiles.push(file.name);
      }
    }

    this.setState(
      nextState,
      () =>
        nextState.files.length ? this.props.onFileUpload(nextState.files) : null
    );
  };

  _toggleDragState = newState => {
    this.setState({dragOver: newState});
  };

  _renderMessage() {
    const {errorFiles, files} = this.state;

    if (errorFiles.length) {
      return (
        <WarningMsg>
          {`File ${errorFiles.join(', ')} is not supported.`}
        </WarningMsg>
      );
    }

    if (!files.length) {
      return null;
    }

    return (
      <StyledMessage className="file-uploader__message">
        <div>Uploading...</div>
        <PositiveMsg>
          {`${files.map(f => f.name).join(' and ')}...`}
        </PositiveMsg>
        <LoadingSpinner size={20} />
      </StyledMessage>
    );
  }

  render() {
    const {dragOver, files} = this.state;
    const {validFileExt} = this.props;
    return (
      <StyledFileUpload
        className="file-uploader"
        innerRef={cmp => (this.frame = cmp)}
      >
        <input
          className="filter-upload__input"
          type="file"
          onChange={this._onChange}
        />
        {FileDrop ? (
          <FileDrop
            frame={this.frame}
            targetAlwaysVisible
            onDragOver={() => this._toggleDragState(true)}
            onDragLeave={() => this._toggleDragState(false)}
            onDrop={this._handleFileDrop}
          >
            <div className="file-upload__message">{CONFIG_UPLOAD_MESSAGE}</div>
            <StyledFileDrop dragOver={dragOver}>
              <div style={{opacity: dragOver ? 0.5 : 1}}>
                <StyledDragNDropIcon>
                  <div className="file-type-row">
                    {validFileExt.map(ext => (
                      <FileType key={ext} ext={ext} height="50px" fontSize="9px"/>
                    ))}
                  </div>
                  <DragNDrop height="44px" />
                </StyledDragNDropIcon>
                <div>{this._renderMessage()}</div>
              </div>
              {!files.length ? <div>
                <MsgWrapper>{MESSAGE}</MsgWrapper>
                <span className="file-upload-or">or</span>
                <UploadButton onUpload={this._handleFileDrop}>
                  browse your files
                </UploadButton>
              </div> : null}
              <StyledDisclaimer>{DISCLAIMER}</StyledDisclaimer>
            </StyledFileDrop>
          </FileDrop>
        ) : null}

        <WarningMsg>{isChrome() ? CHROME_MSG : ''}</WarningMsg>
      </StyledFileUpload>
    );
  }
}

