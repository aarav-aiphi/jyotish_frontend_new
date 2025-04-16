'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PanchakaResponse {
  Status: string;
  Payload: {
    Panchaka: 'Shubha' | 'Mrityu' | 'Raja' | 'Chora' | 'Agni';
  }
}

const panchakaInterpretations = {
  Shubha: {
    title: "Auspicious Period",
    description: "Highly favorable time for new beginnings",
    effects: [
      "Good for starting new ventures",
      "Favorable for important decisions",
      "Beneficial for relationships",
      "Success in endeavors"
    ],
    recommendations: [
      "Initiate important projects",
      "Make significant decisions",
      "Plan celebrations",
      "Begin new partnerships"
    ]
  },
  Mrityu: {
    title: "Challenging Period",
    description: "Time for caution and reflection",
    effects: [
      "Potential obstacles in path",
      "Need for careful planning",
      "Focus on existing projects",
      "Time for introspection"
    ],
    recommendations: [
      "Avoid new beginnings",
      "Focus on completion",
      "Practice spiritual activities",
      "Maintain low profile"
    ]
  },
  Raja: {
    title: "Royal Period",
    description: "Time of authority and power",
    effects: [
      "Enhanced leadership qualities",
      "Good for authority matters",
      "Success in public dealings",
      "Recognition and rewards"
    ],
    recommendations: [
      "Seek promotions",
      "Meet with authorities",
      "Make public appearances",
      "Take leadership roles"
    ]
  },
  Chora: {
    title: "Period of Uncertainty",
    description: "Time for vigilance and care",
    effects: [
      "Need for extra caution",
      "Protect resources",
      "Be mindful of commitments",
      "Watch for deception"
    ],
    recommendations: [
      "Secure valuables",
      "Double-check agreements",
      "Maintain transparency",
      "Avoid risky ventures"
    ]
  },
  Agni: {
    title: "Transformative Period",
    description: "Time of energy and transformation",
    effects: [
      "High energy levels",
      "Rapid changes possible",
      "Intense experiences",
      "Transformative events"
    ],
    recommendations: [
      "Channel energy positively",
      "Embrace change",
      "Practice caution with fire",
      "Focus on transformation"
    ]
  }
};

export function PanchakaAnalysis() {
  const [results, setResults] = useState<PanchakaResponse | null>(null);
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

  const fetchPanchaka = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      
      if (!location || !time || !date || !timezone) {
        const missingFields = [];
        if (!location) missingFields.push('Location');
        if (!time) missingFields.push('Time');
        if (!date) missingFields.push('Date');
        if (!timezone) missingFields.push('Timezone');
        
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }

      const formattedDate = formatDate(date);
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/Panchaka/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.Status !== "Pass") {
        throw new Error(data.Message || 'Failed to get Panchaka information');
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
      <div className="mb-12 text-center relative">
        <h2 className="text-3xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Panchaka Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze the five-fold timing influences
        </p>
      </div>

      <form onSubmit={fetchPanchaka} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
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
            <label className="block text-sm font-medium text-gray-700">Time</label>
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
            <label className="block text-sm font-medium text-gray-700">Date</label>
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
                     hover:cursor-pointer active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300 relative z-50"
          >
            <span className="relative z-50">
              {loading ? 'Calculating...' : 'Analyze Panchaka'}
            </span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-sacred-copper">Analyzing Panchaka influences...</p>
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
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 flex items-center justify-center text-3xl text-sacred-copper">
              🔮
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sacred-copper">
                {panchakaInterpretations[results.Payload.Panchaka].title}
              </h3>
              <p className="text-sm text-gray-600">
                {panchakaInterpretations[results.Payload.Panchaka].description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Effects Section */}
            <div>
              <h4 className="font-medium text-sacred-copper mb-3">Effects:</h4>
              <ul className="space-y-2">
                {panchakaInterpretations[results.Payload.Panchaka].effects.map((effect, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-sacred-gold">•</span>
                    <span className="text-gray-600">{effect}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations Section */}
            <div>
              <h4 className="font-medium text-sacred-copper mb-3">Recommendations:</h4>
              <ul className="space-y-2">
                {panchakaInterpretations[results.Payload.Panchaka].recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-sacred-gold">✧</span>
                    <span className="text-gray-600">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary Box */}
            <div className="mt-4 p-4 bg-sacred-gold/5 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Current Panchaka:</span>
                <span className="text-sacred-copper font-semibold">{results.Payload.Panchaka}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 