import { Fragment } from "react";
import Header from "@/components/header";
import Testimonials from "@/components/testimonials";
import Footer from "@/components/footer";
import About from "@/components/about";
import bg from "@/assets/images/bg copy.png";
import dining from "@/assets/images/dining.png";
import play from "@/assets/icons/play.png";
import order from '@/assets/icons/order.svg';
import timer from '@/assets/icons/timer.svg';
import menu from '@/assets/icons/restaurant-menu.svg';
import Image from "next/image";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <Fragment>
      <Header />
      <main>
        <About />
        <section className="pb-16">
          <div className="relative w-full h-[500px]">
            <Image
              src={bg}
              alt="bg"
              layout="fill"
              objectFit="cover"
              className="absolute"
            />
            <div className="absolute inset-0 flex flex-col space-y-4 items-center justify-center text-white font-serif z-10 p-8 mx-8">
              <Image
                src={play}
                alt="icon"
                width={60}
                height={60}
                className="rounded-full"
              />
              <h1 className="text-4xl font-bold text-gray-800">Feel the authentic & <br /> original taste from us</h1>
            </div>  
          </div>
          <div className="p-8 px-24 flex justify-between gap-3">
            <div className="flex items-center gap-3">
              <Image
                src={menu}
                alt="icon"
                width={40}
                height={40}
              />
              <div>
                <h2 className="text-xs font-serif mt-8 font-semibold">Multi Cuisine</h2>
                <p className="text-gray-700 mt-2 text-xs w-2/3">
                  In the new era of technology we look in the future with certainty life.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={order}
                alt="icon"
                width={40}
                height={40}
              />
              <div>
                <h2 className="text-xs font-serif mt-8 font-semibold">Easy To Order</h2>
                <p className="text-gray-700 mt-2 text-xs w-2/3">
                  In the new era of technology we look in the future with certainty life.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={timer}
                alt="icon"
                width={40}
                height={40}
              />
              <div>
                <h2 className="text-xs font-serif mt-8 font-semibold">Fast Delivery</h2>
                <p className="text-gray-700 mt-2 text-xs w-2/3">
                  In the new era of technology we look in the future with certainty life.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-silk-50 py-16 px-24">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            
            {/* Text Content */}
            <div className="flex-1 md:pr-12">
              <h2 className="text-3xl text-dark-700 mb-4 leading-snug font-serif">
                A little information for our valuable guest
              </h2>
              <p className="text-sm text-gray-700 mb-8">
                At our place, we believe that dining is not just about food, but also about the overall experience. Our staff, renowned for their warmth and dedication, strives to make every visit an unforgettable event.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <Card className="rounded py-7 text-center">
                  <h3 className="text-3xl font-semibold text-gray-700 font-serif">3</h3>
                  <p className="text-xs mt-2 text-gray-700">Locations</p>
                </Card>
                <Card className="rounded py-7 text-center">
                  <h3 className="text-3xl font-semibold text-gray-700 font-serif">1995</h3>
                  <p className="text-xs mt-2 text-gray-700">Founded</p>
                </Card>
                <Card className="rounded py-7 text-center">
                  <h3 className="text-3xl font-semibold text-gray-700 font-serif">65+</h3>
                  <p className="text-xs mt-2 text-gray-700">Staff Members</p>
                </Card>
                <Card className="rounded py-7 text-center">
                  <h3 className="text-3xl font-semibold text-gray-700 font-serif">100%</h3>
                  <p className="text-xs mt-2 text-gray-700">Satisfied Customers</p>
                </Card>
              </div>
            </div>

            {/* Image Content */}
            <div className="flex-1 mt-8 md:mt-0">
              <Image
                src={dining}
                alt="Preparing food"
                className="rounded-2xl shadow-lg"
                width={450}
                height={400}
                objectFit="cover"
              />
            </div>
          </div>
        </section>
        <Testimonials />
      </main>
      <Footer />
    </Fragment>
  );
}
