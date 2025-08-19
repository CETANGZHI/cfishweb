import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {t('notFound.title', 'Page Not Found')}
          </h2>
          <p className="text-muted-foreground">
            {t('notFound.description', 'The page you are looking for does not exist or has been moved.')}
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-lg font-semibold hover:bg-primary/80 transition-colors"
          >
            <Home className="w-4 h-4" />
            {t('notFound.goHome', 'Go Home')}
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-card transition-colors ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('notFound.goBack', 'Go Back')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

