"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Loader } from '@/components/loader';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ReviewsContent from './ReviewsContent';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/userSlice';

interface RatingStats {
  average: number;
  total: number;
  distribution: {
    [key: string]: number;
  };
}

interface Specialization {
  _id: string;
  name: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface AstrologerResponse {
  astrologer: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      avatar: string;
    };
    languages: string[];
    experience: number;
    costPerMinute: number;
    chatStatus: string;
    callStatus: string;
    about: string;
    totalConsultations: number;
    specializations: Specialization[];
  };
  reviews: Review[];
  ratingStats: RatingStats;
}

const renderStars = (rating: number) => {
  return Array(5).fill(0).map((_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

const formatLanguages = (languages: string[]) => languages.join(', ');

export default function AstrologerDetailPage() {
  const params = useParams();
  const [data, setData] = useState<AstrologerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAppSelector(selectUser);


  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const response = await fetch(`/api/v1/astrologers/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch astrologer data');
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAstrologer();
    }
  }, [params.id]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!data) return <div className="text-center">No data found</div>;

  const { astrologer, ratingStats } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex flex-col bg-white rounded-2xl shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 p-6">
            {/* Image Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-72 w-72 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={astrologer.userId.avatar}
                  alt={astrologer.userId.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-4">
                  <h3 className="text-2xl font-bold text-white">
                    {astrologer.userId.name}
                  </h3>
                  <p className="text-gray-200 text-sm">
                    {formatLanguages(astrologer.languages)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-1">
                  {renderStars(ratingStats.average)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({astrologer.totalConsultations} consultations)
                  </span>
                </div>
                <div className="text-3xl font-bold text-black">
                  ₹{astrologer.costPerMinute}/min
                </div>
                {/* Action Button */}
              <button className="w-full bg-black text-white py-4 rounded-xl font-medium transition-colors duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-center gap-2">
                  <span>Book Consultation Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex gap-4">
                <div className={`flex items-center px-4 py-2 rounded-xl ${astrologer.chatStatus === 'online' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2 animate-pulse"></div>
                  Chat {astrologer.chatStatus}
                </div>
                <div className={`flex items-center px-4 py-2 rounded-xl ${astrologer.callStatus === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                  <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
                  Call {astrologer.callStatus}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-gray-800">
                      🌟 {ratingStats.average.toFixed(1)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Rating</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
                  <div className="text-2xl font-bold text-gray-800">
                    {astrologer.experience}
                  </div>
                  <p className="text-sm text-gray-500">Years Experience</p>
                </div>
              </div>

              {/* Specialization */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-sm">Specialization:</span>
                  <div className="flex flex-wrap gap-2">
                    {astrologer.specializations.map((spec) => (
                      <span key={spec._id} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        {spec.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About Me</h3>
                <p className="text-gray-600 leading-relaxed">
                  {astrologer.about}
                </p>
              </div>


            </div>
          </div>
        </motion.div>
      </main>
      <div className="py-8">
        {user && params.id && (
          <ReviewsContent
            astrologerId={Array.isArray(params.id) ? params.id[0] : params.id}
            currentUserId={user._id}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
