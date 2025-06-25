
import { useState } from "react";
import Header from "../components/Header";
import ProductGrid from "../components/ProductGrid";
import VoiceAssistant from "../components/VoiceAssistant";
import { sampleProducts } from "../data/products";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Discover the Future
          </h1>
          <p className="text-xl text-slate-300 animate-fade-in">
            Explore cutting-edge products with your AI shopping assistant
          </p>
        </div>

        <ProductGrid products={filteredProducts} />
      </main>

      <VoiceAssistant />
    </div>
  );
};

export default Index;
