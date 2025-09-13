import type { Person } from '@/types';

export const PEOPLE: Person[] = [
  {
    id: "1",
    roll: "2408001",
    name: "Rafiul Hasan",
    bloodGroup: "B+",
    hometown: "Chattogram",
    phone: "+8801XXXXXXXX1",
    fb: "https://facebook.com/rafiul.hasan",
    avatar: "https://i.pravatar.cc/160?img=15",
    house: "gryffindor",
    houseRoll: "GR001",
    status: "active"
  },
  {
    id: "2",
    roll: "2408002",
    name: "Tasnim Ahmed",
    bloodGroup: "A+",
    hometown: "Dhaka",
    phone: "+8801XXXXXXXX2",
    fb: "https://facebook.com/tasnim.ahmed",
    avatar: "https://i.pravatar.cc/160?img=16",
    house: "ravenclaw",
    houseRoll: "RC001",
    status: "active"
  },
  {
    id: "3",
    roll: "2408003",
    name: "Shahidur Rahman",
    bloodGroup: "O+",
    hometown: "Sylhet",
    phone: "+8801XXXXXXXX3",
    fb: "https://facebook.com/shahidur.rahman",
    avatar: "https://i.pravatar.cc/160?img=17",
    house: "hufflepuff",
    houseRoll: "HF001",
    status: "active"
  },
  {
    id: "4",
    roll: "2408004",
    name: "Fatima Khatun",
    bloodGroup: "AB+",
    hometown: "Rajshahi",
    phone: "+8801XXXXXXXX4",
    fb: "https://facebook.com/fatima.khatun",
    avatar: "https://i.pravatar.cc/160?img=18",
    house: "slytherin",
    houseRoll: "SL001",
    status: "active"
  },
  {
    id: "5",
    roll: "2408005",
    name: "Mohammad Ali",
    bloodGroup: "B-",
    hometown: "Khulna",
    phone: "+8801XXXXXXXX5",
    fb: "https://facebook.com/mohammad.ali",
    avatar: "https://i.pravatar.cc/160?img=21",
    house: "gryffindor",
    houseRoll: "GR002",
    status: "active"
  }
];

// Utility functions for working with people data
export function getPersonById(id: string): Person | undefined {
  return PEOPLE.find(person => person.id === id);
}

export function getPersonByRoll(roll: string): Person | undefined {
  return PEOPLE.find(person => person.roll === roll);
}

export function getPeopleByHouse(house: Person['house']): Person[] {
  return PEOPLE.filter(person => person.house === house);
}

export function getPeopleByStatus(status: Person['status']): Person[] {
  return PEOPLE.filter(person => person.status === status);
}

export function getActivePeople(): Person[] {
  return getPeopleByStatus('active');
}

export function getTotalPeopleCount(): number {
  return PEOPLE.length;
}

export function getActivePeopleCount(): number {
  return getActivePeople().length;
}

export function getHouseStatistics() {
  const houses = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'] as const;

  return houses.map(house => ({
    house,
    count: getPeopleByHouse(house).length,
    percentage: Math.round((getPeopleByHouse(house).length / PEOPLE.length) * 100)
  }));
}
