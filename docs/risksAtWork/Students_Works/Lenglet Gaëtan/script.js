// script.js — Navigation, modal management, and interactive exercise
(function(){
  // Display current year
  var y = new Date().getFullYear();
  var el = document.getElementById('year');
  if(el) el.textContent = y;

  // Highlight active TOC link based on visible section
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main .section'));

  function onScroll(){
    var fromTop = window.scrollY + 140; // margin for header
    var current = sections.find(function(s){
      return s.offsetTop <= fromTop && (s.offsetTop + s.offsetHeight) > fromTop;
    });
    tocLinks.forEach(function(a){
      var href = a.getAttribute('href');
      var id = href && href.charAt(0) === '#' ? href.slice(1) : null;
      a.classList.toggle('active', current && id === current.id);
    });
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  document.addEventListener('DOMContentLoaded', onScroll);

  // Smooth scroll navigation
  tocLinks.forEach(function(a){
    a.addEventListener('click', function(e){
      var href = a.getAttribute('href');
      if(href && href.startsWith('#')){
        var target = document.getElementById(href.slice(1));
        if(target){
          setTimeout(function(){ target.setAttribute('tabindex','-1'); target.focus(); }, 400);
        }
      }
    });
  });

  // Help Modal Management
  var helpBtn = document.getElementById('helpBtn');
  var helpModal = document.getElementById('helpModal');
  var closeBtn = document.querySelector('.modal-close');
  var revealBtn = document.getElementById('revealAnswer');
  var answerBox = document.getElementById('answerBox');

  if(helpBtn){
    helpBtn.addEventListener('click', function(){
      helpModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // prevent scrolling
    });
  }

  if(closeBtn){
    closeBtn.addEventListener('click', function(){
      helpModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    });
  }

  if(revealBtn){
    revealBtn.addEventListener('click', function(){
      answerBox.classList.toggle('hidden');
      revealBtn.textContent = answerBox.classList.contains('hidden') ? 'Show Answer' : 'Hide Answer';
    });
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(event){
    if(event.target === helpModal){
      helpModal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  });
})();
