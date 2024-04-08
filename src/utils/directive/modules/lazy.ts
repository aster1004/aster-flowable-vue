import { Directive, DirectiveBinding } from 'vue';

const lazy: Directive = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    const options = {
      root: null, // 默认根元素是视窗
      rootMargin: '0px',
      threshold: 0.1, // 元素可见度达到10%时触发回调
    };

    const callback: IntersectionObserverCallback = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver,
    ) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          // 模拟图片加载
          setTimeout(() => {
            el.src = binding.value; // 设置图片的src属性为绑定的值
            observer.unobserve(el); // 停止观察该元素
          }, 1000);
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);
  },
};

export default lazy;
