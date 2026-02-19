import type { VSCodeLine } from '../../../types';
import { cn } from '../../../utils/helpers';

interface VSCodeEditorProps {
  lines: VSCodeLine[];
  fileName: string;
}

export function VSCodeEditor({ lines, fileName }: VSCodeEditorProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e2e] overflow-hidden min-w-0">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#333344] bg-[#252535] flex-shrink-0">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] border-r border-[#333344] text-xs text-white">
          <span className="text-[#519aba]">TS</span>
          <span>{fileName}</span>
          <div className="w-1.5 h-1.5 rounded-full bg-ordino-primary ml-1" title="Coverage warnings" />
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-auto font-mono text-xs leading-5">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 text-right pr-3 pt-2 pb-2 select-none bg-[#1e1e2e]">
            {lines.map(line => (
              <div
                key={line.lineNumber}
                className="h-5 text-[#858585] px-3 flex items-center justify-end"
              >
                {line.lineNumber}
              </div>
            ))}
          </div>

          {/* Coverage gutter (4px colored strip) */}
          <div className="flex-shrink-0 w-1.5 pt-2 pb-2 bg-[#1e1e2e]">
            {lines.map(line => (
              <div key={line.lineNumber} className="h-5 flex items-center">
                <div
                  className={cn('w-1.5 h-full', {
                    'bg-green-500/70': line.coverageStatus === 'covered',
                    'bg-red-500/70': line.coverageStatus === 'uncovered',
                    'bg-yellow-500/70': line.coverageStatus === 'partial',
                    'bg-transparent': line.coverageStatus === 'none',
                  })}
                />
              </div>
            ))}
          </div>

          {/* Code lines */}
          <div className="flex-1 pt-2 pb-2 pl-4 overflow-x-auto">
            {lines.map(line => (
              <div
                key={line.lineNumber}
                className={cn('h-5 flex items-center whitespace-pre', {
                  'bg-red-500/5': line.coverageStatus === 'uncovered',
                  'bg-yellow-500/5': line.coverageStatus === 'partial',
                })}
              >
                {line.tokens.map((token, i) => (
                  <span key={i} style={{ color: token.color }}>
                    {token.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1 bg-[#007acc] text-white text-xs flex-shrink-0">
        <span>TypeScript</span>
        <span>UTF-8</span>
        <span className="ml-auto flex items-center gap-3">
          <span className="text-yellow-300">⚠ 3 uncovered regions</span>
          <span>Coverage: 64.3%</span>
        </span>
      </div>
    </div>
  );
}
