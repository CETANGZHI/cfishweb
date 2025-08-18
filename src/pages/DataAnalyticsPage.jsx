import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import '../App.css';

const DataAnalyticsPage = () => {
  return (
    <div className="fullscreen-layout pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default DataAnalyticsPage;

