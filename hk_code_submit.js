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
        let ipKitChallenge = gtab.waitForSelector(
            ".card-content h3[title='Interview Preparation Kit']", { visible: true }
        );
        let combinedPromise = Promise.all([
            loginPageWillBeClickedPromise,
            gtab.waitForNavigation({ waitUntil: "networkidle0" }),
            ipKitChallenge,
        ]);
        return combinedPromise;
    })
    .then(function() {
        let clickedPromise = gtab.click(
            ".card-content h3[title='Interview Preparation Kit']"
        );
        let clickChallengeElementPromise = gtab.waitForSelector(
            "a[data-attr1='warmup']", { visible: true }
        );
        let combinedPromise = Promise.all([
            clickedPromise,
            gtab.waitForNavigation({ waitUntil: "networkidle0" }),
            clickChallengeElementPromise,
        ]);
        return combinedPromise;
    })
    .then(function() {
        let clickChallenge = gtab.click("a[data-attr1='warmup']");
        let salesByMatchPromise = gtab.waitForSelector(
            ".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled", { visible: true }
        );
        let combinedPromise = Promise.all([
            clickChallenge,
            gtab.waitForNavigation({ waitUntil: "networkidle0" }),
            salesByMatchPromise,
        ]);
        return combinedPromise;
    })
    .then(function() {
        let clickQuestion = gtab.click(
            ".ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled"
        );
        let combinedPromise = Promise.all([
            clickQuestion,
            gtab.waitForNavigation({ waitUntil: "networkidle0" }),
        ]);
        return combinedPromise;
    })
    .catch(function(err) {
        console.log(err);
    });

console.log("After");