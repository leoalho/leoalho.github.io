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
        <u>{metadata.title}</u>
      </Link>
      <div>
        Published {metadata.date} tags: {metadata.tags}
      </div>
    </div>
  );
};

const Blog = (props: any) => {
  console.log(props.allPostsData);
  return (
    <div>
      Blog posts:
      {props.allPostsData.map((post: any) => (
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
