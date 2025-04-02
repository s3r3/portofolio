import { Button } from "@/public/button";
import IMAGE from "@/public/IMAGE";
import Image from "next/image";
import landingSvg from "./svg/svg";
import { EffectSVG } from "./animation/Animation";
export default function AboutMe() {
  EffectSVG();
  return (
    <div className="pt-20 relative">
      <div className="flex pb-2 items-center gap-2 relative">
        <h1 className="text-[#C778DD]"># Skilss</h1>
        <div className="border border-[#C778DD] h-0 w-[311px]" />
      </div>
      <div className="flex">
        <div className=" w-[515px] flex flex-col gap-3">
          <p>Hello, i’m Elias!</p>
          <p>
            I’m a self-taught front-end developer based in Kyiv, Ukraine. I can
            develop responsive websites from scratch and raise them into modern
            user-friendly web experiences.
          </p>
          <p>
            Transforming my creativity and knowledge into a websites has been my
            passion for over a year. I have been helping various clients to
            establish their presence online. I always strive to learn about the
            newest technologies and frameworks.
          </p>
          <Button className="w-[148px]">Read More</Button>
        </div>
        <div className="relative  bottom-20 left-20">
          <Image
            src={landingSvg.dots}
            alt=""
            className="top-20 relative dots "
          />
          <Image
            src={IMAGE.Project4}
            alt=""
            className="w-[319px] h-[407px]  border-b border-[#C778DD] relative bottom-10 "
          />
          <Image
            src={landingSvg.dots}
            alt=""
            className=" relative bottom-[14rem] left-[14rem] dots"
          />
        </div>
      </div>
    </div>
  );
}
