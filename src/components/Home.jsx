import { Link } from "react-router-dom"
const Home = () => {
  return (
    <div className='Home'>
      
      <div className="container">
      <h1>SIH Helper <br /><br /><br /> Home Page</h1>
      <br />
      <div className="links-home">
        <Link to='/signup' style={{fontWeight: 'bold'}} className='signup-link'>Sign Up</Link>
        <Link to='/login' style={{fontWeight: 'bold'}} className='login-link'>Login</Link>

      </div>
      </div>
    </div>
  )
}

export default Home