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
