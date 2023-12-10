import NavBarLink from "./NavbarLink";

const Header = () => {
  return (
    <div className=" bg-lime-200">
      <ul className="flex py-2 max-w-prose m-auto px-2">
        <li className="mr-6">Leo Alho</li>
        <NavBarLink link="/" title="Home" />
        <NavBarLink link="/about" title="About me" />
        <NavBarLink link="/blog" title="Blog" />
        <NavBarLink link="/projects" title="Projects" />
      </ul>
    </div>
  );
};

export default Header;
