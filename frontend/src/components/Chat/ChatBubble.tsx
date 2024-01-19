import styled from "styled-components";

const ChatBubble = ({ messages, myTeamMemberId }: any) => {
  return (
    <div className="p-3 mb-3 h-[32rem] overflow-y-auto font-normal bg-gray-50 text-gray-700">
      {messages.map((content: any, index: any) => {
        const { writerId, message, createdDt }: any = content;
        const isMe = writerId === myTeamMemberId;

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
                  {writerId}
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
