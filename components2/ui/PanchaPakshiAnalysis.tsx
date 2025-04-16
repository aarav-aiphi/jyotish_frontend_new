'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PanchaPakshiResponse {
  Status: string;
  Payload: {
    BirthBird: string;
  }
}

const birdInterpretations = {
  Vulture: {
    nature: "Air element, Saturn ruled",
    qualities: ["Strategic thinking", "Patient", "Observant", "Resourceful"],
    strengths: ["Long-term planning", "Analytical skills", "Endurance"],
    career: ["Research", "Analysis", "Investigation", "Planning"],
    timing: "Best during dusk and dawn",
    direction: "South",
  },
  Owl: {
    nature: "Night element, Moon ruled",
    qualities: ["Intuitive", "Wise", "Mysterious", "Perceptive"],
    strengths: ["Night work", "Intuition", "Hidden knowledge"],
    career: ["Night shifts", "Counseling", "Research", "Spiritual work"],
    timing: "Best during night hours",
    direction: "North-West",
  },
  Crow: {
    nature: "Air element, Mercury ruled",
    qualities: ["Adaptable", "Intelligent", "Social", "Communicative"],
    strengths: ["Communication", "Adaptability", "Quick learning"],
    career: ["Communication", "Travel", "Teaching", "Writing"],
    timing: "Best during morning hours",
    direction: "West",
  },
  Cock: {
    nature: "Fire element, Mars ruled",
    qualities: ["Energetic", "Bold", "Leadership", "Protective"],
    strengths: ["Initiative", "Leadership", "Morning activity"],
    career: ["Management", "Sports", "Military", "Leadership roles"],
    timing: "Best during sunrise",
    direction: "East",
  },
  Peacock: {
    nature: "Water element, Venus ruled",
    qualities: ["Creative", "Beautiful", "Artistic", "Graceful"],
    strengths: ["Creativity", "Beauty", "Performance", "Art"],
    career: ["Arts", "Entertainment", "Design", "Fashion"],
    timing: "Best during afternoon",
    direction: "South-East",
  }
};

export function PanchaPakshiAnalysis() {
  const [birthResults, setBirthResults] = useState<PanchaPakshiResponse | null>(null);
  const [nameResults, setNameResults] = useState<PanchaPakshiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    location: '',
    time: '',
    date: '',
    timezone: '',
    name: ''
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

  const fetchPanchaPakshi = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone, name } = formData;
      
      const formattedDate = formatDate(date);
      
      // Fetch birth-based bird
      const birthUrl = `https://vedastro.azurewebsites.net/api/Calculate/PanchaPakshiBirthBird/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      // Fetch name-based bird
      const nameUrl = `https://vedastro.azurewebsites.net/api/Calculate/PanchaPakshiBirthBirdFromName/Name/${encodeURIComponent(name)}`;
      
      const [birthResponse, nameResponse] = await Promise.all([
        fetch(birthUrl),
        fetch(nameUrl)
      ]);

      const birthData = await birthResponse.json();
      const nameData = await nameResponse.json();

      if (birthData.Status === "Pass") setBirthResults(birthData);
      if (nameData.Status === "Pass") setNameResults(nameData);

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
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
        <Image
          src="/birds-pattern.png"
          alt="Birds Pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="mb-12 text-center relative">
        <h2 className="text-4xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Pancha Pakshi Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Ancient bird astrology system that reveals your nature and timing through birth details and name
        </p>
      </div>

      <form onSubmit={fetchPanchaPakshi} className="space-y-6 relative">
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

          <div className="md:col-span-2 space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
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
            {loading ? 'Analyzing...' : 'Analyze Birth Bird'}
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🦅</div>
          <p className="text-sacred-copper">Analyzing your birth bird...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {(birthResults?.Status === "Pass" || nameResults?.Status === "Pass") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {birthResults?.Status === "Pass" && (
              <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-sacred-copper mb-4">Birth Bird</h3>
                <div className="space-y-4">
                  {birthResults.Payload.BirthBird && (
                    <>
                      <p className="text-lg font-medium">{birthResults.Payload.BirthBird}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{birdInterpretations[birthResults.Payload.BirthBird as keyof typeof birdInterpretations]?.nature}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sacred-copper">Qualities</h4>
                            <ul className="mt-1 space-y-1">
                              {birdInterpretations[birthResults.Payload.BirthBird as keyof typeof birdInterpretations]?.qualities.map((quality, index) => (
                                <li key={index} className="text-sm text-gray-600">• {quality}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sacred-copper">Career</h4>
                            <ul className="mt-1 space-y-1">
                              {birdInterpretations[birthResults.Payload.BirthBird as keyof typeof birdInterpretations]?.career.map((career, index) => (
                                <li key={index} className="text-sm text-gray-600">• {career}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {nameResults?.Status === "Pass" && (
              <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-sacred-copper mb-4">Name Bird</h3>
                <div className="space-y-4">
                  {nameResults.Payload.BirthBird && (
                    <>
                      <p className="text-lg font-medium">{nameResults.Payload.BirthBird}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{birdInterpretations[nameResults.Payload.BirthBird as keyof typeof birdInterpretations]?.nature}</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sacred-copper">Timing</h4>
                            <p className="text-sm text-gray-600 mt-1">{birdInterpretations[nameResults.Payload.BirthBird as keyof typeof birdInterpretations]?.timing}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-sacred-copper">Direction</h4>
                            <p className="text-sm text-gray-600 mt-1">{birdInterpretations[nameResults.Payload.BirthBird as keyof typeof birdInterpretations]?.direction}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
} 