'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Clock } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Prediction {
    type: string;
    description: string;
    strength?: string;
    period?: string;
}

interface ZodiacData {
  signName: string;
  signDetails: {
    element: string;
    quality: string;
    symbol: string;
    rulingPlanet: string;
    luckyGemstone: string;
  };
  positions: {
    houses: Array<{
      houseNumber: number;
      signPlaced: string;
      planets: string[];
    }>;
    planets: Array<{
      name: string;
      sign: string;
      degree: string;
      isRetrograde: boolean;
    }>;
  };
  predictions: {
    yogas: Prediction[];
    planetaryPeriods: Prediction[];
    signLordEffects: Prediction[];
  };
}

export const ZodiacCalculator = () => {
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState('12:00');
    const [formData, setFormData] = useState({
        zodiacSign: 'Aries',
        location: '',
        timezone: '',
    });
    const [result, setResult] = useState<ZodiacData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const zodiacSigns = [
        'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;
        
        setLoading(true);
        setError(null);

        try {
            const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            const url = `https://vedastro.azurewebsites.net/api/Calculate/AllZodiacSignData/ZodiacName/${formData.zodiacSign}/Location/${encodeURIComponent(formData.location)}/Time/${time}/${formattedDate}/${formData.timezone}/?includePredictions=true`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch zodiac data');
            
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div 
                className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-lg border border-orange-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <select
                                name="zodiacSign"
                                value={formData.zodiacSign}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm"
                                required
                            >
                                {zodiacSigns.map(sign => (
                                    <option key={sign} value={sign}>{sign}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm"
                                required
                            />

                            <input
                                type="text"
                                name="timezone"
                                value={formData.timezone}
                                placeholder="Timezone (e.g. +05:30)"
                                onChange={handleInputChange}
                                className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="calendar-wrapper rounded-lg overflow-hidden shadow-md bg-white">
                                <Calendar
                                    onChange={(value) => setDate(value instanceof Date ? value : null)}
                                    value={date}
                                    className="border-none w-full"
                                    tileClassName="text-gray-800 hover:bg-orange-100"
                                />
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Selected Date & Time
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-lg font-medium text-gray-900">
                                        {date ? date.toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Select date'}
                                    </div>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="p-2 border-2 border-orange-200 rounded-lg
                                                focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading || !date}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-4 rounded-lg font-medium text-base transition-all duration-200 
                                bg-gradient-to-r from-sacred-vermilion via-sacred-gold to-sacred-copper
                                text-white shadow-lg hover:shadow-xl disabled:opacity-50 
                                disabled:cursor-not-allowed"
                    >
                        <span className="flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Clock className="w-5 h-5" />
                                    Calculate Zodiac Data
                                </>
                            )}
                        </span>
                    </motion.button>
                </form>
            </motion.div>

            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            
            {result && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg"
                >
                    <h3 className="text-2xl font-bold text-sacred-copper mb-4">
                        {formData.zodiacSign} Analysis
                    </h3>
                    <div className="grid gap-4">
                        <div className="border-b border-sacred-gold/20 pb-2">
                            <h4 className="font-semibold">Sign Details</h4>
                            <p><span className="font-medium">Element:</span> {result.signDetails?.element || 'N/A'}</p>
                            <p><span className="font-medium">Quality:</span> {result.signDetails?.quality || 'N/A'}</p>
                            <p><span className="font-medium">Symbol:</span> {result.signDetails?.symbol || 'N/A'}</p>
                            <p><span className="font-medium">Ruling Planet:</span> {result.signDetails?.rulingPlanet || 'N/A'}</p>
                            <p><span className="font-medium">Lucky Gemstone:</span> {result.signDetails?.luckyGemstone || 'N/A'}</p>
                        </div>

                        {result.positions?.planets && (
                            <div className="border-b border-sacred-gold/20 pb-2">
                                <h4 className="font-semibold mb-2">Planetary Positions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {result.positions.planets.map((planet, idx) => (
                                        <div key={idx} className="bg-white/50 p-2 rounded">
                                            <span className="font-medium">{planet.name}:</span>{' '}
                                            {planet.sign} @ {planet.degree}
                                            {planet.isRetrograde && ' (R)'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.positions?.houses && (
                            <div>
                                <h4 className="font-semibold mb-2">House Positions</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {result.positions.houses.map((house, idx) => (
                                        <div key={idx} className="bg-white/50 p-2 rounded">
                                            <span className="font-medium">House {house.houseNumber}:</span>{' '}
                                            {house.signPlaced}
                                            {house.planets.length > 0 && (
                                                <p className="text-sm text-gray-600">
                                                    Planets: {house.planets.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.predictions && (
                            <div className="mt-6 space-y-4">
                                <h4 className="text-xl font-semibold text-sacred-copper">Predictions</h4>
                                
                                {result.predictions.yogas && result.predictions.yogas.length > 0 && (
                                    <div className="border-b border-sacred-gold/20 pb-4">
                                        <h5 className="font-medium mb-2">Yoga Effects</h5>
                                        <div className="grid gap-2">
                                            {result.predictions.yogas.map((yoga, idx) => (
                                                <div key={idx} className="bg-white/50 p-3 rounded">
                                                    <p className="font-medium text-sacred-vermilion">{yoga.type}</p>
                                                    <p className="text-gray-700">{yoga.description}</p>
                                                    {yoga.strength && (
                                                        <p className="text-sm text-sacred-copper">Strength: {yoga.strength}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.predictions.planetaryPeriods && (
                                    <div className="border-b border-sacred-gold/20 pb-4">
                                        <h5 className="font-medium mb-2">Planetary Periods</h5>
                                        <div className="grid gap-2">
                                            {result.predictions.planetaryPeriods.map((period, idx) => (
                                                <div key={idx} className="bg-white/50 p-3 rounded">
                                                    <p className="font-medium text-sacred-vermilion">{period.type}</p>
                                                    <p className="text-gray-700">{period.description}</p>
                                                    {period.period && (
                                                        <p className="text-sm text-sacred-copper">Duration: {period.period}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {result.predictions.signLordEffects && (
                                    <div>
                                        <h5 className="font-medium mb-2">Sign Lord Effects</h5>
                                        <div className="grid gap-2">
                                            {result.predictions.signLordEffects.map((effect, idx) => (
                                                <div key={idx} className="bg-white/50 p-3 rounded">
                                                    <p className="font-medium text-sacred-vermilion">{effect.type}</p>
                                                    <p className="text-gray-700">{effect.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};
