var url = require('url');
var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var pg = require('pg');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/times', function(request, response) {
  var result = '';
  var times = process.env.TIMES || 5;
  while(times--) {
    result += `${times} `;
  }
  response.send(result);
});

app.get('/db', function(request, response) {
  const params = url.parse('postgres://ldwxuxokovausm:bc2b5bbaa679213d612a3baef3e360dba473ea3b4fbdd737e26781200e0721c6@ec2-54-221-221-153.compute-1.amazonaws.com:5432/d9bf6q69jmb59f');
  const auth = params.auth.split(':');
  
  const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };

  var pool = new pg.Pool(config);

  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();

      if (err) {
        console.log(err);
        response.end(`Error: ${err}`);
      } else {
        response.send('/pages/db', { results: result.rows });
      }
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
