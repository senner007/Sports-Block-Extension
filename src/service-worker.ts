console.log("hello from service-worker")
import * as tf from '@tensorflow/tfjs';

function function_formatter(regexes: any, str: string) {
    let new_str = str.toLocaleLowerCase()
    for (const r in regexes) {
        const regex = new RegExp(regexes[r]["regex"], "gi");
        const replacer = regexes[r]["replacewith"].replace("\\1", () => "$1")
        console.log(replacer)
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

; (async () => {

    const response_rgex = await fetch(chrome.runtime.getURL("./regexes.json"))
    const regexes = await response_rgex.json()

    const response_vocab = await fetch(chrome.runtime.getURL("./vocab.json"))
    const vocab = await response_vocab.json()

    const vocab_dict = create_vocab_dict(vocab)
    console.log(vocab_dict)
    const model = await tf.loadGraphModel(chrome.runtime.getURL("./jsmodel/model.json"));

    chrome.runtime.onMessage.addListener(
        function (request: any, sender, sendResponse) {

            if (!("sentence" in request)) return;

            console.log(request)

            const formatted = function_formatter(regexes, request.sentence);
            const vectorized = vectorize(vocab_dict, formatted)
            const padded = pad_zeros(vectorized);

            const t = tf.tensor([padded]).asType("int32")
            const answer = model.predict(t)
            // @ts-ignore
            const d = answer.dataSync()[0]

            sendResponse({ farewell: d, padded: padded });
        }
    );

})();



