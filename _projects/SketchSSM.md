---
layout: page
title: SketchSSM
description: Write to the Full State, Read from a Compact Sketch
permalink: /project/SketchSSM/
nav: false
_styles: |
  .sketchssm-page {
    --sketch-orange: #ee922c;
    --sketch-orange-dark: #ad5410;
    --sketch-ink: #17324f;
    max-width: 980px;
    margin: 0 auto;
  }

  .sketchssm-page .paper-meta {
    margin: -0.35rem 0 1.4rem;
    color: var(--global-text-color);
    font-size: 1.02rem;
    line-height: 1.75;
  }

  .sketchssm-page .paper-authors,
  .sketchssm-page .paper-affiliations {
    margin: 0;
    text-align: center;
  }

  .sketchssm-page .paper-affiliations {
    margin-top: 0.35rem;
    color: var(--global-text-color-light);
    font-size: 0.9rem;
  }

  .sketchssm-page .paper-venue {
    width: fit-content;
    margin: 1rem auto 0;
    padding: 0.38rem 0.82rem;
    border: 1px solid color-mix(in srgb, var(--sketch-orange) 62%, transparent);
    border-radius: 999px;
    background: color-mix(in srgb, var(--sketch-orange) 10%, transparent);
    color: var(--sketch-orange-dark);
    font-size: 0.86rem;
    font-weight: 650;
    letter-spacing: 0.01em;
  }

  html[data-theme='dark'] .sketchssm-page .paper-venue {
    color: #ffc176;
  }

  .sketchssm-page .paper-links {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.65rem;
    margin: 1.3rem 0 2rem;
  }

  .sketchssm-page .paper-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 1rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 0.55rem;
    color: var(--sketch-ink);
    font-weight: 650;
    text-decoration: none;
    transition: transform 160ms ease, border-color 160ms ease, color 160ms ease;
  }

  html[data-theme='dark'] .sketchssm-page .paper-link {
    color: #dceaff;
  }

  .sketchssm-page .paper-link:hover {
    transform: translateY(-2px);
    border-color: var(--sketch-orange);
    color: var(--sketch-orange-dark);
  }

  .sketchssm-page .paper-figure {
    overflow: hidden;
    margin: 0 0 2.2rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 0.8rem;
    background: #fff;
  }

  .sketchssm-page .paper-figure img {
    display: block;
    width: 100%;
    height: auto;
  }

  .sketchssm-page .paper-section {
    margin-top: 2.2rem;
  }

  .sketchssm-page .paper-section h2 {
    margin-bottom: 0.8rem;
    color: var(--sketch-ink);
    font-size: 1.45rem;
  }

  html[data-theme='dark'] .sketchssm-page .paper-section h2 {
    color: #dceaff;
  }

  .sketchssm-page .paper-section p {
    line-height: 1.75;
  }

  .sketchssm-page .takeaway {
    padding: 1.15rem 1.3rem;
    border-left: 4px solid var(--sketch-orange);
    border-radius: 0 0.55rem 0.55rem 0;
    background: color-mix(in srgb, var(--sketch-orange) 8%, var(--global-bg-color));
    font-size: 1.04rem;
  }

  @media (max-width: 575px) {
    .sketchssm-page .paper-meta {
      font-size: 0.94rem;
    }

    .sketchssm-page .paper-affiliations span {
      display: block;
    }

    .sketchssm-page .paper-venue {
      text-align: center;
    }
  }
---

<div class="sketchssm-page">
  <div class="paper-meta">
    <p class="paper-authors">
      <strong>Omin Kwon</strong><sup>1</sup>, JoongWon Shin<sup>1</sup>, Minseo Kim<sup>2</sup>, Kurt Keutzer<sup>2</sup>,
      Sehoon Kim<sup>3,*</sup>, and Jae W. Lee<sup>1,*</sup>
    </p>
    <p class="paper-affiliations">
      <span><sup>1</sup>Seoul National University</span> ·
      <span><sup>2</sup>University of California, Berkeley</span> ·
      <span><sup>3</sup>KAIST</span>
      <br>
      <span><sup>*</sup>Co-corresponding authors</span>
    </p>
    <p class="paper-venue">NeurIPS 2026 LCFM Workshop · Extended version under review</p>
  </div>

  <div class="paper-links" aria-label="Paper resources">
    <a class="paper-link" href="{{ '/project/SketchSSM/' | relative_url }}">
      <i class="fa-solid fa-house" aria-hidden="true"></i> Project
    </a>
    <a class="paper-link" href="https://arxiv.org/abs/2609.33051" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-file-lines" aria-hidden="true"></i> Paper
    </a>
    <a class="paper-link" href="https://github.com/SNU-ARC/SketchSSM" target="_blank" rel="noopener noreferrer">
      <i class="fa-brands fa-github" aria-hidden="true"></i> Code
    </a>
    <a class="paper-link" href="https://huggingface.co/SketchSSM" target="_blank" rel="noopener noreferrer">
      <i class="fa-solid fa-database" aria-hidden="true"></i> Data
    </a>
  </div>

  <figure class="paper-figure">
    <img
      src="{{ '/assets/img/publication_preview/img_sketchssm.png' | relative_url }}"
      alt="Overview of SketchSSM state-read sketching and flush scheduling"
      loading="eager"
    >
  </figure>

  <section class="paper-section" aria-labelledby="sketchssm-overview">
    <h2 id="sketchssm-overview">Overview</h2>
    <p class="takeaway">
      <strong>SketchSSM writes to the full recurrent state, but serves most reads from a compact sketch.</strong>
      This reduces the memory traffic that limits high-throughput inference in hybrid-attention models.
    </p>
    <p>
      Hybrid-attention models replace many softmax-attention layers with linear attention, enabling larger decode batches but
      making recurrent-state access a growing bottleneck. SketchSSM keeps exact full-state updates while precomputing a compact
      set of basis outputs at each update. Later decode steps reconstruct their outputs from this sketch, avoiding repeated
      full-state reads while the state remains unchanged.
    </p>
  </section>

  <section class="paper-section" aria-labelledby="sketchssm-results">
    <h2 id="sketchssm-results">Highlights</h2>
    <p>
      Across Mamba-2-, GDN-, and KDA-based models, SketchSSM reduces state-access traffic by approximately 10× while largely
      preserving accuracy. On an NVIDIA B300, it achieves up to 7.78× linear-attention kernel speedup and up to 2.64× higher
      decode throughput on Nemotron 3 Super.
    </p>
  </section>
</div>
