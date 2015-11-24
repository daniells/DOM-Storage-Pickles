/* 
    DOM STORAGE PICKLES                 (c) Daniel Swartzendruber 2015      MIT License (MIT)  

    Extentions that give localStorage and sessionStorage object-aware pickling mechanisms.
    Supports numbers, objects, arrays, regexps, and functions.
   
    This uses text analysis, so if you're storing the text of a rexep or function to 
    use as text simply use Storage.getItem(key) as you normally would. 
   
    Supported methods include:

        //// Core Methods
        this.set(key, item)  // Pickles an object, array, number, regex, or function
        this.get(key)        // Unpickles and returns the stored item as the correct datatype.
        this.has(key)        // Tests for the presence of data stored on _key_
        this.del(key)        // Removes the data stored on _key_.  Returns true if deleted, False if there was no data.
        this.keys()          // Returns a list of keys in the store.  Returns false if nothing is stored.
        this.clean()         // Removes all data in the store.

        //// Array Accessor Methods
        this.concat(key, array)  //  returns a concatted array from stored array: does not modify stored
        this.indexOf(key, searchElement[, fromIndex])  //  returns the index of element in the array stored on key
        this.item(key, index)  //  if key refers to an array, returns the item at index
        this.len(key)  //  if key refers to an array, returns its length property
        this.push(key, item)  //  pushes item onto the stored array
        this.pop(key)  //  pops first item from the stored array
        this.shift(key, item)  //  pushes item onto the stored array
        this.unshift(key)  //  pops first item from the stored array
        this.reverse(key)  //  reverses the array, saves, and returns it 
        this.slice(key, fromIndex[, toIndex]) // returns a slice of the array

        //// Object Accessor Methods
        this.getValue(key, objkey) //  returns the value of objkey on the object at storekey
        this.keys(key)  //  if item stored at key is an object, returns a list of its keys
        this.rmValue(key, objkey)  //  sets value on objkey on the object stored at key
        this.setValue(key, objkey, value)  //  sets value on objkey on the object stored at key

    If you use an accessor function on a stored object of the wrong datatype, the method will return false.
   
    i.e. if foo is not an array
        this.length('foo'); 
    will return false.
*/
(function(){

    /* Setting up identical methods on two similar objects, so we'll do it in a two-iteration loop */
    var stores = [localStorage, sessionStorage];
    for(var i = 0 ; i!== stores.length ; i++){

        /*                */
        /*  CORE METHODS  */
        /*                */

        /* Pickle an obj, array, regex, or function */
        Object.defineProperty(stores[i], 'set', {
            value:function(key,item){ 
                if(item.constructor == RegExp || item.constructor == Function || item.constructor == Number) item = item.toString();
                else try{item = JSON.stringify(item);} catch(e){} /* no catch nessecary. if not regex num or func, and stringify fails, it's a string. */
                this.setItem(key, item);
            }
        });
        /* Unpickle an obj, array, regex, or function */
        Object.defineProperty(stores[i], 'get', {
            value:function(key){  
                var item = this.getItem(key);
                if(item == null) throw('No data stored on the key "' + key + '".'); /* we throw an error because 'false' and 'null' are also valid data */
                else if(item && RegExp(/^\/.*\/\D{0,4}/gi).test(item)){/* is it a RegExp? */
                    var match = item.match(new RegExp('^/(.*?)/([gimy]*)$')); 
                    item = new RegExp(match[1], match[2]);
                }
                else if(item && RegExp(/^function\s\(.*\}$/gi).test(item))/*is it a Function?*/
                    item = eval( '(' + item + ')' ); /* function srting needs to be encapsulated in JS lambda context */
                else try{ item = JSON.parse(item); } catch(e){} /* unpickles arrays, objects, numbers.  if it falls through all that's left are strings */
                return item; 
            }
        });
        /* Return a list of keys saved on the Storage object, false if no keys */
        Object.defineProperty(stores[i], 'keys', {
            value:function(key){  
                var keys = Object.keys(this);
                return keys.length ? keys : false;
            }
        });
        /* Check for the presence of a key in the storeage object */
        Object.defineProperty(stores[i], 'has', {
            value:function(key){  
                return this[key] ? true : false;
            }
        });
        /* Remove a stored item */
        Object.defineProperty(stores[i], 'del', {
            value:function(key){  
                if(this[key]){
                    delete this[key];
                    return true;
                } else return false;
            }
        });
        /* Remove all stored items */
        Object.defineProperty(stores[i], 'clean', {
            value:function(){  
                var storagekeys = Object.keys(this);
                for(var key in this) delete this[key];
            }
        });

        /*                          */
        /*  ARRAY ACCESSOR METHODS  */
        /*                          */

        /* Get length of the array */
        Object.defineProperty(stores[i], 'len', {
            value:function(key){ 
                var stored = this.get(key);
                if(stored.constructor == Array) return stored.length;
                else return false;
            }
        });
        /* Get an item at index of the stored array */
        Object.defineProperty(stores[i], 'item', {
            value:function(key, index){ 
                var stored = this.get(key);
                if(stored.constructor == Array)
                    return stored[index];
                else return false;
                return true;
            }
        });
        /* Return the index of an item in a stored array */
        Object.defineProperty(stores[i], 'indexOf', {
            value:function(){ 
            var stored = this.get(arguments[0]);
                if(stored.constructor == Array){
                    if(arguments.length == 2)
                        return stored.indexOf(arguments[1]);
                    else if(arguments.length >= 3)
                         return stored.indexOf(arguments[1],arguments[2]);
                    else throw("Storage.indexOf() requires at least 2 arguments.");
                } else return false;
            }
        });
        /* Push an item to the array, return length of array */
        Object.defineProperty(stores[i], 'push', {
            value:function(key,item){ 
                var stored = this.get(key);
                var retval = false;
                if(stored.constructor == Array){
                    retval = stored.push(item);
                    this.set(key, stored );
                } return retval;
            }
        });
        /* Pop an item from the array */
        Object.defineProperty(stores[i], 'pop', {
            value:function(key){ 
                var stored = this.get(key);
                if(stored.constructor == Array){
                    var item = stored.pop();
                    this.set(key, stored);
                    return item;
                } else return false;
            }
        });
        /* Push an item to the array, return length of array */
        Object.defineProperty(stores[i], 'shift', {
            value:function(key,item){ 
                var stored = this.get(key);
                var retval = false;
                if(stored.constructor == Array){
                    retval = stored.shift(item);
                    this.set(key, stored );
                } return retval;
            }
        });
        /* Pop an item from the array */
        Object.defineProperty(stores[i], 'unshift', {
            value:function(key){ 
                var stored = this.get(key);
                if(stored.constructor == Array){
                    var item = stored.unshift();
                    this.set(key, stored);
                    return item;
                } else return false;
            }
        });     
        /* Reverse the array, save, and return it. */
        Object.defineProperty(stores[i], 'reverse', {
            value:function(key){ 
                var stored = this.get(key);
                if(stored.constructor == Array){
                    stored = stored.reverse();
                    this.set(key, stored);
                    return stored;
                } else return false;
            }
        });
        /* Concat an array onto the stored array.  */
        Object.defineProperty(stores[i], 'concat', {
            value:function(key, array){ 
                var stored = this.get(key);
                var retval = false;        
                if(stored.constructor == Array) retval = stored.concat(array);
                return retval;
            }
        });
        /* Removes the first element from an array and returns that element */
        Object.defineProperty(stores[i], 'slice', {
            value:function(){ 
                var stored = this.get(arguments[0]);
                var slice = false;
                if(stored.constructor == Array){
                    if(arguments.length == 2) slice = stored.slice(arguments[1]);
                    else if(arguments.length == 3) slice = stored.slice(arguments[1],arguments[2]);
                    else throw("Wrong number of arguments for this.slice()");
                } return slice;
            }
        });
        
        /*                          */
        /* OBJECT ACCESSOR METHODS  */
        /*                          */

        /* Return a list of keys from a stored object */
        Object.defineProperty(stores[i], 'getKeys', {
            value:function(key){ 
                var stored = this.get(key);
                if(stored.constructor == Object) return Object.keys(stored);
                else return false;
            }
        });
        /* Return the value of objkey on the object stored at key */
        Object.defineProperty(stores[i], 'getValue', {
            value:function(key,objkey){
                var stored = this.get(key);
                if(stored.constructor == Object) return stored[objkey];
                else return false;
            }
        });
        /* Set a value on a stored object.   */
        Object.defineProperty(stores[i], 'setValue', {
            value:function(key,objkey,value){ 
                var stored = this.get(key);
                if(stored.constructor == Object){
                    stored[objkey] = value;
                    this.set(key, stored);
                } else return false;
                return true;
            }
        });
        /* Delete a value from a stored object. */
        Object.defineProperty(stores[i], 'rmValue', {
            value:function(key,objkey){ 
                var stored = this.get(key);
                if(stored.constructor == Object){
                    delete stored[objkey];
                    this.set(key, stored);
                } else return false;
                return true;
            }
        });
    }
})();