import { getLinksData } from "@/src/lib/links";

export const config = {
  unstable_runtimeJS: false,
};

const Links = (props: any) => {
  const sections = [
    { name: "Programming", slug: "dev" },
    { name: "Documentation", slug: "docs" },
    { name: "GIS", slug: "gis" },
    { name: "Mathematics", slug: "math" },
    { name: "History", slug: "history" },
    { name: "Blogs", slug: "blog" },
    { name: "Other", slug: "other" },
  ];

  return (
    <>
      <h2>Links</h2>
      {sections.map((section: any, sectionIndex: number) => {
        return (
          <details key={sectionIndex}>
            <summary>
              <b>{section.name}</b>
            </summary>
            <p>
              {props.linksData
                .filter((link: any) => link.category === section.slug)
                .sort((a: any, b: any) => {
                  var titleA = a.title.toUpperCase();
                  var titleB = b.title.toUpperCase();
                  return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
                })
                .map((link: any, index: number) => {
                  return (
                    <div key={index}>
                      <a href={link.url} target="_blank">
                        {link.title || link.url}
                      </a>
                    </div>
                  );
                })}
            </p>
          </details>
        );
      })}
    </>
  );
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
