import { useQuery } from '@tanstack/react-query';
import { categoryService, productService, contactService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Folder, MessageSquare } from 'lucide-react';

export const AdminDashboard = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => contactService.getAll(),
  });

  const orders = submissions.filter((s) => s.submission_type === 'order');
  const inquiries = submissions.filter((s) => s.submission_type === 'contact');

  // Prepare chart data
  const chartData = categories.map((category) => ({
    name: category.name,
    products: products.filter((p) => p.category_id === category.id).length,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your Timber Strong management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-accent bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Categories</CardTitle>
            <Folder className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{categories.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Product categories</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Listed products</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
            <MessageSquare className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{orders.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Order requests received</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success bg-white hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
            <MessageSquare className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{inquiries.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Contact inquiries</p>
          </CardContent>
        </Card>
      </div>

      {/* Products per Category Chart */}
      {chartData.length > 0 && (
        <Card className="bg-white shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-primary font-display">Products per Category</CardTitle>
            <p className="text-sm text-muted-foreground">Overview of your inventory distribution</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                <Bar dataKey="products" fill="hsl(25 25% 12%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Submissions */}
      <Card className="bg-white shadow-sm border border-border">
        <CardHeader>
          <CardTitle className="text-primary font-display">Recent Submissions</CardTitle>
          <p className="text-sm text-muted-foreground">Latest orders and inquiries</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {submissions.slice(0, 5).map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between py-4 px-4 hover:bg-muted/50 rounded-lg transition-colors border-b border-border/50 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary">{submission.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{submission.email}</p>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      submission.submission_type === 'order'
                        ? 'bg-accent/20 text-accent'
                        : 'bg-secondary/20 text-secondary'
                    }`}
                  >
                    {submission.submission_type === 'order' ? '🛒 Order' : '📧 Inquiry'}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(submission.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {submissions.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No submissions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
