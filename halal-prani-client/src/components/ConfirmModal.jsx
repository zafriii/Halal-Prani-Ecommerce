import React from "react";
import "./styles/ConfirmModal.css";

const ConfirmModal = ({ message, type, onClose, onConfirm }) => {
  if (!message) return null;

  return (
    <div className={`confirm-modal-overlay`}>
      <div className={`confirm-modal ${type}`}>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
          <button className="cancel-btn" onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
