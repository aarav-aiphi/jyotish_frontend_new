'use client'

import { useState, useEffect } from 'react';
import * as motion from 'framer-motion/client';
import { BackgroundBeams } from '@/components2/ui/background-beams';
import { ParallaxText } from '@/components2/ui/parallax-text';
import { SparklesCore } from '@/components2/ui/sparkles';
import { GlowingStarsText } from '@/components2/ui/glowing-stars';
import { NumerologyCalculator } from '@/components2/ui/NumerologyCalculator';
import { AshtakavargaAnalysis } from '@/components2/ui/AshtakavargaAnalysis';
import { MuhurthaCalculator } from '@/components2/ui/MuhurthaCalculator';
import Image from 'next/image';
import { ZodiacCalculator } from '@/components2/ui/ZodiacCalculator';
import { PlanetData } from '@/components2/ui/PlanetData';
import { HouseData } from '@/components2/ui/HouseData';
import { PanchangTable } from '@/components2/ui/PanchangTable';
import { HoroscopeChat } from '@/components2/ui/HoroscopeChat';
import { BirthTimeRectification } from '@/components2/ui/BirthTimeRectification';
import { YogaAnalysis } from '@/components2/ui/YogaAnalysis';
import { ArudhaLagnaAnalysis } from '@/components2/ui/ArudhaLagnaAnalysis';
import { EclipsePredictions } from '@/components2/ui/EclipsePredictions';
import { DivisionalChartsAnalysis } from '@/components2/ui/DivisionalChartsAnalysis';
import { EventsPrediction } from '@/components2/ui/EventsPrediction';
import { TransitAnalysis } from '@/components2/ui/TransitAnalysis';
import { GhatakaChakra } from '@/components2/ui/GhatakaChakra';
import { ResidentialStrength } from '@/components2/ui/ResidentialStrength';
import { PanchakaAnalysis } from '@/components2/ui/PanchakaAnalysis';
import { UpachayaAnalysis } from '@/components2/ui/UpachayaAnalysis';
import { PlanetOwnSignAnalysis } from '@/components2/ui/PlanetOwnSignAnalysis';
import { PanchaPakshiAnalysis } from '@/components2/ui/PanchaPakshiAnalysis';
import { PlanetaryStrengthAnalysis } from '@/components2/ui/PlanetaryStrengthAnalysis';
import { ShadbalaAnalysis } from '@/components2/ui/ShadbalaAnalysis';
import { BirthDestinyCalculator } from '@/components2/ui/BirthDestinyCalculator';
import { YoniKutaCalculator } from '@/components2/ui/YoniKutaCalculator';
import { NameNumberPrediction } from '@/components2/ui/NameNumberPrediction';

export default function HoroscopePage() {
  const [chartData, setChartData] = useState<string | null>(null);
  const [southChartData, setSouthChartData] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('north');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    location: '',
    time: '',
    date: '',
    timezone: '',
  });

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const fetchChartData = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { location, time, date, timezone } = formData;
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      // Fetch North Indian Chart
      const northUrl = `https://vedastro.azurewebsites.net/api/Calculate/NorthIndianChart/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}/ChartType/RasiD1/Ayanamsa/LAHIRI`;
      const southUrl = `https://vedastro.azurewebsites.net/api/Calculate/SouthIndianChart/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}/ChartType/RasiD1/Ayanamsa/LAHIRI`;
      
      const [northResponse, southResponse] = await Promise.all([
        fetch(northUrl),
        fetch(southUrl)
      ]);
  
      if (!northResponse.ok || !southResponse.ok) {
        throw new Error(`HTTP error: Status ${northResponse.status}`);
      }
  
      const northSvgText = await northResponse.text();
      const southSvgText = await southResponse.text();
      
      setChartData(northSvgText);
      setSouthChartData(southSvgText);
    } catch (err:any) {
      setError(err.message);
      setChartData(null);
      setSouthChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const getSouthIndianChartUrl = () => {
    const { location, time, date, timezone } = formData;
    const [year, month, day] = date.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    return `https://vedastro.azurewebsites.net/api/Calculate/SouthIndianChart/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}/ChartType/RasiD1/Ayanamsa/LAHIRI`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sacred-sandal via-white to-sacred-saffron/10 relative overflow-hidden">
      {/* Sacred Mandala Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/mandala-pattern.png')] bg-repeat opacity-20" />
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-sacred-gold rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-sacred-vermilion rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-sacred-copper rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <BackgroundBeams className="opacity-25" />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-16">
          {/* Sanskrit Title with Decorative Circle */}
          <div className="relative inline-block mb-6">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-full px-8 py-2 border-2 border-sacred-gold/20
                          shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)]
                          transition-all duration-500">
              <motion.span 
                className="inline-block text-lg md:text-xl bg-gradient-to-r from-sacred-copper via-sacred-gold to-sacred-vermilion
                           bg-clip-text text-transparent font-semibold tracking-wide"
                whileHover={{ scale: 1.05 }}
              >
                <span className="animate-glow inline-block">🕉️</span>
                <span className="mx-2">ज्योतिष शास्त्र</span>
                <span className="animate-glow inline-block">🕉️</span>
              </motion.span>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative h-[40px] w-full mb-8">
            <SparklesCore background="transparent" minSize={0.4} maxSize={1} particleDensity={1200} className="w-full h-full" particleColor="#ff8303" />
          </motion.div>
          
          <h2 className="text-5xl font-bold mb-6 relative inline-block">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper animate-sacred-shimmer bg-[length:200%_auto]">
              Vedic Astrology Tools
            </span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper rounded-full"></div>
          </h2>
        </div>

        <div className="max-w-[1300px] mx-auto space-y-16">
          {/* Add HoroscopeChat before other calculators */}
          {/* <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <HoroscopeChat />
          </motion.section> */}

          {/* Add PanchangTable */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <PanchangTable />
          </motion.section>

          {/* Add BirthTimeRectification */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <BirthTimeRectification />
          </motion.section>

          {/* Add BirthDestinyCalculator */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <BirthDestinyCalculator />
          </motion.section>

          {/* Add YoniKutaCalculator */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <YoniKutaCalculator />
          </motion.section>

          {/* Add NameNumberPrediction */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <NameNumberPrediction />
          </motion.section>

          {/* Calculator Sections with Enhanced UI */}
          {[
            { title: "Ashtakavarga Calculator", icon: "🔮", component: <AshtakavargaAnalysis /> },
            { title: "Numerology Calculator", icon: "🎯", component: <NumerologyCalculator /> },
            { title: "Muhurtha Calculator", icon: "⏰", component: <MuhurthaCalculator /> }
          ].map((section, index) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                            border border-sacred-gold/20 hover:shadow-2xl hover:shadow-sacred-gold/20
                            transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <h2 className="text-3xl font-bold mb-8 text-sacred-copper flex items-center gap-3">
                  {section.icon} {section.title}
                </h2>
                {section.component}
              </div>
            </motion.section>
          ))}

          {/* Chart Generation Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="relative"
          >
            {/* ... Rest of the chart generation section with existing functionality ... */}
            {/* Update the form styling to match the theme */}
            <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                          border border-sacred-gold/20">
              <h2 className="text-3xl font-bold mb-8 text-sacred-copper flex items-center gap-3">
                🌟 Astrological Charts
              </h2>
              <form onSubmit={fetchChartData} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Enhanced form inputs */}
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
                <input
                  type="text"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  placeholder="Timezone"
                  className="p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                           focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                           transition-all duration-300"
                  required
                />
                <button
                  type="submit"
                  className="md:col-span-2 bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                           text-white font-semibold py-3 px-6 rounded-lg
                           hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                           transition-all duration-300"
                >
                  Generate Sacred Charts
                </button>
              </form>
              
              {loading && <div className="mt-4 text-center">Loading chart data...</div>}
              {error && <div className="mt-4 text-red-500">Error: {error}</div>}
              {(chartData || southChartData) && (
                <div className="mt-8">
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => setActiveTab('north')}
                      className={`px-4 py-2 rounded ${activeTab === 'north' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                    >
                      North Indian Chart
                    </button>
                    <button
                      onClick={() => setActiveTab('south')}
                      className={`px-4 py-2 rounded ${activeTab === 'south' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
                    >
                      South Indian Chart
                    </button>
                  </div>
                  <div className="bg-white rounded-lg p-4 overflow-auto">
                    {activeTab === 'north' && chartData && (
                      <div 
                        dangerouslySetInnerHTML={{ __html: chartData }} 
                        className="w-full flex justify-center"
                      />
                    )}
                    {activeTab === 'south' && southChartData && (
                      <div 
                        dangerouslySetInnerHTML={{ __html: southChartData }} 
                        className="w-full flex justify-center"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
            <HouseData />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative"
          >
            <PlanetData />
          </motion.section>

          {/* Add Yoga Analysis */}
          <YogaAnalysis />

          {/* Add Arudha Lagna Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <ArudhaLagnaAnalysis />
          </motion.section>

          {/* Add Eclipse Predictions */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <EclipsePredictions />
          </motion.section>

          {/* Add Divisional Charts Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <DivisionalChartsAnalysis />
          </motion.section>

          {/* Add Events Prediction */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <EventsPrediction />
          </motion.section>

          {/* Add Transit Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <TransitAnalysis />
          </motion.section>

          {/* Add Ghataka Chakra */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <GhatakaChakra />
          </motion.section>

          {/* Add Residential Strength */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <ResidentialStrength />
          </motion.section>

          {/* Add Panchaka Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <PanchakaAnalysis />
          </motion.section>

          {/* Add Upachaya Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <UpachayaAnalysis />
          </motion.section>

          {/* Add Planet Own Sign Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <PlanetOwnSignAnalysis />
          </motion.section>

          {/* Add Pancha Pakshi Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <PanchaPakshiAnalysis />
          </motion.section>

          {/* Add Planetary Strength Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <PlanetaryStrengthAnalysis />
          </motion.section>

          {/* Add Shadbala Analysis */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="relative"
          >
            <ShadbalaAnalysis />
          </motion.section>
        </div>
      </div>
    </main>
  );
}
