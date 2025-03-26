import clsx from "clsx";
import { useRef } from "react";
import { gsap } from "gsap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Reset clipPath to ensure animation restarts
            gsap.set(buttonRef.current, {
                clipPath: `circle(0% at ${x}px ${y}px)`,
                background: "#000000",
            });

            gsap.to(buttonRef.current, {
                clipPath: "circle(150% at 50% 50%)", // Memenuhi seluruh tombol
                background: "#4CAF50",
                duration: 4, // Perpanjang durasi animasi masuk
                ease: "power2.out",
            });
        }
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            gsap.to(buttonRef.current, {
                clipPath: `circle(150% at ${x}px ${y}px)`,
                background: "#4CAF50",
                duration: 0,
            });

            gsap.to(buttonRef.current, {
                clipPath: "circle(0% at 50% 50%)", // Kembali ke ukuran awal
                background: "#000000",
                duration: 0.5,
                ease: "power2.out",
            });
        }
    };

    return (
        <button
            {...rest}
            ref={buttonRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={clsx(
                "btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl btn-soft",
                className
            )}
        >
            {children}
        </button>
    );
}
