import RelativePointer from './RelativePointer.mjs';
import { traverse, stringify, parse } from './shared.mjs';

/**
 * Represents an absolute JSON Pointer
 */
export default class AbsolutePointer
{
	/**
	 * Constructs a new instance of AbsolutePointer
	 * @param {(string|number)[]} path path to the location
	 */
	constructor(path)
	{
		this.path = path;
	}

	/**
	 * Uses the pointer to resolve a nested value stored in the given object.
	 * @param {any} root the object to use as root for the lookup
	 * @returns {any} the resolved nested value
	 * @throws Will throw if the path does not exist under the given object.
	 */
	unref(root)
	{
		return traverse(root, this.path);
	}

	/**
	 * Builds a pointer relative to this location pointing to the specified target.
	 * @param {AbsolutePointer} pointer the target
	 * @returns {RelativePointer} the resulting relative pointer
	 */
	getRelativeTo(pointer)
	{
		const a = this.path;
		const b = pointer.path;
		const length = Math.min(a.length, b.length);

		let offset = 0;
		while (offset < length && a[offset] === b[offset])
		{
			++offset;
		}

		return new RelativePointer(a.length - offset, b.slice(offset));
	}

	/**
	 * Returns the string representation of this AbsolutePointer.
	 * @returns {string}
	 */
	toString()
	{
		return stringify(this.path);
	}

	/**
	 * Parses a string as an absolute JSON pointer into a new instance of AbsolutePointer.
	 * @param {string} str the string to parse
	 * @returns {AbsolutePointer} the parsed pointer
	 * @throws Will throw if the string is not a valid absolute JSON pointer.
	 */
	static parse(str)
	{
		if (str && str[0] !== '/')
		{
			throw new Error('input string is in invalid format');
		}
		return new AbsolutePointer(parse(str));
	}
}
