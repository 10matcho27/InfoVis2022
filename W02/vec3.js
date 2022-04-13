class Vec3
{
    //Constructor
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }
    min(){
        Math.min(this.x, this.y, this.z);
    }
    max(){
        Math.max(this.x, this.y, this.z);
    }
    mid(){
        if(this.x != this.min() && this.x != this.max()){
            return this.x;
        }else{
            if(this.y != this.min() && this.y != this.max()){
                return this.y;
            }else{
                return this.z;
            }
        }
    }
}