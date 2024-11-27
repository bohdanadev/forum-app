import { FC } from 'react';
import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFetchPosts } from '../../hooks/useFetchPosts';
import PostCard from './PostCard';

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 40vh;
  overflow: scroll;
`;

const Content: FC = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useFetchPosts({
      search: '',
      tag: '',
      authorId: '',
      limit: 4,
      offset: 0,
    });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <p>Failed to load posts.</p>;

  const fetchedPostsCount =
    data?.pages.reduce((total, page) => total + page.data.length, 0) || 0;

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
