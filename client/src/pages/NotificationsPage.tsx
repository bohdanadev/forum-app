import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

import { useFetchNotifications } from '../hooks/useFetchNotifications';
import { useMutateNotification } from '../hooks/useMutateNotification';

interface NotificationItemProps {
  isRead: boolean;
}

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NotificationItem = styled.li.withConfig({
  shouldForwardProp: (prop) => prop !== 'isRead',
})<NotificationItemProps>`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  background-color: ${({ isRead }) => (isRead ? '#f9f9f9' : '#e6f7ff')};
  display: flex;
  flex-direction: column;

  &:hover {
    background-color: #f0f8ff;
  }
`;

const Message = styled.p`
  font-size: 1rem;
  color: #444;
`;

const Meta = styled.div`
  margin-top: 8px;
  font-size: 0.85rem;
  color: #666;
`;

const Actor = styled.span`
  font-weight: bold;
`;

const CreatedAt = styled.span`
  font-style: italic;
`;

const NotificationsPage = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useFetchNotifications({
      limit: 10,
      offset: 0,
    });

  const { mutate: markAsRead } = useMutateNotification();

  const handleReadNotification = (id: string | number) => {
    markAsRead(id);
  };

  const fetchedNotificationsCount =
    data?.pages.reduce((total, page) => total + page.data.length, 0) || 0;

  if (isLoading) {
    return <Container>Loading notifications...</Container>;
  }
  if (isError) return <p>Failed to load notifications.</p>;

  if (data?.pages.length === 0) {
    return <Container>No notifications to display.</Container>;
  }

  return (
    <Container>
      <Title>Notifications</Title>
      <NotificationList>
        <InfiniteScroll
          dataLength={fetchedNotificationsCount}
          hasMore={!!hasNextPage}
          next={() => fetchNextPage()}
          loader={<h4>Loading...</h4>}
        >
          {data?.pages
            .flatMap((page) => page.data)
            .map((notification) => (
              <NotificationItem
                key={notification.id}
                isRead={notification.isRead}
                onClick={() => handleReadNotification(notification.id)}
              >
                <Message>{notification.message}</Message>
                <Meta>
                  <Actor>By: {notification.actor?.username || 'Unknown'}</Actor>{' '}
                  {notification?.post?.title
                    ? `| Post: ${notification.post?.title}`
                    : ''}{' '}
                  |{' '}
                  <CreatedAt>
                    {new Date(notification.createdAt).toLocaleString()}
                  </CreatedAt>
                </Meta>
              </NotificationItem>
            ))}
        </InfiniteScroll>
      </NotificationList>
    </Container>
  );
};

export default NotificationsPage;
