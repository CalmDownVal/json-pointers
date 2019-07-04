const hasOwnProperty = Object.prototype.hasOwnProperty;

const escapeMap =
{
	'~' : '~0',
	'/' : '~1'
};

const unescapeMap =
{
	'0' : '~',
	'1' : '/'
};

function escape(str)
{
	const length = str.length;

	let anchor = 0;
	let offset = 0;
	let result = '';

	while (offset < length)
	{
		const sequence = escapeMap[str[offset]];
		if (sequence)
		{
			if (anchor !== offset)
			{
				result += str.slice(anchor, offset);
			}

			result += sequence;
			anchor = offset + 1;
		}
		++offset;
	}

	return anchor === length
		? result
		: result + str.slice(anchor);
}

function unescape(str)
{
	const length = str.length;

	let anchor = 0;
	let offset = 0;
	let result = '';
	let isNumeric = true;

	while (offset < length)
	{
		const charCode = str.charCodeAt(offset);
		if (charCode === 126) // '~' = 126
		{
			const ctrl = offset + 1;
			const char = ctrl < length && unescapeMap[str[ctrl]];
			if (!char)
			{
				throw new Error(`invalid tilda-escape sequence '~${str[ctrl] || 'EOL'}'`);
			}

			if (anchor !== offset)
			{
				result += str.slice(anchor, offset);
			}

			result += char;
			anchor = ctrl + 1;
		}

		isNumeric = isNumeric && isNumber(charCode);
		++offset;
	}

	if (anchor !== length)
	{
		result += str.slice(anchor);
	}

	return isNumeric ? Number(result) : result;
}

export function isNumber(charCode)
{
	return charCode >= 48 && charCode <= 57; // '0' = 48, '9' = 57
}

export function stringify(path)
{
	const length = path.length;

	let result = '';
	for (let i = 0; i < length; ++i)
	{
		const segment = path[i];
		result += '/' + escape(typeof segment === 'number' ? segment.toFixed(0) : segment);
	}

	return result;
}

export function parse(str, offset = 0)
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
				path.push(unescape(str.slice(anchor, i)));
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
