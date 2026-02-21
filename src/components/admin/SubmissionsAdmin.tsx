import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService, productService } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MessageSquare, Phone, MapPin, Eye, Trash2, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type FilterType = 'all' | 'contact' | 'order' | 'inquiry';
type StatusType = 'all' | 'new' | 'viewed' | 'contacted' | 'completed';

export const SubmissionsAdmin = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusType>('all');
  const queryClient = useQueryClient();

  // Fetch all submissions with auto-refresh
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => contactService.getAll(),
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const typeMatch = typeFilter === 'all' || sub.submission_type === typeFilter;
    const statusMatch = statusFilter === 'all' || sub.status === statusFilter;
    return typeMatch && statusMatch;
  });

  // Count by type
  const counts = {
    all: submissions.length,
    contact: submissions.filter((s) => s.submission_type === 'contact').length,
    order: submissions.filter((s) => s.submission_type === 'order').length,
    inquiry: submissions.filter((s) => s.submission_type === 'inquiry').length,
  };

  // Count by status
  const newCount = submissions.filter((s) => s.status === 'new').length;

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (data: { id: string; status: 'new' | 'viewed' | 'contacted' | 'completed' }) =>
      contactService.updateStatus(data.id, data.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast.success('Status updated');
    },
    onError: () => {
      toast.error('Failed to update status');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => contactService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      setSelectedSubmission(null);
      toast.success('Submission deleted');
    },
    onError: () => {
      toast.error('Failed to delete submission');
    },
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'contact':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'inquiry':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'viewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '🛒';
      case 'inquiry':
        return '❓';
      case 'contact':
      default:
        return '📧';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-primary mb-2 flex items-center gap-2">
          <Zap className="w-8 h-8 text-orange-500" />
          Customer Submissions
        </h1>
        <p className="text-muted-foreground">
          Track all inquiries, contacts, and orders from website and Telegram in real-time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card
          className={`cursor-pointer border-l-4 hover:shadow-lg transition-all ${typeFilter === 'all' ? 'border-l-primary bg-primary/5' : 'border-l-gray-300'}`}
          onClick={() => setTypeFilter('all')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">All</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.all}</div>
            {newCount > 0 && <p className="text-xs text-red-600 mt-1 font-semibold">{newCount} new 🔔</p>}
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-l-4 hover:shadow-lg transition-all ${typeFilter === 'order' ? 'border-l-green-500 bg-green-50' : 'border-l-gray-300'}`}
          onClick={() => setTypeFilter('order')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orders 🛒</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.order}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-l-4 hover:shadow-lg transition-all ${typeFilter === 'inquiry' ? 'border-l-purple-500 bg-purple-50' : 'border-l-gray-300'}`}
          onClick={() => setTypeFilter('inquiry')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inquiries ❓</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.inquiry}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer border-l-4 hover:shadow-lg transition-all ${typeFilter === 'contact' ? 'border-l-blue-500 bg-blue-50' : 'border-l-gray-300'}`}
          onClick={() => setTypeFilter('contact')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contacts 📧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{counts.contact}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400 bg-orange-50 hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New 🔔</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{newCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">Filter by Status</label>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New (Unread)</SelectItem>
              <SelectItem value="viewed">Viewed</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submissions Table */}
      <Card className="bg-white shadow-sm border border-border overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle>Submissions List</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredSubmissions.length} result{filteredSubmissions.length !== 1 ? 's' : ''} • Auto-refreshing
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading submissions...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No submissions found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Product/Details</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className={`hover:bg-gray-50 border-b ${
                        submission.status === 'new' ? 'bg-orange-50' : ''
                      }`}
                    >
                      <TableCell className="text-sm font-medium">
                        {format(new Date(submission.created_at), 'dd MMM, HH:mm')}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{submission.name}</TableCell>
                      <TableCell className="text-sm">
                        <a
                          href={`tel:${submission.phone}`}
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {submission.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeColor(submission.submission_type)} border text-xs`}>
                          {getTypeIcon(submission.submission_type)} {submission.submission_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {submission.product_name || submission.product_id 
                          ? `${submission.product_name || 'Product'} ${submission.quantity ? `(${submission.quantity} units)` : ''}`
                          : submission.message?.substring(0, 30) + '...'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(submission.status)} text-xs`}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedSubmission(submission)}
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMutation.mutate(submission.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <span>{getTypeIcon(selectedSubmission.submission_type)}</span>
                <span className="capitalize">{selectedSubmission.submission_type} Details</span>
                <Badge className={`${getStatusColor(selectedSubmission.status)} ml-auto`}>
                  {selectedSubmission.status}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Status Buttons */}
              <div>
                <p className="text-sm text-muted-foreground font-semibold mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {['new', 'viewed', 'contacted', 'completed'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedSubmission.status === status ? 'default' : 'outline'}
                      onClick={() => {
                        updateStatusMutation.mutate({
                          id: selectedSubmission.id,
                          status: status as any,
                        });
                        setSelectedSubmission({
                          ...selectedSubmission,
                          status,
                        });
                      }}
                      className="capitalize text-xs"
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Date and Source */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Received On</p>
                  <p className="font-medium mt-1">
                    {format(new Date(selectedSubmission.created_at), 'dd MMM yyyy, HH:mm')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Source</p>
                  <p className="font-medium mt-1">
                    {selectedSubmission.source === 'website' ? '🌐 Website' : '📱 Telegram'}
                  </p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-lg font-semibold mt-1">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href={`tel:${selectedSubmission.phone}`}
                    className="text-lg font-semibold mt-1 text-blue-600 hover:underline"
                  >
                    {selectedSubmission.phone}
                  </a>
                </div>
              </div>

              {selectedSubmission.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-blue-600 hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
              )}

              {/* Order-specific details */}
              {selectedSubmission.submission_type === 'order' && (
                <div className="border-t pt-4 bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-900">📦 Order Details</h3>
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Product</p>
                      <p className="font-medium mt-1">{selectedSubmission.product_name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium mt-1">{selectedSubmission.quantity} units</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unit Price</p>
                      <p className="font-medium mt-1">
                        ₹{selectedSubmission.total_amount && selectedSubmission.quantity
                          ? (selectedSubmission.total_amount / selectedSubmission.quantity).toLocaleString('en-IN')
                          : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="text-lg font-bold text-green-700 mt-1">
                        ₹{selectedSubmission.total_amount?.toLocaleString('en-IN') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {selectedSubmission.address && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 font-semibold">
                    <MapPin className="w-4 h-4" />
                    Delivery Address
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded">{selectedSubmission.address}</p>
                </div>
              )}

              {/* Message */}
              {selectedSubmission.message && (
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 font-semibold">
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded">{selectedSubmission.message}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap border-t pt-4">
                <a href={`tel:${selectedSubmission.phone}`} className="flex-1 min-w-[120px]">
                  <Button className="w-full" variant="outline">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </a>
                <a
                  href={`https://wa.me/${selectedSubmission.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${selectedSubmission.name}, regarding your ${selectedSubmission.submission_type}...`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[120px]"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                {selectedSubmission.status !== 'completed' && (
                  <Button
                    onClick={() => {
                      updateStatusMutation.mutate({
                        id: selectedSubmission.id,
                        status: 'completed',
                      });
                      setSelectedSubmission({
                        ...selectedSubmission,
                        status: 'completed',
                      });
                    }}
                    className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
