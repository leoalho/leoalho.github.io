import Link from "next/link";

interface Props {
  link: string;
  title: string;
}

const NavBarLink = ({ link, title }: Props) => {
  return (
    <li className="mr-6">
      <Link className="text-lime-900 hover:text-lime-500" href={link}>
        {title}
      </Link>
    </li>
  );
};

export default NavBarLink;
