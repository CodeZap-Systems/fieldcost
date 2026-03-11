UPDATE subscription_plans 
SET 
  monthly_price = 799.00,
  annual_price = 8100.00,
  updated_at = NOW()
WHERE tier_level = 1 AND is_active = true;

UPDATE subscription_plans 
SET 
  monthly_price = 1999.00,
  annual_price = 21589.00,
  description = 'Growth tier for multi-project contractors and agencies',
  updated_at = NOW()
WHERE tier_level = 2 AND is_active = true;

UPDATE subscription_plans 
SET 
  monthly_price = NULL,
  annual_price = 25000.00,
  description = 'Enterprise plan with custom pricing (R25k-R150k/year per agreement)',
  updated_at = NOW()
WHERE tier_level = 3 AND is_active = true;

SELECT 
  tier_level,
  name,
  monthly_price,
  annual_price,
  updated_at
FROM subscription_plans
WHERE is_active = true
ORDER BY tier_level;
