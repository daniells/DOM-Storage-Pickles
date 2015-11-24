# DOM Storage Pickles
##### Object-aware DOM Storage methods

This little library extends **localStorage** and **sessionStorage** with methods that let you store and retrieve various datatypes.
It also adds _accessor methods_ for arrays and objects that allow you to retrieve, insert, and delete values from them.

##### Supported datatypes:
* Objects
* Arrays
* RegExps
* Functions
* Numbers
* Strings

##### Features:
1. All methods are available on _localStorage_  and _sessionStorage_
2. Objects and Arrays of arbitrary complexity are supported (uses the JSON API)
3. If fetched value wasn't recognized as another datatype, it was probably a string and gets returned as such
4. Accessor methods return what you'd expected from their JS counterparts
5. Accessor methods modify stored data in-place as you'd expect from their JS counterparts 
6. If an accessor method is used on the wrong datatype the method returns false and the stored data is untouched

##### Caveats: 
1. These methods cannot store object references
2. Likewise they do not store data from within closures
3. They are for saving data, regex patterns, and simple functions
4. They engender disk access, and can reduce perfomance, so watch your Big Os

For more information about DOM Storage, see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

## Core Methods

**Storage.set(**_key_**,** _item_**)**  //  Pickles an object, array, regex, number, or function

**Storage.get(**_key_**)**  //  Unpickles and returns the stored item as the correct datatype

**Storage.has(**_key_**)**  //  tests for the presence of data stored on _key_

**Storage.del(**_key_**)**  //  Removes the data stored on _key_.  Returns true if deleted, false if there was no data.

**Storage.keys()**  //  Returns a list of the keys in the store.  Returns false if nothing is stored.

**Storage.clean()**  //  Removes all data in the store


## Array Accessors 
Where a normal Array method would modify the array in place, so will its corollary here.  It will also have the return value you expect.

**Storage.concat(**_key_**,** _array_**)**  //  returns a concatenated array from the store and the _array_ stored on _key_

**Storage.indexOf(**_key_**,** _searchIndex_**[,** _fromIndex_**])**  //  returns index of _searchIndex_

**Storage.item(**_key_**,** _index_**)**  //  if _key_ refers to an array, returns the item at _index_

**Storage.len(**_key_**)**  //  if _key_ refers to an array, returns its length property

**Storage.pop(**_key_**)**  //  pops an item from the end of the array stored on _key_ (modifies it in place)

**Storage.push(**_key_**,** _item_**)**  //  pushes _item_ onto the end of the stored array, returns new length

**Storage.reverse(**_key_**)**  //  perfoms a array.reverse() on the stored array in place and also returns the result

**Storage.slice(**_key_**,** _fromIndex_**[,** _toIndex_**])**  //  returns a slice from the array

**Storage.shift(**_key_**,** _item_**)**  //  shifts _item_ onto the beginning stored array, returns new length

**Storage.unshift(**_key_**)**  //  unshifts an item from the beginning of the array stored on _key_ (modifies it in place)


## Object Accessors 

**Storage.getValue(**_key_**,** _objkey_**)** //  returns the value of _objkey_ on the object at _key_

**Storage.getKeys(**_key_**)**  //  if item stored at _key_ is an object, returns an array of its keys

**Storage.rmValue(**_key_**,** _objkey_**)**  //  deletes the value _objkey_ on the object stored at _key_

**Storage.setValue(**_key_**,** _objkey_**,** _value_**)**  //  sets _value_ on _objkey_ on the object stored at _key_

## Examples
    localStorage.set('bugs', ["ants","beetles","mayflies"]); // Stores an array on the key 'bugs'
    localStorage.get('bugs'); // Returns the array
    localStorage.item('bugs',1); // Returns "beetles"
    
    localStorage.set('mybug', {name:"gregor",species:"roach"}); // Stores an object 
    localStorage.get('mybug'); // Returns the object
    localStorage.getValue('mybug','species'); // Returns "roach"
    localStorage.item('mybug', 1) // Returns false because this wasn't an array
    
    var email_regex = new RegExp(/\w*@\w*\.\D{3}/gi);  // A simple regex to find email addresses
    localStorage.set("myregx", email_regex);  // Stores the regex pattern
    localStorage.get("myregx");  // Returns a new RegExp identical to the original using the pattern
    
    var myFunction = function(){alert("Hello, World!");};  // Define a function
    localStorage.set('myfunc',myFunction); // Pickles the function
    localStorage.get('myfunc'); // Returns a new function identitcal to the original
    
    localStorage.set('mynum', 123.4); // Pickles the number
    localStorage.get('mynum'); // Returns the number 123.4
    
    localStorage.has('mynum');  // Returns true
    localStorage.del('mynum');  // Deletes the stored number and returns true

    localStorage.keys();  // Returns ["bugs", "mybug", "myfunc", "myregx"]
    
    localStorage.clean();  // Purges all of the stored data  
    
    localStorage.keys();  // Returns false
    
These methods all exist on _sessionStorage_ too.

