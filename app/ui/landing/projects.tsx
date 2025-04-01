// biodata/app/ui/landing/projects.tsx
import Image from "next/image";
import IMAGE from "@/public/IMAGE";
import useStore from "@/app/store/buttonAppearclick";
import { codeButtonAnimation } from "./animation/Animation";
import { useEffect, useRef } from "react";

import { Repo } from "@/app/lib/definitions";
import { fetchProjects } from "./api/github-api";
import { useState } from "react";

export default function ProjectsSec() {
  const { activeProject, setActiveProject } = useStore();
  const codeButtonRef = useRef(null);
  const [repos, setRepos] = useState<Repo[]>([])

  useEffect(() => {
    console.log("useEffect triggered");
    if (codeButtonRef.current) {
      codeButtonAnimation(codeButtonRef.current);
    }
  }, [activeProject]);

  const projects = [
    {
      image: IMAGE.Project1,
      title: "ChartNodes",
      description: "Minecraft servers hosting",
      technologies: ["HTML", "SCSS", "Python", "Flask"],
    },
    {
      image: IMAGE.Project2,
      title: "ProtectX",
      description: "Discord anti-crash bot",
      technologies: ["HTML", "SCSS", "JavaScript"],
    },
    {
      image: IMAGE.Project3,
      title: "Kahoot Answers Viewer",
      description: "Get answers to your kahoot quiz",
      technologies: ["Python", "Flask", "React"],
    },
  ];

  const fetchRepos = async () => {
    try {
      const data = await fetchProjects();
      setRepos(
        data.map(
          (repo:Repo) => ({
            id: repo.id,
            url: `https://github.com/s3r3/${repo.name}`,
            language: repo.language,
          })
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  return (
    <section>
      <div className="flex pb-2 items-center gap-2 justify-between relative">
        <h1 className="">
          <span className="text-[#C778DD]">#</span> Projects
        </h1>
        <div className=" border border-[#C778DD] h-0 w-[511px] relative right-20 " />
        <p className="">
          View All <span>~~&#62;</span>
        </p>
      </div>
      <div className="pb-10 flex gap-3">
        {projects.map((project, index) => (
          <div
            key={index}
            className="w-[330px] h-[391px] border"
            onClick={() => setActiveProject(index)}
          >
            <Image src={project.image} alt="" />
            <div className="flex gap-2 border-b p-2">
              {project.technologies.map((tech) => (
                <h1 key={tech}>{tech}</h1>
              ))}
            </div>
            <div className="flex flex-col gap-3 p-3">
              <h1 className="text-xl">{project.title}</h1>
              <p className="text-sm">{project.description}</p>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-primary text-white">
                  Live &lt;~&gt;
                </button>
                {activeProject === index && (
                  <button
                    className="btn btn-outline btn-primary text-white code-button"
                    ref={codeButtonRef}
                    onClick={() => window.open(repos[index].url, "_blank")}
                 >
                    Code &lt;~&gt;
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
