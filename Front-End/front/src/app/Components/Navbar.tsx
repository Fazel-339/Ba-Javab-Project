import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav>
            <Link href="/Pages/Home">صفحه اصلی&nbsp;</Link>
            <Link href="/Pages/Chat-bot">&nbsp;چت بات&nbsp;</Link>
            <Link href="/Pages/Contact-us">&nbsp;تماس با ما&nbsp;</Link>
            <Link href="/Pages/Ads">&nbsp;رزرو تبلیغات&nbsp;</Link>
            <Link href="/Pages/Signup">&nbsp;ثبت نام&nbsp;</Link>
            <Link href="/Pages/Login">&nbsp;ورود&nbsp;</Link>

        </nav>
    )
}
export default Navbar;