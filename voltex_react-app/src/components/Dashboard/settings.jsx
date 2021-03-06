import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap';
import './dashboard.css';
import {Clipboard, CheckCircle} from 'react-bootstrap-icons';


function Settings({show, onHide, options}) {
     const [editurl, seteditUrl] = useState(false);
     const [url, setUrl] = useState([]);
     const [serverRes, setServerRes] = useState([]);

     const [copyTxt, setCopyText] = useState(<Clipboard height={20} width={20}></Clipboard>);
 
   const copyUrl = (text) => {
    navigator.clipboard.writeText(text).then(function(){
    }, function(err){
        console.error('Unable to copy to clipboard ');
    });
    //change the text of the copy button to copied
    // setCopyText("Copied to clipboard!");
    setCopyText(<CheckCircle height={20} width={20}></CheckCircle>);

   setInterval(() => {
      setCopyText(<Clipboard height={20} width={20}></Clipboard>);
    }, 2000);
  }
   //function (uploadEditVal) To upload the text of the user to the databas
    //@param {event} the inbuilt event parameter of js
    //Sent edit url to server
    const uploadEditVal = (event) =>{
     event.preventDefault();
     console.log('Submitting new Url value');

     const data = {
         inputUrl: url,
     };

     fetch('/api/users/editVal' , {
         method: "POST",
         headers: {
             'Content-type': 'application/json'
         },
         body: JSON.stringify(data)
         })
         .then((result) => result.json())
         .then((response) => {setServerRes(response.errors); setUrl('Updated!')})
         .catch((error) =>{console.error('Frontend: Unable to edit value ' + error);});
     
 } 
     return (
       <Modal
         show={show}
          onHide={onHide}
         size="lg"
         centered
         className='modal'
       >
         <Modal.Header closeButton>
         </Modal.Header>
         <Modal.Body className="acc-body">
                  <h2 className='f-head'>Table details</h2>
                  <p><span className='acc-body-label'>Table name:</span> {options.name}</p>
                  <p><span className='acc-body-label'>Form Action URL:</span> <a href={String(options.actionUrl)} >{options.actionUrl}</a>
                  <button id='dEdit-button' onClick={() => copyUrl(options.actionUrl)}>{copyTxt}</button>
                  </p>
                    <p>
                      <span className='acc-body-label'>Static page:</span><a href={options.url}  target='_blank' rel="noopener noreferrer"> {options.url}</a> 
                      {/* <Button id='dEdit-button' onClick={() => seteditUrl(true)}>Edit</Button> */}
                    </p>
                    {(editurl === true) ? 
                    <p>
                         <span className='acc-body-label'>
                         <input name='url' className='inputEdit' type='text' placeholder='Type in new url' value={url} onChange={(event)=>{ setUrl(event.target.value)}}/>
                         </span> 
                         <Button className='btn btn-unique' onClick={(e) => uploadEditVal(e)}>Edit</Button>
                         <Button className='btn btn-danger' onClick={() => seteditUrl(false)}>Cancel</Button>
                         <ul>{serverRes.map((error, i) => 
                              <li className='error-li' key={error.id}> {error.msg}</li>
                         )}</ul>
                         {/* {(this.state.Urledited) ? <p><span className="glyphicon glyphicon-warning-danger">Unable to edit value</span></p> : ''} */}
                         </p>: ''}
                    <p><span className='acc-body-label'>Key:</span> {options.id}</p>
         </Modal.Body>
       </Modal>
     );
   }
   


export default Settings;