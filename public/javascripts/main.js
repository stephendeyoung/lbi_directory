require.config({
  paths: {
    jquery: 'libs/jquery/jquery',
    underscore: 'libs/underscore/underscore',
    backbone: 'libs/backbone/backbone',
    d3: 'libs/d3/d3',
    text: 'libs/require/text',
    handlebars: 'libs/handlebars/handlebars'
  },
  shim: {
  	'd3': {
  		exports: 'd3'
  	},
  	'handlebars': {
  		exports: 'Handlebars'
  	}
  }

});
