import { getAllPostIds, getPostData } from "@/src/lib/posts";

export default function Post({ postData }: { postData: any }) {
  return <>{postData.id}</>;
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: any }) {
  const postData = getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
