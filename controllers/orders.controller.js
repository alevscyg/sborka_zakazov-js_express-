const db = require('../db')

class ordersController {
    
    async getOrders(req,res){
        const {order} = req.body;
        const ordersSTR = '('+order.join(', ')+') ;';
        const ordersSQL = await db.query('select * from "Orders" where "order" IN '+ordersSTR);
        const orders = ordersSQL.rows
        let arrOrders =[]
        let arrProductId = []
        for(let q =0;q<orders.length;q++){
          if(arrProductId.includes(orders[q].product_id)===false){
            arrProductId.push(orders[q].product_id)
          }
        }
        const productSTR = '('+arrProductId.join(', ')+') ;';
        const productsSQL = await db.query('select * from "Products" where "id" IN '+productSTR)
        const products = productsSQL.rows
        const productsshelfSQL = await db.query('select * from "ProductsShelves" where "product_id" IN'+productSTR)
        const productsshelf = productsshelfSQL.rows
        let arrShelfId = []
        for(let q =0;q<productsshelf.length;q++){
          if(arrShelfId.includes(productsshelf[q].shelf_id)===false){
            arrShelfId.push(productsshelf[q].shelf_id)
          }
        }
        const arrShelfIdStr = '('+arrShelfId.join(', ')+') ;'
        const shelfSQL = await db.query('select * from "Shelves" where "id" IN' +arrShelfIdStr)
        const shelf = shelfSQL.rows

        for(let q=0;q<order.length;q++){
          let arrProducts = []
          const orderFOR = Number(order[q])
          for(let w = 0 ;w<orders.length;w++){
            if(orderFOR===orders[w].order){
              let arrOrderProductShelf = []
              let arrMainSelf = []
              for(let e =0;e<productsshelf.length;e++){
                if(orders[w].product_id===productsshelf[e].product_id){
                  if(productsshelf[e].main_shelf===false){
                    for(let r =0;r<shelf.length;r++){
                      if(shelf[r].id===productsshelf[e].shelf_id){
                        arrOrderProductShelf.push(shelf[r].shelf_name)
                      }
                    }
                  }
                  else{
                    arrMainSelf.push(productsshelf[e].shelf_id)
                  }
                }
              }
              let product_name = []
              for(let e =0;e<products.length;e++){
                if(orders[w].product_id===products[e].id){
                  product_name.push(products[e].product)
                }
              }
              arrProducts.push({ main_shelf:arrMainSelf[0],product:product_name[0],pruduct_id:orders[w].product_id, quantity:orders[w].quantity, shelfes:arrOrderProductShelf})
            }
          }
          arrOrders.push({order:orderFOR,products:arrProducts})
        }
        let arrShelfReturn =[]
        for(let q=0;q<shelf.length;q++){
          let arrProductReturn = []
          for(let w =0;w<arrOrders.length;w++){
            for(let e =0;e<arrOrders[w].products.length;e++){
              if(arrOrders[w].products[e].main_shelf===shelf[q].id){
                if(arrOrders[w].products[e].shelfes.length===0){
                  arrProductReturn.push( '----'+' '+`${arrOrders[w].products[e].product}` + ` (id=${arrOrders[w].products[e].pruduct_id})`, `заказ ${arrOrders[w].order}` +','+ ' '+`${arrOrders[w].products[e].quantity} шт` )
                }
                else{
                  arrProductReturn.push( '----'+' '+`${arrOrders[w].products[e].product}` + ` (id=${arrOrders[w].products[e].pruduct_id})`, `заказ ${arrOrders[w].order}` +','+ ' '+`${arrOrders[w].products[e].quantity} шт`, `доп стеллаж: ${arrOrders[w].products[e].shelfes}` )
                }
              }
            }
          }
          if(arrProductReturn.length!=0){
            arrShelfReturn.push({Стеллаж:shelf[q].shelf_name, заказы:arrProductReturn})
          }
        }
        res.json(arrShelfReturn);
      }
}
module.exports = new ordersController()