'use client'

import { useState } from 'react';

interface HouseDetails {
  HouseSignName: string;
  HouseConstellation: string;
  HouseStrength: string;
  HouseNatureScore: string;
  LordOfHouse: {
    Name: string;
  };
  PlanetsInHouse: string[];
  PlanetsAspectingHouse: string[];
  IsBeneficPlanetInHouse: string;
  IsMaleficPlanetInHouse: string;
}

interface ApiResponse {
  Status: string;
  Payload: {
    AllHouseData: Array<Record<string, HouseDetails>>;
  };
}

interface FormData {
  location: string;
  time: string;
  date: string;
  timezone: string;
}

export function HouseData() {
  const [houseData, setHouseData] = useState<ApiResponse | null>(null);
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

  const fetchHouseData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/AllHouseData/HouseName/All/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}/Ayanamsa/LAHIRI`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }
      
      const data = await response.json();
      setHouseData(data);
    } catch (err: any) {
      setError(err.message);
      setHouseData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl border border-sacred-gold/20">
      <h2 className="text-3xl font-bold mb-8 text-sacred-copper flex items-center gap-3">
        🏛️ House Positions
      </h2>
      
      <form onSubmit={fetchHouseData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          Calculate House Positions
        </button>
      </form>

      {loading && <div className="mt-4 text-center">Loading house data...</div>}
      {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      
      {houseData?.Status === "Pass" && (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full bg-white/80 rounded-lg overflow-hidden">
            <thead className="bg-sacred-gold/20">
              <tr>
                <th className="px-4 py-2">House</th>
                <th className="px-4 py-2">Sign</th>
                <th className="px-4 py-2">Constellation</th>
                <th className="px-4 py-2">Lord</th>
                <th className="px-4 py-2">Planets</th>
                <th className="px-4 py-2">Aspects</th>
                <th className="px-4 py-2">Strength</th>
                <th className="px-4 py-2">Nature</th>
              </tr>
            </thead>
            <tbody>
              {houseData.Payload.AllHouseData.map((houseObj, index) => {
                const [houseName, details] = Object.entries(houseObj)[0];
                return (
                  <tr key={index} className="border-t border-sacred-gold/10">
                    <td className="px-4 py-2">{houseName}</td>
                    <td className="px-4 py-2">{details.HouseSignName}</td>
                    <td className="px-4 py-2">{details.HouseConstellation}</td>
                    <td className="px-4 py-2">{details.LordOfHouse.Name}</td>
                    <td className="px-4 py-2">{details.PlanetsInHouse.join(', ') || '-'}</td>
                    <td className="px-4 py-2">{details.PlanetsAspectingHouse.join(', ') || '-'}</td>
                    <td className="px-4 py-2">{parseFloat(details.HouseStrength).toFixed(2)}</td>
                    <td className="px-4 py-2">{parseFloat(details.HouseNatureScore).toFixed(2)}</td>
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