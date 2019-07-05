const encodeMap =
{
	'~' : '~0',
	'/' : '~1'
};

const decodeMap =
{
	'0' : '~',
	'1' : '/'
};

function hex(charCode)
{
	if (charCode >= 48 && charCode <= 57) // '0' = 48, '9' = 57
	{
		return charCode - 48;
	}

	if (charCode >= 97 && charCode <= 102) // 'a' = 97, 'f' = 102
	{
		return charCode - 87;
	}

	if (charCode >= 65 && charCode <= 70) // 'A' = 65, 'F' = 70
	{
		return charCode - 55;
	}

	throw new Error('invalid hexadecimal value');
}

export function isNumber(charCode)
{
	return charCode >= 48 && charCode <= 57; // '0' = 48, '9' = 57
}

/**
 * tilda-encodes the string
 * @param {string} str string to encodes
 * @returns {string} the encoded string
 */
export function encode(str)
{
	const length = str.length;

	let anchor = 0;
	let offset = 0;
	let result = '';

	while (offset < length)
	{
		const sequence = encodeMap[str[offset]];
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

/**
 * decodes a tilda-encoded string
 * @param {string} str string to decodes
 * @param {boolean} decodeURI whether to decodes URI encoding
 * @returns {string} the decoded string
 * @throws Will throw on invalid tilda sequences
 */
export function decode(str, decodeURI)
{
	const length = str.length;
	const push = sequence =>
	{
		result += anchor === offset ? sequence : str.slice(anchor, offset) + sequence;
	};

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
			const char = ctrl < length && decodeMap[str[ctrl]];
			if (!char)
			{
				throw new Error('invalid tilda sequence');
			}

			push(char);
			offset = ctrl;
			anchor = offset + 1;
		}
		else if (decodeURI === true && charCode === 37) // '%' = 37
		{
			if (offset + 2 >= length)
			{
				throw new Error('invalid percent sequence');
			}

			push(String.fromCharCode((hex(str.charCodeAt(offset + 1)) << 4) | hex(str.charCodeAt(offset + 2))));
			offset += 2;
			anchor = offset + 1;
		}
		else if (decodeURI === true && charCode === 43) // '+' = 43
		{
			push(' ');
			anchor = offset + 1;
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
