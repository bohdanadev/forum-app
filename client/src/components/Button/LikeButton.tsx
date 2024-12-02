import { FC, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

import like from '../../assets/like.png';

const flyToCenter = keyframes`
  0% {
    transform: scale(1) translate(0, 0);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) translate(100px, -100px);
    opacity: 0.8;
  }
  100% {
    transform: scale(0) translate(200px, -200px);
    opacity: 0;
  }
`;

const LikeWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const FlyingHeart = styled.img<{ isFlying: boolean }>`
  position: absolute;
  width: 28px;
  height: 28px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  ${({ isFlying }) =>
    isFlying &&
    css`
      animation: ${flyToCenter} 1.5s ease-in-out forwards;
    `}
  pointer-events: none;
`;

interface IProps {
  action: () => Promise<void>;
}

const LikeButton: FC<IProps> = ({ action }) => {
  const [isFlying, setIsFlying] = useState(false);

  const handleLikeClick = async () => {
    setIsFlying(true);
    await action();
    setTimeout(() => {
      setIsFlying(false);
    }, 1000);
  };

  return (
    <LikeWrapper onClick={handleLikeClick}>
      <img src={like} alt='Like' />

      <FlyingHeart src={like} alt='Flying Heart' isFlying={isFlying} />
    </LikeWrapper>
  );
};

export default LikeButton;
