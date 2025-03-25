Set up the frontend according to the following prompt:
  <frontend-prompt>
  Create detailed components with these requirements:
  1. Use 'use client' directive for client-side components
  2. Make sure to concatenate strings correctly using backslash
  3. Style with Tailwind CSS utility classes for responsive design
  4. Use Lucide React for icons (from lucide-react package). Do NOT use other UI libraries unless requested
  5. Use stock photos from picsum.photos where appropriate, only valid URLs you know exist
  6. Configure next.config.js image remotePatterns to enable stock photos from picsum.photos
  7. Create root layout.tsx page that wraps necessary navigation items to all pages
  8. MUST implement the navigation elements items in their rightful place i.e. Left sidebar, Top header
  9. Accurately implement necessary grid layouts
  10. Follow proper import practices:
     - Use @/ path aliases
     - Keep component imports organized
     - Update current src/app/page.tsx with new comprehensive code
     - Don't forget root route (page.tsx) handling
     - You MUST complete the entire prompt before stopping
  </frontend-prompt>

  <summary_title>
Camera Equipment Rental Marketplace Platform UI
</summary_title>

<image_analysis>
1. Navigation Elements:
- Primary navigation: Create Listing, profile, Bookings, Product
- Top-right: "New fat llama users", "Download", "FAQ's", "Contact" links
- Sign-in/Sign-up buttons in header
- Logo positioned top-left, white llama icon on purple background
- Search bar centrally positioned with location selector

2. Layout Components:
- Header height: ~64px
- Main hero section: ~500px height
- Search container: ~50px height, centered
- Category tags: ~32px height
- Product grid: 3x2 layout for featured items
- Testimonials section: Carousel style

3. Content Sections:
- Hero section with "Rent instead of buying" headline
- Popular categories tags/chips
- Recently active items grid
- User testimonials carousel
- Benefits section with 6 key features
- Footer with multiple columns

4. Interactive Controls:
- Search bar with location picker
- Category filter chips
- Product cards with save/bookmark function
- Star rating system on products
- Location selector with dropdown
- Sign in/Sign up CTAs

5. Colors:
- Primary: #5E3EBA (Purple)
- Secondary: #FFFFFF (White)
- Accent: #FF6B6B (Coral)
- Background: #F5F5F5 (Light Gray)
- Text: #333333 (Dark Gray)

6. Grid/Layout Structure:
- 12-column grid system
- Container max-width: 1200px
- Gutter width: 24px
- Card grid: 3 columns on desktop
- Responsive breakpoints at 768px and 1024px
</image_analysis>

<development_planning>
1. Project Structure:
```
src/
├── components/
│   ├── layout/
│   │   ├── Header
│   │   ├── Footer
│   │   └── Navigation
│   ├── features/
│   │   ├── Search
│   │   ├── ProductGrid
│   │   ├── Categories
│   │   └── Testimonials
│   └── shared/
├── assets/
├── styles/
├── hooks/
└── utils/
```

2. Key Features:
- Search functionality with location filtering
- Product listing grid with pagination
- Category filtering system
- User authentication
- Booking management
- Product creation flow

3. State Management:
```typescript
interface AppState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
  };
  products: {
    items: Product[];
    loading: boolean;
    filters: FilterOptions;
  };
  search: {
    query: string;
    location: Location;
    results: SearchResult[];
  };
}
```

4. Component Architecture:
- App (Root)
  ├── Layout
  │   ├── Header
  │   ├── Navigation
  │   └── Footer
  ├── Features
  │   ├── SearchBar
  │   ├── CategoryFilter
  │   ├── ProductGrid
  │   └── TestimonialCarousel

5. Responsive Breakpoints:
```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1200px
);
```
</development_planning>