import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com','scontent.fqfd1-1.fna.fbcdn.net', 'randomuser.me', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'cdn.pixabay.com', 'i.imgur.com', 'res.cloudinary.com', '*.*', 'ui-avatars.com'],
  },
  // ... other configurations if you have them
}

module.exports = nextConfig


export default nextConfig;
