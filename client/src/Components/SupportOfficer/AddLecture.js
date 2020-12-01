import React, {Component} from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import API from '../../api/api';

class AddLecture extends Component {
  constructor(props) {
    super(props);

    this.onUpload = this.onUpload.bind(this);
    this.onBasicUpload = this.onBasicUpload.bind(this);
    this.onBasicUploadAuto = this.onBasicUploadAuto.bind(this);
}

onUpload(ev) {
  ev.preventDefault();
  console.log(ev.target.files[0]);
  API.doUpload(ev.target.files[0]).then((res) => {
    console.log("OK")
  })
    //this.toast.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
}

onBasicUpload() {
    this.toast.show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode'});
}

onBasicUploadAuto() {
    this.toast.show({severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode'});
}
  render() {
    return (
      <div>
      <Toast ref={(el) => { this.toast = el; }} />

      <div className="card">
          <h3>Add Lecture List</h3>
        <FileUpload name="sampleFile" url={API.getUploadUrl()} />
      </div>
  </div>
    );
  }
}

export default AddLecture;