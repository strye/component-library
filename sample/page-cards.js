let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {display:block;}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style>
    <h1 id="elmTitle">Display Cards Sample</h1>
	<div>
		<display-card card-title="Test One" card-desc="This is a card that describes something and links to something else."></display-card>
		<display-card card-title="Test Two" card-desc="This is a card that describes something and links to something else."></display-card>
	</div>
`;

class PageCards extends HTMLElement {
    static get is() { return 'page-cards'; }
    constructor() {
        super();
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}  // END PageCards

customElements.define(PageCards.is, PageCards);
    
export default PageCards;    