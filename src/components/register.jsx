import {useState} from "react";

import '../App.css';

const Register = () => {
    const [name,setName] = useState('')
    const [panName,setpanName] = useState('')
    const [userState,setUserState] = useState('')
    const [district,setDistrict] = useState('')
    const [vname,setvName] = useState('')
    const [rate,setRate] = useState('')
    const [role,setRole] = useState('')
    const [errName,setErrName] = useState('')
    const [errPanName,setErrPanName] = useState('')
    const [errUserState,setErrUserState] = useState('')
    const [errDistrict,setErrDistrict] = useState('')
    const [errVname,setErrVName] = useState('')
    const [errRate,setErrRate] = useState('')
    const [errRole,setErrRole] = useState('')


    const validateForm = () => {
        let validity = true
    
        if(name==='') {
          validity = false
          setErrName('*Please enter SHG Name')
        }
    
        if(panName==='') {
            validity = false
            setErrPanName('*Please Enter Panchayat Name')
          }      
    
        if(userState==='') {
          validity = false
          setErrUserState('*Please enter State')
        }

        if(district==='') {
            validity = false
            setErrDistrict('*Please enter District')
        }

        if(vname==='') {
          validity = false
          setErrVName('*Please enter Village')
        }

        if(rate==='') {
            validity = false
            setErrRate('*Please enter Rate')
        }

        if(role==='') {
            validity = false
            setErrRole('*Please enter Role')
        }
    
        return validity
      }

      const handleSubmit = (e) => {
        e.preventDefault()
    
        if(validateForm()) {
            alert('Details submitted')
        }
    
        setName('')
        setUserState('')
        setDistrict('')
        setpanName('')
        setvName('')
        setRate('')
        setRole('')
      }

    return (
        <div className="Register">
        <div className="container3">
        <form method='post' 
        className="form" 
        name='Login-Form' 
        onSubmit={(e) => handleSubmit(e)}
        >
          <h2>New SHG User Registration</h2>

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
            <label htmlFor="state">State</label>
            <input type="text" 
            name='state'
            onChange={e => setUserState(e.target.value)}
            placeholder='Enter State'
            />
            <small className="errorMsg">{errUserState}</small>
          </div>

          <div className="control">
            <label htmlFor="district">District</label>
            <input type="text" 
            name='district'
            onChange={e => setDistrict(e.target.value)}
            placeholder='Enter District'
            />
            <small className="errorMsg">{errDistrict}</small>
          </div>

          <div className="control">
            <label htmlFor="panchayat-name">Panchayat Name</label>
            <input type="text" 
            name='panchayat-name'
            onChange={e => setpanName(e.target.value)}
            placeholder='Enter Panchayat'
            />
            <small className="errorMsg">{errPanName}</small>
          </div>

          <div className="control">
            <label htmlFor="village-name">Village Name</label>
            <input type="text" 
            name='village-name'
            onChange={e => setvName(e.target.value)}
            placeholder='Enter Village'
            />
            <small className="errorMsg">{errVname}</small>
          </div>

          <div className="control">
            <label htmlFor="interest-rate">Interest Rate</label>
            <input type="text" 
            name='interest-rate'
            onChange={e => setRate(e.target.value)}
            placeholder='Enter Interest Rate'
            />
            <small className="errorMsg">{errRate}</small>
          </div>

          <div className="control">
                <label htmlFor = "role">Role</label>
                <input list="role" 
                name = "role" 
                value={role} 
                placeholder="Enter Your Role" 
                onChange={(e) => setRole(e.target.value)} />
                <datalist id="role">
                  <option value="President" />
                  <option value="Treasurer" />
                  <option value="Treasurer" />
                  <option value="Treasurer" />
                </datalist>
                <small className="errorMsg">{errRole}</small>
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

export default Register;
