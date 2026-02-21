import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactService } from '@/lib/api';
import { sendTelegramNotification, formatOrderNotification } from '@/lib/telegram';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ContactFormProps {
  productName?: string;
  productId?: string;
  type: 'contact' | 'order';
  hideEmail?: boolean;
  onSuccess?: () => void;
}

export const ContactForm = ({
  productName,
  productId,
  type,
  hideEmail = false,
  onSuccess,
}: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Save to database
      const submission = await contactService.create({
        name: data.name,
        email: data.email || 'not-provided@inquiry.local', // Placeholder if hidden
        phone: data.phone,
        message: data.message,
        product_id: productId || null,
        submission_type: type,
        status: 'new',
        source: 'website',
      });

      // Send Telegram notification
      const telegramMessage = formatOrderNotification({
        name: data.name,
        email: data.email || 'N/A',
        phone: data.phone,
        message: data.message,
        productName: productName,
        type: type,
      });

      const telegramSent = await sendTelegramNotification(telegramMessage);
      if (!telegramSent) {
        console.warn('Telegram notification failed but form was submitted to database');
      }

      return submission;
    },
    onSuccess: () => {
      toast.success(
        type === 'order'
          ? 'Order submitted successfully! We will contact you soon.'
          : 'Thank you for your inquiry! We will get back to you soon.'
      );
      setFormData({ name: '', email: '', phone: '', message: '' });
      onSuccess?.();
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast.error('Failed to submit. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!hideEmail && !formData.email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Message is required');
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="font-medium mb-1 text-foreground">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          placeholder="Your full name"
          disabled={mutation.isPending}
          className="border-border focus:border-primary"
        />
      </div>

      {!hideEmail && (
        <div>
          <Label htmlFor="email" className="font-medium mb-1 text-foreground">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="your.email@example.com"
            disabled={mutation.isPending}
            className="border-border focus:border-primary"
          />
        </div>
      )}

      <div>
        <Label htmlFor="phone" className="font-medium mb-1 text-foreground">Phone Number *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          placeholder="+91 98765 43210"
          disabled={mutation.isPending}
          className="border-border focus:border-primary"
        />
      </div>

      <div>
        <Label htmlFor="message" className="font-medium mb-1 text-foreground">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          placeholder="Your message..."
          rows={4}
          disabled={mutation.isPending}
          className="border-border focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-2.5 px-4 rounded bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isPending
          ? 'Submitting...'
          : type === 'order'
            ? 'Place Order'
            : 'Send Message'}
      </button>
    </form>
  );
};
