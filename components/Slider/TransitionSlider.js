import gsap from 'gsap';
import { Draggable } from 'gsap/all';
import { useEffect, useRef } from 'react';
gsap.registerPlugin(Draggable);

import './styles.css'; // Import your CSS file

const TransitionSlider = () => {
  const overflowRef = useRef(null);
  const viewportRef = useRef(null);
  const wrapperRef = useRef(null);
  const boxesRef = useRef(null);
  const proxyRef = useRef(null);

  useEffect(() => {
    proxyRef.current = document.createElement('div');
    const overflow = overflowRef.current;
    const viewport = viewportRef.current;
    const wrapper = wrapperRef.current;
    const boxes = boxesRef.current;
    const proxy = proxyRef.current;
    const images = [
      '/blogo-1.jpg',
      '/blogo-2.jpg',
      '/blogo-3.svg',
      '/blogo-4.png',
      '/blogo-5.png',
    ];
    let direction = 'to-left'; // Initial direction
    let directionVal = direction === 'to-left' ? -1 : 1;
    const numBoxes = images.length;
    const boxWidth = 340;
    const boxHeight = 200;
    const imgWidth = boxWidth - 6;
    const imgHeight = boxHeight - 14;
    let viewWidth = viewport.offsetWidth;
    const wrapWidth = numBoxes * boxWidth;
    const wrapVal = gsap.utils.wrap(0, wrapWidth);
    const wrapProgress = gsap.utils.wrap(0, 1);

    gsap.set([wrapper, viewport], { height: boxHeight, xPercent: -10 });
    gsap.set(boxes, { left: -boxWidth });

    // Create boxes and set initial positions
    for (let i = 0; i < images.length; i++) {
      const src = images[i];

      // const num = document.createElement('div');
      // num.className = 'num';
      // num.innerText = '';

      const img = document.createElement('img');
      img.src = src;
      img.className = 'object-contain w-auto';
      img.width = imgWidth;
      img.height = imgHeight;

      const box = document.createElement('div');
      box.className = 'box';

      box.appendChild(img);
      // box.appendChild(num);

      boxes.appendChild(box);

      gsap.set(box, { x: i * boxWidth, width: boxWidth, height: boxHeight });
    }

    const stringX = directionVal === -1 ? `-=${wrapWidth}` : `+=${wrapWidth}`;

    const animation = gsap.to('.box', {
      repeat: -1,
      duration: 20,
      x: stringX,
      ease: 'none',
      paused: true,
      modifiers: {
        x: function (x, target) {
          if (directionVal === -1) {
            x = ((parseInt(x) - wrapWidth) % wrapWidth) + wrapWidth;
          } else {
            x = parseInt(x) % wrapWidth;
          }
          target.style.visibility =
            x - boxWidth > viewWidth ? 'hidden' : 'visible';
          return `${x}px`;
        },
      },
    });

    Draggable.create(proxy, {
      type: 'x',
      trigger: wrapper,
      inertia: true,
      onDrag: updateProgress,
      onThrowUpdate: updateProgress,
    });

    function updateProgress() {
      let newDirection = 'to-' + this.getDirection(); // "to-left" | "to-right"
      if (direction !== newDirection) {
        let currentTimeScale = animation.timeScale();
        let newTimeScale = currentTimeScale * -1;
        animation.timeScale(newTimeScale);
      }
      const dragValue = wrapVal(this.deltaX * directionVal) / wrapWidth;
      const currentProgressAnim = animation.progress();
      const endProgress = wrapProgress(currentProgressAnim + dragValue);
      animation.progress(endProgress);
    }

    function resize() {
      viewWidth = viewport.offsetWidth;
      animation.render(animation.time(), false, true);
    }

    function applyOverflow() {
      if (overflow.checked) {
        gsap.set(wrapper, { overflow: 'visible' });
      } else {
        gsap.set(wrapper, { overflow: 'hidden' });
      }
    }

    // overflow.addEventListener('change', applyOverflow);
    window.addEventListener('resize', resize);

    wrapper.addEventListener('mouseenter', () => animation.pause());
    wrapper.addEventListener('mouseleave', () => animation.play());

    // AUTOPLAY
    animation.play();

    // Cleanup event listeners on component unmount
    return () => {
      // overflow.removeEventListener('change', applyOverflow);
      window.removeEventListener('resize', resize);
      wrapper.removeEventListener('mouseenter', () => animation.pause());
      wrapper.removeEventListener('mouseleave', () => animation.play());
    };
  }, []);

  return (
    <>
      <div className="nav">
        {/* <label>
          <input type="checkbox" ref={overflowRef} name="overflow" id="overflow" value="1" /> Show overflow
        </label> */}
      </div>

      <div className="wrapper w-full " ref={wrapperRef}>
        <div className="boxes" ref={boxesRef}></div>
      </div>

      <div className="viewport" ref={viewportRef}></div>
    </>
  );
};

export default TransitionSlider;
