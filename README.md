# oneway
a duplex stream for handling pipelines. 

## usage
```
var oneway = require('oneway');
oneway([options], stream1, stream2, ...);
```

  - options `object`
    - bubbleErrors `boolean` defaults to true

## example
Below, `way` is a duplex stream whose writable half is `cipher` and readable half is `decipher`:

```
var way = oneway(cipher, through, decipher);
```
`way` repipes

```
fs.createReadStream('README.md').pipe(way).pipe(process.stdout);
```
into

```
fs.createReadStream('README.md').pipe(cipher).pipe(through).pipe(decipher).pipe(process.stdout)
```

## installation
```
npm install oneway
```