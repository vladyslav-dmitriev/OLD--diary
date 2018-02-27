const express    = require('express'),
	  bodyParser = require('body-parser'),
	  fs 		 = require('fs'),
	  path 	     = require('path');

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(path.join(__dirname, 'public')));

// paths
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/notes', (req, res) => {
	res.sendFile(__dirname + '/public/notes.html');
});

app.get('/finance', (req, res) => {
	res.sendFile(__dirname + '/public/finance.html');
});

app.get('/tools', (req, res) => {
	res.sendFile(__dirname + '/public/tools.html');
});

// show all notes
app.get('/api/notes', (req, res) => {
	const content = fs.readFileSync('json/notes.json', 'utf8');
	const notes = JSON.parse(content);
	res.send(notes);
});

// add note
app.post('/api/addnote', jsonParser, (req, res) => {
	const content = fs.readFileSync('json/notes.json', 'utf8');
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
	fs.writeFileSync('json/notes.json', data);
	res.status(200).send();

});

// delete note
app.delete('/api/notes/:id', (req, res) => {
	const content = fs.readFileSync('json/notes.json', 'utf8');
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
		fs.writeFileSync('json/notes.json', data);
		res.send(note);
	}

});

// request for products
app.get('/api/products', (req, res) => {
	const content = fs.readFileSync('json/products.json', 'utf8');
	const products = JSON.parse(content);
	res.send(products);
});

app.post('/api/productsFilter', jsonParser, (req, res) => {
	const content = fs.readFileSync('json/products.json', 'utf8');
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

	// price 
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

// show all sections
app.get('/api/sections', (req, res) => {
	const content = fs.readFileSync('json/sections.json', 'utf8');
	const sections = JSON.parse(content);
	res.send(sections);
});

// add section
app.post('/api/section', jsonParser, (req, res) => {
	const content = fs.readFileSync('json/sections.json', 'utf8');
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
	fs.writeFileSync('json/sections.json', data);
	res.status(200).send();	

});

// delete section
app.delete('/api/section/:id', (req, res) => {
	const content = fs.readFileSync('json/sections.json', 'utf8');
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
		fs.writeFileSync('json/sections.json', data);
		res.send(true);
	}

});

// server settings
app.listen(3000, () => {
	console.log('work in port 3000');
});