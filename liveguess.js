class liveG {
  constructor(Canvas_Object, width, height, thickness = 1, write_color = "white", background = "black", fade = true) {
    this.initCanvas(Canvas_Object, width, height);
    this.initStyle(thickness, write_color, background, fade);
    this.initImg();
  }

  initCanvas(Canvas_Object, width, height) {
    this.c = Canvas_Object;
    this.ctx = Canvas_Object.getContext("2d");

    this.width = width || this.c.width;
    this.height = height || this.c.height;

    this.scaleY = this.c.height / this.height;
    this.scaleX = this.c.width / this.width;
  }

  initStyle(thickness, write_color, background, fade) {
    this.wc = write_color;
    this.bc = background;
    this.penw = thickness;
    this.fade = fade;
    console.log("Background Color has been changed to: " + this.bc+".");
    this.c.style.backgroundColor = this.bc;
  }

  initImg() {
    this.data = new Array(this.width * this.height).fill(0.01);
  }

  setInput(x, y) {
    x = Math.floor(x / this.scaleX);
    y = Math.floor(y / this.scaleY);
    let index = x + this.width * y;
    if (this.fade) {
      for (let i = -1; i < 2; i++) {
        this.data[index + i] = 0.3; //middle layer
        if (this.data[index + i - this.width])
          this.data[index + i - this.width] = 0.3; //top layer
        if (this.data[index + i + this.width])
          this.data[index + i + this.width] = 0.3; //bottom layer
      }
    }
    this.data[index] = 1;

    this.ctx.fillStyle = this.wc;
    this.ctx.globalAlpha = 0.3;
    if (this.fade) {
      for (let i = -1; i < 2; i++) {
        this.ctx.fillRect((x + i) * this.scaleX, y * this.scaleY, this.scaleX, this.scaleY); //middle layer
        if (this.data[index + i - this.width])
          this.ctx.fillRect((x + i) * this.scaleX, (y - 1) * this.scaleY, this.scaleX, this.scaleY);; //top layer
        if (this.data[index + i + this.width])
          this.ctx.fillRect((x + i) * this.scaleX, (y + 1) * this.scaleY, this.scaleX, this.scaleY);; //bottom layer
      }
    }
    this.ctx.globalAlpha = 1;
    this.ctx.fillRect(x * this.scaleX, y * this.scaleY, this.scaleX, this.scaleY);
  }

  getData(convert = false) {
    return (convert && typeof Matrix == "function") ? Matrix.fromArray(this.data) : this.data;
  }

  clearData() {
    this.ctx.clearRect(0, 0, this.c.width, this.c.height);
    this.initImg();
    console.log("Cleared the Image!");
  }

}
