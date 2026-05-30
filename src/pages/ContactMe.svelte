<main class="main-content">
  <div class="content-bar">
    <h1>Contact Me</h1>
    <p>Get in touch with DalanDan Studio.</p>
  </div>
</main>

<style>
  .main-content {
    flex: 1;
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 1rem;
    min-height: calc(100vh - 200px);
  }

  .content-bar {
    background-color: rgba(233, 185, 112, 0.9);
    border-radius: 1rem;
    padding: 0;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  }

  .main-content h1 {
    font-size: 2.5rem;
    font-family: Arial, sans-serif;
    font-style: italic;
    padding: 0.5rem 1rem;
  }

  .main-content p {
    font-size: 1.2rem;
    color: #565656;
    padding: 0 1rem 0.5rem 1rem;
  }

  @media (max-width: 768px) {
    .main-content h1 {
      font-size: 1.5rem;
      padding: 0.3rem 0.8rem;
    }

    .main-content p {
      font-size: 1rem;
      padding: 0 0.8rem 0.3rem 0.8rem;
    }
  }
</style>
