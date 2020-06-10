import React from 'react';
import Axios from './network/axiosConfig';
import { SelectList } from 'react-widgets';
// var operations = ['export', 'schedule'];
// var reportTypes = [ "all","email","name","phone" ]

const reportType = ["all", "email", "name", "phone"]
class App extends React.Component {

  state = {
    exportSelect: "",
    scheduleSelect: ""
  };


  networkCall = (operation, reportType) => {
    Axios.post('/dev/report', {
      "operation": operation,
      "reportType": reportType,
      "email": "kalevilas18@gmail.com"
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  }

  exportReport = () => {
    this.networkCall('export', this.state.exportSelect);
  }
  scheduleReport = () => {
    this.networkCall('schedule', this.state.scheduleSelect);

  }

  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <p style={{ textAlign: "center" }}>Report</p>
          <div className="row">
            <div className="col-md-5">
              <form style={{ background: "white", padding: "10px 10px" }}>
                <div className="form-group">
                  <SelectList
                    data={reportType}
                    value={this.state.exportSelect}
                    onChange={(value) => this.setState({ exportSelect: value })}
                  />
                </div>
                <button type="button" className="btn btn-primary" onClick={this.exportReport}>Export</button>
              </form>
            </div>

            <div className="col-md-5">
              <form style={{ background: "white", padding: "10px 10px" }}>
                <div className="form-group">
                  <SelectList
                    data={reportType}
                    value={this.state.scheduleSelect}
                    onChange={(value) => this.setState({ scheduleSelect: value })}
                  />
                </div>
                <button className="btn btn-primary" type='button' onClick={this.scheduleReport}>Schedule</button>
              </form>
            </div>
          </div>


        </div>
      </div>

    );
  }
}

export default App;
