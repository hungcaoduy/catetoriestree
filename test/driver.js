var Webdriver = require('selenium-webdriver');

// chromedriver: should be downloaded and add to path: http://chromedriver.storage.googleapis.com/index.html?path=2.9/
/*var driver = new Webdriver.Builder()
    .withCapabilities(Webdriver.Capabilities.chrome())
    .build(); */

// firefox
var driver = new Webdriver.Builder()
    .forBrowser('phantomjs')
    .build();

var chaiWebdriver = require('chai-webdriver');
// chai.use(chaiWebdriver(driver));

exports.driver = driver;