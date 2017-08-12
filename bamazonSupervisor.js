var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Assword!',
  database : 'bamazon'
});

connection.connect(function(err) {
  if (err) throw err;
});

var table = new Table({
    head: ['ItemID', 'Name', 'Department', 'Price', 'Quantity']
  , colWidths: [15, 15, 15, 15, 15]
});

var init = function() {
  handleProduct();
}

var handleProduct = function() {
  inquirer.prompt([
    {
      type: "list",
      message: "Select Action",
      choices: ["View Products on Sale","View Inventory","Add to Inventory","Add New Product"],
      name: "choices"
    }

  ]).then(function(answer) {
    if(answer.choices === "View Products on Sale"){
      connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for(var i = 0; i < res.length; i++) {
          table.push(
              [res[i].itemID, res[i].product, res[i].department_name, res[i].price, res[i].quantity]
          );
        }

        console.log(table.toString());
        connection.end();
      });
    } else if (answer.choices === "View Inventory") {
      connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for(var i = 0; i < res.length; i++) {
          if(res[i].quantity < 5) {
            table.push(
                [res[i].itemID, res[i].product, res[i].department_name, res[i].price, res[i].quantity]
            );
          }
        }
        console.log(table.toString());
        connection.end();
      });
    } else if (answer.choices === "Add to Inventory") {
      addInventory();

    } else if (answer.choices === "Add New Product") {
      newProduct();

    }

  });

}

var newProduct = function() {
  inquirer.prompt([
    {
      type: "input",
      message: "Name of product you want to add: ",
      name: "product",
    },
    {
      type: "input",
      message: "Give it an id number: ",
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
      message: "Name of product department: ",
      name: "dept",
    },
    {
      type: "input",
      message: "Quantity to order: ",
      name: "quantity"
    },
    {
      type: "input",
      message: "Set sales price at: ",
      name: "price"
    }
  ]).then(function(answer) {
    connection.query("INSERT INTO products SET ?", {
      itemID: answer.id,
      product: answer.product,
      department: answer.dept,
      price: answer.price,
      quantity: answer. quantity
    }, function(err) {
      if (err) throw err;
      console.log("Your new item was ordered successfully!");
      connection.end();
    })
  });
}

var addInventory = function() {
  inquirer.prompt([
    {
      type: "input",
      message: "What is the product number: ",
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
      message: "Quantity?: ",
      name: "quantity"
    }
  ]).then(function(answer) {
    connection.query("SELECT * FROM products WHERE ?", [{
          itemID: answer.id
    }], function(err, res){
          var currentInv = res[0].quantity
          connection.query("UPDATE products SET ? WHERE ?", [{
            quantity: currentInv + parseInt(answer.quantity)
          }, {
            itemID: answer.id
     }], function(error) {
            if (error) throw err;
            console.log("Inventory updated.");
          });
          connection.end();
        });
  });
}

init();
