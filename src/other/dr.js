
console.log(document.querySelectorAll(".dre-section"))
    _ini();



// Select the node that will be observed for mutations
const targetNode = document.querySelector(".hydra-root")
console.log(targetNode)

const teasers = targetNode.querySelectorAll(".dre-article-teaser");
console.log(teasers)

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
        const teasers = targetNode.querySelectorAll(".dre-article-teaser");
        console.log(teasers)
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log(`The ${mutation.attributeName} attribute was modified.`);
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// // Later, you can stop observing
// observer.disconnect();

function _ini(){
    console.log("fdfs")

    // document.getElementsByTagName("html")[0].style.display="none";

    // window.onload=function(){

        // const articles = document.querySelectorAll(".dre-teaser-meta-label.dre-teaser-meta-label--primary");

        // // console.log(articles)


        // for (let a of articles) {
        //     if (a.textContent === "Cykling") {
        //         console.log(a)
        //         console.log(a.closest(".dre-grid-layout-list__item"))
        //         const closestLi = a.closest(".dre-grid-layout-list__item") || a.closest(".hydra-latest-news__item.hydra-latest-news__item--timeline") 
        //             ||  a.closest(".dre-article-teaser")
        //         console.log(closestLi)
        //         closestLi.remove()
        //     }
        // }

        // document.getElementsByTagName("html")[0].style.display="block"; //to show it all back again

    // }

}