'use client'

import { useState } from 'react';

interface YoniKutaResponse {
  Status: string;
  Payload: {
    YoniKutaAnimal: string;
  }
}

export function YoniKutaCalculator() {
  const [birthTime, setBirthTime] = useState('');
  const [yoniKuta, setYoniKuta] = useState<YoniKutaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateYoniKuta = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://vedastro.azurewebsites.net/api/Calculate/YoniKutaAnimal/${encodeURIComponent(birthTime)}`);
      const data: YoniKutaResponse = await response.json();
      setYoniKuta(data);
    } catch (err) {
      setError('Failed to calculate Yoni Kuta. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-sacred-gold/20">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🐎</span>
        <h3 className="text-2xl font-bold text-sacred-copper">Yoni Kuta Calculator</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Time</label>
          <input
            type="datetime-local"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
          />
        </div>

        <button
          onClick={calculateYoniKuta}
          disabled={loading || !birthTime}
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
            'Calculate Yoni Kuta'
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}

        {yoniKuta?.Status === "Pass" && (
          <div className="mt-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl">
                  {yoniKuta.Payload.YoniKutaAnimal.includes("Horse") ? "🐎" :
                   yoniKuta.Payload.YoniKutaAnimal.includes("Lion") ? "🦁" :
                   yoniKuta.Payload.YoniKutaAnimal.includes("Elephant") ? "🐘" :
                   yoniKuta.Payload.YoniKutaAnimal.includes("Dog") ? "🐕" :
                   yoniKuta.Payload.YoniKutaAnimal.includes("Cat") ? "🐱" :
                   yoniKuta.Payload.YoniKutaAnimal.includes("Rat") ? "🐀" :
                   yoniKuta.Payload.YoniKutaAnimal.includes("Cow") ? "🐄" :
                   "🐾"}
                </div>
                <div className="text-2xl font-bold text-sacred-copper">
                  {yoniKuta.Payload.YoniKutaAnimal}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 