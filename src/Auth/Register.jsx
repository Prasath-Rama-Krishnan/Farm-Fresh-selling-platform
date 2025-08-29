import { useState } from 'react'
import './auth.css'
import { useNavigate ,Link} from 'react-router-dom';
import { BiSolidUserRectangle } from "react-icons/bi";

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword, setConfirmPassword] = useState("")
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmpasswordError, setConfirmPasswordError] = useState('');
  const [message,setMessage]=useState('')
  
  async function Log(e) {
    e.preventDefault();

    let isValid = true;

   
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }
    else if(!emailRegex.test(email))
    {
      setEmailError(`enter correct email "@gmail.com"`);
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }
    else if(password.length < 8)
    {
      setPasswordError('Password is very weak');
      isValid = false;
    }
    if (!confirmpassword) {
      setConfirmPasswordError('confirm Password is required');
      isValid = false;
    }
    if (password!=confirmpassword) {
      setConfirmPasswordError('Password is incorrect');
      isValid = false;
    }
    
    if (!isValid) {
      return; 
    }
    const resp = await fetch("http://localhost:5172/register", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      }),
    })
    const data=await resp.json();
    if (resp.ok) {
      if (data.message.includes('Password added')) {
        setMessage("Password added to your Google account! You can now login with either method.");
      } else {
        setMessage("Registration successful! Please login.");
      }
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      if (data.message && data.message.includes('already exists')) {
        setMessage("Email already registered. Please go to login page to sign in.");
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
      console.log("Registration failed");
    }

 
  }

   
  

  return (
    <>
      <div>
        
   <div className="cont-auth">   <fieldset className='field'>
    <center><div className="icon-auth"> <h1>< BiSolidUserRectangle /></h1></div> </center>  <br />
        <form >
          <label htmlFor="email">Email</label><br />
          <input 
            type="email" 
            name="email" 
            onChange={(e) => setEmail(e.target.value)} 
            required
          /><br />{emailError && <p className="error-text">{emailError}</p>}
          
          <label htmlFor="password">Password</label><br />
          <input 
            type="password" 
            name="password" 
            onChange={(e) => setPassword(e.target.value)} 
            required
          /><br />
               {passwordError && <p className="error-text">{passwordError}</p>} 
           <label htmlFor="password">confirm-Password</label><br />
          <input 
            type="password" 
            name="confirmpassword" 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            
          />   
           {confirmpasswordError && <p className="error-text">{confirmpasswordError}</p>} <br /><br />
     <center><div className="auth"><button type="submit" onClick={Log}>register</button></div></center>   
     <div className="servererror"><p style={{color: message.includes('successful') ? 'green' : 'red'}}>{message}</p>
     </div>
        </form>
      
        <p>I have account? <Link to="/login">login</Link></p>
        </fieldset></div>  <br />
    

      </div>
    </>
  )
}

export default Register