<script lang="ts">
  export let compact = false;
  export let showCopy = true;
</script>

<section class:compact class="brand-stage">
  <div class="grain"></div>
  <div class="glow glow-coral"></div>
  <div class="glow glow-teal"></div>

  <div class="scene-wrap" aria-hidden="true">
    <div class="scene">
      <div class="platform-shadow"></div>
      <div class="platform"></div>
      <svg viewBox="0 0 400 400" class="path">
        <path d="M 110 275 L 110 170 L 260 170 L 260 120" />
        <circle cx="110" cy="275" r="7" class="node-coral" />
        <circle cx="260" cy="120" r="7" class="node-teal" />
      </svg>
      <div class="block teal"></div>
      <div class="block coral"></div>
      <div class="block slate"></div>
    </div>
  </div>

  <div class="shade"></div>
  <div class="content">
    <a href="/" class="logo-lockup">
      <div class="logo-shell">
        <img src="/logo.png" alt="MicroMatch" />
      </div>
      <span>MicroMatch</span>
    </a>

    {#if showCopy}
      <div class="copy">
        <h1>
          Small actions
          <br />
          create
          <br />
          <em>big impact.</em>
        </h1>
        <p>Step into a thriving civic world. Complete bite-sized tasks, build your streak, and help NGOs drive real change in minutes a day.</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .brand-stage {
    position: relative;
    background: #0f172a;
    overflow: hidden;
    min-height: 100vh;
    height: 100%;
    color: #fff;
    isolation: isolate;
  }
  .compact {
    min-height: 240px;
    border-bottom-left-radius: 32px;
    border-bottom-right-radius: 32px;
  }
  .grain {
    position: absolute;
    inset: 0;
    opacity: 0.018;
    background-image: radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0);
    background-size: 4px 4px;
    pointer-events: none;
  }
  .glow {
    position: absolute;
    width: 520px;
    height: 520px;
    border-radius: 999px;
    filter: blur(100px);
    pointer-events: none;
  }
  .glow-coral {
    background: rgba(255, 107, 107, 0.16);
    top: -28%;
    left: -18%;
  }
  .glow-teal {
    background: rgba(72, 188, 174, 0.16);
    bottom: -30%;
    right: -20%;
  }
  .scene-wrap {
    position: absolute;
    top: 12%;
    left: 0;
    right: 0;
    height: 46%;
    display: grid;
    place-items: center;
    pointer-events: none;
    opacity: 0.86;
    transform: none;
  }
  .compact .scene-wrap {
    top: 18%;
    height: 42%;
    transform: scale(0.7);
  }
  .scene {
    width: 360px;
    height: 360px;
    position: relative;
  }
  .platform-shadow {
    position: absolute;
    left: 38px;
    top: 154px;
    width: 272px;
    height: 164px;
    background: rgba(0, 0, 0, 0.6);
    filter: blur(36px);
    border-radius: 30px;
    transform: rotate(-18deg);
  }
  .platform {
    position: absolute;
    left: 42px;
    top: 82px;
    width: 262px;
    height: 164px;
    border-radius: 26px;
    transform: rotate(-18deg);
    background: linear-gradient(160deg, #24364f 0%, #18273a 100%);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .platform::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 26px;
    background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
    background-size: 28px 28px;
  }
  .path {
    position: absolute;
    inset: 0;
  }
  .path path {
    fill: none;
    stroke: #ff6b6b;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 10 10;
    opacity: 0.85;
    filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.7));
  }
  .node-coral {
    fill: #ff6b6b;
    filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.95));
  }
  .node-teal {
    fill: #48bcae;
    filter: drop-shadow(0 0 8px rgba(72, 188, 174, 0.95));
  }
  .block {
    position: absolute;
    border-radius: 16px;
    transform: rotate(-18deg);
    box-shadow: 0 18px 30px rgba(0, 0, 0, 0.35);
  }
  .teal {
    width: 76px;
    height: 76px;
    left: 180px;
    top: 86px;
    background: linear-gradient(160deg, #4ec8bb 0%, #2a9d8f 100%);
  }
  .coral {
    width: 62px;
    height: 62px;
    left: 82px;
    top: 226px;
    background: linear-gradient(160deg, #ff7f7f 0%, #e05a5a 100%);
  }
  .slate {
    width: 48px;
    height: 48px;
    left: 226px;
    top: 226px;
    background: linear-gradient(160deg, #55637a 0%, #334155 100%);
  }
  .shade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 64%;
    background: linear-gradient(to top, rgba(15, 23, 42, 1) 0%, rgba(15, 23, 42, 0.9) 55%, rgba(15, 23, 42, 0) 100%);
    z-index: 2;
    pointer-events: none;
  }
  .content {
    position: relative;
    z-index: 3;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 34px 28px 48px;
  }
  .compact .content {
    padding: 22px 24px;
  }
  .logo-lockup {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 2.75rem;
    width: fit-content;
  }
  .compact .logo-lockup {
    font-size: 1.125rem;
    gap: 8px;
  }
  .logo-shell {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.11);
    backdrop-filter: blur(6px);
  }
  .compact .logo-shell {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }
  .logo-shell img {
    width: 21px;
    height: 21px;
    filter: brightness(0) invert(1);
  }
  .compact .logo-shell img {
    width: 16px;
    height: 16px;
  }
  .copy {
    margin-top: auto;
    max-width: 520px;
    padding-bottom: 20px;
  }
  .copy h1 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(2.95rem, 4.3vw, 4.25rem);
    line-height: 1.08;
    letter-spacing: -0.02em;
  }
  .copy em {
    font-style: italic;
    font-family: Georgia, "Times New Roman", serif;
    font-size: 1.05em;
    font-weight: 500;
    color: #ff8b8b;
  }
  .copy p {
    margin: 20px 0 0;
    color: #94a3b8;
    font-size: 1.32rem;
    line-height: 1.65;
    font-weight: 500;
    max-width: 460px;
  }
  .compact .copy {
    padding-bottom: 0;
  }
  .compact .copy h1 {
    font-size: 1.5rem;
  }
  .compact .copy p {
    display: none;
  }
</style>
