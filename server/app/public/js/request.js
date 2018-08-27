// 成员参加比赛
const REQ = {};
REQ.joinMatch = (matchId, openId) =>
    fetch(`/api/match/join?id=${matchId}&t=${openId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });
// 成员取消比赛
REQ.regretMatch = (matchId, openId) =>
    fetch(`/api/match/regret?id=${matchId}&t=${openId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });
// 获取用户信息
REQ.getInfo = type =>
    fetch(`/api/user/login${type?'?type='+type:''}`)
        .then(res => res.json());
// 更新用户信息
REQ.updateInfo = (phone, name, openId) =>
    fetch('/api/user/update', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: phone || Date.now(),
            name: name,
            openId: openId
        })
    }).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 发起比赛
REQ.musterMatch = data =>
    fetch('/api/match/muster', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 获取比赛信息
REQ.getMatchInfo = (idList) =>
    fetch(`/api/match/get?id=${JSON.stringify(idList.split(','))}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 获取是否已经参与比赛
REQ.getUserIsJoinedMatch = (matchId, openId) =>
    fetch(`/api/match/isJoined?id=${matchId}&t=${openId}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 取消比赛
REQ.cancelMatch = (matchId, openId) =>
    fetch(`/api/match/cancel?id=${matchId}&t=${openId}`).then((response) => {
        //返回 object 类型
        return response.json();
    });

const REQ_DURATION = 3 * 1000;
const REQ_TIMER = () => new Promise((r) =>
    window.setTimeout(() => {
        r({code:1, msg: '请求超时'});
    }, REQ_DURATION)
);
Object.keys(REQ).forEach(key => {
    let item = REQ[key];
    REQ[key] = function () {
        return Promise.race([item.apply(this, arguments), REQ_TIMER()]);
    };
});

const failMsg = result => {
    if(!result || result.code != 0){
        return result && result.msg || '服务器错误';
    }
};