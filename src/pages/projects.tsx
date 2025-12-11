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
        <h2>WeSail</h2>
        <div>
          A social media application for logging planning and sharing sail trips
          and boat maintenance. Written mainly in the beginning of 2023. Built
          as the final project for the{" "}
          <Link href="https://fullstackopen.com">fullstackopen</Link> course.
        </div>
        <div>
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
