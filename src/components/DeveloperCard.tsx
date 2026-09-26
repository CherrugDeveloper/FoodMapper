import { useTranslation } from 'react-i18next';

interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

interface DonationLink {
  label: string;
  url: string;
  icon: string;
}

export default function DeveloperCard() {
  const { t } = useTranslation();

  const socialLinks: SocialLink[] = [
    { label: 'GitHub', url: 'https://github.com/marcopollivier', icon: '🐙' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/marcopollivier', icon: '💼' },
    { label: 'Twitter/X', url: 'https://x.com/marcopollivier', icon: '🐦' },
  ];

  const donationLinks: DonationLink[] = [
    { label: 'GitHub Sponsors', url: 'https://github.com/sponsors/marcopollivier', icon: '❤️' },
    { label: 'PayPal', url: 'https://paypal.me/marcopollivier', icon: '💙' },
    { label: 'Ko-fi', url: 'https://ko-fi.com/marcopollivier', icon: '☕' },
    { label: 'Buy Me a Coffee', url: 'https://buymeacoffee.com/marcopollivier', icon: '☕' },
  ];

  const supportLinks = [
    { label: t('developer.bug_report'), url: 'https://github.com/marcopollivier/ibs-nutrition-app/issues', icon: '🐛' },
    { label: t('developer.feature_request'), url: 'https://github.com/marcopollivier/ibs-nutrition-app/discussions', icon: '💡' },
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-6 md:px-8 py-8">
      <div className="bg-(--code-bg) border border-(--border) rounded-2xl p-6 md:p-8">
        {/* Developer Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-(--accent) flex items-center justify-center text-4xl md:text-5xl flex-shrink-0">
            👨‍💻
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-(--text-h) mb-2">
              {t('developer.name')}
            </h2>
            <p className="text-(--text) text-lg mb-4 max-w-2xl mx-auto md:mx-0">
              {t('developer.bio')}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) transition-all"
                  aria-label={social.label}
                >
                  <span aria-hidden="true">{social.icon}</span>
                  <span className="font-medium">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-(--border) pt-8">
          {/* Support the Project */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-(--text-h) mb-4 flex items-center gap-2">
              <span aria-hidden="true">❤️</span>
              {t('developer.support_title')}
            </h3>
            <p className="text-(--text) mb-4">{t('developer.support_description')}</p>
            <div className="flex flex-wrap gap-3">
              {donationLinks.map((donation) => (
                <a
                  key={donation.label}
                  href={donation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all"
                  aria-label={donation.label}
                >
                  <span aria-hidden="true">{donation.icon}</span>
                  <span className="font-medium">{donation.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Support Links */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-(--text-h) mb-4 flex items-center gap-2">
              <span aria-hidden="true">🛠️</span>
              {t('developer.support_links_title')}
            </h3>
            <div className="flex flex-wrap gap-3">
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-(--bg) border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent) hover:bg-(--accent)/5 transition-all"
                  aria-label={link.label}
                >
                  <span aria-hidden="true">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center md:text-left text-sm text-(--text) opacity-70">
            <p>{t('developer.version', { version: '1.0.0' })}</p>
            <p>{t('developer.built_with')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}