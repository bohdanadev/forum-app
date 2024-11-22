import { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 1.8em;
    margin-bottom: 10px;
    text-align: center;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 15px;

    label {
      font-weight: bold;
      color: #555;
      margin-bottom: 5px;
    }

    input {
      padding: 10px;
      font-size: 1em;
      border: 1px solid #ccc;
      border-radius: 5px;
      width: 100%;
    }

    button {
      padding: 12px 20px;
      font-size: 1.1em;
      background-color: #3c6e71;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      align-self: flex-end;

      &:hover {
        background-color: #284b63;
      }
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;

  h2 {
    margin: 0;
    font-size: 1.5em;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5em;
    cursor: pointer;
  }
`;

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Edit Profile</h2>
          <button onClick={onClose}>&times;</button>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>,
    document.getElementById('modal-root')!
  );
};

export default Modal;
