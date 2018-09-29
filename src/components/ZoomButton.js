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

import React from 'react';
import window from 'global/window';
import { addDataToMap } from 'kepler.gl/actions';

class ZoomButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			defaultZoom: 1,
			showField: false
		};
	}

	handleZoom(action) {
		const defaultZoom = this.props.state.map.mapState.zoom;
		let maxZoom = 20;
		let minZoom = 1;
		let zoomIn = null;
		let val = this.state.defaultZoom
		if(action === 'plus') {
			let zoom = defaultZoom + val;
			zoomIn = zoom <= maxZoom ? zoom : maxZoom; 
		}else {
			let zoom = defaultZoom - val;
			zoomIn = zoom <= minZoom ? minZoom : zoom;
		}

		this.state.showField && this.setState({ showField: false });	
		
		this.props.add(
				addDataToMap({
					datasets: [
						{
							info: {
								label: 'new dataset',
								id: 'new_dataset'
							}
						}
					],
					options: {
						centerMap: true
					},
					config: {
						mapState: {
							zoom: zoomIn
						}
					}
				})
			); 
	}
	render() {
		const defaultZoom = this.props.state.map && this.props.state.map.mapState.zoom;
		const field = (
			<div className="form-row">
			<div className="col">
				<input type="text" className="form-control" placeholder="zoom" value={this.state.defaultZoom} onChange={(event) => this.setState({ defaultZoom: parseInt(event.target.value, 10) })}/>
			</div>
			</div>
		);
	return (
		<div 
			className="btn-group-vertical" 
			style={{ 
				position: 'absolute',
				zIndex: 2,
				marginTop: window.innerHeight - 150,
				marginLeft: window.innerWidth - 50
			}}
		>	
			{ this.state.showField ? field : <button type="button" className="btn btn-secondary" style={{ color: 'white' }} onClick={()=> this.setState({ showField: true })}>{defaultZoom}x</button> }
			<button type="button" className="btn btn-secondary" onClick={() => this.handleZoom('plus')}>+</button>
			<button type="button" className="btn btn-secondary" onClick={() => this.handleZoom('minus')}>-</button>
		</div>
	);
};
}

export default ZoomButton;