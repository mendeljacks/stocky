import {compose, flatten, keys, map, pickAll, values, uniq} from 'ramda'
import {camel} from './helpers'
import {get} from './request'

global.get_items = async (route, go_flow_store, cookie) => {
  const offset = 0
  const limit = 250
  const url = `https://${go_flow_store}.goflowapp.com/api/${route}?$top=${limit}&$skip=${offset}`
  const go_flow_response = await get(url, {cookie})
  var {count, results} = go_flow_response
  var rows = results
  if (count > limit) {
    const request_count = Math.ceil(count / limit)
    for (let i = 1; i < request_count; i++) {
      const offset = i * limit
      const url = `https://${go_flow_store}.goflowapp.com/api/${route}?$top=${limit}&$skip=${offset}`
      var {count, results: new_results} = await get(url, {cookie})
      rows = [...rows, ...new_results]
    }
  }

  const column_names = compose(uniq, flatten, map(keys))(rows)
  const human_column_names = map(camel)(column_names)


  const google_sheet_rows = compose(map(values), map(pickAll(column_names)))(rows)

  return [human_column_names, ...google_sheet_rows]
}

global.post = () => {
  var sheet = SpreadsheetApp.getActiveSheet()
  const test = sheet.getRange("A1:D4")
  var htmlApp = HtmlService
    .createHtmlOutput('<p>A change of speed, a change of style...</p>')
    .setTitle('My HtmlService Application')
    .setWidth(250)
    .setHeight(300);

SpreadsheetApp.getActiveSpreadsheet().show(htmlApp);
  // var rangeList = sheet.getRangeList(['A4', 'B5'])
  // rangeList.clear({contentsOnly: true})
}