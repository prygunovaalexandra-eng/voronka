import React from 'react';
import { Funnel } from '../types';
import { getIndustryColor, getTypeColor } from '../utils/colors';
import { MAX_TAGS_DISPLAY, CARD_IMAGE_FALLBACK } from '../constants';

interface FunnelCardProps {
  funnel: Funnel;
  onClick: (funnel: Funnel) => void;
}

const FunnelCard: React.FC<FunnelCardProps> = ({ funnel, onClick }) => {

  return (
    <div 
      className="bg-white rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => onClick(funnel)}
    >
      {/* Thumbnail */}
      <div className="aspect-w-16 aspect-h-10 bg-gray-100 rounded-t-lg overflow-hidden">
        <img 
          src={funnel.thumbnail} 
          alt={`${funnel.title} - ${funnel.company}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = CARD_IMAGE_FALLBACK;
          }}
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {funnel.title}
          </h3>
          <span className="text-sm text-gray-500 ml-2">
            {funnel.steps.length} steps
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 font-light">
          {funnel.company}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIndustryColor(funnel.industry)}`}>
                  {funnel.category || funnel.industry}
                </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(funnel.type)}`}>
            {funnel.type}
          </span>
        </div>

        {/* Additional tags */}
        {funnel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {funnel.tags.slice(0, MAX_TAGS_DISPLAY).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                {tag}
              </span>
            ))}
            {funnel.tags.length > MAX_TAGS_DISPLAY && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{funnel.tags.length - MAX_TAGS_DISPLAY}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunnelCard; 