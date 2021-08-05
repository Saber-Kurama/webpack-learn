const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cwd = process.cwd();
// const branchName = process.argv[2] || 'master';

const PROJECT_PATHS = [
  'rental-web',
  'fed-rental-web',
  'rental-web-contract',
  'rental-web-middleground',
];

const STATIC_PATHS = ['static', 'fed', 'pact', 'middleground'];

const getclonePath = (PROJECT_PATH, branchName) => {
  return `git clone -b  ${branchName} git@git.myspacex.cn:myspace-eam/${PROJECT_PATH}.git --depth 1`;
};

function deleteCode(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteCode(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function getCode(item, branchName) {
  console.log(`${item}项目代码拷贝中...`);
  if (fs.existsSync(path.resolve(cwd, `./frountend/${item}`))) {
    console.log(1);
    execSync('git pull', { cwd: path.resolve(cwd, `./frountend/${item}`) });
    console.log(2);
    execSync(`git checkout ${branchName}`, {
      cwd: path.resolve(cwd, `./frountend/${item}`),
    });
    console.log(3);
  } else {
    return execSync(getclonePath(item, branchName), { cwd: './frountend' });
  }
}

function build(item) {
  console.log(`${item}项目依赖安装中...`);
  execSync(`yarn install`, {
    cwd: path.resolve(cwd, `./frountend/${item}`),
  });
  console.log(`${item}项目构建中...`);
  execSync(`yarn build`, { cwd: path.resolve(cwd, `./frountend/${item}`) });
}

function copyFile(srcPath, tarPath, cb) {
  const rs = fs.createReadStream(srcPath);
  rs.on('error', function (err) {
    if (err) {
      console.log('read error', srcPath);
    }
    cb && cb(err);
  });

  const ws = fs.createWriteStream(tarPath);
  ws.on('error', function (err) {
    if (err) {
      console.log('write error', tarPath);
    }
    cb && cb(err);
  });
  ws.on('close', function (ex) {
    cb && cb(ex);
  });

  rs.pipe(ws);
}

function copyFolder(srcDir, tarDir, cb) {
  fs.readdir(srcDir, function (err, files) {
    let count = 0;
    const checkEnd = function () {
      ++count == files.length && cb && cb();
    };

    if (err) {
      checkEnd();
      return;
    }

    files.forEach(function (file) {
      const srcPath = path.join(srcDir, file);
      const tarPath = path.join(tarDir, file);

      fs.stat(srcPath, function (err, stats) {
        if (stats.isDirectory()) {
          console.log('mkdir', tarPath);
          fs.mkdir(tarPath, function (err) {
            if (err) {
              console.log(err, 'hehe');
              return;
            }

            copyFolder(srcPath, tarPath, checkEnd);
          });
        } else {
          copyFile(srcPath, tarPath, checkEnd);
        }
      });
    });

    //为空时直接回调
    files.length === 0 && cb && cb();
  });
}

function start(branchName) {
  console.log('正在安装yarn包管理器...');
  execSync('npm install -g yarn');
  execSync('yarn config set registry https://registry.npm.taobao.org -g');

  //检测是否存在源码目录
  if (!fs.existsSync('frountend')) {
    fs.mkdir('frountend', (err) => {
      console.log(err, 'err');
    });
  }
  console.log('正在清理之前文件');

  //删除构建后的产物,生成文件夹
  STATIC_PATHS.forEach((item) => {
    const file_path = path.join(cwd, `./${item}`);
    deleteCode(file_path);
    fs.mkdir(path.join(cwd, `./${item}`), () => {});
  });

  //拉取代码,构建,复制到对应目录
  PROJECT_PATHS.map((item, index) => {
    getCode(item, branchName);
    build(item);
    console.log(`${item}构建产物中...`);
    copyFolder(
      path.join(cwd, `./frountend/${item}/${STATIC_PATHS[index]}`),
      path.join(cwd, `./${STATIC_PATHS[index]}`)
    );
  });
}

module.exports = start;
