var GOOGLE='http://www.google.com';
var MODAVANTI = 'http://modavanti.com/';
var LOCAL = 'http://localhost:4711/';
var MY_APP_URL = LOCAL;

var driver = require('./driver.js').driver;

var By = require('selenium-webdriver').By,
    until = require('selenium-webdriver').until,
    expect = require('chai').expect;

describe('Load Home Page', function() {
    it('should load the home page successfully!', function(done) {
        driver.get(MY_APP_URL);
        // driver.findElement(By.name('q')).sendKeys('webdriver');
        // driver.findElement(By.name('btnG')).click();
        /*driver.getTitle().then(function(title) {
            console.log(title);
            expect(title).to.be.equal('an app to manage links false');

            done();
        });*/
        driver.getTitle(function (title) {
            expect(title).to.be.equal('an app');
            done();
        })
        // expect('a').to.be.equal('b');
        done();
    });
});

// driver.quit();