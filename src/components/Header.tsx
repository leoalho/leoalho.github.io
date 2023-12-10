import NavBarLink from "./NavbarLink";
import Image from "next/image";

const Header = () => {
  return (
    <div>
      <ul className="border-b-2 border-orange-500 flex max-w-screen-md m-auto p-2 bg-white">
        <NavBarLink link="/" title="Leo Alho" />
        <NavBarLink link="/blog" title="Blog" />
        <NavBarLink link="/projects" title="Projects" />
        <a
          className="flex-1 flex justify-end"
          href="https://github.com/leoalho"
        >
          <Image
            src="/github-mark.svg"
            alt="Github logo"
            width={30}
            height={30}
          />
        </a>
      </ul>
    </div>
  );
};

export default Header;
