'use client'

import { useState } from 'react';

interface NumberResponse {
  Status: string;
  Payload: {
    IsPlanetCombust?: Array<Record<string, string>>;
    NameNumber?: string;
  }
}

export function BirthDestinyCalculator() {
  const [birthTime, setBirthTime] = useState('');
  const [name, setName] = useState('');
  const [birthNumber, setBirthNumber] = useState<NumberResponse | null>(null);
  const [destinyNumber, setDestinyNumber] = useState<NumberResponse | null>(null);
  const [nameNumber, setNameNumber] = useState<NumberResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateNumbers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calculate Birth Number
      const birthResponse = await fetch(`https://vedastro.azurewebsites.net/api/Calculate/BirthNumber/${encodeURIComponent(birthTime)}`);
      const birthData: NumberResponse = await birthResponse.json();
      setBirthNumber(birthData);

      // Calculate Destiny Number
      const destinyResponse = await fetch(`https://vedastro.azurewebsites.net/api/Calculate/DestinyNumber/${encodeURIComponent(birthTime)}`);
      const destinyData: NumberResponse = await destinyResponse.json();
      setDestinyNumber(destinyData);

      if (name) {
        // Calculate Name Number
        const nameResponse = await fetch(`https://vedastro.azurewebsites.net/api/Calculate/NameNumber/${encodeURIComponent(name)}`);
        const nameData: NumberResponse = await nameResponse.json();
        setNameNumber(nameData);
      }
    } catch (err) {
      setError('Failed to calculate numbers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderNumberCard = (title: string, data: any, icon: string) => {
    if (data?.Status !== "Pass") return null;
    
    const formatPayload = (payload: any) => {
      if (payload.NameNumber) {
        return (
          <div className="text-4xl font-bold text-sacred-copper text-center">
            {payload.NameNumber}
          </div>
        );
      }
      
      if (payload.IsPlanetCombust) {
        return (
          <div className="grid grid-cols-2 gap-4">
            {payload.IsPlanetCombust.map((item: Record<string, string>, index: number) => {
              const [planet, status] = Object.entries(item)[0];
              return (
                <div key={index} className="flex items-center justify-between bg-white/30 p-3 rounded-lg">
                  <span className="font-medium">{planet}</span>
                  <span className={`px-2 py-1 rounded ${
                    status === "True" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {String(status)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
    };

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{icon}</span>
          <h4 className="text-xl font-semibold text-sacred-copper">{title}</h4>
        </div>
        <div className="mt-4">
          {formatPayload(data.Payload)}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-sacred-gold/20">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">🔮</span>
        <h3 className="text-2xl font-bold text-sacred-copper">Numerological Numbers</h3>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        <button
          onClick={calculateNumbers}
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
            'Calculate Numbers'
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mt-4">
            {error}
          </div>
        )}

        {(birthNumber || destinyNumber || nameNumber) && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderNumberCard("Birth Number", birthNumber, "🎯")}
            {renderNumberCard("Destiny Number", destinyNumber, "✨")}
            {renderNumberCard("Name Number", nameNumber, "📝")}
          </div>
        )}
      </div>
    </div>
  );
} 