import { View, Text, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native'
import React, { Fragment } from 'react'
import { BRAND, RED } from '../../constants/color'
import Header from '../../components/Header'
import { MyStatusBar } from '../../constants/config'
import { appStyles } from '../../styles/AppStyles'

const Registration = ({ navigation }) => {
    return (
        <Fragment>
            <MyStatusBar backgroundColor={BRAND} barStyle={'light-content'} />
            <SafeAreaView style={appStyles.safeareacontainer}>
                {/* <Loader visible={loader} /> */}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}>

                    <ScrollView
                        keyboardShouldPersistTaps={'handled'}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            flexGrow: 1,
                            alignItems: 'center',
                            paddingBottom: 20, // Adjust padding bottom to ensure space for scrolling
                        }}>


                        <>
                            <Header
                                onMenuPress={() => {
                                    navigation.toggleDrawer()
                                    console.log('navigation', navigation)
                                }}
                                title="Registration"
                            />
                        </>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Fragment>

    )
}

export default Registration