import React, { useState } from "react";
import {Button, Modal} from "react-bootstrap";
import DatePicker, { DateObject } from "react-multi-date-picker";
import API from "../../api/api";


function ExcludeHolidayModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
    const [date, setDate] = useState(new DateObject());

    const excludeHolidays = (dates) => {
      API.excludeHolidays(dates).then(() => {
          handleClose();
          setDate(new DateObject());
        })
        .catch((err) => {
          console.log(err.status);
          if (err.status === 401) {
            this.props.notLoggedUser();
          }
        });
    }

    return (
      <>
        <Button onClick={handleShow} data-testid="help-button" variant="info">
            Choose Holidays
            </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          animation={true}
        >
          <Modal.Header closeButton>
            <Modal.Title>Choose Holidays</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <DatePicker 
                value={date} 
                 onChange={setDate}
                 multiple={true}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => excludeHolidays(date)}>Send</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default ExcludeHolidayModal;
