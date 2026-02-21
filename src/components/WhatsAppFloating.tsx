import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface WhatsAppFloatingProps {
  phoneNumber: string;
  message?: string;
}

export const WhatsAppFloating = ({ 
  phoneNumber, 
  message = "Hi! I'm interested in your products. Can you help me?"
}: WhatsAppFloatingProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {isHovering && (
        <div className="absolute bottom-20 right-0 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap mb-2 shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute bottom-0 right-4 w-2 h-2 bg-gray-900 transform rotate-45 translate-y-1"></div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      {/* Mobile pulse effect */}
      <div className="absolute inset-0 w-14 h-14 bg-green-500 rounded-full animate-pulse opacity-25"></div>
    </div>
  );
};
