'use client'

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Layout, Store, ShoppingBag, Calendar } from 'lucide-react';
import logo from '@/assets/icons/logo.png';

const LINKS = [
  { path: '/admin', label: 'Overview', icon: Layout },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/menu', label: 'Menu Management', icon: Store },
//   { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/reservations', label: 'Reservations', icon: Calendar },
//   { path: '/admin/payments', label: 'Payments', icon: CreditCard },
];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="flex items-center gap-2 justify-center mt-6">
          <img src={logo.src} alt="logo" className="h-5 w-5" />
          <span className="text-l font-semibold font-serif italic">Bistro Bliss</span>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {LINKS.map((link) => (
              <li key={link.path}>
                <Link href={link.path}
                className={`block w-full text-xs p-2 flex items-center rounded-lg ${
                    pathname === link.path
                    ? 'bg-red-700 text-white'
                    : 'hover:bg-gray-50'
                }`}
                  >
                    <link.icon className="w-5 h-5 mr-2" />
                    {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
