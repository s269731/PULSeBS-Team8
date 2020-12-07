import React, {Component} from 'react';
import {FileUpload} from 'primereact/fileupload';
import {Toast} from 'primereact/toast';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import API from "../../api/api";
import {Button} from "react-bootstrap";


class AddStudent extends Component {
  constructor(props) {
    super(props);

    this.onUpload = this
      .onUpload
      .bind(this);
    this.onBasicUpload = this
      .onBasicUpload
      .bind(this);
    this.onBasicUploadAuto = this
      .onBasicUploadAuto
      .bind(this);
  }

  onUpload() {
    this
      .toast
      .show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
  }

  onBasicUpload() {
    this
      .toast
      .show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
  }

  onBasicUploadAuto() {
    this
      .toast
      .show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode'});
  }
  renderPage() {
    window
      .location
      .reload(false);
  }
  render() {
    return (
      <div data-testid="upload-page">
        <Toast ref={(el) => {
          this.toast = el;
        }}></Toast>
        {this.props.routeChange === "S" && <div style={{
          textAlign: "center"
        }} className="card">
          <Button
            size="lg"
            variant="outline-primary"
            style={{
            position: "absolute",
            right: "35px"
          }}
            onClick={this.renderPage}>Main Setup Page</Button>
          <h1 >Add Student List</h1>
          <FileUpload name="sampleFile" url={API.getUploadUrl() + "/students"}/>
        </div>
}
        {this.props.routeChange === "T" && <div style={{
          textAlign: "center"
        }} className="card">
          <Button
            size="lg"
            variant="outline-primary"
            style={{
            position: "absolute",
            right: "35px"
          }}
            onClick={this.renderPage}>Main Setup Page</Button>
          <h1>Add Teacher List</h1>
          <FileUpload name="sampleFile" url={API.getUploadUrl() + "/teachers"}/>
        </div>
}
        {this.props.routeChange === "L" && <div style={{
          textAlign: "center"
        }} className="card">
          <Button
            size="lg"
            variant="outline-primary"
            style={{
            position: "absolute",
            right: "35px"
          }}
            onClick={this.renderPage}>Main Setup Page</Button>
          <h1>Add Schedules List</h1>
          <FileUpload name="sampleFile" url={API.getUploadUrl() + "/schedules"}/>
        </div>
}
        {this.props.routeChange === "C" &&  <div style={{
          textAlign: "center"
        }} className="card">
          <Button
            size="lg"
            variant="outline-primary"
            style={{
            position: "absolute",
            right: "35px"
          }}
            onClick={this.renderPage}>Main Setup Page</Button>
          <h1>Add Course List</h1>
          <FileUpload name="sampleFile" url={API.getUploadUrl() + "/courses"}/>
        </div>
}
        {this.props.routeChange === "Cl" &&  <div style={{
          textAlign: "center"
        }} className="card">
          <Button
            size="lg"
            variant="outline-primary"
            style={{
            position: "absolute",
            right: "35px"
          }}
            onClick={this.renderPage}>Main Setup Page</Button>
          <h1>Add Enrollments List</h1>
          <FileUpload name="sampleFile" url={API.getUploadUrl() + "/enrollments"}/>
        </div>
}
      </div>
    );
  }
}

export default AddStudent;
