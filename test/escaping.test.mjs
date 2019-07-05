/* eslint-env mocha */
import { strictEqual, throws } from 'assert';
import { encode, decode } from '../src/index.mjs';

describe('encode', () =>
{
	it('should leave regular strings intact', () =>
	{
		strictEqual(encode('foo bar'), 'foo bar');
	});

	it('should encode ~ and /', () =>
	{
		strictEqual(encode('foo~bar/baz'), 'foo~0bar~1baz');
	});
});

describe('decode', () =>
{
	it('should leave regular strings intact', () =>
	{
		strictEqual(decode('foo bar'), 'foo bar');
	});

	it('should decode ~ and /', () =>
	{
		strictEqual(decode('foo~0bar~1baz'), 'foo~bar/baz');
	});

	it('should ignore URL encoded groups', () =>
	{
		strictEqual(decode('foo%20baz+bar'), 'foo%20baz+bar');
	});

	it('should decode URL encoded groups when explicitly enabled', () =>
	{
		strictEqual(decode('foo%20baz+bar', true), 'foo baz bar');
	});

	it('should throw on invalid sequences', () =>
	{
		throws(() => decode('foo~2bar'));
	});
});
