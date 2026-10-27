const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const dependencyMap = {
  web: ['ui', 'tokens'],
  admin: ['ui'],
  ui: ['tokens'],
  tokens: []
};
const nodeNames = { web: 'apps/storefront', admin: 'apps/admin', ui: 'packages/ui', tokens: 'packages/tokens' };

function impactedBy(source) {
  const impacted = new Set([source]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [consumer, dependencies] of Object.entries(dependencyMap)) {
      if (!impacted.has(consumer) && dependencies.some((dependency) => impacted.has(dependency))) {
        impacted.add(consumer);
        changed = true;
      }
    }
  }
  return impacted;
}

function updateGraph(source) {
  const impacted = impactedBy(source);
  $$('.graph-node').forEach((node) => {
    node.classList.toggle('is-selected', node.dataset.node === source);
    node.classList.toggle('is-affected', impacted.has(node.dataset.node));
    node.setAttribute('aria-pressed', String(node.dataset.node === source));
  });
  const consumers = [...impacted].filter((id) => id !== source).map((id) => nodeNames[id]);
  $('#impact-copy').textContent = consumers.length
    ? `${nodeNames[source]} 发生变更；可能受影响：${consumers.join('、')}。实际范围还要结合工具配置与任务依赖。`
    : `${nodeNames[source]} 发生变更；示意图中没有其他消费者，影响范围暂限于自身。`;
  $('#change-source').value = source;
}

$('#change-source').addEventListener('change', (event) => updateGraph(event.target.value));
$$('.graph-node').forEach((node) => node.addEventListener('click', () => updateGraph(node.dataset.node)));
updateGraph('tokens');

const taskRows = $$('.task-row');
let previousRunKey = '';
function resetTasks() {
  previousRunKey = '';
  taskRows.forEach((row) => {
    row.className = 'task-row';
    $('.task-state', row).textContent = '·';
    $('b', row).textContent = '—';
  });
  $('#run-label').textContent = '等待运行';
  $('#run-count').textContent = '选择文件后开始';
}
function runBuild() {
  const source = $('#sim-source').value;
  const impact = new Set(source === 'tokens' ? ['tokens', 'ui', 'web', 'admin'] : source === 'ui' ? ['ui', 'web', 'admin'] : source === 'web' ? ['web'] : source === 'admin' ? ['admin'] : []);
  const runKey = `${source}:v1`;
  const alreadyRan = previousRunKey === runKey;
  let hits = 0;
  let misses = 0;
  taskRows.forEach((row) => {
    const key = row.dataset.task;
    const isAffected = impact.has(key);
    row.className = `task-row ${!isAffected ? 'skip' : alreadyRan ? 'hit' : 'miss'}`;
    $('.task-state', row).textContent = !isAffected ? '–' : alreadyRan ? '✓' : '●';
    $('b', row).textContent = !isAffected ? 'SKIP' : alreadyRan ? 'HIT' : 'RUN';
    if (isAffected) alreadyRan ? hits++ : misses++;
  });
  $('#run-label').textContent = alreadyRan ? '重复运行 · 缓存命中' : source === 'docs' ? '文档变更 · 无应用构建' : '变更影响范围已计算';
  $('#run-count').textContent = alreadyRan ? `${hits} 项缓存命中 · 0 项执行` : `${misses} 项需要执行 · ${taskRows.length - misses} 项跳过`;
  previousRunKey = runKey;
}
$('#run-build').addEventListener('click', runBuild);
$('#reset-build').addEventListener('click', resetTasks);
$('#sim-source').addEventListener('change', resetTasks);

const questions = [
  { category: 'basics', tag: '基础', q: '什么是 Monorepo？它和 Multirepo 的核心差异是什么？', a: 'Monorepo 是在单一版本控制仓库中管理多个项目或 package 的策略。它让跨项目改动、统一工具配置和代码共享更直接，但会增加仓库治理、权限与 CI 编排成本；Multirepo 则以多个仓库隔离项目和权限，跨仓库协作通常更分散。', follow: '不要把 Monorepo 等同于微前端、单体应用或“所有东西都耦合在一起”。' },
  { category: 'basics', tag: '基础', q: '什么时候应该选择 Monorepo？什么时候不适合？', a: '当多个项目由相近团队维护、需要频繁共享代码或原子化跨包变更时，Monorepo 值得考虑。团队边界、权限隔离、仓库体积和 CI 能力同样重要；如果项目无共享需求、访问权限严格分离，或团队无法承担治理成本，多仓库可能更合适。', follow: '结合团队规模、依赖变化频率、发布方式和代码权限说明取舍，而不是给绝对结论。' },
  { category: 'basics', tag: '基础', q: 'Monorepo、微前端和单体应用之间是什么关系？', a: '它们讨论的是不同维度：Monorepo 是代码仓库组织方式；微前端是前端应用拆分与集成的架构方案；单体通常描述应用或服务架构。微前端可以放在 Monorepo，也可以分布在多个仓库；Monorepo 也能包含多个独立部署应用。', follow: '面试时先界定“仓库边界”和“运行时/部署边界”，避免混为一谈。' },
  { category: 'deps', tag: '依赖', q: 'Workspace 是什么？它解决了什么问题？', a: 'Workspace 是包管理器对一个仓库内多个 package 的发现、安装和本地链接能力。应用可通过包名依赖本地共享包，并统一安装依赖。Workspace 本身不自动提供完整的任务编排、变更分析或发布治理。', follow: '举例说明 pnpm-workspace.yaml、Yarn workspaces 或 npm workspaces；具体命令和协议依所用工具而定。' },
  { category: 'deps', tag: '依赖', q: '什么是 hoisting？它可能带来什么问题？', a: 'Hoisting 会把多个 package 共用的依赖提升到更高层级（常见为仓库根目录）安装，以减少重复。风险是某个包可能“碰巧”解析到未在自身 package.json 声明的依赖，形成 phantom dependency；更严格的包管理器链接策略有助于暴露这类问题。', follow: '修复方式通常是让使用者显式声明直接依赖，并在干净安装或 CI 中验证。' },
  { category: 'deps', tag: '边界', q: '如何防止共享包变成新的“大杂烩”？', a: '先定义 package 的职责、公共 API 和允许的依赖方向，再通过 lint 规则、CODEOWNERS、目录约定或 Nx module-boundary 规则执行。共享能力应有明确消费者和所有者，避免应用层反向依赖或跨包访问私有实现。', follow: '可以补充循环依赖检测、API review、变更所有者和依赖图可视化。' },
  { category: 'deps', tag: '版本', q: '工作区内部依赖该怎么声明？workspace:* 有什么意义？', a: '常见做法是用 package name 声明内部依赖，再用 workspace 协议表达“必须解析到当前仓库中的工作区包”。它避免误从 registry 安装同名包，也便于包管理器管理本地链接。发布时协议如何转换要看具体包管理器和版本。', follow: '不要假定 pnpm、Yarn、npm 在所有版本上的发布转换行为完全相同。' },
  { category: 'build', tag: '依赖图', q: 'Nx / Turborepo 的任务图有什么用？', a: '任务图把项目依赖与任务依赖表达为有向图，例如 tokens:build → ui:build → app:build。编排器据此决定执行顺序、并行度和任务缓存；它也能支撑项目依赖分析与 affected 任务筛选。具体图由项目配置、推断规则与工具版本决定。', follow: '说明哪些依赖是项目级、哪些是 task pipeline 级，避免把两张图混为一谈。' },
  { category: 'build', tag: 'CI', q: '如何只构建受变更影响的项目（affected）？', a: '先确定比较基线（例如目标分支或上次成功提交），解析 diff 中的文件属于哪些项目，再沿依赖图找可能受影响的消费者，按任务图执行相关 build/test/lint。根目录配置、锁文件、共享脚本变化可能需要扩大范围，因此规则要显式设计并在 CI 验证。', follow: '重点说清基线提交、文件到项目映射、向上游/下游遍历方向及全局输入处理。' },
  { category: 'build', tag: '缓存', q: '任务缓存通常依据什么判断是否可复用？', a: '常见 cache key 会综合任务命令与参数、源文件、依赖包输入、锁文件、配置文件、环境变量等。输入相同才复用先前输出；命中结果还要能正确恢复任务产物。key 太粗会错误命中，太细则降低命中率。', follow: '说明本地缓存与远程缓存的区别，并考虑远程缓存权限、保留和跨分支策略。' },
  { category: 'build', tag: '缓存', q: '缓存 key 漏掉环境变量或配置会发生什么？', a: '构建可能使用了新配置，却复用了旧输出，形成错误的 cache hit。解决方法是把影响结果的环境变量、配置、编译器版本等加入输入；对秘密值不要直接暴露到日志或公开 cache key，应根据工具能力安全纳入哈希。', follow: '如何定位？对比本地强制重跑与缓存结果、检查任务输入声明并构造最小复现。' },
  { category: 'build', tag: '并行', q: '任务如何安全并行？什么时候不能并行？', a: '依赖图中彼此没有先后约束、也不争用共享资源的任务可以并行；依赖 package 的 build 必须先于消费者任务完成。要考虑内存、CPU、共享输出目录、端口与测试数据冲突，避免并行度超过 CI 机器能力。', follow: '将“有依赖边的任务顺序执行、独立分支可并行”与机器资源预算联系起来。' },
  { category: 'release', tag: 'CI', q: 'Monorepo 的 CI 怎样避免每次跑全仓？', a: '结合可靠的 base/head diff、项目依赖图和任务图，只运行受影响的任务；稳定输入可走本地或远程缓存；无关目录可单独过滤。但要把根配置、锁文件、共享脚本等全局输入纳入影响规则，并保留定期全量验证或兜底策略。', follow: '衡量总时长、缓存命中率和失败定位效率；不要只优化一个数字而牺牲正确性。' },
  { category: 'release', tag: '版本', q: '固定版本和独立版本发布各有什么取舍？', a: '固定版本（fixed/unified）让一组包共享版本号，消费者和跨包兼容管理直观；独立版本（independent）允许各包按需演进，但需要处理多套 changelog、依赖范围和发布批次。选择取决于包之间的耦合、消费者升级方式和团队发布流程。', follow: '可提 changesets 等变更记录工具，但不要声称所有仓库都必须用同一套方案。' },
  { category: 'release', tag: '工具', q: 'pnpm / Yarn 与 Nx / Turborepo 分别负责什么？', a: 'pnpm、Yarn 等主要负责依赖安装、workspace 与包管理；Nx、Turborepo 等偏向项目/任务图、任务执行、缓存和 affected 工作流。能力有交集，也会随版本演进，选型时应对照仓库需求、插件生态、迁移成本和团队熟悉度。', follow: '强调它们不是非此即彼：常见方案是包管理器加任务编排工具组合使用。' }
];

const questionList = $('#question-list');
questions.forEach((item, index) => {
  const card = document.createElement('details');
  card.className = 'question-card';
  card.dataset.category = item.category;
  const summary = document.createElement('summary');
  summary.innerHTML = `<span class="question-num">${String(index + 1).padStart(2, '0')}</span><strong></strong><span class="question-tag"></span>`;
  $('strong', summary).textContent = item.q;
  $('.question-tag', summary).textContent = item.tag;
  const answer = document.createElement('div');
  answer.className = 'answer';
  const body = document.createElement('p');
  body.textContent = item.a;
  const follow = document.createElement('div');
  follow.className = 'follow-up';
  follow.innerHTML = '<b>追问 / 表达提示：</b> ';
  follow.append(document.createTextNode(item.follow));
  answer.append(body, follow);
  card.append(summary, answer);
  questionList.append(card);
});

$$('.filter-chip').forEach((button) => button.addEventListener('click', () => {
  $$('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip === button));
  const filter = button.dataset.filter;
  $$('.question-card').forEach((card) => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
}));

const quiz = [
  { q: '如果 packages/tokens 改了，下列哪个项目最可能也需要重新检查？', options: ['只有 tokens 自己', 'ui、storefront 和 admin', '所有仓库外的服务'], answer: 1, explain: '图中 ui 依赖 tokens，storefront 和 admin 又依赖 ui，因此沿反向依赖可找到这些消费者。真实 affected 结果仍要看工具配置。' },
  { q: '缓存 key 中最不应该遗漏的是什么？', options: ['影响产物的配置与环境输入', '当前用户鼠标位置', '与任务无关的聊天记录'], answer: 0, explain: '只要输入能改变任务输出，就应纳入缓存判定；具体如何安全处理环境变量取决于工具。' },
  { q: '一个 package import 了依赖，但 package.json 没声明，运行时因根目录 hoisting 暂时可用，这最像什么问题？', options: ['树摇优化', '幽灵依赖（phantom dependency）', '代码分割'], answer: 1, explain: '包在依赖未显式声明时碰巧解析成功，容易在严格安装、独立发布或消费者环境中失败。' }
];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;
function renderQuiz() {
  const host = $('#quiz-content');
  if (quizIndex >= quiz.length) {
    host.innerHTML = `<p class="quiz-question">完成！本轮答对 <b>${quizScore} / ${quiz.length}</b>。</p><p class="quiz-feedback">${quizScore === quiz.length ? '概念清晰，可以试着用自己的项目依赖图复述一次。' : '建议回看上方对应章节，再用自己的话解释一遍。'}</p><div class="quiz-footer"><small>题目仅作自测，不代表面试评分。</small><button type="button" id="restart-quiz">再做一遍</button></div>`;
    $('#quiz-count').textContent = 'DONE';
    $('#restart-quiz').addEventListener('click', () => { quizIndex = 0; quizScore = 0; quizAnswered = false; renderQuiz(); });
    return;
  }
  quizAnswered = false;
  const item = quiz[quizIndex];
  $('#quiz-count').textContent = `${String(quizIndex + 1).padStart(2, '0')} / ${String(quiz.length).padStart(2, '0')}`;
  host.innerHTML = `<p class="quiz-question"></p><div class="quiz-options" role="group" aria-label="选择答案"></div><p class="quiz-feedback" aria-live="polite"></p><div class="quiz-footer"><small>选一个最合适的答案，再看解释。</small><button type="button" id="quiz-next" disabled>检查答案 →</button></div>`;
  $('.quiz-question', host).textContent = item.q;
  const options = $('.quiz-options', host);
  item.options.forEach((text, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    $('span:last-child', button).textContent = text;
    button.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const correct = index === item.answer;
      if (correct) quizScore++;
      $$('.quiz-option', options).forEach((option, optionIndex) => {
        option.disabled = true;
        if (optionIndex === item.answer) option.classList.add('correct');
        else if (optionIndex === index) option.classList.add('incorrect');
      });
      $('.quiz-feedback', host).textContent = `${correct ? '答对了。' : '再想想。'} ${item.explain}`;
      $('#quiz-next').disabled = false;
      $('#quiz-next').textContent = quizIndex === quiz.length - 1 ? '查看结果 →' : '下一题 →';
    });
    options.append(button);
  });
  $('#quiz-next').addEventListener('click', () => { if (!quizAnswered) return; quizIndex++; renderQuiz(); });
}
renderQuiz();

const storageKey = 'monorepo-field-guide-progress-v1';
let completed = new Set();
try { completed = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { completed = new Set(); }
function updateProgress() {
  const count = completed.size;
  $('#progress-label').textContent = `${count} / 4`;
  $('#progress-fill').style.width = `${count * 25}%`;
  $$('.complete-button').forEach((button) => {
    const isDone = completed.has(button.dataset.complete);
    button.classList.toggle('is-done', isDone);
    button.innerHTML = isDone ? '已掌握 <span>✓</span>' : '我掌握了 <span>✓</span>';
    const nav = $(`[data-nav="${button.dataset.complete}"]`);
    if (nav) nav.classList.toggle('is-done', isDone);
  });
  try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch { /* Private browsing may disable storage. */ }
}
$$('.complete-button').forEach((button) => button.addEventListener('click', () => {
  const id = button.dataset.complete;
  if (completed.has(id)) completed.delete(id); else completed.add(id);
  updateProgress();
}));
updateProgress();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    $$('.lesson-link').forEach((link) => link.classList.toggle('is-current', link.dataset.nav === visible.target.id));
  }, { rootMargin: '-18% 0px -68% 0px', threshold: [0, .25, .5] });
  $$('.lesson-card').forEach((section) => observer.observe(section));
}
