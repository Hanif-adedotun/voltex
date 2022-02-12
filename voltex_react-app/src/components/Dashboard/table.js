import React, {useState} from 'react';

import PropTypes from 'prop-types';
import {Link } from 'react-router-dom';
import {Table, Button, Row, Col, Form, InputGroup} from 'react-bootstrap';
import {ArrowRepeat, FunnelFill, Search, CloudArrowDownFill, CaretLeftSquareFill, CaretRightSquareFill} from 'react-bootstrap-icons';
import './dashboard.css';
//popup
import Popup from 'reactjs-popup';
// import 'reactjs-popup/dist/index.css';

//Void SVG Logo
import VoidLogo from '../images/illustrations/void.svg';

//Export to CSV 
import { CSVLink } from "react-csv";

//function (delete_button) The component for the delete button
//@param {i} index of the row to be deleted
//@param {val} the Object Id of the row, to be sent to the server
//@param {del}  A function called from the dashboard.js to communicate with the server
var delete_button = (i, val, del) =>{
        return(
            <Popup className='popup' trigger={<Button className='btn-delete' > Delete </Button>} modal>
                
            {close=>(
                <div className='popup'>    
                <Button className="close" id={i} onClick={close}> &times;</Button>
                <div className="content">
                <div className='text-primary' value={val}>Are you sure you want to delete field {i+1}?</div>
                </div>
                <Button className='btn btn-success del_button' onClick={()=>{del(val); close()}} >{'Delete'}</Button>
                <Button className='btn btn-danger del_button' onClick={close}>Close</Button>
                </div>
            )}
                
          </Popup>
          
        );
        
}
//The propety type of the function (delete_button)
delete_button.propTypes = {
        i: PropTypes.number.isRequired,
        val: PropTypes.string.isRequired
}



//function (Table) The component for the user table
//@param {tableName} The name of the user's table 
//@param {table} The full table details of all the data
//@param {delval} The function to delete the table row
//@param {delText} *IN CONSTRUCTION* The text to display while deleting value
//@param {loadDatabase} The function to refresh the table data from the server
//@param {rotate} Boolean when the button is clicked to make it rotate, to show the loading effect
const Table_ = ({tableName, table, delval, delText, loadDatabase, rotate, sendmail, actionUrl}) =>{
    //To get the the keys of the data
    if(table){
        var head = Object.keys(table[0].db_values);
        var csv_head = head.map((key, index) => String(key).toUpperCase()) ;
        var csv_body = table.map((item, index) =>
            Object.values(item.db_values).map((val, ind)=> val)
        );
    }

        return(
            <div>
                {(!table) ? 
                <div>
                    <p>
                    <img id='empty_logo' src={VoidLogo} alt="Void Logo" />
                    </p>
                    <p>No user has used your form yet, paste your unique link and start using, thank you</p>
                    <p>If you want learn more about how to integrate us with your website, <Link to='/docs'><span className="unique">Go to documentations</span></Link></p>
                </div>
           : 
            <div className='formTable'>
                    <h4>{(tableName) ? tableName: 'Table'}</h4>
                    <Form>
                    <Row>
                        {/* <Col xs={6}><Form.Control type="text" className="t-input" placeholder="Search..." /></Col> */}
                        <Col xs={6}><InputGroup>
                            <InputGroup.Text className="t-input-icon" placeholder><Search width={15} height={15}/></InputGroup.Text>
                            <Form.Control type="text" className="t-input" placeholder="Search..." />
                        </InputGroup></Col>
                        <Col xs={3}><Button className="t-button"><FunnelFill width={15} height={15}/> Filter</Button></Col>
                        <Col xs={3}>
                        
                        <CSVLink  headers={Object(csv_head)} data={Object(csv_body)} filename={tableName+".csv"}  >
                            <Button className="t-button">
                                <span className="t-btn-export"><CloudArrowDownFill height={20} width={20}/> Export</span>
                            </Button>
                        </CSVLink>
                        </Col>
                    </Row>
                    </Form>

                    <Table responsive className="tbl">
                        <thead className="table-head">
                        <tr>
                        <th>S/N</th>{
                            head.map((key, index)=>
                                 <th key={index} >{key.toUpperCase()}</th>
                            )
                            }
                            <th><Button id='table-refresh'  onClick={loadDatabase}>
                                <ArrowRepeat className={(rotate) ? ' rotate':''} width={20} height={20}/>
                                </Button>
                            </th> {/* for the delete row*/}
                        </tr>
                        </thead>
                        <tbody className='table-body'>
                            {
                                table.map((item, index) =>
                                <tr key={index}> 
                                    <th>{index+1}</th>
                                    {/* <th>{item._id}</th>
                                    <th>{item.key}</th> */}
                                    {Object.values(item.db_values).map((val, ind)=>
                                        <th key={ind}>{(val) ? val:' '}</th>
                                    )
                                    }                                    
                                    <th id={index}>{delete_button(index, item._id, delval)}</th>
                                </tr>
                                )
                            }
                            
                        </tbody>
                        </Table>
                        <p className='Tunique'>{(delText) ? delText: ''}</p>
                        <div>
                            <Row className='table-footer'>
                                <Col xs={9} className='table-foot-txt'>Showing {table.length} results</Col>
                                <Col xs={3} ><CaretLeftSquareFill className='table-foot-icon disabled' width={25} height={25}/>  <CaretRightSquareFill className='table-foot-icon ' width={25} height={25}/></Col>
                            </Row>
                        </div>
                </div>
             }  
             </div>          
        );
    
}

//Property of the function (Table)
Table.propTypes = {
    tableName: PropTypes.string.isRequired,
    table: PropTypes.array.isRequired,
    delval: PropTypes.func.isRequired,
    delText: PropTypes.string,
    loadDatabase: PropTypes.func.isRequired,
    rotate: PropTypes.bool.isRequired,
    sendmail: PropTypes.func.isRequired
}

export default Table_;