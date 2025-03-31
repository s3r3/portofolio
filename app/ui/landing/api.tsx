// biodata/app/ui/landing/api.tsx
import { useState, useEffect } from 'react';
import { fetchProjects  } from './api/github-api';

export default function Api () {
  const [repos, setRepos] = useState<{ id: string; name: string; description: string; technologies: string[]; image: string; url: string; language: string; }[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await fetchProjects();
        setRepos(data.map((repo: { id: string; name: string; description: string; topics: string[]; language: string }) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          technologies: repo.topics,
          image: `https://source.unsplash.com/300x200/?${repo.name}`,
          url: `https://github.com/s3r3/${repo.name}`,
          language: repo.language,
        })));
      } catch (error) {
        console.error(error);
      }
    };
    fetchRepos();
  }, []);

  return (
    <div>
      <h1>Repos</h1>
      <div className="flex flex-wrap gap-4">
        {repos.map((repo, index) => (
          <div
            key={index}
            className="w-[330px] h-[391px] border"
          >
            <img src={repo.image} alt="" />
            <div className="flex gap-2 border-b p-2">
              {repo.technologies.map((tech) => (
                <h1 key={tech}>{tech}</h1>
              ))}
            </div>
            <div className="flex flex-col gap-3 p-3">
              <h1 className="text-xl">{repo.name}</h1>
              <p className="text-sm">{repo.description}</p>
              <p className="text-sm">Bahasa: {repo.language}</p>
              <div className="flex gap-2">
                <button className="btn btn-outline btn-primary text-white">
                  Live &lt;~&gt;
                </button>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-outline btn-primary text-white code-button">
                    Code &lt;~&gt;
                  </button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}