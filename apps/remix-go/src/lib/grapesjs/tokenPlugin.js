export function tokenPlugin(editor) {
  editor.Commands.add('insert-token', {
    run(editor, sender, data) {
      const selected = editor.getSelected();
      if (selected && data && data.token) {
        const comps = selected.components();
        const textComp = comps.length ? comps.models[0] : null;
        const currentText = textComp ? textComp.get('content') : '';
        const tokenStr = `{{${data.token}}}`;
        if (textComp) {
          textComp.set('content', currentText + tokenStr);
        } else {
          selected.append(tokenStr);
        }
        selected.addAttributes({ 'data-token': data.token });
      }
    },
  });

  editor.Panels.addButton('views', {
    id: 'tokens',
    className: 'fa fa-code',
    command: 'open-token-panel',
    attributes: { title: 'Insert Token' },
  });

  editor.Commands.add('open-token-panel', {
    run(editor) {
      const tokens = ['FIRSTNAME', 'LASTNAME', 'NAME', 'EMAIL', 'GENDER', 'GEOCOUNTRY', 'GEOCITY', 'GEOSTATE', 'COMPANY'];
      const existing = document.getElementById('gjs-token-panel');
      if (existing) {
        existing.remove();
        return;
      }

      const panel = document.createElement('div');
      panel.id = 'gjs-token-panel';
      panel.style.cssText = 'position:fixed;top:60px;right:20px;width:220px;background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;z-index:9999;box-shadow:0 8px 32px rgba(0,0,0,0.4);';

      panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Insert Token</span>
          <button id="close-token-panel" style="color:#6b7280;cursor:pointer;background:none;border:none;font-size:16px;">&times;</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;">
          ${tokens.map(t => `
            <button data-token="${t}" style="padding:6px 10px;text-align:left;background:rgba(255,255,255,0.05);border:1px solid transparent;border-radius:4px;color:#d1d5db;font-size:13px;cursor:pointer;">
              {{${t}}}
            </button>
          `).join('')}
        </div>
      `;

      document.body.appendChild(panel);

      panel.querySelector('#close-token-panel').addEventListener('click', () => panel.remove());
      panel.querySelectorAll('[data-token]').forEach(btn => {
        btn.addEventListener('click', () => {
          editor.runCommand('insert-token', { token: btn.dataset.token });
          panel.remove();
        });
      });
    },
  });
}
