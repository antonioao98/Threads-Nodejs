const { find: findBuyers } = require('./repository/buyer');
const {
  findAllPerQuery: findListItems,
  update,
} = require('./repository/listItem');

async function getListItems(listItems, thread, threadPosition) {
  try {
    console.log('Iniciando a busca dos ListItems');

    console.log('Atualizando dados');

    async function updateAt(externalReference, warehouse, newCnpj) {
      await update(
        {
          externalBuyerReference: externalReference,
          warehouse: warehouse,
          buyerCnpj: /E/,
        },
        { buyerCnpj: newCnpj }
      ).catch(err => {
        console.log('err in update', err);
      });
    }
    const promises = listItems.map(async ({_doc}, index) => {
      const data = await findBuyers({
        externalReference: _doc.externalBuyerReference,
        warehouse: _doc.warehouse,
      }).catch(err => {
        console.log('err in find buyers', err);
      });
      console.log(`Thread de número ${threadPosition + 1} atualizando registro ${index + 1} de ${listItems.length}`);
      if (data.length > 1) {
        data.forEach(async itemBuyer => {
          await updateAt(
            itemBuyer.externalReference,
            itemBuyer.warehouse,
            itemBuyer.cnpj
          );
        });
      } else {
        await updateAt(
          data[0].externalReference,
          data[0].warehouse,
          data[0].cnpj
        );
      }
    });

    return await Promise.all(promises)
      .then(() => {
        console.log('ListItems atualizado com sucesso !');
        return 1;
      })
      .catch(erro => {
        console.log('Err in updated ListItems', erro);
        return 2;
      });
  } catch (error) {
    console.log('ocorreu um erro', error);
  }
}

// getListItems();
module.exports = { getListItems };
