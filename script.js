// script.js — Unified final script (jQuery + modern helpers)
// Requires: jQuery loaded before this script.

$(document).ready(function () {
  console.log('AutoMarket script loaded');

  /* ------------------ THEME (persistent, page-wide) ------------------ */
  const $body = $('body');
  const $themeBtn = $('#theme-toggle');

  function updateThemeButton() {
    if ($body.hasClass('light-theme')) {
      $themeBtn.text('🌙 Night Mode');
    } else {
      $themeBtn.text('☀️ Light Mode');
    }
  }

  function applyThemeFromStorage() {
    const stored = localStorage.getItem('am_theme');
    if (stored === 'light') $body.addClass('light-theme');
    else $body.removeClass('light-theme'); // default = dark glossy
    updateThemeButton();
  }

  applyThemeFromStorage();

  $themeBtn.on('click', function () {
    const nowLight = $body.hasClass('light-theme');
    if (nowLight) {
      $body.removeClass('light-theme');
      localStorage.setItem('am_theme', 'dark');
    } else {
      $body.addClass('light-theme');
      localStorage.setItem('am_theme', 'light');
    }
    updateThemeButton();
  });

  /* ------------------ GREETING + SHOW TIME ------------------ */
  function setGreetingText(text) { $('#greeting-text').text(text); }
  (function greeting() {
    const h = new Date().getHours();
    let txt;
    if (h < 12) txt = 'Good morning! Start your day with AutoMarket 🚗';
    else if (h < 18) txt = 'Good afternoon! Check out our best deals ☀️';
    else txt = 'Good evening! Find your dream car tonight 🌙';
    setGreetingText(txt);
  })();

  $('#show-time').on('click', function () {
    setGreetingText('Current time: ' + new Date().toLocaleTimeString());
  });

  /* ------------------ RATING STARS ------------------ */
  if ($('.hero').length && $('.hero .rating').length === 0) {
    const $ratingDiv = $('<div class="rating" aria-label="rating"></div>');
    $ratingDiv.append('<span style="margin-right:8px;color:#fff;font-weight:700;">Rate our site:</span>');
    for (let i = 1; i <= 5; i++) {
      const $s = $(`<button class="am-star" data-value="${i}" aria-label="${i} star" type="button">☆</button>`);
      $s.css({
        background: 'transparent',
        border: 'none',
        fontSize: '1.4rem',
        cursor: 'pointer',
        color: '#ccc',
        marginRight: '6px'
      });
      $ratingDiv.append($s);
    }
    $('.hero').append($ratingDiv);

    $ratingDiv.on('click', '.am-star', function () {
      const val = Number($(this).data('value'));
      $ratingDiv.find('.am-star').each(function () {
        const v = Number($(this).data('value'));
        if (v <= val) $(this).text('★').css('color', '#FFD700');
        else $(this).text('☆').css('color', '#888');
      });
    });
  }

  /* ------------------ SEARCH FILTER ------------------ */
  const $search = $('#search-input');
  const $suggestions = $('#suggestions');
  const $cards = $('#car-list .card');

  function cardNames() {
    return $cards.map(function () {
      const $c = $(this);
      return ($c.data('name') || $c.find('.card-title').text() || $c.find('img').attr('alt') || '').toString();
    }).get();
  }

  $search.on('keyup', function () {
    const q = $(this).val().trim().toLowerCase();
    $cards.each(function () {
      const $c = $(this);
      const name = ($c.data('name') || $c.find('.card-title').text()).toString().toLowerCase();
      $c.toggle(name.includes(q));
    });

    const matches = cardNames()
      .filter(n => n.toLowerCase().includes(q))
      .filter((v, i, arr) => arr.indexOf(v) === i)
      .slice(0, 5);

    $suggestions.empty();
    if (q.length && matches.length) {
      matches.forEach(m => $suggestions.append($('<li class="suggest-item">').text(m)));
      $suggestions.show();
    } else {
      $suggestions.hide();
    }

    $cards.each(function () {
      const $title = $(this).find('.card-title');
      const raw = $title.text();
      if (q) {
        const re = new RegExp('(' + escapeRegExp(q) + ')', 'ig');
        $title.html(raw.replace(re, '<mark>$1</mark>'));
      } else $title.text(raw);
    });
  });

  $(document).on('click', '.suggest-item', function () {
    const txt = $(this).text();
    $search.val(txt);
    $suggestions.hide();
    $search.trigger('keyup');
  });

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ------------------ RANDOM FACTS ------------------ */
  const facts = [
    'The Toyota Camry is one of the best-selling cars in the world.',
    'BMW stands for Bayerische Motoren Werke (Bavarian Motor Works).',
    'Mercedes-Benz produced the first gasoline-powered car in 1886.',
    'Electric cars were invented in the 19th century — long before modern ICE vehicles.',
    'Regular maintenance greatly extends a car’s service life.',
    'AutoMarket — powered by your trust 🚗'
  ];

  $('#random-fact-btn').on('click', function () {
    const i = Math.floor(Math.random() * facts.length);
    $('#fact-area').fadeOut(120, function () {
      $(this).text(facts[i]).fadeIn(160);
    });
  });

  /* ------------------ LAZY LOADING ------------------ */
  function lazyLoadImages() {
    $('img.lazy').each(function () {
      const $img = $(this);
      const src = $img.attr('data-src');
      if (!src) return;
      const rect = this.getBoundingClientRect();
      if (rect.top < window.innerHeight + 200) {
        $img.attr('src', src).removeClass('lazy');
      }
    });
  }
  $(window).on('scroll load resize', lazyLoadImages);
  lazyLoadImages();

  /* ------------------ CARD IMAGE hover ------------------ */
  $('#car-list').on('mouseenter', '.card-img', function () {
    $(this).css('transform', 'scale(1.05)');
  }).on('mouseleave', '.card-img', function () {
    $(this).css('transform', 'scale(1)');
  });

  /* ------------------ COUNTERS ------------------ */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const animateCounter = (el) => {
      const $el = $(el);
      if ($el.data('done')) return;
      const target = parseInt($el.attr('data-target') || '0', 10);
      $({ countNum: 0 }).animate({ countNum: target }, {
        duration: Math.min(2000, 30 * target),
        easing: 'swing',
        step: function () { $el.text(Math.floor(this.countNum).toLocaleString()); },
        complete: function () { $el.text(this.countNum.toLocaleString()); $el.data('done', true); }
      });
    };

    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(c => obs.observe(c));
    } else counters.forEach(c => animateCounter(c));
  }

  /* ------------------ REVEAL ON SCROLL ------------------ */
  function revealOnScroll() {
    $('#car-list .card').each(function () {
      const rect = this.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) $(this).addClass('show');
    });
  }
  $(window).on('scroll load resize', revealOnScroll);
  revealOnScroll();

  /* ------------------ FORM + TOAST ------------------ */
  function showToast(msg) {
    const $t = $('#toast');
    $t.stop(true).fadeIn(200).text(msg);
    setTimeout(() => $t.fadeOut(400), 2200);
  }

  $('#subscribe-form').on('submit', function (e) {
    e.preventDefault();
    const $btn = $('#submit-btn');
    $btn.prop('disabled', true).text('Please wait...');
    setTimeout(() => {
      $btn.prop('disabled', false).text('Submit');
      showToast('Form submitted successfully ✅');
    }, 1500);
  });

  $('#copy-btn').on('click', function () {
    const txt = $('#text').text();
    navigator.clipboard?.writeText(txt).then(() => {
      showToast('Copied!');
      $(this).text('✔ Copied');
      setTimeout(() => $(this).text('Copy'), 1200);
    }).catch(() => showToast('Copy failed'));
  });

  /* ------------------ PROGRESS BAR ------------------ */
  $(window).on('scroll', function () {
    const scrollTop = $(window).scrollTop();
    const docHeight = $(document).height() - $(window).height();
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    $('#progress-bar').css({ position: 'fixed', top: 0, left: 0, height: '4px', width: pct + '%', background: 'linear-gradient(90deg,#00bfff,#007bff)', zIndex: 9999 });
  });
  $(window).trigger('scroll');

  /* ------------------ BLOG POSTS (NewsAPI) ------------------ */

  const blogContainer = $(".posts");
const apiKey = "9f614a66e3a142758d93be27843281b8";

fetch(`https://newsapi.org/v2/everything?q=car OR cars OR auto OR vehicle&sortBy=publishedAt&language=en&apiKey=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    if (!data || data.status !== "ok" || !data.articles || data.articles.length === 0) {
      blogContainer.html('<p>No car-related news available at the moment. Try again later.</p>');
      return;
    }

    // Очищаем контейнер только если есть статьи
    blogContainer.empty();

    data.articles.forEach(article => {
      const title = article.title || 'No title';
      const desc = article.description || 'No description';
      const img = article.urlToImage || 'default.jpg';
      const url = article.url || '#';
      const date = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '';

      const postHTML = `
        <article class="post" data-title="${title}" data-desc="${desc}" data-img="${img}" data-url="${url}">
          <img src="${img}" alt="${title}">
          <div>
            <h3>${title}</h3>
            <p class="muted">${desc.substring(0, 80)} • <em>${date}</em></p>
            <div style="margin-top:.5rem;">
              <button class="btn btn-outline read-more-btn">Read</button>
            </div>
          </div>
        </article>`;
      blogContainer.append(postHTML);
    });

    // Обработчик кнопок после генерации
    $('.read-more-btn').off('click').on('click', function () {
      const $post = $(this).closest('.post');
      $('#modal-title').text($post.data('title'));
      $('#modal-desc').text($post.data('desc'));
      $('#modal-img').attr('src', $post.data('img')).attr('alt', $post.data('title'));
      $('#modal-link').attr('href', $post.data('url'));
      $('#blog-modal').fadeIn(200);
    });
  })
  .catch(err => {
    console.error("Ошибка загрузки API:", err);
    blogContainer.html('<p>No car-related news available at the moment. Try again later.</p>');
  });


  /* ------------------ MODAL for blog posts ------------------ */
  const $modal = $("#blog-modal");
  const $modalTitle = $("#modal-title");
  const $modalImg = $("#modal-img");
  const $modalDesc = $("#modal-desc");
  const $modalLink = $("#modal-link");

  $(document).on('click', '.read-more-btn', function () {
    const $post = $(this).closest('.post');
    $modalTitle.text($post.data('title'));
    $modalDesc.text($post.data('desc'));
    $modalImg.attr('src', $post.data('img'));
    $modalLink.attr('href', $post.data('url'));
    $modal.fadeIn(200);
  });

  $(".modal-close, #blog-modal").on('click', function(e){
    if(e.target !== this) return;
    $modal.fadeOut(200);
  });

});
