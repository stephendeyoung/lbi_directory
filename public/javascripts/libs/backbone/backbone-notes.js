// ctor.prototype = parent.prototype;
// This points ctor's prototype to parent's prototype

// child.prototype = new ctor();
// child.prototype is a ctor object whose prototype POINTS TO THE PARENT'S prototype
// but otherwise is empty

// if (protoProps) _.extend(child.prototype, protoProps);
// the child prototype is extended with the instance properties

// Correctly set child's `prototype.constructor`.
// child.prototype.constructor = child;
// Otherwise when we declare 'new child' it will call the parent's constructor

// Simply using Bar.prototype = Foo.prototype will result in both objects sharing the same prototype. Therefore, changes to either object's prototype will affect the prototype of the other as well, which in most cases is not the desired effect.