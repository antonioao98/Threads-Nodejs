const modelBuyers = require('../model/buyer');

async function find(query) {
  return await modelBuyers.find(query,{cnpj:1, externalReference: 1, warehouse:1, _id:0});
}

module.exports = { find };
