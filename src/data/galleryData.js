// Gallery data - Add your artwork here
// Each artwork needs: id, title, category, image, year, client (optional), description (optional)
// Categories: 'commissions', 'personal', 'sketches', 'other'
export const galleryItems = [
  // Example entries - replace with your actual artwork
  {
    id: 1,
    title: 'Example Commission 1',
    category: 'commissions',
    image: '/path/to/image.jpg',
    year: '2025',
    client: 'Client Name',
    description: 'Brief description of the artwork'
  },
  {
    id: 2,
    title: 'Personal Art 1',
    category: 'personal',
    image: '/path/to/image2.jpg',
    year: '2025',
    description: 'Personal artwork description'
  },
  {
    id: 3,
    title: 'Sketch 1',
    category: 'sketches',
    image: '/path/to/image3.jpg',
    year: '2024',
    description: 'Quick sketch description'
  }
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'commissions', label: 'Commissions' },
  { id: 'personal', label: 'Personal' },
  { id: 'sketches', label: 'Sketches' },
  { id: 'other', label: 'Other' }
];
