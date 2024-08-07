class LangSelect extends HTMLElement {
  static get observedAttributes() {
    return ["value", "availableLangs"];
  }

  constructor() {
    // Always call super first in constructor
    super();

    console.log(`Lang Select : constructor`);

    const shadow = this.attachShadow({ mode: "open" });

    const tmpl = document.createElement("template");
    tmpl.innerHTML = `
    <style>
      :host
      {
        position: relative;
        max-width: 20ch;
        min-width: 10ch;
        display: block;
      }

      button {
        border: 1px solid black;
        border-radius: 0.2rem;
        cursor: pointer;
        width: 100%;
        font-size: 1.1rem;
        text-align: left;
        padding: 0.5rem;
        span {
          padding-left: 0.1rem;
          font-weight: bold;
        }
      }

      [role="menu"] {
        position: absolute;
        border: 1px solid #666;
        background-color: #AAA;
        max-height: 30ch;
        overflow-y: scroll;
        overflow-x: hidden;
        inset: unset;
        box-shadow: 3px 8px 8px 0px #00000033;
        border-top: 0;
      }
      #lang-menu {
        max-height: 20ch;
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      ul li {
        padding: 0.5rem;
        text-align: left;
        cursor: pointer;
        }

      li:hover {
        background-color: #CCC;
      }
        li[data-selected="true"] {
          font-weight: bold;
        }
        li[data-selected="true"]:after {
          content: "🗸";
          padding-left: 0.3rem;
        }

    </style>
    <button type="button" aria-controls="language-menu" aria-haspopup="true" popovertarget="lang-menu">
     🌍 <span id="text">English</span>
    </button>
    <div id="lang-menu" role="menu" popover>
    </div>
      `;

    shadow.append(tmpl.content.cloneNode(true));
    this._upgradeProperty("value");
    this._upgradeProperty("availableLangs");
    this._onMenuBeforeToggle = this._onMenuBeforeToggle.bind(this);
    this._onMenuClick = this._onMenuClick.bind(this);
    this._onMenuKeypress = this._onMenuKeypress.bind(this);
  }

  buildOptions() {
    const selectedLang = this.value;
    const availableLangsValue = this.availableLangs;

    const availableLangs = availableLangsValue.split(",");

    const ul = document.createElement("ul");

    availableLangs.map((locale) => {
      const li = document.createElement("li");
      li.tabIndex = "0";

      const langName = new Intl.DisplayNames([locale], { type: "language" });

      li.append(langName.of(locale));
      li.setAttribute("data-value", locale);
      if (locale === selectedLang) {
        li.setAttribute("data-selected", "true");
      }
      ul.appendChild(li);
    });
    const menu = this.shadowRoot.querySelector("#lang-menu");
    menu.innerHTML = "";
    menu.appendChild(ul);
  }

  _upgradeProperty(prop) {
    console.log(`LangSelect : upgrade property ${prop}.`);
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  set value(val) {
    this.setAttribute("value", val);
  }

  get value() {
    return this.getAttribute("value");
  }

  set availableLangs(val) {
    this.setAttribute("availableLangs", val);
  }

  get availableLangs() {
    return this.getAttribute("availableLangs") ?? "en,ar,de,zh,ko,ja,fr";
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `LangSelect : Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
    );
    if (name === "value") {
      this.buildOptions();
      const langName = new Intl.DisplayNames([newValue], { type: "language" });
      this.shadowRoot.querySelector("#text").innerHTML = langName.of(newValue);
    }
  }

  connectedCallback() {
    console.log("LangSelect : Custom lang selector element added to the page.");

    if (!this.hasAttribute("availableLangs")) {
      this.setAttribute("availableLangs", "en,ar,de,zh,ko,ja,fr");
    }
    if (!this.hasAttribute("value")) {
      this.setAttribute("value", "en");
    }
    if (!this.hasAttribute("tabIndex")) {
      this.setAttribute("tabIndex", "0");
    }

    const menu = this.shadowRoot.querySelector("#lang-menu");
    menu.addEventListener("beforetoggle", this._onMenuBeforeToggle);
    menu.addEventListener("click", this._onMenuClick);
    menu.addEventListener("keypress", this._onMenuKeypress);
  }

  _onMenuBeforeToggle(e) {
    console.log("🚀 ~ file: LangSelect.js:190 ~ beforetoggle:", e.newState);
    if (e.newState === "open") {
      const menu = this.shadowRoot.querySelector("#lang-menu");
      const button = this.shadowRoot.querySelector("button");
      menu.style.width = `${button.offsetWidth}px`;
    }
  }

  _onMenuClick(e) {
    console.log(
      "🚀 ~ file: LangSelect.js:170 ~ e:",
      e.target,
      e.target.dataset.value,
    );

    if (e.target.tagName === "LI") {
      this._onSelect(e, this);
    }
  }

  _onMenuKeypress(e) {
    console.log(
      "🚀 ~ file: LangSelect.js:170 ~ e:",
      e.target,
      e.target.dataset.value,
    );

    if (e.target.tagName === "LI") {
      this._onSelect(e, this);
    }
  }

  _onSelect(e, ele) {
    const menu = ele.shadowRoot.querySelector("#lang-menu");
    ele.value = e.target.dataset.value;
    ele.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    menu.hidePopover();
  }

  disconnectedCallback() {
    console.log(
      "Lang Select : Custom lang selector element removed from page.",
    );
    const menu = this.shadowRoot.querySelector("#lang-menu");

    menu.removeEventListener("beforetoggle", this._onMenuBeforeToggle);
    menu.removeEventListener("keypress", this._onMenuKeypress);
    menu.removeEventListener("click", this._onMenuClick);
  }

  adoptedCallback() {
    console.log(
      "Lang Select : Custom lang selector  element moved to new page.",
    );
  }
}

export default LangSelect;
