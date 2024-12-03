import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTER_KEYS } from '../../constants/app-keys';
import { AuthorCardContainer } from './author-card.styled';
import { IUser } from '../../interfaces/user.interface';

interface IProps {
  author: Partial<IUser>;
}

const AuthorCard: FC<IProps> = ({ author }) => {
  const navigate = useNavigate();

  const goToAuthorProfile = () => {
    navigate(`${ROUTER_KEYS.USERS}/${author.id}`, { replace: true });
  };

  return (
    <AuthorCardContainer onClick={goToAuthorProfile}>
      <img src={author.avatarUrl} alt='Author Avatar' />
      <h3>{author.username}</h3>
      <p>Acclaimed author of the post</p>
    </AuthorCardContainer>
  );
};

export default AuthorCard;
