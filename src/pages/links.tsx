import { getLinksData } from "@/src/lib/links";

export const config = {
  unstable_runtimeJS: false,
};

const Links = (props: any) => {
  const sections = [
    { name: "Programming", slug: "dev" },
    { name: "Documentation", slug: "docs" },
    { name: "AI", slug: "ai"},
    { name: "GIS", slug: "gis" },
    { name: "Mathematics", slug: "math" },
    { name: "History", slug: "history" },
    { name: "Blogs", slug: "blog" },
    { name: "Other", slug: "other" },
  ];

  return (
    <>
      <div className="mb-4">This page acts as a place for me to easily follow bookmarks that I anticipate reading more often than once. Most of them are in my opinion interesting and/or useful.</div>
      <h2>Links</h2>
      {sections.map((section: any, sectionIndex: number) => {
        return (
          <details key={sectionIndex}>
            <summary>
              <b>{section.name}</b>
            </summary>
            <div className="ml-2">
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
            </div>
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
