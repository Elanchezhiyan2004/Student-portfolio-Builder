import { useAuth } from '../contexts/AuthContext';
import { Briefcase, LogOut, User } from 'lucide-react';

interface NavbarProps {
  onNavigate: (path: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('/')}
          >
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">PortfolioMaker</span>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('/dashboard')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
                {profile?.role === 'recruiter' && (
                  <button
                    onClick={() => onNavigate('/gallery')}
                    className="text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Browse Portfolios
                  </button>
                )}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{profile?.full_name}</span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('/login')}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('/register')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
