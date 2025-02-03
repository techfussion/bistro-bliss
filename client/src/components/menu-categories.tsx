import { Coffee, UtensilsCrossed, Wine, Cake } from 'lucide-react'
import Link from 'next/link'
import { Card } from './ui/card'

export default function MenuCategories() {
  const categories = [
    {
      icon: Coffee,
      title: 'Breakfast',
      description: 'In the new era of technology we look in the future with certainty and pride for our life.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Main Dishes',
      description: 'In the new era of technology we look in the future with certainty and pride for our life.',
    },
    {
      icon: Wine,
      title: 'Drinks',
      description: 'In the new era of technology we look in the future with certainty and pride for our life.',
    },
    {
      icon: Cake,
      title: 'Desserts',
      description: 'In the new era of technology we look in the future with certainty and pride for our life.',
    },
  ]

  return (
    <section className="py-24 px-24">
      <div className="container">
        <h2 className="text-3xl font-serif text-center mb-12">Browse Our Menu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="text-center space-y-4 p-6 transition duration-500 hover:translate-y-3 cursor-pointer hover:scale-105">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-silk-50">
                <category.icon className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-sm text-dark-700">{category.title}</h3>
              <p className="text-xs text-dark-50 leading-relaxed">{category.description}</p>
              <Link href="/menu" className="text-red-700 text-xs font-semibold">
                Explore Menu
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

