'use client';

import Image from 'next/image';
import Link from 'next/link';
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
        { name: 'Recommendations', href: '/recommendations' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-12">
          {/* Logo and Location - Full width on mobile, centered; original layout on larger screens */}
          <div className="text-center md:text-left md:col-span-2 lg:col-span-2 mb-8 md:mb-0">
            <div className="mb-6 lg:mb-8 flex justify-center md:justify-start">
              <Link href="/" className="hover:opacity-80 transition-opacity">
                <Image
                  src="/logo.svg"
                  alt="CODALWARE"
                  width={80}
                  height={32}
                  className="h-6 lg:h-8 w-auto brightness-0 invert"
                />
              </Link>
            </div>
            
            {/* Location */}
            <div className="flex items-start space-x-3 mb-6 lg:mb-8 justify-center md:justify-start">
              <MapPinIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-300 text-sm lg:text-base">
                  Lomé, Togo
                </p>
                <p className="text-gray-400 text-xs lg:text-sm mt-1">
                  West Africa Hub
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3 lg:space-x-4 justify-center md:justify-start">
              {socialIcons.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-800 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all duration-300 group hover:scale-110"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={20}
                    height={20}
                    className="w-4 h-4 lg:w-5 lg:h-5 filter invert group-hover:invert-0 transition-all duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile: 2-column grid for navigation sections */}
          <div className="grid grid-cols-2 gap-6 md:hidden">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-center">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-center">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-yellow-400 transition-all duration-200 text-sm block py-1"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Medium+ devices: Original layout */}
          {footerSections.map((section) => (
            <div key={`desktop-${section.title}`} className="hidden md:block lg:col-span-1">
              <h3 className="text-white font-semibold mb-4 lg:mb-6 text-sm lg:text-base uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-all duration-200 text-sm lg:text-base block py-1 hover:translate-x-1 transform"
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
      <div className="border-t border-slate-700/50 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-gray-400 text-xs lg:text-sm">
              <MapPinIcon className="h-3 w-3 lg:h-4 lg:w-4 mr-2 text-yellow-400" />
              <span>
                © 2025 CODALWARE, Inc. All Rights Reserved
              </span>
            </div>

            {/* Legal Links - Stack on mobile, inline on desktop */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
                {legalLinks.map((link, index) => (
                  <div key={link.name} className="flex items-center">
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-xs lg:text-sm whitespace-nowrap"
                    >
                      {link.name}
                    </a>
                    {index < legalLinks.length - 1 && (
                      <span className="text-slate-600 mx-2 lg:mx-3 hidden sm:inline">|</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Mobile-only brand tagline */}
          <div className="text-center mt-4 lg:hidden">
            <p className="text-gray-500 text-xs">
              Crafted with ❤️ for sneaker enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
