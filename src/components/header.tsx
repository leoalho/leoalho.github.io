import Link from 'next/link';

const Header = () => {
    return (
        <ul className='flex my-2'>
            <li className='mx-6'>
                Leo Alhos homepage
            </li>
            <li className="mr-6">
                <Link className="text-blue-500 hover:text-blue-800" href="/">Main page</Link>
            </li>
            <li className="mr-6">
            <Link className="text-blue-500 hover:text-blue-800" href="/blog">Blog</Link>
            </li>
        </ul>)
}

export default Header