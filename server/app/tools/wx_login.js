
const imgURL = [
    'https://s4fx.kgimg.com/pub/subject/albumCrowdFund/images/H5_share_c57c0c5.png',
    'http://p3.fx.kgimg.com/v2/fxuserlogo/b3736a6c0108643f2316eea87d16f2eb.jpg_200x200.jpg'
];

const user = [
    {
        name: 'leader',
        skey: '10',
        wx_img: imgURL[0],
        open_id: 10000
    },
    {
        name: 'member_1',
        skey: '12',
        wx_img: imgURL[1],
        open_id: 300001
    },
    {
        name: 'member_2',
        skey: '13',
        wx_img: imgURL[1],
        open_id: 300002
    },
    {
        name: 'member_3',
        skey: '14',
        wx_img: imgURL[1],
        open_id: 300003
    }
];
user.forEach(item => item.type = item.skey);

module.exports = {
    members: user,
    getUserInfoBySessionKey: (skey) => user.find(item => item.skey == skey)
};