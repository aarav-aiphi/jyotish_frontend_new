'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TimeLocation {
  StdTime: string;
  Location: {
    Name: string;
    Longitude: number;
    Latitude: number;
  }
}

interface MLResponse {
  Status: string;
  Payload: {
    FindBirthTimeByMachineLearning: {
      Start: TimeLocation;
      End: TimeLocation;
      DaysBetween: number;
    }
  }
}

interface AnimalSignResponse {
  Status: string;
  Payload: {
    FindBirthTimeByAnimal: {
      [key: string]: string;  // Time string -> "Animal - Gender" string
    }
  }
}

interface RisingSignResponse {
  Status: string;
  Payload: {
    FindBirthTimeByRisingSign: {
      [key: string]: string;  // Time string -> Rising sign description
    }
  }
}

interface HouseStrengthResponse {
  Status: string;
  Payload: {
    FindBirthTimeHouseStrengthPerson: {
      [key: string]: string;  // Time string -> House strengths string
    }
  }
}

type RectificationResponse = AnimalSignResponse | RisingSignResponse | MLResponse | HouseStrengthResponse;

export function BirthTimeRectification() {
  const [results, setResults] = useState<RectificationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<'animal' | 'rising' | 'house' | 'ml'>('animal');
  
  const [formData, setFormData] = useState({
    location: '',
    approximateTime: '',
    date: '',
    timezone: '',
    bodyHeight: '',
    bodyShape: '',
    searchHours: '2',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchRectification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, approximateTime, date, timezone, bodyHeight, bodyShape, searchHours } = formData;
      
      if (!location || !approximateTime || !date || !timezone) {
        throw new Error('Please fill in all required fields');
      }

      const formattedDate = formatDate(date);
      
      let url = '';
      
      switch(method) {
        case 'animal':
          url = `https://vedastro.azurewebsites.net/api/Calculate/FindBirthTimeByAnimal/Location/${encodeURIComponent(location)}/Time/${approximateTime}/${formattedDate}/${timezone}/${searchHours}`;
          break;
        case 'rising':
          url = `https://vedastro.azurewebsites.net/api/Calculate/FindBirthTimeByRisingSign/Location/${encodeURIComponent(location)}/Time/${approximateTime}/${formattedDate}/${timezone}/${searchHours}`;
          break;
        case 'house':
          url = `https://vedastro.azurewebsites.net/api/Calculate/FindBirthTimeHouseStrengthPerson/Location/${encodeURIComponent(location)}/Time/${approximateTime}/${formattedDate}/${timezone}/${searchHours}`;
          break;
        case 'ml':
          if (!bodyHeight || !bodyShape) {
            throw new Error('Please fill in body height and shape for ML method');
          }
          url = `https://vedastro.azurewebsites.net/api/Calculate/FindBirthTimeByMachineLearning/Location/${encodeURIComponent(location)}/Time/${approximateTime}/${formattedDate}/${timezone}/${bodyHeight}/${bodyShape}/${searchHours}`;
          break;
      }
      
      console.log('Fetching from URL:', url);

      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Response:', data);

      if (data.Status !== "Pass") {
        throw new Error(data.Message || 'Failed to get birth time');
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

  const handleMethodChange = (newMethod: 'animal' | 'rising' | 'house' | 'ml') => {
    setMethod(newMethod);
    setResults(null);
    setError(null);
  };

  const renderResults = () => {
    if (results?.Status !== "Pass") return null;

    if (method === 'animal') {
      const animalResults = results as AnimalSignResponse;
      const timeMap = animalResults.Payload.FindBirthTimeByAnimal;
      
      // Get input time and create ±1 hour range
      const inputTime = formData.approximateTime;
      const [inputHour, inputMinutes] = inputTime.split(':').map(Number);
      
      // Filter times to show only ±1 hour from input time
      const relevantTimes = Object.entries(timeMap).filter(([time]) => {
        const [timeHour] = time.split(' ')[0].split(':').map(Number);
        const hourDiff = Math.abs(timeHour - inputHour);
        return hourDiff <= 1 || hourDiff >= 23; // Handle midnight boundary
      });

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-sacred-copper mb-2">
              Animal Sign Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Animal signs around {inputTime}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantTimes.map(([time, animalInfo]) => {
              const [animal, gender] = animalInfo.split(' - ');
              const isInputHour = time.startsWith(formData.approximateTime.split(':')[0]);
              
              return (
                <div 
                  key={time}
                  className={`p-4 border rounded-lg bg-white/50 transition-all duration-300
                            ${isInputHour 
                              ? 'border-sacred-gold/50 bg-sacred-gold/5 shadow-md' 
                              : 'border-sacred-gold/20 hover:border-sacred-gold/40'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${isInputHour ? 'text-sacred-copper' : 'text-gray-600'}`}>
                        {time.split(' ')[0]}
                      </p>
                      <p className="text-sm text-gray-600">
                        {animal} ({gender})
                      </p>
                    </div>
                    <span className="text-2xl">
                      {animal.toLowerCase().includes('horse') ? '🐎' : '🦁'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-sacred-gold/5 rounded-lg">
            <p className="text-sm text-gray-600">
              Showing animal signs within ±1 hour of your input time ({inputTime}). 
              Animal sign changes can indicate potential birth time transitions.
            </p>
          </div>
        </motion.div>
      );
    } else if (method === 'ml') {
      const mlResults = results as MLResponse;
      const { Start, End, DaysBetween } = mlResults.Payload.FindBirthTimeByMachineLearning;
      
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-sacred-copper mb-2">
              AI/ML Birth Time Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Predicted birth time range based on physical characteristics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white/50 rounded-lg border border-sacred-gold/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🌅</span>
                <h4 className="text-lg font-medium text-sacred-copper">Start Time</h4>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{Start.StdTime.split(' ')[1]}</p>
                <p className="text-sm text-gray-600">{Start.Location.Name}</p>
                <div className="text-xs text-gray-500">
                  <p>Latitude: {Start.Location.Latitude}°</p>
                  <p>Longitude: {Start.Location.Longitude}°</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/50 rounded-lg border border-sacred-gold/20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🌇</span>
                <h4 className="text-lg font-medium text-sacred-copper">End Time</h4>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold">{End.StdTime.split(' ')[1]}</p>
                <p className="text-sm text-gray-600">{End.Location.Name}</p>
                <div className="text-xs text-gray-500">
                  <p>Latitude: {End.Location.Latitude}°</p>
                  <p>Longitude: {End.Location.Longitude}°</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-sacred-gold/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sacred-copper font-medium">Time Range Duration</span>
              <span className="text-gray-600">
                {Math.round(DaysBetween * 24 * 60)} minutes
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Based on your physical characteristics, the AI model predicts your birth time 
              falls within this range. For more precision, consider cross-referencing with 
              other rectification methods.
            </p>
          </div>
        </motion.div>
      );
    } else if (method === 'rising') {
      const risingResults = results as RisingSignResponse;
      const timeMap = risingResults.Payload.FindBirthTimeByRisingSign;
      
      // Get input time and create ±1 hour range
      const inputTime = formData.approximateTime;
      const [inputHour, inputMinutes] = inputTime.split(':').map(Number);
      
      // Filter times to show only ±1 hour from input time
      const relevantTimes = Object.entries(timeMap).filter(([time]) => {
        const [timeHour] = time.split(' ')[0].split(':').map(Number);
        const hourDiff = Math.abs(timeHour - inputHour);
        return hourDiff <= 1 || hourDiff >= 23; // Handle midnight boundary
      });

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-sacred-copper mb-2">
              Rising Sign Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Rising signs around {inputTime}
            </p>
          </div>

          <div className="space-y-6">
            {relevantTimes.map(([time, description]) => {
              const isInputHour = time.startsWith(formData.approximateTime.split(':')[0]);
              const [signName, ...details] = description.split(' - ');
              
              return (
                <div 
                  key={time}
                  className={`p-6 border rounded-lg transition-all duration-300
                            ${isInputHour 
                              ? 'border-sacred-gold/50 bg-sacred-gold/5 shadow-md' 
                              : 'border-sacred-gold/20 hover:border-sacred-gold/40'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className={`text-lg font-medium ${isInputHour ? 'text-sacred-copper' : 'text-gray-700'}`}>
                        {time.split(' ')[0]} - {signName}
                      </p>
                    </div>
                    <span className="text-2xl">
                      {getZodiacEmoji(signName)}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {details.map((section, index) => {
                      const [title, content] = section.split('.');
                      if (!content) return null;
                      
                      return (
                        <div key={index} className="space-y-1">
                          <h4 className="font-medium text-sacred-copper">{title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-sacred-gold/5 rounded-lg">
            <p className="text-sm text-gray-600">
              Showing rising signs within ±1 hour of your input time ({inputTime}). 
              Each rising sign indicates different personality traits and tendencies.
            </p>
          </div>
        </motion.div>
      );
    } else if (method === 'house') {
      const houseResults = results as HouseStrengthResponse;
      const timeMap = houseResults.Payload.FindBirthTimeHouseStrengthPerson;
      
      // Get input time and create ±1 hour range
      const inputTime = formData.approximateTime;
      const [inputHour] = inputTime.split(':').map(Number);
      
      // Filter times to show only ±1 hour from input time
      const relevantTimes = Object.entries(timeMap).filter(([time]) => {
        const [timeHour] = time.split(' ')[0].split(':').map(Number);
        const hourDiff = Math.abs(timeHour - inputHour);
        return hourDiff <= 1 || hourDiff >= 23; // Handle midnight boundary
      });

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-sacred-copper mb-2">
              House Strength Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              House strengths around {inputTime}
            </p>
          </div>

          <div className="space-y-6">
            {relevantTimes.map(([time, strengthsStr]) => {
              const isInputHour = time.startsWith(formData.approximateTime.split(':')[0]);
              const houses = strengthsStr.split(',').filter(Boolean).map(h => {
                const [house, strength] = h.split(' ');
                return { house, strength: parseFloat(strength) };
              });
              
              // Find strongest and weakest houses
              const maxStrength = Math.max(...houses.map(h => h.strength));
              const minStrength = Math.min(...houses.map(h => h.strength));
              
              return (
                <div 
                  key={time}
                  className={`p-6 border rounded-lg transition-all duration-300
                            ${isInputHour 
                              ? 'border-sacred-gold/50 bg-sacred-gold/5 shadow-md' 
                              : 'border-sacred-gold/20 hover:border-sacred-gold/40'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className={`text-lg font-medium ${isInputHour ? 'text-sacred-copper' : 'text-gray-700'}`}>
                      {time.split(' ')[0]}
                    </p>
                    <span className="text-sm text-gray-500">
                      Strength Range: {minStrength.toFixed(2)} - {maxStrength.toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {houses.map(({ house, strength }) => (
                      <div 
                        key={house}
                        className={`p-3 rounded-lg ${
                          strength === maxStrength ? 'bg-sacred-gold/20 border-sacred-gold' :
                          strength === minStrength ? 'bg-red-50 border-red-200' :
                          'bg-white/50 border-gray-100'
                        } border`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{house}</span>
                          <span className="text-sm text-gray-500">
                            {strength.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-sacred-copper rounded-full h-1.5"
                            style={{ width: `${(strength / maxStrength) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-sacred-gold/5 rounded-lg">
            <p className="text-sm text-gray-600">
              Showing house strengths within ±1 hour of your input time ({inputTime}). 
              Stronger houses (higher values) indicate more favorable placements.
              The strongest house is highlighted in gold, while the weakest is shown in red.
            </p>
          </div>
        </motion.div>
      );
    }

    // For other methods (rising, house), keep existing results display
    const otherResults = results as RectificationResponse;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 bg-white/90 rounded-xl p-6 shadow-lg"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-sacred-copper mb-2">
            Rectified Birth Time
          </h3>
          <p className="text-xl font-semibold">Results Available</p>
          <div className="mt-2 text-gray-600">
            Please check the console for detailed results
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-sacred-copper">Analysis Summary:</h4>
          <p className="text-gray-600">
            The calculation was successful, but this result format is not fully supported in the UI.
            You can view the raw data in the browser console or try a different rectification method.
          </p>
        </div>
      </motion.div>
    );
  };

  // Helper function to get zodiac emoji
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
    return emojis[sign.split(' ')[0]] || '⭐';
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

      <div className="mb-12 text-center relative">
        <h2 className="text-4xl font-bold text-sacred-copper mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
            Birth Time Rectification
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover your precise birth time using various Vedic astrology techniques and modern AI
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-20"
      >
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rectification Method</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { id: 'animal', label: 'Animal Signs', icon: '🐯' },
              { id: 'rising', label: 'Rising Sign', icon: '⭐' },
              { id: 'house', label: 'House Strength', icon: '🏠' },
              { id: 'ml', label: 'AI/ML Method', icon: '🤖' },
            ].map(option => (
              <div
                key={option.id}
                role="button"
                tabIndex={0}
                onClick={() => handleMethodChange(option.id as any)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleMethodChange(option.id as any);
                  }
                }}
                className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer
                          hover:border-sacred-gold/50 hover:shadow-md relative z-30
                          ${method === option.id 
                            ? 'border-sacred-gold bg-sacred-gold/10 text-sacred-copper' 
                            : 'border-gray-200'}`}
              >
                <span className="text-2xl mb-2 block">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={fetchRectification} className="space-y-6">
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
              <label className="block text-sm font-medium text-gray-700">Approximate Time</label>
              <input
                type="time"
                name="approximateTime"
                value={formData.approximateTime}
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

            {method === 'ml' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Body Height (cm)</label>
                  <input
                    type="number"
                    name="bodyHeight"
                    value={formData.bodyHeight}
                    onChange={handleInputChange}
                    placeholder="e.g. 170"
                    min="100"
                    max="250"
                    className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                             focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                             transition-all duration-300"
                    required={method === 'ml'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Body Shape</label>
                  <select
                    name="bodyShape"
                    value={formData.bodyShape}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                             focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                             transition-all duration-300"
                    required={method === 'ml'}
                  >
                    <option value="">Select body shape</option>
                    <option value="slim">Slim</option>
                    <option value="average">Average</option>
                    <option value="athletic">Athletic</option>
                    <option value="heavy">Heavy</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Search Range (Hours)</label>
              <input
                type="number"
                name="searchHours"
                value={formData.searchHours}
                onChange={handleInputChange}
                min="1"
                max="24"
                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                         focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                         transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold
                       bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                       hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 z-10 relative"
            >
              {loading ? 'Calculating...' : 'Find Birth Time'}
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
            <p className="text-sacred-copper">
              {method === 'animal' 
                ? 'Analyzing animal sign patterns...'
                : 'Calculating birth time...'}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {results?.Status === "Pass" && renderResults()}
      </motion.div>
    </div>
  );
} 