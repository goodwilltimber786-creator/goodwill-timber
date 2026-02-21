import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock, LogIn } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

export const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate a small delay for security
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store auth token in localStorage
        localStorage.setItem('adminToken', 'authenticated');
        toast.success('🎉 Login successful!');
        navigate('/admin');
      } else {
        toast.error('❌ Invalid password');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 px-4 py-8">
      <Card className="w-full max-w-md border border-border shadow-lg bg-white">
        <CardHeader className="bg-gradient-to-r from-primary to-primary-foreground/95 text-white rounded-t-lg">
          <div className="flex items-center gap-3 justify-center mb-2">
            <Lock className="w-6 h-6 text-accent" />
            <CardTitle className="text-center text-3xl font-display text-white">Admin Panel</CardTitle>
          </div>
          <p className="text-center text-primary-foreground/80 text-sm">Timber Strong Management</p>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                🔐 Admin Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your admin password"
                disabled={isLoading}
                className="border-border focus:border-accent focus:ring-accent"
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 h-10 flex items-center justify-center gap-2"
              disabled={isLoading || !password.trim()}
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Logging in...' : 'Login to Dashboard'}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-6 p-3 bg-muted/30 rounded-lg border border-border">
              ⚠️ For production environments, please use stronger authentication methods like OAuth or JWT tokens.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const useAdminAuth = () => {
  const isAuthenticated = localStorage.getItem('adminToken') === 'authenticated';
  
  const logout = () => {
    localStorage.removeItem('adminToken');
  };

  return { isAuthenticated, logout };
};
