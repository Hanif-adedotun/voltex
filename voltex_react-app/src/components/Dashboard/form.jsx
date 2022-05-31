import React, {useState} from 'react';
import {Modal, Button, Form, Row, Col, InputGroup} from 'react-bootstrap';
import './dashboard.css';

function FormUI({show, onHide, newTable, docid,}) {
     const[name, setName] = useState([]);
     const [url, setUrl] = useState([]);
     const [key, setKey] = useState([]);
     const serverRes = useState([]);
     const [SubmitBtn, setSubmitBtn] = useState("Create Table");

//function (uploadValues) this function is to tell the server to upload the form 
//@param {event} inbuilt event emmitter variable
//{return} set the state
const uploadValues = (event) =>{
     event.preventDefault();
     setSubmitBtn("Submiting...");
     console.log('Submitting form to server');
    
    const data = {
        url: "https://"+url,
        Tablename: name,
        uniqueID: key,
        docid:docid,
     };
    
     // console.log(JSON.stringify(data));
     let path = (newTable) ? "/api/users/createDB": "/api/users/addTable";

     fetch(path , {
         method: "POST",
         headers: {
             'Content-type': 'application/json'
         },
         body: JSON.stringify(data)
         })
         .then((result) => result.json())
         .then((response) => {serverRes[0] = response.errors;})
         .catch( (error) =>{console.error('Unable to validate error ' + error);});

         setSubmitBtn("Create Table");
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
                  <div className='form-response'>
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
         show = {show}
         onHide = {onHide}
         size="md"
         centered
         className='modal'
       >
         <Modal.Header closeButton>
         </Modal.Header>
         <Modal.Body>
                  <h2 className='f-head'>Set Up your Table</h2>
           <Form  className="TableForm" >
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
                    <Form.Control type="name" placeholder="Enter your table name" value={name} onChange={(e) => setName(e.target.value)}/>
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
               <Button variant="primary" type="submit" className="f-btn" onClick={(e) => uploadValues(e)}>
               {SubmitBtn}
               </Button>
          </Form>
         </Modal.Body>
       </Modal>
     );
   }

export default FormUI;