"use client"
import "./styles/globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import LenisSmoothScroll from "./components/lenis";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <Provider store={store}>
      <html lang="en">
        <head>
          <script src="https://unpkg.com/@studio-freight/lenis" defer></script>
        </head>
        <body>
          <LenisSmoothScroll />
          <Header />
          <main>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </Provider>
  );

}
