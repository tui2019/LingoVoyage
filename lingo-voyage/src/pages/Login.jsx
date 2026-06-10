import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext.jsx';

function Login() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        navigate("/", { replace: true });
      } else {
        setError(data.error || "Invalid username or password");
      }
    } catch (err) {
      setError("Server is down. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="v-card">
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", marginTop: 0 }}>Login</h2>

      {error && (
        <p style={{ color: "var(--accent)", textAlign: "center", marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="username" className="v-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            className="v-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="password" className="v-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="v-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="v-btn v-btn-accent">Sign In</button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Don't have an account?
        <Link to="/register" className="v-link" style={{ marginLeft: "5px", fontWeight: "500" }}>Register</Link>
      </div>
    </div>
  );
}

export default Login;