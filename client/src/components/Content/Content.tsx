import { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useFetchPosts } from '../../hooks/useFetchPosts';
import PostCard from './PostCard';

const Content: FC = () => {
  const [searchParams, _] = useSearchParams();

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useFetchPosts({
      search: searchParams?.get('search') || '',
      tag: searchParams.get('tag') || '',
      authorId: searchParams?.get('authorId') || '',
      limit: 4,
      offset: 0,
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <p>Failed to load posts.</p>;

  const fetchedPostsCount =
    data?.pages.reduce((total, page) => total + page.data.length, 0) || 0;

  if (fetchedPostsCount === 0) return <p>No posts found.</p>;

  return (
    <InfiniteScroll
      dataLength={fetchedPostsCount}
      hasMore={!!hasNextPage}
      next={() => fetchNextPage()}
      loader={<h4>Loading...</h4>}
    >
      {data?.pages
        .flatMap((page) => page.data)
        .map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
    </InfiniteScroll>
  );
};

export default Content;
