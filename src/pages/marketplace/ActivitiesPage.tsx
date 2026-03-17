import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ChevronRightIcon } from 'lucide-react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

const ActivitiesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-gray-900 inline-flex items-center">
                  <HomeIcon size={16} className="mr-1" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <ChevronRightIcon size={16} className="text-gray-400" />
                  <span className="ml-1 text-gray-500 md:ml-2">DQ Activities</span>
                </div>
              </li>
            </ol>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">DQ Activities</h1>
          <p className="text-gray-600">
            Priorities, ATP, Tasks, and Chats — coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ActivitiesPage;
