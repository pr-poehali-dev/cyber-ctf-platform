import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { type Level } from '@/lib/store';

// ============================================================
// ВОПРОСЫ ВХОДНОГО ТЕСТА
// 10 вопросов, охватывают: Linux, крипто, веб, reverse, pwn, forensics, сети
// Логика: 0–4 правильных → beginner, 5–10 → advanced
// Чтобы изменить порог — отредактируй ADVANCED_THRESHOLD ниже
// ============================================================
const ADVANCED_THRESHOLD = 5;

interface Question {
  id: number;
  category: string;
  text: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Linux',
    text: 'Какая команда Linux позволяет найти все файлы с SUID-битом?',
    options: [
      'find / -perm /4000 2>/dev/null',
      'ls -la /bin | grep s',
      'chmod 4000 /* --find',
      'getfacl / --suid',
    ],
    correct: 0,
    explanation: 'find / -perm /4000 ищет файлы с установленным SUID-битом. SUID позволяет запускать файл с правами владельца — вектор privilege escalation.',
  },
  {
    id: 2,
    category: 'Криптография',
    text: 'Строка "SGVsbG8=" заканчивается на "=". Что это означает?',
    options: [
      'Base64-кодирование с padding',
      'Хэш MD5',
      'Hex-строка',
      'Шифр Вернама',
    ],
    correct: 0,
    explanation: 'Символ = в конце — padding (дополнение) в Base64. Base64 кодирует данные группами по 3 байта, добавляя = до кратности 4.',
  },
  {
    id: 3,
    category: 'Веб-безопасность',
    text: 'Что произойдёт, если ввести в поле ввода: \' OR \'1\'=\'1',
    options: [
      'SQL-инъекция: обход авторизации',
      'XSS-атака',
      'CSRF-запрос',
      'Path traversal',
    ],
    correct: 0,
    explanation: 'Классическая SQL-инъекция. Условие \'1\'=\'1 всегда истинно, что позволяет обойти WHERE-условие и получить доступ без пароля.',
  },
  {
    id: 4,
    category: 'Сети',
    text: 'Что делает утилита Wireshark?',
    options: [
      'Анализирует и перехватывает сетевые пакеты',
      'Сканирует открытые порты',
      'Проводит атаку MITM',
      'Шифрует трафик',
    ],
    correct: 0,
    explanation: 'Wireshark — анализатор сетевого трафика. Захватывает пакеты в реальном времени или из PCAP-файлов. Незаменим в форензике и поиске уязвимостей.',
  },
  {
    id: 5,
    category: 'Binary Exploitation',
    text: 'Что такое "return address" в контексте stack buffer overflow?',
    options: [
      'Адрес, по которому вернётся выполнение после вызова функции',
      'Адрес начала буфера в памяти',
      'Указатель на heap',
      'Адрес таблицы GOT',
    ],
    correct: 0,
    explanation: 'Return address — адрес следующей инструкции после вызова функции, сохранённый на стеке. Переполнение буфера позволяет его перезаписать и перенаправить выполнение.',
  },
  {
    id: 6,
    category: 'Веб-безопасность',
    text: 'Алгоритм подписи JWT изменён с HS256 на "none". Что это означает?',
    options: [
      'Подпись не проверяется — уязвимость None Algorithm',
      'Токен использует асимметричную криптографию',
      'Токен истёк',
      'Алгоритм устарел, но безопасен',
    ],
    correct: 0,
    explanation: 'JWT None Algorithm Attack: если сервер принимает alg="none", он не проверяет подпись. Атакующий может изменить payload (например, role: admin) без ключа.',
  },
  {
    id: 7,
    category: 'Reverse Engineering',
    text: 'Какой инструмент используется для статического анализа бинарного файла без его запуска?',
    options: [
      'Ghidra или IDA Pro',
      'GDB',
      'strace',
      'ltrace',
    ],
    correct: 0,
    explanation: 'Ghidra (NSA) и IDA Pro — дизассемблеры/декомпиляторы для статического анализа. GDB, strace, ltrace — для динамического (во время выполнения).',
  },
  {
    id: 8,
    category: 'Форензика',
    text: 'Команда "strings binary_file" покажет:',
    options: [
      'Все читаемые строки ASCII/Unicode в бинарнике',
      'Список импортированных функций',
      'Сетевые соединения файла',
      'Энтропию файла',
    ],
    correct: 0,
    explanation: 'strings извлекает все последовательности печатных символов длиной ≥4. Позволяет быстро найти URL, пароли, имена функций в бинарном файле.',
  },
  {
    id: 9,
    category: 'Криптография',
    text: 'Почему хранение паролей в MD5 считается небезопасным?',
    options: [
      'MD5 быстрый, существуют радужные таблицы и GPU-брутфорс',
      'MD5 — симметричный шифр, легко расшифровать',
      'MD5 слишком длинный для хранения',
      'MD5 не поддерживает кириллицу',
    ],
    correct: 0,
    explanation: 'MD5 разработан для скорости, что делает его уязвимым к брутфорсу (миллиарды хэшей в секунду на GPU). Для паролей используй bcrypt/Argon2 с солью.',
  },
  {
    id: 10,
    category: 'Веб-безопасность',
    text: 'Что такое SSRF (Server-Side Request Forgery)?',
    options: [
      'Атака, заставляющая сервер делать HTTP-запросы во внутреннюю сеть',
      'Межсайтовая подделка запросов от браузера',
      'SQL-инъекция через заголовки',
      'Атака на сессионные токены',
    ],
    correct: 0,
    explanation: 'SSRF позволяет атакующему заставить сервер запросить внутренние ресурсы (169.254.169.254 в AWS — доступ к IAM credentials). Отличие от CSRF: запрос инициирует сервер, не браузер.',
  },
];

// Категории с цветами
const CAT_COLORS: Record<string, string> = {
  'Linux': '#a3e635',
  'Криптография': '#60a5fa',
  'Веб-безопасность': '#f97316',
  'Сети': '#34d399',
  'Binary Exploitation': '#f43f5e',
  'Reverse Engineering': '#c084fc',
  'Форензика': '#fb923c',
};

interface LevelTestProps {
  onComplete: (level: Level, score: number) => void;
}

type TestPhase = 'intro' | 'question' | 'result';

export default function LevelTest({ onComplete }: LevelTestProps) {
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const question = QUESTIONS[current];
  const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length;
  const resultLevel: Level = score >= ADVANCED_THRESHOLD ? 'advanced' : 'beginner';
  const progress = ((current) / QUESTIONS.length) * 100;

  // Клавиатурная навигация
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== 'question' || showExplain) return;
      const n = parseInt(e.key);
      if (n >= 1 && n <= 4) handleSelect(n - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, showExplain, current]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
    setTimeout(() => setShowExplain(true), 400);
  };

  const handleNext = () => {
    if (current + 1 < QUESTIONS.length) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplain(false);
      setAnimKey(k => k + 1);
    } else {
      setPhase('result');
    }
  };

  const handleFinish = () => {
    onComplete(resultLevel, score);
  };

  // ── ЭКРАН ПРИВЕТСТВИЯ ──
  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#050505' }}>
        {/* Сетка фон */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Свечение */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #00ff99 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div className="relative z-10 max-w-lg w-full text-center animate-fade-in">
          {/* Иконка */}
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'rgba(0,255,153,0.08)', border: '1px solid rgba(0,255,153,0.25)', boxShadow: '0 0 40px rgba(0,255,153,0.15)' }}
            >
              🛡️
            </div>
          </div>

          {/* Заголовок */}
          <div className="text-xs font-mono mb-2 tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
            CYBERLEARN PLATFORM
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Входной тест
          </h1>
          <p className="text-lg font-display mb-1" style={{ color: 'rgba(0,255,153,0.7)' }}>
            Определим твой уровень
          </p>
          <p className="text-sm leading-relaxed mt-4 mb-8" style={{ color: '#666' }}>
            10 вопросов по информационной безопасности.<br />
            Охвачены темы: Linux, криптография, веб-уязвимости,<br />
            реверс-инжениринг, pwn, форензика, сети.
          </p>

          {/* Метрики */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: 'HelpCircle', val: '10', label: 'вопросов' },
              { icon: 'Clock', val: '~5', label: 'минут' },
              { icon: 'Zap', val: '2', label: 'уровня' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon name={item.icon} fallback="Circle" size={16} className="neon-text mx-auto mb-1.5" />
                <div className="text-lg font-mono font-bold text-white">{item.val}</div>
                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('question')}
            className="cyber-btn-solid w-full py-4 text-sm tracking-widest"
          >
            НАЧАТЬ ТЕСТ →
          </button>
          <div className="text-xs mt-4" style={{ color: '#333' }}>
            Нажми Enter или кликни чтобы начать
          </div>
        </div>
      </div>
    );
  }

  // ── ЭКРАН ВОПРОСА ──
  if (phase === 'question') {
    const catColor = CAT_COLORS[question.category] || 'var(--neon)';
    return (
      <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#050505' }}>
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Прогресс-бар */}
        <div className="relative z-10 flex-shrink-0">
          <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)' }}>
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--neon), rgba(0,255,153,0.6))', boxShadow: '0 0 8px rgba(0,255,153,0.4)' }}
            />
          </div>
          <div className="flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <span
                className="tag-badge text-xs px-2 py-1"
                style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}30` }}
              >
                {question.category}
              </span>
            </div>
            <div className="font-mono text-sm" style={{ color: 'var(--text-dim)' }}>
              <span className="text-white font-bold">{current + 1}</span> / {QUESTIONS.length}
            </div>
          </div>
        </div>

        {/* Контент вопроса */}
        <div key={animKey} className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="max-w-xl w-full">

            {/* Вопрос */}
            <div className="mb-6 text-center">
              <div className="text-xs font-mono mb-3 tracking-[0.2em]" style={{ color: 'var(--text-dim)' }}>
                ВОПРОС {current + 1}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight">
                {question.text}
              </h2>
              <div className="text-xs mt-2" style={{ color: '#333' }}>
                Нажми 1–4 для быстрого ответа
              </div>
            </div>

            {/* Варианты ответов */}
            <div className="space-y-3 mb-4">
              {question.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === question.correct;
                const isWrong = isSelected && !isCorrect;

                let borderColor = 'rgba(255,255,255,0.08)';
                let bg = 'rgba(255,255,255,0.02)';
                let textColor = '#aaa';
                let icon: string | null = null;

                if (selected !== null) {
                  if (isCorrect) {
                    borderColor = 'rgba(0,255,153,0.5)';
                    bg = 'rgba(0,255,153,0.07)';
                    textColor = '#00ff99';
                    icon = 'Check';
                  } else if (isWrong) {
                    borderColor = 'rgba(255,50,50,0.5)';
                    bg = 'rgba(255,50,50,0.06)';
                    textColor = '#ff5050';
                    icon = 'X';
                  } else {
                    textColor = '#444';
                  }
                } else if (isSelected) {
                  borderColor = 'rgba(0,255,153,0.4)';
                  bg = 'rgba(0,255,153,0.05)';
                  textColor = '#00ff99';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={selected !== null}
                    className="w-full text-left p-4 rounded transition-all flex items-center gap-3"
                    style={{ border: `1px solid ${borderColor}`, background: bg, cursor: selected !== null ? 'default' : 'pointer' }}
                  >
                    <span
                      className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-mono font-bold"
                      style={{ background: selected !== null && isCorrect ? 'rgba(0,255,153,0.2)' : 'rgba(255,255,255,0.06)', color: textColor }}
                    >
                      {icon ? <Icon name={icon} size={12} style={{ color: textColor }} /> : (idx + 1)}
                    </span>
                    <span className="text-sm leading-snug font-mono" style={{ color: textColor }}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Пояснение */}
            {showExplain && (
              <div
                className="p-4 rounded mb-4 animate-fade-in"
                style={{
                  background: selected === question.correct ? 'rgba(0,255,153,0.04)' : 'rgba(255,80,80,0.04)',
                  border: `1px solid ${selected === question.correct ? 'rgba(0,255,153,0.2)' : 'rgba(255,80,80,0.2)'}`,
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">
                    {selected === question.correct ? '✅' : '❌'}
                  </span>
                  <div>
                    <div className="text-xs font-bold mb-1" style={{ color: selected === question.correct ? 'var(--neon)' : '#ff5050' }}>
                      {selected === question.correct ? 'Верно!' : 'Неверно'}
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#888' }}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Кнопка Далее */}
            {showExplain && (
              <button
                onClick={handleNext}
                className="cyber-btn-solid w-full py-3.5 animate-fade-in"
              >
                {current + 1 < QUESTIONS.length ? `СЛЕДУЮЩИЙ ВОПРОС →` : 'ПОСМОТРЕТЬ РЕЗУЛЬТАТ →'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── ЭКРАН РЕЗУЛЬТАТА ──
  if (phase === 'result') {
    const isAdvanced = resultLevel === 'advanced';
    const pct = Math.round((score / QUESTIONS.length) * 100);

    // Цвета по результату
    const accentColor = isAdvanced ? '#ff6400' : 'var(--neon)';
    const accentBg = isAdvanced ? 'rgba(255,100,0,0.08)' : 'rgba(0,255,153,0.08)';
    const accentBorder = isAdvanced ? 'rgba(255,100,0,0.25)' : 'rgba(0,255,153,0.25)';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: '#050505' }}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`, filter: 'blur(50px)' }}
        />

        <div className="relative z-10 max-w-lg w-full animate-fade-in">
          {/* Результат */}
          <div
            className="p-8 rounded-lg text-center mb-4"
            style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
          >
            {/* Большой счёт */}
            <div className="text-8xl font-mono font-black mb-1" style={{ color: accentColor, textShadow: `0 0 30px ${accentColor}40` }}>
              {score}
              <span className="text-4xl text-white opacity-30">/{QUESTIONS.length}</span>
            </div>
            <div className="text-sm font-mono mb-4" style={{ color: 'var(--text-dim)' }}>
              правильных ответов — {pct}%
            </div>

            {/* Прогресс-бар результата */}
            <div className="progress-bar mb-6">
              <div
                className="progress-fill transition-all duration-1000"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
                  boxShadow: `0 0 8px ${accentColor}50`,
                }}
              />
            </div>

            {/* Определённый уровень */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg mb-4"
              style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${accentBorder}` }}>
              <span className="text-2xl">{isAdvanced ? '⚡' : '🌱'}</span>
              <div className="text-left">
                <div className="text-xs font-mono mb-0.5" style={{ color: 'var(--text-dim)' }}>ТВОй УРОВЕНЬ</div>
                <div className="text-xl font-display font-bold" style={{ color: accentColor }}>
                  {isAdvanced ? 'ОПЫТНЫЙ' : 'НОВИЧОК'}
                </div>
              </div>
            </div>

            {/* Описание */}
            <p className="text-sm leading-relaxed" style={{ color: '#777' }}>
              {isAdvanced
                ? 'Отличный результат! Тебе открыты задачи по reverse engineering, pwn, форензике и сложным веб-атакам (SSRF, RCE, десериализация).'
                : 'Хорошее начало! Тебе доступны материалы по основам криптографии, веб-уязвимостям, Linux и стеганографии. Шаг за шагом до продвинутого уровня.'}
            </p>
          </div>

          {/* Разбивка по категориям */}
          <div className="p-4 rounded-lg mb-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-mono mb-3 tracking-[0.15em]" style={{ color: 'var(--text-dim)' }}>
              РЕЗУЛЬТАТЫ ПО ТЕМАМ
            </div>
            <div className="space-y-2">
              {QUESTIONS.map((q, i) => {
                const isOk = answers[i] === q.correct;
                const catColor = CAT_COLORS[q.category] || 'var(--neon)';
                return (
                  <div key={q.id} className="flex items-center gap-2.5 text-xs">
                    <span className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${isOk ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}>
                      {isOk
                        ? <Icon name="Check" size={10} style={{ color: '#00ff99' }} />
                        : <Icon name="X" size={10} style={{ color: '#ff5050' }} />
                      }
                    </span>
                    <span className="w-20 flex-shrink-0 truncate" style={{ color: catColor }}>{q.category}</span>
                    <span className="flex-1 truncate" style={{ color: '#555' }}>{q.text.slice(0, 45)}...</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Кнопка */}
          <button
            onClick={handleFinish}
            className="cyber-btn-solid w-full py-4 text-sm tracking-widest"
            style={isAdvanced ? { background: '#ff6400', borderColor: '#ff6400' } : undefined}
          >
            {isAdvanced ? '⚡ ВОЙТИ КАК ОПЫТНЫЙ' : '🌱 ВОЙТИ КАК НОВИЧОК'}
          </button>

          <div className="text-center mt-3 text-xs" style={{ color: '#333' }}>
            Уровень можно изменить в настройках профиля
          </div>
        </div>
      </div>
    );
  }

  return null;
}
