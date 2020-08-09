const glob = require("glob");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 获取项目根目录
const projectRoot = process.cwd();

// 可配置的入口文件
const pagesFile = ['shoppingMall', 'personalCenter'];
const componentsFile = ['components'];


exports.setEntryAndHtmlPlugin = function () {
    var data = [];

    // 处理主页入口
    let index = handleIndex();
    // 处理自定义入口
    let custom = handleCustom();

    // 整合入口
    data = data.concat(custom);
    data.push(index);

    var entry = {};
    var htmlWebpackPlugins = [];
    data.forEach((v) => {
        Object.assign(entry,v.entry)
        htmlWebpackPlugins.push(v.htmlWebpackPlugins)
    })

    return {
        entry,
        htmlWebpackPlugins,
    };
};

//处理主页入口和模板
function handleIndex() {
    let res = resloveDirs(null, 0);
    return res[0] ? setEntryHtml('index',null,res[0],0) : null;
}

//处理自定义入口和模板
function handleCustom() {
    let arr = [];
    
    // 处理src目录下的目录 如components
    if (componentsFile.length) {
        let com = handleDirsBeloneSrc(componentsFile);
        arr = arr.concat(com);
    }

    let paths = pagesFile;
    if (!paths.length) return arr;

    for (let i = 0, l = paths.length; i < l; i++) {
        // 处理自定义目录下的index
        let index_dir = resloveDirs(paths[i], 2);
        if (index_dir[0]) {
            arr.push(setEntryHtml('index', paths[i], index_dir[0], 2));
        }
        // 处理自定义目录下的子目录
        let dir = resloveDirs(paths[i], 1);
        if (!dir.length) continue;
        let reg = new RegExp(`src\/pages\/${paths[i]}\/(.*)\/index\.js`);
        for (let j = 0; j < dir.length; j++) {
            let match = dir[j].match(reg);
            arr.push(setEntryHtml(match[1], paths[i], dir[j], 1));
        }
    }
    return arr;
}

//处理src目录下的目录 如components
function handleDirsBeloneSrc(dirs) {
    let arr = []
    if(dirs.length){
        dirs.forEach(dir => {
            let reslovedDirs = resloveDirs(dir, 3);
            if (!reslovedDirs.length) return
            let reg = new RegExp(`src\/${dir}\/(.*)\/(.*)\/index\.js`);
            for (let j = 0; j < reslovedDirs.length; j++) {
                let match = reslovedDirs[j].match(reg);
                arr.push(setEntryHtml(match[2], dir+'/'+match[1], reslovedDirs[j], 3))
            }
        })
    }
    return arr;
}

//设置入口和模板
// type 0 首页 1 自定义目录 2 自定义目录下index 3 src下的目录,如components
function setEntryHtml(match, dirName, fullpath, type) {
    let templatePath = type === 3
                        ? `src/${dirName}/${match}/index.html`
                        : type === 2
                            ? `src/pages/${dirName}/${match}.html`
                            : type === 1
                                ? `src/pages/${dirName}/${match}/index.html`
                                : `src/${match}.html`;
    let outputPath = type === 0
                        ? `${match}`
                        : type === 2
                            ? `${dirName}/${match}`
                            : `${dirName}/${match}/index`;
    let html = new HtmlWebpackPlugin({
        template: path.join(projectRoot, templatePath),
        filename: `${outputPath}.html`,
        chunks: ["vendors", outputPath],
        minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
        },
    })
    let entry = {}
    entry[outputPath] = fullpath;
    return {
        entry: entry,
        htmlWebpackPlugins: html,
    }
}

function resloveDirs(dir, type) {
    if (type === 0) {
        // 处理主页
        return glob.sync(path.join(projectRoot, "src/index.js"));
    } else if (type === 1) {
        // 处理自定义目录下的子目录
        return glob.sync(path.join(projectRoot, `src/pages/${dir}/*/index.js`));
    } else if (type === 2) {
        // 处理自定义目录下的index
        return glob.sync(path.join(projectRoot, `src/pages/${dir}/index.js`));
    } else if (type === 3) {
        // 处理src下的目录,如components
        return glob.sync(path.join(projectRoot, `src/${dir}/*/*/index.js`));
    } else {
        return [];
    }
}
