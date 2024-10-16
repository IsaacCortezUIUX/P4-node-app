import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and registration
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error

    try {
      if (isRegistering) {
        // Registration logic
        const response = await axios.post('http://localhost:5000/auth/register', {
          name,
          email,
          password,
        });
        alert(response.data.msg); // Notify user about registration
        setIsRegistering(false); // Switch back to login mode
      } else {
        // Login logic
        const response = await axios.post('http://localhost:5000/auth/login', { email, password });
        login(response.data.userId); // Pass userId to the parent component
      }
    } catch (error) {
      setError('An error occurred. Please try again.'); // Set an error message
      console.error('Error:', error.response.data);
    }
  };

  return (
    <div className="container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
};

export default Login;
