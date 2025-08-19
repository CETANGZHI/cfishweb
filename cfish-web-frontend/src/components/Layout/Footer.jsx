import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: MessageCircle, href: '#', label: 'Discord' },
  ];

  const footerNav = [
    { 
      title: t('footer.marketplace'), 
      links: [
        { label: t('footer.allNfts'), href: '/marketplace' },
        { label: t('footer.art'), href: '/marketplace?category=art' },
        { label: t('footer.music'), href: '/marketplace?category=music' },
        { label: t('footer.gaming'), href: '/marketplace?category=gaming' },
        { label: t('footer.collectibles'), href: '/marketplace?category=collectibles' },
      ]
    },
    { 
      title: t('footer.myAccount'), 
      links: [
        { label: t('footer.profile'), href: '/profile' },
        { label: t('footer.wallet'), href: '/wallet' },
        { label: t('footer.create'), href: '/create' },
        { label: t('footer.settings'), href: '/settings' },
      ]
    },
    { 
      title: t('footer.resources'), 
      links: [
        { label: t('footer.helpCenter'), href: '/help' },
        { label: t('footer.partners'), href: '/partners' },
        { label: t('footer.community'), href: '/community' },
        { label: t('footer.blog'), href: '/blog' },
        { label: t('footer.docs'), href: '/docs' },
      ]
    },
    { 
      title: t('footer.company'), 
      links: [
        { label: t('footer.aboutUs'), href: '/about' },
        { label: t('footer.careers'), href: '/careers' },
        { label: t('footer.contactUs'), href: '/contact' },
        { label: t('footer.terms'), href: '/terms' },
        { label: t('footer.privacy'), href: '/privacy' },
      ]
    },
  ];

  return (
    <footer className="bg-card border-t border-border py-8 lg:py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-full lg:col-span-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="logo flex items-center gap-2 text-2xl font-bold text-foreground mb-4">
              <div className="logo-icon w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-xl pulse-glow">
                🐟
              </div>
              <span>CFISH</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={index} 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          {footerNav.map((section, index) => (
            <div key={index} className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.href} 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Version */}
        <div className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CFISH NFT Marketplace. {t('footer.allRightsReserved')}</p>
          <p className="mt-1">{t('footer.version')} 1.0.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

