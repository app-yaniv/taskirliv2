export async function generateStaticParams() {
  // For static export, we'll use both a dummy ID and the specific ID from the error
  // This is needed because Next.js requires this function for static export
  return [
    { id: 'placeholder' },
    { id: '5147507c-6e06-40eb-b7d5-095e07cc12ed' }
  ]
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children
} 