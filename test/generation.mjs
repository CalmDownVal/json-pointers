/* eslint-env mocha */
import { strictEqual, deepStrictEqual, throws } from 'assert';
import { AbsolutePointer, RelativePointer } from '../src/index.mjs';

describe('generation - AbsolutePointer', () =>
{
	it('should genearate a valid pointer', () =>
	{
		const source = new AbsolutePointer([ 'a', 'b', 'c', 'd' ]);
		const dest = new AbsolutePointer([ 'a', 'x', 'y' ]);
		const ptr = source.getRelativeTo(dest);
		strictEqual(ptr.stepsBack, 3);
		deepStrictEqual(ptr.path, [ 'x', 'y' ]);
	});

	it('should throw when unresolvable', () =>
	{
		const source = new AbsolutePointer([], 'org1.com');
		const dest = new AbsolutePointer([], 'org2.com');
		throws(() => source.getRelativeTo(dest));
	});
});

describe('generation - RelativePointer', () =>
{
	it('should genearate a valid pointer', () =>
	{
		const origin = new AbsolutePointer([ 'a', 'b', 'c', 'd' ]);
		const dest = new RelativePointer(3, [ 'x', 'y' ]);
		const ptr = dest.getAbsoluteFrom(origin);
		deepStrictEqual(ptr.path, [ 'a', 'x', 'y' ]);
	});

	it('should throw when unresolvable', () =>
	{
		const origin = new AbsolutePointer([]);
		const dest = new RelativePointer(3, [ 'x', 'y' ]);
		throws(() => dest.getAbsoluteFrom(origin));
	});

	it('should throw when pointing to a key', () =>
	{
		const origin = new AbsolutePointer([ 'x' ]);
		const dest = new RelativePointer(0, null);
		throws(() => dest.getAbsoluteFrom(origin));
	});
});
