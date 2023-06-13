import React, { useEffect, useState } from 'react'
import { useStateValue } from '../StateProvider'
import { useRef } from 'react';
import "./Task.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

function Task({todoTree, handleInsertNode,handleEditNode,handleDeleteNode}) {

    const [editMode,setEditMode] = useState(false);
    const [showInput,setShowInput] = useState(false);
    const [input,setInput] = useState("");
    const [expand,setExpand] = useState(false);
    const inputRef = useRef(null);

    const UpArrow = require('./up-arrow.png');
    const DownArrow = require('./down-chevron.png');

    const handleDelete = () => {
        handleDeleteNode(todoTree.id);
    }

    const editTask = () => {
        setEditMode(true);
    }

    const saveEdit = () => {
        handleEditNode(todoTree.id,inputRef?.current?.innerText);
        setEditMode(false);
    }

    const cancelEdit = () => {
        if(inputRef.current){
            inputRef.current.innerText = todoTree.taskName;
        }
        setEditMode(false);
        if(todoTree?.subtask.length < 1){
            setExpand(false);
        }
    }

    const addSubTask = () => {
        setExpand(!expand)
        setShowInput(true);
    }

    const addTask = () => {
      
        if(input.length < 1){
            toast('Please add a task',{ autoClose: 3000 });
            return;
        }
        console.log("Tree",todoTree);
        console.log("INput",input);
        setExpand(true);
        handleInsertNode(todoTree.id,input)
        console.log("later",todoTree);
        setInput("");
        setShowInput(false);
      }

    useEffect(() => {
     inputRef?.current?.focus();
    },[editMode])

  return (
    <div className='todoList'>
     {
        todoTree.id === 1 ?  
        <div className='todoList_InputSection'>
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} placeholder='Add Task...' className='todoList__inpt'/>
            <button className="button" onClick={addTask}>Add Task</button>
        </div>
        : 
        <div className='task'>
              <span
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              style={{ wordWrap: "break-word" }}
            >
              {todoTree.taskName}
            </span>
            <div>

                {!editMode ?
                <div className='task-buttons'> 
                    <div style={{display:'flex', alignItems: 'center', backgroundColor:"#f0c14b", borderRadius:"5px"}} onClick={addSubTask}>
                        {expand ?
                        <>
                        <img src={UpArrow} width="15px" height="15px"/>
                        <button className="button">Add Subtask</button>
                        </>
                        : 
                        <>
                        <img src={DownArrow} width="15px" height="15px" />
                        <button className="button">Add Subtask</button>
                        </>
                        }
                        
                    </div>
                    <button className="button" onClick={editTask}>Edit</button>
                    <button className="button" onClick={handleDelete}>Delete</button>
                 </div>  : 
                (<div className='task-buttons'>
                    <button className="button" onClick={saveEdit}>Save</button>
                    <button className="button" onClick={cancelEdit}>Cancel</button>
                </div>)
                }
         </div>
    </div>
    }

        <div style={{display: expand ? 'block' : 'none', paddingLeft:"100px"}}>

            {showInput && (
                <div style={{display:"flex", alignContent:"center",justifyContent:"center", marginTop:"10px",gap:"10px"}}>
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='Add Subtask...' className='todoList__inpt'/>
                    <div className='task-buttons'>
                        <button className="button" onClick={addTask} >Add</button>
                        <button className="button" onClick={() => {
                            setShowInput(false)
                            setInput("");
                            if (!todoTree?.subtask?.length) setExpand(false);
                        }} >Cancel</button>
                    </div>
                </div>
            )}

        {
                todoTree?.subtask?.map((task) => (
                    <Task todoTree={task} handleInsertNode={handleInsertNode} handleEditNode={handleEditNode} handleDeleteNode = {handleDeleteNode}/>
                )) 
        }
        </div>
    </div>
  )
}

export default Task
