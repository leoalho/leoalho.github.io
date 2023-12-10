import Link from "next/link";

interface Props {
  link: string;
  title: string;
}

const NavBarLink = ({ link, title }: Props) => {
  return (
    <li className="mr-6">
      <Link
        className="text-black hover:text-orange-500 no-underline"
        href={link}
      >
        {title}
      </Link>
    </li>
  );
};

export default NavBarLink;
