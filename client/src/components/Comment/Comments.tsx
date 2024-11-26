import { FC, useState } from 'react';
import styled from 'styled-components';
import reply from '../../assets/reply.png';
import user from '../../assets/user.png';
import like_reply from '../../assets/like_reply.png';

interface IComment {
  id: number;
  author: string;
  content: string;
  replies?: IComment[];
}

interface IProps {
  comments: IComment[];
}

const CommentsContainer = styled.div`
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;

const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
`;

const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const CommentContent = styled.div`
  flex: 1;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  h4 {
    margin: 0;
    font-size: 1em;
    color: #333;
  }

  p {
    margin: 10px 0 0;
    font-size: 0.95em;
    color: #555;
  }
`;

const CommentActions = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-top: 10px;

  button {
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.85em;
    color: #007bff;

    img {
      width: 16px;
      height: 16px;
    }

    &:hover {
      text-decoration: underline;
    }
  }
  p {
    font-size: 0.85em;
  }
`;

const ReplyForm = styled.div`
  margin-top: 10px;

  textarea {
    width: 100%;
    min-height: 60px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-size: 0.95em;
    resize: none;
  }

  button {
    margin-top: 10px;
    padding: 8px 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 0.9em;
    cursor: pointer;

    &:hover {
      background-color: #0056b3;
    }
  }
`;

const NestedReplies = styled.div`
  margin-left: 50px;
  border-left: 2px solid #e0e0e0;
  padding-left: 10px;
`;

const Comments: FC<IProps> = ({ comments }) => {
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newReply, setNewReply] = useState<string>('');

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleReplySubmit = (commentId: number) => {
    console.log(`Reply to comment ID: ${commentId}`, newReply);
    setNewReply('');
    setReplyingTo(null);
  };

  const renderComments = (comments: IComment[]) =>
    comments.map((comment) => (
      <div key={comment.id}>
        <CommentItem>
          <UserAvatar src={user} alt='User' />
          <CommentContent>
            <h4>{comment.author}</h4>
            <p>{comment.content}</p>
            <CommentActions>
              <button>
                <img
                  src={like_reply}
                  alt='like'
                  style={{ width: '20px', height: '20px' }}
                />
              </button>
              <p>15</p>

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
                <button onClick={() => handleReplySubmit(comment.id)}>
                  Submit Reply
                </button>
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
      {comments.length > 0 ? renderComments(comments) : <p>No comments yet.</p>}
    </CommentsContainer>
  );
};

export default Comments;
