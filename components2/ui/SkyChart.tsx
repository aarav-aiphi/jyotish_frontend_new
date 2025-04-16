'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface SkyChartResponse {
  Status: string;
  Payload: {
    SvgContent: string;
  }
}

export function SkyChart() {
  const [chartData, setChartData] = useState<string | null>(null);
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

  const fetchSkyChart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/SkyChart/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const svgText = await response.text();
      setChartData(svgText);
    } catch (err: any) {
      setError(err.message);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
        <Image
          src="/stars-pattern.png"
          alt="Stars Pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-12 text-center relative">
        <h2 className="text-4xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Celestial Sky Chart
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Visualize the positions of planets and stars in the sky at any given time and location
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <form onSubmit={fetchSkyChart} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                🌍
              </span>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. New Delhi, India"
                className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                ⏰
              </span>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                📅
              </span>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                🌐
              </span>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                placeholder="e.g. +05:30"
                className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="md:col-span-2 text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold
                       bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                       hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              {loading ? 'Generating Chart...' : 'Generate Sky Chart'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">✨</div>
            <p className="text-sacred-copper">Mapping the celestial bodies...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {chartData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
          >
            <div 
              dangerouslySetInnerHTML={{ __html: chartData }}
              className="w-full flex justify-center"
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 