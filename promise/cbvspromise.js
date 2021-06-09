let fs = require("fs");

// this is done so that we can use promisewalafunction instead of fs.promises.readFile

console.log("before");

function promisewalaReadFile(filepath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filepath, function cb(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

let frp = promisewalaReadFile("f1.txt");
console.log(frp);
setTimeout(function() {
    console.log("data -> " + frp);
}, 2000);
// frp.then(function(data) {
//     console.log("data -> " + data);
// });
// frp.catch(function(err) {
//     console.log("err -> " + err);
// });

console.log("after");