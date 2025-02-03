import { Fragment } from 'react'
import Header from '@/components/header'
import Testimonials from '@/components/testimonials'
import Footer from '@/components/footer'

export default function Menu() {
  return (
    <Fragment>
      <Header />
      <main>
        <Testimonials />
      </main>
      <Footer />
    </Fragment>
  )
}

