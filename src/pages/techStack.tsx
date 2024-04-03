/* eslint-disable react/no-unescaped-entities */
export const config = {
    unstable_runtimeJS: false,
};

const TechStack = () => {
    return (
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
    )
}

export default TechStack