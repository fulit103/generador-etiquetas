const pdf = require('html-pdf');

const contenido = `
    <h1>hola mundo</h1>
    <p>esto es una prueba</p>
`;

pdf.create(contenido).toFile('./prueba.pdf', (err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log(res);
  }
});
