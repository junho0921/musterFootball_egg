'use strict';

module.exports = {
  // 日志目录
  logger: {
    dir: '/data1/logs/'
  },

  // 启动参数
  cluster: {
    listen: {
      port: 3089,
      hostname: '127.0.0.1'
    }
  },

  // MySQL 配置
  mysql: {
    client: {
      host: '10.1.1.38'
    }
  }
};
