
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "../hooks/useProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  
  const product = products.find(p => p.id === id);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading product...</div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Product not found</h1>
          <Button onClick={() => navigate("/")} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/")}
            className="text-white hover:bg-slate-700 mr-3"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-white truncate">{product.name}</h1>
        </div>
      </div>

      {/* Product Content */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Product Image */}
        <div className="relative mb-6">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-80 object-cover rounded-xl shadow-lg"
          />
          {product.badge && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {product.badge}
              </span>
            </div>
          )}
          {product.discount && (
            <div className="absolute top-4 right-4">
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                -{product.discount}%
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{product.name}</h1>
            <p className="text-slate-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-white">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-slate-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-slate-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Assistant Button */}
          <div className="pt-6">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-xl shadow-lg"
              onClick={() => console.log("AI Assistant clicked for product:", product.name)}
            >
              🎙️ Talk to AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
