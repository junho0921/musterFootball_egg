'use strict';

const execSync = require('child_process').execSync;

execSync('mysql -uroot -e "create database IF NOT EXISTS cAuth11;"');
execSync('mysql -uroot test < tools/cAuth.sql');
console.log('create table success');
