CREATE DATABASE farmer_market;

USE farmer_market;

CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
select * from customers;
ALTER TABLE customers
ADD COLUMN username VARCHAR(50) NOT NULL UNIQUE AFTER id;
select * from customers;
desc customers;
ALTER TABLE customers CHANGE full_Name fullName VARCHAR(255) NOT NULL;
desc customers;
ALTER TABLE customers CHANGE fullName full_Name VARCHAR(255) NOT NULL;
SELECT * FROM customers LIMIT 0, 1000;
SHOW DATABASES;
use farmer_market;
select * from customers;









