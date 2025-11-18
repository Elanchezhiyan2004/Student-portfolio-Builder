import { AuthProvider } from './contexts/AuthContext';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PortfolioForm } from './pages/PortfolioForm';
import { Gallery } from './pages/Gallery';
import { PortfolioView } from './pages/PortfolioView';

function AppContent() {
  const { path, navigate } = useRouter();

  const getContent = () => {
    if (path === '/') {
      return <Home onNavigate={navigate} />;
    }
    if (path === '/login') {
      return <Login onNavigate={navigate} />;
    }
    if (path === '/register') {
      return <Register onNavigate={navigate} />;
    }
    if (path === '/dashboard') {
      return (
        <ProtectedRoute>
          <Dashboard onNavigate={navigate} />
        </ProtectedRoute>
      );
    }
    if (path === '/portfolio/create') {
      return (
        <ProtectedRoute requireRole="student">
          <PortfolioForm onNavigate={navigate} isEdit={false} />
        </ProtectedRoute>
      );
    }
    if (path === '/portfolio/edit') {
      return (
        <ProtectedRoute requireRole="student">
          <PortfolioForm onNavigate={navigate} isEdit={true} />
        </ProtectedRoute>
      );
    }
    if (path === '/gallery') {
      return <Gallery onNavigate={navigate} />;
    }
    if (path.startsWith('/portfolio/')) {
      const username = path.split('/portfolio/')[1];
      return <PortfolioView username={username} />;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">Page not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  };

  const hideNavAndFooter = path.startsWith('/portfolio/') && !path.includes('/create') && !path.includes('/edit');

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavAndFooter && <Navbar onNavigate={navigate} />}
      <main className="flex-grow">
        {getContent()}
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
