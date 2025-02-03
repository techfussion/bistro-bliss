'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail } from 'lucide-react';
import Profile from './profile';
import clsx from 'clsx';
import logo from '@/assets/icons/logo.png'

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/menu', label: 'Menu' },
    { href: '/contact', label: 'Contact' },
    { href: '/book', label: 'Reservation' },
  ];

  return (
    <header className="top-0 left-0 right-0 z-50 bg-silk-50">
      <div className="flex items-center justify-between bg-gray-900 text-silk-50 text-xs px-24">
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2'>
            <Phone className="w-2.5 h-2.5" />
            <span className="text-[10px] tracking-wide">+234 - 90909090</span>
          </div>
          <div className='flex items-center gap-2'>
            <Mail className="w-2.5 h-2.5" />
            <span className="text-[10px] tracking-wide">bite@bistro_bliss.com</span>
          </div>
        </div>
        <div>
          <div className="flex gap-2 my-1.5">
            <Link href="#" className="p-1 rounded-full bg-gray-50">
              <Facebook className="w-2.5 h-2.5" />
            </Link>
            <Link href="#"  className="p-1 rounded-full bg-gray-50">
              <Twitter className="w-2.5 h-2.5" />
            </Link>
            <Link href="#"  className="p-1 rounded-full bg-gray-50">
              <Instagram className="w-2.5 h-2.5" />
            </Link>
            <Link href="#"  className="p-1 rounded-full bg-gray-50">
              <Youtube className="w-2.5 h-2.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between py-2 px-24">
        <Link href="/" className="flex items-center gap-2 justify-center">
          <img src={logo.src} alt="logo" className="h-5 w-5" />
          <span className="text-l font-semibold font-serif italic">Bistro Bliss</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'font-medium transition duration-500 hover:scale-105',
                pathname === item.href ? 'text-red-700' : 'text-dark-700'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <Profile />
      </div>
    </header>
  );
}
