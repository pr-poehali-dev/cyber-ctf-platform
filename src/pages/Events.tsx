import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { CTF_EVENTS, type Level } from '@/lib/store';

interface EventsProps { level: Level; }

function Countdown({ targetDate, label }: { targetDate: string; label: string }) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <div>
      <div className="text-xs mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>{label}</div>
      <div className="flex gap-3">
        {[['дней', timeLeft.d], ['часов', timeLeft.h], ['минут', timeLeft.m], ['секунд', timeLeft.s]].map(([l, v]) => (
          <div key={l as string} className="text-center">
            <div
              className="w-12 h-12 rounded flex items-center justify-center text-xl font-mono font-bold neon-text"
              style={{ background: 'rgba(0,255,153,0.06)', border: '1px solid rgba(0,255,153,0.2)' }}
            >
              {String(v).padStart(2, '0')}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Events({ level }: EventsProps) {
  const [registered, setRegistered] = useState<string[]>([]);

  const register = (id: string) => {
    setRegistered(r => r.includes(id) ? r : [...r, id]);
  };

  const relevantEvents = CTF_EVENTS.filter(e => e.level === level || e.level === 'all');
  const otherEvents = CTF_EVENTS.filter(e => e.level !== level && e.level !== 'all');

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Шапка */}
      <div className="cyber-card p-5">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Icon name="Swords" size={20} className="neon-text" />
          CTF СОРЕВНОВАНИЯ
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
          Capture The Flag — найди флаги, заработай очки
        </p>
      </div>

      {/* Что такое CTF */}
      <div className="p-4 rounded" style={{ background: 'rgba(0,255,153,0.04)', border: '1px solid rgba(0,255,153,0.12)' }}>
        <div className="flex items-start gap-3">
          <Icon name="Info" size={16} className="neon-text flex-shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed" style={{ color: '#aaa' }}>
            <span className="text-white font-bold">CTF (Capture The Flag)</span> — соревнования по информационной безопасности, где участники решают задачи и захватывают "флаги" в формате <span className="neon-text font-mono">flag&#123;...&#125;</span>. Каждый флаг приносит очки в общий рейтинг.
          </div>
        </div>
      </div>

      {/* Соревнования для твоего уровня */}
      <div>
        <h2 className="text-white font-display font-bold mb-3 flex items-center gap-2">
          <span className={level === 'beginner' ? 'neon-text' : 'text-orange-400'}>
            {level === 'beginner' ? '🌱 Для новичков' : '⚡ Для опытных'}
          </span>
          <span className="tag-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#666', border: '1px solid rgba(255,255,255,0.1)' }}>
            {relevantEvents.length}
          </span>
        </h2>

        <div className="space-y-4">
          {relevantEvents.map((event) => {
            const isReg = registered.includes(event.id);
            const isMain = event.level !== 'all';
            return (
              <div
                key={event.id}
                className="cyber-card p-5 space-y-4"
                style={isMain ? { borderColor: level === 'beginner' ? 'rgba(0,255,153,0.2)' : 'rgba(255,100,0,0.2)' } : undefined}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`tag-badge ${event.level === 'beginner' ? 'tag-beginner' : event.level === 'advanced' ? 'tag-advanced' : 'text-blue-400 border border-blue-400 border-opacity-30 bg-blue-400 bg-opacity-10'}`}>
                        {event.level === 'all' ? '🌐 ALL' : event.level === 'beginner' ? '🌱 NEW' : '⚡ PRO'}
                      </span>
                      {isReg && <span className="tag-badge tag-easy">✓ ЗАРЕГИСТРИРОВАН</span>}
                    </div>
                    <h3 className="text-white font-display font-bold text-lg">{event.title}</h3>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: '#aaa' }}>{event.description}</p>
                  </div>
                </div>

                {/* Даты */}
                <div className="grid grid-cols-2 gap-4 p-3 rounded text-sm" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>НАЧАЛО</div>
                    <div className="text-white font-mono text-xs">{formatDate(event.startDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: 'var(--text-dim)' }}>КОНЕЦ</div>
                    <div className="text-white font-mono text-xs">{formatDate(event.endDate)}</div>
                  </div>
                </div>

                {/* Таймер */}
                <Countdown targetDate={event.startDate} label="ДО НАЧАЛА" />

                {/* Призы */}
                <div>
                  <div className="text-xs mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.1em' }}>ПРИЗЫ</div>
                  <div className="space-y-1">
                    {event.prizes.map((prize, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-base">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎖️'}</span>
                        <span style={{ color: '#ccc' }}>{prize}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Теги */}
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map(tag => (
                    <span key={tag} className="tag-badge" style={{ background: 'rgba(255,255,255,0.05)', color: '#666', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Кнопка */}
                <button
                  onClick={() => register(event.id)}
                  disabled={isReg}
                  className={`w-full py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all rounded ${
                    isReg
                      ? 'text-neon cursor-not-allowed'
                      : 'cyber-btn-solid hover:shadow-neon'
                  }`}
                  style={isReg ? { background: 'rgba(0,255,153,0.08)', border: '1px solid rgba(0,255,153,0.3)' } : undefined}
                >
                  {isReg ? '✓ Ты зарегистрирован' : 'Зарегистрироваться'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Другие соревнования */}
      {otherEvents.length > 0 && (
        <div>
          <h2 className="text-white font-display font-bold mb-3" style={{ color: '#666' }}>
            Другие соревнования
          </h2>
          <div className="space-y-3">
            {otherEvents.map(event => (
              <div key={event.id} className="cyber-card p-4 opacity-60 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`tag-badge ${event.level === 'beginner' ? 'tag-beginner' : 'tag-advanced'}`}>
                      {event.level === 'beginner' ? '🌱 NEW' : '⚡ PRO'}
                    </span>
                  </div>
                  <div className="text-white font-mono text-sm">{event.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-dim)' }}>{formatDate(event.startDate)}</div>
                </div>
                <button
                  onClick={() => register(event.id)}
                  disabled={registered.includes(event.id)}
                  className="cyber-btn py-2 px-4 flex-shrink-0 text-xs"
                >
                  {registered.includes(event.id) ? '✓' : 'Участвовать'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
