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
      const response = await fetch("http://localhost:4000/api/login", {
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

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "80vh",
      padding: "20px"
    },
    card: {
      backgroundColor: "#242424",
      padding: "2rem",
      borderRadius: "12px",
      width: "400px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      textAlign: "center",
      color: "#ffffff"
    },
    inputGroup: {
      marginBottom: "1.2rem",
      textAlign: "left"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
      color: "#bbb"
    },
    input: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#1a1a1a",
      border: "1px solid #333",
      borderRadius: "6px",
      color: "white",
      fontSize: "1rem",
      boxSizing: "border-box",
      outline: "none"
    },
    button: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#3a3a3a",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "1rem",
      transition: "background 0.2s"
    },
    error: {
      color: "#ff6b6b",
      marginBottom: "1rem",
      fontSize: "0.9rem"
    },
    footer: {
      marginTop: "1.5rem",
      fontSize: "0.85rem",
      color: "#888"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = "#4a4a4a"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#3a3a3a"}
          >
            Sign In
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?
          <Link to="/register" style={{ color: "#646cff", marginLeft: "5px", textDecoration: "none" }}>Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
