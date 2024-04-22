import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";

import { updatePageNavigation } from "../../Features/Features";
import PagesHeader from "../../Components/PagesHeader/PagesHeader";

import noMsg from "../../assets/img/no-message.png";

// import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import {
  getUserMessages,
  getUsersFromAgentId,
  sendMessage,
} from "../../Api/api";
import toast from "react-hot-toast";
import { RotatingLines } from "react-loader-spinner";

const Contact = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState<any>([]);
  const [agent, setAgent] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [messages, setMessages] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [highlightedUser, setHighlightedUser] = useState("");
  const [chatName, setChatName] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textMessage = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(updatePageNavigation("contact"));
  }, [dispatch]);

  useEffect(() => {
    async function fn_getUsers() {
      const result: any = await getUsersFromAgentId(
        //@ts-ignore
        JSON.parse(localStorage.getItem("agent"))._id
      );
      if (result?.status === 200) {
        setUsers(result?.data?.message);
      } else {
        setUsers([]);
      }
    }
    fn_getUsers();
    if (localStorage.getItem("agent")) {
      setAgent(localStorage.getItem("agent"));
    }
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fn_showUserMessages = async (userId: string, chatName: string) => {
    setChatName(chatName);
    setHighlightedUser(userId);
    const result: any = await getUserMessages(userId);
    if (result?.status === 200) {
      setSelectedUser(result?.data?.message);
      setMessages(result?.data?.message?.messagesData);
    } else {
      setMessages([]);
      setSelectedUser({});
    }
  };

  const fn_sendMessage = async (e: any) => {
    e.preventDefault();
    if (textMessage.current !== null && textMessage.current.value !== "") {
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const obj = {
        user: highlightedUser,
        agent: JSON.parse(agent)._id,
        sender: "agent",
        message: textMessage.current.value,
        time: formattedTime,
      };
      const result: any = await sendMessage(obj);
      setLoader(true);
      if (result.status === 200) {
        textMessage.current.value = "";
        setLoader(false);
        setMessages((prev: any) => [
          ...prev,
          {
            sender: "agent",
            message: obj.message,
            time: obj.time,
          },
        ]);
      } else {
        setLoader(false);
        toast.error("Sending Failed");
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <PagesHeader title="Contacts" nav={"Contacts"} subnav={""} />
      <div className="bg-gray-200 flex p-2 gap-3 h-[75vh]">
        {/* Names */}
        <div className="w-[200px] bg-[#F1F5F9] py-3 px-2 rounded overflow-hidden overflow-y-auto">
          <div className="bg-gray-200 p-2 text-[15px] font-[600]">Users</div>
          <div className="flex flex-col gap-3 py-4 text-[13px] font-[500]">
            {users?.length > 0 ? (
              users?.map((item: any, index: number) => (
                <p
                  key={index}
                  className={`cursor-pointer border-b leading-7 hover:bg-gray-200 ${
                    highlightedUser == item?.user?._id && "bg-gray-200"
                  }`}
                  onClick={() =>
                    fn_showUserMessages(item?.user?._id, item?.user?.name)
                  }
                >
                  &nbsp;&nbsp;&nbsp;{item?.user?.name}
                </p>
              ))
            ) : (
              <p className="text-center text-red-500">No Conversation Found</p>
            )}
          </div>
        </div>
        {/* Messages */}
        <div className="flex-1 bg-[#F1F5F9] p-3 rounded flex flex-col justify-between gap-1">
          <div className="overflow-hidden overflow-x-auto flex flex-col">
            {chatName !== "" && (
              <div className="bg-gray-200 p-2 text-[15px] font-[600]">
                {chatName}
              </div>
            )}
            <div
              ref={messagesContainerRef}
              className="flex flex-col gap-2 py-3 text-[13px] font-[500] overflow-hidden overflow-y-auto"
            >
              {messages?.length > 0 ? (
                messages?.map((item: any, index: number) =>
                  item?.sender === "agent" ? (
                    <div key={index} className="flex justify-end">
                      <p className="bg-gray-200 py-2 px-2 rounded-lg min-w-[170px] max-w-[max-content] flex flex-col gap-1">
                        <span>{item?.message}</span>
                        <span className="text-[9px] font-[400] flex items-center gap-2 justify-end">
                          {item?.time}
                          {/* <IoCheckmarkDoneOutline className="text-black scale-[1.4]" /> */}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div key={index} className="flex justify-start">
                      <p className="bg-[var(--sidebar-color)] text-white py-2 px-2 rounded-lg min-w-[170px] max-w-[max-content] flex flex-col gap-1">
                        <span>{item?.message}</span>
                        <span className="text-[9px] font-[400] flex items-center gap-2 justify-end">
                          {item?.time}
                          {/* <IoCheckmarkDoneOutline className="text-white scale-[1.4]" /> */}
                        </span>
                      </p>
                    </div>
                  )
                )
              ) : (
                <div className="flex flex-col items-center gap-2 mt-10">
                  <img src={noMsg} width={"250px"} />
                </div>
              )}
            </div>
          </div>
          {Object.keys(selectedUser)?.length > 0 && (
            <form
              className="flex items-center gap-2 bg-white py-2 px-3 rounded-lg"
              onSubmit={(e) => fn_sendMessage(e)}
            >
              <input
                className="flex-1 bg-transparent focus:outline-none text-[13px] font-[500]"
                ref={textMessage}
              />
              {!loader ? (
                <button
                  type="submit"
                  className="w-[20px] scale-[1.3] text-[var(--sidebar-color)] cursor-pointer"
                >
                  <LuSendHorizonal />
                </button>
              ) : (
                <button
                  disabled={true}
                  type="submit"
                  className="w-[20px] scale-[1.3] text-[var(--sidebar-color)] cursor-pointer"
                >
                  <RotatingLines
                    visible={true}
                    width="18"
                    strokeWidth="5"
                    animationDuration="0.75"
                    ariaLabel="rotating-lines-loading"
                  />
                </button>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
