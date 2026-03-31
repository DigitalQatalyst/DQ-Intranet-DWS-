import type { ProcedureStagesProps } from './ProcedureStages.types';

export function ProcedureStages({ config, className = '' }: ProcedureStagesProps) {
  return (
    <div className={`w-full ${className}`}>
      {config.title && (
        <h2 className="text-2xl font-display font-bold text-dq-navy mb-8">
          {config.title}
        </h2>
      )}
      
      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {/* Stages */}
        <div className="space-y-8">
          {config.stages.map((stage, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Stage number circle */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: '#030F35' }}>
                  <span className="text-white font-bold text-lg">
                    {stage.stageNumber ? stage.stageNumber.replace(/\D/g, '') : (index + 1).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
              
              {/* Stage content */}
              <div className="flex-1 pb-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6">
                  {/* Stage header */}
                  <div className="mb-4">
                    {stage.stageNumber && (
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        {stage.stageNumber}
                      </div>
                    )}
                    <h3 className="text-xl font-body font-bold text-dq-navy">
                      {stage.stageTitle}
                    </h3>
                  </div>
                  
                  {/* Stage items */}
                  <ul className="space-y-3">
                    {stage.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-dq-orange mt-2" />
                        <span className="text-gray-700 font-body leading-relaxed">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

