import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';

import comment from '../assets/comment.png';
import edit from '../assets/edit.png';
import remove from '../assets/remove.png';
import Modal from '../components/Modal/Modal';
import { Button } from '../components/Button/Button';
import LikeButton from '../components/Button/LikeButton';
import Comments from '../components/Comment/Comments';
import { useFetchPost } from '../hooks/useFetchPost';
import useMutatePost from '../hooks/useMutatePost';
import { useMutateLike } from '../hooks/useLikeMutation';
import { IPost } from '../interfaces/post.interface';
import { authService } from '../services/auth.service';

// const dummyComments = [
//   {
//     id: 1,
//     author: 'Alice',
//     content: 'This is a great post!',
//     replies: [
//       {
//         id: 2,
//         author: 'Bob',
//         content: 'I agree!',
//         replies: [
//           {
//             id: 3,
//             author: 'Charlie',
//             content: 'Same here!',
//           },
//           {
//             id: 3,
//             author: 'Charlie',
//             content: 'Same here!',
//           },
//           {
//             id: 3,
//             author: 'Charlie',
//             content: 'Same here!',
//           },
//         ],
//       },
//       {
//         id: 2,
//         author: 'Bob',
//         content: 'I agree!',
//         replies: [
//           {
//             id: 3,
//             author: 'Charlie',
//             content: 'Same here!',
//           },
//         ],
//       },
//     ],
//   },
// ];

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  box-sizing: border-box;
  transition: 0.2s;

  img {
    width: 28px;
    height: 28px;
  }

  div {
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

const PostContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;

  p {
    font-size: 1.2em;
    line-height: 1.6;
    color: #555;
  }

  img {
    width: 400px;
    height: 400px;
  }
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
  const [previewUrl, setPreviewUrl] = useState(post?.imageUrl || '');
  const [tags, setTags] = useState(post?.tags ?? []);
  const { register, handleSubmit, setValue, watch } = useForm<Partial<IPost>>();

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const openComments = () => setCommentsOpen(!isCommentsOpen);

  const { mutate: mutatePost } = useMutatePost();

  const user = authService.isAuthenticated();

  const imageUrl = watch('imageUrl', '');

  useEffect(() => {
    setPreviewUrl(imageUrl || '../../assets/avatar.png');
  }, [imageUrl]);

  const updatePost: SubmitHandler<Partial<IPost>> = ({
    title,
    imageUrl,
    content,
    tags,
  }) => {
    if (id) {
      mutatePost({ id, data: { title, imageUrl, content, tags } });
      closeEditModal();
    }
  };

  const { mutate: like } = useMutateLike();

  const likePost = async () => {
    if (post) {
      like({ postId: post!.id! });
    }
  };

  const deletePost = (id: number | string) => {
    mutatePost({ id });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      setTags([...tags, e.currentTarget.value.trim()]);
      setValue('tags', [...tags, e.currentTarget.value.trim()]);
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags);
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
          <PostContent>
            <img src={post?.imageUrl} alt='Post Image' />
            <br />
            {post?.content}
          </PostContent>
          <ActionsContainer>
            <ActionButton>
              <LikeButton action={likePost} />
              <div>{post?.likes?.length}</div>
            </ActionButton>
            <ActionButton onClick={openComments}>
              <img src={comment} alt='comment' />
              <div>{post?.comments?.length}</div>
            </ActionButton>
            {user && user.id === post?.author?.id && (
              <ActionButton onClick={openEditModal}>
                <img src={edit} alt='edit' />
              </ActionButton>
            )}
            {user && user.id === post?.author?.id && (
              <ActionButton onClick={() => deletePost(post!.id!)}>
                <img src={remove} alt='remove' />
              </ActionButton>
            )}
          </ActionsContainer>
        </PostCard>
        {isCommentsOpen && <Comments postId={post!.id!} />}
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
          <form onSubmit={handleSubmit(updatePost)}>
            <div>
              <label>Title:</label>
              <input
                type='text'
                {...register('title')}
                defaultValue={post?.title}
              />
            </div>
            <div>
              <img
                src={previewUrl}
                alt='Image Preview'
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ccc',
                }}
              />
              <label>Image:</label>
              <input
                type='url'
                {...register('imageUrl')}
                defaultValue={post?.imageUrl}
              />
            </div>
            <div>
              <label>Content:</label>
              <textarea
                {...register('content')}
                defaultValue={post?.content}
              ></textarea>
            </div>
            <div>
              <label htmlFor='tags'>Tags:</label>
              <div>
                {post?.tags?.map((tag) => (
                  <span key={tag}>
                    {tag}{' '}
                    <button type='button' onClick={() => handleRemoveTag(tag)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                id='tags'
                type='text'
                placeholder='Add a tag and press Enter'
                onKeyDown={handleAddTag}
              />
            </div>
            <Button type='submit'>Save Changes</Button>
          </form>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Post;
