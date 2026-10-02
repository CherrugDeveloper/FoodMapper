import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../hooks/useToast';
import packageJson from '../../package.json';
import heroImage from '../assets/hero.png';

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

interface DonationLink {
  label: string;
  url: string;
  icon: string;
  type?: 'link' | 'paypal' | 'bmc';
}

interface SupportLink {
  label: string;
  url: string;
  icon: string;
}

interface ShareOption {
  platform: 'whatsapp' | 'telegram' | 'x' | 'direct';
  label: string;
  url?: (text: string) => string;
  action?: () => void;
}

interface CommunityButton {
  label: string;
  url: string;
  icon: string;
  description: string;
}

const REPO_OWNER = 'CherrugDeveloper';
const REPO_NAME = 'FoodMapper';
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

const SHARE_OPTIONS: ShareOption[] = [
  {
    platform: 'whatsapp',
    label: 'Share on WhatsApp',
    url: (text: string) => `https://wa.me/?text=${encodeURIComponent(text + ' ' + REPO_URL)}`
  },
  {
    platform: 'telegram',
    label: 'Share on Telegram',
    url: (text: string) => `https://t.me/share/url?url=${encodeURIComponent(REPO_URL)}&text=${encodeURIComponent(text)}`
  },
  {
    platform: 'x',
    label: 'Share on X',
    url: (text: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(REPO_URL)}&text=${encodeURIComponent(text)}`
  },
  {
    platform: 'direct',
    label: 'Copy link',
    action: () => {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(window.location.href);
      } else {
        // Fallback for mobile or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    }
  }
];

const COMMUNITY_BUTTONS: CommunityButton[] = [
  {
    label: 'GitHub Discussions',
    url: `${REPO_URL}/discussions/categories/ideas`,
    icon: '💡',
    description: 'Propose new features and give feedback on existing ideas'
  },
  {
    label: 'Star',
    url: REPO_URL,
    icon: '⭐',
    description: 'Give us a star on GitHub to support the project'
  },
  {
    label: 'Share',
    url: '#',
    icon: '↗',
    description: 'Spread the word about FoodMapper to friends and the community'
  }
];

export default function DeveloperCard() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const appVersion = packageJson.version;
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement>(null);

  const shareText = t('developer.share_description', { defaultValue: `Check out FoodMapper, the open-source IBS/FODMAP-friendly nutrition app: ${REPO_URL}` });

  // Load PayPal SDK and render button
  useEffect(() => {
    if (paypalContainerRef.current && !paypalContainerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=PRODUCTION_CLIENT_ID&currency=EUR';
      script.async = true;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.HostedButtons({
            hostedButtonId: 'SANC9MUHSXD9N',
          }).render('#paypal-container-SANC9MUHSXD9N');
        }
      };
      script.onerror = () => {
        // Fallback link if PayPal SDK fails to load
        if (paypalContainerRef.current) {
          paypalContainerRef.current.innerHTML = `
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=SANC9MUHSXD9N"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all w-full h-14"
              aria-label="Donate with PayPal"
            >
              <span aria-hidden="true">💙</span>
              <span className="font-medium">PayPal (Fallback)</span>
            </a>
          `;
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const socialLinks: SocialLink[] = [];

  const donationLinks: DonationLink[] = [
    {
      label: 'PayPal',
      url: '#',
      icon: '💙',
      type: 'paypal'
    },
    {
      label: 'Ko-fi',
      url: 'https://ko-fi.com/foodmapper',
      icon: '☕'
    },
    {
      label: 'Buy Me a Coffee',
      url: 'https://www.buymeacoffee.com/foodmappero',
      icon: '☕',
      type: 'bmc'
    },
  ];

  const supportLinks: SupportLink[] = [
    { label: t('developer.bug_report'), url: `${REPO_URL}/issues`, icon: '🐛' },
    { label: t('developer.feature_request'), url: `${REPO_URL}/discussions`, icon: '💡' },
    { label: t('developer.repo_link'), url: REPO_URL, icon: '📦' },
  ];

  const openShareModal = () => {
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
  };

  const handleShareOptionClick = (option: ShareOption) => {
    if (option.platform === 'direct') {
      option.action?.();
      showToast(t('developer.share_copied', { defaultValue: 'Link copied to clipboard' }));
    } else if (option.url) {
      window.open(option.url(shareText), '_blank', 'noopener,noreferrer');
    }
    closeShareModal();
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeShareModal();
      }
    };

    if (isShareModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isShareModalOpen]);

  // Focus management for modal
  useEffect(() => {
    if (isShareModalOpen && shareButtonRef.current) {
      shareButtonRef.current.focus();
    }
  }, [isShareModalOpen]);

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
      <div className="bg-(--code-bg) border border-(--border) rounded-2xl p-4 sm:p-6 md:p-8">
        {/* Developer Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-(--accent) flex items-center justify-center shrink-0">
            <img 
              src={heroImage} 
              alt={t('developer.name')} 
              className="w-full h-full object-cover aspect-square"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-(--text-h) mb-2">
              {t('developer.name')}
            </h2>
            <p className="text-(--text) text-base sm:text-lg mb-4 max-w-2xl mx-auto md:mx-0">
              {t('developer.bio')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) transition-all text-sm sm:text-base"
                  aria-label={social.label}
                >
                  <span aria-hidden="true">{social.icon}</span>
                  <span className="font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* New Community Engagement Header Row */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          {COMMUNITY_BUTTONS.map((button) => (
            button.label === 'Share' ? (
              <button
                key={button.label}
                ref={shareButtonRef}
                onClick={openShareModal}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) transition-all text-sm sm:text-base"
                aria-label={`${button.label}: ${button.description}`}
              >
                <span aria-hidden="true">{button.icon}</span>
                <span className="font-medium">{button.label}</span>
              </button>
            ) : (
              <a
                key={button.label}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) transition-all text-sm sm:text-base"
                aria-label={`${button.label}: ${button.description}`}
              >
                <span aria-hidden="true">{button.icon}</span>
                <span className="font-medium">{button.label}</span>
              </a>
            )
          ))}
        </div>

        <div className="border-t border-(--border) pt-6 sm:pt-8">
          {/* Support the Project */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-(--text-h) mb-3 sm:mb-4 flex items-center gap-2">
              <span aria-hidden="true">❤️</span>
              {t('developer.support_title')}
            </h3>
            <p className="text-(--text) text-sm sm:text-base mb-4">{t('developer.support_description')}</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {donationLinks.map((donation) => {
                if (donation.type === 'paypal') {
                  return (
                    <div 
                      key={donation.label} 
                      ref={paypalContainerRef}
                      id="paypal-container-SANC9MUHSXD9N"
                      className="flex-1 min-w-50"
                    />
                  );
                }
                if (donation.type === 'bmc') {
                  return (
                    <a
                      key={donation.label}
                      href={donation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all text-sm sm:text-base"
                      aria-label={donation.label}
                    >
                      <img 
                        src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=foodmappero&button_colour=BD5FFF&font_colour=ffffff&font_family=Inter&outline_colour=000000&coffee_colour=FFDD00" 
                        alt="Buy Me a Coffee"
                        className="h-10 w-auto"
                      />
                    </a>
                  );
                }
                return (
                  <a
                    key={donation.label}
                    href={donation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all text-sm sm:text-base"
                    aria-label={donation.label}
                  >
                    <span aria-hidden="true">{donation.icon}</span>
                    <span className="font-medium">{donation.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Support Links */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-(--text-h) mb-3 sm:mb-4 flex items-center gap-2">
              <span aria-hidden="true">🛠️</span>
              {t('developer.support_links_title')}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all text-sm sm:text-base"
                  aria-label={link.label}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Email Support */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-(--text-h) mb-3 sm:mb-4 flex items-center gap-2">
              <span aria-hidden="true">📧</span>
              {t('developer.contact_title')}
            </h3>
            <p className="text-(--text) text-sm sm:text-base mb-4">{t('developer.contact_description')}</p>
            <a
              href="mailto:foodmappersupport@gmail.com"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all text-sm sm:text-base"
              aria-label="Contact support"
            >
              <span aria-hidden="true">📧</span>
              <span className="font-medium">{t('developer.contact_email')}</span>
            </a>
          </div>

          {/* Version Info */}
          <div className="text-center md:text-left text-xs sm:text-sm text-(--text) opacity-70">
            <p>{t('developer.version', { version: appVersion })}</p>
            <p>{t('developer.built_with')}</p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeShareModal}
        >
          <div 
            className="bg-(--code-bg) border border-(--border) rounded-2xl p-4 sm:p-6 md:p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-(--text-h) mb-4">
              {t('developer.share_title', { defaultValue: 'Share' })}
            </h3>
            <p className="text-(--text) text-sm sm:text-base mb-6">
              {t('developer.share_description', { defaultValue: 'Spread the word about FoodMapper to friends and the community' })}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {SHARE_OPTIONS.map((option) => (
                <button
                  key={option.platform}
                  onClick={() => handleShareOptionClick(option)}
                  className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) transition-all"
                >
                  <span aria-hidden="true" className="text-xl sm:text-2xl">
                    {option.platform === 'whatsapp' ? '📱' : 
                     option.platform === 'telegram' ? '📨' : 
                     option.platform === 'x' ? '🐦' : '📋'}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-center">
                    {t(`developer.share_${option.platform}`, { defaultValue: option.label })}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={closeShareModal}
              className="w-full mt-4 px-4 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// Type augmentation for PayPal SDK
declare global {
  interface Window {
    paypal: {
      HostedButtons: (options: { hostedButtonId: string }) => {
        render: (selector: string) => void;
      };
    };
  }
}
