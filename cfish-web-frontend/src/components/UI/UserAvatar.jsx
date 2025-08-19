import React from 'react';

const UserAvatar = ({ src, alt, size = 'md', className = '', ...props }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`relative flex items-center justify-center rounded-full bg-gray-700 text-white overflow-hidden ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold uppercase">
          {alt ? alt.charAt(0) : '?'}
        </span>
      )}
    </div>
  );
};

export default UserAvatar;


