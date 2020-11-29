import React, {Component} from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
class AddCourse extends Component {
  constructor(props) {
    super(props);

    this.onUpload = this.onUpload.bind(this);
    this.onBasicUpload = this.onBasicUpload.bind(this);
    this.onBasicUploadAuto = this.onBasicUploadAuto.bind(this);
}

onUpload() {
    this.toast.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
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
      <Toast ref={(el) => { this.toast = el; }}></Toast>

      <div className="card">
          <h3>Add Course List</h3>
          <FileUpload name="demo[]" url="./upload.php" onUpload={this.onUpload} multiple accept="all/*" maxFileSize={10000000}
              emptyTemplate={<p className="p-m-0">Drag and drop files to here to upload.</p>} />
      </div>
  </div>
    );
  }
}

export default AddCourse;