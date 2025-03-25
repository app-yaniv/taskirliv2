import Hero from '@/components/features/Hero'
import Categories from '@/components/features/Categories'
import FeaturedItems from '@/components/features/FeaturedItems'
import Benefits from '@/components/features/Benefits'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedItems />
      <Benefits />
    </div>
  )
}
