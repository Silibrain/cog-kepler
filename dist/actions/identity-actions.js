'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renameEntry = exports.deleteEntry = exports.registerEntry = exports.RENAME_ENTRY = exports.DELETE_ENTRY = exports.REGISTER_ENTRY = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _reduxActions = require('redux-actions');

var _defaultSettings = require('../constants/default-settings');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Actions to add and remove entries
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

var REGISTER_ENTRY = exports.REGISTER_ENTRY = _defaultSettings.ACTION_PREFIX + 'REGISTER_ENTRY';
var DELETE_ENTRY = exports.DELETE_ENTRY = _defaultSettings.ACTION_PREFIX + 'DELETE_ENTRY';
var RENAME_ENTRY = exports.RENAME_ENTRY = _defaultSettings.ACTION_PREFIX + 'RENAME_ENTRY';

var _map = [REGISTER_ENTRY, DELETE_ENTRY, RENAME_ENTRY].map(function (a) {
  return (0, _reduxActions.createAction)(a);
}),
    _map2 = (0, _slicedToArray3.default)(_map, 3);

var registerEntry = _map2[0],
    deleteEntry = _map2[1],
    renameEntry = _map2[2];
exports.registerEntry = registerEntry;
exports.deleteEntry = deleteEntry;
exports.renameEntry = renameEntry;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hY3Rpb25zL2lkZW50aXR5LWFjdGlvbnMuanMiXSwibmFtZXMiOlsiUkVHSVNURVJfRU5UUlkiLCJBQ1RJT05fUFJFRklYIiwiREVMRVRFX0VOVFJZIiwiUkVOQU1FX0VOVFJZIiwibWFwIiwiYSIsInJlZ2lzdGVyRW50cnkiLCJkZWxldGVFbnRyeSIsInJlbmFtZUVudHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQW9CQTs7QUFDQTs7OztBQUVBO0FBdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU1PLElBQU1BLDBDQUFvQkMsOEJBQXBCLG1CQUFOO0FBQ0EsSUFBTUMsc0NBQWtCRCw4QkFBbEIsaUJBQU47QUFDQSxJQUFNRSxzQ0FBa0JGLDhCQUFsQixpQkFBTjs7V0FFa0QsQ0FDdkRELGNBRHVELEVBRXZERSxZQUZ1RCxFQUd2REMsWUFIdUQsRUFJdkRDLEdBSnVELENBSW5EO0FBQUEsU0FBSyxnQ0FBYUMsQ0FBYixDQUFMO0FBQUEsQ0FKbUQsQzs7O0lBQTNDQyxhO0lBQWVDLFc7SUFBYUMsVyIsImZpbGUiOiJpZGVudGl0eS1hY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE4IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IHtBQ1RJT05fUFJFRklYfSBmcm9tICdjb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5cbi8vIEFjdGlvbnMgdG8gYWRkIGFuZCByZW1vdmUgZW50cmllc1xuZXhwb3J0IGNvbnN0IFJFR0lTVEVSX0VOVFJZID0gYCR7QUNUSU9OX1BSRUZJWH1SRUdJU1RFUl9FTlRSWWA7XG5leHBvcnQgY29uc3QgREVMRVRFX0VOVFJZID0gYCR7QUNUSU9OX1BSRUZJWH1ERUxFVEVfRU5UUllgO1xuZXhwb3J0IGNvbnN0IFJFTkFNRV9FTlRSWSA9IGAke0FDVElPTl9QUkVGSVh9UkVOQU1FX0VOVFJZYDtcblxuZXhwb3J0IGNvbnN0IFtyZWdpc3RlckVudHJ5LCBkZWxldGVFbnRyeSwgcmVuYW1lRW50cnldID0gW1xuICBSRUdJU1RFUl9FTlRSWSxcbiAgREVMRVRFX0VOVFJZLFxuICBSRU5BTUVfRU5UUllcbl0ubWFwKGEgPT4gY3JlYXRlQWN0aW9uKGEpKTtcbiJdfQ==