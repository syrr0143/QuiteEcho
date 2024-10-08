import Navbar from '@/components/Navbar';
import '../globals.css';

const metadata = {
    title: 'Next.js',
    description: 'Generated by Next.js',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className='html3'>
            <div>
                <Navbar />
                {children}
            </div>
        </div>
    )
}
