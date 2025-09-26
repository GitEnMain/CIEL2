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
});