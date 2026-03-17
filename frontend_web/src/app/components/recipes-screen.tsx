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
        if (response.data && Array.isArray(response.data)) {
          // Map backend snake_case to frontend camelCase
          const mappedRecipes = response.data.map((r: any) => ({
            ...r,
            cookTime: r.cook_time || r.cookTime,
          }));
          setRecipeList(mappedRecipes);
        } else if (response.data?.results && Array.isArray(response.data.results)) {
           // Handle paginated responses if backend uses them
           const mappedRecipes = response.data.results.map((r: any) => ({
            ...r,
            cookTime: r.cook_time || r.cookTime,
          }));
          setRecipeList(mappedRecipes);
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

  const categories = [
    { id: "all", label: "All", emoji: "🍽️" },
    { id: "favorites", label: "Favorites", emoji: "❤️" },
    { id: "breakfast", label: "Breakfast", emoji: "🌅" },
    { id: "lunch", label: "Lunch", emoji: "☀️" },
    { id: "snack", label: "Snacks", emoji: "🍪" },
    { id: "dinner", label: "Dinner", emoji: "🌙" }
  ];

  const filteredRecipes = recipeList.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedCategory === "favorites") {
      return favorites.includes(recipe.id) && matchesSearch;
    }
    const matchesCategory = selectedCategory === "all" || recipe.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesCategory && matchesSearch;
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
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-700 dark:to-orange-700 pt-8 pb-16 px-6 rounded-b-[2rem]">
        <div className="flex items-center space-x-3 mb-3">
          <ChefHat className="w-8 h-8 text-white" />
          <h1 className="text-2xl text-white font-semibold">Recipes</h1>
        </div>
        <p className="text-amber-50 mb-4">Healthy Indian recipes for every meal</p>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-6 -mt-8 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 flex overflow-x-auto space-x-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl font-medium transition flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="px-6 grid grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <div className="text-6xl py-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                {recipe.image}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(recipe.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.includes(recipe.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
            <div className="p-4 text-left">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                {recipe.name}
              </h3>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{recipe.cookTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span>{recipe.calories} kcal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3 h-3" />
                  <span>{recipe.servings} servings</span>
                </div>
              </div>
              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                recipe.difficulty === 'Easy'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
              }`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No recipes found</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/60 flex items-end z-50">
          <div className="w-full bg-white dark:bg-gray-800 rounded-t-3xl max-h-[85vh] overflow-y-auto">
            {/* Recipe Header */}
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-700 dark:to-orange-700 p-6 rounded-t-3xl">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-white pr-4">{selectedRecipe.name}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition"
                >
                  <span className="text-white text-xl">✕</span>
                </button>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{selectedRecipe.cookTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm">{selectedRecipe.calories} kcal</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{selectedRecipe.servings} servings</span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Nutrition Info */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Nutrition (per serving)</h3>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{selectedRecipe.protein}g</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Protein</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedRecipe.carbs}g</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Carbs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedRecipe.fats}g</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fats</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{selectedRecipe.fiber}g</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Fiber</p>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">Ingredients</h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">•</span>
                      <span className="text-gray-700 dark:text-gray-300">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">Instructions</h3>
                <div className="space-y-4">
                  {selectedRecipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  toggleFavorite(selectedRecipe.id);
                }}
                className={`w-full py-4 rounded-xl font-medium transition flex items-center justify-center space-x-2 ${
                  favorites.includes(selectedRecipe.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
                }`}
              >
                <Heart className={favorites.includes(selectedRecipe.id) ? 'fill-white' : ''} />
                <span>{favorites.includes(selectedRecipe.id) ? 'Remove from Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}