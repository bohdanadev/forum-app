import { FC, useState } from 'react';
import styled from 'styled-components';
import avatarImage from '../assets/avatar.png';
import Modal from '../components/Modal/Modal';

const ProfileContainer = styled.div`
  margin: 0;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #0077ff;
  margin-bottom: 1rem;
`;

const Username = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin: 0;
`;

const Email = styled.p`
  font-size: 1rem;
  color: #777;
`;

const InfoSection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: bold;
  color: #555;
`;

const Value = styled.span`
  color: #333;
`;

const EditButton = styled.button`
  display: block;
  margin: 2rem auto 0;
  padding: 10px 20px;
  background-color: #3c6e71;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #284b63;
  }
`;

const Profile: FC = () => {
  const userData = {
    username: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    address: '123 Main St, Springfield, USA',
    joined: 'January 1, 2023',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Profile Updated');
    setIsModalOpen(false);
  };

  return (
    <ProfileContainer>
      <Header>
        <Avatar src={avatarImage} alt='User Avatar' />
        <Username>{userData.username}</Username>
        <Email>{userData.email}</Email>
      </Header>
      <InfoSection>
        <InfoItem>
          <Label>Phone:</Label>
          <Value>{userData.phone}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Address:</Label>
          <Value>{userData.address}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Member Since:</Label>
          <Value>{userData.joined}</Value>
        </InfoItem>
      </InfoSection>
      <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>Name:</label>
            <input id='name' type='text' defaultValue='John Doe' />
          </div>
          <div>
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              type='email'
              defaultValue='john.doe@example.com'
            />
          </div>
          <div>
            <label htmlFor='username'>Username:</label>
            <input id='username' type='text' defaultValue='johndoe' />
          </div>
          <button type='submit'>Save Changes</button>
        </form>
      </Modal>
    </ProfileContainer>
  );
};

export default Profile;
