/* eslint-env mocha */
import { strictEqual, throws } from 'assert';
import { escape, unescape } from '../src/index.mjs';

describe('escape', () =>
{
	it('should leave regular strings intact', () =>
	{
		strictEqual(escape('foo bar'), 'foo bar');
	});

	it('should escape ~ and /', () =>
	{
		strictEqual(escape('foo~bar/baz'), 'foo~0bar~1baz');
	});
});

describe('unescape', () =>
{
	it('should leave regular strings intact', () =>
	{
		strictEqual(unescape('foo bar'), 'foo bar');
	});

	it('should escape ~ and /', () =>
	{
		strictEqual(unescape('foo~0bar~1baz'), 'foo~bar/baz');
	});

	it('should throw on invalid sequences', () =>
	{
		throws(() => unescape('foo~2bar'));
	});
});
