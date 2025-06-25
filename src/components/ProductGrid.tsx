
import ProductCard from "./ProductCard";
import { Product } from "../types/product";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-slate-400">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product}
          index={index}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
