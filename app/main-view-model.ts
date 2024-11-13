import { Observable } from '@nativescript/core';

export class HelloWorldModel extends Observable {
  private _counter: number;
  private _message: string;

  constructor() {
    super();
    this._counter = 5; // Reduced from 42 to 5 for quicker testing
    this.updateMessage();
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    if (this._message !== value) {
      this._message = value;
      this.notifyPropertyChange('message', value);
    }
  }

  onTap() {
    this._counter--;
    this.updateMessage();
  }

  private updateMessage() {
    if (this._counter <= 0) {
      this.message = 'Hoorraaay! You unlocked the NativeScript clicker achievement!';
    } else {
      this.message = `${this._counter} taps left`;
    }
    console.log(this.message);
  }
}