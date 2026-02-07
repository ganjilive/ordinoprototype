import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      {/* Colorful Spiral Logo */}
      <motion.svg
        width={icon}
        height={icon}
        viewBox="0 0 100 100"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {/* Orange spiral arm */}
        <motion.path
          d="M50 10 Q80 20 85 50 Q80 75 50 85"
          fill="none"
          stroke="#f97316"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Blue spiral arm */}
        <motion.path
          d="M50 10 Q20 20 15 50 Q20 75 50 85"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Green spiral arm */}
        <motion.path
          d="M10 50 Q20 30 50 25 Q75 30 85 50"
          fill="none"
          stroke="#22c55e"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Purple center */}
        <circle cx="50" cy="50" r="12" fill="#8b5cf6" />
      </motion.svg>

      {showText && (
        <span className={`font-bold ${text} text-ordino-text`}>
          Ordino<span className="text-ordino-primary">AI</span>
        </span>
      )}
    </div>
  );
}
