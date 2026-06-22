'use client';
import { CosplayData } from '@/lib/data';
import { useState, useMemo, useEffect } from 'react';

type Difficulty = 'easy' | 'normal' | 'hard';

// 配列をシャッフルするヘルパー関数
function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

export default function QuizClient({ data }: { data: CosplayData[] }) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestion, setCurrentQuestion] = useState<CosplayData | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answeredState, setAnsweredState] = useState<{ selected: string | null; isCorrect: boolean } | null>(null);

  const uniqueMembers = useMemo(() => Array.from(new Set(data.map(item => item.member))), [data]);
  const uniqueCosplayers = useMemo(() => Array.from(new Set(data.map(item => item.cosplayer))), [data]);

  const generateQuestion = (diff: Difficulty = difficulty) => {
    setAnsweredState(null);
    let randomItem: CosplayData;

    if (diff === 'hard') {
      // 上級: 写真の数による偏りを防ぐため、先にランダムな「コスプレイヤー」を選ぶ
      const randomCosplayer = uniqueCosplayers[Math.floor(Math.random() * uniqueCosplayers.length)];
      const cosplayerPhotos = data.filter(item => item.cosplayer === randomCosplayer);
      randomItem = cosplayerPhotos[Math.floor(Math.random() * cosplayerPhotos.length)];
      setCurrentQuestion(randomItem);

      const incorrectOptions = uniqueCosplayers.filter(c => c !== randomItem.cosplayer);
      const selectedIncorrect = shuffle(incorrectOptions).slice(0, 3);
      setOptions(shuffle([randomItem.cosplayer, ...selectedIncorrect]));
    } else {
      // 初級・中級: 写真の数による偏りを防ぐため、先にランダムな「VTuber」を選ぶ
      const randomVtuber = uniqueMembers[Math.floor(Math.random() * uniqueMembers.length)];
      const vtuberPhotos = data.filter(item => item.member === randomVtuber);
      randomItem = vtuberPhotos[Math.floor(Math.random() * vtuberPhotos.length)];
      setCurrentQuestion(randomItem);

      const incorrectOptions = uniqueMembers.filter(m => m !== randomItem.member);
      const selectedIncorrect = shuffle(incorrectOptions).slice(0, 3);
      setOptions(shuffle([randomItem.member, ...selectedIncorrect]));
    }
  };

  useEffect(() => {
    generateQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultyChange = (newDiff: Difficulty) => {
    if (newDiff === difficulty) return;
    setDifficulty(newDiff);
    setScore({ correct: 0, total: 0 });
    generateQuestion(newDiff);
  };

  const handleSelect = (option: string) => {
    if (answeredState) return;
    
    const targetAnswer = difficulty === 'hard' ? currentQuestion?.cosplayer : currentQuestion?.member;
    const isCorrect = option === targetAnswer;
    
    setAnsweredState({ selected: option, isCorrect });
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  if (!currentQuestion) return <div style={{ textAlign: 'center' }}>準備中...</div>;

  const getQuestionText = () => {
    if (difficulty === 'hard') return "このコスプレイヤーさんは誰でしょう？";
    return "このコスプレはどのVTuberでしょう？";
  };

  // 中級の場合のみ、解答するまで画像をぼかす
  const isBlurred = difficulty === 'normal' && !answeredState;

  return (
    <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      
      {/* 難易度選択 */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => (
          <button
            key={d}
            onClick={() => handleDifficultyChange(d)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              border: `1px solid ${difficulty === d ? '#a855f7' : 'rgba(255,255,255,0.2)'}`,
              background: difficulty === d ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
              color: difficulty === d ? '#fff' : '#a1a1aa',
              cursor: 'pointer',
              fontWeight: difficulty === d ? 'bold' : 'normal',
              transition: 'all 0.2s'
            }}
          >
            {d === 'easy' ? '🔰 初級 (やさしい)' : d === 'normal' ? '👓 中級 (ぼかし有)' : '🔥 上級 (レイヤー当て)'}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
        スコア: {score.correct} / {score.total}
      </div>
      
      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', color: '#e0aaff' }}>{getQuestionText()}</h3>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center', overflow: 'hidden', borderRadius: '12px' }}>
        <img 
          src={currentQuestion.image} 
          alt="Quiz image" 
          style={{ 
            maxWidth: '100%', 
            maxHeight: '400px', 
            objectFit: 'contain', 
            background: 'rgba(0,0,0,0.5)',
            filter: isBlurred ? 'blur(20px)' : 'none',
            transition: 'filter 0.4s ease'
          }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {options.map(option => {
          let bgColor = 'rgba(255,255,255,0.1)';
          let borderColor = 'rgba(255,255,255,0.2)';
          
          if (answeredState) {
            const targetAnswer = difficulty === 'hard' ? currentQuestion.cosplayer : currentQuestion.member;
            if (option === targetAnswer) {
              bgColor = 'rgba(34, 197, 94, 0.2)'; // 正解
              borderColor = '#22c55e';
            } else if (option === answeredState.selected) {
              bgColor = 'rgba(239, 68, 68, 0.2)'; // 間違い
              borderColor = '#ef4444';
            }
          }

          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!answeredState}
              style={{
                padding: '1rem',
                fontSize: '1.1rem',
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: '#fff',
                cursor: answeredState ? 'default' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answeredState && (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <h2 style={{ color: answeredState.isCorrect ? '#4ade80' : '#f87171', marginBottom: '1rem', fontSize: '1.5rem' }}>
            {answeredState.isCorrect ? '正解！ 🎉' : `残念！ 正解は「${difficulty === 'hard' ? currentQuestion.cosplayer : currentQuestion.member}」でした`}
          </h2>
          <button className="button" onClick={() => generateQuestion(difficulty)} style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
}
