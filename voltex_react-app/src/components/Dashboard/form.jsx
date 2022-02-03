import React, {useState} from 'react';
import {Modal, Button, Form, Row, Col, InputGroup} from 'react-bootstrap';

function FormUI(props) {
     return (
       <Modal
         {...props}
         size="md"
         aria-labelledby="contained-modal-title-vcenter"
         centered
       >
         <Modal.Header closeButton>
         </Modal.Header>
         <Modal.Body>
                  <h2>Set Up your Table</h2>
           <Form>
               <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>                   
                    <InputGroup className="mb-3">
                         <InputGroup.Text id="basic-addon3">
                              https://
                         </InputGroup.Text>
                         <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
               </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
               </Form.Group>

               <Form.Label>Password</Form.Label>
               <Row>
                    <Col>
                        <Button variant="primary">Unique Key</Button>
                    </Col>
                    <Col>
                         <Form.Control placeholder="Last name" />
                    </Col>
               </Row>

               <Button variant="primary" type="submit">
               Create Table
               </Button>
          </Form>
         </Modal.Body>
       </Modal>
     );
   }
   
   function App() {
     const [modalShow, setModalShow] = useState(false);
   
     return (
       <div>
         <Button variant="primary" onClick={() => setModalShow(true)}>
           Launch vertically centered modal
         </Button>
   
         <FormUI
           show={modalShow}
           onHide={() => setModalShow(false)}
         />
       </div>
     );
   }

export default App;