'use strict';

window.addEventListener('load', function () {
    new Vue({
        el: '#forms',
        data: {
            options: _.map(_.range(5), (i) => {
                return {key: i, value: `option ${i}`};
            }),
            username: 'hello',
            password: '',
            toggle: true,
            check: true,
            radio: 'B',
            select: '',
            date: '',
            datetime: '',
            textarea: 'hello\nworld'
        },
        methods: {
        }
    });
});