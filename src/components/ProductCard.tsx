
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden rounded-lg mb-3">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1">
          {product.badge && (
            <Badge variant="secondary" className="bg-blue-600 text-white text-xs">
              {product.badge}
            </Badge>
          )}
          {product.discount && (
            <Badge variant="destructive" className="bg-red-600 text-white text-xs">
              -{product.discount}%
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-slate-600'}`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviews})</span>
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
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
