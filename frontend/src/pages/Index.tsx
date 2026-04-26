import { useState } from 'react';
import { CityProvider } from '@/contexts/CityContext';
import {
  Droplets,
  Thermometer,
  Wind,
  CloudRain,
  Activity,
  BarChart3,
  Bell,
  Cloud,
  ShoppingCart,
} from 'lucide-react';

import { useSensorData } from '@/hooks/useSensorData';
import { Header } from '@/components/dashboard/Header';
import { SensorCard } from '@/components/dashboard/SensorCard';
import { MoistureChart } from '@/components/dashboard/MoistureChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { LoadingState } from '@/components/dashboard/LoadingState';
import { WeatherSection } from '@/components/dashboard/WeatherSection';
import { MarketPricesSection } from '@/components/dashboard/MarketPricesSection';
import { SectionHeading } from '@/components/dashboard/SectionHeading';
import { Sidebar, MobileNav } from '@/components/dashboard/Sidebar';
import { Footer } from '@/components/dashboard/Footer';

const Index = () => {

  const [activeTab, setActiveTab] = useState('sensors');

  const {
    latestReading,
    historicalData,
    alerts,
    isConnected,
    isLoading,
    error,
  } = useSensorData();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <CityProvider>
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        isConnected={isConnected}
        error={error}
        onRetry={() => window.location.reload()}
      />

      <div className="flex-1 flex flex-col md:flex-row max-w-[100vw] overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} alertCount={alerts.length} />

        <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] p-5 md:p-10 pb-24 md:pb-24">
          <div className="max-w-5xl mx-auto space-y-0 animate-fade-in pb-16">

            {error && !isConnected && (
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400 mb-8">
                <p className="text-sm font-medium">{error}</p>
                <p className="text-xs mt-1 text-red-400/60">
                  Displaying cached data. Real-time updates paused.
                </p>
              </div>
            )}

            {/* SENSORS TAB */}
            {activeTab === 'sensors' && (
              <section className="space-y-6">
                <SectionHeading
                  icon={<Activity className="w-5 h-5" />}
                  title="Sensor Monitoring"
                  description="Real-time data from farm sensors"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SensorCard
                    title="Soil Moisture"
                    value={latestReading?.moisture?.toFixed(1) ?? '--'}
                    unit="%"
                    icon={<Droplets className="w-5 h-5" />}
                    color="moisture"
                    subtitle="Current level"
                    isLive={isConnected}
                  />

                  <SensorCard
                    title="Temperature"
                    value={latestReading?.temperature?.toFixed(1) ?? '--'}
                    unit="°C"
                    icon={<Thermometer className="w-5 h-5" />}
                    color="temperature"
                    subtitle="Ambient"
                    isLive={isConnected}
                  />

                  <SensorCard
                    title="Humidity"
                    value={latestReading?.humidity?.toFixed(1) ?? '--'}
                    unit="%"
                    icon={<Wind className="w-5 h-5" />}
                    color="humidity"
                    subtitle="Relative"
                    isLive={isConnected}
                  />

                  <SensorCard
                    title="Rain Status"
                    value={latestReading?.rain ? 'Yes' : 'No'}
                    unit=""
                    icon={<CloudRain className="w-5 h-5" />}
                    color="rain"
                    subtitle={latestReading?.rain ? 'Raining now' : 'Clear skies'}
                    isLive={isConnected}
                  />
                </div>
              </section>
            )}

            {/* WEATHER TAB */}
            {activeTab === 'weather' && (
              <section className="space-y-6">
                <SectionHeading
                  icon={<Cloud className="w-5 h-5" />}
                  title="Weather Prediction"
                  description="Location-based weather forecast"
                />
                <WeatherSection />
              </section>
            )}

            {/* MARKET TAB */}
            {activeTab === 'market' && (
              <section className="space-y-6">
                <SectionHeading
                  icon={<ShoppingCart className="w-5 h-5" />}
                  title="Market Prices"
                  description="Search agricultural commodity prices"
                />
                <MarketPricesSection />
              </section>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <section className="space-y-6">
                <SectionHeading
                  icon={<BarChart3 className="w-5 h-5" />}
                  title="Data Visualization"
                  description="Historical sensor data trends"
                />
                <MoistureChart data={historicalData} />
              </section>
            )}

            {/* ALERTS TAB */}
            {activeTab === 'alerts' && (
              <section className="space-y-6">
                <SectionHeading
                  icon={<Bell className="w-5 h-5" />}
                  title="Alerts & Notifications"
                  description="System alerts and warnings"
                />
                <AlertsPanel alerts={alerts} />
              </section>
            )}

          </div>

        </main>
      </div>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} alertCount={alerts.length} />
    </div>
    </CityProvider>
  );
};

export default Index;
