import { Link } from "react-router-dom"
const Home = () => {
  return (
    <div className='Home'>
      
      <div className="container">
      <h1>SHG Helper <br /><br /><br /> Home Page</h1>
      <br />
      <div className="links-home">
        <Link to='/user' style={{fontWeight: 'bold'}} className='signup-link'>Sign Up/Login as User</Link>
        {/* <Link to='/login' style={{fontWeight: 'bold'}} className='login-link'>Login</Link> */}
        <Link to='/admin' style={{fontWeight: 'bold'}} className='login-link'>Sign Up/Login as Admin </Link>

      </div>
      </div>
    </div>
  )
}

export default Home