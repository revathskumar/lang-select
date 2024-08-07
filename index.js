import LangSelect from "./LangSelect";

if (!customElements.get("lang-select")) {
  customElements.define("lang-select", LangSelect);
}

export default LangSelect;
