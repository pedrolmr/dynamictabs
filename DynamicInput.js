import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Container, Button, Tabs, Tab, Input } from 'native-base';

const DynamicInput = (props) => {
    return(
        <Tab heading={props.heading}>
            <Input
                placeholder={props.placeholder}
                style={props.style}
                value={props.value}
                onChangeText={props.onChangeText}
            />
        </Tab>
    )
}
export default DynamicInput; 