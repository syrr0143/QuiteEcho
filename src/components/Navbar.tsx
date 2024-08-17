'use client'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <div>
            <nav className='p-4 md:p-6 shadow-md mb-4'>
                <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                    <Link className='text-xl font-bold mb-4 md:mb-0' href="/">
                        QuiteEcho
                    </Link>
                    {
                        session ? (
                            <>
                                <p>Welcome,  {session.user?.username || session.user?.email}</p>
                                <button
                                    className='w-full md:w-auto bg-black text-white p-2 rounded'
                                    onClick={() => signOut({ callbackUrl: 'https://quiteecho.onrender.com/signin' })}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href='/signin'>
                                <button className='w-full md:w-auto bg-black text-white p-2 rounded'>
                                    Signin
                                </button>
                            </Link>
                        )
                    }
                </div>
            </nav>
        </div>
    )
}

export default Navbar
