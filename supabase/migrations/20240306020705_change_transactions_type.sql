ALTER TABLE transactions
ALTER COLUMN amount TYPE numeric(10,2) USING amount::numeric(10,2),
ALTER COLUMN amount SET DEFAULT '0.00'::numeric;