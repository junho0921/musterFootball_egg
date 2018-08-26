let pageMatchId = location.hash.match(/matchId=(\w+)/);
const app = {
    // 页面的比赛信息
    match: null,
    matchId: pageMatchId && pageMatchId[1],
    // 用户信息
    user:{},
    // 初始化
    init: () => {
        $('#matchDate').val(`2018-09-01`);
        if(app.matchId){
            loadMatchInfo();
        }
    },
    bindEvent: () => {}
};


const getUserInfo = type => fetch(`/api/user/login${type?'?type='+type:''}`).then(res => res.json()).then((result) => {
    app.user.name = result.data.name;
    app.user.openId = result.data.open_id;
    $('.name').text(app.user.name + '，欢迎你');
    return result && result.data.muster_match;
}).then(matchs => {
    if(matchs){
        getMatchInfo(matchs).then((result) => {
            if(result && result.data){
                $('#matchDetailList').html(
                    renderMatchList(result.data)
                );
            }
        });
    }
});
// 登陆
$('#login').click(() => {getUserInfo()});
$('.login').click((e) => {
    let $e = $(e.target);
    let type = $e.data('type');
    console.log('type', type);
    getUserInfo(type+'').then(() => {
        if(app.matchId){
            getUserIsJoinedMatch().then(result => {
                let isJoined = result && !!result.data;
                $('.joinMatch').toggle(!isJoined);
                $('.cancelJoinMatch').toggle(isJoined);
            })
        }
    });
});

// 更新用户信息
$('#update').click(() => {
    let phone = $('#phone').val();
    fetch('/api/user/update', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phone: phone || Date.now(),
            name: app.user.name,
            openId: app.user.openId
        })
    }).then((response) => {
        //返回 object 类型
        return response.json();
    }).then((result) => {
        console.log('更新信息 -> ', result);
    });
});

// 发起比赛
$('#muster').click(() => {
    let type = $('[name=matchType]:checked').val();
    let position = $('#position').val() || '默认地址';
    let date = $('#matchDate').val();
    let maxNumbers = $('#maxNumbers').val();
    let data = {
        openId: app.user.openId,
        type,
        maxNumbers,
        position,
        date
    };
    console.log('data', data)
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
    }).then((result) => {
        console.log('更新信息 -> ', result);
        if(result.data){
            getUserInfo();
        }
    });
});

const renderMatchList = json => (
    `<ul>
        ${json.map(item => (
            `<li class="matchItem">
                ${renderMatchInfo(item)}
                <button class="deleteMatch" data-match="${item.match_id}">删除</button>
                <button class="shareMatch" data-match="${item.match_id}">邀请</button>
            </li>`
        )).join('')}
    </ul>`
);

const renderMatchInfo = item => (`
    <div>
      <span>比赛类型: ${item.type}</span>
    </div>
    <label>
      <span>地点: ${item.position}</span>
    </label>
    <label>
      <span>时间: ${item.date}</span>
    </label>
    <label>
      <span>最大人数: ${item.max_numbers}</span>
    </label>
    <div>
      <span>已经报名: ${item.members && item.members.map(renderUserSpan).join('')}</span>
    </div>
`);

const renderUserSpan = info => (
`<div class="userSpan">
    <img src="${info.wx_img}" alt="">
    <p>${info.name}</p>
</div>`
);

// 获取比赛信息
const getMatchInfo = (idList) => {
    return fetch(`/api/match/get?id=${JSON.stringify(idList.split(','))}`).then((response) => {
        //返回 object 类型
        return response.json();
    });
};
// 获取是否已经参与比赛
const getUserIsJoinedMatch = () => {
    return fetch(`/api/match/isJoined?id=${app.matchId}&t=${app.user.openId}`).then((response) => {
        //返回 object 类型
        return response.json();
    })
};

$('#matchDetailList').on('click', '.deleteMatch', function (e) {
    if(!app.user.openId){
        return alert('未登陆');
    }
    let $e = $(e.target);
    let matchId = $e.data('match');
    if(matchId){
        console.log('删除', matchId);
        return fetch(`/api/match/cancel?id=${matchId}&t=${app.user.openId}`).then((response) => {
            //返回 object 类型
            return response.json();
        }).then(result => {
            if(result && result.data == 1){
                $e.parents('.matchItem').remove();
            }
        });
    }
});

$('#matchDetailList').on('click', '.shareMatch', function (e) {
    if(!app.user.openId){
        return alert('未登陆');
    }
    let $e = $(e.target);
    let matchId = $e.data('match');
    if(matchId){
        window.location.hash = `matchId=${matchId}`;
        window.location.reload();
    }
});

const loadMatchInfo = () => {
    if(!app.matchId){
        return;
    }
    $('#joinMatchPanel').show();
    getMatchInfo(app.matchId).then(result => {
        let matchInfo = result.data && result.data[0];
        if(matchInfo){
            app.match = matchInfo;
            $('#matchDetail').html(renderMatchInfo(matchInfo));
        }
    })
};

const req_joinMatch = (matchId, openId) =>
    fetch(`/api/match/join?id=${matchId}&t=${openId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });

const req_regretMatch = (matchId, openId) =>
    fetch(`/api/match/regret?id=${matchId}&t=${openId}`)
        .then((response) => {
            //返回 object 类型
            return response.json();
        });

$('.joinMatch').click(function (e) {
    if(!app.user.openId){
        return alert('请先登陆');
    }
    if(app.matchId){
        req_joinMatch(app.matchId, app.user.openId)
            .then(result => {
                if(result && result.data == 1){
                    $('.joinMatch').hide();
                    $('.cancelJoinMatch').show();
                    loadMatchInfo();
                }
            });
    }
});

$('.cancelJoinMatch').click(function (e) {
    if(!app.user.openId){
        return alert('请先登陆');
    }
    if(app.matchId){
        req_regretMatch(app.matchId, app.user.openId)
            .then(result => {
                if(result && result.data == 1){
                    $('.joinMatch').show();
                    $('.cancelJoinMatch').hide();
                    loadMatchInfo();
                }
            });
    }
});

app.init();