import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, CloudSnow, CloudLightning } from 'lucide-react';
import { useCity } from '@/contexts/CityContext';

interface DailyForecast {
  day: string; date: string; tempHigh: number; tempLow: number;
  condition: string; rainProbability: number; humidity: number; windSpeed: number;
}

interface WeatherData {
  location: string;
  current: {
    temp: number; condition: string; humidity: number; windSpeed: number;
    rainProbability: number; feelsLike: number; pressure: number; visibility: number;
  };
  hourlyForecast: Array<{ time: string; temp: number; condition: string; rainProbability: number; }>;
  dailyForecast: DailyForecast[];
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CONDITIONS = ['Clear', 'Clouds', 'Rain', 'Sunny', 'Drizzle', 'Thunderstorm'];

const getWeatherIcon = (condition: string, size: string = "w-7 h-7") => {
  switch (condition.toLowerCase()) {
    case 'clear': case 'sunny':
      return <Sun className={`${size} text-amber-400`} />;
    case 'clouds': case 'cloudy':
      return <Cloud className={`${size} text-white/40`} />;
    case 'rain': case 'drizzle':
      return <CloudRain className={`${size} text-sky-400`} />;
    case 'thunderstorm':
      return <CloudLightning className={`${size} text-purple-400`} />;
    case 'snow':
      return <CloudSnow className={`${size} text-blue-200`} />;
    default:
      return <Cloud className={`${size} text-white/40`} />;
  }
};

export const WeatherSection = () => {
  const { selectedCity } = useCity();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchWeather(selectedCity.name); }, [selectedCity.name]);

  const fetchWeather = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true); setError(null);
    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo';
      if (API_KEY === 'demo') {
        await new Promise(r => setTimeout(r, 600));
        const seed = query.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const baseTemp = 26 + (seed % 12);
        const today = new Date();
        const dailyForecast: DailyForecast[] = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today); d.setDate(today.getDate() + i);
          const ds = seed + i * 17;
          return {
            day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_SHORT[d.getDay()],
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            tempHigh: baseTemp + 2 + (ds % 5), tempLow: baseTemp - 4 - (ds % 4),
            condition: CONDITIONS[ds % CONDITIONS.length],
            rainProbability: Math.round(((ds * 7) % 80) + 5),
            humidity: Math.round(45 + (ds % 35)),
            windSpeed: parseFloat((3 + (ds % 8)).toFixed(1)),
          };
        });
        setWeather({
          location: query,
          current: { temp: baseTemp, condition: CONDITIONS[seed % CONDITIONS.length], humidity: 45 + (seed % 30), windSpeed: 4 + (seed % 5), rainProbability: (seed % 10) * 5, feelsLike: baseTemp + 2, pressure: 1008 + (seed % 15), visibility: 6 + (seed % 5) },
          hourlyForecast: Array.from({ length: 8 }, (_, i) => ({ time: new Date(Date.now() + i * 3 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), temp: baseTemp + Math.sin(i) * 3, condition: CONDITIONS[(seed + i) % CONDITIONS.length], rainProbability: Math.round(((seed * (i + 1)) % 60)) })),
          dailyForecast,
        });
        return;
      }
      // Real API
      const cr = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&appid=${API_KEY}`);
      if (!cr.ok) throw new Error('City not found');
      const cd = await cr.json();
      const fr = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(query)}&units=metric&appid=${API_KEY}`);
      const fd = await fr.json();
      const dm: Record<string, any> = {};
      fd.list.forEach((it: any) => {
        const d = new Date(it.dt * 1000); const k = d.toDateString();
        if (!dm[k]) dm[k] = { temps: [], conds: [], pops: [], hums: [], winds: [], date: d };
        dm[k].temps.push(it.main.temp); dm[k].conds.push(it.weather[0].main); dm[k].pops.push(it.pop * 100); dm[k].hums.push(it.main.humidity); dm[k].winds.push(it.wind.speed);
      });
      const df: DailyForecast[] = Object.values(dm).slice(0, 7).map((day: any, i) => {
        const cc: Record<string,number> = {}; day.conds.forEach((c:string) => { cc[c] = (cc[c]||0)+1; });
        const mc = Object.entries(cc).sort((a:any,b:any)=>b[1]-a[1])[0][0];
        return { day: i===0?'Today':i===1?'Tomorrow':DAY_SHORT[day.date.getDay()], date: day.date.toLocaleDateString('en-IN',{day:'numeric',month:'short'}), tempHigh: Math.round(Math.max(...day.temps)), tempLow: Math.round(Math.min(...day.temps)), condition: mc, rainProbability: Math.round(Math.max(...day.pops)), humidity: Math.round(day.hums.reduce((a:number,b:number)=>a+b,0)/day.hums.length), windSpeed: parseFloat((day.winds.reduce((a:number,b:number)=>a+b,0)/day.winds.length).toFixed(1)) };
      });
      setWeather({
        location: cd.name,
        current: { temp: cd.main.temp, condition: cd.weather[0].main, humidity: cd.main.humidity, windSpeed: cd.wind.speed, rainProbability: cd.clouds?.all||0, feelsLike: cd.main.feels_like, pressure: cd.main.pressure, visibility: (cd.visibility||10000)/1000 },
        hourlyForecast: fd.list.slice(0,8).map((it:any) => ({ time: new Date(it.dt*1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}), temp: it.main.temp, condition: it.weather[0].main, rainProbability: it.pop*100 })),
        dailyForecast: df,
      });
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to fetch weather'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* City badge */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] text-xs text-white/40 font-medium">
          📍 {selectedCity.name}, {selectedCity.state}
        </div>
      </div>

      {loading && (
        <div className="sensor-card flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 animate-float">
              <Cloud className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-white/30 text-sm">Loading weather for {selectedCity.name}...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 text-sm">
          {error}
        </div>
      )}

      {weather && !loading && (
        <>
          {/* Current Weather */}
          <div className="sensor-card relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-60 h-60 rounded-full blur-[80px] opacity-20 bg-emerald-500 pointer-events-none" />

            <div className="relative flex items-start justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white/90">{weather.location}</h3>
                <p className="text-sm text-white/30 capitalize mt-0.5">{weather.current.condition}</p>
              </div>
              <div className="animate-float">
                {getWeatherIcon(weather.current.condition, "w-12 h-12")}
              </div>
            </div>

            <div className="mb-8">
              <span className="text-6xl font-bold tracking-tighter text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {weather.current.temp.toFixed(0)}
              </span>
              <span className="text-2xl text-white/30 ml-1">°C</span>
              <p className="text-xs text-white/25 mt-1">Feels like {weather.current.feelsLike.toFixed(0)}°C</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: <Droplets className="w-4 h-4 text-sky-400" />, label: 'Humidity', value: `${weather.current.humidity}%` },
                { icon: <Wind className="w-4 h-4 text-teal-400" />, label: 'Wind', value: `${weather.current.windSpeed.toFixed(1)} m/s` },
                { icon: <CloudRain className="w-4 h-4 text-indigo-400" />, label: 'Rain', value: `${weather.current.rainProbability}%` },
                { icon: <Thermometer className="w-4 h-4 text-orange-400" />, label: 'Pressure', value: `${weather.current.pressure} hPa` },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                  <div className="mb-2">{item.icon}</div>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-semibold text-white/70 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Forecast */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-white/25 mb-3 px-1">Next 24 Hours</h4>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {weather.hourlyForecast.map((item, idx) => (
                <div key={idx} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all duration-300 group">
                  <p className="text-[10px] text-white/30 font-medium">{item.time}</p>
                  <div className="my-2 flex justify-center scale-90 group-hover:scale-100 transition-transform duration-300">
                    {getWeatherIcon(item.condition, "w-5 h-5")}
                  </div>
                  <p className="text-sm font-semibold text-white/70">{item.temp.toFixed(0)}°</p>
                  <p className="text-[10px] text-sky-400/60 mt-0.5">{item.rainProbability.toFixed(0)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-white/25 mb-3 px-1">7-Day Forecast</h4>
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
              {weather.dailyForecast.map((day, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-all duration-300 ${
                    idx < weather.dailyForecast.length - 1 ? 'border-b border-white/[0.04]' : ''
                  }`}
                >
                  <div className="w-24">
                    <p className={`text-sm font-medium ${idx === 0 ? 'text-emerald-400' : 'text-white/70'}`}>{day.day}</p>
                    <p className="text-[10px] text-white/20">{day.date}</p>
                  </div>
                  <div className="flex items-center gap-2 w-32">
                    <div className="scale-90">{getWeatherIcon(day.condition, "w-5 h-5")}</div>
                    <span className="text-[11px] text-white/30 capitalize">{day.condition}</span>
                  </div>
                  <div className="flex items-center gap-2 w-36">
                    <span className="text-xs text-sky-400/70 font-mono w-7 text-right">{day.tempLow}°</span>
                    <div className="flex-1 h-1 rounded-full bg-white/[0.06] relative overflow-hidden">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-sky-500/60 via-amber-500/60 to-orange-500/60"
                        style={{ left: `${((day.tempLow - 10) / 40) * 100}%`, right: `${100 - ((day.tempHigh - 10) / 40) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-orange-400/70 font-mono w-7">{day.tempHigh}°</span>
                  </div>
                  <div className="flex items-center gap-1 w-14 justify-end">
                    <Droplets className="w-3 h-3 text-sky-500/40" />
                    <span className="text-[11px] text-white/30 font-mono">{day.rainProbability}%</span>
                  </div>
                  <div className="hidden md:flex items-center gap-1 w-16 justify-end">
                    <Wind className="w-3 h-3 text-teal-500/40" />
                    <span className="text-[11px] text-white/25 font-mono">{day.windSpeed} m/s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
