// create form for note
function openEditForm() {
	$('.overlay').addClass('visible');
	formEdit.addClass('formVisible');
};

function closeEditForm() {
	$('.overlay').removeClass('visible');
	formEdit.removeClass('formVisible');
};

$('.addNotes').on('click', function(e) {
	e.preventDefault();
	openEditForm();
});

$('.formEdit_button__exit').on('click', function(e) {
	e.preventDefault();
	closeEditForm();
});

// create form for section
function openAddSection() {
	$('.overlay').addClass('visible');
	$('.addSection').addClass('formVisible');
};

function closeAddSection() {
	$('.overlay').removeClass('visible');
	$('.addSection').removeClass('formVisible');
};

$('.mainMenuConfig_listTask__createSection').on('click', function(e) {
	closeNavigationMenu(e);
	openAddSection();
});

$('.addSection_button__exit').on('click', function(e) {
	e.preventDefault();
	closeAddSection();
});

// control panel
function closeNavigationMenu(e) {
	e.preventDefault();
	$('.navigationMenu_line__top').toggleClass('navigationMenu_line__topOpen');
	$('.navigationMenu_line__middle').toggleClass('navigationMenu_line__middleOpen');
	$('.navigationMenu_line__bottom').toggleClass('navigationMenu_line__bottomOpen');
	$('.mainMenuConfig').toggleClass('mainMenuConfig__open');
};

$('.navigationMenu').on('click', function(e) {
	closeNavigationMenu(e);
});

$('.mainMenuConfig_listTask__createNote').on('click', function(e) {
	closeNavigationMenu(e);
	openEditForm();
});

// information message
const formEdit = $('.formEdit');
const formAddSection = $('.addSection');
const informMessage = $('.informMessage');

function closeInformMessage() {
	informMessage.removeClass('visibleInformMessage');
};

function getInformMessage(text) {
	informMessage.text(text);
	informMessage.addClass('visibleInformMessage');
	setTimeout(closeInformMessage, 2000);
};

informMessage.on('click', function() {
	closeInformMessage();
});

// form validity check 
function validationTitle() {

    const formEditInputTitle = document.forms.formEdit.elements.title.value;
    const patternTitle = /^[a-z0-9а-я\.-_\+]{1,40}$/;

    if (formEditInputTitle.search(patternTitle) != 0) {
        getInformMessage('Недопустимое содержание заголовка');
        return false;
        $('.formEdit_title').removeClass('validateTrue');
        $('.formEdit_title').addClass('validateFalse');
    } else {
        closeInformMessage();
        $('.formEdit_title').addClass('validateTrue');
        $('.formEdit_title').removeClass('validateFalse');
        return true;
    }
};

function validationMessage() {

    const formEditInputMessage = document.forms.formEdit.elements.message.value;
    const patternMessage = /^[a-z0-9а-я\.-_\+]{1,5000}$/;

    if (formEditInputMessage.search(patternMessage) != 0) {
        getInformMessage('Недопустимое содержание заметки');
        return false;
        $('.formEdit_message').removeClass('validateTrue');
        $('.formEdit_message').addClass('validateFalse');
    } else {
        closeInformMessage();
        $('.formEdit_message').addClass('validateTrue');
        $('.formEdit_message').removeClass('validateFalse');
        return true;
    }
 };

$('.formEdit_title').on('blur', function() {
    validationTitle();
});

$('.formEdit_message').on('blur', function() {
    validationMessage();
});

formEdit.on('submit', function(e) {
	var validateTitle = validationTitle();
	var validateMessage = validationMessage();

	if (validateTitle && validateMessage) {
		getInformMessage('Заметка успешно сохранена');

		var section = $('.formEdit .form_section :selected').text();
		var title = document.forms.formEdit.elements.title.value;
		var time = Date.now();
		var text = document.forms.formEdit.elements.message.value;
		e.preventDefault();
		addNote(section, title, time, text);
		$('.mainMenuConfig').removeClass('mainMenuConfig__open');
		
	} else {
		e.preventDefault();
		getInformMessage('Ошибка в заполнении формы');
	}
});

// add items on a page
function formatDate(time) {
	var diff = new Date();
	alert(diff);
	if (diff < 10000) {
		return 'только что';
	} else {
		return time;
	}
}


// get time
function getTheTime(data) {

	function twoCharInt(anInt) {
		return anInt < 10 ? '0' + anInt : anInt;
	}

	const diff = new Date() - data;
	const min = Math.floor(diff / 60000);
	const hou = Math.floor(diff / 3600000)

	if (min < 1) {
		return 'только что';
	} else if (min < 5) {
		return 'менее 5 мин назад';
	} else if (min < 59) {
		return min + ' мин назад';
	} else if (hou < 3) {
		return hou + ' час назад';
	}

	const times = new Date(data);
	const year = times.getFullYear().toString().slice(2, 4);
	const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
	const month = months[times.getMonth()];
	const day = twoCharInt(times.getDate());
	const hours = twoCharInt(times.getHours());
	const minutes = twoCharInt(times.getMinutes());

	return day + " " + month + " " + year + " " + hours + ":" + minutes;
};


var showAllNotes = function(note) {
	return "<div class='" + "notesList_note" + "' data-id=" + note.id + "><div class='" + "note_top" + "'><div class='" + "note_section_small" + "'>" + note.section + 
	"</div><div class='" + "note_time__small" + "'>" + getTheTime(note.time) + "</div></div><div class='" + "note_mid" + "'><div class='" + "note_title_small" + "'>" + note.title + 
	"</div><div class='" + "note_message__small" + "'>" + note.text + "</div></div><div class='" + "note_Panel" + "'><a href=" + "#" + "><i class='" + "fa fa-pencil" + "'></i></a><a data-id=" + note.id + " href=" + "#" + "><i class='" + "fa fa-close" + "'></i></a></div></div>";
};

// AJAX handlers
function getAllNotes() {
	$.ajax({
		url: '/api/notes',
		method: 'GET',
		contentType: 'application/json',
		success: function(notes) {
			$('.notesList').empty();
			var notesInt = "";
			$.each(notes, function(i, note) {
				notesInt += showAllNotes(note);
			});
			$('.notesList').prepend(notesInt);
		}
	});
};

function addNote(section, title, time, text) {
	$.ajax({
		url: '/api/addnote',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			section: section,
			title: title,
			time: time,
			text: text
		}),
		success: function() {
			resetForm();
			closeEditForm();
			getAllNotes();
		}
	});
};

function deleteNote(id) {
	$.ajax({
		url: '/api/notes/'+id,
		method: 'DELETE',
		contentType: 'application/json',
		success: function() {
			getInformMessage('Заметка успешно удалена');
		}
	});
};

// reset form
function resetForm() {
	document.forms.formEdit.elements.title.value = '';
	document.forms.formEdit.elements.message.value = '';
};

// delete note
$('body').on('click', '.notesList_note a', function() {
	var id = $(this).data('id');
	deleteNote(id);
	getAllNotes();
});

getAllNotes();

// slider
setInterval(function() {
	$('.slider_nextSlide').trigger('click');
}, 2000);

$('.slider_nextSlide').on('click', function() {
	
	var slides = $('.slide');
	var currentSlide, idx, nextSlide;

	for (var i = 0; i < slides.length; i++) {
		if (slides.eq(i).hasClass('slide__current')) {
			currentSlide = slides.eq(i);
			idx = i;
		}
	}

	if (idx + 1 == slides.length) {
		nextSlide = slides.eq(0);
	} else {
		nextSlide = slides.eq(idx + 1);
	}

	currentSlide.removeClass('slide__current');
	nextSlide.addClass('slide__current');

	var globs = $('.slider_glob');
	var currentGlob, idx1, nextGlob;

	for (var i = 0; i < globs.length; i++) {
		if (globs.eq(i).hasClass('slider_glob__current')) {
			currentGlob = globs.eq(i);
			idx1 = i;
		}
	}

	if (idx1 + 1 == globs.length) {
		nextGlob = globs.eq(0);
	} else {
		nextGlob = globs.eq(idx1 + 1);
	}

	currentGlob.removeClass('slider_glob__current');
	nextGlob.addClass('slider_glob__current');

});

$('.slider_prevSlide').on('click', function() {

	var slides = $('.slide');
	var currentSlide, idx, prevSlide;

	for (var i = 0; i < slides.length; i++) {
		if (slides.eq(i).hasClass('slide__current')) {
			currentSlide = slides.eq(i);
			idx = i;
		}
	}

	if (idx == 0) {
		prevSlide = slides.eq(-1);
	} else {
		prevSlide = slides.eq(idx - 1);
	}

	currentSlide.removeClass('slide__current');
	prevSlide.addClass('slide__current');


	var globs = $('.slider_glob');
	var currentGlob, idx1, prevGlob;

	for (var i = 0; i < globs.length; i++) {
		if (globs.eq(i).hasClass('slider_glob__current')) {
			currentGlob = globs.eq(i);
			idx1 = i;
		}
	}

	if (idx1 == 0) {
		prevGlob = globs.eq(-1);
	} else {
		prevGlob = globs.eq(idx1 - 1);
	}

	currentGlob.removeClass('slider_glob__current');
	prevGlob.addClass('slider_glob__current');
});

$('.slider_glob').on('click', function() {

	var globs = $('.slider_glob');
	var currentGlob;

	for (var i = 0; i < globs.length; i++) {
		if (globs.eq(i).hasClass('slider_glob__current')) {
			currentGlob = globs.eq(i);
		}
	}

	var selectGlob = $(this);
	var index = selectGlob.data('id');
	currentGlob.removeClass('slider_glob__current');
	selectGlob.addClass('slider_glob__current');

	var slides = $('.slide');
	var currentSlide, idx;

	for (var y = 0; y < slides.length; y++) {
		if (slides.eq(y).hasClass('slide__current')) {
			currentSlide = slides.eq(y);
			idx = y;
		}
	}

	if (idx != index) {
		currentSlide.removeClass('slide__current');
		slides.eq(index).addClass('slide__current');
	}
});

// show products
var showProducts = function(product) {
	return '<div class="' + 'product' + '"><div class="' + 'product_name' + '">' + product.name + '</div>' +
	'<div class="' + 'product_price' + '">Стоимость: ' + product.price + ' грн' + '</div><div class="' + 'product_color' + '">Цвет: ' + product.color + '</div></div>'
};

function getProducts() {
	$.ajax({
		url: '/api/products',
		method: 'GET',
		contentType: 'application/json',
		success: function(products) {
			var productsList = '';
			$.each(products, function(i, product) {
				productsList += showProducts(product);
			});
			$('.products').append(productsList);
			
		}
	})
};

getProducts();

// filter by price
function filtresPrice(price) {
	$.ajax({
		url: '/api/products/'+price,
		method: 'GET',
		contentType: 'application/json',
		success: function(products) {
			$('.products').empty();
			var productsList = '';
			$.each(products, function(i, product) {
				productsList += showProducts(product);
			});
			$('.products').append(productsList);
		}
	})
};
	
// filter by color
function filterOut(filterSelectPrice, filterCheckColor) {
	$.ajax({
		url: 'api/productsFilter',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			price: filterSelectPrice,
			color: filterCheckColor
		}),
		success: function(products) {
			$('.products').empty();
			var productsList = '';
			$.each(products, function(i, product) {
				productsList += showProducts(product);
			});
			$('.products').append(productsList);
		}
	});
};

$('.filter_button').on('click', function(e) {
	e.preventDefault();
	var filterSelectPrice = $('.filters_price').val();
	var filterCheckedColors = $('input[class="filter_color"]:checked');
	var filterCheckColor = [];

	for (var i = 0; i < filterCheckedColors.length; i++) {
		idx = filterCheckedColors.eq(i).attr('value');
		filterCheckColor.push(idx);
	}

	filterOut(filterSelectPrice, filterCheckColor);
});

// show all sections
function paintSection(section) {
	return '<option value="' + section.id + '">' + section.value + '</option>';
};

function showAllSections() {
	$.ajax({
		url: '/api/sections',
		method: 'GET',
		contentType: 'application/json',
		success: function(sections) {
			$('.form_section').empty();
			var allSections = '';
			$.each(sections, function(i, section) {
				allSections += paintSection(section);
			});
			$('.form_section').append(allSections);
		}
	});
};

// add section
function addNewSection(section) {
	$.ajax({
		url: '/api/section',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({
			section: section
		}),
		success: function() {
			getInformMessage('Раздел успешно создан');
			document.forms.addSection.elements.title.value = '';
			closeAddSection();
			showAllSections();
		}
	})
}

$('.addSection_button__save').on('click', function(e) {
	e.preventDefault();
	const section = document.forms.addSection.elements.title.value;
	addNewSection(section);
});

// delete section
function deleteSection(id) {
	$.ajax({
		url: '/api/section/'+id,
		method: 'delete',
		contentType: 'application/json',
		success: function(message) {
			if (message) {
				getInformMessage('Раздел успешно удален');
			} else {
				getInformMessage('Ошибка');
			}
			
			closeAddSection();
			showAllSections();
		}
	})
}

$('.addSection_delete').on('click', function(e) {
	e.preventDefault();
	const id = $('.form_section__addSection').val();
	deleteSection(id);
});

showAllSections();

// filter sections by date
function ajaxload(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){

        if (this.readyState == 4){
            if (this.status >= 200 && xhr.status < 300){
                document.getElementById('news').innerHTML = this.responseText;
            }
        }
    }

    xhr.open('GET', 'ajax.php');
    xhr.send();
}