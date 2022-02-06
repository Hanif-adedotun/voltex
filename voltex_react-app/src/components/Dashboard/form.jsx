import React, {useState} from 'react';
import {Modal, Button, Form, Row, Col, InputGroup} from 'react-bootstrap';
import './dashboard.css';

function FormUI(props) {
     const[name, setName] = useState([]);
     const [url, setUrl] = useState([]);
     const [key, setKey] = useState([]);
     const [serverRes, setServerRes] = useState([]);

//function (uploadValues) this function is to tell the server to upload the form 
//@param {event} inbuilt event emmitter variable
//{return} set the state
const uploadValues = (event) =>{
     event.preventDefault();
     console.log('Submitting form to server');

    const data = {
        htmlUrl: url,
        dbname: name,
        uniqueId: key
     };
    
     // console.log(JSON.stringify(data));

     fetch('/api/users/createDB' , {
         method: "POST",
         headers: {
             'Content-type': 'application/json'
         },
         body: JSON.stringify(data)
         })
         .then((result) => result.json())
         .then((response) => {setServerRes(response.errors)})
         .catch( (error) =>{console.error('Unable to validate error ' + error);});

  }

//function (generateID) this function is to tell the server to generate a unique 8letter string 
//@param {event} inbuilt event emmitter variable
//{return} then returns the value
const generateID = (event) =>{
     event.preventDefault();
     // console.log('Generating Unique ID')
     
     setKey('Generating...');
     //uses the fetch api to generate a unique id from our server
     fetch('/api/users/generateId', {
         method: 'GET'
     })
     .then((result) => result.json())
     .then((responseKey) => {setKey(responseKey)})
     .catch((error) =>{
         setKey('Unable to generate id');
         document.getElementById('uniqueId').style.color = 'red';
         console.error('Unable to validate error ' + error);
     });
 }


//function (serverResponse) this function checks if the server gives out any error after the form has been submitted
//If there are no errors, it shows a good message
//{return} sets the state
const serverResponse = () =>{
          if(serverRes){
              // console.log(this.state.serverRes);
              return(
                  <div >
                      <ul className='form-error'>
                      {serverRes.map(error =>(
                      <li className='error-li' key={error.id}> {error.msg}</li>
                  ))}
                      </ul>
                  </div>
              );
          }else{
              setName(''); setKey(''); setUrl('');
              return(
                  <div className='form-good'>
                      <p className='good'>All inputs are good!</p>
                  </div>
              );
              
          }
     }
     return (
       <Modal
         {...props}
         size="md"
         centered
         className='modal'
       >
         <Modal.Header closeButton>
         </Modal.Header>
         <Modal.Body>
                  <h2 className='f-head'>Set Up your Table</h2>
           <Form  className="TableForm" onSubmit={(e) => uploadValues(e)}>
               <Form.Group className="mb-3">
                    <Form.Label className='f-label'>Website Url</Form.Label>                   
                    <InputGroup className="mb-1" >
                         <InputGroup.Text id="basic-addon1" className='f-addon'>
                              https://
                         </InputGroup.Text>
                         <Form.Control id="basic-url" placeholder='Enter Website URL' value={url} onChange={(e) => setUrl(e.target.value)}/>
                    </InputGroup>
               </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label className='f-label'>Table Name</Form.Label>
                    <Form.Control type="name" placeholder="Enter your table name" value={name} />
               </Form.Group>

               <Form.Label className='f-label'>Generate your unique key</Form.Label>
               <Row>
                    <Col>
                        <Button className="f-btn" onClick={(e) => generateID(e)}>Unique Key</Button>
                    </Col>
                    <Col>
                         <Form.Control id="uniqueId" placeholder="Unique ID" value={key} readOnly/>
                    </Col>
               </Row>
               {serverResponse()}
               <Button variant="primary" type="submit" className="f-btn">
               Create Table
               </Button>
          </Form>
         </Modal.Body>
       </Modal>
     );
   }
   
//    function App() {
//      const [modalShow, setModalShow] = useState(false);
   
//      return (
//        <div>
//          <Button variant="primary" onClick={() => setModalShow(true)}>
//            Launch vertically centered modal
//          </Button>
   
//          <FormUI
//            show={modalShow}
//            onHide={() => setModalShow(false)}
//          />
//        </div>
//      );
//    }

export default FormUI;