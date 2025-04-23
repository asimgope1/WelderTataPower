import React from "react";
import { View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";

const DATA = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  highTmp: 40 + 30 * Math.random(),
}));

export default function MyChart() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <VictoryChart
        theme={VictoryTheme.material}
        containerComponent={<VictoryVoronoiContainer />}
      >
        <VictoryAxis
          label="Day"
          style={{
            axisLabel: { padding: 30 },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="Temperature"
          style={{
            axisLabel: { padding: 40 },
          }}
        />
        <VictoryLine
          data={DATA}
          x="day"
          y="highTmp"
          style={{
            data: { stroke: "tomato", strokeWidth: 3 },
          }}
          labels={({ datum }) => `${Math.round(datum.highTmp)}°C`}
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </View>
  );
}
