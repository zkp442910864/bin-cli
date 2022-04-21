const path = require('path');

// 常量
const {name, version} = require('../../package.json');

// 临时文件地址
const downloadDirectory = path.join(process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'], '.myTemplate');
// console.log(downloadDirectory);

module.exports = {
    version,
    downloadDirectory,
};

