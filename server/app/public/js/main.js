let pageMatchId = location.hash.match(/matchId=(\w+)/);
const app = {
    // 页面的比赛信息
    match: null,
    matchId: pageMatchId && pageMatchId[1],
    userType: undefined,
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

const getUserInfo = type => req_getInfo(type).then((result) => {
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
$('.login').click((e) => {
    app.userType = $(e.target).data('type');
    getUserInfo(app.userType).then(() => {
        if(app.matchId){
            getUserIsJoinedMatch(app.matchId, app.user.openId).then(result => {
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
    req_updateInfo(phone, app.user.name, app.user.openId).then((result) => {
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
    console.log('data', data);
    req_musterMatch(data).then((result) => {
        console.log('更新信息 -> ', result);
        if(result.data){
            getUserInfo(app.userType);
        }
    });
});


$('#matchDetailList').on('click', '.deleteMatch', function (e) {
    if(!app.user.openId){
        return alert('未登陆');
    }
    let $e = $(e.target);
    let matchId = $e.data('match');
    if(matchId){
        console.log('删除', matchId);
        return req_cancelMatch(matchId, app.user.openId).then(result => {
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