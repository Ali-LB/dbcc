"use client";
import { Coffee, MagnifyingGlass, X, Clock } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

interface MapControlsProps {
  showCoffeeShops: boolean;
  showPosts: boolean;
  searchTerm: string;
  onToggleCoffeeShops: () => void;
  onTogglePosts: () => void;
  onSearchChange: (term: string) => void;
  matchingShopsCount?: number;
}

const MAX_RECENT_SEARCHES = 5;

export function MapControls({
  showCoffeeShops,
  showPosts,
  searchTerm,
  onToggleCoffeeShops,
  onTogglePosts,
  onSearchChange,
  matchingShopsCount = 0,
}: MapControlsProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("recentMapSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage when they change
  useEffect(() => {
    localStorage.setItem("recentMapSearches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  // Add search term to recent searches
  const addToRecentSearches = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s !== term);
      return [term, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  };

  // Handle search term change
  const handleSearchChange = (term: string) => {
    onSearchChange(term);
    if (term.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (term: string) => {
    onSearchChange(term);
    addToRecentSearches(term);
    setShowSuggestions(false);
  };

  // Clear search
  const handleClearSearch = () => {
    onSearchChange("");
    setShowSuggestions(false);
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
      <h3 className="font-bold text-lg mb-3 text-[#7f5539]">Map Legend</h3>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#7f5539] rounded-full border-2 border-[#e6ccb2] flex items-center justify-center">
            <Coffee size={16} className="text-[#e6ccb2]" />
          </div>
          <span className="text-sm">Coffee Shop</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded-full border-2 border-[#b08968] shadow-md"></div>
          <span className="text-sm">Individual Post</span>
        </div>
      </div>

      <div className="border-t pt-3 mb-3">
        <h4 className="font-semibold text-sm mb-2 text-[#7f5539]">
          Search Coffee Shops
        </h4>
        <div className="relative">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search coffee shops..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-8 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b08968] focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>

          {/* Search Results Counter */}
          {searchTerm && (
            <div className="mt-1 text-sm text-gray-500">
              Found {matchingShopsCount} coffee shop
              {matchingShopsCount !== 1 ? "s" : ""}
            </div>
          )}

          {/* Recent Searches and Suggestions */}
          {showSuggestions && (recentSearches.length > 0 || searchTerm) && (
            <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {searchTerm &&
                recentSearches.some((s) =>
                  s.toLowerCase().includes(searchTerm.toLowerCase())
                ) && (
                  <div className="p-2 border-b">
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                      Suggestions
                    </div>
                    {recentSearches
                      .filter((s) =>
                        s.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 rounded"
                        >
                          <MagnifyingGlass
                            size={14}
                            className="text-gray-400"
                          />
                          {suggestion}
                        </button>
                      ))}
                  </div>
                )}

              {(!searchTerm ||
                !recentSearches.some((s) =>
                  s.toLowerCase().includes(searchTerm.toLowerCase())
                )) &&
                recentSearches.length > 0 && (
                  <div className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1">
                      Recent Searches
                    </div>
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectSuggestion(term)}
                        className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 rounded"
                      >
                        <Clock size={14} className="text-gray-400" />
                        {term}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t pt-3">
        <h4 className="font-semibold text-sm mb-2 text-[#7f5539]">Filters</h4>

        <label className="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCoffeeShops}
            onChange={onToggleCoffeeShops}
            className="rounded border-[#b08968] text-[#b08968] focus:ring-[#b08968]"
          />
          <span className="text-sm">Show Coffee Shops</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPosts}
            onChange={onTogglePosts}
            className="rounded border-[#b08968] text-[#b08968] focus:ring-[#b08968]"
          />
          <span className="text-sm">Show Individual Posts</span>
        </label>
      </div>
    </div>
  );
}
