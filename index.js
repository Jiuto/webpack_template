const glob = require("glob");
const path = require("path");
const projectRoot = process.cwd();

exports.setEntryAndHtmlPlugin = function (entryFile) {
    // 处理自定义目录
    let custom=handleCustom(entryFile);

    // 整合配置
    const entry = {};
    const htmlWebpackPlugins = [];
    custom.forEach((v)=>{
        Object.assign(entry,v.entry)
        htmlWebpackPlugins.push(v.htmlWebpackPlugins)
    })
    return {
        entry,
        htmlWebpackPlugins,
    };
};

//处理自定义入口和模板
function handleCustom(entryFile) {
    let arr = [];

    let paths = entryFile;
    if (!paths.length) return arr;

    for (let i = 0, l = paths.length; i < l; i++) {
        // 处理自定义目录下的index
        let index_dir = resloveDirs(paths[i], 2);
        if(index_dir[0]){
            arr.push(setEntryHtml('index',paths[i],index_dir[0],paths[i] === 'home'? 0 : 2))
        }
        // 处理自定义目录下的子目录
        let dir = resloveDirs(paths[i], 1);
        if (!dir.length) continue;
        let reg = new RegExp(`src\/pages\/${paths[i]}\/(.*)\/index\.js`);
        for (let j = 0; j < dir.length; j++) {
            let match = dir[j].match(reg);
            arr.push(setEntryHtml(match[1],paths[i],dir[j],1))
        }
    }
    return arr;
}

//设置入口和模板
// type 0 首页 1 自定义目录的子页面 2 自定义目录的首页
function setEntryHtml(match,dirName,fullpath,type) {
    let templatePath = type !== 1
                            ? `src/pages/${dirName}/${match}.html`
                            : `src/pages/${dirName}/${match}/index.html`;
    let outputPath = type === 0
                        ? `${match}`
                        : type === 2
                            ? `${dirName}/${match}`
                            : `${dirName}/${match}/index`;
    let html = {
        template: path.join(projectRoot, templatePath),
        filename: `${outputPath}.html`,
        chunks: ["vendors", outputPath],
        hash:true,
        minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
        },
    }
    let entry={}
    entry[outputPath]=fullpath;
    return {
        entry: entry,
        htmlWebpackPlugins: html,
    }
}

function resloveDirs(dir, type) {
    if (type === 1) {
        // 处理自定义目录下的子目录
        return glob.sync(path.join(projectRoot, `src/pages/${dir}/*/index.js`));
    } else if (type === 2) {
        // 处理自定义目录下的index
        return glob.sync(path.join(projectRoot, `src/pages/${dir}/index.js`));
    } else {
        return [];
    }
}
