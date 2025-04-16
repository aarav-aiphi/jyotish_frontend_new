'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface PlanetStrength {
  [key: string]: string;
}

interface ResidentialResponse {
  Status: string;
  Payload: {
    ResidentialStrength: PlanetStrength[];
  }
}

// Define a type for planet names to ensure type safety
type PlanetName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';

// Define the planetInfo object with the correct type
const planetInfo: Record<PlanetName, { icon: string; color: string }> = {
  Sun: { icon: "☉", color: "text-amber-500" },
  Moon: { icon: "☽", color: "text-slate-300" },
  Mars: { icon: "♂", color: "text-red-500" },
  Mercury: { icon: "☿", color: "text-green-500" },
  Jupiter: { icon: "♃", color: "text-yellow-500" },
  Venus: { icon: "♀", color: "text-pink-500" },
  Saturn: { icon: "♄", color: "text-blue-500" },
  Rahu: { icon: "☊", color: "text-purple-500" },
  Ketu: { icon: "☋", color: "text-indigo-500" }
};

export function ResidentialStrength() {
  const [results, setResults] = useState<ResidentialResponse | null>(null);
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

  const fetchStrength = async (e: React.FormEvent) => {
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
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/ResidentialStrength/PlanetName/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.Status !== "Pass") {
        throw new Error(data.Message || 'Failed to get residential strength');
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

  const getStrengthLevel = (value: string) => {
    const numValue = parseInt(value);
    if (numValue >= 7) return { text: "Very Strong", color: "text-green-600" };
    if (numValue >= 5) return { text: "Strong", color: "text-green-500" };
    if (numValue >= 3) return { text: "Moderate", color: "text-yellow-500" };
    if (numValue >= 1) return { text: "Weak", color: "text-orange-500" };
    return { text: "Very Weak", color: "text-red-500" };
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <div className="mb-12 text-center relative">
        <h2 className="text-3xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Planetary Residential Strength
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze the strength of planets in their current positions
        </p>
      </div>

      <form onSubmit={fetchStrength} className="space-y-6">
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
              {loading ? 'Calculating...' : 'Analyze Strength'}
            </span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-sacred-copper">Analyzing planetary strengths...</p>
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
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.Payload.ResidentialStrength.map((planetObj, index) => {
              const planetName = Object.keys(planetObj)[0];
              const strength = planetObj[planetName];
              
              // Check if planetName is a valid key in planetInfo
              const isPlanetNameValid = planetName in planetInfo;
              const planetData = isPlanetNameValid 
                ? planetInfo[planetName as PlanetName] 
                : { icon: '★', color: 'text-gray-500' };
              
              return (
                <div key={index} className="bg-white/90 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl ${planetData.color}`}>
                      {planetData.icon}
                    </span>
                    <h3 className="font-semibold text-gray-700">{planetName}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Strength:</span>
                      <span className="text-sacred-copper">{strength}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
} 