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

import {HexagonCellLayer} from 'deck.gl';
import {CylinderGeometry} from 'luma.gl';
import {getAngle, getRadius, getH3VerticeTransform, transformCylinderPositions} from './h3-utils';

// TODO: export all dekc.gl layers from kepler.gl
export default class H3HexagonCellLayer extends HexagonCellLayer {

  getCylinderGeometry(radius) {
    const transform = this.getTransform();

    const cylinderGeometry = new CylinderGeometry({
      radius,
      topRadius: radius,
      bottomRadius: radius,
      topCap: true,
      bottomCap: true,
      height: 1,
      verticalAxis: 'z',
      nradial: 6,
      nvertical: 1
    });

    const pos = cylinderGeometry.attributes.positions.value;

    if (transform) {
      const adjusted = transformCylinderPositions(pos, transform);
      cylinderGeometry.attributes.positions.value = adjusted;
    }

    return cylinderGeometry;
  }

  getTransform() {
    const {hexagonVertices, hexagonCenter} = this.props;

    if (Array.isArray(hexagonVertices) &&
      hexagonVertices.length >= 6 &&
      Array.isArray(hexagonCenter)) {
        const screenVertices = hexagonVertices.map(d => this.projectFlat(d));
        const screenCentroid = this.projectFlat(hexagonCenter);
        return getH3VerticeTransform(screenVertices, screenCentroid);
    }

    return null;
  }

  updateRadiusAngle() {
    let {angle, radius} = this.props;
    const {hexagonVertices} = this.props;

    if (Array.isArray(hexagonVertices) && hexagonVertices.length >= 6) {
      const {viewport} = this.context;
      // calculate angle and vertices from hexagonVertices if provided
      const vertices = this.props.hexagonVertices;

      const vertex0 = vertices[0];
      const vertex3 = vertices[3];

      // transform to space coordinates
      const {pixelsPerMeter} = viewport.getDistanceScales();
      const spaceCoord0 = this.projectFlat(vertex0);
      const spaceCoord3 = this.projectFlat(vertex3);

      angle = getAngle(spaceCoord0, spaceCoord3);
      radius = getRadius(spaceCoord0, spaceCoord3) /pixelsPerMeter[0];
    }

    this.setState({angle, radius});
  }

  draw(opts) {
    const {uniforms} = opts;

    super.draw({
      ...opts,
      uniforms: {
        ...uniforms,
        picking_uHighlightScale: this.props.extruded ? 1.4 : 0.0
      }
    })
  }
}

H3HexagonCellLayer.layerName = 'H3HexagonCellLayer';
