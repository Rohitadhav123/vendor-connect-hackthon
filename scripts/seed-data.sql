-- Seed data for VendorConnect platform

-- Insert categories
INSERT INTO categories (name, description, icon) VALUES
('Vegetables', 'Fresh vegetables and produce', 'carrot'),
('Spices', 'Spices and seasonings', 'pepper'),
('Grains & Rice', 'Rice, wheat, and other grains', 'wheat'),
('Cooking Oil', 'Various cooking oils', 'droplet'),
('Packaging', 'Food packaging materials', 'package'),
('Dairy', 'Milk and dairy products', 'milk');

-- Insert sample users (suppliers)
INSERT INTO users (email, password_hash, phone, full_name, role, is_verified) VALUES
('amit@freshveggies.com', '$2b$10$example_hash_1', '+91 98765 43210', 'Amit Kumar', 'supplier', true),
('priya@spicemasters.com', '$2b$10$example_hash_2', '+91 87654 32109', 'Priya Sharma', 'supplier', true),
('rajesh@grainworld.com', '$2b$10$example_hash_3', '+91 76543 21098', 'Rajesh Gupta', 'supplier', true),
('sunita@oilexpress.com', '$2b$10$example_hash_4', '+91 65432 10987', 'Sunita Devi', 'supplier', true);

-- Insert sample users (vendors)
INSERT INTO users (email, password_hash, phone, full_name, role, is_verified) VALUES
('raj@streetfood.com', '$2b$10$example_hash_5', '+91 98765 12345', 'Raj Kumar', 'vendor', true),
('meera@chaatcorner.com', '$2b$10$example_hash_6', '+91 87654 23456', 'Meera Singh', 'vendor', true),
('vikram@foodcart.com', '$2b$10$example_hash_7', '+91 76543 34567', 'Vikram Yadav', 'vendor', true);

-- Insert business profiles for suppliers
INSERT INTO business_profiles (user_id, business_name, business_type, description, address, city, state, pincode, latitude, longitude, is_verified) VALUES
(1, 'Fresh Vegetables Co.', 'Vegetable Wholesaler', 'Premium quality fresh vegetables direct from farms', 'Shop 45, Azadpur Mandi, Delhi', 'Delhi', 'Delhi', '110033', 28.7041, 77.1025, true),
(2, 'Spice Masters', 'Spice Supplier', 'Authentic Indian spices and seasonings', '23, Khari Baoli, Chandni Chowk, Delhi', 'Delhi', 'Delhi', '110006', 28.6562, 77.2410, true),
(3, 'Grain World', 'Grain Dealer', 'Quality grains, rice, and pulses at wholesale prices', 'A-12, Grain Market, Najafgarh, Delhi', 'Delhi', 'Delhi', '110043', 28.6092, 76.9794, true),
(4, 'Oil Express', 'Oil Distributor', 'All types of cooking oils and edible oils', 'B-34, Industrial Area, Mandoli, Delhi', 'Delhi', 'Delhi', '110093', 28.7196, 77.2854, true);

-- Insert business profiles for vendors
INSERT INTO business_profiles (user_id, business_name, business_type, description, address, city, state, pincode, latitude, longitude, is_verified) VALUES
(5, 'Raj\'s Street Food', 'Street Food Stall', 'Delicious North Indian street food and snacks', 'Near Metro Station, Connaught Place, Delhi', 'Delhi', 'Delhi', '110001', 28.6315, 77.2167, true),
(6, 'Meera\'s Chaat Corner', 'Food Cart', 'Authentic chaat and fast food', 'Lajpat Nagar Market, Delhi', 'Delhi', 'Delhi', '110024', 28.5665, 77.2431, true),
(7, 'Vikram Food Cart', 'Food Cart', 'South Indian food and beverages', 'Karol Bagh Market, Delhi', 'Delhi', 'Delhi', '110005', 28.6519, 77.1909, true);

-- Insert sample products
INSERT INTO products (supplier_id, category_id, name, description, price, unit, stock_quantity, minimum_order, is_active) VALUES
-- Fresh Vegetables Co. products
(1, 1, 'Fresh Onions', 'Premium quality red onions', 25.00, 'kg', 500, 5, true),
(1, 1, 'Tomatoes', 'Fresh ripe tomatoes', 40.00, 'kg', 300, 3, true),
(1, 1, 'Potatoes', 'Good quality potatoes', 20.00, 'kg', 800, 10, true),
(1, 1, 'Green Chilies', 'Fresh green chilies', 60.00, 'kg', 50, 1, true),

-- Spice Masters products
(2, 2, 'Turmeric Powder', 'Pure turmeric powder', 180.00, 'kg', 100, 1, true),
(2, 2, 'Red Chili Powder', 'Spicy red chili powder', 200.00, 'kg', 80, 1, true),
(2, 2, 'Coriander Powder', 'Fresh coriander powder', 150.00, 'kg', 60, 1, true),
(2, 2, 'Garam Masala', 'Premium garam masala blend', 300.00, 'kg', 40, 1, true),

-- Grain World products
(3, 3, 'Basmati Rice', 'Premium basmati rice', 85.00, 'kg', 1000, 25, true),
(3, 3, 'Wheat Flour', 'Fresh wheat flour', 30.00, 'kg', 500, 10, true),
(3, 3, 'Toor Dal', 'Yellow lentils', 120.00, 'kg', 200, 5, true),

-- Oil Express products
(4, 4, 'Mustard Oil', 'Pure mustard oil', 120.00, 'L', 200, 5, true),
(4, 4, 'Sunflower Oil', 'Refined sunflower oil', 110.00, 'L', 300, 5, true),
(4, 4, 'Coconut Oil', 'Pure coconut oil', 180.00, 'L', 100, 2, true);

-- Insert sample orders
INSERT INTO orders (order_number, vendor_id, supplier_id, status, total_amount, delivery_address, delivery_date, notes) VALUES
('ORD001', 5, 1, 'delivered', 450.00, 'Near Metro Station, Connaught Place, Delhi', '2024-01-16', 'Please deliver fresh vegetables'),
('ORD002', 5, 2, 'in-transit', 540.00, 'Near Metro Station, Connaught Place, Delhi', '2024-01-16', 'Need spices urgently'),
('ORD003', 6, 4, 'pending', 960.00, 'Lajpat Nagar Market, Delhi', '2024-01-17', 'Bulk oil order'),
('ORD004', 7, 3, 'confirmed', 2425.00, 'Karol Bagh Market, Delhi', '2024-01-15', 'Monthly grain supply');

-- Insert order items
INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
-- Order 1 items
(1, 1, 10, 25.00, 250.00),
(1, 2, 5, 40.00, 200.00),

-- Order 2 items
(2, 5, 1, 180.00, 180.00),
(2, 6, 2, 200.00, 400.00),

-- Order 3 items
(3, 12, 5, 120.00, 600.00),
(3, 13, 3, 110.00, 330.00),

-- Order 4 items
(4, 9, 25, 85.00, 2125.00),
(4, 10, 10, 30.00, 300.00);

-- Insert sample reviews
INSERT INTO reviews (order_id, vendor_id, supplier_id, product_id, rating, review_text) VALUES
(1, 5, 1, 1, 5, 'Excellent quality onions, very fresh and good price'),
(1, 5, 1, 2, 4, 'Good tomatoes, delivered on time'),
(2, 5, 2, 5, 5, 'Best turmeric powder in the market'),
(2, 5, 2, 6, 4, 'Good quality chili powder, will order again');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(5, 'Order Delivered', 'Your order ORD001 has been delivered successfully', 'order_update', true),
(5, 'Order In Transit', 'Your order ORD002 is now in transit', 'order_update', false),
(1, 'New Order Received', 'You have received a new order ORD001', 'order_update', true),
(2, 'New Order Received', 'You have received a new order ORD002', 'order_update', false);
