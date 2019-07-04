# JSON Pointers
**This module uses the ES modules feature and requires Node v8.15.0+.
Please refer to [Node's documentation](https://nodejs.org/api/esm.html#esm_enabling) to read
more on how to enable this functionality in your environment.**

## Installation
```
npm i --save @calmdownval/json-pointers
```

## Features
- both absolute and relative pointers are available
- relative pointers support referencing of array indexes and object keys
- parse and toString methods provided
- escapes and unescapes tilda sequences (`~0`, `~1`)
- respects baseURI of absolute pointers
- can convert between absolute and relative pointers
- includes tests

## Usage
```js
import { AbsolutePointer, RelativePointer } from '@calmdownval/json-pointers';

const object = {
  some: {
    nested: {
      stuff: [ 'foo', 'bar' ],
      lorem: 'ipsum'
    }
  }
}

// create instances using new
const ptr0 = new AbsolutePointer([ 'some', 'nested', 'stuff', 1 ]);
ptr0.unref(object); // returns 'bar'

// or parse from string forms
const ptr1 = AbsolutePointer.parse('/some/nested/lorem');
ptr1.unref(object); // returns 'ipsum'

// regular stringify
ptr0.toString(); // returns '/some/nested/stuff/1'

// or as a URI (only for AbsolutePointer)
ptr1.toURI(); // returns '#/some/nested/lorem'

// get a relative pointer between ptr0 and ptr1
ptr0.getRelativeTo(ptr1); // returns an instance of RelativePointer '2/lorem'

// by entering null path we specify to resolve the index or key
const ptr2 = new RelativePointer(3, null);

// relative pointers require an AbsolutePointer as the point of origin
ptr2.unref(ptr0, object); // returns 'some'

// parsing works the same
const ptr3 = RelativePointer.parse('1/stuff/0');
ptr3.unref(ptr1, object); // returns 'foo'

// get an absolute pointer from an origin
ptr3.getAbsoluteFrom(ptr1); // returns an instance of AbsolutePointer '/some/nested/stuff/1'
```
