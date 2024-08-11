import React, { useState, useEffect } from "react";
import { Navbar } from "../../Components/NavBar";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUserCircle, faTrash, faSave, faPaperPlane, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import './HomePage_styles.css'; 

interface HomePageProps {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ token, setToken }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(() => {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ _id: string; name: string; messages: { sender: string; text: string }[] }[]>(() => {
    const savedChatHistory = localStorage.getItem("chatHistory");
    return savedChatHistory ? JSON.parse(savedChatHistory) : [];
  });
  const [sessionId, setSessionId] = useState<string | null>(() => localStorage.getItem("sessionId"));
  const [chatName, setChatName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  useEffect(() => {
    if (!token) return;

    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/chat/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatHistory(response.data);
        localStorage.setItem("chatHistory", JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, [token]);

  useEffect(() => {
    if (sessionId) {
      localStorage.setItem("sessionId", sessionId);
    } else {
      localStorage.removeItem("sessionId");
    }
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await axios.post("http://localhost:3001/api/chat", { message: input, sessionId }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages([...newMessages, botMessage]);

      if (!sessionId) {
        setSessionId(response.data.sessionId);
        const updatedHistory = [...chatHistory, { _id: response.data.sessionId, name: "การสนทนาใหม่", messages: [...newMessages, botMessage] }];
        setChatHistory(updatedHistory);
        localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      } else {
        const updatedChatHistory = chatHistory.map(chat => chat._id === sessionId
          ? { ...chat, messages: [...chat.messages, userMessage, botMessage] }
          : chat
        );
        setChatHistory(updatedChatHistory);
        localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
      }
    } catch (error) {
      console.error(error);
      const errorMessage = { sender: "bot", text: "ขออภัย ไม่สามารถตอบกลับได้ในขณะนี้" };
      setMessages([...newMessages, errorMessage]);
    }

    setInput("");
  };

  const loadSession = (session: { _id: string; name: string; messages: { sender: string; text: string }[] }) => {
    if (isEditingName !== null) return; // ป้องกันการสลับ session ในขณะที่กำลังแก้ไขชื่อ

    setMessages(session.messages);
    setSessionId(session._id);
    setChatName(session.name);
    localStorage.setItem("sessionId", session._id);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/chat/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedHistory = chatHistory.filter(chat => chat._id !== id);
      setChatHistory(updatedHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
      if (sessionId === id) {
        setMessages([]);
        setSessionId(null);
        setChatName("");
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSaveChatName = async (id: string, newName: string) => {
    try {
      await axios.post(`http://localhost:3001/api/chat/history/name/${id}`, { name: newName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedChatHistory = chatHistory.map(chat => chat._id === id
        ? { ...chat, name: newName }
        : chat
      );
      setChatHistory(updatedChatHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
      setIsEditingName(null);
    } catch (error) {
      console.error('Error saving chat name:', error);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
    setMessages([]);
    setChatHistory([]);
    setSessionId(null);
    setChatName("");
    localStorage.removeItem("messages");
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("sessionId");
  };

  const handleNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setChatName("");
  };

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <div className="w-full h-[calc(100vh-4rem-18px-40px)] fixed bottom-0 bg-primary text-jet flex flex-row">
        <div className="w-[20%]">
          <h2 className="text-4xl w-full text-center py-5 text-black">ประวัติการสนทนา</h2>
          {isAuthenticated ? (
            <>
              <div id="message-list" className="flex flex-col items-center">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className="chat-item w-3/5 flex items-center justify-between mb-2 relative"
                    style={{ cursor: "pointer" }}
                  >
                    {isEditingName === chat._id ? (
                      <>
                        <input
                          type="text"
                          value={chatName}
                          onChange={(e) => setChatName(e.target.value)}
                          className="w-full p-2 text-xl rounded-lg text-black text-center"
                        />
                        <button
                          onClick={() => handleSaveChatName(chat._id, chatName)}
                          className="ml-2 text-green-600"
                        >
                          <FontAwesomeIcon icon={faSave} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="block w-full p-3 text-2xl bg-secondary rounded-lg text-center text-whitesmoke"
                          style={{ height: '50px', justifyContent: "center", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          onClick={() => loadSession(chat)}
                        >
                          {chat.name || `การสนทนา ${index + 1}`}
                        </button>
                        <div className="icon-buttons flex items-center space-x-2 absolute right-0 top-0 opacity-0 transition-opacity duration-300 hover:opacity-100">
                          <button
                            className="text-blue-600 ml-2"
                            style={{ marginLeft: "5px", position: "relative", right: "-60px", fontSize: "20px" }}
                            onClick={() => {
                              setIsEditingName(chat._id);
                              setChatName(chat.name);
                            }}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="text-red-600 ml-2"
                            style={{ marginLeft: "5px", position: "relative", right: "-70px", fontSize: "20px" }}
                            onClick={() => handleDeleteSession(chat._id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="w-full flex justify-center">
                <button
                  onClick={handleNewChat}
                  className="w-16 h-16 m-2 bg-secondary rounded-full text-center text-whitesmoke flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faPlus} className="text-3xl" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">คุณยังไม่ได้ล็อกอิน แต่สามารถถามคำถามได้</p>
          )}
        </div>
        <div className="w-[75%] h-full">
          <div
            id="message-container"
            className="w-[90%] h-[97%] mt-4 mx-auto bg-[#FFFAF0] border-solid border-2 border-b-0 border-jet rounded-t-lg"
          >
            <div id="message-log" className="w-full h-[80%] overflow-y-auto p-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start mb-10 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <FontAwesomeIcon icon={message.sender === 'user' ? faUserCircle : faRobot} className="text-4xl m-2" />
                  <p className={`py-2 px-4 rounded-lg max-w-[75%] whitespace-pre-wrap break-words ${message.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-300 self-start"} border-solid border border-jet`}>
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
            <div id="chat" className="text-xl flex flex-row gap-4 m-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="ช่องใส่คำถาม"
                className="w-full py-2 px-4 rounded-lg border-solid border-jet border-2 focus:ring-0 focus:outline-none focus:border-secondary"
                disabled={isEditingName !== null}  // Disable input when editing
              />
              <button
                onClick={handleSendMessage}
                className="py-2 px-3 rounded-full bg-secondary text-whitesmoke hover:scale-95 hover:rotate-45 hover:opacity-80"
                disabled={isEditingName !== null}  // Disable button when editing
              >
                <FontAwesomeIcon icon={faPaperPlane} className="text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
