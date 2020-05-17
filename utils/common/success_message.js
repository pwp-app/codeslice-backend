'use strict';

module.exports = (ctx, message, data) => {
    ctx.status = 200;
    ctx.body = {
        code: 200,
        status: 'success',
        message,
        data,
    };
};