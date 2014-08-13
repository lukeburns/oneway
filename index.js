var util = require('util');
var PassThrough = require('readable-stream/passthrough');
var duplexer = require('duplexer2');

module.exports = oneway;

function oneway () {
  var options;
  if (arguments[0] && !arguments[0].pipe) {
    options = Array.prototype.shift.call(arguments);
  }

  var streams = prepare(arguments);
  if (streams.length < 1) {
    return new PassThrough;
  }

  var first = streams[0];
  var last = streams[streams.length - 1];
  var duplex = duplexer(options, first, last);

  streams.reduce(function (src, dest, i) {
    if ((!options || options.bubbleErrors !== false) && i != streams.length - 1) {
      dest.on('error', duplex.emit.bind(duplex, 'error'));
    }
    return src.pipe(dest);
  });

  duplex.on('pipe', function (src) {
    src.unpipe(duplex);
    src.pipe(first);
  });

  return duplex;
}

function prepare (args) {
  return Array.prototype.concat.apply([], args).filter(function (stream) {
    return Boolean(stream) && Boolean(stream.pipe);
  });
}