const connect = require('../db/connect');

const Buyer = new connect.Schema([
  {
    lastName: { type: String },
    cellPhone: { type: String },
    phone: { type: String },
    cnpj: { type: String },
    externalSellerReference: { type: String },
    sellerName: { type: String },
    externalSupplierReference: { type: Array },
    externalListPriceReference: { type: String },
    nameListPrice: { type: String },
    paymentOptions: { type: Array },
    onlyClosedBox: { type: Boolean },
    externalReference: { type: String },
    warehouse: { type: String },
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

const BuyerSchema = connect.model('buyer', Buyer);

module.exports = BuyerSchema;