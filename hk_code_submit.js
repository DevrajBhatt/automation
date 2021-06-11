let puppeteer = require("puppeteer");
let { password, email } = require("../secrets.js");
let { codes } = require("./code.js");
let gtab;
console.log("before");
let browserPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
});
browserPromise
    .then(function(browserInstance) {
        let newTabPromise = browserInstance.newPage();
        return newTabPromise;
    })
    .then(function(newTab) {
        let loginPageWillBeOpenedPromise = newTab.goto(
            "https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login"
        );
        gtab = newTab;
        return loginPageWillBeOpenedPromise;
    })
    .then(function() {
        // console.log("Login Page Opened");
        let emailWillBeTypedPromise = gtab.type("#input-1", email, { delay: 200 });
        return emailWillBeTypedPromise;
    })
    .then(function() {
        let passWillBeTypedPromise = gtab.type("#input-2", password, {
            delay: 200,
        });
        return passWillBeTypedPromise;
    })
    .then(function() {
        let loginPageWillBeClickedPromise = gtab.click(
            "button[data-analytics='LoginPassword']"
        );
        return loginPageWillBeClickedPromise;
    })
    .then(function() {
        let clickIPKit = waitAndClick(
            ".card-content h3[title='Interview Preparation Kit']"
        );
        return clickIPKit;
    })
    .then(function() {
        let warmupClick = waitAndClick("a[data-attr1='warmup']");
        return warmupClick;
    })
    .then(function() {
        return gtab.url();
    })
    .then(function(url) {
        console.log(url);
        let questionObj = codes[0];
        let fqsp = questionSolver(url, questionObj.soln, questionObj.qName);
        for (let i = 1; i < codes.length; i++) {
            fqsp = fqsp.then(function() {
                return questionSolver(url, codes[i].soln, codes[i].qName);
            });
        }
    })
    .catch(function(err) {
        console.log(err);
    });

//promise based function
function waitAndClick(selector) {
    return new Promise(function(resolve, reject) {
        let selectorWaitPromise = gtab.waitForSelector(selector, { visible: true });
        selectorWaitPromise
            .then(function() {
                let selectorClickPromise = gtab.click(selector);
                return selectorClickPromise;
            })
            .then(function() {
                resolve();
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

function questionSolver(modulepageurl, code, questionName) {
    return new Promise(function(resolve, reject) {
        //page visit
        let reachedPageUrlPromise = gtab.goto(modulepageurl);
        reachedPageUrlPromise
            .then(function() {
                //page h4 -> matching h4 -> click
                //function will execute inside the browser
                function browserconsolerunFn(questionName) {
                    let allH4Elem = document.querySelectorAll("h4");
                    let textArr = [];
                    for (let i = 0; i < allH4Elem.length; i++) {
                        let myQuestion = allH4Elem[i].innerText.split("\n")[0];
                        textArr.push(myQuestion);
                    }
                    let idx = textArr.indexOf(questionName);
                    console.log(idx);
                    allH4Elem[idx].click();
                }
                let pageClickPromise = gtab.evaluate(browserconsolerunFn, questionName);
                return pageClickPromise;
            })
            .then(function() {
                //checkbox click
                let inputWIllBeClickedPromise = waitAndClick(".checkbox-input");
                return inputWIllBeClickedPromise;
            })
            .then(function() {
                //type
                let codeWIllBeTypedPromise = gtab.type(".input-wrap", code);
                return codeWIllBeTypedPromise;
            })
            .then(function() {
                let controlIsHeldPromise = gtab.keyboard.down("Control");
                return controlIsHeldPromise;
            })
            .then(function() {
                //ctrl a
                let aIsPressedPromise = gtab.keyboard.press("a");
                return aIsPressedPromise;
            })
            .then(function() {
                //cntrl x
                let cutPromise = gtab.keyboard.press("x");
                return cutPromise;
            })
            .then(function() {
                let editorWillBeCLickedPromise = gtab.click(
                    ".monaco-editor.no-user-select.vs", { delay: 100 }
                );
                return editorWillBeCLickedPromise;
            })
            .then(function() {
                //ctrl a
                let aIsPressedPromise = gtab.keyboard.press("a");
                return aIsPressedPromise;
            })
            .then(function() {
                //ctrl v
                let pastePromise = gtab.keyboard.press("v");
                return pastePromise;
            })
            .then(function() {
                let submitIsClickedPromise = gtab.click(
                    ".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled"
                );
                return submitIsClickedPromise;
            })
            .then(function() {
                resolve();
            })
            .catch(function(err) {
                reject(err);
            });
    });
}

console.log("After");