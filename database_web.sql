CREATE DATABASE IF NOT EXISTS web_portfolio_db;

USE web_portfolio_db;

CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_position VARCHAR(255) NOT NULL,
    feedback TEXT NOT NULL,
    rating INT NOT NULL,
    profile_url_name VARCHAR(255)
);

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL
);
