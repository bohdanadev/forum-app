import { FC, useState } from 'react';

import search from '../../assets/search.png';
import { SearchButton, SearchContainer, SearchInput } from './search.styled';

const Search: FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log(`Searching for: ${searchQuery}`);

    setSearchQuery('');
  };

  return (
    <SearchContainer>
      <SearchInput
        type='text'
        placeholder='Search...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SearchButton onClick={handleSearch}>
        <img src={search} alt='Search' />
      </SearchButton>
    </SearchContainer>
  );
};

export default Search;
