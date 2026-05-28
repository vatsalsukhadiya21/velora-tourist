import { useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  const location = useLocation();

  // Hide layout chrome on auth pages for immersive experience
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-surface text-foreground flex flex-col">
      {!isAuthPage && <Navbar />}

      <main className={`flex-1 ${!isAuthPage ? 'pt-16' : ''}`}>
        <AppRoutes />
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}
