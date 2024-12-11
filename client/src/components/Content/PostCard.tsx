import { FC } from 'react';
import moment from 'moment';

import {
  PostWrap,
  PostInfo,
  PostTitle,
  Tag,
  PostContent,
} from './post-card.styled';
import { IPost } from '../../interfaces/post.interface';
import { StyledLink } from '../Sidebar/sidebar.styled';

interface IProps {
  post: IPost;
}

const PostCard: FC<IProps> = ({ post }) => {
  const commentCount = Array.isArray(post.comments)
    ? post.comments.length
    : post.comments;
  const likeCount = Array.isArray(post.likes) ? post.likes.length : post.likes;
  return (
    <StyledLink to={`/posts/${post.id}`}>
      <PostWrap>
        <PostTitle>{post.title}</PostTitle>
        <PostInfo>
          <div> {moment(post.createdAt.toLocaleString()).fromNow()} • </div>
        </PostInfo>
        <PostContent>
          <img src={post.imageUrl} alt='postImage' />
          <p>{post.content}</p>
        </PostContent>
        <div>
          {post.tags.length &&
            post.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
        </div>
        <PostInfo>
          <div>
            {commentCount} replies • {likeCount} likes
          </div>
        </PostInfo>
      </PostWrap>
    </StyledLink>
  );
};

export default PostCard;
