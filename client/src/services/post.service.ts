import { API_KEYS } from './../constants/app-keys';
import { PostsListQuery, PostsListRes } from '../hooks/useFetchPosts';
import { IPost } from '../interfaces/post.interface';
import HttpService from './http.service';
import { IComment } from '../interfaces/comment.interface';

export interface PaginatedResponse<T> {
  total: number;
  next: string | null;
  data: T[];
}

class PostService extends HttpService {
  constructor() {
    super();
  }

  async fetchPosts({ params }: { params: PostsListQuery }) {
    return this.get<PostsListRes>(
      `${API_KEYS.POSTS}/${API_KEYS.VERSION}?${new URLSearchParams(
        params as any
      )}`,
      {},
      true
    );
  }

  async fetchPostById(id: string) {
    return this.get<IPost>(
      `${API_KEYS.POSTS}/${id}/${API_KEYS.VERSION}`,
      {},
      true
    );
  }

  async createPost(data: Partial<IPost>) {
    return this.post<IPost>(API_KEYS.POSTS, data, {}, true);
  }

  async updatePost(postId: number | string, data: Partial<IPost>) {
    return this.put<IPost>(`${API_KEYS.POSTS}/${postId}`, data, {}, true);
  }

  async likePost(postId: string | number) {
    return this.post<number>(
      `${API_KEYS.POSTS}/${postId}/${API_KEYS.LIKE}`,
      {},
      {},
      true
    );
  }

  async deletePost(postId: string | number) {
    return this.delete<void>(`${API_KEYS.POSTS}/${postId}`, {}, true);
  }

  async getCommentsForPost(postId: string | number) {
    return this.get<IComment[]>(
      `${API_KEYS.POSTS}/${postId}/${API_KEYS.COMMENTS}/${API_KEYS.VERSION}`,
      {},
      true
    );
  }

  async createComment(
    postId: string | number,
    content: string,
    parentCommentId?: string | number
  ) {
    console.log(postId, content, parentCommentId);
    return parentCommentId
      ? this.post<IComment>(
          `${API_KEYS.POSTS}/${postId}/${API_KEYS.COMMENTS}`,
          { content, parentCommentId },
          {},
          true
        )
      : this.post<IComment>(
          `${API_KEYS.POSTS}/${postId}/${API_KEYS.COMMENTS}`,
          { content },
          {},
          true
        );
  }

  async likeComment(postId: string | number, commentId: string | number) {
    return this.post<number>(
      `${API_KEYS.POSTS}/${postId}/${API_KEYS.COMMENTS}/${API_KEYS.LIKE}`,
      { commentId },
      {},
      true
    );
  }
}

export const postService = new PostService();
