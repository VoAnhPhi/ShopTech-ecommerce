// 'use client';
// import { useEffect } from 'react';

// export default function LenisSmoothScroll() {
//     useEffect(() => {
//         const initLenis = () => {
//             if (typeof window !== 'undefined' && window.Lenis) {
//                 const lenis = new window.Lenis({
//                     duration: 0.3,
//                     easing: (t: number) => 1 - Math.pow(1 - t, 3),
//                     mouseMultiplier: 0.05,
//                     touchMultiplier: 0.5,
//                     smooth: true,
//                 });

//                 function raf(time: number) {
//                     lenis.raf(time);
//                     requestAnimationFrame(raf);
//                 }

//                 requestAnimationFrame(raf);
//             } else {
//                 console.warn('Lenis is not available on window. Make sure the CDN script is loaded.');
//             }
//         };

//         initLenis();
//     }, []);

//     return null;
// }
