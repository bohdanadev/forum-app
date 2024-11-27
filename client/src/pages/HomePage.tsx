import Content, {
  MainContent,
  PostCard,
  PostInfo,
  PostTitle,
  Tag,
} from '../components/Content/Content';
import { StyledLink } from '../components/Sidebar/Sidebar';

const HomePage = () => {
  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <MainContent>
        <Content />
        {/* <StyledLink to={'/posts/1'}>
          <PostCard>
            <PostTitle>Lorem ipsum dolor sit amet...</PostTitle>
            <PostInfo>
              <div>Bart replied 15 min ago • 5 replies</div>
              <div>10.5k views • 5.5k likes • 2.5k saves</div>
            </PostInfo>
            <div>
              <Tag>TS</Tag>
              <Tag>CSS</Tag>
            </div>
          </PostCard>
        </StyledLink>
        <PostCard>
          <PostTitle>Lorem ipsum dolor sit amet...</PostTitle>
          <PostInfo>
            <div>Bart replied 15 min ago • 5 replies</div>
            <div>10.5k views • 5.5k likes • 2.5k saves</div>
          </PostInfo>
          <div>
            <Tag>TS</Tag>
            <Tag>CSS</Tag>
          </div>
        </PostCard>

        <PostCard>
          <PostTitle>Lorem ipsum dolor sit amet...</PostTitle>
          <PostInfo>
            <div>Bart replied 15 min ago • 5 replies</div>
            <div>10.5k views • 5.5k likes • 2.5k saves</div>
          </PostInfo>
          <div>
            <Tag>TS</Tag>
            <Tag>CSS</Tag>
          </div>
        </PostCard>

        <PostCard>
          <PostTitle>Lorem ipsum dolor sit amet...</PostTitle>
          <PostInfo>
            <div>Bart replied 15 min ago • 5 replies</div>
            <div>10.5k views • 5.5k likes • 2.5k saves</div>
          </PostInfo>
          <div>
            <Tag>TS</Tag>
            <Tag>CSS</Tag>
          </div>
        </PostCard>

        <PostCard>
          <PostTitle>
            It removes the mapping between components and styles. This means
            that when you're defining your styles, you're actually creating a
            normal React component, that has your styles attached to it. This
            example creates two simple components, a wrapper and a title, with
            some styles attached to it
          </PostTitle>
          <PostInfo>
            <div>Bart replied 15 min ago • 5 replies</div>
            <div>10.5k views • 5.5k likes • 2.5k saves</div>
          </PostInfo>
          <div>
            <Tag>TS</Tag>
            <Tag>CSS</Tag>
          </div>
        </PostCard> */}
      </MainContent>
    </div>
  );
};

export default HomePage;
