import { View } from "react-native";
import type { Direction } from "../../types";
import { ArrowButton } from "../ArrowButton";
import { styles } from "./styles";
import React, { PropsWithChildren } from "react";
import { ArrowButtonName } from "../ArrowButton/ArrowButton";
import { ARROW_TO_DIRECTION } from "../../constants";

type ArrowControlsProps = {
  onMove: (direction: Direction) => void;
};

const ARROWS: ArrowButtonName[][] = [
  ["chevron-up"],
  ["chevron-back", "chevron-down", "chevron-forward"]
];

const HorizontalControls = ({ children }: PropsWithChildren) => (
  <View style={styles.horizontalControls}>{children}</View>
);

export function ArrowControls({ onMove }: ArrowControlsProps) {
  return (
    <View style={styles.controls}>
      {ARROWS.map((controlsRow, rowIndex) => {
        const Wrapper = rowIndex > 0 ? HorizontalControls : React.Fragment;
        return (
          <Wrapper key={`row-${rowIndex}`}>
            {controlsRow.map((arrow) => (
              <ArrowButton
                key={arrow}
                name={arrow}
                onPress={() => onMove(ARROW_TO_DIRECTION[arrow]!)}
              />
            ))}
          </Wrapper>
        );
      })}
    </View>
  );
}
