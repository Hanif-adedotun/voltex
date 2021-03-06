import React, {useState} from 'react';

import PropTypes from 'prop-types';
import {Link } from 'react-router-dom';
import {Table, Button, Row, Col, Form, InputGroup, Modal} from 'react-bootstrap';
import {ArrowRepeat, FunnelFill, Search, CloudArrowDownFill, CaretLeftSquareFill, CaretRightSquareFill} from 'react-bootstrap-icons';
import './dashboard.css';

// import 'reactjs-popup/dist/index.css';

//Void SVG Logo
import VoidLogo from '../images/illustrations/void.svg';
import EmptyIcon from '../images/illustrations/empty.svg';
//Export to CSV 
import { CSVLink } from "react-csv";

 
//function (delete_button) The component for the delete button
//@param {i} index of the row to be deleted
//@param {val} the Object Id of the row, to be sent to the server
//@param {del}  A function called from the dashboard.js to communicate with the server
const Delete = ({i, val, load_db, show, onHide}) =>{
    const [text, setText] = useState(null);
    //function (tableDelete) function to delete a row in the table
     //@param (val) the id of the row to delete
     //Functions for child element Table.js
     const tableDelete = async (val) =>{
         
        setText('Deleting Row...');

        await fetch(`/api/users/delete/${val}`, {
           method: 'DELETE',
           headers: {
               'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
              },
           })
           .then(resp => resp.json()) // or res.json()
           .then(delres => {setText(delres.deleted); setTimeout(() => {onHide();setText(null);  load_db();}, 1000)})
           .catch((error) =>{console.error('Unable to delete data in database' + error); setText('Unable to delete row, try again...') });
       // Note that add effect of delete button loading when delete is pressed
   }

        return(
            <Modal
            show={show}
            onHide={onHide}
            size="md"
            centered
            className='modal'
            >
            <Modal.Header closeButton>
            </Modal.Header>

                 {(text) ? 
                 <Modal.Body>
                    <div className='popup'> 
                        <h2 className='ptxt'>{text}</h2>
                    </div>
                </Modal.Body>
                 :
                 <Modal.Body>
                 <div className='popup'> 
                    <div className="content">
                        <div className='text-primary' value={val}>Are you sure you want to delete field {i+1}?</div>
                    </div>
                    <button className='btn btn-success del_button' onClick={(e)=>{e.preventDefault(); tableDelete(val);}} >{"Delete"}</button>
                    <button className='btn btn-danger del_button' onClick={onHide}>Close</button>
                    </div>
                </Modal.Body>
            }
            
            </Modal> 

        );
        
} 


// //The propety type of the function (delete_button)
Delete.propTypes = {
        i: PropTypes.number,
        val: PropTypes.string
}



//function (Table) The component for the user table
//@param {tableName} The name of the user's table 
//@param {table} The full table details of all the data
//@param {delval} The function to delete the table row
//@param {delText} *IN CONSTRUCTION* The text to display while deleting value
//@param {loadDatabase} The function to refresh the table data from the server
//@param {rotate} Boolean when the button is clicked to make it rotate, to show the loading effect
//@param {d} Object data of the response from server to store in localStorage
const Table_ = ({tableName, table, delText, loadDatabase, rotate, d}) =>{
    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        text: null,
        i:null,
        val: null,
        del: null,
    })
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState(0);
    const t_length = useState([]);
    

    
    const SearchResult = ({body, cells}) =>{
    t_length[0]=body.length;
    /*  
        Updates the value of the variable without causing
        the appliaction to render
    */
        if(body.length === 0){
            return(
                <tr>
                    <td colSpan={String(cells+2)}>
                        <div className='empty-search'>
                            <img  src={EmptyIcon} alt="Void Logo" />
                        </div>
                    </td>
                    
                </tr>
                
            )
        }

        return(
            body.map((v,i) => 
                <tr key={i}>
                    <td>{i+1}</td>
                 {Object.values(v.db_values).map((r,k) => <td key={k}>{r}</td> )}
                 <td id={i}>{<button className='btn-delete' onClick={(e) => {console.log(i);setShow(true); setData({i:i, val:v._id})}}> Delete </button>}</td>
                
                    <Delete
                    i={data.i}
                    val={data.val}
                    show={show}
                    onHide={() => setShow(false)}
                    load_db={loadDatabase}
                    />
                </tr>
                )
        )
         
    }

     
    const searchTable = (f) =>{
        return(
            table.filter(item => {
                var bd =  Object.values(item.db_values).map((val, ind)=> val);
                return(
                    bd[f].toLowerCase().includes(search.toLowerCase())
                )
            }
            )
        )
    }
    //To get the the keys of the data
    console.log(table[0]);
    if(table[0] || table.length > 0 || table[0] !== undefined) {
        // Once the table loads once, it would be automatically stored in the localstorage
        window.localStorage.setItem("table", JSON.stringify(d));
        
        var head = Object.keys(table[0].db_values); 
        var csv_head = head.map((key, index) => String(key).toUpperCase()) ;
        var csv_body = table.map((item, index) =>
            Object.values(item.db_values).map((val, ind)=> val)
        );
        t_length[0] = csv_body.length;
    }

    
  
        return(
            <div>
                {(!table[0] || table.length <= 0 || table[0] === undefined) ? 
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
                        
                        <Col xs={5}><InputGroup>
                            <InputGroup.Text className="t-input-icon" ><Search width={15} height={15}/></InputGroup.Text>
                            <Form.Control type="text" className="t-input" placeholder="Search..." value={search} onChange={(e) => {
                                setSearch(e.target.value); 
                    
                                }} />
                        </InputGroup></Col>
                    
                        <Col xs={4}>
                        <InputGroup>
                            <InputGroup.Text className="t-input-icon"><FunnelFill width={15} height={15}/></InputGroup.Text>
                            <Form.Select size="md" value={filter} onChange={(e) => setFilter(e.target.value) }>
                                {csv_head.map((v,i) =>
                                <option key={i} value={i} className='filter-words'>{v}</option>
                                )}
                            </Form.Select>
                            </InputGroup>
                        </Col>
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
                            <th><button id='table-refresh'  onClick={loadDatabase}>
                                <ArrowRepeat className={(rotate) ? ' rotate':''} width={20} height={20}/>
                                </button>
                            </th>{/* for the delete row*/}
                        </tr>
                        </thead>
                        <tbody className='table-body'>
                                                       
                            {/* {searchResult({body: searchTable(filter), cells: csv_body[0].length})} */}
                           <SearchResult body= {searchTable(filter)} cells= {csv_body[0].length}/>
                        </tbody>
                        </Table>
                        <p className='Tunique'>{(delText) ? delText: ''}</p>
                        <div>
                            <Row className='table-footer'>
                                <Col xs={9} className='table-foot-txt'>Showing {t_length} results</Col>
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
    tableName: PropTypes.string,
    table: PropTypes.array,
    delval: PropTypes.func,
    delText: PropTypes.string,
    loadDatabase: PropTypes.func,
    rotate: PropTypes.bool,
    sendmail: PropTypes.func
}

export default Table_;