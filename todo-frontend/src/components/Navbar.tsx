
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, List, Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

const Navbar = () => {
  const { isAuthenticated, logout, user, isLoading, checkingSession } = useAuth();
  const location = useLocation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 px-6 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Check className="h-6 w-6 text-primary dark:text-white" />
          <span className="text-xl font-bold text-primary dark:text-white">TodoVault</span>
        </Link>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {checkingSession ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 animate-spin text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Checking session...</span>
            </div>
          ) : isAuthenticated ? (
            <>
              <div className="hidden sm:flex text-sm text-gray-600 dark:text-gray-300 items-center gap-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md">{user?.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <LogOut className="h-4 w-4 mr-1" />
                )}
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {location.pathname !== '/login' && (
                <Button variant="ghost" size="sm" asChild disabled={isLoading}>
                  <Link to="/login">Login</Link>
                </Button>
              )}
              {location.pathname !== '/signup' && (
                <Button variant="default" size="sm" asChild disabled={isLoading}>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? (
                <>
                  <Loader className="h-4 w-4 animate-spin mr-2" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
