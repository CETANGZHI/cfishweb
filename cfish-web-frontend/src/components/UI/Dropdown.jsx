import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ children, trigger, position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'origin-top-left left-0 mt-2';
      case 'bottom-right':
        return 'origin-top-right right-0 mt-2';
      case 'top-left':
        return 'origin-bottom-left left-0 mb-2 bottom-full';
      case 'top-right':
        return 'origin-bottom-right right-0 mb-2 bottom-full';
      default:
        return 'origin-top-right right-0 mt-2';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-transparent text-sm font-medium text-foreground hover:bg-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {trigger}
        </button>
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 ${getPositionClasses()} w-56 rounded-md shadow-lg bg-card ring-1 ring-black ring-opacity-5 focus:outline-none`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex="-1"
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;


