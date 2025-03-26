export async function generateStaticParams() {
  // For static export, we'll use a dummy ID
  // This is needed because Next.js requires this function for static export
  return [{ id: 'placeholder' }]
}

export default function RentLayout({ children }: { children: React.ReactNode }) {
  return children
} 