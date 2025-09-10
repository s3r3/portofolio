
import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import p1 from '../../../public/fadhil-abhimantra-vS7GjQ3lY3M-unsplash.jpg';


// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define the interface for block items
interface ServiceBlock {
  number: string;
  title: string;
  secondTitle: string;
  list: string[];
  img: string;
  text: string;
}

// Custom hook for title animation
const useTitleAnimation = () => {
  useEffect(() => {
    const letters = document.querySelectorAll('.animation-title .letter');
    gsap.fromTo(
      letters,
      { y: '100%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, []);
};

const ServicesSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  useTitleAnimation();

  useEffect(() => {
    gsap.to('.services-block', {
      scrollTrigger: {
        trigger: '.services',
        start: 'top 80%', // Adjusted to start after About section
        scroller: window.innerWidth < 1100 ? '.scroll-container' : undefined,
        toggleActions: 'play none none reset',
      },
      opacity: 1,
      duration: 1.5,
      stagger: 0.1,
    });
  }, []);

  useEffect(() => {
    const checkWidth = () => setIsDesktop(window.innerWidth > 768);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleClick = (i: number) => {
    if (!isDesktop) {
      setActiveIndex(activeIndex === i ? null : i);
    }
  };

  const blocks: ServiceBlock[] = [
    {
      number: '00-1',
      title: 'web design',
      secondTitle: '// web design',
      list: [
        '/ Modern layouts',
        '/ Responsive design',
        '/ SEO-friendly structure',
        '/ Clear navigation',
        '/ Visual storytelling',
      ],
      img: '../../../public/fadhil-abhimantra-vS7GjQ3lY3M-unsplash.jpg',
      text: 'I create websites that stand out from the competition and bring real value to businesses. Each project combines creativity and functionality to deliver the best digital solutions.',
    },
    {
      number: '00-2',
      title: 'UX/UI design',
      secondTitle: '// UX/UI design',
      list: [
        '/ User flows',
        '/ Wireframes & flows',
        '/ Interactive prototypes',
        '/ Design system',
      ],
      img: './img/services-img2.jpg',
      text: 'I design interfaces that balance logic and emotion. They are intuitive from the first click, easy to use, and keep users engaged — helping brands build stronger connections.',
    },
    {
      number: '00-3',
      title: 'Creative design',
      secondTitle: '// Creative design',
      list: ['/ Visual design', '/ Social media design', '/ presentation'],
      img: './img/services-img3.jpg',
      text: 'My creative design is about visuals that speak for the brand. From eye-catching social media and stylish presentations to thoughtful visual concepts — everything is designed to inspire, connect, and deliver the best digital solutions.',
    },
    {
      number: '00-4',
      title: 'product and app design',
      secondTitle: '// product and app design',
      list: [
        '/ Mobile & web apps',
        '/ Design systems',
        '/ Complex interactions',
        '/ Scalable solutions',
      ],
      img: './img/services-img4.jpg',
      text: 'Product and app design focused on simplicity, consistency, and growth — crafted to deliver the best digital solutions.',
    },
    {
      number: '00-5',
      title: 'development',
      secondTitle: '// development',
      list: [
        '/ Front-end',
        '/ Back-end',
        '/ No-code solutions',
        '/ Optimization',
        '/ Support',
      ],
      img: './img/services-img5.jpg',
      text: 'Full-cycle development with the best experts — from front-end to back-end. We deliver turnkey projects that are reliable, scalable, and built to last.',
    },
  ];

  return (
    <section className="services bg-gray-100 py-20 md:py-10 lg:py-16 xl:py-32 relative " id="services">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h2 className="animation-title text-4xl md:text-5xl lg:text-7xl uppercase tracking-tighter font-bold">
            services
          </h2>
          <div className="text-lg md:text-xl lg:text-2xl uppercase tracking-tight font-bold">
            <span>dsgn/4</span>
          </div>
        </div>
      </div>
      <div
        className="mt-10 md:mt-6 border-t-2 border-black flex flex-col md:flex-row"
        onMouseLeave={() => setActiveIndex(null)}
      >
        {blocks.map((block, i) => (
          <div
            key={i}
            className={`services-block group ${!isDesktop ? 'mobile' : ''} p-4 md:p-6 border-r-2 md:border-r-2 border-black md:border-b-0 border-b transition-all duration-800 ease-in-out opacity-0 relative overflow-hidden
              ${isDesktop ? (activeIndex === null ? 'w-96' : activeIndex === i ? 'w-[48rem]' : 'w-80') : (activeIndex === i ? 'max-h-[1000px]' : 'max-h-14 bg-gray-200')}`}
            onMouseEnter={() => isDesktop && setActiveIndex(i)}
            onClick={() => handleClick(i)}
          >
            <div className="absolute bottom-0 left-0 h-0.5 bg-black w-0 group-hover:w-4 transition-all duration-800" />
            <div className="absolute bottom-0 right-0 h-0.5 bg-black w-0 group-hover:w-4 transition-all duration-800" />

            <h4
              className={`font-bold text-lg md:text-xl uppercase tracking-tight mb-6 md:mb-12 transition-all duration-600 ${!isDesktop && activeIndex !== i ? 'opacity-100 inline-block mr-6 -translate-y-1 text-gray-400' : 'opacity-75'}`}
            >
              {block.number}
            </h4>

            <h3
              className={`font-bold text-2xl md:text-3xl uppercase tracking-tight overflow-hidden ${!isDesktop && activeIndex !== i ? 'inline-block translate-y-1' : ''}`}
            >
              <span className={`${isDesktop && activeIndex === i ? '-translate-y-full' : 'translate-y-0'} transition-transform duration-200`}>{block.title}</span>
            </h3>

            <h3 className="absolute top-6 right-6 overflow-hidden">
              <span className={`font-bold text-2xl md:text-3xl uppercase tracking-tight flex items-center ${isDesktop && activeIndex === i ? 'translate-y-0' : '-translate-y-[110%]'} transition-transform duration-600 delay-300`}>
                <span className="mr-6">//</span> {block.title}
              </span>
            </h3>

            <div className="flex justify-between pt-0 md:pt-6">
              <ul className="space-y-2 md:space-y-3">
                {block.list.map((item, idx) => (
                  <li key={idx} className="overflow-hidden">
                    <span className={`font-bold text-base md:text-xl uppercase tracking-tight ${activeIndex === i ? 'translate-y-0' : '-translate-y-full'} transition-transform duration-600 delay-${700 - idx * 50}`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="w-48 h-40 md:w-1/2 overflow-hidden">
                <img
                  src={block.img}
                  alt={block.title}
                  className={`w-full h-full object-cover ${activeIndex === i ? 'scale-100 clip-path-[polygon(0_0,100%_0,100%_100%,0_100%)]' : 'scale-140 clip-path-[polygon(0_0,100%_0,100%_0,0_0)]'} transition-all duration-1300 delay-500`}
                />
              </div>
            </div>

            <p className={`font-mono text-base md:text-lg uppercase tracking-tight mt-6 md:mt-10 ${activeIndex === i ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1500 delay-800 text-center md:text-left`}>
              {block.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;