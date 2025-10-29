import type { Handler, HandlerResponse } from "@netlify/functions";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Post } from "../../types";

const handler: Handler = async (event): Promise<HandlerResponse> => {
  const { slug } = event.queryStringParameters || {};

  if (!slug) {
    return { statusCode: 400, body: JSON.stringify({ error: "Slug is required" }) };
  }

  try {
    // Fix: Use bracket notation to access process.cwd() to bypass TypeScript type error.
    const postsDir = path.join(process['cwd'](), 'content', 'posts');
    const filePath = path.join(postsDir, `${slug}.md`);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const post: Post = {
      slug,
      title: data.title,
      date: data.date,
      description: data.description,
      image: data.image,
      link: data.link,
      youtube_url: data.youtube_url,
      content,
    };
    
    return {
      statusCode: 200,
      body: JSON.stringify(post),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Post not found" }),
    };
  }
};

export { handler };
