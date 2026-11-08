(() => {
  const status = document.getElementById('load-status');
  const page = document.getElementById('page-content');
  const searchInput = document.getElementById('search-input');
  const searchStatus = document.getElementById('search-status');
  const topicList = document.getElementById('topic-list');
  const topicNav = document.getElementById('topic-nav');
  const noResults = document.getElementById('no-results');
  const menuToggle = document.getElementById('menu-toggle');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  const esc = (value = '') => String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
  const safeUrl = value => /^https:\/\//i.test(String(value || '')) ? String(value) : '#';
  const external = (href, label, description) => `<div class="source-item"><a class="source-link" href="${esc(safeUrl(href))}" target="_blank" rel="noopener noreferrer">${esc(label)}</a><p>${esc(description)}</p></div>`;

  function renderSourceGroup(label, items, className, note) {
    return `<section class="source-group ${className}"><div class="source-group-title"><span class="source-badge"></span>${esc(label)}<span class="source-note">${esc(note)}</span></div><div class="source-list">${items.map(item => external(item.url, item.title, item.supports)).join('')}</div></section>`;
  }

  function renderTopic(topic, index) {
    const principles = topic.principles.map((item, i) => `<article class="principle"><h4><span>${String(i + 1).padStart(2, '0')}</span>${esc(item.title)}</h4><p>${esc(item.body)}</p></article>`).join('');
    const checklist = topic.checklist.map(item => `<li>${esc(item)}</li>`).join('');
    const searchable = [topic.title, topic.summary, topic.principles.map(x => x.title + ' ' + x.body).join(' '), topic.checklist.join(' '), topic.prompt, topic.official_sources.map(x => x.title + ' ' + x.supports).join(' '), topic.community_sources.map(x => x.title + ' ' + x.supports).join(' ')].join(' ').toLowerCase();
    return `<article class="topic-card" id="topic-${esc(topic.id)}" data-topic-id="${esc(topic.id)}" data-search="${esc(searchable)}">
      <header class="topic-header"><span class="topic-number">${String(index + 1).padStart(2, '0')}</span><div class="topic-title-wrap"><p class="topic-category">${esc(topic.category)}</p><h3 class="topic-title">${esc(topic.title)}</h3><p class="topic-summary">${esc(topic.summary)}</p></div></header>
      <div class="topic-body">
        <section aria-label="实操方法"><h3>把结果做得更可控</h3><div class="principle-grid">${principles}</div></section>
        <section class="topic-subsection" aria-label="可复制提示词"><div class="topic-subsection-heading"><h3>可复制提示词</h3><span>把方括号内容换成你的项目资料</span></div><details class="prompt-details"><summary>展开这条提示词<span class="sr-only">，包含可复制模板</span></summary><div class="prompt-detail-content"><div class="prompt-toolbar"><button class="copy-button" type="button" data-copy="prompt-${esc(topic.id)}"><span class="copy-icon" aria-hidden="true"></span><span>复制提示词</span></button></div><pre class="prompt-text" id="prompt-${esc(topic.id)}">${esc(topic.prompt)}</pre></div></details></section>
        <section class="topic-subsection" aria-label="验收清单"><div class="topic-subsection-heading"><h3>交付前检查</h3><span>实际项目仍需人工复核</span></div><ul class="checklist">${checklist}</ul></section>
        <section class="topic-subsection" aria-label="参考来源"><div class="topic-subsection-heading"><h3>延伸来源</h3><span>规范和经验分开阅读</span></div><div class="source-groups">${renderSourceGroup('官方资料 / 标准', topic.official_sources, 'official', '平台依据')}${renderSourceGroup('社区经验', topic.community_sources, 'community', '非强制规范')}</div></section>
        ${topic.caveat ? `<aside class="caveat"><span class="caveat-mark" aria-hidden="true">!</span><p>${esc(topic.caveat)}</p></aside>` : ''}
      </div>
    </article>`;
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value || '';
  }

  function closeMenu(restoreFocus = false) {
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', '打开目录');
    if (restoreFocus) menuToggle.focus();
  }

  function setupSearch() {
    const cards = [...document.querySelectorAll('.topic-card')];
    const links = [...document.querySelectorAll('.topic-nav-link')];
    const filter = () => {
      const query = searchInput.value.trim().toLowerCase();
      let count = 0;
      cards.forEach(card => {
        const visible = !query || card.dataset.search.includes(query);
        card.hidden = !visible;
        const link = links.find(a => a.getAttribute('href') === `#${card.id}`);
        if (link) link.hidden = !visible;
        if (visible) count += 1;
      });
      noResults.hidden = count !== 0;
      searchStatus.textContent = !query ? '' : `找到 ${count} 个主题 · 搜索范围包括方法、检查项和来源`;
    };
    searchInput.addEventListener('input', filter);
    document.addEventListener('keydown', event => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        event.preventDefault();
        searchInput.focus();
      }
      if (event.key === 'Escape') {
        if (document.body.classList.contains('menu-open')) closeMenu(true);
        if (document.activeElement === searchInput && searchInput.value) {
          searchInput.value = '';
          filter();
        }
      }
    });
  }

  function setupScrollSpy() {
    const links = [...document.querySelectorAll('.nav-link, .topic-nav-link')];
    const targets = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
    }, {rootMargin: '-18% 0px -70% 0px', threshold: [0, .1, .35]});
    targets.forEach(target => observer.observe(target));
  }

  async function copyText(id, button) {
    const target = document.getElementById(id);
    if (!target) return;
    const text = target.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        document.execCommand('copy');
        area.remove();
      }
      const label = button.querySelector('span:last-child');
      const old = label.textContent;
      label.textContent = '已复制';
      button.setAttribute('aria-label', '已复制到剪贴板');
      window.setTimeout(() => { label.textContent = old; button.removeAttribute('aria-label'); }, 1700);
    } catch (_) {
      const label = button.querySelector('span:last-child');
      label.textContent = '请手动选择复制';
    }
  }

  function setupInteractions() {
    menuToggle.addEventListener('click', () => {
      const open = !document.body.classList.contains('menu-open');
      document.body.classList.toggle('menu-open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? '关闭目录' : '打开目录');
      if (open) {
        const firstLink = document.querySelector('#sidebar a');
        if (firstLink) firstLink.focus();
      }
    });
    drawerBackdrop.addEventListener('click', () => closeMenu(true));
    document.querySelectorAll('.side-nav a, .brand, .mobile-top-link').forEach(link => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-copy]');
      if (button) copyText(button.dataset.copy, button);
    });
  }

  function render(data) {
    document.title = `${data.meta.title} · LinrStudio`;
    setText('hero-kicker', data.meta.kicker);
    setText('page-title', data.meta.title);
    setText('hero-lead', data.meta.lead);
    setText('hero-note', data.meta.note);
    setText('updated-date', data.meta.updated);
    setText('footer-updated', `最近整理：${data.meta.updated}`);
    document.getElementById('hero-badges').innerHTML = data.meta.badges.map(text => `<span class="hero-badge">${esc(text)}</span>`).join('');

    setText('workflow-title', data.workflow.title);
    setText('workflow-intro', data.workflow.intro);
    setText('workflow-note', data.workflow.note);
    document.getElementById('workflow-grid').innerHTML = data.workflow.steps.map((step, i) => `<article class="workflow-card"><div class="workflow-number"><span>${String(i + 1).padStart(2, '0')}</span><span aria-hidden="true">↗</span></div><h3>${esc(step.title)}</h3><p>${esc(step.body)}</p></article>`).join('');

    setText('base-prompt-title', data.base_prompt.title);
    setText('base-prompt-intro', data.base_prompt.intro);
    setText('base-prompt-text', data.base_prompt.text);
    setText('topics-title', data.topics_title);
    setText('topics-intro', data.topics_intro);
    topicList.innerHTML = data.topics.map(renderTopic).join('');
    topicNav.innerHTML = data.topics.map((topic, i) => `<a class="topic-nav-link" href="#topic-${esc(topic.id)}"><span class="topic-nav-num">${String(i + 1).padStart(2, '0')}</span><span>${esc(topic.title)}</span></a>`).join('');

    setText('sources-title', data.sources.title);
    setText('sources-intro', data.sources.intro);
    document.getElementById('source-explainer').innerHTML = `<article class="explainer-card official-explainer"><div class="explainer-top"><span class="source-badge"></span><h3>${esc(data.sources.official_title)}</h3></div><p>${esc(data.sources.official_text)}</p></article><article class="explainer-card community-explainer"><div class="explainer-top"><span class="source-badge"></span><h3>${esc(data.sources.community_title)}</h3></div><p>${esc(data.sources.community_text)}</p></article>`;
    setText('updates-title', data.updates.title);
    setText('updates-intro', data.updates.intro);
    document.getElementById('update-list').innerHTML = data.updates.entries.map(entry => `<article class="update-entry"><time class="update-date">${esc(entry.date)}</time><p>${esc(entry.text)}</p></article>`).join('');
    setText('maintain-title', data.maintenance.title);
    setText('maintain-text', data.maintenance.text);
    document.getElementById('maintain-steps').innerHTML = data.maintenance.steps.map(step => `<li>${esc(step)}</li>`).join('');

    status.hidden = true;
    page.hidden = false;
    setupSearch();
    setupScrollSpy();
    setupInteractions();
  }

  fetch('./content.json', {cache: 'no-cache'})
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch(() => { status.textContent = '知识库暂时无法载入，请稍后刷新页面。'; status.classList.add('load-error'); });
})();
