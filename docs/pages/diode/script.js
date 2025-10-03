let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

function changeSlide(direction) {
  currentSlide += direction;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  if (currentSlide >= slides.length) currentSlide = 0;
  showSlide(currentSlide);
}

// Show the first slide on page load
showSlide(currentSlide);
		// --- Ribbons animation: traînée lumineuse bleue suivant le curseur ---
    (function() {
      var canvas = document.getElementById('ribbons-canvas');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
  
      // Resize canvas to full window device pixels
      function resize() {
        var dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      window.addEventListener('resize', resize);
  
      var points = [];
      var maxPoints = 4; // longueur de la traînée peux modif pour le nombre de point voulue
  
      // Paramètres ajustables
      var fadeAlpha = 0.02; // plus petit = la traînée persiste plus longtemps (0.02..0.12)
  
      // Option pour afficher/masquer les "points" et petites flèches sur la lueur
      // Mettre à false pour rendre les points invisibles tout en gardant la traînée
      var showPoints = false; // <= changé pour répondre à la demande
  
      // Mouse stop detection & convergence
      var mouseX = null, mouseY = null; // position actuelle du curseur (ne pas forcer)
      var lastMoveTime = 0; // timestamp du dernier mouvement (interne)
      var stopThreshold = 100; // ms sans bouger avant qu'on considère le curseur "arrêté"
        // -> Modifier: augmenter pour attendre plus longtemps avant convergence (ex: 300)
        // -> Réduire (ex: 50) pour déclencher la convergence plus vite
      var convergeStrengthBase = 0.12; // base LERP
        // -> Modifier: force minimale de rapprochement par frame (0..1). Plus grand = convergence plus rapide
        // -> Exemples: 0.02 (très doux), 0.06 (doux), 0.12 (rapide)
      var convergeStrengthMax = 0.2; // max LERP pour les points les plus proches
        // -> Modifier: force maximale appliquée aux points récents (0..1). Augmente pour une attraction plus forte
        // -> Exemples: 0.2 (douce), 0.35 (rapide), 0.6 (très rapide)
  
      // Add mouse/touch listeners
      function addPoint(x, y) {
        points.push({x: x, y: y, t: Date.now()});
        if (points.length > maxPoints) points.shift();
      }
  
      window.addEventListener('mousemove', function(e) {
        mouseX = e.clientX; mouseY = e.clientY; lastMoveTime = Date.now();
        addPoint(mouseX, mouseY);
      });
      window.addEventListener('touchmove', function(e) {
        if (e.touches && e.touches[0]) {
          mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; lastMoveTime = Date.now();
          addPoint(mouseX, mouseY);
        }
      }, {passive: true});
  
      // Draw loop
      function draw() {
        // Clear full canvas and redraw the trail each frame.
        // This avoids complex compositing that can alter the page background.
        ctx.setTransform(1,0,0,1,0,0); // reset transform to clear correctly
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // restore devicePixelRatio transform for drawing
        var dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  
        // If the cursor has stopped, converge points toward (mouseX, mouseY)
        var now = Date.now();
        var stopped = mouseX !== null && (now - lastMoveTime) > stopThreshold;
  
        if (stopped && points.length > 0) {
          for (var k = 0; k < points.length; k++) {
            var p = points[k];
            // normalized position along the trail (0 oldest -> 1 newest)
            var t = points.length > 1 ? (k / (points.length - 1)) : 1;
            var lerp = convergeStrengthBase + (convergeStrengthMax - convergeStrengthBase) * t;
            p.x += (mouseX - p.x) * lerp;
            p.y += (mouseY - p.y) * lerp;
          }
        }
  
        if (points.length > 1) {
          // redraw all segments (older -> newer)
          for (var i = 0; i < points.length - 1; i++) {
            var p0 = points[i];
            var p1 = points[i+1];
            var age = i / (points.length - 1); // 0..1
  
            // line width and alpha based on age (younger = brighter)
            var lineWidth = 12 * (1 - age) + 1;
            // augmenter l'épaisseur globale
            var lineWidth = (12 * (1 - age) + 1) * 1.6;
            var alpha = 0.9 * (1 - age);
  
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            // glow using shadow; draw additively
            // glow using shadow; draw additively within the canvas
            // glow: trait épais
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = 'rgba(255,255,255,' + (alpha * 2.0) + ')'; // modif opacité glow remplace le 1 & le rgba)
            ctx.shadowColor = 'rgba(255,255,255,' + (alpha * 2.0) + ')'; // modif ombre remplace le 0.9 & le rgba)
            ctx.shadowBlur = 20 * (1 - age) + 6;
            ctx.lineCap = 'round';
            ctx.stroke();
            // draw arrow head (glow)
            if (showPoints) {
            // compute direction
            var dx = p1.x - p0.x;
            var dy = p1.y - p0.y;
            var len = Math.sqrt(dx*dx + dy*dy) || 1;
            var ux = dx / len, uy = dy / len;
            var px = -uy, py = ux; // perp
            var arrowLen = Math.max(10, lineWidth * 1.6);
            var halfBase = Math.max(6, lineWidth * 0.6);
            var baseX = p1.x - ux * arrowLen;
            var baseY = p1.y - uy * arrowLen;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(baseX + px * halfBase, baseY + py * halfBase);
            ctx.lineTo(baseX - px * halfBase, baseY - py * halfBase);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.9) + ')'; // modif le 0.9 & le rgba
            ctx.fill();
            }
            ctx.restore();
  
            // thin bright core
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineWidth = Math.max(1, lineWidth * 0.25);
            ctx.shadowBlur = 0;
              // bright core (pale blue)
              ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')'; // modif le rgba
            ctx.stroke();
            // draw arrow head core (solid)
            if (showPoints) {
            var baseX2 = p1.x - ux * (Math.max(10, lineWidth * 1.6));
            var baseY2 = p1.y - uy * (Math.max(10, lineWidth * 1.6));
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(baseX2 + px * halfBase, baseY2 + py * halfBase);
            ctx.lineTo(baseX2 - px * halfBase, baseY2 - py * halfBase);
            ctx.closePath();
            ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 1.0) + ')'; // modif le 0.9 & le rgba
            ctx.fill();
            }
          }
        }
  
        requestAnimationFrame(draw);
      }
  
      // Clear canvas initial
      ctx.clearRect(0,0,canvas.width,canvas.height);
      draw();
    })();