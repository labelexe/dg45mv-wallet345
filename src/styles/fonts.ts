
export type FontWeightType = 'regular' | 'bold' | 'light';

export type FontWeightMap = {
  [Key in FontWeightType as string]: string
};

export const DefaultFont: FontWeightMap = {
  light: 'Lato-Light',
  regular: 'Lato-Regular',
  bold: 'Lato-Bold',
};
