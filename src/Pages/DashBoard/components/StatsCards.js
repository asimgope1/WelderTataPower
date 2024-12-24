import React, { memo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT, WIDTH } from '../../../constants/config';
import { BLACK, WHITE } from '../../../constants/color';
import { BOLD, REGULAR } from '../../../constants/fontfamily';

const getRandomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `#${randomColor}`;
};

const StatsCards = memo(({ data }) => {
    if (!data) return null;

    return (
        <View style={styles.statsContainer}>
            <FlatList
                data={data.status_count}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{
                        ...styles.statsCard,
                        borderTopColor: getRandomColor(),
                        borderTopWidth: 8,
                    }}>
                        <Text
                            style={styles.statsName}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {item.name}
                        </Text>
                        <Text style={styles.statsFigure}>{item.count}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />
        </View>
    );
});

const styles = {
    statsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-around',
    },
    statsCard: {
        backgroundColor: WHITE,
        height: HEIGHT * 0.1,
        borderWidth: 1,
        borderRadius: 10,
        margin: 8,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        width: WIDTH * 0.2,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
    },
    statsName: {
        fontSize: RFValue(8),
        color: BLACK,
        fontWeight: '600'
    },
    statsFigure: {
        fontSize: RFValue(15),
        color: BLACK,
        fontFamily: BOLD,
        marginVertical: 5,
    },
};

export default StatsCards;
