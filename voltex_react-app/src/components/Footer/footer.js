import React from 'react';
import './footer.css';
import {Container, Row, Col} from 'react-bootstrap';
import {EnvelopeFill, Github} from 'react-bootstrap-icons';

var year = new Date().getFullYear();
class footer extends React.Component{
    render(){
        return(
            <div className='footer'>
             <Container className='foot-l'>
                 <Row>
                     <Col><a href="https://github.com/Hanif-adedotun"><Github height={30} width={30}/></a> <a href="mailto:hanif.adedotun@gmail.com"><EnvelopeFill height={30} width={30}/></a></Col>
                 </Row>
             </Container>
                <p className='footext'>&copy; Copyright <a href='https://hanif-adedotun.com'>Hanif Adedotun</a> {year}</p>
            
            </div>
        )
    }

}

export default footer;