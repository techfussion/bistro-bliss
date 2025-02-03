'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import bg1 from '@/assets/images/vegetables-set-left-black-slate 1.png'
import bg2 from '@/assets/images/burger.png'
import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image'

export default function Hero() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <Carousel
        opts={{ align: "start", loop: true }}
        className="w-screen min-h-[400px] relative border-none shadow-none"
    >
        <CarouselContent>
            <CarouselItem>
                <div className="relative w-full h-[500px] overflow-hidden">
                {/* Background Image */}
                <Image 
                    src={bg1} 
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover z-[-50]" 
                />

                {/* Foreground Content */}
                <div className="relative z-10 flex flex-col justify-center h-full space-y-6 pl-24">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-silk-700">
                    Best food for<br />your taste
                    </h1>
                    <p className="text-gray-700 max-w-md">
                    Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven.
                    </p>
                    <div className="flex gap-4">
                        <Button asChild className="text-white bg-red-700 hover:bg-red-700/90 rounded-full text-xs font-medium tracking-wide">
                            <Link href="/book">Book a Table</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full text-xs font-medium tracking-wide">
                            <Link href="/menu">Explore Menu</Link>
                        </Button>
                    </div>
                </div>
                </div>
            </CarouselItem>
            <CarouselItem>
                <div className="relative w-full h-[500px] overflow-hidden">
                {/* Background Image */}
                <Image 
                    src={bg2} 
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover z-[-50]" 
                />

                {/* Foreground Content */}
                <div className="relative z-10 flex flex-col justify-center h-full space-y-6 pl-24">
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-silk-700">
                    Best food for<br />your taste
                    </h1>
                    <p className="text-silk-700 max-w-md">
                    Discover delectable cuisine and unforgettable moments in our welcoming, culinary haven.
                    </p>
                    <div className="flex gap-4">
                        <Button asChild className="text-white bg-red-700 hover:bg-red-700/90 rounded-full text-xs font-medium tracking-wide  transition duration-500 hover:translate-y-1 cursor-pointer hover:scale-105">
                            <Link href="/book">Book a Table</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-full text-xs font-medium tracking-wide transition duration-500 hover:translate-y-1 cursor-pointer hover:scale-105">
                            <Link href="/menu">Explore Menu</Link>
                        </Button>
                    </div>
                </div>
                </div>
            </CarouselItem>
        </CarouselContent>
    </Carousel>
  )
}

