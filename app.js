// Shared behaviors: burger toggle and avatar navigation
(function() {
	function setupBurger(scope) {
		var wrapper = (scope || document).getElementById('hamburgerMenu');
		var btn = (scope || document).getElementById('hamburgerBtn');
		if (btn && wrapper) {
			btn.addEventListener('click', function(e){ e.stopPropagation(); wrapper.classList.toggle('open'); });
			document.addEventListener('click', function(e){ if (!wrapper.contains(e.target)) { wrapper.classList.remove('open'); } });
		}
	}

	function setupAvatar(scope) {
		var avatar = (scope || document).getElementById('userAvatar');
		if (avatar) {
			avatar.addEventListener('click', function(){ window.location.href = 'account.html'; });
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function(){ setupBurger(); setupAvatar(); });
	} else {
		setupBurger();
		setupAvatar();
	}
})();



