import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Plus, Edit, Eye, ExternalLink } from 'lucide-react';
import { Database } from '../lib/database.types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'];

interface DashboardProps {
  onNavigate: (path: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { profile } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, [profile]);

  async function loadPortfolio() {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      setPortfolio(data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (profile?.role === 'recruiter') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome, {profile?.full_name}!
            </h1>
            <p className="text-gray-600 mb-8">
              You're logged in as a recruiter. Browse talented professionals and their portfolios.
            </p>
            <button
              onClick={() => onNavigate('/gallery')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Eye className="h-5 w-5" />
              <span>Browse Portfolios</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your professional portfolio</p>
        </div>

        {!portfolio ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Create Your Portfolio
              </h2>
              <p className="text-gray-600 mb-8">
                You haven't created a portfolio yet. Start building your professional presence
                and showcase your skills to recruiters.
              </p>
              <button
                onClick={() => onNavigate('/portfolio/create')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Portfolio</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio Overview</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Username</span>
                  <p className="font-semibold">{portfolio.username}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tagline</span>
                  <p className="font-semibold">{portfolio.tagline || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Theme</span>
                  <p className="font-semibold capitalize">{portfolio.theme}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status</span>
                  <p className="font-semibold">
                    {portfolio.is_public ? (
                      <span className="text-green-600">Public</span>
                    ) : (
                      <span className="text-gray-600">Private</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => onNavigate(`/portfolio/${portfolio.username}`)}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                    <span className="font-semibold text-gray-900">View Portfolio</span>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                </button>

                <button
                  onClick={() => onNavigate('/portfolio/edit')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <Edit className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                    <span className="font-semibold text-gray-900">Edit Portfolio</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="md:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-md p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Share Your Portfolio</h3>
              <p className="text-blue-100 mb-4">
                Your portfolio is live! Share this link with recruiters and on your social media.
              </p>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/portfolio/${portfolio.username}`}
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 font-mono text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/portfolio/${portfolio.username}`);
                    alert('Link copied to clipboard!');
                  }}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
