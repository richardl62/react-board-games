interface BaseOptionDefinition {
    label: string;
}

interface BooleanOptionDefinition extends BaseOptionDefinition {   
    default: boolean; 
}

interface NumericOptionDefinition extends BaseOptionDefinition {   
    default: number; 
    min?: number;
    max?: number;
}

export type OptionDefinition = BooleanOptionDefinition | NumericOptionDefinition;
