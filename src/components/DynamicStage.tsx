
import React from 'react';
import { Stage } from './Stage';
import { CharId } from '../types';

interface DynamicStageProps {
    leftCharacter: CharId;
    rightCharacter: CharId;
    centerCharacter: CharId;
    activeSpeaker: CharId;
    leftEmotion: string;
    rightEmotion: string;
    centerEmotion: string;
}

export const DynamicStage: React.FC<DynamicStageProps> = ({
    leftCharacter,
    rightCharacter,
    centerCharacter,
    activeSpeaker,
    leftEmotion,
    rightEmotion,
    centerEmotion,
}) => {
    return (
        <Stage
            layout={{
                left: leftCharacter,
                center: centerCharacter,
                right: rightCharacter
            }}
            activeSpeaker={activeSpeaker}
            emotions={{
                left: leftEmotion,
                center: centerEmotion,
                right: rightEmotion
            }}
        />
    );
};
