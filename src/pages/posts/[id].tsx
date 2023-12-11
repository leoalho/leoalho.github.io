import { getAllPostIds, getPostData } from "@/src/lib/posts";

export const config = {
  unstable_runtimeJS: false,
};

export default function Post({ postData }: { postData: any }) {
  return <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }}></div>;
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: any }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
