import {getLinksData} from "@/src/lib/links";

export const config = {
  unstable_runtimeJS: false,
};

const Links = (props) => {
  return (
      <>
      <h2>Links</h2>
      {props.linksData.map((link, index) =>  {
        return (<div key={index}>
          <a href={link.url} target="_blank">{link.title || link.url}</a>
        </div>)})}
      </>
  )
};

export default Links;

export async function getStaticProps() {
  const linksData = getLinksData();
  return {
    props: {
      linksData,
    },
  };
}