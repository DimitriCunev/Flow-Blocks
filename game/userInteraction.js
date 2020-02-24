
let camSpeed = 5
function checkKeys(){
    if(keyIsDown(87)){
        moveCamera(0,camSpeed)
    }
    if(keyIsDown(83)){
        moveCamera(0,-camSpeed)
    }
    if(keyIsDown(65)){
        moveCamera(camSpeed,0)
    }
    if(keyIsDown(68)){
        moveCamera(-camSpeed,0)
    }
}

function mousePressed(){
    let ob = false;
    buttons.forEach((e)=>{
        if(e.mouseOver){
            ob = true;
        }
    })
    if (!ob){
        for (let i = objects.length-1; i >= 0; i--) {
        
            if(objects[i].mouseOver&&objects[i].active&&currentTool >=0&&currentTool<=3){
                if(currentTool == 0){
                    objects[i].indrag = true;
                    objects[i].drx = objects[i].x-(mouseX-vCamx)
                    objects[i].dry = objects[i].y-(mouseY-vCamy)
                }
                if(currentTool == 1) {
                    mtie.state = true;
                    mtie.first = i
                }
                break;
            }
            
            
        }
    }
    if(mouseButton === CENTER){
        objects.forEach((e)=>{
            if(e.mouseOver){
                e.active = false;
            }
        })
    }
    
}
function mouseClicked(){
    let ob = false;
    buttons.forEach((e)=>{
        if(e.mouseOver){
            e.onclick()
            ob = true;
        }
    })
    if(currentTool == 4&&!ob){
        addObject({name:'C',x:mouseX-vCamx,y:mouseY-vCamy})
    }
    
}
function mouseReleased(){
    objects.forEach((e)=>{
        e.indrag = false;
    })

    if(mtie.state){
        let found = false;
        for (let i = objects.length-1; i >= 0; i--) {
            if(objects[i].mouseOver){
                mtie.second = i
                mtie.state = false;
                tie(mtie.first,mtie.second)
                found = true;
                break;
            }
        }
        if(!found){mtie.first = -1;mtie.second = -1;mtie.state = false;}
    }

}

function keyPressed(){
    if (key == '1') currentTool = 0
    if (key == '2') currentTool = 1
    if (key == '3') currentTool = 2
    if (key == '4') currentTool = 3
    if (key == '5') currentTool = 4
    if (key == '6') currentTool = 5
    if (key == '0') currentTool = -2
}