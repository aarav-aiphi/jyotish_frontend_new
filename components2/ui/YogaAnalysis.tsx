'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface YogaResponse {
  Status: string;
  Payload: {
    NithyaYoga: {
      Name: string;
      Description: string;
    }
  }
}

export function YogaAnalysis() {
  const [results, setResults] = useState<YogaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    location: '',
    time: '',
    date: '',
    timezone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchYoga = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      
      if (!location || !time || !date || !timezone) {
        throw new Error('Please fill in all required fields');
      }

      const formattedDate = formatDate(date);
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/NithyaYoga/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Status !== "Pass") {
        throw new Error(data.Message || 'Failed to get yoga information');
      }

      setResults(data);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10 z-10">
        <Image
          src="/time-pattern.png"
          alt="Time Pattern"
          fill
          className="object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-20"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sacred-copper">Yoga Analysis</h2>
          <p className="text-gray-600 mt-2">
            Discover your Nithya Yoga and its influence on your life
          </p>
        </div>

        <form onSubmit={fetchYoga} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Birth Place</label>
              <input
                type="text"
                name="location"
                value={formData.location}
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
                name="time"
                value={formData.time}
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
                name="date"
                value={formData.date}
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

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold
                       bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                       hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 z-10 relative"
            >
              {loading ? 'Calculating...' : 'Find Yoga'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⭐</div>
            <p className="text-sacred-copper">Analyzing yoga combinations...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {results?.Status === "Pass" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-sacred-copper mb-4">
                Your Nithya Yoga
              </h3>
              <div className="inline-block p-6 bg-sacred-gold/5 rounded-full mb-6">
                <span className="text-4xl">✨</span>
              </div>
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {results.Payload.NithyaYoga.Name}
              </p>
              <p className="text-gray-600">
                {results.Payload.NithyaYoga.Description}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 