(()=>{"use strict";var e={844:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ContentController=void 0;const n=s(150);t.ContentController=class{contentView;contentMediator;host;isEditMode=!1;isFilterByResults=!1;constructor(e,t,s){this.contentView=e,this.contentMediator=t,this.host=s,this.contentMediator.receiveListener(this.messageReceiverStorageUpdate),this.contentMediator.receiveListener(this.messageReceiverSelectMode),this.contentMediator.receiveListener(this.messageReceiverfilterByResults)}createModal=()=>{this.contentView.createModal(this.modalCallback)};modalCallback=()=>{this.messageReceiverSelectMode({topic:n.MESSAGE_TOPICS.ELEMENT_SELECT_MODE_OFF,message:""})};messageReceiverSelectMode=async(e,t,s)=>{this.isEditMode=e.topic===n.MESSAGE_TOPICS.ELEMENT_SELECT_MODE_ON,this.isEditMode||(this.contentView.removeLocateListeners(),this.contentView.closeModal()),await this.markElements(this.contentView.root),this.isEditMode&&(this.contentView.addLocateListeners(this.locateListener),this.contentView.openModal())};locateListener=async e=>{let t=this.host.getLabels(e);const s=await this.getCategories();this.contentView.appendToModal(t),await this.contentMediator.setCategories(Array.from(new Set([...s,...t])))};messageReceiverStorageUpdate=async(e,t,s)=>{e.topic===n.MESSAGE_TOPICS.STORAGE_UPDATE&&this.markElements(this.contentView.root)};messageReceiverfilterByResults=async(e,t,s)=>{e.topic===n.MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_ON?(console.log("filter by results on"),this.isFilterByResults=!0):e.topic===n.MESSAGE_TOPICS.FILTER_BY_RESULTS_MODE_OFF&&(console.log("filter by results off"),this.isFilterByResults=!1),this.markElements(this.contentView.root)};async getCategories(){return await this.contentMediator.getCategories()||[]}async findElementsOnPage(e){return this.contentView.getElements(this.host.sportsSection,e)}checkIfResults=async e=>{const t=await this.contentMediator.requestUrlHTML({url:e.href});if(null==t)return;const s=this.contentView.parseUrl(this.host.location,t),n=await this.contentMediator.requestModelEvaluate({sentence:s});console.log("PARSED :",s,"\nRESULT:",n),!0==n>.5&&this.contentView.hideElement(e.elem)};observeElements(e){this.contentView.observeElements(e)}async init(){this.isFilterByResults=await this.contentMediator.getFilterByResultsState(),await this.markElements(this.contentView.root),setTimeout((()=>{this.observeElements(this.markElements)}),0)}markElements=async e=>{const t=await this.getCategories(),s=await this.findElementsOnPage(e);if(!s.length)return;const n=s.filter((e=>{const s=this.host.getLabels(e.href);for(const e of s)if(t.includes(e.toLowerCase()))return!0;return!1})),o=s.filter((e=>!n.map((e=>e.href)).includes(e.href)));s.forEach((e=>this.contentView.clearSelection(e.elem)));for(const e of n)this.isFilterByResults?await this.checkIfResults(e):this.contentView.hideElement(e.elem);o.forEach((e=>this.contentView.tagForRemoval(e.elem,this.isEditMode?"ON":"OFF")))}}},343:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.ContentView=t.parseTV2=t.parseDR=void 0;const n=s(593);function o(e){const t=e.querySelector(".dre-article-title-section-label__title--link")?.textContent||e.querySelector(".dre-teaser-meta-label.dre-teaser-meta-label--primary")?.textContent,s=e.querySelector(".dre-title-text")?.textContent;return[t,s,e.querySelector(".dre-article-title__summary")?.textContent||e.querySelector(".hydra-latest-news-page-short-news-article__paragraph.dre-variables")?.textContent]}function r(e){const t=e.querySelector(".tc_page__label")?.childNodes[0].textContent,s=e.querySelector(".tc_heading.tc_heading--2")?.childNodes[0].textContent;return[t,s,e.querySelector(".tc_page__body__standfirst")?.childNodes[0].childNodes[0].textContent||e.querySelector(".tc_richcontent")?.firstChild.textContent]}t.parseDR=o,t.parseTV2=r,t.ContentView=class{tagClass="sports-block-extension-locate";hideClass="sports-block-extension-hide";locateListenerInstance;root=document;clearSelection(e){e.classList.remove(this.hideClass),e.classList.remove(this.tagClass)}tagForRemoval(e,t){"ON"===t?e.classList.add(this.tagClass):e.classList.remove(this.tagClass)}hideElement(e){e.classList.add(this.hideClass)}locateListener(e){return function(t){t.preventDefault();const s=t.target.querySelector("a").href;e(s)}}createModal=e=>{var t=document.createElement("div");t.classList.add("extension-modal"),t.id="myModal",t.innerHTML='<div class="extension-modal-content">\n            <div class="extension-modal-container">\n                <div><h3>Select elements to hide</h3></div>\n                <div class="extension-modal-close">&times;</div>\n            </div>\n            <p>(click close when done)</p>\n            <ul id="modal-content-paths"></ul>\n        </div>',document.body.appendChild(t),document.querySelector(".extension-modal-close")?.addEventListener("click",(()=>{this.closeModal(),e()}))};appendToModal=e=>{const t=document.querySelector("#modal-content-paths"),s=Array.from(t.querySelectorAll("li")).map((e=>e.textContent)),n=Array.from(new Set([...s,...e]));this.clearModelContent();for(const e of n){var o=document.createElement("li");o.innerHTML=e,t.appendChild(o)}};clearModelContent=()=>{const e=document.querySelector("#modal-content-paths");(0,n.removeChildNodes)(e)};openModal=()=>{const e=document.querySelector("#myModal");this.clearModelContent(),e.style.display="block"};closeModal=()=>{try{document.querySelector("#myModal").style.display="none"}catch(e){console.log("Modal not loaded yet")}};addLocateListeners(e){this.removeLocateListeners(),this.locateListenerInstance=this.locateListener(e),document.querySelectorAll("."+this.tagClass).forEach((e=>{e.addEventListener("click",this.locateListenerInstance)}))}removeLocateListeners=()=>{document.querySelectorAll("."+this.tagClass).forEach((e=>{e.removeEventListener("click",this.locateListenerInstance)}))};parseUrl(e,t){var s=document.createElement("div");let i;return s.innerHTML=t,"www.dr.dk"===e?i=o(s):"nyheder.tv2.dk"!==e&&"tv2.dk"!==e||(i=r(s)),(0,n.removeTRailingFullStopAndSpace)(i.join(" . "))}observeElements(e){const t=document.documentElement;new MutationObserver((async(t,s)=>{for(const s of t)await e(s.target)})).observe(t,{childList:!0,subtree:!0,characterData:!1})}getElements(e,t){const s=Array.from(t.querySelectorAll("a")).filter((t=>t.href.includes(e))).filter((e=>e.href.includes("-"))).map((e=>n(e)));function n(e){const t=e.parentElement?.querySelectorAll("a");return[...new Set(Array.from(t).map((e=>e.href)))].length>1?e:n(e.parentElement)}const o=[];return s.forEach((e=>{o.some((t=>e.isEqualNode(t)))||o.push(e)})),o.map((e=>{let t;return t="href"in e?e.querySelector("a")||e:e.querySelector("a"),{elem:e,pathname:t.pathname,href:t.href}}))}}},150:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.uiMediator=t.contentMediator=t.MESSAGE_TOPICS=void 0;const n=s(912);var o;!function(e){e[e.ELEMENT_SELECT_MODE_ON=0]="ELEMENT_SELECT_MODE_ON",e[e.ELEMENT_SELECT_MODE_OFF=1]="ELEMENT_SELECT_MODE_OFF",e[e.FILTER_BY_RESULTS_MODE_ON=2]="FILTER_BY_RESULTS_MODE_ON",e[e.FILTER_BY_RESULTS_MODE_OFF=3]="FILTER_BY_RESULTS_MODE_OFF",e[e.STORAGE_UPDATE=4]="STORAGE_UPDATE"}(o||(t.MESSAGE_TOPICS=o={}));class r{async receiveListener(e){chrome.runtime.onMessage.addListener(e)}async setCategories(e){return n.extensionStorage.storage_set("categories",e)}async getCategories(){return n.extensionStorage.storage_get("categories")}async getFilterByResultsState(){return n.extensionStorage.storage_get("filterByResultState")}}t.contentMediator=new class extends r{urlsCache={};evaluationCache={};pending=Promise.resolve("");modelPending=Promise.resolve(0);async sendMessage(e){return await chrome.runtime.sendMessage(e)}async urlTaskrunner(e){try{await this.pending}finally{if(e.url in this.urlsCache)return this.urlsCache[e.url];try{console.log("fetching");const t=await this.sendMessage({url:e.url});return this.urlsCache[e.url]=t,"ERROR"===t?null:t}catch(e){throw console.log("fetch error:",e),new Error}}}async modelTaskrunner(e){try{await this.modelPending}finally{if(e.sentence in this.evaluationCache)return this.evaluationCache[e.sentence];{const t=await this.sendMessage({sentence:e.sentence});return this.evaluationCache[e.sentence]=t,t}}}async requestUrlHTML(e){return this.pending=this.urlTaskrunner(e),this.pending}async requestModelEvaluate(e){return this.modelPending=this.modelTaskrunner(e),this.modelPending}},t.uiMediator=new class extends r{async sendMessage(e,t){const s=await chrome.tabs.query({active:!0,lastFocusedWindow:!0});return await chrome.tabs.sendMessage(s[0].id,{topic:e,mesage:t})}async sendMessageStorageUpdate(){await this.sendMessage(o.STORAGE_UPDATE,"")}async getRemovedElements(){return n.extensionStorage.storage_get("removedElements")}async setFilterByResultsState(e){await n.extensionStorage.storage_set("filterByResultState","ON"===e),await this.sendMessage("ON"===e?o.FILTER_BY_RESULTS_MODE_ON:o.FILTER_BY_RESULTS_MODE_OFF,"")}async requestElementSelectMode(e){await this.sendMessage("ON"===e?o.ELEMENT_SELECT_MODE_ON:o.ELEMENT_SELECT_MODE_OFF,"")}}},912:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.extensionStorage=void 0,t.extensionStorage=new class{async storage_get(e){return(await chrome.storage.sync.get(e))[e]}async storage_set(e,t){chrome.storage.sync.set({[e]:t})}}},593:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.removeTRailingFullStopAndSpace=t.removeChildNodes=void 0,t.removeChildNodes=function(e){for(;e.firstChild;)e.removeChild(e.firstChild)},t.removeTRailingFullStopAndSpace=function(e){let t=e.trim();return"."===t[t.length-1]&&(t=t.slice(0,-1)),t}}},t={};function s(n){var o=t[n];if(void 0!==o)return o.exports;var r=t[n]={exports:{}};return e[n](r,r.exports,s),r.exports}(()=>{const e=s(150),t=s(844),n=s(343);(async()=>{window.onload=async function(){console.log("WINDIW LOADED EVENT");const s=new t.ContentController(new n.ContentView,e.contentMediator,function(){const e=window.location.host;if("www.dr.dk"===e)return{location:e,sportsSection:e+"/sporten",sportsPath:"/sporten",getLabels(e){const t=e.replace("https://"+this.sportsSection,"").split("/").filter((e=>e.length>0)).filter(((e,t,s)=>t<s.length-1));return 0===t.length?["sport"]:t}};if("nyheder.tv2.dk"===e||"tv2.dk"===e)return{location:e,sportsSection:"sport.tv2.dk",sportsPath:"",getLabels(e){const t=e.replace("https://"+this.sportsSection,"").split("/").filter((e=>e.length>0)).filter(((e,t,s)=>t<s.length-1));return 0===t.length?["Sport"]:t}};throw new Error("host undefined")}());await s.init(),s.createModal()}})()})()})();