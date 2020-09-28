import config from '/js/config.js';
    
let template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        @import url("/style/field-edit.css");
        :host {width:100%; height:calc(100% - 4px); border:2px solid #333;border-right:none;}
        h1 {margin-bottom: 18px;font-size:1.4em;padding:4px 18px;}
    </style> <!-- look ma, scoped styles -->
    <div id="fldCntr" class="fld-cntr">
    </div>
`;

class EditorBase extends HTMLElement {
    static get is() { return 'editor-base'; }
    constructor(options) {
        super();

        this._item = {};
        this._editMode = true;
        this._dataManager = null;

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        if (!options) {
            shadowRoot.appendChild(template.content.cloneNode(true));
        }
    }
    set item(val) {
        this._item = val;
        this.render()
    }
    set dataManager(val) {
        this._dataManager = val;
        this._fields = val.rowFields;
        this.setupListeners();
    }


    render(){
        if(config.verbose) console.log(`Render Activation:`,this._item.name)
    }
    renderField(fldName){
        if(!this._item) return;
        let self = this,
            fldSpec = self._dataManager.getFieldSpec(fldName),
            fldId = `#ef_${fldSpec.code}`,
            fldEf = self.shadowRoot.querySelector(fldId);
        
        if (config.debug) console.log(`item to render ${self._item}`)
        if (!self._item) { // Rest with no item selected
            fldEf.value = '';
            fldEf.editable = false;
            fldEf.dirty = false;
            fldEf.required = false;
            return;
        }

        if(config.debug) console.log(fldId, fldEf)
        if(config.debug) console.log(fldId, self._item.fieldDirty(fldName))

        let fldVal = self._item.getFieldValue(fldName);
        if (fldEf) {
            let oldFldVal = fldEf.value;
            if (config.debug) console.log(`EDIT-FIELD [${fldId}] -- OldVal: ${oldFldVal}, NewVal: ${fldVal}`);

            if (fldEf.value !== fldVal) fldEf.value = fldVal;
            fldEf.editable = (self._editMode && fldSpec.canEdit);
            fldEf.dirty = self._item.fieldDirty(fldName);
            fldEf.render();
        }
    }

    setupListeners() {
        let self = this;
        self._dataManager.on('change', d => {
            if(config.debug) console.log(`Change Happened`)
        });
        self._dataManager.on('item.change', d => {
            if(config.verbose) console.log(`Item Changed - Id: ${d.itemId}`)
            // If change message is for record
            if (d.itemId === self._item.key) {
                if (config.debug) console.log(self._item)
                // Do something
                //this.updateState()
                self.render()
            }

        });
        self._dataManager.on('item.updated', d => {
            if(config.debug) console.log(`Item Updated - Id: ${d.itemId}`)
        });
        self._dataManager.on('item.reset', d => {
            if(config.debug) console.log(`Item REset - Id: ${d.itemId}`)
        });
        self._dataManager.on('item.add', d => {
            if(config.debug) console.log(`Item Add - Id: ${d.itemId}`)
        });
        self._dataManager.on('item.delete', d => {
            if(config.debug) console.log(`Item Delete`)
        });
    }

    connectedCallback() {
        let self = this;
        let inputs = self.shadowRoot.querySelectorAll('.fld-val');

        if (inputs && inputs.length > 0) {
            inputs.forEach(element => {
                let fldName = element.getAttribute('name');
                if (config.debug) console.log(`setup event listener for field ${fldName}`)
                element.addEventListener('input', e => {
                    let newValue = e.target.value,
                        itemId = self._item.key,
                        orgValue = self._item.getFieldValue(fldName);
                        
                    self._dataManager.editEvent(itemId,fldName,newValue,orgValue)
                });
                element.addEventListener("focusout", function(){self.render()})
            });
        }


    }


}  // END EditorBase

customElements.define(EditorBase.is, EditorBase);
    
export default EditorBase;    