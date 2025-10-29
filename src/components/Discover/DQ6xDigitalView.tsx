import React from 'react';
import { Globe, Atom } from 'lucide-react';

const DQ6xDigitalView: React.FC = () => {
  return (
    <section className="bg-white py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            DQ | Products (6x Digital View)
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the six digital perspectives that structure DQ's transformation architecture.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Nested D1-D5 Boxes */}
          <div className="relative">
            {/* D5 - Digital Workplace Services (Outermost) */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">D5 - Digital Workplace Services</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">Collaborative workspace and digital tools</p>
              
              {/* D4 - DQ2.0 */}
              <div className="border-2 border-dashed border-indigo-300 rounded-lg p-4 bg-indigo-50/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Atom className="w-3 h-3 text-indigo-600" />
                  </div>
                  <h4 className="text-base font-semibold text-gray-900">D4 - DQ2.0</h4>
                </div>
                <p className="text-xs text-gray-600 mb-3">Next-generation digital transformation</p>
                
                {/* D3 - Digital Business Platform */}
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-3 bg-purple-50/30">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="w-2.5 h-2.5 text-purple-600" />
                    </div>
                    <h5 className="text-sm font-semibold text-gray-900">D3 - Digital Business Platform</h5>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Integrated platform ecosystem</p>
                  
                  {/* D2 - Digital Core Operations */}
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-2 bg-green-50/30">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Atom className="w-2 h-2 text-green-600" />
                      </div>
                      <h6 className="text-xs font-semibold text-gray-900">D2 - Digital Core Operations</h6>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Core operational excellence</p>
                    
                    {/* D1 - Digital Economy (Innermost) */}
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-2 bg-orange-50/30">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-100 rounded-full flex items-center justify-center">
                          <Globe className="w-1.5 h-1.5 text-orange-600" />
                        </div>
                        <h6 className="text-xs font-semibold text-gray-900">D1 - Digital Economy</h6>
                      </div>
                      <p className="text-xs text-gray-600">Economic transformation foundation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - D6 Accelerator Panel */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">D6 Accelerator</h3>
              <p className="text-gray-600">Advanced digital transformation tools and platforms</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* DTMP */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-1">DTMP</div>
                <div className="text-xs text-gray-600">Digital Twin Management Platform</div>
              </div>
              
              {/* DTMaaS */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-1">DTMaaS</div>
                <div className="text-xs text-gray-600">Digital Twin Management as a Service</div>
              </div>
              
              {/* DTQ4T */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-1">DTQ4T</div>
                <div className="text-xs text-gray-600">Digital Twin Quality for Transformation</div>
              </div>
              
              {/* DTMB */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-1">DTMB</div>
                <div className="text-xs text-gray-600">Digital Twin Management Board</div>
              </div>
              
              {/* DTMI */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-1">DTMI</div>
                <div className="text-xs text-gray-600">Digital Twin Management Intelligence</div>
              </div>
              
              {/* DTMA */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-1">DTMA</div>
                <div className="text-xs text-gray-600">Digital Twin Management Analytics</div>
              </div>
              
              {/* DCO.CC */}
              <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm col-span-2">
                <div className="text-sm font-semibold text-gray-900 mb-1">DCO.CC</div>
                <div className="text-xs text-gray-600">Digital Core Operations Command Center</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DQ6xDigitalView;
