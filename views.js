var Handlebars = require('handlebars'),
        Path = require('path');

module.exports =
        {
          engines: {
            html: Handlebars.create()
          },
          path: Path.join(__dirname, 'views'),
          layoutPath: Path.join(__dirname, 'views/layout'),
          layout: true,
          partialsPath: Path.join(__dirname, 'views/partials')
        }
;
