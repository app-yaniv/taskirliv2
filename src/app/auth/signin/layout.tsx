export async function generateStaticParams() {
  // For static export, we'll use a dummy placeholder
  return [{}]
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
} 