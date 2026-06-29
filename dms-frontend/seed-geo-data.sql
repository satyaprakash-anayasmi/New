-- Seed Geographical Master Data Hierarchy
-- This script populates the master_headers and master_details tables
-- with Country -> State -> District -> Block -> Village -> Town hierarchy.

-- 1. Insert Headers
INSERT INTO master_headers (header_key, header_name, description, is_active) VALUES
('COUNTRY', 'Country', 'Country', true),
('STATE', 'State', 'State', true),
('DISTRICT', 'District', 'District', true),
('BLOCK', 'Block', 'Block', true),
('VILLAGE', 'Village', 'Village', true),
('TOWN', 'Town', 'Town', true)
ON CONFLICT DO NOTHING;

-- 2. Insert Country (India)
INSERT INTO master_details (header_key, detail_code, detail_value, display_order, is_active, parent_id)
VALUES ('COUNTRY', 'IN', 'India', 1, true, NULL)
ON CONFLICT DO NOTHING;

-- Since parent_id is required for child elements, we'll use DO blocks to retrieve the parent ID
DO $$
DECLARE
    country_id bigint;
    state_id bigint;
    district_id bigint;
    block_id bigint;
    village_id bigint;
BEGIN
    -- Get Country ID
    SELECT id INTO country_id FROM master_details WHERE header_key = 'COUNTRY' AND detail_code = 'IN' LIMIT 1;

    -- Insert State (Maharashtra)
    INSERT INTO master_details (header_key, detail_code, detail_value, display_order, is_active, parent_id)
    VALUES ('STATE', 'MH', 'Maharashtra', 1, true, country_id)
    RETURNING id INTO state_id;

    -- Insert District (Pune)
    INSERT INTO master_details (header_key, detail_code, detail_value, display_order, is_active, parent_id)
    VALUES ('DISTRICT', 'PUNE', 'Pune', 1, true, state_id)
    RETURNING id INTO district_id;

    -- Insert Block (Haveli)
    INSERT INTO master_details (header_key, detail_code, detail_value, display_order, is_active, parent_id)
    VALUES ('BLOCK', 'HAVELI', 'Haveli', 1, true, district_id)
    RETURNING id INTO block_id;

    -- Insert Village (Khadakwasla)
    INSERT INTO master_details (header_key, detail_code, detail_value, display_order, is_active, parent_id)
    VALUES ('VILLAGE', 'KHADAKWASLA', 'Khadakwasla', 1, true, block_id)
    RETURNING id INTO village_id;

    -- Insert Town (Town A)
    INSERT INTO master_details (header_key, detail_code, detail_value, display_order, is_active, parent_id)
    VALUES ('TOWN', 'TOWN_A', 'Town A', 1, true, village_id);

    RAISE NOTICE 'Geographical Data Seeded Successfully!';
EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'Data already exists, skipping insertion.';
END $$;
