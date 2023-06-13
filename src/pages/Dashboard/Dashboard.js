import React from 'react'
import { useStateValue } from '../../StateProvider';
import {useState, useEffect} from "react";
import Task from '../../components/Task';
import useNode from '../../hooks/useNode';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Dashboard.css";

const Dashboard = () => {

  const [{user},dispatch] = useStateValue();
  const [todoTree,setTodoTree] = useState({
    id:1,
    subtask:[]
});
  const navigate = useNavigate();
  const [username,setUsername] = useState("");

  const {insertNode,editNode,deleteNode} = useNode();

  useEffect(() => {

    const fetchDashboardData = async() => {
      try{
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get('https://todolistbackendadvanced.onrender.com/dashboardData', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
    
        if(response.status === 200){
          setUsername(response.data.username);
          dispatch({userLogin:true, type:"SET_USER_LOGIN"});
        }
        else{
          navigate("/error");
          toast("Something went wrong",{ autoClose: 3000 });
        }
      }
      catch(error){
        navigate("/error");
        if (error.response && error.response.status === 401) {
          const errorMessage = error.response.data.message;
          toast(errorMessage,{ autoClose: 3000 });
        } else {
          toast(error.message,{ autoClose: 3000 });
        }
      }   
    }
    
    fetchDashboardData();
  }, []);

  const handleInsertNode = (folderId,item) => {
      const newTodoStructure = insertNode(todoTree,folderId,item);
      setTodoTree(newTodoStructure);
  }

  const handleEditNode = (folderId,value) => {
    const newTodoStructure = editNode(todoTree,folderId,value);
    setTodoTree(newTodoStructure);
  }

  const handleDeleteNode = (folderId) => {
    const newTodoStructure = deleteNode(todoTree,folderId);
    const temp = { ...newTodoStructure };
    setTodoTree(temp);
  }

  const logout = async() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const res = await axios.post('https://todolistbackendadvanced.onrender.com/logout',{
      refreshToken
    },options); 
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem('isLogin');
    dispatch({userLogin:false, type:"SET_USER_LOGIN"})
    navigate("/login");
    toast('Successfully Logged Out',{ autoClose: 3000 })
  }

  return (
    <div className='dashboard'>
      <div className='dashboard__top'>
        <h3 className='username'>Welcome {username}!</h3>
        <button onClick = {logout} className="button">Logout</button>
      </div>
      <h1>Your todo List</h1>
      <Task todoTree={todoTree} handleInsertNode={handleInsertNode} handleEditNode={handleEditNode} handleDeleteNode = {handleDeleteNode} />
    </div>
  )
}

export default Dashboard
