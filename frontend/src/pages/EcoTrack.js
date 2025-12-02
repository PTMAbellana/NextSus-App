import React from 'react';
import { Leaf, TrendingDown, Zap, Droplet, TreePine, Award, Coffee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const EcoTrack = () => {
  const carbonData = [
    { day: 'Mon', saved: 35 },
    { day: 'Tue', saved: 42 },
    { day: 'Wed', saved: 38 },
    { day: 'Thu', saved: 45 },
    { day: 'Fri', saved: 52 },
    { day: 'Sat', saved: 28 },
    { day: 'Sun', saved: 25 },
  ];

  const energyData = [
    { day: 'Mon', energy: 280 },
    { day: 'Tue', energy: 260 },
    { day: 'Wed', energy: 275 },
    { day: 'Thu', energy: 240 },
    { day: 'Fri', energy: 250 },
    { day: 'Sat', energy: 150 },
    { day: 'Sun', energy: 140 },
  ];

  const resourceDistribution = [
    { name: 'Parking Optimization', value: 35, color: '#3b82f6' },
    { name: 'Energy Savings', value: 30, color: '#10b981' },
    { name: 'Water Conservation', value: 20, color: '#06b6d4' },
    { name: 'Waste Reduction', value: 15, color: '#f59e0b' },
  ];

  const totalCarbonSaved = carbonData.reduce((acc, item) => acc + item.saved, 0);
  const avgDailyCarbon = Math.round(totalCarbonSaved / carbonData.length);
  const treesEquivalent = Math.round(totalCarbonSaved / 20);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Eco-Track Dashboard</h2>
        <p className="text-gray-600">Monitor campus sustainability performance and environmental impact</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-white">
          <Leaf className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold mb-1">{totalCarbonSaved}kg</div>
          <div className="text-sm text-green-50">CO₂ Saved This Week</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
          <Zap className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold mb-1">1.2MWh</div>
          <div className="text-sm text-blue-50">Energy Saved</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-4 text-white">
          <Droplet className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold mb-1">850L</div>
          <div className="text-sm text-cyan-50">Water Conserved</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl p-4 text-white">
          <TreePine className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold mb-1">{treesEquivalent}</div>
          <div className="text-sm text-emerald-50">Tree Equivalent</div>
        </div>
      </div>

      {/* SDG Alignment */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start gap-4">
          <Award className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold mb-2">Sustainable Development Goals Alignment</h3>
            <p className="text-sm text-gray-700 mb-3">
              NextSus contributes to achieving the United Nations Sustainable Development Goals:
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                SDG 11: Sustainable Cities
              </span>
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                SDG 12: Responsible Consumption
              </span>
              <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-sm font-medium">
                SDG 13: Climate Action
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Carbon Savings Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Daily Carbon Savings</h3>
              <p className="text-sm text-gray-600">CO₂ emissions prevented (kg)</p>
            </div>
            <TrendingDown className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={carbonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Bar dataKey="saved" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <TrendingDown className="w-4 h-4" />
              <span>Average {avgDailyCarbon}kg CO₂ saved per day</span>
            </div>
          </div>
        </div>

        {/* Energy Consumption Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold">Energy Consumption Trend</h3>
              <p className="text-sm text-gray-600">Daily usage (kWh)</p>
            </div>
            <Zap className="w-5 h-5 text-blue-600" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={energyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Zap className="w-4 h-4" />
              <span>15% reduction vs. last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-bold mb-4">Sustainability Impact Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={resourceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {resourceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Impact Metrics */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-bold mb-4">Key Impact Metrics</h3>
            <div className="space-y-3">
              {resourceDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span style={{ color: item.color }} className="font-semibold">{item.value}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
            <h4 className="text-purple-900 font-bold mb-2">Parking Optimization Impact</h4>
            <div className="space-y-2 text-sm text-purple-800">
              <div className="flex items-center justify-between">
                <span>Fuel saved (search time reduction)</span>
                <span className="font-semibold">125L</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average search time reduced</span>
                <span className="font-semibold">8 min → 2 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>CO₂ emissions prevented</span>
                <span className="font-semibold">35kg/week</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Operations Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">24%</div>
              <div className="text-sm text-gray-600">Energy Reduction</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            PIR sensors automatically turn off HVAC in unoccupied rooms
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Coffee className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">30%</div>
              <div className="text-sm text-gray-600">Food Waste Down</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Smart inventory prevents overproduction in the canteen
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">18%</div>
              <div className="text-sm text-gray-600">Carbon Footprint</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Overall campus carbon footprint reduced this semester
          </p>
        </div>
      </div>
    </div>
  );
};

export default EcoTrack;
