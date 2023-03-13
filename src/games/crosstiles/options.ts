export type GameOptions = {
    timeToMakeGrid: number;
    makeGridCountdown: number;
    rackSize: number;
    minVowels: number;
    minConsonants: number;
    minBonusLetters: number;
    checkSpelling: boolean;
    checkGridBeforeRecoding: boolean,
    playersGetSameLetters: boolean;
};

export const defaultOptions: GameOptions = {
    timeToMakeGrid: 60,
    makeGridCountdown: 5,
    rackSize: 8,
    minVowels: 2,
    minConsonants: 4,
    minBonusLetters: 0,
    checkSpelling: true,
    checkGridBeforeRecoding: true,
    playersGetSameLetters: true,
}; 

interface BaseOptionDefinition {
    optionName: string;
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

/*
        <SetNumericOption
            label="Time to make grid"
            optionName="timeToMakeGrid"

            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Make grid countdown"
            optionName="makeGridCountdown"

            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Rack size"
            optionName="rackSize"
            min={6}
            max={8}
            
            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Min vowels"
            optionName="minVowels"
            min={0}
            max={2}
            
            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Min consonsants"
            optionName="minConsonants"
            min={0}
            max={4}
            
            options={options}
            setOptions={setOptions}
        />

        <SetNumericOption
            label="Min bonus letters"
            optionName="minBonusLetters"
            min={0}
            max={2}
            
            options={options}
            setOptions={setOptions}
        />

        <SetBooleanOption
            label="Players get same letters"
            optionName="playersGetSameLetters"

            options={options}
            setOptions={setOptions}
        />

        <SetBooleanOption
            label="Warn when recording non-scoring grid"
            optionName="checkGridBeforeRecoding"

            options={options}
            setOptions={setOptions}
        />

        <SetBooleanOption
            label="Suppress spelling checks (debug)"
            optionName="checkSpelling"

            options={options}
            setOptions={setOptions}
        />
*/