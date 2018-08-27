'use strict';

const Service = require('egg').Service;

// 数据库表名
const TABLE_NAME = 'user_info';

class UserService extends Service {
    /**
     * 获取
     */
    async get(options) {
        const { app } = this;
        return await app.mysql.get(TABLE_NAME, options);
    }
    /**
     * 获取
     */
    async getByOpenId(open_id) {
        const { app } = this;
        return await app.mysql.get(TABLE_NAME, {open_id});
    }

    /**
     * 增加
     * @param {Object} item
     */
    async add(item) {
        const { app } = this;
        item.created_by = parseInt(new Date().getTime() / 1000);
        const result = await app.mysql.insert(TABLE_NAME, item);
        return result && result.affectedRows === 1;
    }

    /**
     * 更新
     * @param {Object} item
     */
    async update(item, options) {
        const { app } = this;
        item.updated_by = parseInt(new Date().getTime() / 1000);
        const result = await app.mysql.update(TABLE_NAME, item, options);
        return result && result.affectedRows === 1;
    }

    /**
     * 查询
     * @param {Object} options 查询条件
     * @return {Array<Object>} result
     */
    async find(options) {
        const { app } = this;
        options.limit = options.limit || 100;
        return await app.mysql.select(TABLE_NAME, options);
    }
}

module.exports = UserService;
