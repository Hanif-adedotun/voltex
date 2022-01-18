import React from 'react';
import './docs.css';


//Highlighter
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { colorBrewer } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco';
SyntaxHighlighter.registerLanguage('javascript', js);

//New Highlighter


class Docs extends React.Component{
     constructor(){
          super();
          this.state = {

          }
     }
     //The code snippet for the hidden tag that containes the url of the page
     hiddentag = `
     <html>
      <body>
          <form action='Url provided in dashboard' method="POST" enctype='application/x-www-form-urlencoded'>
               <input type="hidden" name="user-url" value="Your form page url">
               <input type='number' name='num'/>
               <input type='text' name='Full name'/>
               <input type='submit' name='send'/>
          </form>
      </body>
     </html>
     `;
     //The code snippet for using javascript fetch API to send form data
     jscode = `
     function name(){
          fetch('Url provided', { 
               method: 'POST',
               headers: {
                    'Content-Type':'application/json'
               },
               body: new FormData(form element);
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) =>{console.log(error)});
     }
     `;
     //The code snippet for the send name
     sendButton = `
     <form action='Url provided in dashboard' method="POST" enctype='application/x-www-form-urlencoded'>
          <input type='submit' name='send'/>
          //or
          <input type='submit' name='submit'/>
          //or
          <input type='submit' name='done'/>
     </form>
     `;
     render(){
          return(
               <div className='docs'>
                    <link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/railscasts.css" />
                    <header className='header'>
                    {/* <h1>This is the documentation page</h1> */}
                    <h3>How to incoperate voltex middlewear into your static website</h3>
                    </header>

                    <div className='code_container'>
                         <div className='code-tab'>
                              <h4>Insert link to form action</h4>
                              <div className='code-explained'>
                                   Your form has to have an hidden input type, which will be used to verify the origin of the require_host
                              </div>
                              <SyntaxHighlighter language="html" style={materialOceanic} className='code'>
                                   {this.hiddentag}
                              </SyntaxHighlighter>
                         </div>
                         
                         <div className='code-tab'>
                              <h4>Using javascript fetch API</h4>
                              <div className='code-explained'>
                              If you are using javascript fetch api to send form data
                              </div>
                              <SyntaxHighlighter language="javascript" style={materialOceanic} className='code'>
                                   {this.jscode}
                              </SyntaxHighlighter>
                         </div>

                         <div className='code-tab'>
                              <h4>Submit name </h4>
                              <div className='code-explained'>
                              Your submit button must have a value of submit, send or done, because of our backend algorithm to recognise it, it is non-case sensitive
                              </div>
                              <SyntaxHighlighter language="javascript" style={materialOceanic} className='code'>
                                   {this.sendButton}
                              </SyntaxHighlighter>
                         </div>

                    </div>
                    
               </div>
          )
     }
}
export default Docs;