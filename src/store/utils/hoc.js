// Execute when user stops typing search box
export const debounce = (fn, delay = 500) => {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => { fn.apply(this, args); }, delay);
    }
};