const modelListItems = require('../model/listItem');

async function findAllPerQuery(query) {
  return await modelListItems.find(query,{externalBuyerReference: 1, warehouse:1, _id:0});
}

async function update(filter, data) {
  return await modelListItems.updateOne(filter,{ $set: data });
}


module.exports = { findAllPerQuery, update };
