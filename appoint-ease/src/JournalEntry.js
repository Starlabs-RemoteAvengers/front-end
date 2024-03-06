import React, { useState, useEffect } from 'react';
import './JournalStyling.css';

const JournalEntry = () => {
  const [entry, setEntry] = useState('');
  const [pastEntries, setPastEntries] = useState([]);


  useEffect(() => {
    loadPastEntries();
  }, []);

  const saveEntry = () => {
    if (entry.trim() !== '') {
      const currentDate = new Date();
      const timestamp = currentDate.toLocaleString();
      const newEntry = { entry: entry, timestamp: timestamp };
      const updatedEntries = [...pastEntries, newEntry];
      setPastEntries(updatedEntries);
      localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    } else {
      alert('Please write something before saving.');
    }
  };

  const clearEntry = () => {
    setEntry('');
  };

  const clearAllEntries = () => {
    localStorage.removeItem('journalEntries');
    setPastEntries([]);

  };

  const loadPastEntries = () => {
    const storedEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setPastEntries(storedEntries);
  };

  return (
    <div className="journal-entry-container">
      <h1>Appointment Thoughts</h1>
      <div className="entry-form">
        <div className="form-group">
          <label htmlFor="journal-entry">Write your thoughts:</label>
          <textarea
            id="journal-entry"
            placeholder="What's on your mind?"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          ></textarea>

        </div>
        <div className="btn-container">
          <button onClick={saveEntry}>Save Entry</button>
          <button onClick={clearEntry}>Clear</button>
          <button onClick={clearAllEntries}>Clear All Entries</button>
        </div>
      </div>
      {pastEntries.length > 0 && (
        <div className="past-entries">
          <h2>Past Entries</h2>
          <ul>
            {pastEntries.map((item, index) => (
              <li key={index}>
                <p>{item.entry}</p>
                <small>{item.timestamp}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="confirmation">
        <span className="confirmation-text"></span>
      </div>
    </div>
  );
};

export default JournalEntry;
