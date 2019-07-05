import { encode, decode } from './tilda.mjs';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export function stringify(path)
{
	const length = path.length;

	let result = '';
	for (let i = 0; i < length; ++i)
	{
		const segment = path[i];
		result += '/' + encode(typeof segment === 'number' ? segment.toFixed(0) : segment);
	}

	return result;
}

export function parse(str, offset, decodeURI)
{
	const path = [];
	const length = str.length;

	let anchor = offset + 1;
	for (let i = anchor; i <= length; ++i)
	{
		if (i === length || str[i] === '/')
		{
			if (anchor !== i)
			{
				path.push(decode(str.slice(anchor, i), decodeURI));
			}
			anchor = i + 1;
		}
	}

	return path;
}

export function traverse(root, path, count = path.length)
{
	for (let i = 0; i < count; ++i)
	{
		if (root && typeof root === 'object')
		{
			const segment = path[i];
			const canTraverse = typeof segment === 'number' && Array.isArray(root)
				? segment < root.length
				: hasOwnProperty.call(root, segment);

			if (canTraverse)
			{
				root = root[segment];
				continue;
			}
		}
		throw new Error('could not dereference the pointer');
	}
	return root;
}
