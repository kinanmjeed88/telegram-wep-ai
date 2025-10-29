import type { Handler, HandlerResponse } from "@netlify/functions";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { PostListItem } from "../../types";

const handler: Handler = async (): Promise<HandlerResponse> => {
  try {
    // Fix: Use bracket notation to access process.cwd() to bypass TypeScript type error.
    const postsDir = path.join(process['cwd'](), 'content', 'posts');
    const files = await fs.readdir(postsDir);
    
    const postsPromises = files
      .filter(file => file.endsWith('.md'))
      .map(async (file): Promise<PostListItem> => {
        const filePath = path.join(postsDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data } = matter(fileContent);
        
        return {
          slug: file.replace('.md', ''),
          title: data.title,
          date: data.date,
          description: data.description,
          image: data.image,
        };
      });

    const posts = await Promise.all(postsPromises);
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      statusCode: 200,
      body: JSON.stringify(posts),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch posts" }),
    };
  }
};

export { handler };
