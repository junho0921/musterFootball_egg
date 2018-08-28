'use strict';

const Controller = require('egg').Controller;

const {getUserInfo} = require('../tools/wx_login');

class UserController extends Controller {
    async login() {
        const { ctx } = this;
        const {type} = ctx.query;
        const data = getUserInfo(type);
        const open_id = data.openId;
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
        ctx.body = userInfo;
    }

    async update() {
        const { ctx } = this;
        const data = ctx.request.body;
        const open_id = data.open_id;
        if (!open_id) {
            ctx.body = new Error('无登陆信息');
            return;
        }
        const ret = await ctx.service.user.update({
            open_id,
            name: data.name || '默认姓名',
            phone: data.phone || 888,
            real_name: data.real_name || '',
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
