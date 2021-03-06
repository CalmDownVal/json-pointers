/* eslint-env mocha */
import { strictEqual, deepStrictEqual, throws } from 'assert';
import { AbsolutePointer, RelativePointer } from '../src/index.mjs';

describe('string operations - AbsolutePointer', () =>
{
	it('should parse a simple pointer', () =>
	{
		const ptr = AbsolutePointer.parse('/a/b/c');
		deepStrictEqual(ptr.path, [ 'a', 'b', 'c' ]);
	});

	it('should parse empty', () =>
	{
		const ptr = AbsolutePointer.parse('');
		deepStrictEqual(ptr.path, []);
	});

	it('should detect and parse numbers', () =>
	{
		const ptr = AbsolutePointer.parse('/a/42/c');
		deepStrictEqual(ptr.path, [ 'a', 42, 'c' ]);
	});

	it('should decode tildas', () =>
	{
		const ptr = AbsolutePointer.parse('/some~0fancy~1stuff');
		deepStrictEqual(ptr.path, [ 'some~fancy/stuff' ]);
	});

	it('should reject invalid string', () =>
	{
		throws(() => AbsolutePointer.parse('lorem ipsum'));
	});

	it('should stringify simple pointers', () =>
	{
		const ptr = new AbsolutePointer([ 'a', 'b', 'c' ]);
		strictEqual(ptr.toString(), '/a/b/c');
	});

	it('should stringify empty pointers', () =>
	{
		const ptr = new AbsolutePointer([]);
		strictEqual(ptr.toString(), '');
	});

	it('should stringify with tilda encoding', () =>
	{
		const ptr = new AbsolutePointer([ 'x~y', 13, 'a/b' ]);
		strictEqual(ptr.toString(), '/x~0y/13/a~1b');
	});
});

describe('string operations - RelativePointer', () =>
{
	it('should parse stepsBack alone', () =>
	{
		const ptr = RelativePointer.parse('123');
		strictEqual(ptr.stepsBack, 123);
		deepStrictEqual(ptr.path, []);
	});

	it('should parse key pointer', () =>
	{
		const ptr = RelativePointer.parse('42#');
		strictEqual(ptr.stepsBack, 42);
		strictEqual(ptr.path, null);
	});

	it('should parse with path', () =>
	{
		const ptr = RelativePointer.parse('42/a/b/c');
		strictEqual(ptr.stepsBack, 42);
		deepStrictEqual(ptr.path, [ 'a', 'b', 'c' ]);
	});

	it('should detect and parse numbers', () =>
	{
		const ptr = RelativePointer.parse('42/a/42/c');
		strictEqual(ptr.stepsBack, 42);
		deepStrictEqual(ptr.path, [ 'a', 42, 'c' ]);
	});

	it('should decode tildas', () =>
	{
		const ptr = RelativePointer.parse('42/some~0fancy~1stuff');
		deepStrictEqual(ptr.path, [ 'some~fancy/stuff' ]);
	});

	it('should reject invalid string', () =>
	{
		throws(() => RelativePointer.parse('lorem ipsum'));
	});

	it('should stringify stepsBack alone', () =>
	{
		const ptr = new RelativePointer(42, []);
		strictEqual(ptr.toString(), '42');
	});

	it('should stringify key pointers', () =>
	{
		const ptr = new RelativePointer(42, null);
		strictEqual(ptr.toString(), '42#');
	});

	it('should stringify with path', () =>
	{
		const ptr = new RelativePointer(42, [ 'a', 'b', 'c' ]);
		strictEqual(ptr.toString(), '42/a/b/c');
	});

	it('should stringify with tilda encoding', () =>
	{
		const ptr = new RelativePointer(42, [ 'x~y', 13, 'a/b' ]);
		strictEqual(ptr.toString(), '42/x~0y/13/a~1b');
	});
});
