import React, { useState, useEffect, useCallback } from 'react';
import { X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../contexts/NotificationContext';

const TagInput = ({ initialTags = [], onTagsChange }) => {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [tags, setTags] = useState(initialTags);
  const [inputValue, setInputValue] = useState('');
  const [showPredefined, setShowPredefined] = useState(false);
  const [predefinedTags, setPredefinedTags] = useState({});
  const [loadingPredefinedTags, setLoadingPredefinedTags] = useState(true);

  useEffect(() => {
    onTagsChange(tags);
  }, [tags, onTagsChange]);

  const fetchPredefinedTags = useCallback(async () => {
    setLoadingPredefinedTags(true);
    try {
      // Replace with your actual API endpoint for fetching predefined tags
      const response = await fetch('https://api.example.com/tags/predefined');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPredefinedTags(data);
    } catch (error) {
      console.error('Failed to fetch predefined tags:', error);
      addNotification({
        type: 'error',
        title: t('error'),
        message: t('Failed to load predefined tags.')
      });
    } finally {
      setLoadingPredefinedTags(false);
    }
  }, [addNotification, t]);

  useEffect(() => {
    fetchPredefinedTags();
  }, [fetchPredefinedTags]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue.trim());
      setInputValue('');
    }
  };

  const addTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePredefinedTagClick = (tagLabel) => {
    addTag(tagLabel);
    setShowPredefined(false);
  };

  return (
    <div className="tag-input-container">
      <label className="block text-sm font-medium text-foreground mb-2">
        {t('nft.tags')}
      </label>
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 text-primary hover:text-primary-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowPredefined(true)}
          onBlur={() => setTimeout(() => setShowPredefined(false), 100)}
          placeholder={t('nft.addTagPlaceholder')}
          className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {showPredefined && !loadingPredefinedTags && Object.keys(predefinedTags).length > 0 && (
          <div className="absolute z-10 w-full bg-card border border-border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {Object.keys(predefinedTags).map((categoryKey) => (
              <div key={categoryKey} className="p-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                  {t(`nft.predefinedTags.${categoryKey}`)}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {predefinedTags[categoryKey].map((tag) => (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => handlePredefinedTagClick(tag.label)}
                      className="px-3 py-1 text-sm rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {showPredefined && loadingPredefinedTags && (
          <div className="absolute z-10 w-full bg-card border border-border rounded-lg shadow-lg mt-1 p-4 text-center text-muted-foreground">
            {t('Loading predefined tags...')}
          </div>
        )}
        {showPredefined && !loadingPredefinedTags && Object.keys(predefinedTags).length === 0 && (
          <div className="absolute z-10 w-full bg-card border border-border rounded-lg shadow-lg mt-1 p-4 text-center text-muted-foreground">
            {t('No predefined tags available.')}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {t('nft.tagInstructions')}
      </p>
    </div>
  );
};

export default TagInput;


