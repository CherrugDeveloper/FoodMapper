import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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

const REPO_OWNER = 'CherrugDeveloper';
const REPO_NAME = 'FoodMapper';
const REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

export default function DeveloperCard() {
  const { t } = useTranslation();
  const appVersion = packageJson.version;
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  // Load PayPal SDK and render button
  useEffect(() => {
    if (paypalContainerRef.current && !paypalContainerRef.current.hasChildNodes()) {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=SB_CLIENT_ID&currency=EUR';
      script.async = true;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.HostedButtons({
            hostedButtonId: 'SANC9MUHSXD9N',
          }).render('#paypal-container-SANC9MUHSXD9N');
        }
      };
      document.head.appendChild(script);
    }
  }, []);

  const socialLinks: SocialLink[] = [
    { label: 'GitHub', url: REPO_URL, icon: '🐙' },
  ];

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

  const supportLinks = [
    { label: t('developer.bug_report'), url: `${REPO_URL}/issues`, icon: '🐛' },
    { label: t('developer.feature_request'), url: `${REPO_URL}/discussions`, icon: '💡' },
    { label: t('developer.repo_link'), url: REPO_URL, icon: '📦' },
  ];

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
