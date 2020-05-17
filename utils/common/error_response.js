'use strict';

module.exports = (ctx, code, message) => {
    ctx.status = 200;
    ctx.body = {
        code,
        status: 'error',
        message,
    };
};