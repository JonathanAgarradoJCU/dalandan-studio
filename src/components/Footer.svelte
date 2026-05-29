<script>
  const startYear = 2026;
  const currentYear = new Date().getFullYear();

  const copyrightText =
    currentYear > startYear
      ? `\u00A9 ${startYear}\u2013${currentYear} DalanDan. All rights reserved.`
      : `\u00A9 ${startYear} DalanDan. All rights reserved.`;
</script>

<footer class="footer">
  <p>{copyrightText}</p>
</footer>

<style>
  .footer {
    text-align: center;
    padding: 2rem 1rem;
    font-size: 0.9rem;
    color: #565656;
    background-color: transparent;
  }
</style>
