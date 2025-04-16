'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ChatResponse {
  Status: string;
  Payload: {
    Answer: string;
    AnswerHash: string;
    Confidence: number;
    Sources: string[];
  }
}

export function HoroscopeChat() {
  const [chatData, setChatData] = useState<ChatResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(`session_${Date.now()}`);
  const [userId] = useState(`user_${Date.now()}`);
  const [messages, setMessages] = useState<{question: string, answer: string}[]>([]);
  
  const [formData, setFormData] = useState({
    birthTime: '',
    birthDate: '',
    birthPlace: '',
    timezone: '',
    question: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { birthPlace, birthTime, birthDate, timezone, question } = formData;
      
      const url = `https://vedastro.azurewebsites.net/api/HoroscopeChat2/Location/${encodeURIComponent(birthPlace)}/Time/${birthTime}/${birthDate}/${timezone}/${encodeURIComponent(question)}/${userId}/${sessionId}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const data: ChatResponse = await response.json();
      setChatData(data);
      setMessages(prev => [...prev, { question, answer: data.Payload.Answer }]);
      
      // Clear question input after successful response
      setFormData(prev => ({ ...prev, question: '' }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
        <Image
          src="/chat-pattern.png"
          alt="Sacred Pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-12 text-center relative">
        <h2 className="text-4xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            AI Vedic Consultation
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Get personalized astrological insights powered by advanced AI and traditional Vedic wisdom
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={askQuestion} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Birth Place</label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder="e.g. New Delhi, India"
                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Birth Time</label>
              <input
                type="time"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleInputChange}
                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                placeholder="e.g. +05:30"
                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Question</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Ask about your career, relationships, or life path..."
              className="w-full p-4 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300 h-32"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold
                       bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                       hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              {loading ? 'Consulting...' : 'Ask Question'}
            </button>
          </div>
        </form>

        {/* Chat Messages */}
        <div className="space-y-6 mt-12">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <div className="bg-sacred-gold/5 p-4 rounded-lg">
                <p className="font-medium text-sacred-copper">Your Question:</p>
                <p className="mt-2">{msg.question}</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <p className="font-medium text-sacred-copper">AI Response:</p>
                <p className="mt-2 whitespace-pre-wrap">{msg.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
} 