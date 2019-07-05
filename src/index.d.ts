declare namespace JSONPointers
{
	export class AbsolutePointer
	{
		constructor(path: (string | number)[])

		unref(root: any): any
		getRelativeTo(pointer: AbsolutePointer): RelativePointer
		toString(): string

		static parse(str: string): AbsolutePointer
	}

	export class RelativePointer
	{
		constructor(stepsBack: number, path: (string | number)[])

		unref(origin: AbsolutePointer, root: any): any;
		getAbsoluteFrom(pointer: AbsolutePointer): AbsolutePointer
		toString(): string

		static parse(str: string): RelativePointer
	}

	export function escape(str: string): string
	export function unescape(str: string): string
}

export = JSONPointers;
