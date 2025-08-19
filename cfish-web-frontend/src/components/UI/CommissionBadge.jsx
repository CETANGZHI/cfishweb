import React from 'react';
import { Percent, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CommissionBadge = ({ 
  commission, 
  size = 'default',
  showIcon = true,
  showLabel = true,
  variant = 'default',
  className = ''
}) => {
  const { t } = useTranslation();

  // 根据佣金比例确定颜色和样式
  const getCommissionStyle = (commission) => {
    if (commission <= 2) {
      return {
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30',
        icon: TrendingDown,
        label: t('lowCommission')
      };
    } else if (commission <= 5) {
      return {
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30',
        icon: Percent,
        label: t('normalCommission')
      };
    } else {
      return {
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
        icon: TrendingUp,
        label: t('highCommission')
      };
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    default: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    default: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const style = getCommissionStyle(commission);
  const IconComponent = style.icon;

  if (variant === 'minimal') {
    return (
      <span className={`inline-flex items-center space-x-1 ${style.textColor} ${className}`}>
        {showIcon && <Percent className={iconSizes[size]} />}
        <span className="font-medium">{commission}%</span>
      </span>
    );
  }

  if (variant === 'tooltip') {
    return (
      <div className="group relative">
        <div className={`inline-flex items-center space-x-1 ${sizeClasses[size]} ${style.bgColor} ${style.textColor} ${style.borderColor} border rounded-full font-medium ${className}`}>
          {showIcon && <IconComponent className={iconSizes[size]} />}
          <span>{commission}%</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap border border-gray-700">
          <div className="text-center">
            <div className="font-semibold">{t('commissionRate')}</div>
            <div className="text-gray-300">{style.label}</div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-2 ${sizeClasses[size]} ${style.bgColor} ${style.textColor} ${style.borderColor} border rounded-lg font-medium ${className}`}>
      {showIcon && <IconComponent className={iconSizes[size]} />}
      <div className="flex flex-col">
        <span className="font-semibold">{commission}%</span>
        {showLabel && (
          <span className="text-xs opacity-80">{t('commission')}</span>
        )}
      </div>
    </div>
  );
};

// 佣金比较组件
export const CommissionComparison = ({ currentCommission, averageCommission, className = '' }) => {
  const { t } = useTranslation();
  const difference = currentCommission - averageCommission;
  const isLower = difference < 0;
  
  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <CommissionBadge commission={currentCommission} size="sm" variant="minimal" />
      <span className="text-gray-400">vs</span>
      <span className="text-gray-300">{t('avgCommission')}: {averageCommission}%</span>
      <span className={`flex items-center space-x-1 ${isLower ? 'text-green-400' : 'text-red-400'}`}>
        {isLower ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
        <span>{Math.abs(difference).toFixed(1)}%</span>
      </span>
    </div>
  );
};

export default CommissionBadge;

