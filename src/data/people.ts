import type { Person } from '@/types';
import { generateAllHarryPotterPeople } from '@/utils/harryPotterGenerator';

export const PEOPLE: Person[] = generateAllHarryPotterPeople();

// Utility functions for working with people data
export function getPersonById(id: string): Person | undefined {
  return PEOPLE.find(person => person.id === id);
}

export function getPersonByRoll(roll: string): Person | undefined {
  return PEOPLE.find(person => person.roll === roll);
}

export function getPeopleByHouse(house: string): Person[] {
  return PEOPLE.filter(person => person.house === house);
}

export function getActivePeople(): Person[] {
  return PEOPLE.filter(person => person.status === 'active');
}

export function getTotalPeopleCount(): number {
  return getActivePeople().length;
}

export function getSpecialPeople(): Person[] {
  return PEOPLE.filter(person => person.isSpecial);
}

export function getHouseStatistics() {
  const houses = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'] as const;

  return houses.map(house => ({
    house,
    count: getPeopleByHouse(house).length,
    percentage: Math.round((getPeopleByHouse(house).length / PEOPLE.length) * 100)
  }));
}
