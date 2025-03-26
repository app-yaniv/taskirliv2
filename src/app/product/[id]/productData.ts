// Sample product data - in a real app this would come from an API
export const sampleProduct = {
  id: 'sample-product',
  title: 'CANON EOS R6 MARK II BODY + 28-70MM F/2.8 LENS + FLASH',
  images: [
    '/product-camera-body.jpg',
    '/product-camera-lens.jpg',
    '/product-camera-flash.jpg',
  ],
  category: 'Camera Package Deals',
  location: 'White City',
  distance: '4.4 mi',
  owner: {
    name: 'Kabir L',
    avatar: '/avatar-placeholder.jpg',
    responseRate: '86%',
    responseTime: 'Usually responds within an hour',
    verified: true,
    rating: 5
  },
  pricing: {
    day1: 45,
    day3: 120,
    day7: 230
  },
  description: 'This versatile bundle combines the Canon EOS R6 Mark II with the RF 28-70mm f/2.8 lens, offering exceptional image quality and low-light performance. Paired with a high-quality flash, it ensures optimal lighting for your shots, whether in the studio or on-location.',
  useCases: [
    'Event Photography: Capture vivid and sharp images during weddings, parties, and corporate events with excellent low-light capabilities and a flash for balanced lighting.',
    'Studio Photography: Use the flash to illuminate subjects and achieve professional-grade results in controlled environments.',
    'Portrait Photography: Create stunning portraits with rich details and perfectly lit subjects.',
    'Travel Photography: The flexible zoom lens ensures wide-angle and close-up capabilities, making it ideal for capturing moments on the go.'
  ],
  included: [
    'Canon EOS R6 Mark II camera body',
    'RF 28-70mm f/2.8 lens',
    'High-performance flash',
    '3x batteries for extended usage',
    'Battery charger'
  ],
  insurance: 'Fat Llama covers damages up to £25,000 per item',
  cancellation: 'Free cancellation until 2 days before your rental starts. After that, you\'ll get half your money back until the day before.'
} 