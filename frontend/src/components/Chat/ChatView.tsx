// import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import axiosInstance from "../../axios";
import { useEffect, useRef, useState } from "react";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import { SSEPath } from "../../common/PathURL";
import ChatBubble from "./ChatBubble";

const ChatView = ({ teamId, myTeamMemberId }: any) => {
  const accessToken = window.sessionStorage.getItem("accessToken");
  const EventSource = EventSourcePolyfill || NativeEventSource;

  const [messages, setMessages] = useState([]);

  const messagesRef = useRef();

  useEffect(() => {
    // @ts-ignore
    messagesRef.current = messages;
    console.log("메시지state 변할때마다 effect >", messages);
  }, [messages]);

  useEffect(() => {
    // 채팅 sse 통신
    const teamChat = new EventSource(`${SSEPath}/team/${teamId}/chat`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Accept: "text/event-stream", // Accept 헤더 추가
        // "Cache-Control": "no-cache", // Cache-Control 헤더 추가
        // Connection: "keep-alive", // Connection 헤더 추가
      },
      heartbeatTimeout: 120000,
      withCredentials: true,
    });

    teamChat.onmessage = (event) => {
      console.log("받아온 데이터 >", event.data);
      console.log("stateRef ->", messagesRef.current);
      setMessages((m) => m.concat(JSON.parse(event.data)));
    };

    teamChat.onerror = () => {
      //에러 발생시 할 동작
      teamChat.close(); //연결 끊기
    };

    return () => {
      teamChat.close();
    };
  }, []);

  //   useEffect(() => {
  //     console.log("메시지state 변할때마다 effect >", messages);
  //   }, [messages]);

  // 채팅 메시지 보내기
  const [inputChange, setInputChange] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChange(e.target.value);
  };

  const newChat = async () => {
    setInputChange("");
    try {
      const res = await axiosInstance.post(`/team/${teamId}/chat`, {
        message: inputChange,
        writerId: myTeamMemberId,
      });
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="absolute top-40 z-10 w-92 bg-white border border-gray-200 rounded-lg shadow">
      <div className="p-5 w-96 h-[40rem]">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          채팅
        </h5>
        <ChatBubble messages={messages} myTeamMemberId={myTeamMemberId} />
        {/* <div className="p-3 mb-3 h-[32rem] overflow-y-auto font-normal bg-gray-50 text-gray-700">
          {messages.map((content, index) => {
            const { writerId, message, createdDt }: any = content;
            return (
              <div key={index} className="flex items-start gap-2.5">
                <img className="w-8 h-8 rounded-full" src="" alt="chat image" />
                <div className="flex flex-col gap-1 w-56">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900">
                      {writerId}
                    </span>
                    <span className="text-sm font-normal text-gray-500">
                      {createdDt}
                    </span>
                  </div>
                  <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
                    <p className="text-sm font-normal text-gray-900">
                      {" "}
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
        <input
          value={inputChange}
          onChange={handleInputChange}
          className="border p-1 mr-1.5 w-72 rounded"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={newChat}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-mainGreen rounded-lg hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatView;
