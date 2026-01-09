import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from '../contexts/AuthContext.jsx';

function Register() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mainLanguage, setMainLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [manualMain, setManualMain] = useState("");
  const [manualTarget, setManualTarget] = useState("");
  const [aiApiKey, setAiApiKey] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const popularLanguages = [
    { name: "English", flag: "🇬🇧" },
    { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" },
    { name: "German", flag: "🇩🇪" },
    { name: "Ukrainian", flag: "🇺🇦" },
    { name: "Chinese", flag: "🇨🇳" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Korean", flag: "🇰🇷" },
    { name: "Italian", flag: "🇮🇹" },
    { name: "Portuguese", flag: "🇵🇹" }
  ];

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const finalMainLanguage = mainLanguage === "Other" ? manualMain : mainLanguage;
    const finalTargetLanguage = targetLanguage === "Other" ? manualTarget : targetLanguage;

    try {
      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
          mainLanguage: finalMainLanguage,
          targetLanguage: finalTargetLanguage,
          aiApiKey
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        navigate("/", { replace: true });
      } else {
        setError(data.error || "Registration failed");
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
      minHeight: "90vh",
      padding: "40px 20px"
    },
    card: {
      backgroundColor: "#242424",
      padding: "2rem",
      borderRadius: "12px",
      width: "450px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
      color: "#ffffff",
      boxSizing: "border-box"
    },
    inputGroup: {
      marginBottom: "1.2rem",
      textAlign: "left"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.85rem",
      color: "#bbb"
    },
    input: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#1a1a1a",
      border: "1px solid #333",
      borderRadius: "6px",
      color: "white",
      fontSize: "0.95rem",
      boxSizing: "border-box",
      outline: "none"
    },
    manualInputWrapper: {
      overflow: "hidden",
      transition: "max-height 0.4s ease, opacity 0.4s ease, margin-top 0.4s ease"
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
      marginTop: "1rem"
    },
    linkText: {
      marginTop: "1.5rem",
      textAlign: "center",
      fontSize: "0.85rem",
      color: "#888"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Join LingoVoyage</h2>

        {error && <p style={{ color: "#ff6b6b", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleRegister}>
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
              autoComplete="new-password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="mainLanguage" style={styles.label}>Native Language</label>
            <select
              id="mainLanguage"
              style={styles.input}
              value={mainLanguage}
              onChange={(e) => setMainLanguage(e.target.value)}
              required
            >
              <option value="" disabled>Select language</option>
              {popularLanguages.map(l => (
                <option key={l.name} value={l.name}>{l.flag} {l.name}</option>
              ))}
              <option value="Other">🌐 Not on the list...</option>
            </select>
            <div style={{
              ...styles.manualInputWrapper,
              maxHeight: mainLanguage === "Other" ? "100px" : "0",
              opacity: mainLanguage === "Other" ? 1 : 0,
              marginTop: mainLanguage === "Other" ? "8px" : "0"
            }}>
              <input
                type="text"
                placeholder="Enter language manually"
                style={styles.input}
                value={manualMain}
                onChange={(e) => setManualMain(e.target.value)}
                required={mainLanguage === "Other"}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="targetLanguage" style={styles.label}>Language to Learn</label>
            <select
              id="targetLanguage"
              style={styles.input}
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              required
            >
              <option value="" disabled>Select language</option>
              {popularLanguages.map(l => (
                <option key={l.name} value={l.name}>{l.flag} {l.name}</option>
              ))}
              <option value="Other">🌐 Not on the list...</option>
            </select>
            <div style={{
              ...styles.manualInputWrapper,
              maxHeight: targetLanguage === "Other" ? "100px" : "0",
              opacity: targetLanguage === "Other" ? 1 : 0,
              marginTop: targetLanguage === "Other" ? "8px" : "0"
            }}>
              <input
                type="text"
                placeholder="Enter language manually"
                style={styles.input}
                value={manualTarget}
                onChange={(e) => setManualTarget(e.target.value)}
                required={targetLanguage === "Other"}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="aiApiKey" style={styles.label}>
              Gemini API Key
              <span style={{ fontSize: "0.75rem", marginLeft: "5px" }}>
                (<a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" style={{ color: "#646cff" }}>get key</a>)
              </span>
            </label>
            <input
              id="aiApiKey"
              name="aiApiKey"
              type="password"
              autoComplete="off"
              style={styles.input}
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.button}>Create Account</button>
        </form>

        <div style={styles.linkText}>
          Already have an account?
          <Link to="/login" style={{ color: "#646cff", marginLeft: "5px", textDecoration: "none" }}>Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
