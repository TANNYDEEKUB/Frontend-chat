export const Navbar = () => {
  return (
    <div className="w-full bg-[#FFFAF0] text-jet fixed top-0 z-0 py-4">
      <div className="w-full text-center">
        <h1 className="text-4xl">Chat AI</h1>
      </div>
      <div id="help-menu" className="my-4 fixed top-2 right-0 z-1">
        <a
          className="p-4 mx-2 hover:opacity-80 hover:bg-overlay hover:text-whitesmoke"
          href="#"
        >
          ช่วยเหลือ
        </a>
        <a
          className="p-4 mx-2 hover:opacity-80 hover:bg-overlay hover:text-whitesmoke"
          href="#"
        >
          บัญชี
        </a>
      </div>
      <div
        id="nav-menu"
        className="w-[50%] mx-auto mt-4 pt-4 flex flex-row justify-evenly"
      >
        <a
          className="border-b-2 border-solid border-coral hover:border-coral"
          href=""
        >
          แชทบอท
        </a>
        <a
          className="border-b-2 border-solid border-[transparent] hover:border-coral"
          href=""
        >
          กิจกรรม
        </a>
        <a
          className="border-b-2 border-solid border-[transparent] hover:border-coral"
          href=""
        >
          แหล่งที่มา
        </a>
        <a
          className="border-b-2 border-solid border-[transparent] hover:border-coral"
          href=""
        >
          บริการ
        </a>
        <a
          className="border-b-2 border-solid border-[transparent] hover:border-coral"
          href=""
        >
          ผังเว็บไซต์
        </a>
      </div>
    </div>
  );
};
