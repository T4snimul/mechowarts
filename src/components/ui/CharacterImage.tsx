import { useState, useEffect } from 'react';
import { getCharacterAvatar } from '@/utils/characterImages';
import type { Person } from '@/types';

interface CharacterImageProps {
  person: Person;
  className?: string;
  alt?: string;
}

export function CharacterImage({ person, className = '', alt }: CharacterImageProps) {
  const [imageSrc, setImageSrc] = useState(person.avatar);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      try {
        const newSrc = await getCharacterAvatar(person);
        setImageSrc(newSrc);
      } catch (error) {
        console.error('Failed to load character image:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [person]);

  const handleImageError = () => {
    // Fallback to original avatar if everything fails
    setImageSrc(person.avatar);
  };

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center`}>
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt || person.name}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
}
