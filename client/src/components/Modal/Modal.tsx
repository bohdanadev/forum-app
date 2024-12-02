import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';

import { ModalContent, ModalHeader, ModalOverlay } from './modal.styled';

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>{title}</h2>
          <button onClick={onClose}>&times;</button>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root')!
  );
};

export default Modal;
