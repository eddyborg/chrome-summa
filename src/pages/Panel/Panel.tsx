import React, { useState, useEffect } from 'react';
import './Panel.css';

const Panel: React.FC = () => {
  const [count, setCount] = useState<number>(1);
  const [unit, setUnit] = useState<string>('paragraphs');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<string>('#10b981'); // Default green

  useEffect(() => {
    // Load API key and accent color from storage
    chrome.storage.sync.get(['openai_api_key', 'accent_color'], (result) => {
      if (result.openai_api_key) {
        setApiKey(result.openai_api_key);
      } else {
        setShowApiKeyInput(true);
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

  const saveApiKey = () => {
    chrome.storage.sync.set({ openai_api_key: apiKey }, () => {
      setShowApiKeyInput(false);
      setError('');
    });
  };

  const getPageContent = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Get the current active tab
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        const activeTab = tabs[0];
        if (!activeTab || !activeTab.id) {
          reject(new Error('No active tab found'));
          return;
        }

        // Check if the tab URL is accessible (not chrome:// or edge:// pages)
        if (activeTab.url?.startsWith('chrome://') ||
          activeTab.url?.startsWith('edge://') ||
          activeTab.url?.startsWith('about:') ||
          !activeTab.url) {
          reject(new Error('Cannot access this page. Please navigate to a regular webpage.'));
          return;
        }

        try {
          // Send message to content script
          chrome.tabs.sendMessage(
            activeTab.id,
            { action: 'getPageContent' },
            (response) => {
              if (chrome.runtime.lastError) {
                reject(new Error('Content script not loaded. Try refreshing the page.'));
                return;
              }

              if (response && response.content) {
                resolve(response.content);
              } else if (response && response.error) {
                reject(new Error(response.error));
              } else {
                reject(new Error('No content received from page'));
              }
            }
          );
        } catch (err) {
          reject(err);
        }
      });
    });
  };

  const handleSummarize = async () => {
    if (!apiKey) {
      setError('Please set your OpenAI API key first.');
      setShowApiKeyInput(true);
      return;
    }

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const pageContent = await getPageContent();

      if (!pageContent || pageContent.trim().length === 0) {
        throw new Error('No content found on this page. The page might be empty or protected.');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes web pages concisely and accurately.'
            },
            {
              role: 'user',
              content: `Please summarize the following webpage content in ${count} ${unit}:\n\n${pageContent}`
            }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate summary');
      }

      const data = await response.json();
      const summaryText = data.choices[0]?.message?.content || '';
      setSummary(summaryText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (method: string) => {
    if (!summary) {
      setError('No summary to share. Please generate a summary first.');
      return;
    }

    switch (method) {
      case 'clipboard':
        navigator.clipboard.writeText(summary).then(() => {
          alert('Summary copied to clipboard!');
        });
        break;

      case 'file':
        const blob = new Blob([summary], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `summary-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        break;

      case 'email':
        const emailSubject = 'Webpage Summary';
        const emailBody = encodeURIComponent(summary);
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
        break;

      case 'notes':
        // Apple Notes doesn't have a direct web API
        // We'll copy to clipboard and show instructions
        navigator.clipboard.writeText(summary).then(() => {
          alert('Summary copied to clipboard! Open Apple Notes and paste (Cmd+V) to create a new note.');
        });
        break;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Summa</h1>
        <p className="subtitle">AI-Powered Webpage Summarizer</p>
      </div>

      {showApiKeyInput && (
        <div className="api-key-section">
          <label htmlFor="api-key">OpenAI API Key:</label>
          <input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="api-key-input"
          />
          <button onClick={saveApiKey} className="save-btn">
            Save API Key
          </button>
        </div>
      )}

      <div className="controls">
        <div className="control-group">
          <label htmlFor="count">Summarize in:</label>
          <div className="input-row">
            <input
              id="count"
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="count-input"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="unit-select"
            >
              <option value="characters">Characters</option>
              <option value="words">Words</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSummarize}
          disabled={loading}
          className="summarize-btn"
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
      </div>

      {error && (
        <div className="error-message">{error}</div>
      )}

      {summary && (
        <div className="summary-section">
          <label htmlFor="summary">Summary:</label>
          <textarea
            id="summary"
            value={summary}
            readOnly
            className="summary-textarea"
          />

          <div className="share-section">
            <label>Share:</label>
            <div className="share-buttons">
              <button onClick={() => handleShare('clipboard')} className="share-btn">
                📋 Clipboard
              </button>
              <button onClick={() => handleShare('file')} className="share-btn">
                💾 Save as File
              </button>
              <button onClick={() => handleShare('email')} className="share-btn">
                📧 Email
              </button>
              <button onClick={() => handleShare('notes')} className="share-btn">
                📝 Apple Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {!showApiKeyInput && (
        <button
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          className="settings-btn"
        >
          ⚙️ Settings
        </button>
      )}
    </div>
  );
};

export default Panel;
