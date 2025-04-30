// 为Arco Design组件声明模块
declare module '@arco-design/web-vue' {
  const component: any;
  export default component;
  export const Message: any;
  export const Button: any;
  export const Input: any;
  export const Modal: any;
  export const Form: any;
  export const Table: any;
}

declare module '@arco-design/web-vue/es/icon' {
  const component: any;
  export default component;
  export const IconUser: any;
  export const IconCheck: any;
  export const IconClose: any;
  export const IconEdit: any;
  export const IconDelete: any;
  export const IconPlus: any;
  export const IconDragDotVertical: any;
  // 添加其他所需图标
}

declare module '@arco-design/web-vue/*' {
  const component: any;
  export default component;
} 