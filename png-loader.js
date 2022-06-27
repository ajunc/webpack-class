//loader函数
module.exports = function (content,sourceMap,meta){
    console.log(this.query); // { name: 'hello' }
    let ctx = content
    let s = sourceMap
    let m = meta
    debugger
    return content;
    // this.callback(null, output, map, meta);
}