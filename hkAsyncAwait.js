let puppeteer = require("puppeteer");
let { password, email } = require("../secrets.js");
let { codes } = require("./code.js");
let fs = require("fs");
console.log("before");
(async function() {
    try {
        let browserInstance = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"],
        });
        let newTab = await browserInstance.newPage();
        await newTab.goto(
            "https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login"
        );
        await newTab.type("#input-1", email, { delay: 200 });
        await newTab.type("#input-2", password, { delay: 200 });
        await newTab.click("button[data-analytics='LoginPassword']");
        await waitAndClick(
            ".card-content h3[title='Interview Preparation Kit']",
            newTab
        );
        await waitAndClick("a[data-attr1='warmup']", newTab);
        let url = newTab.url();
        for (let i = 0; i < codes.length; i++) {
            await questionSolver(url, codes[i].soln, codes[i].qName, newTab);
        }
    } catch (err) {
        console.log(err);
    }
})();

async function waitAndClick(selector, newTab) {
    await newTab.waitForSelector(selector, { visible: true });
    //we didnt wait this prmise because we want the calling person to await this promise based async function
    let selectorClickPromise = newTab.click(selector);
    return selectorClickPromise;
}

async function questionSolver(modulepageurl, code, questionName, gtab) {
    await gtab.goto(modulepageurl);

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
    await gtab.evaluate(browserconsolerunFn, questionName);
    await waitAndClick(".checkbox-input", gtab);
    await gtab.type(".input-wrap", code);
    await gtab.keyboard.down("Control");
    await gtab.keyboard.press("a");
    await gtab.keyboard.press("x");
    await gtab.click(".monaco-editor.no-user-select.vs");
    await gtab.keyboard.press("a");
    await gtab.keyboard.press("v");
    await gtab.click(
        ".ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled"
    );
    return gtab.keyboard.up("control");
}

console.log("after");