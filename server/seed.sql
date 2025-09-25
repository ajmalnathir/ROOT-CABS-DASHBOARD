-- Create schema if not exists (quoted due to space in name)
CREATE DATABASE IF NOT EXISTS `ROOT 001`;

-- Metrics
CREATE TABLE IF NOT EXISTS `ROOT 001`.metrics (
  `key` VARCHAR(50) PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value_numeric DECIMAL(10,2) NULL,
  value_text VARCHAR(100) NULL
);

REPLACE INTO `ROOT 001`.metrics (`key`, label, value_numeric, value_text) VALUES
('total_rides_today',  'Total Rides Today', 247,     NULL),
('active_drivers',     'Active Drivers',    149,     NULL),
('revenue_today',      'Revenue Today',     4589,    NULL),
('avg_rating',         'Avg Rating',        4.80,    NULL),
('completion_rate',    'Completion Rate',   94.20,   NULL),
('avg_response',       'Avg Response',      3.20,    NULL);

-- Drivers
CREATE TABLE IF NOT EXISTS `ROOT 001`.drivers (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rating DECIMAL(3,1),
  rides_completed INT,
  earnings INT,
  status ENUM('online','offline','busy') DEFAULT 'offline'
);

REPLACE INTO `ROOT 001`.drivers (id, name, rating, rides_completed, earnings, status) VALUES
('RC001','Rajesh',4.8,256,1400,'online'),
('RC002','Amit',4.6,234,800,'busy'),
('RC003','Suresh',4.9,289,500,'online'),
('RC004','Vikram',4.7,198,410,'offline'),
('RC005','Arjun',4.5,167,350,'online');

-- Rides
CREATE TABLE IF NOT EXISTS `ROOT 001`.rides (
  id VARCHAR(10) PRIMARY KEY,
  driver VARCHAR(100) NOT NULL,
  passenger VARCHAR(100) NOT NULL,
  pickup VARCHAR(200) NOT NULL,
  destination VARCHAR(200) NOT NULL,
  status ENUM('pickup','enroute','arrived') NOT NULL,
  fare INT
);

REPLACE INTO `ROOT 001`.rides (id, driver, passenger, pickup, destination, status, fare) VALUES
('RC001','Rajesh','Priya','Sathvacheri','Kaspa','enroute',450),
('RC002','Amit','Neha','Katpadi Railway Station','VIT','pickup',280),
('RC003','Suresh','Kavya','New Busstand','Vellore Fort','arrived',180);

-- Locations
CREATE TABLE IF NOT EXISTS `ROOT 001`.locations (
  name VARCHAR(200) PRIMARY KEY,
  rides INT,
  growth DECIMAL(4,1)
);

REPLACE INTO `ROOT 001`.locations (name, rides, growth) VALUES
('VIT UNIVERSITY',456,12.5),
('VELLORE Airport',342,8.2),
('CMC HOSPITAL',289,-2.1),
('VELLORE FORT',234,15.8),
('PERIYAR PARK',187,6.4),
('KATPADI RAILWAY STATION',145,3.2),
('GOLDEN TEMPLE',98,4.7),
('NEW BUS STAND',76,22.1);

-- Revenue Weekly
CREATE TABLE IF NOT EXISTS `ROOT 001`.revenue_weekly (
  id INT PRIMARY KEY AUTO_INCREMENT,
  day ENUM('Mon','Tue','Wed','Thu','Fri','Sat','Sun'),
  revenue DECIMAL(10,2) DEFAULT 0.00
);

REPLACE INTO `ROOT 001`.revenue_weekly (day, revenue) VALUES
('Mon', 250.00),
('Tue', 520.00),
('Wed', 180.00),
('Thu', 690.00),
('Fri', 140.00),
('Sat', 480.00),
('Sun', 960.00);

-- Hourly Demand Analytics
CREATE TABLE IF NOT EXISTS `ROOT 001`.hourly_demand (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hour VARCHAR(10),
  rides INT DEFAULT 0,
  demand ENUM('low','medium','high','peak') DEFAULT 'low'
);

REPLACE INTO `ROOT 001`.hourly_demand (hour, rides, demand) VALUES
('6AM', 45, 'low'),
('7AM', 128, 'medium'),
('8AM', 245, 'high'),
('9AM', 189, 'medium'),
('10AM', 167, 'medium'),
('11AM', 201, 'high'),
('12PM', 298, 'peak'),
('1PM', 267, 'high'),
('2PM', 198, 'medium'),
('3PM', 234, 'high'),
('4PM', 289, 'peak'),
('5PM', 356, 'peak'),
('6PM', 312, 'peak'),
('7PM', 245, 'high'),
('8PM', 189, 'medium'),
('9PM', 134, 'medium'),
('10PM', 89, 'low'),
('11PM', 45, 'low'),
('12AM', 23, 'low'),
('1AM', 12, 'low'),
('2AM', 8, 'low'),
('3AM', 5, 'low'),
('4AM', 15, 'low'),
('5AM', 28, 'low');

-- Earnings overview metrics (additional)
REPLACE INTO `ROOT 001`.metrics (`key`, label, value_numeric, value_text) VALUES
('revenue_this_week', 'Revenue This Week', 2694.00, NULL),
('revenue_this_month', 'Revenue This Month', 10000.00, NULL),
('revenue_growth', 'Revenue Growth', 18.5, NULL);
