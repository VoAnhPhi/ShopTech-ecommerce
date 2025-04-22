"use client"
import "../styles/globals.css";
import Sidebar from "../components/admin_side/sidebar";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({ children, title }: Readonly<{ children: React.ReactNode; title: string }>) {
    const router = useRouter();

    useEffect(() => {
        const expiresAtStr = localStorage.getItem('token_expires_at')
        if (!expiresAtStr) return

        const now = Date.now()
        const timeLeft = parseInt(expiresAtStr) - now

        if (timeLeft <= 0) {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            document.cookie = 'role=; path=/; max-age=0' // xoá cookie
            localStorage.clear()
            window.location.href = '/admin/admin-login'
            return
        }
        if (timeLeft > 60000) {
            // Thông báo hết hạn trước 1 phút
            setTimeout(() => {
                toast.warning('Phiên của bạn sắp hết hạn. Vui lòng đăng nhập lại.');
            }, timeLeft - 60000);
        }

        setTimeout(() => {
            toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
            document.cookie = 'role=; path=/; max-age=0'
            localStorage.clear()
            window.location.href = '/admin/admin-login'
        }, timeLeft)
    }, [])

    return (
        <html lang="en">
            <head>
                <title>{title || "Trang Admin"}</title>
                <script src="https://unpkg.com/@studio-freight/lenis" defer></script>
            </head>
            <body>
                <main>
                    <ToastContainer />
                    <Sidebar>
                        {children}
                    </Sidebar>
                </main>
            </body>
        </html>
    );
}


