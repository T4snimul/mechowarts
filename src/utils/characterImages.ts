import type { Person } from '@/types';

// Utility to fetch Harry Potter character images
export async function fetchHPCharacterImage(
  characterName: string
): Promise<string | null> {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters');
    const characters = await response.json();

    // Find character by name (case insensitive)
    const character = characters.find(
      (char: { name: string; image?: string }) =>
        char.name.toLowerCase().includes(characterName.toLowerCase()) ||
        characterName.toLowerCase().includes(char.name.toLowerCase())
    );

    return character?.image || null;
  } catch (error) {
    console.error('Failed to fetch HP character image:', error);
    return null;
  }
}

// Fallback images for special characters
export const specialCharacterImages = {
  harry:
    'https://static.wikia.nocookie.net/harrypotter/images/f/f1/Harry_Potter_DHF2.jpg/revision/latest?cb=20161106005516',
  voldemort:
    'https://static.wikia.nocookie.net/harrypotter/images/a/a3/Voldemort_Headshot_DHP1.png/revision/latest?cb=20161203043648',
  dobby:
    'https://static.wikia.nocookie.net/harrypotter/images/6/64/Dobby_2.jpg/revision/latest?cb=20161215051802',
};

// Default avatar fallback
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';

// Get character image with fallback
export async function getCharacterAvatar(person: Pick<Person, 'avatar' | 'name' | 'roll'>): Promise<string> {
  // If person has an avatar URL, use it
  if (person.avatar && person.avatar.trim() !== '') {
    return person.avatar;
  }

  // Generate a consistent avatar based on roll number for those without avatars
  if (person.roll) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${person.roll}`;
  }

  // Final fallback using name
  if (person.name) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(person.name)}`;
  }

  return DEFAULT_AVATAR;
}
