import { FaDiscord, FaGithub } from "react-icons/fa";
import { IoLogoFigma } from "react-icons/io5";

export default function Footer (){
    return(
        <div>
            <div className="w-full bg-white h-[2px] absolute left-0"/>
            <div className="pt-10 flex justify-between">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-4">
                        <p>Muhammad Farid</p>
                        <p>farid@farid-dev.ml</p>
                    </div>
                    <p>Web designer and front-end developer</p>
                </div>
                <div className="flex flex-col gap-3">
                    <p>Media</p>
                    <div className="flex gap-3">
                        <FaGithub/>
                        <IoLogoFigma/>
                        <FaDiscord/>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center pt-10">
                <p>© Copyright 2022. Made by Elias</p>
            </div>
        </div>
    )
}