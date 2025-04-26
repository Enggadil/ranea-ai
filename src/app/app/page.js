'use client';

import { useState } from 'react';
import { FiMic, FiSearch } from 'react-icons/fi';
import axios from 'axios';

export default function AppPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support voice recognition');
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setQuery(speech);
      handleSearch(speech);
    };

    recognition.start();
  };

  const handleSearch = async (inputQuery) => {
    if (!inputQuery.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await axios.post('/api/ask', { query: inputQuery });
      setResponse(res.data.reply);
    } catch (err) {
      console.error('Frontend Error:', err);
      setResponse('❌ Sorry, something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          Your Personal AI Healthcare Assistant
        </h1>
        <p className="text-gray-400 mb-10 text-lg">
          Ask Ranea to find doctors, clinics, languages, specialties — or book appointments without an app.
        </p>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md shadow-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="e.g., Find Urdu-speaking dentist in Brooklyn"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-base"
          />
          <button onClick={() => handleSearch(query)} className="hover:text-blue-400">
            <FiSearch size={22} />
          </button>
          <button onClick={handleVoiceInput} className="hover:text-green-400">
            <FiMic size={22} />
          </button>
        </div>

        {loading && (
          <div className="mt-8 text-blue-400 animate-pulse">
            Thinking...
          </div>
        )}

        {response && !loading && (
          <div className="mt-8 bg-white/10 p-6 rounded-xl shadow-inner text-left">
            <h2 className="text-green-400 font-semibold mb-2">Ranea's Response:</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
