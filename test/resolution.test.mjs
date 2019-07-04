/* eslint-env mocha */
import { strictEqual, throws } from 'assert';
import { AbsolutePointer, RelativePointer } from '../src/index.mjs';

const object =
{
	foo : [ 'bar', 'baz' ],
	highly :
	{
		nested :
		{
			objects : true
		}
	}
};

describe('resolution - AbsolutePointer', () =>
{
	it('should resolve a path', () =>
	{
		const ptr = new AbsolutePointer([ 'foo', 1 ]);
		strictEqual(ptr.unref(object), 'baz');
	});

	it('should throw when unresolvable', () =>
	{
		const ptr = new AbsolutePointer([ 'highly', 'nested', 'birds' ]);
		throws(() => ptr.unref(object));
	});
});

describe('resolution - RelativePointer', () =>
{
	const origin = new AbsolutePointer([ 'highly', 'nested', 'objects' ]);

	it('should resolve a path', () =>
	{
		const ptr = new RelativePointer(3, [ 'foo', 0 ]);
		strictEqual(ptr.unref(origin, object), 'bar');
	});

	it('should resolve a key', () =>
	{
		const ptr = new RelativePointer(2, null);
		strictEqual(ptr.unref(origin, object), 'highly');
	});

	it('should throw when unresolvable', () =>
	{
		const ptr = new RelativePointer(5, null);
		throws(() => ptr.unref(origin, object));
	});
});
