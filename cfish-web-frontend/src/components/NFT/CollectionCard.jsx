import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CollectionCard = ({ collection }) => {
  const { t } = useTranslation();
  const { id, name, creator, itemsCount, floorPrice, image } = collection;

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-105 group relative">
      <Link to={`/collections/${id}`}>
        <img src={image} alt={name} className="w-full h-40 object-cover" />
      </Link>
      <div className="p-4">
        <Link to={`/collections/${id}`}>
          <h3 className="font-semibold text-lg mb-1 text-primary-foreground group-hover:text-primary transition-colors">{name}</h3>
        </Link>
        <p className="text-muted-foreground text-sm">{t('common.creator')}: {creator}</p>
        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">{t('homepage.itemsCount', { count: itemsCount })}</span>
            <span className="text-primary font-bold text-lg">{t('homepage.floorPrice')}: {floorPrice}</span>
          </div>
          <button className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm hover:bg-primary/90 transition-colors">
            {t('homepage.viewCollection')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;


