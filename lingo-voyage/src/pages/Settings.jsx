import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

function Settings() {
  const settingsData = useLoaderData();

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

  const isPopular = (lang) => popularLanguages.some(l => l.name === lang);

  const initialMain = settingsData?.mainLanguage || "";
  const initialTarget = settingsData?.targetLanguage || "";
  const apiLast4 = "********" + settingsData?.aiApiKeyLast4 || "****";

  const [newPassword, setNewPassword] = useState("");
  const [newApiKey, setNewApiKey] = useState("");

  const [mainLanguage, setMainLanguage] = useState(
    isPopular(initialMain) ? initialMain : (initialMain ? "Other" : "")
  );

  const [targetLanguage, setTargetLanguage] = useState(
    isPopular(initialTarget) ? initialTarget : (initialTarget ? "Other" : "")
  );

  const [manualMain, setManualMain] = useState(
    !isPopular(initialMain) && initialMain ? initialMain : ""
  );

  const [manualTarget, setManualTarget] = useState(
    !isPopular(initialTarget) && initialTarget ? initialTarget : ""
  );

  const handleSaveChanges = async () => {
    const changes = {};

    // Check if password has been changed
    if (newPassword.trim()) {
      changes.password = newPassword;
    }

    // Check if API key has been changed
    if (newApiKey.trim()) {
      changes.aiApiKey = newApiKey;
    }

    // Determine final main language
    const finalMainLanguage = mainLanguage === "Other" ? manualMain : mainLanguage;
    if (finalMainLanguage && finalMainLanguage !== initialMain) {
      changes.mainLanguage = finalMainLanguage;
    }

    // Determine final target language
    const finalTargetLanguage = targetLanguage === "Other" ? manualTarget : targetLanguage;
    if (finalTargetLanguage && finalTargetLanguage !== initialTarget) {
      changes.targetLanguage = finalTargetLanguage;
    }

    // Only send request if there are changes
    if (Object.keys(changes).length === 0) {
      // alert("No changes to save.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:4000/api/settings/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(changes),
        credentials: "include",
      });

      if (response.ok) {
        // Clear password and API key fields after successful save
        setNewPassword("");
        setNewApiKey("");
      } else {
        const error = await response.json();
        console.log(`Failed to save settings: ${error.error || error.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '20px' }}>
      <h1>Settings</h1>

      {/* Password Field */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="new-password" style={{ minWidth: '120px', textAlign: 'right' }}>New Password:</label>
        <input
          id="new-password"
          type="password"
          placeholder="******"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="new-password"
          style={{ padding: '5px' }}
        />
      </div>

      {/* API Key Field */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label htmlFor="api-key" style={{ minWidth: '120px', textAlign: 'right' }}>New Gemini API Key:</label>
        <input
          id="api-key"
          type="password"
          placeholder={apiLast4}
          value={newApiKey}
          onChange={(e) => setNewApiKey(e.target.value)}
          autoComplete="one-time-code"
          data-lpignore="true"
          data-form-type="other"
          style={{ padding: '5px' }}
        />
      </div>

      {/* Native Language Picker */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="mainLanguage" style={{ minWidth: '120px', textAlign: 'right' }}>Native Language:</label>
            <select
              id="mainLanguage"
              value={mainLanguage}
              onChange={(e) => setMainLanguage(e.target.value)}
              style={{ padding: '5px', minWidth: '150px' }}
            >
              <option value="" disabled>Select language</option>
              {popularLanguages.map(l => (
                <option key={l.name} value={l.name}>{l.flag} {l.name}</option>
              ))}
              <option value="Other">🌐 Not on the list...</option>
            </select>
        </div>
        {mainLanguage === "Other" && (
            <input
                type="text"
                placeholder="Enter language manually"
                value={manualMain}
                onChange={(e) => setManualMain(e.target.value)}
                style={{ padding: '5px', marginLeft: '30px' }}
            />
        )}
      </div>

      {/* Target Language Picker */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="targetLanguage" style={{ minWidth: '120px', textAlign: 'right' }}>Target Language:</label>
            <select
              id="targetLanguage"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              style={{ padding: '5px', minWidth: '150px' }}
            >
              <option value="" disabled>Select language</option>
              {popularLanguages.map(l => (
                <option key={l.name} value={l.name}>{l.flag} {l.name}</option>
              ))}
              <option value="Other">🌐 Not on the list...</option>
            </select>
        </div>
        {targetLanguage === "Other" && (
            <input
                type="text"
                placeholder="Enter language manually"
                value={manualTarget}
                onChange={(e) => setManualTarget(e.target.value)}
                style={{ padding: '5px', marginLeft: '30px' }}
            />
        )}
      </div>

      {/* Save Changes Button */}
      <button
        type="button"
        onClick={handleSaveChanges}
        style={{
          marginTop: '20px',
          padding: '10px 30px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Save Changes
      </button>

    </div>
  )
}

export default Settings
