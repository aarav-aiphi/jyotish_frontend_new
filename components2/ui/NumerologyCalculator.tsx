'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface NumerologyResult {
    lifePath: number;
    destiny: number;
    soul: number;
    personality: number;
    birthDay: number;
    description: string;
}

export function NumerologyCalculator() {
    const [name, setName] = useState('');
    const [date, setDate] = useState<Date | null>(null);
    const [prediction, setPrediction] = useState<NumerologyResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateNumber = (str: string): number => {
        const sum = str.toLowerCase()
            .split('')
            .map(char => char.charCodeAt(0) - 96)
            .filter(num => num > 0 && num <= 26)
            .reduce((acc, curr) => acc + curr, 0);

        // Reduce to single digit
        let result = sum;
        while (result > 9) {
            result = String(result)
                .split('')
                .reduce((acc, curr) => acc + parseInt(curr), 0);
        }
        return result;
    };

    const getLifePathNumber = (date: Date): number => {
        const dateStr = date.getFullYear().toString() + 
                      (date.getMonth() + 1).toString().padStart(2, '0') + 
                      date.getDate().toString().padStart(2, '0');
        return calculateNumber(dateStr);
    };

    const calculateNumerology = async () => {
        if (!date) return;
        setLoading(true);
        setError('');
        try {
            const lifePath = getLifePathNumber(date);
            const destiny = calculateNumber(name);
            const soul = calculateNumber(name.toLowerCase().replace(/[^aeiou]/g, ''));
            const personality = calculateNumber(name.toLowerCase().replace(/[aeiou]/g, ''));
            const birthDay = date.getDate();

            const getDescription = (number: number): string => {
                const descriptions: Record<number, string> = {
                    1: "Natural born leader, independent and ambitious",
                    2: "Diplomatic, sensitive and cooperative",
                    3: "Creative, expressive and optimistic",
                    4: "Practical, trustworthy and hardworking",
                    5: "Adventurous, versatile and freedom-loving",
                    6: "Nurturing, responsible and caring",
                    7: "Analytical, spiritual and scholarly",
                    8: "Successful, material-focused and powerful",
                    9: "Humanitarian, compassionate and giving"
                };
                return descriptions[number] || "Your path is unique and special";
            };

            setPrediction({
                lifePath,
                destiny,
                soul,
                personality,
                birthDay,
                description: getDescription(lifePath)
            });
            
        } catch (err: any) {
            console.error('Numerology calculation error:', err);
            setError('Error calculating numerology. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <motion.div 
                className="p-4 sm:p-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-lg border border-amber-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="block text-base font-semibold text-gray-700">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 p-4 text-base bg-white border-2 border-amber-200 rounded-lg 
                                         focus:ring-2 focus:ring-amber-500 focus:border-transparent transition
                                         shadow-sm hover:border-amber-300"
                                placeholder="Enter your full name"
                                style={{ minHeight: '50px' }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-base font-semibold text-gray-700">Date of Birth</label>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="calendar-wrapper rounded-lg overflow-hidden shadow-md">
                                <Calendar
                                    onChange={(value) => setDate(value instanceof Date ? value : null)}
                                    value={date}
                                    className="border-none w-full"
                                    tileClassName="text-gray-800 hover:bg-amber-100"
                                    maxDate={new Date()}
                                />
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                                <label className="block text-sm font-medium text-gray-700">
                                    Selected Date
                                </label>
                                <div className="text-lg font-medium text-gray-900">
                                    {date ? date.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'Please select your birth date'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-200"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        onClick={calculateNumerology}
                        disabled={loading || !name || !date}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-lg font-medium text-base transition-all duration-200 
                                ${loading ? 'bg-amber-400' : 'bg-gradient-to-r from-amber-500 to-yellow-500'}
                                text-white shadow-lg hover:shadow-xl disabled:opacity-50 
                                disabled:cursor-not-allowed`}
                        style={{ minHeight: '50px' }}
                    >
                        <span className="flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Calculating...
                                </>
                            ) : (
                                'Calculate Numerology'
                            )}
                        </span>
                    </motion.button>
                </div>
            </motion.div>

            {prediction && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-amber-200"
                >
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-amber-900">Your Numerology Reading</h3>
                        <div className="grid gap-4">
                            {Object.entries(prediction).map(([key, value]) => (
                                key !== 'success' && (
                                    <div key={key} className="space-y-1">
                                        <h4 className="font-medium text-amber-800 capitalize">
                                            {key.replace(/_/g, ' ')}
                                        </h4>
                                        <p className="text-gray-700">{String(value)}</p>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}