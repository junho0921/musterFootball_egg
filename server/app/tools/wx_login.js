
const imgURL = [
    'https://s4fx.kgimg.com/pub/subject/albumCrowdFund/images/H5_share_c57c0c5.png',
    'http://p3.fx.kgimg.com/v2/fxuserlogo/b3736a6c0108643f2316eea87d16f2eb.jpg_200x200.jpg'
];

const mock_leader = {
    name: 'wx_name_leader',
    wx_img: imgURL[0],
    openId: 10000
};
const mock_member = [
    {
        type: 0,
        name: 'wx_name_member_1',
        wx_img: imgURL[1],
        openId: 300001
    },
    {
        type: 1,
        name: 'wx_name_member_2',
        wx_img: imgURL[1],
        openId: 300002
    },
    {
        type: 2,
        name: 'wx_name_member_3',
        wx_img: imgURL[1],
        openId: 300003
    }
];

module.exports = {
    members: mock_member,
    getUserInfo: (type) => type ? mock_member[type] : mock_leader
};