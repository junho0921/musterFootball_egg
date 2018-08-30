
const imgURL = [
    'https://s4fx.kgimg.com/pub/subject/albumCrowdFund/images/H5_share_c57c0c5.png',
    'http://p3.fx.kgimg.com/v2/fxuserlogo/b3736a6c0108643f2316eea87d16f2eb.jpg_200x200.jpg'
];

const user = [
    {
        skey: '11',
        open_id: 100000,
        user_info: {
            name: 'leader',
            wx_img: imgURL[0]
        }
    },{
        skey: '12',
        open_id: 300001,
        user_info: {
            name: 'member_1',
            wx_img: imgURL[1]
        }
    },{
        skey: '13',
        open_id: 300002,
        user_info: {
            name: 'member_2',
            wx_img: imgURL[1]
        }
    },{
        skey: '14',
        open_id: 3000023,
        user_info: {
            name: 'member_3',
            wx_img: imgURL[1]
        }
    },
];

module.exports = {
    members: user,
    getUserInfoBySessionKey: (skey) => user.find(item => item.skey == skey)
};