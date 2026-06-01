<script>
  import logoPng from '../assets/logos/dalandan-transparent-cropped.png';
</script>

<main class="wiki-page">
  <article class="wiki-article">
    <h1 class="wiki-title">DalanDan</h1>
    <p class="wiki-tagline">From Wikipedia, the free encyclopedia</p>

    <div class="wiki-content-wrapper">
      <aside class="wiki-infobox">
        <div class="infobox-header">DalanDan</div>
        <div class="infobox-image">
          <img src={logoPng} alt="DalanDan Studio Logo" />
          <span class="infobox-caption">That's me!</span>
        </div>
        <table class="infobox-table">
          <tbody>
            <tr>
              <th scope="row">Born</th>
              <td>Quite some time ago<br><span class="sub-text">(currently in his 20s)</span></td>
            </tr>
            <tr>
              <th scope="row">Location</th>
              <td><span class="flag-icon"><svg width="20" height="14" viewBox="0 0 20 14" style="display:inline-block; vertical-align:middle; border-radius:2px; margin-right:4px;"><rect width="20" height="7" fill="#0038A8"/><rect y="7" width="20" height="7" fill="#CE1126"/><polygon points="0,0 8,7 0,14" fill="white"/><circle cx="2.5" cy="7" r="1.2" fill="#FCD116"/><circle cx="2.5" cy="3.5" r="0.6" fill="#FCD116"/><circle cx="2.5" cy="10.5" r="0.6" fill="#FCD116"/><circle cx="5.5" cy="7" r="0.6" fill="#FCD116"/></svg></span>Manila, Philippines</td>
            </tr>
            <tr>
              <th scope="row">Occupation</th>
              <td>DevOps Engineer</td>
            </tr>
            <tr>
              <th scope="row">Years active</th>
              <td>Late 2017 – present</td>
            </tr>
            <tr>
              <th scope="row">Known for</th>
              <td>Digital art, Music production, Web development</td>
            </tr>
            <tr>
              <th scope="row">Website</th>
              <td><a href="#/">www.dalandan-studio.com</a></td>
            </tr>
          </tbody>
        </table>
      </aside>

      <div class="wiki-body">
        <p class="wiki-lead">
          <b>DalanDan</b> is an artist, musician, and self-described computer geek whose work spans
          digital illustration, music production, and computer coding.
        </p>

        <section class="wiki-section">
          <h2>Early life</h2>
          <p>
            A Filipino by nationality, DalanDan was raised in Singapore, where he developed a lasting
            appreciation for diverse cultures and perspectives. He enjoys meeting people from around the
            world, exploring new places, and learning about their stories and traditions.
          </p>
        </section>

        <section class="wiki-section">
          <h2>Career</h2>
          <h3>Art</h3>
          <p>
            DalanDan's interest in digital art began during his teenage years, after trying out his
            sister's Wacom CTH-480 tablet. What started as a curiosity gradually grew into a lasting
            passion, though he still considers himself an aspiring artist working to improve his craft.
            In November 2025, he invested in an XP-Pen Artist 15.6 Pro v2, finally equipping himself
            with a dedicated display tablet to take his work further.
          </p>
          <h3>Music</h3>
          <p>
            Music has been part of DalanDan's life since childhood. In 2008, at the age of seven, his
            parents enrolled him in piano lessons. Although he initially resisted the routine of
            practice, he eventually developed a deep appreciation for classical and Romantic piano
            music, as well as orchestral compositions. Among his favorite pieces are Debussy's
            <i>Clair de Lune</i> and Chopin's <i>Nocturne in C-sharp minor</i>.
          </p>
          <p>
            His interest later expanded into music production. After acquiring a laptop capable of
            running FL Studio, he began experimenting with electronic and experimental sounds. <a href="https://open.spotify.com/artist/4Vxw9rrGU0x853WoFBJngv?si=odM_sNGuTF25zAZt3pnRaQ" target="_blank" rel="noopener noreferrer">A handful
            of his tracks were released on Spotify under the DalanDan name</a>.
          </p>
          <h3>IT & Development</h3>
          <p>
            A longtime fascination with computers — particularly user interfaces and video games —
            eventually led DalanDan into software development. He began coding around 2022, but his
            dedication deepened in late May 2026 after discovering AI-assisted development tools such
            as Windsurf IDE, Devin, and Cascade. Building this website became a turning point that
            inspired him to commit more seriously to programming.
          </p>
        </section>

        <section class="wiki-section">
          <h2>Personal life</h2>
          <p>
            Outside of creative and technical work, DalanDan is an avid runner who has completed two
            full marathons and regularly participates in half marathons and 10K races. He also
            maintains his piano skills, reads widely, and competes in <a href="https://www.chess.com/member/tigerdalandan" target="_blank" rel="noopener noreferrer">chess</a>.
          </p>.
          <p>
            In his leisure time, he plays <i>Valorant</i>,
            <a href="https://tracker.gg/valorant/profile/riot/TigerDalanDanYT%23T1G3R/overview?platform=pc&playlist=competitive&season=ce2783e8-44fc-dd48-3da3-33b5ba6c4a22" target="_blank" rel="noopener noreferrer">where he has reached Diamond 2 at his peak</a>.
          </p>
        </section>

        <section class="wiki-section">
          <h2>See also</h2>
          <ul class="wiki-see-also">
            <li><a href="#/art">Art portfolio</a></li>
            <li><a href="#/music">Music releases</a></li>
            <li><a href="#/it-portfolio">IT portfolio</a></li>
          </ul>
        </section>
      </div>
    </div>
  </article>
</main>

<style>
  .wiki-page {
    flex: 1;
    padding: 2rem 1.5rem;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
    min-height: calc(100vh - 200px);
    color: #000000;
    background-color: #ffffff;
    text-shadow: none;
    animation: fadeInBg 0.4s ease-out;
  }

  @keyframes fadeInBg {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .wiki-article {
    background: transparent;
  }

  .wiki-title {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0.25rem;
    border-bottom: 1px solid #a2a9b1;
    padding-bottom: 0.5rem;
  }

  .wiki-tagline {
    font-size: 0.9rem;
    color: #54595d;
    font-style: italic;
    margin-bottom: 1.5rem;
  }

  .wiki-content-wrapper {
    display: flex;
    flex-direction: row-reverse;
    gap: 2rem;
    align-items: flex-start;
  }

  .wiki-infobox {
    width: 280px;
    flex-shrink: 0;
    background: #f8f9fa;
    border: 1px solid #a2a9b1;
    border-radius: 0.25rem;
    font-size: 0.85rem;
    overflow: hidden;
  }

  .infobox-header {
    background: #eaecf0;
    padding: 0.5rem;
    text-align: center;
    font-weight: bold;
    font-size: 1rem;
  }

  .infobox-image {
    padding: 0.5rem;
    text-align: center;
  }

  .infobox-image img {
    width: 100%;
    max-width: 200px;
    height: auto;
    display: block;
    margin: 0 auto;
    border-radius: 0.25rem;
  }

  .infobox-caption {
    display: block;
    font-size: 0.8rem;
    color: #54595d;
    margin-top: 0.25rem;
  }

  .infobox-table {
    width: 100%;
    border-collapse: collapse;
  }

  .infobox-table th,
  .infobox-table td {
    padding: 0.35rem 0.5rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid #eaecf0;
  }

  .infobox-table th {
    width: 38%;
    font-weight: 600;
  }

  .infobox-table a {
    color: #0645ad;
    text-decoration: none;
  }

  .infobox-table a:hover {
    text-decoration: underline;
  }

  .sub-text {
    font-size: 0.75rem;
    color: #54595d;
  }

  .wiki-body {
    flex: 1;
    min-width: 0;
  }

  .wiki-lead {
    font-size: 1rem;
    line-height: 1.7;
    margin-bottom: 1.5rem;
  }

  .wiki-section {
    margin-bottom: 1.5rem;
  }

  .wiki-section h2 {
    font-size: 1.35rem;
    font-weight: 600;
    border-bottom: 1px solid #a2a9b1;
    padding-bottom: 0.3rem;
    margin-bottom: 0.75rem;
    margin-top: 1.5rem;
  }

  .wiki-section h3 {
    font-size: 1.05rem;
    font-weight: 600;
    margin-top: 1rem;
    margin-bottom: 0.4rem;
  }

  .wiki-section p {
    font-size: 0.95rem;
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  .wiki-see-also {
    list-style: disc;
    padding-left: 1.5rem;
  }

  .wiki-see-also li {
    margin-bottom: 0.35rem;
  }

  .wiki-see-also a {
    color: #0645ad;
    text-decoration: none;
  }

  .wiki-see-also a:hover {
    text-decoration: underline;
  }

  @media (max-width: 1023px) {
    .wiki-content-wrapper {
      flex-direction: column;
    }

    .wiki-infobox {
      width: 100%;
      max-width: 260px;
      margin: 0 auto 1.5rem;
      font-size: 0.75rem;
    }

    .infobox-header {
      padding: 0.35rem;
      font-size: 0.9rem;
    }

    .infobox-image {
      padding: 0.35rem;
    }

    .infobox-image img {
      max-width: 140px;
    }

    .infobox-caption {
      font-size: 0.7rem;
    }

    .infobox-table th,
    .infobox-table td {
      padding: 0.25rem 0.4rem;
    }

    .wiki-title {
      font-size: 1.6rem;
    }

    .wiki-section h2 {
      font-size: 1.2rem;
    }
  }
</style>
