import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import LogoImg from '../../assets/Logo2.png'

const Logo = () => {
    return (
        <Link href={"/"} className='flex items-center gap-1'>
            <Image alt='devInsight-Logo' src={LogoImg} width={40} height={30}></Image>
            <h2 className='text-xl text-neutral font-bold'>Dev<span className='text-primary'>Insight</span></h2>
        </Link>
    );
};

export default Logo;