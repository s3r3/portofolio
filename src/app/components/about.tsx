import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Matter from 'matter-js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Constants
const BASE_WIDTH = 1920;
const FONT_FAMILY = '"Sofia Sans Condensed", sans-serif';

// Utility functions
const smoothScrollToId = (id: string) => {
  const scroller = window; // Hanya gunakan window untuk desktop
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

const waitForStableLayout = async () => {
  if (document.readyState !== 'complete') {
    await new Promise((r) => window.addEventListener('load', r, { once: true }));
  }
  if (document.fonts?.ready) {
    await document.fonts.ready;
  } else if (document.fonts?.load) {
    try {
      await document.fonts.load('900 100px "Sofia Sans Condensed"');
    } catch {}
  }
  await new Promise((r: any) => requestAnimationFrame(() => r()));
};

const calculateTextDimensions = (width: number, height: number) => {
  const scale = width / BASE_WIDTH;
  
  const BASE_FONT_SIZE = 170;
  const BASE_CHAR_HEIGHT = 150;
  const BASE_LINE_SPACING = 140;
  const BASE_X_OFFSET = 580;
  const BASE_CHAR_SPACING = -80;
  
  const FONT_SIZE = BASE_FONT_SIZE * scale;
  const CHAR_HEIGHT = BASE_CHAR_HEIGHT * scale;
  const LINE_SPACING = BASE_LINE_SPACING * scale;
  const CHAR_SPACING = BASE_CHAR_SPACING * scale;
  
  const totalTextHeight = LINE_SPACING * lines.length;
  const verticalScale = totalTextHeight > height ? height / totalTextHeight : 1;
  
  return {
    fontSize: FONT_SIZE * verticalScale,
    charHeight: CHAR_HEIGHT * verticalScale,
    lineSpacing: LINE_SPACING * verticalScale,
    charSpacing: CHAR_SPACING * verticalScale,
    xOffset: BASE_X_OFFSET * scale,
    topPadding: 250 * verticalScale, // Tetap pakai nilai desktop
    strengthPower: 0.4, // Hanya untuk desktop
  };
};

// PhysicsText Component
const lines = [
  { text: 'DESIGN', white: true },
  { text: 'IS NOT JUST', white: false },
  { text: 'DECORATION, BUT', white: false },
  { text: 'A TOOL FOR INFLUENCE', white: true },
  { text: 'AND GROWTH.', white: true },
];

const PhysicsText = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const allBodiesRef = useRef<Matter.Body[]>([]);
  const initialPositionsRef = useRef<{x: number, y: number}[]>([]);
  const animTargetsRef = useRef<{x: number, y: number}[]>([]);
  const isAnimatingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  
  useEffect(() => {
    let cleanupFn: (() => void) | null = null;
    let destroyed = false;
    
    const init = async () => {
      await waitForStableLayout();
      if (destroyed) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dimensions = calculateTextDimensions(width, height);
      
      try {
        if (document.fonts?.load) {
          await document.fonts.load(`900 ${Math.max(60, dimensions.fontSize)}px ${FONT_FAMILY}`);
        }
      } catch {}
      
      if (!canvasRef.current) canvasRef.current = document.createElement('canvas');
      const measureCtx = canvasRef.current.getContext('2d');
      if (!measureCtx) return;
      
      measureCtx.font = `900 ${dimensions.fontSize}px ${FONT_FAMILY}`;
      measureCtx.textAlign = 'left';
      measureCtx.textBaseline = 'alphabetic';
      
      const { Engine, Render, World, Bodies, Events, Runner, Body } = Matter;
      const engine = Engine.create({
        positionIterations: 8,
        velocityIterations: 6,
      });
      engineRef.current = engine;
      
      const render = Render.create({
        element: sceneRef.current!,
        engine,
        options: {
          width,
          height,
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          wireframes: false,
          background: '#101010',
        },
      });
      renderRef.current = render;
      
      engine.gravity.y = 3;
      
      // Create boundaries
      const FLOOR_H = Math.max(16, 0.12 * dimensions.charHeight);
      const floorY = height - FLOOR_H / 2; // Pastikan floor di dalam viewport
      const floor = Bodies.rectangle(width / 2, floorY, width * 2, FLOOR_H, {
        isStatic: true,
        restitution: 0,
        friction: 1,
        frictionStatic: 1,
        render: { visible: false },
      });
      
      // Tambahkan ceiling boundary
      const ceiling = Bodies.rectangle(width / 2, -FLOOR_H / 2, width * 2, FLOOR_H, {
        isStatic: true,
        render: { visible: false },
      });
      
      const wallW = 40;
      const leftWall = Bodies.rectangle(-wallW / 2, height / 2, wallW, height * 2, {
        isStatic: true,
        render: { visible: false },
      });
      
      const rightWall = Bodies.rectangle(width + wallW / 2, height / 2, wallW, height * 2, {
        isStatic: true,
        render: { visible: false },
      });
      
      World.add(engine.world, [floor, ceiling, leftWall, rightWall]);
      
      // Create text bodies
      let yOffset = dimensions.topPadding;
      const allBodies: Matter.Body[] = [];
      const initialPositions: {x: number, y: number}[] = [];
      const animTargets: {x: number, y: number}[] = [];
      
      const advance = (text: string, i: number) => measureCtx.measureText(text.slice(0, i)).width;
      const tracking = dimensions.charSpacing * 0.1;
      
      lines.forEach((line) => {
        const text = line.text;
        const chars = [...text];
        const lineStartX = dimensions.xOffset;
        
        chars.forEach((char, i) => {
          const wPrev = advance(text, i);
          const wNext = advance(text, i + 1);
          const charWidth = Math.max(1, wNext - wPrev + tracking);
          const cx = lineStartX + wPrev + tracking * i + charWidth / 2;
          
          const body = Bodies.rectangle(cx, yOffset, charWidth, dimensions.charHeight, {
            restitution: 0.1,
            friction: 0.01,
            frictionAir: 0.01,
            density: 0.0005,
            render: { fillStyle: 'transparent', strokeStyle: 'transparent' },
          });
          
          (body as any).customChar = char;
          (body as any).customColor = line.white ? '#ffffff' : '#a9a9a9';
          Body.setStatic(body, true);
          World.add(engine.world, body);
          
          allBodies.push(body);
          const initPos = { x: body.position.x, y: body.position.y };
          initialPositions.push(initPos);
          animTargets.push({ ...initPos });
        });
        
        yOffset += dimensions.lineSpacing;
      });
      
      allBodiesRef.current = allBodies;
      initialPositionsRef.current = initialPositions;
      animTargetsRef.current = animTargets;
      
      // Render text on canvas
      const afterRender = () => {
        const ctx = render.context;
        allBodiesRef.current.forEach((body) => {
          const { position, angle } = body;
          const customChar = (body as any).customChar;
          const customColor = (body as any).customColor;
          
          ctx.save();
          ctx.translate(position.x, position.y);
          ctx.rotate(angle);
          ctx.fillStyle = customColor;
          ctx.font = `900 ${dimensions.fontSize}px ${FONT_FAMILY}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(customChar, 0, 0);
          ctx.restore();
        });
      };
      
      Events.on(render, 'afterRender', afterRender);
      
      // Animation functions
      const cancelRaf = () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
      
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      
      const reassembleToTargets = () => {
        cancelRaf();
        isAnimatingRef.current = true;
        
        allBodiesRef.current.forEach((b) => {
          Matter.Body.setStatic(b, true);
          Matter.Body.setVelocity(b, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(b, 0);
        });
        
        const step = () => {
          let allClose = true;
          
          allBodiesRef.current.forEach((body, i) => {
            const target = animTargetsRef.current[i];
            const nx = lerp(body.position.x, target.x, 0.18);
            const ny = lerp(body.position.y, target.y, 0.18);
            const na = lerp(body.angle, 0, 0.18);
            
            Matter.Body.setPosition(body, { x: nx, y: ny });
            Matter.Body.setAngle(body, na);
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(body, 0);
            
            if (
              Math.abs(nx - target.x) > 0.3 ||
              Math.abs(ny - target.y) > 0.3 ||
              Math.abs(na) > 0.005
            ) {
              allClose = false;
            }
          });
          
          if (!allClose) {
            rafIdRef.current = requestAnimationFrame(step);
          } else {
            allBodiesRef.current.forEach((b, i) => {
              Matter.Body.setPosition(b, initialPositionsRef.current[i]);
              Matter.Body.setAngle(b, 0);
              Matter.Body.setVelocity(b, { x: 0, y: 0 });
              Matter.Body.setAngularVelocity(b, 0);
            });
            isAnimatingRef.current = false;
            rafIdRef.current = null;
          }
        };
        
        step();
      };
      
      // Mouse interaction
      const handleMouseMove = (e: MouseEvent) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        allBodiesRef.current.forEach((body) => {
          if (body.isStatic) return;
          
          const dx = body.position.x - mouseX;
          const dy = body.position.y - mouseY;
          const d2 = dx * dx + dy * dy;
          
          if (d2 < 120 * 120) {
            const d = Math.sqrt(d2) || 1;
            const strength = dimensions.strengthPower * (1 - d / 400);
            Matter.Body.applyForce(body, body.position, {
              x: (dx / d) * strength,
              y: (dy / d) * strength,
            });
          }
        });
      };
      
      // Start physics engine
      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engine);
      Render.run(render);
      
      // Scroll triggers with adjustments for fading out physics section
      const stBreak = ScrollTrigger.create({
        trigger: '.about-first__wrapper',
        start: 'top -50%',
        end: 'top -150%', // Adjusted end to make it fade out earlier
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          cancelRaf();
          isAnimatingRef.current = false;
          
          allBodiesRef.current.forEach((body, i) => {
            Matter.Body.setStatic(body, true);
            Matter.Body.setPosition(body, initialPositionsRef.current[i]);
            Matter.Body.setAngle(body, 0);
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(body, 0);
          });
          
          setTimeout(() => {
            allBodiesRef.current.forEach((body) => {
              Matter.Body.setStatic(body, false);
              const fx = (Math.random() - 0.5) * 0.02;
              const fy = Math.random() * 0.003;
              Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
            });
          }, 40);
          
          window.addEventListener('mousemove', handleMouseMove);
        },
        onLeave: () => {
          // Fade out the physics text section when leaving downward
          gsap.to('.about-first__wrapper', {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
          });
        },
        onEnterBack: () => {
          // Fade in when entering back
          gsap.to('.about-first__wrapper', {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.in',
          });
        },
        onLeaveBack: () => {
          animTargetsRef.current = initialPositionsRef.current.map((p) => ({ ...p }));
          reassembleToTargets();
          window.removeEventListener('mousemove', handleMouseMove);
        },
      });
      
      const bgTween = gsap.to('.canvas-text__bg', {
        y: 0,
        scrollTrigger: {
          trigger: '.about-first__wrapper',
          start: 'top -150%',
          end: 'top -250%',
          scrub: true,
        },
      });
      
      ScrollTrigger.refresh(true);
      
      // Cleanup function
      cleanupFn = () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        
        try {
          Events.off(render, 'afterRender', afterRender);
        } catch {}
        
        try {
          Render.stop(render);
        } catch {}
        
        if (render?.canvas && render.canvas.parentNode) {
          render.canvas.parentNode.removeChild(render.canvas);
        }
        
        try {
          World.clear(engine.world, false);
        } catch {}
        
        try {
          Matter.Engine.clear(engine);
        } catch {}
        
        if (runnerRef.current) {
          try {
            Runner.stop(runnerRef.current);
          } catch {}
          runnerRef.current = null;
        }
        
        try {
          stBreak.kill();
        } catch {}
        
        try {
          bgTween.kill();
        } catch {}
        
        window.removeEventListener('mousemove', handleMouseMove);
      };
    };
    
    init();
    
    // Handle resize
    let resizeTimer: NodeJS.Timeout;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cleanupFn) cleanupFn();
        init();
      }, 120);
    };
    
    window.addEventListener('resize', onResize);
    
    const lateRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', lateRefresh, { once: true });
    
    return () => {
      destroyed = true;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', lateRefresh);
      if (cleanupFn) cleanupFn();
    };
  }, []);
  
  return (
    <div className="canvas-text absolute top-0 left-0 opacity-100" ref={sceneRef}>
      <div className="canvas-text__bg" />
    </div>
  );
};

// RevealLines Component
const RevealLines = ({ lines = [], className = '' }: { lines: string[], className?: string }) => {
  const innerRefs = useRef<HTMLElement[]>([]);
  
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (innerRefs.current.length === 0) return;
      
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: innerRefs.current[0]?.parentNode?.parentNode as Element,
            start: 'top -150%', // Adjusted start for smoother reveal
            end: 'top -200%',
            scrub: 2,
          },
        });
        
        const reversed = [...innerRefs.current].reverse();
        tl.fromTo(
          reversed,
          { yPercent: -220 },
          { yPercent: 0, stagger: 0.1, ease: 'power2.out' }
        );
      });
      
      ScrollTrigger.refresh();
      return () => ctx.revert();
    });
    
    return () => cancelAnimationFrame(id);
  }, [lines]);
  
  return (
    <>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`reveal-line ${className} block overflow-hidden whitespace-normal`}
        >
          <span
            ref={(el) => {
              if (el) innerRefs.current[i] = el;
            }}
            className="inline-block whitespace-pre-wrap break-words"
          >
            {line}
          </span>
        </span>
      ))}
    </>
  );
};

// useTitleAnimation Hook
const useTitleAnimation = () => {
  useEffect(() => {
    const titles = document.querySelectorAll('.animation-title');
    
    titles.forEach((title) => {
      if (!(title as HTMLElement).dataset.animated) {
        const words = title.textContent?.split(' ') || [];
        title.textContent = '';
        
        words.forEach((word, i) => {
          const wordSpan = document.createElement('span');
          wordSpan.style.display = 'inline-block';
          
          word.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('letter');
            wordSpan.appendChild(span);
          });
          
          title.appendChild(wordSpan);
          if (i < words.length - 1) title.append(' ');
        });
        
        (title as HTMLElement).dataset.animated = 'true';
      }
      
      const letters = title.querySelectorAll('.letter');
      gsap.fromTo(
        letters,
        { y: '-120%' },
        {
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: { each: 0.05, from: 'center' },
          scrollTrigger: {
            trigger: title,
            start: 'top 100%',
            end: 'bottom 30%',
            scrub: 1,
          },
        }
      );
    });
  }, []);
};

// Main About Component
const About = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useTitleAnimation();
  
  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollToId('footer');
  };
  
  useEffect(() => {
    // First section animations with opacity fade for transition
    gsap.to('.about-first-top span', {
      yPercent: 100,
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.about__wrapper',
        start: 'top -100%', // Adjusted for earlier trigger
        end: 'top -150%',
        scrub: 1,
      },
    });
    
    gsap.to('.about-second__top>h4>span', {
      y: 0,
      scrollTrigger: {
        trigger: '.about__wrapper',
        start: 'top -150%',
        end: 'top -200%',
        scrub: 1,
      },
    });
    
    // Image animations
    gsap.to('.text-first__img>img', {
      y: 0,
      scrollTrigger: {
        trigger: '.about__wrapper',
        start: 'top -150%',
        end: 'top -250%',
        scrub: 1,
      },
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      scale: 1,
    });
    
    // Text animations
    const lines = gsap.utils.toArray('.text-first__text-wrapper > span');
    gsap.to(lines.reverse(), {
      y: 0,
      rotate: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__wrapper',
        start: 'top -150%',
        end: 'top -250%',
        scrub: true,
      },
    });
    
    const linesSecond = gsap.utils.toArray('.text-second__text-wrapper > span');
    gsap.to(linesSecond.reverse(), {
      y: 0,
      rotate: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.about__wrapper',
        start: 'top -190%',
        end: 'top -250%',
        scrub: true,
      },
    });
    
    gsap.to('.text-second h3', {
      opacity: 1,
      scrollTrigger: {
        trigger: '.about__wrapper',
        start: 'top -190%',
        end: 'top -250%',
        scrub: 1,
      },
    });
    
    // Desktop-specific animations
    gsap.to('.text-third__img img', {
      scrollTrigger: {
        trigger: '.text-third__img',
        start: 'top -200%',
        end: 'top -270%',
        scrub: 1,
      },
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
      scale: 1,
      stagger: 0.2,
    });
    
    // Refresh ScrollTrigger
    ScrollTrigger.addEventListener("refresh", () => {
      window.scrollTo(0, 0);
    });
    
    ScrollTrigger.refresh();
    
    return () => {
      ScrollTrigger.removeEventListener("refresh", () => {});
    };
  }, []);
  
  return (
    <section className="about mt-[250px] h-[400vh] relative z-[100]" id="about">
      <h2 className="about-title animation-title text-center ml-[140px]">about me</h2>
      
      <div className="about__wrapper bg-[#101010] text-[#aaa8a8] pb-[90px] sticky top-0 left-0 h-screen overflow-hidden" ref={wrapperRef}>
        <div className="container">
          {/* Physics text section */}
          <div className="about-first__wrapper absolute w-full left-0 px-[67px] bg-[#101010]">
            <div className="about-first-top flex justify-between items-center relative z-[11] pt-[100px]">
              <p className="overflow-hidden">
                <span className="inline-block font-bold text-[64px] leading-[99%] tracking-[2%] uppercase text-white">2/5</span>
              </p>
              <p className="overflow-hidden ml-[-625px]">
                <span className="inline-block font-['Spline_Sans_Mono'] font-light text-[24px] leading-[1.3] tracking-[-2%] uppercase text-[#f7f7f7]">for me</span>
              </p>
              <p className="overflow-hidden">
                <span className="inline-block font-bold text-[36px] leading-[1.3] tracking-[-7%] uppercase text-[#f7f7f7]">dsgn/2</span>
              </p>
            </div>
            <div className="about-first-middle">
              <PhysicsText />
            </div>
          </div>
          
          {/* About content sections */}
          <div className="about-second__wrapper">
            {/* Introduction */}
            <div className="about-second__top relative z-[10]">
              <h4 className="overflow-hidden translate-y-[120px]">
                <span className="inline-block font-['Spline_Sans_Mono'] font-light text-[24px] leading-[99%] tracking-[-2%] uppercase text-white transform translate-y-[-100%]">about me</span>
              </h4>
              
              <div className="about-second-text text-first w-max text-center mx-auto mb-[70px] translate-x-[-190px] pt-[150px]">
                <div className="text-first__img mb-[25px] overflow-hidden w-[354px] h-[395px]">
                  <img
                    src="./img/olha3.jpg"
                    alt=""
                    className="w-full h-full scale-[1.3] clip-path-[polygon(0_0,100%_0,100%_0,0_0)] object-cover"
                  />
                </div>
                <p className="text-first__text">
                  <span className="text-first__text-wrapper block overflow-hidden">
                    <span className="block font-['Spline_Sans_Mono'] font-light text-[26px] leading-[1.3] tracking-[-2%] uppercase text-white transform translate-y-[-120%] rotate-[-1deg]">Hello!</span>
                  </span>
                  <span className="text-first__text-wrapper block overflow-hidden">
                    <span className="block font-['Spline_Sans_Mono'] font-light text-[26px] leading-[1.3] tracking-[-2%] uppercase text-white transform translate-y-[-120%] rotate-[-1deg]">I'm Olha Lazarieva</span>
                  </span>
                </p>
              </div>
              
              {/* Experience */}
              <div className="about-second-text text-second w-max text-center mx-auto translate-x-[-60px] pb-[125px]">
                <h3 className="font-['Spline_Sans_Mono'] font-light text-[24px] leading-[99%] tracking-[-2%] uppercase mb-[50px] flex items-center opacity-0">
                  my experience
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="ml-[30px] rotate-90 w-[15px] h-[15px]">
                    <path d="M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </h3>
                <div className="text-second__text">
                  <span className="text-second__text-wrapper block overflow-hidden">
                    <span className="block font-['Spline_Sans_Mono'] font-light text-[26px] leading-[1.3] tracking-[-2%] uppercase text-white transform translate-y-[-120%]">a Senior UX/UI Designer with over 7</span>
                  </span>
                  <span className="text-second__text-wrapper block overflow-hidden">
                    <span className="block font-['Spline_Sans_Mono'] font-light text-[26px] leading-[1.3] tracking-[-2%] uppercase text-white transform translate-y-[-120%]">years of experience in creating digital</span>
                  </span>
                  <span className="text-second__text-wrapper block overflow-hidden">
                    <span className="block font-['Spline_Sans_Mono'] font-light text-[26px] leading-[1.3] tracking-[-2%] uppercase text-white transform translate-y-[-120%]">products for international companies.</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Philosophy */}
            <div className="about-second-title border-t border-[#aaa8a8] pt-[110px] relative z-[100]">
              <h2 className="font-['Spline_Sans_Mono'] font-light text-[80px] leading-[99%] tracking-[2px] uppercase">
                It's not just a<br />
                profession &thinsp; - &thinsp; it's a way
                <br />
                of thinking.
              </h2>
            </div>
            
            {/* Work description */}
            <div className="about-second-text text-first abs-t w-max">
              <RevealLines
                lines={[
                  'My work is part of my lifestyle. As',
                  'a UX/UI designer, I am constantly',
                  'observing the world: I notice how',
                  'people interact with space,',
                  'technology, objects.',
                ]}
              />
            </div>
            
            {/* Philosophy details */}
            <div className="about-second-text text-second ast-s w-max text-center ml-auto mr-[140px] mt-[60px]">
              <h3 className="font-['Spline_Sans_Mono'] font-light text-[24px] leading-[99%] tracking-[-2%] uppercase mb-[62px] flex items-center">
                my philosophy
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="ml-[30px] rotate-90 w-[15px] h-[15px]">
                  <path d="M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </h3>
              <RevealLines
                lines={[
                  'I value clarity, meaning, and',
                  'functionality — both in design and in',
                  'life. I am close to the idea of',
                  'conscious minimalism: leaving only what',
                  'makes sense and works for results.',
                  'I love simple interfaces with deep',
                  'meaning — as well as simple things that',
                  'bring true pleasure.',
                ]}
              />
            </div>
            
            {/* Lifestyle section */}
            <div className="about-second-text text-third w-max text-center mr-0 mt-[130px]">
              <div className="text-third__wrapper flex">
                <div className="text-third__img overflow-hidden w-[253px] h-[283px] mr-[64px]">
                  <img src="./img/olha.jpg" alt="" className="w-full h-full object-cover scale-[1.5] clip-path-[polygon(0_0,100%_0,100%_0,0_0)]" />
                </div>
                <div className="text-third__img overflow-hidden w-[206px] h-[354px] mr-[275px]">
                  <img src="./img/olha2.jpg" alt="" className="w-full h-full object-cover scale-[1.5] clip-path-[polygon(0_0,100%_0,100%_0,0_0)]" />
                </div>
                
                <div className="text-third__title">
                  <h3 className="font-['Spline_Sans_Mono'] font-light text-[24px] leading-[99%] tracking-[-2%] uppercase mb-[62px] flex items-center">
                    my lifestyle
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="ml-[30px] rotate-90 w-[15px] h-[15px]">
                      <path d="M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </h3>
                  <RevealLines
                    lines={[
                      'I look for aesthetics everywhere:',
                      'in the forms of nature, in the',
                      'details of architecture, in the',
                      'colors of city streets, and even',
                      'in the simple things of everyday.',
                      'life. It`s not just a hobby - ',
                      "it's a way of seeing the world.",
                    ]}
                  />
                </div>
              </div>
            </div>
            
            {/* Contact section */}
            <div className="about-second-text text-four flex mr-0">
              <a
                href="#footer"
                onClick={handleContactClick}
                className="link-line about-link font-['Spline_Sans_Mono'] font-normal text-[26px] text-white mr-[230px] h-fit relative flex items-center"
              >
                lets contact
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none" className="ml-[30px] rotate-0 w-[15px] h-[15px]">
                  <path d="M1.81213 19.1203L19.4395 1.43779M5.76584 1.24781L19.6484 1.2279L19.6922 15.1104" stroke="#aaaaaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p>
                <RevealLines
                  lines={[
                    'Every project for me is more than',
                    "a task. It's a story that I help",
                    'tell through design.',
                    'I believe that a good interface',
                    'is not just about colors and',
                    'fonts, but about the feelings it',
                    'evokes.',
                  ]}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;