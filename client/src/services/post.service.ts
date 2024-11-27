import { API_KEYS } from '../constants/app-keys';
import { PostsListQuery, PostsListRes } from '../hooks/useFetchPosts';
import { IPost } from '../interfaces/post.interface';
import HttpService from './http.service';

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

  async createPost(data: { title: string; content: string }) {
    return this.post(API_KEYS.POSTS, data, {}, true);
  }

  async updatePost(postId: number, data: { title?: string; content?: string }) {
    return this.put(`${API_KEYS.POSTS}/${postId}`, data, {}, true);
  }

  async likePost(postId: number) {
    return this.post(`${API_KEYS.LIKE}/${postId}/like`, {}, {}, true);
  }

  async deletePost(postId: number) {
    return this.delete(`${API_KEYS.POSTS}/${postId}`, {}, true);
  }
}

export const postService = new PostService();
