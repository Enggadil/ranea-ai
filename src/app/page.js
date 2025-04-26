'use client';

import { useState, useEffect } from 'react';
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

    recognition.onresult = function (event) {
      const speech = event.results[0][0].transcript;
      setQuery(speech);
      handleSearch(speech);
    };

    recognition.start();
  };

  const handleSearch = async (input) => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('Thinking...');

    try {
      const res = await axios.post('/api/ask', { query: input });
      setResponse(res.data.reply);
    } catch (err) {
      console.error('Frontend error:', err);
      setResponse('❌ Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-16 flex flex-col items-center">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 mb-6">
          Your Personal AI Healthcare Assistant
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Ask Ranea to find doctors, clinics, languages, specialties, or book appointments without an app.
        </p>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl shadow-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="e.g. Book an Urdu-speaking female dentist near Brooklyn"
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
          />
          <button onClick={() => handleSearch(query)} className="hover:text-blue-400">
            <FiSearch size={22} />
          </button>
          <button onClick={handleVoiceInput} className="hover:text-green-400">
            <FiMic size={22} />
          </button>
        </div>

        {loading && <p className="mt-8 text-sm text-blue-400 animate-pulse">Thinking...</p>}
        {response && !loading && (
          <div className="mt-8 bg-white/10 p-6 rounded-xl shadow-inner text-left">
            <h2 className="text-lg font-semibold mb-2 text-green-400">Ranea's Response:</h2>
            <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{response}</p>
          </div>
        )}
      </div>
    </main>
  );
}
