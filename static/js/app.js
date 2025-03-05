document.addEventListener('DOMContentLoaded', init, false);

let $result, $itemCount, $prevButton, $nextButton;
let perpage = 10;
// Initial value gets updated after first call
let totalItems = Math.Infinity;

async function init() {
	$itemCount = document.querySelector('#itemCount');
	$prevButton = document.querySelector('#prevButton');
	$nextButton = document.querySelector('#nextButton');
	$result = document.querySelector('#result');

	let params = new URLSearchParams(location.search);
	let start = params.get('start') ?? 1;
	start = parseInt(start, 10);

	$nextButton.addEventListener('click', e => {
		console.log('next clicked', start, perpage, totalItems)
		if(start + perpage - 1 < totalItems) {
			start += perpage;
			console.log('going to next', start);
			window.history.pushState(null, null, '?start='+ start);
			loadItems(start);
		}
		
	});

	$prevButton.addEventListener('click', e => {
		console.log('prev clicked', start, perpage, totalItems)
		if(start - perpage >= 1) {
			start -= perpage;
			console.log('going to prev', start);
			window.history.pushState(null, null, '?start='+ start);
			loadItems(start);
		}
		
	});

	loadItems(start);

}

async function loadItems(start) {
	$result.innerHTML = '<i>Loading items...</i>';

	result = await getItems(start);
	console.log(result, 'started at', start);


	$itemCount.textContent = `(${result.total} Total)`;
	totalItems = result.total;

	let html = '';

	result.items.forEach(i => {

		/*
		some feeds had trailing open html, lets nuke that. in theory, backend could fix? so could their rss ;)
		also, if conent is blank, write something
		*/
		let content = i.content.replace(/<.+/, '');
		if(content.trim() === '') content = 'No content provided in feed.';
		let item = `
			<sl-card class="header-header item">
 <img
    slot="image"
    src="https://v1.screenshot.11ty.dev/${encodeURIComponent(i.url)}/medium/1:1"
    alt="${i.title}" style2="height:400px; object-fit:contain"
  />

				<div slot="header">
					<strong>${i.title}</strong> 
					<sl-icon-button name="link" label="Visit" href="${i.url}" target="_blank"></sl-icon-button>
				</div>
				
				${content}
				<div slot="footer"><strong>${i.name}</strong> at ${dtFormat(i.posted)}</div>
			</sl-card>

		`;

		html += item;
	});

	$result.innerHTML = html;

}

async function getItems(start=1) {
	let req = await fetch('/api.bx?method=getItems&start='+start);
	return await req.json();
}

function dtFormat(d) {
	return new Intl.DateTimeFormat('en-US', {
		dateStyle:'full', 
		timeStyle:'short'
	}).format(new Date(d));
}