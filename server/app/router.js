'use strict';

module.exports = app => {
    const { router, controller, middlewares } = app;
    const wrap = middlewares.wrap();
    // 页面
    router.get('/', controller.home.index);
    // 用户
    router.get('/api/user/login', wrap, controller.user.login);
    router.post('/api/user/update', wrap, controller.user.update);
    // 比赛
    router.post('/api/match/muster', wrap, controller.match.muster);
    router.post('/api/match/edit', wrap, controller.match.edit);
    router.get('/api/match/get', wrap, controller.match.get);
    router.get('/api/match/cancel', wrap, controller.match.cancel);
    router.get('/api/match/join', wrap, controller.match.join);
    router.get('/api/match/isJoined', wrap, controller.match.isJoined);
    router.get('/api/match/regret', wrap, controller.match.regret);
};

/*
. api/userRegister 用户登陆
    .. 接收参数：用户微信id
    .. 服务器操作：写入数据库：user {name, phone, wx_id, join_match, muster_match}
    .. 返回：成功或失败
. api/musterMatch 发起赛事
    .. 接收参数：用户微信id
    .. 服务器操作：写入数据库：
        ... match {match_id: {leader, type, time, max_numbers, position, members} }
        ... user {wx_id, muster_match: [match_id] }
    .. 返回：成功或失败
. api/getMatchInfo 获取赛事报名情况
    .. 接收参数：用户微信id，matchId
    .. 服务器操作：查询数据库
    .. 返回：{match_id, type, time, max_numbers, position, members}
. api/enqueue 报名
    .. 接收参数：用户微信id，matchId
    .. 服务器操作：写入数据库：
        ... match {match_id: {leader, type, time, max_numbers, position, members} }
        ... user {wx_id, join_match: [match_id] }
    .. 返回：成功或失败
* */
