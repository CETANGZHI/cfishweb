import React from 'react';
import { useTranslation } from 'react-i18next';

const RarityTag = ({ rarity, className = '' }) => {
  const { t } = useTranslation();

  const getRarityClasses = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return 'bg-gray-600 text-gray-100';
      case 'uncommon':
        return 'bg-green-600 text-green-100';
      case 'rare':
        return 'bg-blue-600 text-blue-100';
      case 'epic':
        return 'bg-purple-600 text-purple-100';
      case 'legendary':
        return 'bg-yellow-600 text-yellow-100';
      case 'mythic':
        return 'bg-red-600 text-red-100';
      default:
        return 'bg-gray-500 text-gray-100';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRarityClasses(rarity)} ${className}`}
    >
      {t(`rarity.${rarity?.toLowerCase()}`)}
    </span>
  );
};

export default RarityTag;


