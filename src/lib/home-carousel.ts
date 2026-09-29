export type CarouselEl = {
  hidden: boolean;
  textContent: string | null;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
};

export function syncHomeCarousel(opts: {
  images: CarouselEl[];
  datas: CarouselEl[];
  dots: CarouselEl[];
  counter: CarouselEl | null;
  index: number;
  total: number;
}): number {
  const { images, datas, dots, counter, total } = opts;
  const index = ((opts.index % total) + total) % total;

  images.forEach((img) => {
    img.hidden = Number(img.getAttribute('data-index')) !== index;
  });

  datas.forEach((data) => {
    const isActive = Number(data.getAttribute('data-index')) === index;
    data.hidden = false;
    data.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    if (isActive) {
      data.removeAttribute('inert');
      data.setAttribute('aria-live', 'polite');
    } else {
      data.setAttribute('inert', '');
      data.removeAttribute('aria-live');
    }
  });

  dots.forEach((dot) => {
    const isActive = Number(dot.getAttribute('data-index')) === index;
    if (isActive) dot.setAttribute('aria-current', 'true');
    else dot.removeAttribute('aria-current');
  });
  if (counter) counter.textContent = `${index + 1} / ${total}`;

  return index;
}

export function bindHomeCarousels(root: ParentNode = document): void {
  root.querySelectorAll('[data-carousel]').forEach((node) => {
    const carousel = node as HTMLElement;
    const images = [...carousel.querySelectorAll<HTMLElement>('[data-car-image]')];
    const datas = [...carousel.querySelectorAll<HTMLElement>('[data-car-data]')];
    const dots = [...carousel.querySelectorAll<HTMLElement>('[data-car-dot]')];
    const counter = carousel.querySelector<HTMLElement>('[data-car-counter]');
    const total = images.length;
    if (!total) return;

    let index = 0;
    let timer: ReturnType<typeof setInterval> | null = null;
    let held = false;

    function show(n: number) {
      index = syncHomeCarousel({ images, datas, dots, counter, index: n, total });
    }

    function stopAuto() {
      held = true;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function go(n: number) {
      stopAuto();
      show(n);
    }

    carousel.querySelector('[data-car-prev]')?.addEventListener('click', () => {
      go(index - 1);
    });
    carousel.querySelector('[data-car-next]')?.addEventListener('click', () => {
      go(index + 1);
    });
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        go(Number(dot.getAttribute('data-index')));
      });
    });

    try {
      const reduced =
        typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        timer = setInterval(() => {
          if (!held) show(index + 1);
        }, 7000);
      }
    } catch {
      // No auto-advance — the arrows and dots still work.
    }
  });
}
