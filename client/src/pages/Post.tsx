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
import { postService } from '../services/post.service';
import { useParams } from 'react-router-dom';
import { useFetchPost } from '../hooks/useFetchPost';
import moment from 'moment';
import { authService } from '../services/auth.service';

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
  const { id } = useParams();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isCommentsOpen, setCommentsOpen] = useState(false);
  const { data: post, isLoading, error } = useFetchPost(id!);
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const openComments = () => setCommentsOpen(!isCommentsOpen);

  const user = authService.isAuthenticated();
  console.log(user);

  const likePost = async () => {
    if (post) {
      await postService.likePost(post.id!);
    }
  };

  const deletePost = async (id: number) => {
    await postService.deletePost(id);
  };

  if (isLoading) return <h4>Loading...</h4>;
  if (error) return <p>Failed to load post.</p>;

  return (
    <PageContainer>
      <MainContent>
        <PostCard>
          <PostHeader>
            <h1>{post?.title}</h1>
            <PostMeta>
              <span>{post?.author.username}</span>
              <span>{moment(post?.createdAt).fromNow()}</span>
            </PostMeta>
          </PostHeader>
          <TagsContainer>
            {post?.tags?.map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </TagsContainer>
          <PostContent>{post?.content}</PostContent>
          <ActionsContainer>
            <ActionButton>
              <LikeButton action={likePost} />
              <span>15</span>
            </ActionButton>
            <ActionButton onClick={openComments}>
              <img src={comment} alt='comment' />
              <span>{post?.comments}</span>
            </ActionButton>
            <ActionButton onClick={openEditModal}>
              <img src={edit} alt='edit' />
            </ActionButton>
            <ActionButton onClick={() => deletePost(post!.id!)}>
              <img src={remove} alt='remove' />
            </ActionButton>
          </ActionsContainer>
        </PostCard>
        {isCommentsOpen && <Comments comments={dummyComments} />}
      </MainContent>

      {/* Author Info Card */}
      <AuthorCard>
        <img src={post?.author.avatarUrl} alt='Author' />
        <h3>{post?.author.username}</h3>
        <p>Acclaimed author of the post</p>
        <a href='tel:+38000000000' className='contact'>
          +38 000 000 000
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
              postService.updatePost(post!.id!, { title, content });
              closeEditModal();
            }}
          >
            <div>
              <label>Title:</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <Button type='submit'>Save Changes</Button>
          </form>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Post;
