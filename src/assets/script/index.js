'use strict';

window.addEventListener('load', function () {
    new Vue({
        el: '#main',
        data: {
            message: 'Hello Vue.',
            counter: 0
        },
        methods: {
            count: function () {
                return ++this.counter;
            },
        }
    });
});