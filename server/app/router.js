'use strict';

module.exports = app => {
    const { router, controller, middlewares } = app;
    const wrap = middlewares.wrap();
    const {
        authorizationMiddleware,
        validationMiddleware
    } = middlewares.auth();
    // 页面
    router.get('/', controller.home.index);
    // 用户
    router.get('/api/user/login', wrap, authorizationMiddleware, controller.user.login);
    router.post('/api/user/update', wrap, validationMiddleware, controller.user.update);
    // 比赛
    router.post('/api/match/muster', wrap, validationMiddleware, controller.match.muster);
    router.post('/api/match/edit', wrap, validationMiddleware, controller.match.edit);
    router.get('/api/match/cancel', wrap, validationMiddleware, controller.match.cancel);
    router.get('/api/match/join', wrap, validationMiddleware, controller.match.join);
    router.get('/api/match/regret', wrap, validationMiddleware, controller.match.regret);
    router.get('/api/match/get', wrap, controller.match.get);
};
