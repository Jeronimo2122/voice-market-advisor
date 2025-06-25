
import { useState } from "react";
import { Star, ShoppingCart, Heart, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAskAI = () => {
    console.log(`Asking AI about product: ${product.name}`);
    // This will be connected to Gemini Live later
  };

  return (
    <div 
      className={`group bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay buttons */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center space-x-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={handleAskAI}
          >
            <Mic className="h-4 w-4 text-white" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.badge && (
            <Badge variant="secondary" className="bg-blue-600 text-white">
              {product.badge}
            </Badge>
          )}
          {product.discount && (
            <Badge variant="destructive" className="bg-red-600 text-white">
              -{product.discount}%
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
