interface BaseValueSpecification {
    label: string;
}

interface BooleanValueSpecification extends BaseValueSpecification {   
    default: boolean; 
}

interface NumericValueSpecification extends BaseValueSpecification {   
    default: number; 
    min?: number;
    max?: number;
}

export type ValueSpecifications = {[arg:string]: BooleanValueSpecification | NumericValueSpecification};
export type Values = {[arg:string]: boolean | number};
