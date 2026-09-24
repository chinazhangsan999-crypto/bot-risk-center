ALTER TABLE policies
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

CREATE OR REPLACE FUNCTION touch_policy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_policies_updated_at ON policies;
CREATE TRIGGER trg_policies_updated_at
BEFORE UPDATE ON policies
FOR EACH ROW EXECUTE FUNCTION touch_policy_updated_at();
