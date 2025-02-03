import { Fragment } from 'react'
import Header from '@/components/header'
import Hero from '@/components/hero'
import MenuCategories from '@/components/menu-categories'
import Services from '@/components/services'
import Testimonials from '@/components/testimonials'
import Footer from '@/components/footer'
import About from '@/components/about'
import FastDeliverySection from '@/components/fast-food-delivery'

export default function Home() {
  return (
    <Fragment>
      <Header />
      <main>
        <Hero />
        <MenuCategories />
        <About />
        <Services />
        <FastDeliverySection />
        <Testimonials />
      </main>
      <Footer />
    </Fragment>
  )
}

