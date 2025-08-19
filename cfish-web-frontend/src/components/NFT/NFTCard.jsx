import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NFTCard = ({ nft }) => {
  const { t } = useTranslation();
  const { id, name, creator, price, image, rarity, likes = 0 } = nft;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'bg-purple-600';
      case 'Epic': return 'bg-red-500';
      case 'Rare': return 'bg-blue-500';
      case 'Common': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 group relative">
      <Link to={`/nft/${id}`}>
        <img src={image} alt={name} className="w-full h-48 object-cover" />
      </Link>
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
        <Heart size={14} className="mr-1 text-red-400" /> {likes}
      </div>
      <div className="p-4">
        <Link to={`/nft/${id}`}>
          <h3 className="font-semibold text-lg mb-1 text-primary-foreground group-hover:text-primary transition-colors">{name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm">{t('common.creator')}: {creator}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-primary font-bold text-xl">{price}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRarityColor(rarity)} text-white`}>
            {rarity}
          </span>
        </div>
        <button className="mt-4 w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
          {t('common.buyNow')}
        </button>
      </div>
    </div>
  );
};

export default NFTCard;


