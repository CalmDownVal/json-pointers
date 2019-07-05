import AbsolutePointer from './AbsolutePointer.mjs';
import { traverse, stringify, parse } from './shared.mjs';
import { isNumber } from './tilda.mjs';

/**
 * Represents a relative JSON Pointer
 */
export default class RelativePointer
{
	/**
	 * Constructs a new instance of AbsolutePointer
	 * @param {number} stepsBack the amount of steps back
	 * @param {(string|number)[]} path the path to the location, set to null to represent the key
	 */
	constructor(stepsBack = 0, path)
	{
		this.stepsBack = stepsBack;
		this.path = path;
	}

	/**
	 * Uses the pointer to resolve a nested value stored in the given object.
	 * @param {AbsolutePointer} origin the point of origin for resolution
	 * @param {any} root the object to use as root for the lookup
	 * @returns {any} the resolved nested value
	 * @throws will throw if the path does not exist under the given object
	 */
	unref(origin, root)
	{
		const offset = origin.path.length - this.stepsBack;
		if (offset < 0 || (offset === 0 && this.path === null))
		{
			throw new Error('cannot traverse beyond the root');
		}

		if (this.path === null)
		{
			return origin.path[offset - 1];
		}

		// use the initial part of the origin pointer
		root = traverse(root, origin.path, offset);

		// then apply the path of this pointer
		return traverse(root, this.path);
	}

	/**
	 * Builds an absolute pointer poiting to the combination of the origin and this relative pointer.
	 * @param {AbsolutePointer} origin the point of origin for resolution
	 * @returns {AbsolutePointer} the resulting absolute pointer.
	 * @throws will throw if there is no path found between the locations
	 */
	getAbsoluteFrom(origin)
	{
		if (this.path === null)
		{
			throw new Error('absolute pointers cannot point to a key');
		}

		const offset = origin.path.length - this.stepsBack;
		if (offset < 0)
		{
			throw new Error('cannot traverse beyond the root');
		}

		const length = this.path.length;
		const path = new Array(offset + this.path.length);

		for (let i = 0; i < offset; ++i)
		{
			path[i] = origin.path[i];
		}

		for (let i = 0; i < length; ++i)
		{
			path[offset + i] = this.path[i];
		}

		return new AbsolutePointer(path);
	}

	/**
	 * Returns the string representation of this RelativePointer.
	 * @returns {string}
	 */
	toString()
	{
		return this.stepsBack + (this.path === null ? '#' : stringify(this.path));
	}

	/**
	 * Parses a string as a relative JSON pointer into a new instance of RelativePointer.
	 * @param {string} str the string to parse
	 * @param {boolean} decodeURI whether to decode URI encoding
	 * @returns {RelativePointer} the parsed pointer
	 * @throws Will throw if the string is not a valid relative JSON pointer.
	 */
	static parse(str, decodeURI = false)
	{
		const length = str.length;

		let charCode = null;
		let index = 0;

		while (index < length && isNumber(charCode = str.charCodeAt(index)))
		{
			++index;
		}

		if (length === 0 || !(charCode === 47 || charCode === 35 || isNumber(charCode))) // '/' = 47, '#' = 35
		{
			throw new Error('input string is in invalid format');
		}

		return new RelativePointer(
			Number(str.slice(0, index)),
			charCode === 35 ? null : parse(str, index, decodeURI));
	}
}
