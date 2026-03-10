/**
 * Transforma o body recebido (formato PT-BR) para o formato do banco (EN).
 *
 * Entrada:
 *   { numeroPedido, valorTotal, dataCriacao, items: [{ idItem, quantidadeItem, valorItem }] }
 *
 * Saída:
 *   { orderId, value, creationDate, items: [{ productId, quantity, price }] }
 */
function mapOrderToDatabase(body) {
  return {
    orderId: body.numeroPedido,
    value: body.valorTotal,
    creationDate: new Date(body.dataCriacao),
    items: Array.isArray(body.items)
      ? body.items.map((item) => ({
          productId: Number(item.idItem),
          quantity: item.quantidadeItem,
          price: item.valorItem,
        }))
      : [],
  };
}

/**
 * Transforma o body de atualização (formato PT-BR) para o formato do banco (EN).
 * Aceita campos parciais para atualização.
 */
function mapUpdateToDatabase(body) {
  const mapped = {};

  if (body.valorTotal !== undefined) mapped.value = body.valorTotal;
  if (body.dataCriacao !== undefined) mapped.creationDate = new Date(body.dataCriacao);
  if (body.items !== undefined) {
    mapped.items = body.items.map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    }));
  }

  return mapped;
}

module.exports = { mapOrderToDatabase, mapUpdateToDatabase };
