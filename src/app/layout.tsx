import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
const inter = Inter({ subsets: ["latin"] });
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
export const metadata: Metadata = {
    title: "QuiteEcho",
    description: "Anonymous messages",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html className="html1" lang="en">
            <AuthProvider>
                <body className={inter.className}>

                    {children}
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
