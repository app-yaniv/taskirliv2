import React from 'react';
import Image from 'next/image';

interface RentalItem {
  title: string;
  images: string[];
}

interface RentalDetailClientProps {
  item: RentalItem;
}

const RentalDetailClient = ({ item }: RentalDetailClientProps) => {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);
  const images = item.images || [];
  const currentImage = images[selectedImage] || '/placeholder.png';

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-w-16 aspect-h-9">
        <Image
          src={hasError ? '/placeholder.png' : currentImage}
          alt={item.title}
          fill
          className="object-cover rounded-lg"
          onError={() => setHasError(true)}
          unoptimized
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <Image
                src={image}
                alt={`${item.title} - תמונה ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentalDetailClient; 