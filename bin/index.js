#!/usr/bin/env node

require('../src/main');



// const path = require('path');
// const {program} = require('commander');

// const {name, version} = require('../src/utils/constants');
/**
 * process.argv 可以获取到命令参数
 *  0: 执行器
 *  1: 当前执行文件
 *  ... 命令中参数
 *
 * $ tcli init
        [
            'C:\\Program Files\\nodejs\\node.exe',
            'C:\\Users\\zhoukaipeng\\AppData\\Roaming\\npm\\node_modules\\test-cli\\bin\\tcli.js',
            'init'
        ]
 */

// console.log(process.argv);
// console.log(process.cwd());


// program
//     // 设置版本号
//     .version(version)
//     .command('init <pkg-name>')
//     .description('初始化项目')
//     .action((name) => {
//         // console.log('pkg-name', name);
//         const init = require('../src/cli-commands/init');
//         init(name);
//     });

// program.parse(process.argv);

