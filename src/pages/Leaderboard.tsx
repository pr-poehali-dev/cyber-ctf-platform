import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { getLeaderboard, getCurrentUser, type Level } from '@/lib/store';

interface LeaderboardProps { level: Level; }

export default function Leaderboard({ level }: LeaderboardProps) {
  const [filter, setFilter] = useState<'all' | Level>('all');
  const allUsers = getLeaderboard();
  const currentUser = getCurrentUser();

  const filtered = filter === 'all' ? allUsers : allUsers.filter(u => u.level === filter);
  const myEntry = allUsers.find(u => u.id === 'current' || u.name === currentUser.name);
  const myGlobalRank = allUsers.findIndex(u => u.id === 'current' || u.name === currentUser.name) + 1;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Шапка */}
      <div className="cyber-card p-5 scan-line overflow-hidden relative">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <Icon name="Trophy" size={20} className="neon-text" />
              ТАБЛИЦА ЛИДЕРОВ
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>Рейтинг за всё время</p>
          </div>
          {myEntry && (
            <div className="cyber-card p-3 text-center min-w-[140px]">
              <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>ВАШ РЕЙТИНГ</div>
              <div className="text-3xl font-mono font-bold neon-text">#{myGlobalRank}</div>
              <div className="text-xs mt-1 font-mono text-white">{myEntry.score} очков</div>
            </div>
          )}
        </div>
      </div>

      {/* Фильтр */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: '🌐 Все' },
          { id: 'beginner', label: '🌱 Новички' },
          { id: 'advanced', label: '⚡ Опытные' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`cyber-btn py-2 px-4 text-xs ${filter === f.id ? 'bg-neon bg-opacity-10 border-neon border-opacity-60' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Топ-3 подиум */}
      {filter === 'all' && filtered.length >= 3 && (
        <div className="grid grid-cols-3 gap-3">
          {[filtered[1], filtered[0], filtered[2]].map((u, podiumIdx) => {
            const realRank = podiumIdx === 1 ? 1 : podiumIdx === 0 ? 2 : 3;
            const heights = ['h-28', 'h-36', 'h-24'];
            const medals = ['🥈', '🥇', '🥉'];
            const colors = ['#c0c0c0', '#ffd700', '#cd7f32'];
            const glows = ['rgba(192,192,192,0.2)', 'rgba(255,215,0,0.3)', 'rgba(205,127,50,0.2)'];
            return (
              <div key={u.id} className={`flex flex-col items-center justify-end ${heights[podiumIdx]}`}>
                <div className="text-2xl mb-1">{u.avatar}</div>
                <div className="text-xs font-mono text-white text-center truncate max-w-full px-1">{u.name}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: colors[podiumIdx] }}>{u.score}</div>
                <div
                  className="w-full mt-2 rounded-t flex items-center justify-center text-xl font-bold"
                  style={{
                    background: `${colors[podiumIdx]}15`,
                    border: `1px solid ${colors[podiumIdx]}40`,
                    borderBottom: 'none',
                    boxShadow: `0 -4px 20px ${glows[podiumIdx]}`,
                    height: podiumIdx === 1 ? '64px' : podiumIdx === 0 ? '48px' : '40px',
                  }}
                >
                  {medals[podiumIdx]}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Полная таблица */}
      <div className="cyber-card overflow-hidden">
        {/* Заголовок таблицы */}
        <div className="grid grid-cols-[40px_1fr_80px_80px_70px] gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest"
          style={{ color: 'var(--text-dim)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          <span>#</span>
          <span>Участник</span>
          <span className="hidden sm:block">Уровень</span>
          <span className="text-right">Задач</span>
          <span className="text-right">Очки</span>
        </div>

        {filtered.map((u, idx) => {
          const isMe = u.id === 'current' || u.name === currentUser.name;
          const rank = allUsers.indexOf(u) + 1;
          return (
            <div
              key={u.id}
              className={`grid grid-cols-[40px_1fr_80px_80px_70px] gap-2 px-4 py-3 items-center transition-all ${isMe ? 'border-l-2 border-neon' : ''}`}
              style={{
                background: isMe ? 'rgba(0,255,153,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}
            >
              {/* Ранг */}
              <span className={`font-mono text-sm font-bold text-center ${rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'text-gray-600'}`}>
                {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
              </span>

              {/* Имя */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">{u.avatar}</span>
                <div className="min-w-0">
                  <div className={`font-mono text-sm truncate ${isMe ? 'neon-text font-bold' : 'text-white'}`}>
                    {u.name}{isMe && ' (вы)'}
                  </div>
                </div>
              </div>

              {/* Уровень */}
              <span className={`hidden sm:inline tag-badge ${u.level === 'beginner' ? 'tag-beginner' : 'tag-advanced'}`}>
                {u.level === 'beginner' ? 'NEW' : 'PRO'}
              </span>

              {/* Задачи */}
              <span className="text-right font-mono text-sm text-white">{u.solvedTasks.length}</span>

              {/* Очки */}
              <span className={`text-right font-mono text-sm font-bold ${isMe ? 'neon-text' : 'text-white'}`}>{u.score}</span>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="cyber-card p-8 text-center" style={{ color: 'var(--text-dim)' }}>
          Нет участников в этой категории
        </div>
      )}
    </div>
  );
}
