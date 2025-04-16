'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PlanetBalaResponse {
  Status: string;
  Payload: {
    PlanetShadbalaPinda: Array<{[key: string]: string}>;
    PlanetDrikBala: Array<{[key: string]: string}>;
    PlanetSthanaBala: Array<{[key: string]: string}>;
  }
}

const planetInfo = {
  Sun: { 
    icon: "☉", 
    color: "text-amber-500", 
    bgColor: "bg-amber-100",
    minStrength: 390,
    maxStrength: 600
  },
  Moon: { 
    icon: "☽", 
    color: "text-slate-500", 
    bgColor: "bg-slate-100",
    minStrength: 360,
    maxStrength: 550
  },
  Mars: { 
    icon: "♂", 
    color: "text-red-500", 
    bgColor: "bg-red-100",
    minStrength: 300,
    maxStrength: 500
  },
  Mercury: { 
    icon: "☿", 
    color: "text-green-500", 
    bgColor: "bg-green-100",
    minStrength: 320,
    maxStrength: 520
  },
  Jupiter: { 
    icon: "♃", 
    color: "text-yellow-500", 
    bgColor: "bg-yellow-100",
    minStrength: 380,
    maxStrength: 580
  },
  Venus: { 
    icon: "♀", 
    color: "text-pink-500", 
    bgColor: "bg-pink-100",
    minStrength: 330,
    maxStrength: 540
  },
  Saturn: { 
    icon: "♄", 
    color: "text-blue-500", 
    bgColor: "bg-blue-100",
    minStrength: 290,
    maxStrength: 480
  }
};

export function ShadbalaAnalysis() {
  const [results, setResults] = useState<PlanetBalaResponse | null>(null);
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

  const getStrengthCategory = (planet: string, strength: number) => {
    const info = planetInfo[planet as keyof typeof planetInfo];
    if (!info) return 'Unknown';
    
    if (strength >= info.maxStrength) return 'Excellent';
    if (strength >= info.minStrength) return 'Good';
    if (strength >= info.minStrength * 0.75) return 'Moderate';
    return 'Weak';
  };

  const fetchShadbalaData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      const formattedDate = formatDate(date);
      
      const urls = [
        `https://vedastro.azurewebsites.net/api/Calculate/PlanetShadbalaPinda/PlanetName/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`,
        `https://vedastro.azurewebsites.net/api/Calculate/PlanetDrikBala/PlanetName/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`,
        `https://vedastro.azurewebsites.net/api/Calculate/PlanetSthanaBala/PlanetName/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`
      ];
      
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const data = await Promise.all(responses.map(res => res.json()));
      
      setResults({
        Status: "Pass",
        Payload: {
          PlanetShadbalaPinda: data[0].Payload.PlanetShadbalaPinda,
          PlanetDrikBala: data[1].Payload.PlanetDrikBala,
          PlanetSthanaBala: data[2].Payload.PlanetSthanaBala
        }
      });

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
            Shadbala Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze the six-fold strength of planets in your horoscope
        </p>
      </div>

      <form onSubmit={fetchShadbalaData} className="space-y-6 relative">
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
            {loading ? 'Analyzing...' : 'Analyze Shadbala'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">⚡</div>
          <p className="text-sacred-copper">Calculating Shadbala strengths...</p>
        </div>
      )}

      {results?.Status === "Pass" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.Payload.PlanetShadbalaPinda.map((planetData, index) => {
              const planet = Object.keys(planetData)[0];
              const shadbalaPinda = parseFloat(planetData[planet]);
              const drikBala = parseFloat(results.Payload.PlanetDrikBala[index][planet]);
              const sthanaBala = parseFloat(results.Payload.PlanetSthanaBala[index][planet]);
              
              if (!planetInfo[planet as keyof typeof planetInfo]) return null;

              return (
                <div key={planet} className={`${planetInfo[planet as keyof typeof planetInfo].bgColor} rounded-xl p-4 shadow-lg`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-2xl ${planetInfo[planet as keyof typeof planetInfo].color}`}>
                      {planetInfo[planet as keyof typeof planetInfo].icon}
                    </span>
                    <h3 className="font-semibold text-gray-700">{planet}</h3>
                    <span className={`ml-auto px-2 py-1 rounded-full text-xs font-medium
                      ${getStrengthCategory(planet, shadbalaPinda) === 'Excellent' ? 'bg-green-100 text-green-800' :
                        getStrengthCategory(planet, shadbalaPinda) === 'Good' ? 'bg-blue-100 text-blue-800' :
                        getStrengthCategory(planet, shadbalaPinda) === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {getStrengthCategory(planet, shadbalaPinda)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Total Strength:</span>
                        <span className="font-medium text-sacred-copper">{shadbalaPinda.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-sacred-copper rounded-full h-2"
                          style={{ width: `${(shadbalaPinda / 600) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Drik Bala:</span>
                        <span className="float-right font-medium text-sacred-copper">{drikBala.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Sthana Bala:</span>
                        <span className="float-right font-medium text-sacred-copper">{sthanaBala.toFixed(2)}</span>
                      </div>
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