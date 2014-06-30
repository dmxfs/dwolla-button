var express = require('express');
var Browser = require('zombie');
var assert = require('assert');
var path = require('path');
var folder = path.dirname(__dirname);

var browser = new Browser();

//-------------------------------------------------------------------------------------------------
//SERVE EXAMPLE HTML
//-------------------------------------------------------------------------------------------------
var server = {

    app: express(),
    server: null,
    files: [],

    initialize: function() {
        server.urlConfs();
        server.startWebServer();
    },

    startWebServer: function() {
        server.server = server.app.listen(8083);
        console.log('Serving example at http://localhost:8083/buttons.html.');
    },

    example:function(req, res) {
        res.render('buttons.html');
    },

    urlConfs: function() {
        server.app.use(express.static(path.join(__dirname +'/../examples')));
    }
}

server.initialize();


//-------------------------------------------------------------------------------------------------
//RUN ZOMBIE TEST
//-------------------------------------------------------------------------------------------------
browser.visit('http://localhost:8083/buttons.html', function () {   
    //Check that the page loaded OK
    assert.ok(browser.success, 'Test page load failed');

    // Check that the button has the correct
    assert.strictEqual(browser.queryAll('.d-btn').length, 4, 'Couldn\'t find 4 rendered buttons.');

    //Check that the CSS stylesheet has been injected
    assert.strictEqual(browser.queryAll('link[href="https://www.dwolla.com/content/button.min.css"]').length, 1, 'Couldn\'t find Dwolla\'s stylesheet');

    // Follow the first button
    browser.clickLink('Simple Payment Button', function() {
        // Check that the page loaded OK
        assert.ok(browser.success, 'Checkout load failed');

        // Make sure the result URL is OK
        assert.notStrictEqual(browser.location.pathname.indexOf('/Payment/Login'), -1, 'Error redirect occured');

        console.log('Test completed successfully.');
        server.server.close();
        console.log('Shut down server.')
    });
});
