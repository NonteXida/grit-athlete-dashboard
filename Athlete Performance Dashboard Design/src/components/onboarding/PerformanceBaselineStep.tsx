import React from 'react';
import { Activity, Timer, TrendingUp, Moon, Brain, Droplets } from 'lucide-react';

interface PerformanceBaselineStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PerformanceBaselineStep: React.FC<PerformanceBaselineStepProps> = ({
  data,
  onUpdate,
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Performance Baseline</h2>
        <p className="text-gray-400">
          Help us understand your current fitness level to create the perfect starting point
        </p>
      </div>

      {/* Current Fitness Metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#03fd1c]" />
          Current Fitness Metrics
        </h3>

        <p className="text-sm text-gray-400">
          Estimate if you're not sure - we'll adjust as you progress
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Push-ups (max reps)
            </label>
            <input
              type="number"
              min="0"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 25"
              value={data.pushUps || ''}
              onChange={(e) => onUpdate({ ...data, pushUps: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pull-ups (max reps)
            </label>
            <input
              type="number"
              min="0"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 10"
              value={data.pullUps || ''}
              onChange={(e) => onUpdate({ ...data, pullUps: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mile run time (minutes)
            </label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 7:30"
              value={data.mileTime || ''}
              onChange={(e) => onUpdate({ ...data, mileTime: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              40-yard dash (seconds)
            </label>
            <input
              type="text"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 5.2"
              value={data.fortyYardDash || ''}
              onChange={(e) => onUpdate({ ...data, fortyYardDash: e.target.value })}
            />
          </div>
        </div>

        {/* Sport-specific metrics based on their selection */}
        {data.sport && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sport-Specific Metric
            </label>
            {data.sport === 'Basketball' && (
              <input
                type="text"
                className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                placeholder="Vertical jump (inches)"
                value={data.verticalJump || ''}
                onChange={(e) => onUpdate({ ...data, verticalJump: e.target.value })}
              />
            )}
            {data.sport === 'Football' && (
              <input
                type="text"
                className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                placeholder="Bench press max (lbs)"
                value={data.benchPress || ''}
                onChange={(e) => onUpdate({ ...data, benchPress: e.target.value })}
              />
            )}
            {data.sport === 'Soccer' && (
              <input
                type="text"
                className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
                placeholder="Beep test level"
                value={data.beepTest || ''}
                onChange={(e) => onUpdate({ ...data, beepTest: e.target.value })}
              />
            )}
          </div>
        )}
      </div>

      {/* Recent Training History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Timer className="w-5 h-5 text-blue-500" />
          Recent Training History
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Training frequency (last 4 weeks)
          </label>
          <select
            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
            value={data.recentFrequency || ''}
            onChange={(e) => onUpdate({ ...data, recentFrequency: e.target.value })}
          >
            <option value="">Select frequency</option>
            <option value="none">Not training</option>
            <option value="1-2">1-2 days/week</option>
            <option value="3-4">3-4 days/week</option>
            <option value="5-6">5-6 days/week</option>
            <option value="7">Daily</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary training focus
          </label>
          <select
            className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
            value={data.recentFocus || ''}
            onChange={(e) => onUpdate({ ...data, recentFocus: e.target.value })}
          >
            <option value="">Select focus</option>
            <option value="strength">Strength training</option>
            <option value="cardio">Cardio/Endurance</option>
            <option value="sport">Sport-specific practice</option>
            <option value="mixed">Mixed training</option>
            <option value="recovery">Recovery/Rehab</option>
          </select>
        </div>
      </div>

      {/* Recovery & Lifestyle */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Moon className="w-5 h-5 text-purple-500" />
          Recovery & Lifestyle
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Average sleep (hours/night)
            </label>
            <input
              type="number"
              min="3"
              max="12"
              step="0.5"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 7.5"
              value={data.sleepHours || ''}
              onChange={(e) => onUpdate({ ...data, sleepHours: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stress level (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="1 = Low, 10 = High"
              value={data.stressLevel || ''}
              onChange={(e) => onUpdate({ ...data, stressLevel: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Hydration (glasses/day)
            </label>
            <input
              type="number"
              min="0"
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              placeholder="e.g., 8"
              value={data.hydration || ''}
              onChange={(e) => onUpdate({ ...data, hydration: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nutrition tracking
            </label>
            <select
              className="w-full bg-[#1a1a1a] border border-[#252525] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#03fd1c]"
              value={data.nutritionApproach || ''}
              onChange={(e) => onUpdate({ ...data, nutritionApproach: e.target.value })}
            >
              <option value="">Select approach</option>
              <option value="tracking">Tracking calories/macros</option>
              <option value="intuitive">Intuitive eating</option>
              <option value="meal-plan">Following meal plan</option>
              <option value="none">Not tracking</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recovery tools available
          </label>
          <p className="text-xs text-gray-500 mb-2">Select all that you have access to</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Foam roller',
              'Massage gun',
              'Resistance bands',
              'Ice bath',
              'Sauna',
              'Yoga mat',
              'Stretching routine',
              'None'
            ].map(tool => (
              <label
                key={tool}
                className="flex items-center space-x-2 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer hover:bg-[#252525]"
              >
                <input
                  type="checkbox"
                  checked={data.recoveryTools?.includes(tool) || false}
                  onChange={(e) => {
                    const tools = data.recoveryTools || [];
                    if (e.target.checked) {
                      if (tool === 'None') {
                        onUpdate({ ...data, recoveryTools: ['None'] });
                      } else {
                        const filtered = tools.filter((t: string) => t !== 'None');
                        onUpdate({ ...data, recoveryTools: [...filtered, tool] });
                      }
                    } else {
                      onUpdate({
                        ...data,
                        recoveryTools: tools.filter((t: string) => t !== tool)
                      });
                    }
                  }}
                  className="w-4 h-4 text-[#03fd1c] bg-[#141414] border-gray-600 rounded"
                />
                <span className="text-sm text-gray-300">{tool}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 bg-[#03fd1c] text-black font-medium rounded-xl hover:bg-[#00ff00] transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
};