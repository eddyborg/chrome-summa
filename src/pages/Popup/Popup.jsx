import React from 'react';
import './Popup.css';

const Popup = () => {
  const openSummarizer = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('panel.html')
    });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <h1>Summa</h1>
        <p>AI-Powered Webpage Summarizer</p>
      </div>
      <button onClick={openSummarizer} className="open-btn">
        Open Summarizer
      </button>
      <div className="popup-footer">
        <p>Click to summarize the current webpage</p>
      </div>
    </div>
  );
};

export default Popup;
