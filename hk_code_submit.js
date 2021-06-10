let puppeteer = require("puppeteer");
let { password, email } = require("../secrets.js");
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
        let clickChallenge = waitAndClick("a[data-attr1='warmup']");
        return clickChallenge;
    })
    .then(function() {
        let clickQuestion = waitAndClick(
            ".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled"
        );
        return clickQuestion;
    })
    .catch(function(err) {
        console.log(err);
    });

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
            .catch(function() {
                reject();
            });
    });
}

console.log("After");