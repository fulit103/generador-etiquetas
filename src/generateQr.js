const QRCode = require('qrcode');

/*
QRCode.toString('I am a pony!', { type: 'svg' }, (_err, url) => {
  console.log(url);
});
*/

const generateQR = (code) => new Promise((resolve, reject) => {
  QRCode.toString(code, { type: 'svg' }, (_err, url) => {
    if (_err) {
      reject(_err);
    }
    resolve(url);
  });
});

const main = async () => {
  try {
    const qr = await generateQR('hola mundo');
    console.log(qr);
  } catch (err) {
    console.log(err);
  }
};

main();
