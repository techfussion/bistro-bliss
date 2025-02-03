import Header from '@/components/header'
import Footer from '@/components/footer'
import Image from 'next/image'
import map from '@/assets/images/map.png'
import ContactUsForm from '@/components/contact-us-form'

export default function Home() {
  return (
    <div className='bg-silk-50'>
      <Header />
      <main>
        <section className="relative pt-16">
          <div className="flex flex-col items-center mx-auto w-1/2 gap-4 z-10 mb-72">
            <h1 className="text-6xl text-dark-700 font-serif tracking-wide">Contact Us</h1>
            <p className="text-dark-100 text-sm text-center w-2/3">
              We consider all the drivers of change gives you the components you need to change to create a truly happens.
            </p>
          </div>

          {/* Reservation Form */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 max-w-lg w-full">
            <ContactUsForm />
          </div>

          {/* Map Image */}
          <div className='h-[500px] bg-white'/>
        </section>
      </main>
      <Footer />
    </div>
  )
}

