#!/usr/bin/env node

const fs = require('fs');
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const inquirer = require('inquirer');
const ora = require('ora');
const symbols = require('log-symbols');
const handlebars = require('handlebars');
const start = require('./build');
program
  .version(require('./package').version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {
      inquirer
        .prompt([
          {
            name: 'choices',
            message: '请选择你要创建什么样的模板?',
            type: 'list',
            choices: ['通用PC模板', '租赁组PC模板'],
          },
          {
            name: 'description',
            message: 'please enter a description:',
          },
          {
            name: 'author',
            message: 'please enter a author:',
          },
        ])
        .then((answers) => {
          const spinner = ora('downloading template...');
          spinner.start();
          let downloadPath;
          if (answers.choices === '通用PC模板') {
            downloadPath = `direct:https://github.com/JinJieTan/mingyuanyun-fd-template.git`;
          } else {
            downloadPath = `direct:https://github.com/JinJieTan/fed-zulin-template.git`;
          }
          download(downloadPath, name, { clone: true }, (err) => {
            if (err) {
              spinner.fail();
              console.error(
                symbols.error,
                chalk.red(
                  `${err}download template fail,please check your network connection and try again`
                )
              );
              process.exit(1);
            }
            spinner.succeed();
            const meta = {
              name,
              description: answers.description,
              author: answers.author,
            };
            const fileName = `${name}/package.json`;
            const content = fs.readFileSync(fileName).toString();
            const result = handlebars.compile(content)(meta);
            fs.writeFileSync(fileName, result);
          });
        });
    } else {
      console.error(symbols.error, chalk.red('project has existed !!!'));
    }
  })
  .on('--help', () => {
    console.log(' Examples: ');
  });

program
  .command('build <branchName>')
  .action((branchName) => {
    start(branchName);
  })
  .on('--help', () => {
    console.log(' Examples: ');
  });

program.parse(process.argv);
