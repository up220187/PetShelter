'use client'
import Link from 'next/link';
import React from 'react';

const Sidebar: React.FC = () => {

    return (
        <aside className='w-64 h-screen bg-gray-800 text-white p-4'>
            <nav>
                <ul className='space-y-4'>
                    <li>
                        <Link href={"/"} className="hover:underline">
                        Inicio
                        </Link>
                       
                    </li>
                    <li>
                        <Link href={"/dashboard"} className="hover:underline">
                        Dashboard
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );

};

export default Sidebar;