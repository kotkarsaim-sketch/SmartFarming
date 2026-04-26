import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, MapPin, ShoppingBasket, Leaf, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCity } from '@/contexts/CityContext';

interface MarketPrice {
  id: string; vegetable: string; price: number; unit: string;
  market: string; change: number; minPrice: number; maxPrice: number;
}
interface CityMarketData { markets: string[]; source: string; vegetables: MarketPrice[]; }

const mv = (id: string, n: string, p: number, m: string, c: number, r: [number,number]): MarketPrice => ({ id, vegetable: n, price: p, unit: 'kg', market: m, change: c, minPrice: r[0], maxPrice: r[1] });

const ALL_CITY_DATA: Record<string, CityMarketData> = {
  Pune: { markets: ['Market Yard, Gultekdi', 'Manjri Mandi', 'Pimpri Market'], source: 'Pune APMC Market Yard', vegetables: [
    mv('p1','Tomato',35,'Market Yard, Gultekdi',3.2,[25,45]), mv('p2','Onion',22,'Market Yard, Gultekdi',-2.1,[15,30]),
    mv('p3','Potato',25,'Market Yard, Gultekdi',0.5,[18,30]), mv('p4','Green Chilli',40,'Manjri Mandi',5.5,[30,60]),
    mv('p5','Lady Finger',45,'Market Yard, Gultekdi',-0.8,[35,55]), mv('p6','Brinjal',30,'Manjri Mandi',-1.2,[20,40]),
    mv('p7','Cabbage',15,'Market Yard, Gultekdi',-3.5,[10,22]), mv('p8','Cauliflower',25,'Market Yard, Gultekdi',2.1,[18,35]),
    mv('p9','Capsicum',40,'Pimpri Market',-0.5,[30,55]), mv('p10','Cucumber',20,'Market Yard, Gultekdi',-2.0,[12,28]),
    mv('p11','Coriander',60,'Market Yard, Gultekdi',8.2,[40,100]), mv('p12','Drumstick',55,'Market Yard, Gultekdi',3.0,[40,70]),
    mv('p13','Garlic',180,'Market Yard, Gultekdi',1.2,[140,220]), mv('p14','Ginger',120,'Manjri Mandi',-0.8,[90,160]),
    mv('p15','Lemon',80,'Market Yard, Gultekdi',4.5,[50,120]), mv('p16','Carrot',35,'Pimpri Market',-0.5,[25,45]),
  ]},
  Mumbai: { markets: ['Vashi APMC', 'Crawford Market', 'Dadar Mandi'], source: 'Vashi APMC', vegetables: [
    mv('m1','Tomato',40,'Vashi APMC',2.8,[30,50]), mv('m2','Onion',25,'Vashi APMC',-1.5,[18,35]),
    mv('m3','Potato',28,'Crawford Market',1.0,[20,35]), mv('m4','Green Chilli',50,'Vashi APMC',4.2,[35,70]),
    mv('m5','Lady Finger',50,'Dadar Mandi',-1.0,[40,60]), mv('m6','Brinjal',35,'Vashi APMC',0.5,[25,45]),
    mv('m7','Cabbage',18,'Vashi APMC',-2.8,[12,25]), mv('m8','Cauliflower',30,'Crawford Market',1.5,[20,40]),
    mv('m9','Capsicum',45,'Vashi APMC',-1.2,[35,60]), mv('m10','Cucumber',25,'Dadar Mandi',-1.5,[15,32]),
    mv('m11','Coriander',70,'Vashi APMC',6.0,[50,110]), mv('m12','Garlic',200,'Crawford Market',0.8,[160,240]),
    mv('m13','Ginger',130,'Vashi APMC',-1.2,[100,170]), mv('m14','Lemon',90,'Vashi APMC',3.8,[60,130]),
    mv('m15','Carrot',40,'Dadar Mandi',0.3,[30,50]),
  ]},
  Nashik: { markets: ['Nashik APMC', 'Lasalgaon Mandi'], source: 'Nashik APMC', vegetables: [
    mv('n1','Tomato',30,'Nashik APMC',4.0,[20,42]), mv('n2','Onion',18,'Lasalgaon Mandi',-3.0,[12,26]),
    mv('n3','Potato',22,'Nashik APMC',0.8,[15,28]), mv('n4','Green Chilli',35,'Nashik APMC',6.0,[25,50]),
    mv('n5','Lady Finger',40,'Nashik APMC',-0.5,[30,50]), mv('n6','Brinjal',25,'Lasalgaon Mandi',-1.8,[18,35]),
    mv('n7','Cabbage',12,'Nashik APMC',-4.0,[8,18]), mv('n8','Cauliflower',22,'Nashik APMC',1.8,[15,30]),
    mv('n9','Capsicum',38,'Nashik APMC',-0.3,[28,50]), mv('n10','Cucumber',18,'Nashik APMC',-2.5,[10,25]),
    mv('n11','Coriander',50,'Nashik APMC',7.0,[35,85]), mv('n12','Garlic',170,'Lasalgaon Mandi',1.5,[130,210]),
    mv('n13','Ginger',110,'Nashik APMC',-0.5,[85,150]), mv('n14','Lemon',70,'Nashik APMC',5.0,[45,100]),
  ]},
  Delhi: { markets: ['Azadpur Mandi', 'Okhla Mandi'], source: 'Azadpur Mandi', vegetables: [
    mv('d1','Tomato',42,'Azadpur Mandi',2.0,[30,55]), mv('d2','Onion',28,'Azadpur Mandi',-1.0,[20,38]),
    mv('d3','Potato',20,'Okhla Mandi',0.2,[14,26]), mv('d4','Green Chilli',55,'Azadpur Mandi',3.8,[40,75]),
    mv('d5','Lady Finger',48,'Azadpur Mandi',-1.2,[38,58]), mv('d6','Brinjal',32,'Azadpur Mandi',-0.8,[22,42]),
    mv('d7','Cabbage',16,'Okhla Mandi',-3.2,[10,24]), mv('d8','Cauliflower',28,'Azadpur Mandi',1.8,[20,38]),
    mv('d9','Capsicum',48,'Azadpur Mandi',-0.6,[35,62]), mv('d10','Cucumber',22,'Azadpur Mandi',-1.5,[14,30]),
    mv('d11','Coriander',65,'Azadpur Mandi',5.5,[45,95]), mv('d12','Garlic',190,'Okhla Mandi',0.9,[150,230]),
    mv('d13','Ginger',125,'Azadpur Mandi',-1.0,[95,165]), mv('d14','Lemon',85,'Azadpur Mandi',3.5,[55,125]),
  ]},
  Bangalore: { markets: ['Yeshwantpur APMC', 'KR Market'], source: 'Yeshwantpur APMC', vegetables: [
    mv('b1','Tomato',38,'Yeshwantpur APMC',1.5,[28,48]), mv('b2','Onion',26,'KR Market',-1.8,[18,34]),
    mv('b3','Potato',26,'Yeshwantpur APMC',0.6,[18,32]), mv('b4','Green Chilli',45,'KR Market',4.8,[32,62]),
    mv('b5','Lady Finger',42,'Yeshwantpur APMC',-0.9,[32,52]), mv('b6','Brinjal',28,'Yeshwantpur APMC',-1.4,[20,38]),
    mv('b7','Cabbage',14,'KR Market',-3.8,[8,20]), mv('b8','Cauliflower',26,'Yeshwantpur APMC',1.6,[18,34]),
    mv('b9','Capsicum',42,'KR Market',-0.4,[32,56]), mv('b10','Cucumber',18,'KR Market',-2.2,[10,26]),
    mv('b11','Coriander',55,'Yeshwantpur APMC',6.8,[38,90]), mv('b12','Garlic',185,'KR Market',1.1,[145,225]),
    mv('b13','Ginger',118,'Yeshwantpur APMC',-0.9,[88,158]), mv('b14','Lemon',82,'KR Market',4.2,[52,118]),
  ]},
};

const generateCityData = (cityName: string): CityMarketData => {
  const seed = cityName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const m = `${cityName} APMC`;
  const bp = [35,22,25,40,45,30,15,25,40,20,60,180,120,80,35];
  const nm = ['Tomato','Onion','Potato','Green Chilli','Lady Finger','Brinjal','Cabbage','Cauliflower','Capsicum','Cucumber','Coriander','Garlic','Ginger','Lemon','Carrot'];
  return { markets: [m], source: m, vegetables: nm.map((n, i) => { const v = ((seed+i*7)%20)-10; const p = Math.max(5, bp[i]+v); return mv(`g${i}`, n, p, m, parseFloat(((((seed+i)%10)-5)*0.8).toFixed(1)), [Math.round(p*0.7), Math.round(p*1.3)]); }) };
};

const getCityData = (c: string): CityMarketData => ALL_CITY_DATA[c] || generateCityData(c);

export const MarketPricesSection = () => {
  const { selectedCity } = useCity();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const cityData = getCityData(selectedCity.name);

  useEffect(() => {
    setSearchTerm('');
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [selectedCity.name]);

  const displayData = searchTerm.trim()
    ? cityData.vegetables.filter(v => v.vegetable.toLowerCase().includes(searchTerm.toLowerCase()))
    : cityData.vegetables;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* City badge */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.03] text-xs text-white/40 font-medium">
          📍 {selectedCity.name}, {selectedCity.state}
        </div>
        <div className="px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] text-emerald-400/70 font-medium flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
          Live Rates
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <Input
          placeholder="Filter vegetables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.06] text-white/80 placeholder:text-white/20 rounded-xl h-10 focus:border-emerald-500/30 focus:ring-emerald-500/10"
        />
      </div>

      {loading ? (
        <div className="sensor-card flex items-center justify-center py-16">
          <div className="text-center">
            <ShoppingBasket className="w-6 h-6 text-white/20 mx-auto mb-3 animate-float" />
            <p className="text-white/30 text-sm">Loading {selectedCity.name} prices...</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
          {/* Header */}
          <div className="grid grid-cols-12 gap-0 px-5 py-3 bg-white/[0.02] text-[10px] font-medium uppercase tracking-[0.1em] text-white/20 border-b border-white/[0.04]">
            <div className="col-span-3">Vegetable</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-center">Range</div>
            <div className="col-span-3 text-center hidden md:block">Market</div>
            <div className="col-span-2 md:col-span-2 text-right">Change</div>
          </div>

          {/* Rows */}
          {displayData.length > 0 ? displayData.map((item, idx) => (
            <div
              key={item.id}
              className={`grid grid-cols-12 gap-0 px-5 py-3 hover:bg-white/[0.02] transition-all duration-300 group ${
                idx < displayData.length - 1 ? 'border-b border-white/[0.03]' : ''
              }`}
            >
              <div className="col-span-3 text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">{item.vegetable}</div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-bold text-emerald-400 font-mono">₹{item.price}</span>
                <span className="text-[10px] text-white/20 ml-0.5">/{item.unit}</span>
              </div>
              <div className="col-span-2 text-center text-[11px] text-white/20 font-mono">₹{item.minPrice}–{item.maxPrice}</div>
              <div className="col-span-3 text-center text-[10px] text-white/15 truncate hidden md:block">{item.market}</div>
              <div className={`col-span-2 md:col-span-2 text-right text-xs flex items-center justify-end gap-1 font-mono ${item.change >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
              </div>
            </div>
          )) : (
            <div className="px-5 py-12 text-center text-sm text-white/25">
              No vegetables matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      <p className="text-[10px] text-white/10 text-center">
        {cityData.source} — {cityData.markets.join(' · ')}
      </p>
    </div>
  );
};
