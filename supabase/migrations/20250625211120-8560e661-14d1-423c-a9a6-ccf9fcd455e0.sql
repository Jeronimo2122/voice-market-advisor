
-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table for the marketplace
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT,
  features TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  badge TEXT,
  discount INTEGER,
  original_price DECIMAL(10,2),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table for shopping cart functionality
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Products policies (public read access)
CREATE POLICY "Anyone can view products" 
  ON public.products 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Cart items policies
CREATE POLICY "Users can view their own cart items" 
  ON public.cart_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cart items" 
  ON public.cart_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" 
  ON public.cart_items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" 
  ON public.cart_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create a function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, features, rating, reviews, badge, discount, original_price, in_stock) VALUES
('Sony Alpha A7 IV', 'Professional full-frame mirrorless camera with 33MP sensor and advanced autofocus', 2499.99, 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop', 'cameras', ARRAY['33MP Full Frame Sensor', '4K 60fps Video', 'Real-time Eye AF', '5-axis Stabilization'], 4.8, 342, 'Pro Choice', 10, 2799.99, true),
('Canon EOS R5', 'High-resolution mirrorless camera perfect for photography and videography', 3899.99, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop', 'cameras', ARRAY['45MP Full Frame', '8K RAW Video', 'Dual Pixel CMOS AF', 'In-body Stabilization'], 4.9, 128, 'Editor''s Pick', 15, 4599.99, true),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones', 399.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop', 'audio', ARRAY['30hr Battery Life', 'Quick Charge', 'Touch Controls', 'Hi-Res Audio'], 4.7, 2156, 'Best Seller', 20, 499.99, true),
('DJI Air 3', 'Compact drone with dual cameras and intelligent flight modes', 1049.99, 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop', 'electronics', ARRAY['4K HDR Video', '46min Flight Time', 'Obstacle Avoidance', 'ActiveTrack 360°'], 4.6, 89, 'New Arrival', NULL, NULL, true),
('PlayStation 5', 'Next-generation gaming console with ultra-high speed SSD', 499.99, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop', 'gaming', ARRAY['Ultra-High Speed SSD', 'Ray Tracing', '4K Gaming', 'Haptic Feedback'], 4.5, 1834, 'Hot Deal', 5, 529.99, true),
('Apple MacBook Pro 16"', 'Powerful laptop with M3 Pro chip for professional workflows', 2499.99, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 'electronics', ARRAY['M3 Pro Chip', '18hr Battery', 'Liquid Retina XDR', '1TB SSD'], 4.8, 567, NULL, NULL, NULL, true);
