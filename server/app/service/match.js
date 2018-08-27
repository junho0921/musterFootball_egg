'use strict';

const Service  = require('egg').Service;

// 数据库表名
const TABLE_NAME = 'matchs';

const matchObj = (matchId) => ({
    matchId,
    membersList: [],

});

class RemarkService extends Service {
    /**
     * 查询
     * @param {Object} options 查询条件
     * @return {Array<Object>} result
     */
    async find(options) {
        const { app } = this;
        return await app.mysql.select(TABLE_NAME, options);
    }

    /**
     * 查询一条
     * @param {Object} options 查询条件
     * @return {Object} result
     */
    async get(options) {
        const { app } = this;
        return await app.mysql.get(TABLE_NAME, options);
    }

    /**
     * 增加
     * @param {Object} item
     * @return {Boolean} result 是否增加成功
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
     * @return {Boolean} result 是否修改成功
     */
    async update(item, options) {
        const { app } = this;
        item.updated_by = parseInt(new Date().getTime() / 1000);
        const result = await app.mysql.update(TABLE_NAME, item, options);
        console.log('更新信息', result)
        return result && result.affectedRows === 1;
    }

    /**
     * 删除
     * @param {Object} item
     * @return {Boolean} result 是否删除成功
     */
    async delete(item) {
        const { app } = this;
        const result = await app.mysql.delete(TABLE_NAME, item);
        return result && result.affectedRows === 1;
    }

    /**
     * 分组查询参评过的用户列表
     */
    async findByGroup() {
        const { app } = this;
        const sql = `select kpi_id,username,chinese_name,org_name from ${TABLE_NAME} group by kpi_id, username, chinese_name, org_name`;
        const result = await app.mysql.query(sql);
        return result;
    }

    /**
     * 查询中文名为空的用户列表
     */
    async findCNameIsNull() {
        const { app } = this;
        const sql = `select * from dt_kpi_remark where chinese_name is null limit 0,10`;
        const result = await app.mysql.query(sql);
        return result;
    }
}

module.exports = RemarkService;
