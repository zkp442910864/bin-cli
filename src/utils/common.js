const {promisify} = require('util');
const inquirer = require('inquirer');
const ora = require('ora');
const axios = require('axios');
const ncp = require('ncp');
const fse = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
// 将downloadGit改为promise
const downloadGit = promisify(require('download-git-repo'));

const {downloadDirectory} = require('./constants');


// 命令配置
const mapActions = {
    create: {
        alias: 'c',
        description: '创建一个项目',
        examples: [
            'tcli create <project-name>',
        ],
        async handle (projectName) {
            const projectDir = path.join(path.resolve(), projectName);

            const existsResult = fse.existsSync(projectName);

            if (existsResult) {
                console.log(chalk.red(`存在同名文件/文件夹 ${projectName}`));
                return;
            }

            const {confirmResult} = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirmResult',
                    message: '确定创建项目吗?',
                    default: true,
                },
            ]);

            if (!confirmResult) return;

            // 远端的
            origin.pull(projectDir, projectName);

            // 本地的
            // localPull(projectDir, projectName);
        },
    },
    '*': {
        alias: '',
        description: '命令未找到',
        examples: [],
    },
};

const loading = (text) => {
    // loading 加载远端资源用到
    const spinner = ora(text).start();
    // setTimeout(() => {
    //     spinner.color = 'red';
    //     spinner.text = 'Loading ora哈哈哈';
    // }, 1000);
    // setTimeout(() => {
    //     spinner.succeed('拉取成功');
    // }, 2000);
    return (result, resultStatus) => {
        if (resultStatus === 3) {
            spinner.fail(result);
        } else {
            spinner.color = 'red';
            spinner.succeed(result);
        }
    };
};

// 资源
const origin = {
    // 查看git项目 相关的api地址
    // https://api.github.com/repos/zkp442910864/webpack5-react
    // 获取分支
    // https://api.github.com/repos/zkp442910864/webpack5-react/branches
    // https://api.github.com/repos/zkp442910864/webpack5-react/tags
    async getTagLists () {
        const stop = loading('拉取远端 tags');
        const res = await axios('https://api.github.com/repos/zkp442910864/webpack5-react/tags');
        // console.log(res.data);
        stop('拉取完成');
        return res.data.map(ii => ii.name);
    },
    async downDir (tag, projectDir) {
        const project = `github:zkp442910864/webpack5-react#${tag}`;
        // const dest = `${downloadDirectory}/webpack5-react`;
        const dest = projectDir;

        const stop = loading('下载文件');

        // console.log(project);
        try {
            await downloadGit(project, dest);
            stop('下载完成');
        } catch (error) {
            stop('错误了吗？？？', 3);
            throw error;
        }

        return dest;
    },
    // 拉取代码到本地
    async pull (projectDir, projectName) {

        const choices = await origin.getTagLists();

        // 问答配置
        const {repo} = await inquirer.prompt([
            {
                type: 'list',
                name: 'repo',
                message: '请选择一个你要创建的项目',
                choices: choices,
            },
        ]);

        const target = await origin.downDir(repo, projectDir);

        // await copyTempToLoclhost(target, projectDir);

        console.log(chalk.blue(`cd ${projectName}`));
        console.log(chalk.blue('npm install'));
    },
};

// 本地拉取
const localPull = async (projectDir, projectName) => {
    const sourceDir = path.join(__dirname, '../../template');
    await copyTempToLoclhost(sourceDir, projectDir, false);
};

// 拷贝文件
const copyTempToLoclhost = async (target, projectDir, delTarget = true) => {
    const stop = loading('拷贝代码');
    // console.log('\n' + target);
    // console.log('\n' + projectDir);
    await ncp(target, projectDir, (error) => {
        // console.log(__dirname);
        error && console.log(chalk.red(error));
        delTarget && fse.remove(target);
    });
    stop('拷贝完成');
};


module.exports = {
    mapActions,
};
