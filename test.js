var test = require('tape');
var PassThrough = require('readable-stream/passthrough');
var Readable = require('readable-stream/readable');
var oneway = require('./');

test("equivalence test", function (t) {
  t.plan(1);

  var hello = str('Hello lovely world'),
      output1 = [], output2 = [];

  /**
   * Oneway
   **/

  var crypto1 = require('crypto').createCipher('aes-256-cbc', 'password');
  crypto1.name = 'crypto1';
  var gzip1 = require('zlib').createGzip();
  gzip1.name = 'gzip1';

  var line = oneway(crypto1, gzip1);
  hello.pipe(line)
  .on('data', function (chunk) {
    output1.push(chunk.toString());
  })

  /**
   * Control
   **/

  var crypto2 = require('crypto').createCipher('aes-256-cbc', 'password');
  var gzip2 = require('zlib').createGzip();

  hello.pipe(crypto2).pipe(gzip2)
  .on('data', function (chunk) {
    output2.push(chunk.toString());
  }).on('end', function() {
    t.deepEqual(output1, output2);
  })

  function str (input) {
    var stream = new Readable;
    stream.push(input);
    stream.push(null);
    return stream;
  }
});

test('should bubble 3 errors from input, through, and output', function (t) {
  t.plan(3);

  var input = new PassThrough;
  var through = new PassThrough;
  var output = new PassThrough;

  var stream = oneway(input, through, output)
  stream.on('error', function (err) {
    t.pass('handles error from ' + err.message);
  });
  input.emit('error', new Error('input'))
  through.emit('error', new Error('through'))
  output.emit('error', new Error('output'))
});