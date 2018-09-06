'use strict';

window.addEventListener('load', function () {
    Vue.directive('focus', {
        inserted: function (el) {
            el.focus();
        }
    });
    new Vue({
        el: '#forms',
        data: {
            options: [
                {key: 1, value: 'option 1'},
                {key: 2, value: 'option 2'},
                {key: 3, value: 'option 3'}
                ],
            username: 'hello',
            password: '',
            toggle: true,
            check: true,
            radio: 'B',
            select: '',
            textarea: 'hello\nworld'
        },
        methods: {
        }
    });
});