-- Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.calculate_next_execution_date(
  frequency_param TEXT,
  current_date_param DATE
)
RETURNS DATE AS $$
BEGIN
  CASE frequency_param
    WHEN 'daily' THEN
      RETURN current_date_param + INTERVAL '1 day';
    WHEN 'weekly' THEN
      RETURN current_date_param + INTERVAL '1 week';
    WHEN 'bi-weekly' THEN
      RETURN current_date_param + INTERVAL '2 weeks';
    WHEN 'monthly' THEN
      RETURN current_date_param + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN current_date_param + INTERVAL '3 months';
    WHEN 'yearly' THEN
      RETURN current_date_param + INTERVAL '1 year';
    ELSE
      RETURN current_date_param + INTERVAL '1 month';
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;