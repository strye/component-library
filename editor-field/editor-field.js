import config from '/js/config.js';
    
let template = document.createElement('template');
template.innerHTML = /*html*/`
    <style>
        @import url("/style/field-edit.css");
    </style> <!-- look ma, scoped styles -->
    <div class="ed-fld">
        <div id="fldVal"></div>
        <span id="fldLab"></span>
    </div>
`;

class EditField extends HTMLElement {
    static get is() { return 'edit-field'; }
    constructor(options) {
        super();

        this._name = '';
        this._value = '';
        this._label = 'label';
        this._type = 'text';

        this._required = false;
        this._editable = true;
        this._dirty = false;

        if (options && options.spec) this.setupFromSpec(options.spec)

        // Attach a shadow root to the element.
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }
    get name() { return this._name; }
    set name(val) { this._name = val; this.setAttribute('name', val); }

    get value() { return (this._value) ? this._value : ''; }
    set value(val) { this._updateValue(val);
        // this._value = val;
        // this.setAttribute('value', val);
        // this.render()
    }

    get label() { return this._label; }
    set label(val) { this._label = val; this.setAttribute('label', val); fldLab.innerText = val;this.render(); }

    get type() { return this._type; }
    set type(val) { 
        if (this._type !== val) {
            this._type = val; 
            this.setAttribute('type', val);
            this._setupInput();   
        }
    }

    get required() { return this._required; }
    set required(val) { this._required = val; this.setAttribute('required', val);this.render(); }

    get editable() { return this._editable; }
    set editable(val) { this._editable = val; this.setAttribute('editable', val);this.render(); }

    get dirty() { return this._dirty; }
    set dirty(val) { this._dirty = val; this.setAttribute('dirty', val);this.render(); }

    setupFromSpec(spec) {
        this._name = spec.name;
        this._label = spec.label;
        this._type = spec.type || 'text';

        this._required = spec.required;
        this._editable = spec.canEdit;
    }

    render(){
        if(config.debug) console.log(`Render edit-field:`,this._name)

        let fldInp = this.shadowRoot.querySelector('#vl_editor'),
        fldValue = (this._value) ? this._value : '';


        fldInp.readOnly = !this._editable;
        fldInp.classList.toggle("unselectable", !this._editable)
        fldInp.classList.toggle("fld-dirty", this._dirty)
        fldInp.classList.toggle("fld-required", (this._required && fldValue.length <= 0))



        let nodeType = fldInp.nodeName.toLocaleLowerCase();
        if (nodeType === 'div') {
            fldInp.innerText = fldValue;
            fldInp.toggleAttribute("contenteditable", this._editable); 
        } else {
            fldInp.value = fldValue;
            fldInp.toggleAttribute("enabled", this._editable); 
        }
        if (nodeType === 'textarea') this._autoExpand(fldInp);
    }

    _setupInput() {
        let self = this,
        fldDiv = this.shadowRoot.querySelector('#fldVal'),
        fldInp = this.shadowRoot.querySelector('#vl_editor'),
        fldLab = this.shadowRoot.querySelector('#fldLab');

        if (fldInp) {fldDiv.remove(fldInp); fldInp = null; }

        switch (this._type) {
            case 'textarea': fldInp = document.createElement("textarea"); break;
            case 'div': fldInp = document.createElement("div"); break;
        
            default: 
                fldInp = document.createElement("input");
                fldInp.setAttribute('type', 'text')
                break;
        }
        fldInp.setAttribute('id', 'vl_editor')
        fldInp.classList.toggle('fld-val', true)
        
        fldLab.innerText = this._label;


        fldDiv.append(fldInp);
        fldInp.addEventListener('input', e => {
            if (e.target.value === self._value) return;
            
            let newVal = (e.target.value) ? e.target.value : ''
            let evtDetail = {
                newValue: newVal,
                oldValue: self._value
            }
            //self._value = evtDetail.newValue;
            self._updateValue(evtDetail.newValue);
    
            if (config.debug) console.log(evtDetail)
            self.dispatchEvent(new CustomEvent('input', { 
                bubbles: true, 
                detail: evtDetail
            }))

            self.render()
        });
        fldInp.addEventListener("focusout", function(){
            self.dispatchEvent(new Event("focusout", { bubbles: true,  cancelable: false }));
            self.render()
        })
    }
    _autoExpand(field) {
        field.style.height = '1em'; // Reset field height
        field.style.height = field.scrollHeight + 'px';
    };
    

    _updateValue(value) {
        if(config.debug) console.log(`SETTING VALUE |o| new: ${value}, old: ${this._value}`)
        //if (value === this._value) return;

        if (this.getAttribute('value') !== value) this.setAttribute('value', value);
        if (this._value !== value) {this._value = value;this.render();}
    }

    connectedCallback() {
        if (this.getAttribute('name')) this._name = this.getAttribute('name');
        if (this.getAttribute('value')) this._updateValue(this.getAttribute('value'));
        if (this.getAttribute('label')) this._label = this.getAttribute('label');
        if (this.getAttribute('type')) this._type = this.getAttribute('type');

        if (this.getAttribute('required')) this._required = (this.getAttribute('required') === 'true');
        if (this.getAttribute('editable')) this._editable = (this.getAttribute('editable') === 'true');


        this._setupInput();
        this.render();
    }
    adoptedCallback() { this.render(); }
    attributeChangedCallback(name, oldValue, newValue) {
        switch (name.toLowerCase()) {
            case 'name': this._name = newValue; break;
            case 'value':  this._updateValue(newValue); break;
            case 'label': this._label = newValue; break;
            case 'type': 
                if(oldValue !== newValue) {
                    this._type = newValue; 
                    this._setupInput();
                }
                break;

            case 'required': this._required = (newValue === 'true'); break;
            case 'editable': this._editable = (newValue === 'true'); break;
        }
        
    }

}  // END EditField

customElements.define(EditField.is, EditField);
    
export default EditField;