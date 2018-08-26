'use strict';
module.exports = appInfo => {
    const config = exports = {
        view: {
            defaultViewEngine: 'nunjucks',
            mapping: {
                '.html': 'nunjucks',
            },
        },

        // 响应头缓存
        caching: {
            maxAge: 5
        },

        // 安全配置
        security: {
            csrf: {
                enable: false
            }
        },

        // 异常处理
        onerror: {
            json(err, ctx) {
                ctx.status = 200;
                ctx.body = {
                    time: parseInt(new Date().getTime()),
                    code: 1,
                    data: null,
                    msg: err ? err.message : '数据读取错误'
                };
            }
        },

        // MySQL 配置
        mysql: {
            client: {
                port: '3306',
                user: 'root',
                password: '', // todo 请输入您的数据库密码
                database: 'musterFootball'
            },
            // 挂载到 app
            app: true,
            // 不挂载到 agent
            agent: false
        }
    };

    // Cookie 安全字符串
    // config.keys = '';

    return config;
};
