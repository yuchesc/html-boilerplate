'use strict';

window.addEventListener('load', function () {
    new Vue({
        el: '#login',
        data: {
            loginUrl: 'http://localhost:9050/api/v1/login',
            message: '',
            username: '',
            password: ''
        },
        methods: {
            login: function () {
                const payload = {
                    username: this.username,
                    password: this.password
                };
                axios.post(this.loginUrl, payload)
                    .then((res) => {
                        console.log(res);
                        if ((res.status === 200) || (res.status === 204)) {
                            //location.href = 'forms.html';
                        } else {
                            this.message = 'Failed to login.';
                        }
                    })
                    .catch((e) => {
                        this.message = e.message;
                    });
            },
        }
    });
});