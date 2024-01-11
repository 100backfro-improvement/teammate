import { useState } from "react";
import { useSearchState } from "../../state/authState";
import styled from "styled-components";

interface HomeSearchBarProps {
  onSearch: (value: string) => void;
}

export default function HomeSearchBar({ onSearch }: HomeSearchBarProps) {
  const { search, setSearch } = useSearchState();
  const [, setPlaceholderHidden] = useState(false);

  const handleSearchSubmit = async (e: any) => {
    e.preventDefault();
    onSearch(search);
  };

  const handleClick = () => {
    if (search === "") {
      setPlaceholderHidden(true);
      setSearch("");
    }
  };
  const handleFocus = () => {
    setPlaceholderHidden(true);
  };

  const handleBlur = () => {
    if (!search) {
      setPlaceholderHidden(false);
    }
  };

  return (
    <>
      <SearchBarContainer>
        <form className="w-2/4" onSubmit={handleSearchSubmit}>
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClick={handleClick}
              className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="팀 명을 검색하세요"
              required
            />
            <Button
              type="submit"
              className="text-white absolute end-2.5 bottom-2.5 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            >
              Search
            </Button>
          </div>
        </form>
      </SearchBarContainer>
    </>
  );
}

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: center;
`;

const Button = styled.button`
  background: #5DD68E;
`;
