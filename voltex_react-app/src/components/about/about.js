import React, { useState } from 'react';
import {Container} from "react-bootstrap";
import "./about.css";

function About(){
     const [summary, setsummary] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis commodo tellus amet venenatis. Accumsan neque sit malesuada mi imperdiet tincidunt. Luctus adipiscing id erat massa dignissim volutpat pellentesque. Mattis a nulla odio quisque risus proin.");
     const [list, setList] = useState([
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          "Lorem ipsum dolor sit amet, consectetur adipiscing"
     ]);
     return(
          <div className='about'>
               <Container className='summary'>
                    <h1>What is Voltex?</h1>

                    <p>
                         {summary}                         
                    </p>
               </Container>

               <Container className='usp'>
                    <h1>Why Voltex?</h1>

                    <ul>
                         {list.map((v,i) =>
                         <li>{v}</li>
                         )}
                         
                    </ul>
               </Container>
          </div>
     )
}

export default About;