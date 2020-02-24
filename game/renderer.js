
function setup(){
    createCanvas(windowWidth,windowHeight)
    frameRate()
    textAlign(CENTER, CENTER)
    rectMode(CENTER)
    addObject({type:'vector',x:-100,y:0,w:20})
    addObject({type:'vector',x:-200,y:0,w:20})
    addObject({type:'constant',out:1,x:0,y:0})
    addObject({type:'constant',out:2,x:40,y:0})
    addObject({type:'constant',out:3,x:80,y:0})
    addObject({type:'constant',out:4,x:120,y:0})
    addObject({type:'constant',out:true,x:190,y:0})
    
    addObject({type:'constant',out:false,x:220,y:0})
    // addObject({type:'variable',out:10,x:10,y:-150})
    addObject({type:'add',x:110,y:100})
    addObject({type:'dec',x:220,y:100})
    addObject({type:'sorty',x:200,y:150})
    addObject({type:'sortx',x:200,y:180})
    addObject({type:'sort',x:200,y:280})
    addObject({type:'reverse',x:200,y:350})
    addObject({type:'reverseList',x:200,y:420})
    addObject({type:'equals',x:200,y:240})
    addObject({type:'not',x:-100,y:240})
    addObject({type:'greater',x:100,y:240})
    addObject({type:'less',x:-200,y:240})
    addObject({type:'gate',x:-120,y:440})
    addObject({type:'and',x:400,y:240})
    addObject({type:'or',x:500,y:240})
    addObject({type:'collector',x:300,y:-40})
    curveTightness(-1.5)
    // tie(0,1)
    resetButtons()


}
function windowResized(){
    resizeCanvas(windowWidth,windowHeight)
    resetButtons()
}


function resetButtons(){
    buttons = []
    buttons.push(new button({txt:'C',x:60,y:height-50,w:90,h:90,onclick:()=>{currentTool = 4}}))
}

function draw(){
    background(255)
    push()
    scale(graphScale,graphScale)
        vCamx += ((camx+width/(2*graphScale))-vCamx)/3
        vCamy += ((camy+height/(2*graphScale))-vCamy)/3
        
        translate(vCamx,vCamy)
        drawgrid()
        stroke(0)
        if(mtie.state){
            line(objects[mtie.first].x,objects[mtie.first].y,mouseX-vCamx,mouseY-vCamy)
        }
        objects.forEach((e)=>{
            e.drawTies()
        })
        objects.forEach((e,i)=>{
            e.display()
            e.update()
        })

        
    pop()
    drawHelpers()
    checkKeys()
    strokeWeight(4)
    stroke(0);
    fill(255);
    buttons.forEach((e)=>{
        e.display()
    })
    strokeWeight(1)
    
}
function mouseWheel(event){

}
