let ConstructionError = new Error("The input has to be a layer configuration [as an Array] or another AvoNet!");
let InputError = new Error("The Input has to be an ARRAY with as much elements as the input nodes!");
let IOError = new Error("The Input/Output has to be an ARRAY with as much elements as the input/output nodes!");

let sigmoid = (x) => 1 / (1 + Math.pow(Math.E, -x));

let dsigmoid = (x) => sigmoid(x) * (1 - sigmoid(x));

let logit = (y) => Math.log(y / (1 - y));

let simple = (x) => (x > 0) ? 1 : 0;

class AvoNet { //Add function that checks for negative values in config
  constructor(layer_configuration,input) {
    if (layer_configuration instanceof AvoNet) {

      this.nodes = layer_configuration.nodes.slice();
      this.weights = layer_configuration.weights.slice();
      this.bias = layer_configuration.bias.slice();
      this.config = JSON.parse(JSON.stringify(layer_configuration.config));
      this.rate = layer_configuration.rate;
      this.gen = layer_configuration.gen;
      this.maxError = layer_configuration.maxError;
      this.minError = layer_configuration.minError;
      this.ErrorSum = layer_configuration.ErrorSum;
      this.wholeError = layer_configuration.wholeError;

    } else if (Array.isArray(layer_configuration)) {

      this.config = this.initConfig(layer_configuration);
      this.nodes = this.initNodes();
      this.weights = this.initWeights(input);
      this.bias = this.initBias(input);
      this.rate = 0.2;
      this.gen = 0;
      this.maxError = 0;
      this.minError = Infinity;
      this.ErrorSum = 0;
      this.wholeError = 0;

    } else {

      throw ConstructionError;

    }
  }

  initConfig(conf) {
    let layer = conf.length;
    let conf_JSON = JSON.stringify(conf);
    let outputs = conf.pop();
    let inputs = conf.shift();
    let hidden = (conf.length > 0) ? conf.slice() : null;
    return {
      layer,
      inputs,
      hidden,
      outputs,
      conf_JSON
    };
  }

  initNodes() {
    return JSON.parse(this.config.conf_JSON);
  }

  initWeights(input) {
    let weights;
    if(input) {
      weights = new Array(this.config.layer - 1).fill(0);
      weights = weights.map((weight, i) => new Matrix(this.nodes[i + 1], this.nodes[i], input));
    } else {
      weights = new Array(this.config.layer - 1).fill(0);
      weights = weights.map((weight, i) => new Matrix(this.nodes[i + 1], this.nodes[i]));
      weights.forEach(weight => weight.randomize());
    }
    return weights;
  }

  initBias(input) {
    let bias;
    if(input)
      bias = new Array(this.config.layer - 1).fill(0).map((bias, index) => new Matrix(this.nodes[index + 1], 1,input));
    else {
      bias = new Array(this.config.layer - 1).fill(0).map((bias, index) => new Matrix(this.nodes[index + 1], 1));
      bias.map(b => b.randomize());
    }
    return bias
  }

  download() {
    let name = "AvoNet_" + this.config.layer + "_layer.json";
    saveFile(name, JSON.stringify(this));
  }

  clone() {
    return new AvoNet(this);
  }

  error(input, real) {
    let guess = Matrix.fromArray(this.guess(input));
    real = Matrix.fromArray(real);
    let error = Matrix.sub(real, guess);
    error = error.toArray_flat();
    error = error.map(x => x * x);
    error = error.reduce((x, y) => x + y);
    ///Experimental///
    this.minError = (error < this.minError) ? error : this.minError;
    this.maxError = (error > this.maxError) ? error : this.maxError;
    this.ErrorSum += error;
    this.wholeError = this.ErrorSum / this.gen;
    //Experimental///
    return error;
  }

  guess(input) {
    if (!Array.isArray(input) || input.length != this.config.inputs) {
      throw InputError;
    }
    let value = Matrix.fromArray(input);
    this.weights.forEach((weight, index) => {
      value = Matrix.prod(weight, value);
      value.add(this.bias[index]);
      value.map(sigmoid);
    });
    return value.toArray_flat();
  }

  think(output) {
    if (!Array.isArray(output) || output.length != this.config.outputs) {
      throw InputError;
    }
    let weights_T = this.weights.slice().reverse();
    let revBias = this.bias.slice().reverse();
    let value = Matrix.fromArray(output);
        value.map(logit);
    weights_T.forEach((weight, index) => {
      value = Matrix.prod(weight.transpose(), value);
    });
    return value.toArray_flat();
  }


  train(input, real) {

    if (!Array.isArray(input) ||
      !Array.isArray(real) ||
      input.length != this.config.inputs ||
      real.length != this.config.outputs) {
      throw IOError;
    }

    this.gen++;

    //transform the targets into a matrix
    let target = Matrix.fromArray(real);

    //transform the inputs into a matrix
    let layer = Matrix.fromArray(input);


    //prepare the nodes [first layer contains the inputs]
    let layers = [layer.copy()];

    //calculate values of the nodes [forward propagation]
    this.weights.forEach((weight, index) => {

      //add all the connections to each node together
      layer = Matrix.prod(weight, layer);
      layer.add(this.bias[index]);
      //apply the activation function
      layer.map(sigmoid);
      //push each layer into a layers array
      layers.push(layer.copy());

    });

    let final_output = layers[layers.length - 1];

    //compute the output_error
    let final_error = Matrix.sub(target, final_output);
    //define another error variable [for later use]
    let err;

    //backwards propagation [loop backwards through the weights to alter them consecutively]
    for (let i = this.weights.length - 1; i >= 0; i--) {
      //the first error is just target-guess
      if (i == this.weights.length - 1) {
        err = final_error;
      }
      //the other errors / gradients have to be computed differently e.g [e_h = W_ho^T * e_o]
      else {
        //calculates the error on each layer
        err = Matrix.prod(this.weights[i + 1].transpose(), err);
      }

      // we need next and previous because the weights connect 2 layers
      // it's [i+1] because you have one more layer than weights
      let layer_a = layers[i + 1].copy();
      let layer_b = layers[i].transpose();

      // compute the gradient in 3 steps
      // learning_rate * error * layer_a * (1 - layer_a) * layer_b^T

      let gradient;
      // 1.) (1 - layer_a) or. ( -layer_a + 1 )
      gradient = Matrix.add(Matrix.invert(layer_a), 1);
      // 2.)  layer_a * [(1 - layer_a)]
      gradient = Matrix.mult(layer_a, gradient);
      // 3.)  error * [layer_a * (1 - layer_a)]
      gradient = Matrix.mult(err, gradient);

      //compute delta_W and moderate it in 2 steps
      let delta_W;
      // 1.) gradient * layer_b^T
      delta_W = Matrix.prod(gradient, layer_b);
      // 2.) learning_rate * delta_W
      delta_W = Matrix.mult(delta_W, this.rate);

      this.weights[i].add(delta_W);

      //compute delta_B [change in bias] {is just the gradient}
      let delta_B = Matrix.mult(gradient, this.rate);

      this.bias[i].add(delta_B);

    }
  }

  static importObject(Network) {
    console.log("creating the outer shell of the Network.");
    let t = timestamp();
    let Net = new AvoNet(Network.nodes);
    console.log("Done!");
    timestamp(t);
    console.log("Copying the weights and the bias.");
    t = timestamp();
    Net.weights = Network.weights.map(weight => Matrix.fromObject(weight));
    Net.bias = Network.bias.map(b => Matrix.fromObject(b));
    console.log("Done!");
    timestamp(t);
    Net.rate = Network.rate;
    console.log("Network has been successfully imported!");
    return Net;
  }


}







//
