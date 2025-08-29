import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './auth.css';
import { useAuth } from '../context/AuthContext';
import { FaLock } from "react-icons/fa";

function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Get user data from localStorage (set during Google login)
    const tempUser = localStorage.getItem('tempUserForPassword');
    if (tempUser) {
      setUserData(JSON.parse(tempUser));
    } else {
      // Redirect to login if no user data
      navigate('/login');
    }
  }, [navigate]);

  const handleSetPassword = async (e) => {
    e.preventDefault();

    let isValid = true;
    setPasswordError('');
    setConfirmPasswordError('');

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password is required');
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    if (!isValid || !userData) {
      return;
    }

    try {
      const resp = await fetch('http://localhost:5172/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password,
          userId: userData.id
        }),
      });

      const data = await resp.json();

      if (resp.ok) {
        // Update user data with new auth methods
        const updatedUserData = {
          ...userData,
          authMethods: data.authMethods,
          hasPassword: true
        };
        
        login(updatedUserData);
        localStorage.removeItem('tempUserForPassword');
        setMessage('Password set successfully!');
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage(data.message || 'Failed to set password');
      }
    } catch (error) {
      console.error('Error setting password:', error);
      setMessage('Failed to set password. Please try again.');
    }
  };

  const skipPasswordSetting = () => {
    if (userData) {
      login(userData);
      localStorage.removeItem('tempUserForPassword');
      navigate('/');
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cont-auth">
      <fieldset className='field'>
        <center>
          <div className="icon-auth">
            <h1><FaLock/></h1>
          </div>
        </center>
        <br />
        <h2>Set Password</h2>
        <p>Hi {userData.name}! You can set a password to login with email/password in the future.</p>
        
        <form onSubmit={handleSetPassword}>
          <label htmlFor="password">New Password</label><br />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br />
          {passwordError && <p className="error-text">{passwordError}</p>}
          
          <label htmlFor="confirmPassword">Confirm Password</label><br />
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          /><br />
          {confirmPasswordError && <p className="error-text">{confirmPasswordError}</p>}
          
          <br />
          <center>
            <div className="auth">
              <button type="submit">Set Password</button>
            </div>
            <br />
            <button type="button" onClick={skipPasswordSetting} style={{background: 'gray'}}>
              Skip for now
            </button>
          </center>
          
          <div className="servererror">
            <p style={{color: message.includes('successfully') ? 'green' : 'red'}}>
              {message}
            </p>
          </div>
        </form>
      </fieldset>
    </div>
  );
}

export default SetPassword;
