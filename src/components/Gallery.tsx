'use client';

import { useState, useMemo, useEffect } from 'react';
import { CosplayData } from '@/lib/data';

const PAGE_SIZE = 50;

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function Gallery({ initialData }: { initialData: CosplayData[] }) {
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('All');
  const [shuffledAllData, setShuffledAllData] = useState<CosplayData[]>(initialData);

  // クライアントサイドでのみシャッフルを実行し、SSR時の不一致を防ぐ
  useEffect(() => {
    setShuffledAllData(shuffleArray(initialData));
  }, [initialData]);

  const uniqueMembers = useMemo(() => {
    const members = Array.from(new Set(initialData.map(item => item.member)));
    return ['All', ...members];
  }, [initialData]);

  const filteredData = useMemo(() => {
    if (selectedMember === 'All') return shuffledAllData;
    return initialData.filter(item => item.member === selectedMember);
  }, [initialData, selectedMember, shuffledAllData]);

  const displayedData = filteredData.slice(0, displayCount);

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMember(e.target.value);
    setDisplayCount(PAGE_SIZE);
  };

  return (
    <>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <label htmlFor="member-filter" style={{ color: '#a1a1aa', fontWeight: 500 }}>
          VTuberで絞り込み:
        </label>
        <select 
          id="member-filter"
          value={selectedMember} 
          onChange={handleMemberChange}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(28, 28, 36, 0.8)',
            color: '#f4f4f5',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '1rem',
            outline: 'none',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
        >
          {uniqueMembers.map(member => (
            <option key={member} value={member}>
              {member === 'All' ? 'すべてのメンバー (ランダム)' : member}
            </option>
          ))}
        </select>
        <div style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
          {filteredData.length} 件のコスプレ
        </div>
      </div>

      <div className="masonry-grid">
        {displayedData.map((item) => (
          <div 
            key={item.id} 
            className="card glass"
            onClick={() => setSelectedImage(item.image)}
            style={{ cursor: 'pointer' }}
          >
            <img 
              src={item.image} 
              alt={`Cosplay by ${item.cosplayer}`}
              loading="lazy"
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
            <div className="card-content">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{item.cosplayer}</h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>{item.member}</p>
            </div>
          </div>
        ))}
      </div>

      {displayCount < filteredData.length && (
        <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '3rem' }}>
          <button 
            className="button"
            onClick={() => setDisplayCount(prev => prev + PAGE_SIZE)}
            style={{ fontSize: '1.1rem' }}
          >
            さらに表示する ({displayCount} / {filteredData.length})
          </button>
        </div>
      )}

      {selectedImage && (
        <div 
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '2rem',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            style={{ 
              maxHeight: '100%', 
              maxWidth: '100%', 
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
            }} 
            alt="Enlarged cosplay view" 
          />
        </div>
      )}
    </>
  );
}
