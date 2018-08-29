'use strict';
const {getUserInfoBySessionKey} = require('../tools/wx_login');

/**
 * 统一响应内容格式
 */
module.exports = () => {
    return {
        authorizationMiddleware: async function (ctx, next) {
            const {skey} = ctx.query;
            // 测试模式：直接返回用户数据（模拟微信登陆）
            const userinfo = getUserInfoBySessionKey(skey);
            ctx.state = ctx.state || {};
            ctx.state.$wxInfo = {
                loginState: 1,
                userinfo
            };
            await next();
        },
        validationMiddleware: async function (ctx, next) {
            const {skey} = ctx.query;
            // 测试模式：直接返回用户数据（模拟微信登陆）
            const userinfo = getUserInfoBySessionKey(skey);
            ctx.state = ctx.state || {};
            ctx.state.$wxInfo = {
                loginState: 1,
                userinfo
            };
            await next();
        }
    };
};
