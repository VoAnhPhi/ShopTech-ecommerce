"use client"
import "../styles/globals.css";
import Sidebar from "../components/admin_side/sidebar";

export default function RootLayout({ children, title }: Readonly<{ children: React.ReactNode; title: string }>) {
    return (
        <html lang="en">
            <head>
                <title>{title || "Trang Admin"}</title>
                <script src="https://unpkg.com/@studio-freight/lenis" defer></script>
            </head>
            <body>
                <main>
                    <Sidebar>
                        {children}
                    </Sidebar>
                </main>
            </body>
        </html>
    );
}


