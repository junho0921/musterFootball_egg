'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    async login() {
        const { ctx } = this;
        if (ctx.state.$wxInfo.loginState !== 1) {
            ctx.body = new Error('登陆状态失败');
            return;
        }
        let data = ctx.state.$wxInfo.userinfo;
        const open_id = data.open_id;
        // 维护一套用户信息数据库，区别与微信cSessionInfo数据库
        let userInfo = await ctx.service.user.get({open_id});
        if (!userInfo) {
            userInfo = {
                open_id,
                name: data.name || '默认姓名',
                phone: data.phone,
                last_login_time: Date.now(),
                wx_img: data.wx_img,
                real_name: '',
                join_match: '',
                regret_join_match: '',
                cancel_muster_match: '',
                muster_match: ''
            };
            const ret = await ctx.service.user.add(userInfo);
            if (!ret) {
                ctx.body = new Error('注册用户信息失败');
                return;
            }
        } else {
            userInfo.last_login_time = Date.now();
            ctx.service.user.update(userInfo, {
                where: {open_id}
            });
        }
        data.p_user_info = userInfo;
        // 必须返回auth中间件的数据，这样才能被微信识别skey
        ctx.body = data;
    }

    async update() {
        const { ctx } = this;
        if (ctx.state.$wxInfo.loginState !== 1) {
            ctx.body = new Error('登录态校验失败');
            return;
        }
        const {open_id} = ctx.state.$wxInfo.userinfo;
        const data = ctx.request.body;
        const ret = await ctx.service.user.update({
            phone: data.phone || 888,
            real_name: data.real_name || ''
        }, {
            where: {open_id}
        });
        if (ret) {
            ctx.body = 1;
        } else {
            ctx.body = new Error('保存失败');
        }
    }
}

module.exports = UserController;
