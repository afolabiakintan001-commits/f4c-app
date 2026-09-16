import React from 'react';

interface Handle {
  id: string;
  platform: 'TikTok' | 'Instagram' | 'X' | 'YouTube';
  handle: string;
  verified: boolean;
}

interface LinkedHandlesProps {
  handles: Handle[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Handle, value: any) => void;
}

export const LinkedHandles: React.FC<LinkedHandlesProps> = ({ handles, onAdd, onRemove, onUpdate }) => {
  return (
    <div className="border border-[#dcdcd7] p-5 bg-white shadow-sm space-y-4">
      <h2 className="text-xs font-bold uppercase border-b border-[#dcdcd7] pb-2 text-gray-800">
        [ LINKED_HANDLES ]
      </h2>

      <div className="space-y-3">
        {handles.map((h) => (
          <div key={h.id} className="flex items-center gap-2">
            <select
              value={h.platform}
              onChange={(e) => onUpdate(h.id, 'platform', e.target.value)}
              className="px-2 py-2 border border-[#dcdcd7] text-xs font-mono bg-white"
            >
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="X">X</option>
              <option value="YouTube">YouTube</option>
            </select>
            <input
              type="text"
              value={h.handle}
              onChange={(e) => onUpdate(h.id, 'handle', e.target.value)}
              className="flex-grow px-3 py-2 border border-[#dcdcd7] text-xs font-mono focus:border-[#0a0a0a] outline-none"
              placeholder="@handle"
            />
            <button
              onClick={() => onRemove(h.id)}
              className="px-3 py-2 text-[10px] border border-[#dcdcd7] font-mono uppercase hover:bg-gray-100"
            >
              [ remove ]
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onAdd}
        className="w-full py-2 border border-[#dcdcd7] text-xs font-mono text-gray-500 hover:border-[#0a0a0a] hover:text-[#0a0a0a]"
      >
        [ + add handle ]
      </button>
    </div>
  );
};
