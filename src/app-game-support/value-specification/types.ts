interface BooleanValueSpecification  {   
    default: boolean;
    label: string; 
}

interface NumericValueSpecification {   
    default: number;
    label: string; 
    min?: number;
    max?: number;
}

export type ValueSpecifications = {[arg:string]: BooleanValueSpecification | NumericValueSpecification};
export type Values = {[arg:string]: boolean | number};
