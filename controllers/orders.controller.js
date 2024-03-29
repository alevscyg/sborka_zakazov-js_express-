const db = require('../db');

class ordersController {
    
    async getOrders(req,res){
      let {order} = req.body;
      let ordersSQL = await db.query('select * from "Orders" where "order" IN '+'('+order.join(', ')+') ;');
      let productSTR  = '('+Array.from(new Set(ordersSQL.rows.map(orders =>orders.product_id))).join(', ')+') ;'
      let productsSQL = await db.query('select * from "Products" where "id" IN '+productSTR);
      let productsshelfSQL = await db.query('select * from "ProductsShelves" where "product_id" IN'+productSTR);
      let ShelfSTR = '('+Array.from(new Set(productsshelfSQL.rows.map(productsshelfSQL =>productsshelfSQL.shelf_id))).join(', ')+') ;'
      let shelfSQL = await db.query('select * from "Shelves" where "id" IN' +ShelfSTR);
      let arrOrders =[];
        order.forEach(orderelQ=>{
          let arrProducts = [];
          const orderFOR = Number(orderelQ);
          ordersSQL.rows.forEach(ordersRowselW=>{
            if(orderFOR==ordersRowselW.order){
              let arrOrderProductShelf = [];
              let MainSelf = 0;
              productsshelfSQL.rows.forEach(productsshelelE=>{
                if(ordersRowselW.product_id==productsshelelE.product_id&&productsshelelE.main_shelf==false){
                  shelfSQL.rows.forEach(shelfelR=>{
                    if(shelfelR.id==productsshelelE.shelf_id){
                      arrOrderProductShelf.push(shelfelR.shelf_name);
                    }
                  });
                }
                else if(ordersRowselW.product_id==productsshelelE.product_id&&productsshelelE.main_shelf==true){
                  MainSelf+=productsshelelE.shelf_id;
                }
              });
              let product_name = '';
              productsSQL.rows.forEach(productselE=>{
                if(ordersRowselW.product_id==productselE.id){
                  product_name+=productselE.product;
                }
                
              });
              arrProducts.push({ main_shelf:MainSelf,product:product_name,pruduct_id:ordersRowselW.product_id, quantity:ordersRowselW.quantity, shelfes:arrOrderProductShelf});
            }
          });
          arrOrders.push({order:orderFOR,products:arrProducts});
        });
        let arrShelfReturn =[];
        shelfSQL.rows.forEach(shelfElQ=>{
          let arrProductReturn = [];
          arrOrders.forEach(arrOrdersElW=>{
            arrOrdersElW.products.forEach(arrOrdersElWElE=>{
              if(arrOrdersElWElE.main_shelf==shelfElQ.id){
                if(arrOrdersElWElE.shelfes.length===0){
                  arrProductReturn.push( '----'+' '+`${arrOrdersElWElE.product}` + ` (id=${arrOrdersElWElE.pruduct_id})`, `заказ ${arrOrdersElW.order}` +', '+`${arrOrdersElWElE.quantity} шт` );
                }
                else{
                  arrProductReturn.push( '----'+' '+`${arrOrdersElWElE.product}` + ` (id=${arrOrdersElWElE.pruduct_id})`, `заказ ${arrOrdersElW.order}` +', '+`${arrOrdersElWElE.quantity} шт`, `доп стеллаж: ${arrOrdersElWElE.shelfes}` );
                }
              }
            });
          });
          if(arrProductReturn.length!=0){
            arrShelfReturn.push({Стеллаж:shelfElQ.shelf_name, заказы:arrProductReturn});
          }
        });
        res.json(arrShelfReturn);
        
  }
}
module.exports = new ordersController();
