// components/Header.tsx
import { FaDribbble, FaGithub } from "react-icons/fa";
import useLanguageStore from "../store/languageStore";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogoFigma } from "react-icons/io5";
import { Button } from "../ui/button";
import LandingSvg from "../ui/landing/svg";
import Image from "next/image";


const Header = () => {
  const { language, setLanguage } = useLanguageStore();
  
  return (
    <header className="text-[#ABB2BF] flex justify-center flex-col ">
      <ul className="flex gap-10 m-8 justify-center">
        <li>#home</li>
        <li>#about-me</li>
        <li>#contacts</li>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="flex gap-2">
            {language}
            <IoIosArrowDown />
          </label>
          <ul tabIndex={0} className="dropdown-content menu ">
            <li>
              <a onClick={() => setLanguage("ENG")}>ENG</a>
            </li>
            <li>
              <a onClick={() => setLanguage("IDN")}>IDN</a>
            </li>
          </ul>
        </div>
      </ul>
      
      <div className="absolute left-5 h-[191px] flex flex-col top-0 items-center gap-2">
        <div className="border-l border-[#ABB2BF] h-full"></div>
        <div className="flex flex-col gap-2 ">
          <FaGithub />
          <FaDribbble />
          <IoLogoFigma />
        </div>
      </div>

      {/* Main */}
      <div className="flex">
        {/* left */}
        <div className="flex flex-col gap-4 w-[557px]">
            <h1 className="text-white">Elias is a <span className="text-[#C778DD]">web designer</span> and <span className="text-[#C778DD]">front-end developer</span></h1>
            <p className="text-[#ABB2BF]">He crafts responsive websites where technologies meet creativity</p>
            <Button className="w-[148px]">Contact Me!!</Button>
        </div>
        {/* right */}
        <div>
          <Image src={LandingSvg.dots} alt="dots"/>
        </div>
      </div>
    </header>
  );
};

export default Header;
