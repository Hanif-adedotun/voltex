//Example component for learning
import React from 'react';
import './css/test.css';
import PropTypes from 'prop-types';
import Fileicon from './images/logo4.png';

const testFiles = [
    {
        id: 1,
        name: 'src',
        type: 'folder',
        updated_at: "2016-07-11 21:24:00",
        update_time: "4 years ago",
        latestCommit: {
        message: 'Initial commit'
        }
        },
        {
        id: 2,
        name: 'tests',
        type: 'folder',
        updated_at: "2017-07-11 21:24:00",
        update_time: "3 years ago",
        latestCommit: {
        message: 'Initial commit'
        }
        },
        {
        id: 3,
        name: 'README',
        type: 'file',
        updated_at: "2018-07-18 21:24:00",
        update_time: "2 years ago",
        latestCommit: {
        message: 'Added a readme'
        }
        },
];

const FileList = ({files}) => (
    <table className='filelist'>
        <tbody>
            {files.map(file => (
                <FileListItem key={file.id} file={file}/>
            ))}
        </tbody>
    </table>
);
FileList.propTypes = {
    files: PropTypes.array
};

const FileListItem = ({file}) => (
    <tr className='filelist-item'>
         <td className='file-name' key={file.id[0]}>{getFileiconName(file)}</td>
         <td className='commitmessage' key={file.id[1]}><CommitMessage commit={file.latestCommit}/></td>
         <td className='time' key={file.id[2]}><Timestamp time={file.update_time} /></td>
    </tr>
);

FileListItem.propTypes = {
    file: PropTypes.object.isRequired
};

function getFileiconName(file){
    return(
        <span><img id='icon-image' src={Fileicon} alt='icons'/>  {file.name}</span>
    );
}

const CommitMessage = ({commit}) =>{
    return(
        <span>{commit.message}</span>
    );
}
CommitMessage.propTypes = {
    commit: PropTypes.object.isRequired
}


const Timestamp = ({time}) =>{
    return(
        <span>{time}</span>
    );
}
Timestamp.propTypes = {
    time: PropTypes.string.isRequired
}


class Test extends React.Component{
    constructor(){
        super();
        this.state ={
            actionCount: 0,
            text: '',
            testFiles: testFiles
        }
    }
    componentDidMount(){
        // fetch('/github/files')//fetch the data from our express server running on localhost:8080
        //  .then(res => res.json())//parse the data in json format
        //  .then(testFiles => this.setState({testFiles}, () => console.log('Files updated', testFiles)))
        //  .catch( (error) =>{console.error('Unable to get data from database' + error);});
    }

    handleAction = (action) => {
        console.log('Action is ', action);

        this.setState({
            actionCount: this.state.actionCount + 1
        });
    };
    resetCount = () => {
        this.setState({
            actionCount: 0
        });
    };
    handleChange = (event) =>{
        let text = event.target.value;
        text = text.replace(/[0-9]/g, '');//remove all numbers
        this.setState({ text });  
    };
   
   

    render() {
        return (
        <div>
            <h3>Github List Clone</h3>
            <FileList files={this.state.testFiles}/>
            
            <button onClick={this.handleAction}>Click!</button>
            <p>Clicked {this.state.actionCount} times</p>
            <button onClick={this.resetCount}>Reset</button>
            <div className='inputs'>
                <input type='text' value={this.state.text} placeholder='Input text only' onChange={this.handleChange}/>
                <p>{this.state.text}</p>
            </div>
        </div>
        )}
}

export default Test;
