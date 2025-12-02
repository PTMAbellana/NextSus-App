import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { Coffee, AlertTriangle, CheckCircle, TrendingDown, ArrowLeft } from 'lucide-react';

const Canteen = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const meals = [
    { id: '1', name: 'Chicken Adobo', vendor: 'Filipino Delight', price: 85, stock: 42, maxStock: 50, category: 'Main Course' },
    { id: '2', name: 'Beef Sinigang', vendor: 'Filipino Delight', price: 95, stock: 8, maxStock: 40, category: 'Main Course' },
    { id: '3', name: 'Pork BBQ', vendor: 'Grill Master', price: 75, stock: 25, maxStock: 60, category: 'Main Course' },
    { id: '4', name: 'Vegetable Lumpia', vendor: 'Healthy Bites', price: 45, stock: 35, maxStock: 80, category: 'Snacks' },
    { id: '5', name: 'Pancit Canton', vendor: 'Noodle House', price: 60, stock: 18, maxStock: 50, category: 'Main Course' },
    { id: '6', name: 'Halo-Halo', vendor: 'Sweet Treats', price: 65, stock: 5, maxStock: 30, category: 'Dessert' },
    { id: '7', name: 'Sisig Rice Bowl', vendor: 'Filipino Delight', price: 90, stock: 28, maxStock: 45, category: 'Main Course' },
    { id: '8', name: 'Fresh Mango Shake', vendor: 'Smoothie Bar', price: 55, stock: 22, maxStock: 40, category: 'Beverage' },
  ];

  const getStockStatus = (stock, maxStock) => {
    const percentage = (stock / maxStock) * 100;
    if (percentage <= 20) return { label: 'Low Stock', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
    if (percentage <= 50) return { label: 'Medium Stock', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
  };

  const categories = ['All', 'Main Course', 'Snacks', 'Dessert', 'Beverage'];
  const vendors = [...new Set(meals.map(m => m.vendor))];

  const lowStockMeals = meals.filter(m => (m.stock / m.maxStock) * 100 <= 20);
  const availableMeals = meals.filter(m => m.stock > 0);

  const filteredMeals = selectedCategory === 'All' 
    ? meals 
    : meals.filter(m => m.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4 px-6 pt-6">
          <button 
            onClick={() => navigate('/')}
            className="text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-2xl mb-2 font-bold">Campus Canteen</h2>
            <p className="text-gray-600">Real-time meal availability and smart inventory tracking</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-2xl text-green-600 mb-1 font-bold">{availableMeals.length}</div>
            <div className="text-sm text-gray-600">Meals Available</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4">
            <div className="text-2xl text-red-600 mb-1 font-bold">{lowStockMeals.length}</div>
            <div className="text-sm text-gray-600">Low Stock Items</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-2xl text-blue-600 mb-1 font-bold">{vendors.length}</div>
            <div className="text-sm text-gray-600">Active Vendors</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-2xl text-purple-600 mb-1 font-bold">₱{Math.round(meals.reduce((acc, m) => acc + m.price, 0) / meals.length)}</div>
            <div className="text-sm text-gray-600">Avg. Meal Price</div>
          </div>
        </div>

        {/* Low Stock Alert */}
        {lowStockMeals.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-900 mb-2 font-semibold">Low Stock Alert</h4>
                <p className="text-sm text-red-800 mb-2">
                  The following items are running low. Order soon to avoid missing out!
                </p>
                <div className="flex flex-wrap gap-2">
                  {lowStockMeals.map(meal => (
                    <span key={meal.id} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                      {meal.name} ({meal.stock} left)
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-gray-700 whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Meals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeals.map(meal => {
            const status = getStockStatus(meal.stock, meal.maxStock);
            const stockPercentage = (meal.stock / meal.maxStock) * 100;

            return (
              <div
                key={meal.id}
                className={`bg-white rounded-xl p-4 border-2 ${status.border} hover:shadow-md transition-all`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1 font-semibold">{meal.name}</h4>
                    <p className="text-sm text-gray-600">{meal.vendor}</p>
                  </div>
                  <Coffee className={`w-5 h-5 ${status.color}`} />
                </div>

                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-2xl font-bold">₱{meal.price}</span>
                  <span className="text-sm text-gray-500">{meal.category}</span>
                </div>

                {/* Stock Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Stock</span>
                    <span className={status.color}>{meal.stock} / {meal.maxStock}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        stockPercentage <= 20 ? 'bg-red-500' :
                        stockPercentage <= 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${stockPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                  <button
                    disabled={meal.stock === 0}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors font-medium ${
                      meal.stock > 0
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {meal.stock > 0 ? 'Order Now' : 'Sold Out'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-blue-900 mb-1 font-semibold">Smart Inventory System</h4>
                <p className="text-sm text-blue-800">
                  Vendors input daily stock through their tablets. The system automatically 
                  decrements as orders are placed via the app or POS system.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-orange-900 mb-1 font-semibold">Reduce Food Waste</h4>
                <p className="text-sm text-orange-800">
                  Real-time visibility helps vendors better forecast demand and students 
                  make informed choices, reducing food waste by up to 30%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendors Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="mb-4 font-semibold text-lg">Active Vendors</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vendors.map(vendor => {
              const vendorMeals = meals.filter(m => m.vendor === vendor);
              const availableCount = vendorMeals.filter(m => m.stock > 0).length;

              return (
                <div key={vendor} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="mb-2 font-semibold">{vendor}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{availableCount} items available</span>
                    <span className="text-green-600 font-medium">Open</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Canteen;
