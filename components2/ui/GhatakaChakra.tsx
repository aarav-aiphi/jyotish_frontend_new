'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface GhatakaResponse {
  Status: string;
  Payload: {
    GhatakaChakra: 'WeekDay' | 'Nakshatra' | 'Tithi' | 'Karana' | 'Yoga';
  }
}

const ghatakaInterpretations = {
  WeekDay: {
    title: "Weekday Cycle",
    description: "Auspicious timing based on weekday cycles",
    effects: [
      "Planetary influences are strong on specific weekdays",
      "Good for activities related to the ruling planet of the day",
      "Affects daily routines and short-term activities"
    ],
    recommendations: [
      "Plan activities according to planetary day rulers",
      "Consider the strength of weekday lord",
      "Best for daily and routine matters"
    ]
  },
  Nakshatra: {
    title: "Lunar Constellation",
    description: "Timing influenced by lunar constellations",
    effects: [
      "Strong lunar influences on activities",
      "Affects emotional and mental states",
      "Important for spiritual and personal matters"
    ],
    recommendations: [
      "Consider the nature of current Nakshatra",
      "Good for spiritual and emotional activities",
      "Plan according to lunar cycles"
    ]
  },
  Tithi: {
    title: "Lunar Day",
    description: "Timing based on lunar day phases",
    effects: [
      "Influences success and completion of tasks",
      "Affects energy levels and motivation",
      "Important for new beginnings and completions"
    ],
    recommendations: [
      "Start new ventures on growing moon days",
      "Complete tasks during waning moon",
      "Consider the phase of the moon"
    ]
  },
  Karana: {
    title: "Half Lunar Day",
    description: "Timing based on half-lunar day periods",
    effects: [
      "Affects short-term success",
      "Influences quick activities and decisions",
      "Important for immediate results"
    ],
    recommendations: [
      "Good for short-term activities",
      "Consider for quick decisions",
      "Best for immediate actions"
    ]
  },
  Yoga: {
    title: "Sun-Moon Combination",
    description: "Timing based on sun-moon combinations",
    effects: [
      "Influences overall success of activities",
      "Affects both material and spiritual endeavors",
      "Important for major life events"
    ],
    recommendations: [
      "Best for important life decisions",
      "Consider for long-term planning",
      "Good for spiritual practices"
    ]
  }
};

const getGhatakaInterpretation = (type: string) => {
  const defaultInterpretation = {
    title: "General Timing",
    description: "Analysis of auspicious timing",
    effects: ["Influences daily activities", "Affects timing of events"],
    recommendations: ["Consider planetary positions", "Plan according to cosmic timing"]
  };

  if (!type || !(type in ghatakaInterpretations)) {
    console.warn(`Unknown Ghataka type: ${type}`);
    return defaultInterpretation;
  }

  return ghatakaInterpretations[type as keyof typeof ghatakaInterpretations];
};

export function GhatakaChakra() {
  const [results, setResults] = useState<GhatakaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    birthLocation: '',
    birthTime: '',
    birthDate: '',
    birthTimezone: '',
    checkLocation: '',
    checkTime: '',
    checkDate: '',
    checkTimezone: '',
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

  const fetchGhataka = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { 
        birthLocation, birthTime, birthDate, birthTimezone,
        checkLocation, checkTime, checkDate, checkTimezone
      } = formData;
      
      if (!birthLocation || !birthTime || !birthDate || !birthTimezone ||
          !checkLocation || !checkTime || !checkDate || !checkTimezone) {
        const missingFields = [];
        if (!birthLocation) missingFields.push('Birth Location');
        if (!birthTime) missingFields.push('Birth Time');
        if (!birthDate) missingFields.push('Birth Date');
        if (!birthTimezone) missingFields.push('Birth Timezone');
        if (!checkLocation) missingFields.push('Check Location');
        if (!checkTime) missingFields.push('Check Time');
        if (!checkDate) missingFields.push('Check Date');
        if (!checkTimezone) missingFields.push('Check Timezone');
        
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }

      const formattedBirthDate = formatDate(birthDate);
      const formattedCheckDate = formatDate(checkDate);
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/GhatakaChakra/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}/Location/${encodeURIComponent(checkLocation)}/Time/${checkTime}/${formattedCheckDate}/${checkTimezone}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Status !== "Pass") {
        throw new Error(data.Message || 'Failed to get Ghataka information');
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
            Ghataka Chakra Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze auspicious timing based on planetary cycles
        </p>
      </div>

      <form onSubmit={fetchGhataka} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Birth Details */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Birth Location</label>
            <input
              type="text"
              name="birthLocation"
              value={formData.birthLocation}
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
            <label className="block text-sm font-medium text-gray-700">Birth Timezone</label>
            <input
              type="text"
              name="birthTimezone"
              value={formData.birthTimezone}
              onChange={handleInputChange}
              placeholder="e.g. +05:30"
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          {/* Check Time Details */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check Location</label>
            <input
              type="text"
              name="checkLocation"
              value={formData.checkLocation}
              onChange={handleInputChange}
              placeholder="e.g. New Delhi, India"
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check Time</label>
            <input
              type="time"
              name="checkTime"
              value={formData.checkTime}
              onChange={handleInputChange}
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check Date</label>
            <input
              type="date"
              name="checkDate"
              value={formData.checkDate}
              onChange={handleInputChange}
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Check Timezone</label>
            <input
              type="text"
              name="checkTimezone"
              value={formData.checkTimezone}
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
              {loading ? 'Calculating...' : 'Analyze Timing'}
            </span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-sacred-copper">Analyzing auspicious timing...</p>
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
              ⚡
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sacred-copper">
                {getGhatakaInterpretation(results.Payload.GhatakaChakra).title}
              </h3>
              <p className="text-sm text-gray-600">
                {getGhatakaInterpretation(results.Payload.GhatakaChakra).description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Effects Section */}
            <div>
              <h4 className="font-medium text-sacred-copper mb-3">Effects:</h4>
              <ul className="space-y-2">
                {getGhatakaInterpretation(results.Payload.GhatakaChakra).effects.map((effect, index) => (
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
                {getGhatakaInterpretation(results.Payload.GhatakaChakra).recommendations.map((rec, index) => (
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
                <span className="font-medium text-gray-600">Current Timing Type:</span>
                <span className="text-sacred-copper font-semibold">{results.Payload.GhatakaChakra}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 