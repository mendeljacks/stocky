import { values } from 'ramda';
import { get, post } from './request';
const base_url = `https://api-dev.no3rd.ca`
global.login = async (email, password) => {
  const result = await get(`${base_url}/login?email=${email}&password=${password}`)
  return result.token
};

global.get_inventory_adjustments = async (warehouse_id, store_id, offset, limit, token) => {
  const body = {
    // include_vendors: [vendors],
    inventory_adjustments: {
      limit: limit,
      offset: offset,
      searches: [
        {
          table: "shelves",
          column: "Warehouses_id",
          equals: warehouse_id,
          mode: "and"
        },
        {
          table: "inventory_adjustments",
          column: "store_id",
          equals: store_id,
          mode: "and"
        }
      ],
      // group_by: ["variant_id", "shelf_id"],
      include: ['id', 'variant_id', 'quantity', 'shelf_id']
    }
  }
  const result = await post(`${base_url}/inventory_adjustments/search`, body, token)
  return result.inventory_adjustments.map(el => values(el))
}
