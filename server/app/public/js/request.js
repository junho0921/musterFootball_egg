// 成员参加比赛
const req_joinMatch = (matchId, openId) =>
    fetch(`/api/match/join?id=${matchId}&t=${openId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });
// 成员取消比赛
const req_regretMatch = (matchId, openId) =>
    fetch(`/api/match/regret?id=${matchId}&t=${openId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });
// 获取用户信息
const req_getInfo = type =>
    fetch(`/api/user/login${type?'?type='+type:''}`)
        .then(res => res.json());
// 更新用户信息
const req_updateInfo = (phone, name, openId) =>
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
const req_musterMatch = data =>
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
const getMatchInfo = (idList) =>
    fetch(`/api/match/get?id=${JSON.stringify(idList.split(','))}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 获取是否已经参与比赛
const getUserIsJoinedMatch = (matchId, openId) =>
    fetch(`/api/match/isJoined?id=${matchId}&t=${openId}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
// 取消比赛
const req_cancelMatch = (matchId, openId) =>
    fetch(`/api/match/cancel?id=${matchId}&t=${openId}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
