-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    full_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    registration_method VARCHAR(10) DEFAULT 'EMAIL',
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    requested_role VARCHAR(50),
    registration_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    updated_by VARCHAR(100),
    address VARCHAR(255),
    block VARCHAR(100),
    town VARCHAR(100),
    state VARCHAR(100),
    village VARCHAR(100),
    landmark VARCHAR(100),
    district VARCHAR(100),
    country VARCHAR(100),
    pin_code VARCHAR(20),
    zone VARCHAR(100),
    referral_code VARCHAR(10) UNIQUE,
    referred_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL
);

-- 2b. Migrate existing city column to block (if upgrading)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='city') THEN
        ALTER TABLE users RENAME COLUMN city TO block;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='town') THEN
        ALTER TABLE users ADD COLUMN town VARCHAR(100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='block') THEN
        ALTER TABLE users ADD COLUMN block VARCHAR(100);
    END IF;
END $$;

-- 3. User_Roles Join Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    details TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL
);

-- 6. Master Headers Table
CREATE TABLE IF NOT EXISTS master_headers (
    id BIGSERIAL PRIMARY KEY,
    dropdown_name VARCHAR(100) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

-- 7. Master Details Table
CREATE TABLE IF NOT EXISTS master_details (
    id BIGSERIAL PRIMARY KEY,
    master_header_id BIGINT NOT NULL REFERENCES master_headers(id) ON DELETE CASCADE,
    display_name VARCHAR(200) NOT NULL,
    parent_id BIGINT REFERENCES master_details(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
);

CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by_id);
CREATE INDEX IF NOT EXISTS idx_users_zone ON users(zone);
CREATE INDEX IF NOT EXISTS idx_users_state ON users(state);
CREATE INDEX IF NOT EXISTS idx_users_district ON users(district);
CREATE INDEX IF NOT EXISTS idx_master_details_parent ON master_details(parent_id);
CREATE INDEX IF NOT EXISTS idx_master_details_header ON master_details(master_header_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_uniq_master_details_parent 
ON master_details (master_header_id, LOWER(display_name), parent_id) 
WHERE parent_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_uniq_master_details_no_parent 
ON master_details (master_header_id, LOWER(display_name)) 
WHERE parent_id IS NULL;

