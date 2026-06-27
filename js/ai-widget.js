/* ====================================================
   ai-widget.js — Premium Floating AI Decor Assistant
   Designed by ZephyrDevs for FreeStyle Decorators
   ==================================================== */
'use strict';

(function() {
  // Inject widget CSS styles
  const styles = `
    /* Floating Toggle Button */
    .ai-widget-fab {
      position: fixed;
      bottom: 2rem;
      left: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #b8986c, #e8c84a);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #fff;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 24px rgba(184, 152, 108, 0.3);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .ai-widget-fab:hover {
      transform: scale(1.1) translateY(-3px) rotate(15deg);
      box-shadow: 0 8px 36px rgba(184, 152, 108, 0.45);
    }
    .ai-widget-fab .fab-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px dashed rgba(232, 200, 74, 0.5);
      animation: fabPulseRotate 8s linear infinite;
      pointer-events: none;
    }
    @keyframes fabPulseRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Tooltip */
    .ai-widget-tooltip {
      position: absolute;
      left: 70px;
      bottom: 15px;
      background: rgba(11, 10, 9, 0.95);
      border: 1px solid rgba(255,255,255,0.08);
      padding: 0.45rem 0.95rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      color: #e8c84a;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateX(-10px);
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }
    .ai-widget-fab:hover .ai-widget-tooltip {
      opacity: 1;
      transform: translateX(0);
    }

    /* Main Chat Panel Container */
    .ai-widget-panel {
      position: fixed;
      bottom: 6rem;
      left: 2rem;
      width: 380px;
      height: 540px;
      background: rgba(11, 10, 9, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      box-shadow: 0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(184,152,108,0.1);
      z-index: 9998;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      opacity: 0;
      transform: scale(0.9) translateY(20px);
      transform-origin: bottom left;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: none;
    }
    .ai-widget-panel.open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
    }

    /* Header */
    .ai-panel-header {
      padding: 1.15rem 1.35rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.02);
    }
    .ai-header-meta {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .ai-header-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #b8986c, #d8b788);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      box-shadow: 0 0 12px rgba(184, 152, 108, 0.3);
      position: relative;
    }
    .ai-header-status {
      width: 9px;
      height: 9px;
      background: #2ecc71;
      border: 2px solid #0b0a09;
      border-radius: 50%;
      position: absolute;
      bottom: 0;
      right: 0;
      animation: aiStatusPulse 2s infinite;
    }
    @keyframes aiStatusPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.25); }
    }
    .ai-header-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #f0eaff;
      letter-spacing: 0.02em;
    }
    .ai-header-sub {
      font-size: 0.72rem;
      color: rgba(240,234,255,0.5);
    }
    .ai-close-btn {
      background: none;
      border: none;
      color: rgba(240,234,255,0.4);
      font-size: 1rem;
      cursor: pointer;
      padding: 0.2rem;
      transition: color 0.2s;
    }
    .ai-close-btn:hover {
      color: #e8c84a;
    }

    /* Tabs Selector */
    .ai-panel-tabs {
      display: flex;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ai-tab-btn {
      flex: 1;
      background: none;
      border: none;
      padding: 0.75rem 0;
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(240,234,255,0.5);
      cursor: pointer;
      transition: all 0.25s;
      text-align: center;
      position: relative;
    }
    .ai-tab-btn:hover {
      color: rgba(240,234,255,0.85);
    }
    .ai-tab-btn.active {
      color: #e8c84a;
    }
    .ai-tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: 0; left: 20%; right: 20%;
      height: 2px;
      background: #e8c84a;
      border-radius: 2px;
    }

    /* Panel Content Areas */
    .ai-panel-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .ai-content-section {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding: 1.25rem;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }
    .ai-content-section.active {
      opacity: 1;
      visibility: visible;
      z-index: 1;
    }

    /* Messages & Bubbles */
    .ai-chat-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding-bottom: 1rem;
    }
    .ai-msg {
      max-width: 82%;
      padding: 0.8rem 1rem;
      border-radius: 16px;
      font-size: 0.84rem;
      line-height: 1.5;
      position: relative;
      animation: aiMsgIn 0.3s cubic-bezier(0,0,0.2,1) both;
    }
    @keyframes aiMsgIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .ai-msg.ai-msg-bot {
      background: rgba(255, 255, 255, 0.035);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-top-left-radius: 3px;
      color: #f0eaff;
      align-self: flex-start;
    }
    .ai-msg.ai-msg-user {
      background: linear-gradient(135deg, #b8986c, #8f734f);
      border-top-right-radius: 3px;
      color: #fff;
      align-self: flex-end;
      box-shadow: 0 4px 15px rgba(184, 152, 108, 0.15);
    }
    .ai-msg-meta {
      font-size: 0.65rem;
      color: rgba(240,234,255,0.3);
      margin-top: 0.35rem;
      text-align: right;
    }
    .ai-msg-user .ai-msg-meta {
      color: rgba(255, 255, 255, 0.45);
    }

    /* Choice Chips */
    .ai-chips-box {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.5rem;
    }
    .ai-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(240,234,255,0.7);
      padding: 0.35rem 0.8rem;
      border-radius: 50px;
      font-size: 0.76rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ai-chip:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: #d8b788;
      color: #fff;
      transform: translateY(-1px);
    }

    /* Input Footer */
    .ai-chat-footer {
      padding: 0.95rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.06);
      display: flex;
      gap: 0.55rem;
      background: rgba(255, 255, 255, 0.01);
    }
    .ai-chat-input {
      flex: 1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 0.65rem 0.95rem;
      color: #fff;
      font-size: 0.82rem;
      outline: none;
      transition: all 0.25s;
    }
    .ai-chat-input:focus {
      border-color: #d8b788;
      background: rgba(255, 255, 255, 0.05);
    }
    .ai-chat-send {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #e8c84a, #c8a820);
      border: none;
      color: #2f2010;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ai-chat-send:hover {
      transform: scale(1.05);
      box-shadow: 0 0 15px rgba(232, 200, 74, 0.3);
    }

    /* Typing indicators */
    .ai-typing {
      display: inline-flex;
      gap: 3px;
      padding: 0.5rem 0.75rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 12px;
      align-self: flex-start;
    }
    .ai-dot {
      width: 5px; height: 5px;
      background: rgba(240,234,255,0.3);
      border-radius: 50%;
      animation: aiDotBounce 1.4s infinite ease-in-out;
    }
    .ai-dot:nth-child(1) { animation-delay: 0s; }
    .ai-dot:nth-child(2) { animation-delay: 0.2s; }
    .ai-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes aiDotBounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }

    /* Design Details Card */
    .ai-design-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(184, 152, 108, 0.25);
      border-radius: 12px;
      padding: 1rem;
      margin-top: 0.5rem;
    }
    .ai-design-title {
      font-family: 'Playfair Display', serif;
      font-weight: 700;
      color: #e8c84a;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 0.35rem;
      margin-bottom: 0.6rem;
      font-size: 0.85rem;
    }
    .ai-design-row {
      display: flex;
      margin-bottom: 0.4rem;
      font-size: 0.78rem;
    }
    .ai-design-lbl {
      width: 95px;
      color: rgba(240,234,255,0.4);
      flex-shrink: 0;
    }
    .ai-design-val {
      color: rgba(240,234,255,0.85);
    }

    /* Calculator styles */
    .ai-form-group {
      margin-bottom: 1rem;
    }
    .ai-form-group label {
      display: block;
      font-size: 0.74rem;
      color: rgba(240,234,255,0.5);
      margin-bottom: 0.35rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ai-select, .ai-number {
      width: 100%;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 0.55rem 0.75rem;
      color: #fff;
      font-size: 0.82rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .ai-select:focus, .ai-number:focus {
      border-color: #d8b788;
    }
    .ai-calc-box {
      background: rgba(255,255,255,0.02);
      border: 1px solid rgba(255,255,255,0.05);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-top: 1.25rem;
    }
    .ai-calc-title {
      font-size: 0.68rem;
      color: rgba(240,234,255,0.4);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .ai-calc-val {
      font-family: 'Playfair Display', serif;
      font-size: 1.55rem;
      font-weight: 700;
      color: #d8b788;
      margin-top: 0.15rem;
    }

    /* Colors tab styles */
    .ai-color-circles {
      display: flex;
      gap: 0.4rem;
      margin-top: 0.75rem;
    }
    .ai-color-circle {
      width: 28px; height: 28px;
      border-radius: 50%;
      border: 1.5px solid rgba(255,255,255,0.2);
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }

    /* Small Screen Responsive Layout */
    @media (max-width: 480px) {
      .ai-widget-panel {
        bottom: 0; left: 0; right: 0;
        width: 100vw;
        height: 100%;
        border-radius: 0;
        border: none;
        max-height: 100vh;
        z-index: 100000;
      }
      .ai-widget-fab {
        z-index: 100001;
      }
    }
  `;

  // Insert Styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Widget State
  let widgetState = {
    step: 'event', // event -> color -> location -> budget -> finished
    event: '',
    color: '',
    location: '',
    budget: ''
  };

  // Color Presets Data
  const colorPresets = {
    luxury: {
      colors: ['#e8c84a', '#0b0a09', '#c0c0c0'],
      desc: '<strong>Luxury Royal Theme:</strong> Shimmering Chrome Gold combined with Matte Black and highlights of Chrome Silver. Perfect for premium evening parties and milestone events.'
    },
    romantic: {
      colors: ['#ffb7c5', '#ffffff', '#e8c84a'],
      desc: '<strong>Sweet Romance Theme:</strong> Soft Pastel Pink and Matte White with Rose Gold highlights. Ideal for anniversaries, baby showers, and kids\' first birthdays.'
    },
    festive: {
      colors: ['#b8986c', '#e8c84a', '#d8b788'],
      desc: '<strong>Vibrant Celebration Theme:</strong> Chrome Purple, Glossy Gold, and Pastel Pink clusters. Highly dynamic, great for Mehndi events, sangeet setups, and colorful home parties.'
    },
    corporate: {
      colors: ['#1e3799', '#c0c0c0', '#ffffff'],
      desc: '<strong>Sleek Corporate Theme:</strong> Deep Royal Blue, metallic Chrome Silver, and Matte White. Curated for office launches, opening events, and ceremonies.'
    },
    organic: {
      colors: ['#556b2f', '#f5f5dc', '#ffffff'],
      desc: '<strong>Earthy Organic Theme:</strong> Matte Sage/Eucalyptus Green, Sand Beige, and soft Off-White. Offers a modern boutique visual, highly popular for terrace and garden themes.'
    }
  };

  // Inject HTML structure into DOM
  const wrapper = document.createElement('div');
  wrapper.id = 'aiWidgetWrapper';
  wrapper.innerHTML = `
    <!-- Floating Action Button -->
    <div class="ai-widget-fab" id="aiWidgetToggle" role="button" aria-label="Toggle FreeStyle AI Planner">
      ✨
      <div class="fab-pulse"></div>
      <div class="ai-widget-tooltip">Ask FreeStyle AI</div>
    </div>

    <!-- Chat Drawer Panel -->
    <div class="ai-widget-panel" id="aiWidgetPanel">
      <div class="ai-panel-header">
        <div class="ai-header-meta">
          <div class="ai-header-avatar">
            🎈
            <div class="ai-header-status"></div>
          </div>
          <div>
            <div class="ai-header-title">FreeStyle AI</div>
            <div class="ai-header-sub">Decor Design Assistant</div>
          </div>
        </div>
        <button class="ai-close-btn" id="aiPanelClose" aria-label="Close panel">✕</button>
      </div>

      <!-- Navigation Tabs -->
      <div class="ai-panel-tabs">
        <button class="ai-tab-btn active" data-target="secChat">💬 Chat</button>
        <button class="ai-tab-btn" data-target="secCalc">🎈 Calculator</button>
        <button class="ai-tab-btn" data-target="secColors">🎨 Colors</button>
      </div>

      <div class="ai-panel-body">
        
        <!-- SECTION 1: CHAT -->
        <div class="ai-content-section active" id="secChat">
          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="ai-msg ai-msg-bot">
              Hello! I'm <strong>FreeStyle AI</strong>, your virtual balloon designer. Let's design a custom decoration layout for your event in Patna. 🎈
              <br/><br/>
              To get started, <strong>what occasion are we planning?</strong>
              <div class="ai-chips-box">
                <button class="ai-chip" data-chip="🎂 Birthday Party">🎂 Birthday Party</button>
                <button class="chip ai-chip" data-chip="💍 Wedding Stage">💍 Wedding Stage</button>
                <button class="chip ai-chip" data-chip="❤️ Anniversary">❤️ Anniversary</button>
                <button class="chip ai-chip" data-chip="🌸 Mehndi / Sangeet">🌸 Mehndi / Sangeet</button>
                <button class="chip ai-chip" data-chip="🎓 College Celebration">🎓 College Celebration</button>
              </div>
              <div class="ai-msg-meta">FreeStyle AI</div>
            </div>
          </div>
          
          <div class="ai-typing" id="aiTypingIndicator" style="display:none; margin-bottom:0.75rem;">
            <div class="ai-dot"></div>
            <div class="ai-dot"></div>
            <div class="ai-dot"></div>
          </div>

          <div style="flex-shrink:0; display:flex; gap:0.4rem; padding-top:0.5rem;">
            <button class="btn btn-ghost" id="aiResetBtn" style="padding:0.4rem 0.8rem; font-size:0.72rem; border-radius:6px; flex:1; justify-content:center;">🔄 Restart Chat</button>
          </div>
        </div>

        <!-- SECTION 2: CALCULATOR -->
        <div class="ai-content-section" id="secCalc">
          <div class="ai-form-group">
            <label for="aiCalcMode">Calculation Mode</label>
            <select id="aiCalcMode" class="ai-select">
              <option value="room">Entire Room Wall / Backdrop Area</option>
              <option value="arch">Single Arch / Balloon Garland</option>
            </select>
          </div>
          
          <div id="aiRoomInputs">
            <div class="ai-form-group">
              <label for="aiWidth">Wall Width (Feet)</label>
              <input type="number" id="aiWidth" class="ai-number" value="12" min="5" max="50"/>
            </div>
            <div class="ai-form-group">
              <label for="aiHeight">Wall Height (Feet)</label>
              <input type="number" id="aiHeight" class="ai-number" value="10" min="5" max="30"/>
            </div>
          </div>

          <div id="aiArchInputs" style="display:none;">
            <div class="ai-form-group">
              <label for="aiArchLen">Garland / Arch Length (Feet)</label>
              <input type="number" id="aiArchLen" class="ai-number" value="15" min="2" max="100"/>
            </div>
          </div>

          <div class="ai-calc-box">
            <div class="ai-calc-title">Est. Balloon Count</div>
            <div class="ai-calc-val" id="aiCalcValResult">220 - 260 pcs</div>
            <div style="font-size: 0.65rem; color: rgba(240,234,255,0.35); margin-top: 0.35rem; line-height: 1.3;">Based on standard 10-inch latex balloons with medium-density organic cluster arrangement.</div>
          </div>
        </div>

        <!-- SECTION 3: COLORS -->
        <div class="ai-content-section" id="secColors">
          <div class="ai-form-group">
            <label for="aiPresetSelect">Vibe Theme Preset</label>
            <select id="aiPresetSelect" class="ai-select">
              <option value="luxury">Luxury Royal (Gold, Black, Silver)</option>
              <option value="romantic">Sweet Romance (Pastel Pink, White, Rose Gold)</option>
              <option value="festive">Vibrant Celebration (Chrome Purple, Gold, Pink)</option>
              <option value="corporate">Sleek Corporate (Royal Blue, Chrome Silver, White)</option>
              <option value="organic">Earthy Organic (Eucalyptus Green, Sand, Off-White)</option>
            </select>
          </div>

          <div style="margin-top:1.25rem;">
            <div style="font-size: 0.68rem; color: rgba(240,234,255,0.4); text-transform: uppercase; letter-spacing: 0.05em;">Palette Preview</div>
            <div class="ai-color-circles" id="aiColorCircleContainer"></div>
            <p id="aiPaletteDescriptionText" style="font-size: 0.78rem; color: rgba(240,234,255,0.65); margin-top: 0.85rem; line-height: 1.45;"></p>
          </div>
        </div>

      </div>

      <!-- Footer input panel (only for chat) -->
      <form class="ai-chat-footer" id="aiChatInputForm">
        <input type="text" id="aiChatInputText" class="ai-chat-input" placeholder="Ask something or reply..." autocomplete="off"/>
        <button type="submit" class="ai-chat-send" aria-label="Send">➔</button>
      </form>
    </div>
  `;

  document.body.appendChild(wrapper);

  // Selector cache
  const fab = document.getElementById('aiWidgetToggle');
  const panel = document.getElementById('aiWidgetPanel');
  const closeBtn = document.getElementById('aiPanelClose');
  const chatMessages = document.getElementById('aiChatMessages');
  const chatInputForm = document.getElementById('aiChatInputForm');
  const chatInputText = document.getElementById('aiChatInputText');
  const typingIndicator = document.getElementById('aiTypingIndicator');
  const resetBtn = document.getElementById('aiResetBtn');

  // Toggle Panel open/close
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Tab switching
  const tabBtns = document.querySelectorAll('.ai-tab-btn');
  const contentSecs = document.querySelectorAll('.ai-content-section');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Deactivate all
      tabBtns.forEach(b => b.classList.remove('active'));
      contentSecs.forEach(s => s.classList.remove('active'));
      
      // Activate clicked
      btn.classList.add('active');
      const target = btn.dataset.target;
      document.getElementById(target).classList.add('active');

      // Hide or show bottom input bar
      if (target === 'secChat') {
        chatInputForm.style.display = 'flex';
      } else {
        chatInputForm.style.display = 'none';
      }
    });
  });

  // Calculator Logic
  const calcMode = document.getElementById('aiCalcMode');
  const roomInputs = document.getElementById('aiRoomInputs');
  const archInputs = document.getElementById('aiArchInputs');
  const widthVal = document.getElementById('aiWidth');
  const heightVal = document.getElementById('aiHeight');
  const archVal = document.getElementById('aiArchLen');
  const calcResult = document.getElementById('aiCalcValResult');

  function calculateBalloons() {
    const mode = calcMode.value;
    if (mode === 'room') {
      const w = parseFloat(widthVal.value) || 12;
      const h = parseFloat(heightVal.value) || 10;
      const base = Math.round(w * h * 1.8);
      calcResult.textContent = `${Math.round(base * 0.9)} - ${Math.round(base * 1.1)} pcs`;
    } else {
      const len = parseFloat(archVal.value) || 15;
      const base = Math.round(len * 16);
      calcResult.textContent = `${Math.round(base * 0.9)} - ${Math.round(base * 1.1)} pcs`;
    }
  }

  calcMode.addEventListener('change', () => {
    if (calcMode.value === 'room') {
      roomInputs.style.display = 'block';
      archInputs.style.display = 'none';
    } else {
      roomInputs.style.display = 'none';
      archInputs.style.display = 'block';
    }
    calculateBalloons();
  });

  [widthVal, heightVal, archVal].forEach(el => el.addEventListener('input', calculateBalloons));
  calculateBalloons();

  // Colors Logic
  const presetSelect = document.getElementById('aiPresetSelect');
  const circleBox = document.getElementById('aiColorCircleContainer');
  const descBox = document.getElementById('aiPaletteDescriptionText');

  function updatePalette(presetKey) {
    const data = colorPresets[presetKey];
    if (!data) return;
    
    circleBox.innerHTML = '';
    data.colors.forEach(col => {
      const circ = document.createElement('div');
      circ.className = 'ai-color-circle';
      circ.style.backgroundColor = col;
      circleBox.appendChild(circ);
    });

    descBox.innerHTML = data.desc;
  }

  presetSelect.addEventListener('change', (e) => updatePalette(e.target.value));
  updatePalette('luxury');

  // Chat Logics
  function appendMsg(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `ai-msg ai-msg-${sender}`;
    bubble.innerHTML = text;

    const meta = document.createElement('div');
    meta.className = 'ai-msg-meta';
    meta.textContent = sender === 'bot' ? 'FreeStyle AI' : 'You';
    bubble.appendChild(meta);

    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle choice chips
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('ai-chip')) {
      const chipVal = e.target.dataset.chip || e.target.textContent;
      handleUserInput(chipVal);
    }
  });

  function handleUserInput(input) {
    if (!input.trim()) return;
    appendMsg(input, 'user');
    
    // Typing indicator
    typingIndicator.style.display = 'inline-flex';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      typingIndicator.style.display = 'none';
      processDialogue(input);
    }, 900);
  }

  function processDialogue(text) {
    const lower = text.toLowerCase();
    
    // Keyword matchers
    if (lower.includes('price') || lower.includes('cost') || lower.includes('package')) {
      appendMsg(`All our decoration packages are customized to match your space and theme. Pricing is variable, so please <strong>Contact for info / Get a quote</strong>.<br/><br/>Let's design! <strong>What color theme matches your vision?</strong>`, 'bot');
      showColorsChips();
      return;
    }
    if (lower.includes('contact') || lower.includes('phone') || lower.includes('address')) {
      appendMsg(`📍 <strong>Kadamkuan, Patna 800003</strong><br/>📞 <strong>9471679158</strong> (WhatsApp Sonu Sharma).`, 'bot');
      return;
    }

    // Step Flow
    if (widgetState.step === 'event') {
      widgetState.event = text;
      widgetState.step = 'color';
      appendMsg(`Awesome! A <strong>${text}</strong> setup.<br/><br/>What <strong>color theme or palette preset</strong> are you planning?`, 'bot');
      showColorsChips();
    } 
    else if (widgetState.step === 'color') {
      widgetState.color = text;
      widgetState.step = 'location';
      appendMsg(`Beautiful colors! Where is the <strong>venue or location</strong> in Patna?`, 'bot');
      showLocationChips();
    } 
    else if (widgetState.step === 'location') {
      widgetState.location = text;
      widgetState.step = 'budget';
      appendMsg(`Perfect. Lastly, what is your <strong>budget category scale</strong>?`, 'bot');
      showBudgetChips();
    } 
    else if (widgetState.step === 'budget') {
      widgetState.budget = text;
      widgetState.step = 'finished';
      generateWidgetSummaryPlan();
    }
  }

  function showColorsChips() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-chips-box';
    wrapper.innerHTML = `
      <button class="ai-chip" data-chip="👑 Luxury Gold & Black">👑 Luxury Gold & Black</button>
      <button class="ai-chip" data-chip="🌸 Pastel Pink & Rose Gold">🌸 Pastel Pink & Rose Gold</button>
      <button class="ai-chip" data-chip="🎈 Chrome Purple & Silver">🎈 Chrome Purple & Silver</button>
      <button class="ai-chip" data-chip="🌿 Organic Green & White">🌿 Organic Green & White</button>
    `;
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showLocationChips() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-chips-box';
    wrapper.innerHTML = `
      <button class="ai-chip" data-chip="🏠 Home (Living Room / Terrace)">🏠 Home Setup</button>
      <button class="ai-chip" data-chip="🏨 Banquet Hall">🏨 Banquet Hall</button>
      <button class="ai-chip" data-chip="🏫 College / School / Office">🏫 Office / College</button>
    `;
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showBudgetChips() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ai-chips-box';
    wrapper.innerHTML = `
      <button class="ai-chip" data-chip="🎈 Basic (Arches + ceiling clusters)">🎈 Basic Setup</button>
      <button class="ai-chip" data-chip="✨ Premium (Double-arch backdrop + LEDs)">✨ Premium Party</button>
      <button class="ai-chip" data-chip="👑 Grand Stage (Royal stage scale + floral)">👑 Grand Stage</button>
    `;
    chatMessages.appendChild(wrapper);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateWidgetSummaryPlan() {
    let title = "FreeStyle AI Design Plan";
    let balloons = "250 - 300 Premium Chrome/Latex Balloons";
    let items = "Organic balloon arch, personalized banner, name foil letters, floor highlights.";
    let setupTime = "1.5 to 2 hours";

    if (widgetState.event.toLowerCase().includes('wedding') || widgetState.budget.toLowerCase().includes('grand')) {
      title = "FreeStyle AI Grand Stage Plan";
      balloons = "600+ Luxury Metallic Balloons & Fresh Floral Fusion";
      items = "Royal stage backdrops, entry canopy, spot LED lamps, cake table framing.";
      setupTime = "3 to 5 hours (team of 3 decorators)";
    } else if (widgetState.budget.toLowerCase().includes('basic')) {
      title = "FreeStyle AI Essential Plan";
      balloons = "120 - 150 Standard Balloons";
      items = "Standard balloon arch / room clusters, Happy Birthday foil.";
      setupTime = "1 hour";
    }

    const summaryHtml = `
      Here is your custom design plan:<br/>
      <div class="ai-design-card">
        <div class="ai-design-title">${title}</div>
        <div class="ai-design-row">
          <div class="ai-design-lbl">Event:</div>
          <div class="ai-design-val">${widgetState.event}</div>
        </div>
        <div class="ai-design-row">
          <div class="ai-design-lbl">Colors:</div>
          <div class="ai-design-val">${widgetState.color}</div>
        </div>
        <div class="ai-design-row">
          <div class="ai-design-lbl">Venue:</div>
          <div class="ai-design-val">${widgetState.location}</div>
        </div>
        <div class="ai-design-row">
          <div class="ai-design-lbl">Balloons:</div>
          <div class="ai-design-val">${balloons}</div>
        </div>
        <div class="ai-design-row">
          <div class="ai-design-lbl">Details:</div>
          <div class="ai-design-val">${items}</div>
        </div>
        <div class="ai-design-row">
          <div class="ai-design-lbl">Setup Time:</div>
          <div class="ai-design-val">${setupTime}</div>
        </div>
      </div>
      <br/>
      Book this design plan instantly via WhatsApp message to Sonu Sharma:<br/><br/>
      <button class="btn btn-gold" id="aiWidgetBookBtn" style="padding:0.45rem 1.15rem; font-size:0.75rem; width:100%; justify-content:center;">💬 Book layout on WhatsApp</button>
    `;

    appendMsg(summaryHtml, 'bot');

    setTimeout(() => {
      const bookBtn = document.getElementById('aiWidgetBookBtn');
      if (bookBtn) {
        bookBtn.addEventListener('click', () => {
          let text = `Hello FreeStyle Decorators!%0A%0A`;
          text += `I planned my event using the FreeStyle AI widget and would like to request this layout:%0A%0A`;
          text += `*Occasion:* ${encodeURIComponent(widgetState.event)}%0A`;
          text += `*Color Theme:* ${encodeURIComponent(widgetState.color)}%0A`;
          text += `*Venue Type:* ${encodeURIComponent(widgetState.location)}%0A`;
          text += `*Scale Preset:* ${encodeURIComponent(widgetState.budget)}%0A`;
          text += `*Balloons:* ${encodeURIComponent(balloons)}%0A`;
          text += `*Highlights:* ${encodeURIComponent(items)}%0A%0A`;
          text += `Please send me the quote and availability!`;

          const waUrl = `https://wa.me/919471679158?text=${text}`;
          window.open(waUrl, '_blank');
        });
      }
    }, 200);
  }

  function restartChat() {
    widgetState = {
      step: 'event',
      event: '',
      color: '',
      location: '',
      budget: ''
    };
    chatMessages.innerHTML = `
      <div class="ai-msg ai-msg-bot">
        Hello! I'm <strong>FreeStyle AI</strong>, your virtual balloon designer. Let's design a custom decoration layout for your event in Patna. 🎈
        <br/><br/>
        To get started, <strong>what occasion are we planning?</strong>
        <div class="ai-chips-box">
          <button class="ai-chip" data-chip="🎂 Birthday Party">🎂 Birthday Party</button>
          <button class="chip ai-chip" data-chip="💍 Wedding Stage">💍 Wedding Stage</button>
          <button class="chip ai-chip" data-chip="❤️ Anniversary">❤️ Anniversary</button>
          <button class="chip ai-chip" data-chip="🌸 Mehndi / Sangeet">🌸 Mehndi / Sangeet</button>
          <button class="chip ai-chip" data-chip="🎓 College Celebration">🎓 College Celebration</button>
        </div>
        <div class="ai-msg-meta">FreeStyle AI</div>
      </div>
    `;
  }

  resetBtn.addEventListener('click', restartChat);

  chatInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = chatInputText.value;
    if (!val) return;
    chatInputText.value = '';
    handleUserInput(val);
  });

})();
