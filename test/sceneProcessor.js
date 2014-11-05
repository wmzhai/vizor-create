var SceneProcessor = require('../lib/sceneProcessor');
var when = require('when');
var nodefn = require('when/node');
var assert = require('assert');
var fsPath = require('path');
var fs = require('fs-extra');
var EventEmitter = require('events').EventEmitter;

var scenes = {
	actuallyAnImage: {
			name: 'te-2rb.jpg',
			path: __dirname+'/fixtures/te-2rb.jpg'
	},
	valid: {
			name: 'scene.zip',
			path: __dirname+'/fixtures/scene.zip'
	}
};

describe('SceneProcessor', function()
{
	var sp, gfs = {};

	beforeEach(function()
	{
		sp = new SceneProcessor(gfs);
	});

	it.skip('rejects an invalid zip', function(done)
	{
		sp.validate(scenes.actuallyAnImage, 'foo')
		.then(function(valid) {
			assert.ok(!valid);
			done();
		})
		.catch(done)
	});

	it('accepts a valid zip', function(done)
	{
		sp.validate(scenes.valid, 'foo')
		.then(function(valid) {
			assert.ok(valid);
			done();
		})
		.catch(done)
	});

	it('explodes a valid zip', function(done)
	{
		var wrote = 0;
		gfs.createWriteStream = function()
		{
			var ee = new EventEmitter();
			ee.write = function(data) { return true; };
			ee.end = function() {
				wrote++;
			}
			return ee;
		};

		sp.handleUpload(scenes.valid, 'foo')
		.then(function() {
			assert.ok(wrote, 9);
			done();
		})
		.catch(done)
	});


});