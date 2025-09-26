-- Create budget strategies table
CREATE TABLE public.budget_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_type TEXT NOT NULL CHECK (strategy_type IN ('50-30-20', 'envelope', 'pay-yourself-first', 'expense-buckets', 'traditional')),
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  monthly_income DECIMAL(12,2),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create budget allocations table for different strategies
CREATE TABLE public.budget_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES public.budget_strategies(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  category_type TEXT NOT NULL, -- 'needs', 'wants', 'savings', 'fixed', 'flexible', 'non-monthly', 'envelope'
  allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  remaining_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  percentage_of_income DECIMAL(5,2),
  priority_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create envelope budgets table for envelope method
CREATE TABLE public.envelope_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES public.budget_strategies(id) ON DELETE CASCADE,
  envelope_name TEXT NOT NULL,
  allocated_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  target_amount DECIMAL(12,2),
  color TEXT DEFAULT '#10B981',
  icon TEXT DEFAULT '💰',
  is_virtual BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.budget_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.envelope_budgets ENABLE ROW LEVEL SECURITY;

-- Create policies for budget_strategies
CREATE POLICY "Users can view their own budget strategies" 
ON public.budget_strategies 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget strategies" 
ON public.budget_strategies 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget strategies" 
ON public.budget_strategies 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget strategies" 
ON public.budget_strategies 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for budget_allocations
CREATE POLICY "Users can view their own budget allocations" 
ON public.budget_allocations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget allocations" 
ON public.budget_allocations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget allocations" 
ON public.budget_allocations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget allocations" 
ON public.budget_allocations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for envelope_budgets
CREATE POLICY "Users can view their own envelope budgets" 
ON public.envelope_budgets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own envelope budgets" 
ON public.envelope_budgets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own envelope budgets" 
ON public.envelope_budgets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own envelope budgets" 
ON public.envelope_budgets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_budget_strategies_updated_at
BEFORE UPDATE ON public.budget_strategies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_budget_allocations_updated_at
BEFORE UPDATE ON public.budget_allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_envelope_budgets_updated_at
BEFORE UPDATE ON public.envelope_budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update remaining amount in budget allocations
CREATE OR REPLACE FUNCTION public.update_budget_allocation_remaining()
RETURNS TRIGGER AS $$
BEGIN
  NEW.remaining_amount = NEW.allocated_amount - NEW.spent_amount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically calculate remaining amount
CREATE TRIGGER calculate_remaining_amount
BEFORE INSERT OR UPDATE ON public.budget_allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_budget_allocation_remaining();