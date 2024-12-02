import { UserResDto } from '../dto/user.res.dto';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';

export interface INotification {
  id: number | string;
  message: string;
  isRead: boolean;
  recipient: User;
  // actor: Partial<UserResDto>;
  // post?: Post | null;
  // comment?: Comment | null;
  createdAt: Date;
}
