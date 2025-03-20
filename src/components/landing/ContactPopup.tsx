import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import Turnstile, { useTurnstile } from 'react-turnstile';
import { submitContactForm } from '../../api/contact';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactPopup: React.FC<ContactPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const turnstile = useTurnstile();

  useEffect(() => {
    // Check local storage for rate limiting
    const lastSubmitTime = localStorage.getItem('lastContactSubmitTime');

    if (lastSubmitTime) {
      const timeDiff = Date.now() - parseInt(lastSubmitTime, 10);
      const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeDiff < timeLimit) {
        setIsRateLimited(true);
        const remainingSecs = Math.ceil((timeLimit - timeDiff) / 1000);
        setCountdown(remainingSecs);
      }
    }

    // Add escape key listener to close popup
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);

    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  // Countdown timer for rate limiting
  useEffect(() => {
    let intervalId: number;

    if (isRateLimited && countdown > 0) {
      intervalId = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsRateLimited(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRateLimited, countdown]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!subject.trim()) {
      alert('Please enter a subject');
      return;
    }

    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="relative bg-background rounded-lg shadow-xl max-w-md w-full animate-fade-in p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full bg-primary/10">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Contact Us</h2>
        </div>

        {submitStatus === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Message Sent!</h3>
            <p className="text-muted-foreground">
              Thanks for reaching out. We'll get back to you as soon as possible.
            </p>
          </div>
        ) : submitStatus === 'error' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't send your message. Please try again later.
            </p>
            <button
              onClick={() => setSubmitStatus('idle')}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : isRateLimited ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium mb-2">Too many requests</h3>
            <p className="text-muted-foreground">
              Please wait {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} before sending another message.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-md bg-card/30 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-md bg-card/30 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="How can we help?"
                required
              />
            </div>

            <div>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-border/50 rounded-md bg-card/30 focus:outline-none focus:ring-1 focus:ring-primary min-h-[120px]"
                placeholder="Tell us what you need..."
                required
              />
            </div>

            <div className="flex justify-center my-2">
              <Turnstile
                sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                onVerify={(token) => {
                  // Validate fields first
                  if (!validateEmail(email)) {
                    alert('Please enter a valid email address');
                    turnstile.reset();
                    return;
                  }
                  
                  if (!subject.trim()) {
                    alert('Please enter a subject');
                    turnstile.reset();
                    return;
                  }
                  
                  if (!message.trim()) {
                    alert('Please enter a message');
                    turnstile.reset();
                    return;
                  }
                  
                  // Set submitting state
                  setIsSubmitting(true);
                  
                  // Send the form when the token is verified
                  submitContactForm(email, subject, message, token)
                    .then((result) => {
                      if (result.success) {
                        // Set rate limiting
                        localStorage.setItem('lastContactSubmitTime', Date.now().toString());
                        setSubmitStatus('success');
                        
                        // Reset form
                        setEmail('');
                        setSubject('');
                        setMessage('');
                        
                        // Close the popup after success message
                        setTimeout(() => {
                          onClose();
                          setSubmitStatus('idle');
                        }, 3000);
                      } else {
                        throw new Error(result.error || 'Failed to send message');
                      }
                    })
                    .catch((error) => {
                      console.error('Error sending message:', error);
                      setSubmitStatus('error');
                      turnstile.reset();
                    })
                    .finally(() => {
                      setIsSubmitting(false);
                    });
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gradient-button py-2 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-70 flex justify-center items-center"
            >
              {isSubmitting ? (
                <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By sending this message, you agree to our{' '}
              <a href="#" className="text-primary hover:underline ml-1">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactPopup;
