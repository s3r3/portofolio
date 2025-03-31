// biodata/app/api/github-api.ts
import axios from "axios";


const GitHub_API_URL = "https://api.github.com";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKENA;
console.log (GITHUB_TOKEN)
console.log('Token GitHub:', GITHUB_TOKEN);

const githubApi = axios.create({
  baseURL: GitHub_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export const fetchProjects = async () => {
  try {
    const response = await githubApi.get("/users/s3r3/repos", {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};