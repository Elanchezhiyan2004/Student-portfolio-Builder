import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ModernTheme } from '../components/themes/ModernTheme';
import { MinimalTheme } from '../components/themes/MinimalTheme';
import { ProfessionalTheme } from '../components/themes/ProfessionalTheme';
import { Database } from '../lib/database.types';

type Portfolio = Database['public']['Tables']['portfolios']['Row'] & {
  profiles: { full_name: string; email: string };
};
type Education = Database['public']['Tables']['education']['Row'];
type Experience = Database['public']['Tables']['experience']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Skill = Database['public']['Tables']['skills']['Row'];

interface PortfolioData {
  portfolio: Portfolio;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
}

interface PortfolioViewProps {
  username: string;
}

export function PortfolioView({ username }: PortfolioViewProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
  }, [username]);

  async function loadPortfolio() {
    try {
      const { data: portfolio, error: portfolioError } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .eq('username', username)
        .eq('is_public', true)
        .maybeSingle();

      if (portfolioError) throw portfolioError;
      if (!portfolio) {
        setError('Portfolio not found');
        setLoading(false);
        return;
      }

      const [eduData, expData, projData, skillData] = await Promise.all([
        supabase.from('education').select('*').eq('portfolio_id', portfolio.id).order('start_date', { ascending: false }),
        supabase.from('experience').select('*').eq('portfolio_id', portfolio.id).order('start_date', { ascending: false }),
        supabase.from('projects').select('*').eq('portfolio_id', portfolio.id).order('created_at', { ascending: false }),
        supabase.from('skills').select('*').eq('portfolio_id', portfolio.id).order('category'),
      ]);

      setData({
        portfolio: portfolio as any,
        education: eduData.data || [],
        experience: expData.data || [],
        projects: projData.data || [],
        skills: skillData.data || [],
      });
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600">{error || 'Portfolio not found'}</p>
        </div>
      </div>
    );
  }

  const { portfolio, education, experience, projects, skills } = data;

  switch (portfolio.theme) {
    case 'minimal':
      return <MinimalTheme portfolio={portfolio} education={education} experience={experience} projects={projects} skills={skills} />;
    case 'professional':
      return <ProfessionalTheme portfolio={portfolio} education={education} experience={experience} projects={projects} skills={skills} />;
    case 'modern':
    default:
      return <ModernTheme portfolio={portfolio} education={education} experience={experience} projects={projects} skills={skills} />;
  }
}
