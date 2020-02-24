function distance(x1,y1,x2,y2) {
    return (Math.sqrt(pow(x2-x1,2)+pow(y2-y1,2)))
}
function angbtw(x1,y1,x2,y2){
    return atan2(y2-y1, x2-x1)*180/PI;
}
function sina(a){
    return sin(a*PI/180)
}
function cosa(a){
    return cos(a*PI/180)
}
function dline(x,y,a,d){
    line(x,y,x+d*cosa(a),y+d*sina(a))
}

function inrange(x,y,w,h,x1,y1){ // in box range
    if(x1>x&&x1<x+w&&y1>y&&y1>y+h){return true} else {return false}
}
function incrange(x,y,r,x1,y1){ // in circular range
    if(distance(x,y,x1,y1)<=r){return true} else {return false}
}

function isOnSurface(body, floor) {
    const bottomLeft = getBottomLeft(body);
    const bottomCenter = getBottom(body);
    const bottomRight = getBottomRight(body);
  
    return (
    //   Matter.Query.ray([floor], bottomLeft, {x: bottomLeft.x, y: bottomLeft.y + 1}).length ||
      Matter.Query.ray([floor], bottomCenter, {x: bottomCenter.x, y: bottomCenter.y + 1}).length 
    //   ||Matter.Query.ray([floor], bottomRight, {x: bottomRight.x, y: bottomRight.y + 1}).length
    );
  }
  function getBottom(body) {
    const { min, max } = body.bounds;
  
    return {
      x: min.x + ((max.x - min.x) / 2),
      y: max.y
    };
  }
  
  function getBottomRight(body) {
    const { min, max } = body.bounds;
  
    return {
      x: min.x + (max.x - min.x),
      y: max.y
    };
  }
  
  function getBottomLeft(body) {
    const { min, max } = body.bounds;
  
    return {
      x: min.x,
      y: max.y
    };
  }