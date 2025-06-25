
import { Product } from "../types/product";

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Sony Alpha 7R V",
    description: "Professional full-frame mirrorless camera with 61MP sensor, perfect for landscape and portrait photography",
    price: 3899,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
    category: "cameras",
    rating: 4.8,
    reviews: 324,
    badge: "Professional",
    discount: 9,
    features: ["61MP Full-Frame Sensor", "8K Video Recording", "5-Axis Stabilization", "Weather Sealed"],
    inStock: true
  },
  {
    id: "2",
    name: "PlayStation 5 Console",
    description: "Next-generation gaming console with lightning-fast loading and immersive 3D audio",
    price: 499,
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop",
    category: "gaming",
    rating: 4.9,
    reviews: 1250,
    badge: "Best Seller",
    features: ["Custom SSD", "Ray Tracing", "3D Audio", "DualSense Controller"],
    inStock: true
  },
  {
    id: "3",
    name: "MacBook Pro 16-inch M3",
    description: "Powerful laptop for professionals with M3 chip, stunning Liquid Retina XDR display",
    price: 2499,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "electronics",
    rating: 4.7,
    reviews: 892,
    badge: "New",
    features: ["M3 Pro Chip", "18-hour Battery", "Liquid Retina XDR", "Studio-quality Mics"],
    inStock: true
  },
  {
    id: "4",
    name: "AirPods Pro (3rd Gen)",
    description: "Premium wireless earbuds with adaptive transparency and personalized spatial audio",
    price: 249,
    originalPrice: 299,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=300&fit=crop",
    category: "audio",
    rating: 4.6,
    reviews: 2103,
    discount: 17,
    features: ["Active Noise Cancellation", "Spatial Audio", "USB-C Charging", "6 Hour Battery"],
    inStock: true
  },
  {
    id: "5",
    name: "DJI Mini 4 Pro",
    description: "Compact drone with 4K HDR video, omnidirectional obstacle sensing, and 34-min flight time",
    price: 759,
    image: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&h=300&fit=crop",
    category: "electronics",
    rating: 4.5,
    reviews: 456,
    badge: "Trending",
    features: ["4K HDR Video", "Omnidirectional Sensing", "34-min Flight", "10km Transmission"],
    inStock: true
  },
  {
    id: "6",
    name: "SteelSeries Arctis Nova Pro",
    description: "Premium gaming headset with high-fidelity drivers and active noise cancellation",
    price: 349,
    image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop",
    category: "gaming",
    rating: 4.4,
    reviews: 678,
    features: ["High-Fidelity Drivers", "Active Noise Cancellation", "Wireless", "50 Hour Battery"],
    inStock: true
  },
  {
    id: "7",
    name: "iPhone 15 Pro Max",
    description: "The ultimate iPhone with titanium design, Action Button, and advanced camera system",
    price: 1199,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    category: "electronics",
    rating: 4.8,
    reviews: 3421,
    badge: "Latest",
    features: ["Titanium Design", "A17 Pro Chip", "Pro Camera System", "Action Button"],
    inStock: true
  },
  {
    id: "8",
    name: "Magic Mouse",
    description: "Multi-touch wireless mouse with sleek design and intuitive gestures",
    price: 79,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    category: "accessories",
    rating: 4.2,
    reviews: 234,
    features: ["Multi-Touch Surface", "Wireless", "Rechargeable", "Optimized Foot Design"],
    inStock: true
  }
];
