import Image from 'next/image'
import person1 from '@/assets/icons/person1.png'
import person2 from '@/assets/icons/person2.png'
import person3 from '@/assets/icons/person3.png'

export default function Testimonials() {
  const testimonials = [
    {
      quote: '"The best restaurant"',
      text: 'Last night, we dined at place and were simply blown away. The service was impeccable, and the food was outstanding.',
      author: 'Sophire Robson',
      location: 'Los Angeles, CA'
    },
    {
      quote: '"Simply delicious"',
      text: 'Place exceeded my expectations on all levels. The ambiance was sophisticated yet comfortable, making it perfect place for our anniversary dinner.',
      author: 'Matt Cannon',
      location: 'San Diego, CA'
    },
    {
      quote: '"One of a kind restaurant"',
      text: 'The culinary experience at place is first class. The food quality and presentation are exceptional. The staff is knowledgeable and attentive.',
      author: 'Andy Smith',
      location: 'San Francisco, CA'
    }
  ]

  return (
    <section className="py-24 px-24">
      <div className="container">
        <h2 className="text-3xl font-serif text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-8 bg-silk-50 px-6 py-6 rounded text-xs">
              <p className="font-semibold text-sm text-red-700">{testimonial.quote}</p>
              <p className="text-gray-600 leading-loose">{testimonial.text}</p>
              <hr />
              <div className="flex items-center gap-4">
                <Image
                  src={index === 0 ? person1 : index === 1 ? person2 : person3}
                  alt="person"
                  width={40}
                  height={40}
                />
                <div>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

