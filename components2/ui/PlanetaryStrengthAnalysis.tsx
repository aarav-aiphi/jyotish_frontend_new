'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PlanetStrengthResponse {
  Status: string;
  Payload: {
    AllPlanetStrength: string;
  }
}

interface PowerPercentageResponse {
  Status: string;
  Payload: {
    PlanetPowerPercentage: string;
  }
}

const planetInfo = {
  Sun: { icon: "☉", color: "text-amber-500", bgColor: "bg-amber-100" },
  Moon: { icon: "☽", color: "text-slate-500", bgColor: "bg-slate-100" },
  Mars: { icon: "♂", color: "text-red-500", bgColor: "bg-red-100" },
  Mercury: { icon: "☿", color: "text-green-500", bgColor: "bg-green-100" },
  Jupiter: { icon: "♃", color: "text-yellow-500", bgColor: "bg-yellow-100" },
  Venus: { icon: "♀", color: "text-pink-500", bgColor: "bg-pink-100" },
  Saturn: { icon: "♄", color: "text-blue-500", bgColor: "bg-blue-100" },
  Rahu: { icon: "☊", color: "text-purple-500", bgColor: "bg-purple-100" },
  Ketu: { icon: "☋", color: "text-indigo-500", bgColor: "bg-indigo-100" }
};

export function PlanetaryStrengthAnalysis() {
  const [strengthResults, setStrengthResults] = useState<PlanetStrengthResponse | null>(null);
  const [powerResults, setPowerResults] = useState<PowerPercentageResponse | null>(null);
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

  const parsePlanetStrengths = (strengthStr: string) => {
    return strengthStr
      .replace(/[()]/g, '')
      .split('), (')
      .map(pair => {
        const [strength, planet] = pair.split(', ');
        return { planet, strength: parseFloat(strength) };
      })
      .sort((a, b) => b.strength - a.strength);
  };

  const fetchStrengthData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      const formattedDate = formatDate(date);
      
      // Fetch planet strength
      const strengthUrl = `https://vedastro.azurewebsites.net/api/Calculate/AllPlanetStrength/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      // Fetch power percentage
      const powerUrl = `https://vedastro.azurewebsites.net/api/Calculate/PlanetPowerPercentage/InputPlanet/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const [strengthResponse, powerResponse] = await Promise.all([
        fetch(strengthUrl),
        fetch(powerUrl)
      ]);

      const strengthData = await strengthResponse.json();
      const powerData = await powerResponse.json();

      if (strengthData.Status === "Pass") setStrengthResults(strengthData);
      if (powerData.Status === "Pass") setPowerResults(powerData);

    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <div className="mb-12 text-center relative">
        <h2 className="text-4xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Planetary Strength Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze the strength and power of all planets in your horoscope
        </p>
      </div>

      <form onSubmit={fetchStrengthData} className="space-y-6 relative">
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
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          >
            {loading ? 'Analyzing...' : 'Analyze Planetary Strength'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
          <p className="text-sacred-copper">Calculating planetary strengths...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {strengthResults?.Status === "Pass" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-6"
        >
          {/* Overall Power */}
          {powerResults?.Status === "Pass" && (
            <div className="bg-white/90 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-sacred-copper mb-4">Overall Planetary Power</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Combined Strength:</span>
                <span className="text-2xl font-bold text-sacred-copper">
                  {Math.abs(parseFloat(powerResults.Payload.PlanetPowerPercentage)).toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {/* Individual Planet Strengths */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {parsePlanetStrengths(strengthResults.Payload.AllPlanetStrength).map(({ planet, strength }, index) => (
              <div key={index} className={`${planetInfo[planet as keyof typeof planetInfo].bgColor} rounded-xl p-4 shadow-lg`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-2xl ${planetInfo[planet as keyof typeof planetInfo].color}`}>
                    {planetInfo[planet as keyof typeof planetInfo].icon}
                  </span>
                  <h3 className="font-semibold text-gray-700">{planet}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Strength:</span>
                    <span className="font-medium text-sacred-copper">{strength.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-sacred-copper rounded-full h-2"
                      style={{ width: `${(strength / 700) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
} 