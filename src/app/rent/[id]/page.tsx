import RentalDetailClient from '@/components/rent/RentalDetailClient'

export default async function RentalPage({ params }: { params: { id: string } }) {
  return <RentalDetailClient id={params.id} />
}

export async function generateStaticParams() {
  // For now, return a fixed set of IDs
  // This will be replaced with dynamic IDs in production
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' }
  ]
} 