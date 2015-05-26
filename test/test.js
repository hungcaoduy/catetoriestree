var Webdriver = require('selenium-webdriver');
var driver = new Webdriver.Builder().withCapabilities(Webdriver.Capabilities.chrome())
	.build();
// chromedriver should be downloaded and add to path: http://chromedriver.storage.googleapis.com/index.html?path=2.9/
var chai = require('chai');
var chaiWebdriver = require('chai-webdriver');
chai.use(chaiWebdriver(driver));

describe('Load Home Page', function() {
	it('should load the home page successfully!', function(done) {
		driver.get('localhost:4711').then(function() {
			driver.getTitle().then(function(title) {
				expect(title).to.equal('manage link');
			});			
		});
		// chai.expect('#site-container h1.heading').dom.to.not.contain.text("I'm a kitty!");		
	});
});

