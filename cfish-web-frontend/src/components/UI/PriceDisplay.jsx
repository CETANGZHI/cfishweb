import React from 'react';
import { useTranslation } from 'react-i18next';

const PriceDisplay = ({ amount, currency = 'SOL', className = '' }) => {
  const { t } = useTranslation();

  if (amount === undefined || amount === null) {
    return <span className={`text-muted-foreground ${className}`}>{t('common.not_listed')}</span>;
  }

  return (
    <span className={`font-bold text-lg text-primary-foreground ${className}`}>
      {amount} {currency}
    </span>
  );
};

export default PriceDisplay;


