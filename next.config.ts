import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env:{
    TOKENA: process.env.GITHUB_TOKENA
  }
  
};

export default nextConfig;
