
import React from 'react';
import { csv, json } from 'd3-request';
import window from 'global/window';
import {updateVisData, addDataToMap, loadFiles } from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';
import {LoadingSpinner} from 'kepler.gl/components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

class InputField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    customUrl: '',
    loading: false
  };
  this.handleRequest = this.handleRequest.bind(this);
  this.handleChange = this.handleChange.bind(this);
  this.handleApi = this.handleApi.bind(this);
}
handleChange(event) {
  this.setState({
    customUrl: event.target.value
  });
}

 async handleRequest() {
  let that = this;
  let err = 'Kepler only accept json or csv data';
  const url = this.state.customUrl;
  this.setState({ loading: true });

    if(url.includes('.json') || url.includes('.geojson')) {
      await json(url, function(error, data) {
        if (error) {
          that.setState({ loading: false });
          return toast.success(`Message: Unable to load`, {
            position: "top-right",
            autoClose: 5000
          });
        }
        that.handleApi(data);
      });     
     } 
     else if(url.includes('.csv')) {
      await csv(url, function(error, data) {
        if (error) {
          that.setState({ loading: false });
          return toast.success(`Message: Unable to load`, {
            position: "top-right",
            autoClose: 5000
          });
        }
        const items = data;
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csv = csv.join('\r\n')

        that.handleApi(csv);
      });
     }else {
       that.setState({ loading: false });
       return toast.error(`Message: ${err}`, {
        position: "top-right",
        autoClose: 5000,
        background: 'black'
      });
     }
}
  handleApi(data) {
    const url = this.state.customUrl;
    this.setState({ loading: false });

    if(url.includes('.json') || url.includes('.geojson')) {
      this.props.add(
        updateVisData({
          info: {label: 'new dataset-json'},
          data: Processors.processGeojson(data)
        })
      );
    } else if(url.includes('.csv')) { 
      this.props.add(
        addDataToMap({
          datasets: [
            {
              info: {
                label: 'new dataset csv',
                id: 'new_dataset'
              },
              data: Processors.processCsvData(data)
            }
          ],
          options: {
            centerMap: true
          }
        })
      )
    }  
  }

  render() {
    return (
      <div>
      
      <div style={{ 
            marginLeft: window.innerWidth - 500,
            zIndex: 1
          }}
        >
          <div className="form-group input-group">
          { this.state.loading && <div className='col-sm-2'><LoadingSpinner/></div> }
            <input
              className="form-control span6"
              placeholder="Custom URL"
              value={this.props.customUrl}
              onChange={this.handleChange}
            />
            <div className="input-group-append">
              <button className="btn btn-outline-primary" onClick={()=>this.handleRequest()}>
                Load URL or sample
              </button>
            
            </div>
          </div> 
      </div>
      </div>
    );
  }
}

export default InputField;

