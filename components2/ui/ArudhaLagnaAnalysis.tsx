'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface ArudhaLagnaResponse {
  Status: string;
  Payload: {
    ArudhaLagnaSign: string;
  }
}

// Add interpretations for each sign
const arudhaLagnaInterpretations: { [key: string]: {
  traits: string[];
  career: string;
  relationships: string;
  challenges: string;
  strengths: string;
  recommendations: {
    career: string[];
    relationships: string[];
    image: string[];
    professions: string[];
  };
}} = {
  'Aries': {
    traits: ['Natural leadership qualities', 'Dynamic public image', 'Seen as pioneering and bold'],
    career: 'Others view you as a natural leader and entrepreneur. You may be perceived as someone who takes initiative in professional settings.',
    relationships: 'You are seen as direct and passionate in relationships, sometimes appearing more assertive than you feel inside.',
    challenges: 'Managing impulsive reactions in public, balancing aggression with diplomacy',
    strengths: 'Courage, leadership ability, pioneering spirit',
    recommendations: {
      career: ['Take on leadership roles', 'Start your own ventures', 'Lead team projects'],
      relationships: ['Practice active listening', 'Show your softer side', 'Balance assertiveness with empathy'],
      image: ['Channel your natural confidence', 'Develop diplomatic communication', 'Showcase initiative'],
      professions: ['Entrepreneur', 'Military Officer', 'Sports Professional', 'Executive Leader']
    }
  },
  'Taurus': {
    traits: ['Appearance of stability', 'Material success', 'Artistic sensibility'],
    career: 'You project reliability and financial acumen. Others see you as dependable and resourceful.',
    relationships: 'You are perceived as loyal and steady, offering security and comfort to others.',
    challenges: 'Overcoming perceived stubbornness, adapting to change publicly',
    strengths: 'Reliability, persistence, practical wisdom',
    recommendations: {
      career: ['Focus on long-term stability', 'Build wealth management skills', 'Develop artistic talents'],
      relationships: ['Demonstrate reliability', 'Show emotional availability', 'Create comfortable environments'],
      image: ['Project stability and reliability', 'Showcase artistic sensibilities', 'Maintain consistent presence'],
      professions: ['Financial Advisor', 'Artist', 'Real Estate Agent', 'Chef']
    }
  },
  'Gemini': {
    traits: ['Intellectual appearance', 'Versatile public persona', 'Communication skills'],
    career: 'Perceived as adaptable and quick-thinking. Others see you as intellectually capable and versatile.',
    relationships: 'You appear sociable and engaging, with an ability to connect with diverse groups.',
    challenges: 'Managing perceived inconsistency, focusing public image',
    strengths: 'Communication ability, adaptability, quick wit',
    recommendations: {
      career: ['Leverage communication skills', 'Take on varied roles', 'Network actively'],
      relationships: ['Develop deep connections', 'Show consistency', 'Balance social activities'],
      image: ['Demonstrate expertise in multiple areas', 'Maintain intellectual image', 'Show depth'],
      professions: ['Journalist', 'Teacher', 'Public Relations', 'Sales']
    }
  },
  // ... Add other signs similarly ...
};

export function ArudhaLagnaAnalysis() {
  const [results, setResults] = useState<ArudhaLagnaResponse | null>(null);
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

  const getZodiacEmoji = (sign: string): string => {
    const emojis: { [key: string]: string } = {
      'Aries': '♈',
      'Taurus': '♉',
      'Gemini': '♊',
      'Cancer': '♋',
      'Leo': '♌',
      'Virgo': '♍',
      'Libra': '♎',
      'Scorpio': '♏',
      'Sagittarius': '♐',
      'Capricorn': '♑',
      'Aquarius': '♒',
      'Pisces': '♓',
    };
    return emojis[sign] || '⭐';
  };

  const fetchArudhaLagna = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      
      if (!location || !time || !date || !timezone) {
        throw new Error('Please fill in all required fields');
      }

      const formattedDate = formatDate(date);
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/ArudhaLagnaSign/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.Status !== "Pass") {
        throw new Error(data.Message || 'Failed to get Arudha Lagna information');
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
          <h2 className="text-3xl font-bold text-sacred-copper">Arudha Lagna Analysis</h2>
          <p className="text-gray-600 mt-2">
            Discover your Arudha Lagna (Apparent Ascendant) and its significance
          </p>
        </div>

        <form onSubmit={fetchArudhaLagna} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Birth Place</label>
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
              <label className="block text-sm font-medium text-gray-700">Birth Time</label>
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
              <label className="block text-sm font-medium text-gray-700">Birth Date</label>
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
              {loading ? 'Calculating...' : 'Find Arudha Lagna'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⭐</div>
            <p className="text-sacred-copper">Calculating Arudha Lagna...</p>
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
            {/* Main Result Card */}
            <div className="bg-white/90 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-sacred-copper mb-4">
                  Your Arudha Lagna
                </h3>
                <div className="inline-block p-6 bg-gradient-to-r from-sacred-gold/5 to-sacred-copper/5 
                              rounded-full mb-6 shadow-inner">
                  <span className="text-6xl">{getZodiacEmoji(results.Payload.ArudhaLagnaSign)}</span>
                </div>
                <p className="text-3xl font-semibold text-gray-800 mb-2">
                  {results.Payload.ArudhaLagnaSign}
                </p>
              </div>
            </div>

            {/* Detailed Interpretation */}
            {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign] && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Traits */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/90 rounded-xl p-6 shadow-lg"
                >
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">Key Traits</h4>
                  <ul className="space-y-2">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].traits.map((trait, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-sacred-gold">•</span>
                        <span className="text-gray-700">{trait}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Career & Professional Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 rounded-xl p-6 shadow-lg"
                >
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">Professional Image</h4>
                  <p className="text-gray-700">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].career}
                  </p>
                </motion.div>

                {/* Relationships & Social Perception */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/90 rounded-xl p-6 shadow-lg"
                >
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">Social Perception</h4>
                  <p className="text-gray-700">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].relationships}
                  </p>
                </motion.div>

                {/* Strengths & Challenges */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/90 rounded-xl p-6 shadow-lg"
                >
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">Strengths & Challenges</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sacred-gold font-medium mb-2">Strengths</h5>
                      <p className="text-gray-700">
                        {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].strengths}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-sacred-gold font-medium mb-2">Challenges</h5>
                      <p className="text-gray-700">
                        {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].challenges}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Additional Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-sacred-gold/5 rounded-xl p-6"
            >
              <p className="text-gray-600 text-center">
                The Arudha Lagna represents your public persona and how the world perceives you. 
                It differs from your rising sign (Lagna) as it shows your projected image rather than your true self.
              </p>
            </motion.div>

            {/* New Recommendations Section */}
            {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign]?.recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Career Recommendations */}
                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                    Career Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].recommendations.career.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-sacred-gold">→</span>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compatible Professions */}
                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                    Compatible Professions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].recommendations.professions.map((prof, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-sacred-gold/10 text-sacred-copper rounded-full text-sm"
                      >
                        {prof}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Image Management */}
                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                    Public Image Management
                  </h4>
                  <ul className="space-y-2">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].recommendations.image.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-sacred-gold">✦</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Relationship Dynamics */}
                <div className="bg-white/90 rounded-xl p-6 shadow-lg">
                  <h4 className="text-lg font-semibold text-sacred-copper mb-4">
                    Relationship Dynamics
                  </h4>
                  <ul className="space-y-2">
                    {arudhaLagnaInterpretations[results.Payload.ArudhaLagnaSign].recommendations.relationships.map((dyn, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-sacred-gold">❥</span>
                        <span className="text-gray-700">{dyn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 