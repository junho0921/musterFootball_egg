let pageMatchId = location.hash.match(/matchId=(\w+)/);
let EVENT = {};
const app = {
    // 页面的比赛信息
    match: null,
    matchId: pageMatchId && pageMatchId[1],
    userType: undefined,
    // 用户信息
    user:{},
    // 初始化
    init: () => {
        app.loadMatchInfo();
        app.bindEvent();
    },
    loadMatchInfo: () => {
        if(!app.matchId){
            return;
        }
        $('#joinMatchPanel').show();
        REQ.getMatchInfo(app.matchId).then(result => {
            let matchInfo = result.data && result.data[0];
            if(matchInfo){
                app.match = matchInfo;
                $('#matchDetail').html(renderMatchInfo(matchInfo));
            }
        })
    },
    bindEvent: () => {
        Object.keys(EVENT).forEach(key => EVENT[key]());
    },
    hidePopWin: function () {
        $('#popWin .content').empty();
        $('#popWin').hide();
    },
    popMatchFormWin: function (onSubmit, matchInfo) {
        $('#popWin .content')
            .html(renderMatchForm(matchInfo))
            .css('display', 'flex');
        $('#popWin').css('display', 'flex');
        EVENT.submitMatch(onSubmit, matchInfo || {});
    },
    popUserFormWin: function () {
        if(!app.user.open_id){
            return alert('还没有登陆');
        }
        $('#popWin .content')
            .html(renderUserForm(app.user))
            .css('display', 'flex');
        $('#popWin').css('display', 'flex');
        EVENT.updateInfo();
    },
    getUserInfo: () => REQ.getInfo(app.userType).then((result) => {
        if(failMsg(result)){
            return alert(failMsg(result));
        }
        app.user = result.data;
        $('.name').text(app.user.name + '，欢迎你');
        return result && result.data.muster_match;
    }).then(matchs => {
        if(matchs){
            REQ.getMatchInfo(matchs).then((result) => {
                if(failMsg(result)){
                    return;
                }
                if(result && result.data){
                    app.muster_match = result.data;
                    $('#matchDetailList').html(
                        renderMatchList(result.data)
                    ).show();
                    EVENT.editMatch();
                }
            });
        }else{
            $('#matchDetailList').html('').hide();
        }
    })
};
// 弹窗
EVENT.popWinMask = () =>
    $(`#popWin .mask`).click(app.hidePopWin);
// 登陆
EVENT.login = () =>
    $('.login').click((e) => {
        app.userType = $(e.target).data('type');
        app.getUserInfo().then(() => {
            if(app.matchId){
                REQ.getUserIsJoinedMatch(app.matchId, app.user.open_id).then(result => {
                    if(failMsg(result)){
                        return alert(failMsg(result));
                    }
                    let isJoined = result && !!result.data;
                    $('.joinMatch').toggle(!isJoined);
                    $('.cancelJoinMatch').toggle(isJoined);
                })
            }
        });
    });
// 更新用户信息
EVENT.editUserInfo = () =>
    $('#editUserInfo').click(app.popUserFormWin);
EVENT.updateInfo = () =>
    $('#update').click(() => {
        let phone = $('#phone').val() || app.user.phone;
        let real_name = $('#realName').val() || app.user.phone;
        REQ.updateInfo(Object.assign({}, app.user, {
            phone,
            real_name
        })).then((result) => {
            if(failMsg(result)){
                return alert(failMsg(result));
            }
            app.getUserInfo();
            app.hidePopWin();
        });
    });
// 发起比赛
EVENT.muster = () =>
    $('#musterMatch').click(function () {
        app.popMatchFormWin(function (data) {
            REQ.musterMatch(data).then((result) => {
                if(failMsg(result)){
                    return alert(failMsg(result));
                }
                app.getUserInfo();
                app.hidePopWin();
            });
        });
    });
// 编辑比赛
EVENT.editMatch = () =>
    $('.editMatch').click(function (e) {
        let match_id = $(e.target).data('match');
        let originalInfo = app.muster_match.find(i => i.match_id == match_id);
        if(!originalInfo){
            return alert('比赛信息错误');
        }
        app.popMatchFormWin(function (data) {
            data.match_id = originalInfo.match_id;
            REQ.editMatch(data).then((result) => {
                if(failMsg(result)){
                    return alert(failMsg(result));
                }
                app.getUserInfo();
                app.hidePopWin();
            });
        }, originalInfo);
    });
// 提交比赛表格
EVENT.submitMatch = (onSubmit, matchInfo) =>
    $('.matchForm').on('click', '.muster', (e) => {
        $form = $(e.delegateTarget);
        if(!app.user.open_id){
            return alert('请登录');
        }
        let type = $form.find('[name=matchType]:checked').val() || matchInfo.type;
        let position = $form.find('#position').val() || matchInfo.position;
        let date = $form.find('#matchDate').val() || matchInfo.date;
        let maxNumbers = $form.find('#maxNumbers').val() || matchInfo.max_numbers;
        let data = {
            openId: app.user.open_id,
            type,
            maxNumbers,
            position,
            date
        };
        console.log('data', data);
        onSubmit(data);
    });
// 提交比赛表格
EVENT.deleteMatch = () =>
    $('#matchDetailList').on('click', '.deleteMatch', function (e) {
        if(!app.user.open_id){
            return alert('未登陆');
        }
        let $e = $(e.target);
        let matchId = $e.data('match');
        if(matchId){
            console.log('删除', matchId);
            return REQ.cancelMatch(matchId, app.user.open_id).then(result => {
                if(failMsg(result)){
                    return alert(failMsg(result));
                }
                if(result.data === 1){
                    $e.parents('.matchItem').remove();
                }
            });
        }
    });
// 分享比赛
EVENT.shareMatch = () =>
    $('#matchDetailList').on('click', '.shareMatch', function (e) {
        if(!app.user.open_id){
            return alert('未登陆');
        }
        let $e = $(e.target);
        let matchId = $e.data('match');
        if(matchId){
            window.location.hash = `matchId=${matchId}`;
            window.location.reload();
        }
    });
// 报名比赛
EVENT.joinMatch = () =>
    $('.joinMatch').click(function (e) {
        if(!app.user.open_id){
            return alert('请先登陆');
        }
        if(app.matchId){
            REQ.joinMatch(app.matchId, app.user.open_id)
                .then(result => {
                    if(failMsg(result)){
                        return alert(failMsg(result));
                    }
                    if(result.data === 1){
                        $('.joinMatch').hide();
                        $('.cancelJoinMatch').show();
                        app.loadMatchInfo();
                    }
                });
        }
    });
// 取消报名比赛
EVENT.cancelJoinMatch = () =>
    $('.cancelJoinMatch').click(function (e) {
        if(!app.user.open_id){
            return alert('请先登陆');
        }
        if(app.matchId){
            REQ.regretMatch(app.matchId, app.user.open_id)
                .then(result => {
                    if(failMsg(result)){
                        return alert(failMsg(result));
                    }
                    if(result.data === 1){
                        $('.joinMatch').show();
                        $('.cancelJoinMatch').hide();
                        app.loadMatchInfo();
                    }
                });
        }
    });
// 初始化
app.init();