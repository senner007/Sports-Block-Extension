const res = fetch("https://www.dr.dk/sporten/fodbold/landsholdet/landsholdet-er-tilfreds-med-sejren-og-fuldt-skur-men-stoerst-af-alt-er");

res.then(r => r.text().then(f => console.log(f)))
