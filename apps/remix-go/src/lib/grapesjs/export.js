export function exportPage(editor, tokenValues = {}) {
  let html = editor.getHtml();
  let css = editor.getCss();

  Object.entries(tokenValues).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    html = html.replace(regex, value || '');
  });

  return { html, css };
}

export function exportPageWithTokenSupport(editor) {
  const html = editor.getHtml();
  const css = editor.getCss();

  const tokenScript = `
    <script>
      (function() {
        var params = new URLSearchParams(window.location.search);
        document.querySelectorAll('[data-token]').forEach(function(el) {
          var token = el.getAttribute('data-token');
          var value = params.get(token) || el.getAttribute('data-default') || '';
          if (el.tagName === 'IMG') el.src = value;
          else if (el.tagName === 'A') el.href = value;
          else if (el.tagName === 'VIDEO') el.src = value;
          else {
            el.querySelectorAll('*').forEach(function(child) {
              if (child.children.length === 0) {
                child.textContent = child.textContent.replace('{{' + token + '}}', value);
              }
            });
            el.textContent = el.textContent.replace('{{' + token + '}}', value);
          }
        });
      })();
    </script>
  `;

  const styleTag = css ? `<style>${css}</style>` : '';
  return { html: styleTag + html + tokenScript, css };
}

export function exportAsZip(editor) {
  const html = editor.getHtml();
  const css = editor.getCss();

  const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Landing Page</title>
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    (function() {
      var params = new URLSearchParams(window.location.search);
      document.querySelectorAll('[data-token]').forEach(function(el) {
        var token = el.getAttribute('data-token');
        var value = params.get(token) || el.getAttribute('data-default') || '';
        if (el.tagName === 'IMG') el.src = value;
        else if (el.tagName === 'A') el.href = value;
        else el.textContent = el.textContent.replace('{{' + token + '}}', value);
      });
    })();
  </script>
</body>
</html>`;

  return fullHTML;
}
