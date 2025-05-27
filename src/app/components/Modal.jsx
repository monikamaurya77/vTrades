// src/components/Modal.js
import React from 'react';
import Image from 'next/image';

const Modal = ({ show, onClose, icon, title, message }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {icon && <Image src={icon} alt="Icon" className="modal-icon mx-auto" width={60} height={60} />}
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="mb-6 text-text">{message}</p>
        <button onClick={onClose} className="primary-button">
          Okay
        </button>
      </div>
    </div>
  );
};

export default Modal;