import React from 'react';
import { TrendingUp, Search, AlertTriangle, Users, Clock, Zap, Activity } from 'lucide-react';
import { mockAnalytics, mockUserActivity } from '../data/mockData';
import { dictionaryTrie } from '../data/dictionaryLoader';

const StatsViewer = () => {
  const stats = mockAnalytics;
  const [dictionaryStats, setDictionaryStats] = React.useState(() => dictionaryTrie.getStats());

  // Update dictionary stats in real-time
  React.useEffect(() => {
    const updateStats = () => {
      setDictionaryStats(dictionaryTrie.getStats());
    };
    
    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, description, color }: {
    icon: any;
    title: string;
    value: string | number;
    description: string;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}15` }}>
            <Icon className="h-6 w-6" style={{ color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          System Analytics
        </h2>
        <p className="text-gray-600">
          Monitor usage patterns, performance metrics, and user behavior
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Search}
          title="Total Queries"
          value={stats.totalQueries.toLocaleString()}
          description="All-time searches"
          color="#3B82F6"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={stats.totalUsers.toLocaleString()}
          description="Monthly active users"
          color="#10B981"
        />
        <StatCard
          icon={Clock}
          title="Response Time"
          value={`${stats.avgResponseTime}ms`}
          description="Average response time"
          color="#F59E0B"
        />
        <StatCard
          icon={Zap}
          title="Success Rate"
          value={`${stats.successRate}%`}
          description="Query success rate"
          color="#8B5CF6"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Search className="h-6 w-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Dictionary Statistics</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-900">{dictionaryStats.totalWords.toLocaleString()}</div>
            <div className="text-sm text-blue-700">Total Words</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-900">{dictionaryStats.commonWords.toLocaleString()}</div>
            <div className="text-sm text-green-700">Common Words</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-900">{dictionaryStats.uncommonWords.toLocaleString()}</div>
            <div className="text-sm text-yellow-700">Uncommon Words</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-900">{dictionaryStats.rareWords.toLocaleString()}</div>
            <div className="text-sm text-red-700">Rare Words</div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Average word frequency: <strong>{dictionaryStats.avgFrequency.toLocaleString()}</strong> | 
             Average word length: <strong>{dictionaryStats.avgLength} characters</strong></p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Queries</h3>
          </div>
          
          <div className="space-y-4">
            {stats.topQueries.map((query, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{query.query}</div>
                    <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                      query.type === 'autocomplete' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {query.type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{query.count}</div>
                  <div className="text-xs text-gray-500">searches</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Common Typos</h3>
          </div>
          
          <div className="space-y-4">
            {stats.commonTypos.map((typo, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600 font-mono line-through">{typo.original}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-mono">{typo.correction}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{typo.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(typo.count / stats.commonTypos[0].count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
          </div>
          
          <div className="space-y-4">
            {mockUserActivity.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-600">
                      {user.userName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.userName}</div>
                    <div className="text-xs text-gray-500">{user.queriesCount} queries</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{user.avgResponseTime}ms</div>
                  <div className="text-xs text-gray-500">avg response</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Daily Usage Trend</h3>
        </div>
        
        <div className="flex items-end space-x-2 h-64">
          {stats.dailyUsage.map((day, index) => {
            const maxQueries = Math.max(...stats.dailyUsage.map(d => d.queries));
            const height = (day.queries / maxQueries) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-500 rounded-t-md transition-all duration-500 hover:bg-indigo-600 cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${day.queries} queries on ${day.date}`}
                ></div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsViewer;
