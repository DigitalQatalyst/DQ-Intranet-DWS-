import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
type FilterPanelProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategories: string[];
  handleCategorySelect: (category: string) => void;
  clearFilters: () => void;
  toggleFilterPanel: () => void;
};
export function FilterPanel({
  searchTerm,
  setSearchTerm,
  selectedCategories,
  handleCategorySelect,
  clearFilters,
  toggleFilterPanel
}: FilterPanelProps) {
  const categories = ['Internal', 'Client', 'Training', 'Launches'];
  return <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#030F35]">Filters</h2>
        <button onClick={toggleFilterPanel} className="md:hidden text-gray-500 hover:text-[#FB5535]">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input type="text" placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB5535] focus:border-transparent transition-all" />
        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#FB5535]">
            <XIcon className="h-4 w-4" />
          </button>}
      </div>
      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => <button key={category} onClick={() => handleCategorySelect(category)} className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedCategories.includes(category) ? 'bg-[#FB5535] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {category}
            </button>)}
        </div>
      </div>
      {/* Clear Filters */}
      {(searchTerm || selectedCategories.length > 0) && <button onClick={clearFilters} className="w-full py-2 border border-[#FB5535] text-[#FB5535] rounded-lg hover:bg-[#FB5535] hover:text-white transition-colors duration-300 text-sm font-medium">
          Clear All Filters
        </button>}
    </div>;
}