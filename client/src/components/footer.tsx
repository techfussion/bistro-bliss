import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/icons/logo.png'

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white text-xs py-12 px-24">
      <div className="container">
        <div className="flex justify-between">
          <div className='text-silk-700'>
            <div className='flex items-center gap-2'>
              <Image
                src={logo}
                alt="logo"
                width={50}
                height={50}
              />
              <h3 className="text-xl font-semibold text-white italic font-serif">Bistro Bliss</h3>
            </div>
            <p className="text-gray-400 w-2/3 mt-4">
              In the new era of technology we look in the future with certainty and pride for life.
            </p>
            <div>
              <div className="flex gap-3 mt-7">
                <Link href="#" className="p-2 rounded-full bg-red-700">
                  <Facebook className="w-4 h-4" />
                </Link>
                <Link href="#"  className="p-2 rounded-full bg-red-700">
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link href="#"  className="p-2 rounded-full bg-red-700">
                  <Instagram className="w-4 h-4" />
                </Link>
                <Link href="#"  className="p-2 rounded-full bg-red-700">
                  <Youtube className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className='text-silk-700'>
            <h4 className="font-medium mb-4 text-white">Pages</h4>
            <ul className="space-y-2">
              <li><Link href="/menu">Menu</Link></li>
              <li><Link href="/restaurant">Restaurant</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/about">Cart</Link></li>
              <li><Link href="/contact">Checkout</Link></li>
            </ul>
          </div>
          <div className='text-silk-700'>
            <h4 className="font-medium mb-4 text-white">Services</h4>
            <ul className="space-y-2">
              <li>Catering</li>
              <li>Birthdays</li>
              <li>Weddings</li>
              <li>Events</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Follow Us on Instagram</h4>
            <div className="grid grid-cols-2 gap-2">
              {[1,2,3,4].map((item) => (
                <Image
                  key={item}
                  src=""
                  alt="Instagram post"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-silk-700">
          <p>Copyright © {year} Bistro_Bliss. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

