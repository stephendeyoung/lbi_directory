LBi Directory
============

This application came out of the [LBi](http://www.lbi.com/uk/) Interface Development team's "Hack sessions". We had to build a tool to enable users to view LBi staff members across the world using data from LBi's LDAP network.

Due to data protection issues I haven't provided access to the original data. Dummy data is generated instead.

You can view the application in full here: http://ec2-176-34-85-105.eu-west-1.compute.amazonaws.com:8080/.

Installation
------------

This app requires you to have [Node.js](http://nodejs.org/) and [MongoDB](http://www.mongodb.org/) installed on your system.

First clone the repo:

```git clone https://github.com/stephendeyoung/lbi_directory```

Then install the dependencies:

```cd lbi_directory```
```npm install```

Generate the dummy JSON data:

```node data/generateDummyJSON.js```

Start the app:

```node app.js```

Then go to http://localhost:8080 in your browser.

If you require authentication to gain access to the MongoDB database or the host or port number is different from the default then edit these details in the ```data/generateDummyJSON.js``` and ```app.js``` files.

Tools used
----------

* [Node.js](http://nodejs.org/)
* [MongoDB](http://www.mongodb.org/)
* [Backbone.js](http://backbonejs.org/)
* [Require.js](http://requirejs.org/)
* [D3.js](http://d3js.org/)
* [Handlebars.js](http://handlebarsjs.com/)
* [jQuery.js](http://jquery.com/)


