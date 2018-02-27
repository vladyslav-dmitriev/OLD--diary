var express    = require('express'),
	bodyParser = require('body-parser'),
	fs 		   = require('fs'),
	path 	   = require('path');

const app = express();
var jsonParser = bodyParser.json();

app.use(express.static(path.join(__dirname, 'public')));

// // Главная страница
// app.get('/', (req, res) => {
// 	res.sendFile(__dirname + '/index2.html');
// });

// Заметки
app.get('/notes', (req, res) => {
	res.sendFile(__dirname + '/notes.html');
});

// Финансы
app.get('/finance', (req, res) => {
	res.sendFile(__dirname + '/finance.html');
});

// Инструменты
app.get('/tools', (req, res) => {
	res.sendFile(__dirname + '/tools.html');
});

// Вернуть все заметки
app.get('/api/notes', (req, res) => {
	const content = fs.readFileSync('notes.json', 'utf8');
	const notes = JSON.parse(content);
	res.send(notes);
});

// Добавление заметки
app.post('/api/addnote', jsonParser, (req, res) => {
	const content = fs.readFileSync('notes.json', 'utf8');
	var notes = JSON.parse(content);

	const section = req.body.section;
	const title = req.body.title;
	const time = req.body.time;
	const text = req.body.text;
	var id;

	if (notes.length == 0) {
		id = 0;
	} else {
		id = Math.max.apply(Math,notes.map(function(o){return o.id;}))
	};

	const note = {section: section, title: title, time: time, text: text};
	note.id = id + 1;
	notes.push(note);

	const data = JSON.stringify(notes);
	fs.writeFileSync('notes.json', data);
	res.status(200).send();

});

// Удаление заметки

app.delete('/api/notes/:id', (req, res) => {
	const content = fs.readFileSync('notes.json', 'utf8');
	const notes = JSON.parse(content);

	const id = req.params.id;
	var index = -1;

	for (var i = 0; i < notes.length; i++) {
		if (notes[i].id == id) {
			index = i;
			break;
		}
	}

	if (index > -1) {
		var note = notes.splice(index, 1)[0];
		var data = JSON.stringify(notes);
		fs.writeFileSync('notes.json', data);
		res.send(note);
	}

});


// Запрос товаров

app.get('/api/products', (req, res) => {
	const content = fs.readFileSync('products.json', 'utf8');
	const products = JSON.parse(content);
	res.send(products);
});

app.post('/api/productsFilter', jsonParser, (req, res) => {
	const content = fs.readFileSync('products.json', 'utf8');
	const products = JSON.parse(content);
	const price = req.body.price;
	const color = req.body.color; 
	var productsCopy = products.slice();

	// Цвет
	var productsColor;
	if (color.length != 0) {
		productsColor = [];
	
		function sortByColor(color) {
			for (var f = 0; f < productsCopy.length; f++) {
				if (productsCopy[f].color == color) {
					productsColor.push(productsCopy[f]);
				}
			}
		}
		
		for (var i = 0; i < color.length; i++) {
			sortByColor(color[i]);
		} 
	} else {
		productsColor = products.slice();
	}

	// Цена 
	function sortFirstRich(productA, productB) {
		return productB.price - productA.price;
	};

	function sortFirstLow(productA, productB) {
		return productA.price - productB.price;
	};

	if (price == 'rich') {
		productsColor.sort(sortFirstRich);
	} else if (price == 'low') {
		productsColor.sort(sortFirstLow);
	}

	res.send(productsColor);

});

// Показать все разделы

app.get('/api/sections', (req, res) => {
	const content = fs.readFileSync('sections.json', 'utf8');
	const sections = JSON.parse(content);
	res.send(sections);
});

// Добавить раздел

app.post('/api/section', jsonParser, (req, res) => {
	const content = fs.readFileSync('sections.json', 'utf8');
	var sections = JSON.parse(content);
	const value = req.body.section;
	var id;

	if (sections.length == 0) {
		id = 0;
	} else {
		id = Math.max.apply(Math,sections.map(function(o){return o.id;}))
	};

	var section = {value: value};
	section.id = id + 1;
	sections.push(section);

	const data = JSON.stringify(sections);
	fs.writeFileSync('sections.json', data);
	res.status(200).send();	

});

// Удалить раздел

app.delete('/api/section/:id', (req, res) => {
	const content = fs.readFileSync('sections.json', 'utf8');
	var sections = JSON.parse(content);
	const id = req.params.id;
	var index = -1;

	if (sections.length == 0) {
		res.send(false);
	}

	for (var i = 0; i < sections.length; i++) {
		if (sections[i].id == id) {
			index = i;
			break;
		}
	}

	if (index > -1) {
		var section = sections.splice(index, 1)[0];
		var data = JSON.stringify(sections);
		fs.writeFileSync('sections.json', data);
		res.send(true);
	}

});

// Настройки сервера

app.listen(3000, () => {
	console.log('work in port 3000');
});