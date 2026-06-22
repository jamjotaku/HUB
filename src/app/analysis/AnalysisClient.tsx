'use client';
import { CosplayData } from '@/lib/data';
import { useState, useRef, useMemo, useEffect } from 'react';
import { RefreshCw, Wand2 } from 'lucide-react';

// 画像データから主要な色を抽出する簡易アルゴリズム
function extractColors(imageData: ImageData, colorCount: number = 5): string[] {
  const data = imageData.data;
  const colorMap: Record<string, number> = {};
  const step = 4 * 10; // パフォーマンスのため10ピクセルごとにサンプリング

  for (let i = 0; i < data.length; i += step) {
    const r = Math.round(data[i] / 25) * 25; // 色を丸めてグループ化
    const g = Math.round(data[i+1] / 25) * 25;
    const b = Math.round(data[i+2] / 25) * 25;
    const a = data[i+3];
    
    if (a < 255) continue; // 透明を無視
    
    // 完全な白黒グレーはアクセントカラーになりにくいためスキップ
    if (Math.abs(r-g) < 20 && Math.abs(g-b) < 20 && Math.abs(r-b) < 20) continue;

    const rgb = `${r},${g},${b}`;
    colorMap[rgb] = (colorMap[rgb] || 0) + 1;
  }

  const sorted = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, colorCount).map(s => `rgb(${s[0]})`);
}

export default function AnalysisClient({ data }: { data: CosplayData[] }) {
  const [selectedItem, setSelectedItem] = useState<CosplayData | null>(null);
  const [extractedColors, setExtractedColors] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // ランダムに12枚ピックアップ
  const [randomSamples, setRandomSamples] = useState<CosplayData[]>([]);

  const refreshSamples = () => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setRandomSamples(shuffled.slice(0, 12));
    setSelectedItem(null);
    setExtractedColors([]);
  };

  // 初回マウント時にサンプル生成
  useEffect(() => {
    if (data.length > 0) {
      const shuffled = [...data].sort(() => 0.5 - Math.random());
      setRandomSamples(shuffled.slice(0, 12));
    }
  }, [data]);

  const handleSelect = (item: CosplayData) => {
    setSelectedItem(item);
    setExtractedColors([]);
  };

  const analyzeImage = () => {
    const currentImg = imgRef.current;
    if (!currentImg) return;
    setIsAnalyzing(true);
    
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = currentImg.naturalWidth;
        canvas.height = currentImg.naturalHeight;
        
        // CORS回避用プロキシを経由して読み込んだ画像を描画
        ctx.drawImage(currentImg, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const colors = extractColors(imgData, 5);
        setExtractedColors(colors);
      } catch (e) {
        console.error("Canvas error", e);
        alert("画像の解析に失敗しました。CORSエラーの可能性があります。");
      } finally {
        setIsAnalyzing(false);
      }
    }, 800); // アニメーション演出のための意図的な遅延
  };

  return (
    <div>
      {/* 選択＆解析エリア */}
      {selectedItem && (
        <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 300px', textAlign: 'center' }}>
            <img 
              ref={imgRef}
              src={`https://corsproxy.io/?${encodeURIComponent(selectedItem.image)}`} 
              alt="Target"
              crossOrigin="anonymous"
              style={{ width: '100%', borderRadius: '12px', background: '#1c1c24' }}
            />
            <button 
              className="button" 
              onClick={analyzeImage} 
              disabled={isAnalyzing || extractedColors.length > 0}
              style={{ marginTop: '1rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              <Wand2 size={18} />
              {isAnalyzing ? 'ブラウザで解析中...' : 'Canvas APIで色を抽出'}
            </button>
          </div>

          <div style={{ flex: '2 1 400px' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>解析結果</h3>
            <p style={{ color: '#a1a1aa', marginBottom: '2rem' }}>
              コスプレイヤー: {selectedItem.cosplayer} <br/>
              VTuber: {selectedItem.member} <br/>
              元データのメインカラー: <span style={{ display: 'inline-block', width: '12px', height: '12px', background: selectedItem.mainColor, borderRadius: '50%' }}></span> {selectedItem.mainColor}
            </p>

            {extractedColors.length > 0 && (
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#e0aaff' }}>AI抽出カラーパレット (ブラウザ処理)</h4>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {extractedColors.map((color, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: '80px', height: '80px', 
                        backgroundColor: color, 
                        borderRadius: '50%',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        border: '2px solid rgba(255,255,255,0.1)'
                      }}></div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#a1a1aa' }}>{color}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {extractedColors.length === 0 && !isAnalyzing && (
              <p style={{ color: '#a1a1aa' }}>「色を抽出」ボタンを押してください。</p>
            )}
          </div>
        </div>
      )}

      {/* サンプル選択エリア */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem' }}>解析する画像を選択</h2>
        <button onClick={refreshSamples} style={{ background: 'none', border: 'none', color: '#a855f7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <RefreshCw size={16} /> 画像をシャッフル
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
        {randomSamples.map(item => (
          <div 
            key={item.id} 
            onClick={() => handleSelect(item)}
            style={{ 
              cursor: 'pointer', 
              borderRadius: '8px', 
              overflow: 'hidden',
              border: selectedItem?.id === item.id ? '3px solid #a855f7' : '3px solid transparent',
              transition: 'border 0.2s'
            }}
          >
            <img src={item.image} alt="Sample" style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
