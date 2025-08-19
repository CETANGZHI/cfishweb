import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Filter, 
  SortAsc, 
  SortDesc, 
  ChevronDown, 
  X,
  DollarSign,
  Clock,
  Star,
  Percent,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const NFTSortFilter = ({ 
  onSortChange, 
  onFilterChange, 
  currentSort = 'newest',
  currentFilters = {},
  className = '' 
}) => {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    {
      value: 'newest',
      label: t('sort.newest'),
      icon: Clock,
      description: t('sort.newestDesc')
    },
    {
      value: 'oldest',
      label: t('sort.oldest'),
      icon: Clock,
      description: t('sort.oldestDesc')
    },
    {
      value: 'price_low_high',
      label: t('sort.priceLowHigh'),
      icon: TrendingUp,
      description: t('sort.priceLowHighDesc')
    },
    {
      value: 'price_high_low',
      label: t('sort.priceHighLow'),
      icon: TrendingDown,
      description: t('sort.priceHighLowDesc')
    },
    {
      value: 'commission_low_high',
      label: t('sort.commissionLowHigh'),
      icon: TrendingUp,
      description: t('sort.commissionLowHighDesc')
    },
    {
      value: 'commission_high_low',
      label: t('sort.commissionHighLow'),
      icon: TrendingDown,
      description: t('sort.commissionHighLowDesc')
    },
    {
      value: 'rarity_high_low',
      label: t('sort.rarityHighLow'),
      icon: Star,
      description: t('sort.rarityHighLowDesc')
    },
    {
      value: 'rarity_low_high',
      label: t('sort.rarityLowHigh'),
      icon: Star,
      description: t('sort.rarityLowHighDesc')
    }
  ];

  const filterCategories = [
    {
      key: 'priceRange',
      label: t('filter.priceRange'),
      type: 'range',
      min: 0,
      max: 1000,
      step: 0.1,
      unit: 'SOL'
    },
    {
      key: 'commissionRange',
      label: t('filter.commissionRange'),
      type: 'range',
      min: 0,
      max: 10,
      step: 0.1,
      unit: '%'
    },
    {
      key: 'category',
      label: t('filter.category'),
      type: 'select',
      options: [
        { value: 'art', label: t('category.art') },
        { value: 'music', label: t('category.music') },
        { value: 'gaming', label: t('category.gaming') },
        { value: 'photography', label: t('category.photography') },
        { value: 'collectibles', label: t('category.collectibles') }
      ]
    },
    {
      key: 'rarity',
      label: t('filter.rarity'),
      type: 'select',
      options: [
        { value: 'common', label: t('rarity.common') },
        { value: 'uncommon', label: t('rarity.uncommon') },
        { value: 'rare', label: t('rarity.rare') },
        { value: 'epic', label: t('rarity.epic') },
        { value: 'legendary', label: t('rarity.legendary') }
      ]
    },
    {
      key: 'status',
      label: t('filter.status'),
      type: 'checkbox',
      options: [
        { value: 'buy_now', label: t('status.buyNow') },
        { value: 'auction', label: t('status.auction') },
        { value: 'offers', label: t('status.hasOffers') }
      ]
    }
  ];

  const currentSortOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0];
  const CurrentSortIcon = currentSortOption.icon;

  const handleSortChange = (sortValue) => {
    onSortChange(sortValue);
    setShowSortDropdown(false);
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...currentFilters, [filterKey]: value };
    onFilterChange(newFilters);
  };

  const clearFilter = (filterKey) => {
    const newFilters = { ...currentFilters };
    delete newFilters[filterKey];
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({});
  };

  const activeFilterCount = Object.keys(currentFilters).length;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      {/* Top Row: Sort and Filter Buttons */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary/70 rounded-lg border border-border transition-colors"
          >
            <CurrentSortIcon size={16} />
            <span className="text-sm font-medium">{currentSortOption.label}</span>
            <ChevronDown 
              size={14} 
              className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} 
            />
          </button>

          {showSortDropdown && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSortDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
                <div className="py-2">
                  {sortOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-secondary/50 transition-colors ${
                          currentSort === option.value ? 'bg-secondary/30' : ''
                        }`}
                      >
                        <IconComponent size={16} className="text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            showFilters || activeFilterCount > 0
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-secondary/50 hover:bg-secondary/70 border-border'
          }`}
        >
          <Filter size={16} />
          <span className="text-sm font-medium">{t('filter.filters')}</span>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Clear All Filters */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('filter.clearAll')}
          </button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(currentFilters).map(([key, value]) => {
            const category = filterCategories.find(cat => cat.key === key);
            if (!category) return null;

            let displayValue = value;
            if (category.type === 'range' && Array.isArray(value)) {
              displayValue = `${value[0]} - ${value[1]} ${category.unit || ''}`;
            } else if (category.type === 'select') {
              const option = category.options.find(opt => opt.value === value);
              displayValue = option ? option.label : value;
            } else if (category.type === 'checkbox' && Array.isArray(value)) {
              displayValue = value.map(v => {
                const option = category.options.find(opt => opt.value === v);
                return option ? option.label : v;
              }).join(', ');
            }

            return (
              <div
                key={key}
                className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{category.label}: {displayValue}</span>
                <button
                  onClick={() => clearFilter(key)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterCategories.map((category) => (
              <div key={category.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {category.label}
                </label>
                
                {category.type === 'range' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        min={category.min}
                        max={category.max}
                        step={category.step}
                        value={currentFilters[category.key]?.[0] || ''}
                        onChange={(e) => {
                          const newValue = [
                            parseFloat(e.target.value) || category.min,
                            currentFilters[category.key]?.[1] || category.max
                          ];
                          handleFilterChange(category.key, newValue);
                        }}
                        className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
                      />
                      <span className="text-muted-foreground">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        min={category.min}
                        max={category.max}
                        step={category.step}
                        value={currentFilters[category.key]?.[1] || ''}
                        onChange={(e) => {
                          const newValue = [
                            currentFilters[category.key]?.[0] || category.min,
                            parseFloat(e.target.value) || category.max
                          ];
                          handleFilterChange(category.key, newValue);
                        }}
                        className="flex-1 px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
                      />
                      {category.unit && (
                        <span className="text-muted-foreground text-sm">{category.unit}</span>
                      )}
                    </div>
                  </div>
                )}

                {category.type === 'select' && (
                  <select
                    value={currentFilters[category.key] || ''}
                    onChange={(e) => handleFilterChange(category.key, e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm"
                  >
                    <option value="">{t('filter.selectOption')}</option>
                    {category.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {category.type === 'checkbox' && (
                  <div className="space-y-2">
                    {category.options.map((option) => (
                      <label key={option.value} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={currentFilters[category.key]?.includes(option.value) || false}
                          onChange={(e) => {
                            const currentValues = currentFilters[category.key] || [];
                            const newValues = e.target.checked
                              ? [...currentValues, option.value]
                              : currentValues.filter(v => v !== option.value);
                            handleFilterChange(category.key, newValues.length > 0 ? newValues : undefined);
                          }}
                          className="rounded border-border"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTSortFilter;

