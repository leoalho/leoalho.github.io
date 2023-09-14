import NavBarLink from "./NavbarLink"

const Header = () => {
    return (
        <ul className='flex py-2 bg-lime-200'>
            <li className='mx-6'>
                Leo Alhos homepage
            </li>
            <NavBarLink link="/" title="Home Page" />
            <NavBarLink link="/about" title="About me"/>
            <NavBarLink link="/blog" title="blog"/>
        </ul>)
}

export default Header