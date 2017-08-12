var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Assword!',
  database : 'bamazon'
});
var Table = require('cli-table');
var table = new Table({
    head: ['Item ID', 'Product Name', 'Department', 'Price']
  , colWidths: [15, 15, 15, 15]
});

connection.connect(function(err) {
  if (err) throw err;
});

connection.query("SELECT * FROM products", function(err, res){
  if(err) throw err;
  for(var i = 0; i < res.length; i++) {
    table.push(
        [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]
    );
  }
});

var init = function() {
  customer();
}

var customer = function() {
  connection.query("SELECT * FROM products", function(err, res){
    if(err) throw err;
    inquirer.prompt([
      {
        type: "input",
        message: "Enter the id number of the item you would like to buy: ",
        name: "id",
        validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
      },
      {
        type: "input",
        message: "Enter the quantity you would like to purchase: ",
        name: "quantity",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
  ]).then(function (answers) {

    var id = parseInt(answers.id);
    var quantity = parseInt(answers.quantity);

    connection.query("SELECT * FROM products WHERE ?", [{
          item_id: id
        }], function(err, res){
          var product = res[0].product_name;
          var stock = res[0].stock_quantity;
          if (stock<quantity) {
            console.log("Sorry, there is only "+stock+" "+product+" left in stock. Please revise your order.");
            customer();
          } else {
            connection.query("UPDATE products SET ? WHERE ?", [{
              stock_quantity: stock - quantity
            }, {
              item_id: id
            }], function(error) {
              if (error) throw err;
              var cost = quantity * res[0].price;
              console.log("Order submitted! Please pay "+cost+ " at checkout");
              setTimeout(restart, 1000);
            });
          }
        });
    });
  });
}

var restart = function() {
  inquirer.prompt([
    {
      type: "list",
      message: "Place another order or end session?",
      choices: ["Place Order", "Quit session"],
      name: "choice"
    }
  ]).then(function(answers) {
    if(answers.choice === "Place Order") {
      customer();
    } else {
      connection.end();
    }
  });

}

init();
