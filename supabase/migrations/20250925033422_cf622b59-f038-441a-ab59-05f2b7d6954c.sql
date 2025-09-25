-- Create recurring transactions table
CREATE TABLE public.recurring_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  next_execution_date DATE NOT NULL,
  last_executed_date DATE,
  is_active BOOLEAN DEFAULT true,
  account_id TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.recurring_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own recurring transactions" 
ON public.recurring_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recurring transactions" 
ON public.recurring_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring transactions" 
ON public.recurring_transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring transactions" 
ON public.recurring_transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_recurring_transactions_updated_at
BEFORE UPDATE ON public.recurring_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate next execution date
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
$$ LANGUAGE plpgsql;