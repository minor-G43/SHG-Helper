import { Link } from "react-router-dom"
const Home = () => {
  return (
    <div className='Home'>
      
      <div className="container">
      <h1>SHG Helper <br /><br /><br /> Home Page</h1>
      <br />
      <div className="links-home">
        <Link to='/signup' style={{fontWeight: 'bold'}} className='login-link'>Sign Up</Link>
        <Link to='/login' style={{fontWeight: 'bold'}} className='login-link'>Login</Link>
        <Link to='/testcomp' style={{fontWeight: 'bold'}} className='login-link'>Comp </Link>

      </div>
      </div>
    </div>
  )
}

export default Home