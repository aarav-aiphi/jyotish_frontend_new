'use client'

// Using:
// - /api/Calculate/DasaForLife
// - /api/Calculate/DasaAtRange
// - /api/Calculate/DasaAtTime
// - /api/Calculate/DasaForNow

interface DashaResponse {
  Status: string;
  Payload: {
    CurrentDasha: {
      Planet: string;
      StartDate: string;
      EndDate: string;
      Effects: string[];
    };
    SubPeriods: Array<{
      Planet: string;
      Duration: string;
      Predictions: string[];
    }>;
  }
} 