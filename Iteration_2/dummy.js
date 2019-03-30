
//setInterval(() => console.log(`${Date.now().toString()}\n`), 1000)
var y, x = Date.now()

while(true){
    y = Date.now()
    if(((y - x) / 1000) >= 1.0 ){
        console.log(`${x.toString()}\n`)
        x = Date.now()
    }
}