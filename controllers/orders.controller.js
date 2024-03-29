const db = require('../db')

class ordersController {
    
    async getOrders(req,res){
        const {order} = req.body;
        const ordersSQL = await db.query('select * from "Orders" where "order" IN '+'('+order.join(', ')+') ;');
        let arrOrders =[];
        let arrProductId = [];
        for(let q =0;q<ordersSQL.rows.length;q++){
          if(arrProductId.includes(ordersSQL.rows[q].product_id)===false){
            arrProductId.push(ordersSQL.rows[q].product_id);
          }
        }
        const productsSQL = await db.query('select * from "Products" where "id" IN '+'('+arrProductId.join(', ')+') ;');
        const productsshelfSQL = await db.query('select * from "ProductsShelves" where "product_id" IN'+'('+arrProductId.join(', ')+') ;');
        let arrShelfId = [];
        for(let q =0;q<productsshelfSQL.rows.length;q++){
          if(arrShelfId.includes(productsshelfSQL.rows[q].shelf_id)===false){
            arrShelfId.push(productsshelfSQL.rows[q].shelf_id);
          }
        }
        const shelfSQL = await db.query('select * from "Shelves" where "id" IN' +'('+arrShelfId.join(', ')+') ;');
        for(let q=0;q<order.length;q++){
          let arrProducts = [];
          const orderFOR = Number(order[q]);
          for(let w = 0 ;w<ordersSQL.rows.length;w++){
            if(orderFOR===ordersSQL.rows[w].order){
              let arrOrderProductShelf = [];
              let MainSelf = 0;
              for(let e =0;e<productsshelfSQL.rows.length;e++){
                if(ordersSQL.rows[w].product_id===productsshelfSQL.rows[e].product_id){
                  if(productsshelfSQL.rows[e].main_shelf===false){
                    for(let r =0;r<shelfSQL.rows.length;r++){
                      if(shelfSQL.rows[r].id===productsshelfSQL.rows[e].shelf_id){
                        arrOrderProductShelf.push(shelfSQL.rows[r].shelf_name);
                      }
                    }
                  }
                  else{
                    MainSelf+=productsshelfSQL.rows[e].shelf_id;
                  }
                }
              }
              let product_name = '';
              for(let e =0;e<productsSQL.rows.length;e++){
                if(ordersSQL.rows[w].product_id===productsSQL.rows[e].id){
                  product_name+=productsSQL.rows[e].product;
                }
              }
              arrProducts.push({ main_shelf:MainSelf,product:product_name,pruduct_id:ordersSQL.rows[w].product_id, quantity:ordersSQL.rows[w].quantity, shelfes:arrOrderProductShelf});
            }
          }
          arrOrders.push({order:orderFOR,products:arrProducts})
        }
        let arrShelfReturn =[];
        for(let q=0;q<shelfSQL.rows.length;q++){
          let arrProductReturn = [];
          for(let w =0;w<arrOrders.length;w++){
            for(let e =0;e<arrOrders[w].products.length;e++){
              if(arrOrders[w].products[e].main_shelf===shelfSQL.rows[q].id){
                if(arrOrders[w].products[e].shelfes.length===0){
                  arrProductReturn.push( '----'+' '+`${arrOrders[w].products[e].product}` + ` (id=${arrOrders[w].products[e].pruduct_id})`, `заказ ${arrOrders[w].order}` +','+ ' '+`${arrOrders[w].products[e].quantity} шт` );
                }
                else{
                  arrProductReturn.push( '----'+' '+`${arrOrders[w].products[e].product}` + ` (id=${arrOrders[w].products[e].pruduct_id})`, `заказ ${arrOrders[w].order}` +','+ ' '+`${arrOrders[w].products[e].quantity} шт`, `доп стеллаж: ${arrOrders[w].products[e].shelfes}` );
                }
              }
            }
          }
          if(arrProductReturn.length!=0){
            arrShelfReturn.push({Стеллаж:shelfSQL.rows[q].shelf_name, заказы:arrProductReturn});
          }
        }
        res.json(arrShelfReturn);
      }
}
module.exports = new ordersController();
