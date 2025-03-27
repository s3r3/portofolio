"use client";
import { useEffect } from "react";
import { FaDribbble, FaGithub } from "react-icons/fa";
import useLanguageStore from "../store/languageStore";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogoFigma } from "react-icons/io5";
import { Button } from "../ui/button";
import LandingSvg from "../ui/landing/svg";
import Image from "next/image";
import { EffectSVG, scrambleText } from "../ui/landing/Animation";
import IMAGE from "../../public/IMAGE";

const Header = () => {
  const { language, setLanguage } = useLanguageStore();

  // Animation
  EffectSVG();
  useEffect(() => {
    const element = document.getElementById("scramble_1");
    if (element) {
      scrambleText(element, "Currently working on Fullstack Developer", 2000);
    }
  }, []);

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
      <div className="flex items-center gap-5">
        {/* left */}
        <div className="flex flex-col gap-4 w-[557px]">
          <h1 className="text-white">
            Elias is a <span className="text-[#C778DD]">web designer</span> and{" "}
            <span className="text-[#C778DD]">front-end developer</span>
          </h1>
          <p className="text-[#ABB2BF]">
            He crafts responsive websites where technologies meet creativity
          </p>
          <Button className="w-[148px]">Contact Me!!</Button>
        </div>
        {/* right */}
        <div className="flex relative ">
          <Image
            src={LandingSvg.logo}
            alt="logo"
            className="absolute logo w-[8rem] top-20 "
          />
          <div className="relative">
            <Image src={IMAGE.Orang} alt="" className="relative" />
            <div className="w-[402px] h-[30px] border-1 flex gap-2 items-center px-3">
              <div className="w-[16px] h-[16px] bg-[#C778DD]" />
              <p className="text-[#ABB2BF] text-sm" id="scramble_1">
                Currently working on
                <span className="text-white " >
                  FullStack Developer
                </span>
              </p>
            </div>
          </div>
          <Image
            src={LandingSvg.dots}
            alt="dots"
            className="dots relative right-20 top-15"
          />
        </div>
      </div>
      {/* quotes */}
      <div className="pt-12 pb-5 flex justify-center relative flex-col items-center">
        <div className="w-[512px] h-[66px] border-1 flex items-center justify-center">
          <p className="relative bottom-7 bg-[#1d232a] text-3xl">"</p>
          <p>With great power comes great electricity bill</p>
        </div>
        <div className="w-[162px] h-[46px] border-1 flex items-center justify-center relative left-[175px]">
          <p className="relative bottom-4 left-25 h-fit bg-[#1d232a] text-3xl">"</p>
          <p>~ Dr.Who</p>

        </div>
      </div>
    </header>
  );
};

export default Header;
