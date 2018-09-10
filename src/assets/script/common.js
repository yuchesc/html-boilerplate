// To use default focus, add 'v-focus' in a tag.
Vue.directive('focus', {
    inserted: function (el) {
        el.focus();
    }
});
