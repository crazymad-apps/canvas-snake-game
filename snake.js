class Game {
  constructor(options) {
    this.row = options.row ?? 30;
    this.col = options.col ?? 30;
    this.width = options.width ?? this.col * 40;
    this.height = options.height ?? this.row * 40;
    this.duration = options.duration ?? 200;

    this.canvas = options.canvas;
    this.context = this.canvas.getContext("2d");

    this.init();
    // this.render();

    setInterval(() => {
      this.render();
    }, this.duration);
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style = `width: ${this.width / 2}px; height: ${
      this.height / 2
    }px`;
    this.snake = [[Math.floor(this.col / 2), Math.floor(this.row / 2)]];
    this.direction = 0; // 0->left, 1->right, 2->top, 3->bottom
    this.status = "READY"; // READY | PLAYING | PAUSE | GAMEOVER
    this.grid = new Array();
    this.grid[this.snake[0][1] * this.col + this.snake[0][0]] = 1;

    document.addEventListener("keydown", (e) => {
      this.direction =
        {
          a: 0,
          d: 1,
          w: 2,
          s: 3,
        }[e.key.toLocaleLowerCase()] ?? this.direction;
    });

    this.createApple();
  }

  render() {
    this.context.clearRect(0, 0, this.width, this.height);

    this.renderGrid();
    this.renderApple();
    this.renderSnake();
    this.tick();
  }

  renderGrid() {
    const { context, width, height, col, row } = this;
    const cellWidth = width / col;
    const cellHeight = height / row;
    context.strokeStyle = "#999";

    for (let ii = 0; ii <= row; ii++) {
      context.beginPath();
      context.moveTo(0, cellHeight * ii);
      context.lineTo(width, cellHeight * ii);
      context.stroke();
      context.closePath();
    }
    for (let ii = 0; ii <= col; ii++) {
      context.beginPath();
      context.moveTo(cellWidth * ii, 0);
      context.lineTo(cellWidth * ii, height);
      context.stroke();
      context.closePath();
    }
  }

  renderApple() {
    const { context, width, height, col, row } = this;
    const cellWidth = width / col;
    const cellHeight = height / row;
    const [x, y] = this.apple;

    context.beginPath();
    context.rect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
  }

  renderSnake() {
    const { context, width, height, col, row } = this;
    const cellWidth = width / col;
    const cellHeight = height / row;

    for (const [x, y] of this.snake) {
      context.beginPath();
      context.rect(cellWidth * x, cellHeight * y, cellWidth, cellHeight);
      context.fillStyle = "black";
      context.fill();
      context.closePath();
    }
  }

  createApple() {
    const { col, row } = this;
    while (true) {
      const x = Math.floor(Math.random() * col);
      const y = Math.floor(Math.random() * row);
      if (this.grid[x * col + y]) {
        continue;
      } else {
        this.apple = [x, y];
        break;
      }
    }
  }

  tick() {
    let [x, y] = this.snake[0];

    if (this.direction === 0 && this.direction !== 1) x -= 1;
    if (this.direction === 1 && this.direction !== 0) x += 1;
    if (this.direction === 2 && this.direction !== 3) y -= 1;
    if (this.direction === 3 && this.direction !== 2) y += 1;

    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      this.status = "GAMEOVER";
      return;
    }

    if (this.apple[0] === x && this.apple[1] === y) {
      this.createApple();
    } else {
      this.snake.pop();
    }
    this.snake.unshift([x, y]);
  }

  reset() {
    this.snake = [[Math.floor(this.col / 2), Math.floor(this.row / 2)]];
    this.direction = 0;
    this.createApple();
  }
}
