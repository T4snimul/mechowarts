import type { Person } from '@/types';
import {
  HARRY_POTTER_NAMES,
  HARRY_POTTER_LOCATIONS,
  HARRY_POTTER_IMAGES,
  MAGICAL_SKILLS,
  PATRONUS_FORMS,
  WAND_COMPOSITIONS
} from '../data/harryPotterData';

// Utility function to get random item from array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Utility function to get random items from array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Blood groups
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Houses distribution
const HOUSES = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'] as const;

// House roles
const HOUSE_ROLES = [
  'Prefect', 'Head Boy', 'Head Girl', 'Quidditch Captain', 'Seeker', 'Keeper',
  'Chaser', 'Beater', 'Team Captain', 'Study Group Leader', 'Dueling Club Member',
  'Potions Club President', 'Herbology Assistant', 'Library Monitor', 'Hall Monitor',
  'House Points Champion', 'Outstanding Student', 'Magical Creature Expert',
  'Astronomy Club Leader', 'Ancient Runes Scholar', 'Arithmancy Ace', 'Defense Expert'
];

// Generate magical stories
function generateMagicalStory(name: string, house: string): string {
  const storyTemplates = [
    `${name} discovered their magical abilities at a young age and has been excelling in ${house} house ever since. Known for their exceptional spell work and dedication to magical studies.`,
    `A brilliant wizard from ${house} house, ${name} has shown remarkable talent in various magical disciplines. Their journey at Hogwarts has been filled with adventures and academic achievements.`,
    `${name} comes from a long line of wizards and has upheld the traditions of ${house} house with honor. Their magical prowess and leadership qualities make them stand out among their peers.`,
    `As a dedicated student of ${house} house, ${name} has mastered numerous advanced spells and potions. Their commitment to magical education is an inspiration to fellow students.`,
    `${name} has proven to be one of the most talented wizards in ${house} house, with exceptional skills in both theoretical magic and practical spellcasting.`
  ];

  return getRandomItem(storyTemplates);
}

export function generateHarryPotterPerson(index: number): Person {
  // Special logic for roll assignment to avoid duplicates
  // Harry Potter (index 0) gets roll 009, others get sequential rolls but skip 009
  let rollNumber: number;
  if (index === 0) {
    rollNumber = 9; // Harry Potter gets roll 009
  } else if (index <= 8) {
    rollNumber = index; // 1, 2, 3, 4, 5, 6, 7, 8 (skip 9 which is Harry's)
  } else {
    rollNumber = index + 1; // 10, 11, 12, ... (skip 9)
  }

  const roll = `2408${String(rollNumber).padStart(3, '0')}`;
  const name = HARRY_POTTER_NAMES[index];
  const house = HOUSES[index % 4];
  const housePrefix = house.substring(0, 2).toUpperCase();

  return {
    id: String(rollNumber),
    roll,
    name,
    bloodGroup: getRandomItem(BLOOD_GROUPS),
    hometown: HARRY_POTTER_LOCATIONS[index],
    phone: `+8801${String(700000000 + rollNumber * 1000 + Math.floor(Math.random() * 1000))}`,
    fb: `https://facebook.com/${name.toLowerCase().replace(/\s+/g, '.')}`,
    avatar: HARRY_POTTER_IMAGES[index],
    house,
    houseRoll: `${housePrefix}${String(rollNumber).padStart(3, '0')}`,
    houseRole: getRandomItem(HOUSE_ROLES),
    status: 'active' as const,
    isSpecial: index === 0 || index === 19 || index === 36, // Harry Potter (index 0), Dobby, Voldemort positions
    specialType: index === 0 ? 'hero' : index === 19 ? 'magical-being' : index === 36 ? 'villain' : undefined,
    story: generateMagicalStory(name, house),
    skills: getRandomItems(MAGICAL_SKILLS, Math.floor(Math.random() * 6) + 4), // 4-9 skills
    patronus: getRandomItem(PATRONUS_FORMS),
    wand: getRandomItem(WAND_COMPOSITIONS),
    yearsAtHogwarts: Math.floor(Math.random() * 7) + 1 // 1-7 years
  };
}

// Generate all 60 people with Harry Potter theme
export function generateAllHarryPotterPeople(): Person[] {
  const people: Person[] = [];

  for (let i = 0; i < 60; i++) {
    people.push(generateHarryPotterPerson(i));
  }

  // Ensure special characters have specific details
  const harryIndex = people.findIndex(p => p.name === "Harry Potter");
  if (harryIndex !== -1) {
    people[harryIndex] = {
      ...people[harryIndex],
      id: "9",
      roll: "2408009",
      bloodGroup: "O+",
      hometown: "Godric's Hollow",
      phone: "+8801777777777",
      fb: "https://facebook.com/harry.potter",
      avatar: "https://static.wikia.nocookie.net/harrypotter/images/f/f1/Harry_Potter_DHF2.jpg",
      house: "gryffindor",
      houseRoll: "GR009",
      houseRole: "The Boy Who Lived",
      isSpecial: true,
      specialType: "hero",
      story: "The boy who lived, the chosen one. Harry discovered he was a wizard on his 11th birthday and went on to defeat the Dark Lord Voldemort. Known for his courage, loyalty to friends, and his lightning bolt scar. He survived the killing curse as a baby and later sacrificed himself to save the wizarding world.",
      skills: ["Defense Against Dark Arts", "Quidditch Seeker", "Parseltongue", "Patronus Charm"],
      patronus: "Stag",
      wand: "Holly and Phoenix Feather, 11 inches",
      yearsAtHogwarts: 7
    };
  }

  // Ensure Dobby has specific details
  const dobbyIndex = people.findIndex(p => p.name === "Dobby");
  if (dobbyIndex !== -1) {
    people[dobbyIndex] = {
      ...people[dobbyIndex],
      id: "20",
      roll: "2408020",
      bloodGroup: "Unknown",
      hometown: "Malfoy Manor",
      phone: "+8801999999999",
      fb: "https://facebook.com/dobby.freeelf",
      avatar: "https://static.wikia.nocookie.net/harrypotter/images/6/6f/Dobby_DH1.jpg",
      house: "gryffindor", // Honorary house for his bravery
      houseRoll: "GR020",
      houseRole: "Free Elf Hero",
      isSpecial: true,
      specialType: "magical-being",
      story: "Dobby is a free elf! Once enslaved by the Malfoy family, Dobby was freed by Harry Potter and became one of his most loyal friends. Known for his bravery, loyalty, and powerful magic, Dobby made the ultimate sacrifice to help Harry and his friends escape from Malfoy Manor. 'Such a beautiful place, to be with friends.'",
      skills: ["House-elf Magic", "Apparition", "Protective Charms", "Cleaning Magic", "Clothes Magic"],
      patronus: "Sock",
      wand: "None (House-elf magic)",
      yearsAtHogwarts: 0
    };
  }

  return people;
}
