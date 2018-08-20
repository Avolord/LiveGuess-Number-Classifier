/**
 * @version 1.0.0
 * @author AvoLord
 * @description Performs simple matrix math
 */


/**
 * Sets the Error-messages and the state
 */
let Matrix_Class_Error_Message = true;
let WrongType1 = new TypeError("Error, wrong object! The object has to be a matrix or a number.");
let WrongType2 = new TypeError("Error, wrong object! The object has to be a matrix.");
let WrongType3 = new TypeError("Error, wrong object! The object has to be a function.");
let WrongType4 = new TypeError("Error, wrong object! The object has to be an array [of the right type].");
let WrongType5 = new TypeError("Error, wrong object! The object has to be a number.");
let WrongDim1 = new RangeError("Error, wrong dimensions! Amount of columns of A have to be equal to the amount of rows of B.");
let WrongDim2 = new RangeError("Error, wrong dimensions! Matrix has to be quadratic.");
let WrongArrDim = new RangeError("Error, wrong dimensions! Sub arrays have to have the same length.");

/**
 * Creates a new matrix-object with given rows, columns and fill
 * @constructor
 * @param { Number } rows - The amount of rows of the matrix
 * @param { Number } columns - The amount of columns of the matrix
 * @param { Number } fill - The number with wich the matrix will be filled
 */
class Matrix {
  constructor(rows, columns, fill) {
    rows = (Number.isInteger(rows)) ? rows : 3;
    columns = (Number.isInteger(columns)) ? columns : 3;
    fill = (Number.isInteger(fill)) ? fill : 0;
    this.cols = columns;
    this.rows = rows;
    this.data = new Array(this.rows).fill(0).map(cols => new Array(this.cols).fill(fill));
  }

  /**
   * Shows the contents of the matrix in the console
   * @inner
   */
  show() {
    if (console.table) {
      console.table(this.data);
    } else {
      let row_string = "";
      this.data.forEach(row => {
        row_string = row_string.concat("[");
        row.forEach(col => {
          row_string = row_string.concat(" " + col + " ");
        });
        row_string = row_string.concat("]\n");
      });
      console.log(row_string);
    }
  }

  dim() {
    return new Array(this.rows, this.cols);
  }

  /**
   * Toggels if Error messages are displayed
   * @static
   */
  static Error_Message() {
    Matrix_Class_Error_Message = (Matrix_Class_Error_Message) ? false : true;
    console.log((Matrix_Class_Error_Message) ?
      "Error messages are now displayed!" :
      "Error messages are now hidden!"
    );
  }

  /**
   * Creates a random Integer
   * @static
   * @param { Number } min - The minimum random number
   * @param { Number } max - The maximum random number
   * @return { Number } - A random number between min and max
   */
  static randomInt(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  /**
   * The scalar-multiplication of two arrays seen as vectors
   * @static
   * @param { Object } a1 - The first  array / vector
   * @param { Object } a2 - The second array / vector
   * @return { Object } The scalar-product of two "vectors"
   */
  static array_mult(a1, a2) {
    if (!(a1 instanceof Array) || !(a2 instanceof Array) || a1.length != a2.length) {
      throw WrongType4;
      return null;
    }
    let result = 0;
    a1.forEach((x, i) => {
      result += x * a2[i];
    });
    return result;
  }

  /**
   * Creates matrix-object from a two-dimensional array
   * @static
   * @param { Object } array - The array that will be converted to a matrix
   * @return { Object } A new matrix-object with the values form the array
   */
  static fromArray(array) {
    if (!(array instanceof Array)) {
      throw WrongType4;
      return null;
    }
    if (!(array[0] instanceof Array)) {
      array = array.map(x => new Array(1).fill(x));
    }
    let columns = 1;
    if (array[0] instanceof Array) {
      if (!array.every(x => x.length == array[0].length)) {
        throw WrongArrDim;
        return null;
      } else {
        columns = array[0].length;
      }
    }
    let result = new Matrix(array.length, columns);
    result.data = result.data.map((x, i) => {
      return array[i];
    });
    return result;
  }

  static fromObject(obj) {
    let result = new Matrix(obj.rows, obj.cols);
    result.data = obj.data.slice(0);
    return result;
  }

  /**
   * Creates a diagnonal matrix-object
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } diagnonal_num - The number that will fill the diagonal line
   * @param { Number } filler - The number that will fill the result
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with a new set of numbers
   */
  static diagonal(M1, diagonal_num, filler) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.diagonal(diagonal_num, filler);
    return M2;
  }

  static fill(M1, filler) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.fill(filler);
    return M2;
  }

  /**
   * Creates a matrix-object with random numbers
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } min - The minimum random number
   * @param { Number } max - The maximum random number
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with random numbers randing form min to max
   */
  static random(M1, min, max) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.random(min, max);
    return M2;
  }

  /**
   * Creates a matrix on which a function has been mapped to
   * @static
   * @param { Object } M1 - The Matrix that will be cloned and converted
   * @param { function } func - The function that will alter the elements of the matrix
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with a new set of numbers
   */
  static map(M1, func) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.map(func);
    return M2;
  }

  static row_map(M1, row, func) {
    if (!(M1 instanceof Matrix) || !M1.data[row]) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.row_map(row, func);
    return M2;
  }

  static col_map(M1, col, func) {
    if (!(M1 instanceof Matrix) || !M1.data[0][col]) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.col_map(col, func);
    return M2;
  }

  /**
   * Creates a new matrix from the sum of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be added to all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be added to the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static add(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.add(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the difference of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be subtracted from all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be subtracted from the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static sub(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.sub(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the product of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be multiplied with all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be multiplied by the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static mult(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.mult(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the division of the elements of two matrices or a matrix and a number
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @param { Number } Obj - The number that will be divided from all elements of the matrix
   * @param { Object } Obj - The matrix whose elements will be divided by the elements of M1
   * @return { Object } A new Matrix with the same dimensions as the input Matrix but with a new set of numbers
   */
  static div(M1, Obj) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.div(Obj);
    return M2;
  }

  /**
   * Creates a new matrix from the multiplication of two matrices
   * @static
   * @param { Object } M1 - The first matrix
   * @param { Object } M2 - The second matrix that will be multiplied with the first
   * @return { Object } The Product of the matrix multiplication
   */
  static prod(M1, M2) {
    if (!(M1 instanceof Matrix) || !(M2 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    if (M1.cols != M2.rows) {
      throw WrongDim1;
      return null;
    }
    let result = new Matrix(M1.rows, M2.cols);
    let helper = M2.transpose();
    result.data = result.data.map((rows, main_index) => {
      return rows.map((col, sub_index) => {
        return Matrix.array_mult(M1.data[main_index], helper.data[sub_index]);
      });
    });
    return result;
  }

  /**
   * Creates a new matrix whose values are inverted
   * @static
   * @param { Object } M1 - The matrix that will be cloned and converted
   * @return { Object } A new matrix with the same dimensions as the input-matrix but with an inverted set of numbers
   */
  static invert(M1) {
    if (!(M1 instanceof Matrix)) {
      throw WrongType2;
      return null;
    }
    let M2 = M1.copy();
    M2.invert();
    return M2;
  }

  /**
   * Randomizes the elements of a matrix
   * @param { Number } min - The minimum random number
   * @param { Number } max - The maximum random number
   */
  random(min, max) {
    this.data = this.data.map(row => row.map(col => Matrix.randomInt(min || 0, max || 1)));
  }

  randomize() {
    this.data = this.data.map(row => row.map(col => Math.random()*2-1));
  }

  /**
   * Represents a matrix as a two-dimensional array
   * @return An array with the elements of the input-matrix
   */
  toArray() {
    let result = new Array(this.rows);
    result = this.data.splice(0);
    return result;
  }

  /**
   * Represents a matrix as a one-dimensional array
   * @return An array with the elements of the input-matrix
   */
  toArray_flat() {
    let result = [];
    this.data.forEach(rows => rows.forEach(cols => result.push(cols)));
    return result;
  }

  /**
   * Represents a matrix as a string
   * @return A string with the elements of the input-matrix
   */
  toString() {
    return this.data.toString();
  }

  /**
   * Represents a matrix-object as a JSON-file
   * @return A JSON-file with the elements of the input-matrix-object
   */
  serialize() {
    return JSON.stringify(this);
  }

  /**
   * Creates a new matrix-object from a JSON-file
   * @param data - The JSON-file that contains all the necessary information of a matrix-object
   * @return A new matrix-objet with the information of the JSON-file
   */
  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let matrix = new Matrix(data.rows, data.cols);
    matrix.data = data.data;
    return matrix;
  }

  /**
   * Creates the sum of all elements of the matrix
   * @return The sum of all the elements of the input-matrix
   */
  reduce() {
    if (Array.flatten) {
      return this.data.flatten().reduce();
    } else {
      let result = 0;
      this.data.forEach(row => {
        row.forEach(col => {
          result += col;
        });
      });
      return result;
    }
  }

  /**
   * Maps a function to all elements of the matrix
   * @param { function } func - The function that will be mapped to the matrix elements
   */
  map(func) {
    if (typeof func != "function") {
      throw WrongType3;
      return null;
    }
    this.data = this.data.map(rows => rows.map(cols => func(cols)));
  }

  row_map(row, func) {
    if (typeof func != "function") {
      throw WrongType3;
      return null;
    }
    this.data[row] = this.data[row].map(cols => func(cols));
  }

  col_map(col, func) {
    if (typeof func != "function") {
      throw WrongType3;
      return null;
    }
    this.data = this.data.map(rows => rows.map((cols, i) => {
      return (i === col) ? func(cols) : cols
    }));
  }

  /**
   * Creates a copy of a matrix-object
   * @return A copy of the input-matrix
   */
  copy() {
    let result = new Matrix(this.rows, this.cols);
    result.data = this.data.slice(0);
    return result;
  }

  /**
   * Converts the matrix to a unit-matrix
   */
  unit() {
    this.data = this.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return (sub_index === main_index) ? 1 : 0;
      });
    });
  }

  /**
   * Converts the matrix to a diagonal matrix with custom infill
   * @param { Number } diagonal_num - The value of the diagonal line
   * @param { Number } filler - The value that the other elements will have
   */
  diagonal(diagonal_num, filler) {
    if ((diagonal_num != undefined && typeof diagonal_num != "number") || (filler != undefined && typeof filler != "number")) {
      throw WrongType1;
      return null;
    }
    this.data = this.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return (sub_index === main_index) ? (diagonal_num || 1) : (filler || 0);
      });
    });
  }

  fill(filler) {
    if (filler != undefined && typeof filler != "number") {
      throw WrongType1;
      return null;
    }
    this.data = this.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return filler || 0;
      });
    });
  }

  /**
   * Creates the transposed version of a matrix
   * @return The transposed matrix
   */
  transpose() {
    let result = new Matrix(this.cols, this.rows);
    result.data = result.data.map((rows, main_index) => {
      return rows.map((cols, sub_index) => {
        return this.data[sub_index][main_index];
      });
    });
    return result;
  }

  /**
   * Inverts the elements of a matrix
   */
  invert() {
    this.data = this.data.map(rows => rows.map(cols => cols * -1));
  }

  /**
   * Adds elements of another matrix or a number to the initial matrix
   * @param { Number } Obj - The number that will be added to all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements are added to the elements of the initial matrix
   */
  add(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols + (Obj.data[main_index][sub_index] || 0);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols + (Obj || 0)));
    else
      throw WrongType1;
  }

  /**
   * Subtracts elements of another matrix or a number from the initial matrix
   * @param { Number } Obj - The number that will be subtracted from all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements are subtracted from the elements of the initial matrix
   */
  sub(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols - (Obj.data[main_index][sub_index] || 0);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols - (Obj || 0)));
    else
      throw WrongType1;
  }

  /**
   * Multiplies elements of another matrix or a number with the initial matrix
   * @param { Number } Obj - The number that will multiply all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements multiply the elements of the initial matrix
   */
  mult(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols * (Obj.data[main_index][sub_index] || 1);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols * (Obj || 1)));
    else
      throw WrongType1;
  }

  /**
   * Divides elements of the initial matrix by the elements of another matrix or number
   * @param { Number } Obj - The number that will divide added to all elements of the initial matrix
   * @param { Object } Obj - The matrix whose elements divide the elements of the initial matrix
   */
  div(Obj) {
    if (Obj instanceof Matrix)
      this.data = this.data.map((rows, main_index) => {
        return rows.map((cols, sub_index) => {
          return cols / (Obj.data[main_index][sub_index] || 1);
        });
      });
    else if (typeof Obj == "number")
      this.data = this.data.map(rows => rows.map(cols => cols / (Obj || 1)));
    else
      throw WrongType1;
  }

  triangle(above = true, below = false) {
    this.data.forEach((row, i) => {
      row.forEach((col, j) => {
        if (i > j && below) { //below-check
          this.data[i][j] = 0;
        }
        if (i < j && above) { //above-check
          this.data[i][j] = 0;
        }
      });
    });
  }

  isTriangle() {
    let below = true;
    let above = true;

    return !this.data.some((row, i) => {
      return row.some((col, j) => {
        if (i > j && below) { //below-check
          below = (col != 0) ? false : true;
        }
        if (i < j && above) { //above-check
          above = (col != 0) ? false : true;
        }
        if (!above && !below)
          return true;
        else
          return false;
      });
    });
  }

  hasEmpty() {
    return (
      this.data.some(row => row.every(num => num == 0)) ||
      this.transpose().data.some(row => row.every(num => num == 0))
    );
  }

  determinant(iterations = 0) { //iterations are an Error-catch so that the function doesn't have too much recursion!
    if (this.cols != this.rows) { //check if it's quadratic
      throw WrongDim2;
    }

    if (iterations > 100) {
      console.log("Uhh..well..something went wrong...I guess?");
      return;
    }

    if (this.isTriangle()) { //Check if it is a triangle-matrix
      let result = 1;
      for (let i = 0; i < this.rows; i++) {
        result *= this.data[i][i];
      }
      return Math.round(result * 1000) / 1000;
    }

    if (this.hasEmpty()) { //Check if a row or collumn consists of zeroes.
      return 0;
    }

    if (this.cols === 2 && this.rows === 2) { //check if it's a 2x2 Matrix
      return this.data[0][0] * this.data[1][1] - this.data[1][0] * this.data[0][1];
    }

    if (this.cols === 3 && this.rows === 3) { //check if it's a 3x3 Matrix [Sarrus-rule]
      return this.data[0][0] * this.data[1][1] * this.data[2][2] +
        this.data[0][1] * this.data[1][2] * this.data[2][0] +
        this.data[0][2] * this.data[1][0] * this.data[2][1] -
        this.data[0][2] * this.data[1][1] * this.data[2][0] -
        this.data[0][0] * this.data[1][2] * this.data[2][1] -
        this.data[0][1] * this.data[1][0] * this.data[2][2];
    }

    //AvoLords aproach to a gauß elimination -> creating a trinagle Matrix [below]
    let M = this.copy();

    let start = 1;

    for (let j = 0; j < M.cols - 1; j++) {

      //-----Error Catch--------
      if (M.data[j][j] == 0) {
        let switchindex = j + 1;
        let M2 = M.copy();

        while (M.data[j][j] == 0) {
          if (switchindex > M.rows - 1)
            if (M.hasEmpty())
              return 0;
            else
              return "Determinant cannot be determined!";
          if (M.data[switchindex][j] != 0) {
            M.data[j] = M2.data[switchindex].map(x => -1 * x);
            M.data[switchindex] = M2.data[j].slice(0);
          }
          switchindex++;
        }
      }
      //------------------------

      for (let i = start; i < M.rows; i++) {
        let temp = M.data[j].slice(0);
        temp = temp.map(x => x * M.data[i][j] / M.data[j][j]);

        M.data[i] = M.data[i].map((x, z) => Math.round((x - temp[z]) * 1000000) / 1000000); //avoiding rounding errors (1.2e-103 != 0)

      }
      start++;
    }
    return M.determinant(iterations + 1);

  }

  solveLGS(iterations) {
    if (this.cols > this.rows + 1) { //check if it has too many variables to solve for
      throw WrongDim1;
    }

    if (iterations > 100) {
      console.log("Uhh..well..something went wrong...I guess?");
      return;
    }

    if (this.isTriangle()) { //Check if it is a triangle-matrix
      //add basic math pls

    }

    let zero_row_index = -1;
    if (b.data.some((row, i) => {
        if (row.every(num => num == 0)) {
          zero_row_index = i;
          return true
        } else
          return false
      })) { //Check if a row consists of zeroes.
      let M = this.copy();
      M.rows--;
      M.data.splice(zero_row_index, 1);
      return M.solveLGS();
    }

    let zero_col_index = -1;
    if (b.transpose().data.some((row, i) => {
        if (row.every(num => num == 0)) {
          zero_col_index = i;
          return true
        } else
          return false
      })) { //Check if a row consists of zeroes.
      let M = this.transpose();
      M.rows--;
      M.data.splice(zero_col_index,1);
      return M.transpose().solveLGS();
    }

    //AvoLords aproach to a gauß elimination -> creating a trinagle Matrix [below]
    let M = this.copy();
    let start = 1;
    for (let j = 0; j < M.cols - 1; j++) {

      //-----Error Catch--------
      if (M.data[j][j] == 0) {
        let switchindex = j + 1;
        let M2 = M.copy();

        while (M.data[j][j] == 0) {
          if (switchindex > M.rows - 1)
            if (M.hasEmpty())
              return "I dont know!";
          if (M.data[switchindex][j] != 0) {
            M.data[j] = M2.data[switchindex].map(x => -1 * x);
            M.data[switchindex] = M2.data[j].slice(0);
          }
          switchindex++;
        }
      }
      //------------------------

      for (let i = start; i < M.rows; i++) {
        let temp = M.data[j].slice(0);
        temp = temp.map(x => x * M.data[i][j] / M.data[j][j]);

        M.data[i] = M.data[i].map((x, z) => Math.round((x - temp[z]) * 1000000) / 1000000); //avoiding rounding errors (1.2e-103 != 0)

      }
      start++;
    }
    return M.solveLGS(iterations + 1);

  }

}
