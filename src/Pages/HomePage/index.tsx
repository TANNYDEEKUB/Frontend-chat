import { Navbar } from "../../Components/NavBar";

export const HomePage = () => {
  return (
    <>
      <Navbar />

      <div className="w-full h-[calc(100vh-4rem-18px-40px)] fixed bottom-0 bg-[#FFEFD5] text-jet flex flex-row">
        <div className="w-[25%]">
          <h2 className="text-3xl w-full text-center py-2">แผงควบคุม</h2>
          <div id="message-list">
            <a
              href="#"
              className="block w-full p-2 m-2 text-2xl bg-overlay rounded-lg text-center text-whitesmoke"
            >
              <i className="fa fa-commenting-o"></i> การสนทนา
            </a>
          </div>
        </div>
        <div className="w-[75%] h-full">
          <div
            id="message-container"
            className="w-[90%] h-[97%] mt-4 mx-auto bg-[#FFFAF0] border-solid border-2 border-b-0 border-jet rounded-t-lg"
          >
            <div
              id="message-log"
              className="w-full h-[90%] overflow-y-auto p-4"
            ></div>
            <div id="chat" className="text-xl flex flex-row gap-4 m-4">
              <input
                type="text"
                placeholder="ใส่ Prompt ที่ต้องการถาม"
                className="w-full py-2 px-4 rounded-lg border-solid border-jet border-2 focus:ring-0 focus:outline-none focus:border-coral"
              />
              <button className="py-2 px-3 rounded-full bg-coral text-whitesmoke hover:scale-95 hover:rotate-45 hover:opacity-80">
                <i className="fa fa-send-o text-3xl"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
