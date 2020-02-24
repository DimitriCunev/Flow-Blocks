/*

SmoothMovement.js

Facilitates smooth movement effects

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a SmoothMovement. A SmoothMovement produces integer position values
 * representing movement towards a target position, with a maximum acceleration
 * or deceleration of one distance unit per time unit squared. The parameters
 * are:
 *
 * position - the initial position - this optional parameter defaults to zero
 * target   - the target position - this optional parameter defaults to the
 *            value of the position parameter
 */
function SmoothMovement(position, target){

  // initialise the position, target, velocity, and animation interval
  this.position          = (position == undefined ? 0             : position);
  this.target            = (target   == undefined ? this.position : target);
  this.velocity          = 0;
  this.animationInterval = null;

}

/* Updates the position an velocity for this SmoothMovement, and returns the
 * new position.
 */
SmoothMovement.prototype.update = function(){

  // check whether the velocity is negative
  if (this.velocity < 0){

    // check whether we must decelerate or can accelerate
    if (this.target > this.position - this.velocity * (this.velocity - 1) / 2){

      // we must decelerate to avoid overshooting, so decrease the speed
      this.velocity ++;

    }else if (this.target <=
        this.position - (this.velocity - 1) * (this.velocity - 2) / 2){

      // we can accelerate without overshooting, so increase the speed
      this.velocity --;

    }

  }else{

    // check whether we must decelerate or can accelerate
    if (this.target < this.position + this.velocity * (this.velocity + 1) / 2){

      // we must decelerate to avoid overshooting, so decrease the speed
      this.velocity--;

    }else if (this.target >=
        this.position + (this.velocity + 1) * (this.velocity + 2) / 2){

      // we can accelerate without overshooting, so increase the speed
      this.velocity++;

    }

  }

  // update the position
  this.position += this.velocity;

  // return the new position
  return this.position;

}

/* Returns true if this SmoothMovement has stopped, and false otherwise. Note
 * that this means that both the velocity and acceleration are zero (or
 * equivalently, that the velocity is zero and the position is at the target).
 */
SmoothMovement.prototype.hasStopped = function(){

  // return whether we have stopped
  return (this.position == this.target && this.velocity == 0);

}

/* Animates this SmoothMovement by calling the update function repeatedly until
 * the SmoothMovement has stopped. The parameters are:
 *
 * interval       - the interval between updates, in milliseconds
 * updateListener - a function to call after each update. This function is
 *                  passed the new position and the SmoothMovement as its
 *                  first and second parameters.
 * stopListener   - a function to call when the SmoothMovement has stopped. This
 *                  function is passed the SmoothMovement as its parameter. This
 *                  parameter is optional.
 */
SmoothMovement.prototype.animate = function(
    interval, updateListener, stopListener){

  // clear any current animation interval
  if (this.animationInterval) window.clearInterval(this.animationInterval);

  // create the new animation interval
  this.animationInterval = window.setInterval(
      this.createAnimationClosure(updateListener, stopListener), interval);

}

/* Creates a closure for use in the animate function. This function is not
 * intended to be used elsewhere. The parameters are:
 *
 * updateListener - a function to call after each update
 * stopListener   - a function to call when the SmoothMovement has stopped
 */
SmoothMovement.prototype.createAnimationClosure = function(
    updateListener, stopListener){

  // store a reference to the 'this' object
  var thisObject = this;

  // return the animation closure
  return function(){

    // update the SmoothMovement
    thisObject.update();

    // call the update listener
    updateListener(thisObject.position, thisObject);

    // check whether the SmoothMovement has stopped
    if (thisObject.hasStopped()){

      // clear the animation interval
      window.clearInterval(thisObject.animationInterval);
      thisObject.animationInterval = null;

      // call the stop listener if one was supplied
      if (stopListener) stopListener(thisObject);

    }

  }

}
