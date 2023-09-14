import Link from 'next/link';

const Header = () => {
    return (<div>
        <Link href="/">Main page</Link>
        <Link href="/blog">Blog</Link>
    </div>)
}

export default Header