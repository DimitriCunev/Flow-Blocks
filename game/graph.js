let camx=0 ,camy=0
let vCamx=0,vCamy=0
let graphSize = 5000
let graphScale = 1
let currentTool = 0
let mtie = {state:false,first:-1,second:-1}

function drawHelpers(){
    fill(0)
    textSize(15)
    textAlign(LEFT, TOP)
    text(round(frameRate()),20,20)
    
    textSize(20)
    textAlign(CENTER, CENTER)
}
function drawgrid(){
    let sepGrid = 20
    stroke('rgba(0,0,0,0.3)')
    for (let i = 0; i < graphSize/sepGrid; i++) {
        line(i*sepGrid-graphSize/2,-graphSize/2,i*sepGrid-graphSize/2,height+graphSize/2)
        line(-graphSize/2,i*sepGrid-graphSize/2,width+graphSize/2,i*sepGrid-graphSize/2)
    }
    strokeWeight(3)
    line(-graphSize/2,0,graphSize/2,0)
    line(0,-graphSize/2,0,graphSize/2)
}

function moveCamera(dx,dy){
    camx+=dx;
    camy+=dy;
}

let objects = []

function addObject(data){
    objects.push(new object(data))
}

class object {
    constructor(data){
        data.x ? this.x = data.x : this.x = 0
        data.y ? this.y = data.y : this.y = 0
        data.w ? this.w = data.w : this.w = 50
        data.h ? this.h = data.h : this.h = 50
        data.out!=undefined ? this.out = data.out : this.out = 0
        data.type ? this.type = data.type : this.type = 'none'
        data.clickable ? this.clickable = data.clickable : this.clickable = true
        data.dragable ? this.dragable = data.dragable : this.dragable = true;
        data.name ? this.name = data.name : this.name = 'C'
        data.size ? this.size = data.size : this.size = 35;
        this.ties = []
        this.initTies = []
    
        this.vx = this.x,this.vy = this.y;this.drx = 0;this.dry = 0;
        this.mouseOver = false;
        this.indrag = false;
        this.fcolor = '#e74c3c'
        this.active = true;
        this.used = false;
        if (data.javascriptIsShit) this.javascriptIsShit = data.javascriptIsShit;
        
        this.reqirements = {in:true,out:false}
        this.cons = {in:[],out:[]}

        this.onTie = (data)=>{}
        this.everyTick = ()=>{}
        //Data Ident
        if (this.type == 'vector'){
            
            this.fcolor = '#e67e22'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.objVals = []
                this.cons.in.forEach((e)=>{
                    this.objVals.push(objects[e].out)
                })
                this.objVals = this.objVals.flat()
                this.objVals.length>0 ? this.string = this.objVals.join(', ') : this.string = 'None'
                this.w = textWidth(this.string)*2;this.h = 35;
                this.out = this.objVals
            }
        }
        if (this.type == 'constant'){

            this.string = this.out
            if(this.out===0){this.string='0'} else if(this.out===false){this.string='false'}

            this.w = constrain(textWidth(this.string)*2, 25, textWidth(this.string)*2);this.h = 35;
            this.fcolor = '#3498db'
        }

        if (this.type == 'add'){
            this.fcolor = '#e74c3c'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = 0
                var toArr = []

                this.cons.in.forEach((e)=>{
                    toArr.push(objects[e].out)
                })
                
                
                
                toArr = toArr.flat()
                toArr.forEach((e)=>{
                    this.out+=e;
                })
                // console.log(toArr);
                this.string = 'add'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'dec'){
            this.fcolor = '#e74c3c'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                let objVals = []
                this.out = 0;
                this.cons.in.forEach((e)=>{
                    objVals.push({y:objects[e].y,val:objects[e].out})
                })
                objVals = objVals.sort(function(a,b){return a.y-b.y})
                objVals.forEach((e,i)=>{
                    let cval = e.val
                    let pval = 0
                    if(e.val.length>1) {
                        e.val = e.val.flat()
                        e.val.forEach((ji,ni)=>{
                            ni==0 ? pval = ji : pval-=ji;
                        })
                        i == 0 ? this.out = pval : this.out-=pval;;
                    } else i == 0 ? this.out = cval : this.out-=cval;;
                    
                })
                this.string = 'subtract'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'sorty'){
            this.fcolor = '#9b59b6'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                let objVals = []
                this.cons.in.forEach((e)=>{
                    objVals.push({y:objects[e].y,val:objects[e].out})
                })
                objVals = objVals.sort(function(a,b){return a.y-b.y})
                let flatobjs = []
                objVals.forEach((e,i)=>{
                    flatobjs.push(e.val)
                })
                this.out = flatobjs.flat()                
                this.string = 'SortByY:' + this.out
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'sortx'){
            this.fcolor = '#9b59b6'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                let objVals = []
                this.cons.in.forEach((e)=>{
                    objVals.push({y:objects[e].x,val:objects[e].out})
                })
                
                objVals = objVals.sort(function(a,b){return a.y-b.y})
                let flatobjs = []
                objVals.forEach((e,i)=>{
                    flatobjs.push(e.val)
                })
                this.out = flatobjs.flat()
                this.string = 'SortByX:' + this.out
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'sort'){
            this.fcolor = '#9b59b6'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                let objVals = []
                this.cons.in.forEach((e)=>{
                    objVals.push({y:objects[e].x,val:objects[e].out})
                })
                
                objVals = objVals.sort(function(a,b){return a.val-b.val})
                let flatobjs = []
                objVals.forEach((e,i)=>{
                    flatobjs.push(e.val)
                })
                this.out = flatobjs.flat()
                this.string = 'Sort:' + this.out
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'reverse'){
            this.fcolor = '#9b59b6'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                let objVals = []
                this.cons.in.forEach((e)=>{
                    objVals.push(objects[e].out)
                })
                objVals = objVals.reverse().flat()
                this.out = objVals
                this.string = 'Reverse:' + this.out
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'reverseList'){
            this.fcolor = '#9b59b6'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                let objVals = []
                this.cons.in.forEach((e)=>{
                    objVals.push(objects[e].out)
                })
                objVals = objVals.flat().reverse()
                this.out = objVals
                this.string = 'Reverse List:' + this.out
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'equals'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                this.cons.in.forEach((e,i)=>{
                    this.out.push(objects[e].out)
                })
                this.out = this.out.flat()
                if(this.out.length=2) if(this.out[0]==this.out[1]){this.out = true} else {this.out = false} else {this.out = false}
                this.string = 'equals'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'not'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                this.cons.in.forEach((e,i)=>{
                    this.out.push(objects[e].out)
                })
                this.out = this.out.flat()
                this.out = !this.out[0]
                this.string = 'not'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'and'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = true
                this.cval = 0
                this.cons.in.forEach((e,i)=>{
                    if(objects[e].out!=1){this.out = false}
                })
                
                this.string = 'and'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'or'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = false
                this.cval = 0
                this.cons.in.forEach((e,i)=>{
                    if(objects[e].out==1){this.out = true}
                })
                
                this.string = 'or'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'greater'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                this.cons.in.forEach((e,i)=>{
                    this.out.push(objects[e].out)
                })
                this.out = this.out.flat()
                if(this.out.length=2) if(this.out[0]>this.out[1]){this.out = true} else {this.out = false} else {this.out = false}
                this.string = 'greater'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'less'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                this.cons.in.forEach((e,i)=>{
                    this.out.push(objects[e].out)
                })
                this.out = this.out.flat()
                if(this.out.length=2) if(this.out[0]<this.out[1]){this.out = true} else {this.out = false} else {this.out = false}
                this.string = 'less'
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        if (this.type == 'gate'){
            this.fcolor = '#2ecc71'
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{
                this.out = []
                this.cons.in.forEach((e,i)=>{
                    this.out.push(objects[e].out)
                })
                this.out =  this.out.flat()
                this.out[0]!=undefined ? this.string = `if (${this.out[0]})\npass (${this.out[1]})\nelse (${this.out[2]})` : this.string = 'if (a)\npass (b)\nelse (c)'
                if(this.out[0]==true){
                    this.out[1] ? this.out = this.out[1] : this.out = []
                } else {
                    this.out[2]!=undefined ? this.out = this.out[2] : this.out = []
                }
                
                this.w = 200;this.h = 105;
            }
        }

        if (this.type == 'collector'){
            this.fcolor = '#2ecc71'
            this.out = 0;
            this.onTie = (data)=>{data.in ? this.cons.in.push(data.index):0;}
            this.everyTick = ()=>{

                if(objects[this.cons.in[0]]!=undefined) this.out +=parseInt(objects[this.cons.in[0]].out)

                
                this.string = 'collector : '+this.out 
                this.w = constrain(textWidth(this.string)*1.5, 25, textWidth(this.string)*2);this.h = 35;
            }
        }
        
    }
    display(){
        if(this.active){
            fill(this.fcolor)
            rect(this.x,this.y,this.w,this.h,10)
            fill(255)
            this.string ? text(this.string,this.x,this.y) : 0;
        }
        
        if(this.active){
            this.everyTick()
            this.cons.in.forEach((e,i)=>{
                if(!objects[e].active){this.cons.in.splice(i,1)}
            })
        } else {this.out = 0}
        
    }

    drawTies(){
        if(this.active){
            this.ties.forEach((e,i)=>{
                if(objects[e].active){
                    // line(this.x,this.y,objects[e].x,objects[e].y)
                    let mine = false;
                    this.initTies.forEach((j)=>{
                        if (e==j){mine = true;}
                    })
                    noFill()
                    let vpx = this.x-this.w/2;
                    let vpy = this.y+this.h/2
                    let ovpx = objects[e].x+objects[e].w/2
                    let ovpy = objects[e].y-objects[e].h/2
                    let ox = objects[e].x
                    let oy = objects[e].y
                    let xdist = Math.abs(vpx-ovpx)/2
                    let ydist = Math.abs(vpy-ovpy)/2
                    let ang = angbtw(this.x,this.y,objects[e].x,objects[e].y);
                    let steps = 15;
                    if ( ang > 45 && ang < 135 ){
                        bezier(this.x,vpy,this.x,vpy+ydist,ox,ovpy-ydist,ox,ovpy)
                        let t = 7 / steps;
                        let x = bezierPoint(this.x, this.x, ox, ox, t);
                        let y = bezierPoint(vpy, vpy+ydist, ovpy-ydist, ovpy, t);
                        let x1 = bezierPoint(this.x, this.x, ox, ox, (7+1) / steps);
                        let y1 = bezierPoint(vpy, vpy+ydist, ovpy-ydist, ovpy, (7+1) / steps);
                        push()
                        strokeWeight(2)
                        translate(x,y)
                        fill(255)
                        rotate((angbtw(x,y,x1,y1)+90-180*mine)*PI/180)
                        triangle(-5, 0, 5, 0, 0, 8)
                        pop()
                            // drawArrow(createVector(x,y), createVector(x1,y1), 'black');
                        

                    } else if ( (ang > 135 && ang <= 180)||(ang<-135&&ang>=-180) ) {

                        bezier(vpx,this.y,vpx-xdist,this.y,ovpx+xdist,oy,ovpx,oy)
                        let t = 7 / steps;

                        let x = bezierPoint(vpx, vpx-xdist, ovpx+xdist, ovpx, t);
                        let y = bezierPoint(this.y, this.y, oy, oy, t);
                        let x1 = bezierPoint(vpx, vpx-xdist, ovpx+xdist, ovpx, (7+1) / steps);
                        let y1 = bezierPoint(this.y, this.y, oy, oy, (7+1) / steps);
                        push()
                        strokeWeight(2)
                        translate(x,y)
                        fill(255)
                        rotate((angbtw(x,y,x1,y1)+90-180*mine)*PI/180)
                        triangle(-5, 0, 5, 0, 0, 8)
                        pop()
                        
                    }
                    
                    
                } else {
                    this.ties.splice(i,1);
                }
                
            })
        }
        
    }
    update(){
        let vCamxm = camx+width/2
        let vCamym = camy+height/2
        let mousevX = mouseX-vCamxm;
        let mousevY = mouseY-vCamym;
        let interpolationValue=1
        this.vx += (this.x-this.vx)/interpolationValue;this.vy += (this.y-this.vy)/interpolationValue;
        this.mouseOver = mousevX>this.x-this.w/2&&mousevX<this.x+this.w/2&&mousevY>this.y-this.h/2&&mousevY<this.y+this.h/2
        if(this.indrag){
            this.x = mousevX+this.drx
            this.y = mousevY+this.dry
        }
    }
}
function tie(ia,ib){
    let acceptable = true;
    for (let i = 0; i < objects[ia].ties.length; i++) {
        if(objects[ia].ties[i]==ib){acceptable = false;}
    }
    if(ia == ib){acceptable = false}
    if (!objects[ia].active||!objects[ib].active){this.acceptable = false}

    if(acceptable){
        objects[ia].ties.push(ib);
        objects[ib].ties.push(ia);
        objects[ia].initTies.push(ib)
        objects[ia].onTie({index:ib,obj:objects[ib],in:false});objects[ib].onTie({index:ia,obj:objects[ia],in:true})
    }
    
}

let buttons = []
class button {
    constructor(data){
        this.x = data.x
        this.y = data.y
        this.w = data.w
        this.h = data.h
        this.txt = data.txt
        this.onclick = data.onclick
        this.mouseOver = false;
    }
    display(){
        this.mouseOver = mouseX>this.x-this.w/4&&mouseX<this.x+this.w/4&&mouseY>this.y-this.h/4&&mouseY<this.y+this.h/4
        
        if(this.mouseOver) {rect(this.x,this.y,this.w/2-2,this.h/2-2,6)} else {rect(this.x,this.y,this.w/2,this.h/2,6)}
        text(this.txt,this.x,this.y)
    }
}


