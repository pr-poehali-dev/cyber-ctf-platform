import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  getCurrentUser, getCoursesByLevel, getCourseProgress, completeModule,
  type User, type Level, type Course, type Module
} from '@/lib/store';

interface CoursesProps { level: Level; }

// Квиз-компонент
function QuizBlock({ module: mod, onComplete }: { module: Module; onComplete: () => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>(mod.quiz.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = answers.every(a => a !== null);
  const score = submitted ? answers.filter((a, i) => a === mod.quiz[i].correct).length : 0;
  const passed = submitted && score === mod.quiz.length;

  const submit = () => {
    setSubmitted(true);
    if (score === mod.quiz.length) onComplete();
  };

  return (
    <div className="space-y-4">
      {mod.quiz.map((q, qi) => (
        <div key={qi} className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm text-white font-mono mb-3">
            <span className="neon-text mr-2">{qi + 1}.</span>{q.question}
          </p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              let borderColor = 'rgba(255,255,255,0.08)';
              let bg = 'transparent';
              let textColor = '#888';
              if (answers[qi] === oi) { borderColor = 'rgba(0,255,153,0.4)'; bg = 'rgba(0,255,153,0.05)'; textColor = '#00ff99'; }
              if (submitted) {
                if (oi === q.correct) { borderColor = 'rgba(0,255,153,0.6)'; bg = 'rgba(0,255,153,0.08)'; textColor = '#00ff99'; }
                else if (answers[qi] === oi && oi !== q.correct) { borderColor = 'rgba(255,50,50,0.5)'; bg = 'rgba(255,50,50,0.05)'; textColor = '#ff3232'; }
              }
              return (
                <button
                  key={oi}
                  disabled={submitted}
                  onClick={() => setAnswers(a => a.map((v, i) => i === qi ? oi : v))}
                  className="w-full text-left p-2.5 rounded text-xs font-mono transition-all"
                  style={{ border: `1px solid ${borderColor}`, background: bg, color: textColor }}
                >
                  <span className="mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>{opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div className={`text-xs mt-2 font-mono ${answers[qi] === q.correct ? 'neon-text' : 'text-red-400'}`}>
              {answers[qi] === q.correct ? '✓ Верно!' : `✗ Правильно: ${q.options[q.correct]}`}
            </div>
          )}
        </div>
      ))}
      {!submitted ? (
        <button
          disabled={!allAnswered}
          onClick={submit}
          className="cyber-btn-solid w-full py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Проверить ответы
        </button>
      ) : (
        <div className={`p-4 rounded text-center font-mono text-sm font-bold ${passed ? 'neon-text' : 'text-yellow-400'}`}
          style={{ background: passed ? 'rgba(0,255,153,0.05)' : 'rgba(255,193,0,0.05)', border: `1px solid ${passed ? 'rgba(0,255,153,0.2)' : 'rgba(255,193,0,0.2)'}` }}>
          {passed ? `🎉 Тест пройден! ${score}/${mod.quiz.length} — +5 очков` : `${score}/${mod.quiz.length} — попробуй ещё раз`}
        </div>
      )}
    </div>
  );
}

// Модуль внутри курса
function ModuleView({ mod, user, courseId, onBack, onModuleComplete }: {
  mod: Module; user: User; courseId: string;
  onBack: () => void; onModuleComplete: (modId: string) => void;
}) {
  const [tab, setTab] = useState<'video' | 'theory' | 'quiz'>('video');
  const isCompleted = user.completedModules.includes(mod.id);

  const handleComplete = () => {
    onModuleComplete(mod.id);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="cyber-btn py-1.5 px-3 flex items-center gap-1.5 text-xs">
          <Icon name="ArrowLeft" size={12} /> Назад
        </button>
        <h2 className="text-white font-display font-bold text-lg truncate">{mod.title}</h2>
        {isCompleted && <span className="tag-badge tag-easy ml-auto flex-shrink-0">ПРОЙДЕНО</span>}
      </div>

      {/* Табы */}
      <div className="flex gap-1 p-1 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'video', icon: 'Play', label: 'Видео' },
          { id: 'theory', icon: 'BookOpen', label: 'Теория' },
          { id: 'quiz', icon: 'HelpCircle', label: 'Тест' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-mono rounded transition-all ${tab === t.id ? 'bg-neon text-black font-bold' : 'text-gray-500 hover:text-white'}`}
          >
            <Icon name={t.icon} fallback="Circle" size={12} />{t.label}
          </button>
        ))}
      </div>

      {/* Видео */}
      {tab === 'video' && (
        <div className="space-y-4">
          <div className="relative rounded overflow-hidden" style={{ paddingTop: '56.25%', background: '#000' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src={mod.videoUrl}
              title={mod.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-4 rounded text-sm leading-relaxed" style={{ color: '#aaa', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="neon-text font-bold text-xs">СОДЕРЖАНИЕ: </span>{mod.theory.slice(0, 150)}...
          </div>
        </div>
      )}

      {/* Теория */}
      {tab === 'theory' && (
        <div className="cyber-card p-5">
          <p className="text-sm leading-7" style={{ color: '#ccc' }}>{mod.theory}</p>
          {!isCompleted && (
            <button onClick={handleComplete} className="cyber-btn-solid mt-5 w-full py-2.5">
              Отметить как изученный (+5 очков)
            </button>
          )}
        </div>
      )}

      {/* Квиз */}
      {tab === 'quiz' && (
        <div className="cyber-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="HelpCircle" size={14} className="neon-text" />
            <span className="text-white font-display font-bold">Мини-тест: {mod.title}</span>
          </div>
          <QuizBlock module={mod} onComplete={handleComplete} />
        </div>
      )}
    </div>
  );
}

// Карточка курса
function CourseCard({ course, user, onOpen }: { course: Course; user: User; onOpen: () => void }) {
  const progress = getCourseProgress(user, course.id);
  const catColors: Record<string, string> = {
    crypto: '#60a5fa', web: '#f97316', linux: '#a3e635',
    pwn: '#f43f5e', reverse: '#c084fc', forensics: '#fb923c', stego: '#34d399', misc: '#94a3b8',
  };
  const color = catColors[course.category] || 'var(--neon)';

  return (
    <button onClick={onOpen} className="cyber-card p-5 text-left w-full hover:scale-[1.01] transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tag-badge" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
              {course.category.toUpperCase()}
            </span>
            <span className={`tag-badge ${course.level === 'beginner' ? 'tag-beginner' : 'tag-advanced'}`}>
              {course.level === 'beginner' ? 'NEW' : 'PRO'}
            </span>
          </div>
          <h3 className="text-white font-display font-bold text-base">{course.title}</h3>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-dim)' }}>{course.description}</p>
        </div>
        <div className="text-center flex-shrink-0">
          <div className="text-2xl font-mono font-bold" style={{ color }}>{progress}%</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>прогресс</div>
        </div>
      </div>
      <div className="progress-bar mb-3">
        <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}, ${color}90)` }} />
      </div>
      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-dim)' }}>
        <span className="flex items-center gap-1"><Icon name="LayoutList" size={11} /> {course.moduleCount} модулей</span>
        <span className="flex items-center gap-1"><Icon name="Clock" size={11} /> {course.totalHours}ч</span>
        <span className="ml-auto neon-text font-bold">→ Открыть</span>
      </div>
    </button>
  );
}

// Страница курса
function CourseDetail({ course, user, onBack, onModuleComplete }: {
  course: Course; user: User; onBack: () => void; onModuleComplete: (modId: string) => void;
}) {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const progress = getCourseProgress(user, course.id);

  if (activeModule) {
    return (
      <ModuleView
        mod={activeModule}
        user={user}
        courseId={course.id}
        onBack={() => setActiveModule(null)}
        onModuleComplete={(id) => { onModuleComplete(id); setActiveModule(null); }}
      />
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="cyber-btn py-1.5 px-3 flex items-center gap-1.5 text-xs">
          <Icon name="ArrowLeft" size={12} /> Курсы
        </button>
      </div>

      <div className="cyber-card p-6">
        <h1 className="text-2xl font-display font-bold text-white mb-1">{course.title}</h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-dim)' }}>{course.description}</p>
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
          <span className="flex items-center gap-1"><Icon name="LayoutList" size={11} /> {course.moduleCount} модулей</span>
          <span className="flex items-center gap-1"><Icon name="Clock" size={11} /> {course.totalHours} часов</span>
        </div>
        <div className="flex items-center gap-3 mb-1">
          <div className="progress-bar flex-1"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <span className="text-sm font-mono neon-text font-bold">{progress}%</span>
        </div>
        <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
          {course.modules.filter(m => user.completedModules.includes(m.id)).length}/{course.moduleCount} модулей пройдено
        </div>
      </div>

      <div className="space-y-3">
        {course.modules.map((mod, idx) => {
          const done = user.completedModules.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod)}
              className="cyber-card p-4 text-left w-full flex items-center gap-4 hover:border-opacity-40 transition-all"
              style={{ borderColor: done ? 'rgba(0,255,153,0.25)' : undefined }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-mono font-bold ${done ? 'bg-neon text-black' : 'border border-gray-700 text-gray-500'}`}>
                {done ? '✓' : idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-mono text-sm ${done ? 'text-white' : 'text-gray-300'}`}>{mod.title}</div>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: 'var(--text-dim)' }}>
                  <span className="flex items-center gap-1"><Icon name="Play" size={10} /> Видео</span>
                  <span className="flex items-center gap-1"><Icon name="FileText" size={10} /> Теория</span>
                  <span className="flex items-center gap-1"><Icon name="HelpCircle" size={10} /> {mod.quiz.length} вопроса</span>
                </div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-gray-600" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Courses({ level }: CoursesProps) {
  const [user, setUser] = useState<User>(getCurrentUser());
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const courses = getCoursesByLevel(level);

  const handleModuleComplete = (modId: string) => {
    const updated = completeModule(modId);
    setUser({ ...updated });
  };

  if (activeCourse) {
    return (
      <CourseDetail
        course={activeCourse}
        user={user}
        onBack={() => setActiveCourse(null)}
        onModuleComplete={handleModuleComplete}
      />
    );
  }

  const completedCount = courses.filter(c => c.modules.every(m => user.completedModules.includes(m.id))).length;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="cyber-card p-5 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Icon name="BookOpen" size={20} className="neon-text" />
            КУРСЫ
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
            {level === 'beginner' ? 'Материалы для начинающих' : 'Продвинутые техники'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold neon-text">{completedCount}/{courses.length}</div>
          <div className="text-xs" style={{ color: 'var(--text-dim)' }}>пройдено</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} user={user} onOpen={() => setActiveCourse(course)} />
        ))}
      </div>
    </div>
  );
}
