// Generate static params for static export
export async function generateStaticParams() {
  return [{ id: 'sample-product' }]
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 