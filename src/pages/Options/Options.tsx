import React, { useState, useEffect } from 'react';
import './Options.css';

interface Props {
  title: string;
}

const Options: React.FC<Props> = ({ title }: Props) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [accentColor, setAccentColor] = useState<string>('#10b981'); // Default green
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    chrome.storage.sync.get(['openai_api_key', 'accent_color'], (result) => {
      if (result.openai_api_key) {
        setApiKey(result.openai_api_key);
      }
      if (result.accent_color) {
        setAccentColor(result.accent_color);
      }
    });
  }, []);

  useEffect(() => {
    // Apply accent color to CSS variable
    document.documentElement.style.setProperty('--accent-color', accentColor);
    // Calculate darker shade for hover
    const r = parseInt(accentColor.slice(1, 3), 16);
    const g = parseInt(accentColor.slice(3, 5), 16);
    const b = parseInt(accentColor.slice(5, 7), 16);
    const darker = `rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`;
    document.documentElement.style.setProperty('--accent-hover', darker);
  }, [accentColor]);

  const handleSave = () => {
    chrome.storage.sync.set({ openai_api_key: apiKey, accent_color: accentColor }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const handleClear = () => {
    setApiKey('');
    chrome.storage.sync.remove('openai_api_key', () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  const presetColors = [
    { name: 'Green', value: '#10b981' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Indigo', value: '#6366f1' },
  ];

  return (
    <div className="options-container">
      <div className="options-header">
        <h1>Summa Settings</h1>
        <p>Configure your AI-powered webpage summarizer</p>
      </div>

      <div className="options-content">
        <div className="setting-section">
          <h2>OpenAI API Key</h2>
          <p className="setting-description">
            Enter your OpenAI API key to enable summarization. Get your key at{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
            >
              platform.openai.com
            </a>
          </p>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="api-key-input"
          />
          <div className="button-group">
            <button onClick={handleSave} className="save-btn">
              Save API Key
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear API Key
            </button>
          </div>
          {saved && <div className="success-message">Settings saved!</div>}
        </div>

        <div className="setting-section">
          <h2>Accent Color</h2>
          <p className="setting-description">
            Choose an accent color to personalize your Summa experience.
          </p>

          <div className="color-picker-section">
            <label htmlFor="color-picker">Custom Color:</label>
            <div className="color-input-group">
              <input
                id="color-picker"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="color-input"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="color-text-input"
                placeholder="#000000"
              />
            </div>
          </div>

          <div className="preset-colors">
            <label>Preset Colors:</label>
            <div className="color-grid">
              {presetColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={`color-preset ${accentColor === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {accentColor === color.value && '✓'}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} className="save-btn" style={{ marginTop: '1rem' }}>
            Save Color Preference
          </button>
        </div>

        <div className="setting-section">
          <h2>About Summa</h2>
          <p className="setting-description">
            Summa uses OpenAI's GPT-4o-mini model to generate intelligent summaries of webpages.
            Your API key is stored securely in your browser and is never shared with anyone.
          </p>
          <div className="info-box">
            <strong>Version:</strong> 1.0.0<br />
            <strong>Model:</strong> GPT-4o-mini
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;
