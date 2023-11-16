import { contentMediator } from "../mediator";
import { ContentController } from "./contentController";
import { ContentView } from "./contentView";


function toggleHTMLVisibility(toggle: "hidden" | "visible") {
    document.getElementsByTagName("html")[0].style.visibility = toggle;
}


// Example POST method implementation:
async function postDataPOST(url :  string, data :  object) {
    console.log(JSON.stringify(data));
    // Default options are marked with *
    const response = await fetch(url, {
        method : "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // cache: 'no-store', // for some reason Chrome's caching doesn't send Origin
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        //   redirect: "follow", // manual, *follow, error
        //   referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
}

// Example POST method implementation:
async function postDataGET(url = "", data = {}) {
    console.log(JSON.stringify(data));
    // Default options are marked with *
    const response = await fetch(url, {
        method : "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response; // parses JSON response into native JavaScript objects
}

//code to send message to open notification. This will eventually move into my extension logic
// chrome.runtime.sendMessage({type: "notification", options: { 
//     type: "basic", 
//     // iconUrl: chrome.extension.getURL("icon128.png"),
//     title: "Test",
//     message: "Test"
// }});




;(async () => {
   


 
        

    // tf.loadLayersModel( chrome.runtime.getURL("./jsmodel/model.json")).then( model=> console.log(model) );



    // console.log(model)
    // console.log(model.predict)

    // console.log(tf)

// const result = "Fodbold . Vinderg vinder over Silkeborg. Viborg tager overbevisende sejr"

    // try {
      
    //     const sportsside = await postDataGET("https://www.dr.dk/sporten/cykling/tourdefrance/vingegaard-kommer-til-savne-noeglehjaelpere-de-er-meget-svaere-erstatte")
   
    //     const dsportsside_data = await sportsside.text()


    //     var el = document.createElement( 'html' );
    //     el.innerHTML = dsportsside_data

    //     const label = el.querySelector(".dre-article-title-section-label__title--link") 
    //     || el.querySelector(".dre-teaser-meta-label.dre-teaser-meta-label--primary")


    //     const header =
    //         el.querySelector(".dre-title-text")

    //     const subHeader =
    //     el.querySelector(".dre-article-title__summary")
    //     ||
    //     el.querySelector(".hydra-latest-news-page-short-news-article__paragraph.dre-variables")

    //     const artivleData =  label?.textContent + " . " + header?.textContent + " . " + subHeader?.textContent;
    //     console.log(artivleData)

    //     const data = await postDataPOST("http://localhost:3000", { question: artivleData })
    //     console.log(data)
    //     const d = await data.text()
    //     console.log(d)
    //     console.log("fdsfsdf")
    //     // const d = await data.text()
    //     // console.log(d)





    // } catch (err) {
    //     console.log("errro")
    //     console.log(err)
    // }
    // console.log(data)



    toggleHTMLVisibility("hidden")

    window.onload = async function () {

        await contentMediator.setCategories(["kampsport", "tennis"])

        const controller = new ContentController<Document, HTMLElement>(new ContentView(), contentMediator, window.location.host);

        await controller.init();

        toggleHTMLVisibility("visible")
         
        const response = await chrome.runtime.sendMessage({sentence: "KORT SPORT . Dansk VM-bagspiller skifter Frankrig ud med Ungarn . Den danske håndboldspiller Kristina Jørgensen skifter Frankrig ud med Ungarn fra den kommende sæson"});
        // do something with response here, not outside the function
        console.log(response);

    }

})();




