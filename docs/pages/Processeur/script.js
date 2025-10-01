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
		var maxPoints = 20; // longueur de la traînée

		// Add mouse/touch listeners
		function addPoint(x, y) {
			points.push({x: x, y: y, t: Date.now()});
			if (points.length > maxPoints) points.shift();
		}

		window.addEventListener('mousemove', function(e) {
			addPoint(e.clientX, e.clientY);
		});
		window.addEventListener('touchmove', function(e) {
			if (e.touches && e.touches[0]) {
				addPoint(e.touches[0].clientX, e.touches[0].clientY);
			}
		}, {passive: true});

		// Draw loop
		function draw() {
			// slight fade to create trailing effect (use low alpha to gradually fade)
			ctx.fillStyle = 'rgba(0,0,0,255.255)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

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
					// glow using shadow
					ctx.lineWidth = lineWidth;
						// glow color (blue)
						ctx.strokeStyle = 'rgba(40,160,255,' + (alpha * 0.7) + ')';
						ctx.shadowColor = 'rgba(40,160,255,' + (alpha * 0.95) + ')';
					ctx.shadowBlur = 20 * (1 - age) + 2;
					ctx.lineCap = 'round';
					ctx.stroke();

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