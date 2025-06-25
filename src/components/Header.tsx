
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const Header = ({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }: HeaderProps) => {
  const { user } = useAuth();
  
  const categories = [
    { value: "all", label: "All" },
    { value: "electronics", label: "Electronics" },
    { value: "cameras", label: "Cameras" },
    { value: "audio", label: "Audio" },
    { value: "gaming", label: "Gaming" },
    { value: "accessories", label: "Accessories" }
  ];

  return (
    <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
      <div className="px-4 py-4">
        {/* Top row with user info and logout */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-white">
            <span className="text-sm text-slate-300">Welcome back, </span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <LogoutButton />
        </div>
        
        {/* Search and Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-28 bg-slate-700/50 border-slate-600 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value} className="text-white hover:bg-slate-700">
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default Header;
