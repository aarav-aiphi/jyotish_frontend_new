'use client'

// Using:
// - /api/Calculate/TransitHouseFromLagna
// - /api/Calculate/TransitHouseFromMoon
// - /api/Calculate/PlanetSignTransit
// - /api/Calculate/GocharaKakshas
// - /api/Calculate/GocharaZodiacSignCountFromMoon

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TransitResponse {
  Status: string;
  Payload: {
    TransitHouseFromLagna: {
      House: string;  // The actual house number/name
      Description: string;  // House description
    };
    TransitHouseFromMoon: {
      House: string;
      Description: string;
    };
    PlanetSignTransit: {
      Planet: string;
      Sign: string;
      Effect: string;
    };
    GocharaKakshas: {
      Position: string;
      Strength: number;
    };
    GocharaZodiacSignCountFromMoon: {
      Count: number;
      Sign: string;
    };
    IsPlanetInGoodAspectToPlanet: string;
    IsPlanetInGoodAspectToHouse: string;
    PlanetPowerPercentage: string;
  }
}

export function TransitAnalysis() {
  const [results, setResults] = useState<TransitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    birthLocation: '',
    birthTime: '',
    birthDate: '',
    birthTimezone: '',
    transitLocation: '',
    transitTime: '',
    transitDate: '',
    transitTimezone: '',
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

  const fetchTransits = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { 
        birthLocation, birthTime, birthDate, birthTimezone,
        transitLocation, transitTime, transitDate, transitTimezone
      } = formData;

      // Add console logs to check form data
      console.log('Form Data:', {
        birthLocation, birthTime, birthDate, birthTimezone,
        transitLocation, transitTime, transitDate, transitTimezone
      });
      
      if (!birthLocation || !birthTime || !birthDate || !birthTimezone ||
          !transitLocation || !transitTime || !transitDate || !transitTimezone) {
        const missingFields = [];
        if (!birthLocation) missingFields.push('Birth Location');
        if (!birthTime) missingFields.push('Birth Time');
        if (!birthDate) missingFields.push('Birth Date');
        if (!birthTimezone) missingFields.push('Birth Timezone');
        if (!transitLocation) missingFields.push('Transit Location');
        if (!transitTime) missingFields.push('Transit Time');
        if (!transitDate) missingFields.push('Transit Date');
        if (!transitTimezone) missingFields.push('Transit Timezone');
        
        throw new Error(`Please fill in: ${missingFields.join(', ')}`);
      }

      const formattedBirthDate = formatDate(birthDate);
      const formattedTransitDate = formatDate(transitDate);
      
      // Make all API calls in parallel
      const responses = await Promise.all([
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/TransitHouseFromLagna/TransitPlanet/All/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}/Location/${encodeURIComponent(transitLocation)}/Time/${transitTime}/${formattedTransitDate}/${transitTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/TransitHouseFromMoon/TransitPlanet/All/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}/Location/${encodeURIComponent(transitLocation)}/Time/${transitTime}/${formattedTransitDate}/${transitTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/PlanetSignTransit/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}/Location/${encodeURIComponent(transitLocation)}/Time/${transitTime}/${formattedTransitDate}/${transitTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/GocharaKakshas/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}/Location/${encodeURIComponent(transitLocation)}/Time/${transitTime}/${formattedTransitDate}/${transitTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/GocharaZodiacSignCountFromMoon/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}/Location/${encodeURIComponent(transitLocation)}/Time/${transitTime}/${formattedTransitDate}/${transitTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/IsPlanetInGoodAspectToPlanet/ReceivingAspect/All/TransmitingAspect/All/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/IsPlanetInGoodAspectToHouse/ReceivingAspect/All/TransmitingAspect/All/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/PlanetPowerPercentage/Planet/All/Location/${encodeURIComponent(birthLocation)}/Time/${birthTime}/${formattedBirthDate}/${birthTimezone}`)
      ]);

      const [
        lagnaData, 
        moonData, 
        signData, 
        kakshasData, 
        zodiacData,
        aspectPlanetData,
        aspectHouseData,
        powerData
      ] = await Promise.all(responses.map(res => res.json()));

      if (!responses.every(res => res.ok)) {
        throw new Error('One or more transit calculations failed');
      }

      setResults({
        Status: "Pass",
        Payload: {
          TransitHouseFromLagna: lagnaData.Payload,
          TransitHouseFromMoon: moonData.Payload,
          PlanetSignTransit: signData.Payload,
          GocharaKakshas: kakshasData.Payload,
          GocharaZodiacSignCountFromMoon: zodiacData.Payload,
          IsPlanetInGoodAspectToPlanet: aspectPlanetData.Payload.IsPlanetInGoodAspectToPlanet,
          IsPlanetInGoodAspectToHouse: aspectHouseData.Payload.IsPlanetInGoodAspectToHouse,
          PlanetPowerPercentage: powerData.Payload.PlanetPowerPercentage
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

  // Add interpretation data
  const transitInterpretations = {
    houses: {
      House1: "Influences personal appearance, health, and new beginnings",
      House2: "Affects finances, possessions, and personal values",
      House3: "Impacts communication, siblings, and short journeys",
      House4: "Influences home, family, and emotional foundation",
      House5: "Affects creativity, romance, and children",
      House6: "Impacts health, daily work, and service",
      House7: "Influences partnerships, marriage, and open enemies",
      House8: "Affects transformations, joint resources, and occult matters",
      House9: "Impacts higher learning, long journeys, and philosophy",
      House10: "Influences career, status, and public image",
      House11: "Affects friendships, groups, and aspirations",
      House12: "Influences spirituality, isolation, and hidden matters"
    },
    gochara: {
      favorable: "Indicates auspicious period for growth and success",
      neutral: "Regular period with balanced outcomes",
      challenging: "Period requiring caution and careful planning"
    }
  };

  // Add detailed interpretation data
  const aspectInterpretations = {
    planetToPlanet: {
      favorable: {
        title: "Harmonious Planetary Aspects",
        effects: [
          "Enhanced mutual planetary energies",
          "Favorable period for related activities",
          "Good time for new initiatives",
          "Spiritual and material growth"
        ],
        timing: "Best to initiate actions during this period"
      },
      unfavorable: {
        title: "Challenging Planetary Aspects",
        effects: [
          "Conflicting planetary energies",
          "Need for careful planning",
          "Potential for obstacles",
          "Period of learning and growth"
        ],
        timing: "Wait for better planetary alignments if possible"
      }
    },
    planetToHouse: {
      favorable: {
        title: "Beneficial House Aspects",
        effects: [
          "Houses receive positive planetary influence",
          "Areas of life show improvement",
          "Good period for house-related matters",
          "Natural flow of energy"
        ],
        remedies: [
          "Meditate during favorable hours",
          "Perform house-related activities",
          "Start new ventures in these areas"
        ]
      },
      unfavorable: {
        title: "Challenging House Aspects",
        effects: [
          "Houses under stress",
          "Need for extra attention",
          "Potential for delays",
          "Learning opportunities"
        ],
        remedies: [
          "Perform protective mantras",
          "Avoid major decisions in these areas",
          "Focus on spiritual practices"
        ]
      }
    },
    powerLevels: {
      high: {
        range: [75, 100],
        interpretation: "Excellent period for all activities",
        timing: "Highly favorable time for important actions",
        remedies: ["Capitalize on positive energy", "Start new ventures"]
      },
      medium: {
        range: [50, 74],
        interpretation: "Generally favorable period",
        timing: "Good for planned activities",
        remedies: ["Maintain regular practices", "Proceed with caution"]
      },
      low: {
        range: [0, 49],
        interpretation: "Period for introspection",
        timing: "Focus on preparation rather than action",
        remedies: ["Increase spiritual practices", "Avoid major decisions"]
      }
    }
  };

  // Add helper function for transit strength calculation
  const calculateTransitStrength = (gocharaKakshas: string): number => {
    // Add your logic to calculate strength percentage based on Gochara Kakshas
    // This is a placeholder implementation
    return 75;
  };

  // Add a helper function to handle power percentage
  const formatPowerPercentage = (power: string): number => {
    const value = parseFloat(power);
    // Convert negative to positive and ensure value is between 0-100
    return Math.min(Math.max(Math.abs(value), 0), 100);
  };

  // Add helper functions
  const getPowerLevelInterpretation = (power: number): string => {
    if (power >= 75) return aspectInterpretations.powerLevels.high.interpretation;
    if (power >= 50) return aspectInterpretations.powerLevels.medium.interpretation;
    return aspectInterpretations.powerLevels.low.interpretation;
  };

  const getPowerLevelTiming = (power: number): string => {
    if (power >= 75) return aspectInterpretations.powerLevels.high.timing;
    if (power >= 50) return aspectInterpretations.powerLevels.medium.timing;
    return aspectInterpretations.powerLevels.low.timing;
  };

  const getPowerLevelRemedies = (power: number): string[] => {
    if (power >= 75) return aspectInterpretations.powerLevels.high.remedies;
    if (power >= 50) return aspectInterpretations.powerLevels.medium.remedies;
    return aspectInterpretations.powerLevels.low.remedies;
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <div className="mb-12 text-center relative">
        <h2 className="text-3xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Transit Analysis
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Analyze planetary transits and their influences
        </p>
      </div>

      <form onSubmit={fetchTransits} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Birth Details */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Birth Place</label>
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

          {/* Transit Details */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Transit Location</label>
            <input
              type="text"
              name="transitLocation"
              value={formData.transitLocation}
              onChange={handleInputChange}
              placeholder="e.g. New Delhi, India"
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Transit Time</label>
            <input
              type="time"
              name="transitTime"
              value={formData.transitTime}
              onChange={handleInputChange}
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Transit Date</label>
            <input
              type="date"
              name="transitDate"
              value={formData.transitDate}
              onChange={handleInputChange}
              className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                       focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                       transition-all duration-300"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Transit Timezone</label>
            <input
              type="text"
              name="transitTimezone"
              value={formData.transitTimezone}
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
              {loading ? 'Calculating...' : 'Analyze Transits'}
            </span>
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin text-4xl mb-4">🌟</div>
          <p className="text-sacred-copper">Analyzing planetary transits...</p>
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
          {/* Transit from Lagna Section */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center text-3xl text-sacred-copper">
                ⬆️
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sacred-copper">
                  Transit from Lagna
                </h3>
                <p className="text-sm text-gray-600">
                  Current planetary positions relative to birth ascendant
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-700">House Position:</p>
                  <p className="text-sacred-copper text-lg">
                    {results.Payload.TransitHouseFromLagna.House}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Interpretation:</p>
                  <p className="text-gray-600">
                    {results.Payload.TransitHouseFromLagna.Description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transit from Moon Section */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center text-3xl text-sacred-copper">
                🌙
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sacred-copper">
                  Transit from Moon
                </h3>
                <p className="text-sm text-gray-600">
                  Current planetary positions relative to birth Moon
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-700">House Position:</p>
                  <p className="text-sacred-copper text-lg">
                    {results.Payload.TransitHouseFromMoon.House}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Interpretation:</p>
                  <p className="text-gray-600">
                    {results.Payload.TransitHouseFromMoon.Description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gochara Section */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center text-3xl text-sacred-copper">
                ⭐
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sacred-copper">
                  Gochara Analysis
                </h3>
                <p className="text-sm text-gray-600">
                  Planetary movements and their effects
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-700">Kakshas:</p>
                  <p className="text-sacred-copper">
                    {results.Payload.GocharaKakshas.Position}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Zodiac Sign Count from Moon:</p>
                  <p className="text-sacred-copper">
                    {results.Payload.GocharaZodiacSignCountFromMoon.Count} - {results.Payload.GocharaZodiacSignCountFromMoon.Sign}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-700">Planet Sign Transit:</p>
                <p className="text-sacred-copper">
                  {results.Payload.PlanetSignTransit.Planet} in {results.Payload.PlanetSignTransit.Sign}
                </p>
                <p className="text-gray-600 mt-1">
                  {results.Payload.PlanetSignTransit.Effect}
                </p>
              </div>
            </div>
          </div>

          {/* Planetary Aspects Section */}
          <div className="bg-white/90 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center text-3xl text-sacred-copper">
                ✨
              </div>
              <div>
                <h3 className="text-xl font-semibold text-sacred-copper">
                  Planetary Aspects
                </h3>
                <p className="text-sm text-gray-600">
                  Analysis of planetary relationships and influences
                </p>
              </div>
            </div>
            <div className="space-y-6">
              {/* Planet to Planet Aspects */}
              <div className="border-b border-sacred-gold/10 pb-6">
                <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                  {results.Payload.IsPlanetInGoodAspectToPlanet === "True" 
                    ? aspectInterpretations.planetToPlanet.favorable.title
                    : aspectInterpretations.planetToPlanet.unfavorable.title}
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-700">Effects:</p>
                    <ul className="mt-2 space-y-2">
                      {(results.Payload.IsPlanetInGoodAspectToPlanet === "True" 
                        ? aspectInterpretations.planetToPlanet.favorable.effects
                        : aspectInterpretations.planetToPlanet.unfavorable.effects
                      ).map((effect, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sacred-gold">•</span>
                          <span className="text-gray-600">{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Timing:</p>
                    <p className="text-gray-600 mt-1">
                      {results.Payload.IsPlanetInGoodAspectToPlanet === "True"
                        ? aspectInterpretations.planetToPlanet.favorable.timing
                        : aspectInterpretations.planetToPlanet.unfavorable.timing}
                    </p>
                  </div>
                </div>
              </div>

              {/* Planet to House Aspects */}
              <div className="border-b border-sacred-gold/10 pb-6">
                <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                  {results.Payload.IsPlanetInGoodAspectToHouse === "True"
                    ? aspectInterpretations.planetToHouse.favorable.title
                    : aspectInterpretations.planetToHouse.unfavorable.title}
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-700">Effects:</p>
                    <ul className="mt-2 space-y-2">
                      {(results.Payload.IsPlanetInGoodAspectToHouse === "True"
                        ? aspectInterpretations.planetToHouse.favorable.effects
                        : aspectInterpretations.planetToHouse.unfavorable.effects
                      ).map((effect, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sacred-gold">•</span>
                          <span className="text-gray-600">{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Remedial Measures:</p>
                    <ul className="mt-2 space-y-2">
                      {(results.Payload.IsPlanetInGoodAspectToHouse === "True"
                        ? aspectInterpretations.planetToHouse.favorable.remedies
                        : aspectInterpretations.planetToHouse.unfavorable.remedies
                      ).map((remedy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sacred-gold">✧</span>
                          <span className="text-gray-600">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Power Level Analysis */}
              <div>
                <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                  Power Level Analysis
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-700">Overall Planetary Power:</p>
                    <p className="text-sacred-copper">
                      {formatPowerPercentage(results.Payload.PlanetPowerPercentage).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Interpretation:</p>
                    <p className="text-gray-600 mt-1">
                      {getPowerLevelInterpretation(formatPowerPercentage(results.Payload.PlanetPowerPercentage))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Recommended Timing:</p>
                    <p className="text-gray-600 mt-1">
                      {getPowerLevelTiming(formatPowerPercentage(results.Payload.PlanetPowerPercentage))}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Remedial Suggestions:</p>
                    <ul className="mt-2 space-y-2">
                      {getPowerLevelRemedies(formatPowerPercentage(results.Payload.PlanetPowerPercentage)).map((remedy, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-sacred-gold">✧</span>
                          <span className="text-gray-600">{remedy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
} 