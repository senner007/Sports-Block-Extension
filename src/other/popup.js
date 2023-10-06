console.log("This is a popup!")

function doBeforeLoad(event){
    console.log("dsdsd")
}

document.addEventListener('beforeload', doBeforeLoad , true);