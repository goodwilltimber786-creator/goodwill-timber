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

  const handleClick = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="flex items-center justify-center w-16 h-16 bg-transparent hover:opacity-90 text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none"
        aria-label="Chat with us on WhatsApp"
        type="button"
      >
        {/* WhatsApp Official Logo */}
        <svg
          className="w-7 h-7"
          viewBox="0 0 38.51 38.51"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="whatsapp-gradient" x1="2.05" x2="36.46" y1="2.05" y2="36.46" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#7eed91"></stop>
              <stop offset=".61" stopColor="#37cf60"></stop>
              <stop offset=".99" stopColor="#08bb40"></stop>
            </linearGradient>
          </defs>
          <rect width="38.51" height="38.51" fill="url(#whatsapp-gradient)" rx="6.97" ry="6.97"></rect>
          <path fill="#2dad40" d="M38.51,31.54v-12.25c-3.23-3.23-6.46-6.46-9.69-9.69-2.59-2.59-6.23-4.15-10.22-3.95-7.2.34-12.88,6.34-12.86,13.54,0,2.19.54,4.27,1.47,6.1l-1.44,6.97c-.05.22.06.42.23.53,1.9,1.92,3.81,3.83,5.72,5.72h19.81c3.83,0,6.97-3.14,6.97-6.97Z"></path>
          <path fill="#fff" d="M18.51,5.64c-7.2.34-12.88,6.34-12.86,13.54,0,2.19.54,4.27,1.47,6.1l-1.44,6.97c-.08.38.26.71.64.62l6.83-1.62c1.75.87,3.72,1.38,5.81,1.41,7.36.11,13.49-5.73,13.72-13.08.25-7.88-6.26-14.31-14.17-13.94h0ZM26.66,26.63c-2,2-4.66,3.1-7.49,3.1-1.66,0-3.24-.37-4.71-1.1l-.95-.47-4.19.99.88-4.28-.47-.92c-.76-1.5-1.15-3.11-1.15-4.81,0-2.83,1.1-5.49,3.1-7.48,1.98-1.98,4.68-3.1,7.49-3.1s5.49,1.1,7.48,3.1c2,2,3.1,4.66,3.1,7.48s-1.12,5.5-3.1,7.49h0Z"></path>
          <path fill="#fcfcfc" d="M25.73,22.07l-2.62-.75c-.34-.1-.71,0-.97.25l-.64.65c-.27.28-.68.36-1.04.22-1.24-.5-3.84-2.82-4.51-3.98-.19-.33-.16-.75.08-1.06l.56-.72c.22-.28.27-.66.12-.99l-1.1-2.49c-.26-.6-1.03-.77-1.52-.35-.73.62-1.6,1.56-1.7,2.6-.19,1.83.6,4.15,3.58,6.92,3.44,3.21,6.19,3.63,7.98,3.2,1.02-.25,1.83-1.23,2.34-2.04.35-.55.07-1.28-.55-1.46h0Z"></path>
        </svg>
      </button>
    </div>
  );
};
