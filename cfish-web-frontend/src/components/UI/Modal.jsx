import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-primary transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;


