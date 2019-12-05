const readXlsxFile = require('read-excel-file/node');
const pdf = require('html-pdf');
const fs = require('fs');
const QRCode = require('qrcode');

/*
readXlsxFile("./xls/datos.xlsx")
.then((rows)=>{
    console.log(rows);
})
.catch((err)=>{
    console.log(err);
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


async function main() {
  try {
    const rows = await readXlsxFile('/home/coder/project/etiquetas/src/xls/datos.xlsx');
    const results = rows.map(async (row) => {
      try {
        const qrSVG = await generateQR(row[0]);
        return `
          <div class="padre">
            <div class="cuadroUno">
                <div >
                    <h4>De</h4>
                    <img 
                      src="https://media.licdn.com/dms/image/C4D0BAQFZeIvk4ge6-g/company-logo_200_200/0?e=2159024400&v=beta&t=HyHDJJnaj4spya0vc9cvaOXPdb2taazOL_CirdjQ4MU" 
                      width="50"/>
                    </div>
                <div>
                    <h4>Dirección</h4>
                    <h1>${row[4]}</h1>
                    <h4>Entidad</h4>
                    <h1>${row[1]}</h1>
                    ${qrSVG}
                </div>
            </div>
            <div class="cuadroDos">
                <div>
                    <h4>Ciudad</h4>
                    <h1>${row[5]}</h1>
                </div>
                <div>
                    <h4>Nombre Funcionario</h4>
                    <h1>${row[3]}</h1>
                </div>
            </div>
          </div>`;
      } catch (err) {
        return '';
      }
    });

    const rowsHTML = await Promise.all(results);
    console.log(rowsHTML);

    const newItems = [];
    newItems.push('<section class="sheet padding-10mm">');
    rowsHTML.forEach((element, i) => {
      newItems.push(element);
      if (i % 7 === 0) {
        newItems.push('</section>');
        newItems.push('<section class="sheet padding-10mm">');
      }
    });
    newItems.push('</section>');

    const htmlItems = newItems.reduce((accu, item) => accu + item);
    const html = `
      <style >
        h1{
          font-size:17px;
          margin:5px 0px;
        }
        h4{
          font-size:9px;
          margin:5px 0px;
        }

        .padre{       
            border:1px black solid;     
            margin-bottom: 10px;
            border-radius: 10px;
            overflow: hidden;
            box-sizing: border-box;
        }
        
        .cuadroUno{                   
            display:grid;
            grid-template-columns: 200px auto;
        }

        .cuadroUno div {
            border:1px black solid;
            padding-left:20px;
            padding-right:20px;
            box-sizing: border-box;
        }

        .cuadroDos{
            
            display:grid;
            grid-template-columns: 200px auto;            
        }
        .cuadroDos div{
            padding-left:20px;
            padding-right:20px;
            box-sizing: border-box;
            border:1px black solid;
        }        
      </style>
      ${htmlItems}
    `;

    const htmlFile = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>etiquetas</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.3.0/paper.css">
    </head>
    <body class="A4">
      
        ${html}
      
    </body>
    </html>`;

    pdf.create(htmlFile).toFile('./etiquetas.pdf', (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });

    fs.writeFile('./etiquetas.html', htmlFile, (err) => {
      if (err) {
        return console.log(err);
      }
      console.log('The file was saved!');
      return true;
    });
  } catch (err) {
    console.log(err);
  }
}

main();
