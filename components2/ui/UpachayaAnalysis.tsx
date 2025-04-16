'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface UpachayaResponse {
  Status: string;
  Payload: {
    IsPlanetInUpachaya: "True" | "False";
  }
}

const planetInfo = {
  Sun: { icon: "☉", color: "text-amber-500", name: "Sun" },
  Moon: { icon: "☽", color: "text-slate-300", name: "Moon" },
  Mars: { icon: "♂", color: "text-red-500", name: "Mars" },
  Mercury: { icon: "☿", color: "text-green-500", name: "Mercury" },
  Jupiter: { icon: "♃", color: "text-yellow-500", name: "Jupiter" },
  Venus: { icon: "♀", color: "text-pink-500", name: "Venus" },
  Saturn: { icon: "♄", color: "text-blue-500", name: "Saturn" },
  Rahu: { icon: "☊", color: "text-purple-500", name: "Rahu" },
  Ketu: { icon: "☋", color: "text-indigo-500", name: "Ketu" }
} as const;

type PlanetName = keyof typeof planetInfo;

const upachayaInterpretations = {
  True: {
    title: "Planet in Upachaya House",
    description: "Favorable position indicating growth and improvement",
    effects: [
      "Progressive improvement over time",
      "Beneficial for long-term growth",
      "Indicates positive transformation",
      "Supports personal development"
    ],
    recommendations: [
      "Focus on long-term goals",
      "Take advantage of growth opportunities",
      "Plan for future expansion",
      "Invest in personal development"
    ]
  },
  False: {
    title: "Planet not in Upachaya House",
    description: "Regular planetary position without special growth indication",
    effects: [
      "Normal planetary influences",
      "Standard karmic effects",
      "Regular planetary period",
      "Traditional planetary results"
    ],
    recommendations: [
      "Follow regular planetary remedies",
      "Maintain standard practices",
      "Focus on basic planetary significations",
      "Consider traditional approaches"
    ]
  }
};

const getUpachayaInterpretation = (isInUpachaya: "True" | "False") => {
  const defaultInterpretation = {
    title: "Position Analysis",
    description: "Analyzing planetary position",
    effects: [],
    recommendations: []
  };

  if (!isInUpachaya || !(isInUpachaya in upachayaInterpretations)) {
    console.warn(`Unknown Upachaya status: ${isInUpachaya}`);
    return defaultInterpretation;
  }

  return upachayaInterpretations[isInUpachaya];
};

export function UpachayaAnalysis() {
  const [results, setResults] = useState<Record<PlanetName, UpachayaResponse | null>>({
    Sun: null,
    Moon: null,
    Mars: null,
    Mercury: null,
    Jupiter: null,
    Venus: null,
    Saturn: null,
    Rahu: null,
    Ketu: null
  });
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

  const fetchUpachaya = async (e: React.FormEvent) => {
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
      
      // Fetch data for all planets in parallel
      const planetPromises = Object.keys(planetInfo).map(planet => 
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/IsPlanetInUpachaya/Planet/${planet}/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`)
          .then(res => res.json())
          .then(data => ({ planet, data }))
      );

      const planetResults = await Promise.all(planetPromises);
      
      const newResults = planetResults.reduce((acc, { planet, data }) => {
        acc[planet as PlanetName] = data;
        return acc;
      }, {} as Record<PlanetName, UpachayaResponse>);

      setResults(newResults);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
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
            Upachaya House Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze planets in growth-indicating houses
        </p>
      </div>

      <form onSubmit={fetchUpachaya} className="space-y-6">
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
              {loading ? 'Analyzing...' : 'Check Upachaya Positions'}
            </span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-sacred-copper">Analyzing planetary positions...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {Object.values(results).some(r => r !== null) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(results) as PlanetName[]).map((planet) => {
              const result = results[planet];
              if (!result) return null;

              const isInUpachaya = result.Payload.IsPlanetInUpachaya;
              const interpretation = getUpachayaInterpretation(isInUpachaya);

              return (
                <div key={planet} className="bg-white/90 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl ${planetInfo[planet].color}`}>
                      {planetInfo[planet].icon}
                    </span>
                    <h3 className="font-semibold text-gray-700">{planetInfo[planet].name}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${isInUpachaya === "True" ? 'text-green-500' : 'text-gray-500'}`}>
                        {isInUpachaya === "True" ? 'In Upachaya' : 'Not in Upachaya'}
                      </span>
                    </div>
                    {interpretation && (
                      <p className="text-sm text-gray-600 mt-2">
                        {interpretation.description}
                      </p>
                    )}
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