import React, { useState } from 'react';
import { Apple, Utensils, Droplet, Pill, Plus, TrendingUp } from 'lucide-react';
import { Button } from './Button';
import { ProgressRing } from './ProgressRing';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function NutritionModule() {
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  const dailyGoals = {
    calories: { current: 2100, target: 2800, unit: 'kcal' },
    protein: { current: 145, target: 180, unit: 'g' },
    carbs: { current: 220, target: 300, unit: 'g' },
    fats: { current: 55, target: 70, unit: 'g' },
    water: { current: 64, target: 100, unit: 'oz' }
  };

  const mealPlan = {
    breakfast: {
      name: 'Breakfast',
      time: '7:00 AM',
      logged: true,
      items: [
        { name: 'Scrambled Eggs (4 eggs)', calories: 280, protein: 24, carbs: 2, fats: 20 },
        { name: 'Whole Wheat Toast (2 slices)', calories: 160, protein: 8, carbs: 28, fats: 2 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
        { name: 'Greek Yogurt', calories: 150, protein: 17, carbs: 8, fats: 4 }
      ]
    },
    lunch: {
      name: 'Lunch',
      time: '12:30 PM',
      logged: true,
      items: [
        { name: 'Grilled Chicken Breast (8oz)', calories: 370, protein: 70, carbs: 0, fats: 8 },
        { name: 'Brown Rice (1.5 cups)', calories: 330, protein: 7, carbs: 69, fats: 3 },
        { name: 'Mixed Vegetables', calories: 80, protein: 4, carbs: 16, fats: 0 }
      ]
    },
    snack: {
      name: 'Pre-Workout Snack',
      time: '3:00 PM',
      logged: true,
      items: [
        { name: 'Protein Shake', calories: 250, protein: 30, carbs: 25, fats: 3 },
        { name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0 }
      ]
    },
    dinner: {
      name: 'Dinner',
      time: '6:30 PM',
      logged: false,
      items: []
    }
  };

  const supplements = [
    { name: 'Whey Protein', timing: 'Post-Workout', taken: true },
    { name: 'Creatine (5g)', timing: 'Daily', taken: true },
    { name: 'Multivitamin', timing: 'Morning', taken: true },
    { name: 'Fish Oil', timing: 'Evening', taken: false },
  ];

  const recipes = [
    {
      name: 'High-Protein Pasta Bowl',
      calories: 650,
      protein: 52,
      time: '25 min',
      image: 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYyMzY3MzUzfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      name: 'Athlete\'s Power Bowl',
      calories: 580,
      protein: 45,
      time: '20 min',
      image: 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwbWVhbCUyMHByZXB8ZW58MXx8fHwxNzYyMzY3MzUzfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  const currentMeal = mealPlan[selectedMeal as keyof typeof mealPlan];

  return (
    <div className="space-y-6 animate-slide-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-white mb-2">Nutrition Tracking</h2>
          <p className="text-gray-400">Monitor your daily intake and reach your goals</p>
        </div>
        <Button variant="primary">
          <Plus className="w-5 h-5" />
          Log Meal
        </Button>
      </div>

      {/* Daily Macros */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <h3 className="text-white mb-6">Today's Macros</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <ProgressRing
              progress={(dailyGoals.calories.current / dailyGoals.calories.target) * 100}
              label="Calories"
              value={`${dailyGoals.calories.current}/${dailyGoals.calories.target}`}
              size={100}
            />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={(dailyGoals.protein.current / dailyGoals.protein.target) * 100}
              label="Protein"
              value={`${dailyGoals.protein.current}g`}
              size={100}
            />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={(dailyGoals.carbs.current / dailyGoals.carbs.target) * 100}
              label="Carbs"
              value={`${dailyGoals.carbs.current}g`}
              size={100}
            />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={(dailyGoals.fats.current / dailyGoals.fats.target) * 100}
              label="Fats"
              value={`${dailyGoals.fats.current}g`}
              size={100}
            />
          </div>
          <div className="text-center">
            <ProgressRing
              progress={(dailyGoals.water.current / dailyGoals.water.target) * 100}
              label="Water"
              value={`${dailyGoals.water.current}oz`}
              size={100}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal Plan */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#252525] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Utensils className="w-6 h-6 text-[#03fd1c]" />
            <h3 className="text-white">Today's Meals</h3>
          </div>

          {/* Meal Selector */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {Object.entries(mealPlan).map(([key, meal]) => (
              <button
                key={key}
                onClick={() => setSelectedMeal(key)}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap transition-all
                  ${selectedMeal === key 
                    ? 'bg-[#03fd1c] text-black' 
                    : 'bg-[#0a0a0a] text-gray-400 hover:text-white'
                  }
                `}
              >
                {meal.name}
              </button>
            ))}
          </div>

          {/* Meal Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white">{currentMeal.name}</p>
                <p className="text-gray-400">{currentMeal.time}</p>
              </div>
              {currentMeal.logged && (
                <span className="px-3 py-1 bg-[#03fd1c]/10 text-[#03fd1c] rounded-full">Logged</span>
              )}
            </div>

            {currentMeal.items.length > 0 ? (
              <div className="space-y-3">
                {currentMeal.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 bg-[#0a0a0a] border border-[#252525] rounded-lg"
                  >
                    <p className="text-white mb-2">{item.name}</p>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-gray-400 text-xs">Calories</p>
                        <p className="text-white">{item.calories}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Protein</p>
                        <p className="text-white">{item.protein}g</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Carbs</p>
                        <p className="text-white">{item.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Fats</p>
                        <p className="text-white">{item.fats}g</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-[#252525] rounded-lg">
                <Apple className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No meals logged yet</p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Plus className="w-4 h-4" />
                  Add Meal
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Hydration & Supplements */}
        <div className="space-y-6">
          {/* Hydration */}
          <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Droplet className="w-6 h-6 text-[#03fd1c]" />
              <h3 className="text-white">Hydration</h3>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl text-white mb-1">{dailyGoals.water.current}oz</div>
              <p className="text-gray-400">of {dailyGoals.water.target}oz goal</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, idx) => (
                <div 
                  key={idx}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center
                    ${idx < 5 ? 'bg-[#03fd1c]/20' : 'bg-[#252525]'}
                  `}
                >
                  <Droplet 
                    className={`w-6 h-6 ${idx < 5 ? 'text-[#03fd1c]' : 'text-gray-600'}`}
                  />
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              <Plus className="w-4 h-4" />
              Log Water
            </Button>
          </div>

          {/* Supplements */}
          <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Pill className="w-6 h-6 text-[#03fd1c]" />
              <h3 className="text-white">Supplements</h3>
            </div>
            <div className="space-y-3">
              {supplements.map((supplement, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg"
                >
                  <div>
                    <p className="text-white">{supplement.name}</p>
                    <p className="text-gray-400 text-xs">{supplement.timing}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={supplement.taken}
                    readOnly
                    className="w-5 h-5 rounded accent-[#03fd1c]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Library */}
      <div className="bg-[#141414] border border-[#252525] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white">Recommended Recipes</h3>
          <Button variant="ghost" size="sm">
            Browse All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe, idx) => (
            <div 
              key={idx}
              className="bg-[#0a0a0a] border border-[#252525] rounded-lg overflow-hidden hover:border-[#03fd1c] transition-all cursor-pointer"
            >
              <ImageWithFallback
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-white mb-2">{recipe.name}</p>
                <div className="flex items-center gap-4 text-gray-400">
                  <span>{recipe.calories} cal</span>
                  <span>•</span>
                  <span>{recipe.protein}g protein</span>
                  <span>•</span>
                  <span>{recipe.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
