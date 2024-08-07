class SimpleLangSelect extends HTMLSelectElement {
  static get observedAttributes() {
    return ["value", "availableLangs"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    const shadow = this.attachShadow({ mode: "open" });

    this.select = document.createElement("select");
    shadow.appendChild(this.select);
  }

  buildOptions() {

    const selectedLang = this.attributes.value.value 
    const availableLangsValue = this.attributes.availableLangs.value 

    const availableLangs = availableLangsValue.split(',');

    availableLangs.map(locale => {
      const option = document.createElement("option");

      const langName = new Intl.DisplayNames([locale], { type: 'language' });

      option.text = langName.of(locale)
      option.value = locale;
      if (locale === selectedLang) {
        option.selected = true;
      }
      this.select.add(option);
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
    );
    if (name === "value") {
      this.removeOptions();
      this.buildOptions();
    }
  }

  removeOptions() {
    while(this.select.options.length > 0) {
      this.select.remove(0)
    }
  }

  connectedCallback(){
    console.log("Custom lang selector element added to the page.");
    const shadow = this.shadowRoot;
    if (!this.hasAttribute('value')) {
        this.setAttribute('value', 'en');
    }    
    if (!this.hasAttribute('availableLangs')) {
        this.setAttribute('availableLangs', 'en,ar,de,zh,ko,ja,fr');
    }

    const changeEvt = new CustomEvent("change", {
      bubbles: true,
      cancelable: false,
      composed: true
    });

    const ele = this;
  
    // shadow.querySelector("select").addEventListener("change", function (e) {
    this.select.addEventListener("change", function (e) {
      console.log('listend to change event');
      // console.log(e);
      console.log(`Selected value: `,e.target.value);
      changeEvt.value = e.target.value;
      // console.log(e.value);
      ele.dispatchEvent(changeEvt);
    });
  }

  handleEvent(evt){
    console.warn('handle Event :: ', evt, evt.target.value);
  }

  disconnectedCallback() {
    console.log("Custom lang selector element removed from page.");
    const shadow = this.shadowRoot;
    // shadow.querySelector("select")

    // shadow.querySelector("select").removeEventListener("change");
    this.select.removeEventListener("change");
  }

  adoptedCallback() {
    console.log("Custom lang selector  element moved to new page.");
  }

}

customElements.define("simple-lang-select", SimpleLangSelect, { extends: "select" });