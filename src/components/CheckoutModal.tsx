import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactForm } from '@/components/ContactForm';
import { MessageCircle, Mail, Phone, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { contactService } from '@/lib/api';
import { sendTelegramNotification, formatOrderNotification } from '@/lib/telegram';
import { orderCache } from '@/lib/orderCache';

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    price: number;
  };
  whatsappNumber?: string;
  mode?: 'buy' | 'inquiry';
}

export const CheckoutModal = ({
  open,
  onOpenChange,
  product,
  whatsappNumber = '918638264329', // Default number
  mode = 'inquiry',
}: CheckoutModalProps) => {
  const [selectedTab, setSelectedTab] = useState('form');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showResult, setShowResult] = useState<'success' | 'failed' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buyFormData, setBuyFormData] = useState({
    name: '',
    phone: '',
    address: '',
    quantity: '1',
  });

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in ordering "${product.name}" (₹${product.price}). Can you provide more details?`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const emailSubject = encodeURIComponent(`Order Inquiry: ${product.name}`);
  const emailBody = encodeURIComponent(
    `Hi,\n\nI'm interested in ordering "${product.name}" priced at ₹${product.price}.\n\nPlease provide more details.\n\nThank you!`
  );

  const handleBuyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBuyFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = () => {
    // Validate form
    if (!buyFormData.name.trim() || !buyFormData.phone.trim() || !buyFormData.address.trim() || !buyFormData.quantity) {
      toast.error('Please fill all fields');
      return;
    }

    if (parseInt(buyFormData.quantity) < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const totalPrice = product.price * parseInt(buyFormData.quantity);
      
      // Save order to database
      const dbOrder = await contactService.create({
        name: buyFormData.name,
        email: undefined,
        phone: buyFormData.phone,
        address: buyFormData.address,
        quantity: parseInt(buyFormData.quantity),
        product_id: product.id,
        product_name: product.name,
        message: `Order for ${buyFormData.quantity} unit(s)`,
        submission_type: 'order',
        status: 'new',
        total_amount: totalPrice,
        source: 'website',
      });

      // Cache order locally (for 2-3 days)
      orderCache.addOrder({
        name: buyFormData.name,
        phone: buyFormData.phone,
        address: buyFormData.address,
        productName: product.name,
        quantity: parseInt(buyFormData.quantity),
        totalAmount: totalPrice,
      });

      // Create order message
      const orderMessage = `
*New Order Received* ✅

*Product:* ${product.name}
*Quantity:* ${buyFormData.quantity} units
*Price per unit:* ₹${product.price.toLocaleString('en-IN')}
*Total Amount:* ₹${totalPrice.toLocaleString('en-IN')}

*Customer Details:*
*Name:* ${buyFormData.name}
*Phone:* ${buyFormData.phone}
*Address:* ${buyFormData.address}

Note: A confirmation call will be made to finalize delivery details.
      `.trim();

      // Send to Telegram
      await sendTelegramNotification(orderMessage);

      // Show success modal
      setShowResult('success');
      setShowConfirmation(false);
      
      // Reset form after success
      setTimeout(() => {
        setBuyFormData({ name: '', phone: '', address: '', quantity: '1' });
        setShowResult(null);
        onOpenChange(false);
      }, 3000);
    } catch (error) {
      console.error('Order submission error:', error);
      setShowResult('failed');
      setShowConfirmation(false);
      
      setTimeout(() => {
        setShowResult(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showConfirmation && !showResult} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === 'buy' ? 'Complete Your Purchase' : 'Send Inquiry'} - {product.name}</DialogTitle>
          </DialogHeader>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Product</p>
                <p className="text-lg font-semibold text-gray-900">
                  {product.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            {mode === 'buy' ? (
              <>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="form">Buy Now</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="direct">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={buyFormData.name}
                        onChange={handleBuyFormChange}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={buyFormData.phone}
                        onChange={handleBuyFormChange}
                        placeholder="Enter your phone number"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={buyFormData.address}
                        onChange={handleBuyFormChange}
                        placeholder="Enter your complete delivery address"
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={buyFormData.quantity}
                        onChange={handleBuyFormChange}
                        className="mt-1"
                      />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{(product.price * parseInt(buyFormData.quantity || '1')).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        ℹ️ A confirmation call will be made to finalize delivery details
                      </p>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold text-lg"
                    >
                      Place Order
                    </Button>
                  </div>
                </TabsContent>
              </>
            ) : (
              <>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="form">Inquiry Form</TabsTrigger>
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="direct">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Fill the form below and we'll get back to you shortly
                  </div>
                  <ContactForm
                    productId={product.id}
                    productName={product.name}
                    type="inquiry"
                    hideEmail={true}
                    onSuccess={() => onOpenChange(false)}
                  />
                </TabsContent>
              </>
            )}

            <TabsContent value="whatsapp" className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Click below to chat with us on WhatsApp
              </div>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Open WhatsApp Chat
                </Button>
              </a>
              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to WhatsApp with a pre-filled message
              </p>
            </TabsContent>

            <TabsContent value="direct" className="space-y-4">
              <div className="grid gap-4">
                {/* Email Option */}
                <a
                  href={`mailto:goodwilltimber786@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                >
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <p className="font-semibold">Email Us</p>
                      <p className="text-xs text-gray-600">goodwilltimber786@gmail.com</p>
                    </div>
                  </Button>
                </a>

                {/* Phone Option */}
                <a href={`tel:+918638264329`}>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    <div className="text-left">
                      <p className="font-semibold">Call Us</p>
                      <p className="text-xs text-gray-600">
                        +91 86382 64329
                      </p>
                    </div>
                  </Button>
                </a>

                {/* WhatsApp Link */}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                    <div className="text-left">
                      <p className="font-semibold">WhatsApp</p>
                      <p className="text-xs text-gray-600">
                        Chat with us on WhatsApp
                      </p>
                    </div>
                  </Button>
                </a>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-semibold">{buyFormData.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Unit Price:</span>
                <span className="font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  ₹{(product.price * parseInt(buyFormData.quantity)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <p className="text-gray-700">
                📞 <strong>A confirmation call will be made to:</strong>
              </p>
              <p className="text-gray-600 mt-1">{buyFormData.phone}</p>
              <p className="text-gray-600 mt-2">to finalize delivery details and confirm your order.</p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleConfirmOrder}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold"
              >
                {isSubmitting ? 'Processing...' : 'Yes, Place Order'}
              </Button>
              <Button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                variant="outline"
                className="w-full py-3 font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      {showResult === 'success' && (
        <Dialog open={true}>
          <DialogContent className="max-w-md">
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
                  <CheckCircle className="w-20 h-20 text-green-600 relative" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-4">
                  Your order has been successfully placed.
                </p>
                <div className="bg-green-50 p-3 rounded-lg text-sm text-gray-700 space-y-2">
                  <p>✅ Order received</p>
                  <p>📞 We'll call you shortly at {buyFormData.phone}</p>
                  <p>🚚 Delivery will be finalized during the call</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Redirecting in a moment...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Failed Modal */}
      {showResult === 'failed' && (
        <Dialog open={true}>
          <DialogContent className="max-w-md">
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-400 rounded-full opacity-30 animate-pulse"></div>
                  <AlertCircle className="w-20 h-20 text-red-600 relative" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Failed</h2>
                <p className="text-gray-600 mb-4">
                  There was an issue processing your order.
                </p>
                <div className="bg-red-50 p-3 rounded-lg text-sm text-gray-700">
                  <p>Please try again or contact us directly at +91 86382 64329</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Closing in a moment...</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
