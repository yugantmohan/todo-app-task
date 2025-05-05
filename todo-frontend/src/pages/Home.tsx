
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, Shield, Lock, RefreshCw } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="mb-16 max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Todo Management
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A secure and efficient way to manage your daily tasks with full JWT authentication and protection.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-md">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-md">
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
