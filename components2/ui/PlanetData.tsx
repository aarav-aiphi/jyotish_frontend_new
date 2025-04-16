'use client'

import { useState } from 'react';

interface PlanetDetails {
  PlanetRasiD1Sign: {
    Name: string;
    DegreesIn: {
      DegreeMinuteSecond: string;
      TotalDegrees: string;
    };
  };
  PlanetConstellation: string;
  IsPlanetRetrograde: boolean;
  PlanetSpeed: string;
  HousePlanetOccupiesBasedOnSign: string;
  PlanetDigBala: string;
  PlanetNatureScore: string;
}

interface ApiResponse {
  Status: string;
  Payload: {
    AllPlanetData: Array<Record<string, PlanetDetails>>;
  };
}

interface FormData {
  location: string;
  time: string;
  date: string;
  timezone: string;
}

export function PlanetData() {
  const [planetData, setPlanetData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    time: '',
    date: '',
    timezone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const fetchPlanetData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/AllPlanetData/PlanetName/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}/Ayanamsa/LAHIRI`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      
      const data = await response.json();
      setPlanetData(data);
    } catch (err: any) {
      setError(err.message);
      setPlanetData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-sacred-gold/20">
      <h2 className="text-3xl font-bold mb-8 text-sacred-copper flex items-center gap-3">
        🪐 Planetary Positions
      </h2>
      
      <form onSubmit={fetchPlanetData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Location"
          className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold transition-all duration-300"
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold transition-all duration-300"
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold transition-all duration-300"
          required
        />
        <input
          type="text"
          name="timezone"
          value={formData.timezone}
          onChange={handleInputChange}
          placeholder="Timezone (e.g. +05:30)"
          className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold transition-all duration-300"
          required
        />
        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105 transition-all duration-300"
        >
          Calculate Planetary Positions
        </button>
      </form>

      {loading && <div className="mt-4 text-center">Loading planetary data...</div>}
      {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      
      {planetData?.Status === "Pass" && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-lg overflow-hidden">
            <thead className="bg-sacred-gold/20">
              <tr>
                <th className="px-4 py-2">Planet</th>
                <th className="px-4 py-2">Sign</th>
                <th className="px-4 py-2">Degrees</th>
                <th className="px-4 py-2">Nakshatra</th>
                <th className="px-4 py-2">House</th>
                <th className="px-4 py-2">Retrograde</th>
                <th className="px-4 py-2">Speed</th>
              </tr>
            </thead>
            <tbody>
              {planetData.Payload.AllPlanetData.map((planetObj, index) => {
                const [planetName, details] = Object.entries(planetObj)[0];
                return (
                  <tr key={index} className="border-t border-sacred-gold/10">
                    <td className="px-4 py-2">{planetName}</td>
                    <td className="px-4 py-2">{details.PlanetRasiD1Sign.Name}</td>
                    <td className="px-4 py-2">{details.PlanetRasiD1Sign.DegreesIn.DegreeMinuteSecond}</td>
                    <td className="px-4 py-2">{details.PlanetConstellation}</td>
                    <td className="px-4 py-2">{details.HousePlanetOccupiesBasedOnSign}</td>
                    <td className="px-4 py-2">{details.IsPlanetRetrograde ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">{parseFloat(details.PlanetSpeed).toFixed(4)}°</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 