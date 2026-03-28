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

/**
 * Transforma a entidade do banco (EN) para o formato de resposta da API (PT-BR),
 * escondendo campos internos como _id e __v.
 */
function mapOrderToResponse(orderDoc) {
  if (!orderDoc) return null;
  const order = orderDoc.toObject ? orderDoc.toObject() : orderDoc;

  return {
    numeroPedido: order.orderId,
    valorTotal: order.value,
    dataCriacao: order.creationDate,
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          idItem: String(item.productId),
          quantidadeItem: item.quantity,
          valorItem: item.price,
        }))
      : [],
  };
}

module.exports = { mapOrderToDatabase, mapUpdateToDatabase, mapOrderToResponse };
