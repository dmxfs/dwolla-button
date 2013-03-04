var Browser = require("zombie")
	, assert = require("assert")
	, path = require("path")
	, folder = path.dirname(__dirname)
	, browser = new Browser()
	;

browser.visit("file:/" + folder + "/index.html", function () {	
	// Check that the page loaded OK
	assert.ok(browser.success, 'Test page load failed');

	// Check that the button has the correct
	assert.strictEqual(browser.queryAll(".d-btn").length, 4, "Couldn't find 4 rendered buttons.");

	// Check that the CSS stylesheet has
	// been injected
	assert.strictEqual(browser.queryAll("link[href='https://www.dwolla.com/content/button.min.css']").length, 1, "Couldn't find Dwolla's stylesheet");

	// Follow the first button
	browser
		.clickLink("A button", function() {
			// Check that the page loaded OK
			assert.ok(browser.success, 'Checkout load failed');

			// Make sure the result URL is OK
			assert.notStrictEqual(browser.location._url.href.indexOf("https://www.dwolla.com/payment"), -1, 'Error redirect occured');

			console.log('Test completed successfully');
		});
});