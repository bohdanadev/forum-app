import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../Button/Button';
import Modal from '../Modal/Modal';
import Search from '../Search/Search';
import useMutateProfile from '../../hooks/useMutateProfile';
import useCreatePost from '../../hooks/useCreatePost';
import { IPost } from '../../interfaces/post.interface';
import { authService } from '../../services/auth.service';
import {
  AvatarContainer,
  AvatarImg,
  ButtonContainer,
  HeaderButton,
  Menu,
  MenuItem,
  StyledHeader,
} from './header.styled';
import avatar from '../../assets/avatar.png';

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

  const { mutate: deleteAccount } = useMutateProfile();
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
    reset();
    closeModal();
    setPost({ title: '', imageUrl: '', content: '', tags: [] });
  };

  return (
    <StyledHeader>
      <ButtonContainer>
        <HeaderButton onClick={() => navigate('/')}>Home</HeaderButton>
        {user && <HeaderButton onClick={openModal}>Add post</HeaderButton>}
      </ButtonContainer>
      {user && <Search />}
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
                onChange={(e) => setPost({ ...post, title: e.target.value })}
              />
            </div>
            <div>
              <img
                src={''}
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
                onChange={(e) => setPost({ ...post, imageUrl: e.target.value })}
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                onChange={(e) => setPost({ ...post, content: e.target.value })}
              ></textarea>
            </div>
            <div>
              <label>Tags:</label>
              <input
                type='text'
                onChange={(e) =>
                  setPost({
                    ...post,
                    tags: e.target.value.split(/[\s,]+/).filter(Boolean),
                  })
                }
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
