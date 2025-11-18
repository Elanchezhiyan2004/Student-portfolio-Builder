import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Search, MapPin, ExternalLink } from 'lucide-react';
import { Database } from '../lib/database.types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'] & {
  profiles: { full_name: string };
};

interface GalleryProps {
  onNavigate: (path: string) => void;
}

export function Gallery({ onNavigate }: GalleryProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPortfolios();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPortfolios(portfolios);
    } else {
      const filtered = portfolios.filter((portfolio) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          portfolio.profiles.full_name.toLowerCase().includes(searchLower) ||
          portfolio.tagline.toLowerCase().includes(searchLower) ||
          portfolio.bio.toLowerCase().includes(searchLower) ||
          portfolio.location.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPortfolios(filtered);
    }
  }, [searchTerm, portfolios]);

  async function loadPortfolios() {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolios(data as any);
      setFilteredPortfolios(data as any);
    } catch (error) {
      console.error('Error loading portfolios:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Gallery</h1>
          <p className="text-gray-600">
            Discover talented professionals and their amazing work
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skills, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredPortfolios.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {searchTerm ? 'No portfolios found matching your search.' : 'No portfolios available yet.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
                onClick={() => onNavigate(`/portfolio/${portfolio.username}`)}
              >
                <div className={`h-32 ${getThemeGradient(portfolio.theme)}`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {portfolio.profiles.full_name}
                  </h3>
                  {portfolio.tagline && (
                    <p className="text-blue-600 font-medium mb-3">{portfolio.tagline}</p>
                  )}
                  {portfolio.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{portfolio.bio}</p>
                  )}
                  {portfolio.location && (
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{portfolio.location}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500 capitalize">{portfolio.theme} Theme</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(`/portfolio/${portfolio.username}`);
                      }}
                      className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <span className="text-sm font-medium">View Portfolio</span>
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getThemeGradient(theme: string): string {
  switch (theme) {
    case 'modern':
      return 'bg-gradient-to-br from-blue-500 to-blue-700';
    case 'minimal':
      return 'bg-gradient-to-br from-gray-600 to-gray-800';
    case 'professional':
      return 'bg-gradient-to-br from-green-600 to-green-800';
    default:
      return 'bg-gradient-to-br from-blue-500 to-blue-700';
  }
}
