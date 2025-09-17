// Utility to fetch Harry Potter character images
export async function fetchHPCharacterImage(
  characterName: string
): Promise<string | null> {
  try {
    const response = await fetch('https://hp-api.onrender.com/api/characters');
    const characters = await response.json();

    // Find character by name (case insensitive)
    const character = characters.find(
      (char: any) =>
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

// Get character image with fallback
export async function getCharacterAvatar(person: {
  name: string;
  isSpecial?: boolean;
  specialType?: string;
}) {
  // Always return a generic male avatar image for all characters
  return 'https://randomuser.me/api/portraits/men/1.jpg';
}
