const Controller = require('egg').Controller;

const {members} = require('../tools/wx_login');

class HomeController extends Controller {
    async index() {
        await this.ctx.render('demo/index.html', {members});
    }
}

module.exports = HomeController;
