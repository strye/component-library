import DM from './dm.js'

let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
		:host {display: block}
		display-card { width: 32vw; height: 150px;}
    </style>
	<div id="main"></div>
`;

class PageHome extends HTMLElement {
    static get is() { return 'page-home'; }
    static get observedAttributes() { return ['elm-title']; }
    constructor() {
		super();
		this._data = [];

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
    get data() { return this._data; }
    set data(val) { this._data = val; this.render() }

    render() {
		let self = this;
		let mainDiv = DM.Target(this.shadowRoot.getElementById('main'));

		this._data.forEach(card => {
			mainDiv.append('display-card')
			.attr('card-id', card.id)
			.attr('card-title', card.title)
			.attr('card-desc', card.desc)
			.exec((c) => { if(card.link) { c.attr('card-link',card.link)} })
			// .listen('click',evt => {
			// 	console.log('page caught the click')
			// 	self.dispatchEvent(new CustomEvent('click', {
			// 		bubbles: true,
			// 		composed: true,
			// 		detail: self
			// 	}));
			// });
		});
    }

}  // END PageHome

customElements.define(PageHome.is, PageHome);
    
export default PageHome;    