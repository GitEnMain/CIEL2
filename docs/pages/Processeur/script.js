// Menu déroulant pour les specs du processeur AMD Ryzen 9 9950X3D
document.addEventListener('DOMContentLoaded', function() {
	var acc = document.getElementsByClassName('accordion');
	for (var i = 0; i < acc.length; i++) {
		acc[i].addEventListener('click', function() {
			this.classList.toggle('active');
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + 'px';
			}
		});
	}

	// Bouton tout ouvrir/fermer
	var toggleAllBtn = document.getElementById('toggleAll');
	if (toggleAllBtn) {
		toggleAllBtn.addEventListener('click', function() {
			var allOpen = true;
			for (var i = 0; i < acc.length; i++) {
				var panel = acc[i].nextElementSibling;
				if (!acc[i].classList.contains('active') || !panel.style.maxHeight) {
					allOpen = false;
					break;
				}
			}
			for (var i = 0; i < acc.length; i++) {
				var panel = acc[i].nextElementSibling;
				if (allOpen) {
					acc[i].classList.remove('active');
					panel.style.maxHeight = null;
				} else {
					acc[i].classList.add('active');
					panel.style.maxHeight = panel.scrollHeight + 'px';
				}
			}
		});
	}

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
		var maxPoints = 15; // longueur de la traînée

		// Paramètres ajustables
		var fadeAlpha = 0.25; // plus petit = la traînée persiste plus longtemps (0.02..0.12)

		// Mouse stop detection & convergence
		var mouseX = null, mouseY = null;
		var lastMoveTime = 0;
		var stopThreshold = 150; // ms sans bouger avant qu'on considère le curseur "arrêté"
		var convergeStrengthBase = 0.06; // base LERP
		var convergeStrengthMax = 0.35; // max LERP pour les points les plus proches

		// Paramètres ajustables
		var fadeAlpha = 0.12; // plus petit = la traînée persiste plus longtemps (0.02..0.12)

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
<<<<<<< HEAD
			// slight fade to create trailing effect WITHOUT altering background colors.
			// We use 'destination-out' to reduce the alpha of existing drawing only.
			ctx.save();
			ctx.globalCompositeOperation = 'destination-out';
=======
			// slight fade to create trailing effect (use low alpha to gradually fade)
>>>>>>> 92d601970e4e08cc0c4537be84f2e3fb6246ed95
			ctx.fillStyle = 'rgba(0,0,0,' + fadeAlpha + ')';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.restore();

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
				for (var i = 0; i < points.length - 1; i++) {
					var p0 = points[i];
					var p1 = points[i+1];
					var age = i / (points.length - 1); // 0..1

					// line width and alpha based on age (younger = brighter)
					var lineWidth = 12 * (1 - age) + 1;
					var alpha = 0.9 * (1 - age);

					ctx.beginPath();
					ctx.moveTo(p0.x, p0.y);
					ctx.lineTo(p1.x, p1.y);
					// glow using shadow; draw additively
					ctx.save();
					ctx.globalCompositeOperation = 'lighter';
					ctx.lineWidth = lineWidth;
					// glow color (blue)
					ctx.strokeStyle = 'rgba(40,160,255,' + (alpha * 2) + ')'; // modifié pour plus de visibilité
						// ctx.strokeStyle = 'rgba(40,160,255,' + (alpha * 1) + ')'; // original
					ctx.shadowColor = 'rgba(40,160,255,' + (alpha * 0.9) + ')'; // modifié pour plus de d'ombre
						// ctx.shadowColor = 'rgba(40,160,255,' + (alpha * 0.6) + ')'; // original
					ctx.shadowBlur = 18 * (1 - age) + 6;
					ctx.lineCap = 'round';
					ctx.stroke();
					ctx.restore();

					// thin bright core
					ctx.beginPath();
					ctx.moveTo(p0.x, p0.y);
					ctx.lineTo(p1.x, p1.y);
					ctx.lineWidth = Math.max(1, lineWidth * 0.25);
					ctx.shadowBlur = 0;
						// bright core (pale blue)
						ctx.strokeStyle = 'rgba(180,220,255,' + alpha + ')';
					ctx.stroke();
				}
			}

			requestAnimationFrame(draw);
		}

		// Clear canvas initial
		ctx.clearRect(0,0,canvas.width,canvas.height);
		draw();
	})();
});