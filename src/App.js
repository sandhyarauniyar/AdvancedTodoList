
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route , Navigate} from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateValue } from './StateProvider';
import Error from "./pages/Error";

function App() {

  const [{user}] = useStateValue();

  return (
    <Router>
        <div className="app">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={localStorage.getItem("isLogin") ? <Dashboard/> : <Navigate to="/" /> }/>
          <Route path="/error" element={<Error/>}/>
          <Route path="*" element={<Login/>} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App ;

