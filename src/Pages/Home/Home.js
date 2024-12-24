import { View, Text } from 'react-native'
import React from 'react'
import { clearAll } from '../../utils/Storage'
import { useDispatch } from 'react-redux'
import { checkuserToken } from '../../redux/actions/auth'

const Home = () => {

    const Dispatch = useDispatch()
    return (
        <View
            style={{
                flex: 1,
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white'



            }}
        >
            <Text
                onPress={() => {
                    clearAll()
                    Dispatch(checkuserToken())
                }}
            >Home</Text>
        </View>
    )
}

export default Home