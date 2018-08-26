'use strict';

module.exports = {
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
      host: 'localhost'
    }
  }
};
