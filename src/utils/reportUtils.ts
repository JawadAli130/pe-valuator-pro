import { qualitativeFactorOptions } from '../types/report';

export function getFactorLabel(name: string): string {
  const option = qualitativeFactorOptions.find(opt => opt.name === name);
  return option ? option.label : name;
}
