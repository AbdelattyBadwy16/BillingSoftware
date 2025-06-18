import React, { useState } from 'react';
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('yourname@example.com');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setError] = useState("");
  const nav = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const authRequest: any = {
        email,
        password
      };

      let response: any = await fetch('http://localhost:8080/api/v1.0/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authRequest)
      });

      response = await response.json();
      setError("");

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userRole', response.role);
      nav("/");
    } catch (error) {
      setError("Email or Password not found.");
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="login-title">Sign in</h1>
          <p className="login-subtitle">Sign in below to access your account</p>

          <form onSubmit={handleSubmit} >
            <div className="form-group">
              <label htmlFor="email" style={{ color: "black" }}>Email address:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" style={{ color: "black" }}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {
              err ?
                <div style={{
                  backgroundColor: '#fdecea',
                  color: '#b71c1c',
                  border: '1px solid #f5c6cb',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  marginTop: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: "10px"
                }}>
                  {err}
                </div> : ""
            }

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;