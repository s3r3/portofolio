import { useEffect, useState, useRef, createContext, useContext } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Copy Context
interface CopyContextType {
  isActive: boolean;
  cursor: { x: number; y: number };
  copy: (text: string, e: React.MouseEvent) => void;
}

const CopyContext = createContext<CopyContextType | undefined>(undefined);

export const useCopy = () => {
  const context = useContext(CopyContext);
  if (!context) {
    throw new Error('useCopy must be used within a CopyProvider');
  }
  return context;
};

export const CopyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const copy = (text: string, e: React.MouseEvent) => {
    navigator.clipboard.writeText(text).then(() => {
      setCursor({ x: e.clientX, y: e.clientY });
      setIsActive(true);
      setTimeout(() => setIsActive(false), 3000);
    });
  };

  return (
    <CopyContext.Provider value={{ isActive, cursor, copy }}>
      {children}
    </CopyContext.Provider>
  );
};

// Time Component
const Time: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const kyivTime = now.toLocaleTimeString('uk-UA', {
        timeZone: 'Europe/Kyiv',
        hour: '2-digit',
        minute: '2-digit',
      });
      setTime(kyivTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex font-mono text-[0.875rem] leading-[99%] tracking-[-0.02] uppercase text-gray-600 max-[1100px]:text-[0.625rem] max-[380px]:text-[0.5rem]">
      <h2 className="mr-[0.3125rem] max-[768px]:text-[0.625rem] max-[380px]:text-[0.5rem]">kyiv, Ukraine:</h2>
      <p>(GMT+3) {time}</p>
    </div>
  );
};

// AnimatedLink Component
interface AnimatedLinkProps {
  text: string;
  to?: string;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  target?: '_blank' | undefined;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({ text, to = '/', className = '', onClick, target }) => {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = linkRef.current;
    if (!el) return;

    const topSpans = el.querySelectorAll('.original span');
    const bottomSpans = el.querySelectorAll('.clone span');
    const isLargeScreen = () => window.innerWidth > 1100;

    const enter = () => {
      if (!isLargeScreen()) return;
      gsap.to(topSpans, {
        yPercent: -100,
        stagger: { each: 0.02, from: 'end' },
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(bottomSpans, {
        yPercent: -100,
        stagger: { each: 0.02, from: 'end' },
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    const leave = () => {
      if (!isLargeScreen()) return;
      gsap.to(topSpans, {
        yPercent: 0,
        stagger: { each: 0.02, from: 'end' },
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(bottomSpans, {
        yPercent: 100,
        stagger: { each: 0.02, from: 'end' },
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  const letters = text.split('');

  const content = (
    <>
      <span className="original">
        {letters.map((c, i) => (
          <span key={`t-${i}`}>{c === ' ' ? '\u00A0' : c}</span>
        ))}
      </span>
      <span className="clone" aria-hidden="true">
        {letters.map((c, i) => (
          <span key={`b-${i}`}>{c === ' ' ? '\u00A0' : c}</span>
        ))}
      </span>
    </>
  );

  if (target) {
    return (
      <a
        href={to}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`relative inline-block ${className} after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[0.125rem] after:bg-black after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-[0.8s] after:ease-[var(--transition-main)] hover:after:scale-x-100 hover:after:origin-left group-hover:after:origin-right`}
        ref={linkRef}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={to}
      className={`relative inline-block ${className} after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[0.125rem] after:bg-black after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-[0.8s] after:ease-[var(--transition-main)] hover:after:scale-x-100 hover:after:origin-left group-hover:after:origin-right`}
      ref={linkRef}
      onClick={onClick}
    >
      {content}
    </Link>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const { copy } = useCopy();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    copy('olha.lazarieva.0304@gmail.com', e);
  };

  const smoothScrollToId = (id: string) => {
    const scroller = window.innerWidth < 1100 ? document.querySelector('.scroll-container') : window;
    const target = document.getElementById(id);
    if (!target) return;

    const headerEl = document.querySelector('.header');
    const offsetY = headerEl ? headerEl.clientHeight : 0;

    gsap.to(scroller, {
      duration: 0.8,
      ease: 'power3.out',
      scrollTo: { y: target, offsetY, autoKill: true },
      overwrite: 'auto',
    });
  };

  const handleAnchor = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (router.asPath === '/') {
      smoothScrollToId(id);
    } else {
      sessionStorage.setItem('pendingAnchor', id);
      router.push(`/#${id}`);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      '.footer-title span',
      { yPercent: 150 },
      {
        yPercent: 0,
        ease: 'power2.out',
        stagger: { each: 0.03, from: 'center' },
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 30%',
          end: 'bottom bottom',
          scrub: 5,
          scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
        },
      }
    );

    gsap.to('.footer-behance', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 30%',
        scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
      },
      opacity: 1,
      duration: 1.5,
    });

    gsap.to('.footer-reserved', {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 30%',
        scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
      },
      opacity: 1,
      delay: 0.8,
      duration: 1.5,
    });
  }, []);

  return (
    <footer className="footer pt-[1.5rem] pb-[0.75rem] max-[1100px]:pt-0 max-[1100px]:pb-[0.5rem] relative" id="footer">
      <div className="container mx-auto px-4">
        <div className="footer__wrapper max-[768px]:flex max-[768px]:flex-col">
          <a
            href="tel:+380964683171"
            className="footer-phone font-bold text-[1.5rem] leading-[99%] tracking-[0.02] lowercase block w-max ml-auto max-[1100px]:text-[1.25rem] max-[768px]:order-2 max-[768px]:mx-auto max-[768px]:mb-[0.5rem] max-[768px]:text-[1.125rem] relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[0.125rem] after:bg-black after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-[0.8s] after:ease-[var(--transition-main)] hover:after:scale-x-100 hover:after:origin-left group-hover:after:origin-right"
          >
            +38 096 468 31 71
          </a>

          <a
            href="mailto:olha.lazarieva.0304@gmail.com"
            className="footer-email font-bold text-[1.5rem] leading-[99%] tracking-[0.02] lowercase block w-max ml-auto max-[1100px]:text-[1.25rem] max-[768px]:order-3 max-[768px]:mx-auto max-[768px]:text-[1rem] max-[768px]:mb-[1.5rem] max-[350px]:text-[0.875rem] relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[0.125rem] after:bg-black after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-[0.8s] after:ease-[var(--transition-main)] hover:after:scale-x-100 hover:after:origin-left group-hover:after:origin-right"
            onClick={handleClick}
          >
            olha.lazarieva.0304@gmail.com
          </a>

          <div className="footer__social flex justify-end mt-[1rem] max-[1100px]:mt-[0.75rem] max-[768px]:order-4 max-[768px]:flex-col max-[768px]:items-center">
            {[
              { href: 'https://www.instagram.com/olha.lazarieva?igsh=MXMzYTM4azFvd3gwNA%3D%3D&utm_source=qr', text: 'instagram' },
              { href: 'https://t.me/ola_la0304', text: 'telegram' },
              { href: 'https://www.facebook.com/olha.lazarieva', text: 'facebook' },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                className="flex items-center font-mono font-normal text-[1rem] leading-[99%] tracking-[-0.02] uppercase mr-[2rem] max-[1100px]:text-[0.75rem] max-[1100px]:mr-[1.5rem] max-[768px]:mr-0 max-[768px]:mb-[0.75rem] max-[768px]:text-[0.875rem] max-[768px]:pb-0 last:mr-0 last:max-[768px]:mb-0 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[0.125rem] after:bg-black after:transform after:scale-x-0 after:origin-left after:transition-transform after:duration-[0.8s] after:ease-[var(--transition-main)] hover:after:scale-x-100 hover:after:origin-left group-hover:after:origin-right"
              >
                {social.text}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 21 21"
                  fill="none"
                  className="ml-1"
                >
                  <path
                    d="M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104"
                    stroke="#101010"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ))}
          </div>

          <div className="footer-pages-location flex justify-between items-end max-[768px]:order-5 max-[768px]:flex-col-reverse max-[768px]:items-center max-[768px]:mt-[1.5rem] max-[768px]:text-center">
            <div className="footer-pages max-[768px]:flex max-[768px]:justify-between max-[768px]:w-full max-[768px]:mt-[1.5rem]">
              {['about me', 'services', 'works'].map((text, index) => (
                <AnimatedLink
                  key={index}
                  text={text}
                  onClick={(e: React.MouseEvent) => handleAnchor(e, text.replace(' ', ''))}
                  to="/"
                  className="font-mono font-normal text-[1rem] leading-[99%] tracking-[-0.03125rem] uppercase mb-[0.75rem] block w-max max-[1100px]:text-[0.875rem] max-[1100px]:tracking-[-0.015625rem] max-[1100px]:mb-[0.5rem] max-[1100px]:flex max-[1100px]:items-center max-[768px]:px-[0.75rem] max-[768px]:mb-0 max-[430px]:text-[0.875rem] max-[360px]:text-[0.75rem]"
                />
              ))}
            </div>

            <div className="footer-location">
              <p className="font-mono font-normal text-[0.875rem] leading-[99%] capitalize text-gray-600 max-[1100px]:text-[0.625rem] max-[768px]:mb-[0.5rem]">
                Address:
              </p>
              <p className="font-mono font-normal text-[0.875rem] leading-[99%] capitalize text-gray-600 max-[1100px]:text-[0.625rem]">
                14 Bohdana Khmelnytskoho street
                <br />
                kyiv, Ukraine
              </p>
            </div>
          </div>

          <div className="footer-behance flex justify-between mt-[1.5rem] max-[1100px]:opacity-100 max-[1100px]:mt-[1rem] max-[768px]:order-1 max-[768px]:flex-col max-[768px]:items-center max-[768px]:mt-0 max-[768px]:mb-[2rem]">
            {[
              { text: 'dribbble', to: 'https://dribbble.com/Lazarieva_Olha' },
              { text: 'behance', to: 'https://www.behance.net/lastochka659e2d' },
              { text: 'linkedin', to: 'https://www.linkedin.com/in/olha-lazarieva-7515b4164/' },
            ].map((link, index) => (
              <AnimatedLink
                key={index}
                text={link.text}
                to={link.to}
                target="_blank"
                className={`max-[1100px]:text-[0.75rem] max-[768px]:text-[0.875rem] max-[768px]:mb-[0.75rem] max-[768px]:w-max last:max-[768px]:mb-0 ${index === 0 ? 'ml-[-0.5rem]' : ''} ${index === 2 ? 'mr-[-0.5rem]' : ''}`}
              />
            ))}
          </div>

          <h2 className="footer-title mt-[0.75rem] overflow-hidden max-[1100px]:mt-[0.5rem] max-[1100px]:mb-[0.5rem] max-[768px]:order-6">
            {'olha lazarieva'.split('').map((char, i) => (
              <span
                key={i}
                className={`font-sofia font-bold text-[2rem] leading-[99%] tracking-[-0.125rem] uppercase inline-block max-[1100px]:text-[1.875rem] max-[500px]:text-[1.75rem] max-[380px]:text-[1.625rem] ${i === 0 ? 'ml-[-0.5rem] max-[1100px]:ml-0' : ''} ${i === 5 ? 'mx-[0.75rem] max-[380px]:mx-[1rem]' : ''}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h2>

          <div className="footer-reserved flex justify-between items-center max-[1100px]:opacity-100 max-[768px]:order-7 max-[768px]:items-start">
            <div className="footer-reserved__time">
              <Time />
            </div>
            <a
              href="http://max-milkin.com.ua"
              className="footer-reserved__dev font-mono font-normal text-[0.875rem] leading-[99%] tracking-[-0.02] uppercase ml-[5rem] pr-[2rem] relative overflow-hidden max-[1100px]:text-[0.75rem] max-[1100px]:ml-[3rem] max-[768px]:ml-0 max-[768px]:text-[0.625rem] max-[768px]:absolute max-[768px]:bottom-[0.5rem] max-[768px]:left-[0.5rem] max-[768px]:z-10 after:content-['Max_Milkin'] after:absolute after:top-full after:right-0 after:transition-[top_0.6s_var(--transition-main)] hover:after:top-0"
              target="_blank"
              rel="noreferrer"
            >
              development -{' '}
              <span className="inline-block transition-transform duration-[0.6s] ease-[var(--transition-main)] hover:-translate-y-full">
                M
              </span>
              <span className="inline-block transition-transform duration-[0.6s] ease-[var(--transition-main)] hover:-translate-y-full">
                M
              </span>
            </a>
            <div className="footer-reserved__reserved font-mono font-normal text-[0.75rem] leading-[99%] capitalize text-gray-600 max-[1100px]:text-[0.5rem] max-[1100px]:leading-[1.2] max-[380px]:text-[0.4375rem]">
              © All right reserved.
              <br />
              2025 OlhaLazarieva
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;