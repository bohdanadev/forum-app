import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import bgImage from '../../assets/bg.png';
import avatar from '../../assets/avatar.png';
import { authService } from '../../services/auth.service';
import Search from '../Search/Search';
import Modal from '../Modal/Modal';
import useMutateProfile from '../../hooks/useMutateProfile';
import useCreatePost from '../../hooks/useCreatePost';
import { IPost } from '../../interfaces/post.interface';
import { Button } from '../Button/Button';
import axios from 'axios';

export const StyledHeader = styled.header`
  position: relative;
  height: 300px;
  background-image: url(${bgImage});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px;
  color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const HeaderButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;

  h4 {
    margin: 0;
    font-size: 1.2em;
    color: #fff;
    text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  }
`;

export const AvatarImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;

  img {
    object-fit: cover;
  }
`;

export const Menu = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 150px;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
`;

export const MenuItem = styled.button`
  width: 100%;
  padding: 10px 20px;
  font-size: 1em;
  color: #333;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [post, setPost] = useState<
    Pick<IPost, 'title' | 'imageUrl' | 'content' | 'tags'>
  >({ title: '', imageUrl: '', content: '', tags: [] });

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const user = authService.isAuthenticated();

  const { mutate: deleteAccount, reset: resetForm } = useMutateProfile();
  const { mutate: createPost, error, reset } = useCreatePost();

  if (error && axios.isAxiosError(error)) {
    setErrorMessage(error.message);
  }

  const handleDeleteAccount = () => {
    deleteAccount({});
    setMenuOpen(false);
  };

  const handleCreatePost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createPost(post);
    resetForm();
    closeModal();
  };

  return (
    <StyledHeader>
      <ButtonContainer>
        <HeaderButton onClick={() => navigate('/')}>Home</HeaderButton>
        {user && <HeaderButton onClick={openModal}>Add post</HeaderButton>}
      </ButtonContainer>
      <Search />
      {user ? (
        <AvatarContainer>
          <AvatarImg
            src={user.avatarUrl ?? avatar}
            alt='avatar'
            onClick={toggleMenu}
          />
          <h4>{user.username ?? 'Username'}</h4>

          {menuOpen && (
            <Menu>
              <MenuItem onClick={handleDeleteAccount}>Delete Account</MenuItem>
            </Menu>
          )}
        </AvatarContainer>
      ) : (
        <HeaderButton onClick={() => navigate('signin')}>SignIn</HeaderButton>
      )}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={closeModal} title='Create Post'>
          <form onSubmit={handleCreatePost}>
            {errorMessage && <h5 onClick={() => reset()}>{errorMessage}</h5>}
            <div>
              <label>Title:</label>
              <input
                type='text'
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </div>
            <div>
              <img
                src={post.imageUrl}
                alt='Image Preview'
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '15%',
                  objectFit: 'cover',
                  border: '2px solid #ccc',
                }}
              />
              <label>Image:</label>
              <input
                type='url'
                value={post.imageUrl}
                onChange={(e) => setPost({ ...post, imageUrl: e.target.value })}
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
              ></textarea>
            </div>
            <div>
              <label>Tags:</label>
              <input
                type='text'
                value={post.tags}
                onChange={(e) => setPost({ ...post, tags: [e.target.value] })}
              />
            </div>
            <Button type='submit'>Save Changes</Button>
          </form>
        </Modal>
      )}
    </StyledHeader>
  );
};

export default Header;
