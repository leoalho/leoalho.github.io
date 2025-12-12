import Link from "next/link";

export const config = {
  unstable_runtimeJS: false,
};

const Projects = () => {
  return (
    <div>
      <h2>Projects:</h2>
      <h2 className="my-6">Web applications:</h2>
      <div className="my-6">
        <h2>Maaperämyyrä</h2>
        <div>
          A simple web application for visualizing the borders, building and soil composure of a given plot in Finland. Also has a chrome extension that adds the visualization directly to etuovi.com, one of Finland's largest platforms for listing properties.
        </div>
        <div className="my-2">
          Main technologies used:
          <div className="ml-6">
            <b>Frontend:</b> html, css, js, proj4
            <br />
            <b>Backend:</b> NodeJs, Express
            <br />
            <b>DevOps:</b> Hosted on fly.io, Docker.
            NGinx
          </div>
        </div>
        <div>
          <Link href="https://maapera.fly.dev">Link to running app (NB app in Finnish)</Link>
          <Link className="ml-3" href="https://chromewebstore.google.com/detail/etuovi-maaper%C3%A4/jmnheggelkjnhbgepnpoaamkpjoidjpl?hl=fi">Link to chrome extension</Link>
        </div>
      </div>
      <div className="my-6">
        <h2>WeSail</h2>
        <div>
          A social media application for logging planning and sharing sail trips
          and boat maintenance. Written mainly in the beginning of 2023. Built
          as the final project for the{" "}
          <Link href="https://fullstackopen.com">fullstackopen</Link> course.
        </div>
        <div className="my-2">
          Main technologies used:
          <div className="ml-6">
            <b>Frontend:</b> React, Typescript, css
            <br />
            <b>Backend:</b> Typescript, Express, MongoDB, Redis
            <br />
            <b>DevOps:</b> Hosted on DigitalOcean, Github Actions, Docker Swarm,
            NGinx
          </div>
        </div>
        <div>
          <Link href="https://wesail.alho.dev">Link to running app</Link>
          <Link href="https://github.com/leoalho/WeSail" className="ml-3">
            Github
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
