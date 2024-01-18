// import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
import axiosInstance from "../../axios";
import { useEffect, useState } from "react";
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";

const ChatView = ({ teamId, myTeamMemberId }: any) => {
  const accessToken = window.sessionStorage.getItem("accessToken");
  const EventSource = EventSourcePolyfill || NativeEventSource;

  useEffect(() => {
    // 구독
    const teamChat = new EventSource(
      `https://www.teammate.digital:8080/team/${teamId}/chat`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // Accept: "text/event-stream", // Accept 헤더 추가
          // "Cache-Control": "no-cache", // Cache-Control 헤더 추가
          // Connection: "keep-alive", // Connection 헤더 추가
        },
        heartbeatTimeout: 120000,
        withCredentials: true,
      },
    );

    teamChat.onmessage = (event) => {
      const res = event.data;
      console.log(res);
    };

    teamChat.onerror = () => {
      //에러 발생시 할 동작
      teamChat.close(); //연결 끊기
    };

    return () => {
      teamChat.close();
    };
  }, []);

  // 채팅 입력값
  const [inputChange, setInputChange] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputChange(e.target.value);
  };

  // 채팅 메시지 보내기
  const newChat = async () => {
    try {
      const res = await axiosInstance.post(`/team/${teamId}/chat`, {
        // data: {
        message: inputChange,
        writerId: myTeamMemberId,
        // },
      });
      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 채팅 메시지 목록
  const [messages, setMessages] = useState([
    {
      name: "홍길동",
      content: "초기값",
      time: "11:11",
    },
  ]);

  return (
    <div className="absolute top-48 z-10 w-90 bg-white border border-gray-200 rounded-lg shadow">
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          채팅
        </h5>
        <div className="p-3 mb-3 h-56 font-normal bg-gray-50 text-gray-700">
          {messages.map((message, index) => {
            const { name, content, time } = message;
            return (
              <div key={index} className="flex items-start gap-2.5">
                <img
                  className="w-8 h-8 rounded-full"
                  src="/docs/images/people/profile-picture-3.jpg"
                  alt="chat image"
                />
                <div className="flex flex-col gap-1 w-full max-w-[320px]">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {name}
                    </span>
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      {time}
                    </span>
                  </div>
                  <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-700">
                    <p className="text-sm font-normal text-gray-900 dark:text-white">
                      {" "}
                      {content}
                    </p>
                  </div>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Delivered
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <input
          value={inputChange}
          onChange={handleInputChange}
          className="border p-1"
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
