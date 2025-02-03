import Image from "next/image";
import { Clock, Tag, ShoppingBag } from "lucide-react";
import img1 from "@/assets/images/mid-shot-chef-holding-plate-with-pasta-making-ok-sign 1.png";
import img2 from "@/assets/images/sadj-iron-pot-with-various-salads 1.png";
import img3 from "@/assets/images/sour-curry-with-snakehead-fish-spicy-garden-hot-pot-thai-food 1.png";

export default function FastDeliverySection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1 row-span-2">
            <Image
              src={img1}
              alt="Chef cooking"
              width={600}
              height={800}
              className="rounded-2xl object-cover h-full relative top-[-30px]"
            />
          </div>
          <Image
            src={img3}
            alt="Seafood plate"
            width={300}
            height={200}
            className="rounded-2xl object-cover"
          />
          <Image
            src={img2}
            alt="Grilled platter"
            width={300}
            height={200}
            className="rounded-2xl object-cover"
          />
        </div>

        {/* Text Content */}
        <div>
          <h2 className="text-4xl font-serif">
            We boast of the fastest <br /> food delivery in the city
          </h2>

          <p className="mt-4 text-gray-700 w-3/4 font-normal text-sm">
            Our visual designer lets you quickly drag and drop your way to custom apps for both desktop and mobile.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-700 rounded-full">
                    <Clock className="w-4 h-4 text-white" />
                </div>
              Delivery within 30 minutes
            </li>
            <li className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-700 rounded-full">
                    <Tag className="w-4 h-4 text-white" />
                </div>
              Best Offer & Prices
            </li>
            <li className="flex items-center gap-3 text-gray-700">
                <div className="p-2 bg-red-700 rounded-full">
                    <ShoppingBag className="w-4 h-4 text-white" />
                </div>
              Online Services Available
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
