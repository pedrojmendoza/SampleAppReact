var assert = require('assert');

describe('my app', function() {
    it('should have the right contents', function () {
        browser.url('http://menpedro-react-app-preprod-es.s3-website-us-east-1.amazonaws.com/');
        assert.equal(browser.getText('.App-title'), 'Welcome to React');
        browser.click('#next-button');
        assert(browser.getText('p=This is a Spain compliance step.'));
        browser.click('#next-button');
        assert(browser.getText('p=This is yet another (common) step.'));
        browser.click('#next-button');
        assert(browser.getText('p=This is yet another (Spain specific) step.'));
    });
});
