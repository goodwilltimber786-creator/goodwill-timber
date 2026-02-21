import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Logs } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { path: '/admin/submissions', label: 'Orders & Inquiries', icon: '📋' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary to-primary-foreground/95 border-r border-primary-foreground/20 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 shadow-lg`}
      >
        <div className="p-6 border-b border-primary-foreground/20">
          <div className="flex items-center gap-2 mb-2">
            <Logs className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-display font-bold text-primary-foreground">Timber Admin</h1>
          </div>
          <p className="text-xs text-primary-foreground/70">Management Dashboard</p>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 text-sm font-medium ${
                isActive(item.path)
                  ? 'bg-accent text-primary shadow-md'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-6 left-0 right-0 px-6 text-xs text-primary-foreground/60 border-t border-primary-foreground/20 pt-6">
          <p>Timber Strong</p>
          <p className="text-primary-foreground/50 mt-1">v1.0.0</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="bg-white border-b border-accent/20 px-6 py-4 flex items-center justify-between md:justify-end shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 text-primary hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Button asChild variant="ghost" className="text-primary hover:bg-muted">
            <Link to="/">← Back to Site</Link>
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-muted/30">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
