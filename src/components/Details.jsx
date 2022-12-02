import {useState} from "react";
import { Link,Navigate } from 'react-router-dom'

import "../App.css";

const Details = () => {
    const [name,setName] = useState('')
    const [username,setUserName] = useState('')
    const [password,setPassword] = useState('')
    const [errName,setErrName] = useState('')
    const [errUserName,setErrUserName] = useState('')
    const [errPassword,setErrPassword] = useState('')
    const [redirect,setRedirect] = useState(false)

    const validateForm = () => {
        let validity = true
    
        if(name==='') {
          validity = false
          setErrName('*Please enter your SHG Name')
        }
        
        if(typeof(name) !== 'undefined') {
            if (!(name.length > 3)) {
              validity = false
              setErrName('*Please Enter More Than 3 Characters')
            }
          }
    
        if(username==='') {
            validity = false
            setErrUserName('*Please Enter Your Username')
          }
      
          if(typeof(username) !== 'undefined') {
            if (!(username.length > 3)) {
              validity = false
              setErrUserName('*Please Enter More Than 3 Characters')
            }
          }
      
    
        if(password==='') {
          validity = false
          setErrPassword('*Please enter your Password')
        }
    
        if (typeof(password) !== 'undefined') {
          if (!(password.length > 6)) {
            validity = false
            setErrPassword('*Please enter more than 6 characters')
          }
        }
    
        return validity
      }

      const handleSubmit = async (e) => {
        e.preventDefault()
    
        if(validateForm()) {
            alert('Details submitted')
        // signInWithEmailAndPassword(auth,email,password)
        // .then(async (res) => {
        //   console.log(res)
        //   localStorage.setItem("user_id",res.user.uid)
        //   alert('Logged in Successfully!')
        //   setRedirect(true)
        // })
        // .catch(err => alert(err))
        }
    
        setName('')
        setUserName('')
        setPassword('')
      }



    return (
    <div className="Details">
        <div className="container">
        <form method='post' 
        className="form" 
        name='Login-Form' 
        onSubmit={(e) => handleSubmit(e)}
        >
          <h2>SHG Details</h2>

          <div className="control">
            <label htmlFor="shg-name">SHG Name</label>
            <input type="text" 
            name='shg-name'
            onChange={e => setName(e.target.value)}
            placeholder='Enter SHG Name'
            />
            <small className="errorMsg">{errName}</small>
          </div>

          <div className="control">
            <label htmlFor="username">Username</label>
            <input type="text" 
            name='username'
            onChange={e => setUserName(e.target.value)}
            placeholder='Enter Username'
            />
            <small className="errorMsg">{errUserName}</small>
          </div>

          <div className="control">
            <label htmlFor="password">Password</label>
            <input type="password" 
            name='password'
            onChange={e => setPassword(e.target.value)}
            placeholder='Enter Password'
            />
            <small className="errorMsg">{errPassword}</small>
          </div>

          {/* <div className="control">
            <span>Don't have an account? <Link to='/signup' className='login-link-1'>Signup</Link></span>
          </div> */}

          <input type='submit' className='button' value='Register' />
        </form>
        {/* {redirect===true ? <Navigate to='/posts' /> : ''} */}
      </div>
    </div>
    );
};

export default Details;
