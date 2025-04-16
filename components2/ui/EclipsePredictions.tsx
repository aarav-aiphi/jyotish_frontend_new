'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface EclipseResponse {
  Status: string;
  Payload: {
    NextLunarEclipse: string;
    NextSolarEclipse: string;
  }
}

// Add eclipse interpretation data
const eclipseInterpretations = {
  lunar: {
    spiritual: [
      'Time for deep introspection and meditation',
      'Release of emotional baggage',
      'Heightened intuition and psychic awareness',
      'Completion of karmic cycles'
    ],
    effects: [
      'Emotional intensity and revelations',
      'Culmination of situations',
      'Spiritual insights and awakening',
      'Changes in relationships and emotions'
    ],
    dos: [
      'Meditate and practice spiritual activities',
      'Journal and reflect on emotions',
      'Take rest and practice self-care',
      'Clear and cleanse your space'
    ],
    donts: [
      'Start new ventures or projects',
      'Make major decisions',
      'Eat heavy meals',
      'Travel if unnecessary'
    ]
  },
  solar: {
    spiritual: [
      'New beginnings and fresh starts',
      'Setting intentions and goals',
      'Spiritual cleansing and renewal',
      'Manifestation of desires'
    ],
    effects: [
      'New opportunities and paths opening',
      'Changes in career and life direction',
      'Physical and material transformations',
      'Power dynamics shifting'
    ],
    dos: [
      'Set new intentions and goals',
      'Practice grounding exercises',
      'Stay indoors during the eclipse',
      'Focus on spiritual practices'
    ],
    donts: [
      'Look directly at the eclipse',
      'Start important ventures',
      'Make major purchases',
      'Sign important documents'
    ]
  }
};

// Add countdown timer interface
interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// Add countdown timer component
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-4 text-sm">
      <div className="text-center">
        <div className="bg-sacred-gold/10 rounded-lg px-3 py-2 font-bold text-sacred-copper">
          {countdown.days}
        </div>
        <div className="text-xs text-gray-600 mt-1">Days</div>
      </div>
      <div className="text-center">
        <div className="bg-sacred-gold/10 rounded-lg px-3 py-2 font-bold text-sacred-copper">
          {countdown.hours}
        </div>
        <div className="text-xs text-gray-600 mt-1">Hours</div>
      </div>
      <div className="text-center">
        <div className="bg-sacred-gold/10 rounded-lg px-3 py-2 font-bold text-sacred-copper">
          {countdown.minutes}
        </div>
        <div className="text-xs text-gray-600 mt-1">Mins</div>
      </div>
      <div className="text-center">
        <div className="bg-sacred-gold/10 rounded-lg px-3 py-2 font-bold text-sacred-copper">
          {countdown.seconds}
        </div>
        <div className="text-xs text-gray-600 mt-1">Secs</div>
      </div>
    </div>
  );
}

// Add detailed interpretations
const detailedInterpretations = {
  lunar: {
    astrological: [
      'Affects emotions and intuitive abilities',
      'Brings hidden matters to light',
      'Influences water elements and fluid systems',
      'Impacts relationships and emotional bonds'
    ],
    vedic: [
      'Time for spiritual practices (sadhana)',
      'Period of heightened consciousness',
      'Opportunity for karmic release',
      'Powerful time for mantras and meditation'
    ],
    health: [
      'Pay attention to emotional well-being',
      'Take extra rest and hydration',
      'Avoid major medical procedures',
      'Practice gentle exercise and yoga'
    ]
  },
  solar: {
    astrological: [
      'Affects ego and self-expression',
      'Brings new beginnings and opportunities',
      'Influences vital force and energy',
      'Impacts career and life direction'
    ],
    vedic: [
      'Time for sun salutations (Surya Namaskar)',
      'Period of spiritual purification',
      'Opportunity for new spiritual practices',
      'Powerful time for solar mantras'
    ],
    health: [
      'Focus on physical vitality',
      'Protect eyes and avoid direct sun exposure',
      'Practice grounding exercises',
      'Maintain light diet during eclipse'
    ]
  }
};

export function EclipsePredictions() {
  const [results, setResults] = useState<EclipseResponse | null>(null);
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

  const fetchEclipses = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      
      if (!location || !time || !date || !timezone) {
        throw new Error('Please fill in all required fields');
      }

      const formattedDate = formatDate(date);
      
      // Fetch both lunar and solar eclipse data
      const [lunarResponse, solarResponse] = await Promise.all([
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/NextLunarEclipse/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/NextSolarEclipse/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`)
      ]);
      
      const [lunarData, solarData] = await Promise.all([
        lunarResponse.json(),
        solarResponse.json()
      ]);

      console.log('Lunar Response:', lunarData);
      console.log('Solar Response:', solarData);

      if (lunarData.Status !== "Pass" || solarData.Status !== "Pass") {
        throw new Error('Failed to get eclipse information');
      }

      // Combine the results
      setResults({
        Status: "Pass",
        Payload: {
          NextLunarEclipse: lunarData.Payload.NextLunarEclipse,
          NextSolarEclipse: solarData.Payload.NextSolarEclipse
        }
      });
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
          <h2 className="text-3xl font-bold text-sacred-copper">Eclipse Predictions</h2>
          <p className="text-gray-600 mt-2">
            Discover the timing of upcoming lunar eclipses and their significance
          </p>
        </div>

        <form onSubmit={fetchEclipses} className="space-y-6">
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
                       transition-all duration-300 z-10 relative"
            >
              {loading ? 'Calculating...' : 'Find Next Eclipse'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">🌘</div>
            <p className="text-sacred-copper">Calculating next eclipse...</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lunar Eclipse Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-sacred-copper mb-4">
                    Next Lunar Eclipse
                  </h3>
                  <div className="inline-block p-6 bg-gradient-to-r from-sacred-gold/5 to-sacred-copper/5 
                                rounded-full mb-6 shadow-inner">
                    <span className="text-6xl">🌘</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    {new Date(results.Payload.NextLunarEclipse).toLocaleString()}
                  </p>
                  <CountdownTimer targetDate={results.Payload.NextLunarEclipse} />
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-sacred-copper font-medium mb-2">Astrological Significance</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {detailedInterpretations.lunar.astrological.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sacred-gold">✧</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sacred-copper font-medium mb-2">Vedic Perspective</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {detailedInterpretations.lunar.vedic.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sacred-gold">🕉</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sacred-copper font-medium mb-2">Health Considerations</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {detailedInterpretations.lunar.health.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sacred-gold">⚕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Solar Eclipse Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/90 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-sacred-copper mb-4">
                    Next Solar Eclipse
                  </h3>
                  <div className="inline-block p-6 bg-gradient-to-r from-sacred-gold/5 to-sacred-copper/5 
                                rounded-full mb-6 shadow-inner">
                    <span className="text-6xl">🌞</span>
                  </div>
                  <p className="text-xl font-semibold text-gray-800 mb-4">
                    {new Date(results.Payload.NextSolarEclipse).toLocaleString()}
                  </p>
                  <CountdownTimer targetDate={results.Payload.NextSolarEclipse} />
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-sacred-copper font-medium mb-2">Astrological Significance</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {detailedInterpretations.solar.astrological.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sacred-gold">✧</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sacred-copper font-medium mb-2">Vedic Perspective</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {detailedInterpretations.solar.vedic.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sacred-gold">🕉</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sacred-copper font-medium mb-2">Health Considerations</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {detailedInterpretations.solar.health.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-sacred-gold">⚕</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* General Eclipse Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-sacred-gold/5 rounded-xl p-6"
            >
              <h4 className="text-lg font-semibold text-sacred-copper mb-4 text-center">
                Eclipse Guidelines
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-sacred-copper mb-2">Recommended Practices</h5>
                  <ul className="space-y-2">
                    {eclipseInterpretations.lunar.dos.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sacred-copper mb-2">What to Avoid</h5>
                  <ul className="space-y-2">
                    {eclipseInterpretations.lunar.donts.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500">×</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 