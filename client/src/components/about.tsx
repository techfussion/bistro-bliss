'use client'

import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import shawarma from "@/assets/images/sharwama.png";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function About() {
  const pathname = usePathname();

  return (
    <section className="bg-silk-50 py-24 pb-32">
      <div className="container mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
        
        {/* Image Section */}
        <div className="relative">
          <Image
            src={shawarma}
            alt="Healthy food wrap"
            width={450}
            height={300}
            className="rounded-2xl object-cover"
          />
          
          <div className="absolute bottom-[-50] left-44 bg-gray-900 text-white p-8 rounded-xl space-y-6 w-[60%]">
            <h4 className="font-semibold text-lg">Come and visit us</h4>
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs">
                    <Phone className="w-4 h-4" />
                    <span>(+234) 857 - 0107</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                    <Mail className="w-4 h-4" />
                    <span>bite@bistro_bliss.com</span>
                </div>
                
                <div className="flex items-center gap-3 text-xs">
                    <MapPin className="w-4 h-4" />
                    <span>837 W. Marshall Lane, IA 50158, Kano, Nigeria</span>
                </div>
            </div>
          </div>
        </div>

        {/* Text Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-serif">
            We provide healthy food for your family.
          </h2>

          <p className="text-sm font-medium text-gray-700">
            Our story began with a vision to create a unique dining experience
            that merges fine dining, exceptional service, and a vibrant ambiance.
            Rooted in the city's rich culinary culture, we aim to honor our local
            roots while infusing a global palate.
          </p>

          <p className="text-[13px] font-light text-gray-700">
            At place, we believe that dining is not just about food, but also
            about the overall experience. Our staff, renowned for their warmth
            and dedication, strives to make every visit an unforgettable event.
          </p>
          {
            pathname !== '/about' && (
              <Button asChild variant='outline' className="text-xs px-6 py-2 rounded-full font-medium">
                <Link href="/about">More About Us</Link>
              </Button>
            )
          }
        </div>
      </div>
    </section>
  );
}
