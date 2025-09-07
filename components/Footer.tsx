'use client';

import Image from 'next/image';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const Footer = () => {
  const footerSections: FooterSection[] = [
    {
      title: 'Featured',
      links: [
        { name: 'Air Force 1', href: '/products/air-force-1' },
        { name: 'Huarache', href: '/products/huarache' },
        { name: 'Air Max 90', href: '/products/air-max-90' },
        { name: 'Air Max 95', href: '/products/air-max-95' },
      ],
    },
    {
      title: 'Shoes',
      links: [
        { name: 'All Shoes', href: '/shoes' },
        { name: 'Custom Shoes', href: '/shoes/custom' },
        { name: 'Jordan Shoes', href: '/shoes/jordan' },
        { name: 'Running Shoes', href: '/shoes/running' },
      ],
    },
    {
      title: 'Clothing',
      links: [
        { name: 'All Clothing', href: '/clothing' },
        { name: 'Modest Wear', href: '/clothing/modest' },
        { name: 'Hoodies & Pullovers', href: '/clothing/hoodies' },
        { name: 'Shirts & Tops', href: '/clothing/shirts' },
      ],
    },
    {
      title: "Kids'",
      links: [
        { name: 'Infant & Toddler Shoes', href: '/kids/infant' },
        { name: "Kids' Shoes", href: '/kids/shoes' },
        { name: "Kids' Jordan Shoes", href: '/kids/jordan' },
        { name: "Kids' Basketball Shoes", href: '/kids/basketball' },
      ],
    },
  ];

  const socialIcons = [
    { name: 'X (Twitter)', icon: '/x.svg', href: 'https://twitter.com/codalware' },
    { name: 'Facebook', icon: '/facebook.svg', href: 'https://facebook.com/codalware' },
    { name: 'Instagram', icon: '/instagram.svg', href: 'https://instagram.com/codalware' },
  ];

  const legalLinks = [
    { name: 'Guides', href: '/guides' },
    { name: 'Terms of Sale', href: '/terms-sale' },
    { name: 'Terms of Use', href: '/terms-use' },
    { name: 'CODALWARE Privacy Policy', href: '/privacy' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Subtle top border */}
      <hr className="border-slate-700/30 border-t-[0.5px]" />
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and Location */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <Image
                src="/logo.svg"
                alt="CODALWARE"
                width={60}
                height={24}
                className="h-6 w-auto brightness-0 invert"
              />
            </div>
            
            {/* Location */}
            <div className="flex items-start space-x-2 mb-8">
              <MapPinIcon className="h-5 w-5 text-gray-300 flex-shrink-0 mt-1" />
              <div>
                <p 
                  className="text-gray-300"
                  style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                >
                  Lomé, Togo
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors duration-200 group"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={16}
                    height={16}
                    className="w-4 h-4 filter invert group-hover:invert-0 transition-all duration-200"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h3 
                className="text-white font-medium mb-6 uppercase tracking-wide"
                style={{ fontSize: 'var(--text-body-medium)', lineHeight: 'var(--text-body-medium--line-height)' }}
              >
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                      style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--text-body--line-height)' }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-gray-400">
              <MapPinIcon className="h-4 w-4 mr-2" />
              <span style={{ fontSize: 'var(--text-footnote)', lineHeight: 'var(--text-footnote--line-height)' }}>
                © 2025 CODALWARE, Inc. All Rights Reserved
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6">
              {legalLinks.map((link, index) => (
                <div key={link.name} className="flex items-center">
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    style={{ fontSize: 'var(--text-footnote)', lineHeight: 'var(--text-footnote--line-height)' }}
                  >
                    {link.name}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-slate-600 mx-3">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
