import Image from 'next/image'
import EventImg from '@/assets/images/group-friends-eating-restaurant 1.png'
import CateringImg from '@/assets/images/kebab-set-table 1.png'
import BrthDaysImg from '@/assets/images/charming-female-blowing-candles-birthday-cake-after-making-her-wish-party 1.png'
import WeddingImg from '@/assets/images/happy-man-wife-sunny-day 1.png'

export default function Services() {
  const services = [
    {
      image: CateringImg,
      title: 'Catering',
      description: 'In the new era of technology we look in the future with certainty for life.',
    },
    {
      image: BrthDaysImg,
      title: 'Birthdays',
      description: 'In the new era of technology we look in the future with certainty for life.',
    },
    {
      image: WeddingImg,
      title: 'Weddings',
      description: 'In the new era of technology we look in the future with certainty for life.',
    },
    {
      image: EventImg,
      title: 'Events',
      description: 'In the new era of technology we look in the future with certainty for life.',
    },
  ]

  return (
    <section className="py-24 bg-gray-50 px-24">
      <div className="container">
        <h2 className="text-3xl font-serif mb-12">
          We also offer unique<br />services for your events
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="space-y-4">
              <Image
                src={service.image}
                alt={service.title}
                width={300}
                height={200}
                className="rounded-lg w-full"
              />
              <h3 className="font-semibold text-sm text-dark-700">{service.title}</h3>
              <p className="text-xs text-dark-50">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

