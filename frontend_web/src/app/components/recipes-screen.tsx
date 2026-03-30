import { useState, useEffect } from "react";
import { ChefHat, Clock, Flame, Users, Search, Heart } from "lucide-react";
import api, { endpoints } from "../helpers/api";

interface Recipe {
  id: number;
  name: string;
  category: string;
  cookTime: string;
  calories: number;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  image: string;
}

const localRecipes: Recipe[] = [
  // Breakfast
  {
    id: 1,
    name: "Masala Oats Upma",
    category: "breakfast",
    cookTime: "15 mins",
    calories: 180,
    servings: 2,
    difficulty: "Easy",
    protein: 6,
    carbs: 28,
    fats: 4,
    fiber: 5,
    image: "🥣",
    ingredients: [
      "1 cup rolled oats",
      "1 onion, chopped",
      "1 tomato, chopped",
      "1 green chili, chopped",
      "1/2 tsp mustard seeds",
      "Curry leaves",
      "1/2 tsp turmeric",
      "Salt to taste",
      "2 cups water",
      "Fresh coriander"
    ],
    instructions: [
      "Dry roast oats in a pan for 3-4 minutes until fragrant. Set aside.",
      "Heat 1 tsp oil, add mustard seeds and curry leaves.",
      "Add onions, green chili, and sauté until golden.",
      "Add tomatoes, turmeric, and salt. Cook for 2 minutes.",
      "Add 2 cups water and bring to boil.",
      "Add roasted oats, mix well, and cook for 3-4 minutes.",
      "Garnish with coriander and serve hot."
    ]
  },
  {
    id: 2,
    name: "Moong Dal Cheela",
    category: "breakfast",
    cookTime: "20 mins",
    calories: 220,
    servings: 2,
    difficulty: "Easy",
    protein: 12,
    carbs: 30,
    fats: 5,
    fiber: 8,
    image: "🥞",
    ingredients: [
      "1 cup moong dal (soaked 4 hours)",
      "1 onion, chopped",
      "1 green chili",
      "1 inch ginger",
      "1/2 tsp cumin seeds",
      "Salt to taste",
      "Fresh coriander",
      "Oil for cooking"
    ],
    instructions: [
      "Drain soaked moong dal and grind to a smooth batter with ginger and green chili.",
      "Add chopped onions, cumin seeds, salt, and coriander. Mix well.",
      "Add water if needed to make a pancake-like consistency.",
      "Heat a non-stick pan and grease lightly.",
      "Pour a ladle of batter and spread in a circle.",
      "Cook on medium heat until golden, flip and cook other side.",
      "Serve hot with green chutney or yogurt."
    ]
  },
  {
    id: 3,
    name: "Vegetable Poha",
    category: "breakfast",
    cookTime: "15 mins",
    calories: 200,
    servings: 2,
    difficulty: "Easy",
    protein: 4,
    carbs: 35,
    fats: 6,
    fiber: 3,
    image: "🍚",
    ingredients: [
      "2 cups flattened rice (poha)",
      "1 onion, sliced",
      "1 potato, diced small",
      "1/2 cup peas",
      "1 green chili, chopped",
      "1/2 tsp mustard seeds",
      "1/2 tsp turmeric",
      "Curry leaves",
      "Peanuts",
      "Lemon juice",
      "Fresh coriander"
    ],
    instructions: [
      "Rinse poha in water and drain immediately. Set aside.",
      "Heat 1 tbsp oil, add mustard seeds, curry leaves, and peanuts.",
      "Add onions, green chili, and sauté until translucent.",
      "Add potatoes and peas, cook until tender (add water if needed).",
      "Add turmeric and salt, mix well.",
      "Add drained poha, mix gently without breaking.",
      "Cook for 2-3 minutes.",
      "Add lemon juice, garnish with coriander, and serve."
    ]
  },

  // Lunch
  {
    id: 4,
    name: "Dal Tadka",
    category: "lunch",
    cookTime: "30 mins",
    calories: 180,
    servings: 4,
    difficulty: "Medium",
    protein: 10,
    carbs: 28,
    fats: 4,
    fiber: 12,
    image: "🍲",
    ingredients: [
      "1 cup toor dal (split pigeon peas)",
      "2 tomatoes, chopped",
      "1 onion, chopped",
      "2 green chilies",
      "1 tsp cumin seeds",
      "3-4 garlic cloves",
      "1/2 tsp turmeric",
      "1 tsp red chili powder",
      "1 tsp garam masala",
      "Fresh coriander",
      "Ghee for tadka"
    ],
    instructions: [
      "Wash and pressure cook dal with turmeric, salt, and 3 cups water for 3-4 whistles.",
      "Mash the cooked dal lightly.",
      "Heat 2 tsp ghee in a pan, add cumin seeds and garlic.",
      "Add onions and green chilies, sauté until golden.",
      "Add tomatoes, red chili powder, and cook until mushy.",
      "Pour this tadka over the dal and mix well.",
      "Add garam masala and simmer for 5 minutes.",
      "Garnish with coriander and serve with rice or roti."
    ]
  },
  {
    id: 5,
    name: "Paneer Tikka Masala",
    category: "lunch",
    cookTime: "35 mins",
    calories: 320,
    servings: 3,
    difficulty: "Medium",
    protein: 18,
    carbs: 12,
    fats: 22,
    fiber: 3,
    image: "🧊",
    ingredients: [
      "250g paneer, cubed",
      "1 cup yogurt",
      "1 tbsp tikka masala",
      "2 tomatoes, pureed",
      "1 onion, chopped",
      "1 capsicum, cubed",
      "1 inch ginger-garlic paste",
      "1 tsp kasuri methi",
      "1/2 cup cream",
      "Oil for cooking"
    ],
    instructions: [
      "Marinate paneer and capsicum with yogurt, tikka masala, and salt for 30 minutes.",
      "Grill or pan-fry marinated paneer until golden. Set aside.",
      "Heat oil, add ginger-garlic paste and onions. Sauté until golden.",
      "Add tomato puree, salt, and cook until oil separates.",
      "Add grilled paneer, kasuri methi, and mix gently.",
      "Add cream and simmer for 5 minutes.",
      "Garnish with coriander and serve with naan or rice."
    ]
  },
  {
    id: 6,
    name: "Rajma Masala (Kidney Bean Curry)",
    category: "lunch",
    cookTime: "40 mins",
    calories: 240,
    servings: 4,
    difficulty: "Medium",
    protein: 14,
    carbs: 38,
    fats: 4,
    fiber: 11,
    image: "🫘",
    ingredients: [
      "1 cup rajma (kidney beans), soaked overnight",
      "2 onions, chopped",
      "2 tomatoes, pureed",
      "1 tbsp ginger-garlic paste",
      "2 green chilies",
      "1 tsp cumin seeds",
      "1 tsp coriander powder",
      "1 tsp garam masala",
      "1/2 tsp red chili powder",
      "Fresh coriander"
    ],
    instructions: [
      "Pressure cook soaked rajma with salt and water for 6-7 whistles until soft.",
      "Heat oil, add cumin seeds and ginger-garlic paste.",
      "Add onions and green chilies, sauté until golden brown.",
      "Add tomato puree, coriander powder, red chili powder, and cook well.",
      "Add cooked rajma with its water.",
      "Simmer for 15-20 minutes until gravy thickens.",
      "Add garam masala, garnish with coriander.",
      "Serve hot with rice."
    ]
  },

  // Snacks
  {
    id: 7,
    name: "Sprouts Chaat",
    category: "snack",
    cookTime: "10 mins",
    calories: 150,
    servings: 2,
    difficulty: "Easy",
    protein: 8,
    carbs: 22,
    fats: 3,
    fiber: 6,
    image: "🥗",
    ingredients: [
      "2 cups mixed sprouts (moong, chana)",
      "1 onion, chopped",
      "1 tomato, chopped",
      "1 cucumber, chopped",
      "1 green chili, chopped",
      "Chaat masala",
      "Lemon juice",
      "Fresh coriander",
      "Sev (optional)"
    ],
    instructions: [
      "Boil sprouts for 5 minutes until tender. Drain and cool.",
      "In a bowl, mix sprouts, onions, tomatoes, and cucumber.",
      "Add green chili, chaat masala, and salt.",
      "Squeeze lemon juice and mix well.",
      "Garnish with coriander and sev.",
      "Serve immediately as a healthy snack."
    ]
  },
  {
    id: 8,
    name: "Masala Roasted Makhana",
    category: "snack",
    cookTime: "10 mins",
    calories: 120,
    servings: 2,
    difficulty: "Easy",
    protein: 4,
    carbs: 18,
    fats: 4,
    fiber: 2,
    image: "🍿",
    ingredients: [
      "2 cups makhana (fox nuts)",
      "1 tsp ghee",
      "1/2 tsp chaat masala",
      "1/4 tsp turmeric",
      "1/4 tsp red chili powder",
      "Salt to taste",
      "Curry leaves (optional)"
    ],
    instructions: [
      "Heat ghee in a pan on low flame.",
      "Add makhana and roast for 5-7 minutes, stirring continuously.",
      "Add curry leaves if using.",
      "Once makhana becomes crispy, add all spices and salt.",
      "Mix well to coat evenly.",
      "Let it cool and store in an airtight container.",
      "Enjoy as a healthy, crunchy snack."
    ]
  },
  {
    id: 9,
    name: "Vegetable Cutlets",
    category: "snack",
    cookTime: "25 mins",
    calories: 180,
    servings: 4,
    difficulty: "Medium",
    protein: 6,
    carbs: 26,
    fats: 6,
    fiber: 4,
    image: "🥔",
    ingredients: [
      "3 potatoes, boiled and mashed",
      "1/2 cup mixed vegetables (carrots, peas, beans)",
      "2 tbsp bread crumbs",
      "1 green chili, chopped",
      "1 tsp ginger paste",
      "1/2 tsp garam masala",
      "Fresh coriander",
      "Salt to taste",
      "Oil for shallow frying"
    ],
    instructions: [
      "Mix mashed potatoes with boiled vegetables, green chili, ginger, and spices.",
      "Add coriander and bread crumbs, mix well.",
      "Shape into round or oval patties.",
      "Heat oil in a pan.",
      "Shallow fry cutlets until golden brown on both sides.",
      "Drain on paper towels.",
      "Serve hot with green chutney or ketchup."
    ]
  },

  // Dinner
  {
    id: 10,
    name: "Palak Paneer",
    category: "dinner",
    cookTime: "30 mins",
    calories: 280,
    servings: 3,
    difficulty: "Medium",
    protein: 16,
    carbs: 10,
    fats: 20,
    fiber: 4,
    image: "🥬",
    ingredients: [
      "250g paneer, cubed",
      "400g spinach (palak)",
      "1 onion, chopped",
      "2 tomatoes, chopped",
      "1 tbsp ginger-garlic paste",
      "2 green chilies",
      "1 tsp cumin seeds",
      "1/2 tsp garam masala",
      "2 tbsp cream",
      "Salt to taste"
    ],
    instructions: [
      "Blanch spinach in boiling water for 2 minutes, then put in cold water.",
      "Blend spinach with green chilies to a smooth puree.",
      "Heat oil, add cumin seeds and ginger-garlic paste.",
      "Add onions and sauté until golden.",
      "Add tomatoes and cook until mushy.",
      "Add spinach puree, salt, and cook for 5 minutes.",
      "Add paneer cubes and garam masala, simmer for 5 minutes.",
      "Add cream, mix gently, and serve with roti."
    ]
  },
  {
    id: 11,
    name: "Chicken Curry",
    category: "dinner",
    cookTime: "40 mins",
    calories: 320,
    servings: 4,
    difficulty: "Medium",
    protein: 35,
    carbs: 8,
    fats: 18,
    fiber: 2,
    image: "🍗",
    ingredients: [
      "500g chicken, cut into pieces",
      "2 onions, chopped",
      "2 tomatoes, pureed",
      "1 tbsp ginger-garlic paste",
      "1 tsp cumin seeds",
      "2 tsp coriander powder",
      "1 tsp garam masala",
      "1/2 tsp turmeric",
      "1 tsp red chili powder",
      "Curry leaves",
      "Fresh coriander"
    ],
    instructions: [
      "Heat oil, add cumin seeds and curry leaves.",
      "Add onions and sauté until golden brown.",
      "Add ginger-garlic paste and sauté for 1 minute.",
      "Add tomato puree and all spices, cook until oil separates.",
      "Add chicken pieces and mix well to coat with masala.",
      "Add 1 cup water, salt, and cover. Cook for 25-30 minutes until chicken is tender.",
      "Garnish with coriander and serve with rice or roti."
    ]
  },
  {
    id: 12,
    name: "Vegetable Khichdi",
    category: "dinner",
    cookTime: "25 mins",
    calories: 210,
    servings: 3,
    difficulty: "Easy",
    protein: 8,
    carbs: 38,
    fats: 4,
    fiber: 6,
    image: "🍛",
    ingredients: [
      "1/2 cup rice",
      "1/2 cup moong dal",
      "Mixed vegetables (carrots, peas, beans)",
      "1 tsp cumin seeds",
      "1/2 tsp turmeric",
      "1 tsp ginger, chopped",
      "2 green chilies",
      "Salt to taste",
      "Ghee for tempering"
    ],
    instructions: [
      "Wash rice and dal together.",
      "Heat 1 tsp ghee, add cumin seeds and ginger.",
      "Add vegetables and sauté for 2 minutes.",
      "Add rice, dal, turmeric, salt, and 4 cups water.",
      "Pressure cook for 3-4 whistles until soft and mushy.",
      "Make a tadka with ghee, cumin, and green chilies.",
      "Pour over khichdi and serve with yogurt or pickle."
    ]
  }
];

function NutritionChip({ label, value, color }: { label: string, value: number, color: string }) {
  const colors: any = {
    green: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40",
    blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/40",
    purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/40",
    orange: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/40"
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-3xl border ${colors[color]} shadow-sm transform transition-all hover:scale-105`}>
      <span className="text-2xl font-black mb-1">{value}g</span>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
    </div>
  );
}

export function RecipesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recipeList, setRecipeList] = useState<Recipe[]>(localRecipes);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(endpoints.recipes);
        let data = response.data;
        if (data && data.recipes && Array.isArray(data.recipes)) {
          data = data.recipes;
        } else if (data && data.results && Array.isArray(data.results)) {
          data = data.results;
        }

        if (Array.isArray(data)) {
          const mappedRecipes = data.map((r: any) => ({
            ...r,
            cookTime: r.cook_time || r.cookTime || "15 mins",
            protein: r.protein || 0,
            carbs: r.carbs || 0,
            fats: r.fats || 0,
            fiber: r.fiber || 0,
            calories: r.calories || 0,
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : (r.ingredients ? JSON.parse(r.ingredients) : []),
            instructions: Array.isArray(r.instructions) ? r.instructions : (r.instructions ? JSON.parse(r.instructions) : []),
          }));
          setRecipeList(mappedRecipes.length > 0 ? mappedRecipes : localRecipes);
        }
      } catch (error) {
        console.error("Failed to fetch recipes from backend, using fallback:", error);
        setRecipeList(localRecipes);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const logRecipeToDashboard = async (recipe: Recipe) => {
    try {
      await api.post(endpoints.logFood, {
        food_name: recipe.name,
        calories: recipe.calories,
        protein: recipe.protein,
        carbs: recipe.carbs,
        fats: recipe.fats,
        quantity: 1,
        unit: 'serving',
        meal_type: recipe.category || 'snack'
      });
      alert(`Logged ${recipe.name} to your dashboard!`);
      const { dispatchRefresh } = await import('../helpers/api');
      dispatchRefresh();
    } catch (error) {
      console.error("Failed to log recipe:", error);
      alert("Failed to log recipe. Please try again.");
    }
  };

  const categories = [
    { id: "all", label: "All", emoji: "🍽️" },
    { id: "favorites", label: "Favorites", emoji: "❤️" },
    { id: "breakfast", label: "Breakfast", emoji: "🌅", color: "bg-[#FFF3E0]", darkColor: "dark:bg-orange-900/20" },
    { id: "lunch", label: "Lunch", emoji: "☀️", color: "bg-[#E8F5E9]", darkColor: "dark:bg-green-900/20" },
    { id: "snack", label: "Snacks", emoji: "🍪", color: "bg-[#F3E5F5]", darkColor: "dark:bg-purple-900/20" },
    { id: "dinner", label: "Dinner", emoji: "🌙", color: "bg-[#E3F2FD]", darkColor: "dark:bg-blue-900/20" }
  ];

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterOptions = [
    { id: "high-protein", label: "High Protein", rule: (r: Recipe) => r.protein > 15 },
    { id: "low-carb", label: "Low Carb", rule: (r: Recipe) => r.carbs < 20 },
    { id: "high-fiber", label: "High Fiber", rule: (r: Recipe) => r.fiber > 8 },
    { id: "low-cal", label: "Low Calorie", rule: (r: Recipe) => r.calories < 200 },
  ];

  const toggleFilter = (id: string) => {
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredRecipes = recipeList.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category check
    let matchesCategory = true;
    if (selectedCategory === "favorites") {
      matchesCategory = favorites.includes(recipe.id);
    } else if (selectedCategory !== "all") {
      matchesCategory = recipe.category.toLowerCase() === selectedCategory.toLowerCase();
    }

    // Advanced filters check
    const matchesFilters = activeFilters.every(fId => {
      const filter = filterOptions.find(opt => opt.id === fId);
      return filter ? filter.rule(recipe) : true;
    });

    return matchesSearch && matchesCategory && matchesFilters;
  });

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Premium Header */}
      <div className="bg-recipe-header-gradient pt-12 pb-16 px-6 rounded-b-[40px] relative overflow-hidden h-[260px] shadow-lg">
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center justify-center h-full text-center">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-10 h-10 text-white" />
            <h1 className="text-4xl font-black text-white tracking-tighter">RECIPES</h1>
          </div>
          <p className="text-white/90 text-sm font-bold tracking-widest uppercase mb-6">Discover healthy Indian meals</p>

          {/* Search Bar (Floating Style) */}
          <div className="w-full max-w-lg relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/95 backdrop-blur-sm border-none shadow-xl focus:ring-4 focus:ring-orange-500/20 focus:outline-none text-gray-800 font-bold transition-all"
            />
          </div>
        </div>
        
        {/* Decorative Circle (matching Android feel) */}
        <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/5 rounded-full blur-2xl"></div>
      </div>

      {/* Category Tabs Row (Android Style) */}
      <div className="px-6 -mt-10 mb-8 relative z-20">
        <div className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-3 flex overflow-x-auto gap-3 no-scrollbar border border-white/50 dark:border-gray-700/50">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all transform active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-orange-500'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Filters Row */}
      <div className="px-6 mb-8 flex overflow-x-auto gap-3 no-scrollbar pb-2">
        {filterOptions.map(opt => (
          <button
            key={opt.id}
            onClick={() => toggleFilter(opt.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95 ${
              activeFilters.includes(opt.id)
                ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Recipes Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => {
          const categoryObj = categories.find(c => c.id === recipe.category.toLowerCase()) || categories[0];
          const bgColor = categoryObj.color || "bg-gray-50";
          const darkBgColor = categoryObj.darkColor || "dark:bg-gray-900/20";

          return (
            <div
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-xl transition-all transform active:scale-95 cursor-pointer border border-gray-100 dark:border-gray-700 flex flex-col h-full group"
            >
              <div className="relative overflow-hidden">
                <div className={`text-6xl py-12 ${bgColor} ${darkBgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-700`}>
                  {recipe.image}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(recipe.id);
                  }}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/60 backdrop-blur-md dark:bg-gray-700/60 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition active:scale-90 border border-white/20"
                >
                  <Heart
                    className={`w-6 h-6 transition-all ${
                      favorites.includes(recipe.id)
                        ? 'text-red-500 fill-red-500'
                        : 'text-gray-400 group-hover:text-red-300'
                    }`}
                  />
                </button>
                {/* Meta Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white text-[10px] font-black tracking-widest uppercase">
                  {recipe.difficulty}
                </div>
              </div>
              
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-black text-gray-900 dark:text-white mb-3 line-clamp-2 text-xs uppercase tracking-tight leading-tight flex-1">
                  {recipe.name}
                </h3>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-orange-500">
                      <Flame className="w-3 h-3" />
                      <span className="text-[10px] font-black">{recipe.calories}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span className="text-[10px] font-black">{recipe.cookTime}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 p-0 sm:p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-t-[3rem] sm:rounded-[3rem] max-h-[92vh] overflow-y-auto shadow-2xl relative animate-in slide-in-from-bottom duration-500">
            {/* Recipe Header */}
            <div className="sticky top-0 z-10 bg-recipe-header-gradient p-8 pb-12 rounded-t-[3rem] relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 pr-4">
                   <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-md">
                    {selectedRecipe.category}
                  </span>
                  <h2 className="text-3xl font-black text-white leading-tight">{selectedRecipe.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center hover:bg-white/40 transition active:scale-90 backdrop-blur-md shadow-inner"
                >
                  <span className="text-white text-2xl font-bold">✕</span>
                </button>
              </div>
              <div className="flex items-center space-x-6 text-white mt-6 relative z-10">
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                  <Clock className="w-4 h-4 opacity-80" />
                  <span className="text-xs font-bold">{selectedRecipe.cookTime}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                  <Flame className="w-4 h-4 opacity-80" />
                  <span className="text-xs font-bold">{selectedRecipe.calories} kcal</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                  <Users className="w-4 h-4 opacity-80" />
                  <span className="text-xs font-bold">{selectedRecipe.servings} Servings</span>
                </div>
              </div>
              {/* Decorative circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <div className="p-8 space-y-8 -mt-6 bg-white dark:bg-gray-900 rounded-t-[3rem] relative z-20">
              {/* Nutrition Info - High Fidelity Chips */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-inner">
                <h3 className="font-black text-gray-800 dark:text-white mb-6 tracking-wide uppercase text-xs">Nutrition Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <NutritionChip label="Protein" value={selectedRecipe.protein} color="green" />
                  <NutritionChip label="Carbs" value={selectedRecipe.carbs} color="blue" />
                  <NutritionChip label="Fats" value={selectedRecipe.fats} color="purple" />
                  <NutritionChip label="Fiber" value={selectedRecipe.fiber} color="orange" />
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-gray-800 dark:text-white tracking-wide uppercase text-xs">Ingredients</h3>
                  <span className="text-[10px] font-bold text-gray-400">{selectedRecipe.ingredients.length} Items</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-4 bg-gray-50/50 dark:bg-gray-800/30 p-4 rounded-2xl border border-transparent hover:border-orange-100 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-black text-gray-800 dark:text-white mb-6 tracking-wide uppercase text-xs">Preparation</h3>
                <div className="space-y-6">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-5 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl flex items-center justify-center font-black flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => logRecipeToDashboard(selectedRecipe)}
                  className="flex-1 py-5 rounded-[2rem] font-black tracking-widest uppercase text-xs transition-all duration-300 shadow-xl flex items-center justify-center space-x-3 active:scale-95 bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-emerald-200"
                >
                  <ChefHat className="w-5 h-5 text-white" />
                  <span>Log to Dashboard</span>
                </button>
                <button
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  className={`flex-1 py-5 rounded-[2rem] font-black tracking-widest uppercase text-xs transition-all duration-300 shadow-xl flex items-center justify-center space-x-3 active:scale-95 ${
                    favorites.includes(selectedRecipe.id)
                      ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-200 dark:shadow-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-100 dark:border-gray-700 hover:border-orange-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(selectedRecipe.id) ? 'fill-white' : ''}`} />
                  <span>{favorites.includes(selectedRecipe.id) ? 'Saved' : 'Save Recipe'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}