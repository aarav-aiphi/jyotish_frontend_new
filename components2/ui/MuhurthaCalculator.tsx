'use client'

import React, { useState } from 'react';
import * as motion from "framer-motion/client";
import { Loader2, Clock } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export function MuhurthaCalculator() {
    const [date, setDate] = useState<Date | null>(null);
    const [time, setTime] = useState('12:00');
    const [results, setResults] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const checkMuhurtha = async () => {
        if (!date) return;
        
        setLoading(true);
        try {
            const [hours, minutes] = time.split(':');
            const dateTime = new Date(date);
            dateTime.setHours(parseInt(hours), parseInt(minutes));
            
            const endpoints = [
                'travel', 
                'marriage', 
                'housewarming', 
                'education', 
                'business', 
                'property', 
                'vehicle-purchase', 
                'construction', 
                'naming-ceremony', 
                'partnership', 
                'house-entry'
            ];
            const results: Record<string, boolean> = {};

            for (const endpoint of endpoints) {
                const response = await fetch(`/api/muhurtha/${endpoint}?dateTime=${encodeURIComponent(dateTime.toISOString())}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(`${endpoint} response:`, data); // Add this for debugging
                results[endpoint] = data.isAuspicious; // Match the exact property name from backend
            }

            setResults(results);
        } catch (error) {
            console.error('Error checking muhurtha:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (activity: string) => {
        switch (activity) {
            case 'travel': return '✈️';
            case 'marriage': return '💍';
            case 'housewarming': return '🏡';
            case 'education': return '📚';
            case 'business': return '💼';
            case 'property': return '🏘️';
            case 'vehicle-purchase': return '🚗';
            case 'construction': return '🏗️';
            case 'naming-ceremony': return '👶';
            case 'partnership': return '🤝';
            case 'house-entry': return '🔑';
            default: return '📅';
        }
    };

    const getActivityDescription = (activity: string, isGood: boolean) => {
        if (isGood) {
            switch (activity) {
                case 'travel': return 'Excellent time for journeys';
                case 'marriage': return 'Highly auspicious for wedding ceremonies';
                case 'housewarming': return 'Favorable for house warming ceremony';
                case 'education': return 'Perfect for starting education';
                case 'business': return 'Favorable for business ventures';
                case 'property': return 'Auspicious for property matters';
                case 'vehicle-purchase': return 'Good time to purchase vehicles';
                case 'construction': return 'Favorable for starting construction';
                case 'naming-ceremony': return 'Auspicious for naming ceremony';
                case 'partnership': return 'Good for starting partnerships';
                case 'house-entry': return 'Auspicious for moving into new house';
                default: return 'Auspicious timing';
            }
        } else {
            return 'Consider choosing another time';
        }
    };

    return (
        <div className="space-y-8">
            <motion.div 
                className="p-4 sm:p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-lg border border-orange-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Select Date and Time</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="calendar-wrapper rounded-lg overflow-hidden shadow-md">
                                <Calendar
                                    onChange={(value) => setDate(value instanceof Date ? value : null)}
                                    value={date}
                                    className="border-none w-full"
                                    tileClassName="text-gray-800 hover:bg-orange-100"
                                />
                            </div>
                            <div className="space-y-4">
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
                                        }) : 'Please select a date'}
                                    </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Select Time
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full p-2 border-2 border-orange-200 rounded-lg
                                                focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        onClick={checkMuhurtha}
                        disabled={loading || !date}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg font-medium text-base transition-all duration-200 
                                ${loading ? 'bg-orange-400' : 'bg-gradient-to-r from-orange-500 to-amber-500'}
                                text-white shadow-lg hover:shadow-xl disabled:opacity-50 
                                disabled:cursor-not-allowed w-full`}
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
                                    Check Muhurtha
                                </>
                            )}
                        </span>
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
                {Object.keys(results).length > 0 && (
                    Object.entries(results).map(([activity, isGood], index) => (
                        <motion.div
                            key={activity}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                            className={`p-6 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-300
                                ${isGood 
                                    ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200' 
                                    : 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 border-2 border-red-200'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">{getActivityIcon(activity)}</div>
                                <div className="flex-1">
                                    <h3 className="capitalize font-semibold text-gray-800 text-lg mb-1">
                                        {activity}
                                    </h3>
                                    <p className={`text-sm ${isGood ? 'text-green-700' : 'text-red-700'}`}>
                                        {getActivityDescription(activity, isGood)}
                                    </p>
                                    <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                        ${isGood 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'}`}>
                                        {isGood ? '✨ Auspicious' : '⚠️ Inauspicious'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
}

// Add these styles to your global CSS file
const styles = `
.calendar-wrapper .react-calendar {
    width: 100%;
    background-color: white;
    border-radius: 0.5rem;
    padding: 1rem;
    font-family: inherit;
}

.calendar-wrapper .react-calendar__tile--active {
    background: #f97316 !important;
    color: white;
}

.calendar-wrapper .react-calendar__tile--now {
    background: #fed7aa;
}

.calendar-wrapper .react-calendar__tile:enabled:hover,
.calendar-wrapper .react-calendar__tile:enabled:focus {
    background-color: #ffedd5;
}

.calendar-wrapper .react-calendar__navigation button:enabled:hover,
.calendar-wrapper .react-calendar__navigation button:enabled:focus {
    background-color: #ffedd5;
}

.calendar-wrapper .react-calendar__tile--active:enabled:hover,
.calendar-wrapper .react-calendar__tile--active:enabled:focus {
    background: #ea580c;
}
`;
