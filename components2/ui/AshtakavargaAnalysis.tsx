'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface BhinnashtakavargaData {
  Total: number;
  Rows: number[];
}

interface AshtakavargaResponse {
  Status: string;
  Payload: {
    BhinnashtakavargaChart: {
      [key: string]: BhinnashtakavargaData;
    };
    SarvashtakavargaChart: {
      [key: string]: BhinnashtakavargaData;
    };
  }
}

const planetColors = {
  Sun: 'bg-orange-500',
  Moon: 'bg-gray-300',
  Mars: 'bg-red-500',
  Mercury: 'bg-green-500',
  Jupiter: 'bg-yellow-500',
  Venus: 'bg-blue-500',
  Saturn: 'bg-purple-500'
};

const planetInterpretations = {
  Sun: {
    high: "Strong vitality and leadership potential",
    low: "Need to develop self-confidence and authority"
  },
  Moon: {
    high: "Strong emotional intelligence and adaptability",
    low: "Need to develop emotional stability"
  },
  Mars: {
    high: "Strong drive and initiative",
    low: "Need to manage aggression and impulsiveness"
  },
  Mercury: {
    high: "Strong intellectual and communication abilities",
    low: "Need to improve mental clarity and expression"
  },
  Jupiter: {
    high: "Strong wisdom and expansion opportunities",
    low: "Need to develop wisdom and optimism"
  },
  Venus: {
    high: "Strong relationship and artistic abilities",
    low: "Need to develop harmony and refinement"
  },
  Saturn: {
    high: "Strong discipline and responsibility",
    low: "Need to overcome limitations and fears"
  }
};

const sarvaInterpretations = {
  high: {
    threshold: 30,
    meaning: "Very auspicious house indicating strong positive results"
  },
  medium: {
    threshold: 25,
    meaning: "Moderately favorable house with balanced outcomes"
  },
  low: {
    meaning: "House requiring attention and remedial measures"
  }
};

export function AshtakavargaAnalysis() {
  const [results, setResults] = useState<AshtakavargaResponse | null>(null);
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

  const fetchAshtakavargaData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      
      if (!location || !time || !date || !timezone) {
        throw new Error('Please fill in all required fields');
      }

      const formattedDate = formatDate(date);
      
      // Fetch both Bhinnashatkavarga and Sarvashtakavarga data
      const responses = await Promise.all([
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/BhinnashtakavargaChart/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/SarvashtakavargaChart/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`)
      ]);

      const [bhinnaData, sarvaData] = await Promise.all(
        responses.map(res => res.json())
      );

      if (bhinnaData.Status !== "Pass" || sarvaData.Status !== "Pass") {
        throw new Error('Failed to get Ashtakavarga information');
      }

      setResults({
        Status: "Pass",
        Payload: {
          BhinnashtakavargaChart: bhinnaData.Payload.BhinnashtakavargaChart,
          SarvashtakavargaChart: sarvaData.Payload.SarvashtakavargaChart
        }
      });
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const PlanetCard = ({ planet, data }: { planet: string; data: BhinnashtakavargaData }) => {
    const isHighScore = data.Total > 45; // Threshold for high/low interpretation

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 rounded-lg p-4 shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${planetColors[planet as keyof typeof planetColors]}`} />
            <h3 className="font-medium text-sacred-copper">{planet}</h3>
          </div>
          <span className="text-2xl font-bold text-sacred-gold">{data.Total}</span>
        </div>

        {/* Row Distribution */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">House Distribution</span>
            <span className="text-xs text-gray-500">Values</span>
          </div>
          <div className="grid grid-cols-12 gap-1">
            {data.Rows.map((value, index) => (
              <div key={index} className="relative">
                <div 
                  className="bg-sacred-gold/20 rounded"
                  style={{ height: `${value * 12}px` }}
                >
                  <span className="absolute -top-5 text-xs">{value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-12 gap-1 mt-1">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="text-xs text-gray-400 text-center">{i + 1}</span>
            ))}
          </div>
        </div>

        {/* Interpretation */}
        <div className="text-sm">
          <p className={`${isHighScore ? 'text-green-600' : 'text-amber-600'} font-medium mb-1`}>
            {isHighScore ? '✨ Strong Points' : '⚠️ Areas for Development'}
          </p>
          <p className="text-gray-600">
            {isHighScore 
              ? planetInterpretations[planet as keyof typeof planetInterpretations].high
              : planetInterpretations[planet as keyof typeof planetInterpretations].low
            }
          </p>
        </div>
      </motion.div>
    );
  };

  const SarvashtakavargaCard = ({ data }: { data: BhinnashtakavargaData }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full bg-white/90 rounded-lg p-6 shadow-lg border border-sacred-gold/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-sacred-copper">Sarvashtakavarga Analysis</h3>
          <span className="text-3xl font-bold text-sacred-gold">{data.Total}</span>
        </div>

        {/* House Distribution Chart */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">House-wise Total Bindus</span>
            <span className="text-sm text-gray-600">Max: {Math.max(...data.Rows)}</span>
          </div>
          <div className="grid grid-cols-12 gap-2 h-40 items-end">
            {data.Rows.map((value, index) => (
              <div key={index} className="relative group">
                <div 
                  className={`w-full rounded-t transition-all ${
                    value >= 30 ? 'bg-green-500' :
                    value >= 25 ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ height: `${(value / 40) * 100}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 
                                 bg-black text-white text-xs px-2 py-1 rounded opacity-0 
                                 group-hover:opacity-100 transition-opacity">
                    {value}
                  </div>
                </div>
                <span className="text-xs text-gray-500 text-center block mt-1">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* House Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {data.Rows.map((value, index) => (
            <div key={index} className="bg-white/50 rounded-lg p-4 border border-sacred-gold/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-sacred-copper">House {index + 1}</span>
                <span className={`text-sm font-semibold ${
                  value >= 30 ? 'text-green-600' :
                  value >= 25 ? 'text-yellow-600' : 'text-red-500'
                }`}>
                  {value} bindus
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {value >= 30 ? sarvaInterpretations.high.meaning :
                 value >= 25 ? sarvaInterpretations.medium.meaning :
                 sarvaInterpretations.low.meaning}
              </p>
            </div>
          ))}
        </div>

        {/* Overall Strength Analysis */}
        <div className="mt-8 p-4 bg-sacred-gold/5 rounded-lg">
          <h4 className="font-medium text-sacred-copper mb-3">Overall Chart Strength</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Total Bindus:</span>
              <span className="font-semibold text-sacred-gold">{data.Total}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Average per House:</span>
              <span className="font-semibold text-sacred-gold">
                {(data.Total / 12).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Strong Houses:</span>
              <span className="font-semibold text-green-500">
                {data.Rows.filter(v => v >= 30).length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <h2 className="text-3xl font-bold mb-8 text-sacred-copper flex items-center gap-3">
        🎯 Ashtakavarga Analysis
      </h2>

      <form onSubmit={fetchAshtakavargaData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
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
          <label className="block text-sm font-medium text-gray-700">Timezone</label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            placeholder="e.g., +05:30"
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 bg-sacred-gold/90 text-white rounded-lg
                     hover:bg-sacred-gold focus:ring-2 focus:ring-sacred-gold/50
                     hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          >
            {loading ? 'Calculating...' : 'Generate Ashtakavarga Analysis'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {results?.Status === "Pass" && (
        <div className="mt-8 space-y-12">
          {/* Sarvashtakavarga Section */}
          <SarvashtakavargaCard data={results.Payload.SarvashtakavargaChart.Sarvashtakavarga} />

          {/* Existing Bhinnashatkavarga Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(results.Payload.BhinnashtakavargaChart).map(([planet, data]) => (
              <PlanetCard key={planet} planet={planet} data={data} />
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-sacred-gold/5 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-sacred-copper mb-4">Overall Analysis</h3>
            <div className="space-y-4">
              {Object.entries(results.Payload.BhinnashtakavargaChart)
                .sort((a, b) => b[1].Total - a[1].Total)
                .map(([planet, data]) => (
                  <div key={planet} className="flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full ${planetColors[planet as keyof typeof planetColors]}`} />
                    <span className="text-gray-700">{planet}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div 
                        className={`${planetColors[planet as keyof typeof planetColors]} h-2 rounded-full`}
                        style={{ width: `${(data.Total / 56) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{data.Total}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 