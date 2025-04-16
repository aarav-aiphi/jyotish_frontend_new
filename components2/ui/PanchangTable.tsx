'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PanchangResponse {
  Status: string;
  Payload: {
    PanchangaTable: {
      Ayanamsa: string;
      Tithi: {
        Name: string;
        Paksha: string;
        Date: string;
        Day: string;
        Phase: string;
      };
      LunarMonth: string;
      Vara: string;
      Nakshatra: string;
      Yoga: {
        Name: string;
        Description: string;
      };
      Karana: string;
      HoraLord: {
        Name: string;
      };
      DishaShool: string;
      Sunrise: {
        StdTime: string;
        Location: {
          Name: string;
          Longitude: number;
          Latitude: number;
        };
      };
      Sunset: {
        StdTime: string;
        Location: {
          Name: string;
          Longitude: number;
          Latitude: number;
        };
      };
      IshtaKaala: {
        DegreeMinuteSecond: string;
        TotalDegrees: string;
      };
    };
  };
}

export function PanchangTable() {
  const [panchangData, setPanchangData] = useState<PanchangResponse | null>(null);
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

  const fetchPanchangData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      const url = `https://vedastro.azurewebsites.net/api/Calculate/PanchangaTable/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const data: PanchangResponse = await response.json();
      setPanchangData(data);
    } catch (err: any) {
      setError(err.message);
      setPanchangData(null);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.split(' ')[0];
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10">
        <Image
          src="/mandala-pattern.png"
          alt="Sacred Mandala Pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Enhanced Header Section with Illustration */}
      <div className="mb-16 text-center relative">
        <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-32 h-32 opacity-80">
          <Image
            src="/panchang-icon.png"
            alt="Panchang Icon"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-sacred-copper flex items-center justify-center gap-3 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper">
              Vedic Panchang Calculator
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover the ancient wisdom of Vedic timekeeping. Calculate auspicious moments and cosmic alignments
            based on traditional Hindu astrology.
          </p>
        </motion.div>
      </div>
      
      {/* Enhanced Form Section with Card Design */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 rounded-xl p-8 shadow-lg border border-sacred-gold/10 backdrop-blur-sm
                  max-w-4xl mx-auto mb-12"
      >
        <form onSubmit={fetchPanchangData}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  📍
                </span>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. New Delhi, India"
                  className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Time</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  🕐
                </span>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  📅
                </span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Timezone</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  🌍
                </span>
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  placeholder="e.g. +05:30"
                  className="pl-10 w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="group inline-flex items-center px-8 py-3 rounded-lg text-white font-semibold
                       bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                       hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                       transition-all duration-300"
            >
              <span className="mr-2">Calculate Panchang</span>
              <span className="transform group-hover:rotate-180 transition-transform duration-300">
                {loading ? '⌛' : '✨'}
              </span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Enhanced Loading State */}
      {loading && (
        <div className="mt-8 text-center">
          <div className="inline-block relative w-16 h-16">
            <Image
              src="/om-symbol.png"
              alt="Loading"
              fill
              className="animate-spin"
            />
          </div>
          <p className="text-sacred-copper mt-4">Calculating Vedic Alignments...</p>
        </div>
      )}
      
      {/* Enhanced Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center max-w-2xl mx-auto"
        >
          <Image
            src="/error-icon.png"
            alt="Error"
            width={48}
            height={48}
            className="mx-auto mb-4"
          />
          <p className="text-red-600">{error}</p>
        </motion.div>
      )}
      
      {/* Enhanced Results Display */}
      {panchangData?.Status === "Pass" && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 space-y-8"
        >
          {/* Decorative Divider */}
          <div className="relative h-px bg-gradient-to-r from-transparent via-sacred-gold/30 to-transparent my-8">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full">
              <Image
                src="/divider-icon.png"
                alt="Divider"
                width={24}
                height={24}
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white/90 to-white/50 p-6 rounded-xl shadow-xl border border-sacred-gold/10
                          hover:shadow-2xl hover:border-sacred-gold/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/basic-info-icon.png"
                    alt="Basic Information"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-sacred-copper">Basic Information</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Ayanamsa", value: panchangData.Payload.PanchangaTable.Ayanamsa },
                  { label: "Lunar Month", value: panchangData.Payload.PanchangaTable.LunarMonth },
                  { label: "Day", value: panchangData.Payload.PanchangaTable.Vara },
                  { label: "Disha Shool", value: panchangData.Payload.PanchangaTable.DishaShool },
                  { label: "Hora Lord", value: panchangData.Payload.PanchangaTable.HoraLord.Name }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-sacred-gold/10">
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className="text-sacred-copper">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-white/50 p-6 rounded-xl shadow-xl border border-sacred-gold/10
                          hover:shadow-2xl hover:border-sacred-gold/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/sacred-timings-icon.png"
                    alt="Sacred Timings"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-sacred-copper">Sacred Timings</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Sunrise", value: formatTime(panchangData.Payload.PanchangaTable.Sunrise.StdTime) },
                  { label: "Sunset", value: formatTime(panchangData.Payload.PanchangaTable.Sunset.StdTime) },
                  { label: "Ishta Kaala", value: panchangData.Payload.PanchangaTable.IshtaKaala.DegreeMinuteSecond }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-sacred-gold/10">
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className="text-sacred-copper">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-white/50 p-6 rounded-xl shadow-xl border border-sacred-gold/10
                          hover:shadow-2xl hover:border-sacred-gold/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/tithi-details-icon.png"
                    alt="Tithi Details"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-sacred-copper">Tithi Details</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Tithi", value: panchangData.Payload.PanchangaTable.Tithi.Name },
                  { label: "Paksha", value: panchangData.Payload.PanchangaTable.Tithi.Paksha },
                  { label: "Date", value: panchangData.Payload.PanchangaTable.Tithi.Date },
                  { label: "Day", value: panchangData.Payload.PanchangaTable.Tithi.Day },
                  { label: "Phase", value: panchangData.Payload.PanchangaTable.Tithi.Phase }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-sacred-gold/10">
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className="text-sacred-copper">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/90 to-white/50 p-6 rounded-xl shadow-xl border border-sacred-gold/10
                          hover:shadow-2xl hover:border-sacred-gold/20 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 relative">
                  <Image
                    src="/other-elements-icon.png"
                    alt="Other Elements"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-semibold text-sacred-copper">Other Elements</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Nakshatra", value: panchangData.Payload.PanchangaTable.Nakshatra },
                  { label: "Yoga", value: panchangData.Payload.PanchangaTable.Yoga.Name },
                  { label: "Yoga Description", value: panchangData.Payload.PanchangaTable.Yoga.Description },
                  { label: "Karana", value: panchangData.Payload.PanchangaTable.Karana }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-sacred-gold/10">
                    <span className="font-medium text-gray-600">{item.label}</span>
                    <span className="text-sacred-copper">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-gray-500 text-sm mt-8">
            <p>Calculations based on traditional Vedic astrology principles</p>
          </div>
        </motion.div>
      )}
    </div>
  );
} 