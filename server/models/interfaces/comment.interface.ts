export interface IComment {
  id: number;
  content: string;
  userId: string;
  postId?: number;
  commentId?: string;
}
