import React, { useState,useEffect } from 'react'
import {Link,useNavigate} from "react-router-dom";
import './Login.css';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateValue } from '../../StateProvider';


const Login = ()=> {

  const [{user},dispatch] = useStateValue();
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      const res = await axios.post("https://todolistbackendadvanced.onrender.com/refresh", {refreshToken});
      const newAccessToken = res.data.accessToken;
      const newRefreshToken = res.data.refreshToken;
      localStorage.setItem('accessToken',newAccessToken);
      localStorage.setItem('refreshToken',newRefreshToken);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const accessToken = localStorage.getItem('accessToken')
      const decodedToken = jwt_decode(accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  
const sanitizeAndValidateUsername = (username) => {
  const regex = /^[a-zA-Z0-9\s]+$/;
  return regex.test(username);
}

 const handleUsernameChange = (e) => {
  const value = e.target.value;
  setUsername(value);
};


function isValidPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9\s]).+$/;
  return regex.test("12345678Ss_") && password.length >= 8;
}

const handlePasswordChange = (e) => {
  const value = e.target.value;
  setPassword(value);
};

    const handleBlur = (e) => {
      if(e.target.name === "username"){ 
      const isUsernameCorrect = sanitizeAndValidateUsername(username);
      setUsernameError(!isUsernameCorrect ? 'Invalid username. Only letters, numbers, and certain special characters are allowed.':'');
      }
      else{    
        let value = e.target.value;
          if (!isValidPassword(value)) {
            setPasswordError('Invalid password');
          } else {
            setPasswordError('');
          }
      }
    }

    const handleFocus = (e) => {
      e.target.name === "username" ? setUsernameError(false) : setPasswordError(false);
    }

  const login = async (e) => {
    e.preventDefault();

    if(usernameError || passwordError){
        toast('Please enter correct formats of input first');
        return;
    }

    try{
    const response = await axios.post('https://todolistbackendadvanced.onrender.com/login',{
      "username":username,
      "password":password
    });

    if(response.status === 200){
      dispatch({userLogin:true, type:"SET_USER_LOGIN"})
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      localStorage.setItem('accessToken',accessToken);
      localStorage.setItem('refreshToken',refreshToken);
      localStorage.setItem('isLogin',true);
      toast('Logged In',{ autoClose: 3000 });
      navigate('/dashboard');
    }
    else{
      toast("Something went wrong");
      console.log("Error",response.data.message);
    }
  }
    catch(error){
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        toast(errorMessage,{ autoClose: 3000 });
      } else {
        toast(error.message,{ autoClose: 3000 });
      }
    }
  }

  return (
    <div className='login'>

      <div className='login__container'>
        <h1>Log In</h1>

        <form>
          <h5>Username</h5>
          <input value={username} onChange={handleUsernameChange} onBlur={handleBlur} onFocus = {handleFocus} type="string" name="username"/>
          {usernameError && <p className="error">{usernameError}</p>}
          <h5>Password</h5>
          <input value={password} onChange={handlePasswordChange} onBlur={handleBlur} onFocus = {handleFocus} type="password" name="password"/>
          {passwordError && <p className="error">{passwordError}</p>}
          <button type='submit' className='login__signInButton' onClick={login}>Sign In</button>
        </form>
      </div>
    </div>
  )
}

export default Login
