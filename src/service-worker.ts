console.log("Service-worker")
import * as tf from '@tensorflow/tfjs';

function function_formatter(regexes: any, str: string) {
    let new_str = str.toLocaleLowerCase()
    for (const r in regexes) {
        const regex = new RegExp(regexes[r]["regex"], "gi");
        const replacer = regexes[r]["replacewith"].replace("\\1", () => "$1")
        new_str = new_str.replace(regex, replacer)
    }

    return new_str.split(" ").map(s => s.trim()).filter(s => s)
}
function create_vocab_dict(vocab: string[]) {

    const obj: Record<string, number> = {}
    for (const [i, v] of vocab.entries()) {
        obj[v] = i
    }
    return obj

}
function vectorize(vocab_dict: Record<string, number>, words: string[]) {
    let vectors: number[] = []
    for (const w of words) {
        vectors.push(vocab_dict[w])
    }
    return vectors
}

function pad_zeros(words: number[]) {

    return new Array(60).fill(0).map((w, i) => {
        return words[i] || 0
    });

}

async function getUrl(url: string, signal : AbortSignal) {
    const res = await fetch(url, { signal })
    const json = await res.text();
    return json
}

const urls :Record<string, AbortController> = {}

const modelCache : Record<"regexes" | "vocabDict" | "model", any> = {
    "regexes" : null,
    "vocabDict" : null,
    "model": null
} as const


async function loadModel() : Promise<typeof modelCache> {

    if (modelCache["regexes"] !== null) {
        return modelCache
    }

    const response_rgex = await fetch(chrome.runtime.getURL("./regexes.json"))
    const regexes = await response_rgex.json()

    const response_vocab = await fetch(chrome.runtime.getURL("./vocab.json"))
    const vocab = await response_vocab.json()

    const vocab_dict = create_vocab_dict(vocab)
    const model = await tf.loadGraphModel(chrome.runtime.getURL("./jsmodel/model.json"));

    modelCache["regexes"] = regexes;
    modelCache["vocabDict"] = vocab_dict;
    modelCache["model"] = model;

    return modelCache
}


// ; (async () => {

    chrome.runtime.onMessage.addListener((request: {url : string, controller: AbortController} | {sentence : string}, sender, sendResponse) => {

            if ("url" in request) {
                if (urls[request.url]) {
                    urls[request.url].abort()
                }
                const controller = new AbortController();
                const signal = controller.signal;
                urls[request.url] = controller;
                ;(async () => {
                    try {
                        var url = await getUrl(request.url, signal);
                        sendResponse(url);
                    } catch (err) {
                        sendResponse("ERROR");
                    }
               
                })();
                return true;
            };

            if (("sentence" in request)) {
                ;(async () => {

                    const modelCache = await loadModel();

                    const formatted = function_formatter(modelCache.regexes, request.sentence);
                    const vectorized = vectorize(modelCache.vocabDict, formatted)
                    const padded = pad_zeros(vectorized);

                    const t = tf.tensor([padded]).asType("int32")
                    const answer = modelCache.model.predict(t)
                    // @ts-ignore
                    const d = answer.dataSync()[0]
                    sendResponse(d);

                })();
                return true;

            }
     
        }
    );

// })();



