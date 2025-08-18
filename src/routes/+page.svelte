<!-- MicroMatch Landing Page -->
<!--TODO: Add social media links-->
<script lang="ts">
  import Icon from "@iconify/svelte";
  import TaskCard from "$lib/components/TaskCard.svelte";
  import Button from "@smui/button";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import { page } from '$app/state';
  export let data;
</script>

<svelte:head>
  <title>MicroMatch</title>
  <meta name="description" content="Join MicroMatch to find micro-volunteering tasks from NGOs. Learn new skills and make a difference in just a few minutes." />
</svelte:head>

<main class="landing-page" style="width: 100vw; margin-left: calc(-50vw + 50%); position: relative;">
  <!-- Hero Section -->
  <section class="hero">
    <div class="theme-toggle-container">
      <ThemeToggle />
    </div>
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">Make a Big&nbsp;Impact<br />in a Few Minutes</h1>
        <p class="hero-subtitle">MicroMatch connects you with bite-sized volunteer tasks from NGOs, complete with just-in-time learning to help you make a difference.</p>
        <div class="hero-actions">
          <Button href="/tasks" variant="unelevated" class="btn-primary hero-cta">
            <Icon icon="mdi:magnify" width="20" height="20" class="icon" />
            Browse Tasks
          </Button>
          {#if page.data.userRole === 'ngo'}
            <Button href="/org" variant="outlined" class="btn-secondary">
              <Icon icon="mdi:plus-circle-outline" width="20" height="20" class="icon" />
              Post a Task
            </Button>
          {/if}
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-illustration">
          <div class="floating-card card-1">
            <Icon icon="mdi:translate" width="24" height="24" />
            <span>Translation Task</span>
          </div>
          <div class="floating-card card-2">
            <Icon icon="mdi:design" width="24" height="24" />
            <span>Design Help</span>
          </div>
          <div class="floating-card card-3">
            <Icon icon="mdi:data-matrix" width="24" height="24" />
            <span>Data Entry</span>
          </div>
          <div class="hero-icon">
            <img src="/logo.png" alt="MicroMatch Logo" width="140" height="140" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="how-it-works">
    <div class="section-header">
      <h2>How It Works</h2>
      <p>A simple, effective way to make a difference</p>
    </div>
    <div class="steps-container">
      <div class="step">
        <div class="step-icon">
          <Icon icon="mdi:magnify" width="32" height="32" />
        </div>
        <div class="step-content">
          <h3>1. Find a Task</h3>
          <p>Browse our feed of bite-sized tasks and find one that matches your skills and interests.</p>
        </div>
      </div>
      <div class="step-connector"></div>
      <div class="step">
        <div class="step-icon">
          <Icon icon="mdi:school-outline" width="32" height="32" />
        </div>
        <div class="step-content">
          <h3>2. Learn & Complete</h3>
          <p>Access just-in-time learning resources from DataCamp & Educative to complete the task successfully.</p>
        </div>
      </div>
      <div class="step-connector"></div>
      <div class="step">
        <div class="step-icon">
          <Icon icon="mdi:trophy-outline" width="32" height="32" />
        </div>
        <div class="step-content">
          <h3>3. Earn Recognition</h3>
          <p>Submit your work, get it approved by the NGO, and earn a badge for your contribution.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Tasks Section -->
  <section class="featured-tasks">
    <div class="section-header">
      <h2>Featured Tasks</h2>
      <p>Start making a difference today</p>
    </div>
    <div class="task-grid">
      {#if data.tasks && data.tasks.length > 0}
        {#each data.tasks as task}
          <TaskCard 
            id={task.id} 
            title={task.title} 
            shortDescription={task.shortDescription} 
            tags={task.tags} 
            estimatedMinutes={task.estimatedMinutes} 
            language={task.language} 
            href={`/task/${task.id}`} 
          />
        {/each}
      {:else}
        <div class="empty-state">
          <Icon icon="mdi:flask-empty-outline" width="64" height="64" />
          <h3>No tasks available right now</h3>
          <p>Please check back later for new opportunities to make a difference.</p>
        </div>
      {/if}
    </div>
  </section>

  <!-- Features Section -->
  <section class="features">
    <div class="features-content">
      <div class="features-text">
        <h2>Mobilize your community, one task at a time</h2>
        <p>NGOs and community projects can break down their needs into bite-sized tasks that volunteers can complete quickly. From translating a paragraph to tagging images, MicroMatch makes it easy to get the help you need.</p>
        <div class="features-list">
          <div class="feature-item">
            <Icon icon="mdi:check-circle-outline" width="24" height="24" />
            <span>Auto-translation for global reach</span>
          </div>
          <div class="feature-item">
            <Icon icon="mdi:check-circle-outline" width="24" height="24" />
            <span>Just-in-time learning resources</span>
          </div>
          <div class="feature-item">
            <Icon icon="mdi:check-circle-outline" width="24" height="24" />
            <span>Gamified progress tracking</span>
          </div>
          <div class="feature-item">
            <Icon icon="mdi:check-circle-outline" width="24" height="24" />
            <span>Verified NGO partnerships</span>
          </div>
        </div>
      </div>
      <div class="features-visual">
        <div class="feature-showcase">
          <div class="showcase-item">
            <Icon icon="mdi:earth" width="48" height="48" />
            <h4>Global Impact</h4>
            <p>Tasks available in 25+ countries</p>
          </div>
          <div class="showcase-item">
            <Icon icon="mdi:lightning-bolt" width="48" height="48" />
            <h4>Quick Tasks</h4>
            <p>Complete in 15-30 minutes</p>
          </div>
          <div class="showcase-item">
            <Icon icon="mdi:shield-check" width="48" height="48" />
            <h4>Verified NGOs</h4>
            <p>Trusted community partners</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta">
    <div class="cta-content">
      <h2>Ready to make a difference?</h2>
      <p>Join thousands of volunteers making an impact, one task at a time.</p>
      <div class="cta-actions">
        <Button href="/tasks" variant="unelevated" class="btn-primary cta-primary">
          Find a Task Now
          <Icon icon="mdi:arrow-right" width="20" height="20" class="icon" />
        </Button>
        <Button href="/signup" variant="outlined" class="btn-secondary">
          Create Account
        </Button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-brand">
        <div class="footer-logo">
          <img src="/logo.png" alt="MicroMatch Logo" width="32" height="32" />
          <span>MicroMatch</span>
        </div>
        <p>Connecting volunteers with bite-sized tasks for maximum impact.</p>
        <div class="social-links">
          <a href="#" aria-label="Twitter">
            <Icon icon="logos:x" width="20" height="20" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Icon icon="mdi:linkedin" width="24" height="24" />
          </a>
          <a href="#" aria-label="GitHub">
            <Icon icon="mdi:github" width="24" height="24" />
          </a>
        </div>
      </div>
      <div class="footer-links">
        <div class="link-group">
          <h4>Platform</h4>
          <a href="/tasks">Browse Tasks</a>
          {#if page.data.userRole === 'ngo'}
            <a href="/org">Post Tasks</a>
          {/if}
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Sign In</a>
        </div>
        <div class="link-group">
          <h4>Resources</h4>
          <a href="https://bump.sh/link-to-your-docs">API Docs</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/help">Help Center</a>
        </div>
        <div class="link-group">
          <h4>Legal</h4>
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookie Policy</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2025 MicroMatch. All rights reserved.</p>
    </div>
  </footer>
</main>

<style>
  .landing-page {
    width: 100%;
    overflow-x: hidden;
  }

  /* Hero Section */
  .hero {
    padding: 0 var(--space-4);
    background: var(--color-background); /* Adapts to light/dark mode */
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .theme-toggle-container {
    position: absolute;
    top: var(--space-4);
    right: var(--space-4);
    z-index: 10;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    font-size: clamp(var(--text-3xl), 5vw, 4rem);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
    margin-bottom: var(--space-6);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: #ffffff; /* White text color */
  }

  .hero-subtitle {
    font-size: var(--text-xl);
    line-height: var(--leading-relaxed);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-8);
    font-weight: var(--font-normal);
    color: var(--color-text-secondary);
  }

  .hero-actions {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-12);
    flex-wrap: wrap;
  }

  .hero-illustration {
    position: relative;
    width: 300px;
    height: 300px;
  }

  .hero-icon {
    position: absolute;
    top: 47%;
    left: 68%;
    transform: translate(-50%, -50%);
    color: var(--color-primary);
    opacity: 0.8;
  }

  .floating-card {
    position: absolute;
    background: #2a2a2a; /* Darker card background */
    border-radius: var(--radius-lg);
    padding: var(--space-3) var(--space-4);
    box-shadow: var(--elev-2);
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    animation: float 6s ease-in-out infinite;
    border: 1px solid #444444; /* Darker border */
    color: #ffffff; /* White text */
  }

  .card-1 {
    top: 8%;
    left: 10%;
    animation-delay: 0s;
    color: #ffffff;
    z-index: 1;
  }

  .card-2 {
    top: 50%;
    right: -45%;
    animation-delay: 2s;
    color: var(--color-secondary);
    z-index: 3;
  }

  .card-3 {
    bottom: 8%;
    left: 26%;
    animation-delay: 4s;
    color: var(--color-success);
    z-index: 2;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  /* Section Styles */
  section {
    padding: var(--space-20) var(--space-4);
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-16);
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .section-header h2 {
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-4);
    color: var(--color-text);
  }

  .section-header p {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  /* How It Works */
  .how-it-works {
    background: var(--color-surface);
  }

  .steps-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-8);
  }

  .step {
    flex: 1;
    text-align: center;
    max-width: 280px;
  }

  .step-icon {
    width: 80px;
    height: 80px;
    border-radius: var(--radius-2xl);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--space-6);
    color: white;
    box-shadow: var(--elev-2);
  }

  .step-content h3 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-3);
    color: var(--color-text);
  }

  .step-content p {
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
  }

  .step-connector {
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
    border-radius: var(--radius-full);
    opacity: 0.3;
  }

  /* Featured Tasks */
  .featured-tasks {
    background: var(--color-background);
  }

  .task-grid {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--space-6);
  }

  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-16) 0;
    color: var(--color-text-secondary);
  }

  .empty-state :global(svg) {
    margin-bottom: var(--space-6);
    opacity: 0.5;
  }

  .empty-state h3 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-2);
    color: var(--color-text);
  }

  /* Features */
  .features {
    background: var(--color-surface-variant);
  }

  .features-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-16);
    align-items: center;
  }

  .features-text h2 {
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-6);
    color: var(--color-text);
  }

  .features-text p {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-8);
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-text);
    font-weight: var(--font-medium);
  }

  .feature-item :global(svg) {
    color: var(--color-success);
    flex-shrink: 0;
  }

  .feature-showcase {
    display: grid;
    gap: var(--space-6);
  }

  .showcase-item {
    background: var(--color-surface);
    padding: var(--space-6);
    border-radius: var(--radius-xl);
    text-align: center;
    box-shadow: var(--elev-1);
    border: 1px solid var(--color-outline-variant);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .showcase-item:hover {
    box-shadow: var(--elev-2);
    transform: translateY(-2px);
  }

  .showcase-item :global(svg) {
    color: var(--color-primary);
    margin-bottom: var(--space-4);
  }

  .showcase-item h4 {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-2);
    color: var(--color-text);
  }

  .showcase-item p {
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  /* CTA */
  .cta {
    background: var(--color-surface);
    text-align: center;
  }

  .cta-content h2 {
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-4);
    color: var(--color-text);
  }

  .cta-content p {
    font-size: var(--text-lg);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-8);
  }

  .cta-actions {
    display: flex;
    gap: var(--space-4);
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Footer */
  .footer {
    background: var(--color-surface-container);
    padding: var(--space-16) var(--space-4) var(--space-8);
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--space-16);
  }

  .footer-logo {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .footer-logo span {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-primary);
  }

  .footer-brand p {
    color: var(--color-text-secondary);
    line-height: var(--leading-relaxed);
    margin-bottom: var(--space-6);
  }

  .social-links {
    display: flex;
    gap: var(--space-3);
  }

  .social-links a {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--color-surface-variant);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-secondary);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .social-links a:hover {
    background: var(--color-primary);
    color: white;
    transform: translateY(-2px);
  }

  .footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-8);
  }

  .link-group h4 {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    margin-bottom: var(--space-4);
    color: var(--color-text);
  }

  .link-group a {
    display: block;
    color: var(--color-text-secondary);
    text-decoration: none;
    margin-bottom: var(--space-3);
    transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .link-group a:hover {
    color: var(--color-primary);
  }

  .footer-bottom {
    max-width: 1200px;
    margin: var(--space-12) auto 0;
    padding-top: var(--space-8);
    border-top: 1px solid var(--color-outline-variant);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text-secondary);
    font-size: var(--text-sm);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .hero-content,
    .features-content {
      grid-template-columns: 1fr;
      gap: var(--space-12);
      text-align: center;
    }

    .steps-container {
      flex-direction: column;
      gap: var(--space-12);
    }

    .step-connector {
      width: 2px;
      height: 40px;
      transform: rotate(90deg);
    }

    .footer-content {
      grid-template-columns: 1fr;
      gap: var(--space-12);
      text-align: center;
    }

    .footer-links {
      grid-template-columns: repeat(2, 1fr);
    }

    .footer-bottom {
      flex-direction: column;
      gap: var(--space-4);
      text-align: center;
    }
  }

  @media (max-width: 640px) {
    section {
      padding: var(--space-16) var(--space-4);
    }

    .hero {
      padding: var(--space-12) var(--space-4) var(--space-16);
    }

    .hero-actions {
      flex-direction: column;
      align-items: stretch;
    }

    .task-grid {
      grid-template-columns: 1fr;
    }

    .footer-links {
      grid-template-columns: 1fr;
    }

    .cta-actions {
      flex-direction: column;
      align-items: stretch;
    }
  }

  /* Button Overrides */
  :global(.btn-primary) {
    background: linear-gradient(135deg, var(--color-primary), var(--color-primary-variant)) !important;
    color: var(--color-on-primary) !important;
    border: none !important;
    font-weight: var(--font-semibold) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-size: var(--text-lg) !important;
    padding: var(--space-4) var(--space-8) !important;
    border-radius: var(--radius-xl) !important;
    text-decoration: none !important;
  }

  :global(.btn-primary:hover) {
    background: linear-gradient(135deg, var(--color-primary-variant), var(--color-primary-light)) !important;
    transform: translateY(-2px) !important;
    box-shadow: var(--elev-2) !important;
    background-color: #005bb5 !important; /* Darker blue on hover */
  }
  
  :global(.btn-primary .icon) {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  :global(.btn-primary:hover .icon) {
    transform: translateX(4px);
  }

  :global(.btn-secondary) {
    border: 2px solid var(--color-primary) !important;
    color: var(--color-primary) !important;
    background: transparent !important;
    font-weight: var(--font-semibold) !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-size: var(--text-lg) !important;
    padding: var(--space-4) var(--space-8) !important;
    border-radius: var(--radius-xl) !important;
    text-decoration: none !important;
    border-color: #007bff !important; /* Blue border */
    color: #007bff !important; /* Blue text */
  }

  :global(.btn-secondary:hover) {
    background: var(--color-primary) !important;
    color: var(--color-on-primary) !important;
    transform: translateY(-2px) !important;
    box-shadow: var(--elev-1) !important;
    background-color: #007bff !important; /* Blue background on hover */
    color: #ffffff !important; /* White text on hover */
  }
</style>