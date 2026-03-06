// RE-World UI Generator — Figma Plugin
// globals.css → Figma 색상 (HEX → 0-1 float)
const C = {
  beige:         { r: 0.851, g: 0.827, b: 0.757 }, // #d9d3c1
  beigeMid:      { r: 0.812, g: 0.788, b: 0.722 }, // #cfc9b8
  beigeDeep:     { r: 0.620, g: 0.596, b: 0.545 }, // #9e988b
  beigeDark:     { r: 0.710, g: 0.690, b: 0.639 }, // #b5b0a3
  beigeLight:    { r: 0.804, g: 0.780, b: 0.714 }, // #cdc7b6
  beigeHover:    { r: 0.769, g: 0.745, b: 0.659 }, // #c4bea8
  charcoal:      { r: 0.220, g: 0.208, b: 0.184 }, // #38352f
  charcoalLight: { r: 0.459, g: 0.443, b: 0.400 }, // #757166
  charcoalMuted: { r: 0.361, g: 0.345, b: 0.306 }, // #5c584e
  charcoalDark:  { r: 0.169, g: 0.161, b: 0.141 }, // #2b2924
  green:         { r: 0.133, g: 0.773, b: 0.369 }, // #22c55e
  yellow:        { r: 0.918, g: 0.702, b: 0.031 }, // #eab308
  red:           { r: 0.937, g: 0.267, b: 0.267 }, // #ef4444
  cyan:          { r: 0.000, g: 0.898, b: 1.000 }, // #00e5ff
  white:         { r: 1.000, g: 1.000, b: 1.000 },
  black:         { r: 0.000, g: 0.000, b: 0.000 },
};

// ── 헬퍼 ────────────────────────────────────────────────────────

function solid(color, opacity = 1) {
  return [{ type: "SOLID", color, opacity }];
}

async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: "Courier New", style: "Regular" }),
    figma.loadFontAsync({ family: "Courier New", style: "Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
  ]);
}

function applyText(node, { family = "Courier New", style = "Regular", size = 12, color, opacity = 1, letterSpacingPct = 0, textCase = "ORIGINAL" }) {
  node.fontName = { family, style };
  node.fontSize = size;
  if (color) node.fills = solid(color, opacity);
  if (letterSpacingPct) node.letterSpacing = { unit: "PERCENT", value: letterSpacingPct };
  if (textCase !== "ORIGINAL") node.textCase = textCase;
}

function makeRect(name, w, h, fill, opts = {}) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = fill;
  if (opts.stroke) { r.strokes = opts.stroke; r.strokeWeight = opts.strokeWeight || 1; }
  if (opts.cornerRadius) r.cornerRadius = opts.cornerRadius;
  return r;
}

function makeEllipse(name, w, h, fill) {
  const e = figma.createEllipse();
  e.name = name;
  e.resize(w, h);
  e.fills = fill;
  return e;
}

function makeText(chars, opts = {}) {
  const t = figma.createText();
  applyText(t, opts);
  t.characters = chars;
  return t;
}

function makeAutoFrame(name, dir = "VERTICAL", opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.primaryAxisSizingMode = opts.primarySize || "AUTO";
  f.counterAxisSizingMode = opts.counterSize || "AUTO";
  f.itemSpacing = opts.gap || 0;
  f.paddingLeft   = opts.pl || opts.px || opts.p || 0;
  f.paddingRight  = opts.pr || opts.px || opts.p || 0;
  f.paddingTop    = opts.pt || opts.py || opts.p || 0;
  f.paddingBottom = opts.pb || opts.py || opts.p || 0;
  f.fills = opts.fills || [];
  if (opts.primaryAlign) f.primaryAxisAlignItems = opts.primaryAlign;
  if (opts.counterAlign) f.counterAxisAlignItems = opts.counterAlign;
  if (opts.stroke) { f.strokes = opts.stroke; f.strokeWeight = opts.strokeWeight || 1; }
  if (opts.clips) f.clipsContent = true;
  return f;
}

// 텍스트 생성 후 프레임에 append
function addText(parent, chars, opts = {}) {
  const t = makeText(chars, opts);
  parent.appendChild(t);
  return t;
}

// ── Page 1: Design System ───────────────────────────────────────

async function createDesignSystemPage(page) {
  page.name = "Page 1: Design System";

  // Colors
  const colorsFrame = makeAutoFrame("Colors", "HORIZONTAL", { gap: 16, p: 24, fills: solid(C.white) });
  const colorSwatches = [
    ["beige", "#d9d3c1", C.beige],
    ["beigeMid", "#cfc9b8", C.beigeMid],
    ["beigeDeep", "#9e988b", C.beigeDeep],
    ["beigeDark", "#b5b0a3", C.beigeDark],
    ["charcoal", "#38352f", C.charcoal],
    ["charcoalLight", "#757166", C.charcoalLight],
    ["charcoalMuted", "#5c584e", C.charcoalMuted],
    ["charcoalDark", "#2b2924", C.charcoalDark],
    ["green", "#22c55e", C.green],
    ["yellow", "#eab308", C.yellow],
    ["red", "#ef4444", C.red],
    ["cyan", "#00e5ff", C.cyan],
  ];
  for (const [name, hex, color] of colorSwatches) {
    const group = makeAutoFrame(name, "VERTICAL", { gap: 6 });
    group.counterAxisSizingMode = "FIXED";
    group.resize(64, 64);
    const swatch = makeRect("swatch", 64, 48, solid(color), { cornerRadius: 2 });
    const label = makeText(hex, { size: 9, color: C.charcoal });
    group.appendChild(swatch);
    group.appendChild(label);
    colorsFrame.appendChild(group);
  }
  page.appendChild(colorsFrame);

  // Typography
  const typoFrame = makeAutoFrame("Typography", "VERTICAL", { gap: 20, p: 24, fills: solid(C.white) });
  typoFrame.y = 200;
  const scales = [
    { label: "text-xs · tracking-widest", size: 12, sample: "BATTLE ROYALE — TRACKING", style: "Regular" },
    { label: "text-sm · font-bold", size: 14, sample: "Ghost_Actual — Player Name", style: "Bold" },
    { label: "text-xl · font-bold", size: 20, sample: "RE-WORLD — Medium Title", style: "Bold" },
    { label: "text-5xl · font-bold", size: 48, sample: "START", style: "Bold" },
    { label: "text-9xl · font-bold", size: 72, sample: "RE-WORLD_", style: "Bold" },
  ];
  for (const { label, size, sample, style } of scales) {
    const row = makeAutoFrame(label, "VERTICAL", { gap: 4 });
    row.appendChild(makeText(label, { size: 9, color: C.charcoalLight }));
    row.appendChild(makeText(sample, { style, size, color: C.charcoal }));
    typoFrame.appendChild(row);
  }
  page.appendChild(typoFrame);

  // Components
  const compFrame = makeAutoFrame("Components", "HORIZONTAL", { gap: 32, p: 24, fills: solid(C.white) });
  compFrame.counterAxisAlignItems = "MIN";
  compFrame.y = 720;

  // Button/Primary
  const btnP = makeAutoFrame("Button/Primary", "HORIZONTAL", { pl: 64, pr: 64, pt: 20, pb: 20, fills: solid(C.charcoal) });
  btnP.primaryAxisAlignItems = "CENTER";
  btnP.counterAxisAlignItems = "CENTER";
  addText(btnP, "Authorize", { style: "Bold", size: 11, color: C.beige, letterSpacingPct: 30 });
  compFrame.appendChild(btnP);

  // Button/Secondary
  const btnS = makeAutoFrame("Button/Secondary", "HORIZONTAL", {
    pl: 64, pr: 64, pt: 20, pb: 20,
    stroke: solid(C.charcoal, 0.2), strokeWeight: 1,
  });
  btnS.primaryAxisAlignItems = "CENTER";
  btnS.counterAxisAlignItems = "CENTER";
  addText(btnS, "Authorize", { style: "Bold", size: 11, color: C.charcoal, letterSpacingPct: 30 });
  compFrame.appendChild(btnS);

  // HealthBar
  const hbGroup = makeAutoFrame("HealthBar", "VERTICAL", { gap: 8 });
  for (const [variant, color] of [["green", C.green], ["yellow", C.yellow], ["red", C.red]]) {
    const track = makeAutoFrame(`HealthBar/${variant}`, "HORIZONTAL", {
      fills: solid(C.black, 0.6),
      stroke: solid(C.white, 0.3), strokeWeight: 2,
      clips: true,
    });
    track.primaryAxisSizingMode = "FIXED";
    track.counterAxisSizingMode = "FIXED";
    track.resize(192, 20);
    const fill = makeRect("fill", 140, 20, solid(color));
    track.appendChild(fill);
    hbGroup.appendChild(track);
  }
  compFrame.appendChild(hbGroup);

  // WeaponSlot
  const wsGroup = makeAutoFrame("WeaponSlot", "VERTICAL", { gap: 6 });
  const wsActive = makeAutoFrame("WeaponSlot/active", "HORIZONTAL", { gap: 8, pl: 8, pr: 8 });
  wsActive.counterAxisAlignItems = "CENTER";
  wsActive.primaryAxisSizingMode = "FIXED";
  wsActive.counterAxisSizingMode = "FIXED";
  wsActive.resize(200, 36);
  addText(wsActive, "1  AR-15  30/30", { style: "Bold", size: 12, color: C.white });
  const wsInactive = makeAutoFrame("WeaponSlot/inactive", "HORIZONTAL", { gap: 8, pl: 8, pr: 8 });
  wsInactive.counterAxisAlignItems = "CENTER";
  wsInactive.primaryAxisSizingMode = "FIXED";
  wsInactive.counterAxisSizingMode = "FIXED";
  wsInactive.resize(200, 36);
  addText(wsInactive, "2  Primary 2", { style: "Regular", size: 12, color: C.white, opacity: 0.4 });
  wsGroup.appendChild(wsActive);
  wsGroup.appendChild(wsInactive);
  compFrame.appendChild(wsGroup);

  // MinimapMarker
  const marker = figma.createFrame();
  marker.name = "MinimapMarker";
  marker.resize(40, 40);
  marker.fills = [];
  const mCircle = makeEllipse("circle", 24, 24, solid(C.cyan));
  mCircle.x = 8; mCircle.y = 10;
  const mDir = figma.createPolygon();
  mDir.name = "direction";
  mDir.pointCount = 3;
  mDir.resize(10, 10);
  mDir.x = 15; mDir.y = 0;
  mDir.fills = solid(C.white);
  marker.appendChild(mCircle);
  marker.appendChild(mDir);
  compFrame.appendChild(marker);

  page.appendChild(compFrame);
}

// ── Page 2: Hero Screen (1920×1080) ────────────────────────────

async function createHeroScreenPage() {
  const page = figma.createPage();
  page.name = "Page 2: Hero Screen";

  const frame = figma.createFrame();
  frame.name = "HeroScreen";
  frame.resize(1920, 1080);
  frame.fills = solid(C.beige);
  frame.clipsContent = true;

  // 배경: grayscale 영상 플레이스홀더 (opacity 60%)
  const videoBg = makeRect("VideoBackground", 1920, 1080, solid(C.charcoalMuted, 0.6));
  frame.appendChild(videoBg);
  const videoLabel = makeText("VIDEO: /videos/planet_remix.webm  ·  grayscale  opacity-60", { size: 13, color: C.white, opacity: 0.4 });
  videoLabel.x = 20; videoLabel.y = 20;
  frame.appendChild(videoLabel);

  // 베이지 오버레이 bg-brand-beige/30
  frame.appendChild(makeRect("BeigeOverlay", 1920, 1080, solid(C.beige, 0.3)));

  // StaticOverlay: 40px 그리드 (선 그릴 수 없어 메모로 표시)
  const gridNote = figma.createFrame();
  gridNote.name = "GridOverlay (40px grid — CSS bg-[linear-gradient])";
  gridNote.resize(1920, 1080);
  gridNote.fills = [];
  gridNote.strokes = solid(C.charcoal, 0.05);
  gridNote.strokeWeight = 1;
  frame.appendChild(gridNote);

  // 코너 십자선 (top-8 left-8 = 32px, Crosshair 20×20)
  const crossPos = [
    { x: 32, y: 32, n: "Crosshair_TL" },
    { x: 1868, y: 32, n: "Crosshair_TR" },
    { x: 32, y: 1028, n: "Crosshair_BL" },
    { x: 1868, y: 1028, n: "Crosshair_BR" },
  ];
  for (const { x, y, n } of crossPos) {
    const ch = figma.createFrame();
    ch.name = n; ch.resize(20, 20); ch.x = x; ch.y = y; ch.fills = [];
    const h = makeRect("H", 20, 1, solid(C.charcoalLight)); h.x = 0; h.y = 9;
    const v = makeRect("V", 1, 20, solid(C.charcoalLight)); v.x = 9; v.y = 0;
    const c = makeEllipse("Ring", 8, 8, []); c.strokes = solid(C.charcoalLight); c.strokeWeight = 1; c.x = 6; c.y = 6;
    ch.appendChild(h); ch.appendChild(v); ch.appendChild(c);
    frame.appendChild(ch);
  }

  // 중앙 세로선
  const cl = makeRect("CenterLine", 1, 1080, solid(C.charcoal, 0.05));
  cl.x = 960; cl.y = 0;
  frame.appendChild(cl);

  // HeroHUD: "PROJECT" / "RE-WORLD_" / "BATTLE ROYALE" / Authorize
  const hudContainer = makeAutoFrame("HeroHUD", "VERTICAL", { gap: 48 });
  hudContainer.primaryAxisAlignItems = "CENTER";
  hudContainer.counterAxisAlignItems = "CENTER";

  const titleBlock = makeAutoFrame("TitleBlock", "VERTICAL", { gap: 20 });
  titleBlock.primaryAxisAlignItems = "CENTER";
  titleBlock.counterAxisAlignItems = "CENTER";

  addText(titleBlock, "PROJECT", { style: "Regular", size: 14, color: C.charcoal, letterSpacingPct: 150 });
  addText(titleBlock, "RE-WORLD_", { style: "Bold", size: 96, color: C.charcoal });
  addText(titleBlock, "BATTLE ROYALE", { style: "Regular", size: 28, color: C.charcoalLight, letterSpacingPct: 80 });

  const authBtn = makeAutoFrame("AuthorizeButton", "HORIZONTAL", {
    pl: 64, pr: 64, pt: 20, pb: 20,
    stroke: solid(C.charcoal, 0.2), strokeWeight: 1,
  });
  authBtn.primaryAxisAlignItems = "CENTER";
  authBtn.counterAxisAlignItems = "CENTER";
  addText(authBtn, "Authorize", { style: "Bold", size: 11, color: C.charcoal, letterSpacingPct: 30 });

  hudContainer.appendChild(titleBlock);
  hudContainer.appendChild(authBtn);
  // 레이아웃 후 중앙 배치
  hudContainer.x = 700; hudContainer.y = 320;
  frame.appendChild(hudContainer);

  page.appendChild(frame);

  // BootSequence 상태 스냅샷 4개 (메인 프레임 아래)
  const snapshots = makeAutoFrame("BootSequence Snapshots", "HORIZONTAL", {
    gap: 24, p: 24, fills: solid(C.white),
  });
  snapshots.x = 0; snapshots.y = 1120;

  const stages = [
    { name: "init",   desc: "w-0 opacity-0 · 검은화면" },
    { name: "line",   desc: "w-full 수평선 등장" },
    { name: "expand", desc: "베이지 패널 확장" },
    { name: "ui",     desc: "UI fade-in, 오버레이 사라짐" },
  ];
  for (const { name, desc } of stages) {
    const snap = figma.createFrame();
    snap.name = `BootStage/${name}`; snap.resize(320, 180);
    snap.fills = solid(C.beige); snap.clipsContent = true;
    const lbl = makeText(`[${name.toUpperCase()}]\n${desc}`, { size: 10, color: C.charcoal });
    lbl.x = 12; lbl.y = 12; snap.appendChild(lbl);
    if (name === "line" || name === "expand") {
      const ln = makeRect("line", 320, 1, solid(C.charcoal, 0.8)); ln.x = 0; ln.y = 90; snap.appendChild(ln);
    }
    if (name === "expand") {
      const panel = makeRect("expandPanel", 320, 180, solid(C.beige)); panel.x = 0; panel.y = 0; snap.appendChild(panel);
    }
    snapshots.appendChild(snap);
  }
  page.appendChild(snapshots);
}

// ── Page 3: Lobby Screen (1920×1080) ───────────────────────────

async function createLobbyScreenPage() {
  const page = figma.createPage();
  page.name = "Page 3: Lobby Screen";

  const frame = figma.createFrame();
  frame.name = "LobbyScreen";
  frame.resize(1920, 1080);
  frame.fills = solid(C.beige);
  frame.clipsContent = true;

  // Background
  const bg = makeRect("Background", 1920, 1080, solid(C.beigeLight, 0.5));
  frame.appendChild(bg);

  // ── Header (h-16 = 64px) ──
  const header = figma.createFrame();
  header.name = "Header"; header.resize(1920, 64); header.x = 0; header.y = 0;
  header.layoutMode = "HORIZONTAL";
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  header.paddingLeft = 32; header.paddingRight = 32;
  header.fills = solid(C.beige, 0.8);
  header.strokes = solid(C.beigeDark); header.strokeWeight = 2;
  header.primaryAxisSizingMode = "FIXED"; header.counterAxisSizingMode = "FIXED";

  // 탭 영역
  const tabs = makeAutoFrame("Tabs", "HORIZONTAL", { gap: 8 });
  tabs.counterAxisAlignItems = "MAX";
  const navItems = ["PLAY", "CUSTOMIZE", "ARMORY", "RECORDS", "SYSTEM"];
  for (const item of navItems) {
    const tab = makeAutoFrame(`Tab/${item}`, "HORIZONTAL", {
      pl: 24, pr: 24,
      fills: item === "PLAY" ? solid(C.charcoal) : solid(C.beigeMid),
    });
    tab.primaryAxisAlignItems = "CENTER"; tab.counterAxisAlignItems = "CENTER";
    tab.primaryAxisSizingMode = "FIXED"; tab.counterAxisSizingMode = "FIXED";
    tab.resize(item === "PLAY" ? 100 : 110, 40);
    addText(tab, item, {
      style: "Bold", size: 11, letterSpacingPct: 20,
      color: item === "PLAY" ? C.beige : C.charcoalLight,
    });
    tabs.appendChild(tab);
  }
  header.appendChild(tabs);

  // 우측: ONLINE + 버전
  const hdrRight = makeAutoFrame("HeaderRight", "HORIZONTAL", { gap: 8 });
  hdrRight.counterAxisAlignItems = "CENTER";
  const onlineDot = makeEllipse("OnlineDot", 8, 8, solid(C.charcoal));
  addText(hdrRight, "ONLINE  |  VER. 9.02.4", { style: "Bold", size: 11, color: C.charcoalMuted });
  hdrRight.appendChild(onlineDot);
  header.appendChild(hdrRight);
  frame.appendChild(header);

  // ── Main 영역 (y=64, h=968) ──
  // 3열 그리드: left(col-3≈400), center(col-6≈800), right(col-3≈400), gap 32, padding 40
  const mainY = 64;
  const mainH = 968;
  const pad = 40;

  // LEFT COLUMN ─────────────────────────────────
  const leftX = pad;
  const leftW = 400;

  // MATCH_CONFIG 카드
  const matchCard = figma.createFrame();
  matchCard.name = "MATCH_CONFIG"; matchCard.x = leftX; matchCard.y = mainY + pad;
  matchCard.layoutMode = "VERTICAL"; matchCard.itemSpacing = 0;
  matchCard.fills = solid(C.beigeMid, 0.4);
  matchCard.strokes = solid(C.beigeDark); matchCard.strokeWeight = 2;
  matchCard.paddingLeft = 1; matchCard.paddingRight = 1;
  matchCard.paddingTop = 1; matchCard.paddingBottom = 1;
  matchCard.primaryAxisSizingMode = "AUTO"; matchCard.counterAxisSizingMode = "FIXED";
  matchCard.resize(leftW, 1); // counterAxis fixed width

  const mcHeader = figma.createFrame();
  mcHeader.name = "CardHeader"; mcHeader.resize(leftW - 2, 28);
  mcHeader.layoutMode = "HORIZONTAL"; mcHeader.paddingLeft = 12;
  mcHeader.counterAxisAlignItems = "CENTER";
  mcHeader.fills = solid(C.charcoal);
  mcHeader.primaryAxisSizingMode = "FIXED"; mcHeader.counterAxisSizingMode = "FIXED";
  addText(mcHeader, "MATCH_CONFIG", { style: "Bold", size: 11, color: C.beige, letterSpacingPct: 20 });
  matchCard.appendChild(mcHeader);

  const mcBody = makeAutoFrame("CardBody", "VERTICAL", { gap: 16, pl: 16, pr: 16, pt: 16, pb: 16 });
  addText(mcBody, "Operation Mode", { style: "Bold", size: 10, color: C.charcoalLight, letterSpacingPct: 20 });
  for (const mode of ["SOLO", "DUO", "SQUAD"]) {
    const modeRow = figma.createFrame();
    modeRow.name = `Mode/${mode}`; modeRow.resize(leftW - 34, 36);
    modeRow.layoutMode = "HORIZONTAL";
    modeRow.primaryAxisAlignItems = "SPACE_BETWEEN";
    modeRow.counterAxisAlignItems = "CENTER";
    modeRow.paddingLeft = 12; modeRow.paddingRight = 12;
    modeRow.fills = mode === "SOLO" ? solid(C.beigeHover) : [];
    modeRow.primaryAxisSizingMode = "FIXED"; modeRow.counterAxisSizingMode = "FIXED";
    addText(modeRow, mode, { style: "Bold", size: 13, color: mode === "SOLO" ? C.charcoal : C.charcoalLight });
    if (mode === "SOLO") {
      const dot = makeRect("ActiveDot", 6, 6, solid(C.charcoal));
      modeRow.appendChild(dot);
    }
    mcBody.appendChild(modeRow);
  }
  // Region / Latency
  const regionDiv = makeAutoFrame("RegionInfo", "VERTICAL", { gap: 8, pt: 12 });
  const divLine = makeRect("Divider", leftW - 34, 1, solid(C.beigeDark));
  regionDiv.appendChild(divLine);
  for (const [lbl, val] of [["REGION", "TOKYO_03"], ["LATENCY", "12ms"]]) {
    const row = figma.createFrame();
    row.name = lbl; row.resize(leftW - 34, 20);
    row.layoutMode = "HORIZONTAL"; row.primaryAxisAlignItems = "SPACE_BETWEEN"; row.counterAxisAlignItems = "CENTER";
    row.fills = []; row.primaryAxisSizingMode = "FIXED"; row.counterAxisSizingMode = "FIXED";
    addText(row, lbl, { style: "Bold", size: 11, color: C.charcoalMuted });
    addText(row, val, { style: "Bold", size: 11, color: C.charcoal });
    regionDiv.appendChild(row);
  }
  mcBody.appendChild(regionDiv);
  matchCard.appendChild(mcBody);
  frame.appendChild(matchCard);

  // START 버튼
  const startBtn = figma.createFrame();
  startBtn.name = "StartButton"; startBtn.resize(leftW, 160);
  startBtn.x = leftX; startBtn.y = mainY + mainH - pad - 160;
  startBtn.layoutMode = "VERTICAL"; startBtn.itemSpacing = 8;
  startBtn.paddingLeft = 24; startBtn.paddingRight = 24;
  startBtn.paddingTop = 24; startBtn.paddingBottom = 0;
  startBtn.fills = solid(C.charcoal);
  startBtn.primaryAxisSizingMode = "FIXED"; startBtn.counterAxisSizingMode = "FIXED";
  addText(startBtn, "INIT_SEQUENCE", { style: "Regular", size: 10, color: C.beige, opacity: 0.7, letterSpacingPct: 30 });
  addText(startBtn, "START", { style: "Bold", size: 48, color: C.beige });
  addText(startBtn, "SESSION_09", { style: "Bold", size: 13, color: C.beige, opacity: 0.7 });
  const loadingBar = figma.createFrame();
  loadingBar.name = "LoadingBar"; loadingBar.resize(leftW, 8);
  loadingBar.fills = solid(C.charcoalDark);
  loadingBar.primaryAxisSizingMode = "FIXED"; loadingBar.counterAxisSizingMode = "FIXED";
  loadingBar.appendChild(makeRect("fill", 160, 8, solid(C.beige)));
  startBtn.appendChild(loadingBar);
  frame.appendChild(startBtn);

  // CENTER COLUMN ───────────────────────────────
  const centerX = leftX + leftW + 32;
  const centerW = 1920 - pad * 2 - leftW * 2 - 32 * 2; // ≈ 760

  // ODYSSEY 워터마크
  const odyssey = makeText("ODYSSEY", { style: "Bold", size: 120, color: C.beigeLight, opacity: 0.6 });
  odyssey.x = centerX + 30; odyssey.y = mainY + 300;
  frame.appendChild(odyssey);

  // 캐릭터 프레임 플레이스홀더
  const charFrame = makeRect("CharacterFrame", centerW - 100, 700, solid(C.charcoalLight, 0.08), {
    stroke: solid(C.beigeDark, 0.3), strokeWeight: 1,
  });
  charFrame.x = centerX + 50; charFrame.y = mainY + 80;
  frame.appendChild(charFrame);
  const charLabel = makeText("CHARACTER\nPREVIEW", { size: 14, color: C.charcoalLight, opacity: 0.4 });
  charLabel.x = centerX + 50 + (centerW - 100) / 2 - 40; charLabel.y = mainY + 400;
  frame.appendChild(charLabel);

  // VANTAGE + LVL.99
  const vantage = makeText("VANTAGE", { style: "Bold", size: 48, color: C.charcoal, letterSpacingPct: 20 });
  vantage.x = centerX + 260; vantage.y = mainY + 800;
  frame.appendChild(vantage);
  const lvlBadge = makeAutoFrame("LevelBadge", "HORIZONTAL", { pl: 12, pr: 12, pt: 4, pb: 4, fills: solid(C.charcoal) });
  lvlBadge.primaryAxisAlignItems = "CENTER"; lvlBadge.counterAxisAlignItems = "CENTER";
  addText(lvlBadge, "LVL. 99", { style: "Bold", size: 11, color: C.beige, letterSpacingPct: 20 });
  lvlBadge.x = centerX + 360; lvlBadge.y = mainY + 858;
  frame.appendChild(lvlBadge);

  // RIGHT COLUMN ────────────────────────────────
  const rightX = 1920 - pad - leftW;

  // 프로필 카드
  const profileCard = figma.createFrame();
  profileCard.name = "ProfileCard"; profileCard.x = rightX; profileCard.y = mainY + pad;
  profileCard.layoutMode = "HORIZONTAL"; profileCard.itemSpacing = 16;
  profileCard.counterAxisAlignItems = "CENTER";
  profileCard.paddingLeft = 16; profileCard.paddingRight = 16;
  profileCard.paddingTop = 16; profileCard.paddingBottom = 16;
  profileCard.fills = solid(C.beigeMid, 0.4);
  profileCard.strokes = solid(C.beigeDark); profileCard.strokeWeight = 2;
  profileCard.primaryAxisSizingMode = "FIXED"; profileCard.counterAxisSizingMode = "AUTO";
  profileCard.resize(leftW, 1);

  const avatar = makeRect("Avatar", 64, 64, solid(C.beigeDark), { stroke: solid(C.beigeDeep), strokeWeight: 1 });
  profileCard.appendChild(avatar);
  const profileInfo = makeAutoFrame("ProfileInfo", "VERTICAL", { gap: 4 });
  addText(profileInfo, "OPERATOR", { style: "Bold", size: 10, color: C.charcoalLight, letterSpacingPct: 20 });
  addText(profileInfo, "Ghost_Actual", { style: "Bold", size: 20, color: C.charcoal });
  addText(profileInfo, "BP: 15,390", { style: "Bold", size: 11, color: C.charcoalMuted });
  profileCard.appendChild(profileInfo);
  frame.appendChild(profileCard);

  // UNIT_STATUS 카드
  const statusCardY = mainY + pad + 112 + 32;
  const statusCard = figma.createFrame();
  statusCard.name = "UNIT_STATUS"; statusCard.x = rightX; statusCard.y = statusCardY;
  statusCard.layoutMode = "VERTICAL"; statusCard.itemSpacing = 0;
  statusCard.fills = solid(C.beigeMid, 0.4);
  statusCard.strokes = solid(C.beigeDark); statusCard.strokeWeight = 2;
  statusCard.paddingLeft = 1; statusCard.paddingRight = 1;
  statusCard.paddingTop = 1; statusCard.paddingBottom = 1;
  statusCard.primaryAxisSizingMode = "AUTO"; statusCard.counterAxisSizingMode = "FIXED";
  statusCard.resize(leftW, 1);

  const stHdr = figma.createFrame();
  stHdr.name = "CardHeader"; stHdr.resize(leftW - 2, 28);
  stHdr.layoutMode = "HORIZONTAL"; stHdr.paddingLeft = 12; stHdr.counterAxisAlignItems = "CENTER";
  stHdr.fills = solid(C.charcoalLight);
  stHdr.primaryAxisSizingMode = "FIXED"; stHdr.counterAxisSizingMode = "FIXED";
  addText(stHdr, "UNIT_STATUS", { style: "Bold", size: 11, color: C.beige, letterSpacingPct: 20 });
  statusCard.appendChild(stHdr);

  const stBody = makeAutoFrame("StatusBody", "VERTICAL", { gap: 10, pl: 16, pr: 16, pt: 16, pb: 16 });
  for (const [lbl, val] of [["K/D RATIO", "2.45"], ["WIN RATE", "12.5%"]]) {
    const row = figma.createFrame();
    row.name = lbl; row.resize(leftW - 34, 20);
    row.layoutMode = "HORIZONTAL"; row.primaryAxisAlignItems = "SPACE_BETWEEN"; row.counterAxisAlignItems = "CENTER";
    row.fills = []; row.primaryAxisSizingMode = "FIXED"; row.counterAxisSizingMode = "FIXED";
    addText(row, lbl, { style: "Bold", size: 11, color: C.charcoalLight });
    addText(row, val, { style: "Bold", size: 11, color: C.charcoal });
    stBody.appendChild(row);
    stBody.appendChild(makeRect("Divider", leftW - 34, 1, solid(C.beigeDark)));
  }
  // SYNC 바
  const syncLblRow = figma.createFrame();
  syncLblRow.name = "SyncLabelRow"; syncLblRow.resize(leftW - 34, 16);
  syncLblRow.layoutMode = "HORIZONTAL"; syncLblRow.primaryAxisAlignItems = "SPACE_BETWEEN";
  syncLblRow.fills = []; syncLblRow.primaryAxisSizingMode = "FIXED"; syncLblRow.counterAxisSizingMode = "FIXED";
  addText(syncLblRow, "SYNC", { style: "Bold", size: 10, color: C.charcoalLight });
  addText(syncLblRow, "98%", { style: "Bold", size: 10, color: C.charcoalLight });
  stBody.appendChild(syncLblRow);
  const syncTrack = figma.createFrame();
  syncTrack.name = "SyncTrack"; syncTrack.resize(leftW - 34, 6); syncTrack.fills = solid(C.beigeDark);
  syncTrack.primaryAxisSizingMode = "FIXED"; syncTrack.counterAxisSizingMode = "FIXED";
  syncTrack.appendChild(makeRect("fill", (leftW - 34) * 0.98, 6, solid(C.charcoal)));
  stBody.appendChild(syncTrack);
  statusCard.appendChild(stBody);
  frame.appendChild(statusCard);

  // Squad
  const squadY = mainY + mainH - pad - 72;
  const squadFrame = figma.createFrame();
  squadFrame.name = "Squad"; squadFrame.resize(leftW, 72); squadFrame.x = rightX; squadFrame.y = squadY;
  squadFrame.layoutMode = "HORIZONTAL"; squadFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  squadFrame.counterAxisAlignItems = "CENTER"; squadFrame.paddingLeft = 16; squadFrame.paddingRight = 16;
  squadFrame.fills = solid(C.beigeMid, 0.3); squadFrame.strokes = solid(C.beigeDark); squadFrame.strokeWeight = 2;
  squadFrame.primaryAxisSizingMode = "FIXED"; squadFrame.counterAxisSizingMode = "FIXED";
  const sqAvatars = makeAutoFrame("SquadAvatars", "HORIZONTAL", { gap: -8 });
  const av1 = makeEllipse("Player", 40, 40, solid(C.charcoal)); av1.strokes = solid(C.beige); av1.strokeWeight = 2;
  const av2 = makeEllipse("Empty", 40, 40, solid(C.beigeDark)); av2.strokes = solid(C.beige); av2.strokeWeight = 2;
  sqAvatars.appendChild(av1); sqAvatars.appendChild(av2);
  squadFrame.appendChild(sqAvatars);
  addText(squadFrame, "SQUAD: 1/4", { style: "Bold", size: 11, color: C.charcoal, letterSpacingPct: 20 });
  frame.appendChild(squadFrame);

  // ── Footer (h-12 = 48px) ──
  const footer = figma.createFrame();
  footer.name = "Footer"; footer.resize(1920, 48); footer.x = 0; footer.y = 1080 - 48;
  footer.layoutMode = "HORIZONTAL"; footer.primaryAxisAlignItems = "CENTER"; footer.counterAxisAlignItems = "CENTER";
  footer.fills = solid(C.beigeMid, 0.5); footer.strokes = solid(C.beigeDark); footer.strokeWeight = 2;
  footer.primaryAxisSizingMode = "FIXED"; footer.counterAxisSizingMode = "FIXED";
  addText(footer, "FOR THE GLORY OF MANKIND", { style: "Bold", size: 10, color: C.charcoalMuted, letterSpacingPct: 100 });
  frame.appendChild(footer);

  page.appendChild(frame);

  // MovableWindow: Authorize 팝업
  const popup = makeAutoFrame("MovableWindow/Authorize", "VERTICAL", { fills: solid(C.beigeMid, 0.4) });
  popup.x = 2000; popup.y = 100;
  const popupHdr = figma.createFrame();
  popupHdr.name = "PopupHeader"; popupHdr.resize(300, 28);
  popupHdr.layoutMode = "HORIZONTAL"; popupHdr.paddingLeft = 12; popupHdr.counterAxisAlignItems = "CENTER";
  popupHdr.fills = solid(C.charcoal); popupHdr.primaryAxisSizingMode = "FIXED"; popupHdr.counterAxisSizingMode = "FIXED";
  addText(popupHdr, "Authorize", { style: "Bold", size: 11, color: C.beige, letterSpacingPct: 20 });
  popup.appendChild(popupHdr);
  const popupBody = makeAutoFrame("PopupBody", "VERTICAL", { pt: 80, pb: 80, pl: 16, pr: 16 });
  popupBody.primaryAxisAlignItems = "CENTER"; popupBody.counterAxisAlignItems = "CENTER";
  popupBody.primaryAxisSizingMode = "FIXED"; popupBody.counterAxisSizingMode = "FIXED"; popupBody.resize(300, 160);
  addText(popupBody, "[ Sign In / Sign Out ]", { size: 11, color: C.charcoalLight });
  popup.appendChild(popupBody);
  page.appendChild(popup);
}

// ── Page 4: Game HUD (1920×1080) ───────────────────────────────

async function createGameHUDPage() {
  const page = figma.createPage();
  page.name = "Page 4: Game HUD";

  const frame = figma.createFrame();
  frame.name = "GameHUD"; frame.resize(1920, 1080); frame.fills = solid(C.charcoalMuted, 0.9); frame.clipsContent = true;

  // 3D 씬 플레이스홀더
  const scene = makeRect("3DScene_Placeholder", 1920, 1080, solid(C.charcoalDark, 0.6));
  frame.appendChild(scene);
  const sceneLabel = makeText("3D SCENE — PortGround Map", { size: 16, color: C.white, opacity: 0.25 });
  sceneLabel.x = 860; sceneLabel.y = 530; frame.appendChild(sceneLabel);

  // Minimap (top-5 left-5 = 20px → rounded to 24px, w-100 h-100 = 400px → 200px 표시)
  const minimap = figma.createFrame();
  minimap.name = "Minimap"; minimap.resize(200, 200); minimap.x = 24; minimap.y = 24;
  minimap.fills = solid(C.charcoalDark, 0.8);
  minimap.strokes = solid(C.charcoalLight, 0.5); minimap.strokeWeight = 1; minimap.clipsContent = true;

  // 맵 배경 (포트 지형 시뮬)
  minimap.appendChild(makeRect("MapBg", 200, 200, solid(C.charcoalDark, 0.9)));

  // 플레이어 마커 (#00e5ff 원 + 방향 삼각형)
  const pm = figma.createFrame();
  pm.name = "PlayerMarker"; pm.resize(24, 28); pm.x = 88; pm.y = 86; pm.fills = [];
  const pmCircle = makeEllipse("Circle", 16, 16, solid(C.cyan)); pmCircle.x = 4; pmCircle.y = 8;
  const pmDir = figma.createPolygon();
  pmDir.name = "Direction"; pmDir.pointCount = 3; pmDir.resize(10, 10); pmDir.x = 7; pmDir.y = 0;
  pmDir.fills = solid(C.white);
  pm.appendChild(pmDir); pm.appendChild(pmCircle);
  minimap.appendChild(pm);
  frame.appendChild(minimap);

  // PlayerHUD (bottom-6 left-6 = 24px · w-48 h-5 = 192×20)
  const playerHUD = makeAutoFrame("PlayerHUD", "VERTICAL", { gap: 4 });
  playerHUD.x = 24; playerHUD.y = 1080 - 24 - 68;

  addText(playerHUD, "HP", { style: "Bold", size: 11, color: C.white, opacity: 0.8, letterSpacingPct: 20 });

  const hpTrack = makeAutoFrame("HPBar", "HORIZONTAL", {
    fills: solid(C.black, 0.6),
    stroke: solid(C.white, 0.3), strokeWeight: 2,
    clips: true,
  });
  hpTrack.primaryAxisSizingMode = "FIXED"; hpTrack.counterAxisSizingMode = "FIXED"; hpTrack.resize(192, 20);
  hpTrack.appendChild(makeRect("HPFill", 150, 20, solid(C.green)));
  playerHUD.appendChild(hpTrack);
  addText(playerHUD, "100 / 100", { style: "Bold", size: 13, color: C.white });
  frame.appendChild(playerHUD);

  // WeaponHUD (bottom-6 right-6 = 24px)
  const weaponHUD = makeAutoFrame("WeaponHUD", "VERTICAL", { gap: 4 });
  const weaponSlots = [
    { idx: 1, label: "AR-15  30/30", active: true },
    { idx: 2, label: "Primary 2", active: false },
    { idx: 3, label: "Sidearm", active: false },
    { idx: 4, label: "Melee", active: false },
    { idx: 5, label: "Grenade", active: false },
  ];
  for (const { idx, label, active } of weaponSlots) {
    const row = makeAutoFrame(`Slot/${idx}`, "HORIZONTAL", { gap: 8 });
    row.counterAxisAlignItems = "CENTER";
    addText(row, String(idx), { style: "Bold", size: 13, color: C.white, opacity: active ? 1 : 0.4 });
    addText(row, label, { style: "Bold", size: 13, color: C.white, opacity: active ? 1 : 0.4 });
    weaponHUD.appendChild(row);
  }
  weaponHUD.x = 1920 - 24 - 220; weaponHUD.y = 1080 - 24 - 130;
  frame.appendChild(weaponHUD);

  page.appendChild(frame);
}

// ── Page 5: Inventory HUD (1920×1080) ──────────────────────────

async function createInventoryHUDPage() {
  const page = figma.createPage();
  page.name = "Page 5: Inventory HUD";

  const frame = figma.createFrame();
  frame.name = "InventoryHUD"; frame.resize(1920, 1080); frame.fills = solid(C.charcoalMuted, 0.8); frame.clipsContent = true;

  // 반투명 오버레이 (bg-brand-beige-mid/40 backdrop-blur-sm)
  frame.appendChild(makeRect("Overlay", 1920, 1080, solid(C.beigeMid, 0.4)));

  // 인벤토리 패널 (p-1 gap-1)
  const panel = figma.createFrame();
  panel.name = "InventoryPanel"; panel.resize(1920, 1080); panel.x = 0; panel.y = 0;
  panel.layoutMode = "VERTICAL"; panel.itemSpacing = 4;
  panel.paddingLeft = 4; panel.paddingRight = 4; panel.paddingTop = 4; panel.paddingBottom = 4;
  panel.fills = []; panel.primaryAxisSizingMode = "FIXED"; panel.counterAxisSizingMode = "FIXED";

  // 헤더 "INVENTORY"
  const invHdr = figma.createFrame();
  invHdr.name = "InventoryHeader"; invHdr.resize(1912, 28);
  invHdr.layoutMode = "HORIZONTAL"; invHdr.paddingLeft = 12; invHdr.counterAxisAlignItems = "CENTER";
  invHdr.fills = solid(C.charcoal);
  invHdr.primaryAxisSizingMode = "FIXED"; invHdr.counterAxisSizingMode = "FIXED";
  addText(invHdr, "INVENTORY", { style: "Bold", size: 11, color: C.beige, letterSpacingPct: 20 });
  panel.appendChild(invHdr);

  // 바디 그리드 (7열: 1 드롭존 · 1 인벤토리 · 3 캐릭터 · 2 무기슬롯)
  const bodyH = 1080 - 4 * 2 - 28 - 4;
  const bodyGrid = figma.createFrame();
  bodyGrid.name = "InventoryGrid"; bodyGrid.resize(1912, bodyH); bodyGrid.x = 0; bodyGrid.y = 0;
  bodyGrid.layoutMode = "HORIZONTAL"; bodyGrid.itemSpacing = 4;
  bodyGrid.paddingLeft = 32; bodyGrid.paddingRight = 32; bodyGrid.paddingTop = 32; bodyGrid.paddingBottom = 32;
  bodyGrid.fills = []; bodyGrid.primaryAxisSizingMode = "FIXED"; bodyGrid.counterAxisSizingMode = "FIXED";

  const innerH = bodyH - 64;
  const colUnit = (1912 - 64 - 4 * 6) / 7; // ≈ 235px

  // Col 1: 드롭존
  const dropZone = figma.createFrame();
  dropZone.name = "DropZone"; dropZone.resize(colUnit, innerH);
  dropZone.fills = solid(C.beigeDark, 0.1); dropZone.strokes = solid(C.beigeDark, 0.3); dropZone.strokeWeight = 1;
  const dz = makeText("DROP ZONE", { size: 10, color: C.charcoalLight, opacity: 0.4 });
  dz.x = colUnit / 2 - 30; dz.y = innerH / 2 - 10; dropZone.appendChild(dz);
  bodyGrid.appendChild(dropZone);

  // Col 2: 인벤토리 리스트
  const invList = makeAutoFrame("InventoryList", "VERTICAL", { gap: 4, p: 4, clips: true });
  invList.primaryAxisSizingMode = "FIXED"; invList.counterAxisSizingMode = "FIXED"; invList.resize(colUnit, innerH);
  const items = ["AR-15", "M9 Pistol", "Frag Grenade", "Ammo Box", "Med Kit"];
  for (const item of items) {
    const slot = makeAutoFrame(`Item/${item}`, "HORIZONTAL", {
      fills: solid(C.beige), stroke: solid(C.charcoal, 0.2), strokeWeight: 1,
    });
    slot.primaryAxisAlignItems = "CENTER"; slot.counterAxisAlignItems = "CENTER";
    slot.primaryAxisSizingMode = "FIXED"; slot.counterAxisSizingMode = "FIXED"; slot.resize(colUnit - 8, 40);
    addText(slot, item, { size: 10, color: C.charcoal });
    invList.appendChild(slot);
  }
  bodyGrid.appendChild(invList);

  // Col 3-5: 캐릭터 프리뷰
  const charPreview = makeAutoFrame("CharacterPreview", "HORIZONTAL", {
    fills: solid(C.beigeMid, 0.1), stroke: solid(C.charcoal, 0.1), strokeWeight: 1,
  });
  charPreview.primaryAxisAlignItems = "CENTER"; charPreview.counterAxisAlignItems = "CENTER";
  charPreview.primaryAxisSizingMode = "FIXED"; charPreview.counterAxisSizingMode = "FIXED";
  charPreview.resize(colUnit * 3 + 4 * 2, innerH);
  addText(charPreview, "캐릭터", { size: 14, color: C.charcoal, opacity: 0.3 });
  bodyGrid.appendChild(charPreview);

  // Col 6-7: 무기 슬롯 5개
  const slotConfigs = [
    { id: "primary1", label: "Primary 1" },
    { id: "primary2", label: "Primary 2" },
    { id: "sidearm",  label: "Sidearm" },
    { id: "melee",    label: "Melee" },
    { id: "throwable", label: "Throwable" },
  ];
  const wSlotsPanel = makeAutoFrame("WeaponSlots", "VERTICAL", { gap: 4 });
  wSlotsPanel.primaryAxisSizingMode = "FIXED"; wSlotsPanel.counterAxisSizingMode = "FIXED";
  wSlotsPanel.resize(colUnit * 2 + 4, innerH);
  const slotH = (innerH - 4 * 4) / 5;
  for (const { id, label } of slotConfigs) {
    const ws = makeAutoFrame(`WeaponSlot/${id}`, "HORIZONTAL", {
      fills: solid(C.beige, 0.5), stroke: solid(C.charcoal, 0.1), strokeWeight: 1,
    });
    ws.primaryAxisAlignItems = "CENTER"; ws.counterAxisAlignItems = "CENTER";
    ws.primaryAxisSizingMode = "FIXED"; ws.counterAxisSizingMode = "FIXED";
    ws.resize(colUnit * 2 + 4, slotH);
    addText(ws, label.toUpperCase(), { style: "Bold", size: 10, color: C.charcoal, opacity: 0.3 });
    wSlotsPanel.appendChild(ws);
  }
  bodyGrid.appendChild(wSlotsPanel);

  panel.appendChild(bodyGrid);
  frame.appendChild(panel);
  page.appendChild(frame);
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  await loadFonts();

  // Page 1: 기존 페이지 재사용 (Design System)
  const page1 = figma.root.children[0];
  await createDesignSystemPage(page1);

  // Pages 2–5: 신규 생성
  await createHeroScreenPage();
  await createLobbyScreenPage();
  await createGameHUDPage();
  await createInventoryHUDPage();

  figma.closePlugin("RE-World UI 생성 완료 — 5개 페이지 생성됨");
}

main().catch((err) => figma.closePlugin("오류: " + err.message));
