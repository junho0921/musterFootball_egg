const renderMatchList = json => (
    `<h2>我组织的比赛</h2>
    <ul>
        ${json.map(item => (
        `<li class="matchItem">
            ${renderMatchInfo(item)}
            <button class="deleteMatch" data-match="${item.match_id}">删除</button>
            <button class="shareMatch" data-match="${item.match_id}">邀请</button>
            <button class="editMatch" data-match="${item.match_id}">编辑</button>
        </li>`
    )).join('')}
    </ul>`
);
const renderJoinMatchList = (json, title) => (
    `<h2>${title || '比赛信息'}</h2>
    <ul>
        ${json.map(item => (
        `<li class="matchItem">
            ${renderMatchInfo(item)}
            ${ item.isJoined ? 
            `<button class="cancelJoinMatch" data-match="${item.match_id}">取消报名</button>`:
            `<button class="joinMatch" data-match="${item.match_id}">报个名</button>`}
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
        <span>发起人: ${item.leader && renderUserSpan(item.leader)}</span>
    </div>
    <div>
        <span>报名人: ${item.members && item.members.length && item.members.map(renderUserSpan).join('')}</span>
    </div>
`);

const renderMatchForm = (data = {type: 5}) => (
    `<div class="matchForm" data-id="${data.match_id || ''}">
        <div>
            <span>比赛类型</span>
            <label><input name="matchType" type="radio" value="5" ${data.type == 5 && 'checked'}/>五人 </label>
            <label><input name="matchType" type="radio" value="7" ${data.type == 7 && 'checked'}/>七人 </label>
            <label><input name="matchType" type="radio" value="11" ${data.type == 11 && 'checked'}/>十一人 </label>
        </div>
        <label>
            <span>地点</span>
            <input type="text" placeholder="请输入地址" id="position" value="${data.position || ''}">
        </label>
        <label>
            <span>时间</span>
            <input type="date" placeholder="请输入时间" id="matchDate" value="${data.date || '2018-09-01'}">
        </label>
        <label>
            <span>最大人数</span>
            <input type="number" placeholder="请输入最大人数" id="maxNumbers" value="${data.max_numbers || ''}">
        </label>
        <button class="muster">提交</button>
    </div>`
);

const renderUserForm = (data = {}) => (
    `<div class="updateForm">
        <span>联系方式</span>
        <input type="text" placeholder="请输入真实姓名" id="realName" value="${data.real_name || ''}"/>
        <input type="number" placeholder="请输入手机号" id="phone" value="${data.phone || ''}"/>
        <button id="update">提交</button>
    </div>`
);

const renderUserSpan = info => (
    `<div class="userSpan">
        <img src="${info.wx_img}" alt="">
        <p>${info.name}</p>
    </div>`
);
