import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './Auth.css';
import API_BASE_URL from '../config/api.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message,setMessage]=useState('');

  async function Log(e) {
    e.preventDefault();

    let isValid = true;

  
    setEmailError('');
    setPasswordError('');

    
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) {
      return; 
    }

  
    const resp = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await resp.json();
    console.log('Login response:', data);
      
    if (resp.ok) {
      // Store token and user data from backend response
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      // Use user data from backend response
      const userData = data.user || {
        id: data.userId,
        email: email,
        name: data.name || email.split('@')[0],
        authMethods: data.authMethods || ['password']
      };
      
      login(userData);
      navigate('/'); 

    } else {
      console.log('Login failed');
      if (data.needsPassword) {
        setMessage(data.message + ' You can also register to set a password.');
      } else {
        setMessage(data.message || 'Invalid email or password');
      }
    }
  }
  const handleSuccess = async (response) => {
    try {
      const decoded = jwtDecode(response.credential || '');
      const googleEmail = decoded?.email;
      const googleSub = decoded?.sub;
      const googleName = decoded?.name;
      
      // Send Google auth data to backend
      const resp = await fetch(`${API_BASE_URL}/google-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: googleEmail,
          googleId: googleSub,
          name: googleName
        }),
      });
      
      const data = await resp.json();
      
      if (resp.ok) {
        const userData = {
          email: googleEmail,
          id: data.userId,
          name: data.name,
          authMethods: data.authMethods,
          hasPassword: data.hasPassword
        };
        
        login(userData);
        
        // If user doesn't have password, show option to set one
        if (!data.hasPassword) {
          const setPassword = window.confirm(
            'You can set a password to login with email/password in the future. Would you like to set a password now?'
          );
          if (setPassword) {
            // Redirect to password setting page or show modal
            localStorage.setItem('tempUserForPassword', JSON.stringify(userData));
            navigate('/set-password');
            return;
          }
        }
        
        navigate('/');
      } else {
        setMessage(data.message || 'Google authentication failed');
      }
    } catch (e) {
      console.error('Failed to decode Google credential:', e);
      setMessage('Google authentication failed');
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  return (
    <>
      <div>
       
        <div className="cont-auth">
        <fieldset className='field'>
     <center>  <div className="icon-auth"><h1><FaUser/></h1></div> </center>  <br />
          <form>
            <label htmlFor="email">Email</label><br />
            <input
              type="text"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              
            /><br />
         
            {emailError && <p className="error-text">{emailError}</p>}
            
            <label htmlFor="password">Password</label><br />
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)} 
            /><br />
          
            {passwordError && <p className="error-text">{passwordError}</p>}

            <div className="check">
              <input type="checkbox" />
              <span>remember me</span>
            </div>
            <br />
            <center>
             <div className="auth"> <button type="submit" onClick={Log}>Login</button></div>
             <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "848508527235-cbrsoqi49lr88rfiivj0nuc2fhrgugmm.apps.googleusercontent.com"}>
      <div>
        <p>or</p>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          isSigedIn={true}
          cookiePolicy={'single_host_origin '}
        />
      </div>
    </GoogleOAuthProvider>
            </center>
        <div className="servererror"> <p>{message}</p></div>   
          </form>
          <br />
          <p>do not have any account? <Link to="/register">register</Link></p>
        </fieldset></div>
        <br />
      </div>
    </>
  );
}

export default Login;
