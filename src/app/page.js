'use client';

import { useState, useEffect } from 'react';
import { FiMic, FiSearch } from 'react-icons/fi';
import { Spinner } from '@/components/Spinner';
import axios from 'axios';

export default function AppPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [displayedResponse, setDisplayedResponse] = useState(''); // Typing animation
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Chat memory

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
    setResponse('');
    setDisplayedResponse('');

    try {
      const res = await axios.post('/api/ask', { query: input });
      setResponse(res.data.reply);

      // Save chat memory
      setChatHistory((prev) => [
        ...prev,
        { question: input, answer: res.data.reply },
      ]);
    } catch (err) {
      console.error('Frontend error:', err);
      setResponse('❌ Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  // Typing animation effect
  useEffect(() => {
    if (!response) return;

    let i = 0;
    setDisplayedResponse('');
    const interval = setInterval(() => {
      setDisplayedResponse((prev) => prev + response.charAt(i));
      i++;
      if (i >= response.length) clearInterval(interval);
    }, 30); // Typing speed (ms)

    return () => clearInterval(interval);
  }, [response]);

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-12">
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
          Ask Ranea Anything
        </h1>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm shadow-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="e.g. Book an Urdu-speaking doctor near Brooklyn"
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
          />
          <button onClick={() => handleSearch(query)} className="hover:text-blue-400">
            <FiSearch size={22} />
          </button>
          <button onClick={handleVoiceInput} className="hover:text-green-400">
            <FiMic size={22} />
          </button>
        </div>

        {loading && (
          <div className="flex justify-center mt-10">
            <Spinner />
          </div>
        )}

        {!loading && chatHistory.length > 0 && (
          <div className="mt-10 space-y-6">
            {chatHistory.map((chat, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-xl text-left">
                <p className="text-blue-400 font-semibold mb-2">You: {chat.question}</p>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {index === chatHistory.length - 1 ? displayedResponse : chat.answer}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
