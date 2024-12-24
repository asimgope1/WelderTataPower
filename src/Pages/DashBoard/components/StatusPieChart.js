import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { PieChart } from "react-native-chart-kit";
import { HEIGHT, WIDTH } from '../../../constants/config';
import { BRAND, WHITE } from '../../../constants/color';
import { BOLD } from '../../../constants/fontfamily';
import { RFValue } from 'react-native-responsive-fontsize';

const sliceColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF9633',
    '#8A33FF', '#33FFF6', '#FFD633', '#33FFB8', '#FF3333',
];

const StatusPieChart = memo(({ data }) => {
    if (!data?.status_count) return null;

    const pieData = data.status_count.map((status, index) => ({
        value: status.count,
        label: status.name,
        color: sliceColors[index % sliceColors.length],
    }));

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Job Status Overview</Text>
            </View>
            <View style={styles.chartWrapper}>
                <PieChart
                    data={pieData}
                    width={WIDTH}
                    height={220}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    }}
                    accessor="value"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    center={[10, 50]}
                    absolute
                />
            </View>
        </View>
    );
});

const styles = {
    container: {
        marginTop: 20,
        width: WIDTH,
        alignItems: 'center',
    },
    titleContainer: {
        height: HEIGHT * 0.05,
        width: WIDTH,
        backgroundColor: BRAND,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10
    },
    title: {
        fontSize: RFValue(18),
        color: WHITE,
        fontFamily: BOLD,
        textAlign: 'center',
    },
    chartWrapper: {
        width: WIDTH * 0.9,
        alignSelf: 'center',
        alignItems: 'center',
    }
};

export default StatusPieChart;
