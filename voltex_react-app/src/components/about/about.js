import React, { useState, useEffect } from 'react';
import {Container} from "react-bootstrap";
import "./about.css";
import { Slide, Bounce} from "react-awesome-reveal";

function About({setKey}){
     useEffect(() => {
          document.title = "About - Voltex";
          setKey();
        }, []);
     
     const [summary] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turpis commodo tellus amet venenatis. Accumsan neque sit malesuada mi imperdiet tincidunt. Luctus adipiscing id erat massa dignissim volutpat pellentesque. Mattis a nulla odio quisque risus proin.");
     const [list] = useState([
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          "Lorem ipsum dolor sit amet, consectetur adipiscing",
          "Lorem ipsum dolor sit amet, consectetur adipiscing"
     ]);
     return(
          <div className='about'>
               <Container className='summary'>
                    <h1>What is Voltex?</h1>

                    <Bounce>
                    <p>
                         {summary}                         
                    </p>
                    </Bounce>
               </Container>

               <Container className='usp'>
                    <h1>Why Voltex?</h1>

                    <ul>
                    <Slide cascade>
                         {list.map((v,i) =>
                         <li key={i}>{v}</li>
                         )}
                    </Slide>
                         
                    </ul>
               </Container>
          </div>
     )
}

export default About;