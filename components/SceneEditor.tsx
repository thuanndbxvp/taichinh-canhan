import React, { useState } from 'react';
import type { Scene, SceneKind } from '../src/domain/Scene';
import type { UseSceneEditorReturn } from '../src/features/scenes/useSceneEditor';
import type { UseClaimsReturn } from '../src/features/claims/useClaims';

interface SceneEditorProps {
  editor: UseSceneEditorReturn;
  claims: UseClaimsReturn;
}

const SCENE_KINDS: SceneKind[] = [
  'hook',
  'context',
  'analysis',
  'scenario',
  'solution',
  'takeaway',
  'cta',
  'disclaimer',
];

export const SceneEditor: React.FC<SceneEditorProps> = ({ editor, claims }) => {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);

  const selectedScene: Scene | null =
    editor.scenes.find((s) => s.id === selectedSceneId) ?? null;

  const handleAdd = async (kind: SceneKind) => {
    await editor.addScene(kind);
  };

  const updateField = async (field: keyof Scene, value: unknown) => {
    if (!selectedScene) return;
    await editor.updateScene(selectedScene.id, { [field]: value } as Partial<Scene>);
  };

  return (
    <div className="scene-editor">
      <h3>Scene Editor</h3>
      <div className="scene-list">
        {SCENE_KINDS.map((k) => (
          <button key={k} type="button" onClick={() => handleAdd(k)}>
            + {k}
          </button>
        ))}
      </div>
      <ul>
        {editor.scenes.map((s) => (
          <li
            key={s.id}
            className={s.id === selectedSceneId ? 'selected' : ''}
            onClick={() => setSelectedSceneId(s.id)}
          >
            #{s.order} [{s.kind}] {s.title || '(chưa đặt tiêu đề)'}
            <button type="button" onClick={(e) => {
              e.stopPropagation();
              void editor.deleteScene(s.id);
            }}>Xoá</button>
          </li>
        ))}
      </ul>
      {selectedScene && (
        <div className="scene-edit-form">
          <input
            placeholder="Tiêu đề scene"
            value={selectedScene.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
          <textarea
            placeholder="Narration"
            value={selectedScene.narration}
            onChange={(e) => updateField('narration', e.target.value)}
          />
          <input
            placeholder="Visual notes"
            value={selectedScene.visualNotes}
            onChange={(e) => updateField('visualNotes', e.target.value)}
          />
          <input
            placeholder="Audio notes"
            value={selectedScene.audioNotes}
            onChange={(e) => updateField('audioNotes', e.target.value)}
          />
          <input
            placeholder="On-screen text"
            value={selectedScene.onScreenText}
            onChange={(e) => updateField('onScreenText', e.target.value)}
          />
          <div className="claim-linker">
            <label>Liên kết claims:</label>
            {claims.claims.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  checked={selectedScene.claimIds.includes(c.id)}
                  onChange={() => {
                    if (selectedScene.claimIds.includes(c.id)) {
                      void editor.unlinkClaim(selectedScene.id, c.id);
                    } else {
                      void editor.linkClaim(selectedScene.id, c.id);
                    }
                  }}
                />
                {c.text.slice(0, 30)}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};