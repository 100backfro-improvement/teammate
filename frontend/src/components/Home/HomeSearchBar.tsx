import { useState, useEffect } from "react";
import { useSearchState } from "../../state/authState";
import styled from "styled-components";
import AlarmModal from "../alarm/PersonalAlarmModal";
import axiosInstance from "../../axios";

interface HomeSearchBarProps {
  onSearch: (value: string) => void;
}

export default function HomeSearchBar({ onSearch }: HomeSearchBarProps) {
  const { search, setSearch } = useSearchState();
  const [, setPlaceholderHidden] = useState(false);
  const [teamListLength, setTeamListLength] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/team/list");
        setTeamListLength(response.data.length);
      } catch (error: any) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);

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

  //알람모달
  const [isModalOpen, setModalOpen] = useState(false);

  const handleNotificationClick = () => {
    setModalOpen(!isModalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <SearchBarContainer>
        <TeamInfo>TEAMMATE</TeamInfo>
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
        <ul className="menu menu-horizontal px-1">
          <li>
            <AlarmButton
              className="btn btn-ghost btn-circle"
              onClick={handleNotificationClick}
              aria-label="알림 보기"
            >
              <div className="indicator">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* <span className="badge badge-xs badge-primary indicator-item"></span> */}
              </div>
            </AlarmButton>
            {isModalOpen && <AlarmModal closeModal={closeModal} />}{" "}
          </li>
        </ul>
      </SearchBarContainer>
    </>
  );
}

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  justify-content: flex-end;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -15px;
    height: 1px;
    background-color: #cccccc; /* 밑줄 색상 */
  }
`;

const Button = styled.button`
  background: #5dd68e;
`;

const TeamInfo = styled.span`
  color: #333333;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-right: 230px;
`;

const AlarmButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }

  svg {
    width: 25px;
    height: auto;
    stroke: #555555;
  }
`;
