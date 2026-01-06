import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext.jsx';

function Register() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear old errors
    // Handle registration logic
    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        navigate("/", { replace: true });
      } else {
        // Handle registration errors
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server is down. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h2>Register for LingoVoyage</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleRegister} className="login-form">
              <label>
                Username:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Register</button>
            </form>
      <p>Already have an account?</p>
      <Link to="/login" className="login-link">
        Login here.
      </Link>
    </div>
  );
}

export default Register;
