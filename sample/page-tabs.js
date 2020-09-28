let template = document.createElement('template');
template.innerHTML = /*html*/`
	<style>
        /*@import url("/style/main.css");*/
        :host {display:block;}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style>
    <h1 id="elmTitle">Tabs Sample</h1>
	<div>
		<bm-tabs id="testElm" elm-title="test">
			<bm-tab tab-value="one" tab-caption="Test One">One</bm-tab>
			<bm-tab tab-value="two" tab-caption="Test Two" selected="true">Two</bm-tab>
			<bm-tab tab-value="three" tab-caption="Test Three">Three</bm-tab>
		</bm-tabs>
	</div>
`;

class PageTabs extends HTMLElement {
    static get is() { return 'page-tabs'; }
    constructor() {
        super();
        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
	}
	
    connectedCallback() {
		this.shadowRoot.getElementById('testElm').addEventListener('changed', evt => {
			console.log(evt.detail)
		})
	}

}  // END PageTabs

customElements.define(PageTabs.is, PageTabs);
    
export default PageTabs;    