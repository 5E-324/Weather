
export function animateHeightChanges(element: HTMLElement) {
    new MutationObserver(() => {
        //element.style.height = `${element.scrollHeight}px`
        let oldHeight = element.offsetHeight;
        element.style.height = "auto";
        let newHeight = element.offsetHeight;
        element.style.height = `${oldHeight}px`;
        setTimeout(() => {
            element.style.transition = "transition: height 300ms";
            element.style.height = `${newHeight}px`;
        }, 0);
        
    }).observe(element, { childList: true });
}
export function animateHeightChangesFlip(element: HTMLElement) {
    let oldHeight = element.offsetHeight;
    new MutationObserver(()=>{
        let newHeight = element.offsetHeight;
        if (newHeight == oldHeight) return;
        element.animate([{ height: `${oldHeight}px` }, { height: `${newHeight}px` }], { duration: 300, easing: "ease" });
        oldHeight = newHeight;
    }).observe(element, { childList: true });
}
export function animateHeightChangesFlip2(element: HTMLElement) {
    let oldHeight = element.offsetHeight;
    new ResizeObserver((_, observer) => {
        let newHeight = element.offsetHeight;
        observer.disconnect();
        let animation = element.animate([{ height: `${oldHeight}px` }, { height: `${newHeight}px` }], { duration: 300, easing: "ease" });
        animation.onfinish = () => {observer.observe(element)};
        oldHeight = newHeight;
    }).observe(element);
}
export const animateLayoutChanges = (e: HTMLElement) => {
    const { width, height } = e.getBoundingClientRect();
    e.style.setProperty('width', `${width}px`);
    e.style.setProperty('height', `${height}px`);
    console.log(width, height);

    const observer = new MutationObserver(() => {
        const { width, height } = e.getBoundingClientRect();
        e.style.removeProperty('width');
        e.style.removeProperty('height');

        const ro1 = new ResizeObserver((_, o1) => {
            o1.disconnect();
            const { width: newWidth, height: newHeight } = e.getBoundingClientRect();
            e.style.setProperty('width', `${width}px`);
            e.style.setProperty('height', `${height}px`);

            const ro2 = new ResizeObserver((_, o2) => {
                o2.disconnect();
                e.style.setProperty('width', `${newWidth}px`);
                e.style.setProperty('height', `${newHeight}px`);
            });
            ro2.observe(e);
        });
        ro1.observe(e);
    });
    observer.observe(e, { childList: true });
};
export function animateHeightChange2(element: HTMLElement) {
    let child = element.firstElementChild;
    if (!child) return;
    
    new ResizeObserver(([{ contentBoxSize: [{ blockSize:height }] }]) => {
        element.style.height = `${height}px`;
    }).observe(child);
}