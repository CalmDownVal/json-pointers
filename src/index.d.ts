declare namespace JSONPointers
{
	export class AbsolutePointer
	{
		constructor(path: (string | number)[])

		unref(root: any): any
		getRelativeTo(pointer: AbsolutePointer): RelativePointer
		toString(): string

		static parse(str: string, decodeURI?: boolean): AbsolutePointer
	}

	export class RelativePointer
	{
		constructor(stepsBack: number, path: (string | number)[])

		unref(origin: AbsolutePointer, root: any): any;
		getAbsoluteFrom(pointer: AbsolutePointer): AbsolutePointer
		toString(): string

		static parse(str: string, decodeURI?: boolean): RelativePointer
	}

	export function encode(str: string): string
	export function decode(str: string, decodeURI?: boolean): string
}

export = JSONPointers;
