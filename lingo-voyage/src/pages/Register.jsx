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
      const response = await fetch("http://127.0.0.1:4000/api/register", {
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

  return (
    <div className="v-card">
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", marginTop: 0 }}>Join LingoVoyage</h2>

      {error && (
        <p style={{ color: "var(--accent)", textAlign: "center", marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="username" className="v-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            className="v-input"
            placeholder="Choose a username"
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
            autoComplete="new-password"
            className="v-input"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="mainLanguage" className="v-label">Native Language</label>
          <select
            id="mainLanguage"
            className="v-input"
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
          {mainLanguage === "Other" && (
            <input
              type="text"
              placeholder="Enter language manually"
              className="v-input"
              style={{ marginTop: '8px' }}
              value={manualMain}
              onChange={(e) => setManualMain(e.target.value)}
              required
            />
          )}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="targetLanguage" className="v-label">Language to Learn</label>
          <select
            id="targetLanguage"
            className="v-input"
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
          {targetLanguage === "Other" && (
            <input
              type="text"
              placeholder="Enter language manually"
              className="v-input"
              style={{ marginTop: '8px' }}
              value={manualTarget}
              onChange={(e) => setManualTarget(e.target.value)}
              required
            />
          )}
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label htmlFor="aiApiKey" className="v-label">
            Gemini API Key
            <span style={{ fontSize: "0.75rem", marginLeft: "5px" }}>
              (<a href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer" className="v-link">get key</a>)
            </span>
          </label>
          <input
            id="aiApiKey"
            name="aiApiKey"
            type="password"
            autoComplete="one-time-code"
            data-lpignore="true"
            data-form-type="other"
            className="v-input"
            placeholder="Paste your API key"
            value={aiApiKey}
            onChange={(e) => setAiApiKey(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="v-btn v-btn-accent">Create Account</button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
        Already have an account?
        <Link to="/login" className="v-link" style={{ marginLeft: "5px", fontWeight: "500" }}>Login</Link>
      </div>
    </div>
  );
}

export default Register;
