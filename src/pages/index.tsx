/* eslint-disable react/no-unescaped-entities */
export const config = {
  unstable_runtimeJS: false,
};

const Index = () => {
  return (
    <div>
      <div>
        Hi, I am Leo Alho, a medical doctor, full stack developer and father of
        two. This is my developer homepage.
      </div>
      <div className="my-6">
        <h2>My current preferred stack for web applications:</h2>
        <ul className="ml-6">
          <li>Frontend: Next.js (with Typescript), tailwind/css</li>
          <li>Backend: Typescript, Express, socket.io</li>
          <li>Formatting: ESLINT, Prettier</li>
          <li>Testing: Jest (unit), Cypress (E2E)</li>
          <li>
            Databases: PostgreSQL (PostGIS), SQLite for small apps and
            sideprojects
          </li>
          <li>CI/CD: Github actions</li>
          <li>
            DevOps: Digital Ocean, Ubuntu Server 22.04 LTS, Docker (Docker
            swarm), NGINX (load balancing)
          </li>
          <li>UI design: Figma</li>
        </ul>
      </div>
      <div>
        <h2>I'm currently learning:</h2>
        <ul className="ml-6">
          <li>SASS</li>
          <li>Playwright</li>
        </ul>
      </div>
    </div>
  );
};

export default Index;
