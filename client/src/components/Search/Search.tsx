import { FC, useState } from 'react';

import search from '../../assets/search.png';
import { SearchButton, SearchContainer, SearchInput } from './search.styled';

interface IProps {
  handleSearch: (searchText: string) => void;
}

const Search: FC<IProps> = ({ handleSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchAction = () => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchAction();
    }
  };

  return (
    <SearchContainer>
      <SearchInput
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <SearchButton onClick={handleSearchAction}>
        <img src={search} alt='Search' />
      </SearchButton>
    </SearchContainer>
  );
};

export default Search;
