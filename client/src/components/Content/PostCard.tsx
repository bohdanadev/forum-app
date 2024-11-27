import { FC } from 'react';
import { StyledLink } from '../Sidebar/Sidebar';
import {
  PostWrap,
  PostInfo,
  PostTitle,
  Tag,
  PostContent,
} from './post-card.styled';
import { IPost } from '../../interfaces/post.interface';

interface IProps {
  post: IPost;
}

const PostCard: FC<IProps> = ({ post }) => {
  return (
    <StyledLink to={`/posts/${post.id}`}>
      <PostWrap>
        <PostTitle>{post.title}</PostTitle>
        <PostInfo>
          <div> 15 min ago • </div>
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
            {post.comments} replies • {post.likes} likes
          </div>
        </PostInfo>
      </PostWrap>
    </StyledLink>
  );
};

export default PostCard;
