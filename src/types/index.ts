// ============================================
// Core Domain Types
// ============================================

/** House types for Hogwarts */
export type House = 'gryffindor' | 'hufflepuff' | 'ravenclaw' | 'slytherin';

/** Person status */
export type Status = 'active' | 'inactive';

/** Special character types */
export type SpecialType = 'hero' | 'villain' | 'magical-being';

/** Sort options */
export type SortBy = 'roll' | 'name' | 'bloodGroup' | 'hometown';

/** Theme options */
export type Theme = 'light' | 'dark' | 'system';

// ============================================
// Entity Types
// ============================================

/** Person entity */
export interface Person {
  id: string;
  roll: string;
  name: string;
  bloodGroup: string;
  hometown: string;
  phone: string;
  fb: string;
  avatar: string;
  house: House;
  houseRoll: string;
  houseRole?: string;
  status: Status;
  isSpecial?: boolean;
  specialType?: SpecialType;
  story?: string;
  skills?: string[];
  patronus?: string;
  wand?: string;
  yearsAtHogwarts?: number;
}

/** Authenticated user */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roll: string;
  avatar?: string;
  person?: Person;
}

// ============================================
// State Types
// ============================================

export interface FilterState {
  query: string;
  sortBy: SortBy;
  house?: House;
  bloodGroup?: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

// ============================================
// Component Prop Types
// ============================================

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
  onOpenPerson?: (person: Person) => void;
}

export interface GridProps {
  people: Person[];
}

// ============================================
// Styling Types
// ============================================

export interface HouseClasses {
  ring: string;
  tint: string;
  chip: string;
  name: string;
  roll: string;
}

// ============================================
// Animation Types
// ============================================

export interface MotionProps {
  initial?: object;
  animate?: object;
  whileHover?: object;
  transition?: object;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

export interface PeopleApiResponse extends ApiResponse<Person[]> {
  count: number;
}

export interface PersonApiResponse extends ApiResponse<Person> {}

