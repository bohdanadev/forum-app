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

  async createPost(data: Partial<IPost>) {
    return this.post<IPost>(API_KEYS.POSTS, data, {}, true);
  }

  async updatePost(postId: number | string, data: Partial<IPost>) {
    return this.put<IPost>(`${API_KEYS.POSTS}/${postId}`, data, {}, true);
  }

  async likePost(postId: number | string) {
    return this.post<number>(`${API_KEYS.LIKE}/${postId}/like`, {}, {}, true);
  }

  async deletePost(postId: number | string) {
    return this.delete<void>(`${API_KEYS.POSTS}/${postId}`, {}, true);
  }
}

export const postService = new PostService();
