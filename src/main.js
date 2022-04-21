
const {program} = require('commander');

const {mapActions} = require('./utils/common');
const {version} = require('./utils/constants');

// 注册命令
Reflect.ownKeys(mapActions).forEach((action) => {
    const item = mapActions[action];

    program.command(action)
        .alias(item.alias)
        .description(item.description)
        .action((...arg) => {
            if (action === '*') {
                console.log(item.description);
            } else {
                const data = process.argv;
                item.handle(...data.slice(3));
                // console.log(action);
                // console.log(process.argv);
                // console.log(arg);
            }
        });
});

// 扩展 help
program.on('--help', () => {
    console.log('\nExamples:');
    Reflect.ownKeys(mapActions).forEach((action) => {
        const item = mapActions[action];
        item.examples.forEach((example) => {
            console.log(` ${example}`);
        });
    });
});

// 设置版本，解析参数
program.version(version).parse(process.argv);
