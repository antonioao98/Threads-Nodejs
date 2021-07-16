const connect = require('../db/connect');

const listItems = new connect.Schema([
  {
    list: { type: String },
    externalBuyerReference: { type: String },
    externalSellerReference: { type: String },
    buyerMobilePhone: { type: String },
    buyerName: { type: String },
    buyerCnpj: { type: String },
    sellerName: { type: String },
    warehouse: { type: String },
    productReferences: { type: Array },
    startDate: { type: Date },
    expiresIn: { type: Date },
    broadcastStatus:{type: String},
    externalListPriceReference: { type: String },
    orderToken: { type: String },
    name: { type: String },
    version: { type: Number },
    createdAt: { type: Date },
    lastModified: { type: Date },
    active: { type: Boolean },
    _class: { type: String },
  },
  {
    versionKey: false, 
  },
]);

const listItemsSchema = connect.model('listItems', listItems);

module.exports = listItemsSchema;