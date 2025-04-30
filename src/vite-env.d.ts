/// <reference types="vite/client" />

// 为Arco Design组件声明模块
declare module '@arco-design/web-vue' {
  const content: any;
  export default content;
}

declare module '@arco-design/web-vue/es/icon' {
  const content: any;
  export default content;
}

declare module '@arco-design/web-vue/*' {
  const content: any;
  export default content;
}
