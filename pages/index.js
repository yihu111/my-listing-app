import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export async function getServerSideProps() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*');

  return {
    props: {
      listings: listings || [],
      categories: categories || [],
    },
  };
}

export default function Home({ listings, categories }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredListings = listings.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.category === selectedCategory
      : true;

    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          🛒 My Marketplace
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full md:flex-1 px-4 py-2 rounded-lg border shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full md:w-60 px-4 py-2 rounded-lg border shadow-sm bg-white focus:outline-none focus:ring focus:border-blue-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>

        {filteredListings.length === 0 ? (
          <p className="text-center text-gray-500">No listings found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    {item.category}
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    ${item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}