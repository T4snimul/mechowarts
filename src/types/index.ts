// Core types for the application
export interface Person {
  id: string;
  roll: string;
  name: string;
  bloodGroup: string;
  hometown: string;
  phone: string;
  fb: string;
  avatar: string;
  house: 'gryffindor' | 'hufflepuff' | 'ravenclaw' | 'slytherin';
  houseRoll: string;
  status: 'active' | 'inactive';
}

export type SortBy = 'roll' | 'name' | 'bloodGroup' | 'hometown';

export interface FilterState {
  query: string;
  sortBy: SortBy;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Component prop types
export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface SortSelectProps {
  value: SortBy;
  onChange: (value: SortBy) => void;
}

export interface ProfileCardProps {
  person: Person;
  index: number;
}

export interface GridProps {
  people: Person[];
}

// House styling types
export interface HouseClasses {
  ring: string;
  tint: string;
  chip: string;
  name: string;
  roll: string;
}

// Animation types
export interface MotionProps {
  initial?: object;
  animate?: object;
  whileHover?: object;
  transition?: object;
}
