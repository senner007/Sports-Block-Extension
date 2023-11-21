(()=>{"use strict";var e={844:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ContentController=void 0;const n=s(150),o=s(593);t.ContentController=class{contentView;contentMediator;host;isEditMode=!1;isFilterByResults=!0;urlsChecked=[];urlsResult={};constructor(e,t,s){this.contentView=e,this.contentMediator=t,this.host=s,this.contentMediator.receiveListener(this.messageReceiverStorageUpdate),this.contentMediator.receiveListener(this.messageReceiverSelectMode)}createModal=()=>{this.contentView.createModal(this.modalCallback)};modalCallback=()=>{this.messageReceiverSelectMode({topic:n.MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF,message:""})};messageReceiverSelectMode=async(e,t,s)=>{this.isEditMode=e.topic===n.MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON,this.isEditMode||(this.contentView.removeLocateListeners(),this.contentView.closeModal()),await this.markElements(this.contentView.root),this.isEditMode&&(this.contentView.addLocateListeners(this.locateListener),this.contentView.openModal())};locateListener=async e=>{const t=e.replace(this.host.sportsPath,"").split("/").filter((e=>e.length>0)).filter(((e,t,s)=>t<s.length-1)),s=await this.getCategories();this.contentView.appendToModal(t),await this.contentMediator.setCategories(Array.from(new Set([...s,...t])))};messageReceiverStorageUpdate=async(e,t,s)=>{e.topic===n.MESSAGE_TOPICS.STORAGE_UPDATE&&this.markElements(this.contentView.root)};async getCategories(){return await this.contentMediator.getCategories()||[]}async findElementsOnPage(e){return this.contentView.getElements(this.host.sportsSection,e)}checkIfResults=async e=>{const t=await this.contentMediator.requestUrlHTML({url:e.href});if(null==t)return;var s=document.createElement("div");s.innerHTML=t;const n=s.querySelector(".dre-article-title-section-label__title")?.textContent,a=s.querySelector(".dre-title-text")?.textContent,r=s.querySelector(".dre-article-title__summary")?.textContent,i=(0,o.removeTRailingFullStopAndSpace)(n+" . "+a+" . "+r);!0==await this.contentMediator.requestModelEvaluate({sentence:i})>.5&&this.contentView.hideElement(e.elem)};observeElements(e){this.contentView.observeElements(e)}async init(){await this.markElements(this.contentView.root),this.observeElements(this.markElements)}markElements=async e=>{const t=await this.getCategories(),s=await this.findElementsOnPage(e);if(!s.length)return;const n=s.filter((e=>{const s=e.pathname.split("/").filter((e=>e));for(const e of s)if(t.includes(e.toLowerCase()))return!0;return!1})),o=s.filter((e=>!n.map((e=>e.href)).includes(e.href)));s.forEach((e=>this.contentView.clearSelection(e.elem))),n.forEach((async e=>{this.isFilterByResults?this.checkIfResults(e):this.contentView.hideElement(e.elem)})),o.forEach((e=>this.contentView.tagForRemoval(e.elem,this.isEditMode?"ON":"OFF")))}}},343:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ContentView=void 0;const n=s(593);t.ContentView=class{tagClass="sports-block-extension-locate";hideClass="sports-block-extension-hide";locateListenerInstance;root=document;clearSelection(e){e.classList.remove(this.hideClass),e.classList.remove(this.tagClass)}tagForRemoval(e,t){"ON"===t?e.classList.add(this.tagClass):e.classList.remove(this.tagClass)}hideElement(e){e.classList.add(this.hideClass)}locateListener(e){return function(t){t.preventDefault();const s=t.target.querySelector("a").pathname;e(s)}}createModal=e=>{var t=document.createElement("div");t.classList.add("extension-modal"),t.id="myModal",t.innerHTML='<div class="extension-modal-content">\n            <div class="extension-modal-container">\n                <div><h3>Select elements to hide</h3></div>\n                <div class="extension-modal-close">&times;</div>\n            </div>\n            <p>(click close when done)</p>\n            <ul id="modal-content-paths"></ul>\n        </div>',document.body.appendChild(t),document.querySelector(".extension-modal-close")?.addEventListener("click",(()=>{this.closeModal(),e()}))};appendToModal=e=>{const t=document.querySelector("#modal-content-paths"),s=Array.from(t.querySelectorAll("li")).map((e=>e.textContent)),n=Array.from(new Set([...s,...e]));this.clearModelContent();for(const e of n){var o=document.createElement("li");o.innerHTML=e,t.appendChild(o)}};clearModelContent=()=>{const e=document.querySelector("#modal-content-paths");(0,n.removeChildNodes)(e)};openModal=()=>{const e=document.querySelector("#myModal");this.clearModelContent(),e.style.display="block"};closeModal=()=>{try{document.querySelector("#myModal").style.display="none"}catch(e){console.log("Modal not loaded yet")}};addLocateListeners(e){this.removeLocateListeners(),this.locateListenerInstance=this.locateListener(e),document.querySelectorAll("."+this.tagClass).forEach((e=>{e.addEventListener("click",this.locateListenerInstance)}))}removeLocateListeners=()=>{document.querySelectorAll("."+this.tagClass).forEach((e=>{e.removeEventListener("click",this.locateListenerInstance)}))};observeElements(e){const t=document.documentElement;new MutationObserver((async(t,s)=>{for(const s of t)await e(s.target)})).observe(t,{childList:!0,subtree:!0,characterData:!1})}getElements(e,t){function s(e){const t=e.parentElement?.querySelectorAll("a");return[...new Set(Array.from(t).map((e=>e.href)))].length>1?e:s(e.parentElement)}return Array.from(t.querySelectorAll("a")).filter((t=>t.href.includes(e))).map((e=>s(e))).map((e=>{let t;return t="href"in e?e.querySelector("a")||e:e.querySelector("a"),{elem:e,pathname:t.pathname,href:t.href}}))}}},150:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.uiMediator=t.contentMediator=t.MESSAGE_TOPICS=void 0;const n=s(912);var o;!function(e){e[e.ELEMENT_SELECT_MODE_ON=0]="ELEMENT_SELECT_MODE_ON",e[e.ELEMENT_SELECT_MODE_OFF=1]="ELEMENT_SELECT_MODE_OFF",e[e.STORAGE_UPDATE=2]="STORAGE_UPDATE"}(o||(t.MESSAGE_TOPICS=o={}));class a{async receiveListener(e){chrome.runtime.onMessage.addListener(e)}async setCategories(e){return n.extensionStorage.storage_set("categories",e)}async getCategories(){return n.extensionStorage.storage_get("categories")}}t.contentMediator=new class extends a{urlsCache={};evaluationCache={};async sendMessage(e){return await chrome.runtime.sendMessage(e)}async requestUrlHTML(e){if(this.urlsCache[e.url])return this.urlsCache[e.url];const t=await this.sendMessage({url:e.url});return"ERROR"===t?null:(this.urlsCache[e.url]=t,t)}async requestModelEvaluate(e){if(this.evaluationCache[e.sentence])return this.evaluationCache[e.sentence];const t=await this.sendMessage({sentence:e.sentence});return this.evaluationCache[e.sentence]=t,t}},t.uiMediator=new class extends a{async sendMessage(e,t){const s=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});return await chrome.tabs.sendMessage(s[0].id,{topic:e,mesage:t})}async sendMessageStorageUpdate(){await this.sendMessage(o.STORAGE_UPDATE,"")}async getRemovedElements(){return n.extensionStorage.storage_get("removedElements")}async getFilterByResultsState(){return n.extensionStorage.storage_get("filterByResultState")}async setFilterByResultsState(e){n.extensionStorage.storage_set("filterByResultState",e)}async requestElementSelectMode(e){await this.sendMessage("ON"===e?o.ELEMENT_SELECT_MODE_ON:o.ELEMENT_SELECT_MODE_OFF,"")}}},912:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extensionStorage=void 0,t.extensionStorage=new class{async storage_get(e){return(await chrome.storage.sync.get(e))[e]}async storage_set(e,t){chrome.storage.sync.set({[e]:t})}}},593:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeTRailingFullStopAndSpace=t.removeChildNodes=void 0,t.removeChildNodes=function(e){for(;e.firstChild;)e.removeChild(e.firstChild)},t.removeTRailingFullStopAndSpace=function(e){let t=e.trim();return"."===t[t.length-1]&&(t=t.slice(0,-1)),t}}},t={};function s(n){var o=t[n];if(void 0!==o)return o.exports;var a=t[n]={exports:{}};return e[n](a,a.exports,s),a.exports}(()=>{const e=s(150),t=s(844),n=s(343);(async()=>{window.onload=async function(){const s=new t.ContentController(new n.ContentView,e.contentMediator,function(){const e=window.location.host;return"www.dr.dk"===e?{location:e,sportsSection:e+"/sporten",sportsPath:"/sporten"}:"nyheder.tv2.dk"===e||"tv2.dk"===e?(console.log("tv2"),{location:e,sportsSection:"sport.tv2.dk",sportsPath:""}):void 0}());await s.init(),s.createModal()}})()})()})();