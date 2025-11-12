// jquery.js
$(document).ready(function () {
    console.log("jQuery ready — features loaded");
  
    // helper showToast fallback
    if (typeof window.showToast !== 'function') {
      window.showToast = function(msg) {
        const $t = $('#toast');
        if ($t.length === 0) {
          $('body').append('<div id="toast" style="position:fixed;right:18px;bottom:18px;background:rgba(0,0,0,0.8);color:#fff;padding:10px 14px;border-radius:8px;z-index:99999;display:none;"></div>');
        }
        $('#toast').text(msg).fadeIn(200).delay(2000).fadeOut(300);
      };
    }
  
    // Build autocomplete / suggestions based on cars data from script.js (window._AM_cars)
    const dataSource = window._AM_cars || [];
    const names = dataSource.map(c=>c.name);
  
    // Render initial featured cards into search-results (script.js already did, but ensure suggestions aware)
    function updateSuggestionList(q) {
      const matches = names.filter(n => n.toLowerCase().includes(q.toLowerCase())).slice(0,6);
      const $s = $('#suggestions');
      $s.empty();
      if (q.trim() === '' || matches.length === 0) { $s.hide(); return; }
      matches.forEach(m => $s.append(`<li class="suggest-item">${m}</li>`));
      $s.show();
    }
  
    $('#search-input').on('input', function() {
      const q = $(this).val();
      updateSuggestionList(q);
      // live-filter: show only matching cards in #search-results (cards rendered by script.js)
      const term = q.trim().toLowerCase();
      if (term === '') {
        $('#search-results .card').show();
      } else {
        $('#search-results .card').each(function(){
          const name = $(this).data('name') || $(this).find('.card-title').text();
          $(this).toggle(name.toLowerCase().includes(term));
        });
      }
  
      // highlight matches in visible cards
      $('#search-results .card .card-title').each(function(){
        const txt = $(this).text();
        if (term === '') $(this).html(txt);
        else {
          const regex = new RegExp('('+escapeRegExp(term)+')','ig');
          $(this).html(txt.replace(regex, '<mark>$1</mark>'));
        }
      });
    });
  
    // click suggestion -> fill input and trigger input event
    $(document).on('click', '.suggest-item', function(){
      const val = $(this).text();
      $('#search-input').val(val).trigger('input');
      $('#suggestions').hide();
      // scroll to first matching card (if exists)
      const $match = $('#search-results .card').filter(function(){ return ($(this).data('name')||'').toLowerCase().includes(val.toLowerCase()); }).first();
      if ($match.length) $('html,body').animate({scrollTop: $match.offset().top - 80}, 300);
    });
  
    // Hide suggestions on click outside
    $(document).on('click', function(e){
      if (!$(e.target).closest('#suggestions, #search-input').length) $('#suggestions').hide();
    });
  
    // spinner css injection for submit button
    $('<style>.spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin .9s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}</style>').appendTo('head');
  
    // copy button uses window.showToast
    $('#copy-btn').on('click', function(){
      const txt = $('#text').text();
      navigator.clipboard.writeText(txt).then(()=> {
        window.showToast('Copied to clipboard!');
        $(this).text('✔ Copied');
        const btn = $(this);
        setTimeout(()=> btn.text('Copy'), 1400);
      }).catch(()=> window.showToast('Copy failed'));
    });
  
    // lazy load fallback (in case script.js didn't attach observer)
    function lazyFallback(){
      $('.lazy').each(function(){
        const $img = $(this);
        if ($img.attr('src') === 'placeholder.jpg' && $img.data('src')) {
          $img.attr('src', $img.data('src'));
        }
      });
    }
    $(window).on('load', lazyFallback);
  
    // utility
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  });
  