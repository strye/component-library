let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {display:block;}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style>
    <h1 id="elmTitle">Demo of the data elements [PLACEHOLDER]</h1>
	<div>
		Content to be added later
	</div>
`;

class PageDemo extends HTMLElement {
    static get is() { return 'page-demo'; }
    constructor() {
        super();
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
}  // END PageDemo

customElements.define(PageDemo.is, PageDemo);
    
export default PageDemo;    