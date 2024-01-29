import styled from "styled-components";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import axiosInstance from "../../axios";

const ChatBubble = ({ messages, teamId, myTeamMemberId, nicknames }: any) => {
  const [items, setItems] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const today = new Date();

  const oneDayAgo = new Date(today.setDate(today.getDate() - page))
    .toISOString()
    .replace("T", " ")
    .split(" ")[0]; // 하루 전

  const fetchData = async () => {
    const response = await axiosInstance.get(
      `/team/${teamId}/chat/list?date=${oneDayAgo}`,
    );
    if (page >= 10) {
      setHasMore(false);
      console.log("불러올까말까 작동!");
      return;
    }
    setItems([...items, ...response.data]);
    setPage(page + 1);
    console.log(page);
    console.log("닉네임프롭>", nicknames);
  };

  return (
    <div className="p-3 mb-3 h-[32rem] overflow-y-auto font-normal bg-gray-50 text-gray-700">
      {hasMore == false && (
        <div className="bg-gray-200 text-center rounded-xl mb-3">
          <p>마지막 메시지 입니다.</p>
        </div>
      )}
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchData}
        hasMore={hasMore}
        loader={
          <div className="loader" key={0}>
            Loading ...
          </div>
        }
        isReverse={true}
        useWindow={false}
      >
        {items
          .slice(0)
          .reverse()
          .map((content: any, index: any) => {
            const { writerId, message, createdDt }: any = content;
            const isMe = writerId === myTeamMemberId;
            const matchedNickname = nicknames.data.find(
              (obj: { [key: string]: string }) =>
                obj.hasOwnProperty(`${writerId}`),
            );
            return (
              <BubbleContainerDiv key={index} isMe={isMe}>
                {/* <div key={index} className="flex items-start gap-2.5"> */}
                {!isMe && (
                  <img
                    className="w-8 h-8 rounded-full"
                    src=""
                    alt="chat image"
                  />
                )}
                <div className="flex flex-col gap-1 w-56">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900">
                      {matchedNickname?.[`${writerId}`] || "(알 수 없음)"}
                    </span>
                    <span className="text-sm font-normal text-gray-500">
                      {/* createdDt.split(":00")[0].replace("T", " ").slice(0, -6)} */}
                      {createdDt.split(":00")[0].replace("T", " ").slice(0, -6)}
                    </span>
                  </div>
                  {isMe ? (
                    <div className="flex flex-col justify-end leading-1.5 p-4 border-gray-200 bg-yellow-100 rounded-l-xl rounded-br-xl">
                      <p className="text-sm font-normal text-gray-900">
                        {" "}
                        {message}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl">
                      <p className="text-sm font-normal text-gray-900">
                        {" "}
                        {message}
                      </p>
                    </div>
                  )}
                </div>
                {/* </div> */}
              </BubbleContainerDiv>
            );
          })}
      </InfiniteScroll>
      {messages.map((content: any, index: any) => {
        const { writerId, message, createdDt }: any = content;
        const isMe = writerId === myTeamMemberId;
        const matchedNickname = nicknames.data.find(
          (obj: { [key: string]: string }) => obj.hasOwnProperty(`${writerId}`),
        );

        console.log("본인여부 >", isMe);
        return (
          <BubbleContainerDiv key={index} isMe={isMe}>
            {/* <div key={index} className="flex items-start gap-2.5"> */}
            {!isMe && (
              <img className="w-8 h-8 rounded-full" src="" alt="chat image" />
            )}
            <div className="flex flex-col gap-1 w-56">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900">
                  {matchedNickname?.[`${writerId}`] || "(알 수 없음)"}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  {createdDt.split(":00")[0].replace("T", " ").slice(0, -6)}
                </span>
              </div>
              {isMe ? (
                <div className="flex flex-col justify-end leading-1.5 p-4 border-gray-200 bg-yellow-100 rounded-l-xl rounded-br-xl">
                  <p className="text-sm font-normal text-gray-900">
                    {" "}
                    {message}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl">
                  <p className="text-sm font-normal text-gray-900">
                    {" "}
                    {message}
                  </p>
                </div>
              )}
            </div>
            {/* </div> */}
          </BubbleContainerDiv>
        );
      })}
    </div>
  );
};

export default ChatBubble;

const BubbleContainerDiv = styled.div<{ isMe: boolean }>`
  display: flex;
  align-items: ${({ isMe }) => !isMe && "flex-start"};
  justify-content: ${({ isMe }) => isMe && "flex-end"};
  gap: 0.625rem;
`;
