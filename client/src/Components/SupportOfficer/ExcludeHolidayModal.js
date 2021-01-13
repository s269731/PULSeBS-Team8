import React, { useState } from "react";
import {Button, Modal} from "react-bootstrap";
import DatePicker, { DateObject } from "react-multi-date-picker";



function ExcludeHolidayModal(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {setShow(true)};
    const [date, setDate] = useState(new DateObject());
    // const [date, setDateEmpty] = useState(new DateObject());

    const callApi=(date2)=>{
      props.excludeHolidays(date2)
      handleClose();
      setDate();
    }



    return (
      <>
        <Button onClick={handleShow} data-testid="exc-holiday-button" variant="info">
            Choose Holidays
            </Button>
  
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          animation={true}
          data-testid="exc-holiday-modal" 
        >
          <Modal.Header closeButton>
            <Modal.Title>Choose Holidays</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <DatePicker 
                value={date} 
                 onChange={setDate}
                 multiple={true}
                 minDate={new Date()}
                 data-testid="exc-holiday-datepick"
                inline
                 />
          </Modal.Body>
          <Modal.Footer>
            <Button data-testid="exc-holiday-close" variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => callApi(date)}>Send</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default ExcludeHolidayModal;
