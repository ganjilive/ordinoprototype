import { useState } from 'react';
import { VSCodeActivityBar } from './vscode/VSCodeActivityBar';
import { VSCodeFileExplorer } from './vscode/VSCodeFileExplorer';
import { VSCodeEditor } from './vscode/VSCodeEditor';
import { VSCodeExtensionPanel } from './vscode/VSCodeExtensionPanel';
import { vscodeCoverage, vscodeLines, vscodeKeywordResponses, vscodeSuggestedPrompts } from '../../data/vscodeMockData';

export function VSCodeDemoComponent() {
  const [activePanel, setActivePanel] = useState('explorer');

  return (
    <div className="h-[calc(100vh-140px)] flex bg-[#1e1e2e] rounded-xl border border-[#333344] overflow-hidden">
      {/* Activity bar */}
      <VSCodeActivityBar activePanel={activePanel} onPanelChange={setActivePanel} />

      {/* File explorer */}
      <VSCodeFileExplorer />

      {/* Code editor */}
      <VSCodeEditor lines={vscodeLines} fileName="auth.test.ts" />

      {/* Ordino extension panel */}
      <VSCodeExtensionPanel
        coverage={vscodeCoverage}
        responses={vscodeKeywordResponses}
        suggestedPrompts={vscodeSuggestedPrompts}
      />
    </div>
  );
}
