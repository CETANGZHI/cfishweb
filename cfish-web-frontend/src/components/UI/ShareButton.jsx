import React, { useState } from 'react';
import { Share2, Copy, Check, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ShareButton = ({ 
  url, 
  title, 
  description, 
  imageUrl,
  className = '',
  size = 'default',
  variant = 'outline'
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareDescription = description || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(shareTitle);
    const encodedDescription = encodeURIComponent(shareDescription);

    let shareLink = '';

    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareLink, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        setIsOpen(false);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const variantClasses = {
    outline: 'border border-gray-600 hover:border-primary text-gray-300 hover:text-primary',
    filled: 'bg-primary text-black hover:bg-primary/80',
    ghost: 'text-gray-300 hover:text-primary hover:bg-gray-800'
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${className}`}
        title={t('share')}
      >
        <Share2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 p-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white mb-3">
                {t('shareNFT')}
              </h3>
              
              {/* Social Media Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-xs">Twitter</span>
                </button>
                
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-blue-800 hover:bg-blue-900 text-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span className="text-xs">Facebook</span>
                </button>
                
                <button
                  onClick={() => handleShare('telegram')}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">Telegram</span>
                </button>
                
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">WhatsApp</span>
                </button>
              </div>

              {/* Copy Link Button */}
              <div className="border-t border-gray-700 pt-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">{t('linkCopied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">{t('copyLink')}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;

