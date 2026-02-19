import { ChevronDown, ChevronRight, Folder, FolderOpen, FileCode } from 'lucide-react';

const fileTree = [
  {
    name: 'src',
    type: 'folder' as const,
    expanded: true,
    children: [
      {
        name: 'services',
        type: 'folder' as const,
        expanded: true,
        children: [
          { name: 'AuthService.ts', type: 'file' as const, active: false },
          { name: 'TokenService.ts', type: 'file' as const, active: false },
        ],
      },
      {
        name: '__tests__',
        type: 'folder' as const,
        expanded: true,
        children: [
          { name: 'auth.test.ts', type: 'file' as const, active: true },
          { name: 'token.test.ts', type: 'file' as const, active: false },
        ],
      },
    ],
  },
];

interface FileNode {
  name: string;
  type: 'folder' | 'file';
  expanded?: boolean;
  active?: boolean;
  children?: FileNode[];
}

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const indent = depth * 12;

  if (node.type === 'folder') {
    return (
      <div>
        <div
          className="flex items-center gap-1 py-0.5 cursor-pointer text-[#cccccc] hover:bg-white/5"
          style={{ paddingLeft: `${indent + 4}px` }}
        >
          {node.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {node.expanded ? (
            <FolderOpen size={14} className="text-[#dcb67a]" />
          ) : (
            <Folder size={14} className="text-[#dcb67a]" />
          )}
          <span className="text-xs">{node.name}</span>
        </div>
        {node.expanded && node.children?.map(child => (
          <FileTreeNode key={child.name} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 py-0.5 cursor-pointer text-xs ${
        node.active
          ? 'bg-[#2d2d4d] text-white border-l-2 border-ordino-primary'
          : 'text-[#cccccc] hover:bg-white/5'
      }`}
      style={{ paddingLeft: `${indent + 4 + (node.active ? 14 : 16)}px` }}
    >
      <FileCode size={13} className={node.active ? 'text-ordino-primary' : 'text-[#519aba]'} />
      <span>{node.name}</span>
    </div>
  );
}

export function VSCodeFileExplorer() {
  return (
    <div className="w-44 flex-shrink-0 bg-[#1e1e2e] border-r border-[#333344] overflow-y-auto">
      <div className="px-4 py-2 text-[10px] font-semibold text-[#8888aa] uppercase tracking-wider">
        Explorer
      </div>
      {fileTree.map(node => (
        <FileTreeNode key={node.name} node={node} />
      ))}
    </div>
  );
}
