/* accordeon */
$(document).ready(function() {
	$('#accordeon .accordeon__title').on('click', f_accordeon);
	$('#accordeon .accordeon__title').on('click', function() {
		$('#accordeon .accordeon__title').not($(this)).removeClass('accordeon__title_active');
		$(this).addClass('accordeon__title_active');
	});
});
 
function f_accordeon(){
	$('#accordeon .accordeon__text').not($(this).next()).slideUp(400);
	$(this).next().slideToggle(400);
	$('#accordeon .accordeon__title .fa').not($(this)).removeClass('fa-caret-up');
	$(this).find('i').addClass('fa-caret-up');
};

$(document).ready(function() {
	$('#accordeon .accordeon__title')[0].click();
});