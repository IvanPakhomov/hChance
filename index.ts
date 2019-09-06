interface ChanceInterface {
  value: number,
  cb: CallableFunction
}

export class Chance {
  private _total: number;
  private _values: Array<ChanceInterface> = [];
  private _else: CallableFunction = null;
  private _mode: string;

  constructor(total: number = 0) {
    this.async();

    if (total <= 0) {
      return;
    } else if (total < 1) {
      total *= 100;
    }

    this._total = total;
  }

  sync() {
    this._mode = 'sync';

    return this;
  }

  async() {
    this._mode = 'async';
    
    return this;
  }

  on(value: number, cb: CallableFunction): Chance {
    if (value <= 0) {
      return this;
    } else if (value < 1) {
      value *= 100;
    }

    this._values.push({value, cb} as ChanceInterface);

    return this;
  }

  else(cb: CallableFunction): Chance {
    this._else = cb;

    return this;
  }

  async compute(): Promise<any> {
    let max = this._values.map(object => {
      return object.value;
    }).reduce((value1, value2) => {
      return value1 + value2;
    });

    if (this._total > max && !!this._else) {
      max = this._total;
    }

    let sorted = this._values.sort((object1, object2) => {
      return (object1.value > object2.value) ? -1 : 1;
    });

    let rand = Math.ceil(Math.random() * max);
    let prev = 0;

    for (let i = 0; i < sorted.length; i++) {
      if (rand <= sorted[i].value + prev) {
        if (this._mode == 'async') {
          return await sorted[i].cb ? sorted[i].cb() : sorted[i].cb;
        }
        
        return sorted[i].cb ? sorted[i].cb() : sorted[i].cb;
      }

      prev += sorted[i].value;
    }

    if (this._mode == 'async') {
      return await this._else ? this._else() : this._else;
    }

    return this._else ? this._else() : this._else;
  }
}