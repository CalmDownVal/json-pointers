namespace JSONPointers
{
	export class AbsolutePointer
	{
		constructor(path: (string|number)[], baseURI?: string)

		unref(root: any): any
		getRelativeTo(pointer: AbsolutePointer): RelativePointer
		toString(): string
		toURI(): string

		static parse(str: string): AbsolutePointer
	}

	export class RelativePointer
	{
		constructor(path: (string|number)[], baseURI?: string)

		unref(origin: AbsolutePointer, root: any): any;
		getAbsoluteFrom(pointer: AbsolutePointer): AbsolutePointer
		toString(): string

		static parse(str: string): RelativePointer
	}
}

export = JSONPointers;
