import type { SortBy } from '@/types';

interface GreatHallProps {
  sortBy: SortBy;
  setSortBy: (sortBy: SortBy) => void;
  totalCount: number;
  filteredCount: number;
  houseFilter: string;
  setHouseFilter: (house: string) => void;
  bloodGroupFilter: string;
  setBloodGroupFilter: (bloodGroup: string) => void;
}

export function GreatHall({
  sortBy,
  setSortBy,
  totalCount,
  filteredCount,
  houseFilter,
  setHouseFilter,
  bloodGroupFilter,
  setBloodGroupFilter,
}: GreatHallProps) {

  const sortOptions = [
    { value: 'roll', label: 'Roll Number' },
    { value: 'name', label: 'Name' },
    { value: 'bloodGroup', label: 'Blood Status' },
    { value: 'hometown', label: 'Hometown' },
  ];

  const houseOptions = [
    { value: '', label: 'All Houses' },
    { value: 'Gryffindor', label: 'Gryffindor' },
    { value: 'Hufflepuff', label: 'Hufflepuff' },
    { value: 'Ravenclaw', label: 'Ravenclaw' },
    { value: 'Slytherin', label: 'Slytherin' },
  ];

  const bloodGroupOptions = [
    { value: '', label: 'All Blood Status' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  const clearAllFilters = () => {
    setHouseFilter('');
    setBloodGroupFilter('');
    setSortBy('roll');
  };

  const hasActiveFilters = houseFilter || bloodGroupFilter || sortBy !== 'roll';

  return (
    <section className="mx-auto max-w-5xl px-6 py-4">
      {/* Hero Section */}
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          The Great Hall
        </h1>
        <p className="font-sans text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-2">
          Welcome to the heart of MechoWarts, where students from all four houses gather.
          Here you'll find our brilliant wizards and witches, each with their unique talents and magical heritage.
        </p>
        <p className="font-sans text-sm italic text-gray-500 dark:text-gray-400">
          "It is our choices that show what we truly are, far more than our abilities." - Albus Dumbledore
        </p>
      </div>

      {/* Flat Controls */}
      <div className="border-b border-gray-200/60 dark:border-gray-700/60 pb-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Stats */}
          <div className="font-display text-xl font-bold text-gray-900 dark:text-white">
            <span className="text-amber-600 dark:text-amber-400">{filteredCount !== totalCount ? filteredCount : totalCount}</span>
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2 font-sans">
              {filteredCount !== totalCount ? `of ${totalCount} wizards` : 'wizards enrolled'}
            </span>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 font-sans transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            {/* House Filter */}
            <select
              value={houseFilter}
              onChange={(e) => setHouseFilter(e.target.value)}
              className="border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 font-sans transition-colors"
            >
              {houseOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Blood Group Filter */}
            <select
              value={bloodGroupFilter}
              onChange={(e) => setBloodGroupFilter(e.target.value)}
              className="border-b-2 border-gray-300 dark:border-gray-600 bg-transparent px-2 py-1 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 font-sans transition-colors"
            >
              {bloodGroupOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white dark:bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-red-600 dark:text-red-400 text-sm font-medium hover:text-red-700 dark:hover:text-red-300 underline underline-offset-2 font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 rounded px-1"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GreatHall;
