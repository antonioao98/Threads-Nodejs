const { find: findBuyers } = require('./repository/buyer');
const {
  findAllPerQuery,
  update,
} = require('./repository/listItem');
const connect = require('./db/connect');

async function getListItems() {
  try {
    console.log('Iniciando a busca dos ListItems');
    const findListItems = async () => {
      return await findAllPerQuery({
        buyerCnpj: { $regex: /E/, $options: 'i' },
      })
        .then(item => {
          console.log('ListItems buscados com sucesso !');
          
          return item;
        })
        .catch(err => {
          console.log('er', err);
        });
    };
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
    const teste = await findListItems()
    const promises = teste.map(async (item, index) => {
      const data = await findBuyers({
        externalReference: item.externalBuyerReference,
        warehouse: item.warehouse,
      }).catch(err => {
        console.log('err in find buyers', err);
      });
      console.log(`Atualizando registro ${index + 1} de ${teste.length}`);
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
        connect.disconnect()
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

getListItems();