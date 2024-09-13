const clickOutsideVer2 = {
    mounted(el, binding) {
        el.clickOutside = function (event) {
            if (!el.parentElement.contains(event.target)) {
                binding.value();
            }
        };
        document.addEventListener("mousedown", el.clickOutside);
    },
    unmounted(el) {
        document.removeEventListener("mousedown", el.clickOutside);
    },
};
export default clickOutsideVer2;
