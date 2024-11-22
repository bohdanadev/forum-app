import { API_KEYS } from '../constants/app-keys';
import HttpService from './http.service';

class PostService extends HttpService {
  constructor() {
    super();
  }

  async fetchPosts() {
    return this.get(API_KEYS.POSTS, {}, true);
  }

  async createPost(data: { title: string; content: string }) {
    return this.post(API_KEYS.POSTS, data, {}, true);
  }

  async updatePost(postId: string, data: { title?: string; content?: string }) {
    return this.put(`${API_KEYS.POSTS}/${postId}`, data, {}, true);
  }

  async deletePost(postId: string) {
    return this.delete(`${API_KEYS.POSTS}/${postId}`, {}, true);
  }
}

export const postService = new PostService();
