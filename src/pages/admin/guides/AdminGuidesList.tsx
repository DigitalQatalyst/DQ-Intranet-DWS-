import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listGuides } from '../../../services/guides';
import { deleteGuideAdmin } from '../../../services/adminGuides';
import { Guide } from '../../../types/guide';

const AdminGuidesList: React.FC = () => {
  const [items, setItems] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const res = await listGuides(search);
      setItems(res.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Guides Admin</h1>
        <div className="flex gap-2">
          <Link 
            to="/admin/ghc-inspector" 
            className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            GHC Inspector
          </Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => navigate('/admin/guides/new')}>New Guide</button>
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search title" className="border rounded px-3 py-2 w-full max-w-sm" />
        <button className="px-3 py-2 border rounded" onClick={load}>Search</button>
      </div>
      {loading ? <div>Loading…</div> : (
        <div className="bg-white rounded shadow divide-y">
          <div className="grid grid-cols-6 gap-2 p-3 font-semibold text-sm">
            <div>Title</div>
            <div>Status</div>
            <div>Guide Type</div>
            <div>Domain</div>
            <div>Updated</div>
            <div>Actions</div>
          </div>
          {items.map(g => (
            <div key={g.id} className="grid grid-cols-6 gap-2 p-3 items-center">
              <div className="truncate">{g.title}</div>
              <div>{g.status}</div>
              <div>{g.guideType}</div>
              <div>{g.domain}</div>
              <div className="text-sm text-gray-500">{g.lastUpdatedAt}</div>
              <div className="flex gap-2">
                <Link className="text-blue-600" to={`/admin/guides/${g.id}`}>Edit</Link>
                <button className="text-red-600" onClick={async () => { if (g.id && confirm('Delete guide?')) { await deleteGuideAdmin(g.id); await load(); } }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGuidesList;
