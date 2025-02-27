"use client";
import React, { useEffect, useState } from "react";
import Script from "next/script";

/* Added global type declarations for AstroTable */
declare global {
  interface AstroTableSettings {
    ElementID: string;
    KeyColumn: string;
    ShowHeader: boolean;
    HeaderIcon: string;
    ColumnData: { Api: string; Enabled: boolean; Name: string }[];
    EnableSorting: boolean;
    SaveSettings: boolean;
  }
  interface AstroTableConstructor {
    new (settings: AstroTableSettings): void;
  }
  interface Window {
    AstroTable?: AstroTableConstructor;
  }
}

export default function HoroscopePage() {
  // State for user input details
  const [userDetails, setUserDetails] = useState({
    name: "",
    dob: "",
    time: "",
    place: "",
  });

  // Flag to track form submission.
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with:", userDetails);

    try {
      // Calling our Node backend route that will proxy to the Dockerized API endpoint:
      const response = await fetch("/api/v1/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
      const data = await response.json();
      console.log("Horoscope data from backend:", data);
      // Optionally update your state with this data to use it in AstroTable or for rendering.
    } catch (error) {
      console.error("Error fetching horoscope data:", error);
    }

    setIsSubmitted(true);
  };

  // Initialize the AstroTable after the form is submitted
  useEffect(() => {
    if (isSubmitted) {
      console.log("Attempting to generate horoscope...");
      if (typeof window !== "undefined" && window.AstroTable) {
        console.log("AstroTable is available, initializing the horoscope table.");

        // Define the columns for the planetary data table.
        const planetColumns = [
          { Api: "PlanetZodiacSign", Enabled: true, Name: "Sign" },
          { Api: "PlanetConstellation", Enabled: true, Name: "Star" },
          { Api: "PlanetLordOfZodiacSign", Enabled: true, Name: "Sign Lord" },
          { Api: "PlanetLordOfConstellation", Enabled: true, Name: "Star Lord" },
          { Api: "PlanetSubLordKP", Enabled: true, Name: "Sub Lord" },
          { Api: "Empty", Enabled: false, Name: "Empty" },
        ];

        // Configure the settings for the AstroTable.
        const settings = {
          ElementID: "PlanetDataTable",
          KeyColumn: "Planet",
          ShowHeader: true,
          HeaderIcon: "twemoji:ringed-planet",
          ColumnData: planetColumns,
          EnableSorting: false,
          SaveSettings: false,
        };

        // Clear any existing content in the container before re-rendering the table.
        const container = document.getElementById("PlanetDataTable");
        if (container) {
          container.innerHTML = "";
        }

        // Create a new AstroTable instance using the declared type.
        new window.AstroTable(settings);
      } else {
        console.error("AstroTable is not available yet. Ensure the VedAstro script is loaded.");
      }
    }
  }, [isSubmitted, userDetails]);

  return (
    <>
      {/* Load jQuery and VedAstro from CDN before the page renders */}
      <Script
        src="https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://vedastro.org/js/VedAstro.js"
        strategy="beforeInteractive"
      />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Horoscope Chart</h1>

        {/* User Input Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block font-medium" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userDetails.name}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium" htmlFor="dob">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={userDetails.dob}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium" htmlFor="time">
              Time of Birth
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={userDetails.time}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium" htmlFor="place">
              Place of Birth
            </label>
            <input
              type="text"
              id="place"
              name="place"
              value={userDetails.place}
              onChange={handleInputChange}
              className="mt-1 p-2 border rounded w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded"
          >
            Generate Horoscope
          </button>
        </form>

        {/* This div will be populated by VedAstro's AstroTable */}
        <div id="PlanetDataTable" className="border p-4"></div>
      </div>
    </>
  );
}
