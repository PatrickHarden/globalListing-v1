const noop = () => {};

function scrollToTop(scrollContainer, scrollTo, duration = 100, cb = noop, tick = 15) {
    const queue = [];
    const start = scrollContainer.scrollTop;
    const difference = scrollTo - start;

    if (duration === 0 || difference === 0 || tick > duration) {
        // silly
        scrollContainer.scrollTop = scrollTo;
        return cb();
    }

    const ticks = duration / tick;
    const perTick = difference / ticks;

    for (let i = 1; i <= ticks; i++) {
        queue.push(start + (i * perTick));
    }

    const interval = setInterval(() => {
        scrollContainer.scrollTop = queue.shift();
        if (!queue.length) {
            scrollContainer.scrollTop = scrollTo;
            clearInterval(interval);
            cb();
        }
    }, tick);
}

module.exports = scrollToTop;
