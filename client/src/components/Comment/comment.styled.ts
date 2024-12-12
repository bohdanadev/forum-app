import styled from 'styled-components';

export const CommentsContainer = styled.div`
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
`;

export const CommentItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
`;

export const UserAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const CommentContent = styled.div`
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

export const CommentActions = styled.div`
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

export const ReplyForm = styled.div`
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

export const NestedReplies = styled.div`
  margin-left: 50px;
  border-left: 2px solid #e0e0e0;
  padding-left: 10px;
`;
