import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import styled from 'styled-components';
import moment from 'moment';

import avatar from '../assets/avatar.png';
import Modal from '../components/Modal/Modal';
import { authService } from '../services/auth.service';
import useFetchUser from '../hooks/useFetchUser';
import { IUser } from '../interfaces/user.interface';
import useMutateProfile from '../hooks/useMutateProfile';

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
  const { id } = useParams();
  const { isPending, isError, data, error, refetch } = useFetchUser(id!);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const { register, handleSubmit, setValue, watch } = useForm<IUser>();

  const currentUser: IUser = authService.isAuthenticated();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate } = useMutateProfile();

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const editProfile: SubmitHandler<Partial<IUser>> = (user) => {
    mutate({ data: user });
    setIsModalOpen(false);
  };

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <ProfileContainer>
      <Header>
        <Avatar src={data?.avatarUrl ?? avatar} alt='User Avatar' />
        <Username>{data?.username}</Username>
      </Header>
      <InfoSection>
        {currentUser.id === data?.id && (
          <InfoItem>
            <Label>Email: </Label>
            <Value>{data?.email}</Value>
          </InfoItem>
        )}
        <InfoItem>
          <Label>Member Since:</Label>
          <Value>{moment(data?.createdAt).format('MMMM Do YYYY')}</Value>
        </InfoItem>
      </InfoSection>
      {currentUser?.id === data?.id && (
        <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={'Edit Profile'}
      >
        <form onSubmit={handleSubmit(editProfile)}>
          <div>
            <label htmlFor='avatarUrl'>Avatar:</label>
            <input
              id='avatarUrl'
              type='url'
              {...register('avatarUrl')}
              defaultValue={data?.avatarUrl}
            />
          </div>
          <div>
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              type='email'
              {...register('email')}
              defaultValue={data?.email}
            />
          </div>
          <div>
            <label htmlFor='username'>Username:</label>
            <input
              id='username'
              type='text'
              {...register('username')}
              defaultValue={data?.username}
            />
          </div>
          <button type='submit'>Save Changes</button>
        </form>
      </Modal>
    </ProfileContainer>
  );
};

export default Profile;
