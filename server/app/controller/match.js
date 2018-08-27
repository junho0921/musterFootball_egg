'use strict'

const Controller = require('egg').Controller;

const {max_login_duration, splitWord} = require('../../config/CONST');

class MatchController extends Controller {
    async get() {
        const { ctx, app } = this;
        const query = this.ctx.query;
        let match_id = query.id;
        if (!match_id){
            ctx.body = new Error('参数错误');
            return
        }
        try{
            match_id = JSON.parse(match_id)
        }catch (e){}
        let matchs = await ctx.service.match.find({
            where: {match_id}
        });
        if(!matchs || !matchs.length){
            ctx.body = null;
            return;
        }
        let members_openIds = matchs.reduce((sum, item) => {
            if(item.leader){
                sum = sum.concat(item.leader)
            }
            if(item.members){
                item.members = item.members.split(splitWord)
                sum = sum.concat(item.members)
            }
            return sum
        }, []);
        console.log('match--------', matchs)
        let membersInfo = await ctx.service.user.find({
            columns: ['name', 'wx_img', 'real_name', 'open_id'],
            where: {
                open_id: members_openIds
            }
        });
        matchs.forEach(item => {
            item.leader = Object.assign({}, membersInfo.find(i => i.open_id == item.leader));
            delete item.leader.open_id;
            if(item.members){
                item.members = item.members.map(id => {
                    let info = Object.assign({}, membersInfo.find(i => i.open_id == id));
                    delete info.open_id;
                    return info;
                })
            }
        })
        ctx.body = matchs
    }

    async isJoined() {
        const { ctx } = this
        const res = await this.getMatchUser()
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res;
        ctx.body = matchInfo.members.includes(open_id) ? 1 : 0
    }

    async cancel(){
        const { ctx } = this
        const res = await this.getMatchUser()
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res

        if (matchInfo.leader != open_id){
            ctx.body = new Error('您不是比赛的发起者，不能取消比赛')
            return
        }
        let deleteSuccess = await ctx.service.match.delete({
            match_id
        })
        if (!deleteSuccess){
            ctx.body = new Error('取消失败')
            return
        }
        let newList = userInfo.muster_match.split(splitWord).filter(item => item != match_id)
        userInfo.muster_match = newList.join(splitWord)
        let updateSuccess = await ctx.service.user.update(userInfo, {
            where: {open_id}
        })
        if (!updateSuccess){
            ctx.body = new Error('更新用户信息失败')
            return
        }
        ctx.body = 1
    }

    async getMatchUser () {
        const { ctx, app } = this
        const query = ctx.query
        let match_id = query.id
        let open_id = query.t

        if (!match_id || !open_id){
            ctx.body = new Error('参数错误')
            return
        }

        // 查询当前登录用户信息
        const userInfo = await ctx.service.user.get({open_id})
        if (!userInfo) {
            app.logger.error('获取当前用户信息异常: ' + JSON.stringify(userInfo))
            ctx.body = new Error('请先登陆')
            return
        }

        // 查询比赛信息
        const matchInfo = await ctx.service.match.get({ match_id })
        if (!matchInfo) {
            app.logger.error('获取比赛信息异常: ' + JSON.stringify(matchInfo))
            ctx.body = new Error('无此比赛信息')
            return
        }
        return {match_id, open_id, userInfo, matchInfo}
    }

    async join() {
        const { ctx, app } = this
        const res = await this.getMatchUser()
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res

        // 查询当前用户是否已经报名此比赛
        if (matchInfo.members.includes(userInfo.open_id)) {
            app.logger.error('已经报名')
            ctx.body = new Error('已经报名')
            return
        }

        // 查询当前用户是否队长
        if (matchInfo.leader == open_id) {
            app.logger.error('您是队长，无需报名')
            ctx.body = new Error('您是队长，无需报名')
            return
        }

        // 更新比赛成员信息
        if(matchInfo.members.length > 0){
            matchInfo.members += splitWord
        }
        matchInfo.members += open_id
        console.log('matchInfo', matchInfo)
        const updateMatchSuccess = await ctx.service.match.update(matchInfo, {
            where: {match_id}
        })
        if (!updateMatchSuccess) {
            ctx.body = new Error('抱歉，报名失败')
            return
        }

        // 更新个人报名信息
        if(userInfo.join_match.length > 0){
            userInfo.join_match += splitWord
        }
        userInfo.join_match += match_id
        const updateUserSuccess = await ctx.service.user.update(userInfo, {
            where: {open_id}
        })
        console.log('userInfo', userInfo)
        if (!updateUserSuccess) {
            ctx.body = new Error('更新个人报名信息报错')
            return
        }
        ctx.body = 1
    }

    async regret() {
        const { ctx, app } = this
        const res = await this.getMatchUser()
        if(!res){
            return
        }
        const {match_id, open_id, userInfo, matchInfo} = res

        // 查询当前用户是否队长
        if (matchInfo.leader == open_id) {
            app.logger.error('您是队长，不能取消报名')
            ctx.body = new Error('您是队长，不能取消报名')
            return
        }

        // 查询当前用户是否已经报名此比赛
        if (!matchInfo.members.includes(userInfo.open_id)) {
            app.logger.error('您还没有报名')
            ctx.body = new Error('您还没有报名')
            return
        }

        // 更新比赛成员信息
        matchInfo.members = matchInfo.members.split(splitWord).filter(item => item != open_id).join(splitWord)
        const updateMatchSuccess = await ctx.service.match.update(matchInfo, {
            where: {match_id}
        })
        if (!updateMatchSuccess) {
            ctx.body = new Error('抱歉，取消报名失败')
            return
        }

        // 更新个人报名信息
        userInfo.join_match = userInfo.join_match.split(splitWord).filter(item => item != match_id).join(splitWord)
        const updateUserSuccess = await ctx.service.user.update(userInfo, {
            where: {open_id}
        })
        if (!updateUserSuccess) {
            ctx.body = new Error('更新个人报名信息报错')
            return
        }
        ctx.body = 1
    }

    async muster() {
        const { ctx, app } = this
        const data = ctx.request.body
        console.log('组队信息', data)
        // // 参数校验
        if (!data.openId || !data.date || !data.position) {
            ctx.body = new Error('数据填写有误')
            return
        }

        // 查询当前登录用户信息
        const userInfo = await ctx.service.user.get({open_id: data.openId})
        if (!userInfo) {
            app.logger.error('获取当前用户信息异常: ' + JSON.stringify(userInfo))
            ctx.body = new Error('请先登录')
            return
        }else{
            console.log('=============', userInfo)
            const overLen = Date.now() - userInfo.last_login_time > max_login_duration
            console.log('=============', Date.now() - userInfo.last_login_time)
            if(overLen){
                ctx.body = new Error('登陆超时')
                return
            }
        }

        const match_id = 'mid_' + Date.now()
        const ret = await ctx.service.match.add({
            match_id,
            leader: data.openId,
            type: data.type || 5,
            date: data.date,
            max_numbers: data.maxNumbers || 100,
            position: data.position,
            members: '',
        })
        console.log('存储比赛', ret)
        if (!ret) {
            ctx.body = new Error('服务器失败')
            return
        }
        // 更新个人组队信息
        if(userInfo.muster_match.length > 0){
            userInfo.muster_match += splitWord
        }
        userInfo.muster_match += match_id
        const userRet = await ctx.service.user.update(userInfo, {
            where: {open_id: data.openId}
        })
        if (!userRet) {
            ctx.body = new Error('更新个人组队信息失败')
            return
        }
        ctx.body = 1
    }
}

module.exports = MatchController
