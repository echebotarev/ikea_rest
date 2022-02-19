const excel = require('excel4node');

const Client = require('./../libs/mongoClient');
const Price = require('./../handlers/price');

const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Sheet 1');

const createXls = async () => {
  const products = await Client.get('product');
  products.forEach((product, index) => {
    worksheet.cell(index + 1, 1).string(product.identifier);
    worksheet
      .cell(index + 1, 2)
      .number(Price.getPrice(product.price.price.mainPriceProps.price.integer));
  });

  workbook.write('Excel.xlsx');

  console.log('Done');
};

setTimeout(async () => {
  await createXls();
}, 2000);
