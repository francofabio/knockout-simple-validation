#knockout-simple-validation (ksv)


This is a simple JavaScript library to validate knockout (http://knockoutjs.com) models.

_<sub>My english is terrible, therefore, any revision will be welcome</sub>_

##Dependencies

```
- jquery-1.4.1 or higher
- knockout-2.0 or higher
- momentjs-2.8 or higher
```
All dependencies are available in directory lib/vendor.

##Built-in validation rules
* required: Makes the observable property be required
* email: Makes the observable property accept only email
* url: Makes the observable property accept only url
* nativeDate: Makes the observable property accept only a JavaScript Date object
* date: Makes the observable property accept only a date as string in specific format
* number: Makes the observable property accept only number objects
* interger: Makes the observable property accept only number objects without decimal values.
* max: Makes the observable property accept only values less than or equals to the specified value
* min: Makes the observable property accept only values great than or equals to the specified value
* maxlength: Makes the observable property accept only string values with length less than or equals to specified value
* minlength: Makes the observable property accept only string values with length great than or equals to specified value
* rangelength: Makes the observable property accept only string values with length in specified range
* equalsTo: Makes the observalbe property accept only values equals to other property
* remote: Makes the observable property to request a resource to check if value is valid

##Quickstart
To use ksv in your project you have include the ksv.js script and its dependencies in your page.

The two examples below demonstrate a basic use of the library.
```html
<html>
  <head>
    <title>knockout simple validation (ksv) - simple example</title>
  </head>
  <body>
    <form>
       <labe for="name">Name:</label><br/>
       <input type="text" id="name" data-bind="value: name"><br/>
       <span data-bind="text: name.error"></span><br/><br/>
       <labe for="email">E-mail:</label><br/>
       <input type="text" id="email" data-bind="value: email"><br/>
       <span data-bind="text: email.error"></span><br/>
    </form>
    <script src="assets/js/vendor/jquery-2.1.1.min.js"></script>
    <script src="assets/js/vendor/knockout-3.2.0.min.js"></script>
    <script src="assets/js/vendor/moment-2.8.3.min.js"></script>
    <script src="assets/js/vendor/ksv.min.js"></script>
    <script>
       function PersonModel() {
         this.name = ko.observable().extend({validator: {required: true}});
         this.email = ko.observable().extend({validator: {required: true, email: true}});
         this.age = ko.observable().extend({validator: {number: true, min: 18, max: 90}});
       }
       var personModel = new PersonModel();
       ko.applyBindings(personModel);
    </script>
  </body>
</html>
```


```html
<html>
  <head>
    <title>knockout simple validation (ksv)</title>
  </head>
  <body>
    <form>
       <labe for="name">Name:</label><br/>
       <input type="text" id="name" data-bind="value: name"><br/>
       <span data-bind="text: name.error"></span><br/><br/>
       <labe for="email">E-mail:</label><br/>
       <input type="text" id="email" data-bind="value: email"><br/>
       <span data-bind="text: email.error"></span><br/>
       <input type="submit" value="Submit" data-bind="enable: isValid">
    </form>
    <script src="assets/js/vendor/jquery-2.1.1.min.js"></script>
    <script src="assets/js/vendor/knockout-3.2.0.min.js"></script>
    <script src="assets/js/vendor/moment-2.8.3.min.js"></script>
    <script src="assets/js/vendor/ksv.min.js"></script>
    <script>
       function PersonModel() {
         var self = this;
         ksv.notification.makeObservable(this);
         //The owner parameter represents the object that property is hosted
         this.name = ko.observable().extend({validator: {required: true, params: {owner: this}}});
         this.email = ko.observable().extend({validator: {required: true, email: true, params: {owner: this}}});
         this.age = ko.observable().extend({validator: {number: true, min: 18, max: 90, params: {owner: this}}});
       }
       var personModel = new PersonModel();
       ko.applyBindings(personModel);
    </script>
  </body>
</html>
```