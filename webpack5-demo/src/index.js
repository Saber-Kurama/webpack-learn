import _ from "lodash";
// import printMe from './print.js';
// import Icon from './icon.jpg';
// import './style.css';
// import exampleText from './1.txt'

function component() {
  const element = document.createElement("div");
  // const btn = document.createElement('button');

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(["Hello", "webpack"], " ");
  // element.classList.add('hello');
  // // 将图像添加到我们已经存在的 div 中。
  // const myIcon = new Image();
  // myIcon.src = Icon;

  // element.appendChild(myIcon);
  // btn.innerHTML = 'Click me and check the console!';
  // btn.onclick = printMe;
  // element.appendChild(btn);
  // element.textContent = exampleText;
  return element;
}

document.body.appendChild(component());
