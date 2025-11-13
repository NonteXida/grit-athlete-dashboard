import React, { useEffect } from 'react';
import { Trophy, X } from 'lucide-react';
import { Button } from './Button';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  achievement?: string;
}

export function CelebrationModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  achievement 
}: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti or celebration animation
      const timer = setTimeout(() => {
        // Auto-close after 5 seconds
        // onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[#141414] to-[#0a0a0a] border-2 border-[#03fd1c] rounded-2xl p-8 max-w-md w-full animate-slide-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#03fd1c] rounded-full mb-6 animate-pulse">
            <Trophy className="w-10 h-10 text-black" />
          </div>

          {/* Title */}
          <h2 className="text-white mb-2">{title}</h2>
          
          {/* Message */}
          <p className="text-gray-300 mb-6">{message}</p>

          {/* Achievement Badge */}
          {achievement && (
            <div className="inline-block px-6 py-3 bg-[#03fd1c]/10 border border-[#03fd1c] rounded-xl mb-6">
              <p className="text-[#03fd1c]">{achievement}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button variant="primary" className="flex-1">
              Share Achievement
            </Button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-[#03fd1c] rounded-full animate-ping" />
          <div className="absolute top-20 right-16 w-1 h-1 bg-[#03fd1c] rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-20 left-20 w-2 h-2 bg-[#03fd1c] rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
          <div className="absolute bottom-16 right-12 w-1 h-1 bg-[#03fd1c] rounded-full animate-ping" style={{ animationDelay: '0.9s' }} />
        </div>
      </div>
    </div>
  );
}
