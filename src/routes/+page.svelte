<!-- MicroMatch Landing Page -->
<script lang="ts">
  import Icon from "@iconify/svelte";
  import TaskCard from "$lib/components/TaskCard.svelte";
  export let data;
</script>

<svelte:head>
  <title>MicroMatch - Bite-sized volunteering for a big impact</title>
  <meta name="description" content="Join MicroMatch to find micro-volunteering tasks from NGOs. Learn new skills and make a difference in just a few minutes." />
</svelte:head>

<main>
  <!-- Navigation -->
  <nav class="navigation">
    <a href="/" class="logo">
      <Icon icon="mdi:alpha-n-box-outline" width="32" height="32" />
      <span>Nexcent</span>
    </a>
    <div class="links">
      <a href="/">Home</a>
      <a href="/tasks">Tasks</a>
      <a href="/#features">Features</a>
      <a href="/#testimonials">Testimonials</a>
      <a href="/#faq">FAQ</a>
      </div>
    <div class="actions">
      <a href="/login" class="btn-text">Login</a>
      <a href="/signup" class="btn-primary">Sign Up</a>
      </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-text">
      <h1>Make a Big Impact <br /> in a Few Minutes</h1>
      <p>MicroMatch connects you with bite-sized volunteer tasks from NGOs, complete with just-in-time learning to help you make a difference.</p>
      <a href="/tasks" class="btn-primary">Browse Tasks</a>
    </div>
    <div class="hero-image">
      <Icon icon="mdi:charity" width="256" height="256" />
  </div>
  </section>

  <!-- Clients Section -->
  <section class="clients">
    <h2>Our Clients</h2>
    <p>We have been working with some Fortune 500+ clients</p>
    <div class="logos">
      <Icon icon="logos:google" width="48" height="48" />
      <Icon icon="logos:microsoft" width="48" height="48" />
      <Icon icon="logos:amazon" width="48" height="48" />
      <Icon icon="logos:facebook" width="48" height="48" />
      <Icon icon="logos:apple" width="48" height="48" />
    </div>
  </section>

  <!-- Main Content Section -->
  <section class="main-content">
    <h2>A simple, effective way to make a difference</h2>
    <div class="feature-cards">
      <div class="card">
        <Icon icon="mdi:magnify" width="48" height="48" />
        <h3>Find a Task</h3>
        <p>Browse a feed of micro-tasks from verified NGOs that can be completed in minutes.</p>
      </div>
      <div class="card">
        <Icon icon="mdi:school-outline" width="48" height="48" />
        <h3>Learn a Skill</h3>
        <p>Get just-in-time learning resources from DataCamp & Educative to complete your task.</p>
      </div>
      <div class="card">
        <Icon icon="mdi:check-circle-outline" width="48" height="48" />
        <h3>Earn a Badge</h3>
        <p>Submit your work, get it approved, and earn a badge to showcase your impact.</p>
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="how-it-works">
    <h2>How It Works</h2>
    <div class="steps">
      <div class="step">
        <Icon icon="mdi:magnify" width="48" height="48" />
        <h3>1. Find a Task</h3>
        <p>Browse our feed of bite-sized tasks and find one that matches your skills and interests.</p>
      </div>
      <div class="step">
        <Icon icon="mdi:school-outline" width="48" height="48" />
        <h3>2. Learn a Skill</h3>
        <p>Access just-in-time learning resources to help you complete the task successfully.</p>
      </div>
      <div class="step">
        <Icon icon="mdi:check-circle-outline" width="48" height="48" />
        <h3>3. Make an Impact</h3>
        <p>Submit your work, get it approved by the NGO, and earn a badge for your contribution.</p>
      </div>
    </div>
  </section>

  <!-- Featured Tasks Section -->
  <section class="featured-tasks">
    <h2>Featured Tasks</h2>
    <div class="task-cards">
      {#each data.tasks as task}
        <TaskCard id={task.id} title={task.title} shortDescription={task.shortDescription} tags={task.tags} estimatedMinutes={task.estimatedMinutes} language={task.language} href={`/task/${task.id}`} />
    {/each}
    </div>
    <a href="/tasks" class="btn-secondary">View All Tasks</a>
  </section>

  <!-- Detailed Feature Section -->
  <section class="detailed-feature">
    <div class="image-container">
      <Icon icon="mdi:rocket-launch-outline" width="256" height="256" />
    </div>
    <div class="text-container">
      <h2>Mobilize your community, one task at a time</h2>
      <p>NGOs and community projects can break down their needs into bite-sized tasks that volunteers can complete quickly. From translating a paragraph to tagging images, MicroMatch makes it easy to get the help you need.</p>
      <a href="/org" class="btn-secondary">Post a Task</a>
    </div>
  </section>

  <!-- Business Stats Section -->
  <section class="business-stats">
    <div class="text-container">
      <h2>Join a growing community of changemakers</h2>
      <p>Our platform is already making a difference for NGOs and volunteers alike.</p>
    </div>
    <div class="stats-container">
      <div class="stat">
        <Icon icon="mdi:check-all" width="32" height="32" />
        <div>
          <h3>10,000+</h3>
          <p>Tasks Completed</p>
        </div>
      </div>
      <div class="stat">
        <Icon icon="mdi:hand-heart-outline" width="32" height="32" />
        <div>
          <h3>50+</h3>
          <p>NGOs Helped</p>
        </div>
      </div>
      <div class="stat">
        <Icon icon="mdi:school-outline" width="32" height="32" />
        <div>
          <h3>1,200+</h3>
          <p>Skills Learned</p>
        </div>
      </div>
      <div class="stat">
        <Icon icon="mdi:earth" width="32" height="32" />
        <div>
          <h3>25+</h3>
          <p>Countries</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonial Section -->
  <section class="testimonial">
    <div class="image-container">
      <Icon icon="mdi:account-heart-outline" width="128" height="128" />
    </div>
    <div class="text-container">
      <p>"MicroMatch made it incredibly easy for me to contribute to a cause I care about, even with a busy schedule. I learned a new skill and made a real impact in just a few minutes. It's a brilliant way to volunteer."</p>
      <h4>Jane Doe</h4>
      <p class="muted">Micro-Volunteer</p>
    </div>
  </section>

  <!-- Blog Section -->
  <section class="blog">
    <h2>Read our latest stories</h2>
    <p>Learn more about the impact of micro-volunteering and how you can get involved.</p>
    <div class="blog-cards">
       <div class="blog-card">
        <div class="blog-image"></div>
        <h3>How a single translation helped a community</h3>
        <a href="/">Readmore →</a>
      </div>
      <div class="blog-card">
        <div class="blog-image"></div>
        <h3>5 ways to make a difference in 5 minutes</h3>
        <a href="/">Readmore →</a>
      </div>
      <div class="blog-card">
        <div class="blog-image"></div>
        <h3>The future of volunteering is micro</h3>
        <a href="/">Readmore →</a>
  </div>
</div>
  </section>

  <!-- CTA Section -->
  <section class="cta">
    <h2>Ready to make a difference?</h2>
    <a href="/tasks" class="btn-primary">Find a Task Now →</a>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-content">
      <div class="company-info">
        <a href="/" class="logo">
          <Icon icon="mdi:charity" width="32" height="32" />
          <span>MicroMatch</span>
        </a>
        <p>Copyright © 2025 MicroMatch.</p>
        <p>All rights reserved</p>
        <div class="social-links">
          <a href="/"><Icon icon="mdi:instagram" /></a>
          <a href="/"><Icon icon="mdi:web" /></a>
          <a href="/"><Icon icon="mdi:twitter" /></a>
          <a href="/"><Icon icon="mdi:youtube" /></a>
        </div>
      </div>
      <div class="footer-links">
        <div>
          <h4>MicroMatch</h4>
          <a href="/about">About us</a>
          <a href="/blog">Blog</a>
          <a href="/contact">Contact us</a>
          <a href="/#faq">FAQ</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="/terms">Terms of service</a>
          <a href="/privacy">Privacy policy</a>
          <a href="https://bump.sh/link-to-your-docs">API Docs</a>
        </div>
      </div>
      <div class="subscribe">
        <h4>Stay up to date</h4>
        <input type="email" placeholder="Your email address" />
  </div>
  </div>
  </footer>

</main>

<style>
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: bold;
  }
  .links a, .actions a {
    margin: 0 1rem;
    text-decoration: none;
    color: var(--color-text);
  }
  .hero {
    display: flex;
    align-items: center;
    padding: 4rem 2rem;
    gap: 2rem;
  }
  .hero-text {
    flex: 1;
  }
  .hero-image {
    flex: 1;
    text-align: center;
  }
  .clients {
    text-align: center;
    padding: 4rem 2rem;
  }
  .logos {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
  }
  .main-content {
    text-align: center;
    padding: 4rem 2rem;
  }
  .feature-cards {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  .card {
    padding: 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2);
    text-align: center;
    max-width: 300px;
  }
  .how-it-works {
    text-align: center;
    padding: 4rem 2rem;
  }
  .steps {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  .step {
    max-width: 300px;
  }
  .featured-tasks {
    text-align: center;
    padding: 4rem 2rem;
  }
  .task-cards {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .detailed-feature {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 4rem 2rem;
  }
  .detailed-feature .image-container {
    flex: 1;
    text-align: center;
  }
  .detailed-feature .text-container {
    flex: 1;
  }
  .business-stats {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 4rem 2rem;
    background-color: var(--color-surface-soft);
  }
  .business-stats .text-container {
    flex: 1;
  }
  .business-stats .stats-container {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  .stat {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .testimonial {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding: 4rem 2rem;
  }
  .blog {
    padding: 4rem 2rem;
    text-align: center;
  }
  .blog-cards {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-top: 2rem;
  }
  .blog-card {
    width: 300px;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2);
    overflow: hidden;
  }
  .blog-image {
    height: 150px;
    background-color: var(--color-surface-soft);
  }
  .blog-card h3 {
    padding: 1rem;
  }
  .blog-card a {
    display: block;
    padding: 1rem;
    text-align: center;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: bold;
  }
  .cta {
    padding: 4rem 2rem;
    text-align: center;
    background-color: var(--color-surface-soft);
  }
  .footer {
    padding: 4rem 2rem;
    background-color: var(--color-surface-strong);
    color: var(--color-text-on-strong);
  }
  .footer-content {
    display: flex;
    justify-content: space-between;
  }
  .company-info .logo {
    margin-bottom: 1rem;
  }
  .company-info p {
    margin: 0.5rem 0;
  }
  .social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }
  .social-links a {
    color: var(--color-text-on-strong);
  }
  .footer-links {
    display: flex;
    gap: 4rem;
  }
  .footer-links h4 {
    margin-bottom: 1rem;
  }
  .footer-links a {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text-on-strong);
    text-decoration: none;
  }
  .subscribe input {
    padding: 0.5rem;
    border-radius: var(--radius-md);
    border: none;
  }
</style>