'use client'

import { useState } from 'react';

interface PredictionSummary {
  Finance: number;
  Romance: number;
  Education: number;
  Health: number;
  Family: number;
  Growth: number;
  Career: number;
  Reputation: number;
  Spirituality: number;
  Luck: number;
}

interface NamePredictionResponse {
  Status: string;
  Payload: {
    NameNumberPrediction: {
      Planet: string;
      Number: number;
      Prediction: string;
      PredictionSummary: PredictionSummary;
    }
  }
}

export function NameNumberPrediction() {
  const [name, setName] = useState('');
  const [prediction, setPrediction] = useState<NamePredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculatePrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://vedastro.azurewebsites.net/api/Calculate/NameNumberPrediction/stringfullName/${encodeURIComponent(name)}`);
      const data: NamePredictionResponse = await response.json();
      
      if (!data?.Payload?.NameNumberPrediction?.Planet) {
        throw new Error('Invalid response from server');
      }
      
      setPrediction(data);
    } catch (err) {
      setError('Failed to calculate name prediction. Please try again.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanetEmoji = (planet: string) => {
    const planetEmojis: Record<string, string> = {
      'Sun': '☀️',
      'Moon': '🌙',
      'Mars': '♂️',
      'Mercury': '☿',
      'Jupiter': '♃',
      'Venus': '♀️',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋'
    };
    return planetEmojis[planet] || '🌟';
  };

  const renderScoreBar = (label: string, score: number, key: string) => (
    <div key={key} className="relative mb-6 bg-white/50 p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="text-sm font-bold text-sacred-copper">{score}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${
            score > 50 
              ? 'bg-gradient-to-r from-green-400 to-green-600' 
              : score > 30 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                : 'bg-gradient-to-r from-red-400 to-red-600'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-sacred-gold/20">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🔮</span>
        <h3 className="text-2xl font-bold text-sacred-copper">Name Number Prediction</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
          />
        </div>

        <button
          onClick={calculatePrediction}
          disabled={loading || !name}
          className={`w-full bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                     text-white font-semibold py-3 px-6 rounded-lg
                     hover:shadow-lg hover:shadow-sacred-gold/20
                     transform hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Calculating...</span>
            </div>
          ) : (
            'Get Prediction'
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}

        {prediction?.Status === "Pass" && (
          <div className="mt-6 space-y-6">
            {/* Number and Planet Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-center gap-6">
                <div className="text-5xl">
                  {getPlanetEmoji(prediction.Payload.NameNumberPrediction.Planet)}
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-sacred-copper mb-2">
                    Number {prediction.Payload.NameNumberPrediction.Number}
                  </div>
                  <div className="text-xl text-gray-600 font-medium">
                    Ruled by {prediction.Payload.NameNumberPrediction.Planet}
                  </div>
                </div>
              </div>
            </div>

            {/* Prediction Text Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h4 className="text-xl font-bold text-sacred-copper mb-4">Prediction Analysis</h4>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {prediction.Payload.NameNumberPrediction.Prediction}
                </p>
              </div>
            </div>

            {/* Prediction Summary Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h4 className="text-xl font-bold text-sacred-copper mb-6">Life Aspects Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                {Object.entries(prediction.Payload.NameNumberPrediction.PredictionSummary)
                  .sort(([, a], [, b]) => b - a) // Sort by score in descending order
                  .map(([aspect, score]) => renderScoreBar(aspect, score, aspect))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 