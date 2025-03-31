import Image from "next/image";
import landingSvg from "./svg/svg";
export default function SkilsSec() {
  return (
    <section>
      <div className="flex pb-2 items-center gap-2  relative">
        <h1 className="">
          <span className="text-[#C778DD]">#</span> Projects
        </h1>
        <div className=" border border-[#C778DD] h-0 w-[311px]  " />
      </div>
      <div className="flex gap-30">
        {/* left */}
        <div className="w-[329px] h-[282px] flex relative">
          <div className="w-[86px] h-[86px] border absolute right-10" />
          <div className="w-[52px] h-[52px] border absolute right-0 bottom-20" />
          <Image
            src={landingSvg.dots}
            alt="sd"
            className="absolute left-0 top-10 w-[63px] h-[63px]"
          />
          <Image
            src={landingSvg.dots}
            alt="sd"
            className="absolute right-30 bottom-20 w-[63px] h-[63px]"
          />
          <Image
            src={landingSvg.logo}
            alt="sd"
            className="absolute bottom-0 w-[113px] h-[113px]"
          />
        </div>
        {/* right */}
        <div className="flex gap-2">
          <div className="w-[178px] h-[103px] border  relative">
            <h1 className="p-2">Languages</h1>
            <div className="border-b" />

            <div className="flex flex-col p-2">
              <div className="flex gap-2">
                {" "}
                <h1>TypeScript</h1>
                <h1>Lua</h1>
              </div>
              <div className="flex gap-2">
                <h1>Python</h1>
                <h1>Javascript</h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
          <div className="w-[178px] h-[103px] border  relative">
            <h1 className="p-2">Languages</h1>
            <div className="border-b" />

            <div className="flex flex-col p-2">
              <div className="flex gap-2">
                {" "}
                <h1>TypeScript</h1>
                <h1>Lua</h1>
              </div>
              <div className="flex gap-2">
                <h1>Python</h1>
                <h1>Javascript</h1>
              </div>
            </div>
          </div>
          <div className="w-[178px] h-[103px] border  relative">
            <h1 className="p-2">Languages</h1>
            <div className="border-b" />

            <div className="flex flex-col p-2">
              <div className="flex gap-2">
                {" "}
                <h1>TypeScript</h1>
                <h1>Lua</h1>
              </div>
              <div className="flex gap-2">
                <h1>Python</h1>
                <h1>Javascript</h1>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
