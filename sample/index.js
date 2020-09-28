import DM from './dm.js'

const pageManager = {
	contentDiv: null,
	pages: {home: null, data: null},
	activePage: 'home',
	initialize(target) {
		if (target) this.contentDiv =  target;
		this.setupWindowState();
		this.render();
	},
	updateState(pageId) {
		// Remove and store last element
		this.pages[this.activePage] = this.contentDiv.elm.removeChild(document.getElementById("activeContent"));
		// update state
		this.activePage = pageId;
	},
	switchPage(pageId) {
		console.log('switchPage', pageId);
		this.updateState(pageId);
		window.history.pushState(this.activePage, null, "");
		this.render();
	},
	render() {
		if (this.pages[this.activePage]) { this.contentDiv.elm.append(this.pages[this.activePage]) }
		else {
			switch (this.activePage) {
				case 'cards': this.renderCardSample(); break;
				case 'tabs': this.renderTabSample(); break;
				case 'demo': this.renderDemo(); break;
				default: this.renderHome(); break;
			}	
		}
	},
	renderHome() {
		let self = this;
		this.contentDiv.clear().append('page-home')
		.attr('id', 'activeContent')
		.prop('data', sampleData.pages)
		.listen('click',evt => {
			self.switchPage(evt.detail.cardId);
		});
	},
	renderTabSample() {
		let self = this;
		this.contentDiv.clear().append('page-tabs')
		.attr('id', 'activeContent')
		.listen('click',evt => {
			console.log('index caught the click', evt.detail.cardId);
		});
	},
	renderCardSample() {
		let self = this;
		this.contentDiv.clear().append('page-cards')
		.attr('id', 'activeContent')
		.listen('click',evt => {
			console.log('index caught the click', evt.detail.cardId);
		});
	},
	renderDemo() {
		let self = this;
		this.contentDiv.clear().append('page-demo')
		.attr('id', 'activeContent')
		.listen('click',evt => {
			console.log('index caught the click', evt.detail.cardId);
		});
	},
	setupWindowState() {
		let self = this;
		window.history.replaceState(self.activePage,null,"");
		window.onpopstate = function (event) {
			if (event.state) { 
				self.updateState(event.state);
				self.render();
			} 
		};
	}
}

document.addEventListener('DOMContentLoaded', event => {
    let mainElem = DM.Target(document.getElementById("myContent"));
    pageManager.initialize(mainElem);

	document.getElementById("sampleBtn").addEventListener('click', e => {
		pageManager.switchPage('home');
	})
})

const sampleData = {
	pages: [
		{ id: 'cards', title: 'Display Cards', desc: 'This web component was used to generate this card. [Clicking this card will leave the demo]' },
		{ id: 'tabs', title: 'Tabs', desc: 'This web component was used to create the horozantal tabs. [Clicking this card will leave the demo]' },
		{ id: 'demo', title: 'Data Management', desc: 'Click into this page to see an example of web components tthat work with data.' },
	]
}