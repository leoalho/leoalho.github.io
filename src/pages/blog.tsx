import { getAllPostsData } from "../lib/posts";
import Link from "next/link";

export const config = {
  unstable_runtimeJS: false,
};

const BlogCard = (props: any) => {
  const { metadata } = props;
  return (
    <div className="my-6">
      <Link href={`/posts/${metadata.id}`}>
        {metadata.title}
      </Link>
      <div>Published {metadata.date}</div>
    </div>
  );
};

const Blog = (props: any) => {
  return (
    <div>
      <h2>Blog posts:</h2>
      {props.allPostsData.sort((a: any,b: any) => {
        return b.date > a.date
      }).map((post: any) => (
        <BlogCard key={post.id} metadata={post} />
      ))}
    </div>
  );
};

export default Blog;

export async function getStaticProps() {
  const allPostsData = getAllPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
