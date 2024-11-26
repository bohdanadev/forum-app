import { useState } from 'react';
import styled from 'styled-components';
import Modal from '../components/Modal/Modal';
import { Button } from '../components/Button/Button';
import user from '../assets/user.png';
import comment from '../assets/comment.png';
import edit from '../assets/edit.png';
import remove from '../assets/remove.png';
import LikeButton from '../components/Button/LikeButton';
import Comments from '../components/Comment/Comments';

const dummyComments = [
  {
    id: 1,
    author: 'Alice',
    content: 'This is a great post!',
    replies: [
      {
        id: 2,
        author: 'Bob',
        content: 'I agree!',
        replies: [
          {
            id: 3,
            author: 'Charlie',
            content: 'Same here!',
          },
          {
            id: 3,
            author: 'Charlie',
            content: 'Same here!',
          },
          {
            id: 3,
            author: 'Charlie',
            content: 'Same here!',
          },
        ],
      },
      {
        id: 2,
        author: 'Bob',
        content: 'I agree!',
        replies: [
          {
            id: 3,
            author: 'Charlie',
            content: 'Same here!',
          },
        ],
      },
    ],
  },
];

interface IComment {
  id: number;
  author: string;
  content: string;
  replies?: Comment[];
}

interface IPostDetails {
  id: number;
  author: string;
  title: string;
  tags: string[];
  content: string;
  likes: number;
  comments: Comment[];
}

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const ActionButton = styled.div`
  width: 60px;
  height: 60px;
  border: none;
  background: none;
  padding: 10px;
  box-sizing: border-box;
  transition: 0.2s;

  img {
    width: 28px;
    height: 28px;
  }
  &:hover {
    transform: scale(0.8) rotateY(360deg);
  }
`;

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PostCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    font-size: 1.8em;
    margin: 0;
    color: #333;
  }
`;

const PostMeta = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 0.9em;
  color: #777;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;

  span {
    background-color: #eef4ff;
    color: #4285f4;
    padding: 5px 10px;
    font-size: 0.9em;
    border-radius: 15px;
  }
`;

const PostContent = styled.p`
  font-size: 1.2em;
  line-height: 1.6;
  color: #555;
`;

const AuthorCard = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-height: 300px;

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 1.4em;
    margin: 10px 0 5px;
    color: #333;
  }

  p {
    font-size: 0.9em;
    color: #555;
  }

  .contact {
    margin-top: 10px;
    font-size: 0.9em;
    color: #007bff;
    text-decoration: none;
  }
`;

const Post = () => {
  // const { id } = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const deletePost = () => {
    console.log('Delete post');
  };

  return (
    <PageContainer>
      <MainContent>
        <PostCard>
          <PostHeader>
            <h1>Lecture Rescheduling</h1>
            <PostMeta>
              <span>Elisabeth May</span>
              <span>6h ago</span>
            </PostMeta>
          </PostHeader>
          <TagsContainer>
            <span>Accounting</span>
          </TagsContainer>
          <PostContent>
            Hi mates, <br />
            So I talked with Dr. Hellen, and because of her illness, we need to{' '}
            <strong>reschedule the upcoming lecture</strong>. You probably
            notice that this lecture is the last before the exam, so Dr. Hellen
            also asked if we want to attend an additional lecture where we can
            study more difficult exercises.
          </PostContent>
          <ActionsContainer>
            <ActionButton>
              <LikeButton />
              <span>15</span>
            </ActionButton>
            <ActionButton>
              <img src={comment} alt='comment' />
              <span>111</span>
            </ActionButton>
            <ActionButton onClick={openEditModal}>
              <img src={edit} alt='edit' />
            </ActionButton>
            <ActionButton onClick={deletePost}>
              <img src={remove} alt='remove' />
            </ActionButton>
          </ActionsContainer>
        </PostCard>
        <Comments comments={dummyComments} />
      </MainContent>

      {/* Author Info Card */}
      <AuthorCard>
        <img src={user} alt='Author' />
        <h3>Dr. Ronald Jackson</h3>
        <p>Main Lecturer</p>
        <a href='tel:+48550233553' className='contact'>
          +48 550 233 553
        </a>
      </AuthorCard>
      {isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          title='Edit Post'
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Update post logic');
              closeEditModal();
            }}
          >
            <div>
              <label>Title:</label>
              <input type='text' value={'Title'} />
            </div>
            <div>
              <label>Content:</label>
              <textarea value={'post.content'}></textarea>
            </div>
            <Button type='submit'>Save Changes</Button>
          </form>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Post;
