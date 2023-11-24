(()=>{"use strict";var e={329:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.UIController=void 0,t.UIController=class{UIView;uiMediator;constructor(e,t){this.UIView=e,this.uiMediator=t,e.toggleElementSelectButton(this.elementSelectModeToggle),e.toggleFilterByResultsButton(this.filterByResultsToggle),this.uiMediator.requestElementSelectMode("OFF"),this.displayFilterByResultsState(),this.displayCategories().then((t=>{e.clickCategory(this.clickCategoryCallback)}))}displayCategories=async()=>{const e=await this.uiMediator.getCategories();this.UIView.displayCategories(e)};clickCategoryCallback=async e=>{console.log(e);const t=(await this.uiMediator.getCategories()).filter((t=>t!==e));await this.uiMediator.setCategories(t),await this.uiMediator.sendMessageStorageUpdate(),this.UIView.displayCategories(t),this.UIView.clickCategory(this.clickCategoryCallback)};async displayRemovedElements(){const e=await this.uiMediator.getRemovedElements();this.UIView.displayRemovedElements(e)}async displayFilterByResultsState(){const e=await this.uiMediator.getFilterByResultsState();this.UIView.displayFilterByResultsButton(e?"ON":"OFF")}elementSelectModeToggle=async e=>{await this.uiMediator.requestElementSelectMode(e)};filterByResultsToggle=async e=>{await this.uiMediator.setFilterByResultsState(e)}}},290:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.uiView=void 0;const i=s(593);t.uiView=new class{filterByReesultsId="#filterByResultsButton";categories="#categories";elementSelectButton="#elementSelectButton";category=".category";displayCategories(e){const t=document.querySelector(this.categories);(0,i.removeChildNodes)(t);for(const i of e){var s=document.createElement("div");s.innerHTML=`<p>${i}</p>`,s.classList.add("category"),t?.appendChild(s)}}displayRemovedElements(e){throw new Error("Method not implemented.")}displayFilterByResultsButton(e){console.log("toggle",e);const t=document.querySelector(this.filterByReesultsId);"ON"===e?t?.classList.add("ON"):t?.classList.remove("ON")}toggleElementSelectButton(e){document.querySelector(this.elementSelectButton)?.addEventListener("click",(async t=>{const s=t.target;s.classList.toggle("ON"),e(s.classList.contains("ON")?"ON":"OFF")}))}toggleFilterByResultsButton(e){document.querySelector(this.filterByReesultsId)?.addEventListener("click",(async t=>{const s=t.target;s.classList.toggle("ON"),e(s.classList.contains("ON")?"ON":"OFF")}))}clickCategory(e){document.querySelectorAll(this.category).forEach((t=>{t.addEventListener("click",(t=>{const s=t.target.textContent;e(s)}))}))}}},150:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.uiMediator=t.contentMediator=t.MESSAGE_TOPICS=void 0;const i=s(912);var a;!function(e){e[e.ELEMENT_SELECT_MODE_ON=0]="ELEMENT_SELECT_MODE_ON",e[e.ELEMENT_SELECT_MODE_OFF=1]="ELEMENT_SELECT_MODE_OFF",e[e.FILTER_BY_RESULTS_MODE_ON=2]="FILTER_BY_RESULTS_MODE_ON",e[e.FILTER_BY_RESULTS_MODE_OFF=3]="FILTER_BY_RESULTS_MODE_OFF",e[e.STORAGE_UPDATE=4]="STORAGE_UPDATE"}(a||(t.MESSAGE_TOPICS=a={}));class o{async receiveListener(e){chrome.runtime.onMessage.addListener(e)}async setCategories(e){return i.extensionStorage.storage_set("categories",e)}async getCategories(){return i.extensionStorage.storage_get("categories")}async getFilterByResultsState(){return i.extensionStorage.storage_get("filterByResultState")}}t.contentMediator=new class extends o{urlsCache={};evaluationCache={};pending=Promise.resolve("");modelPending=Promise.resolve(0);async sendMessage(e){return await chrome.runtime.sendMessage(e)}async urlTaskrunner(e){try{await this.pending}finally{if(e.url in this.urlsCache)return this.urlsCache[e.url];try{console.log("fetching");const t=await this.sendMessage({url:e.url});return this.urlsCache[e.url]=t,"ERROR"===t?null:t}catch(e){throw console.log("fetch error:",e),new Error}}}async modelTaskrunner(e){try{await this.modelPending}finally{if(e.sentence in this.evaluationCache)return this.evaluationCache[e.sentence];{const t=await this.sendMessage({sentence:e.sentence});return this.evaluationCache[e.sentence]=t,t}}}async requestUrlHTML(e){return this.pending=this.urlTaskrunner(e),this.pending}async requestModelEvaluate(e){return this.modelPending=this.modelTaskrunner(e),this.modelPending}},t.uiMediator=new class extends o{async sendMessage(e,t){const s=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});return await chrome.tabs.sendMessage(s[0].id,{topic:e,mesage:t})}async sendMessageStorageUpdate(){await this.sendMessage(a.STORAGE_UPDATE,"")}async getRemovedElements(){return i.extensionStorage.storage_get("removedElements")}async setFilterByResultsState(e){await i.extensionStorage.storage_set("filterByResultState","ON"===e),await this.sendMessage("ON"===e?a.FILTER_BY_RESULTS_MODE_ON:a.FILTER_BY_RESULTS_MODE_OFF,"")}async requestElementSelectMode(e){await this.sendMessage("ON"===e?a.ELEMENT_SELECT_MODE_ON:a.ELEMENT_SELECT_MODE_OFF,"")}}},912:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extensionStorage=void 0,t.extensionStorage=new class{async storage_get(e){return(await chrome.storage.sync.get(e))[e]}async storage_set(e,t){chrome.storage.sync.set({[e]:t})}}},593:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeTRailingFullStopAndSpace=t.removeChildNodes=void 0,t.removeChildNodes=function(e){for(;e.firstChild;)e.removeChild(e.firstChild)},t.removeTRailingFullStopAndSpace=function(e){let t=e.trim();return"."===t[t.length-1]&&(t=t.slice(0,-1)),t}}},t={};function s(i){var a=t[i];if(void 0!==a)return a.exports;var o=t[i]={exports:{}};return e[i](o,o.exports,s),o.exports}(()=>{const e=s(150),t=s(329),i=s(290);new t.UIController(i.uiView,e.uiMediator),console.log("This is the UI console!")})()})();