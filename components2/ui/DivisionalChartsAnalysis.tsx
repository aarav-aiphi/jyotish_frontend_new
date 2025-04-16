'use client'

import { useState } from 'react';
import { motion } from 'framer-motion';

interface HouseSign {
  House: string;
  AllHouseNavamshaSign: string;
  AllHouseDashamamshaSign: string;
  Planets?: string[];
  Aspects?: string[];
  Strength?: number;
}

type ChartType = 'navamsha' | 'dashamsha' | 'saptamsha' | 'drekkana' | 'chaturthansa';

interface DivisionalChartResponse {
  Status: string;
  Payload: {
    [key: string]: HouseSign[];
  }
}

// Add planetary interpretations
const planetaryInfluences = {
  Sun: {
    navamsha: "Indicates spouse's status and self-expression in marriage",
    dashamsha: "Career authority and leadership potential"
  },
  Moon: {
    navamsha: "Emotional compatibility and domestic harmony",
    dashamsha: "Public image and professional popularity"
  },
  Mars: {
    navamsha: "Physical attraction and marital energy",
    dashamsha: "Professional drive and competitive spirit"
  },
  Mercury: {
    navamsha: "Communication in marriage and intellectual compatibility",
    dashamsha: "Business acumen and professional skills"
  },
  Jupiter: {
    navamsha: "Marital wisdom and spiritual growth",
    dashamsha: "Career growth and professional wisdom"
  },
  Venus: {
    navamsha: "Romance and marital happiness",
    dashamsha: "Artistic career and professional relationships"
  },
  Saturn: {
    navamsha: "Marital responsibilities and commitment",
    dashamsha: "Professional discipline and long-term career"
  }
};

// Update the divisionalChartMeanings with complete house interpretations
const divisionalChartMeanings = {
  navamsha: {
    title: "Navamsha (D-9)",
    description: "Marriage, spouse, and spiritual life. This chart reveals the quality of marriage, spiritual evolution, and dharmic path.",
    houses: {
      House1: {
        meaning: "Personality in marriage and spiritual pursuits",
        strongPoints: ["Self-expression in relationship", "Spiritual identity"],
        challenges: ["Personal boundaries", "Self-awareness in marriage"],
        remedies: ["Self-development practices", "Meditation"]
      },
      House2: {
        meaning: "Family wealth and marital resources",
        strongPoints: ["Financial stability in marriage", "Shared values"],
        challenges: ["Resource management", "Value conflicts"],
        remedies: ["Joint financial planning", "Value alignment"]
      },
      House3: {
        meaning: "Communication and short journeys in marriage",
        strongPoints: ["Effective communication", "Mutual understanding"],
        challenges: ["Misunderstandings", "Sibling relationships"],
        remedies: ["Active listening practice", "Clear expression"]
      },
      House4: {
        meaning: "Domestic happiness and emotional security",
        strongPoints: ["Emotional bonding", "Home harmony"],
        challenges: ["Family dynamics", "Emotional stability"],
        remedies: ["Creating sacred space", "Family rituals"]
      },
      House5: {
        meaning: "Romance, children, and creative expression",
        strongPoints: ["Romantic connection", "Creative sharing"],
        challenges: ["Parenting issues", "Creative blocks"],
        remedies: ["Quality time together", "Shared hobbies"]
      },
      House6: {
        meaning: "Daily routine and health in marriage",
        strongPoints: ["Service to partner", "Health awareness"],
        challenges: ["Daily conflicts", "Health management"],
        remedies: ["Establishing routines", "Health practices"]
      },
      House7: {
        meaning: "Partnership and relationship dynamics",
        strongPoints: ["Partnership quality", "Mutual growth"],
        challenges: ["Power dynamics", "Relationship balance"],
        remedies: ["Couples counseling", "Partnership activities"]
      },
      House8: {
        meaning: "Transformation and joint resources",
        strongPoints: ["Deep bonding", "Shared resources"],
        challenges: ["Trust issues", "Financial secrets"],
        remedies: ["Open communication", "Joint planning"]
      },
      House9: {
        meaning: "Higher learning and spiritual growth together",
        strongPoints: ["Spiritual connection", "Shared beliefs"],
        challenges: ["Philosophical differences", "Religious conflicts"],
        remedies: ["Spiritual practices", "Learning together"]
      },
      House10: {
        meaning: "Social status and reputation in marriage",
        strongPoints: ["Public image", "Career support"],
        challenges: ["Social pressure", "Career-marriage balance"],
        remedies: ["Social engagement", "Career planning"]
      },
      House11: {
        meaning: "Friends, hopes, and aspirations in marriage",
        strongPoints: ["Social network", "Shared goals"],
        challenges: ["Friend circles", "Goal alignment"],
        remedies: ["Social activities", "Goal setting"]
      },
      House12: {
        meaning: "Spiritual connection and sacrifice",
        strongPoints: ["Spiritual bond", "Selfless service"],
        challenges: ["Hidden issues", "Sacrifice balance"],
        remedies: ["Meditation together", "Spiritual retreats"]
      }
    }
  },
  dashamsha: {
    title: "Dashamsha (D-10)",
    description: "Career and professional life. This chart shows career potential, professional achievements, and work environment.",
    houses: {
      House1: {
        meaning: "Professional identity and career direction",
        strongPoints: ["Leadership abilities", "Professional image"],
        challenges: ["Career direction", "Professional identity"],
        remedies: ["Skill development", "Personal branding"]
      },
      House2: {
        meaning: "Career earnings and professional resources",
        strongPoints: ["Earning capacity", "Resource management"],
        challenges: ["Financial stability", "Resource allocation"],
        remedies: ["Financial planning", "Investment in skills"]
      },
      House3: {
        meaning: "Professional communication and skills",
        strongPoints: ["Communication skills", "Networking"],
        challenges: ["Information flow", "Skill gaps"],
        remedies: ["Communication training", "Skill updates"]
      },
      House4: {
        meaning: "Work environment and job satisfaction",
        strongPoints: ["Workplace comfort", "Job stability"],
        challenges: ["Work-life balance", "Office politics"],
        remedies: ["Workspace optimization", "Team building"]
      },
      House5: {
        meaning: "Creative expression and leadership",
        strongPoints: ["Innovation", "Management skills"],
        challenges: ["Creative blocks", "Team management"],
        remedies: ["Creative workshops", "Leadership training"]
      },
      House6: {
        meaning: "Work responsibilities and health",
        strongPoints: ["Service excellence", "Health management"],
        challenges: ["Work stress", "Health issues"],
        remedies: ["Stress management", "Health routines"]
      },
      House7: {
        meaning: "Business partnerships and clients",
        strongPoints: ["Partnership potential", "Client relations"],
        challenges: ["Partnership issues", "Client management"],
        remedies: ["Partnership building", "Client service"]
      },
      House8: {
        meaning: "Professional transformations and research",
        strongPoints: ["Research abilities", "Transformation skills"],
        challenges: ["Career changes", "Hidden obstacles"],
        remedies: ["Research development", "Change management"]
      },
      House9: {
        meaning: "Higher education and professional growth",
        strongPoints: ["Learning capacity", "Teaching ability"],
        challenges: ["Educational gaps", "Growth barriers"],
        remedies: ["Advanced studies", "Teaching opportunities"]
      },
      House10: {
        meaning: "Career success and authority",
        strongPoints: ["Professional success", "Authority"],
        challenges: ["Career pressure", "Authority issues"],
        remedies: ["Career planning", "Leadership development"]
      },
      House11: {
        meaning: "Professional network and income",
        strongPoints: ["Network building", "Income sources"],
        challenges: ["Network limitations", "Income blocks"],
        remedies: ["Networking events", "Income diversification"]
      },
      House12: {
        meaning: "Career sacrifices and hidden potential",
        strongPoints: ["Behind-scenes work", "Research"],
        challenges: ["Hidden enemies", "Career sacrifices"],
        remedies: ["Strategic planning", "Spiritual balance"]
      }
    }
  }
};

export function DivisionalChartsAnalysis() {
  const [results, setResults] = useState<DivisionalChartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState('navamsha');
  
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

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchDivisionalCharts = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { location, time, date, timezone } = formData;
      
      if (!location || !time || !date || !timezone) {
        throw new Error('Please fill in all required fields');
      }

      const formattedDate = formatDate(date);
      
      // Fetch both D-9 and D-10 data
      const responses = await Promise.all([
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/AllHouseNavamshaSign/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`),
        fetch(`https://vedastro.azurewebsites.net/api/Calculate/AllHouseDashamamshaSign/Location/${encodeURIComponent(location)}/Time/${time}/${formattedDate}/${timezone}`)
      ]);
      
      const [navamshaData, dashamamshaData] = await Promise.all(
        responses.map(res => res.json())
      );

      setResults({
        Status: "Pass",
        Payload: {
          AllHouseNavamshaSign: navamshaData.Payload.AllHouseNavamshaSign,
          AllHouseDashamamshaSign: dashamamshaData.Payload.AllHouseDashamamshaSign
        }
      });
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (chartType: string) => {
    if (!results?.Payload) return [];
    const key = `AllHouse${chartType.charAt(0).toUpperCase() + chartType.slice(1)}Sign`;
    return results.Payload[key] || [];
  };

  const HouseCard = ({ house, chartType }: { house: HouseSign; chartType: string }) => {
    const interpretation = divisionalChartMeanings[chartType as keyof typeof divisionalChartMeanings]
      ?.houses[house.House as keyof typeof divisionalChartMeanings.navamsha.houses];

    // Get the correct sign based on chart type
    const getHouseSign = () => {
      if (chartType === 'navamsha') {
        return house.AllHouseNavamshaSign;
      } else if (chartType === 'dashamsha') {
        return house.AllHouseDashamamshaSign;
      }
      return '';
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 rounded-lg p-4 shadow-md hover:shadow-lg transition-all"
      >
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-sacred-copper">
            {house.House}
          </h4>
          <span className="text-xs bg-sacred-gold/10 px-2 py-1 rounded-full text-sacred-copper">
            {chartType === 'navamsha' ? 'D-9' : 'D-10'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 font-medium">
          {getHouseSign()}
        </p>
        
        {/* Interpretation */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-sacred-copper border-l-2 border-sacred-gold/50 pl-2">
            {interpretation?.meaning}
          </p>
          
          {/* Strong Points */}
          <div className="text-xs">
            <span className="text-green-600 font-medium flex items-center gap-1">
              <span className="text-green-500">●</span> Strong Points
            </span>
            <ul className="mt-1 space-y-1 pl-4">
              {interpretation?.strongPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges */}
          <div className="text-xs">
            <span className="text-red-600 font-medium flex items-center gap-1">
              <span className="text-red-500">●</span> Challenges
            </span>
            <ul className="mt-1 space-y-1 pl-4">
              {interpretation?.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500">!</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Remedies */}
          <div className="text-xs">
            <span className="text-sacred-copper font-medium flex items-center gap-1">
              <span className="text-sacred-gold">●</span> Remedies
            </span>
            <ul className="mt-1 space-y-1 pl-4">
              {interpretation?.remedies.map((remedy, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-sacred-gold">⚡</span>
                  <span>{remedy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="relative bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-xl
                    border border-sacred-gold/20">
      <h2 className="text-3xl font-bold mb-8 text-sacred-copper flex items-center gap-3">
        🔮 Divisional Charts Analysis
      </h2>

      <form onSubmit={fetchDivisionalCharts} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form inputs */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Timezone</label>
          <input
            type="text"
            name="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            placeholder="e.g., +05:30"
            className="w-full p-3 border border-sacred-gold/30 rounded-lg bg-white/50 backdrop-blur-sm
                     focus:ring-2 focus:ring-sacred-gold/50 focus:border-sacred-gold
                     transition-all duration-300"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-sacred-gold/90 text-white rounded-lg
                     hover:bg-sacred-gold focus:ring-2 focus:ring-sacred-gold/50
                     hover:shadow-lg hover:shadow-sacred-gold/20 hover:scale-105
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          >
            {loading ? 'Calculating...' : 'Generate Divisional Analysis'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {error}
        </div>
      )}

      {/* Results section */}
      {results?.Status === "Pass" && (
        <div className="mt-8">
          {/* Chart type selector */}
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveChart('navamsha')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeChart === 'navamsha' 
                  ? 'bg-sacred-gold text-white' 
                  : 'bg-sacred-gold/10 text-sacred-copper'
              }`}
            >
              Navamsha (D-9)
            </button>
            <button
              onClick={() => setActiveChart('dashamsha')}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeChart === 'dashamsha' 
                  ? 'bg-sacred-gold text-white' 
                  : 'bg-sacred-gold/10 text-sacred-copper'
              }`}
            >
              Dashamsha (D-10)
            </button>
          </div>

          {/* Chart interpretation */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-sacred-copper mb-2">
              {divisionalChartMeanings[activeChart as keyof typeof divisionalChartMeanings]?.title}
            </h3>
            <p className="text-gray-600">
              {divisionalChartMeanings[activeChart as keyof typeof divisionalChartMeanings]?.description}
            </p>
          </div>

          {/* House positions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getChartData(activeChart).map((house: HouseSign) => (
              <HouseCard key={house.House} house={house} chartType={activeChart} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 