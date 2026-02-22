import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { orderCache, CachedOrder } from '@/lib/orderCache';
import { contactService } from '@/lib/api';
import { Phone, MapPin, Package, Calendar, Copy, Check, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { format, formatDistance } from 'date-fns';

type OrderType = CachedOrder | any;

export const MyOrders = () => {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [searched, setSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all submissions from database (orders, inquiries, contacts)
  const { data: dbOrders = [] } = useQuery({
    queryKey: ['submissions-from-db'],
    queryFn: async () => {
      // Fetch all submission types
      const orders = await contactService.getByType('order');
      const inquiries = await contactService.getByType('inquiry');
      const contacts = await contactService.getByType('contact');
      return [...orders, ...inquiries, ...contacts];
    },
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Get cached orders (local storage)
      const cachedOrders = orderCache.getOrdersByPhone(phone).map((order) => ({
        ...order,
        source: 'cache',
        status: 'pending',
      }));

      // 2. Get database submissions for this phone (all types: orders, inquiries, contacts)
      const dbSubmissionsForPhone = dbOrders.filter(
        (submission) => submission.phone === phone
      );

      // Combine and deduplicate (prefer DB submissions as they're more recent)
      const combinedOrders = [
        ...dbSubmissionsForPhone.map((submission) => ({
          ...submission,
          source: 'database',
          timestamp: new Date(submission.created_at).getTime(),
        })),
        ...cachedOrders.filter(
          (cached) =>
            !dbSubmissionsForPhone.some(
              (db) =>
                db.created_at &&
                Math.abs(new Date(db.created_at).getTime() - cached.timestamp) < 5000
            )
        ),
      ];

      // Sort by timestamp (newest first)
      combinedOrders.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

      setOrders(combinedOrders);
      setSearched(true);

      if (combinedOrders.length === 0) {
        toast.info('No orders found for this phone number');
      } else {
        toast.success(`Found ${combinedOrders.length} order(s)`);
      }
    } catch (error) {
      console.error('Error searching orders:', error);
      toast.error('Failed to search orders');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-yellow-100 text-yellow-800';
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'viewed':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status?: string) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getExpirationStatus = (expiresAt: number) => {
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 0) {
      return { label: 'Expired', color: 'bg-red-100 text-red-800', icon: '❌' };
    }

    if (timeLeft < 24 * 60 * 60 * 1000) {
      // Less than 1 day
      return { label: 'Expiring Soon', color: 'bg-orange-100 text-orange-800', icon: '⚠️' };
    }

    return { label: 'Active', color: 'bg-green-100 text-green-800', icon: '✅' };
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Submissions</h1>
            <p className="text-gray-600 text-sm">View your orders, inquiries and contacts by phone number - no login required</p>
          </div>

          {/* Search Card */}
          <Card className="mb-8 border-0 shadow-sm">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    className="px-6 bg-gray-900 hover:bg-gray-800 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Orders are kept for 3 days. Enter the phone number from your order.
                </p>
              </form>
            </CardContent>
          </Card>

        {/* Results */}
      {searched && (
          <>
            {orders.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {orders.length} {orders.length === 1 ? 'submission' : 'submissions'} found
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPhone('');
                      setOrders([]);
                      setSearched(false);
                    }}
                  >
                    New Search
                  </Button>
                </div>

                {orders.map((order) => {
                  // Determine if this is a database or cached order
                  const isFromDatabase = order.source === 'database';
                  const orderDate = isFromDatabase
                    ? new Date(order.created_at)
                    : new Date(order.timestamp);
                  const submissionType = isFromDatabase 
                    ? (order.submission_type || 'order') 
                    : 'order';
                  const productName = isFromDatabase ? order.product_name : order.productName;
                  const quantity = isFromDatabase ? order.quantity : order.quantity;
                  const amount = isFromDatabase ? order.total_amount : order.totalAmount;
                  const status = order.status || 'pending';

                  // Get display label for submission type
                  const getSubmissionTypeLabel = (type: string) => {
                    switch (type) {
                      case 'inquiry':
                        return 'Inquiry';
                      case 'contact':
                        return 'Contact';
                      case 'order':
                      default:
                        return 'Order';
                    }
                  };

                  // For cached orders, show expiration; for DB orders, show status
                  const displayLabel = isFromDatabase
                    ? getStatusLabel(status)
                    : getExpirationStatus(order.expiresAt).label;
                  const displayColor = isFromDatabase
                    ? getStatusColor(status)
                    : getExpirationStatus(order.expiresAt).color;

                  return (
                    <Card
                      key={`${order.id}-${order.source}`}
                      className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="font-semibold text-gray-900">{productName}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {getSubmissionTypeLabel(submissionType)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                              {quantity && (
                                <div>
                                  <p className="text-gray-500 text-xs">Quantity</p>
                                  <p className="text-gray-900 font-medium">{quantity} unit(s)</p>
                                </div>
                              )}
                              {amount && (
                                <div>
                                  <p className="text-gray-500 text-xs">Total</p>
                                  <p className="text-gray-900 font-medium">
                                    ₹{typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-gray-500 text-xs">Date</p>
                                <p className="text-gray-900 font-medium">
                                  {format(orderDate, 'dd MMM yyyy')}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Status</p>
                                <p className={`text-xs font-medium px-2 py-1 rounded w-fit ${displayColor}`}>
                                  {displayLabel}
                                </p>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-12 pb-12 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    We couldn't find any orders for: <strong>{phone}</strong>
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPhone('');
                      setOrders([]);
                      setSearched(false);
                    }}
                  >
                    Try again
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Info Cards */}
        {!searched && orders.length === 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">No Login</h3>
                <p className="text-gray-600 text-xs">View orders without creating an account</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Phone Only</h3>
                <p className="text-gray-600 text-xs">Just enter your phone number from order</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">3 Day Storage</h3>
                <p className="text-gray-600 text-xs">Orders available for 3 days locally</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Order Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Order ID and Status */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Order ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono bg-gray-100 p-2 rounded flex-1 break-all">
                    {selectedOrder.id}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedOrder.id)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="space-y-2">
                <p className="text-xs text-gray-600">Status</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-3 py-1 rounded ${selectedOrder.source === 'database'
                    ? getStatusColor(selectedOrder.status)
                    : getExpirationStatus(selectedOrder.expiresAt).color}`}>
                    {selectedOrder.source === 'database'
                      ? getStatusLabel(selectedOrder.status)
                      : getExpirationStatus(selectedOrder.expiresAt).label}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {selectedOrder.source === 'database' ? 'Database' : 'Cached'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Product</p>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedOrder.source === 'database' ? selectedOrder.product_name : selectedOrder.productName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Quantity</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">{selectedOrder.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Amount</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      ₹{(selectedOrder.source === 'database' ? selectedOrder.total_amount : selectedOrder.totalAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{selectedOrder.name}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Phone</p>
                  <div className="flex gap-2 items-center">
                    <a
                      href={`tel:${selectedOrder.phone}`}
                      className="text-sm text-blue-600 hover:underline font-medium"
                    >
                      {selectedOrder.phone}
                    </a>
                    <button
                      onClick={() => copyToClipboard(selectedOrder.phone)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-xs text-gray-900 bg-gray-50 p-2 rounded border border-gray-200">
                    {selectedOrder.address}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="border-t pt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ordered</span>
                  <span className="text-gray-900 font-medium">
                    {selectedOrder.source === 'database'
                      ? format(new Date(selectedOrder.created_at), 'dd MMM yyyy, HH:mm')
                      : format(new Date(selectedOrder.timestamp), 'dd MMM yyyy, HH:mm')}
                  </span>
                </div>
                {selectedOrder.source === 'cache' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid Until</span>
                      <span className="text-gray-900 font-medium">
                        {format(new Date(selectedOrder.expiresAt), 'dd MMM yyyy')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Left</span>
                      <span className="text-orange-600 font-medium">
                        {formatDistance(new Date(selectedOrder.expiresAt), new Date())}
                      </span>
                    </div>
                  </>
                )}
                {selectedOrder.source === 'database' && selectedOrder.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Updated</span>
                    <span className="text-gray-900 font-medium">
                      {format(new Date(selectedOrder.updated_at), 'dd MMM yyyy, HH:mm')}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <a href={`tel:${selectedOrder.phone}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                </a>
                <a
                  href={`https://wa.me/918638264329?text=${encodeURIComponent(
                    `Hi! Order ID: ${selectedOrder.id} - ${selectedOrder.source === 'database' ? selectedOrder.product_name : selectedOrder.productName}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      </main>
      <Footer />
    </div>
  );
};

export default MyOrders;