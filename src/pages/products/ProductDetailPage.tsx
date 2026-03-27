import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ChevronRightIcon, HomeIcon, ArrowLeft, ExternalLink } from 'lucide-react'
import { getProductBySlug } from '../../data/products'
import { useAuth } from '../../components/Header/context/AuthContext'
import { SideNav } from '../strategy/shared/SideNav'
import { GuidelineSection } from '../strategy/shared/GuidelineSection'
import { HeroSection } from '../strategy/shared/HeroSection'

function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { user } = useAuth()

  const product = slug ? getProductBySlug(slug) : null

  // Safety guard: Ensure product exists and has required structure
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={!!user} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
            <Link
              to="/marketplace/guides?tab=blueprints"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </div>
        <Footer isLoggedIn={!!user} />
      </div>
    )
  }

  // Ensure arrays exist and are arrays (defensive programming)
  const includesArray = Array.isArray(product.includes) ? product.includes : []
  const usedInArray = Array.isArray(product.usedIn) ? product.usedIn : []
  const scopeAndCapabilities = Array.isArray(product.scopeAndCapabilities) ? product.scopeAndCapabilities : includesArray
  const documentSections = Array.isArray(product.documentSections) ? product.documentSections : []

  // Navigation sections
  const navSections = documentSections.length
    ? [
        ...documentSections.map(section => ({ id: section.id, label: section.title })),
      ]
    : [
        { id: 'overview', label: 'Overview' },
        { id: 'purpose-value', label: 'Purpose & Value' },
        { id: 'scope-capabilities', label: 'Scope & Capabilities' },
        { id: 'how-its-used', label: 'How It\'s Used' },
        { id: 'governance-ownership', label: 'Governance & Ownership' },

      ]

  const heroImage = '/images/guidelines-content.PNG'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <Link to="/marketplace/guides?tab=blueprints" className="ml-1 text-gray-600 hover:text-gray-900 md:ml-2">
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">
                    {typeof product.name === 'string' ? product.name : String(product.name || 'Product')}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection 
        title={typeof product.name === 'string' ? product.name : String(product.name || 'Product')}
        subtitle=""
        imageUrl={heroImage}
        badge="DQ Product"
      />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-8 md:p-12">
              {documentSections.length ? (
                <>
                  {documentSections.map(section => (
                    <GuidelineSection key={section.id} id={section.id} title={section.title}>
                      {section.body.map((paragraph, idx) => (
                        <p key={idx} className="mb-4 text-gray-700">
                          {paragraph}
                        </p>
                      ))}
                    </GuidelineSection>
                  ))}

                </>
              ) : (
                <>
                  {/* 1. Overview */}
                  <GuidelineSection id="overview" title="Overview">
                    <p className="mb-4">
                      {product.overview || (typeof product.whatItIs === 'string' ? product.whatItIs : String(product.whatItIs || ''))}
                    </p>
                    <p className="text-gray-600">
                      {typeof product.description === 'string' ? product.description : String(product.description || '')}
                    </p>
                  </GuidelineSection>

                  {/* 2. Purpose & Value */}
                  <GuidelineSection id="purpose-value" title="Purpose & Value">
                    <p className="mb-4">
                      {product.purposeAndValue || (typeof product.whyItMatters === 'string' ? product.whyItMatters : String(product.whyItMatters || ''))}
                    </p>
                    <p className="text-gray-600">
                      This product is designed to deliver measurable outcomes and enable consistent execution across Digital Qatalyst initiatives, 
                      supporting both internal operations and client-facing engagements.
                    </p>
                  </GuidelineSection>

                  {/* 3. Scope & Capabilities */}
                  <GuidelineSection id="scope-capabilities" title="Scope & Capabilities">
                    <p className="mb-4">
                      The product includes the following components, platforms, and services:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {scopeAndCapabilities.length > 0 ? (
                        scopeAndCapabilities.map((item: string, index: number) => (
                          <li key={index}>
                            {typeof item === 'string' ? item : String(item || '')}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500 italic">No capabilities listed.</li>
                      )}
                    </ul>
                  </GuidelineSection>

                  {/* 4. How It's Used */}
                  <GuidelineSection id="how-its-used" title="How It's Used">
                    {product.howItsUsed ? (
                      <>
                        {product.howItsUsed.internal && product.howItsUsed.internal.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Internal Usage</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {product.howItsUsed.internal.map((item: string, index: number) => (
                                <li key={index}>{typeof item === 'string' ? item : String(item || '')}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {product.howItsUsed.delivery && product.howItsUsed.delivery.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Delivery Usage</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {product.howItsUsed.delivery.map((item: string, index: number) => (
                                <li key={index}>{typeof item === 'string' ? item : String(item || '')}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {product.howItsUsed.client && product.howItsUsed.client.length > 0 && (
                          <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-Facing Usage</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {product.howItsUsed.client.map((item: string, index: number) => (
                                <li key={index}>{typeof item === 'string' ? item : String(item || '')}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <div>
                        <p className="mb-4">This product is used across multiple contexts within Digital Qatalyst:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          {usedInArray.length > 0 ? (
                            usedInArray.map((item: string, index: number) => (
                              <li key={index}>
                                {typeof item === 'string' ? item : String(item || '')}
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-500 italic">No usage information available.</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </GuidelineSection>

                  {/* 5. Governance & Ownership */}
                  <GuidelineSection id="governance-ownership" title="Governance & Ownership">
                    {product.governanceAndOwnership ? (
                      <div>
                        <p className="mb-4">{product.governanceAndOwnership}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="mb-4">
                          This product is owned and governed by the Product Owner / Practice team within Digital Qatalyst.
                        </p>
                        <p className="mb-4 text-gray-600">
                          Product evolution follows DQ's product management framework, with regular reviews, updates, and enhancements 
                          based on user feedback and strategic priorities.
                        </p>
                        <p className="text-gray-600">
                          Changes to the product are managed through established governance processes, ensuring alignment with DQ's 
                          strategic objectives and maintaining consistency across all productized offerings.
                        </p>
                      </div>
                    )}
                  </GuidelineSection>

                  
                </>
              )}

              {/* Actions */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg transition-colors font-medium"
                    style={{ backgroundColor: '#030F35', color: '#FFFFFF' }}
                  >
                    Explore Platform
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                  <Link
                    to="/marketplace/guides?tab=blueprints"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Sticky Side Navigation */}
            <div className="lg:col-span-1">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide">CONTENTS</h3>
              </div>
              <SideNav sections={navSections} />
            </div>
          </div>
        </div>
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  )
}

export default ProductDetailPage

