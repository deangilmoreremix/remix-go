export function registerCustomBlocks(editor) {
  editor.BlockManager.add('video-player', {
    label: 'Video Player',
    content: `<div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
      <video data-gjs-type="video" controls style="position:absolute;top:0;left:0;width:100%;height:100%;"></video>
    </div>`,
    category: 'Video',
    attributes: { class: 'fa fa-play' },
  });

  editor.BlockManager.add('token-text', {
    label: 'Personalized Text',
    content: `<h1 data-token="FIRSTNAME" data-default="there" style="font-size:2rem;font-weight:bold;color:#fff;">
      Hi {{FIRSTNAME}}!
    </h1>`,
    category: 'Personalization',
    attributes: { class: 'fa fa-font' },
  });

  editor.BlockManager.add('token-subtitle', {
    label: 'Personalized Subtitle',
    content: `<p data-token="COMPANY" data-default="your company" style="font-size:1.1rem;color:#ccc;">
      I noticed {{COMPANY}} is doing great work...
    </p>`,
    category: 'Personalization',
    attributes: { class: 'fa fa-paragraph' },
  });

  editor.BlockManager.add('cta-button', {
    label: 'CTA Button',
    content: `<a href="#" class="cta-btn" data-token="cta_url"
      style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
      Book a Demo
    </a>`,
    category: 'Actions',
    attributes: { class: 'fa fa-hand-pointer' },
  });

  editor.BlockManager.add('logo-header', {
    label: 'Logo Header',
    content: `<header style="display:flex;align-items:center;padding:16px;">
      <img src="" alt="Logo" data-token="logo_url" style="max-height:48px;">
    </header>`,
    category: 'Layout',
    attributes: { class: 'fa fa-image' },
  });

  editor.BlockManager.add('dynamic-bg', {
    label: 'Dynamic Background',
    content: `<div class="dynamic-bg" data-token="prospect_website"
      style="width:100%;height:300px;background-size:cover;background-position:center;filter:blur(8px);">
    </div>`,
    category: 'Personalization',
    attributes: { class: 'fa fa-globe' },
  });

  editor.BlockManager.add('lead-form', {
    label: 'Lead Form',
    content: `<form class="lead-form" style="display:flex;flex-direction:column;gap:12px;max-width:400px;">
      <input type="text" placeholder="Your Name" data-token="NAME" style="padding:8px;border:1px solid #ccc;border-radius:4px;">
      <input type="email" placeholder="Your Email" data-token="EMAIL" style="padding:8px;border:1px solid #ccc;border-radius:4px;">
      <button type="submit" style="padding:12px;background:#7c3aed;color:#fff;border:none;border-radius:4px;cursor:pointer;">
        Submit
      </button>
    </form>`,
    category: 'Actions',
    attributes: { class: 'fa fa-envelope' },
  });

  editor.BlockManager.add('section-video', {
    label: 'Video Section',
    content: `<section style="padding:40px 20px;text-align:center;max-width:800px;margin:0 auto;">
      <h1 data-token="FIRSTNAME" style="font-size:2.5rem;font-weight:bold;margin-bottom:16px;color:#fff;">
        Hi {{FIRSTNAME}}!
      </h1>
      <div class="video-wrapper" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;">
        <video data-gjs-type="video" controls style="position:absolute;top:0;left:0;width:100%;height:100%;"></video>
      </div>
    </section>`,
    category: 'Layout',
    attributes: { class: 'fa fa-th-large' },
  });

  editor.BlockManager.add('spacer', {
    label: 'Spacer',
    content: '<div style="height:40px;"></div>',
    category: 'Layout',
    attributes: { class: 'fa fa-arrows-v' },
  });

  editor.BlockManager.add('divider', {
    label: 'Divider',
    content: '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:20px 0;">',
    category: 'Layout',
    attributes: { class: 'fa fa-minus' },
  });
}
