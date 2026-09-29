-- ==========================================================
-- APPLINEX Enterprise Appliance Rental Database Schema
-- Compatible with PostgreSQL, MySQL 8+, SQLite
-- ==========================================================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    icon_name VARCHAR(50) DEFAULT 'Box',
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appliances (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL UNIQUE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    subcategory VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    capacity VARCHAR(100),
    energy_rating VARCHAR(50) DEFAULT '5 Star',
    colour VARCHAR(100),
    dimensions VARCHAR(150),
    weight VARCHAR(50),
    warranty TEXT NOT NULL,
    
    -- Rental Pricing & Commercials
    purchase_price DECIMAL(10, 2) NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL DEFAULT 1000.00,
    min_tenure_months INT DEFAULT 3,
    availability_status VARCHAR(20) DEFAULT 'Available',
    quantity INT DEFAULT 10,
    condition VARCHAR(50) DEFAULT 'Brand New',
    rating DECIMAL(3, 2) DEFAULT 4.80,
    review_count INT DEFAULT 0,
    
    -- Media & URLs
    image_url VARCHAR(500) NOT NULL,
    official_product_url VARCHAR(500) NOT NULL,
    
    -- JSON Fields for Rich Specs & AI Telemetry
    features JSONB,
    specifications JSONB,
    ai_metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appliances_cat ON appliances(category_id);
CREATE INDEX idx_appliances_brand ON appliances(brand);
CREATE INDEX idx_appliances_rent ON appliances(monthly_rent);
CREATE INDEX idx_appliances_avail ON appliances(availability_status);
