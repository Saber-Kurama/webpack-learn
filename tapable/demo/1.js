// const Hook  = require('tapable/lib/Hook');
const { SyncHook } = require('tapable');

// class SyncHook {
//   constructor(args = [], name = undefined) {
//     this._args = args;
//     this.name = name;
//     this.taps = [];
//   }
//   _tap(type, options, fn) {
//     if (typeof options === "string") {
//         options = {
//             name: options.trim()
//         };
//     } else if (typeof options !== "object" || options === null) {
//         throw new Error("Invalid tap options");
//     }
//     if (typeof options.name !== "string" || options.name === "") {
//         throw new Error("Missing name for tap");
//     }
//     if (typeof options.context !== "undefined") {
//         deprecateContext();
//     }
//     options = Object.assign({ type, fn }, options);
//     // options = this._runRegisterInterceptors(options);
//     // this._insert(options);
//   }
//   tap(options, fn) {
//     this._tap("sync", options, fn);
//   }
//   call(...args) {
//     this.taps.forEach((task) => task(...args));
//   }
// }

// const hooks = new SyncHook();

class Car {
  constructor() {
    this.hooks = {
      brake: new SyncHook(),
    };
  }
}

const myCar = new Car();
myCar.hooks.brake.tap("name1", (arg) => {
  console.log("???--->name1", arg);
});
// myCar.hooks.brake.call()
myCar.hooks.brake.tap("name1", () => {
  console.log("???--->name2");
});
myCar.hooks.brake.call("测试");
