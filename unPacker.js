const fs = require('fs');
const file = process.argv[2];
const images = require("images");
let folder = '';

function start() {
    if (!fs.existsSync(file))
        return console.log(file + '不存在');
    folder = file.split('.')[0];
    const type = file.split('.')[1];
    if (fs.existsSync(folder))
        rmFold(folder);
    fs.mkdirSync(folder);
    if (type === 'json') {
        const fileData = JSON.parse(fs.readFileSync(file, 'utf-8'));
        const frames = this.frames = fileData['frames'];
        for (let k in frames) {
            genImg(k, frames[k]['frame'])
        }
    } else if (type === 'plist') {
        convertPlist();
    } else {
        console.log('The file `s name must be json or plist')
    }
}

//plist能正常切割图片，但未旋转
function convertPlist() {
    var parseString = require('xml2js').parseString;
    var xml = fs.readFileSync(file, 'utf-8');

    parseString(xml, function (err, result) {
        //console.log(result.plist.dict[0].dict[0].dict[0].string);
        //  console.log(result.plist.dict[0].dict[0].dict[0].false);

        const name = result.plist.dict[0].dict[0].key;
        const dict = result.plist.dict[0].dict[0].dict;

        name.forEach((k, v) => {
            let str = dict[v].string[3];
            const boo = dict[v].true;
            str = str.replace(/[^0-9]+/ig, ",")
            const arr = str.split(',');

            let w, h;
            if (boo) {
                w = +arr[4],
                    h = +arr[3]
            } else {
                w = +arr[3],
                    h = +arr[4]
            }

            const info = {
                x: +arr[1],
                y: +arr[2],
                w: w,
                h: h
            }
            genImg(k, info);
        })
    });
    // fs.writeFileSync('./bbb.json', JSON.stringify(json, null, 4))
}

function genImg(k, info) {
    const imageFile = folder + '.png';
    images(images(imageFile), info.x, info.y, info.w, info.h)
        .save(folder + '/' + k, { //Save the image to a file, with the quality of 50
            quality: 50
        });
}

//删除某个文件夹
function rmFold(srcPath) {
    let allFiles = [];

    function recurse(path) {
        let files = [];
        if (fs.existsSync(path)) {
            files = fs.readdirSync(path);
            files.forEach(function (file, index) {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) { // recurse
                    recurse(curPath);
                } else { // del file
                    allFiles.push(curPath);
                    fs.unlinkSync(curPath)
                }
            });
            path != srcPath && fs.rmdirSync(path);
        }
    }
    recurse(srcPath);
    fs.rmdirSync(srcPath);
    console.log('del: ' + srcPath + allFiles.length);
    return allFiles;
};

module.exports = start;
if (require.main == module) {
    start();
}