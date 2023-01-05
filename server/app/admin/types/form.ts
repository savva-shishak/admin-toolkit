export type Input = {
  el: 'input',
  name: string,
  type: 'str' | 'num',
  label: string
};

export type Button = {
  el: 'btn',
  text: string,
}

export type Element = Input | Block;

export type Block = {
  el: 'block',
  direction?: 'vertical' | 'horizontal',
  gutter?: number,
  wrap?: boolean,
  align: 'start' | 'end' | 'center' | 'baseline',
  content: Element[]
};

