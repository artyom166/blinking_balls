class Ball {
    constructor(x, y, r, color,index) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = `rgb(${color})`;
        this.index = index


        
    }
    blink(clr){
        const color = this.color
        this.color = clr
        setTimeout(()=>{
        this.color = color
        },500)
        }
}

let data = {
    balls: []
};