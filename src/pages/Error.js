import React from 'react'
import { Link } from 'react-router-dom'
import { useStateValue } from '../StateProvider';
import { useEffect } from 'react';

function Error() {
  return (
    <div>
      <h1>Page Not Found</h1>
      <Link to="/login"><button>Login</button></Link>
    </div>
  )
}

export default Error
