import { FC, useState } from 'react';
import reply from '../../assets/reply.png';
import user from '../../assets/user.png';
import like_reply from '../../assets/like_reply.png';
import { useFetchComments } from '../../hooks/useFetchComments';
import { IComment } from '../../interfaces/comment.interface';
import { useCreateComment } from '../../hooks/useCreateComment';
import { useMutateLike } from '../../hooks/useLikeMutation';
import {
  CommentActions,
  CommentContent,
  CommentItem,
  CommentsContainer,
  NestedReplies,
  ReplyForm,
  UserAvatar,
} from './comment.styled';

interface IProps {
  postId: number | string;
}

const Comments: FC<IProps> = ({ postId }) => {
  const [replyingTo, setReplyingTo] = useState<number | string | null>(null);
  const [newReply, setNewReply] = useState<string>('');

  const {
    data: comments,
    isLoading,
    isError,
    error,
  } = useFetchComments(postId);

  const { mutate: createComment } = useCreateComment();

  const { mutate: likeComment } = useMutateLike();

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  if (isError) {
    return <p>Error loading comments: {error.message}</p>;
  }

  const handleReply = (commentId: number | string) => {
    setReplyingTo(commentId);
  };

  const handleReplySubmit = () => {
    if (!newReply.trim()) return;
    if (replyingTo) {
      createComment({
        postId,
        content: newReply,
        parentCommentId: replyingTo,
      });
    } else {
      createComment({ postId, content: newReply });
    }
    setNewReply('');
    setReplyingTo(null);
  };

  const renderComments = (comments: IComment[]) =>
    comments.map((comment) => (
      <div key={comment.id}>
        <CommentItem>
          <UserAvatar
            src={comment.author.avatarUrl || user}
            alt={`${comment.author.username}'s avatar`}
          />
          <CommentContent>
            <h4>{comment.author.username}</h4>
            <p>{comment.content}</p>
            <CommentActions>
              <button onClick={() => likeComment(postId, comment.id)}>
                <img
                  src={like_reply}
                  alt='like'
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
              <p>{comment.likes.length}</p>

              <button onClick={() => handleReply(comment.id)}>
                <img src={reply} alt='Reply' />
                Reply
              </button>
            </CommentActions>
            {replyingTo === comment.id && (
              <ReplyForm>
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder='Write your reply...'
                />
                <button onClick={handleReplySubmit}>Submit Reply</button>
              </ReplyForm>
            )}
          </CommentContent>
        </CommentItem>
        {comment.replies && (
          <NestedReplies>{renderComments(comment.replies)}</NestedReplies>
        )}
      </div>
    ));

  return (
    <CommentsContainer>
      <h3>Comments</h3>
      {comments && comments.length > 0 ? (
        renderComments(comments)
      ) : (
        <p>No comments yet.</p>
      )}
      <ReplyForm>
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder='Write your comment...'
        />
        <button onClick={handleReplySubmit}>Submit Reply</button>
      </ReplyForm>
    </CommentsContainer>
  );
};

export default Comments;
