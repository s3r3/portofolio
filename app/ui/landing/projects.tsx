import Image from "next/image";
export default function ProjectsSec() {
  return (
    <section>
    <div className="flex pb-2 items-center gap-2 justify-between relative">
      <h1 className=""><span className="text-[#C778DD]">#</span> Projects</h1>
      <div className="border border-[#C778DD] h-0 w-[511px] relative right-20 " />
      <p className="">
        View All <span>~~&#62;</span>
      </p>
    </div>
    </section>
  );
}
