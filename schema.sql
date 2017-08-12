CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	position INT NOT NULL AUTO_INCREMENT,
	itemID INT(15) NULL,
	name VARCHAR(30) NULL,
	department VARCHAR(14) NULL,
	price DECIMAL(8,2) NULL,
	quantity INT(15) NULL,
	PRIMARY KEY (position)
);

INSERT INTO products (itemID, name, department, price, quantity) VALUES
(0003, "Hat", "Apparel", 12, 10);
