'use strict';

const api_version = 'v1';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post(`/${api_version}/slice/submit`, controller[api_version].slice.submit);
    router.get(`/${api_version}/slice/get`, controller[api_version].slice.get);
};
