import { values } from 'ramda';
import { get, post } from './request';
global.login = async (email, password, base_url) => {
  const result = await get(`${base_url}/login?email=${email}&password=${password}`)
  return result.token
};

global.get_variants = async (store_id, base_url, token) => {
  const limit = 1000
  const body = {
    "variants": {
      "include": ["id", "barcode", "sku", "asin"],
      "offset": 0,
      "limit": limit
    },
    "variant_in_stores": {
      "include": ["id","variant_id","store_id","price","wam","no3rd_quantity","vendor_quantity"],
      "searches": [
        {
          "column": "store_id",
          "equals": store_id,
          "mode": "and"
        }]
    }
  }
  let {row_count, variants} = await post(`${base_url}/variants/search`, body, token)


  const total_pages = Math.ceil(row_count / limit)

  for (let page = 1; page < total_pages; page++) {
      const new_offset = page * limit
      body.variants.offset = new_offset
      const { variants: new_variants } =  await post(`${base_url}/variants/search`, body, token)

      variants = [...variants, ...new_variants]
  }

  return variants.reduce((acc,val)=>{
    const {id, barcode, sku, asin, variant_in_stores=[]} = val
    const {price, wam, no3rd_quantity, vendor_quantity} = variant_in_stores[0] || {}
    acc.push([id, barcode, sku, asin, price, wam, no3rd_quantity, vendor_quantity])
    return acc
  },[])



}
