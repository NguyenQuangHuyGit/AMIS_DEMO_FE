const clickOutside = {
    mounted(el, binding) {
        el.clickOutside = function (event) {
            if (!el.parentElement.contains(event.target)) {
                binding.value();
            }
        };
        document.addEventListener("click", el.clickOutside);
    },
    unmounted(el) {
        document.removeEventListener("click", el.clickOutside);
    },
};
export default clickOutside;
