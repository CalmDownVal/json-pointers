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
	 * @param {string} baseURI optional URI of the document
	 */
	constructor(path, baseURI = null)
	{
		this.path = path;
		this.baseURI = baseURI;
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
	 * @throws Will throw if there is no path found between the locations.
	 */
	getRelativeTo(pointer)
	{
		if (pointer.baseURI && this.baseURI && pointer.baseURI !== this.baseURI)
		{
			throw new Error('could not find a path to the requested target');
		}

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
	 * Returns the string representation of this AbsolutePointer as a URI string.
	 * @returns {string}
	 */
	toURI()
	{
		const str = this.toString();
		return this.baseURI
			? str ? `${this.baseURI}#${str}` : this.baseURI
			: '#' + str;
	}

	/**
	 * Parses a string as an absolute JSON pointer into a new instance of AbsolutePointer.
	 * @param {string} str the string to parse
	 * @returns {AbsolutePointer} the parsed pointer
	 * @throws Will throw if the string is not a valid absolute JSON pointer.
	 */
	static parse(str)
	{
		const index = str.indexOf('#');
		const slash = index + 1;
		if (str && str[slash] !== '/')
		{
			throw new Error('input string is in invalid format');
		}

		return new AbsolutePointer(
			parse(str, slash),
			index > 0 ? str.slice(0, index) : null);
	}
}
