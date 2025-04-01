import Image from "next/image";
import landingSvg from "./svg/svg";
import { skillsSvgAnimation } from "./animation/Animation";

export default function SkillsSec() {
  const skills = [
    {
      title: "Languages",
      items: ["Typescript", "Lua", "Python", "JavaScript"],
    },
    {
      title: "Databases",
      items: ["SQLite", "PostgreSQL", "Mongo"],
    },
    {
      title: "Other",
      items: ["HTML", "CSS", "EJS", "SCSS", "REST", "Jinja"],
    },
    {
      title: "Tools",
      items: [
        "VSCode",
        "Neovim",
        "Linux",
        "Figma",
        "XFCE",
        "Arch",
        "Git",
        "Font Awesome",
      ],
    },
    {
      title: "Frameworks",
      items: ["React", "Vue", "Disnake", "Discord.js", "Flask", "Express.js"],
    },
  ];
  skillsSvgAnimation()
  return (
    <section>
      <div className="flex pb-2 items-center gap-2 relative">
        <h1 className="text-[#C778DD]"># Skilss</h1>
        <div className="border border-[#C778DD] h-0 w-[311px]" />
      </div>
      <div className="flex gap-5">
        <div className="w-[329px] h-[282px] flex relative skills-svg">
          <div className="absolute right-10 w-[86px] h-[86px] border" />
          <div className="absolute right-0 bottom-20 w-[52px] h-[52px] border" />
          <Image
            src={landingSvg.dots}
            alt="dots"
            className="absolute left-0 top-10 w-[63px] h-[63px] dotss"
          />
          <Image
            src={landingSvg.dots}
            alt="dots"
            className="absolute right-25 bottom-20 w-[63px] h-[63px] dotss"
          />
          <Image
            src={landingSvg.logo}
            alt="logo"
            className="absolute bottom-0 w-[100px] h-[113px] logos"
          />
        </div>
        <div className="flex gap-2">
          {skills.slice(0, 1).map((skill) => (
            <div
              key={skill.title}
              className="w-[178px] h-[103px] border relative"
            >
              <h1 className="p-2">{skill.title}</h1>
              <div className="border-b" />
              <div className="flex gap-2 p-2">
                {skill.items.slice(0, 2).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
              <div className="flex gap-2 px-2">
                {skill.items.slice(2, 4).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {skills.slice(1, 3).map((skill) => (
            <div
              key={skill.title}
              className="w-[178px] h-[103px] border relative"
            >
              <h1 className="p-2">{skill.title}</h1>
              <div className="border-b" />
              <div className="flex gap-2 p-2">
                {skill.items.slice(0, 2).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
              <div className="flex gap-2 px-2">
                {skill.items.slice(2, 6).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {skills.slice(3, 4).map((skill) => (
            <div
              key={skill.title}
              className="w-[196px] h-[132px] border relative"
            >
              <h1 className="p-2">{skill.title}</h1>
              <div className="border-b" />
              <div className="flex gap-2 p-2">
                {skill.items.slice(0, 3).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
              <div className="flex gap-2 px-2">
                {skill.items.slice(3, 6).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
              <div className="flex gap-2 px-2">
                {skill.items.slice(6, 9).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
            </div>
          ))}
          {skills.slice(4, 6).map((skill) => (
            <div
              key={skill.title}
              className="w-[196px] h-[132px] border relative"
            >
              <h1 className="p-2">{skill.title}</h1>
              <div className="border-b" />
              <div className="flex gap-2 p-2">
                {skill.items.slice(0, 2).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
              <div className="flex gap-2 px-2">
                {skill.items.slice(2, 4).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
              <div className="flex gap-2 px-2">
                {skill.items.slice(4, 6).map((item) => (
                  <h1 key={item} className="text-sm">
                    {item}
                  </h1>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
