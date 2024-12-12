import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class NotificationsListQueryDto {
  @Type(() => Number)
  @IsInt()
  @Max(20)
  @Min(1)
  @IsOptional()
  limit?: number = 5;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset?: number = 0;
}
