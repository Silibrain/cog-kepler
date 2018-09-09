'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _deck = require('deck.gl');

var _luma = require('luma.gl');

var _h3Utils = require('./h3-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: export all dekc.gl layers from kepler.gl
var H3HexagonCellLayer = function (_HexagonCellLayer) {
  (0, _inherits3.default)(H3HexagonCellLayer, _HexagonCellLayer);

  function H3HexagonCellLayer() {
    (0, _classCallCheck3.default)(this, H3HexagonCellLayer);
    return (0, _possibleConstructorReturn3.default)(this, (H3HexagonCellLayer.__proto__ || Object.getPrototypeOf(H3HexagonCellLayer)).apply(this, arguments));
  }

  (0, _createClass3.default)(H3HexagonCellLayer, [{
    key: 'getCylinderGeometry',
    value: function getCylinderGeometry(radius) {
      var transform = this.getTransform();

      var cylinderGeometry = new _luma.CylinderGeometry({
        radius: radius,
        topRadius: radius,
        bottomRadius: radius,
        topCap: true,
        bottomCap: true,
        height: 1,
        verticalAxis: 'z',
        nradial: 6,
        nvertical: 1
      });

      var pos = cylinderGeometry.attributes.positions.value;

      if (transform) {
        var adjusted = (0, _h3Utils.transformCylinderPositions)(pos, transform);
        cylinderGeometry.attributes.positions.value = adjusted;
      }

      return cylinderGeometry;
    }
  }, {
    key: 'getTransform',
    value: function getTransform() {
      var _this2 = this;

      var _props = this.props,
          hexagonVertices = _props.hexagonVertices,
          hexagonCenter = _props.hexagonCenter;


      if (Array.isArray(hexagonVertices) && hexagonVertices.length >= 6 && Array.isArray(hexagonCenter)) {
        var screenVertices = hexagonVertices.map(function (d) {
          return _this2.projectFlat(d);
        });
        var screenCentroid = this.projectFlat(hexagonCenter);
        return (0, _h3Utils.getH3VerticeTransform)(screenVertices, screenCentroid);
      }

      return null;
    }
  }, {
    key: 'updateRadiusAngle',
    value: function updateRadiusAngle() {
      var _props2 = this.props,
          angle = _props2.angle,
          radius = _props2.radius;
      var hexagonVertices = this.props.hexagonVertices;


      if (Array.isArray(hexagonVertices) && hexagonVertices.length >= 6) {
        var viewport = this.context.viewport;
        // calculate angle and vertices from hexagonVertices if provided

        var vertices = this.props.hexagonVertices;

        var vertex0 = vertices[0];
        var vertex3 = vertices[3];

        // transform to space coordinates

        var _viewport$getDistance = viewport.getDistanceScales(),
            pixelsPerMeter = _viewport$getDistance.pixelsPerMeter;

        var spaceCoord0 = this.projectFlat(vertex0);
        var spaceCoord3 = this.projectFlat(vertex3);

        angle = (0, _h3Utils.getAngle)(spaceCoord0, spaceCoord3);
        radius = (0, _h3Utils.getRadius)(spaceCoord0, spaceCoord3) / pixelsPerMeter[0];
      }

      this.setState({ angle: angle, radius: radius });
    }
  }, {
    key: 'draw',
    value: function draw(opts) {
      var uniforms = opts.uniforms;


      (0, _get3.default)(H3HexagonCellLayer.prototype.__proto__ || Object.getPrototypeOf(H3HexagonCellLayer.prototype), 'draw', this).call(this, (0, _extends3.default)({}, opts, {
        uniforms: (0, _extends3.default)({}, uniforms, {
          picking_uHighlightScale: this.props.extruded ? 1.4 : 0.0
        })
      }));
    }
  }]);
  return H3HexagonCellLayer;
}(_deck.HexagonCellLayer); // Copyright (c) 2018 Uber Technologies, Inc.
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

exports.default = H3HexagonCellLayer;


H3HexagonCellLayer.layerName = 'H3HexagonCellLayer';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sYXllcnMvaDMtaGV4YWdvbi1sYXllci9oMy1oZXhhZ29uLWNlbGwtbGF5ZXIuanMiXSwibmFtZXMiOlsiSDNIZXhhZ29uQ2VsbExheWVyIiwicmFkaXVzIiwidHJhbnNmb3JtIiwiZ2V0VHJhbnNmb3JtIiwiY3lsaW5kZXJHZW9tZXRyeSIsIkN5bGluZGVyR2VvbWV0cnkiLCJ0b3BSYWRpdXMiLCJib3R0b21SYWRpdXMiLCJ0b3BDYXAiLCJib3R0b21DYXAiLCJoZWlnaHQiLCJ2ZXJ0aWNhbEF4aXMiLCJucmFkaWFsIiwibnZlcnRpY2FsIiwicG9zIiwiYXR0cmlidXRlcyIsInBvc2l0aW9ucyIsInZhbHVlIiwiYWRqdXN0ZWQiLCJwcm9wcyIsImhleGFnb25WZXJ0aWNlcyIsImhleGFnb25DZW50ZXIiLCJBcnJheSIsImlzQXJyYXkiLCJsZW5ndGgiLCJzY3JlZW5WZXJ0aWNlcyIsIm1hcCIsInByb2plY3RGbGF0IiwiZCIsInNjcmVlbkNlbnRyb2lkIiwiYW5nbGUiLCJ2aWV3cG9ydCIsImNvbnRleHQiLCJ2ZXJ0aWNlcyIsInZlcnRleDAiLCJ2ZXJ0ZXgzIiwiZ2V0RGlzdGFuY2VTY2FsZXMiLCJwaXhlbHNQZXJNZXRlciIsInNwYWNlQ29vcmQwIiwic3BhY2VDb29yZDMiLCJzZXRTdGF0ZSIsIm9wdHMiLCJ1bmlmb3JtcyIsInBpY2tpbmdfdUhpZ2hsaWdodFNjYWxlIiwiZXh0cnVkZWQiLCJIZXhhZ29uQ2VsbExheWVyIiwibGF5ZXJOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOztBQUNBOztBQUNBOzs7O0FBRUE7SUFDcUJBLGtCOzs7Ozs7Ozs7O3dDQUVDQyxNLEVBQVE7QUFDMUIsVUFBTUMsWUFBWSxLQUFLQyxZQUFMLEVBQWxCOztBQUVBLFVBQU1DLG1CQUFtQixJQUFJQyxzQkFBSixDQUFxQjtBQUM1Q0osc0JBRDRDO0FBRTVDSyxtQkFBV0wsTUFGaUM7QUFHNUNNLHNCQUFjTixNQUg4QjtBQUk1Q08sZ0JBQVEsSUFKb0M7QUFLNUNDLG1CQUFXLElBTGlDO0FBTTVDQyxnQkFBUSxDQU5vQztBQU81Q0Msc0JBQWMsR0FQOEI7QUFRNUNDLGlCQUFTLENBUm1DO0FBUzVDQyxtQkFBVztBQVRpQyxPQUFyQixDQUF6Qjs7QUFZQSxVQUFNQyxNQUFNVixpQkFBaUJXLFVBQWpCLENBQTRCQyxTQUE1QixDQUFzQ0MsS0FBbEQ7O0FBRUEsVUFBSWYsU0FBSixFQUFlO0FBQ2IsWUFBTWdCLFdBQVcseUNBQTJCSixHQUEzQixFQUFnQ1osU0FBaEMsQ0FBakI7QUFDQUUseUJBQWlCVyxVQUFqQixDQUE0QkMsU0FBNUIsQ0FBc0NDLEtBQXRDLEdBQThDQyxRQUE5QztBQUNEOztBQUVELGFBQU9kLGdCQUFQO0FBQ0Q7OzttQ0FFYztBQUFBOztBQUFBLG1CQUM0QixLQUFLZSxLQURqQztBQUFBLFVBQ05DLGVBRE0sVUFDTkEsZUFETTtBQUFBLFVBQ1dDLGFBRFgsVUFDV0EsYUFEWDs7O0FBR2IsVUFBSUMsTUFBTUMsT0FBTixDQUFjSCxlQUFkLEtBQ0ZBLGdCQUFnQkksTUFBaEIsSUFBMEIsQ0FEeEIsSUFFRkYsTUFBTUMsT0FBTixDQUFjRixhQUFkLENBRkYsRUFFZ0M7QUFDNUIsWUFBTUksaUJBQWlCTCxnQkFBZ0JNLEdBQWhCLENBQW9CO0FBQUEsaUJBQUssT0FBS0MsV0FBTCxDQUFpQkMsQ0FBakIsQ0FBTDtBQUFBLFNBQXBCLENBQXZCO0FBQ0EsWUFBTUMsaUJBQWlCLEtBQUtGLFdBQUwsQ0FBaUJOLGFBQWpCLENBQXZCO0FBQ0EsZUFBTyxvQ0FBc0JJLGNBQXRCLEVBQXNDSSxjQUF0QyxDQUFQO0FBQ0g7O0FBRUQsYUFBTyxJQUFQO0FBQ0Q7Ozt3Q0FFbUI7QUFBQSxvQkFDSSxLQUFLVixLQURUO0FBQUEsVUFDYlcsS0FEYSxXQUNiQSxLQURhO0FBQUEsVUFDTjdCLE1BRE0sV0FDTkEsTUFETTtBQUFBLFVBRVhtQixlQUZXLEdBRVEsS0FBS0QsS0FGYixDQUVYQyxlQUZXOzs7QUFJbEIsVUFBSUUsTUFBTUMsT0FBTixDQUFjSCxlQUFkLEtBQWtDQSxnQkFBZ0JJLE1BQWhCLElBQTBCLENBQWhFLEVBQW1FO0FBQUEsWUFDMURPLFFBRDBELEdBQzlDLEtBQUtDLE9BRHlDLENBQzFERCxRQUQwRDtBQUVqRTs7QUFDQSxZQUFNRSxXQUFXLEtBQUtkLEtBQUwsQ0FBV0MsZUFBNUI7O0FBRUEsWUFBTWMsVUFBVUQsU0FBUyxDQUFULENBQWhCO0FBQ0EsWUFBTUUsVUFBVUYsU0FBUyxDQUFULENBQWhCOztBQUVBOztBQVJpRSxvQ0FTeENGLFNBQVNLLGlCQUFULEVBVHdDO0FBQUEsWUFTMURDLGNBVDBELHlCQVMxREEsY0FUMEQ7O0FBVWpFLFlBQU1DLGNBQWMsS0FBS1gsV0FBTCxDQUFpQk8sT0FBakIsQ0FBcEI7QUFDQSxZQUFNSyxjQUFjLEtBQUtaLFdBQUwsQ0FBaUJRLE9BQWpCLENBQXBCOztBQUVBTCxnQkFBUSx1QkFBU1EsV0FBVCxFQUFzQkMsV0FBdEIsQ0FBUjtBQUNBdEMsaUJBQVMsd0JBQVVxQyxXQUFWLEVBQXVCQyxXQUF2QixJQUFxQ0YsZUFBZSxDQUFmLENBQTlDO0FBQ0Q7O0FBRUQsV0FBS0csUUFBTCxDQUFjLEVBQUNWLFlBQUQsRUFBUTdCLGNBQVIsRUFBZDtBQUNEOzs7eUJBRUl3QyxJLEVBQU07QUFBQSxVQUNGQyxRQURFLEdBQ1VELElBRFYsQ0FDRkMsUUFERTs7O0FBR1QsNEtBQ0tELElBREw7QUFFRUMsNkNBQ0tBLFFBREw7QUFFRUMsbUNBQXlCLEtBQUt4QixLQUFMLENBQVd5QixRQUFYLEdBQXNCLEdBQXRCLEdBQTRCO0FBRnZEO0FBRkY7QUFPRDs7O0VBM0U2Q0Msc0IsR0F6QmhEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztrQkFPcUI3QyxrQjs7O0FBOEVyQkEsbUJBQW1COEMsU0FBbkIsR0FBK0Isb0JBQS9CIiwiZmlsZSI6ImgzLWhleGFnb24tY2VsbC1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxOCBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7SGV4YWdvbkNlbGxMYXllcn0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQge0N5bGluZGVyR2VvbWV0cnl9IGZyb20gJ2x1bWEuZ2wnO1xuaW1wb3J0IHtnZXRBbmdsZSwgZ2V0UmFkaXVzLCBnZXRIM1ZlcnRpY2VUcmFuc2Zvcm0sIHRyYW5zZm9ybUN5bGluZGVyUG9zaXRpb25zfSBmcm9tICcuL2gzLXV0aWxzJztcblxuLy8gVE9ETzogZXhwb3J0IGFsbCBkZWtjLmdsIGxheWVycyBmcm9tIGtlcGxlci5nbFxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSDNIZXhhZ29uQ2VsbExheWVyIGV4dGVuZHMgSGV4YWdvbkNlbGxMYXllciB7XG5cbiAgZ2V0Q3lsaW5kZXJHZW9tZXRyeShyYWRpdXMpIHtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSB0aGlzLmdldFRyYW5zZm9ybSgpO1xuXG4gICAgY29uc3QgY3lsaW5kZXJHZW9tZXRyeSA9IG5ldyBDeWxpbmRlckdlb21ldHJ5KHtcbiAgICAgIHJhZGl1cyxcbiAgICAgIHRvcFJhZGl1czogcmFkaXVzLFxuICAgICAgYm90dG9tUmFkaXVzOiByYWRpdXMsXG4gICAgICB0b3BDYXA6IHRydWUsXG4gICAgICBib3R0b21DYXA6IHRydWUsXG4gICAgICBoZWlnaHQ6IDEsXG4gICAgICB2ZXJ0aWNhbEF4aXM6ICd6JyxcbiAgICAgIG5yYWRpYWw6IDYsXG4gICAgICBudmVydGljYWw6IDFcbiAgICB9KTtcblxuICAgIGNvbnN0IHBvcyA9IGN5bGluZGVyR2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbnMudmFsdWU7XG5cbiAgICBpZiAodHJhbnNmb3JtKSB7XG4gICAgICBjb25zdCBhZGp1c3RlZCA9IHRyYW5zZm9ybUN5bGluZGVyUG9zaXRpb25zKHBvcywgdHJhbnNmb3JtKTtcbiAgICAgIGN5bGluZGVyR2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbnMudmFsdWUgPSBhZGp1c3RlZDtcbiAgICB9XG5cbiAgICByZXR1cm4gY3lsaW5kZXJHZW9tZXRyeTtcbiAgfVxuXG4gIGdldFRyYW5zZm9ybSgpIHtcbiAgICBjb25zdCB7aGV4YWdvblZlcnRpY2VzLCBoZXhhZ29uQ2VudGVyfSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShoZXhhZ29uVmVydGljZXMpICYmXG4gICAgICBoZXhhZ29uVmVydGljZXMubGVuZ3RoID49IDYgJiZcbiAgICAgIEFycmF5LmlzQXJyYXkoaGV4YWdvbkNlbnRlcikpIHtcbiAgICAgICAgY29uc3Qgc2NyZWVuVmVydGljZXMgPSBoZXhhZ29uVmVydGljZXMubWFwKGQgPT4gdGhpcy5wcm9qZWN0RmxhdChkKSk7XG4gICAgICAgIGNvbnN0IHNjcmVlbkNlbnRyb2lkID0gdGhpcy5wcm9qZWN0RmxhdChoZXhhZ29uQ2VudGVyKTtcbiAgICAgICAgcmV0dXJuIGdldEgzVmVydGljZVRyYW5zZm9ybShzY3JlZW5WZXJ0aWNlcywgc2NyZWVuQ2VudHJvaWQpO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdXBkYXRlUmFkaXVzQW5nbGUoKSB7XG4gICAgbGV0IHthbmdsZSwgcmFkaXVzfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge2hleGFnb25WZXJ0aWNlc30gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaGV4YWdvblZlcnRpY2VzKSAmJiBoZXhhZ29uVmVydGljZXMubGVuZ3RoID49IDYpIHtcbiAgICAgIGNvbnN0IHt2aWV3cG9ydH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICAvLyBjYWxjdWxhdGUgYW5nbGUgYW5kIHZlcnRpY2VzIGZyb20gaGV4YWdvblZlcnRpY2VzIGlmIHByb3ZpZGVkXG4gICAgICBjb25zdCB2ZXJ0aWNlcyA9IHRoaXMucHJvcHMuaGV4YWdvblZlcnRpY2VzO1xuXG4gICAgICBjb25zdCB2ZXJ0ZXgwID0gdmVydGljZXNbMF07XG4gICAgICBjb25zdCB2ZXJ0ZXgzID0gdmVydGljZXNbM107XG5cbiAgICAgIC8vIHRyYW5zZm9ybSB0byBzcGFjZSBjb29yZGluYXRlc1xuICAgICAgY29uc3Qge3BpeGVsc1Blck1ldGVyfSA9IHZpZXdwb3J0LmdldERpc3RhbmNlU2NhbGVzKCk7XG4gICAgICBjb25zdCBzcGFjZUNvb3JkMCA9IHRoaXMucHJvamVjdEZsYXQodmVydGV4MCk7XG4gICAgICBjb25zdCBzcGFjZUNvb3JkMyA9IHRoaXMucHJvamVjdEZsYXQodmVydGV4Myk7XG5cbiAgICAgIGFuZ2xlID0gZ2V0QW5nbGUoc3BhY2VDb29yZDAsIHNwYWNlQ29vcmQzKTtcbiAgICAgIHJhZGl1cyA9IGdldFJhZGl1cyhzcGFjZUNvb3JkMCwgc3BhY2VDb29yZDMpIC9waXhlbHNQZXJNZXRlclswXTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHthbmdsZSwgcmFkaXVzfSk7XG4gIH1cblxuICBkcmF3KG9wdHMpIHtcbiAgICBjb25zdCB7dW5pZm9ybXN9ID0gb3B0cztcblxuICAgIHN1cGVyLmRyYXcoe1xuICAgICAgLi4ub3B0cyxcbiAgICAgIHVuaWZvcm1zOiB7XG4gICAgICAgIC4uLnVuaWZvcm1zLFxuICAgICAgICBwaWNraW5nX3VIaWdobGlnaHRTY2FsZTogdGhpcy5wcm9wcy5leHRydWRlZCA/IDEuNCA6IDAuMFxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cblxuSDNIZXhhZ29uQ2VsbExheWVyLmxheWVyTmFtZSA9ICdIM0hleGFnb25DZWxsTGF5ZXInO1xuIl19